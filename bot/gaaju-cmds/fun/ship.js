'use strict';

const {
  getBotName
} = require("../../lib/botname");
function shipScore(_0x394433, _0xf21e5a) {
  const _0x5530c9 = (_0x394433 + _0xf21e5a).toLowerCase().replace(/\s/g, "");
  let _0x35dc21 = 0;
  for (const _0x4db25c of _0x5530c9) {
    _0x35dc21 = _0x35dc21 * 31 + _0x4db25c.charCodeAt(0) & -1;
  }
  return Math.abs(_0x35dc21) % 101;
}
function shipBar(_0x404b40) {
  const _0x370d41 = Math.round(_0x404b40 / 10);
  return "❤️".repeat(_0x370d41) + "🖤".repeat(10 - _0x370d41);
}
function shipLabel(_0x51ae68) {
  if (_0x51ae68 >= 95) {
    return "💍 SOULMATES — get married already!";
  }
  if (_0x51ae68 >= 85) {
    return "🔥 FIRE COUPLE — unstoppable!";
  }
  if (_0x51ae68 >= 70) {
    return "💕 Great match — sparks are flying!";
  }
  if (_0x51ae68 >= 55) {
    return "😊 Decent chemistry — keep trying!";
  }
  if (_0x51ae68 >= 40) {
    return "🤔 It's complicated...";
  }
  if (_0x51ae68 >= 25) {
    return "😬 Risky territory — proceed with caution!";
  }
  if (_0x51ae68 >= 10) {
    return "💔 Not looking good...";
  }
  return "😂 YIKES — just be friends!";
}
const COMPLIMENTS = ["You two would make beautiful babies 👶", "The stars align for you both ⭐", "Even the bot ships it 🤖❤️", "Would be the cutest couple in the group 😍", "Netflix and chill incoming 📺", "The chemistry is undeniable 🧪"];
const ROASTS = ["Even the WiFi disconnects when you two meet 📶", "This ship has already sunk 🚢💀", "Chalk and cheese 🧀", "Oil and water don't mix 💧🛢️", "Please don't 😭"];
function pick(_0x690631) {
  return _0x690631[Math.floor(Math.random() * _0x690631.length)];
}
module.exports = {
  name: "ship",
  aliases: ["lovemeter", "compatibility", "lovetest", "matchmaker", "crush"],
  description: "Check compatibility between two people — .ship <name1> + <name2>",
  category: "fun",
  async execute(_0x1d698f, _0x21decd, _0x3fd0d2, _0x201cc0) {
    const _0x2347ce = _0x21decd.key.remoteJid;
    const _0x1cb9c1 = getBotName();
    const _0x1b7668 = _0x3fd0d2.join(" ");
    const _0x1f33c7 = _0x1b7668.includes("+") ? "+" : _0x1b7668.includes(" and ") ? " and " : _0x1b7668.includes("&") ? "&" : null;
    let _0x3ec8c2;
    let _0x401b47;
    if (_0x1f33c7) {
      const _0x3f22f9 = _0x1b7668.split(_0x1f33c7).map(_0x1b2d35 => _0x1b2d35.trim()).filter(Boolean);
      _0x3ec8c2 = _0x3f22f9[0];
      _0x401b47 = _0x3f22f9[1];
    } else if (_0x3fd0d2.length >= 2) {
      _0x3ec8c2 = _0x3fd0d2[0];
      _0x401b47 = _0x3fd0d2.slice(1).join(" ");
    }
    if (!_0x3ec8c2 || !_0x401b47) {
      return _0x1d698f.sendMessage(_0x2347ce, {
        text: ["╔═|〔  SHIP ❤️ 〕", "║", "║ ▸ *Usage* : " + _0x201cc0 + "ship <name1> + <name2>", "║ ▸ *Example* : " + _0x201cc0 + "ship Toosii + Amara", "║ ▸ *Example* : " + _0x201cc0 + "ship John and Jane", "║", "╚═|〔 " + _0x1cb9c1 + " 〕"].join("\n")
      }, {
        quoted: _0x21decd
      });
    }
    const _0x2a0fba = shipScore(_0x3ec8c2, _0x401b47);
    const _0x58fa43 = shipBar(_0x2a0fba);
    const _0x4728b0 = shipLabel(_0x2a0fba);
    const _0x2fc78f = _0x2a0fba >= 50 ? pick(COMPLIMENTS) : pick(ROASTS);
    const _0x4e0388 = _0x3ec8c2.slice(0, Math.ceil(_0x3ec8c2.length / 2));
    const _0x221b61 = _0x401b47.slice(Math.floor(_0x401b47.length / 2));
    const _0x289623 = _0x4e0388 + _0x221b61;
    await _0x1d698f.sendMessage(_0x2347ce, {
      text: ["╔═|〔  SHIP ❤️ 〕", "║", "║ ▸ *" + _0x3ec8c2 + "* ❤️ *" + _0x401b47 + "*", "║", "║ ▸ *Ship name* : " + _0x289623, "║ ▸ *Score*     : " + _0x2a0fba + "%", "║", "║ " + _0x58fa43, "║", "║ ▸ " + _0x4728b0, "║ ▸ 💬 " + _0x2fc78f, "║", "╚═|〔 " + _0x1cb9c1 + " 〕"].join("\n")
    }, {
      quoted: _0x21decd
    });
  }
};