const yts = require("yt-search");
const { dlBuffer } = require("../../lib/keithapi");
const axios = require("axios");
const { getBotName } = require("../../lib/botname");

// ===== HARDCODED CONFIGURATION =====
const API_BASE = 'https://api-red-iota-56.vercel.app';
const API_KEY = 'nova_510035';
const TIMEOUT = 120000; // 2 minutes

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
      
      // Send searching message
      const msg = await _0x257fb7.sendMessage(_0x227982, {
        text: `🔍 *Searching for:*\n🎵 ${_0x5aee42}\n\n⏳ *Please wait...*`
      }, { quoted: _0x38eb72 });
      
      // ===== USE NOVA API =====
      const response = await axios.get(`${API_BASE}/music/song3`, {
        params: {
          apikey: API_KEY,
          query: _0x5aee42
        },
        timeout: TIMEOUT
      });

      // Check response
      if (!response.data || !response.data.success) {
        await _0x257fb7.sendMessage(_0x227982, { delete: msg.key });
        throw new Error(response.data?.message || 'Failed to download song');
      }

      const song = response.data.song;
      const download = response.data.download;

      // Delete searching message
      await _0x257fb7.sendMessage(_0x227982, { delete: msg.key });

      // Get thumbnail
      let thumbnailBuffer = null;
      
      // Try base64 thumbnail first
      if (song.thumbnail_base64) {
        try {
          const base64Data = song.thumbnail_base64.split(',')[1];
          if (base64Data) {
            thumbnailBuffer = Buffer.from(base64Data, 'base64');
          }
        } catch (e) {
          thumbnailBuffer = null;
        }
      }

      // If no thumbnail, try URL
      if (!thumbnailBuffer && song.thumbnail) {
        try {
          const imgRes = await axios.get(song.thumbnail, {
            responseType: 'arraybuffer',
            timeout: 15000
          });
          thumbnailBuffer = Buffer.from(imgRes.data);
        } catch (e) {
          thumbnailBuffer = null;
        }
      }

      // Format size
      const sizeMB = (song.size / 1024 / 1024).toFixed(2);
      const sizeLabel = sizeMB > 1 ? `${sizeMB} MB` : `${(song.size / 1024).toFixed(1)} KB`;

      // Convert base64 audio to buffer
      let audioBuffer;
      try {
        audioBuffer = Buffer.from(download.audio, 'base64');
      } catch (e) {
        throw new Error('Failed to decode audio data');
      }

      // Validate audio buffer
      if (!audioBuffer || audioBuffer.length < 10000) {
        throw new Error('Downloaded file is too small');
      }

      // Generate filename
      const filename = song.filename || 
        `${song.title.replace(/[^\w\s-]/g, '').substring(0, 50)}.mp3`;

      // Build caption
      const caption = [
        "╭━━━━━━━━━━━━━━━━━━╮",
        "     💿 *NOW PLAYING*",
        "╰━━━━━━━━━━━━━━━━━━╯",
        "",
        "🎵 *Title:* " + trunc(song.title),
        "🎧 *Quality:* 128kbps",
        "📦 *Size:* " + sizeLabel,
        "⏱ *Duration:* " + (song.duration || 'Unknown'),
        "👤 *Artist:* " + (song.author || 'Unknown'),
        "",
        "⏺️ *Status:* Ready",
        "",
        "╭━━━━━━━━━━━━━━━━━━╮",
        "     🎶 " + _0x48a4b6,
        "╰━━━━━━━━━━━━━━━━━━╯"
      ].join("\n");

      // Send song info with thumbnail if available
      if (thumbnailBuffer && thumbnailBuffer.length > 1000) {
        await _0x257fb7.sendMessage(_0x227982, {
          image: thumbnailBuffer,
          caption: caption
        }, { quoted: _0x38eb72 });
      }

      // Send the audio
      await _0x257fb7.sendMessage(
        _0x227982,
        {
          audio: audioBuffer,
          mimetype: "audio/mpeg",
          ptt: false,
          fileName: filename,
          contextInfo: {
            externalAdReply: {
              showAdAttribution: false,
              renderLargerThumbnail: true,
              mediaType: 1,
              title: trunc(song.title),
              body: "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ",
              thumbnailUrl: song.thumbnail || "",
              sourceUrl: song.url || ""
            }
          }
        },
        {
          quoted: _0x38eb72
        }
      );

      // Send success message
      await _0x257fb7.sendMessage(_0x227982, {
        text: `✅ *Download complete!*\n🎵 ${trunc(song.title)}\n📥 *Downloaded by ${_0x48a4b6}*`
      }, { quoted: _0x38eb72 });
      
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
  "⚠️ *Reason:* " + (_0x149386.message || 'Unknown error'),
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
