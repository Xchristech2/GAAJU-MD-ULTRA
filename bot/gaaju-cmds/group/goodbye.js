const fs   = require('fs');
const path = require('path');
const { getBotName }             = require('../../lib/botname');
const { resolveDisplayWithName } = require('../../lib/groupUtils');

const CFG_FILE = path.join(__dirname, '../../data/goodbye_data.json');

const DEFAULT_MSG = [
    `╔═|〔  GOODBYE 〕`,
    `║`,
    `║ 💨 {mention} has left the building!`,
    `║ ▸ *Group*   : {group}`,
    `║ ▸ *Members* : {count} still surviving`,
    `║`,
    `║ 🚪 The door was right there 👉😂`,
    `║ 😢 We'll pretend we're not crying`,
    `║`,
    `╚═╝`,
].join('\n');

// ── data helpers ──────────────────────────────────────────────────────────────
function loadCfg() {
    try { return JSON.parse(fs.readFileSync(CFG_FILE, 'utf8')); } catch { return { groups: {} }; }
}
function saveCfg(d) {
    fs.mkdirSync(path.dirname(CFG_FILE), { recursive: true });
    fs.writeFileSync(CFG_FILE, JSON.stringify(d, null, 2));
}


// Reset all groups to OFF on every bot startup
try {
    const _boot = loadCfg(); let _dirty = false;
    for (const id of Object.keys(_boot.groups || {})) { if (_boot.groups[id]?.enabled) { _boot.groups[id].enabled = false; _dirty = true; } }
    if (_dirty) saveCfg(_boot);
} catch {}
// ── variable substitution ─────────────────────────────────────────────────────
function applyVars(template, vars) {
    return template
        .replace(/\{mention\}/g, vars.mention || '')
        .replace(/\{name\}/g,    vars.name    || '')
        .replace(/\{group\}/g,   vars.group   || '')
        .replace(/\{count\}/g,   vars.count   || '')
        .replace(/\{members\}/g, vars.count   || '')
        .replace(/\{bot\}/g,     vars.bot     || getBotName());
}

// ── exported functions (called by index.js) ───────────────────────────────────
function isGoodbyeEnabled(gid) {
    return !!(loadCfg().groups?.[gid]?.enabled);
}

function getGoodbyeMessage(gid) {
    return loadCfg().groups?.[gid]?.message || DEFAULT_MSG;
}

async function sendGoodbyeMessage(sock, gid, participants, customMsg) {
    try {
        const meta      = await sock.groupMetadata(gid);
        const groupName = meta.subject || gid.split('@')[0];
        const count     = meta.participants.length;
        const botName   = getBotName();
        const template  = customMsg || DEFAULT_MSG;

        for (const jid of participants) {
            try {
                const display = await resolveDisplayWithName(sock, gid, jid, null)
                    .catch(() => `+${jid.split('@')[0].split(':')[0]}`);
                const phone   = jid.split('@')[0].split(':')[0];

                const text = applyVars(template, {
                    mention : `@${phone}`,
                    name    : display,
                    group   : groupName,
                    count   : String(count),
                    bot     : botName,
                });

                await sock.sendMessage(gid, {
                    text    : text,
                    mentions: [jid],
                });
            } catch {}
        }
    } catch {}
}

// ── command ───────────────────────────────────────────────────────────────────
module.exports = {
    isGoodbyeEnabled,
    getGoodbyeMessage,
    sendGoodbyeMessage,

    name:        'goodbye',
    aliases:     ['bye', 'setgoodbye', 'goodbyeset'],
    description: 'Send goodbye message when a member leaves the group',
    category:    'group',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId  = msg.key.remoteJid;
        const botName = getBotName();

        if (!ctx?.isOwnerUser && !ctx?.isSudoUser && !ctx?.isGroupAdmin) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  GOODBYE 〕\n║\n║ ▸ *Status* : ❌ Admins/Owner only\n║\n╚═╝`
            }, { quoted: msg });
        }
        if (!chatId.endsWith('@g.us')) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  GOODBYE 〕\n║\n║ ▸ *Status* : ❌ Groups only\n║\n╚═╝`
            }, { quoted: msg });
        }

        const sub  = args[0]?.toLowerCase();
        const cfg  = loadCfg();
        const gcfg = cfg.groups?.[chatId] || { enabled: false, message: DEFAULT_MSG };
        const save = () => { cfg.groups = cfg.groups || {}; cfg.groups[chatId] = gcfg; saveCfg(cfg); };

        // ── status / no args ──────────────────────────────────────────────────
        if (!sub || sub === 'status') {
            return sock.sendMessage(chatId, {
                text: [
                    `╔═|〔  GOODBYE 〕`,
                    `║`,
                    `║ ▸ *State*   : ${gcfg.enabled ? '✅ ON' : '❌ OFF'}`,
                    `║ ▸ *Message* : ${gcfg.message === DEFAULT_MSG ? 'Default' : 'Custom ✏️'}`,
                    `║`,
                    `║ ▸ *Usage* :`,
                    `║   ${prefix}goodbye on / off`,
                    `║   ${prefix}goodbye set <your message>`,
                    `║   ${prefix}goodbye reset`,
                    `║   ${prefix}goodbye msg`,
                    `║`,
                    `║ ▸ *Placeholders* :`,
                    `║   {mention} {name} {group} {count} {bot}`,
                    `║`,
                    `╚═╝`,
                ].join('\n')
            }, { quoted: msg });
        }

        // ── on / off ──────────────────────────────────────────────────────────
        if (sub === 'on' || sub === 'off') {
            gcfg.enabled = sub === 'on'; save();
            return sock.sendMessage(chatId, {
                text: `╔═|〔  GOODBYE 〕\n║\n║ ▸ *State* : ${gcfg.enabled ? '✅ Enabled' : '❌ Disabled'}\n║\n╚═╝`
            }, { quoted: msg });
        }

        // ── set <message> ─────────────────────────────────────────────────────
        if (sub === 'set') {
            const newMsg = args.slice(1).join(' ').trim();
            if (!newMsg) {
                return sock.sendMessage(chatId, {
                    text: `╔═|〔  GOODBYE 〕\n║\n║ ▸ *Usage* : ${prefix}goodbye set <message>\n║ ▸ *Vars*  : {mention} {name} {group} {count} {bot}\n║\n╚═╝`
                }, { quoted: msg });
            }
            gcfg.message = newMsg; save();
            return sock.sendMessage(chatId, {
                text: `╔═|〔  GOODBYE 〕\n║\n║ ▸ *Message* : ✅ Saved\n║\n╚═╝`
            }, { quoted: msg });
        }

        // ── reset ─────────────────────────────────────────────────────────────
        if (sub === 'reset') {
            gcfg.message = DEFAULT_MSG; save();
            return sock.sendMessage(chatId, {
                text: `╔═|〔  GOODBYE 〕\n║\n║ ▸ *Message* : ✅ Reset to default\n║\n╚═╝`
            }, { quoted: msg });
        }

        // ── show current message ──────────────────────────────────────────────
        if (sub === 'msg' || sub === 'message') {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  GOODBYE MESSAGE 〕\n║\n${gcfg.message}\n║\n╚═╝`
            }, { quoted: msg });
        }

        // ── unknown arg → ignore silently; only toggle when no arg given ─────
        if (sub) return;
        gcfg.enabled = !gcfg.enabled; save();
        return sock.sendMessage(chatId, {
            text: `╔═|〔  GOODBYE 〕\n║\n║ ▸ *State* : ${gcfg.enabled ? '✅ Enabled' : '❌ Disabled'}\n║\n╚═╝`
        }, { quoted: msg });
    }
};
