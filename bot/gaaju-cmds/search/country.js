'use strict';

const { getBotName } = require('../../lib/botname');

async function fetchCountry(query) {
    const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(query)}?fullText=false`;
    const res = await fetch(url, { signal: AbortSignal.timeout(12000), headers: { 'User-Agent': 'Gaaju/1.0' } });
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
    description: 'Get detailed info about any country — .country <name>',
    category: 'search',

    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();
        try { await sock.sendMessage(chatId, { react: { text: '🌍', key: msg.key } }); } catch {}

        const query = args.join(' ').trim();
        if (!query) {
            return sock.sendMessage(chatId, {
                text: `╔═|〔  COUNTRY INFO 🌍 〕\n║\n║ ▸ *Usage*   : ${prefix}country <name>\n║ ▸ *Example* : ${prefix}country Nigeria\n║ ▸ *Example* : ${prefix}country United States\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }

        try {
            const c = await fetchCountry(query);

            const cname    = c.name?.common || query;
            const official = c.name?.official || cname;
            const capital  = (c.capital || []).join(', ') || 'N/A';
            const region   = [c.region, c.subregion].filter(Boolean).join(' → ') || 'N/A';
            const pop      = fmt(c.population);
            const area     = fmt(c.area) + ' km²';
            const flag     = c.flag || '';
            const langs    = Object.values(c.languages || {}).join(', ') || 'N/A';
            const currency = Object.values(c.currencies || {}).map(x => `${x.name} (${x.symbol || '?'})`).join(', ') || 'N/A';
            const tld      = (c.tld || []).join(', ') || 'N/A';
            const calling  = (c.idd?.root || '') + (c.idd?.suffixes?.[0] || '');
            const timezone = (c.timezones || []).slice(0, 3).join(', ') || 'N/A';
            const borders  = (c.borders || []).slice(0, 5).join(', ') || 'None';
            const driving  = c.car?.side === 'left' ? '🚗 Left side' : '🚗 Right side';
            const independent = c.independent ? '✅ Yes' : '❌ No';

            const lines = [
                `╔═|〔  COUNTRY INFO 🌍 〕`,
                `║`,
                `║ ▸ *Country*    : ${flag} ${cname}`,
                `║ ▸ *Official*   : ${official}`,
                `║ ▸ *Capital*    : ${capital}`,
                `║ ▸ *Region*     : ${region}`,
                `║ ▸ *Population* : ${pop}`,
                `║ ▸ *Area*       : ${area}`,
                `║ ▸ *Language*   : ${langs}`,
                `║ ▸ *Currency*   : ${currency}`,
                `║ ▸ *Calling*    : +${calling}`,
                `║ ▸ *TLD*        : ${tld}`,
                `║ ▸ *Timezone*   : ${timezone}`,
                `║ ▸ *Borders*    : ${borders}`,
                `║ ▸ *Driving*    : ${driving}`,
                `║ ▸ *Independent*: ${independent}`,
                `║`,
                `╚═|〔 ${name} 〕`,
            ].join('\n');

            await sock.sendMessage(chatId, { text: lines }, { quoted: msg });

        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  COUNTRY INFO 〕\n║\n║ ▸ *Status* : ❌ ${e.message}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }
    }
};
