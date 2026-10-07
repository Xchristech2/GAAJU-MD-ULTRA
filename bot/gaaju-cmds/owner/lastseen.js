'use strict';

module.exports = {
    name: 'lastseen',

    aliases: [
        'setlastseen',
        'lastseenprivacy',
        'lsprivacy'
    ],

    description:
        'Control who can see your last seen on WhatsApp',

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

        const action =
            (args[0] || '')
                .toLowerCase()
                .trim();

        const send = async (
            text,
            reaction = null
        ) => {
            if (reaction) {
                try {
                    await sock.sendMessage(
                        chatId,
                        {
                            react: {
                                text: reaction,
                                key: msg.key
                            }
                        }
                    );
                } catch {}
            }

            return sock.sendMessage(
                chatId,
                { text },
                { quoted: msg }
            );
        };

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

        // Everyone
        if (
            action === 'everyone' ||
            action === 'all'
        ) {
            await sock.updateLastSeenPrivacy(
                'all'
            );

            return send(
`╭━━━〔 🕓 *LAST SEEN PRIVACY* 〕
┃
┃ *Set:* 🌍 Everyone
┃
┃ Anyone can see your last seen.
┃
╰━━━━━━━━━━━`,
                '🌍'
            );
        }

        // Contacts
        if (action === 'contacts') {
            await sock.updateLastSeenPrivacy(
                'contacts'
            );

            return send(
`╭━━━〔 🕓 *LAST SEEN PRIVACY* 〕
┃
┃ *Set:* 👥 Contacts Only
┃
┃ Only your contacts can see
┃ your last seen.
┃
╰━━━━━━━━━━━`,
                '👥'
            );
        }

        // Contacts except blacklist
        if (action === 'except') {
            await sock.updateLastSeenPrivacy(
                'contact_blacklist'
            );

            return send(
`╭━━━〔 🕓 *LAST SEEN PRIVACY* 〕
┃
┃ *Set:* 🚫 Contacts Except...
┃
┃ Contacts except blacklisted
┃ ones can see your last seen.
┃
╰━━━━━━━━━━━`,
                '🚫'
            );
        }

        // Nobody
        if (
            action === 'none' ||
            action === 'nobody' ||
            action === 'hide' ||
            action === 'off'
        ) {
            await sock.updateLastSeenPrivacy(
                'none'
            );

            return send(
`╭━━━〔 🕓 *LAST SEEN PRIVACY* 〕
┃
┃ *Set:* 🔒 Nobody
┃
┃ No one can see your last seen.
┃
╰━━━━━━━━━━━`,
                '🔒'
            );
        }

        // Show current status
        let currentStatus =
            'Unknown';

        try {
            const privacy =
                await sock.fetchPrivacySettings(
                    true
                );

            const last =
                privacy.last ||
                privacy.lastSeen;

            if (last === 'all') {
                currentStatus =
                    '🌍 Everyone';
            } else if (
                last === 'contacts'
            ) {
                currentStatus =
                    '👥 Contacts Only';
            } else if (
                last === 'contact_blacklist'
            ) {
                currentStatus =
                    '🚫 Contacts Except...';
            } else if (
                last === 'none'
            ) {
                currentStatus =
                    '🔒 Nobody';
            } else {
                currentStatus =
                    last || 'Unknown';
            }
        } catch {}

        return send(
`╭━━━〔 🕓 *LAST SEEN PRIVACY* 〕
┃
┃ *Current:* ${currentStatus}
┃
┃ ╭━━〔 ⚙️ *OPTIONS* 〕
┃
┃ ➽ ${prefix}lastseen everyone
┃ ➽ ${prefix}lastseen contacts
┃ ➽ ${prefix}lastseen except
┃ ➽ ${prefix}lastseen nobody
┃
╰━━━━━━━━━━━`,
            '📋'
        );

    } catch (error) {
        console.error(
            '[LASTSEEN ERROR]',
            error
        );

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

        return sock.sendMessage(
            chatId,
            {
                text:
`❌ *FAILED TO UPDATE LAST SEEN*

${error.message}`
            },
            {
                quoted: msg
            }
        );
    }
}
};
