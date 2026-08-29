'use strict';

const { getBotName } = require('../../lib/botname');

// Global mute registry
if (!globalThis._botMutedUsers) {
    globalThis._botMutedUsers = new Map();
}

function getTargetJid(msg, args) {
    // First try a replied-to message
    const quotedParticipant =
        msg?.message?.extendedTextMessage?.contextInfo
            ?.participant;

    if (quotedParticipant) {
        return quotedParticipant;
    }

    // Then try a mentioned user
    const mentioned =
        msg?.message?.extendedTextMessage?.contextInfo
            ?.mentionedJid;

    if (mentioned && mentioned.length > 0) {
        return mentioned[0];
    }

    // Finally accept a phone number
    const number =
        String(args?.[0] || '')
            .replace(/\D/g, '');

    if (number.length >= 7) {
        return `${number}@s.whatsapp.net`;
    }

    return null;
}

module.exports = {
    name: 'muteuser',

    aliases: [
        'mute'
    ],

    description:
        'Mute a user from using the bot in this group',

    category: 'group',

    async execute(
        sock,
        msg,
        args,
        prefix
    ) {
        const jid =
            msg?.key?.remoteJid;

        const p =
            prefix || '.';

        const botName =
            getBotName();

        if (!jid || !jid.endsWith('@g.us')) {
            return sock.sendMessage(
                jid,
                {
                    text:
`┏━━❐ 🔇 MUTE USER ❐
┃
┃ ❌ This command can only
┃    be used in a group.
┃
┗━━❐
⚡ ${botName}`
                },
                { quoted: msg }
            );
        }

        const target =
            getTargetJid(msg, args);

        if (!target) {
            return sock.sendMessage(
                jid,
                {
                    text:
`┏━━❐ 🔇 MUTE USER ❐
┃
┃ ❌ Mention, reply to, or
┃    provide the number of
┃    the user to mute.
┃
┃ Usage:
┃ ✦ ${p}muteuser @user
┃
┃ Or reply to their message:
┃ ✦ ${p}muteuser
┃
┗━━❐
⚡ ${botName}`
                },
                { quoted: msg }
            );
        }

        if (!globalThis._botMutedUsers.has(jid)) {
            globalThis._botMutedUsers.set(
                jid,
                new Set()
            );
        }

        const mutedUsers =
            globalThis._botMutedUsers.get(jid);

        if (mutedUsers.has(target)) {
            return sock.sendMessage(
                jid,
                {
                    text:
`┏━━❐ 🔇 MUTE USER ❐
┃
┃ ⚠️ This user is already
┃    muted from the bot.
┃
┗━━❐
⚡ ${botName}`
                },
                { quoted: msg }
            );
        }

        mutedUsers.add(target);

        return sock.sendMessage(
            jid,
            {
                text:
`╭━━━〔 🔇 MUTE USER 〕━━━╮
┃
┃ 👤 User   : @${target.split('@')[0]}
┃
┃ 🔇 Status : MUTED
┃
┃ 🚫 This user can no longer
┃    use GAAJU-MD-ULTRA commands
┃    in this group.
┃
╰━━━━━━━━━━━━━━━━━━━━╯

⚡ ${botName}`,

                mentions: [target]
            },
            { quoted: msg }
        );
    }
};
