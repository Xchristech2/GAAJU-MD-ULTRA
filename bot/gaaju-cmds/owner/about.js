'use strict';

const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'about',

    aliases: ['botinfo'],

    description: 'Displays information about GAAJU-MD-ULTRA',

    category: 'owner',

    async execute(sock, msg, args, prefix, ctx) {
        try {
            const jid = msg.key.remoteJid;

            // =========================
            // LOCATE ABOUT IMAGE
            // =========================

            const imagePaths = [
                path.join(__dirname, 'media', 'about.jpg'),
                path.join(__dirname, '../media', 'about.jpg'),
                path.join(__dirname, '../../../assets', 'about.jpg')
            ];

            const imagePath = imagePaths.find(file =>
                fs.existsSync(file)
            );

            // =========================
            // ABOUT CAPTION
            // =========================

            const caption = `
╔═════════════════╗
       ⚡ *GAAJU-MD-ULTRA* ⚡
╚═════════════════╝

👁 *IDENTITY:* Built different. Powered by code.

💻 *CORE:* Node.js + Baileys
🧠 *MIND:* Smart • Fast • Reliable
⚡ *SPEED:* Built for instant execution
🛡 *PURPOSE:* Powerful WhatsApp automation

⭐ *GitHub:*
https://github.com/Xchristech2/GAAJU-MD-ULTRA

_"Born in code. Built for greatness."_ ⚡

👑 *Founder:* Chris Gaaju
💻 *Developer:* ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ
🔥 *Bot:* GAAJU-MD-ULTRA
🚀 *Version:* 1.2.0

> Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ
`;

            // =========================
            // SEND IMAGE + CAPTION
            // =========================

            if (imagePath) {
                await sock.sendMessage(
                    jid,
                    {
                        image: fs.readFileSync(imagePath),
                        caption,
                        mimetype: 'image/jpeg'
                    },
                    { quoted: msg }
                );

                console.log(
                    '[ABOUT] About information sent with image.'
                );

                return;
            }

            // =========================
            // TEXT FALLBACK
            // =========================

            await sock.sendMessage(
                jid,
                { text: caption },
                { quoted: msg }
            );

            console.log(
                '[ABOUT] Image not found, sent text only.'
            );

        } catch (error) {
            console.error('[ABOUT ERROR]', error);

            try {
                await sock.sendMessage(
                    msg.key.remoteJid,
                    {
                        text: '❌ Failed to load the bot information.'
                    },
                    { quoted: msg }
                );
            } catch {}
        }
    }
};
