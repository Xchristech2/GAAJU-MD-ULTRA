'use strict';

module.exports = {
    name: 'echo',
    aliases: ['sayit', 'repeatmsg'],
    description: 'Echo back the given message',
    category: 'utility',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;

        if (!args.length) {
            return sock.sendMessage(
                chatId,
                {
                    text: `❌ Usage: ${prefix}echo [text]\n\nExample: ${prefix}echo Hello everyone`
                },
                { quoted: msg }
            );
        }

        const text = args.join(' ').trim();

        if (!text) {
            return sock.sendMessage(
                chatId,
                {
                    text: `❌ Please provide some text to echo.`
                },
                { quoted: msg }
            );
        }

        await sock.sendMessage(
            chatId,
            {
                text: `🔊 *ECHO*\n\n${text}`
            },
            { quoted: msg }
        );
    }
};
