'use strict';

module.exports = {
    name: 'lowercase',
    aliases: [],
    description: 'Convert text to lowercase',
    category: 'utility',

    async execute(sock, msg, args) {
        const chatId = msg.key.remoteJid;
        const text = args.join(' ').trim();

        if (!text) {
            return sock.sendMessage(chatId, {
                text: '❌ Please provide some text.'
            }, { quoted: msg });
        }

        await sock.sendMessage(chatId, {
            text: text.toLowerCase()
        }, { quoted: msg });
    }
};
