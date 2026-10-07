'use strict';

const SEND_DELAY = 1500;

const sleep = (ms) =>
    new Promise(resolve => setTimeout(resolve, ms));

async function getGroupJids(sock) {
    const groups =
        await sock.groupFetchAllParticipating();

    return Object.keys(groups || {});
}

function getChatJids(sock) {
    const contacts =
        sock.store?.contacts || {};

    return Object.keys(contacts).filter(
        jid =>
            jid.endsWith('@s.whatsapp.net') &&
            jid !== 'status@broadcast'
    );
}

module.exports = {
    name: 'broadcast',

    aliases: [
        'bc',
        'bcast',
        'sendall'
    ],

    description:
        'Broadcast a text message to groups or chats',

    category: 'owner',

    ownerOnly: true,

    async execute(
        sock,
        msg,
        args,
        prefix,
        ctx
    ) {
        const chatId =
            msg.key.remoteJid;

        const reply = async (text) => {
            return sock.sendMessage(
                chatId,
                { text },
                { quoted: msg }
            );
        };

        const HELP =
`╭━━━〔 📡 *BROADCAST* 〕
┃
┃ *Usage:*
┃ ➽ ${prefix}broadcast groups <message>
┃ ➽ ${prefix}broadcast chats <message>
┃ ➽ ${prefix}broadcast all <message>
┃
┃ *Targets:*
┃ ➽ groups — All groups
┃ ➽ chats — All private chats
┃ ➽ all — Groups + private chats
┃
╰━━━━━━━━━━━`;

        if (args.length < 2) {
            return reply(HELP);
        }

        const target =
            args[0]
                .toLowerCase()
                .trim();

        const message =
            args
                .slice(1)
                .join(' ')
                .trim();

        if (
            ![
                'groups',
                'chats',
                'all'
            ].includes(target)
        ) {
            return reply(HELP);
        }

        if (!message) {
            return reply(
`❌ *MESSAGE EMPTY*

Please provide a message.

${HELP}`
            );
        }

        // Processing reaction
        try {
            await sock.sendMessage(
                chatId,
                {
                    react: {
                        text: '⏳',
                        key: msg.key
                    }
                }
            );
        } catch {}

        // Collect targets
        let jids = [];

        try {
            if (
                target === 'groups' ||
                target === 'all'
            ) {
                const groupJids =
                    await getGroupJids(sock);

                jids.push(
                    ...groupJids
                );
            }

            if (
                target === 'chats' ||
                target === 'all'
            ) {
                const chatJids =
                    getChatJids(sock);

                jids.push(
                    ...chatJids
                );
            }
        } catch (error) {
            try {
                await sock.sendMessage(
                    chatId,
                    {
                        react: {
                            text: '❌',
                            key: msg.key
                        }
                    }
                );
            } catch {}

            return reply(
`❌ *FAILED TO GET TARGETS*

${error.message}`
            );
        }

        // Remove duplicates, bot's own JID and current chat
        const selfJid =
            sock.user?.id;

        jids = [
            ...new Set(jids)
        ].filter(
            jid =>
                jid !== selfJid &&
                jid !== chatId
        );

        if (jids.length === 0) {
            try {
                await sock.sendMessage(
                    chatId,
                    {
                        react: {
                            text: '❌',
                            key: msg.key
                        }
                    }
                );
            } catch {}

            return reply(
`❌ *NO TARGETS FOUND*

No chats were found for:
*${target}*`
            );
        }

        // Status message
        let statusMsg;

        try {
            statusMsg =
                await sock.sendMessage(
                    chatId,
                    {
                        text:
`╭━━━〔 📡 *BROADCASTING* 〕
┃
┃ 🎯 *Target:* ${target}
┃ 📬 *Recipients:* ${jids.length}
┃
┃ ⏳ Please wait...
┃
╰━━━━━━━━━━━`
                    },
                    {
                        quoted: msg
                    }
                );
        } catch {}

        let sent = 0;
        let failed = 0;

        // Send to each target
        for (const jid of jids) {
            try {
                await sock.sendMessage(
                    jid,
                    {
                        text: message
                    }
                );

                sent++;
            } catch (error) {
                failed++;
            }

            await sleep(
                SEND_DELAY
            );
        }

        // Final report
        const summary =
`╭━━━〔 📡 *BROADCAST COMPLETE* 〕
┃
┃ 🎯 *Target:* ${target}
┃ 📬 *Total:* ${jids.length}
┃
┃ ✅ *Sent:* ${sent}
┃ ❌ *Failed:* ${failed}
┃
╰━━━━━━━━━━━`;

        // Try editing status message
        if (statusMsg?.key) {
            try {
                await sock.sendMessage(
                    chatId,
                    {
                        text: summary,
                        edit: statusMsg.key
                    }
                );
            } catch {
                await reply(summary);
            }
        } else {
            await reply(summary);
        }

        // Success reaction
        try {
            await sock.sendMessage(
                chatId,
                {
                    react: {
                        text: '✅',
                        key: msg.key
                    }
                }
            );
        } catch {}
    }
};
