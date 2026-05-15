const {
  keithTry,
  extractUrl,
  dlBuffer
} = require("../../lib/keithapi");
const {
  getBotName
} = require("../../lib/botname");
module.exports = {
  name: "pin",
  aliases: ["pinterest", "pindl"],
  description: "Download Pinterest image/video",
  category: "download",
  async execute(_0x10935b, _0x406676, _0x2cfcba, _0x4596d9, _0xc1f309) {
    const _0x494b54 = _0x406676.key.remoteJid;
    const _0x25fd22 = getBotName();
    const _0x507326 = _0x2cfcba[0];
    if (!_0x507326) {
      return _0x10935b.sendMessage(_0x494b54, {
        text: "╔═|〔  PINTEREST 〕\n║\n║ ▸ *Usage* : " + _0x4596d9 + "pin <url>\n║\n╚═|〔 " + _0x25fd22 + " 〕"
      }, {
        quoted: _0x406676
      });
    }
    try {
      const _0x59befc = await keithTry(["/download/pinterest", "/download/pindl2", "/download/pindl3"], {
        url: _0x507326
      });
      const _0x43bdb8 = extractUrl(_0x59befc.result);
      if (!_0x43bdb8) {
        throw new Error("No download URL returned");
      }
      const _0x4e9fa7 = await dlBuffer(_0x43bdb8);
      const _0x393005 = _0x43bdb8.includes(".mp4") || _0x43bdb8.includes("video");
      const _0x299fcc = "╔═|〔  PINTEREST 〕\n║\n║ ▸ *Size* : " + (_0x4e9fa7.length / 1024 / 1024).toFixed(2) + " MB\n║\n╚═|〔 " + _0x25fd22 + " 〕";
      if (_0x393005) {
        await _0x10935b.sendMessage(_0x494b54, {
          video: _0x4e9fa7,
          caption: _0x299fcc
        }, {
          quoted: _0x406676
        });
      } else {
        await _0x10935b.sendMessage(_0x494b54, {
          image: _0x4e9fa7,
          caption: _0x299fcc
        }, {
          quoted: _0x406676
        });
      }
    } catch (_0x80144f) {
      await _0x10935b.sendMessage(_0x494b54, {
        text: "╔═|〔  PINTEREST 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x80144f.message + "\n║\n╚═|〔 " + _0x25fd22 + " 〕"
      }, {
        quoted: _0x406676
      });
    }
  }
};