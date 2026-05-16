'use strict';

const { getBotName } = require('../../lib/botname');

const CHANNEL_ID = "120363406588763460@newsletter";
const CHANNEL_LINK = "https://whatsapp.com/channel/0029VbBvGgyFsn0alyIDjw0z";

async function fetchCountry(query) {
    const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(query)}?fullText=false`;
    const res = await fetch(url, {
        signal: AbortSignal.timeout(12000),
        headers: { 'User-Agent': 'Gaaju/1.0' }
    });

    if (res.status === 404) throw new Error(`Country not found: ${query}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    if (!data.length) throw new Error('No country found');
    return data[0];
}

function fmt(n) {
    return n ? Number(n).toLocaleString('en-US') : 'N/A';
}

module.exports = {
    name: 'country',
    aliases: ['countryinfo', 'nation', 'countrydata', 'cinfo'],
    description: 'Get detailed info about any country',
    category: 'search',

    async execute(sock, msg, args, prefix) {

        const chatId = msg.key.remoteJid;
        const name = getBotName();

        const query = args.join(' ').trim();

        if (!query) {
            return sock.sendMessage(chatId, {
                text:
`╔═|〔  COUNTRY INFO 🌍 〕
║
║ ▸ *Usage*   : ${prefix}country <name>
║ ▸ *Example* : ${prefix}country Nigeria
║
║ 🌐 View Channel:
║ 👉 ${CHANNEL_LINK}
║
╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }

        try {
            const c = await fetchCountry(query);

            const cname = c.name?.common || query;
            const official = c.name?.official || cname;
            const capital = (c.capital || []).join(', ') || 'N/A';
            const region = [c.region, c.subregion].filter(Boolean).join(' → ') || 'N/A';
            const pop = fmt(c.population);
            const area = fmt(c.area) + ' km²';
            const flag = c.flag || '';
            const langs = Object.values(c.languages || {}).join(', ') || 'N/A';
            const currency = Object.values(c.currencies || {})
                .map(x => `${x.name} (${x.symbol || '?'})`).join(', ') || 'N/A';
            const tld = (c.tld || []).join(', ') || 'N/A';
            const calling = (c.idd?.root || '') + (c.idd?.suffixes?.[0] || '');
            const timezone = (c.timezones || []).slice(0, 3).join(', ') || 'N/A';
            const borders = (c.borders || []).slice(0, 5).join(', ') || 'None';
            const driving = c.car?.side === 'left' ? '🚗 Left side' : '🚗 Right side';
            const independent = c.independent ? '✅ Yes' : '❌ No';

            const text =
`╔═|〔  COUNTRY INFO 🌍 〕
║
║ ▸ *Country*    : ${flag} ${cname}
║ ▸ *Official*   : ${official}
║ ▸ *Capital*    : ${capital}
║ ▸ *Region*     : ${region}
║ ▸ *Population* : ${pop}
║ ▸ *Area*       : ${area}
║ ▸ *Language*   : ${langs}
║ ▸ *Currency*   : ${currency}
║ ▸ *Calling*    : +${calling}
║ ▸ *TLD*        : ${tld}
║ ▸ *Timezone*   : ${timezone}
║ ▸ *Borders*    : ${borders}
║ ▸ *Driving*    : ${driving}
║ ▸ *Independent*: ${independent}
║
║ 🌐 *View Channel:* ${CHANNEL_LINK}
╚═|〔 ${name} 〕`;

            await sock.sendMessage(chatId, {
                text,
                contextInfo: {
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: CHANNEL_ID,
                        newsletterName: "GAAJU MD ULTRA",
                        serverMessageId: 1
                    }
                }
            }, { quoted: msg });

        } catch (e) {
            await sock.sendMessage(chatId, {
                text:
`╔═|〔  COUNTRY INFO 〕
║
║ ▸ *Status* : ❌ ${e.message}
║
║ 🌐 View Channel:
║ 👉 ${CHANNEL_LINK}
║
╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }
    }
};
