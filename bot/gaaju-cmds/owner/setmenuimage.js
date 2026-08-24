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
            const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

            if (!quoted?.imageMessage) {
                return await sock.sendMessage(
                    chatId,
                    {
                        text:
`╔══〔 SET MENU IMAGE 〕
║
║ ❌ Reply to a photo with
║    ${prefix}setmenuimage
║
╚══════════════`
                    },
                    { quoted: msg }
                );
            }

            await sock.sendMessage(chatId, {
                react: {
                    text: '⏳',
                    key: msg.key
                }
            });

            const fakeMessage = {
                key: msg.key,
                message: quoted
            };

            const buffer = await downloadMediaMessage(
                fakeMessage,
                'buffer',
                {}
            );

            if (!buffer || !buffer.length) {
                throw new Error('Could not download the image.');
            }

            fs.mkdirSync(MENU_IMAGE_DIR, { recursive: true });

            fs.writeFileSync(MENU_IMAGE_PATH, buffer);

            await sock.sendMessage(chatId, {
                react: {
                    text: '✅',
                    key: msg.key
                }
            });

            await sock.sendMessage(
                chatId,
                {
                    text:
`╔══〔 SET MENU IMAGE 〕
║
║ ✅ Menu image updated!
║
║ Your replied photo is now
║ being used by the menu.
║
╚══════════════`
                },
                { quoted: msg }
            );

        } catch (error) {
            console.error('[SETMENUIMAGE]', error);

            await sock.sendMessage(
                chatId,
                {
                    text: `❌ Failed to set menu image.\n\n${error.message}`
                },
                { quoted: msg }
            );
        }
    }
};
