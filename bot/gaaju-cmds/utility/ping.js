'use strict';

module.exports = {
    name: 'ping',
    aliases: ['p', 'speed', 'latency'],
    description: 'Check bot response time',
    category: 'utility',

    async execute(sock, msg) {
        const chatId = msg.key.remoteJid;
        const start = Date.now();

        // Send temporary message
        const sent = await sock.sendMessage(chatId, {
            text: "```Checking ping...```"
        }, {
            quoted: msg
        });

        const latency = Date.now() - start;

        // Edit the message (works on newer versions of Baileys/WhatsApp)
        await sock.sendMessage(chatId, {
            text: `\`\`\`ⓘ Pong! ${latency}ms\nLegacy\`\`\``,
            edit: sent.key
        });
    },
};
