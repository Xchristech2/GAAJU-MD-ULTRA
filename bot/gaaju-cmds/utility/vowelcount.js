'use strict';

module.exports = {
    name: 'vowelcount',
    aliases: ['vowels', 'vowel'],
    description: 'Count vowels in a text',
    category: 'utility',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;

        if (!args.length) {
            return sock.sendMessage(
                chatId,
                {
                    text: `❌ Usage: ${prefix}vowelcount [text]\n\nExample: ${prefix}vowelcount I want to become an artist`
                },
                { quoted: msg }
            );
        }

        const text = args.join(' ').trim();

        if (!text) {
            return sock.sendMessage(
                chatId,
                {
                    text: `❌ Please provide some text.`
                },
                { quoted: msg }
            );
        }

        const vowels = text.match(/[aeiou]/gi) || [];
        const count = vowels.length;

        await sock.sendMessage(
            chatId,
            {
                text:
`🔤 *VOWEL COUNT*

┃⎈ Vowels: *${count}*
┃⎈ Text: ${text}`
            },
            { quoted: msg }
        );
    }
};
