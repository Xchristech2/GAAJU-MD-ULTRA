'use strict';

module.exports = {
    name: 'length',
    aliases: [],
    description: 'Count characters in text',
    category: 'utility',

    async execute(sock, msg, args) {
        const chatId = msg.key.remoteJid;
        const text = args.join(' ').trim();

        if (!text) {
            return sock.sendMessage(chatId, {
                text: '❌ Please provide some text.\n\nExample: .length Hello bro'
            }, { quoted: msg });
        }

        await sock.sendMessage(chatId, {
            text: `🔢 Characters: ${text.length}`
        }, { quoted: msg });
    }
};
