'use strict';

const { getBotName } = require('../../lib/botname');

module.exports = {
    name: 'mute',
    aliases: ['close', 'lock', 'lockgroup', 'mutegrp'],
    description: 'Mute the group — only admins can send messages (sudo/admin only)',
    category: 'group',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const name = getBotName();

        try {
            await sock.sendMessage(chatId, {
                react: {
                    text: '🔇',
                    key: msg.key
                }
            });
        } catch {}

        if (!chatId.endsWith('@g.us')) {
            return sock.sendMessage(chatId, {
                text:
`┏━━❐ *🔇 MUTE* ❐━━
┃✦ Status : ❌ Group Only
┗━━❐ *${name}* ❐`
            }, { quoted: msg });
        }

        // — permission check (sender) —
        let isPrivileged =
            ctx?.isOwnerUser ||
            ctx?.isSudoUser;

        if (!isPrivileged) {
            try {
                const meta =
                    await sock.groupMetadata(chatId);

                const rawJid =
                    msg.key.participant ||
                    msg.key.remoteJid ||
                    '';

                const bareJid =
                    rawJid.replace(/:[\d]+@/, '@');

                const numPart =
                    rawJid.split('@')[0].split(':')[0];

                const rawDomain =
                    rawJid.split('@')[1] || '';

                isPrivileged =
                    meta.participants.some(p => {

                        if (
                            p.admin !== 'admin' &&
                            p.admin !== 'superadmin'
                        ) {
                            return false;
                        }

                        const pId =
                            p.id || '';

                        const pDomain =
                            pId.split('@')[1] || '';

                        const pBare =
                            pId.replace(/:[\d]+@/, '@');

                        const pNum =
                            pId.split('@')[0].split(':')[0];

                        return (
                            pId === rawJid ||
                            pBare === bareJid ||
                            (
                                pNum === numPart &&
                                numPart.length >= 5 &&
                                pDomain === rawDomain
                            )
                        );
                    });

            } catch {}
        }

        if (!isPrivileged) {
            return sock.sendMessage(chatId, {
                text:
`┏━━❐ *🔇 MUTE* ❐━━
┃✦ Status : ❌ Permission Denied
┃✦ Reason : Sudo Users & Group Admins Only
┗━━❐ *${name}* ❐`
            }, { quoted: msg });
        }

        // — execute —
        try {
            const meta =
                await sock.groupMetadata(chatId);

            await sock.groupSettingUpdate(
                chatId,
                'announcement'
            );

            await sock.sendMessage(chatId, {
                text:
`┏━━❐ *🔇 MUTE* ❐━━
┃✦ Group  : ${meta.subject}
┃✦ Status : 🔇 Group Muted
┃✦ Effect : Only admins can send messages
┗━━❐ *${name}* ❐`
            }, { quoted: msg });

        } catch (e) {

            const reason =
                /not-authorized|forbidden/i.test(
                    e.message || ''
                )
                    ? 'Bot is not an admin — promote the bot first'
                    : e.message;

            await sock.sendMessage(chatId, {
                text:
`┏━━❐ *🔇 MUTE* ❐━━
┃✦ Status : ❌ Failed
┃✦ Reason : ${reason}
┗━━❐ *${name}* ❐`
            }, { quoted: msg });
        }
    }
};
