'use strict';

const axios = require("axios");
const yts = require("yt-search");
const { getBotName } = require("../../lib/botname");

function trunc(text, len = 38) {
    return text && text.length > len ? text.slice(0, len - 1) + "…" : text || "";
}

module.exports = {
    name: "play",
    aliases: ["music", "song", "playsong"],
    description: "Download music from YouTube",
    category: "download",

    async execute(sock, msg, args, prefix) {

        const chatId = msg.key.remoteJid;
        const botName = getBotName();
        const query = args.join(" ").trim();

        if (!query) {
            return sock.sendMessage(chatId, {
                text: [
                    "╔═|〔  PLAY MUSIC 〕",
                    "║",
                    `║ ▸ *Usage* : ${prefix}play <song name>`,
                    `║ ▸ *Example* : ${prefix}play forever young`,
                    "║",
                    `╚═|〔 ${botName} 〕`
                ].join("\n")
            }, { quoted: msg });
        }

        try {

            await sock.sendMessage(chatId, {
                react: {
                    text: "🎵",
                    key: msg.key
                }
            });

            const search = await yts(query);

            if (!search.videos.length) {
                throw new Error("No song found");
            }

            const video = search.videos[0];

            const { data } = await axios.get(
                `https://api.neosoft.best/api/downloader/youtube?url=${encodeURIComponent(video.url)}`,
                {
                    timeout: 60000,
                    headers: {
                        "User-Agent": "Mozilla/5.0"
                    }
                }
            );

            const result = data.result || data;

if (!data.status || !result.download) {
    throw new Error("API failed");
}

            await sock.sendMessage(chatId, {
                image: {
    url: result.thumbnail || video.thumbnail
},
caption: [
                    "╔═|〔  PLAY MUSIC 〕",
                    "║",
                    `║ ▸ *Title* : ${trunc(result.title || video.title)}`,
                    `║ ▸ *Duration* : ${result.duration || video.timestamp}`,
                    "║",
                    `╚═|〔 ${botName} 〕`
                ].join("\n")
            }, { quoted: msg });

            await sock.sendMessage(chatId, {
                audio: {
                    url: result.download
                },
                mimetype: "audio/mpeg",
                fileName: `${(result.title || video.title).replace(/[^\w\s]/g, "")}.mp3`,
                ptt: false
            }, { quoted: msg });

        } catch (err) {

            await sock.sendMessage(chatId, {
                text: [
                    "╔═|〔  PLAY MUSIC 〕",
                    "║",
                    `║ ▸ *Query* : ${trunc(query)}`,
                    "║ ▸ *Status* : ❌ Failed",
                    `║ ▸ *Reason* : ${err.message}`,
                    "║",
                    `╚═|〔 ${botName} 〕`
                ].join("\n")
            }, { quoted: msg });
        }
    }
};
