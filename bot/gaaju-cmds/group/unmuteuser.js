'use strict';

const { getBotName } = require('../../lib/botname');

function getTargetJid(msg, args) {
    const quotedParticipant =
        msg?.message?.extendedTextMessage?.contextInfo
            ?.participant;

    if (quotedParticipant) {
        return quotedParticipant;
    }

    const mentioned =
        msg?.message?.extendedTextMessage?.contextInfo
            ?.mentionedJid;

    if (mentioned && mentioned.length > 0) {
        return mentioned[0];
    }

    const number =
        String(args?.[0] || '')
            .replace(/\D/g, '');

    if (number.length >= 7) {
        return `${number}@s.whatsapp.net`;
    }

    return null;
}

module.exports = {
    name: 'unmuteuser',

    aliases: [
        'unmute'
    ],

    description:
        'Allow a muted user to use the bot again',

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
`┏━━❐ 🔊 UNMUTE USER ❐
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
`┏━━❐ 🔊 UNMUTE USER ❐
┃
┃ ❌ Mention, reply to, or
┃    provide the user's number.
┃
┃ Usage:
┃ ✦ ${p}unmuteuser @user
┃
┃ Or reply to their message:
┃ ✦ ${p}unmuteuser
┃
┗━━❐
⚡ ${botName}`
                },
                { quoted: msg }
            );
        }

        const mutedUsers =
            globalThis._botMutedUsers?.get(jid);

        if (!mutedUsers || !mutedUsers.has(target)) {
            return sock.sendMessage(
                jid,
                {
                    text:
`┏━━❐ 🔊 UNMUTE USER ❐
┃
┃ ⚠️ This user is not muted.
┃
┗━━❐
⚡ ${botName}`
                },
                { quoted: msg }
            );
        }

        mutedUsers.delete(target);

        if (mutedUsers.size === 0) {
            globalThis._botMutedUsers.delete(jid);
        }

        return sock.sendMessage(
            jid,
            {
                text:
`╭━━━〔 🔊 UNMUTE USER 〕━━━╮
┃
┃ 👤 User   : @${target.split('@')[0]}
┃
┃ ✅ Status : UNMUTED
┃
┃ 🎉 This user can now use
┃    GAAJU-MD-ULTRA commands
┃    again in this group.
┃
╰━━━━━━━━━━━━━━━━━━━━╯

⚡ ${botName}`,

                mentions: [target]
            },
            { quoted: msg }
        );
    }
};
