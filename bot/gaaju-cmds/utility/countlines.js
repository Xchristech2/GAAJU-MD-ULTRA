'use strict';

module.exports = {
    name: 'countlines',
    aliases: [],
    description: 'Count lines in text',
    category: 'utility',

    async execute(sock, msg, args) {
        const chatId = msg.key.remoteJid;
        const text = args.join(' ').trim();

        if (!text) {
            return sock.sendMessage(chatId, {
                text: '❌ Please provide text with lines.'
            }, { quoted: msg });
        }

        const count = text.split(/\r?\n/).length;

        await sock.sendMessage(chatId, {
            text: `📄 Lines: ${count}`
        }, { quoted: msg });
    }
};
