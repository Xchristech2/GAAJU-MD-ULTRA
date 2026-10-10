'use strict';

const fs = require('fs');
const path = require('path');
const { getBotName } = require('../../lib/botname');

let giftedBtns;

try {
    giftedBtns = require('wolfbtns');
} catch {}

const CONTACT_FILE = path.join(
    process.cwd(),
    'bot_owner_contact.json'
);

const DEFAULT_OWNER_NUMBER = '2348069675806';

function getOwnerContact() {
    try {
        if (fs.existsSync(CONTACT_FILE)) {
            const data = JSON.parse(
                fs.readFileSync(CONTACT_FILE, 'utf8')
            );

            if (data.number) {
                const number = String(data.number).replace(/\D/g, '');

                if (number.length >= 7) {
                    return number;
                }
            }
        }
    } catch (error) {
        console.error('[OWNER] Contact file error:', error.message);
    }

    return DEFAULT_OWNER_NUMBER;
}

function saveOwnerContact(number) {
    fs.writeFileSync(
        CONTACT_FILE,
        JSON.stringify({ number }, null, 2),
        'utf8'
    );
}

function getOwnerName() {
    try {
        const cfg = require('../../config');
        return cfg.OWNER_NAME || 'Chris Gaaju';
    } catch {
        return 'Chris Gaaju';
    }
}

function getBotDisplayName() {
    try {
        return getBotName() || 'GAAJU-MD-ULTRA';
    } catch {
        return 'GAAJU-MD-ULTRA';
    }
}

function normalizePhone(raw) {
    return String(raw || '').replace(/\D/g, '');
}

module.exports = {
    name: 'gaaju',
    aliases: ['creator', 'dev', 'developer'],
    description: 'Show or update bot owner contact',
    category: 'owner',
    ownerOnly: false,

    async execute(sock, msg, args, prefix, extra = {}) {
        const jid = msg.key.remoteJid;

        const send = (text, options = {}) =>
            sock.sendMessage(
                jid,
                { text, ...options },
                { quoted: msg }
            );

        const jidManager = extra.jidManager;

        let isOwner = false;
        let isSudo = false;

        try {
            isOwner =
                typeof jidManager?.isOwner === 'function' &&
                jidManager.isOwner(msg);

            isSudo =
                typeof extra.isSudo === 'function' &&
                await extra.isSudo();
        } catch (error) {
            console.error('[OWNER] Permission check error:', error.message);
        }

        // Update the owner contact when a number is supplied.
        if (args[0]) {
            if (!isOwner && !isSudo) {
                return send(
                    '❌ *OWNER ONLY*\n\nOnly the bot owner or an authorized sudo user can update the owner contact.'
                );
            }

            const newNumber = normalizePhone(args[0]);

            if (newNumber.length < 10 || newNumber.length > 15) {
                return send(
                    `❌ *INVALID PHONE NUMBER*\n\n` +
                    `Example: ${prefix}owner 2348069675806`
                );
            }

            try {
                saveOwnerContact(newNumber);

                return send(
                    `✅ *OWNER CONTACT UPDATED*\n\n` +
                    `📱 Number: +${newNumber}\n\n` +
                    `_Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ_`
                );
            } catch (error) {
                console.error('[OWNER] Save error:', error);

                return send(
                    '❌ Could not save the owner contact. Check file permissions.'
                );
            }
        }

        const ownerNumber = getOwnerContact();
        const ownerName = getOwnerName();
        const botName = getBotDisplayName();

        try {
            await sock.sendMessage(jid, {
                react: {
                    text: '👑',
                    key: msg.key
                }
            });
        } catch {}

        const vcard =
            'BEGIN:VCARD\r\n' +
            'VERSION:3.0\r\n' +
            `FN:${ownerName} (Bot Owner)\r\n` +
            `ORG:${botName}\r\n` +
            `TEL;type=CELL;type=VOICE;waid=${ownerNumber}:+${ownerNumber}\r\n` +
            'END:VCARD';

        // Interactive buttons when wolfbtns is installed.
        if (giftedBtns?.sendInteractiveMessage) {
            try {
                await giftedBtns.sendInteractiveMessage(sock, jid, {
                    text:
                        `👑 *${botName} OWNER*\n\n` +
                        `👤 *Name:* ${ownerName}\n` +
                        `📱 *Number:* +${ownerNumber}`,
                    footer: `Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ`,
                    interactiveButtons: [
                        {
                            name: 'cta_copy',
                            buttonParamsJson: JSON.stringify({
                                display_text: '📋 Copy Number',
                                copy_code: `+${ownerNumber}`
                            })
                        },
                        {
                            name: 'cta_url',
                            buttonParamsJson: JSON.stringify({
                                display_text: '💬 Message Owner',
                                url: `https://wa.me/${ownerNumber}`
                            })
                        }
                    ]
                });

                await sock.sendMessage(
                    jid,
                    {
                        contacts: {
                            displayName: `${ownerName} (Bot Owner)`,
                            contacts: [{ vcard }]
                        }
                    },
                    { quoted: msg }
                );

                return;
            } catch (error) {
                console.error(
                    '[OWNER] Interactive buttons unavailable:',
                    error.message
                );
            }
        }

        // Fallback when wolfbtns is unavailable.
        await send(
            `👑 *${botName} OWNER*\n\n` +
            `👤 *Name:* ${ownerName}\n` +
            `📱 *Number:* +${ownerNumber}\n\n` +
            `💬 *Message Owner:*\n` +
            `https://wa.me/${ownerNumber}\n\n` +
            `_Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ_`
        );

        await sock.sendMessage(
            jid,
            {
                contacts: {
                    displayName: `${ownerName} (Bot Owner)`,
                    contacts: [{ vcard }]
                }
            },
            { quoted: msg }
        );
    }
};
