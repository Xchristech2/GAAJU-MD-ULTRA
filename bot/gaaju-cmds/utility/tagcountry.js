'use strict';

const { getBotName } = require('../../lib/botname');

/*
|--------------------------------------------------------------------------
| TAG COUNTRY
|--------------------------------------------------------------------------
| Usage:
|   .tagcountry +234
|   .tagcountry +91
|   .tagcountry +92
|   .tagcountry +1
|
| The command checks the current group's real participants
| and mentions everyone whose WhatsApp number starts with
| the selected international country calling code.
|--------------------------------------------------------------------------
*/

// Worldwide international calling codes.
// Multiple countries can share the same calling code.
const COUNTRY_CODES = new Set([
    '+1',
    '+7',
    '+20',
    '+27',
    '+30',
    '+31',
    '+32',
    '+33',
    '+34',
    '+36',
    '+39',
    '+40',
    '+41',
    '+43',
    '+44',
    '+45',
    '+46',
    '+47',
    '+48',
    '+49',
    '+51',
    '+52',
    '+53',
    '+54',
    '+55',
    '+56',
    '+57',
    '+58',
    '+60',
    '+61',
    '+62',
    '+63',
    '+64',
    '+65',
    '+66',
    '+81',
    '+82',
    '+84',
    '+86',
    '+90',
    '+91',
    '+92',
    '+93',
    '+94',
    '+95',
    '+98',
    '+211',
    '+212',
    '+213',
    '+216',
    '+218',
    '+220',
    '+221',
    '+222',
    '+223',
    '+224',
    '+225',
    '+226',
    '+227',
    '+228',
    '+229',
    '+230',
    '+231',
    '+232',
    '+233',
    '+234',
    '+235',
    '+236',
    '+237',
    '+238',
    '+239',
    '+240',
    '+241',
    '+242',
    '+243',
    '+244',
    '+245',
    '+246',
    '+248',
    '+249',
    '+250',
    '+251',
    '+252',
    '+253',
    '+254',
    '+255',
    '+256',
    '+257',
    '+258',
    '+260',
    '+261',
    '+262',
    '+263',
    '+264',
    '+265',
    '+266',
    '+267',
    '+268',
    '+269',
    '+290',
    '+291',
    '+297',
    '+298',
    '+299',
    '+350',
    '+351',
    '+352',
    '+353',
    '+354',
    '+355',
    '+356',
    '+357',
    '+358',
    '+359',
    '+370',
    '+371',
    '+372',
    '+373',
    '+374',
    '+375',
    '+376',
    '+377',
    '+378',
    '+380',
    '+381',
    '+382',
    '+383',
    '+385',
    '+386',
    '+387',
    '+389',
    '+420',
    '+421',
    '+423',
    '+500',
    '+501',
    '+502',
    '+503',
    '+504',
    '+505',
    '+506',
    '+507',
    '+508',
    '+509',
    '+590',
    '+591',
    '+592',
    '+593',
    '+594',
    '+595',
    '+596',
    '+597',
    '+598',
    '+599',
    '+670',
    '+672',
    '+673',
    '+674',
    '+675',
    '+676',
    '+677',
    '+678',
    '+679',
    '+680',
    '+681',
    '+682',
    '+683',
    '+685',
    '+686',
    '+687',
    '+688',
    '+689',
    '+690',
    '+691',
    '+692',
    '+850',
    '+852',
    '+853',
    '+855',
    '+856',
    '+880',
    '+886',
    '+960',
    '+961',
    '+962',
    '+963',
    '+964',
    '+965',
    '+966',
    '+967',
    '+968',
    '+970',
    '+971',
    '+972',
    '+973',
    '+974',
    '+975',
    '+976',
    '+977',
    '+992',
    '+993',
    '+994',
    '+995',
    '+996',
    '+998'
]);

function normalizeCountryCode(input) {
    if (!input) return null;

    let code = String(input).trim();

    // Allow 234 as well as +234
    if (!code.startsWith('+')) {
        code = '+' + code;
    }

    // Remove spaces, hyphens and other unwanted characters
    code = '+' + code.slice(1).replace(/\D/g, '');

    return code;
}

function getNumberFromJid(jid) {
    if (!jid || typeof jid !== 'string') {
        return null;
    }

    /*
     * Normal WhatsApp user JID:
     * 234xxxxxxxxxx@s.whatsapp.net
     *
     * We intentionally ignore LID JIDs because they don't
     * expose the phone number needed for country matching.
     */
    if (!jid.endsWith('@s.whatsapp.net')) {
        return null;
    }

    return jid.split('@')[0];
}

function chunkArray(array, size) {
    const chunks = [];

    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }

    return chunks;
}

