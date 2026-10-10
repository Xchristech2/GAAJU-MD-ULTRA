'use strict';

module.exports = {
    name: 'lastseen',
    aliases: ['setlastseen', 'lastseenprivacy', 'lsprivacy'],
    description: 'Control who can see your WhatsApp last seen',
    category: 'owner',
    ownerOnly: true,

    async execute(sock, msg, args, prefix, extra) {
        const chatId = msg.key.remoteJid;
        const action = String(args?.[0] || '').toLowerCase().trim();

        const send = async (text, reaction) => {
            if (reaction) {
                try {
                    await sock.sendMessage(chatId, {
                        react: { text: reaction, key: msg.key }
                    });
                } catch {}
            }

            return sock.sendMessage(
                chatId,
                { text },
                { quoted: msg }
            );
        };

        // Owner and sudo permission check
        let isOwner = false;

        try {
            isOwner = Boolean(extra?.jidManager?.isOwner?.(msg));
        } catch (error) {
            console.error('[LASTSEEN] Owner check error:', error);
        }

        if (!isOwner) {
            return send('❌ *Owner Only Command*', '❌');
        }

        const settings = {
            everyone: {
                value: 'all',
                label: 'Everyone',
                emoji: '🌍',
                description: 'Anyone can see your last seen.'
            },
            all: {
                value: 'all',
                label: 'Everyone',
                emoji: '🌍',
                description: 'Anyone can see your last seen.'
            },
            contacts: {
                value: 'contacts',
                label: 'Contacts Only',
                emoji: '👥',
                description: 'Only your contacts can see your last seen.'
            },
            except: {
                value: 'contact_blacklist',
                label: 'Contacts Except...',
                emoji: '🚫',
                description: 'Contacts you exclude cannot see your last seen.'
            },
            nobody: {
                value: 'none',
                label: 'Nobody',
                emoji: '🔒',
                description: 'Your last seen is hidden from everyone.'
            },
            none: {
                value: 'none',
                label: 'Nobody',
                emoji: '🔒',
                description: 'Your last seen is hidden from everyone.'
            },
            hide: {
                value: 'none',
                label: 'Nobody',
                emoji: '🔒',
                description: 'Your last seen is hidden from everyone.'
            },
            off: {
                value: 'none',
                label: 'Nobody',
                emoji: '🔒',
                description: 'Your last seen is hidden from everyone.'
            }
        };

        try {
            await sock.sendMessage(chatId, {
                react: { text: '⏳', key: msg.key }
            });
        } catch {}

        try {
            // Update last-seen privacy
            if (action && settings[action]) {
                const selected = settings[action];

                await sock.updateLastSeenPrivacy(selected.value);

                return send(
                    `*LAST SEEN PRIVACY UPDATED*\n\n` +
                    `${selected.emoji} *Setting:* ${selected.label}\n` +
                    `📝 *Details:* ${selected.description}\n\n` +
                    `_Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ_`,
                    '✅'
                );
            }

            if (action) {
                return send(
                    `❌ *Invalid Option*\n\n` +
                    `Use ${prefix}lastseen to view the available settings.`,
                    '❌'
                );
            }

            // Fetch current privacy setting
            let currentStatus = 'Unknown';

            try {
                const privacy = await sock.fetchPrivacySettings(true);
                const value = privacy.lastSeen || privacy.last;

                const current = Object.values(settings).find(
                    item => item.value === value
                );

                currentStatus = current
                    ? `${current.emoji} ${current.label}`
                    : value || 'Unknown';
            } catch (error) {
                console.error('[LASTSEEN] Privacy fetch error:', error);
            }

            return send(
                `*LAST SEEN PRIVACY*\n\n` +
                `📌 *Current Setting:* ${currentStatus}\n\n` +
                `*AVAILABLE SETTINGS*\n\n` +
                `🌍 *Everyone*\n` +
                `Anyone can see your last seen.\n` +
                `Command: ${prefix}lastseen everyone\n\n` +
                `👥 *Contacts Only*\n` +
                `Only your contacts can see it.\n` +
                `Command: ${prefix}lastseen contacts\n\n` +
                `🚫 *Contacts Except...*\n` +
                `Exclude selected contacts.\n` +
                `Command: ${prefix}lastseen except\n\n` +
                `🔒 *Nobody*\n` +
                `Hide your last seen from everyone.\n` +
                `Command: ${prefix}lastseen nobody\n\n` +
                `_Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ_`,
                '📋'
            );
        } catch (error) {
            console.error('[LASTSEEN] Update error:', error);

            return send(
                `❌ *FAILED TO UPDATE LAST SEEN*\n\n` +
                `Error: ${error.message}\n\n` +
                `Check your Baileys version and try again.`,
                '❌'
            );
        }
    }
};
