'use strict';

module.exports = {
    name: 'capitalize',
    aliases: ['cap', 'upperfirst'],
    description: 'Capitalize each word',
    category: 'utility',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;

        if (!args.length) {
            return sock.sendMessage(chatId, {
                text: `❌ Usage: ${prefix}capitalize [text]\n\nExample: ${prefix}capitalize hello world`
            }, { quoted: msg });
        }

        const text = args.join(' ').trim();

        const result = text.replace(/\b\w/g, char => char.toUpperCase());

        await sock.sendMessage(chatId, {
            text: `🔠 *CAPITALIZE*\n\n${result}`
        }, { quoted: msg });
    }
};
