'use strict';

module.exports = {
    name: 'average',
    aliases: [],
    description: 'Calculate average',
    category: 'utility',

    async execute(sock, msg, args) {
        const chatId = msg.key.remoteJid;

        if (!args.length) {
            return sock.sendMessage(chatId, {
                text: '❌ Provide numbers.\n\nExample: .average 10 20 30'
            }, { quoted: msg });
        }

        const numbers = args.map(Number);

        if (numbers.some(n => !Number.isFinite(n))) {
            return sock.sendMessage(chatId, {
                text: '❌ All values must be valid numbers.'
            }, { quoted: msg });
        }

        const result = numbers.reduce((a, b) => a + b, 0) / numbers.length;

        await sock.sendMessage(chatId, {
            text: `📊 Average: ${result}`
        }, { quoted: msg });
    }
};
