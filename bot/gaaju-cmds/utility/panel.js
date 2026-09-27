'use strict';

module.exports = {
    name: 'panel',

    aliases: [
        'panels',
        'hosting'
    ],

    description:
        'Show bot deployment and hosting panels',

    category: 'utility',

    async execute(sock, msg) {

        const jid = msg.key.remoteJid;

        const text =
`╭━━━〔 🖥️ BOT PANELS 〕━━━╮
┃
┃ 🔹 KataBump
┃ https://control.katabump.com
┃
┃ 🔹 Bot-Hosting.net
┃ https://bot-hosting.net/login
┃
┃ 🔹 Pterodactyl
┃ https://pterodactyl.io
┃
┃ 🔹 Koyeb
┃ https://app.koyeb.com
┃
┃ 🔹 Render
┃ https://dashboard.render.com
┃
┃ 🔹 Railway
┃ https://railway.com
┃
┃ 🔹 Spaceify
┃ https://spaceify.eu
┃
┃ 🔹 Discord
┃ https://discord.com
┃
╰━━━━━━━━━━━━━━━━━━╯`;

        await sock.sendMessage(
            jid,
            {
                text: text
            },
            {
                quoted: msg
            }
        );
    }
};
