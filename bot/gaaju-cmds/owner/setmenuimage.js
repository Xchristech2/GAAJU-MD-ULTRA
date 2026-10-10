'use strict';

const fs = require('fs');
const path = require('path');
const { downloadMediaMessage } = require('wolfsocket');

const MENU_IMAGE_DIR = path.join(__dirname, '../../../assets');
const MENU_IMAGE_PATH = path.join(MENU_IMAGE_DIR, 'menu-image.jpg');

module.exports = {
    name: 'setmenuimage',
    aliases: ['setmenuimg'],
    description: 'Set a custom image for the bot menu',
    category: 'owner',
    ownerOnly: true,
    sudoAllowed: true,

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;

        try {
            const contextInfo =
                msg.message?.extendedTextMessage?.contextInfo ||
                msg.message?.imageMessage?.contextInfo ||
                msg.message?.videoMessage?.contextInfo;

            const quoted = contextInfo?.quotedMessage;

            const quotedImage =
                quoted?.imageMessage ||
                quoted?.viewOnceMessage?.message?.imageMessage ||
                quoted?.viewOnceMessageV2?.message?.imageMessage ||
                quoted?.viewOnceMessageV2Extension?.message?.imageMessage;

            if (!quotedImage) {
                return sock.sendMessage(
                    chatId,
                    {
                        text:
                            `❌ *SET MENU IMAGE*\n\n` +
                            `Reply directly to a photo with:\n` +
                            `${prefix}setmenuimage\n\n` +
                            `The photo must be an image, not a video.`
                    },
                    { quoted: msg }
                );
            }

            await sock.sendMessage(chatId, {
                react: { text: '⏳', key: msg.key }
            });

            const fakeMessage = {
                key: {
                    remoteJid: chatId,
                    id: contextInfo.stanzaId,
                    participant: contextInfo.participant
                },
                message: quoted
            };

            const buffer = await downloadMediaMessage(
                fakeMessage,
                'buffer',
                {},
                {
                    logger: console,
                    reuploadRequest: sock.updateMediaMessage
                        ? sock.updateMediaMessage.bind(sock)
                        : undefined
                }
            );

            if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
                throw new Error('The image could not be downloaded.');
            }

            // Detect the actual image format.
            let extension;

            if (
                buffer.length >= 3 &&
                buffer[0] === 0xFF &&
                buffer[1] === 0xD8 &&
                buffer[2] === 0xFF
            ) {
                extension = 'jpg';
            } else if (
                buffer.length >= 8 &&
                buffer.subarray(0, 8).equals(
                    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
                )
            ) {
                extension = 'png';
            } else if (
                buffer.toString('ascii', 0, 4) === 'RIFF' &&
                buffer.toString('ascii', 8, 12) === 'WEBP'
            ) {
                extension = 'webp';
            } else {
                throw new Error(
                    'Unsupported or unrecognized image format. Please try another photo.'
                );
            }

            fs.mkdirSync(MENU_IMAGE_DIR, { recursive: true });

            // Save the file using its real extension.
            const savedPath = path.join(
                MENU_IMAGE_DIR,
                `menu-image.${extension}`
            );

            fs.writeFileSync(savedPath, buffer);

            // Remove older menu image variants.
            for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
                const oldPath = path.join(
                    MENU_IMAGE_DIR,
                    `menu-image.${ext}`
                );

                if (oldPath !== savedPath && fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            await sock.sendMessage(chatId, {
                react: { text: '✅', key: msg.key }
            });

            await sock.sendMessage(
                chatId,
                {
                    text:
                        `✅ *MENU IMAGE UPDATED*\n\n` +
                        `📁 File: menu-image.${extension}\n` +
                        `📦 Size: ${(buffer.length / 1024).toFixed(1)} KB\n\n` +
                        `Now run ${prefix}menu to see the updated image.\n\n` +
                        `_Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ_`
                },
                { quoted: msg }
            );

        } catch (error) {
            console.error('[SETMENUIMAGE]', error);

            await sock.sendMessage(
                chatId,
                {
                    text:
                        `❌ *FAILED TO UPDATE MENU IMAGE*\n\n` +
                        `${error.message}\n\n` +
                        `Please try replying to the photo again.`
                },
                { quoted: msg }
            );
        }
    }
};
