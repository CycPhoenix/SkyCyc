const Discord = require('discord.js');
const { invite_link } = require('../config.json');
const e = require('../embeds.json');
const owner = require('../owner.json');

module.exports = {
    name: 'invite',
    description: 'DMs you the bot\'s invite link',
    cat: 'other',
    guild: false,
    alias: ['inv'],
    execute(message, args, client, prefix) {
        const invite = new Discord.MessageEmbed()
            .setColor(e.default)
            .setDescription(
                `:pleading_face: **Bot Invite**\n` +
                `[Click here](https://discord.com/api/oauth2/authorize?client_id=800276258641543178&permissions=8&scope=bot) to invite me to your own server.\n\n`
            ).setFooter(`Bot by ${owner.tag}`, owner.avatarURL)

        if (message.guild) {
            message.author.send(invite).then(() => {
                return message.react('✅');
            }).catch(() => {
                const embed = new Discord.MessageEmbed()
                    .setColor(e.red)
                    .setDescription(`${e.x} **Please enable DMs from server members.**`);
                message.channel.send(embed).then(newMessage => {
                    newMessage.delete({
                        timeout: 10000
                    }).catch();
                });
            });
        } else
            message.author.send(invite).catch();
    },
};