'use strict';

const { getBotName } = require('../../lib/botname');

module.exports = {
    name: 'pair',

    aliases: ['pairing', 'paircode'],

    description: 'Get GAAJU pairing server links',

    category: 'utility',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const botName = getBotName();

        // Reaction
        try {
            await sock.sendMessage(chatId, {
                react: {
                    text: '🔗',
                    key: msg.key
                }
            });
        } catch {}

        const text = `
┏━━❐ *🔗 PAIR YOUR WHATSAPP* ❐━━
┃
┃✦ *${botName} Pairing Servers*
┃
┃➊ *SERVER 1*
┃   🔗 https://gaaju-ultra-pair-ljtv.onrender.com
┃
┃➋ *SERVER 2*
┃   🔗 https://gaaju-ultra-pair04.onrender.com
┃
┃✦ *How to pair:*
┃  1. Open either server
┃  2. Enter your WhatsApp number
┃  3. Tap *GET CODE*
┃  4. Copy the pairing code
┃  5. WhatsApp → Linked Devices
┃  6. Link a device
┃  7. Choose *Link with phone number*
┃  8. Enter the code
┃
┃⚠️ *Enter your number without the + sign.*
┃
┗━━❐ *${botName}* ❐━━

> ⚡ Powered by Chris Gaaju 🔥
`;

        await sock.sendMessage(
            chatId,
            {
                text,
                contextInfo: {
                    externalAdReply: {
                        title: `${botName} Pairing`,
                        body: 'Choose a pairing server below',
                        sourceUrl: 'https://gaaju-ultra-pair-ljtv.onrender.com',
                        mediaType: 1,
                        renderLargerThumbnail: false,
                        showAdAttribution: false
                    }
                }
            },
            { quoted: msg }
        );
    }
};
