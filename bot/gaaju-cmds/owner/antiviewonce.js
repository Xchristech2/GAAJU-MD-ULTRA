'use strict';

const fs   = require('fs');
const path = require('path');
const { getBotName } = require('../../lib/botname');

const CONFIG_FILE = path.join(__dirname, '../../data/antiviewonce_config.json');

function loadConfig() {
    try { return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8')); } catch { return {}; }
}

function saveConfig(cfg) {
    try {
        fs.mkdirSync(path.dirname(CONFIG_FILE), { recursive: true });
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2));
    } catch {}
}

module.exports = {
    name:        'antiviewonce',
    aliases:     ['av', 'antiview', 'antiviewonce'],
    description: 'Enable/disable anti-viewonce (owner only)',
    category:    'owner',
    ownerOnly:   true,

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();
        try { await sock.sendMessage(chatId, { react: { text: '👁️', key: msg.key } }); } catch {}

        const cfg   = loadConfig();
        const sub   = (args[0] || '').toLowerCase();

        if (!sub || sub === 'status') {
            const status = cfg.enabled ? '✅ ON' : '❌ OFF';
            const mode   = cfg.mode || 'private';
            return sock.sendMessage(chatId, {
                text: [
                    `╔═|〔  ANTI VIEWONCE 〕`,
                    `║`,
                    `║ ▸ *Status* : ${status}`,
                    `║ ▸ *Mode*   : ${mode}`,
                    `║`,
                    `║ ▸ *Usage*`,
                    `║   ${prefix}av on/off`,
                    `║   ${prefix}av mode private|group`,
                    `║`,
                    `╚═|〔 ${name} 〕`
                ].join('\n')
            }, { quoted: msg });
        }

        if (sub === 'on' || sub === 'off') {
            cfg.enabled = sub === 'on';
            saveConfig(cfg);
            return sock.sendMessage(chatId, {
                text: `╔═|〔  ANTI VIEWONCE 〕\n║\n║ ▸ *Status* : ${cfg.enabled ? '✅ Enabled' : '❌ Disabled'}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }

        if (sub === 'mode' && args[1]) {
            const m = args[1].toLowerCase();
            if (!['private', 'group', 'both'].includes(m)) {
                return sock.sendMessage(chatId, {
                    text: `╔═|〔  ANTI VIEWONCE 〕\n║\n║ ▸ *Error* : Mode must be private, group or both\n║\n╚═|〔 ${name} 〕`
                }, { quoted: msg });
            }
            cfg.mode = m;
            saveConfig(cfg);
            return sock.sendMessage(chatId, {
                text: `╔═|〔  ANTI VIEWONCE 〕\n║\n║ ▸ *Mode* : ✅ Set to ${m}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }

        await sock.sendMessage(chatId, {
            text: `╔═|〔  ANTI VIEWONCE 〕\n║\n║ ▸ *Usage* : ${prefix}av on | off | mode private|group|both\n║\n╚═|〔 ${name} 〕`
        }, { quoted: msg });
    }
};
