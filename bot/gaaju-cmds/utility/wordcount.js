'use strict';

module.exports = {
    name: 'wordcount',
    aliases: ['words', 'wc'],
    description: 'Count the number of words in a text',
    category: 'utility',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;

        if (!args.length) {
            return sock.sendMessage(
                chatId,
                {
                    text: `❌ Usage: ${prefix}wordcount [text]\n\nExample: ${prefix}wordcount I want to become a great artist`
                },
                { quoted: msg }
            );
        }

        const text = args.join(' ').trim();

        if (!text) {
            return sock.sendMessage(
                chatId,
                {
                    text: `❌ Please provide some text to count.`
                },
                { quoted: msg }
            );
        }

        const words = text.split(/\s+/).filter(Boolean);

        await sock.sendMessage(
            chatId,
            {
                text:
`📝 *WORD COUNT*

┃⎈ Words: *${words.length}*
┃⎈ Characters: *${text.length}*`
            },
            { quoted: msg }
        );
    }
};
