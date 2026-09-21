'use strict';

module.exports = {
    name: 'edit',
    aliases: [],
    description: 'Edit your own message',
    category: 'utility',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const contextInfo = msg.message?.extendedTextMessage?.contextInfo;

        if (!contextInfo?.stanzaId) {
            return sock.sendMessage(
                chatId,
                {
                    text: `❌ Reply to the message you want to edit.\n\nExample:\n${prefix}edit I am fine`
                },
                { quoted: msg }
            );
        }

        const newText = args.join(' ').trim();

        if (!newText) {
            return sock.sendMessage(
                chatId,
                {
                    text: `❌ Enter the new message.\n\nExample:\n${prefix}edit I am fine`
                },
                { quoted: msg }
            );
        }

        try {
            await sock.sendMessage(chatId, {
                text: newText,
                edit: {
                    remoteJid: chatId,
                    fromMe: true,
                    id: contextInfo.stanzaId
                }
            });
        } catch (error) {
            console.error('EDIT ERROR:', error);

            await sock.sendMessage(
                chatId,
                {
                    text: '❌ Failed to edit the message. Make sure you replied to your own message.'
                },
                { quoted: msg }
            );
        }
    }
};
