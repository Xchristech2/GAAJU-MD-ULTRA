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

      let results = [];
      let directVideo = null;

      /*
       * STEP 1
       * If user enters a YouTube URL, use that video directly.
       * Otherwise search YouTube and collect several results.
       */
      if (/youtu\.be|youtube\.com/i.test(query)) {
        const match = query.match(
          /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([^?&/]+)/
        );

        if (!match) {
          throw new Error("Invalid YouTube link.");
        }

        directVideo = {
          videoId: match[1],
          url: query,
          title: query,
          thumbnail: ""
        };

        results.push(directVideo);
      } else {
        const search = await yts(query);

        if (!search.videos || !search.videos.length) {
          throw new Error("No YouTube results found.");
        }

        /*
         * Keep the first 7 results.
         * If one fails, the next one is tried automatically.
         */
        results = search.videos.slice(0, 7);
      }

      let successfulAudio = null;
      let lastError = null;

      /*
       * STEP 2
       * Try each YouTube result until one works.
       */
      for (let i = 0; i < results.length; i++) {
        const video = results[i];

        const videoId = video.videoId;
        const videoUrl = video.url;
        const thumbnail = video.thumbnail || "";
        const searchedTitle = video.title || query;

        if (!videoId) {
          continue;
        }

        try {
          console.log(
            `[PLAY] Trying result ${i + 1}/${results.length}: ${searchedTitle} (${videoId})`
          );

          /*
           * Ask Wolvarex to convert this YouTube video.
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
           * If Wolvarex returns 502/5xx,
           * immediately try the next YouTube result.
           */
          if (apiResponse.status >= 500) {
            console.log(
              `[PLAY] Wolvarex returned ${apiResponse.status} for ${videoId}. Trying next result...`
            );

            lastError = new Error(
              `Wolvarex returned HTTP ${apiResponse.status}`
            );

            continue;
          }

          if (!data || data.success !== true) {
            lastError = new Error(
              data?.message ||
              data?.error ||
              "Wolvarex conversion failed."
            );

            console.log(
              `[PLAY] Conversion failed for ${videoId}. Trying next result...`
            );

            continue;
          }

          if (!data.downloadURL) {
            lastError = new Error(
              "Wolvarex did not return a download URL."
            );

            console.log(
              `[PLAY] No downloadURL for ${videoId}. Trying next result...`
            );

            continue;
          }

          /*
           * Download the MP3.
           */
          let audioResponse;

          try {
            audioResponse = await axios.get(data.downloadURL, {
              responseType: "arraybuffer",
              timeout: 120000,
              maxContentLength: 50 * 1024 * 1024,
              maxBodyLength: 50 * 1024 * 1024,
              validateStatus: () => true
            });
          } catch (downloadError) {
            lastError = downloadError;

            console.log(
              `[PLAY] Download request failed for ${videoId}. Trying next result...`
            );

            continue;
          }

          /*
           * Proxy/download itself may return 502.
           */
          if (audioResponse.status >= 500) {
            console.log(
              `[PLAY] Audio proxy returned ${audioResponse.status} for ${videoId}. Trying next result...`
            );

            lastError = new Error(
              `Audio proxy returned HTTP ${audioResponse.status}`
            );

            continue;
          }

          if (audioResponse.status !== 200) {
            console.log(
              `[PLAY] Audio download returned HTTP ${audioResponse.status}. Trying next result...`
            );

            lastError = new Error(
              `Audio download returned HTTP ${audioResponse.status}`
            );

            continue;
          }

          const buffer = Buffer.from(audioResponse.data);

          if (!buffer.length) {
            lastError = new Error("Downloaded audio is empty.");
            continue;
          }

          /*
           * We found a working result.
           */
          successfulAudio = {
            buffer,
            title: data.title || searchedTitle || query,
            quality: data.quality || "MP3",
            thumbnail,
            videoUrl,
            videoId
          };

          console.log(
            `[PLAY] Success with result ${i + 1}: ${successfulAudio.title}`
          );

          break;

        } catch (error) {
          lastError = error;

          console.log(
            `[PLAY] Result ${i + 1} failed: ${error.message}`
          );

          /*
           * Continue to the next result.
           */
          continue;
        }
      }

      /*
       * STEP 3
       * Nothing worked.
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
       * STEP 4
       * Send the working MP3.
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
              sourceUrl: videoUrl || ""
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
              "All available results failed."
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
