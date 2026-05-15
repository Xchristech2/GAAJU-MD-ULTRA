'use strict';

const { dlBuffer } = require('../../lib/keithapi');
const { getBotName } = require('../../lib/botname');

// ── Image Search (Unsplash source — free, no key) ─────────────────────────────
// Returns a random Unsplash image matching the query
const imgCmd = {
    name: 'img',
    aliases: ['image', 'imgsearch', 'images', 'pic'],
    description: 'Search for an image by keyword',
    category: 'search',
    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();
        const query  = args.join(' ').trim();
        if (!query) return sock.sendMessage(chatId, {
            text: `╔═|〔  🖼️ IMAGE SEARCH 〕\n║\n║ ▸ *Usage* : ${prefix}img <query>\n║ ▸ *Example* : ${prefix}img sunset ocean\n║\n╚═|〔 ${name} 〕`
        }, { quoted: msg });

        try {
            await sock.sendMessage(chatId, { react: { text: '🖼️', key: msg.key } });
            const lock = Math.floor(Math.random() * 1000000);
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 20000);
            const res = await fetch(
                `https://loremflickr.com/1280/720/${encodeURIComponent(query)}?lock=${lock}`,
                { signal: controller.signal, redirect: 'follow' }
            );
            clearTimeout(timer);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const buf = Buffer.from(await res.arrayBuffer());
            if (buf.length < 5000) throw new Error('No image returned');

            await sock.sendMessage(chatId, {
                image: buf,
                mimetype: 'image/jpeg',
                caption: `╔═|〔  🖼️ IMAGE SEARCH 〕\n║\n║ ▸ *Query* : ${query}\n║ ▸ *Via*   : LoremFlickr\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  🖼️ IMAGE SEARCH 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }
    }
};

module.exports = [imgCmd];
