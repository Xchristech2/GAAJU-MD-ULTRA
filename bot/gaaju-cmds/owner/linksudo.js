'use strict';

const {
    getSudoList,
    mapLidToPhone,
    isSudoNumber
} = require('../../lib/sudo-store.js');

function resolveRealNumber(participant, sock) {
    if (!participant) return null;

    const jid = typeof participant === 'string'
        ? participant
        : participant.id || participant.jid || '';

    const lid = typeof participant === 'string'
        ? null
        : participant.lid || null;

    if (jid && !jid.includes('@lid')) {
        const number = jid.split('@')[0]
            .split(':')[0]
            .replace(/\D/g, '');

        if (number.length >= 7 && number.length <= 15) {
            return number;
        }
    }

    const targetLid = lid || (
        jid.includes('@lid') ? jid : null
    );

    if (targetLid && sock?.signalRepository?.lidMapping?.getPNForLID) {
        try {
            const result = sock.signalRepository.lidMapping
                .getPNForLID(targetLid);

            if (result && typeof result.then !== 'function') {
                const number = String(result)
                    .split('@')[0]
                    .split(':')[0]
                    .replace(/\D/g, '');

                if (number.length >= 7 && number.length <= 15) {
                    return number;
                }
            }
        } catch (error) {
            console.warn('[LINKSUDO] LID lookup failed:', error.message);
        }
    }

    return null;
}

function getQuotedParticipant(msg) {
    const message = msg.message || {};

    for (const key of Object.keys(message)) {
        const context = message[key]?.contextInfo;

        if (context?.participant) {
            return context.participant;
        }
    }

    return null;
}

function getLidNumber(jid) {
    return String(jid || '')
        .split('@')[0]
        .split(':')[0]
        .replace(/\D/g, '');
}

module.exports = {
    name: 'linksudo',
    aliases: ['sudolink'],
    category: 'owner',
    description: 'Link sudo users to their WhatsApp IDs',
    ownerOnly: true,
    sudoAllowed: false,

    async execute(sock, msg, args, prefix, extra) {
        const chatId = msg.key.remoteJid;
        const jidManager = extra?.jidManager;

        const send = (text) => sock.sendMessage(
            chatId,
            { text },
            { quoted: msg }
        );

        let isOwner = false;

        try {
            isOwner = Boolean(jidManager?.isOwner?.(msg));
        } catch {}

        if (!isOwner) {
            return send('❌ *Owner Only Command!*');
        }

        try {
            const sudoers = (getSudoList()?.sudoers || [])
                .map(number => String(number).replace(/\D/g, ''))
                .filter(Boolean);

            if (!sudoers.length) {
                return send(
`❌ *No Sudo Users Found*

Add a sudo user first:
${prefix}addsudo <number>`
                );
            }

            const quoted = getQuotedParticipant(msg);
            const isGroup = chatId.endsWith('@g.us');

            if (quoted) {
                const resolved = resolveRealNumber(quoted, sock);
                const targetPhone = String(args?.[0] || '')
                    .replace(/\D/g, '');

                if (resolved) {
                    if (!isSudoNumber(resolved)) {
                        return send(
`❌ *Not a Sudo User*

Number: +${resolved}

Add them first:
${prefix}addsudo ${resolved}`
                        );
                    }

                    if (quoted.includes('@lid')) {
                        const lidNumber = getLidNumber(quoted);

                        if (lidNumber && lidNumber !== resolved) {
                            mapLidToPhone(lidNumber, resolved);
                        }
                    }

                    return send(
`✅ *Sudo User Verified*

Number: +${resolved}
Status: Verified successfully.`
                    );
                }

                if (targetPhone.length >= 7 && targetPhone.length <= 15) {
                    if (!isSudoNumber(targetPhone)) {
                        return send(
`❌ *Not a Sudo User*

Add them first:
${prefix}addsudo ${targetPhone}`
                        );
                    }

                    if (!quoted.includes('@lid')) {
                        return send(
                            '❌ Could not resolve the WhatsApp ID. Reply to the sudo user’s message and try again.'
                        );
                    }

                    const lidNumber = getLidNumber(quoted);

                    if (!lidNumber) {
                        return send('❌ Could not read the WhatsApp LID.');
                    }

                    mapLidToPhone(lidNumber, targetPhone);

                    return send(
`✅ *Sudo Link Saved*

Number: +${targetPhone}
WhatsApp LID: ${lidNumber}`
                    );
                }

                return send(
`*Manual Sudo Linking*

Reply to the sudo user's message with:
${prefix}linksudo <number>`
                );
            }

            if (!isGroup) {
                return send(
`*Link Sudo*

In a group:
${prefix}linksudo

Reply to a sudo user's message:
${prefix}linksudo <number>`
                );
            }

            await send('⏳ Scanning group members for sudo users...');

            const metadata = await sock.groupMetadata(chatId);
            const participants = metadata.participants || [];

            let linked = 0;
            const details = [];
            const notFound = [];

            for (const sudoNumber of sudoers) {
                let found = false;

                for (const participant of participants) {
                    const resolved = resolveRealNumber(participant, sock);

                    if (resolved !== sudoNumber) continue;

                    found = true;

                    const participantJid =
                        participant.id || participant.jid || '';

                    const participantLid =
                        participant.lid ||
                        (participantJid.includes('@lid')
                            ? participantJid
                            : null);

                    if (participantLid) {
                        const lidNumber = getLidNumber(participantLid);

                        if (lidNumber && lidNumber !== sudoNumber) {
                            mapLidToPhone(lidNumber, sudoNumber);
                            linked++;
                            details.push(`✅ +${sudoNumber} — Linked`);
                        } else {
                            details.push(`✅ +${sudoNumber} — Already linked`);
                        }
                    } else {
                        details.push(`✅ +${sudoNumber} — Found`);
                    }

                    break;
                }

                if (!found) notFound.push(sudoNumber);
            }

            let result =
`*SUDO LINK SCAN RESULTS*

Group: ${metadata.subject || 'Unknown'}
Members: ${participants.length}
Sudo users: ${sudoers.length}
New links: ${linked}

`;

            if (details.length) {
                result += `*Found Users*\n${details.join('\n')}\n\n`;
            }

            if (notFound.length) {
                result +=
                    `*Not Found in Group*\n${notFound.map(number => `• +${number}`).join('\n')}\n\n`;
            }

            if (linked > 0) {
                result += `✅ ${linked} new mapping(s) saved.`;
            } else if (details.length) {
                result += 'ℹ️ All matched sudo users were already linked.';
            } else {
                result += '⚠️ No sudo users were found in this group.';
            }

            return sock.sendMessage(chatId, { text: result });

        } catch (error) {
            console.error('[LINKSUDO] Error:', error);

            return send(
`❌ *Link Sudo Failed*

${error.message || 'An unexpected error occurred.'}`
            );
        }
    }
};
