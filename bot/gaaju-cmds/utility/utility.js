'use strict';

module.exports = {
    name: 'repeat',
    aliases: ['rep', 'repeattext'],
    description: 'Repeat a text multiple times',
    category: 'utility',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;

        if (args.length < 2) {
            return sock.sendMessage(
                chatId,
                {
                    text: `❌ Usage: ${prefix}repeat [number] [text]\n\nExample: ${prefix}repeat 3 Hello`
                },
                { quoted: msg }
            );
        }

        const count = Number(args[0]);
        const text = args.slice(1).join(' ').trim();

        if (!Number.isInteger(count) || count < 1 || count > 50) {
            return sock.sendMessage(
                chatId,
                {
                    text: `❌ Number must be a whole number between 1 and 50.`
                },
                { quoted: msg }
            );
        }

        if (!text) {
            return sock.sendMessage(
                chatId,
                {
                    text: `❌ Enter some text to repeat.`
                },
                { quoted: msg }
            );
        }

        const result = Array(count).fill(text).join('\n');

        await sock.sendMessage(
            chatId,
            {
                text:
`🔁 *REPEAT*

┃⎈ Times: ${count}
┃⎈ Text: *${text}*

${result}`
            },
            { quoted: msg }
        );
    }
};
