'use strict';

const { getBotName } = require('../../lib/botname');

module.exports = {
    name: 'disapproveall',

    aliases: [
        'rejectall',
        'rejectpending'
    ],

    description:
        'Reject all pending group join requests',

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
                        `┏━━❐ *DISAPPROVE ALL* ❐━━\n` +
                        `┃\n` +
                        `┃✦ Status: ❌ Group only\n` +
                        `┃\n` +
                        `┗━━❐ *${botName}* ❐`
                },
                { quoted: msg }
            );
        }

        try {
            // Get pending join requests
            const requests =
                await sock.groupRequestParticipantsList(chatId);

            if (!requests || requests.length === 0) {
                return sock.sendMessage(
                    chatId,
                    {
                        text:
                            `┏━━❐ *DISAPPROVE ALL* ❐━━\n` +
                            `┃\n` +
                            `┃✦ Pending requests: *0*\n` +
                            `┃✦ Status: ✅ Nothing to reject\n` +
                            `┃\n` +
                            `┗━━❐ *${botName}* ❐`
                    },
                    { quoted: msg }
                );
            }

            const participants = requests
                .map(request => request?.jid)
                .filter(Boolean);

            if (!participants.length) {
                return sock.sendMessage(
                    chatId,
                    {
                        text:
                            `┏━━❐ *DISAPPROVE ALL* ❐━━\n` +
                            `┃\n` +
                            `┃✦ Status: ❌ Could not find pending members\n` +
                            `┃\n` +
                            `┗━━❐ *${botName}* ❐`
                    },
                    { quoted: msg }
                );
            }

            // Reject all pending requests
            await sock.groupRequestParticipantsUpdate(
                chatId,
                participants,
                'reject'
            );

            await sock.sendMessage(
                chatId,
                {
                    text:
                        `┏━━❐ *DISAPPROVE ALL* ❐━━\n` +
                        `┃\n` +
                        `┃✦ Pending requests: *${participants.length}*\n` +
                        `┃✦ Rejected: *${participants.length}*\n` +
                        `┃✦ Status: ✅ All requests rejected\n` +
                        `┃\n` +
                        `┗━━❐ *${botName}* ❐`
                },
                { quoted: msg }
            );

        } catch (error) {
            console.error(
                '[DISAPPROVEALL ERROR]',
                error
            );

            await sock.sendMessage(
                chatId,
                {
                    text:
                        `┏━━❐ *DISAPPROVE ALL* ❐━━\n` +
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
