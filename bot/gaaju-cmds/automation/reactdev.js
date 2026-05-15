const { get, set, toggle } = require('../../lib/autoconfig');
const { getBotName }       = require('../../lib/botname');
const config               = require('../../config');

// Dedup: track message IDs already reacted to (max 200 entries)
const _reactedIds = new Set();

async function handleReactDev(sock, msg) {
    try {
        const cfg = get('reactdev');
        if (!cfg?.enabled) return;

        // Skip reaction/protocol messages — prevents infinite loop
        const m = msg.message;
        if (!m) return;
        if (m.reactionMessage)              return;
        if (m.protocolMessage)              return;
        if (m.senderKeyDistributionMessage) return;

        // Dedup by message ID
        const msgId = msg.key?.id;
        if (!msgId) return;
        if (_reactedIds.has(msgId)) return;

        const sender    = (msg.key.participant || msg.key.remoteJid || '').split('@')[0].split(':')[0].replace(/[^0-9]/g, '');
        const isCreator = (config.CREATORS || []).some(c => c.replace(/[^0-9]/g, '') === sender);
        if (!sender || !isCreator) return;

        _reactedIds.add(msgId);
        if (_reactedIds.size > 200) {
            const first = _reactedIds.values().next().value;
            _reactedIds.delete(first);
        }

        const emoji = cfg.emoji || '🔥';
        await sock.sendMessage(msg.key.remoteJid, {
            react: { text: emoji, key: msg.key }
        });
    } catch {}
}

module.exports = {
    handleReactDev,

    name:        'reactdev',
    aliases:     ['rd', 'devreact'],
    description: 'Auto-react to developer messages',
    category:    'automation',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();

        if (!ctx?.isOwnerUser && !ctx?.isSudoUser) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  REACT DEV 〕\n║\n║ ▸ *Status* : ❌ Owner only\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }

        const action = args[0]?.toLowerCase();
        const cfg    = get('reactdev');

        if (!action || action === 'status') {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  REACT DEV 〕\n║\n║ ▸ *State* : ${cfg.enabled ? '✅ ON' : '❌ OFF'}\n║ ▸ *Emoji* : ${cfg.emoji || '🔥'}\n║ ▸ *Usage* : ${prefix}reactdev on/off/emoji <emoji>\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }

        if (action === 'emoji' && args[1]) {
            const data = get('reactdev');
            data.emoji = args[1];
            set('reactdev', data);
            return sock.sendMessage(chatId, { text: `╔═|〔  REACT DEV 〕\n║\n║ ▸ *Emoji* : ${args[1]} saved\n║\n╚═|〔 ${name} 〕` }, { quoted: msg });
        }

        if (action === 'on')  { const d = get('reactdev'); d.enabled = true;  set('reactdev', d); return sock.sendMessage(chatId, { text: `╔═|〔  REACT DEV 〕\n║\n║ ▸ *State* : ✅ Enabled\n║\n╚═|〔 ${name} 〕` }, { quoted: msg }); }
        if (action === 'off') { const d = get('reactdev'); d.enabled = false; set('reactdev', d); return sock.sendMessage(chatId, { text: `╔═|〔  REACT DEV 〕\n║\n║ ▸ *State* : ❌ Disabled\n║\n╚═|〔 ${name} 〕` }, { quoted: msg }); }

        // unknown arg → ignore silently; only toggle when no arg given
        if (action) return;
        const now = toggle('reactdev');
        return sock.sendMessage(chatId, {
            text: `╔═|〔  REACT DEV 〕\n║\n║ ▸ *State* : ${now ? '✅ Enabled' : '❌ Disabled'}\n║\n╚═|〔 ${name} 〕`
        }, { quoted: msg });
    }
};
