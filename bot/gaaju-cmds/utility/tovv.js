'use strict';

const { downloadContentFromMessage } = require('wolfsocket');

module.exports = {
    name: 'tovv',
    aliases: ['setvv'],
    description: 'Convert an image to View Once',
    category: 'utility',

    async execute(sock, msg) {
        const chatId = msg.key.remoteJid;

        try {
            const quoted =
                msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

            const imageMessage =
                msg.message?.imageMessage ||
                quoted?.imageMessage;

            if (!imageMessage) {
                return await sock.sendMessage(
                    chatId,
                    {
                        text: '📸 Reply to an image with .tovv'
                    },
                    { quoted: msg }
                );
            }

            const stream = await downloadContentFromMessage(
                imageMessage,
                'image'
            );

            const chunks = [];

            for await (const chunk of stream) {
                chunks.push(chunk);
            }

            const image = Buffer.concat(chunks);

            await sock.sendMessage(
                chatId,
                {
                    image,
                    viewOnce: true
                },
                { quoted: msg }
            );

        } catch (error) {
            console.error('[TOVV ERROR]', error);

            await sock.sendMessage(
                chatId,
                {
                    text: '❌ Failed to convert image to View Once.'
                },
                { quoted: msg }
            );
        }
    }
};
