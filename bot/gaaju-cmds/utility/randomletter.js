'use strict';

module.exports = {
    name: 'randomletter',
    aliases: [],
    description: 'Generate a random letter',
    category: 'utility',

    async execute(sock, msg) {
        const chatId = msg.key.remoteJid;
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const letter = letters[Math.floor(Math.random() * letters.length)];

        await sock.sendMessage(chatId, {
            text: `🔤 ${letter}`
        }, { quoted: msg });
    }
};
