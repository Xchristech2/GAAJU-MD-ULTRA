'use strict';

const https = require('https');
const { getBotName } = require('../../lib/botname');

function fetchText(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return fetchText(res.headers.location).then(resolve).catch(reject);
            }
            let data = '';
            res.on('data', d => data += d);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

function parseRssItems(xml, max = 5) {
    const items = [];
    const itemRx = /<item[\s\S]*?<\/item>/g;
    let m;
    while ((m = itemRx.exec(xml)) !== null && items.length < max) {
        const block = m[0];
        const title = (block.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/) || [])[1]?.trim() || 'Untitled';
        const link  = (block.match(/<link>([\s\S]*?)<\/link>/) || [])[1]?.trim()
                   || (block.match(/<guid[^>]*>(https?:\/\/[^\s<]+)<\/guid>/) || [])[1]?.trim() || '';
        if (title && title !== 'Untitled') items.push({ title, url: link });
    }
    return items;
}

async function fetchHeadlines(query) {
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
    try {
        const xml = await fetchText(rssUrl);
        const items = parseRssItems(xml, 5);
        if (items.length) return items;
    } catch {}
    try {
        const xml = await fetchText('https://feeds.bbci.co.uk/news/rss.xml');
        const items = parseRssItems(xml, 5);
        if (items.length) return items;
    } catch {}
    return null;
}

async function fetchCategory(rssUrl, fallbackQuery) {
    try {
        const xml = await fetchText(rssUrl);
        const items = parseRssItems(xml, 5);
        if (items.length) return items;
    } catch {}
    return fetchHeadlines(fallbackQuery);
}

async function sendNews(sock, msg, articles, label) {
    const chatId = msg.key.remoteJid;
    const name   = getBotName();
    if (!articles || !articles.length) {
        return sock.sendMessage(chatId, {
            text: `╔═|〔  ${label} 〕\n║\n║ ▸ *Status* : ❌ Could not fetch news\n║ ▸ *Tip*    : Try again later\n║\n╚═|〔 ${name} 〕`
        }, { quoted: msg });
    }
    const lines = articles.map((a, i) => `║ ▸ *${i + 1}.* ${a.title}`).join('\n');
    const urls  = articles.filter(a => a.url).map((a, i) => `║    ${i + 1}. ${a.url}`).join('\n');
    await sock.sendMessage(chatId, {
        text: `╔═|〔  ${label} 〕\n║\n${lines}\n║\n${urls ? urls + '\n║\n' : ''}╚═|〔 ${name} 〕`
    }, { quoted: msg });
}

module.exports = [
    {
        name:        'news',
        aliases:     ['headlines'],
        description: 'Get latest world news headlines',
        category:    'news',
        async execute(sock, msg, args) {
            try { await sock.sendMessage(msg.key.remoteJid, { react: { text: '📰', key: msg.key } }); } catch {}
            const query    = args.join(' ').trim() || 'world';
            const articles = await fetchHeadlines(query);
            await sendNews(sock, msg, articles, 'NEWS');
        }
    },
    {
        name:        'technews',
        aliases:     ['techheadlines'],
        description: 'Get latest technology news',
        category:    'news',
        async execute(sock, msg) {
            try { await sock.sendMessage(msg.key.remoteJid, { react: { text: '💻', key: msg.key } }); } catch {}
            const articles = await fetchCategory('https://feeds.bbci.co.uk/news/technology/rss.xml', 'technology AI software');
            await sendNews(sock, msg, articles, 'TECH NEWS');
        }
    },
    {
        name:        'footballnews',
        aliases:     ['soccerupdate', 'footballheadlines'],
        description: 'Get latest football/soccer news',
        category:    'news',
        async execute(sock, msg) {
            try { await sock.sendMessage(msg.key.remoteJid, { react: { text: '⚽', key: msg.key } }); } catch {}
            const articles = await fetchCategory('https://feeds.bbci.co.uk/sport/football/rss.xml', 'football soccer premier league');
            await sendNews(sock, msg, articles, 'FOOTBALL NEWS');
        }
    }
];
