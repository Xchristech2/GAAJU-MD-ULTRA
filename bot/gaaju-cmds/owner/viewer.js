'use strict';

module.exports = {
    name: 'viewer',
    aliases: [
        'statusviewer',
        'statusview',
        'statusprivacy',
        'viewstatus'
    ],
    category: 'owner',
    description: 'Control WhatsApp status privacy',
    ownerOnly: true,

    async execute(sock, msg, args, prefix, extra) {
        const chatId = msg.key.remoteJid;
        const action = String(args?.[0] || '').toLowerCase();

        try {
            const isSudoUser = extra?.isSudo
                ? extra.isSudo()
                : false;

            const isOwner = extra?.jidManager?.isOwner
                ? extra.jidManager.isOwner(msg)
                : false;

            if (!isOwner && !isSudoUser) {
                return sock.sendMessage(
                    chatId,
                    { text: '❌ *Owner Only Command*' },
                    { quoted: msg }
                );
            }
        } catch (error) {
            console.error('[VIEWER] Owner check error:', error);

            return sock.sendMessage(
                chatId,
                { text: '❌ Unable to verify owner permissions.' },
                { quoted: msg }
            );
        }

        const sendReply = async (text, emoji = '📊') => {
            try {
                await sock.sendMessage(chatId, {
                    react: { text: '⏳', key: msg.key }
                });
            } catch {}

            await sock.sendMessage(
                chatId,
                { text },
                { quoted: msg }
            );

            try {
                await sock.sendMessage(chatId, {
                    react: { text: emoji, key: msg.key }
                });
            } catch {}
        };

        try {
            const settings = {
                everyone: {
                    value: 'all',
                    title: '🌍 Everyone',
                    emoji: '🌍'
                },
                all: {
                    value: 'all',
                    title: '🌍 Everyone',
                    emoji: '🌍'
                },
                contacts: {
                    value: 'contacts',
                    title: '👥 Contacts Only',
                    emoji: '👥'
                },
                except: {
                    value: 'contact_blacklist',
                    title: '🚫 Contacts Except...',
                    emoji: '🚫'
                },
                nobody: {
                    value: 'none',
                    title: '🔒 Nobody',
                    emoji: '🔒'
                },
                none: {
                    value: 'none',
                    title: '🔒 Nobody',
                    emoji: '🔒'
                }
            };

            if (settings[action]) {
                const selected = settings[action];

                await sock.updateStatusPrivacy(selected.value);

                return await sendReply(
`╭━━〔 *GAAJU-MD-ULTRA* 〕
┃
┃ ◁ *STATUS PRIVACY UPDATED*
┃
┃ ▸ *Setting:* ${selected.title}
┃ ▸ *Status:* ✅ Successfully updated
┃
╰━━━━━━━━━━━━━━━━━━
> Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ`,
                    selected.emoji
                );
            }

            let currentStatus = 'Unknown';

            try {
                const privacy = await sock.fetchPrivacySettings(true);
                const status = privacy?.status || privacy?.statusPrivacy;

                const statusNames = {
                    all: '🌍 Everyone',
                    contacts: '👥 Contacts Only',
                    contact_blacklist: '🚫 Contacts Except...',
                    none: '🔒 Nobody'
                };

                currentStatus = statusNames[status] || status || 'Unknown';
            } catch (error) {
                console.warn(
                    '[VIEWER] Could not fetch privacy:',
                    error.message
                );
            }

            return await sendReply(
`╭━━〔 *GAAJU-MD-ULTRA* 〕
┃
┃ ◁ *STATUS VIEWER*
┃ ▸ *Current:* ${currentStatus}
┃
┃ ◁ *AVAILABLE OPTIONS*
┃
┃ ▸ ${prefix}viewer everyone
┃   └ Set status to everyone
┃
┃ ▸ ${prefix}viewer contacts
┃   └ Contacts only
┃
┃ ▸ ${prefix}viewer except
┃   └ Contacts except selected people
┃
┃ ▸ ${prefix}viewer nobody
┃   └ Nobody can view your status
┃
╰━━━━━━━━━━━━━━━━━━
> Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ`,
                '📋'
            );

        } catch (error) {
            console.error('[VIEWER] Error:', error);

            return await sendReply(
`╭━━〔 *GAAJU-MD-ULTRA* 〕
┃
┃ ❌ *STATUS PRIVACY ERROR*
┃
┃ ▸ ${error.message || 'Unable to update status privacy.'}
┃
╰━━━━━━━━━━━━━━━━━━`,
                '❌'
            );
        }
    }
};
