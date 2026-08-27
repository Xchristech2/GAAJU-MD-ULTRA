'use strict';

const countries = {
    nigeria: ['🇳🇬', '+234', 'Nigeria'],
    ghana: ['🇬🇭', '+233', 'Ghana'],
    'south africa': ['🇿🇦', '+27', 'South Africa'],
    kenya: ['🇰🇪', '+254', 'Kenya'],
    uganda: ['🇺🇬', '+256', 'Uganda'],
    tanzania: ['🇹🇿', '+255', 'Tanzania'],
    rwanda: ['🇷🇼', '+250', 'Rwanda'],
    cameroon: ['🇨🇲', '+237', 'Cameroon'],
    'united states': ['🇺🇸', '+1', 'United States'],
    usa: ['🇺🇸', '+1', 'United States'],
    canada: ['🇨🇦', '+1', 'Canada'],
    'united kingdom': ['🇬🇧', '+44', 'United Kingdom'],
    uk: ['🇬🇧', '+44', 'United Kingdom'],
    france: ['🇫🇷', '+33', 'France'],
    germany: ['🇩🇪', '+49', 'Germany'],
    italy: ['🇮🇹', '+39', 'Italy'],
    spain: ['🇪🇸', '+34', 'Spain'],
    portugal: ['🇵🇹', '+351', 'Portugal'],
    netherlands: ['🇳🇱', '+31', 'Netherlands'],
    belgium: ['🇧🇪', '+32', 'Belgium'],
    switzerland: ['🇨🇭', '+41', 'Switzerland'],
    ireland: ['🇮🇪', '+353', 'Ireland'],
    brazil: ['🇧🇷', '+55', 'Brazil'],
    argentina: ['🇦🇷', '+54', 'Argentina'],
    colombia: ['🇨🇴', '+57', 'Colombia'],
    mexico: ['🇲🇽', '+52', 'Mexico'],
    jamaica: ['🇯🇲', '+1', 'Jamaica'],
    india: ['🇮🇳', '+91', 'India'],
    china: ['🇨🇳', '+86', 'China'],
    japan: ['🇯🇵', '+81', 'Japan'],
    'south korea': ['🇰🇷', '+82', 'South Korea'],
    korea: ['🇰🇷', '+82', 'South Korea'],
    indonesia: ['🇮🇩', '+62', 'Indonesia'],
    malaysia: ['🇲🇾', '+60', 'Malaysia'],
    singapore: ['🇸🇬', '+65', 'Singapore'],
    thailand: ['🇹🇭', '+66', 'Thailand'],
    philippines: ['🇵🇭', '+63', 'Philippines'],
    vietnam: ['🇻🇳', '+84', 'Vietnam'],
    australia: ['🇦🇺', '+61', 'Australia'],
    'new zealand': ['🇳🇿', '+64', 'New Zealand'],
    turkey: ['🇹🇷', '+90', 'Turkey'],
    russia: ['🇷🇺', '+7', 'Russia'],
    ukraine: ['🇺🇦', '+380', 'Ukraine'],
    israel: ['🇮🇱', '+972', 'Israel'],
    'saudi arabia': ['🇸🇦', '+966', 'Saudi Arabia'],
    'united arab emirates': ['🇦🇪', '+971', 'United Arab Emirates'],
    uae: ['🇦🇪', '+971', 'United Arab Emirates'],
    qatar: ['🇶🇦', '+974', 'Qatar'],
    egypt: ['🇪🇬', '+20', 'Egypt'],
    morocco: ['🇲🇦', '+212', 'Morocco'],
    algeria: ['🇩🇿', '+213', 'Algeria'],
    tunisia: ['🇹🇳', '+216', 'Tunisia'],
    ethiopia: ['🇪🇹', '+251', 'Ethiopia'],
    zimbabwe: ['🇿🇼', '+263', 'Zimbabwe'],
    zambia: ['🇿🇲', '+260', 'Zambia'],
    malawi: ['🇲🇼', '+265', 'Malawi'],
    botswana: ['🇧🇼', '+267', 'Botswana'],
    namibia: ['🇳🇦', '+264', 'Namibia'],
    senegal: ['🇸🇳', '+221', 'Senegal'],
    'sierra leone': ['🇸🇱', '+232', 'Sierra Leone'],
    liberia: ['🇱🇷', '+231', 'Liberia'],
    'ivory coast': ['🇨🇮', '+225', 'Ivory Coast'],
    mali: ['🇲🇱', '+223', 'Mali'],
    niger: ['🇳🇪', '+227', 'Niger'],
    chad: ['🇹🇩', '+235', 'Chad']
};

module.exports = {
    name: 'code',
    aliases: ['countrycode'],
    description: 'Get a country calling code and flag',
    category: 'utility',

    async execute(sock, msg, args) {
        const chatId = msg.key.remoteJid;

        if (!args || !args.length) {
            return sock.sendMessage(
                chatId,
                {
                    text:
`┏━━❐ 🌍 COUNTRY CODE ❐
┃
┃ Usage:
┃ ✦ .code Nigeria
┃ ✦ .code Ghana
┃ ✦ .code South Africa
┃ ✦ .countrycode Japan
┃
┗━━❐
> Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ`
                },
                { quoted: msg }
            );
        }

        const query = args.join(' ').trim().toLowerCase();

        const country = countries[query];

        if (!country) {
            return sock.sendMessage(
                chatId,
                {
                    text:
`❌ Country not found.

Try:
.code Nigeria
.code Ghana
.code United States
.code South Africa

> Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ`
                },
                { quoted: msg }
            );
        }

        const [flag, code, name] = country;

        const text =
`┏━━❐ 🌍 COUNTRY CODE ❐
┃
┃ ${flag} Country: ${name}
┃ 📞 Code: ${code}
┃
┗━━❐
> Powered by GAAJU-MD ULTRA`;

        await sock.sendMessage(
            chatId,
            {
                text
            },
            {
                quoted: msg
            }
        );
    },
};
