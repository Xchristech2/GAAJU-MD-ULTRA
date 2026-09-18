'use strict';

module.exports = {
    name: 'fibonacci',
    aliases: ['fib', 'fibo'],
    description: 'Generate Fibonacci sequence',
    category: 'utility',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;

        if (!args.length) {
            return sock.sendMessage(chatId, {
                text: `❌ Usage: ${prefix}fibonacci [count]\n\nExample: ${prefix}fibonacci 10`
            }, { quoted: msg });
        }

        const count = Number(args[0]);

        if (!Number.isInteger(count) || count < 1 || count > 50) {
            return sock.sendMessage(chatId, {
                text: `❌ Count must be a whole number between 1 and 50.`
            }, { quoted: msg });
        }

        const sequence = [];
        let a = 0;
        let b = 1;

        for (let i = 0; i < count; i++) {
            sequence.push(a);
            [a, b] = [b, a + b];
        }

        await sock.sendMessage(chatId, {
            text: `🔢 *FIBONACCI*\n\n┃⎈ Count: *${count}*\n┃⎈ Sequence:\n${sequence.join(', ')}`
        }, { quoted: msg });
    }
};
