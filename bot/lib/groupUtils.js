const { getPhoneFromLid } = require('./sudo-store');

function getTarget(msg, args) {
    const ctx = msg.message?.extendedTextMessage?.contextInfo;
    if (ctx?.participant) return ctx.participant;
    const mentions = ctx?.mentionedJid;
    if (mentions?.length) return mentions[0];
    if (args[0]) {
        const num = args[0].replace(/[^0-9]/g, '');
        if (num.length > 6) return `${num}@s.whatsapp.net`;
    }
    return null;
}

async function resolveDisplay(sock, chatId, jid) {
    if (!jid) return 'Unknown';
    if (!jid.endsWith('@lid')) return `+${jid.split('@')[0].split(':')[0]}`;

    const lidNum = jid.split('@')[0].split(':')[0];

    // 1. Signal repository
    if (sock?.signalRepository?.lidMapping?.getPNForLID) {
        try {
            for (const fmt of [jid, `${lidNum}@lid`, `${lidNum}:0@lid`]) {
                const pn = await sock.signalRepository.lidMapping.getPNForLID(fmt);
                if (pn) {
                    const num = String(pn).split(':')[0].split('@')[0].replace(/[^0-9]/g, '');
                    if (num && num !== lidNum && num.length >= 7) return `+${num}`;
                }
            }
        } catch {}
    }

    // 2. Sudo-store cache
    const cached = getPhoneFromLid(lidNum);
    if (cached) return `+${cached}`;

    // 3. Group metadata participant .phoneNumber
    try {
        const meta = await sock.groupMetadata(chatId);
        for (const p of meta.participants) {
            const pLid = (p.id || '').split('@')[0].split(':')[0];
            if (pLid === lidNum && p.phoneNumber) {
                return `+${p.phoneNumber.split('@')[0].split(':')[0]}`;
            }
        }
    } catch {}

    return lidNum;
}

async function resolvePhone(sock, chatId, jid) {
    const display = await resolveDisplay(sock, chatId, jid);
    return display.replace(/[^0-9]/g, '');
}

/**
 * Resolves a JID to a display string that includes the contact's saved name
 * (if available in global.contactNames).
 *
 * Returns e.g. "+2348069675806 ~ *Chris*" or just "+2348069675806".
 *
 * @param {object} sock
 * @param {string} chatId
 * @param {string} jid
 * @returns {Promise<string>}
 */
function _validateName(raw, phone) {
    if (!raw || typeof raw !== 'string') return null;
    const trimmed = raw.trim();
    if (trimmed.length < 2) return null;
    const digits = trimmed.replace(/[^0-9]/g, '');
    if (phone && digits && digits === phone) return null;
    if (/^\+?[\d\s\-()]+$/.test(trimmed)) return null;
    return trimmed;
}

async function resolveDisplayWithName(sock, chatId, jid, notifyHint = null) {
    const display = await resolveDisplay(sock, chatId, jid).catch(() => jid?.split('@')[0]?.split(':')[0] || 'Unknown');
    let name = _lookupName(jid, display);
    const phone = display.replace(/[^0-9]/g, '');

    // Check sock.contacts by direct key lookup
    if (!name && sock?.contacts) {
        const candidates = [jid, `${phone}@s.whatsapp.net`, `${phone}:0@s.whatsapp.net`];
        for (const key of candidates) {
            const c = sock.contacts[key];
            const raw = c?.name || c?.notify || c?.verifiedName;
            const n = _validateName(raw, phone);
            if (n) { name = n; break; }
        }
    }

    // Scan all contacts by matching phone number (catches LID-keyed entries)
    if (!name && phone && sock?.contacts) {
        for (const [cJid, c] of Object.entries(sock.contacts)) {
            const cPhone = cJid.split('@')[0].split(':')[0];
            if (cPhone === phone) {
                const raw = c?.name || c?.notify || c?.verifiedName;
                const n = _validateName(raw, phone);
                if (n) { name = n; break; }
            }
        }
    }

    // Last resort: notifyHint from group participant data (p.notify)
    if (!name && notifyHint) {
        name = _validateName(notifyHint, phone);
    }

    return name ? `${display} ~ *${name}*` : display;
}

