'use strict';

/*
|--------------------------------------------------------------------------
| GAAJU-MD ULTRA
| BLOCK COMMAND
|--------------------------------------------------------------------------
|
| DM:
|   .block
|
| Group:
|   .block @user
|   OR reply to a user's message with .block
|
|--------------------------------------------------------------------------
*/

const cfg = require('../../config');

function normalizeNumber(jid) {
    if (!jid) return null;

    return String(jid)
        .split(':')[0]
        .split('@')[0]
        .replace(/\D/g, '');
}

function getOwnerNumbers() {
    const owners = [];

    if (cfg.OWNER_NUMBER) {
        owners.push(
            normalizeNumber(cfg.OWNER_NUMBER)
        );
    }

    if (Array.isArray(cfg.OWNER_NUMBERS)) {
        for (const number of cfg.OWNER_NUMBERS) {
            owners.push(
                normalizeNumber(number)
            );
        }
    }

    if (Array.isArray(cfg.OWNER)) {
        for (const number of cfg.OWNER) {
            owners.push(
                normalizeNumber(number)
            );
        }
    }

    return [
        ...new Set(
            owners.filter(Boolean)
        )
    ];
}

function isOwner(msg) {
    const sender =
        msg?.key?.participant ||
        msg?.key?.remoteJid;

    const senderNumber =
        normalizeNumber(sender);

    if (!senderNumber) {
        return false;
    }

    return getOwnerNumbers().includes(
        senderNumber
    );
}

function getTarget(msg) {
    const remoteJid =
        msg?.key?.remoteJid;

    /*
     * PRIVATE CHAT
     *
     * .block
     *
     * Blocks the person whose DM
     * the command was sent in.
     */
    if (
        remoteJid &&
        remoteJid.endsWith(
            '@s.whatsapp.net'
        )
    ) {
        return remoteJid;
    }

    /*
     * GROUP CHAT
     *
     * First check replied message.
     */
    const context =
        msg?.message
            ?.extendedTextMessage
            ?.contextInfo;

    if (
        context?.participant &&
        context.participant.endsWith(
            '@s.whatsapp.net'
        )
    ) {
        return context.participant;
    }

    /*
     * GROUP CHAT
     *
     * Then check @mention.
     */
    if (
        Array.isArray(
            context?.mentionedJid
        ) &&
        context.mentionedJid.length
    ) {
        return context.mentionedJid[0];
    }

    return null;
}

module.exports = {

    name: 'block',

    aliases: [
        'blockuser'
    ],

    description:
        'Block a WhatsApp user',

    category: 'owner',

    ownerOnly: true,

    async execute(
        sock,
        msg,
        args,
        prefix,
        ctx
    ) {

        const chatId =
            msg.key.remoteJid;

        try {

            /*
             * OWNER CHECK
             */
            if (!isOwner(msg)) {

                await sock.sendMessage(
                    chatId,
                    {
                        text:
                            '❌ Only the bot owner can use this command.'
                    },
                    {
                        quoted: msg
                    }
                );

                return;
            }

            /*
             * GET TARGET
             */
            const target =
                getTarget(msg);

            if (!target) {

                const p =
                    prefix ||
                    cfg.PREFIX ||
                    '.';

                await sock.sendMessage(
                    chatId,
                    {
                        text:
                            `❌ *No user found.*\n\n` +
                            `📱 DM:\n` +
                            `${p}block\n\n` +
                            `👥 Group:\n` +
                            `${p}block @user\n\n` +
                            `Or reply to a user's message with:\n` +
                            `${p}block`
                    },
                    {
                        quoted: msg
                    }
                );

                return;
            }

            const targetNumber =
                normalizeNumber(target);

            if (!targetNumber) {

                await sock.sendMessage(
                    chatId,
                    {
                        text:
                            '❌ Invalid WhatsApp user.'
                    },
                    {
                        quoted: msg
                    }
                );

                return;
            }

            /*
             * PREVENT BLOCKING THE BOT ITSELF
             */
            const botNumber =
                normalizeNumber(
                    sock.user?.id
                );

            if (
                botNumber &&
                targetNumber === botNumber
            ) {

                await sock.sendMessage(
                    chatId,
                    {
                        text:
                            '❌ I cannot block myself.'
                    },
                    {
                        quoted: msg
                    }
                );

                return;
            }

            /*
             * BLOCK USER
             */
            await sock.updateBlockStatus(
                target,
                'block'
            );

            /*
             * SUCCESS
             */
            await sock.sendMessage(
                chatId,
                {
                    text:
                        `🚫 *USER BLOCKED*\n\n` +
                        `👤 Number: +${targetNumber}\n` +
                        `✅ Status: Blocked\n\n` +
                        `> Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ`
                },
                {
                    quoted: msg
                }
            );

            console.log(
                `[BLOCK] +${targetNumber} blocked`
            );

        } catch (error) {

            console.error(
                '[BLOCK ERROR]',
                error
            );

            try {

                await sock.sendMessage(
                    chatId,
                    {
                        text:
                            `❌ *Failed to block user.*\n\n` +
                            `${error.message}`
                    },
                    {
                        quoted: msg
                    }
                );

            } catch {}
        }
    }
};
