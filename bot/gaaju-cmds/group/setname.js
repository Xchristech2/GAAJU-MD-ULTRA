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
                text: `╭━━━〔 📝 SET NAME 〕━━━⬣
┃
┃ ✦ Status : ❌ Group Only
┃
╰━━━━━━━━━━━━━━━〔 ${botName} 〕⬣`
            }, { quoted: msg });
        }

        const { ok } = await checkPrivilege(sock, chatId, msg, ctx);
        if (!ok) {
            return sock.sendMessage(chatId, {
                text: `╭━━━〔 📝 SET NAME 〕━━━⬣
┃
┃ ✦ Status : ❌ Permission Denied
┃ ✦ Reason : Sudo Users & Group Admins Only
┃
╰━━━━━━━━━━━━━━━〔 ${botName} 〕⬣`
            }, { quoted: msg });
        }

        const newName = args.join(' ').trim();
        if (!newName) {
            return sock.sendMessage(chatId, {
                text:`╭━━━〔 📝 SET NAME 〕━━━⬣
┃
┃ ✦ Usage : ${prefix}setname <new name>
┃
╰━━━━━━━━━━━━━━━〔 ${botName} 〕⬣`
            }, { quoted: msg });
        }

        try {
            await sock.groupUpdateSubject(chatId, newName);
            await sock.sendMessage(chatId, {
                text: `╭━━━〔 📝 SET NAME 〕━━━⬣
┃
┃ ✦ New Name : ${newName}
┃ ✦ Status   : ✅ Updated Successfully
┃
╰━━━━━━━━━━━━━━━〔 ${botName} 〕⬣`
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╭━━━〔 📝 SET NAME 〕━━━⬣
┃
┃ ✦ Status : ❌ Failed
┃ ✦ Reason : ${e.message}
┃
╰━━━━━━━━━━━━━━━〔 ${botName} 〕⬣`
            }, { quoted: msg });
        }
    }
};
