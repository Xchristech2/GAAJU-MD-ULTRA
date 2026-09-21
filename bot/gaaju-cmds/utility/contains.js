'use strict';

module.exports = {
    name: 'contains',
    aliases: [],
    description: 'Check if text contains something',
    category: 'utility',

    async execute(sock, msg, args) {
        const chatId = msg.key.remoteJid;

        if (args.length < 2) {
            return sock.sendMessage(chatId, {
                text: '❌ Usage: .contains <word> <text>\n\nExample: .contains love I love coding'
            }, { quoted: msg });
        }

        const word = args[0];
        const text = args.slice(1).join(' ');

        await sock.sendMessage(chatId, {
            text: text.toLowerCase().includes(word.toLowerCase())
                ? '✅ Yes, the text contains it.'
                : '❌ No, the text does not contain it.'
        }, { quoted: msg });
    }
};
