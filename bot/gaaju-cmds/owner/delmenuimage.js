'use strict';

const fs = require('fs');
const path = require('path');

const MENU_IMAGE_PATH = path.join(
    __dirname,
    '../../../assets/menu-image.jpg'
);

module.exports = {
    name: 'delmenuimage',
    aliases: ['resetmenuimage', 'defaultmenu'],
    description: 'Remove custom menu image and restore default',
    category: 'owner',
    ownerOnly: true,
    sudoAllowed: true,

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;

        try {
            if (!fs.existsSync(MENU_IMAGE_PATH)) {
                return await sock.sendMessage(
                    chatId,
                    {
                        text:
`╔══〔 MENU IMAGE 〕
║
║ ℹ️ No custom menu image
║    is currently set.
║
║ Your default image is
║ already being used.
║
╚══════════════`
                    },
                    { quoted: msg }
                );
            }

            fs.unlinkSync(MENU_IMAGE_PATH);

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
`╔══〔 MENU IMAGE 〕
║
║ ✅ Custom menu image
║    removed successfully!
║
║ The default menu image
║    will now be used.
║
╚══════════════`
                },
                { quoted: msg }
            );

        } catch (error) {
            console.error('[DELMENUIMAGE]', error);

            await sock.sendMessage(
                chatId,
                {
                    text:
                        `❌ Failed to remove menu image.\n\n${error.message}`
                },
                { quoted: msg }
            );
        }
    }
};
