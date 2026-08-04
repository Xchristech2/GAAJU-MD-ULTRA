const yts = require("yt-search");
const { dlBuffer } = require("../../lib/keithapi");
const axios = require("axios");
const { getBotName } = require("../../lib/botname");

function trunc(_0x51d347, _0x3ebbc4 = 38) {
  if (_0x51d347 && _0x51d347.length > _0x3ebbc4) {
    return _0x51d347.slice(0, _0x3ebbc4 - 1) + "…";
  } else {
    return _0x51d347 || "";
  }
}

function fmtSize(_0x951564) {
  if (!_0x951564) {
    return "? MB";
  }
  if (_0x951564 >= 1048576) {
    return (_0x951564 / 1024 / 1024).toFixed(2) + " MB";
  }
  return (_0x951564 / 1024).toFixed(1) + " KB";
}

module.exports = {
  name: "play",
  aliases: ["music", "song", "playsong"],
  description: "Search and play a song from YouTube (128kbps MP3)",
  category: "download",
  async execute(_0x257fb7, _0x38eb72, _0x58d407, _0x45e1a4, _0x3b2277) {
    const _0x227982 = _0x38eb72.key.remoteJid;
    const _0x48a4b6 = getBotName();
    const _0x5aee42 = _0x58d407.join(" ").trim();
    
    if (!_0x5aee42) {
      return _0x257fb7.sendMessage(_0x227982, {
        text: [
  "╭━━━━━━━━━━━━━━━━━━╮",
  "     💿 *MUSIC PLAYER*",
  "╰━━━━━━━━━━━━━━━━━━╯",
  "",
  "🎵 *Usage:* " + _0x45e1a4 + "play <song name>",
  "🎶 *Example:* " + _0x45e1a4 + "play Alan Walker Faded",
  "",
  "╭━━━━━━━━━━━━━━━━━━╮",
  "     🎧 " + _0x48a4b6,
  "╰━━━━━━━━━━━━━━━━━━╯"
].join("\n")
      }, {
        quoted: _0x38eb72
      });
    }
    
    try {
      await _0x257fb7.sendMessage(_0x227982, {
        react: {
          text: "🎵",
          key: _0x38eb72.key
        }
      });
      
let url = _0x5aee42;
let thumbnail = "";

if (!/youtu\.?be|youtube\.com/.test(_0x5aee42)) {
  const search = await yts(_0x5aee42);

  if (!search.videos?.length) {
    throw new Error("No search results");
  }

  url = search.videos[0].url;
  thumbnail = search.videos[0].thumbnail;
}
      
      const { data } = await axios.get(
        "https://eliteprotech-apis.zone.id/convert",
        {
          params: {
            url,
            format: "mp3"
          }
        }
      );
      
      if (!data.success || !data.downloadURL) {
        throw new Error("Failed to convert audio.");
      }
      
      const buffer = await dlBuffer(data.downloadURL);
      
      const caption = [
  "╭━━━━━━━━━━━━━━━━━━╮",
  "     💿 *NOW PLAYING*",
  "╰━━━━━━━━━━━━━━━━━━╯",
  "",
  "🎵 *Title:* " + trunc(data.title),
  "🎧 *Quality:* 128kbps",
  "📦 *Size:* " + fmtSize(buffer.length),
  "",
  "⏺️ *Status:* Ready",
  "",
  "╭━━━━━━━━━━━━━━━━━━╮",
  "     🎶 " + _0x48a4b6,
  "╰━━━━━━━━━━━━━━━━━━╯"
].join("\n");

await _0x257fb7.sendMessage(
  _0x227982,
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
        title: trunc(data.title),
        body: "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ",
        thumbnailUrl: thumbnail,
        sourceUrl: url
      }
    }
  },
  {
    quoted: _0x38eb72
  }
);
      
    } catch (_0x149386) {
      await _0x257fb7.sendMessage(
        _0x227982,
        {
          text: [
  "╭━━━━━━━━━━━━━━━━━━╮",
  "     💿 *MUSIC PLAYER*",
  "╰━━━━━━━━━━━━━━━━━━╯",
  "",
  "🎵 *Query:* " + trunc(_0x5aee42),
  "❌ *Status:* Failed",
  "⚠️ *Reason:* " + _0x149386.message,
  "",
  "╭━━━━━━━━━━━━━━━━━━╮",
  "     🎶 " + _0x48a4b6,
  "╰━━━━━━━━━━━━━━━━━━╯"
].join("\n")
        },
        {
          quoted: _0x38eb72
        }
      );
    }
  }
};
