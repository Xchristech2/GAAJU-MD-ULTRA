'use strict';

const { getBotName } = require('../../lib/botname');

module.exports = {
    name:        'groupstats',
    aliases:     ['gstats', 'groupstat'],
    description: 'Show group statistics: members, admins, messages',
    category:    'group',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();
        try { await sock.sendMessage(chatId, { react: { text: '📊', key: msg.key } }); } catch {}

        if (!chatId.endsWith('@g.us')) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  GROUP STATS 〕\n║\n║ ▸ *Status* : ❌ Group only\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }

        try {
            const meta    = await sock.groupMetadata(chatId);
            const total   = meta.participants.length;
            const admins  = meta.participants.filter(p => p.admin).length;
            const members = total - admins;
            const created = new Date(meta.creation * 1000).toLocaleDateString('en-GB', {
                timeZone: process.env.TIME_ZONE || 'Africa/Nairobi'
            });

            await sock.sendMessage(chatId, {
                text: [
                    `╔═|〔  GROUP STATS 〕`,
                    `║`,
                    `║ ▸ *Group*   : ${meta.subject}`,
                    `║ ▸ *Members* : ${members}`,
                    `║ ▸ *Admins*  : ${admins}`,
                    `║ ▸ *Total*   : ${total}`,
                    `║ ▸ *Created* : ${created}`,
                    meta.desc ? `║ ▸ *Desc*    : ${meta.desc.slice(0, 60)}` : null,
                    `║`,
                    `╚═|〔 ${name} 〕`
                ].filter(Boolean).join('\n')
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  GROUP STATS 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }
    }
};
