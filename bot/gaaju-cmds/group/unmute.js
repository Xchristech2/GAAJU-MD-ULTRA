'use strict';

const {
    getBotName
} = require('../../lib/botname');

module.exports = {
    name: 'unmute',
    aliases: ['open', 'unlock', 'unlockgroup', 'unmutegrp'],
    description: 'Unmute the group — all members can send messages (sudo/admin only)',
    category: 'group',

    async execute(sock, msg, args, prefix, ctx) {

        const chatId = msg.key.remoteJid;
        const botName = getBotName();

        // Small reaction
        try {
            await sock.sendMessage(chatId, {
                react: {
                    text: '🔊',
                    key: msg.key
                }
            });
        } catch {}

        // Group only
        if (!chatId.endsWith('@g.us')) {
            return sock.sendMessage(chatId, {
                text:
`┏━━❐ *🔊 UNMUTE* ❐━━
┃✦ Status : ❌ Group Only
┗━━❐ *${botName}* ❐`,
                quoted: msg
            });
        }

        // Owner / Sudo / Group Admin check
        let hasPrivilege =
            ctx?.isOwnerUser ||
            ctx?.isSudoUser;

        if (!hasPrivilege) {
            try {

                const metadata =
                    await sock.groupMetadata(chatId);

                const sender =
                    msg.key.participant ||
                    msg.key.remoteJid ||
                    '';

                const senderClean =
                    sender.replace(/:[0-9]+@/, '@');

                const senderNumber =
                    sender
                        .split('@')[0]
                        .split(':')[0];

                const senderServer =
                    sender.split('@')[1] || '';

                hasPrivilege =
                    metadata.participants.some(participant => {

                        if (
                            participant.admin !== 'admin' &&
                            participant.admin !== 'superadmin'
                        ) {
                            return false;
                        }

                        const id =
                            participant.id || '';

                        const idServer =
                            id.split('@')[1] || '';

                        const idClean =
                            id.replace(/:[0-9]+@/, '@');

                        const idNumber =
                            id
                                .split('@')[0]
                                .split(':')[0];

                        return (
                            id === sender ||
                            idClean === senderClean ||
                            (
                                idNumber === senderNumber &&
                                senderNumber.length >= 5 &&
                                idServer === senderServer
                            )
                        );
                    });

            } catch {}
        }

        if (!hasPrivilege) {
            return sock.sendMessage(chatId, {
                text:
`┏━━❐ *🔊 UNMUTE* ❐━━
┃✦ Status : ❌ Permission Denied
┃✦ Reason : Sudo Users & Group Admins Only
┗━━❐ *${botName}* ❐`,
                quoted: msg
            });
        }

        try {

            const metadata =
                await sock.groupMetadata(chatId);

            await sock.groupSettingUpdate(
                chatId,
                'not_announcement'
            );

            await sock.sendMessage(chatId, {
                text:
`┏━━❐ *🔊 UNMUTE* ❐━━
┃✦ Group  : ${metadata.subject}
┃✦ Status : 🔊 Group Unmuted
┃✦ Effect : All members can now send messages
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
`┏━━❐ *🔊 UNMUTE* ❐━━
┃✦ Status : ❌ Failed
┃✦ Reason : ${reason}
┗━━❐ *${botName}* ❐`,
                quoted: msg
            });
        }
    }
};
