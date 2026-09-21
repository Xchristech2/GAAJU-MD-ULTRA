'use strict';

module.exports = {
    name: 'startswith',
    aliases: [],
    description: 'Check if text starts with something',
    category: 'utility',

    async execute(sock, msg, args) {
        const chatId = msg.key.remoteJid;

        if (args.length < 2) {
            return sock.sendMessage(chatId, {
                text: '❌ Usage: .startswith <text> <prefix>\n\nExample: .startswith Hello He'
            }, { quoted: msg });
        }

        const prefix = args[args.length - 1];
        const text = args.slice(0, -1).join(' ');

        await sock.sendMessage(chatId, {
            text: text.startsWith(prefix) ? '✅ Yes, it starts with that.' : '❌ No, it does not start with that.'
        }, { quoted: msg });
    }
};
