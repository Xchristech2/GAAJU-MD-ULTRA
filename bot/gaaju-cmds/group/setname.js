'use strict';

const { checkPrivilege } = require('../../lib/groupUtils');
const { getBotName }     = require('../../lib/botname');

module.exports = {
    name:        'setname',
    aliases:     ['groupname', 'setgroupname', 'rename'],
    description: 'Change the group name/subject (sudo/admin only)',
    category:    'group',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId  = msg.key.remoteJid;
        const botName = getBotName();
        try { await sock.sendMessage(chatId, { react: { text: '✏️', key: msg.key } }); } catch {}

        if (!chatId.endsWith('@g.us')) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  SET NAME 〕\n║\n║ ▸ *Status* : ❌ Group only\n║\n╚═|〔 ${botName} 〕`
            }, { quoted: msg });
        }

        const { ok } = await checkPrivilege(sock, chatId, msg, ctx);
        if (!ok) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  SET NAME 〕\n║\n║ ▸ *Status* : ❌ Permission denied\n║ ▸ *Reason* : Sudo users and group admins only\n║\n╚═|〔 ${botName} 〕`
            }, { quoted: msg });
        }

        const newName = args.join(' ').trim();
        if (!newName) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  SET NAME 〕\n║\n║ ▸ *Usage* : ${prefix}setname <new name>\n║\n╚═|〔 ${botName} 〕`
            }, { quoted: msg });
        }

        try {
            await sock.groupUpdateSubject(chatId, newName);
            await sock.sendMessage(chatId, {
                text: `╔═|〔  SET NAME 〕\n║\n║ ▸ *New Name* : ${newName}\n║ ▸ *Status*   : ✅ Updated\n║\n╚═|〔 ${botName} 〕`
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  SET NAME 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═|〔 ${botName} 〕`
            }, { quoted: msg });
        }
    }
};
