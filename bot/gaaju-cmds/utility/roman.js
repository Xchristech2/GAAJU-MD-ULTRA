'use strict';

module.exports = {
    name: 'roman',
    aliases: ['toroman', 'romannum'],
    description: 'Convert a number to Roman numerals',
    category: 'utility',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;

        if (!args.length) {
            return sock.sendMessage(chatId, {
                text: `❌ Usage: ${prefix}roman [number]\n\nExample: ${prefix}roman 2026`
            }, { quoted: msg });
        }

        const number = Number(args[0]);

        if (!Number.isInteger(number) || number < 1 || number > 3999) {
            return sock.sendMessage(chatId, {
                text: `❌ Enter a whole number from 1 to 3999.`
            }, { quoted: msg });
        }

        const values = [
            [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
            [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
            [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
        ];

        let n = number;
        let result = '';

        for (const [value, symbol] of values) {
            while (n >= value) {
                result += symbol;
                n -= value;
            }
        }

        await sock.sendMessage(chatId, {
            text: `🏛️ *ROMAN NUMERAL*\n\n┃⎈ Number: *${number}*\n┃⎈ Roman: *${result}*`
        }, { quoted: msg });
    }
};
