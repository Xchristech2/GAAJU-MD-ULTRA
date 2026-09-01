'use strict';

const { getBotName } = require('../../lib/botname');

function parseDuration(input) {
    if (!input) return null;

    const value = String(input).toLowerCase().replace(/\s+/g, '');

    // Supports: 10s, 10m, 2h, 1d
    // Also supports combinations: 1h30m, 2h10m30s
    const regex = /(\d+(?:\.\d+)?)(s|m|h|d)/g;

    let match;
    let totalMs = 0;
    let matched = false;

    while ((match = regex.exec(value)) !== null) {
        matched = true;

        const amount = Number(match[1]);
        const unit = match[2];

        if (unit === 's') totalMs += amount * 1000;
        if (unit === 'm') totalMs += amount * 60 * 1000;
        if (unit === 'h') totalMs += amount * 60 * 60 * 1000;
        if (unit === 'd') totalMs += amount * 24 * 60 * 60 * 1000;
    }

    if (!matched || totalMs <= 0) return null;

    // Make sure the whole input was valid
    const reconstructed = value.match(/\d+(?:\.\d+)?[smhd]/g)?.join('');

    if (reconstructed !== value) return null;

    return totalMs;
}

function formatDuration(ms) {
    let seconds = Math.floor(ms / 1000);

    const days = Math.floor(seconds / 86400);
    seconds %= 86400;

    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;

    const minutes = Math.floor(seconds / 60);
    seconds %= 60;

    const parts = [];

    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    if (seconds) parts.push(`${seconds}s`);

    return parts.join(' ') || '0s';
}

module.exports = {
    name: 'opentime',

    aliases: [
        'openfor',
        'open'
    ],

    description:
        'Open the group automatically after a specified time',

    category: 'group',

    async execute(sock, msg, args) {
        const chatId = msg.key.remoteJid;
        const botName = getBotName();

        if (!chatId || !chatId.endsWith('@g.us')) {
            return sock.sendMessage(
                chatId,
                {
                    text:
                        `┏━━❐ *OPEN TIME* ❐━━\n` +
                        `┃\n` +
                        `┃✦ Status: ❌ Group only\n` +
                        `┃\n` +
                        `┗━━❐ *${botName}* ❐`
                },
                { quoted: msg }
            );
        }

        const input = args.join('');

        if (!input) {
            return sock.sendMessage(
                chatId,
                {
                    text:
                        `┏━━❐ *OPEN TIME* ❐━━\n` +
                        `┃\n` +
                        `┃✦ Usage:\n` +
                        `┃  • .opentime 10m\n` +
                        `┃  • .opentime 2h\n` +
                        `┃  • .opentime 1h30m\n` +
                        `┃  • .opentime 90s\n` +
                        `┃\n` +
                        `┃✦ Units: s = seconds\n` +
                        `┃✦ m = minutes\n` +
                        `┃✦ h = hours\n` +
                        `┃✦ d = days\n` +
                        `┃\n` +
                        `┗━━❐ *${botName}* ❐`
                },
                { quoted: msg }
            );
        }

        const duration = parseDuration(input);

        if (!duration) {
            return sock.sendMessage(
                chatId,
                {
                    text:
                        `❌ Invalid time format.\n\n` +
                        `Examples:\n` +
                        `• *.opentime 10m*\n` +
                        `• *.opentime 2h*\n` +
                        `• *.opentime 1h30m*\n` +
                        `• *.opentime 90s*`
                },
                { quoted: msg }
            );
        }

        try {
            // Close the group first
            await sock.groupSettingUpdate(
                chatId,
                'announcement'
            );

            await sock.sendMessage(
                chatId,
                {
                    text:
                        `┏━━❐ *OPEN TIME* ❐━━\n` +
                        `┃\n` +
                        `┃✦ Group: *Closed*\n` +
                        `┃✦ Opens in: *${formatDuration(duration)}*\n` +
                        `┃✦ Status: ⏳ Timer started\n` +
                        `┃\n` +
                        `┗━━❐ *${botName}* ❐`
                },
                { quoted: msg }
            );

            setTimeout(async () => {
                try {
                    await sock.groupSettingUpdate(
                        chatId,
                        'not_announcement'
                    );

                    await sock.sendMessage(
                        chatId,
                        {
                            text:
                                `┏━━❐ *OPEN TIME* ❐━━\n` +
                                `┃\n` +
                                `┃✦ Group: *Opened* 🔓\n` +
                                `┃✦ Status: ✅ Everyone can send messages\n` +
                                `┃\n` +
                                `┗━━❐ *${botName}* ❐`
                        }
                    );

                } catch (error) {
                    console.error(
                        '[OPENTIME TIMER ERROR]',
                        error
                    );
                }
            }, duration);

        } catch (error) {
            console.error(
                '[OPENTIME ERROR]',
                error
            );

            await sock.sendMessage(
                chatId,
                {
                    text:
                        `┏━━❐ *OPEN TIME* ❐━━\n` +
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
