'use strict';

const { getConfig, setConfig } = require('../../lib/database');
const { getBotName } = require('../../lib/botname');

const KEYS = {
    all:   'AUTO_TYPING',
    dm:    'AUTO_TYPING_DM',
    group: 'AUTO_TYPING_GROUP',
};
const CONFLICT_KEYS = {
    all:   'AUTO_RECORDING',
    dm:    'AUTO_RECORDING_DM',
    group: 'AUTO_RECORDING_GROUP',
};

function val(key) { return (process.env[key] || 'off').toLowerCase(); }
function icon(v)  { return v === 'on' ? '✅ On' : '❌ Off'; }

module.exports = {
    name:        'autotyping',
    aliases:     ['autocompose', 'typing'],
    description: 'Toggle auto typing indicator — globally or per DM / group',
    category:    'owner',
    ownerOnly:   true,
    sudoAllowed: true,

    async execute(sock, msg, args, prefix, ctx) {
        const chatId  = msg.key.remoteJid;
        try { await sock.sendMessage(chatId, { react: { text: '⌨️', key: msg.key } }); } catch {}
        const botName = getBotName();
        const H = '╔═|〔  AUTO TYPING 〕';
        const F = `╚═|〔 ${botName} 〕`;

        const sub  = (args[0] || '').toLowerCase().trim();   // on | off | dm | group
        const sub2 = (args[1] || '').toLowerCase().trim();   // on | off  (when sub is dm/group)

        // ── show status ──────────────────────────────────────────────────────
        if (!sub) {
            return sock.sendMessage(chatId, {
                text: [
                    H, `║`,
                    `║ ▸ *Global*  : ${icon(val('AUTO_TYPING'))}`,
                    `║ ▸ *DM*      : ${icon(val('AUTO_TYPING_DM'))}`,
                    `║ ▸ *Groups*  : ${icon(val('AUTO_TYPING_GROUP'))}`,
                    `║`,
                    `║ ▸ *${prefix}autotyping on/off*          → global`,
                    `║ ▸ *${prefix}autotyping dm on/off*       → DMs only`,
                    `║ ▸ *${prefix}autotyping group on/off*    → groups only`,
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
                        `║ ▸ *${sub === 'dm' ? 'DM' : 'Group'} Typing* : ${icon(val(key))}`,
                        `║`,
                        `║ ▸ *${prefix}autotyping ${sub} on*   → enable`,
                        `║ ▸ *${prefix}autotyping ${sub} off*  → disable`,
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
                const label = sub === 'dm' ? 'DM recording' : 'Group recording';
                note = `\n║ ▸ *Note*    : ${label} disabled`;
            }

            const label = sub === 'dm' ? 'DM typing' : 'Group typing';
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

        await setConfig('AUTO_TYPING', sub);
        process.env.AUTO_TYPING = sub;

        let notes = [];

        if (sub === 'on') {
            // clear per-type overrides so global wins cleanly
            for (const k of ['AUTO_TYPING_DM', 'AUTO_TYPING_GROUP']) {
                await setConfig(k, 'off'); process.env[k] = 'off';
            }
            // disable conflicting global recording
            if (val('AUTO_RECORDING') === 'on') {
                await setConfig('AUTO_RECORDING', 'off'); process.env.AUTO_RECORDING = 'off';
                notes.push(`║ ▸ *Note*    : Auto-recording disabled`);
            }
        } else {
            // off → wipe all typing variants
            for (const k of ['AUTO_TYPING_DM', 'AUTO_TYPING_GROUP']) {
                await setConfig(k, 'off'); process.env[k] = 'off';
            }
        }

        return sock.sendMessage(chatId, {
            text: [
                H, `║`,
                `║ ▸ *Status* : ${icon(sub)}`,
                sub === 'on'
                    ? `║ ▸ *Effect* : Bot will show typing... before all replies`
                    : `║ ▸ *Effect* : Typing indicator removed`,
                ...notes.map(n => `║ ▸ *Note*    : ${n}`),
                `║`,
                F,
            ].filter(Boolean).join('\n')
        }, { quoted: msg });
    }
};
