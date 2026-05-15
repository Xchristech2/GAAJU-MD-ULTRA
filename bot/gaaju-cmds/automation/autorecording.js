'use strict';

const { getConfig, setConfig } = require('../../lib/database');
const { getBotName } = require('../../lib/botname');

const KEYS = {
    all:   'AUTO_RECORDING',
    dm:    'AUTO_RECORDING_DM',
    group: 'AUTO_RECORDING_GROUP',
};
const CONFLICT_KEYS = {
    all:   'AUTO_TYPING',
    dm:    'AUTO_TYPING_DM',
    group: 'AUTO_TYPING_GROUP',
};

function val(key) { return (process.env[key] || 'off').toLowerCase(); }
function icon(v)  { return v === 'on' ? '✅ On' : '❌ Off'; }

module.exports = {
    name:        'autorecording',
    aliases:     ['autorecord', 'recording'],
    description: 'Toggle auto recording indicator — globally or per DM / group',
    category:    'owner',
    ownerOnly:   true,
    sudoAllowed: true,

    async execute(sock, msg, args, prefix, ctx) {
        const chatId  = msg.key.remoteJid;
        try { await sock.sendMessage(chatId, { react: { text: '🎙️', key: msg.key } }); } catch {}
        const botName = getBotName();
        const H = '╔═|〔  AUTO RECORDING 〕';
        const F = `╚═|〔 ${botName} 〕`;

        const sub  = (args[0] || '').toLowerCase().trim();   // on | off | dm | group
        const sub2 = (args[1] || '').toLowerCase().trim();   // on | off  (when sub is dm/group)

        // ── show status ──────────────────────────────────────────────────────
        if (!sub) {
            return sock.sendMessage(chatId, {
                text: [
                    H, `║`,
                    `║ ▸ *Global*  : ${icon(val('AUTO_RECORDING'))}`,
                    `║ ▸ *DM*      : ${icon(val('AUTO_RECORDING_DM'))}`,
                    `║ ▸ *Groups*  : ${icon(val('AUTO_RECORDING_GROUP'))}`,
                    `║`,
                    `║ ▸ *${prefix}autorecording on/off*          → global`,
                    `║ ▸ *${prefix}autorecording dm on/off*       → DMs only`,
                    `║ ▸ *${prefix}autorecording group on/off*    → groups only`,
                    `║`,
                    F,
                ].join('\n')
            }, { quoted: msg });
        }

        // ── per-scope: dm / group ────────────────────────────────────────────
        if (sub === 'dm' || sub === 'group') {
            if (sub2 !== 'on' && sub2 !== 'off') {
                const key = KEYS[sub];
                return sock.sendMessage(chatId, {
                    text: [
                        H, `║`,
                        `║ ▸ *${sub === 'dm' ? 'DM' : 'Group'} Recording* : ${icon(val(key))}`,
                        `║`,
                        `║ ▸ *${prefix}autorecording ${sub} on*   → enable`,
                        `║ ▸ *${prefix}autorecording ${sub} off*  → disable`,
                        `║`,
                        F,
                    ].join('\n')
                }, { quoted: msg });
            }

            const key      = KEYS[sub];
            const conflict = CONFLICT_KEYS[sub];

            await setConfig(key, sub2);
            process.env[key] = sub2;

            let note = '';
            if (sub2 === 'on' && val(conflict) === 'on') {
                await setConfig(conflict, 'off');
                process.env[conflict] = 'off';
                const label = sub === 'dm' ? 'DM typing' : 'Group typing';
                note = `\n║ ▸ *Note*    : ${label} disabled`;
            }

            const label = sub === 'dm' ? 'DM recording' : 'Group recording';
            return sock.sendMessage(chatId, {
                text: [
                    H, `║`,
                    `║ ▸ *${label}* : ${icon(sub2)}`,
                    note || null,
                    `║`,
                    F,
                ].filter(Boolean).join('\n')
            }, { quoted: msg });
        }

        // ── global on / off ──────────────────────────────────────────────────
        if (sub !== 'on' && sub !== 'off') return;

        await setConfig('AUTO_RECORDING', sub);
        process.env.AUTO_RECORDING = sub;

        let notes = [];

        if (sub === 'on') {
            // clear per-type overrides so global wins cleanly
            for (const k of ['AUTO_RECORDING_DM', 'AUTO_RECORDING_GROUP']) {
                await setConfig(k, 'off'); process.env[k] = 'off';
            }
            // disable conflicting global typing
            if (val('AUTO_TYPING') === 'on') {
                await setConfig('AUTO_TYPING', 'off'); process.env.AUTO_TYPING = 'off';
                notes.push(`Auto-typing disabled`);
            }
        } else {
            // off → wipe all recording variants
            for (const k of ['AUTO_RECORDING_DM', 'AUTO_RECORDING_GROUP']) {
                await setConfig(k, 'off'); process.env[k] = 'off';
            }
        }

        return sock.sendMessage(chatId, {
            text: [
                H, `║`,
                `║ ▸ *Status* : ${icon(sub)}`,
                sub === 'on'
                    ? `║ ▸ *Effect* : Bot will show 🎙️ recording... before all replies`
                    : `║ ▸ *Effect* : Recording indicator removed`,
                ...notes.map(n => `║ ▸ *Note*    : ${n}`),
                `║`,
                F,
            ].filter(Boolean).join('\n')
        }, { quoted: msg });
    }
};
