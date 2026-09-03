'use strict';

const { getBotName } = require('../../lib/botname');

module.exports = {
    name: 'closetime',

    aliases: ['autoclose', 'closeafter', 'timedclose'],

    description: 'Automatically close the group after a specified time',

    category: 'group',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const name = getBotName();

        // Reaction
        try {
            await sock.sendMessage(chatId, {
                react: {
                    text: '🔒',
                    key: msg.key
                }
            });
        } catch {}

        // Group only
        if (!chatId || !chatId.endsWith('@g.us')) {
            return sock.sendMessage(
                chatId,
                {
                    text:
`┏━━❐ *🔒 CLOSETIME* ❐━━
┃
┃✦ *Status:* ❌ Group only
┃
┗━━❐ *${name}* ❐`
                },
                { quoted: msg }
            );
        }

        // Check permission
        let isPrivileged = ctx?.isOwnerUser || ctx?.isSudoUser;

        if (!isPrivileged) {
            try {
                const meta = await sock.groupMetadata(chatId);

                const rawJid =
                    msg.key.participant ||
                    msg.key.remoteJid ||
                    '';

                const bareJid = rawJid.replace(/:[\d]+@/, '@');
                const numPart =
                    rawJid.split('@')[0].split(':')[0];

                const rawDomain =
                    rawJid.split('@')[1] || '';

                isPrivileged = meta.participants.some(p => {
                    if (
                        p.admin !== 'admin' &&
                        p.admin !== 'superadmin'
                    ) {
                        return false;
                    }

                    const pId = p.id || '';
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
            return sock.sendMessage(
                chatId,
                {
                    text:
`┏━━❐ *🔒 CLOSETIME* ❐━━
┃
┃✦ *Status:* ❌ Permission denied
┃✦ *Reason:* Sudo users and group admins only
┃
┗━━❐ *${name}* ❐`
                },
                { quoted: msg }
            );
        }

        // Get duration
        const input = args[0];

        if (!input) {
            return sock.sendMessage(
                chatId,
                {
                    text:
`┏━━❐ *🔒 CLOSETIME* ❐━━
┃
┃✦ *Usage:* ${prefix}closetime 10m
┃
┃✦ *Examples:*
┃  • ${prefix}closetime 30s
┃  • ${prefix}closetime 10m
┃  • ${prefix}closetime 2h
┃  • ${prefix}closetime 1h30m
┃  • ${prefix}closetime 1d
┃
┗━━❐ *${name}* ❐`
                },
                { quoted: msg }
            );
        }

        // Parse duration
        function parseDuration(value) {
            const text = String(value)
                .toLowerCase()
                .replace(/\s+/g, '');

            const regex =
                /^(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/;

            const match = text.match(regex);

            if (!match || !match[0] || !/[dhms]/.test(text)) {
                return null;
            }

            const days = Number(match[1] || 0);
            const hours = Number(match[2] || 0);
            const minutes = Number(match[3] || 0);
            const seconds = Number(match[4] || 0);

            const total =
                (days * 24 * 60 * 60) +
                (hours * 60 * 60) +
                (minutes * 60) +
                seconds;

            if (total <= 0) {
                return null;
            }

            return total * 1000;
        }

        const duration = parseDuration(input);

        if (!duration) {
            return sock.sendMessage(
                chatId,
                {
                    text:
`┏━━❐ *🔒 CLOSETIME* ❐━━
┃
┃✦ *Status:* ❌ Invalid time
┃
┃✦ *Use:* 30s, 10m, 2h, 1h30m or 1d
┃
┗━━❐ *${name}* ❐`
                },
                { quoted: msg }
            );
        }

        // Make sure the bot is admin
        let meta;

        try {
            meta = await sock.groupMetadata(chatId);

            const botJid =
                sock.user?.id?.replace(/:[\d]+@/, '@');

            const botNumber =
                botJid?.split('@')[0];

            const botParticipant =
                meta.participants.find(p => {
                    const pNumber =
                        (p.id || '')
                            .split('@')[0]
                            .split(':')[0];

                    return pNumber === botNumber;
                });

            if (
                !botParticipant ||
                (
                    botParticipant.admin !== 'admin' &&
                    botParticipant.admin !== 'superadmin'
                )
            ) {
                return sock.sendMessage(
                    chatId,
                    {
                        text:
`┏━━❐ *🔒 CLOSETIME* ❐━━
┃
┃✦ *Status:* ❌ Bot is not an admin
┃✦ *Reason:* Promote the bot first
┃
┗━━❐ *${name}* ❐`
                    },
                    { quoted: msg }
                );
            }
        } catch (error) {
            return sock.sendMessage(
                chatId,
                {
                    text:
`┏━━❐ *🔒 CLOSETIME* ❐━━
┃
┃✦ *Status:* ❌ Failed
┃✦ *Reason:* ${error.message}
┃
┗━━❐ *${name}* ❐`
                },
                { quoted: msg }
            );
        }

        // Prevent overlapping timers for the same group
        globalThis._gaajuCloseTimers =
            globalThis._gaajuCloseTimers || {};

        if (globalThis._gaajuCloseTimers[chatId]) {
            clearTimeout(
                globalThis._gaajuCloseTimers[chatId]
            );
        }

        // Convert milliseconds to readable time
        function formatDuration(ms) {
            const totalSeconds =
                Math.floor(ms / 1000);

            const days =
                Math.floor(totalSeconds / 86400);

            const hours =
                Math.floor((totalSeconds % 86400) / 3600);

            const minutes =
                Math.floor((totalSeconds % 3600) / 60);

            const seconds =
                totalSeconds % 60;

            const parts = [];

            if (days) parts.push(`${days}d`);
            if (hours) parts.push(`${hours}h`);
            if (minutes) parts.push(`${minutes}m`);
            if (seconds) parts.push(`${seconds}s`);

            return parts.join(' ');
        }

        const readableTime =
            formatDuration(duration);

        // Tell group
        try {
            await sock.sendMessage(
                chatId,
                {
                    text:
`┏━━❐ *🔒 CLOSETIME* ❐━━
┃
┃✦ *Status:* ⏳ Timer started
┃✦ *Closes in:* ${readableTime}
┃✦ *Effect:* Only admins will be able to send messages
┃
┗━━❐ *${name}* ❐`
                },
                { quoted: msg }
            );
        } catch {}

        // Start timer
        globalThis._gaajuCloseTimers[chatId] =
            setTimeout(async () => {
                try {
                    await sock.groupSettingUpdate(
                        chatId,
                        'announcement'
                    );

                    await sock.sendMessage(
                        chatId,
                        {
                            text:
`┏━━❐ *🔒 CLOSETIME* ❐━━
┃
┃✦ *Status:* 🔒 Group closed
┃✦ *Effect:* Only admins can send messages
┃
┗━━❐ *${name}* ❐

> ⚡ Powered by Chris Gaaju 🔥`
                        }
                    );
                } catch (error) {
                    console.error(
                        '[CLOSETIME ERROR]',
                        error
                    );
                }

                delete globalThis._gaajuCloseTimers[chatId];

            }, duration);
    }
};
