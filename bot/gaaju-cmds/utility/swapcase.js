'use strict';

module.exports = {
    name: 'swapcase',
    aliases: ['caseflip', 'flipcase'],
    description: 'Swap uppercase and lowercase letters',
    category: 'utility',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;

        if (!args.length) {
            return sock.sendMessage(chatId, {
                text: `❌ Usage: ${prefix}swapcase [text]`
            }, { quoted: msg });
        }

        const text = args.join(' ');

        const result = [...text].map(char => {
            if (char === char.toUpperCase() && char !== char.toLowerCase()) {
                return char.toLowerCase();
            }

            if (char === char.toLowerCase() && char !== char.toUpperCase()) {
                return char.toUpperCase();
            }

            return char;
        }).join('');

        await sock.sendMessage(chatId, {
            text: `🔄 *SWAP CASE*\n\n${result}`
        }, { quoted: msg });
    }
};
