'use strict';

const { getBotName } = require('../../lib/botname');

/*
|--------------------------------------------------------------------------
| GAAJU-MD-ULTRA — FAKE NUMBER
|--------------------------------------------------------------------------
| Generates fictional/test phone numbers for bot testing.
| These numbers are not connected to SMS services.
|--------------------------------------------------------------------------
*/

const COUNTRIES = {
    nigeria: {
        name: 'Nigeria',
        flag: '🇳🇬',
        code: '+234',
        numbers: [
            '803 555 0147',
            '806 555 0182',
            '809 555 0136',
            '810 555 0194'
        ]
    },

    usa: {
        name: 'United States',
        flag: '🇺🇸',
        code: '+1',
        numbers: [
            '202-555-0104',
            '202-555-0118',
            '202-555-0136',
            '202-555-0172'
        ]
    },

    uk: {
        name: 'United Kingdom',
        flag: '🇬🇧',
        code: '+44',
        numbers: [
            '20 7946 0123',
            '20 7946 0184',
            '20 7946 0197'
        ]
    },

    canada: {
        name: 'Canada',
        flag: '🇨🇦',
        code: '+1',
        numbers: [
            '416-555-0108',
            '416-555-0132',
            '416-555-0176'
        ]
    },

    india: {
        name: 'India',
        flag: '🇮🇳',
        code: '+91',
        numbers: [
            '98 5555 0147',
            '98 5555 0182',
            '98 5555 0136'
        ]
    },

    germany: {
        name: 'Germany',
        flag: '🇩🇪',
        code: '+49',
        numbers: [
            '30 555 0147',
            '30 555 0182',
            '30 555 0136'
        ]
    },

    france: {
        name: 'France',
        flag: '🇫🇷',
        code: '+33',
        numbers: [
            '1 55 55 01 47',
            '1 55 55 01 82',
            '1 55 55 01 36'
        ]
    },

    southafrica: {
        name: 'South Africa',
        flag: '🇿🇦',
        code: '+27',
        numbers: [
            '10 555 0147',
            '10 555 0182',
            '10 555 0136'
        ]
    },

    australia: {
        name: 'Australia',
        flag: '🇦🇺',
        code: '+61',
        numbers: [
            '2 5550 0147',
            '2 5550 0182',
            '2 5550 0136'
        ]
    },

    brazil: {
        name: 'Brazil',
        flag: '🇧🇷',
        code: '+55',
        numbers: [
            '11 5555 0147',
            '11 5555 0182',
            '11 5555 0136'
        ]
    },

    japan: {
        name: 'Japan',
        flag: '🇯🇵',
        code: '+81',
        numbers: [
            '3 5550 0147',
            '3 5550 0182',
            '3 5550 0136'
        ]
    },

    mexico: {
        name: 'Mexico',
        flag: '🇲🇽',
        code: '+52',
        numbers: [
            '55 5555 0147',
            '55 5555 0182',
            '55 5555 0136'
        ]
    }
};


/*
|--------------------------------------------------------------------------
| RANDOM HELPERS
|--------------------------------------------------------------------------
*/

function randomItem(array) {
    return array[
        Math.floor(
            Math.random() * array.length
        )
    ];
}


/*
|--------------------------------------------------------------------------
| COUNTRY LIST
|--------------------------------------------------------------------------
*/

function countryList() {

    return Object.values(COUNTRIES)
        .map(country =>
            `${country.flag} ${country.name}`
        )
        .join('\n┃✦ ');
}


/*
|--------------------------------------------------------------------------
| COMMAND
|--------------------------------------------------------------------------
*/

module.exports = {

    name: 'fakenumber',

    aliases: [
        'fake',
        'testnumber',
        'randomnumber'
    ],

    description:
        'Generate a fictional test phone number',

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
                        text: '📱',
                        key: msg.key
                    }
                }
            );

        } catch {}


        /*
        |--------------------------------------------------------------------------
        | HELP / NO COUNTRY
        |--------------------------------------------------------------------------
        */

        if (!args?.[0]) {

            return sock.sendMessage(
                chatId,
                {
                    text:
`┏━━❐ 📱 FAKE NUMBER ❐
┃
┃✦ Usage:
┃✦ ${p}fakenumber country
┃
┏━━❐ 🌍 COUNTRIES ❐
┃
┃✦ ${countryList()}
┃
┗━━❐

┃✦ Example:
┃✦ ${p}fakenumber usa
┃✦ ${p}fakenumber nigeria
┃✦ ${p}fakenumber uk

⚡ ${botName}`
                },
                {
                    quoted: msg
                }
            );

        }


        /*
        |--------------------------------------------------------------------------
        | FIND COUNTRY
        |--------------------------------------------------------------------------
        */

        const input =
            String(args[0])
                .toLowerCase()
                .replace(/[\s_-]/g, '');

        const country =
            COUNTRIES[input];


        /*
        |--------------------------------------------------------------------------
        | UNKNOWN COUNTRY
        |--------------------------------------------------------------------------
        */

        if (!country) {

            return sock.sendMessage(
                chatId,
                {
                    text:
`┏━━❐ ⚠️ FAKE NUMBER ❐
┃
┃✦ Country not found.
┃
┃✦ Use:
┃✦ ${p}fakenumber
┃
┃✦ Available countries:
┃✦ ${countryList()}
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
        | GENERATE NUMBER
        |--------------------------------------------------------------------------
        */

        const number =
            randomItem(
                country.numbers
            );


        /*
        |--------------------------------------------------------------------------
        | RESPONSE
        |--------------------------------------------------------------------------
        */

        const text =
`╭━━━〔 📱 FAKE NUMBER 〕━━━╮
┃
┃ 🌍 Country : ${country.name} ${country.flag}
┃ 📞 Number  : ${country.code} ${number}
┃
┃ 🧪 Status  : TEST NUMBER
┃ 🔄 Service : GAAJU-MD-ULTRA
┃
╰━━━━━━━━━━━━━━━━━━━━╯

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
