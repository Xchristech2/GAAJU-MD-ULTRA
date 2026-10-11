'use strict';

const { delay } = require('wolfsocket');

module.exports = {
    name: ''use strict';

const { delay } = require('wolfsocket');

module.exports = {
    name: 'blockall',

    aliases: [
        'blockeveryone',
        'blockcontacts'
    ],

    description: 'Block all known contacts',

    category: 'owner',

    ownerOnly: true,

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;

        const contacts = global.contactNames
            ? [...global.contactNames.keys()]
            : [];

        const uniqueJids = new Set();

        for (const key of contacts) {
            if (
                !key.includes('@') &&
                key.length > 5 &&
                /^\d+$/.test(key)
            ) {
                uniqueJids.add(
                    `${key}@s.whatsapp.net`
                );
            }
        }

        const ownerId = sock.user?.id
            ?.split(':')[0]
            ?.split('@')[0];

        if (ownerId) {
            uniqueJids.delete(
                `${ownerId}@s.whatsapp.net`
            );
        }

        const jidList = [...uniqueJids];

        if (jidList.length === 0) {
            return sock.sendMessage(
                chatId,
                {
                    text:
                        '🚫 *BLOCK ALL CONTACTS*\n\n' +
                        '⚠️ No contacts found to block.\n\n' +
                        'Contacts are loaded as the bot receives messages. Try again after chatting.'
                },
                { quoted: msg }
            );
        }

        await sock.sendMessage(
            chatId,
            {
                text:
                    '🚫 *BLOCK ALL CONTACTS*\n\n' +
                    `🔄 Blocking *${jidList.length}* contacts...\n` +
                    '⚠️ This may take a moment.'
            },
            { quoted: msg }
        );

        let blocked = 0;
        let failed = 0;

        for (const jid of jidList) {
            try {
                await sock.updateBlockStatus(
                    jid,
                    'block'
                );

                blocked++;

                await delay(500);
            } catch (error) {
                failed++;
            }
        }

        return sock.sendMessage(
            chatId,
            {
                text:
                    '✅ *BLOCKING COMPLETED*\n\n' +
                    `✔️ Blocked: *${blocked}*\n` +
                    `❌ Failed: *${failed}*`
            },
            { quoted: msg }
        );
    }
};',

    aliases: [
        'blockeveryone',
        'blockcontacts'
    ],

    description: 'Block all known contacts',

    category: 'owner',

    ownerOnly: true,

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;

        const contacts = global.contactNames
            ? [...global.contactNames.keys()]
            : [];

        const uniqueJids = new Set();

        for (const key of contacts) {
            if (
                !key.includes('@') &&
                key.length > 5 &&
                /^\d+$/.test(key)
            ) {
                uniqueJids.add(
                    `${key}@s.whatsapp.net`
                );
            }
        }

        const ownerId = sock.user?.id
            ?.split(':')[0]
            ?.split('@')[0];

        if (ownerId) {
            uniqueJids.delete(
                `${ownerId}@s.whatsapp.net`
            );
        }

        const jidList = [...uniqueJids];

        if (jidList.length === 0) {
            return sock.sendMessage(
                chatId,
                {
                    text:
                        '🚫 *BLOCK ALL CONTACTS*\n\n' +
                        '⚠️ No contacts found to block.\n\n' +
                        'Contacts are loaded as the bot receives messages. Try again after chatting.'
                },
                { quoted: msg }
            );
        }

        await sock.sendMessage(
            chatId,
            {
                text:
                    '🚫 *BLOCK ALL CONTACTS*\n\n' +
                    `🔄 Blocking *${jidList.length}* contacts...\n` +
                    '⚠️ This may take a moment.'
            },
            { quoted: msg }
        );

        let blocked = 0;
        let failed = 0;

        for (const jid of jidList) {
            try {
                await sock.updateBlockStatus(
                    jid,
                    'block'
                );

                blocked++;

                await delay(500);
            } catch (error) {
                failed++;
            }
        }

        return sock.sendMessage(
            chatId,
            {
                text:
                    '✅ *BLOCKING COMPLETED*\n\n' +
                    `✔️ Blocked: *${blocked}*\n` +
                    `❌ Failed: *${failed}*`
            },
            { quoted: msg }
        );
    }
};