/**
 * Look up the saved name for a JID using global.contactNames.
 * Tries: full JID, LID number, phone number.
 * Returns null if no real name is found (filters out number-as-name).
 */
function _lookupName(jid, resolvedDisplay) {
    const cm = global.contactNames;
    if (!cm) return null;

    // Digits of the resolved phone — used to reject "name = phone number"
    const phone = resolvedDisplay ? resolvedDisplay.replace(/[^0-9]/g, '') : '';

    const validate = (val) => {
        if (!val || typeof val !== 'string') return null;
        const trimmed = val.trim();
        if (trimmed.length < 2) return null;
        // Reject if the name is just the phone number (or ends with it)
        const digits = trimmed.replace(/[^0-9]/g, '');
        if (phone && digits && digits === phone) return null;
        // Reject pure numeric strings (another form of number-as-name)
        if (/^\+?[\d\s\-()]+$/.test(trimmed)) return null;
        return trimmed;
    };

    // 1. Full JID (catches LID entries stored by full JID key)
    if (jid && cm.has(jid)) { const n = validate(cm.get(jid)); if (n) return n; }

    // 2. Raw number part of the JID (LID number or phone number)
    const jidNum = jid ? jid.split('@')[0].split(':')[0] : null;
    if (jidNum && cm.has(jidNum)) { const n = validate(cm.get(jidNum)); if (n) return n; }

    // 3. Resolved phone number (e.g. "2348069675806" from "+2348069675806")
    if (phone && cm.has(phone)) { const n = validate(cm.get(phone)); if (n) return n; }

    return null;
}

/**
 * Check if the message sender is privileged (owner, sudo, or group admin).
 *
 * Handles all JID formats:
 *   - Phone JIDs with device suffix  (2348XXXXXXXXX:5@s.whatsapp.net)
 *   - Phone JIDs without device suffix (2348XXXXXXXXX@s.whatsapp.net)
 *   - LID-based JIDs (12345678901@lid)
 *
 * NOTE: Bot admin status is intentionally NOT checked here — participant lookups
 * can fail for LID-based groups.  Commands that need bot admin access should
 * attempt their action and catch the resulting WhatsApp error instead.
 *
 * @returns {{ ok: boolean }}
 */
async function checkPrivilege(sock, chatId, msg, ctx) {
    if (ctx?.isOwnerUser || ctx?.isSudoUser) return { ok: true };

    const rawJid  = msg.key.participant || msg.key.remoteJid || '';
    // Bare JID = strip device suffix, keep domain  e.g. "2348XXXXXXXXX@s.whatsapp.net"
    const bareJid = rawJid.replace(/:[\d]+@/, '@');
    // Numeric part only  e.g. "2348XXXXXXXXX"
    const numPart = rawJid.split('@')[0].split(':')[0];

    const rawDomain = rawJid.split('@')[1] || '';   // e.g. "s.whatsapp.net" or "lid"

    try {
        const meta = await sock.groupMetadata(chatId);
        const ok   = meta.participants.some(p => {
            if (p.admin !== 'admin' && p.admin !== 'superadmin') return false;
            const pId     = p.id || '';
            const pDomain = pId.split('@')[1] || '';
            const pBare   = pId.replace(/:[\d]+@/, '@');
            const pNum    = pId.split('@')[0].split(':')[0];
            return (
                pId   === rawJid  ||   // exact match
                pBare === bareJid ||   // bare JID match (strips device suffix)
                // numeric match ONLY within the same domain — prevents phone↔LID false positives
                (pNum === numPart && numPart.length >= 5 && pDomain === rawDomain)
            );
        });
        return { ok };
    } catch { return { ok: false }; }
}

module.exports = { getTarget, resolveDisplay, resolvePhone, resolveDisplayWithName, checkPrivilege };
