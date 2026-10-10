'use strict';

const fs = require('fs');
const path = require('path');

const ANTICALL_FILE = path.join(
    process.cwd(),
    'data',
    'anticall.json'
);

function loadAntiCall() {
    try {
        if (!fs.existsSync(ANTICALL_FILE)) {
            return {
                mode: 'off',
                message: "My owner is currently unavailable or busy. Please send a message instead."
            };
        }

        const data = JSON.parse(
            fs.readFileSync(ANTICALL_FILE, 'utf8')
        );

        return {
            mode: data.mode || 'off',
            message: data.message ||
                "My owner is currently unavailable or busy. Please send a message instead."
        };
    } catch (error) {
        console.error(
            '[ANTICALL MESSAGE] Load error:',
            error.message
        );

        return {
            mode: 'off',
            message: "My owner is currently unavailable or busy. Please send a message instead."
        };
    }
}

function saveAntiCall(settings) {
    try {
        const directory = path.dirname(ANTICALL_FILE);

        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, {
                recursive: true
            });
        }

        fs.writeFileSync(
            ANTICALL_FILE,
            JSON.stringify(settings, null, 2)
        );

        return true;
    } catch (error) {
        console.error(
            '[ANTICALL MESSAGE] Save error:',
            error.message
        );

        return false;
    }
}

module.exports = {
    name: 'anticallmessage',

    aliases: [
        'anticallmsg',
        'acmsg'
    ],

    description:
        'Set, view, or reset the AntiCall auto-reply message.',

    category: 'owner',

    ownerOnly: true,

    async execute(sock, msg, args, prefix, ctx) {
        const jid = msg.key.remoteJid;
        const sub = (args[0] || '').toLowerCase();
        const settings = loadAntiCall();

        // SET A CUSTOM MESSAGE
        if (
            !sub ||
            !['view', 'off', 'clear'].includes(sub)
        ) {
            const newMessage = args.join(' ').trim();

            if (!newMessage) {
                return sock.sendMessage(
                    jid,
                    {
                        text:
`┏━━❐◁ *ANTICALL MESSAGE* ◁❐━━

┃ ◁ *${prefix}anticallmessage <text>*
┃   Set your custom auto-reply.
┃
┃ ◁ *${prefix}anticallmessage view*
┃   View your current message.
┃
┃ ◁ *${prefix}anticallmessage off*
┃   Disable custom auto-replies.
┃
┃ ◁ *${prefix}anticallmessage clear*
┃   Reset to the default message.
┃
┃ ◁ *AUTO-REPLY:* ${settings.autoMessage === false ? '❌ OFF' : '✅ ON'}
┃ ◁ *ANTICALL MODE:* ${settings.mode}
┗━━━━━━━━━━━━━━━━━━`
                    },
                    { quoted: msg }
                );
            }

            settings.message = newMessage;
            settings.autoMessage = true;

            if (!saveAntiCall(settings)) {
                return sock.sendMessage(
                    jid,
                    {
                        text: '❌ Failed to save your AntiCall message. Check the bot console.'
                    },
                    { quoted: msg }
                );
            }

            return sock.sendMessage(
                jid,
                {
                    text:
`┏━━❐◁ *ANTICALL MESSAGE UPDATED* ◁❐━━

┃ ◁ *STATUS:* ✅ SAVED
┃ ◁ *MESSAGE:*
┃ ${newMessage.split('\n').join('\n┃ ')}
┃
┃ ◁ The custom message is saved.
┃ ◁ Use *${prefix}anticall declinetext*
┃   to enable message mode.
┗━━━━━━━━━━━━━━━━━━`
                },
                { quoted: msg }
            );
        }

        // VIEW CURRENT MESSAGE
        if (sub === 'view') {
            return sock.sendMessage(
                jid,
                {
                    text:
`┏━━❐◁ *ANTICALL MESSAGE* ◁❐━━

┃ ◁ *STATUS:* ${settings.autoMessage === false ? '❌ OFF' : '✅ ON'}
┃ ◁ *MODE:* ${settings.mode}
┃
┃ ◁ *MESSAGE:*
┃ ${(settings.message || 'No custom message set.').split('\n').join('\n┃ ')}
┗━━━━━━━━━━━━━━━━━━`
                },
                { quoted: msg }
            );
        }

        // DISABLE CUSTOM MESSAGE
        if (sub === 'off') {
            settings.autoMessage = false;

            if (!saveAntiCall(settings)) {
                return sock.sendMessage(
                    jid,
                    { text: '❌ Could not save the change.' },
                    { quoted: msg }
                );
            }

            return sock.sendMessage(
                jid,
                {
                    text:
`✅ *ANTICALL AUTO-REPLY DISABLED*

Your custom message is saved, but the auto-reply is switched off.`
                },
                { quoted: msg }
            );
        }

        // CLEAR CUSTOM MESSAGE
        if (sub === 'clear') {
            settings.message =
                "My owner is currently unavailable or busy. Please send a message instead.";

            settings.autoMessage = true;

            if (!saveAntiCall(settings)) {
                return sock.sendMessage(
                    jid,
                    { text: '❌ Could not reset the message.' },
                    { quoted: msg }
                );
            }

            return sock.sendMessage(
                jid,
                {
                    text:
`✅ *ANTICALL MESSAGE RESET*

Your message has been reset to the default AntiCall message.

Use *${prefix}anticall declinetext* to enable message mode.`
                },
                { quoted: msg }
            );
        }
    }
};
