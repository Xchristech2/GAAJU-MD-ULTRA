'use strict';

module.exports = {
    name: 'shuffle',
    aliases: ['mix', 'randomize'],
    description: 'Shuffle words in a text',
    category: 'utility',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;

        if (!args.length) {
            return sock.sendMessage(chatId, {
                text: `❌ Usage: ${prefix}shuffle [text]\n\nExample: ${prefix}shuffle I love music`
            }, { quoted: msg });
        }

        const words = args.join(' ').trim().split(/\s+/);

        for (let i = words.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [words[i], words[j]] = [words[j], words[i]];
        }

        await sock.sendMessage(chatId, {
            text: `🔀 *SHUFFLE*\n\n┃⎈ Result: *${words.join(' ')}*`
        }, { quoted: msg });
    }
};
