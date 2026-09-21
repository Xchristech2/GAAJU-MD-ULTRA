'use strict';

module.exports = {
    name: 'calculator',
    aliases: [],
    description: 'Perform basic calculations',
    category: 'utility',

    async execute(sock, msg, args) {
        const chatId = msg.key.remoteJid;
        const expression = args.join(' ').trim();

        if (!expression) {
            return sock.sendMessage(chatId, {
                text: '❌ Enter a calculation.\n\nExample: .calculator 25 * 4 + 10'
            }, { quoted: msg });
        }

        // Only allow basic arithmetic characters
        if (!/^[0-9+\-*/().%\s]+$/.test(expression)) {
            return sock.sendMessage(chatId, {
                text: '❌ Only numbers and basic arithmetic operators are allowed.'
            }, { quoted: msg });
        }

        try {
            const result = Function(`"use strict"; return (${expression})`)();

            if (!Number.isFinite(result)) {
                throw new Error('Invalid result');
            }

            await sock.sendMessage(chatId, {
                text: `🧮 Result: ${result}`
            }, { quoted: msg });
        } catch {
            await sock.sendMessage(chatId, {
                text: '❌ Invalid calculation.'
            }, { quoted: msg });
        }
    }
};
