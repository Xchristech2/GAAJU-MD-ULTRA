'use strict';

module.exports = {
    name: 'replace',
    aliases: [],
    description: 'Replace text',
    category: 'utility',

    async execute(sock, msg, args) {
        const chatId = msg.key.remoteJid;

        if (args.length < 3) {
            return sock.sendMessage(chatId, {
                text: '❌ Usage: .replace <old> <new> <text>\n\nExample: .replace hello hi hello bro'
            }, { quoted: msg });
        }

        const oldText = args[0];
        const newText = args[1];
        const text = args.slice(2).join(' ');

        const result = text.split(oldText).join(newText);

        await sock.sendMessage(chatId, {
            text: result
        }, { quoted: msg });
    }
};
