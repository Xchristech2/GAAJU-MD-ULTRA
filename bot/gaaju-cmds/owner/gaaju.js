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

        try {
            await sock.sendMessage(chatId, {
                react: {
                    text: '👑',
                    key: msg.key
                }
            });
        } catch {}

        const text = `
┏━━❐ *👑 CHRIS GAAJU* ❐━━

┃✦ *Name:* Chris Gaaju
┃✦ *Role:* Bot Developer & Owner 👨‍💻
┃✦ *Project:* GAAJU-MD-ULTRA 🤖
┃✦ *Brand:* Gaaju Tech 🚀
┃
┃✦ *🎤 MUSIC*
┃
┃✦ *Artist Name:* Young Gaaju
┃✦ *Status:* Upcoming Artist 🔥
┃
┃🙏 I'm praying to God Almighty to guide me,
┃give me strength, wisdom and the opportunity
┃to become a successful artist. ❤️🎤
┃
┃✦ *Developer:* Chris Gaaju
┃✦ *Bot:* GAAJU-MD-ULTRA
┃
┗━━❐ *${botName}* ❐

> ⚡ Powered by Chris Gaaju 🔥
`;

        try {
            // Send owner information
            await sock.sendMessage(
                chatId,
                {
                    text: text.trim()
                },
                {
                    quoted: msg
                }
            );

            // Send phone number as a separate contact
            await sock.sendMessage(chatId, {
                contacts: {
                    displayName: 'Chris Gaaju',
                    contacts: [
                        {
                            vcard:
                                'BEGIN:VCARD\\n' +
                                'VERSION:3.0\\n' +
                                'FN:Chris Gaaju\\n' +
                                'TEL;type=CELL;type=VOICE;waid=2348069675806:+2348069675806\\n' +
                                'END:VCARD'
                        }
                    ]
                }
            });

        } catch (error) {
            console.error(
                '[GAAJU COMMAND ERROR]',
                error
            );
        }
    }
};
