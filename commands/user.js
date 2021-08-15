const db = require('quick.db');
const fetch = require('node-fetch');
const Discord = require('discord.js');
const e = require('../embeds.json');
const config = require('../config.json');

module.exports = {
    name: 'user',
    description: '📈 User stat websites',
    cat: 'settings',
    alias: ['link', 'hypixel', 'links', 'me'],
    guild: false,
    async execute(message, args, client, prefix) {
        message.channel.startTyping().catch();

        let userid;
        if (args.length === 0) {
            let saveduser = db.get(`users.${message.author.id}`);

            if (!saveduser) {
                message.channel.stopTyping();
                return message.channel.send(new Discord.MessageEmbed().setDescription(`${e.x}:sob: **Command error**\nYour Hypixel and Discord accounts weren't recently linked.\nUse the \`${prefix}verify\` command in a server to link them.\n\nIf you want to view another user, send \`${prefix}user [username]\``).setColor(e.red))
            }

            userid = saveduser;
        } else userid = args[0]

        let req = await fetch('https://playerdb.co/api/player/minecraft/' + userid)
        req = await req.json();

        if (req.error) {
            message.channel.stopTyping();
            return message.channel.send(new Discord.MessageEmbed().setDescription(`${e.x} **Player not found**\n If you think this is a mistake, contact \`CycPhoenix#0403\`.`).setColor(e.red))
        }

        let hypixelstats = await fetch(`https://api.slothpixel.me/api/players/${userid}?key=${config.hypixel_key}`)
        hypixelstats = await hypixelstats.json();

        let socialmedia = hypixelstats.links;
        let socialmediastr = '';

        console.log(socialmedia);

        if (socialmedia) {
            if (socialmedia.YOUTUBE) {
                socialmediastr += `<:youtube:876310139064447038> **[YouTube](${socialmedia.YOUTUBE})**\n`
            }
            if (socialmedia.DISCORD) {
                if (socialmedia.DISCORD.indexOf('#') > -1) {
                    socialmediastr += `<:discord:876309692329103411> **[Discord](${socialmedia.DISCORD})**\n`
                } else {
                    socialmediastr += `<:discord:876309692329103411> **Discord:** ${socialmedia.DISCORD}\n`
                }
            }
            if (socialmedia.TWITTER) {
                if (socialmedia.TWITTER.indexOf('http') > -1) {
                    socialmediastr += `<:twitter:876309317198962728> **[Twitter](${socialmedia.TWITTER})**\n`
                } else {
                    socialmediastr += `<:twitter:876309317198962728> **Twitter:** ${socialmedia.TWITTER}\n`
                }
            }
            if (socialmedia.TWITCH) {
                if (socialmedia.TWITCH.indexOf('http') > -1) {
                    socialmediastr += `<:twitch:826621196027428865> **[Twitch](${socialmedia.TWITCH})**\n`
                } else {
                    socialmediastr += `<:twitch:826621196027428865> **Twitch:** ${socialmedia.TWITCH}\n`
                }
            }
            if (socialmedia.INSTAGRAM) {
                if (socialmedia.INSTAGRAM.indexOf('http') > -1) {
                    socialmediastr += `<:instagram:826621148854878239> **[Instagram](${socialmedia.INSTAGRAM})**\n`
                } else {
                    socialmediastr += `<:instagram:826621148854878239> **Instagram:** ${socialmedia.INSTAGRAM}\n`
                }
            }
            if (socialmedia.HYPIXEL) {
                socialmediastr += `<:hypixel_logo:876303946703061042> **[Forums](${socialmedia.HYPIXEL})**\n`
            }
        }

        let names = [];
        let name_history = req.data.player.meta.name_history;
        name_history.forEach(entry => {
            names.push(entry);
        })

        names.reverse();
        if (names.length === 1) names.shift();
        names = names.slice(0, 5);

        let { username, id, raw_id, avatar } = req.data.player;

        let namemc = `https://namemc.com/${raw_id}`;
        let plancke = `https://plancke.io/hypixel/player/stats/${raw_id}`;
        let karma25 = `https://25karma.xyz/#player/${raw_id}`;

        let hystats = `https://hystats.net/player/${id}`;
        let quests = `https://notifly.zone/quests/${username}`;
        let ap = `https://notifly.zone/achievements/${username}`;

        let buildbattle = `https://monochrontools.com/player/stats/${username}`;
        let murdermystery = `https://developer64.com/project/mm-stats-view?ign=${username}`;
        let skyblock = `https://sky.shiiyu.moe/stats/${id}`;
        let thepit = `https://pitpanda.rocks/players/${raw_id}`;

        const embed = new Discord.MessageEmbed()
            .setTitle(`✨ ${username} Overview`)
            .setColor('#FFCE63')
            .setThumbnail(avatar + '?hour=' + new Date().getHours() + '&overlay=true')
            .setFooter(`UUID: ${id}`);

        if (names.length > 0) {
            let namestr = '';
            names.forEach(entry => {
                let formname = entry.name.replace(/\_/g, '\\_');

                if (entry.changedToAt == null) {
                    return namestr += `**${formname}** | Original username`
                }

                let date = new Date(entry.changedToAt);
                namestr += `**${formname}** | ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}\n`;
            })

            embed.addField(
                '<:namehistory:876307517154668664> __Recent Name History__',
                `${namestr}`
            )
        }

        if (socialmedia) {
            embed
                .addField('⚙ __General__',
                    `<:namemc:876307566441938964> [NameMC](${namemc})\n` +
                    `<:plancke:876307538784714802> [Plancke](${plancke})\n` +
                    `<:25karma:876307426511577158> [25Karma](${karma25})`,
                    true
                )
                .addField('📶 __Network__',
                    `<:hystats:876307485454139394> [Hystats](${hystats})\n` +
                    `📜 [Quests](${quests})\n` +
                    `✨ [AP](${ap})`,
                    true
                )
                .addField('🎮 __Game Specific__',
                    `<:build_battle:876307621395726386> [Build Battle](${buildbattle})\n` +
                    `<:murder_mystery:876307668132847656> [Murder Mystery](${murdermystery})\n` +
                    `<:skyblock:876307717856317491> [Skyblock](${skyblock})\n` +
                    `<:the_pit:876307754887831573> [The Pit](${thepit})`,
                    true
                )
        } else {
            embed.setDescription(`:x: **This user has never logged into Hypixel.**\n\n<:namemc:810626872990892083> [NameMC](${namemc})`)
        }

        if (socialmediastr) {
            embed.addField('📎 __Linked accounts__',
                `${socialmediastr}`,
                true
            )
        }

        message.channel.stopTyping();
        return message.channel.send(embed);
    },
};