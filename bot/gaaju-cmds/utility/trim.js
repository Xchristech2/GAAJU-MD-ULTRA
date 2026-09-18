'use strict';

module.exports = {
    name: 'trim',
    aliases: ['trimtext', 'cleantext'],
    description: 'Remove extra spaces from text',
    category: 'utility',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;

        if (!args.length) {
            return sock.sendMessage(chatId, {
                text: `❌ Usage: ${prefix}trim [text]`
            }, { quoted: msg });
        }

        const text = args.join(' ');

        const result = text
            .replace(/\s+/g, ' ')
            .trim();

        await sock.sendMessage(chatId, {
            text: `🧹 *TRIM TEXT*\n\n${result}`
        }, { quoted: msg });
    }
};
