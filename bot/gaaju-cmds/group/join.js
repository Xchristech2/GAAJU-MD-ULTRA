'use strict';

module.exports = {
    name: 'join',

    aliases: [
        'joingroup'
    ],

    description:
        'Join a WhatsApp group using an invite link',

    category: 'group',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const p = prefix || '.';

        try {
            /*
             * Get the text supplied with the command.
             */
            let text = Array.isArray(args)
                ? args.join(' ').trim()
                : '';

            /*
             * If no argument was supplied, check whether
             * the command is replying to a message containing
             * a WhatsApp group invite link.
             */
            if (!text) {
                const quoted =
                    msg.message?.extendedTextMessage?.contextInfo
                        ?.quotedMessage;

                if (quoted) {
                    text =
                        quoted.conversation ||
                        quoted.extendedTextMessage?.text ||
                        quoted.imageMessage?.caption ||
                        quoted.videoMessage?.caption ||
                        '';
                }
            }

            /*
             * Find a WhatsApp group invite link.
             */
            const match = text.match(
                /(?:https?:\/\/)?chat\.whatsapp\.com\/([A-Za-z0-9_-]+)/i
            );

            if (!match) {
                return await sock.sendMessage(
                    chatId,
                    {
                        text:
                            `❌ *Invalid group link*\n\n` +
                            `Send a WhatsApp group invite link.\n\n` +
                            `Example:\n` +
                            `${p}join https://chat.whatsapp.com/XXXXXXXXXXXX`
                    },
                    {
                        quoted: msg
                    }
                );
            }

            const inviteCode = match[1];

            /*
             * Tell the user that the bot is processing
             * the invitation.
             */
            await sock.sendMessage(
                chatId,
                {
                    text:
                        `⏳ Processing group invitation...\n\n` +
                        `Please wait.`
                },
                {
                    quoted: msg
                }
            );

            let groupJid;

            /*
             * Accept the WhatsApp group invitation.
             *
             * Depending on the group's settings and WhatsApp's
             * current behavior, this can either join the group
             * directly or result in the appropriate join/request
             * flow.
             */
            try {
                groupJid =
                    await sock.groupAcceptInvite(
                        inviteCode
                    );
            } catch (error) {
                console.error(
                    '[JOIN INVITE ERROR]',
                    error?.message || error
                );

                return await sock.sendMessage(
                    chatId,
                    {
                        text:
                            `❌ *Unable to join group*\n\n` +
                            `Possible reasons:\n` +
                            `• The invite link is invalid or expired.\n` +
                            `• The bot is already in the group.\n` +
                            `• The group requires an approval/request flow.\n` +
                            `• WhatsApp rejected the invitation.\n` +
                            `• The group has reached a restriction/limit.\n\n` +
                            `> Powered by GAAJU-MD ULTRA`
                    },
                    {
                        quoted: msg
                    }
                );
            }

            /*
             * Get group information if WhatsApp returned
             * the group JID.
             */
            let groupName = 'Unknown Group';

            if (groupJid) {
                try {
                    const metadata =
                        await sock.groupMetadata(
                            groupJid
                        );

                    if (metadata?.subject) {
                        groupName =
                            metadata.subject;
                    }
                } catch {}
            }

            /*
             * Successful join.
             */
            await sock.sendMessage(
                chatId,
                {
                    text:
                        `✅ *GROUP JOIN SUCCESSFUL*\n\n` +
                        `┏━━❐\n` +
                        `┃✦ Group: ${groupName}\n` +
                        `┃✦ Status: Joined\n` +
                        `┗━━❐\n\n` +
                        `> Powered by GAAJU-MD ULTRA`
                },
                {
                    quoted: msg
                }
            );

        } catch (error) {
            console.error(
                '[JOIN COMMAND ERROR]',
                error
            );

            try {
                await sock.sendMessage(
                    chatId,
                    {
                        text:
                            `❌ *Join command failed*\n\n` +
                            `${error?.message || 'Unknown error'}`
                    },
                    {
                        quoted: msg
                    }
                );
            } catch {}
        }
    }
};
