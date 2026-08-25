'use strict';

module.exports = {
    name: 'support',
    aliases: ['supportgroup', 'links'],
    description: 'Show GAAJU support and community links',
    category: 'utility',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;

        const text = `
╭━━━〔 🔥 GAAJU SUPPORT 〕━━━╮
┃
┃ 🧪 TEST GROUP
┃ https://chat.whatsapp.com/E4SnKL0H0gxL7aGvqAwB9L
┃
┃ 👑 OFFICIAL GROUP
┃ https://chat.whatsapp.com/LBSpCo12ElQ6zQKG9fgDBQ
┃
┃ 👥 COMMUNITY GROUP
┃ https://chat.whatsapp.com/GN2akLjpON3CQrBjsWsBvW
┃
┃ 📢 OFFICIAL CHANNEL
┃ https://whatsapp.com/channel/0029VbBvGgyFsn0alyIDjw0z
┃
┃ 📢 SECOND CHANNEL
┃ https://whatsapp.com/channel/0029VbCt4MzCHDyk95cErV0y
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

> Join our community and stay updated 🚀
`;

        await sock.sendMessage(
            chatId,
            {
                text: text.trim()
            },
            { quoted: msg }
        );
    }
};
