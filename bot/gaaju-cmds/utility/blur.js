'use strict';

const { downloadContentFromMessage } = require('wolfsocket');
const sharp = require('sharp');

module.exports = {
    name: 'blur',
    aliases: ['blurry'],
    description: 'Blur an image',
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
                        text: '📸 Reply to an image with .blur'
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

            const blurredImage = await sharp(image)
                .blur(15)
                .jpeg({ quality: 90 })
                .toBuffer();

            await sock.sendMessage(
                chatId,
                {
                    image: blurredImage,
                    caption: '🌀 Image blurred successfully.'
                },
                { quoted: msg }
            );

        } catch (error) {
            console.error('[BLUR ERROR]', error);

            await sock.sendMessage(
                chatId,
                {
                    text: '❌ Failed to blur the image.'
                },
                { quoted: msg }
            );
        }
    }
};
