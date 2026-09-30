'use strict';

const {
    downloadContentFromMessage
} = require('@whiskeysockets/baileys');

module.exports = {
    name: 'setprofile',

    aliases: [],

    description:
        'Set the bot WhatsApp profile picture',

    category: 'owner',

    ownerOnly: true,

    async execute(
        sock,
        msg,
        args,
        prefix,
        ctx
    ) {
        try {
            const chatId =
                msg.key.remoteJid;

            const quoted =
                msg.message
                    ?.extendedTextMessage
                    ?.contextInfo
                    ?.quotedMessage;

            if (!quoted) {
                return await sock.sendMessage(
                    chatId,
                    {
                        text:
                            `📸 *SET PROFILE*\n\n` +
                            `Reply to an image with *${prefix}setprofile*`
                    },
                    {
                        quoted: msg
                    }
                );
            }

            const imageMessage =
                quoted.imageMessage;

            if (!imageMessage) {
                return await sock.sendMessage(
                    chatId,
                    {
                        text:
                            '❌ Please reply to a picture/image.'
                    },
                    {
                        quoted: msg
                    }
                );
            }

            const stream =
                await downloadContentFromMessage(
                    imageMessage,
                    'image'
                );

            const chunks = [];

            for await (const chunk of stream) {
                chunks.push(chunk);
            }

            const imageBuffer =
                Buffer.concat(chunks);

            if (!imageBuffer.length) {
                return await sock.sendMessage(
                    chatId,
                    {
                        text:
                            '❌ Failed to download the image.'
                    },
                    {
                        quoted: msg
                    }
                );
            }

            /*
             * Update the bot's WhatsApp
             * profile picture.
             */
            await sock.updateProfilePicture(
                sock.user.id,
                imageBuffer
            );

            await sock.sendMessage(
                chatId,
                {
                    text:
                        '✅ *Profile picture updated successfully!*'
                },
                {
                    quoted: msg
                }
            );

        } catch (error) {
            console.error(
                '[SETPROFILE ERROR]',
                error
            );

            await sock.sendMessage(
                msg.key.remoteJid,
                {
                    text:
                        '❌ Failed to update the profile picture.\n\n' +
                        'Please try again with another image.'
                },
                {
                    quoted: msg
                }
            );
        }
    }
};
