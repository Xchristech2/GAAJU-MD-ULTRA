'use strict';

const { downloadContentFromMessage } = require('wolfsocket');
const sharp = require('sharp');

module.exports = {
    name: 'unblur',
    aliases: ['enhance', 'clear', 'restore'],
    description: 'Clear, brighten and enhance an image',
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
                .rotate()

                // Improve overall contrast
                .normalize({
                    lower: 1,
                    upper: 99
                })

                // Bring out darker details
                .clahe({
                    width: 5,
                    height: 5,
                    maxSlope: 3
                })

                // Make the image brighter and more vivid
                .modulate({
                    brightness: 1.15,
                    saturation: 1.08
                })

                // Stronger sharpening
                .sharpen({
                    sigma: 2.2,
                    m1: 1.5,
                    m2: 3,
                    x1: 2,
                    y2: 15,
                    y3: 25
                })

                // Slight upscale for a cleaner result
                .resize({
                    width: Math.round(
                        (await sharp(image).metadata()).width * 1.5
                    ),
                    withoutEnlargement: false,
                    kernel: sharp.kernel.lanczos3
                })

                .jpeg({
                    quality: 95,
                    mozjpeg: true
                })

                .toBuffer();

            await sock.sendMessage(
                chatId,
                {
                    image: enhancedImage,
                    caption:
                        '✨ *IMAGE ENHANCED*\n\n' +
                        '🔍 Clarity improved\n' +
                        '☀️ Brightness improved\n' +
                        '🎨 Contrast enhanced\n' +
                        '⚡ Sharpened successfully'
                },
                { quoted: msg }
            );

        } catch (error) {
            console.error('[UNBLUR ERROR]', error);

            await sock.sendMessage(
                chatId,
                {
                    text:
                        '❌ Failed to enhance image.\n\n' +
                        'Please try another image.'
                },
                { quoted: msg }
            );
        }
    }
};
