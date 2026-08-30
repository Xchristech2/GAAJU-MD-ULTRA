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
      await sock.sendMessage(jid, {
        react: {
          text: "🎵",
          key: msg.key
        }
      });

      let videoId;
      let videoUrl;
      let thumbnail = "";
      let searchedTitle = query;

      /*
       * STEP 1:
       * Search YouTube when the user gives a song name.
       */
      if (/youtu\.be|youtube\.com/i.test(query)) {
        const match = query.match(
          /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([^?&/]+)/
        );

        if (!match) {
          throw new Error("Invalid YouTube link.");
        }

        videoId = match[1];
        videoUrl = query;
      } else {
        const search = await yts(query);

        if (!search.videos || !search.videos.length) {
          throw new Error("No YouTube results found.");
        }

        const video = search.videos[0];

        videoId = video.videoId;
        videoUrl = video.url;
        thumbnail = video.thumbnail || "";
        searchedTitle = video.title;
      }

      if (!videoId) {
        throw new Error("Could not get YouTube video ID.");
      }

      /*
       * STEP 2:
       * Call Wolvarex/WOLF TECH MP3 API.
       */
      const apiResponse = await axios.get(API_URL, {
        params: {
          id: videoId,
          key: API_KEY
        },
        timeout: 60000
      });

      const data = apiResponse.data;

      /*
       * Expected response:
       *
       * {
       *   success: true,
       *   title: "...",
       *   quality: "480",
       *   downloadURL: "https://..."
       * }
       */
      if (!data || data.success !== true) {
        throw new Error(
          data?.message ||
          data?.error ||
          "Wolvarex API failed."
        );
      }

      if (!data.downloadURL) {
        throw new Error("API did not return a download URL.");
      }

      const title = data.title || searchedTitle || query;

      /*
       * STEP 3:
       * Download the actual MP3 from downloadURL.
       */
      const audioResponse = await axios.get(data.downloadURL, {
        responseType: "arraybuffer",
        timeout: 120000,
        maxContentLength: 50 * 1024 * 1024,
        maxBodyLength: 50 * 1024 * 1024
      });

      const buffer = Buffer.from(audioResponse.data);

      if (!buffer.length) {
        throw new Error("Downloaded audio is empty.");
      }

      /*
       * STEP 4:
       * Send the MP3 to WhatsApp.
       */
      const caption = [
        "╭━━━━━━━━━━━━━━━━━━╮",
        "     💿 *NOW PLAYING*",
        "╰━━━━━━━━━━━━━━━━━━╯",
        "",
        "🎵 *Title:* " + trunc(title),
        "🎧 *Quality:* " + (data.quality || "MP3"),
        "📦 *Size:* " + fmtSize(buffer.length),
        "",
        "⏺️ *Status:* Ready",
        "",
        "╭━━━━━━━━━━━━━━━━━━╮",
        "     🎶 " + botName,
        "╰━━━━━━━━━━━━━━━━━━╯"
      ].join("\n");

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
              sourceUrl: videoUrl || videoId
            }
          }
        },
        {
          quoted: msg
        }
      );

      await sock.sendMessage(jid, {
        react: {
          text: "✅",
          key: msg.key
        }
      });

    } catch (error) {
      console.error("PLAY ERROR:", error);

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
            "⚠️ *Reason:* " + (
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
