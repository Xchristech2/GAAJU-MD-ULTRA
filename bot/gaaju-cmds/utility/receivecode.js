'use strict';

const { getBotName } = require('../../lib/botname');

function generateCode() {
return String(
Math.floor(100000 + Math.random() * 900000)
);
}

module.exports = {

name: 'receivecode',

aliases: [
    'getcode',
    'verifycode',
    'smscode'
],

description:
    'Generate a demo verification code',

category: 'utility',

async execute(
    sock,
    msg,
    args,
    prefix
) {

    const jid =
        msg.key.remoteJid;

    const botName =
        getBotName();

    const p =
        prefix || '.';

    const number =
        String(args?.[0] || '')
            .trim();

    /*
    |--------------------------------------------------------------------------
    | NUMBER REQUIRED
    |--------------------------------------------------------------------------
    */

    if (!number) {

        return sock.sendMessage(
            jid,
            {
                text:

`╭━━━〔 📩 RECEIVE CODE 〕━━━╮
┃
┃ ❌ Number required
┃
┃ Usage:
┃ ${p}receivecode +234XXXXXXXXXX
┃
┃ Example:
┃ ${p}receivecode +2348012345678
┃
╰━━━━━━━━━━━━━━━━━━━━╯

⚡ ${botName}`
},
{ quoted: msg }
);
}

    /*
    |--------------------------------------------------------------------------
    | NUMBER FORMAT
    |--------------------------------------------------------------------------
    */

    if (!/^\+\d{7,15}$/.test(number)) {

        return sock.sendMessage(
            jid,
            {
                text:

`╭━━━〔 ⚠️ INVALID NUMBER 〕━━━╮
┃
┃ The number must use
┃ international format.
┃
┃ Example:
┃ ${p}receivecode +2348012345678
┃
╰━━━━━━━━━━━━━━━━━━━━╯

⚡ ${botName}`
},
{ quoted: msg }
);
}

    /*
    |--------------------------------------------------------------------------
    | GENERATE DEMO CODE
    |--------------------------------------------------------------------------
    */

    const code =
        generateCode();

    /*
    |--------------------------------------------------------------------------
    | REACTION
    |--------------------------------------------------------------------------
    */

    try {

        await sock.sendMessage(
            jid,
            {
                react: {
                    text: '📩',
                    key: msg.key
                }
            }
        );

    } catch {}

    /*
    |--------------------------------------------------------------------------
    | RESPONSE
    |--------------------------------------------------------------------------
    */

    return sock.sendMessage(
        jid,
        {
            text:

`╭━━━〔 📩 VERIFICATION CODE 〕━━━╮
┃
┃ ☎️ Number : ${number}
┃
┃ 🔐 Code   : ${code}
┃
┃ 📡 Status : ✅ Generated
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 🔒 CODE INFORMATION 〕━━━╮
┃
┃ ⏱️ Type   : 6-Digit
┃ 📱 Mode   : Demo
┃ ⚡ Status : Ready
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯

⚠️ This is a fictional test
verification code generated
by ${botName}.

⚡ Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ`
},
{ quoted: msg }
);
}
};
