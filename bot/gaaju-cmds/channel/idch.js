'use strict';

const { getBotName } = require('../../lib/botname');

module.exports = {
    name: 'idch',

    aliases: [
        'channelid'
    ],

    description:
        'Get the WhatsApp Channel / Newsletter ID from a channel link',

    category: 'channel',

    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        const botName = getBotName();

        try {
            // Get the supplied link
            const input = args.join(' ').trim();

            if (!input) {
                return await sock.sendMessage(
                    chatId,
                    {
                        text:
`┏━━❐ 📢 CHANNEL ID ❐
┃
┃✦ Usage:
┃  ${prefix}idch <channel link>
┃
┃✦ Example:
┃  ${prefix}idch https://whatsapp.com/channel/XXXXXXXX
┃
┗━━❐
> Powered by ${botName}`
                    },
                    {
                        quoted: msg
                    }
                );
            }

            // Extract WhatsApp channel invite code
            const match = input.match(
                /whatsapp\.com\/channel\/([A-Za-z0-9_-]+)/i
            );

            if (!match) {
                return await sock.sendMessage(
                    chatId,
                    {
                        text:
`❌ Invalid WhatsApp Channel link.

Example:
${prefix}idch https://whatsapp.com/channel/XXXXXXXX`
                    },
                    {
                        quoted: msg
                    }
                );
            }

            const inviteCode = match[1];

            /*
             * Try to resolve the newsletter/channel.
             *
             * Different Baileys/Wolfsocket versions expose
             * channel metadata differently, so try the
             * available newsletter/channel methods.
             */

            let metadata = null;

            // Method 1
            if (
                typeof sock.newsletterMetadata === 'function'
            ) {
                try {
                    metadata =
                        await sock.newsletterMetadata(
                            'invite',
                            inviteCode
                        );
                } catch {}
            }

            // Method 2
            if (
                !metadata &&
                typeof sock.newsletterMetadata === 'function'
            ) {
                try {
                    metadata =
                        await sock.newsletterMetadata(
                            'invite',
                            inviteCode
                        );
                } catch {}
            }

            /*
             * Some WhatsApp libraries return the JID
             * directly inside the metadata.
             */
            const newsletterId =
                metadata?.id ||
                metadata?.jid ||
                metadata?.newsletterJid ||
                metadata?.newsletter?.id ||
                metadata?.newsletter?.jid ||
                null;

            if (!newsletterId) {
                return await sock.sendMessage(
                    chatId,
                    {
                        text:
`┏━━❐ 📢 CHANNEL ID ❐
┃
┃✦ Status: ❌ Unable to resolve
┃
┃✦ Channel link was detected,
┃  but your current WhatsApp
┃  library did not return the
┃  internal newsletter ID.
┃
┃✦ Invite Code:
┃  ${inviteCode}
┃
┗━━❐
> Powered by ${botName}`
                    },
                    {
                        quoted: msg
                    }
                );
            }

            await sock.sendMessage(
                chatId,
                {
                    text:
`┏━━❐ 📢 CHANNEL ID ❐
┃
┃✦ Status: ✅ Found
┃
┃✦ Newsletter ID:
┃  ${newsletterId}
┃
┃✦ Invite Code:
┃  ${inviteCode}
┃
┗━━❐
> Powered by ${botName}`
                },
                {
                    quoted: msg
                }
            );

        } catch (error) {

            console.error(
                '[IDCH ERROR]',
                error
            );

            await sock.sendMessage(
                chatId,
                {
                    text:
`❌ Failed to get Channel ID.

Reason:
${error?.message || 'Unknown error'}

> Powered by ${botName}`
                },
                {
                    quoted: msg
                }
            );
        }
    }
};
