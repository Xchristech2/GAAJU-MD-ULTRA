const { get, set, toggle } = require('../../lib/autoconfig');
const { getBotName } = require('../../lib/botname');
const config = require('../../config');

const _reactedIds = new Set();
const MAX_REACTED_IDS = 200;

async function handleReactOwner(sock, msg) {
    try {
        const cfg = get('reactowner');
        if (!cfg?.enabled) return;

        const remoteJid = msg?.key?.remoteJid || '';

        // Groups only; ignore private DMs and status updates.
        if (!remoteJid.endsWith('@g.us')) return;

        if (msg.key?.fromMe) return;

        const m = msg.message;
        if (!m) return;

        if (m.reactionMessage) return;
        if (m.protocolMessage) return;
        if (m.senderKeyDistributionMessage) return;

        const msgId = msg.key?.id;
        if (!msgId) return;

        const uniqueId = `${remoteJid}:${msgId}`;
        if (_reactedIds.has(uniqueId)) return;

        const ownerClean = String(config.OWNER_NUMBER || '')
            .replace(/\D/g, '');

        if (!ownerClean) return;

        const rawJid = msg.key?.participant || '';
        const sender = rawJid
            .split('@')[0]
            .split(':')[0]
            .replace(/\D/g, '');

        if (sender !== ownerClean) return;

        const emoji = cfg.emoji || '❤️';

        await sock.sendMessage(remoteJid, {
            react: {
                text: emoji,
                key: msg.key
            }
        });

        _reactedIds.add(uniqueId);

        if (_reactedIds.size > MAX_REACTED_IDS) {
            _reactedIds.delete(_reactedIds.values().next().value);
        }
    } catch (error) {
        console.warn(
            `[REACTOWNER] Reaction failed: ${error?.message || error}`
        );
    }
}

module.exports = {
    handleReactOwner,

    name: 'reactowner',
    aliases: ['ro', 'ownerreact'],
    description: 'Auto-react to owner messages in groups',
    category: 'automation',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;

        if (!ctx?.isOwnerUser && !ctx?.isSudoUser) {
            return sock.sendMessage(chatId, {
                text: '❌ Owner only command.'
            }, { quoted: msg });
        }

        const action = (args[0] || 'status').toLowerCase();
        const cfg = get('reactowner') || {};

        if (action === 'status') {
            return sock.sendMessage(chatId, {
                text: `ReactOwner is ${cfg.enabled ? 'ON' : 'OFF'}.\nEmoji: ${cfg.emoji || '❤️'}`
            }, { quoted: msg });
        }

        if (action === 'emoji') {
            if (!args[1]) {
                return sock.sendMessage(chatId, {
                    text: `Usage: ${prefix}reactowner emoji ❤️`
                }, { quoted: msg });
            }

            const data = get('reactowner') || {};
            data.emoji = args[1];
            set('reactowner', data);

            return sock.sendMessage(chatId, {
                text: `ReactOwner emoji set to ${args[1]}.`
            }, { quoted: msg });
        }

        if (action === 'on') {
            const data = get('reactowner') || {};
            data.enabled = true;
            set('reactowner', data);

            return sock.sendMessage(chatId, {
                text: '✅ ReactOwner enabled. It will react to your messages in groups only.'
            }, { quoted: msg });
        }

        if (action === 'off') {
            const data = get('reactowner') || {};
            data.enabled = false;
            set('reactowner', data);

            return sock.sendMessage(chatId, {
                text: '❌ ReactOwner disabled.'
            }, { quoted: msg });
        }

        if (action === 'toggle') {
            const now = toggle('reactowner');

            return sock.sendMessage(chatId, {
                text: `ReactOwner is now ${now ? 'ON' : 'OFF'}.`
            }, { quoted: msg });
        }

        return sock.sendMessage(chatId, {
            text:
                `Invalid option.\n\n` +
                `Usage:\n` +
                `${prefix}reactowner on\n` +
                `${prefix}reactowner off\n` +
                `${prefix}reactowner status\n` +
                `${prefix}reactowner emoji ❤️`
        }, { quoted: msg });
    }
};
