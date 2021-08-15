const Discord = require('discord.js');
const { invite_link } = require('../config.json');
const e = require('../embeds.json');
const owner = require('../owner.json');

module.exports = {
    name: 'support',
    description: 'Gives support Discord link',
    cat: 'other',
    guild: false,
    alias: [],
    execute(message, args, client, prefix) {
        const invite = new Discord.MessageEmbed()
            .setColor('YELLOW')
            .setDescription(
                `:pleading_face: Join the [support server](https://discord.gg/eGjMvGSJqu) for support.`
            ).setFooter(`Bot by ${owner.tag}`, owner.avatarURL)

        if (message.guild) {
            message.author.send(invite).then(() => {
                message.react('👌');
            }).catch(() => {
                const embed = new Discord.MessageEmbed()
                    .setColor(e.red)
                    .setDescription(`${e.x} **Please enable DMs from server members.**`);
                message.channel.send(embed).then((newmsg) => {
                    newmsg.delete({ timeout: 10000 }).catch();
                });
            });
        } else {
            message.author.send(invite).catch();
        }
    },
};