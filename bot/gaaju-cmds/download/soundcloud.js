const {
  keithGet,
  dlBuffer,
  convertTo128kbps
} = require("../../lib/keithapi");
const {
  getBotName
} = require("../../lib/botname");
module.exports = {
  name: "sc",
  aliases: ["soundcloud", "scloud"],
  description: "Download SoundCloud audio",
  category: "download",
  async execute(_0x19958c, _0x59ccfc, _0xec6049, _0x1dbf2a, _0x1926c7) {
    const _0x400d03 = _0x59ccfc.key.remoteJid;
    const _0x1b6e6a = getBotName();
    const _0x391fdb = _0xec6049[0];
    if (!_0x391fdb) {
      return _0x19958c.sendMessage(_0x400d03, {
        text: "╔═|〔  SOUNDCLOUD 〕\n║\n║ ▸ *Usage* : " + _0x1dbf2a + "sc <soundcloud_url>\n║\n╚═|〔 " + _0x1b6e6a + " 〕"
      }, {
        quoted: _0x59ccfc
      });
    }
    try {
      const _0x141bde = await keithGet("/download/soundcloud", {
        url: _0x391fdb
      });
      if (!_0x141bde.success) {
        throw new Error(_0x141bde.error || "API failed");
      }
      const _0x474bec = _0x141bde.data || {};
      const _0xbedec5 = _0x474bec.medias || [];
      const _0x45bae2 = _0xbedec5[0]?.url || _0x474bec.download || null;
      if (!_0x45bae2) {
        throw new Error("No download URL returned");
      }
      const _0x4ff553 = _0x474bec.title || "track";
      const _0x530ca0 = _0x474bec.duration || "";
      let _0x11521d = await dlBuffer(_0x45bae2);
      _0x11521d = await convertTo128kbps(_0x11521d);
      const _0x15674c = ["╔═|〔  SOUNDCLOUD 〕", "║", "║ ▸ *Track*   : " + _0x4ff553, _0x530ca0 ? "║ ▸ *Length*  : " + _0x530ca0 : null, "║ ▸ *Quality* : 128kbps", "║ ▸ *Size*    : " + (_0x11521d.length / 1024 / 1024).toFixed(2) + " MB", "║", "╚═|〔 " + _0x1b6e6a + " 〕"].filter(Boolean).join("\n");
      await _0x19958c.sendMessage(_0x400d03, {
        document: _0x11521d,
        mimetype: "audio/mpeg",
        fileName: (_0x4ff553.replace(/[^\w\s-]/g, "").trim() || "track") + ".mp3",
        caption: _0x15674c
      }, {
        quoted: _0x59ccfc
      });
    } catch (_0x47c4c9) {
      await _0x19958c.sendMessage(_0x400d03, {
        text: "╔═|〔  SOUNDCLOUD 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x47c4c9.message + "\n║\n╚═|〔 " + _0x1b6e6a + " 〕"
      }, {
        quoted: _0x59ccfc
      });
    }
  }
};