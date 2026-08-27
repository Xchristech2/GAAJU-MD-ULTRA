'use strict';

module.exports = {
    command: ['date'],
    operate: async ({ m, reply }) => {
        const now = new Date();

        const options = {
            timeZone: 'Africa/Lagos',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };

        const date = new Intl.DateTimeFormat('en-NG', options).format(now);

        const time = new Intl.DateTimeFormat('en-NG', {
            timeZone: 'Africa/Lagos',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        }).format(now);

        const text = `
╭━━〔 📅 DATE & TIME 〕━━╮
┃
┃ 📆 Date: ${date}
┃ ⏰ Time: ${time}
┃ 🌍 Timezone: WAT
┃
╰━━━━━━━━━━━━━━━━━━━━╯
🤖 GAAJU-MD-ULTRA
`;

        await reply(text);
    }
};
