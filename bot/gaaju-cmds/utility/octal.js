'use strict';

module.exports = {
    name: 'octal',
    aliases: ['oct', 'tooctal'],
    description: 'Convert a decimal number to octal',
    category: 'utility',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;

        if (!args.length) {
            return sock.sendMessage(chatId, {
                text: `❌ Usage: ${prefix}octal [number]\n\nExample: ${prefix}octal 64`
            }, { quoted: msg });
        }

        const number = Number(args[0]);

        if (!Number.isSafeInteger(number)) {
            return sock.sendMessage(chatId, {
                text: `❌ Please enter a valid safe whole number.`
            }, { quoted: msg });
        }

        await sock.sendMessage(chatId, {
            text: `🔢 *OCTAL CONVERTER*\n\n┃⎈ Decimal: *${number}*\n┃⎈ Octal: *${number.toString(8)}*`
        }, { quoted: msg });
    }
};
