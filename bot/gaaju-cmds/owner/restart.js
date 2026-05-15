'use strict';
const { getBotName } = require('../../lib/botname');

module.exports = {
    name:        'restart',
    aliases:     ['reboot', 'reloadbot'],
    description: 'Restart the bot',
    category:    'owner',
    ownerOnly:   true,

    async execute(sock, msg, args, prefix, ctx) {
        const chatId  = msg.key.remoteJid;

        if (!ctx?.isOwnerUser && !ctx?.isSudoUser) {
            const botName = getBotName();
            return await sock.sendMessage(chatId, {
                text: `╔═|〔  RESTART 〕\n║\n║ ▸ *Status* : ❌ Owner only\n║\n╚═|〔 ${botName} 〕`
            }, { quoted: msg });
        }

        try { await sock.sendMessage(chatId, { react: { text: '🔄', key: msg.key } }); } catch {}

        const botName = getBotName();
        await sock.sendMessage(chatId, {
            text: [
                `╔═|〔  RESTART 〕`,
                `║`,
                `║ ▸ *Status* : 🔄 Restarting now...`,
                `║`,
                `╚═|〔 ${botName} 〕`,
            ].join('\n')
        }, { quoted: msg });

        setTimeout(() => process.exit(1), 2000);
    },
};
