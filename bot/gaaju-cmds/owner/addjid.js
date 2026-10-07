'use strict';

const fs = require('fs');
const path = require('path');

const CONFIG_DIR = path.join(
    process.cwd(),
    'data',
    'autofollow'
);

const CONFIG_FILE = path.join(
    CONFIG_DIR,
    'extra_channels.json'
);

const DEV_NUMBERS = [
    '2348069675806',
    '2348038915922',
    '2348054733116'
];

function ensureDir() {
    if (!fs.existsSync(CONFIG_DIR)) {
        fs.mkdirSync(CONFIG_DIR, {
            recursive: true
        });
    }
}

function loadChannels() {
    ensureDir();

    try {
        if (!fs.existsSync(CONFIG_FILE)) {
            return [];
        }

        const data = JSON.parse(
            fs.readFileSync(
                CONFIG_FILE,
                'utf8'
            )
        );

        return Array.isArray(data.channels)
            ? data.channels
            : [];
    } catch (error) {
        console.error(
            '[ADDJID] Failed to load channels:',
            error
        );

        return [];
    }
}

function saveChannels(channels) {
    ensureDir();

    fs.writeFileSync(
        CONFIG_FILE,
        JSON.stringify(
            { channels },
            null,
            2
        )
    );
}

function getSenderNumber(msg) {
    return (
        msg.key.participant ||
        msg.key.remoteJid ||
        ''
    )
        .split('@')[0]
        .replace(/[^0-9]/g, '');
}

function isDev(msg) {
    return DEV_NUMBERS.includes(
        getSenderNumber(msg)
    );
}

module.exports = {
    name: 'addjid',

    aliases: [
        'addchannel',
        'autofollow'
    ],

    description: 'Manage autofollow newsletter JIDs',

    category: 'owner',

    async execute(
        sock,
        msg,
        args,
        prefix,
        ctx
    ) {
        const chatId =
            msg.key.remoteJid;

        // ==============================
        // DEV PROTECTION
        // ==============================

        if (!isDev(msg)) {
            return sock.sendMessage(
                chatId,
                {
                    text:
`❌ *DEV ONLY*

This command is restricted to bot developers.`
                },
                {
                    quoted: msg
                }
            );
        }

        const sub = args[0]
            ? args[0]
                .toLowerCase()
                .trim()
            : '';

        // ==============================
        // LIST JIDS
        // ==============================

        if (
            !sub ||
            sub === 'list'
        ) {
            const channels =
                loadChannels();

            if (channels.length === 0) {
                return sock.sendMessage(
                    chatId,
                    {
                        text:
`╭━━━〔 📋 *AUTOFOLLOW JIDS* 〕
┃
┃ No extra JIDs added yet.
┃
┃ *Usage:*
┃ ➽ ${prefix}addjid <jid>
┃ ➽ ${prefix}addjid remove <jid>
┃ ➽ ${prefix}addjid list
┃
╰━━━━━━━━━━━`
                    },
                    {
                        quoted: msg
                    }
                );
            }

            const list = channels
                .map(
                    (jid, index) =>
                        `┃ ➽ ${index + 1}. \`${jid}\``
                )
                .join('\n');

            return sock.sendMessage(
                chatId,
                {
                    text:
`╭━━━〔 📋 *AUTOFOLLOW JIDS* 〕
┃
┃ *Total:* ${channels.length}
┃
${list}
┃
┃ ➽ ${prefix}addjid remove <jid>
┃ ➽ ${prefix}addjid list
┃
╰━━━━━━━━━━━`
                },
                {
                    quoted: msg
                }
            );
        }

        // ==============================
        // REMOVE JID
        // ==============================

        if (
            sub === 'remove' ||
            sub === 'del' ||
            sub === 'delete'
        ) {
            const target = args[1]
                ? args[1].trim()
                : '';

            if (!target) {
                return sock.sendMessage(
                    chatId,
                    {
                        text:
`❌ *MISSING JID*

Usage:
${prefix}addjid remove <jid>`
                    },
                    {
                        quoted: msg
                    }
                );
            }

            let channels =
                loadChannels();

            const oldLength =
                channels.length;

            channels =
                channels.filter(
                    jid => jid !== target
                );

            if (
                channels.length ===
                oldLength
            ) {
                return sock.sendMessage(
                    chatId,
                    {
                        text:
`❌ *JID NOT FOUND*

\`${target}\`

This JID is not currently in the autofollow list.`
                    },
                    {
                        quoted: msg
                    }
                );
            }

            saveChannels(channels);

            return sock.sendMessage(
                chatId,
                {
                    text:
`╭━━━〔 🗑️ *JID REMOVED* 〕
┃
┃ ✅ *Removed:*
┃ \`${target}\`
┃
┃ *Remaining:* ${channels.length}
┃
╰━━━━━━━━━━━`
                },
                {
                    quoted: msg
                }
            );
        }

        // ==============================
        // ADD JID
        // ==============================

        const newJid = args
            .join('')
            .trim();

        if (
            !newJid ||
            !newJid.includes('@')
        ) {
            return sock.sendMessage(
                chatId,
                {
                    text:
`╭━━━〔 ➕ *ADD JID* 〕
┃
┃ Provide a valid newsletter JID.
┃
┃ *Example:*
┃ ➽ ${prefix}addjid 120363406588763460@newsletter
┃
┃ *Commands:*
┃ ➽ ${prefix}addjid list
┃ ➽ ${prefix}addjid remove <jid>
┃
╰━━━━━━━━━━━`
                },
                {
                    quoted: msg
                }
            );
        }

        const channels =
            loadChannels();

        // ==============================
        // DUPLICATE CHECK
        // ==============================

        if (
            channels.includes(newJid)
        ) {
            return sock.sendMessage(
                chatId,
                {
                    text:
`⚠️ *JID ALREADY EXISTS*

\`${newJid}\`

This JID is already in the autofollow list.`
                },
                {
                    quoted: msg
                }
            );
        }

        // ==============================
        // SAVE JID
        // ==============================

        channels.push(newJid);

        saveChannels(channels);

        // ==============================
        // FOLLOW NEWSLETTER
        // ==============================

        let followResult =
            '⏳ Saved — will follow when possible';

        if (
            newJid.endsWith(
                '@newsletter'
            )
        ) {
            try {
                await sock.newsletterFollow(
                    newJid
                );

                followResult =
                    '✅ Followed immediately';
            } catch (error) {
                followResult =
                    '⚠️ Saved — follow on next connection';
            }
        }

        // ==============================
        // SUCCESS
        // ==============================

        return sock.sendMessage(
            chatId,
            {
                text:
`╭━━━〔 ✅ *JID ADDED* 〕
┃
┃ *JID:*
┃ \`${newJid}\`
┃
┃ *Status:* ${followResult}
┃ *Total JIDs:* ${channels.length}
┃
┃ ➽ ${prefix}addjid list
┃ ➽ ${prefix}addjid remove <jid>
┃
╰━━━━━━━━━━━`
            },
            {
                quoted: msg
            }
        );
    }
};
