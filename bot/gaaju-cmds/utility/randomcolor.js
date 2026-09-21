'use strict';

module.exports = {
    name: 'randomcolor',
    aliases: [],
    description: 'Generate a random color',
    category: 'utility',

    async execute(sock, msg) {
        const chatId = msg.key.remoteJid;

        const hex = '#' + Math.floor(Math.random() * 0xFFFFFF)
            .toString(16)
            .padStart(6, '0')
            .toUpperCase();

        await sock.sendMessage(chatId, {
            text: `🎨 Random Color: ${hex}`
        }, { quoted: msg });
    }
};
