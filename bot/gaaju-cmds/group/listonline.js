'use strict';

const { getBotName } = require('../../lib/botname');

const presenceCache = new Map();

let presenceListenerInstalled = false;

function installPresenceListener(sock) {
    if (presenceListenerInstalled) return;

    if (!sock?.ev?.on) return;

    presenceListenerInstalled = true;

    sock.ev.on('presence.update', update => {
        try {
            const groupId = update?.id;

            if (
                !groupId ||
                !groupId.endsWith('@g.us')
            ) {
                return;
            }

            if (!presenceCache.has(groupId)) {
                presenceCache.set(
                    groupId,
                    new Map()
                );
            }

            const groupPresence =
                presenceCache.get(groupId);

            const presences =
                update.presences || {};

            for (const [jid, data] of Object.entries(presences)) {

                if (!jid || !data) continue;

                const status =
                    data.lastKnownPresence ||
                    data.presence ||
                    'unavailable';

                if (
                    status === 'available' ||
                    status === 'composing' ||
                    status === 'recording'
                ) {
                    groupPresence.set(jid, {
                        status,
                        time: Date.now()
                    });
                } else {
                    groupPresence.delete(jid);
                }
            }

        } catch (error) {
            console.log(
                '[LISTONLINE PRESENCE]',
                error?.message || error
            );
        }
    });
}

function cleanJid(jid) {
    return String(jid || '')
        .split('@')[0]
        .split(':')[0];
}

module.exports = {
    name: 'listonline',

    aliases: [
        'online',
        'onlineusers',
        'onlinelist'
    ],

    description:
        'Show members currently known as online',

    category: 'group',

    async execute(
        sock,
        msg,
        args,
        prefix,
        ctx
    ) {

        const chatId =
            msg?.key?.remoteJid;

        const botName =
            getBotName();

        /*
         * START PRESENCE LISTENER
         */
        installPresenceListener(sock);

        /*
         * GROUP ONLY
         */
        if (
            !chatId ||
            !chatId.endsWith('@g.us')
        ) {

            return await sock.sendMessage(
                chatId,
                {
                    text:
                        `┏━━❐ 👥 GROUP ❐\n` +
                        `┃✦ Status: ❌ Group only\n` +
                        `┃✦ Command: ${prefix || '.'}listonline\n` +
                        `┗━━❐`
                },
                {
                    quoted: msg
                }
            );
        }

        /*
         * REACTION
         */
        try {
            await sock.sendMessage(
                chatId,
                {
                    react: {
                        text: '🟢',
                        key: msg.key
                    }
                }
            );
        } catch {}

        try {

            /*
             * GET GROUP DATA
             */
            const metadata =
                await sock.groupMetadata(
                    chatId
                );

            const participants =
                metadata?.participants || [];

            /*
             * GET PRESENCE
             */
            const groupPresence =
                presenceCache.get(chatId) ||
                new Map();

            /*
             * FIND ONLINE MEMBERS
             */
            const onlineMembers = [];

            for (
                const participant
                of participants
            ) {

                const jid =
                    participant?.id;

                if (!jid) continue;

                if (
                    groupPresence.has(jid)
                ) {
                    onlineMembers.push(jid);
                }
            }

            /*
             * REMOVE DUPLICATES
             */
            const uniqueMembers = [
                ...new Set(
                    onlineMembers
                )
            ];

            /*
             * BUILD YOUR MENU STYLE
             */
            const lines = [];

            lines.push(
                `┏━━❐ 👥 GROUP ❐`
            );

            lines.push(
                `┃✦ 🟢 Online Members: ${uniqueMembers.length}`
            );

            lines.push(
                `┃✦ Group: ${metadata.subject || 'Unknown'}`
            );

            lines.push(
                `┃`
            );

            /*
             * NO ONLINE MEMBERS
             */
            if (
                uniqueMembers.length === 0
            ) {

                lines.push(
                    `┃✦ No online members detected`
                );

                lines.push(
                    `┃✦ WhatsApp presence is not available`
                );

            } else {

                /*
                 * LIST MEMBERS
                 */
                uniqueMembers.forEach(
                    (jid, index) => {

                        const number =
                            cleanJid(jid);

                        lines.push(
                            `┃✦ ${index + 1}. @${number}`
                        );
                    }
                );
            }

            lines.push(
                `┗━━❐`
            );

            /*
             * SEND
             */
            await sock.sendMessage(
                chatId,
                {
                    text:
                        lines.join('\n'),

                    mentions:
                        uniqueMembers
                },
                {
                    quoted: msg
                }
            );

        } catch (error) {

            console.error(
                '[LISTONLINE ERROR]',
                error
            );

            await sock.sendMessage(
                chatId,
                {
                    text:
                        `┏━━❐ 👥 GROUP ❐\n` +
                        `┃✦ Status: ❌ Failed\n` +
                        `┃✦ Reason: ${error?.message || error}\n` +
                        `┗━━❐`
                },
                {
                    quoted: msg
                }
            );
        }
    }
};
