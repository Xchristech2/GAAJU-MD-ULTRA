'use strict';

const { getSudoList } = require('../../lib/sudo-store');
const { getBotName }  = require('../../lib/botname');

module.exports = {
    name:        'listsudo',
    aliases:     ['sudolist', 'sudos'],
    description: 'List all current sudo users',
    category:    'owner',
    ownerOnly:   true,
    sudoAllowed: false,

    async execute(sock, msg, args, PREFIX, ctx) {
        const chatId  = msg.key.remoteJid;
        const botName = getBotName();
        try { await sock.sendMessage(chatId, { react: { text: '📋', key: msg.key } }); } catch {}

        if (!ctx.isOwner()) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  📋 SUDO LIST 〕\n║\n║ ▸ *Status* : ❌ Owner only command\n║\n╚═|〔 ${botName} 〕`
            }, { quoted: msg });
        }

        const { sudoers } = getSudoList();

        if (!sudoers.length) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  📋 SUDO LIST 〕\n║\n║ ▸ *Status* : No sudo users configured\n║ ▸ *Tip*    : Use ${PREFIX}addsudo to add one\n║\n╚═|〔 ${botName} 〕`
            }, { quoted: msg });
        }

        const lines = sudoers.map((n, i) => `║  ${i + 1}. +${n}`).join('\n');
        return sock.sendMessage(chatId, {
            text: `╔═|〔  📋 SUDO LIST 〕\n║\n║ ▸ *Total* : ${sudoers.length} user(s)\n║\n${lines}\n║\n╚═|〔 ${botName} 〕`
        }, { quoted: msg });
    }
};
