'use strict';

const { getBotName } = require('../../lib/botname');

module.exports = {
    name: 'listblocked',

    aliases: [
        'blocked',
        'blocklist'
    ],

    description: 'Show all blocked WhatsApp users',

    category: 'utility',

    async execute(sock, msg) {
        const chatId = msg.key.remoteJid;
        const botName = getBotName();

        if (!chatId) return;

        try {
            // Get blocked contacts
            const blocked =
                typeof sock.fetchBlocklist === 'function'
                    ? await sock.fetchBlocklist()
                    : [];

            if (!blocked || blocked.length === 0) {
                return sock.sendMessage(
                    chatId,
                    {
                        text:
                            `┏━━❐ *BLOCKED USERS* ❐━━\n` +
                            `┃\n` +
                            `┃✦ Total: *0*\n` +
                            `┃✦ Status: ✅ No blocked users\n` +
                            `┃\n` +
                            `┗━━❐ *${botName}* ❐`
                    },
                    { quoted: msg }
                );
            }

            const list = blocked
                .map((jid, index) => {
                    const number = String(jid)
                        .split('@')[0]
                        .split(':')[0];

                    return `┃ ${index + 1}. *${number}*`;
                })
                .join('\n');

            await sock.sendMessage(
                chatId,
                {
                    text:
                        `┏━━❐ *BLOCKED USERS* ❐━━\n` +
                        `┃\n` +
                        `┃✦ Total: *${blocked.length}*\n` +
                        `┃\n` +
                        `${list}\n` +
                        `┃\n` +
                        `┗━━❐ *${botName}* ❐`
                },
                { quoted: msg }
            );

        } catch (error) {
            console.error(
                '[LISTBLOCKED ERROR]',
                error
            );

            await sock.sendMessage(
                chatId,
                {
                    text:
                        `┏━━❐ *BLOCKED USERS* ❐━━\n` +
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
