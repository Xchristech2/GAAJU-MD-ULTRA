'use strict';

const {
    getTarget,
    resolveDisplay,
    checkPrivilege
} = require('../../lib/groupUtils');

const {
    getBotName
} = require('../../lib/botname');

module.exports = {
    name: 'ban',
    aliases: ['kick', 'remove'],
    description: 'Remove a member from the group (sudo/admin only)',
    category: 'group',

    async execute(sock, msg, args, prefix, ctx) {

        const chatId = msg.key.remoteJid;
        const botName = getBotName();

        // Small reaction
        try {
            await sock.sendMessage(chatId, {
                react: {
                    text: '🔨',
                    key: msg.key
                }
            });
        } catch {}

        // Group only
        if (!chatId.endsWith('@g.us')) {
            return sock.sendMessage(chatId, {
                text:
`┏━━❐ *🚫 BAN* ❐━━
┃✦ Status : ❌ Group Only
┗━━❐ *${botName}* ❐`,
                quoted: msg
            });
        }

        // Check privilege
        const {
            ok: hasPrivilege
        } = await checkPrivilege(
            sock,
            chatId,
            msg,
            ctx
        );

        if (!hasPrivilege) {
            return sock.sendMessage(chatId, {
                text:
`┏━━❐ *🚫 BAN* ❐━━
┃✦ Status : ❌ Permission Denied
┃✦ Reason : Sudo Users & Group Admins Only
┗━━❐ *${botName}* ❐`,
                quoted: msg
            });
        }

        // Get target
        const target = getTarget(msg, args);

        if (!target) {
            return sock.sendMessage(chatId, {
                text:
`┏━━❐ *🚫 BAN* ❐━━
┃✦ Usage : ${prefix}ban @user
┃✦ Or reply to a message
┗━━❐ *${botName}* ❐`,
                quoted: msg
            });
        }

        try {

            const displayName = await resolveDisplay(
                sock,
                chatId,
                target
            );

            // Remove member
            await sock.groupParticipantsUpdate(
                chatId,
                [target],
                'remove'
            );

            await sock.sendMessage(chatId, {
                text:
`┏━━❐ *🚫 BAN* ❐━━
┃✦ User   : ${displayName}
┃✦ Status : ✅ Removed from Group
┗━━❐ *${botName}* ❐`,
                quoted: msg
            });

        } catch (error) {

            const reason =
                /not-authorized|forbidden/i.test(
                    error.message || ''
                )
                    ? 'Bot is not an admin — promote the bot first'
                    : (error.message || 'Unknown error');

            await sock.sendMessage(chatId, {
                text:
`┏━━❐ *🚫 BAN* ❐━━
┃✦ Status : ❌ Failed
┃✦ Reason : ${reason}
┗━━❐ *${botName}* ❐`,
                quoted: msg
            });
        }
    }
};
