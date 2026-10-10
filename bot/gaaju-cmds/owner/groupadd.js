'use strict';

module.exports = {
    name: 'groupadd',
    aliases: ['groupaddprivacy', 'setgroupadd', 'whocanadd'],
    description: 'Control who can add you to WhatsApp groups',
    category: 'owner',
    ownerOnly: true,

    async execute(sock, msg, args, prefix, extra) {
        const chatId = msg.key.remoteJid;
        const action = String(args?.[0] || '').toLowerCase();

        const send = (text) =>
            sock.sendMessage(chatId, { text }, { quoted: msg });

        const react = async (emoji) => {
            try {
                await sock.sendMessage(chatId, {
                    react: { text: emoji, key: msg.key }
                });
            } catch {}
        };

        // Owner and sudo permission check
        let isOwner = false;
        let isSudo = false;

        try {
            isOwner = Boolean(extra?.jidManager?.isOwner?.(msg));
            isSudo = Boolean(
                typeof extra?.isSudo === 'function' && extra.isSudo()
            );
        } catch (error) {
            console.error('[GROUPADD] Permission check error:', error);
        }

        if (!isOwner && !isSudo) {
            return send('❌ *Owner Only Command*');
        }

        const options = {
            everyone: {
                value: 'all',
                label: 'Everyone',
                emoji: '🌍',
                description: 'Anyone can add you to groups.'
            },
            all: {
                value: 'all',
                label: 'Everyone',
                emoji: '🌍',
                description: 'Anyone can add you to groups.'
            },
            contacts: {
                value: 'contacts',
                label: 'Contacts Only',
                emoji: '👥',
                description: 'Only your contacts can add you.'
            },
            except: {
                value: 'contact_blacklist',
                label: 'Contacts Except...',
                emoji: '🚫',
                description: 'Your excluded contacts cannot add you.'
            },
            nobody: {
                value: 'none',
                label: 'Nobody',
                emoji: '🔒',
                description: 'No one can add you directly.'
            },
            none: {
                value: 'none',
                label: 'Nobody',
                emoji: '🔒',
                description: 'No one can add you directly.'
            },
            off: {
                value: 'none',
                label: 'Nobody',
                emoji: '🔒',
                description: 'No one can add you directly.'
            }
        };

        try {
            await react('⏳');

            if (action && options[action]) {
                const selected = options[action];

                await sock.updateGroupsAddPrivacy(selected.value);

                await react('✅');

                return send(
                    `*GROUP ADD PRIVACY UPDATED*\n\n` +
                    `${selected.emoji} *Setting:* ${selected.label}\n` +
                    `📝 *Details:* ${selected.description}\n\n` +
                    `_Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ_`
                );
            }

            if (action) {
                return send(
                    `❌ *Invalid Option*\n\n` +
                    `Use ${prefix}groupadd to view the available settings.`
                );
            }

            let currentStatus = 'Unknown';

            try {
                const privacy = await sock.fetchPrivacySettings(true);
                const value = privacy.groupadd || privacy.groupAdd;

                const current = Object.values(options).find(
                    option => option.value === value
                );

                currentStatus = current
                    ? `${current.emoji} ${current.label}`
                    : value || 'Unknown';
            } catch (error) {
                console.error('[GROUPADD] Privacy fetch error:', error);
            }

            await react('📋');

            return send(
                `*GROUP ADD PRIVACY*\n\n` +
                `📌 *Current Setting:* ${currentStatus}\n\n` +
                `*AVAILABLE SETTINGS*\n\n` +
                `🌍 *Everyone*\n` +
                `Anyone can add you to groups.\n` +
                `Command: ${prefix}groupadd everyone\n\n` +
                `👥 *Contacts Only*\n` +
                `Only your contacts can add you.\n` +
                `Command: ${prefix}groupadd contacts\n\n` +
                `🚫 *Contacts Except...*\n` +
                `Exclude selected contacts.\n` +
                `Command: ${prefix}groupadd except\n\n` +
                `🔒 *Nobody*\n` +
                `Prevent direct group additions.\n` +
                `Command: ${prefix}groupadd nobody\n\n` +
                `_Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ_`
            );
        } catch (error) {
            console.error('[GROUPADD] Update error:', error);

            await react('❌');

            return send(
                `❌ *Failed to Update Group Privacy*\n\n` +
                `Error: ${error.message}\n\n` +
                `Check your Baileys version and try again.`
            );
        }
    }
};
