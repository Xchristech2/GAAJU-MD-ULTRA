'use strict';

const yts = require("yt-search");
const axios = require("axios");
const { getBotName } = require("../../lib/botname");

const API_KEY = "wxa_f_837e27c4fc";
const API_URL = "https://apix.wolvarex.com/api/music/ytmusic-mp3";

function trunc(text, max = 38) {
    if (text && text.length > max) {
        return text.slice(0, max - 1) + "…";
    }
    return text || "";
}

function fmtSize(bytes) {
    if (!bytes) return "? MB";

    if (bytes >= 1048576) {
        return (bytes / 1024 / 1024).toFixed(2) + " MB";
    }

    return (bytes / 1024).toFixed(1) + " KB";
}

module.exports = {
    name: "play",
    aliases: ["music", "song", "playsong"],
    description: "Search and play a song from YouTube",
    category: "download",

    async execute(sock, msg, args, prefix) {
        const jid = msg.key.remoteJid;
        const botName = getBotName();
        const query = args.join(" ").trim();

        if (!query) {
            return sock.sendMessage(
                jid,
                {
                    text: [
                        "╭━━━━━━━━━━━━━━━━━━╮",
                        "     💿 *MUSIC PLAYER*",
                        "╰━━━━━━━━━━━━━━━━━━╯",
                        "",
                        "🎵 *Usage:* " + prefix + "play <song name>",
                        "🎶 *Example:* " + prefix + "play Alan Walker Faded",
                        "",
                        "╭━━━━━━━━━━━━━━━━━━╮",
                        "     🎧 " + botName,
                        "╰━━━━━━━━━━━━━━━━━━╯"
                    ].join("\n")
                },
                {
                    quoted: msg
                }
            );
        }

        try {

            // 🎵 REACTION
            try {
                await sock.sendMessage(jid, {
                    react: {
                        text: "🎵",
                        key: msg.key
                    }
                });
            } catch (reactionError) {
                console.log(
                    "[PLAY] Start reaction failed:",
                    reactionError.message
                );
            }

            let results = [];

            /*
             * YOUTUBE LINK
             */
            if (/youtu\.be|youtube\.com/i.test(query)) {

                const match = query.match(
                    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([^?&/]+)/
                );

                if (!match) {
                    throw new Error("Invalid YouTube link.");
                }

                results.push({
                    videoId: match[1],
                    url: query,
                    title: query,
                    thumbnail: ""
                });

            } else {

                /*
                 * SEARCH YOUTUBE
                 */
                const search = await yts(query);

                if (!search.videos || !search.videos.length) {
                    throw new Error("No YouTube results found.");
                }

                /*
                 * TRY UP TO 7 RESULTS
                 */
                results = search.videos.slice(0, 7);
            }

            let successfulAudio = null;
            let lastError = null;

            /*
             * TRY EACH RESULT
             */
            for (let i = 0; i < results.length; i++) {

                const video = results[i];

                if (!video.videoId) {
                    continue;
                }

                const videoId = video.videoId;
                const videoUrl = video.url || `https://www.youtube.com/watch?v=${videoId}`;
                const thumbnail = video.thumbnail || "";
                const searchTitle = video.title || query;

                try {

                    console.log(
                        `[PLAY] Trying ${i + 1}/${results.length}: ${searchTitle}`
                    );

                    /*
                     * WOLVAREX API
                     */
                    const apiResponse = await axios.get(API_URL, {
                        params: {
                            id: videoId,
                            key: API_KEY
                        },
                        timeout: 60000,
                        validateStatus: () => true
                    });

                    const data = apiResponse.data;

                    /*
                     * SERVER ERROR
                     */
                    if (apiResponse.status >= 500) {

                        console.log(
                            `[PLAY] API ${apiResponse.status} - trying next result`
                        );

                        lastError = new Error(
                            `Wolvarex API returned ${apiResponse.status}`
                        );

                        continue;
                    }

                    /*
                     * API FAILED
                     */
                    if (!data || data.success !== true) {

                        lastError = new Error(
                            data?.message ||
                            data?.error ||
                            "Wolvarex conversion failed."
                        );

                        console.log(
                            `[PLAY] Conversion failed - trying next result`
                        );

                        continue;
                    }

                    /*
                     * NO DOWNLOAD URL
                     */
                    if (!data.downloadURL) {

                        lastError = new Error(
                            "Wolvarex did not return a download URL."
                        );

                        continue;
                    }

                    console.log(
                        `[PLAY] Download URL received for ${videoId}`
                    );

                    /*
                     * DOWNLOAD MP3
                     */
                    const audioResponse = await axios.get(
                        data.downloadURL,
                        {
                            responseType: "arraybuffer",
                            timeout: 120000,
                            maxContentLength: 50 * 1024 * 1024,
                            maxBodyLength: 50 * 1024 * 1024,
                            validateStatus: () => true
                        }
                    );

                    /*
                     * PROXY FAILED
                     */
                    if (audioResponse.status >= 500) {

                        console.log(
                            `[PLAY] Proxy ${audioResponse.status} - trying next result`
                        );

                        lastError = new Error(
                            `Audio proxy returned ${audioResponse.status}`
                        );

                        continue;
                    }

                    if (audioResponse.status !== 200) {

                        lastError = new Error(
                            `Audio download returned ${audioResponse.status}`
                        );

                        continue;
                    }

                    const buffer = Buffer.from(audioResponse.data);

                    if (!buffer.length) {

                        lastError = new Error(
                            "Downloaded audio is empty."
                        );

                        continue;
                    }

                    /*
                     * SUCCESS
                     */
                    successfulAudio = {
                        buffer,
                        title: data.title || searchTitle || query,
                        quality: data.quality || "MP3",
                        thumbnail,
                        videoUrl
                    };

                    console.log(
                        `[PLAY] SUCCESS: ${successfulAudio.title}`
                    );

                    break;

                } catch (error) {

                    console.log(
                        `[PLAY] Result ${i + 1} failed: ${error.message}`
                    );

                    lastError = error;

                    /*
                     * TRY NEXT RESULT
                     */
                    continue;
                }
            }

            /*
             * ALL RESULTS FAILED
             */
            if (!successfulAudio) {
                throw new Error(
                    lastError?.message ||
                    "All YouTube results failed."
                );
            }

            const {
                buffer,
                title,
                quality,
                thumbnail,
                videoUrl
            } = successfulAudio;

            /*
             * CAPTION
             */
            const caption = [
                "╭━━━━━━━━━━━━━━━━━━╮",
                "     💿 *NOW PLAYING*",
                "╰━━━━━━━━━━━━━━━━━━╯",
                "",
                "🎵 *Title:* " + trunc(title),
                "🎧 *Quality:* " + quality,
                "📦 *Size:* " + fmtSize(buffer.length),
                "",
                "⏺️ *Status:* Ready",
                "",
                "╭━━━━━━━━━━━━━━━━━━╮",
                "     🎶 " + botName,
                "╰━━━━━━━━━━━━━━━━━━╯"
            ].join("\n");

            /*
             * SEND AUDIO
             */
            await sock.sendMessage(
                jid,
                {
                    audio: buffer,
                    mimetype: "audio/mpeg",
                    ptt: false,
                    caption,

                    contextInfo: {
                        externalAdReply: {
                            showAdAttribution: false,
                            renderLargerThumbnail: true,
                            mediaType: 1,
                            title: trunc(title),
                            body: "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ",
                            thumbnailUrl: thumbnail,
                            sourceUrl: videoUrl
                        }
                    }
                },
                {
                    quoted: msg
                }
            );

            /*
             * SUCCESS REACTION
             */
            try {
                await sock.sendMessage(jid, {
                    react: {
                        text: "✅",
                        key: msg.key
                    }
                });
            } catch (reactionError) {
                console.log(
                    "[PLAY] Success reaction failed:",
                    reactionError.message
                );
            }

        } catch (error) {

            console.error(
                "[PLAY ERROR]:",
                error
            );

            /*
             * ERROR MESSAGE
             */
            await sock.sendMessage(
                jid,
                {
                    text: [
                        "╭━━━━━━━━━━━━━━━━━━╮",
                        "     💿 *MUSIC PLAYER*",
                        "╰━━━━━━━━━━━━━━━━━━╯",
                        "",
                        "🎵 *Query:* " + trunc(query),
                        "❌ *Status:* Failed",
                        "⚠️ *Reason:* " +
                        (
                            error.response?.data?.message ||
                            error.message ||
                            "Unknown error"
                        ),
                        "",
                        "╭━━━━━━━━━━━━━━━━━━╮",
                        "     🎶 " + botName,
                        "╰━━━━━━━━━━━━━━━━━━╯"
                    ].join("\n")
                },
                {
                    quoted: msg
                }
            );

        }
    }
};
