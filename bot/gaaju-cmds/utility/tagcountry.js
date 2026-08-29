'use strict';

const { getBotName } = require('../../lib/botname');

/*
|--------------------------------------------------------------------------
| TAG COUNTRY / TAG CODE
|--------------------------------------------------------------------------
|
| Usage:
|
| .tagcountry +234
| .tagcountry +233
| .tagcountry +254
| .tagcountry +27
| .tagcountry +91
| .tagcountry +92
|
| Alias:
|
| .tagcode +234
|
| The command checks the WhatsApp group participant
| numbers exposed by Baileys and tags matching numbers.
|
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| WORLDWIDE COUNTRY CALLING CODES
|--------------------------------------------------------------------------
*/

const COUNTRY_CODES = {

    // AFRICA
    '+20': 'Egypt',
    '+211': 'South Sudan',
    '+212': 'Morocco',
    '+213': 'Algeria',
    '+216': 'Tunisia',
    '+218': 'Libya',
    '+220': 'Gambia',
    '+221': 'Senegal',
    '+222': 'Mauritania',
    '+223': 'Mali',
    '+224': 'Guinea',
    '+225': 'Côte d’Ivoire',
    '+226': 'Burkina Faso',
    '+227': 'Niger',
    '+228': 'Togo',
    '+229': 'Benin',
    '+230': 'Mauritius',
    '+231': 'Liberia',
    '+232': 'Sierra Leone',
    '+233': 'Ghana',
    '+234': 'Nigeria',
    '+235': 'Chad',
    '+236': 'Central African Republic',
    '+237': 'Cameroon',
    '+238': 'Cape Verde',
    '+239': 'São Tomé and Príncipe',
    '+240': 'Equatorial Guinea',
    '+241': 'Gabon',
    '+242': 'Republic of the Congo',
    '+243': 'DR Congo',
    '+244': 'Angola',
    '+245': 'Guinea-Bissau',
    '+246': 'British Indian Ocean Territory',
    '+247': 'Ascension Island',
    '+248': 'Seychelles',
    '+249': 'Sudan',
    '+250': 'Rwanda',
    '+251': 'Ethiopia',
    '+252': 'Somalia',
    '+253': 'Djibouti',
    '+254': 'Kenya',
    '+255': 'Tanzania',
    '+256': 'Uganda',
    '+257': 'Burundi',
    '+258': 'Mozambique',
    '+260': 'Zambia',
    '+261': 'Madagascar',
    '+262': 'Réunion / Mayotte',
    '+263': 'Zimbabwe',
    '+264': 'Namibia',
    '+265': 'Malawi',
    '+266': 'Lesotho',
    '+267': 'Botswana',
    '+268': 'Eswatini',
    '+269': 'Comoros',
    '+27': 'South Africa',
    '+290': 'Saint Helena',
    '+291': 'Eritrea',
    '+297': 'Aruba',
    '+298': 'Faroe Islands',
    '+299': 'Greenland',

    // NORTH AMERICA / CARIBBEAN
    '+1': 'USA / Canada / NANP',
    '+242': 'Caribbean / regional',
    '+246': 'Barbados',
    '+264': 'Anguilla',
    '+340': 'US Virgin Islands',
    '+441': 'Bermuda',
    '+500': 'Falkland Islands',
    '+501': 'Belize',
    '+502': 'Guatemala',
    '+503': 'El Salvador',
    '+504': 'Honduras',
    '+505': 'Nicaragua',
    '+506': 'Costa Rica',
    '+507': 'Panama',
    '+509': 'Haiti',
    '+590': 'Guadeloupe / Saint Martin',
    '+591': 'Bolivia',
    '+592': 'Guyana',
    '+593': 'Ecuador',
    '+594': 'French Guiana',
    '+595': 'Paraguay',
    '+596': 'Martinique',
    '+597': 'Suriname',
    '+598': 'Uruguay',
    '+599': 'Caribbean Netherlands / Curaçao',

    // SOUTH AMERICA
    '+51': 'Peru',
    '+52': 'Mexico',
    '+54': 'Argentina',
    '+55': 'Brazil',
    '+56': 'Chile',
    '+57': 'Colombia',
    '+58': 'Venezuela',

    // EUROPE
    '+30': 'Greece',
    '+31': 'Netherlands',
    '+32': 'Belgium',
    '+33': 'France',
    '+34': 'Spain',
    '+36': 'Hungary',
    '+39': 'Italy',
    '+40': 'Romania',
    '+41': 'Switzerland',
    '+43': 'Austria',
    '+44': 'United Kingdom',
    '+45': 'Denmark',
    '+46': 'Sweden',
    '+47': 'Norway',
    '+48': 'Poland',
    '+49': 'Germany',
    '+350': 'Gibraltar',
    '+351': 'Portugal',
    '+352': 'Luxembourg',
    '+353': 'Ireland',
    '+354': 'Iceland',
    '+355': 'Albania',
    '+356': 'Malta',
    '+357': 'Cyprus',
    '+358': 'Finland',
    '+359': 'Bulgaria',
    '+370': 'Lithuania',
    '+371': 'Latvia',
    '+372': 'Estonia',
    '+373': 'Moldova',
    '+374': 'Armenia',
    '+375': 'Belarus',
    '+376': 'Andorra',
    '+377': 'Monaco',
    '+378': 'San Marino',
    '+380': 'Ukraine',
    '+381': 'Serbia',
    '+382': 'Montenegro',
    '+383': 'Kosovo',
    '+385': 'Croatia',
    '+386': 'Slovenia',
    '+387': 'Bosnia and Herzegovina',
    '+389': 'North Macedonia',

    // MIDDLE EAST
    '+90': 'Turkey',
    '+93': 'Afghanistan',
    '+94': 'Sri Lanka',
    '+95': 'Myanmar',
    '+960': 'Maldives',
    '+961': 'Lebanon',
    '+962': 'Jordan',
    '+963': 'Syria',
    '+964': 'Iraq',
    '+965': 'Kuwait',
    '+966': 'Saudi Arabia',
    '+967': 'Yemen',
    '+968': 'Oman',
    '+970': 'Palestine',
    '+971': 'United Arab Emirates',
    '+972': 'Israel',
    '+973': 'Bahrain',
    '+974': 'Qatar',
    '+975': 'Bhutan',

    // SOUTH / EAST ASIA
    '+91': 'India',
    '+92': 'Pakistan',
    '+93': 'Afghanistan',
    '+95': 'Myanmar',
    '+98': 'Iran',
    '+880': 'Bangladesh',
    '+86': 'China',
    '+81': 'Japan',
    '+82': 'South Korea',
    '+84': 'Vietnam',
    '+850': 'North Korea',
    '+852': 'Hong Kong',
    '+853': 'Macau',
    '+855': 'Cambodia',
    '+856': 'Laos',
    '+880': 'Bangladesh',
    '+886': 'Taiwan',

    // SOUTHEAST ASIA
    '+60': 'Malaysia',
    '+61': 'Australia',
    '+62': 'Indonesia',
    '+63': 'Philippines',
    '+65': 'Singapore',
    '+66': 'Thailand',
    '+670': 'Timor-Leste',
    '+673': 'Brunei',
    '+674': 'Nauru',
    '+675': 'Papua New Guinea',
    '+676': 'Tonga',
    '+677': 'Solomon Islands',
    '+678': 'Vanuatu',
    '+679': 'Fiji',
    '+680': 'Palau',
    '+681': 'Wallis and Futuna',
    '+682': 'Cook Islands',
    '+683': 'Niue',
    '+685': 'Samoa',
    '+686': 'Kiribati',
    '+687': 'New Caledonia',
    '+688': 'Tuvalu',
    '+689': 'French Polynesia',
    '+690': 'Tokelau',
    '+691': 'Micronesia',
    '+692': 'Marshall Islands',

    // CENTRAL ASIA
    '+7': 'Russia / Kazakhstan',
    '+76': 'Kazakhstan',
    '+77': 'Kazakhstan',
    '+992': 'Tajikistan',
    '+993': 'Turkmenistan',
    '+994': 'Azerbaijan',
    '+995': 'Georgia',
    '+996': 'Kyrgyzstan',
    '+998': 'Uzbekistan',

    // PACIFIC / OCEANIA
    '+61': 'Australia',
    '+64': 'New Zealand',
    '+670': 'Timor-Leste',
    '+671': 'Guam',
    '+672': 'Australian External Territories',
    '+673': 'Brunei',
    '+674': 'Nauru',
    '+675': 'Papua New Guinea',
    '+676': 'Tonga',
    '+677': 'Solomon Islands',
    '+678': 'Vanuatu',
    '+679': 'Fiji',
    '+680': 'Palau',
    '+685': 'Samoa',
    '+686': 'Kiribati',
    '+687': 'New Caledonia',
    '+688': 'Tuvalu',
    '+689': 'French Polynesia',
    '+690': 'Tokelau',
    '+691': 'Micronesia',
    '+692': 'Marshall Islands'

};


