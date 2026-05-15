const { get, set, toggle } = require('../../lib/autoconfig');
const { getBotName }       = require('../../lib/botname');
const config               = require('../../config');

// Dedup: track message IDs already reacted to (max 200 entries)
const _reactedIds = new Set();

async function handleReactOwner(sock, msg) {
    try {
        const cfg = get('reactowner');
        if (!cfg?.enabled) return;

        // Skip reaction messages, protocol messages, and non-real messages
        const m = msg.message;
        if (!m) return;
        if (m.reactionMessage)   return;  // don't react to reactions (prevents loop)
        if (m.protocolMessage)   return;  // skip protocol/revoke messages
        if (m.senderKeyDistributionMessage) return;

        // Dedup by message ID — only react once per message
        const msgId = msg.key?.id;
        if (!msgId) return;
        if (_reactedIds.has(msgId)) return;

        const ownerClean = (config.OWNER_NUMBER || '').replace(/[^0-9]/g, '');
        if (!ownerClean) return;

        const fromMe = !!msg.key?.fromMe;
        const rawJid = msg.key?.participant || msg.key?.remoteJid || '';
        const sender = rawJid.split('@')[0].split(':')[0].replace(/[^0-9]/g, '');

        const isOwner = fromMe ? true : (sender === ownerClean);
        if (!isOwner) return;

        // Mark as reacted before sending to prevent race-condition duplicates
        _reactedIds.add(msgId);
        if (_reactedIds.size > 200) {
            const first = _reactedIds.values().next().value;
            _reactedIds.delete(first);
        }

        const emoji = cfg.emoji || '❤️';
        await sock.sendMessage(msg.key.remoteJid, {
            react: { text: emoji, key: msg.key }
        });
    } catch {}
}

module.exports = {
    handleReactOwner,

    name:        'reactowner',
    aliases:     ['ro', 'ownerreact'],
    description: 'Auto-react to owner messages',
    category:    'automation',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();

        if (!ctx?.isOwnerUser && !ctx?.isSudoUser) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  REACT OWNER 〕\n║\n║ ▸ *Status* : ❌ Owner only\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }

        const action = args[0]?.toLowerCase();
        const cfg    = get('reactowner');

        if (!action || action === 'status') {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  REACT OWNER 〕\n║\n║ ▸ *State* : ${cfg.enabled ? '✅ ON' : '❌ OFF'}\n║ ▸ *Emoji* : ${cfg.emoji || '❤️'}\n║ ▸ *Usage* : ${prefix}reactowner on/off/emoji <emoji>\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }

        if (action === 'emoji' && args[1]) {
            const data = get('reactowner');
            data.emoji = args[1];
            set('reactowner', data);
            return sock.sendMessage(chatId, { text: `╔═|〔  REACT OWNER 〕\n║\n║ ▸ *Emoji* : ${args[1]} saved\n║\n╚═|〔 ${name} 〕` }, { quoted: msg });
        }

        if (action === 'on')  { const d = get('reactowner'); d.enabled = true;  set('reactowner', d); return sock.sendMessage(chatId, { text: `╔═|〔  REACT OWNER 〕\n║\n║ ▸ *State* : ✅ Enabled\n║\n╚═|〔 ${name} 〕` }, { quoted: msg }); }
        if (action === 'off') { const d = get('reactowner'); d.enabled = false; set('reactowner', d); return sock.sendMessage(chatId, { text: `╔═|〔  REACT OWNER 〕\n║\n║ ▸ *State* : ❌ Disabled\n║\n╚═|〔 ${name} 〕` }, { quoted: msg }); }

        // unknown arg → ignore silently; only toggle when no arg given
        if (action) return;
        const now = toggle('reactowner');
        return sock.sendMessage(chatId, {
            text: `╔═|〔  REACT OWNER 〕\n║\n║ ▸ *State* : ${now ? '✅ Enabled' : '❌ Disabled'}\n║\n╚═|〔 ${name} 〕`
        }, { quoted: msg });
    }
};
