const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const { get, toggle }          = require('../../lib/autoconfig');
const { getBotName }           = require('../../lib/botname');
const { getPhoneFromLid }      = require('../../lib/sudo-store');
const { storeStatusSender }    = require('../../lib/status-map');
const config                   = require('../../config');

/** Resolve a status participant JID to a real phone number */
function resolveParticipant(jid, sock) {
    if (!jid) return 'unknown';
    const raw = jid.split('@')[0].split(':')[0];
    if (!jid.includes('@lid')) return raw;

    // 1. sudo-store persistent map
    const stored = getPhoneFromLid(raw);
    if (stored) return stored;

    // 2. signal repository
    try {
        const pn = sock?.signalRepository?.lidMapping?.getPNForLID?.(jid)
                || sock?.signalRepository?.lidMapping?.getPNForLID?.(`${raw}@lid`)
                || sock?.signalRepository?.lidMapping?.getPNForLID?.(`${raw}:0@lid`);
        if (pn) {
            const num = String(pn).split('@')[0].replace(/[^0-9]/g, '');
            if (num && num.length >= 7) return num;
        }
    } catch {}

    // 3. contacts
    try {
        for (const key of [`${raw}@lid`, `${raw}:0@lid`]) {
            const c = sock?.contacts?.[key];
            const phone = (c?.phone || c?.number || '').replace(/[^0-9]/g, '');
            if (phone && phone.length >= 7) return phone;
        }
    } catch {}

    return raw;
}

async function handleAutoDownloadStatus(sock, statusKey, resolvedMessage) {
    try {
        const cfg = get('autodownloadstatus');
        if (!cfg?.enabled) return;
        if (!resolvedMessage) return;

        const imgMsg = resolvedMessage.imageMessage;
        const vidMsg = resolvedMessage.videoMessage;
        if (!imgMsg && !vidMsg) return;

        const ownerJid = `${(config.OWNER_NUMBER || '').replace(/[^0-9]/g, '')}@s.whatsapp.net`;
        if (!ownerJid.startsWith('@')) return;

        const syntheticMsg = { key: statusKey, message: resolvedMessage };
        const buf = await downloadMediaMessage(syntheticMsg, 'buffer', {});
        if (!buf?.length) return;

        const senderPhone = resolveParticipant(statusKey.participant || statusKey.remoteJid || '', sock);
        const caption     = `╔═|〔  STATUS SAVED 〕\n║\n║ ▸ *From*  : +${senderPhone}\n║ ▸ *Type*  : ${imgMsg ? '🖼️ Image' : '📹 Video'}\n║\n╚═|〔 ${getBotName()} 〕`;

        let sent;
        if (imgMsg) sent = await sock.sendMessage(ownerJid, { image: buf, caption });
        else        sent = await sock.sendMessage(ownerJid, { video: buf, caption });

        // Store msgId → senderPhone so .save can recover it when caption is stripped
        const sentId = sent?.key?.id;
        if (sentId) storeStatusSender(sentId, senderPhone);

    } catch {}
}

module.exports = {
    handleAutoDownloadStatus,

    name:        'autodownloadstatus',
    aliases:     ['ads', 'autosave', 'autosavestatus'],
    description: 'Auto-download and save status media to your DM',
    category:    'automation',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();

        if (!ctx?.isOwnerUser && !ctx?.isSudoUser) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  AUTO DOWNLOAD STATUS 〕\n║\n║ ▸ *Status* : ❌ Owner only\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }

        toggle('autodownloadstatus');
        const now = get('autodownloadstatus');
        return sock.sendMessage(chatId, {
            text: `╔═|〔  AUTO DOWNLOAD STATUS 〕\n║\n║ ▸ *State* : ${now?.enabled ? '✅ Enabled' : '❌ Disabled'}\n║ ▸ *Note*  : Media saved to your DM\n║\n╚═|〔 ${name} 〕`
        }, { quoted: msg });
    }
};
