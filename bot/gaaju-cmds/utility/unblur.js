'use strict';

const { downloadContentFromMessage } = require('wolfsocket');
const Replicate = require('replicate');

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
});

module.exports = {
    name: 'unblur',
    aliases: ['sharpen', 'enhance', 'restore'],
    description: 'AI restore and enhance a blurred image',
    category: 'utility',

    async execute(sock, msg) {
        const chatId = msg.key.remoteJid;

        try {
            if (!process.env.REPLICATE_API_TOKEN) {
                return await sock.sendMessage(
                    chatId,
                    {
                        text: '❌ REPLICATE_API_TOKEN is not configured.'
                    },
                    { quoted: msg }
                );
            }

            const quoted =
                msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

            const imageMessage =
                msg.message?.imageMessage ||
                quoted?.imageMessage;

            if (!imageMessage) {
                return await sock.sendMessage(
                    chatId,
                    {
                        text: '📸 Reply to a blurred image with .unblur'
                    },
                    { quoted: msg }
                );
            }

            await sock.sendMessage(
                chatId,
                {
                    text: '🤖 AI is restoring the image...\n\n⏳ Please wait...'
                },
                { quoted: msg }
            );

            const stream = await downloadContentFromMessage(
                imageMessage,
                'image'
            );

            const chunks = [];

            for await (const chunk of stream) {
                chunks.push(chunk);
            }

            const imageBuffer = Buffer.concat(chunks);

            /*
             * Convert image to a data URI.
             * Replicate accepts data URIs as file inputs.
             */
            const base64Image =
                imageBuffer.toString('base64');

            const imageData =
                `data:image/jpeg;base64,${base64Image}`;

            /*
             * CodeFormer
             *
             * Lower fidelity = stronger restoration.
             * Higher fidelity = closer to original face.
             */
            const output = await replicate.run(
                'sczhou/codeformer:cc4956dd26fa5a7185d5660cc9100fab1b8070a1d1654a8bb5eb6d443b020bb2',
                {
                    input: {
                        image: imageData,

                        upscale: 2,

                        face_upsample: true,

                        background_enhance: true,

                        codeformer_fidelity: 0.5
                    }
                }
            );

            if (!output) {
                throw new Error(
                    'AI restoration returned no output.'
                );
            }

            /*
             * Replicate normally returns a FileOutput/URL.
             * Convert it into a Buffer before sending to WhatsApp.
             */
            let restoredImage;

            if (typeof output === 'string') {
                const response = await fetch(output);

                if (!response.ok) {
                    throw new Error(
                        `Failed to download AI output: ${response.status}`
                    );
                }

                restoredImage =
                    Buffer.from(
                        await response.arrayBuffer()
                    );
            } else if (
                output &&
                typeof output.url === 'function'
            ) {
                const outputUrl =
                    output.url();

                const response =
                    await fetch(outputUrl);

                if (!response.ok) {
                    throw new Error(
                        `Failed to download AI output: ${response.status}`
                    );
                }

                restoredImage =
                    Buffer.from(
                        await response.arrayBuffer()
                    );
            } else if (
                output &&
                output.url
            ) {
                const response =
                    await fetch(output.url);

                if (!response.ok) {
                    throw new Error(
                        `Failed to download AI output: ${response.status}`
                    );
                }

                restoredImage =
                    Buffer.from(
                        await response.arrayBuffer()
                    );
            } else {
                throw new Error(
                    'Unknown AI output format.'
                );
            }

            await sock.sendMessage(
                chatId,
                {
                    image: restoredImage,
                    caption:
                        '✨ AI restoration complete!\n\n' +
                        '🤖 CodeFormer\n' +
                        '🔍 Details enhanced\n' +
                        '👤 Face restoration applied\n' +
                        '📈 Image upscaled 2×'
                },
                { quoted: msg }
            );

        } catch (error) {
            console.error(
                '[UNBLUR AI ERROR]',
                error
            );

            await sock.sendMessage(
                chatId,
                {
                    text:
                        '❌ AI restoration failed.\n\n' +
                        'Please try another image or check the Replicate API configuration.'
                },
                { quoted: msg }
            );
        }
    }
};
