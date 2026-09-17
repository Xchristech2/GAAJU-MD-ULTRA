'use strict';

module.exports = {
    name: 'anticall',

    aliases: ['ac'],

    description: 'Manage incoming call protection',

    category: 'owner',

    async execute(
        sock,
        msg,
        args,
        prefix,
        ctx
    ) {
        const chatId = msg.key.remoteJid;

        const sender =
            msg.key.participant ||
            msg.key.remoteJid;

        const ownerNumber = '2348069675806';

        // Owner only
        if (!sender.includes(ownerNumber)) {
            return sock.sendMessage(
                chatId,
                {
                    text: '❌ This command is only available to the bot owner.'
                },
                {
                    quoted: msg
                }
            );
        }

        const mode = args[0]?.toLowerCase();

        // Show AntiCall options
        if (!mode) {
            return sock.sendMessage(
                chatId,
                {
                    text:
`┏━━❐ *📞 ANTICALL* ❐━━
┃
┃✦ ${prefix}anticall decline
┃  └─ Decline incoming calls
┃
┃✦ ${prefix}anticall block
┃  └─ Block the caller
┃
┃✦ ${prefix}anticall declineblock
┃  └─ Decline + block caller
┃
┃✦ ${prefix}anticall declinetext
┃  └─ Decline + send a message
┃
┃✦ ${prefix}anticall off
┃  └─ Disable AntiCall
┃
┗━━━━━━━━━━━━━━━━━━`
                },
                {
                    quoted: msg
                }
            );
        }

        // DECLINE
        if (mode === 'decline') {
            global.anticall = 'decline';

            return sock.sendMessage(
                chatId,
                {
                    text:
`✅ *ANTICALL: DECLINE*

📵 Incoming calls will be automatically declined.`
                },
                {
                    quoted: msg
                }
            );
        }

        // BLOCK
        if (mode === 'block') {
            global.anticall = 'block';

            return sock.sendMessage(
                chatId,
                {
                    text:
`✅ *ANTICALL: BLOCK*

🚫 Incoming callers will be blocked.`
                },
                {
                    quoted: msg
                }
            );
        }

        // DECLINE + BLOCK
        if (mode === 'declineblock') {
            global.anticall = 'declineblock';

            return sock.sendMessage(
                chatId,
                {
                    text:
`✅ *ANTICALL: DECLINE + BLOCK*

📵 Incoming calls will be declined.
🚫 The caller will then be blocked.`
                },
                {
                    quoted: msg
                }
            );
        }

        // DECLINE + TEXT
        if (mode === 'declinetext') {
            global.anticall = 'declinetext';

            return sock.sendMessage(
                chatId,
                {
                    text:
`✅ *ANTICALL: DECLINE + TEXT*

📵 Incoming calls will be declined.
💬 An automatic message will be sent to the caller.

Default message:
"My owner is currently unavailable or busy. Please send a message instead."`
                },
                {
                    quoted: msg
                }
            );
        }

        // OFF
        if (mode === 'off') {
            global.anticall = false;

            return sock.sendMessage(
                chatId,
                {
                    text:
`❌ *ANTICALL DISABLED*

📞 Incoming calls will no longer be automatically handled.`
                },
                {
                    quoted: msg
                }
            );
        }

        // INVALID OPTION
        return sock.sendMessage(
            chatId,
            {
                text:
`❌ *Unknown AntiCall option.*

Available options:

${prefix}anticall decline
${prefix}anticall block
${prefix}anticall declineblock
${prefix}anticall declinetext
${prefix}anticall off`
            },
            {
                quoted: msg
            }
        );
    }
};
