'use strict';

module.exports = {
    name: 'factorial',
    aliases: ['fact'],
    description: 'Calculate factorial of a number',
    category: 'utility',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;

        if (!args.length) {
            return sock.sendMessage(chatId, {
                text: `❌ Usage: ${prefix}factorial [number]\n\nExample: ${prefix}factorial 5`
            }, { quoted: msg });
        }

        const number = Number(args[0]);

        if (!Number.isInteger(number) || number < 0 || number > 170) {
            return sock.sendMessage(chatId, {
                text: `❌ Enter a whole number from 0 to 170.`
            }, { quoted: msg });
        }

        let result = 1;

        for (let i = 2; i <= number; i++) {
            result *= i;
        }

        await sock.sendMessage(chatId, {
            text: `🧮 *FACTORIAL*\n\n┃⎈ Number: *${number}*\n┃⎈ Result: *${result}*`
        }, { quoted: msg });
    }
};
