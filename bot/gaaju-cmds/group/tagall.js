module.exports = {
    name: 'tagall',
    aliases: ['everyone', 'mentionall', 'all'],
    description: 'Mention all group members',
    category: 'group',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;

        try {
            await sock.sendMessage(chatId, {
                react: {
                    text: '📢',
                    key: msg.key
                }
            });
        } catch {}

        if (!chatId.endsWith('@g.us')) {
            return sock.sendMessage(
                chatId,
                {
                    text:
`╭━━━〔 📢 TAG ALL 〕━━━╮
┃
┃ ❌ *Group Only*
┃
┃ This command can only
┃ be used inside a group.
┃
╰━━━━━━━━━━━━━━━━━━╯`
                },
                { quoted: msg }
            );
        }

        try {
            const meta = await sock.groupMetadata(chatId);
            const members = meta.participants.map(p => p.id);
            const custom = args.join(' ').trim();

            const header =
`╭━━━〔 📢 TAG ALL 〕━━━╮
┃
┃ 👥 *Group:* ${meta.subject}
┃ 📊 *Members:* ${members.length}
┃`;

            const message = custom
                ? `┃ 💬 *Message:* ${custom}\n┃`
                : '';

            const tags = members
                .map(jid => `┃ ➣ @${jid.split('@')[0]}`)
                .join('\n');

            const footer =
`
┃
╰━━━━━━━━━━━━━━━━━━╯`;

            const text = header + '\n' + message + tags + footer;

            await sock.sendMessage(
                chatId,
                {
                    text,
                    mentions: members
                },
                { quoted: msg }
            );

        } catch (e) {
            await sock.sendMessage(
                chatId,
                {
                    text:
`╭━━━〔 📢 TAG ALL 〕━━━╮
┃
┃ ❌ *Status:* Failed
┃ ⚠️ *Reason:* ${e.message}
┃
╰━━━━━━━━━━━━━━━━━━╯`
                },
                { quoted: msg }
            );
        }
    }
};
