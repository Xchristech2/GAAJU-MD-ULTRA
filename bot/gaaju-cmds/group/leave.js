'use strict';

module.exports = {
    name: 'leave',

    aliases: [
        'leavegroup'
    ],

    description:
        'Make the bot leave the current group',

    category: 'group',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;

        try {
            /*
             * Check if the command is being used in a group.
             */
            if (!chatId || !chatId.endsWith('@g.us')) {
                return await sock.sendMessage(
                    chatId,
                    {
                        text:
                            `❌ This command can only be used in a group chat.`
                    },
                    {
                        quoted: msg
                    }
                );
            }

            /*
             * Get group information before leaving.
             */
            let groupName = 'this group';

            try {
                const metadata =
                    await sock.groupMetadata(chatId);

                if (metadata?.subject) {
                    groupName =
                        metadata.subject;
                }
            } catch {}

            /*
             * Send confirmation before leaving.
             */
            await sock.sendMessage(
                chatId,
                {
                    text:
                        `👋 Leaving *${groupName}*...\n\n` +
                        `> Powered by GAAJU-MD ULTRA`
                },
                {
                    quoted: msg
                }
            );

            /*
             * Leave the current group.
             */
            await sock.groupLeave(chatId);

        } catch (error) {
            console.error(
                '[LEAVE COMMAND ERROR]',
                error
            );

            try {
                await sock.sendMessage(
                    chatId,
                    {
                        text:
                            `❌ Failed to leave the group.\n\n` +
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
