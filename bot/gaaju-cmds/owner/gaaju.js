'use strict';

const { getBotName } = require('../../lib/botname');

module.exports = {
    name: 'gaaju',

    aliases: ['owner'],

    description: 'Show information about Chris Gaaju',

    category: 'owner',

    async execute(
        sock,
        msg,
        args,
        prefix,
        ctx
    ) {
        const chatId = msg.key.remoteJid;
        const botName = getBotName();

        // Owner reaction
        try {
            await sock.sendMessage(chatId, {
                react: {
                    text: '👑',
                    key: msg.key
                }
            });
        } catch {}

        const text =
`┏━━❐ *👑 GAAJU TECH* ❐━━
┃✦ *Name:* Chris Gaaju
┃✦ *Number:* +2348069675806
┃✦ *Role:* Bot Developer & Owner 👨‍💻
┃✦ *Project:* GAAJU-MD-ULTRA 🤖
┃✦ *Brand:* Gaaju Tech 🚀
┃
┃✦ *Developer:* Xchris tech 
┗━━❐ *${botName}* ❐

> ⚡ Powered by Chris Gaaju 🔥`;

        try {
            await sock.sendMessage(
                chatId,
                {
                    text: text
                },
                {
                    quoted: msg
                }
            );
        } catch (error) {
            console.error(
                '[GAAJU COMMAND ERROR]',
                error
            );
        }
    }
};
