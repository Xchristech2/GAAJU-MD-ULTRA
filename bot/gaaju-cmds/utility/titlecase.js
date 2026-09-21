'use strict';

module.exports = {
    name: 'titlecase',
    aliases: [],
    description: 'Convert text to title case',
    category: 'utility',

    async execute(sock, msg, args) {
        const chatId = msg.key.remoteJid;
        const text = args.join(' ').trim();

        if (!text) {
            return sock.sendMessage(chatId, {
                text: '❌ Please provide some text.'
            }, { quoted: msg });
        }

        const result = text.replace(/\S+/g, word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        );

        await sock.sendMessage(chatId, {
            text: result
        }, { quoted: msg });
    }
};
