'use strict';

const { getBotName } = require('../../lib/botname');
const { mapLidToPhone, getPhoneFromLid } = require('../../lib/sudo-store');

/**
 * Resolve a LID JID to a real phone number using every available method.
 * Priority:
 *   1. p.phoneNumber field from group metadata (most reliable, no extra call needed)
 *   2. global lidPhoneCache (already resolved during this session)
 *   3. sudo-store persisted LID→phone map
 *   4. signalRepository.lidMapping.getPNForLID (WhatsApp's own signal layer)
 */
function resolveLidToPhone(sock, lidJid, participantPhoneNumber) {
    const lidNum = lidJid.split('@')[0].split(':')[0];

    // 1. phoneNumber from group metadata participant object
    if (participantPhoneNumber) {
        const clean = String(participantPhoneNumber).replace(/[^0-9]/g, '');
        if (clean && clean.length >= 7 && clean !== lidNum) {
            try { mapLidToPhone(lidNum, clean); } catch {}
            try { if (globalThis.lidPhoneCache) globalThis.lidPhoneCache.set(lidNum, clean); } catch {}
            return clean;
        }
    }

    // 2. In-memory lidPhoneCache (populated as members send messages)
    try {
        const cached = globalThis.lidPhoneCache?.get(lidNum);
        if (cached && cached !== lidNum) return cached;
    } catch {}

    // 3. sudo-store persisted map
    const stored = getPhoneFromLid(lidNum);
    if (stored && stored !== lidNum) return stored;

    // 4. signalRepository — try multiple LID formats
    if (sock?.signalRepository?.lidMapping?.getPNForLID) {
        const formats = [lidJid, `${lidNum}@lid`, `${lidNum}:0@lid`];
        for (const fmt of formats) {
            try {
                const pn = sock.signalRepository.lidMapping.getPNForLID(fmt);
                if (pn) {
                    const num = String(pn).split('@')[0].replace(/[^0-9]/g, '');
                    if (num && num.length >= 7 && num !== lidNum) {
                        try { mapLidToPhone(lidNum, num); } catch {}
                        try { if (globalThis.lidPhoneCache) globalThis.lidPhoneCache.set(lidNum, num); } catch {}
                        return num;
                    }
                }
            } catch {}
        }
    }

    // Could not resolve — return the raw LID number so at least something shows
    return null;
}

module.exports = {
    name:        'listall',
    aliases:     ['memberlist', 'listmembers', 'members', 'la'],
    description: 'List all group members with real phone numbers — .listall',
    category:    'group',

    async execute(sock, msg, args, prefix) {
        const chatId  = msg.key.remoteJid;
        const botName = getBotName();

        try { await sock.sendMessage(chatId, { react: { text: '📋', key: msg.key } }); } catch {}

        if (!chatId.endsWith('@g.us')) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  📋 MEMBER LIST 〕\n║\n║ ▸ *Status* : ❌ Group only\n║\n╚═|〔 ${botName} 〕`
            }, { quoted: msg });
        }

        try {
            const meta         = await sock.groupMetadata(chatId);
            const participants = meta.participants;
            const totalCount   = participants.length;
            const adminCount   = participants.filter(p => p.admin).length;

            // ── Resolve every member ──────────────────────────────────────────
            const resolved = participants.map(p => {
                const jid      = p.id || '';
                const isLid    = jid.includes('@lid');
                const adminTag = p.admin === 'superadmin' ? '👑' : p.admin === 'admin' ? '⭐' : '👤';
                const sortKey  = p.admin === 'superadmin' ? 0 : p.admin === 'admin' ? 1 : 2;

                if (!isLid) {
                    // Normal phone JID — always has the number
                    const phone = jid.split('@')[0].split(':')[0];
                    return { display: `${adminTag} +${phone}`, sortKey };
                }

                // LID JID — resolve to real phone using all available methods
                const phone = resolveLidToPhone(sock, jid, p.phoneNumber || p.pn || null);
                const display = phone
                    ? `${adminTag} +${phone}`
                    : `${adminTag} ~${jid.split('@')[0].split(':')[0]} (LID)`;

                return { display, sortKey };
            });

            // Admins first, then alphabetical
            resolved.sort((a, b) => a.sortKey - b.sortKey || a.display.localeCompare(b.display));

            const lines = resolved.map((r, i) =>
                `║  ${String(i + 1).padStart(3, ' ')}. ${r.display}`
            );

            const header = [
                `╔═|〔  📋 MEMBER LIST 〕`,
                `║`,
                `║ ▸ *Group*   : ${meta.subject}`,
                `║ ▸ *Members* : ${totalCount}  (👑⭐ Admins: ${adminCount})`,
                `║`,
            ];
            const footer = [
                `║`,
                `║ 👑 = Owner  ⭐ = Admin  👤 = Member`,
                `║ ~xxxx (LID) = number not yet resolved`,
                `║`,
                `╚═|〔 ${botName} 〕`,
            ];

            const fullText = [...header, ...lines, ...footer].join('\n');

            // ── Send as single message or paginate if too long ─────────────────
            if (fullText.length <= 4000) {
                return sock.sendMessage(chatId, { text: fullText }, { quoted: msg });
            }

            // Paginate — split into chunks under 3600 chars
            const CHUNK  = 3600;
            let chunk    = header.join('\n') + '\n';
            let part     = 1;
            let firstMsg = true;

            for (const line of lines) {
                if ((chunk + line + '\n').length > CHUNK) {
                    await sock.sendMessage(chatId, { text: chunk.trim() },
                        firstMsg ? { quoted: msg } : {});
                    firstMsg = false;
                    chunk    = `╔═|〔  📋 MEMBER LIST — part ${++part} 〕\n║\n`;
                    await new Promise(r => setTimeout(r, 700));
                }
                chunk += line + '\n';
            }

            chunk += footer.join('\n');
            await sock.sendMessage(chatId, { text: chunk.trim() },
                firstMsg ? { quoted: msg } : {});

        } catch (err) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  📋 MEMBER LIST 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${err.message}\n║\n╚═|〔 ${botName} 〕`
            }, { quoted: msg });
        }
    }
};
