'use strict';

module.exports = {
    name: 'remove',
    aliases: [],
    description: 'Remove text',
    category: 'utility',

    async execute(sock, msg, args) {
        const chatId = msg.key.remoteJid;

        if (args.length < 2) {
            return sock.sendMessage(chatId, {
                text: '❌ Usage: .remove <text> <sentence>\n\nExample: .remove bro Hello bro'
            }, { quoted: msg });
        }

        const removeText = args[0];
        const text = args.slice(1).join(' ');

        const result = text.split(removeText).join('').replace(/\s{2,}/g, ' ').trim();

        await sock.sendMessage(chatId, {
            text: result
        }, { quoted: msg });
    }
};
