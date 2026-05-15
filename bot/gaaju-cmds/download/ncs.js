const {
  keithGet,
  extractUrl,
  dlBuffer,
  convertTo128kbps
} = require("../../lib/keithapi");
const {
  getBotName
} = require("../../lib/botname");
module.exports = {
  name: "ncs",
  aliases: ["ncsdl", "ncsmusic"],
  description: "Download NCS music by artist/title",
  category: "download",
  async execute(_0x445743, _0x136a4f, _0x442a1a, _0x6303d, _0x147e08) {
    const _0x3f4f49 = _0x136a4f.key.remoteJid;
    const _0x3aa08e = getBotName();
    const _0x1f4004 = _0x442a1a.join(" ").trim();
    if (!_0x1f4004) {
      return _0x445743.sendMessage(_0x3f4f49, {
        text: "╔═|〔  NCS MUSIC 〕\n║\n║ ▸ *Usage*   : " + _0x6303d + "ncs <artist or title>\n║ ▸ *Example* : " + _0x6303d + "ncs alan walker\n║\n╚═|〔 " + _0x3aa08e + " 〕"
      }, {
        quoted: _0x136a4f
      });
    }
    try {
      const _0x462bbe = await keithGet("/download/ncs", {
        q: _0x1f4004
      });
      if (!_0x462bbe.status) {
        throw new Error(_0x462bbe.error || "API failed");
      }
      const _0x2828f0 = extractUrl(_0x462bbe.result);
      if (!_0x2828f0) {
        throw new Error("No download URL returned");
      }
      const _0x47c028 = _0x462bbe.result?.title || _0x1f4004;
      let _0x17b702 = await dlBuffer(_0x2828f0);
      _0x17b702 = await convertTo128kbps(_0x17b702);
      const _0x292000 = "╔═|〔  NCS MUSIC 〕\n║\n║ ▸ *Track*   : " + _0x47c028 + "\n║ ▸ *Quality* : 128kbps\n║ ▸ *Size*    : " + (_0x17b702.length / 1024 / 1024).toFixed(2) + " MB\n║\n╚═|〔 " + _0x3aa08e + " 〕";
      await _0x445743.sendMessage(_0x3f4f49, {
        document: _0x17b702,
        mimetype: "audio/mpeg",
        fileName: _0x47c028 + ".mp3",
        caption: _0x292000
      }, {
        quoted: _0x136a4f
      });
    } catch (_0x4a8c84) {
      await _0x445743.sendMessage(_0x3f4f49, {
        text: "╔═|〔  NCS MUSIC 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x4a8c84.message + "\n║\n╚═|〔 " + _0x3aa08e + " 〕"
      }, {
        quoted: _0x136a4f
      });
    }
  }
};