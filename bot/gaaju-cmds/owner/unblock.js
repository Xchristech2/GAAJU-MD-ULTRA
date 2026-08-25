'use strict';

/*
 * GAAJU-MD ULTRA
 * Command: .unblock
 */

const cfg = require('../../config');

function cleanNumber(number) {
    return String(number || '')
        .replace(/[^0-9]/g, '');
}

function getJidFromNumber(number) {
    const clean = cleanNumber(number);
    if (!clean) return null;

    return `${clean}@s.whatsapp.net`;
}

function getSenderNumber(msg) {
    const jid =
        msg?.key?.participant ||
        msg?.key?.remoteJid ||
        '';

    return String(jid)
        .split('@')[0]
        .replace(/[^0-9]/g, '');
}

function getOwnerNumbers() {
    const owners = [];

    if (cfg.OWNER_NUMBER) {
        owners.push(
            cleanNumber(cfg.OWNER_NUMBER)
        );
    }

    if (Array.isArray(cfg.OWNER_NUMBERS)) {
        for (const number of cfg.OWNER_NUMBERS) {
            owners.push(
                cleanNumber(number)
            );
        }
    }

    if (Array.isArray(cfg.SUDO)) {
        for (const number of cfg.SUDO) {
            owners.push(
                cleanNumber(number)
            );
        }
    }

    if (Array.isArray(cfg.SUDOS)) {
        for (const number of cfg.SUDOS) {
            owners.push(
                cleanNumber(number)
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
        getSenderNumber(msg);

    return getOwnerNumbers()
        .includes(sender);
}

function getQuotedUser(msg) {
    const context =
        msg?.message?.extendedTextMessage
            ?.contextInfo;

    if (!context) return null;

    const participant =
        context.participant;

    if (
        participant &&
        participant.endsWith('@s.whatsapp.net')
    ) {
        return participant;
    }

    return null;
}

module.exports = {
    name: 'unblock',

    aliases: [
        'unblockuser'
    ],

    description:
        'Unblock a WhatsApp user',

    category: 'owner',

    async execute(
        sock,
        msg,
        args,
        prefix,
        ctx
    ) {
        try {

            if (!isOwner(msg)) {
                return await sock.sendMessage(
                    msg.key.remoteJid,
                    {
                        text:
                            '❌ Only the bot owner can use this command.'
                    },
                    {
                        quoted: msg
                    }
                );
            }

            let targetJid = null;

            /*
             * .unblock 2348012345678
             */
            if (
                args &&
                args.length > 0
            ) {
                targetJid =
                    getJidFromNumber(
                        args[0]
                    );
            }

            /*
             * Or reply to user's message
             */
            if (!targetJid) {
                targetJid =
                    getQuotedUser(msg);
            }

            if (!targetJid) {
                return await sock.sendMessage(
                    msg.key.remoteJid,
                    {
                        text:
                            `❌ Please provide a WhatsApp number.\n\n` +
                            `Example:\n` +
                            `${prefix || '.'}unblock 2348012345678\n\n` +
                            `Or reply to someone's message with:\n` +
                            `${prefix || '.'}unblock`
                    },
                    {
                        quoted: msg
                    }
                );
            }

            await sock.updateBlockStatus(
                targetJid,
                'unblock'
            );

            const number =
                targetJid.split('@')[0];

            await sock.sendMessage(
                msg.key.remoteJid,
                {
                    text:
                        `✅ *USER UNBLOCKED*\n\n` +
                        `👤 Number: +${number}\n` +
                        `🔓 Status: Unblocked\n\n` +
                        `Powered by GAAJU-MD ULTRA`
                },
                {
                    quoted: msg
                }
            );

        } catch (error) {

            console.error(
                '[UNBLOCK COMMAND ERROR]',
                error
            );

            await sock.sendMessage(
                msg.key.remoteJid,
                {
                    text:
                        `❌ Failed to unblock the user.\n\n` +
                        `Error: ${error?.message || error}`
                },
                {
                    quoted: msg
                }
            );
        }
    }
};
