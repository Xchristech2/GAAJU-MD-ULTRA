'use strict';

module.exports = {
    name: 'repeatword',
    aliases: [],
    description: 'Repeat a word',
    category: 'utility',

    async execute(sock, msg, args) {
        const chatId = msg.key.remoteJid;

        if (args.length < 2) {
            return sock.sendMessage(chatId, {
                text: '❌ Usage: .repeatword <word> <count>\n\nExample: .repeatword hello 5'
            }, { quoted: msg });
        }

        const count = Number(args[args.length - 1]);
        const word = args.slice(0, -1).join(' ');

        if (!Number.isInteger(count) || count < 1 || count > 50) {
            return sock.sendMessage(chatId, {
                text: '❌ Count must be between 1 and 50.'
            }, { quoted: msg });
        }

        await sock.sendMessage(chatId, {
            text: Array(count).fill(word).join(' ')
        }, { quoted: msg });
    }
};
