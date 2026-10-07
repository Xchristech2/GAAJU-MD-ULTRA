'use strict';

const fs = require('fs');
const path = require('path');

const ANTICALL_FILE = path.join(process.cwd(), 'anticall.json');

function loadAntiCall() {
    try {
        return JSON.parse(
            fs.readFileSync(ANTICALL_FILE, 'utf8')
        );
    } catch {
        return {
            settings: {},
            callLogs: [],
            blockedNumbers: []
        };
    }
}

function saveAntiCall(data) {
    try {
        fs.writeFileSync(
            ANTICALL_FILE,
            JSON.stringify(data, null, 2)
        );
    } catch (e) {
        console.error(
            '[anticallmessage] save error:',
            e.message
        );
    }
}

function cleanJid(jid) {
    if (!jid) return jid;

    const clean = jid.split(':')[0];

    return clean.includes('@')
        ? clean
        : clean + '@s.whatsapp.net';
}

function shortMessage(message) {
    if (!message) return '';

    return message.length > 50
        ? message.substring(0, 50) + '…'
        : message;
}

module.exports = {
    name: 'anticallmessage',

    aliases: [
        'anticallmsg',
        'acmsg'
    ],

    description:
        'Set or view the auto-reply message sent when a call is rejected.',

    category: 'owner',

    ownerOnly: true,

    async execute(
        sock,
        msg,
        args,
        prefix,
        ctx
    ) {
        const jid = msg.key.remoteJid;

        const botJid = cleanJid(
            sock.user?.id
        );

        const sub = args[0]?.toLowerCase();

        const data = loadAntiCall();

        if (!data.settings[botJid]) {
            data.settings[botJid] = {
                enabled: false,
                mode: 'decline',
                autoMessage: false,
                message:
                    "Sorry, I don't accept calls. Please send a text message instead.",
                lastUpdated: new Date().toISOString()
            };
        }

        const s = data.settings[botJid];

        // SET MESSAGE
        if (
            !sub ||
            (
                sub !== 'off' &&
                sub !== 'view' &&
                sub !== 'clear'
            )
        ) {
            const newMsg = args
                .join(' ')
                .trim();

            if (!newMsg) {
                const helpText =
`┏━━❐➽ *ANTICALL MESSAGE* ➽❐━━
┃
┃ ➽ *${prefix}anticallmessage [text]*
┃   ➽ Set auto-reply message
┃
┃ ➽ *${prefix}anticallmessage view*
┃   ➽ View current message
┃
┃ ➽ *${prefix}anticallmessage off*
┃   ➽ Disable auto-reply
┃
┃ ➽ *STATUS:* ${s.autoMessage ? '✅ ON' : '❌ OFF'}
${
    s.autoMessage
        ? `┃ ➽ *MESSAGE:* _${shortMessage(s.message)}_`
        : ''
}
┗━━━━━━━━━━━`;

                return sock.sendMessage(
                    jid,
                    { text: helpText },
                    { quoted: msg }
                );
            }

            s.autoMessage = true;
            s.message = newMsg;
            s.lastUpdated = new Date().toISOString();

            data.settings[botJid] = s;

            saveAntiCall(data);

            const reply =
`┏━━❐➽ *ANTICALL MESSAGE* ➽❐━━
┃
┃ ➽ *AUTO-REPLY:* ✅ ON
┃ ➽ *MESSAGE:* _${shortMessage(newMsg)}_
┃
┃ ➽ Sent after every rejected call
┃ ➽ Use *${prefix}anticall enable*
┃   to activate anticall.
┗━━━━━━━━━━━`;

            return sock.sendMessage(
                jid,
                { text: reply },
                { quoted: msg }
            );
        }

        // VIEW MESSAGE
        if (sub === 'view') {
            const reply =
`┏━━❐➽ *ANTICALL MESSAGE* ➽❐━━
┃
┃ ➽ *AUTO-REPLY:* ${
    s.autoMessage ? '✅ ON' : '❌ OFF'
}
${
    s.autoMessage
        ? `┃ ➽ *MESSAGE:* _${shortMessage(s.message)}_`
        : `┃ ➽ No message has been set.`
}
┃
┗━━━━━━━━━━━`;

            return sock.sendMessage(
                jid,
                { text: reply },
                { quoted: msg }
            );
        }

        // OFF / CLEAR
        if (
            sub === 'off' ||
            sub === 'clear'
        ) {
            s.autoMessage = false;
            s.lastUpdated = new Date().toISOString();

            data.settings[botJid] = s;

            saveAntiCall(data);

            const reply =
`┏━━❐➽ *ANTICALL MESSAGE* ➽❐━━
┃
┃ ➽ *AUTO-REPLY:* ❌ OFF
┃
┃ ➽ No message will be sent
┃   after rejected calls.
┗━━━━━━━━━━━`;

            return sock.sendMessage(
                jid,
                { text: reply },
                { quoted: msg }
            );
        }
    }
};
