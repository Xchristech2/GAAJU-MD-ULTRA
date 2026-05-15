'use strict';

const {
  getBotName
} = require("../../lib/botname");
module.exports = {
  name: "qr",
  aliases: ["qrcode", "makeqr", "genqr", "createqr"],
  description: "Generate a QR code from any text or URL — .qr <text>",
  category: "utility",
  async execute(_0x61694e, _0xc45072, _0x118f28, _0x12c4e1) {
    const _0x5d3dbe = _0xc45072.key.remoteJid;
    const _0x570860 = getBotName();
    try {
      await _0x61694e.sendMessage(_0x5d3dbe, {
        react: {
          text: "📷",
          key: _0xc45072.key
        }
      });
    } catch {}
    const _0x221504 = _0xc45072.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const _0x3ebdf4 = _0x221504?.conversation || _0x221504?.extendedTextMessage?.text;
    const _0x3c2d29 = _0x118f28.join(" ").trim() || _0x3ebdf4?.trim();
    if (!_0x3c2d29) {
      return _0x61694e.sendMessage(_0x5d3dbe, {
        text: ["╔═|〔  QR CODE 📷 〕", "║", "║ ▸ *Usage*   : " + _0x12c4e1 + "qr <text or URL>", "║ ▸ *Example* : " + _0x12c4e1 + "qr https://wa.me/254706441840", "║ ▸ *Example* : " + _0x12c4e1 + "qr Hello, scan me!", "║ ▸ *Tip*     : Reply any message with " + _0x12c4e1 + "qr", "║", "╚═|〔 " + _0x570860 + " 〕"].join("\n")
      }, {
        quoted: _0xc45072
      });
    }
    try {
      const _0x1759f2 = "https://api.qrserver.com/v1/create-qr-code/?size=500x500&margin=20&data=" + encodeURIComponent(_0x3c2d29);
      const _0x40fd21 = await fetch(_0x1759f2, {
        signal: AbortSignal.timeout(15000)
      });
      if (!_0x40fd21.ok) {
        throw new Error("QR API HTTP " + _0x40fd21.status);
      }
      const _0x15e0b5 = Buffer.from(await _0x40fd21.arrayBuffer());
      if (!_0x15e0b5.length) {
        throw new Error("Empty QR image returned");
      }
      const _0x50724c = "╔═|〔  QR CODE 📷 〕\n║\n║ ▸ *Data* : " + (_0x3c2d29.length > 60 ? _0x3c2d29.slice(0, 60) + "…" : _0x3c2d29) + "\n║\n╚═|〔 " + _0x570860 + " 〕";
      await _0x61694e.sendMessage(_0x5d3dbe, {
        image: _0x15e0b5,
        caption: _0x50724c
      }, {
        quoted: _0xc45072
      });
    } catch (_0x26f838) {
      await _0x61694e.sendMessage(_0x5d3dbe, {
        text: "╔═|〔  QR CODE 〕\n║\n║ ▸ *Status* : ❌ " + _0x26f838.message + "\n║\n╚═|〔 " + _0x570860 + " 〕"
      }, {
        quoted: _0xc45072
      });
    }
  }
};