/*
|--------------------------------------------------------------------------
| NORMALIZE COUNTRY CODE
|--------------------------------------------------------------------------
*/

function normalizeCountryCode(input) {

    if (!input) {
        return null;
    }

    let code =
        String(input)
            .trim()
            .replace(/\s+/g, '');

    if (!code.startsWith('+')) {
        code = '+' + code;
    }

    if (!/^\+\d{1,4}$/.test(code)) {
        return null;
    }

    return code;
}


/*
|--------------------------------------------------------------------------
| GET PARTICIPANT NUMBER
|--------------------------------------------------------------------------
*/

function getParticipantNumber(participant) {

    if (!participant) {
        return '';
    }

    const jid =
        participant.id ||
        participant.jid ||
        participant.phoneNumber ||
        '';

    return String(jid)
        .split('@')[0]
        .split(':')[0]
        .replace(/\D/g, '');
}


/*
|--------------------------------------------------------------------------
| COMMAND
|--------------------------------------------------------------------------
*/

module.exports = {

    name: 'tagcountry',

    aliases: [
        'tagcode'
    ],

    description:
        'Tag group members by worldwide country calling code',

    category: 'group',

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
        | GROUP CHECK
        |--------------------------------------------------------------------------
        */

        if (
            !chatId ||
            !chatId.endsWith('@g.us')
        ) {

            return sock.sendMessage(
                chatId,
                {
                    text:
`┏━━❐ 🌍 TAG COUNTRY ❐
┃
┃ ❌ Group command only.
┃
┃ Use this command inside
┃ a WhatsApp group.
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
        | COUNTRY CODE
        |--------------------------------------------------------------------------
        */

        const countryCode =
            normalizeCountryCode(
                args?.[0]
            );

        if (!countryCode) {

            return sock.sendMessage(
                chatId,
                {
                    text:
`┏━━❐ 🌍 TAG COUNTRY ❐
┃
┃ ❌ Invalid country code.
┃
┃ Examples:
┃
┃ ✦ ${p}tagcountry +234
┃ ✦ ${p}tagcountry +91
┃ ✦ ${p}tagcountry +92
┃ ✦ ${p}tagcountry +233
┃ ✦ ${p}tagcountry +254
┃ ✦ ${p}tagcountry +27
┃
┃ 🌍 Worldwide country
┃    codes are supported.
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
        | RECOGNIZE COUNTRY
        |--------------------------------------------------------------------------
        */

        const countryName =
            COUNTRY_CODES[countryCode] ||
            'International / supported calling code';


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
                        text: '🌍',
                        key: msg.key
                    }
                }
            );

        } catch {}


        /*
        |--------------------------------------------------------------------------
        | GROUP METADATA
        |--------------------------------------------------------------------------
        */

        try {

            const metadata =
                await sock.groupMetadata(
                    chatId
                );

            const participants =
                metadata?.participants || [];


            /*
            |--------------------------------------------------------------------------
            | MATCH COUNTRY CODE
            |--------------------------------------------------------------------------
            */

            const cleanCode =
                countryCode.substring(1);

            const matched =
                participants.filter(
                    participant => {

                        const number =
                            getParticipantNumber(
                                participant
                            );

                        return (
                            number &&
                            number.startsWith(
                                cleanCode
                            )
                        );

                    }
                );


            /*
            |--------------------------------------------------------------------------
            | NO MATCH
            |--------------------------------------------------------------------------
            */

            if (!matched.length) {

                return sock.sendMessage(
                    chatId,
                    {
                        text:
`┏━━❐ 🌍 TAG COUNTRY ❐
┃
┃ 🌍 Country : ${countryName}
┃ ☎️ Code    : ${countryCode}
┃ 👥 Found   : 0
┃
┃ ❌ No matching group
┃    members found.
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
            | CREATE MENTIONS
            |--------------------------------------------------------------------------
            */

            const mentions = [];

            const tagged =
                [];

            for (
                const participant
                of matched
            ) {

                const jid =
                    participant.id ||
                    participant.jid;

                if (!jid) {
                    continue;
                }

                mentions.push(jid);

                tagged.push(
                    `@${jid.split('@')[0]}`
                );

            }


            /*
            |--------------------------------------------------------------------------
            | SEND RESULT
            |--------------------------------------------------------------------------
            */

            const text =
`╭━━━〔 🌍 TAG COUNTRY 〕━━━╮
┃
┃ 🌍 Country : ${countryName}
┃ ☎️ Code    : ${countryCode}
┃ 👥 Found   : ${mentions.length}
┃
╰━━━━━━━━━━━━━━━━━━━━╯

${tagged.join(' ')}

╭━━━〔 ✦ ${botName} ✦ 〕━━━╮
┃
┃ ✅ Matching members
┃    have been tagged.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`;

            await sock.sendMessage(
                chatId,
                {
                    text,
                    mentions
                },
                {
                    quoted: msg
                }
            );


        } catch (error) {

            console.error(
                '[TAGCOUNTRY ERROR]',
                error
            );

            return sock.sendMessage(
                chatId,
                {
                    text:
`┏━━❐ ❌ TAG COUNTRY ❐
┃
┃ ✦ Status : Failed
┃ ✦ Reason : ${
    error?.message || error
}
┃
┗━━❐
⚡ Powered by ${botName}`
                },
                {
                    quoted: msg
                }
            );

        }

    }

};
