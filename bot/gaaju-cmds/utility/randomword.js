'use strict';

module.exports = {
    name: 'randomword',
    aliases: [],
    description: 'Pick a random word',
    category: 'utility',

    async execute(sock, msg, args) {
        const chatId = msg.key.remoteJid;

        if (!args.length) {
            return sock.sendMessage(chatId, {
                text: '❌ Provide some words.\n\nExample: .randomword rice beans yam'
            }, { quoted: msg });
        }

        const word = args[Math.floor(Math.random() * args.length)];

        await sock.sendMessage(chatId, {
            text: `🎲 ${word}`
        }, { quoted: msg });
    }
};
