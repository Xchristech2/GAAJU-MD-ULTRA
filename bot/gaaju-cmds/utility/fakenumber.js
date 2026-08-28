'use strict';

const { getBotName } = require('../../lib/botname');

const COUNTRIES = {
'+234': 'Nigeria',
'+1': 'USA/Canada',
'+44': 'United Kingdom',
'+91': 'India',
'+27': 'South Africa',
'+33': 'France',
'+49': 'Germany',
'+39': 'Italy',
'+34': 'Spain',
'+55': 'Brazil',
'+52': 'Mexico',
'+81': 'Japan',
'+82': 'South Korea',
'+971': 'UAE',
'+61': 'Australia'
};

function randomDigits(length) {
let result = '';

for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10);
}

return result;

}

function generateNumber(countryCode) {

if (countryCode === '+234') {
    return '+234' + randomDigits(10);
}

if (countryCode === '+1') {
    return '+1' + randomDigits(10);
}

if (countryCode === '+44') {
    return '+44' + randomDigits(10);
}

if (countryCode === '+91') {
    return '+91' + randomDigits(10);
}

return countryCode + randomDigits(10);

}

module.exports = {

name: 'fakenumber',

aliases: [
    'tempnumber',
    'virtualnumber',
    'number'
],

description:
    'Generate a fictional phone number for testing',

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

    const country =
        String(args?.[0] || '+234')
            .trim();

    /*
    |--------------------------------------------------------------------------
    | COUNTRY CHECK
    |--------------------------------------------------------------------------
    */

    if (!COUNTRIES[country]) {

        return sock.sendMessage(
            jid,
            {
                text:

`╭━━━〔 📱 FAKE NUMBER 〕━━━╮
┃
┃ ❌ Unknown country code
┃
┃ Available examples:
┃
┃ ✦ ${p}fakenumber +234
┃ ✦ ${p}fakenumber +1
┃ ✦ ${p}fakenumber +44
┃ ✦ ${p}fakenumber +91
┃ ✦ ${p}fakenumber +27
┃ ✦ ${p}fakenumber +33
┃ ✦ ${p}fakenumber +49
┃ ✦ ${p}fakenumber +55
┃ ✦ ${p}fakenumber +81
┃ ✦ ${p}fakenumber +82
┃
╰━━━━━━━━━━━━━━━━━━━━╯

⚡ ${botName}`
},
{ quoted: msg }
);
}

    /*
    |--------------------------------------------------------------------------
    | GENERATE NUMBER
    |--------------------------------------------------------------------------
    */

    const number =
        generateNumber(country);

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
                    text: '📱',
                    key: msg.key
                }
            }
        );

    } catch {}

    /*
    |--------------------------------------------------------------------------
    | NUMBER RESPONSE
    |--------------------------------------------------------------------------
    */

    return sock.sendMessage(
        jid,
        {
            text:

`╭━━━〔 📱 VIRTUAL NUMBER 〕━━━╮
┃
┃ 🌍 Country : ${COUNTRIES[country]}
┃ ☎️ Number  : ${number}
┃
╰━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 📋 INFORMATION 〕━━━╮
┃
┃ ✦ Number generated successfully
┃ ✦ Country : ${COUNTRIES[country]}
┃ ✦ Format  : International
┃
╰━━━━━━━━━━━━━━━━━━━━╯

⚠️ DEMO MODE
This is a fictional number
generated for testing purposes.

⚡ Powered by ${botName}`
},
{ quoted: msg }
);
}
};
