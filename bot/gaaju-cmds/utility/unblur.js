'use strict';

const { downloadContentFromMessage } = require('wolfsocket');
const sharp = require('sharp');

module.exports = {
    name: 'unblur',
    aliases: ['sharpen', 'enhance'],
    description: 'Sharpen and enhance a blurred image',
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
                        text: '📸 Reply to an image with .unblur'
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

            const enhancedImage = await sharp(image)
                .sharpen({
                    sigma: 2,
                    m1: 1,
                    m2: 2,
                    x1: 2,
                    y2: 10,
                    y3: 20
                })
                .normalize()
                .jpeg({
                    quality: 95
                })
                .toBuffer();

            await sock.sendMessage(
                chatId,
                {
                    image: enhancedImage,
                    caption: '✨ Image enhanced successfully.'
                },
                { quoted: msg }
            );

        } catch (error) {
            console.error('[UNBLUR ERROR]', error);

            await sock.sendMessage(
                chatId,
                {
                    text: '❌ Failed to unblur/enhance the image.'
                },
                { quoted: msg }
            );
        }
    }
};
