'use strict';

module.exports = {
    name: 'removeemoji',
    aliases: ['noemoji', 'deemoji'],
    description: 'Remove emojis from text',
    category: 'utility',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;

        if (!args.length) {
            return sock.sendMessage(chatId, {
                text: `❌ Usage: ${prefix}removeemoji [text]`
            }, { quoted: msg });
        }

        const text = args.join(' ');

        const result = text
            .replace(/[\p{Extended_Pictographic}\uFE0F]/gu, '')
            .replace(/\s+/g, ' ')
            .trim();

        await sock.sendMessage(chatId, {
            text: `🚫 *REMOVE EMOJI*\n\n${result || '(empty)'}`
        }, { quoted: msg });
    }
};
