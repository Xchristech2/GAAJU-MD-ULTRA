'use strict';

const { getBotName } = require('../../lib/botname');

module.exports = {
    name: 'grouppic',

    aliases: [
        'getgrouppic',
        'getgrouppp'
    ],

    description: 'Get the current group profile picture',

    category: 'group',

    async execute(sock, msg) {
        const chatId = msg.key.remoteJid;
        const botName = getBotName();

        // GROUP ONLY
        if (!chatId || !chatId.endsWith('@g.us')) {
            return sock.sendMessage(
                chatId,
                {
                    text:
                        `┏━━❐ *GROUP PIC* ❐━━\n` +
                        `┃\n` +
                        `┃✦ Status: ❌ Group only\n` +
                        `┃\n` +
                        `┗━━❐ *${botName}* ❐`
                },
                { quoted: msg }
            );
        }

        try {
            // Get group information
            const metadata = await sock.groupMetadata(chatId);

            const groupName =
                metadata?.subject || 'Unknown Group';

            // Fetch current group profile picture
            let profilePic;

            try {
                profilePic = await sock.profilePictureUrl(
                    chatId,
                    'image'
                );
            } catch {
                profilePic = null;
            }

            // No group picture
            if (!profilePic) {
                return sock.sendMessage(
                    chatId,
                    {
                        text:
                            `┏━━❐ *GROUP PIC* ❐━━\n` +
                            `┃\n` +
                            `┃✦ Group: *${groupName}*\n` +
                            `┃✦ Status: ❌ No group picture\n` +
                            `┃\n` +
                            `┗━━❐ *${botName}* ❐`
                    },
                    { quoted: msg }
                );
            }

            // Send current group picture
            await sock.sendMessage(
                chatId,
                {
                    image: {
                        url: profilePic
                    },

                    caption:
                        `┏━━❐ *GROUP PIC* ❐━━\n` +
                        `┃\n` +
                        `┃✦ Group: *${groupName}*\n` +
                        `┃✦ Status: ✅ Current group picture\n` +
                        `┃\n` +
                        `┗━━❐ *${botName}* ❐`
                },
                { quoted: msg }
            );

        } catch (error) {
            console.error(
                '[GROUPPIC ERROR]',
                error
            );

            await sock.sendMessage(
                chatId,
                {
                    text:
                        `┏━━❐ *GROUP PIC* ❐━━\n` +
                        `┃\n` +
                        `┃✦ Status: ❌ Failed\n` +
                        `┃✦ Reason: Could not fetch group picture\n` +
                        `┃\n` +
                        `┗━━❐ *${botName}* ❐`
                },
                { quoted: msg }
            );
        }
    }
};
