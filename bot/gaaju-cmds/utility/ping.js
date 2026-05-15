'use strict';
const { getBotName } = require('../../lib/botname');

function formatUptime(seconds) {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const parts = [];
    if (d) parts.push(`${d}d`);
    if (h) parts.push(`${h}h`);
    if (m) parts.push(`${m}m`);
    parts.push(`${s}s`);
    return parts.join(' ');
}

module.exports = {
    name:        'ping',
    aliases:     ['p', 'speed', 'latency'],
    description: 'Check bot response time and uptime',
    category:    'utility',

    async execute(sock, msg, args, prefix, ctx) {
        const received = msg._botReceivedAt || Date.now();
        const chatId   = msg.key.remoteJid;
        const botName  = getBotName();
        const uptime   = formatUptime(process.uptime());
        const latency  = Date.now() - received;
        const bar      = latency < 100 ? '⚡ Ultra' : latency < 400 ? '🟢 Fast' : latency < 900 ? '🟡 Normal' : '🔴 Slow';

        await sock.sendMessage(chatId, {
            text: [
                `╔═|〔  PING 〕`,
                `║`,
                `║ ▸ *Status*  : ✅ Online`,
                `║ ▸ *Speed*   : ${latency}ms  ${bar}`,
                `║ ▸ *Uptime*  : ${uptime}`,
                `║`,
                `╚═|〔 ${botName} 〕`,
            ].join('\n'),
        }, { quoted: msg });
    },
};
