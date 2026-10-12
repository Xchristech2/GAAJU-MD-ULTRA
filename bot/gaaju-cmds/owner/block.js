'use strict';

const cfg = require('../../config');

function cleanNumber(number) {
return String(number || '')
.split('@')[0]
.split(':')[0]
.replace(/\D/g, '');
}

function getJidFromNumber(number) {
const clean = cleanNumber(number);
if (clean.length < 7) return null;
return "${clean}@s.whatsapp.net";
}

function getOwnerNumbers() {
const owners = [];

if (cfg.OWNER_NUMBER) {
    owners.push(cleanNumber(cfg.OWNER_NUMBER));
}

for (const key of ['OWNER_NUMBERS', 'SUDO', 'SUDOS']) {
    if (Array.isArray(cfg[key])) {
        owners.push(...cfg[key].map(cleanNumber));
    }
}

return [...new Set(owners.filter(Boolean))];

}

function getSenderNumber(msg) {
const jid =
msg?.key?.participant ||
msg?.key?.remoteJid ||
'';

return cleanNumber(jid);

}

function isOwner(msg, sock) {
const sender = getSenderNumber(msg);
const botNumber = cleanNumber(sock?.user?.id);

return getOwnerNumbers().includes(sender) ||
    (!!botNumber && sender === botNumber);

}

function getQuotedUser(msg) {
const context =
msg?.message?.extendedTextMessage?.contextInfo;

const participant = context?.participant;

if (
    participant &&
    (
        participant.endsWith('@s.whatsapp.net') ||
        participant.endsWith('@lid')
    )
) {
    return participant;
}

return null;

}

function getTargetFromArgs(args) {
if (!args?.length) return null;

const input = String(args[0] || '').trim();

if (
    input.endsWith('@s.whatsapp.net') ||
    input.endsWith('@lid')
) {
    return input;
}

return getJidFromNumber(input);

}

module.exports = {
name: 'block',
aliases: ['blockuser', 'banuser'],
description: 'Block a WhatsApp user',
category: 'owner',

async execute(sock, msg, args, prefix, ctx) {
    const chatId = msg?.key?.remoteJid;
    if (!chatId) return;

    try {
        // OWNER CHECK
        if (!isOwner(msg, sock)) {
            return await sock.sendMessage(
                chatId,
                { text: '❌ Only the bot owner can use this command.' },
                { quoted: msg }
            );
        }

        let targetJid = getTargetFromArgs(args);

        // Mentioned user
        if (!targetJid) {
            const mentioned =
                msg?.message?.extendedTextMessage
                    ?.contextInfo?.mentionedJid;

            if (Array.isArray(mentioned) && mentioned.length) {
                targetJid = mentioned[0];
            }
        }

        // Replied-to user
        if (!targetJid) {
            targetJid = getQuotedUser(msg);
        }

        // DM: if no number, mention, or quoted user was supplied,
        // block the person whose private chat the command is in.
        if (
            !targetJid &&
            chatId.endsWith('@s.whatsapp.net') &&
            !msg.key.fromMe
        ) {
            targetJid = chatId;
        }

        if (!targetJid) {
            return await sock.sendMessage(
                chatId,
                {
                    text:
                        `❌ Provide a number, mention someone, or reply to their message.\n\n` +
                        `Example: ${prefix || '.'}block 2348012345678`
                },
                { quoted: msg }
            );
        }

        const botJid = sock?.user?.id || '';
        const botNumber = cleanNumber(botJid);
        const targetNumber = cleanNumber(targetJid);

        if (
            targetJid === botJid ||
            (
                targetJid.endsWith('@s.whatsapp.net') &&
                botNumber &&
                targetNumber === botNumber
            )
        ) {
            return await sock.sendMessage(
                chatId,
                { text: '⚠️ You cannot block the bot account itself.' },
                { quoted: msg }
            );
        }

        await sock.updateBlockStatus(targetJid, 'block');

        return await sock.sendMessage(
            chatId,
            {
                text:
                    `✅ *USER BLOCKED*\n\n` +
                    `👤 Number: ${targetNumber || targetJid}\n` +
                    `🚫 Status: Blocked`
            },
            { quoted: msg }
        );

    } catch (error) {
        console.error('[BLOCK COMMAND ERROR]', error?.stack || error);

        return await sock.sendMessage(
            chatId,
            {
                text:
                    `❌ Failed to block the user.\n\n` +
                    `Error: ${error?.message || String(error)}`
            },
            { quoted: msg }
        ).catch(() => {});
    }
}

};
