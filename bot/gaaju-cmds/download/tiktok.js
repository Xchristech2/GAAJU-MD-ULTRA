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
  name: "tiktok",
  aliases: ["tt", "tik", "tok"],
  description: "Download TikTok video (no watermark)",
  category: "download",
  async execute(_0x3ec63e, _0x4fe199, _0x45a6f4, _0x123459, _0x1a355e) {
    const _0x321fe2 = _0x4fe199.key.remoteJid;
    const _0x42ad8a = getBotName();
    const _0x3f224f = _0x45a6f4[0];
    if (!_0x3f224f) {
      return _0x3ec63e.sendMessage(_0x321fe2, {
        text: "╔═|〔  TIKTOK 〕\n║\n║ ▸ *Usage* : " + _0x123459 + "tiktok <url>\n║\n╚═|〔 " + _0x42ad8a + " 〕"
      }, {
        quoted: _0x4fe199
      });
    }
    try {
      let _0xe04d4d;
      let _0x44cc80;
      let _0x354579;
      try {
        const _0x3a40b7 = await casperGet("/api/downloader/tiktok", {
          url: _0x3f224f
        });
        if (!_0x3a40b7.success) {
          throw new Error(_0x3a40b7.error || "Casper: no result");
        }
        _0xe04d4d = _0x3a40b7.download_url || _0x3a40b7.video_hd_url || _0x3a40b7.video_url;
        _0x44cc80 = (_0x3a40b7.title || "TikTok").slice(0, 50);
        _0x354579 = _0x3a40b7.author || "";
        if (!_0xe04d4d) {
          throw new Error("Casper: no video URL");
        }
      } catch {
        const _0x24e804 = await keithGet("/download/tiktokdl3", {
          url: _0x3f224f
        });
        if (!_0x24e804.status) {
          throw new Error(_0x24e804.error || "fallback failed");
        }
        _0xe04d4d = extractUrl(_0x24e804.result);
        _0x44cc80 = "TikTok";
        _0x354579 = "";
        if (!_0xe04d4d) {
          throw new Error("No download URL found");
        }
      }
      const _0x55461e = await dlBuffer(_0xe04d4d);
      const _0xdcce07 = "╔═|〔  TIKTOK 〕\n║\n║ ▸ *Title* : " + _0x44cc80 + "\n║ ▸ *By*    : @" + _0x354579 + "\n║ ▸ *Size*  : " + (_0x55461e.length / 1024 / 1024).toFixed(2) + " MB\n║\n╚═|〔 " + _0x42ad8a + " 〕";
      await _0x3ec63e.sendMessage(_0x321fe2, {
        video: _0x55461e,
        caption: _0xdcce07
      }, {
        quoted: _0x4fe199
      });
    } catch (_0x2298c3) {
      await _0x3ec63e.sendMessage(_0x321fe2, {
        text: "╔═|〔  TIKTOK 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x2298c3.message + "\n║\n╚═|〔 " + _0x42ad8a + " 〕"
      }, {
        quoted: _0x4fe199
      });
    }
  }
};