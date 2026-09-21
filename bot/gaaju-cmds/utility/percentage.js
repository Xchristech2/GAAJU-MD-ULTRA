'use strict';

module.exports = {
    name: 'percentage',
    aliases: [],
    description: 'Calculate percentage',
    category: 'utility',

    async execute(sock, msg, args) {
        const chatId = msg.key.remoteJid;

        if (args.length !== 2) {
            return sock.sendMessage(chatId, {
                text: '❌ Usage: .percentage <value> <total>\n\nExample: .percentage 20 100'
            }, { quoted: msg });
        }

        const value = Number(args[0]);
        const total = Number(args[1]);

        if (!Number.isFinite(value) || !Number.isFinite(total) || total === 0) {
            return sock.sendMessage(chatId, {
                text: '❌ Please provide valid numbers.'
            }, { quoted: msg });
        }

        const result = (value / total) * 100;

        await sock.sendMessage(chatId, {
            text: `📊 ${result}%`
        }, { quoted: msg });
    }
};
