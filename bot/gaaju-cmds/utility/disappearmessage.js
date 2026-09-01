'use strict';

const { getBotName } = require('../../lib/botname');

function parseDuration(input) {
    if (!input) return null;

    const match = String(input)
        .trim()
        .toLowerCase()
        .match(/^(\d+(?:\.\d+)?)(ms|s|m|h|d)?$/);

    if (!match) return null;

    const value = Number(match[1]);
    const unit = match[2] || 's';

    const multipliers = {
        ms: 1,
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000
    };

    const milliseconds = value * multipliers[unit];

    if (
        !Number.isFinite(milliseconds) ||
        milliseconds < 1000 ||
        milliseconds > 2147483647
    ) {
        return null;
    }

    return {
        milliseconds,
        display: `${value}${unit}`
    };
}

module.exports = {
    name: 'disappearmessage',

    aliases: [],

    description:
        'Send a message that automatically disappears after a set time',

    category: 'utility',

    async execute(sock, msg, args) {
        const chatId = msg.key.remoteJid;
        const botName = getBotName();

        if (!chatId) return;

        if (!args || !args[0]) {
            return sock.sendMessage(
                chatId,
                {
                    text:
                        `┏━━❐ *DISAPPEAR MESSAGE* ❐━━\n` +
                        `┃\n` +
                        `┃✦ Usage: *.disappearmessage <time>*\n` +
                        `┃\n` +
                        `┃✦ Examples:\n` +
                        `┃  • *.disappearmessage 10*\n` +
                        `┃  • *.disappearmessage 10s*\n` +
                        `┃  • *.disappearmessage 5m*\n` +
                        `┃  • *.disappearmessage 1h*\n` +
                        `┃  • *.disappearmessage 1d*\n` +
                        `┃\n` +
                        `┃✦ Number without a unit = seconds\n` +
                        `┃✦ Units: ms, s, m, h, d\n` +
                        `┃\n` +
                        `┗━━❐ *${botName}* ❐`
                },
                { quoted: msg }
            );
        }

        const duration = parseDuration(args[0]);

        if (!duration) {
            return sock.sendMessage(
                chatId,
                {
                    text:
                        `┏━━❐ *DISAPPEAR MESSAGE* ❐━━\n` +
                        `┃\n` +
                        `┃✦ Status: ❌ Invalid time\n` +
                        `┃\n` +
                        `┃✦ Use examples like:\n` +
                        `┃  • 10s\n` +
                        `┃  • 5m\n` +
                        `┃  • 1h\n` +
                        `┃  • 1d\n` +
                        `┃\n` +
                        `┃✦ A plain number means seconds.\n` +
                        `┃\n` +
                        `┗━━❐ *${botName}* ❐`
                },
                { quoted: msg }
            );
        }

        try {
            const sentMessage = await sock.sendMessage(
                chatId,
                {
                    text:
                        `┏━━❐ *DISAPPEAR MESSAGE* ❐━━\n` +
                        `┃\n` +
                        `┃✦ Timer: *${duration.display}*\n` +
                        `┃✦ Status: ⏳ This message will disappear automatically.\n` +
                        `┃\n` +
                        `┗━━❐ *${botName}* ❐`
                },
                { quoted: msg }
            );

            setTimeout(async () => {
                try {
                    if (sentMessage?.key) {
                        await sock.sendMessage(chatId, {
                            delete: sentMessage.key
                        });
                    }
                } catch (error) {
                    console.error(
                        '[DISAPPEARMESSAGE DELETE ERROR]',
                        error
                    );
                }
            }, duration.milliseconds);

        } catch (error) {
            console.error(
                '[DISAPPEARMESSAGE ERROR]',
                error
            );

            await sock.sendMessage(
                chatId,
                {
                    text:
                        `┏━━❐ *DISAPPEAR MESSAGE* ❐━━\n` +
                        `┃\n` +
                        `┃✦ Status: ❌ Failed to send message\n` +
                        `┃\n` +
                        `┗━━❐ *${botName}* ❐`
                },
                { quoted: msg }
            );
        }
    }
};
