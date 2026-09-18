'use strict';

module.exports = {
    name: 'hex',
    aliases: ['tohex', 'hexadecimal'],
    description: 'Convert a decimal number to hexadecimal',
    category: 'utility',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;

        if (!args.length) {
            return sock.sendMessage(chatId, {
                text: `❌ Usage: ${prefix}hex [number]\n\nExample: ${prefix}hex 255`
            }, { quoted: msg });
        }

        const number = Number(args[0]);

        if (!Number.isSafeInteger(number)) {
            return sock.sendMessage(chatId, {
                text: `❌ Please enter a valid safe whole number.`
            }, { quoted: msg });
        }

        await sock.sendMessage(chatId, {
            text: `🔢 *HEXADECIMAL CONVERTER*\n\n┃⎈ Decimal: *${number}*\n┃⎈ Hex: *${number.toString(16).toUpperCase()}*`
        }, { quoted: msg });
    }
};
