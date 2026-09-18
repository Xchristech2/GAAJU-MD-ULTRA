'use strict';

module.exports = {
    name: 'sort',
    aliases: ['sortwords', 'alphabetize'],
    description: 'Sort words alphabetically',
    category: 'utility',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;

        if (!args.length) {
            return sock.sendMessage(chatId, {
                text: `❌ Usage: ${prefix}sort [text]\n\nExample: ${prefix}sort banana apple mango`
            }, { quoted: msg });
        }

        const words = args.join(' ')
            .trim()
            .split(/\s+/)
            .sort((a, b) => a.localeCompare(b));

        await sock.sendMessage(chatId, {
            text: `🔤 *SORT WORDS*\n\n┃⎈ Result: *${words.join(' ')}*`
        }, { quoted: msg });
    }
};