module.exports = {
    name: 'tagcountry',

    aliases: [
        'tagcode'
    ],

    description:
        'Tag all group members matching a country calling code',

    category: 'utility',

    async execute(
        sock,
        msg,
        args,
        prefix
    ) {
        const jid =
            msg?.key?.remoteJid;

        const p =
            prefix || '.';

        const botName =
            getBotName();

        // Must be used inside a group
        if (!jid || !jid.endsWith('@g.us')) {
            return sock.sendMessage(
                jid,
                {
                    text:
`┏━━❐ 🌍 TAG COUNTRY ❐
┃
┃ ❌ This command can only
┃    be used inside a group.
┃
┃ Usage:
┃ ✦ ${p}tagcountry +234
┃ ✦ ${p}tagcountry +91
┃ ✦ ${p}tagcountry +92
┃ ✦ ${p}tagcountry +1
┃
┗━━❐
⚡ ${botName}`
                },
                { quoted: msg }
            );
        }

        const rawCode =
            args?.[0];

        if (!rawCode) {
            return sock.sendMessage(
                jid,
                {
                    text:
`┏━━❐ 🌍 TAG COUNTRY ❐
┃
┃ ❌ Please provide a country
┃    calling code.
┃
┃ Examples:
┃ ✦ ${p}tagcountry +234
┃ ✦ ${p}tagcountry +91
┃ ✦ ${p}tagcountry +92
┃ ✦ ${p}tagcountry +27
┃ ✦ ${p}tagcountry +1
┃ ✦ ${p}tagcountry +44
┃
┗━━❐
⚡ ${botName}`
                },
                { quoted: msg }
            );
        }

        const countryCode =
            normalizeCountryCode(rawCode);

        // Only accept recognised international calling codes
        if (
            !countryCode ||
            !COUNTRY_CODES.has(countryCode)
        ) {
            return sock.sendMessage(
                jid,
                {
                    text:
`┏━━❐ 🌍 TAG COUNTRY ❐
┃
┃ ❌ Invalid country code:
┃    ${rawCode}
┃
┃ Example:
┃ ✦ ${p}tagcountry +234
┃ ✦ ${p}tagcountry +91
┃ ✦ ${p}tagcountry +92
┃ ✦ ${p}tagcountry +27
┃
┃ 🌍 Worldwide calling codes
┃    are supported.
┃
┗━━❐
⚡ ${botName}`
                },
                { quoted: msg }
            );
        }

        try {
            // Get current group metadata
            const metadata =
                await sock.groupMetadata(jid);

            const participants =
                metadata?.participants || [];

            const prefixNumber =
                countryCode.slice(1);

            const matchingMembers = [];

            for (const participant of participants) {

                /*
                 * Depending on the Baileys version,
                 * the participant can expose an id field.
                 */
                const participantJid =
                    participant?.id;

                const number =
                    getNumberFromJid(
                        participantJid
                    );

                if (!number) continue;

                if (
                    number.startsWith(
                        prefixNumber
                    )
                ) {
                    matchingMembers.push(
                        participantJid
                    );
                }
            }

            // No matching members
            if (!matchingMembers.length) {
                return sock.sendMessage(
                    jid,
                    {
                        text:
`╭━━━〔 🌍 TAG COUNTRY 〕━━━╮
┃
┃ 🌍 Country Code : ${countryCode}
┃ 👥 Found        : 0
┃
╰━━━━━━━━━━━━━━━━━━━━╯

❌ No group member was found
with the selected country code.

⚡ ${botName}`
                    },
                    { quoted: msg }
                );
            }

            /*
             * WhatsApp messages can become too large when
             * many people are mentioned. Split into groups
             * of 50 mentions to keep the command reliable.
             */
            const chunks =
                chunkArray(
                    matchingMembers,
                    50
                );

            for (
                let index = 0;
                index < chunks.length;
                index++
            ) {
                const current =
                    chunks[index];

                const mentions =
                    [...current];

                const mentionText =
                    current
                        .map(
                            number =>
                                `@${number.split('@')[0]}`
                        )
                        .join('\n');

                const header =
                    index === 0
                        ? `╭━━━〔 🌍 TAG COUNTRY 〕━━━╮
┃
┃ 🌍 Country Code : ${countryCode}
┃ 👥 Found        : ${matchingMembers.length}
┃
╰━━━━━━━━━━━━━━━━━━━━╯

`
                        : '';

                const footer =
                    index === chunks.length - 1
                        ? `

╭━━━〔 ✦ ${botName} ✦ 〕━━━╮
┃
┃ ✅ All matching members
┃    have been tagged.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
                        : '';

                await sock.sendMessage(
                    jid,
                    {
                        text:
                            header +
                            mentionText +
                            footer,

                        mentions
                    },
                    {
                        quoted:
                            index === 0
                                ? msg
                                : undefined
                    }
                );
            }

        } catch (error) {

            console.error(
                '[TAGCOUNTRY ERROR]',
                error
            );

            return sock.sendMessage(
                jid,
                {
                    text:
`┏━━❐ 🌍 TAG COUNTRY ❐
┃
┃ ❌ Failed to read group
┃    participants.
┃
┃ Please try again.
┃
┗━━❐
⚡ ${botName}`
                },
                { quoted: msg }
            );
        }
    }
};
