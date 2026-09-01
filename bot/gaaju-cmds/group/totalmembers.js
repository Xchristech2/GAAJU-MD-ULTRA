'use strict';

const { getBotName } = require('../../lib/botname');

module.exports = {
    name: 'totalmembers',

    aliases: [
        'membercount',
        'members'
    ],

    description: 'Show total number of group members',

    category: 'group',

    async execute(sock, msg) {
        const chatId = msg.key.remoteJid;
        const botName = getBotName();

        if (!chatId || !chatId.endsWith('@g.us')) {
            return sock.sendMessage(
                chatId,
                {
                    text:
                        `┏━━❐ *TOTAL MEMBERS* ❐━━\n` +
                        `┃\n` +
                        `┃✦ Status: ❌ Group only\n` +
                        `┃\n` +
                        `┗━━❐ *${botName}* ❐`
                },
                { quoted: msg }
            );
        }

        try {
            const metadata = await sock.groupMetadata(chatId);
            const total = metadata?.participants?.length || 0;

            await sock.sendMessage(
                chatId,
                {
                    text:
                        `┏━━❐ *TOTAL MEMBERS* ❐━━\n` +
                        `┃\n` +
                        `┃✦ Group: *${metadata.subject || 'Unknown'}*\n` +
                        `┃✦ Total Members: *${total}*\n` +
                        `┃\n` +
                        `┗━━❐ *${botName}* ❐`
                },
                { quoted: msg }
            );

        } catch (error) {
            console.error('[TOTALMEMBERS ERROR]', error);

            await sock.sendMessage(
                chatId,
                {
                    text:
                        `┏━━❐ *TOTAL MEMBERS* ❐━━\n` +
                        `┃\n` +
                        `┃✦ Status: ❌ Failed to get member count\n` +
                        `┃\n` +
                        `┗━━❐ *${botName}* ❐`
                },
                { quoted: msg }
            );
        }
    }
};
