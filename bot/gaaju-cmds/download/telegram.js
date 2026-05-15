const {
  keithGet,
  extractUrl,
  dlBuffer
} = require("../../lib/keithapi");
const {
  getBotName
} = require("../../lib/botname");
module.exports = {
  name: "tg",
  aliases: ["telegram", "tgdl"],
  description: "Download Telegram channel/group media",
  category: "download",
  async execute(_0x451051, _0x1f1b06, _0x10244b, _0x2913cd, _0x5efe3e) {
    const _0x458666 = _0x1f1b06.key.remoteJid;
    const _0x53e0d8 = getBotName();
    const _0x3ea17a = _0x10244b[0];
    if (!_0x3ea17a) {
      return _0x451051.sendMessage(_0x458666, {
        text: "╔═|〔  TELEGRAM 〕\n║\n║ ▸ *Usage* : " + _0x2913cd + "tg <t.me/channel/post>\n║\n╚═|〔 " + _0x53e0d8 + " 〕"
      }, {
        quoted: _0x1f1b06
      });
    }
    try {
      const _0x2a8748 = await keithGet("/download/telegram", {
        url: _0x3ea17a
      });
      if (!_0x2a8748.status) {
        throw new Error(_0x2a8748.error || "API failed");
      }
      const _0x57ffa9 = extractUrl(_0x2a8748.result);
      if (!_0x57ffa9) {
        throw new Error("No download URL returned");
      }
      const _0x5d993c = await dlBuffer(_0x57ffa9);
      const _0x3093c6 = _0x57ffa9.includes(".mp4") || _0x57ffa9.includes("video");
      const _0x228546 = "╔═|〔  TELEGRAM 〕\n║\n║ ▸ *Size* : " + (_0x5d993c.length / 1024 / 1024).toFixed(2) + " MB\n║\n╚═|〔 " + _0x53e0d8 + " 〕";
      if (_0x3093c6) {
        await _0x451051.sendMessage(_0x458666, {
          video: _0x5d993c,
          caption: _0x228546
        }, {
          quoted: _0x1f1b06
        });
      } else {
        await _0x451051.sendMessage(_0x458666, {
          document: _0x5d993c,
          mimetype: "application/octet-stream",
          fileName: "telegram_media",
          caption: _0x228546
        }, {
          quoted: _0x1f1b06
        });
      }
    } catch (_0x4774ff) {
      await _0x451051.sendMessage(_0x458666, {
        text: "╔═|〔  TELEGRAM 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x4774ff.message + "\n║\n╚═|〔 " + _0x53e0d8 + " 〕"
      }, {
        quoted: _0x1f1b06
      });
    }
  }
};