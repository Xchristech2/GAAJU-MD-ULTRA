'use strict';

module.exports = {
    name: 'reverse',
    aliases: [],
    description: 'Reverse text',
    category: 'utility',

    async execute(sock, msg, args) {
        const chatId = msg.key.remoteJid;
        const text = args.join(' ').trim();

        if (!text) {
            return sock.sendMessage(chatId, {
                text: '❌ Please provide some text.\n\nExample: .reverse Hello bro'
            }, { quoted: msg });
        }

        await sock.sendMessage(chatId, {
            text: text.split('').reverse().join('')
        }, { quoted: msg });
    }
};
