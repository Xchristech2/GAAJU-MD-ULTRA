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
  name: "twitter",
  aliases: ["x", "xdl", "xdown"],
  description: "Download Twitter/X video",
  category: "download",
  async execute(_0x56d461, _0x25d84f, _0x139774, _0x537827, _0x4f34d7) {
    const _0x408b51 = _0x25d84f.key.remoteJid;
    const _0x55752b = getBotName();
    const _0x7a2492 = _0x139774[0];
    if (!_0x7a2492) {
      return _0x56d461.sendMessage(_0x408b51, {
        text: "╔═|〔  TWITTER / X 〕\n║\n║ ▸ *Usage* : " + _0x537827 + "twitter <url>\n║\n╚═|〔 " + _0x55752b + " 〕"
      }, {
        quoted: _0x25d84f
      });
    }
    try {
      let _0x33518a;
      let _0x3db0b7;
      try {
        const _0x3b294f = await casperGet("/api/downloader/x", {
          url: _0x7a2492
        });
        if (!_0x3b294f.success) {
          throw new Error(_0x3b294f.error || "Casper: no result");
        }
        const _0x45ea2a = _0x3b294f.media || [];
        const _0x31cdb3 = _0x45ea2a.find(_0x3dcff4 => _0x3dcff4.downloadUrl && !_0x3dcff4.downloadUrl.endsWith("')"));
        const _0x19b0fa = _0x31cdb3 || _0x45ea2a[0];
        if (!_0x19b0fa?.downloadUrl) {
          throw new Error("Casper: no video URL");
        }
        _0x33518a = _0x19b0fa.downloadUrl.replace(/'\)$/, "");
        _0x3db0b7 = _0x19b0fa.quality || "HD";
      } catch {
        const _0x1c5102 = await keithGet("/download/twitter", {
          url: _0x7a2492
        });
        if (!_0x1c5102.status) {
          throw new Error(_0x1c5102.error || "fallback failed");
        }
        _0x33518a = extractUrl(_0x1c5102.result);
        _0x3db0b7 = "HD";
        if (!_0x33518a || _0x33518a.includes("undefined")) {
          throw new Error("No download URL found");
        }
      }
      const _0x165905 = await dlBuffer(_0x33518a);
      const _0x1af16f = "╔═|〔  TWITTER / X 〕\n║\n║ ▸ *Quality*: " + _0x3db0b7 + "\n║ ▸ *Size*   : " + (_0x165905.length / 1024 / 1024).toFixed(2) + " MB\n║\n╚═|〔 " + _0x55752b + " 〕";
      await _0x56d461.sendMessage(_0x408b51, {
        video: _0x165905,
        caption: _0x1af16f
      }, {
        quoted: _0x25d84f
      });
    } catch (_0x15fca1) {
      await _0x56d461.sendMessage(_0x408b51, {
        text: "╔═|〔  TWITTER / X 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x15fca1.message + "\n║\n╚═|〔 " + _0x55752b + " 〕"
      }, {
        quoted: _0x25d84f
      });
    }
  }
};