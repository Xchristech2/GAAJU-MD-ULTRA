'use strict';

module.exports = {
    name: 'say',
    aliases: ['speak', 'saytext'],
    description: 'Make the bot say a message',
    category: 'utility',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;

        if (!args.length) {
            return sock.sendMessage(
                chatId,
                {
                    text: `❌ Usage: ${prefix}say [text]\n\nExample: ${prefix}say Hello everyone`
                },
                { quoted: msg }
            );
        }

        const text = args.join(' ').trim();

        if (!text) {
            return sock.sendMessage(
                chatId,
                {
                    text: `❌ Please provide some text.`
                },
                { quoted: msg }
            );
        }

        await sock.sendMessage(
            chatId,
            {
                text: text
            },
            { quoted: msg }
        );
    }
};
