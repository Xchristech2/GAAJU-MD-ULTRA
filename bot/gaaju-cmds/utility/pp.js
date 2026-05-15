'use strict';

const {
  getBotName
} = require("../../lib/botname");
const {
  getTarget,
  resolveDisplay
} = require("../../lib/groupUtils");
const {
  dlBuffer
} = require("../../lib/keithapi");
module.exports = {
  name: "pp",
  aliases: ["pfp", "profilepic", "avatar", "dp"],
  description: "Get someone's profile picture",
  category: "utility",
  async execute(_0x259a79, _0x3c7f2c, _0x42dda4, _0x5bc7c0, _0x32cd53) {
    const _0x1da3ad = _0x3c7f2c.key.remoteJid;
    const _0x425f7e = getBotName();
    try {
      await _0x259a79.sendMessage(_0x1da3ad, {
        react: {
          text: "📸",
          key: _0x3c7f2c.key
        }
      });
    } catch {}
    let _0x27b80c = getTarget(_0x3c7f2c, _0x42dda4);
    if (!_0x27b80c) {
      _0x27b80c = _0x3c7f2c.key.participant || _0x3c7f2c.key.remoteJid;
    }
    if (!_0x27b80c.includes("@")) {
      _0x27b80c = _0x27b80c.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    }
    const _0x2c6efe = await resolveDisplay(_0x259a79, _0x1da3ad, _0x27b80c).catch(() => null);
    const _0x328495 = _0x2c6efe || _0x27b80c.split("@")[0].split(":")[0];
    try {
      const _0x46ece2 = await _0x259a79.profilePictureUrl(_0x27b80c, "image");
      const _0x1890a5 = await dlBuffer(_0x46ece2);
      await _0x259a79.sendMessage(_0x1da3ad, {
        image: _0x1890a5,
        caption: "╔═|〔  PROFILE PIC 〕\n║\n║ ▸ *User* : " + (_0x328495.startsWith("+") ? _0x328495 : "+" + _0x328495) + "\n║\n╚═|〔 " + _0x425f7e + " 〕"
      }, {
        quoted: _0x3c7f2c
      });
    } catch {
      await _0x259a79.sendMessage(_0x1da3ad, {
        text: "╔═|〔  PROFILE PIC 〕\n║\n║ ▸ *User*   : " + (_0x328495.startsWith("+") ? _0x328495 : "+" + _0x328495) + "\n║ ▸ *Status* : ❌ No profile picture\n║            (hidden or not set)\n║\n╚═|〔 " + _0x425f7e + " 〕"
      }, {
        quoted: _0x3c7f2c
      });
    }
  }
};