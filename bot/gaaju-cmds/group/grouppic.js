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

        // Group only
        if (!chatId || !chatId.endsWith('@g.us')) {
            return sock.sendMessage(
                chatId,
                {
                    text:
                        `╔━━❐ *GROUP PIC* ❐━━╗\n\n` +
                        `┃✦ Status: ❌ Group only\n\n` +
                        `┗━━❐ *${botName}* ❐━━`
                },
                { quoted: msg }
            );
        }

        try {
            // Get group information
            const metadata = await sock.groupMetadata(chatId);
            const groupName = metadata.subject || 'Group';

            // Get group profile picture
            let profilePic;

            try {
                profilePic = await sock.profilePictureUrl(
                    chatId,
                    'image'
                );
            } catch {
                profilePic = null;
            }

            // Group has no profile picture
            if (!profilePic) {
                return sock.sendMessage(
                    chatId,
                    {
                        text:
                            `╔━━❐ *GROUP PIC* ❐━━╗\n\n` +
                            `┃✦ Group: *${groupName}*\n` +
                            `┃✦ Status: ❌ No group picture found\n\n` +
                            `┗━━❐ *${botName}* ❐━━`
                    },
                    { quoted: msg }
                );
            }

            // Send group picture
            await sock.sendMessage(
                chatId,
                {
                    image: {
                        url: profilePic
                    },
                    caption:
                        `╔━━❐ *GROUP PIC* ❐━━╗\n\n` +
                        `┃✦ Group: *${groupName}*\n` +
                        `┃✦ Status: ✅ Group picture\n\n` +
                        `┗━━❐ *${botName}* ❐━━`
                },
                { quoted: msg }
            );

        } catch (error) {
            console.error('[GROUPPIC ERROR]', error);

            await sock.sendMessage(
                chatId,
                {
                    text:
                        `╔━━❐ *GROUP PIC* ❐━━╗\n\n` +
                        `┃✦ Status: ❌ Failed\n` +
                        `┃✦ Reason: Unable to fetch group picture\n\n` +
                        `┗━━❐ *${botName}* ❐━━`
                },
                { quoted: msg }
            );
        }
    }
};
