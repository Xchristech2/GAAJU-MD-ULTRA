'use strict';

const { getBotName } = require('../../lib/botname');

module.exports = {
    name: 'editsettings',

    aliases: [
        'groupsettings',
        'gsettings'
    ],

    description:
        'Change group message and group info settings',

    category: 'group',

    async execute(sock, msg, args) {
        const chatId = msg.key.remoteJid;
        const botName = getBotName();

        if (!chatId || !chatId.endsWith('@g.us')) {
            return sock.sendMessage(
                chatId,
                {
                    text:
                        `┏━━❐ *EDIT SETTINGS* ❐━━\n` +
                        `┃\n` +
                        `┃✦ Status: ❌ Group only\n` +
                        `┃\n` +
                        `┗━━❐ *${botName}* ❐`
                },
                { quoted: msg }
            );
        }

        const setting = (args[0] || '').toLowerCase();
        const value = (args[1] || '').toLowerCase();

        if (!setting || !value) {
            return sock.sendMessage(
                chatId,
                {
                    text:
                        `┏━━❐ *EDIT SETTINGS* ❐━━\n` +
                        `┃\n` +
                        `┃✦ Usage:\n` +
                        `┃  • .editsettings messages on\n` +
                        `┃  • .editsettings messages off\n` +
                        `┃  • .editsettings info on\n` +
                        `┃  • .editsettings info off\n` +
                        `┃\n` +
                        `┃✦ messages = Who can send messages\n` +
                        `┃✦ info = Who can edit group info\n` +
                        `┃\n` +
                        `┗━━❐ *${botName}* ❐`
                },
                { quoted: msg }
            );
        }

        if (!['on', 'off'].includes(value)) {
            return sock.sendMessage(
                chatId,
                {
                    text:
                        `❌ Use *on* or *off*.\n\n` +
                        `Example: *.editsettings messages on*`
                },
                { quoted: msg }
            );
        }

        try {
            const announce = value === 'off';

            if (
                setting === 'messages' ||
                setting === 'message'
            ) {
                await sock.groupSettingUpdate(
                    chatId,
                    announce ? 'announcement' : 'not_announcement'
                );

                return sock.sendMessage(
                    chatId,
                    {
                        text:
                            `┏━━❐ *EDIT SETTINGS* ❐━━\n` +
                            `┃\n` +
                            `┃✦ Setting: *Messages*\n` +
                            `┃✦ Status: *${announce ? 'Admins only' : 'Everyone'}*\n` +
                            `┃✦ Result: ✅ Updated successfully\n` +
                            `┃\n` +
                            `┗━━❐ *${botName}* ❐`
                    },
                    { quoted: msg }
                );
            }

            if (
                setting === 'info' ||
                setting === 'groupinfo'
            ) {
                await sock.groupSettingUpdate(
                    chatId,
                    announce ? 'locked' : 'unlocked'
                );

                return sock.sendMessage(
                    chatId,
                    {
                        text:
                            `┏━━❐ *EDIT SETTINGS* ❐━━\n` +
                            `┃\n` +
                            `┃✦ Setting: *Group Info*\n` +
                            `┃✦ Status: *${announce ? 'Admins only' : 'Everyone'}*\n` +
                            `┃✦ Result: ✅ Updated successfully\n` +
                            `┃\n` +
                            `┗━━❐ *${botName}* ❐`
                    },
                    { quoted: msg }
                );
            }

            return sock.sendMessage(
                chatId,
                {
                    text:
                        `❌ Unknown setting: *${setting}*\n\n` +
                        `Use *messages* or *info*.`
                },
                { quoted: msg }
            );

        } catch (error) {
            console.error(
                '[EDITSETTINGS ERROR]',
                error
            );

            await sock.sendMessage(
                chatId,
                {
                    text:
                        `┏━━❐ *EDIT SETTINGS* ❐━━\n` +
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
