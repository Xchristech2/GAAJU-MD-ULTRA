'use strict';

const axios = require('axios');

const {
    casperGet,
    keithGet,
    extractUrl,
    dlBuffer
} = require("../../lib/keithapi");

const {
    getBotName
} = require("../../lib/botname");

module.exports = {
    name: "tiktok",
    aliases: ["tt", "tik", "tok"],
    description: "Download TikTok video (no watermark)",
    category: "download",

    async execute(sock, msg, args, prefix) {

        const chatId = msg.key.remoteJid;
        const botName = getBotName();
        const url = args[0];

        // ================= USAGE
        if (!url) {
            return sock.sendMessage(chatId, {
                text: `╭━━━〔 🎵 TIKTOK 〕━━━⬣
┃
┃ ✦ Usage : ${prefix}tiktok <url>
┃
╰━━━━━━〔 🤖 ${botName} 〕⬣`
            }, {
                quoted: msg
            });
        }

        try {

            let downloadUrl;
            let title;
            let author;
            let likes;
            let comments;

            // ================= NEW API (Primary)
            try {
                const apiUrl = `https://api-red-iota-56.vercel.app/downloader/tikdl?apikey=nova_510035&url=${encodeURIComponent(url)}`;
                
                const { data } = await axios.get(apiUrl, {
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Accept': 'application/json'
                    }
                });

                if (!data?.answer?.downloadLink) {
                    throw new Error('No video found');
                }

                const res = data.answer;
                downloadUrl = res.downloadLink;
                title = res.description || 'TikTok';
                author = res.author || 'Unknown';
                likes = res.likes || 0;
                comments = res.comments || 0;

            } catch (primaryError) {
                console.log('Primary API failed, trying fallback...');

                // ================= CASPER API (Fallback 1)
                try {
                    const result = await casperGet(
                        "/api/downloader/tiktok",
                        {
                            url: url
                        }
                    );

                    if (!result.success) {
                        throw new Error(
                            result.error || "Casper: no result"
                        );
                    }

                    downloadUrl =
                        result.download_url ||
                        result.video_hd_url ||
                        result.video_url;

                    title =
                        (result.title || "TikTok").slice(0, 50);

                    author = result.author || "";
                    likes = result.likes || 0;
                    comments = result.comments || 0;

                    if (!downloadUrl) {
                        throw new Error(
                            "Casper: no video URL"
                        );
                    }

                } catch (casperError) {

                    // ================= KEITH FALLBACK (Fallback 2)
                    const result = await keithGet(
                        "/download/tiktokdl3",
                        {
                            url: url
                        }
                    );

                    if (!result.status) {
                        throw new Error(
                            result.error || "All APIs failed"
                        );
                    }

                    downloadUrl = extractUrl(result.result);
                    title = "TikTok";
                    author = "";
                    likes = 0;
                    comments = 0;

                    if (!downloadUrl) {
                        throw new Error(
                            "No download URL found"
                        );
                    }
                }
            }

            // ================= DOWNLOAD VIDEO
            const buffer = await dlBuffer(downloadUrl);

            const size = (
                buffer.length /
                1024 /
                1024
            ).toFixed(2);

            // ================= CAPTION
            const caption = `╭━━━〔 🎵 TIKTOK 〕━━━⬣
┃
┃ ✦ Title  : ${title.slice(0, 50)}
┃ ✦ By     : ${author ? "@" + author : "Unknown"}
┃ ✦ Likes  : ${likes || 0}
┃ ✦ Comments: ${comments || 0}
┃ ✦ Size   : ${size} MB
┃ ✦ Status : ✅ Downloaded
┃
╰━━━━━━〔 🤖 ${botName} 〕⬣`;

            // ================= SEND VIDEO
            await sock.sendMessage(chatId, {
                video: buffer,
                caption: caption
            }, {
                quoted: msg
            });

        } catch (error) {

            // ================= ERROR
            await sock.sendMessage(chatId, {
                text: `╭━━━〔 🎵 TIKTOK 〕━━━⬣
┃
┃ ✦ Status : ❌ Failed
┃ ✦ Reason : ${error.message}
┃
╰━━━━━━〔 🤖 ${botName} 〕⬣`
            }, {
                quoted: msg
            });
        }
    }
};
