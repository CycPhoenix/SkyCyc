const db = require('quick.db');
const e = require('../embeds.json');
const owner = require('../owner.json');
const { exec } = require('child_process');

const clean = text => {
    if (typeof(text) === 'string')
        return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
    else
        return text;
}

module.exports = {
    name: 'eval',
    description: '',
    cat: 'other',
    guild: false,
    alias: [],
    execute(message, args, client, prefix) {
        const restartShard = (id = client.shard.ids) => {
            client.shard.broadcastEval(`if (this.shard.ids.includes(${id})) process.exit();`).catch();
            return `Shard ${id} will now restart.`;
        }

        const run = (command) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    message.channel.send(`:x: ERROR! ${error.message}`);
                    return;
                }
                if (stderr) {
                    message.channel.send(`${stderr}`);
                    return;
                }
                message.channel.send(`${stdout}`);
            });
        }

        const saveBackup = () => {
            run(`git add *;git commit -m "Backup at ${new Date().toLocaleString()}";git push`);
        }

        if (message.author.id !== owner.id)
            return message.channel.send(':flushed:')
                .then(newmsg => {
                    newmsg.delete({ timeout: 4000 }).catch()
                }).catch();
        try {
            const code = args.join(' ');
            let evaled = eval(code);

            if (typeof evaled !== 'string')
                evaled = require('util').inspect(evaled);

            const output = clean(evaled);

            if (output == 'undefined' || output == undefined) return;
            message.channel.send(output, { code: 'xl' });
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }
    },
};