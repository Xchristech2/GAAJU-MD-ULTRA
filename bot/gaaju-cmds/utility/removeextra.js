'use strict';

module.exports = {
    name: 'removeextra',
    aliases: ['removeextraspace', 'cleanextra'],
    description: 'Remove extra spaces and blank lines',
    category: 'utility',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;

        if (!args.length) {
            return sock.sendMessage(chatId, {
                text: `❌ Usage: ${prefix}removeextra [text]`
            }, { quoted: msg });
        }

        const text = args.join(' ');

        const result = text
            .replace(/[ \t]+/g, ' ')
            .replace(/\n\s*\n+/g, '\n')
            .trim();

        await sock.sendMessage(chatId, {
            text: `🧹 *REMOVE EXTRA*\n\n${result}`
        }, { quoted: msg });
    }
};
