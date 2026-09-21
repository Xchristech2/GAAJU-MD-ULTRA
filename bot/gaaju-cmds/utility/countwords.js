'use strict';

module.exports = {
    name: 'countwords',
    aliases: [],
    description: 'Count words in text',
    category: 'utility',

    async execute(sock, msg, args) {
        const chatId = msg.key.remoteJid;
        const text = args.join(' ').trim();

        if (!text) {
            return sock.sendMessage(chatId, {
                text: '❌ Please provide some text.'
            }, { quoted: msg });
        }

        const count = text.split(/\s+/).length;

        await sock.sendMessage(chatId, {
            text: `🔢 Words: ${count}`
        }, { quoted: msg });
    }
};
