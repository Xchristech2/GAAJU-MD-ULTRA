'use strict';

const { getBotName } = require('../../lib/botname');

/*
|--------------------------------------------------------------------------
| GAAJU-MD-ULTRA — RECEIVE CODE
|--------------------------------------------------------------------------
| TEST / SIMULATION ONLY
|
| Works with the GAAJU-MD-ULTRA fakenumber command.
| It does NOT connect to SMS, WhatsApp, Facebook, Instagram,
| or any other verification service.
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| SHARED TEST SESSION
|--------------------------------------------------------------------------
|
| The fakenumber command should store its latest generated
| number here:
|
| globalThis._gaajuFakeNumberSession
|
*/

function getSession() {
    return globalThis._gaajuFakeNumberSession || null;
}


/*
|--------------------------------------------------------------------------
| COMMAND
|--------------------------------------------------------------------------
*/

module.exports = {

    name: 'receivecode',

    aliases: [
        'code',
        'getcode',
        'testcode'
    ],

    description:
        'Get the simulated verification code for a test number',

    category: 'utility',

    async execute(
        sock,
        msg,
        args,
        prefix
    ) {

        const chatId =
            msg.key.remoteJid;

        const botName =
            getBotName();

        const p =
            prefix || '.';


        /*
        |--------------------------------------------------------------------------
        | REACTION
        |--------------------------------------------------------------------------
        */

        try {

            await sock.sendMessage(
                chatId,
                {
                    react: {
                        text: '🔐',
                        key: msg.key
                    }
                }
            );

        } catch {}


        /*
        |--------------------------------------------------------------------------
        | GET SESSION
        |--------------------------------------------------------------------------
        */

        const session =
            getSession();


        /*
        |--------------------------------------------------------------------------
        | NO TEST NUMBER
        |--------------------------------------------------------------------------
        */

        if (!session) {

            return sock.sendMessage(
                chatId,
                {
                    text:
`┏━━❐ 🔐 RECEIVE CODE ❐
┃
┃✦ No active test number.
┃
┃✦ Generate one first:
┃
┃✦ ${p}fakenumber usa
┃✦ ${p}fakenumber nigeria
┃✦ ${p}fakenumber uk
┃
┗━━❐

🧪 TEST MODE
⚡ ${botName}`
                },
                {
                    quoted: msg
                }
            );

        }


        /*
        |--------------------------------------------------------------------------
        | SESSION EXPIRY
        |--------------------------------------------------------------------------
        */

        const now =
            Date.now();

        const created =
            Number(
                session.createdAt || 0
            );

        /*
         * Test sessions expire after 10 minutes.
         */

        if (
            created &&
            now - created > 10 * 60 * 1000
        ) {

            globalThis._gaajuFakeNumberSession =
                null;

            return sock.sendMessage(
                chatId,
                {
                    text:
`┏━━❐ ⏱️ TEST SESSION ❐
┃
┃✦ Status : Expired
┃
┃✦ Generate a new number:
┃✦ ${p}fakenumber usa
┃
┗━━❐

⚡ ${botName}`
                },
                {
                    quoted: msg
                }
            );

        }


        /*
        |--------------------------------------------------------------------------
        | GET CODE
        |--------------------------------------------------------------------------
        */

        const code =
            String(
                session.code || ''
            );


        if (!/^\d{6}$/.test(code)) {

            return sock.sendMessage(
                chatId,
                {
                    text:
`┏━━❐ ❌ RECEIVE CODE ❐
┃
┃✦ Status : Invalid test session
┃
┃✦ Please generate a new
┃  test number.
┗━━❐

⚡ ${botName}`
                },
                {
                    quoted: msg
                }
            );

        }


        /*
        |--------------------------------------------------------------------------
        | RESPONSE
        |--------------------------------------------------------------------------
        */

        const text =
`╭━━━〔 🔐 TEST CODE 〕━━━╮
┃
┃ 📱 Number : ${session.number}
┃ 🌍 Country: ${session.country}
┃
┃ 🔢 Code   : ${code}
┃
┃ 🧪 Status : SIMULATED
┃ ⏱️ Age    : ${Math.floor(
        (now - created) / 1000
    )}s
┃
╰━━━━━━━━━━━━━━━━━━━━╯

⚠️ Test/simulation code only.

⚡ Powered by ${botName}`;


        return sock.sendMessage(
            chatId,
            {
                text
            },
            {
                quoted: msg
            }
        );

    }

};
