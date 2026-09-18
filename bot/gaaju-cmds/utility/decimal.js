'use strict';

module.exports = {
    name: 'decimal',
    aliases: ['todecimal', 'dec'],
    description: 'Convert binary, octal or hexadecimal to decimal',
    category: 'utility',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;

        if (args.length < 2) {
            return sock.sendMessage(chatId, {
                text: `❌ Usage: ${prefix}decimal [base] [number]\n\nExample:\n${prefix}decimal bin 1010\n${prefix}decimal oct 12\n${prefix}decimal hex FF`
            }, { quoted: msg });
        }

        const baseName = args[0].toLowerCase();
        const value = args[1];

        const bases = {
            bin: 2,
            binary: 2,
            oct: 8,
            octal: 8,
            hex: 16,
            hexadecimal: 16
        };

        const base = bases[baseName];

        if (!base) {
            return sock.sendMessage(chatId, {
                text: `❌ Base must be bin, oct or hex.`
            }, { quoted: msg });
        }

        const patterns = {
            2: /^[01]+$/,
            8: /^[0-7]+$/,
            16: /^[0-9a-f]+$/i
        };

        if (!patterns[base].test(value)) {
            return sock.sendMessage(chatId, {
                text: `❌ Invalid ${baseName} number.`
            }, { quoted: msg });
        }

        const result = parseInt(value, base);

        await sock.sendMessage(chatId, {
            text: `🔢 *DECIMAL CONVERTER*\n\n┃⎈ Input: *${value}*\n┃⎈ Base: *${base}*\n┃⎈ Decimal: *${result}*`
        }, { quoted: msg });
    }
};
