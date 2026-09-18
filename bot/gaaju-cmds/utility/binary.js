'use strict';

module.exports = {
    name: 'binary',
    aliases: ['bin', 'tobinary'],
    description: 'Convert a decimal number to binary',
    category: 'utility',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;

        if (!args.length) {
            return sock.sendMessage(
                chatId,
                {
                    text: `❌ Usage: ${prefix}binary [number]\n\nExample: ${prefix}binary 25`
                },
                { quoted: msg }
            );
        }

        const number = Number(args[0]);

        if (!Number.isInteger(number)) {
            return sock.sendMessage(
                chatId,
                {
                    text: `❌ Please enter a valid whole number.`
                },
                { quoted: msg }
            );
        }

        if (!Number.isSafeInteger(number)) {
            return sock.sendMessage(
                chatId,
                {
                    text: `❌ Number is too large to process safely.`
                },
                { quoted: msg }
            );
        }

        const binary = number.toString(2);

        await sock.sendMessage(
            chatId,
            {
                text:
`🔢 *BINARY CONVERTER*

┃⎈ Decimal: *${number}*
┃⎈ Binary: *${binary}*`
            },
            { quoted: msg }
        );
    }
};
