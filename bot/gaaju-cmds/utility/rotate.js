'use strict';

const sharp = require('sharp');

module.exports = {
    name: 'rotate',

    aliases: ['rot'],

    description: 'Rotate a replied image',

    category: 'utility',

    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;

        try {
            const quoted =
                msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

            if (!quoted?.imageMessage) {
                return await sock.sendMessage(
                    jid,
                    {
                        text: '🖼️ *Reply to an image with `.rotate 90`*'
                    },
                    { quoted: msg }
                );
            }

            let angle = Number(args?.[0] || 90);

            if (![90, 180, 270, -90, -180, -270].includes(angle)) {
                return await sock.sendMessage(
                    jid,
                    {
                        text: '❌ *Invalid angle.*\n\nUse: `90`, `180`, `270` or `-90`.'
                    },
                    { quoted: msg }
                );
            }

            const { downloadMediaMessage } = require('wolfsocket');

            const fakeMessage = {
                key: {
                    remoteJid: jid,
                    fromMe: false,
                    id: msg.message.extendedTextMessage.contextInfo.stanzaId
                },
                message: quoted
            };

            const buffer = await downloadMediaMessage(
                fakeMessage,
                'buffer',
                {},
                {
                    logger: console
                }
            );

            const rotated = await sharp(buffer)
                .rotate(angle)
                .jpeg({
                    quality: 95
                })
                .toBuffer();

            await sock.sendMessage(
                jid,
                {
                    image: rotated,
                    caption: `🔄 *Rotated ${angle}°*`
                },
                { quoted: msg }
            );

        } catch (error) {
            console.error('Rotate command error:', error);

            await sock.sendMessage(
                jid,
                {
                    text: '❌ *Failed to rotate the image.*'
                },
                { quoted: msg }
            );
        }
    }
};
