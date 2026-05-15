'use strict';
const fs   = require('fs');
const path = require('path');

const CFG_FILE = path.join(__dirname, '../../data/antigroupmention.json');

function loadCfg() {
    try { return JSON.parse(fs.readFileSync(CFG_FILE, 'utf8')); } catch { return {}; }
}

function isEnabled(groupJid) {
    return !!loadCfg()[groupJid];
}

function setEnabled(groupJid, value) {
    const cfg = loadCfg();
    cfg[groupJid] = !!value;
    try {
        fs.mkdirSync(path.dirname(CFG_FILE), { recursive: true });
        fs.writeFileSync(CFG_FILE, JSON.stringify(cfg, null, 2));
    } catch {}
}

function setupAntiGroupMentionListener(sock) {
    sock.ev.on('messages.upsert', async ({ messages }) => {
        for (const msg of messages) {
            try {
                if (!msg.message || msg.key.fromMe) continue;

                const chatId = msg.key.remoteJid;
                if (!chatId?.endsWith('@g.us')) continue;
                if (!isEnabled(chatId)) continue;

                const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid
                    || msg.message?.conversation?.match(/@\d+/g)
                    || [];

                const groupMeta = await sock.groupMetadata(chatId).catch(() => null);
                if (!groupMeta) continue;

                const senderJid = msg.key.participant || msg.key.remoteJid;
                const senderNum = senderJid.split('@')[0].split(':')[0];

                const isAdmin = (groupMeta.participants || []).some(p => {
                    const pNum = (p.id || '').split('@')[0].split(':')[0];
                    return pNum === senderNum && (p.admin === 'admin' || p.admin === 'superadmin');
                });

                if (isAdmin) continue;

                const memberCount = (groupMeta.participants || []).length;
                const mentionCount = Array.isArray(mentions) ? mentions.length : 0;

                if (mentionCount >= Math.min(5, Math.ceil(memberCount * 0.3))) {
                    await sock.sendMessage(chatId, { delete: msg.key }).catch(() => {});
                    await sock.sendMessage(chatId, {
                        text: `@${senderNum} ❌ Mass tagging is not allowed in this group.`,
                        mentions: [senderJid],
                    }).catch(() => {});
                }
            } catch {}
        }
    });
}

module.exports = { setupAntiGroupMentionListener, isEnabled, setEnabled };
