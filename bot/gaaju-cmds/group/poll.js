'use strict';

const { getBotName } = require('../../lib/botname');

module.exports = {
    name: 'poll',
    aliases: ['createpoll', 'vote', 'survey'],
    description: 'Create a WhatsApp native poll in a group — .poll Question | Option1 | Option2 ...',
    category: 'group',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();
        try { await sock.sendMessage(chatId, { react: { text: '📊', key: msg.key } }); } catch {}

        const USAGE = [
            `╔═|〔  POLL 📊 〕`,
            `║`,
            `║ ▸ *Usage* : ${prefix}poll <Question> | <Option1> | <Option2> ...`,
            `║ ▸ *Min*   : 2 options, *Max* : 12 options`,
            `║`,
            `║ ▸ *Example* :`,
            `║   ${prefix}poll Best fruit? | Mango | Avocado | Banana`,
            `║`,
            `║ ▸ Works in *groups AND DMs* ✅`,
            `║`,
            `╚═|〔 ${name} 〕`,
        ].join('\n');

        const raw = args.join(' ').trim();
        if (!raw) return sock.sendMessage(chatId, { text: USAGE }, { quoted: msg });

        const parts = raw.split('|').map(p => p.trim()).filter(Boolean);
        if (parts.length < 3) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  POLL 〕\n║\n║ ▸ ❌ Need a question + at least 2 options\n║ ▸ Separate with *|*\n║ ▸ Example: ${prefix}poll Best? | Yes | No\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }

        const question = parts[0];
        const options  = parts.slice(1, 13);

        if (options.length > 12) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  POLL 〕\n║\n║ ▸ ❌ Maximum 12 options allowed\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }

        try {
            await sock.sendMessage(chatId, {
                poll: {
                    name:            question,
                    values:          options,
                    selectableCount: 1,
                }
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  POLL 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }
    }
};
