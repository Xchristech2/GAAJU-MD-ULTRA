'use strict';

module.exports = {
    name: 'randomnumber',

    aliases: ['randnum', 'randomnum'],

    description: 'Generate a random number',

    category: 'utility',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;

        let min = 1;
        let max = 100;

        if (args.length === 1) {
            max = Number(args[0]);

            if (!Number.isFinite(max) || max < 1) {
                return sock.sendMessage(
                    chatId,
                    {
                        text: `❌ Usage: ${prefix}randomnumber [max]`
                    },
                    { quoted: msg }
                );
            }
        }

        if (args.length >= 2) {
            min = Number(args[0]);
            max = Number(args[1]);

            if (
                !Number.isFinite(min) ||
                !Number.isFinite(max) ||
                min > max
            ) {
                return sock.sendMessage(
                    chatId,
                    {
                        text: `❌ Usage: ${prefix}randomnumber [min] [max]`
                    },
                    { quoted: msg }
                );
            }
        }

        min = Math.ceil(min);
        max = Math.floor(max);

        const result =
            Math.floor(Math.random() * (max - min + 1)) + min;

        await sock.sendMessage(
            chatId,
            {
                text:
`🎲 *RANDOM NUMBER*

┃⎈ Range: ${min} - ${max}
┃⎈ Result: *${result}*`
            },
            { quoted: msg }
        );
    }
};
