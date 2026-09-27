'use strict';

const yts = require("yt-search");
const axios = require("axios");

const API_BASE = 'https://eliteprotech-apis.zone.id';
const TIMEOUT = 120000;

function trunc(text, max = 50) {
    if (text && text.length > max) {
        return text.slice(0, max - 1) + "…";
    }

    return text || "";
}

module.exports = {

    name: "play",

    aliases: [
        "music",
        "song",
        "playsong"
    ],

    description:
        "Search and play a song from YouTube (128kbps MP3)",

    category: "download",

    async execute(
        sock,
        msg,
        args,
        prefix,
        ctx
    ) {

        const jid = msg.key.remoteJid;
        const p = prefix || ".";

        const query = args.join(" ").trim();

        if (!query) {
            return sock.sendMessage(
                jid,
                {
                    text: `Usage: ${p}play <song name>`
                },
                {
                    quoted: msg
                }
            );
        }

        try {

            await sock.sendMessage(
                jid,
                {
                    react: {
                        text: "🎵",
                        key: msg.key
                    }
                }
            );

            const search = await yts(query);

            if (
                !search ||
                !search.videos ||
                !search.videos.length
            ) {
                throw new Error("No YouTube results found");
            }

            const video = search.videos[0];

            if (!video.url) {
                throw new Error(
                    "YouTube video URL could not be found"
                );
            }

            console.log(`[PLAY] Found: ${video.title}`);
            console.log(`[PLAY] URL: ${video.url}`);

            const response = await axios.get(
                `${API_BASE}/download/ytmp3`,
                {
                    params: {
                        url: video.url
                    },
                    timeout: TIMEOUT
                }
            );

            if (
                !response.data ||
                !response.data.status
            ) {
                throw new Error(
                    response.data?.message ||
                    "Song download failed"
                );
            }

            const download = response.data.download;

            if (
                !download ||
                !download.downloadUrl
            ) {
                throw new Error(
                    "Download URL was not returned by the API"
                );
            }

            const title =
                download.title ||
                video.title ||
                "Unknown Song";

            const thumbnail =
                download.thumbnail ||
                video.thumbnail ||
                "";

            const duration =
                download.duration ||
                video.timestamp ||
                "Unknown";

            console.log(`[PLAY] Downloading: ${title}`);

            const audioResponse = await axios.get(
                download.downloadUrl,
                {
                    responseType: "arraybuffer",
                    timeout: TIMEOUT,
                    maxContentLength: 100 * 1024 * 1024,
                    maxBodyLength: 100 * 1024 * 1024
                }
            );

            const audioBuffer = Buffer.from(
                audioResponse.data
            );

            if (
                !audioBuffer ||
                audioBuffer.length < 10000
            ) {
                throw new Error(
                    "Downloaded audio is invalid"
                );
            }

            let thumbnailBuffer = null;

            if (thumbnail) {

                try {

                    const imgRes = await axios.get(
                        thumbnail,
                        {
                            responseType: "arraybuffer",
                            timeout: 15000
                        }
                    );

                    thumbnailBuffer =
                        Buffer.from(imgRes.data);

                } catch (thumbnailError) {

                    console.log(
                        "[PLAY] Thumbnail failed:",
                        thumbnailError.message
                    );
                }
            }

            const safeTitle =
                title
                    .replace(
                        /[<>:"/\\|?*\x00-\x1F]/g,
                        ""
                    )
                    .trim()
                    .substring(0, 80);

            const filename =
                `${safeTitle || "song"}.mp3`;

            // Short information shown under the song picture
            const caption =
`🎵 ${trunc(title, 60)}
⏱ ${duration}
🎧 128kbps MP3`;

            // Send song picture
            if (
                thumbnailBuffer &&
                thumbnailBuffer.length > 1000
            ) {

                await sock.sendMessage(
                    jid,
                    {
                        image: thumbnailBuffer,
                        caption: caption
                    },
                    {
                        quoted: msg
                    }
                );

            } else {

                await sock.sendMessage(
                    jid,
                    {
                        text: caption
                    },
                    {
                        quoted: msg
                    }
                );
            }

            // Send audio
            await sock.sendMessage(
                jid,
                {
                    audio: audioBuffer,
                    mimetype: "audio/mpeg",
                    ptt: false,
                    fileName: filename
                },
                {
                    quoted: msg
                }
            );

            console.log(`[PLAY] Sent: ${title}`);

        } catch (error) {

            console.error(
                "[PLAY ERROR]",
                error
            );

            await sock.sendMessage(
                jid,
                {
                    text:
`❌ Failed to download:
${trunc(
    error.response?.data?.message ||
    error.message ||
    "Unknown error",
    100
)}`
                },
                {
                    quoted: msg
                }
            );
        }
    }
};
