module.exports = {
    name: 'tagall',
    aliases: ['everyone','mentionall','all'],
    description: 'Mention all group members',
    category: 'group',
    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        try { await sock.sendMessage(chatId, { react: { text: '📢', key: msg.key } }); } catch {}
        if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: `╔═|〔  TAG ALL 〕\n║\n║ ▸ Group only command\n║\n╚═╝` }, { quoted: msg });
        try {
            const meta    = await sock.groupMetadata(chatId);
            const members = meta.participants.map(p => p.id);
            const custom  = args.join(' ').trim();
            const header  = `╔═|〔  TAG ALL 〕\n║\n║ ▸ *Group* : ${meta.subject}\n║ ▸ *Count* : ${members.length} members\n║\n`;
            const tags    = members.map(jid => `║  @${jid.split('@')[0]}`).join('\n');
            const footer  = `\n║\n╚═╝`;
            const text    = header + (custom ? `║ ▸ *Message* : ${custom}\n` : '') + tags + footer;
            await sock.sendMessage(chatId, { text, mentions: members }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, { text: `╔═|〔  TAG ALL 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═╝` }, { quoted: msg });
        }
    }
};
