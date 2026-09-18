'use strict';

module.exports = {
    name: 'isprime',
    aliases: ['prime', 'checkprime'],
    description: 'Check whether a number is prime',
    category: 'utility',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;

        if (!args.length) {
            return sock.sendMessage(chatId, {
                text: `❌ Usage: ${prefix}isprime [number]\n\nExample: ${prefix}isprime 17`
            }, { quoted: msg });
        }

        const number = Number(args[0]);

        if (!Number.isSafeInteger(number) || number < 0) {
            return sock.sendMessage(chatId, {
                text: `❌ Please enter a valid non-negative whole number.`
            }, { quoted: msg });
        }

        let prime = number >= 2;

        if (prime) {
            for (let i = 2; i <= Math.sqrt(number); i++) {
                if (number % i === 0) {
                    prime = false;
                    break;
                }
            }
        }

        await sock.sendMessage(chatId, {
            text: `🔢 *PRIME CHECK*\n\n┃⎈ Number: *${number}*\n┃⎈ Result: *${prime ? 'Prime' : 'Not Prime'}*`
        }, { quoted: msg });
    }
};
