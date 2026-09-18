'use strict';

module.exports = {
    name: 'consonantcount',
    aliases: ['consonants', 'consonant'],
    description: 'Count consonants in a text',
    category: 'utility',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;

        if (!args.length) {
            return sock.sendMessage(
                chatId,
                {
                    text: `❌ Usage: ${prefix}consonantcount [text]\n\nExample: ${prefix}consonantcount I want to become an artist`
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

        const consonants = text.match(/[b-df-hj-np-tv-z]/gi) || [];
        const count = consonants.length;

        await sock.sendMessage(
            chatId,
            {
                text:
`🔤 *CONSONANT COUNT*

┃⎈ Consonants: *${count}*
┃⎈ Text: ${text}`
            },
            { quoted: msg }
        );
    }
};
