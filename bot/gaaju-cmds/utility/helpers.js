'use strict';

const { getBotName } = require('../../lib/botname');

module.exports = {
    name: 'helpers',
    aliases: ['helper', 'deployhelp', 'deploymenthelp'],
    description: 'Shows contacts who can help with bot deployment',
    category: 'utility',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const botName = getBotName();

        // Reaction
        try {
            await sock.sendMessage(chatId, {
                react: {
                    text: '🛠️',
                    key: msg.key
                }
            });
        } catch {}

        const text = `
┏━━❐ *🛠️ DEPLOYMENT HELPERS* ❐━━
┃
┃✦ Need help deploying *${botName}*?
┃✦ Contact any of the helpers below:
┃
┃➊ 🇳🇬 *+234 904 941 7225*
┃➋ 🇰🇪 *+254 783 628743*
┃➌ 👑 *+234 806 967 5806*
┃   └─ *REAL OWNER*
┃➍ 🇳🇬 *+234 803 891 5922*
┃
┃✦ *HELP AVAILABLE:*
┃• Bot deployment
┃• Pairing / session setup
┃• Hosting setup
┃• Basic bot configuration
┃
┃⚠️ *Only contact the numbers above for deployment help.*
┃
┗━━❐ *${botName}* ❐━━

> ⚡ Powered by Chris Gaaju 🔥
`;

        await sock.sendMessage(
            chatId,
            {
                text,
                contextInfo: {
                    externalAdReply: {
                        title: `${botName} Deployment Help`,
                        body: 'Need help deploying the bot?',
                        mediaType: 1,
                        renderLargerThumbnail: false,
                        showAdAttribution: false
                    }
                }
            },
            { quoted: msg }
        );
    }
};
