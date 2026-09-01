'use strict';

const { getBotName } = require('../../lib/botname');

module.exports = {
    name: 'userid',

    aliases: [
        'uid',
        'id'
    ],

    description: 'Get the WhatsApp user ID',

    category: 'utility',

    async execute(sock, msg) {
        const chatId = msg.key.remoteJid;
        const botName = getBotName();

        if (!chatId) return;

        try {
            let userId = chatId;

            // If replying to someone's message,
            // show the ID of the person being replied to.
            const quoted =
                msg.message?.extendedTextMessage?.contextInfo?.participant ||
                msg.message?.imageMessage?.contextInfo?.participant ||
                msg.message?.videoMessage?.contextInfo?.participant ||
                msg.message?.documentMessage?.contextInfo?.participant;

            if (quoted) {
                userId = quoted;
            }

            // If the command is used by a normal private chat,
            // the chat ID is the user's ID.
            if (!chatId.endsWith('@g.us') && !quoted) {
                userId = chatId;
            }

            await sock.sendMessage(
                chatId,
                {
                    text:
                        `┏━━❐ *USER ID* ❐━━\n` +
                        `┃\n` +
                        `┃✦ User ID:\n` +
                        `┃  *${userId}*\n` +
                        `┃\n` +
                        `┃✦ Status: ✅ Found\n` +
                        `┃\n` +
                        `┗━━❐ *${botName}* ❐`
                },
                { quoted: msg }
            );

        } catch (error) {
            console.error('[USERID ERROR]', error);

            await sock.sendMessage(
                chatId,
                {
                    text:
                        `┏━━❐ *USER ID* ❐━━\n` +
                        `┃\n` +
                        `┃✦ Status: ❌ Failed\n` +
                        `┃✦ Reason: ${error.message || 'Unknown error'}\n` +
                        `┃\n` +
                        `┗━━❐ *${botName}* ❐`
                },
                { quoted: msg }
            );
        }
    }
};
