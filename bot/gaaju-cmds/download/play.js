const {
  casperGet,
  keithTry,
  extractUrl,
  dlBuffer,
  convertTo128kbps
} = require("../../lib/keithapi");
const {
  getBotName
} = require("../../lib/botname");
const KEITH_AUDIO = ["/download/ytmp3", "/download/audio", "/download/dlmp3", "/download/mp3", "/download/yta", "/download/yta2", "/download/yta3", "/download/yta4", "/download/yta5"];
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
        text: ["╔═|〔  PLAY MUSIC 〕", "║", "║ ▸ *Usage*   : " + _0x45e1a4 + "play <song name>", "║ ▸ *Example* : " + _0x45e1a4 + "play Alan Walker Faded", "║", "╚═|〔 " + _0x48a4b6 + " 〕"].join("\n")
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
      let _0x3adddc;
      let _0x371f8e;
      let _0x40a55d;
      let _0x5af146;
      let _0x7baa60;
      try {
        const _0x4b7226 = await casperGet("/api/search/youtube", {
          query: _0x5aee42
        });
        if (!_0x4b7226.success || !_0x4b7226.videos?.length) {
          throw new Error("No search results");
        }
        const _0x190671 = _0x4b7226.videos[0];
        const _0x549b73 = await casperGet("/api/downloader/ytmp3", {
          url: _0x190671.url,
          quality: "128"
        });
        if (!_0x549b73.success || !_0x549b73.url) {
          throw new Error(_0x549b73.error || "No audio URL");
        }
        _0x3adddc = await dlBuffer(_0x549b73.url);
        _0x371f8e = _0x190671.title || _0x5aee42;
        _0x40a55d = _0x190671.channel || "";
        _0x5af146 = _0x190671.duration || "";
        _0x7baa60 = _0x549b73.quality || "128kbps";
      } catch (_0x1223e1) {
        const _0x2e07c1 = /youtu\.?be|youtube\.com/.test(_0x5aee42);
        if (!_0x2e07c1) {
          throw _0x1223e1;
        }
        const _0x3a35a1 = await keithTry(KEITH_AUDIO, {
          url: _0x5aee42
        });
        const _0x5ee2e9 = extractUrl(_0x3a35a1.result);
        if (!_0x5ee2e9) {
          throw new Error("No audio URL from fallback");
        }
        _0x3adddc = await dlBuffer(_0x5ee2e9);
        _0x3adddc = await convertTo128kbps(_0x3adddc);
        _0x371f8e = _0x5aee42;
        _0x40a55d = "";
        _0x5af146 = "";
        _0x7baa60 = "128kbps";
      }
      const _0x1f4eb6 = ["╔═|〔  PLAY MUSIC 〕", "║", "║ ▸ *Track*   : " + trunc(_0x371f8e), _0x40a55d ? "║ ▸ *Channel* : " + trunc(_0x40a55d) : null, _0x5af146 ? "║ ▸ *Length*  : " + _0x5af146 : null, "║ ▸ *Quality* : " + _0x7baa60, "║ ▸ *Size*    : " + fmtSize(_0x3adddc.length), "║", "╚═|〔 " + _0x48a4b6 + " 〕"].filter(Boolean).join("\n");
      await _0x257fb7.sendMessage(_0x227982, {
        document: _0x3adddc,
        mimetype: "audio/mpeg",
        fileName: (_0x371f8e.replace(/[^\w\s-]/g, "").trim() || "audio") + ".mp3",
        caption: _0x1f4eb6
      }, {
        quoted: _0x38eb72
      });
    } catch (_0x149386) {
      await _0x257fb7.sendMessage(_0x227982, {
        text: ["╔═|〔  PLAY MUSIC 〕", "║", "║ ▸ *Query*  : " + trunc(_0x5aee42), "║ ▸ *Status* : ❌ Failed", "║ ▸ *Reason* : " + _0x149386.message, "║", "╚═|〔 " + _0x48a4b6 + " 〕"].join("\n")
      }, {
        quoted: _0x38eb72
      });
    }
  }
};