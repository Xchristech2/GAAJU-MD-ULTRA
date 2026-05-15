const {
  casperGet,
  keithTry,
  extractUrl,
  dlBuffer
} = require("../../lib/keithapi");
const {
  getBotName
} = require("../../lib/botname");
module.exports = {
  name: "fb",
  aliases: ["facebook", "fbdl", "fbdown"],
  description: "Download Facebook video (HD/SD)",
  category: "download",
  async execute(_0x2b2cec, _0x1c82a6, _0x5a411f, _0x10b5a0, _0x2e0b29) {
    const _0x30f832 = _0x1c82a6.key.remoteJid;
    const _0x4dfaca = getBotName();
    const _0x4a9a82 = _0x5a411f[0];
    if (!_0x4a9a82) {
      return _0x2b2cec.sendMessage(_0x30f832, {
        text: "╔═|〔  FACEBOOK 〕\n║\n║ ▸ *Usage* : " + _0x10b5a0 + "fb <url>\n║\n╚═|〔 " + _0x4dfaca + " 〕"
      }, {
        quoted: _0x1c82a6
      });
    }
    try {
      let _0x1bb712;
      let _0x490d1c;
      let _0x290dc6;
      try {
        const _0x2d13f1 = await casperGet("/api/downloader/fb", {
          url: _0x4a9a82
        });
        if (!_0x2d13f1.success) {
          throw new Error(_0x2d13f1.error || "Casper: no result");
        }
        _0x1bb712 = _0x2d13f1.primaryDownload || _0x2d13f1.downloads?.[0]?.url;
        _0x490d1c = _0x2d13f1.title || "Facebook Video";
        _0x290dc6 = _0x2d13f1.downloads?.[0]?.quality || "HD";
        if (!_0x1bb712) {
          throw new Error("Casper: no download URL");
        }
      } catch {
        const _0x31c91c = await keithTry(["/download/fbdl", "/download/fbdown"], {
          url: _0x4a9a82
        });
        _0x1bb712 = extractUrl(_0x31c91c.result);
        _0x490d1c = "Facebook Video";
        _0x290dc6 = "HD";
        if (!_0x1bb712) {
          throw new Error("No download URL found");
        }
      }
      const _0xea7b2a = await dlBuffer(_0x1bb712);
      const _0x57c9a4 = (_0xea7b2a.length / 1024 / 1024).toFixed(2);
      const _0x203179 = "╔═|〔  FACEBOOK 〕\n║\n║ ▸ *Title*  : " + _0x490d1c + "\n║ ▸ *Quality*: " + _0x290dc6 + "\n║ ▸ *Size*   : " + _0x57c9a4 + " MB\n║\n╚═|〔 " + _0x4dfaca + " 〕";
      await _0x2b2cec.sendMessage(_0x30f832, {
        video: _0xea7b2a,
        caption: _0x203179
      }, {
        quoted: _0x1c82a6
      });
    } catch (_0x7349b) {
      await _0x2b2cec.sendMessage(_0x30f832, {
        text: "╔═|〔  FACEBOOK 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x7349b.message + "\n║\n╚═|〔 " + _0x4dfaca + " 〕"
      }, {
        quoted: _0x1c82a6
      });
    }
  }
};