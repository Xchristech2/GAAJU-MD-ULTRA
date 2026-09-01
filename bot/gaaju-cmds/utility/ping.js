'use strict';

const { getBotName } = require('../../lib/botname');

module.exports = {
    name: 'ping',
    aliases: ['p', 'speed', 'latency'],
    description: 'Check bot response time',
    category: 'utility',

    async execute(sock, msg) {
        const chatId = msg.key.remoteJid;
        const start = Date.now();

        const botName = getBotName();

        // Send temporary message
        const sent = await sock.sendMessage(
            chatId,
            {
                text: `*${botName} is checking... 😂*`
            },
            {
                quoted: msg
            }
        );

        const latency = Date.now() - start;

        // Edit the message
        await sock.sendMessage(
            chatId,
            {
                text: `*⚡ ${botName}!*\n*Speed: ${latency}ms*`,
                edit: sent.key
            }
        );
    },
};
