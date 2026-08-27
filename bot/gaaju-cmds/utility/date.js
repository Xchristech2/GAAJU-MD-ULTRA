'use strict';

module.exports = {
    name: 'date',
    aliases: ['today'],
    description: 'Show the current date and time',
    category: 'utility',

    async execute(sock, msg) {
        const chatId = msg.key.remoteJid;

        const now = new Date();

        const date = new Intl.DateTimeFormat('en-NG', {
            timeZone: 'Africa/Lagos',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(now);

        const time = new Intl.DateTimeFormat('en-NG', {
            timeZone: 'Africa/Lagos',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        }).format(now);

        const text = `
┏━━❐ 📅 DATE ❐
┃
┃ ✦ 📆 Date: ${date}
┃ ✦ ⏰ Time: ${time}
┃ ✦ 🌍 Timezone: WAT
┃
┗━━❐
> Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ
`;

        await sock.sendMessage(
            chatId,
            {
                text: text
            },
            {
                quoted: msg
            }
        );
    },
};
