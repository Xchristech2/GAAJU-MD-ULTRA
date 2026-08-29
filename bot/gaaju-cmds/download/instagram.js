'use strict';

const { getBotName } = require('../../lib/botname');

const API_BASE = 'https://apix.wolvarex.com';
const API_KEY = 'wxa_f_837e27c4fc';

module.exports = {
    name: 'ig',

    aliases: [
        'insta',
        'instagram',
        'instadl'
    ],

    description: 'Download Instagram posts and reels',

    category: 'download',

    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        const botName = getBotName();

        const url = args[0];

        if (!url) {
            return sock.sendMessage(
                chatId,
                {
                    text:
`┏━━❐ 📸 INSTAGRAM ❐
┃
┃✦ Usage: ${prefix}ig <Instagram URL>
┃
┃✦ Example:
┃✦ ${prefix}ig https://www.instagram.com/reel/xxxxx/
┃
┗━━❐ ${botName} ❐`
                },
                { quoted: msg }
            );
        }

        if (!/instagram\.com/i.test(url)) {
            return sock.sendMessage(
                chatId,
                {
                    text:
`┏━━❐ 📸 INSTAGRAM ❐
┃
┃✦ Please send a valid
┃  Instagram post/reel URL.
┃
┗━━❐ ${botName} ❐`
                },
                { quoted: msg }
            );
        }

        try {
            const endpoint =
                `${API_BASE}/api/download/instagram/igram` +
                `?url=${encodeURIComponent(url)}` +
                `&key=${encodeURIComponent(API_KEY)}`;

            const response = await fetch(endpoint);

            if (!response.ok) {
                throw new Error(`API HTTP ${response.status}`);
            }

            const data = await response.json();

            if (!data || data.status !== true) {
                throw new Error('Instagram API returned no media');
            }

            const media = Array.isArray(data.BK9)
                ? data.BK9
                : [];

            if (!media.length) {
                throw new Error('No downloadable media found');
            }

            // Send every media item returned by the API
            for (const item of media) {
                if (!item || !item.url) continue;

                const mediaUrl = item.url;
                const type = String(item.type || '').toLowerCase();

                if (type === 'video') {
                    await sock.sendMessage(
                        chatId,
                        {
                            video: {
                                url: mediaUrl
                            },
                            caption:
`┏━━❐ 📸 INSTAGRAM ❐
┃
┃✦ Type: 📹 Video
┃✦ Status: ✅ Success
┃
┗━━❐ ${botName} ❐`
                        },
                        { quoted: msg }
                    );
                }

                else if (type === 'image') {
                    await sock.sendMessage(
                        chatId,
                        {
                            image: {
                                url: mediaUrl
                            },
                            caption:
`┏━━❐ 📸 INSTAGRAM ❐
┃
┃✦ Type: 🖼️ Image
┃✦ Status: ✅ Success
┃
┗━━❐ ${botName} ❐`
                        },
                        { quoted: msg }
                    );
                }
            }

        } catch (error) {
            console.error('[IG ERROR]', error);

            await sock.sendMessage(
                chatId,
                {
                    text:
`┏━━❐ 📸 INSTAGRAM ❐
┃
┃✦ Status: ❌ Failed
┃✦ Reason: ${error.message}
┃
┗━━❐ ${botName} ❐`
                },
                { quoted: msg }
            );
        }
    }
};
