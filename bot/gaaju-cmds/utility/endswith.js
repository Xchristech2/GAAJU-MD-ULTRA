'use strict';

module.exports = {
    name: 'endswith',
    aliases: [],
    description: 'Check if text ends with something',
    category: 'utility',

    async execute(sock, msg, args) {
        const chatId = msg.key.remoteJid;

        if (args.length < 2) {
            return sock.sendMessage(chatId, {
                text: '❌ Usage: .endswith <text> <suffix>\n\nExample: .endswith Hello lo'
            }, { quoted: msg });
        }

        const suffix = args[args.length - 1];
        const text = args.slice(0, -1).join(' ');

        await sock.sendMessage(chatId, {
            text: text.endsWith(suffix) ? '✅ Yes, it ends with that.' : '❌ No, it does not end with that.'
        }, { quoted: msg });
    }
};
