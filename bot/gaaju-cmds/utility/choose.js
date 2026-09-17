'use strict';

module.exports = {
    name: 'choose',

    aliases: ['pick', 'choice'],

    description: 'Randomly choose one option',

    category: 'utility',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;

        if (!args.length) {
            return sock.sendMessage(
                chatId,
                {
                    text: `❌ Usage: ${prefix}choose option1 | option2 | option3`
                },
                { quoted: msg }
            );
        }

        const options = args
            .join(' ')
            .split('|')
            .map(option => option.trim())
            .filter(Boolean);

        if (options.length < 2) {
            return sock.sendMessage(
                chatId,
                {
                    text: `❌ Give me at least 2 options separated with |`
                },
                { quoted: msg }
            );
        }

        const chosen =
            options[Math.floor(Math.random() * options.length)];

        await sock.sendMessage(
            chatId,
            {
                text:
`🎯 *RANDOM CHOICE*

┃⎈ Options: ${options.length}
┃⎈ Chosen: *${chosen}*`
            },
            { quoted: msg }
        );
    }
};
