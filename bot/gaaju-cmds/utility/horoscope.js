'use strict';

const {
  getBotName
} = require("../../lib/botname");
const SIGNS = {
  aries: "♈",
  taurus: "♉",
  gemini: "♊",
  cancer: "♋",
  leo: "♌",
  virgo: "♍",
  libra: "♎",
  scorpio: "♏",
  sagittarius: "♐",
  capricorn: "♑",
  aquarius: "♒",
  pisces: "♓"
};
const SIGN_ALIASES = {
  cap: "capricorn",
  sag: "sagittarius",
  sage: "sagittarius",
  scorp: "scorpio",
  scorpion: "scorpio",
  aqua: "aquarius",
  gem: "gemini",
  lib: "libra",
  leo: "leo"
};
const DAYS = {
  today: "today",
  yesterday: "yesterday",
  tomorrow: "tomorrow"
};
function resolveSign(_0x11079d) {
  const _0x191a58 = _0x11079d.toLowerCase();
  return SIGN_ALIASES[_0x191a58] || (SIGNS[_0x191a58] !== undefined ? _0x191a58 : null);
}
async function getHoroscope(_0x578acb, _0x4ccc65 = "today") {
  const _0x398e09 = await fetch("https://aztro.sameerkumar.website/?sign=" + _0x578acb + "&day=" + _0x4ccc65, {
    method: "POST",
    signal: AbortSignal.timeout(15000),
    headers: {
      "Content-Type": "application/json"
    }
  });
  if (!_0x398e09.ok) {
    throw new Error("API HTTP " + _0x398e09.status);
  }
  const _0x668ae7 = await _0x398e09.json();
  if (_0x668ae7.status === "error" || !_0x668ae7.description) {
    throw new Error("No horoscope returned");
  }
  return _0x668ae7;
}
module.exports = {
  name: "horoscope",
  aliases: ["horo", "zodiac", "starsign", "dailyhoro", "stars"],
  description: "Get daily horoscope for any zodiac sign",
  category: "utility",
  async execute(_0x2ef02b, _0x221055, _0x258a90, _0x5e151e) {
    const _0x58ed25 = _0x221055.key.remoteJid;
    const _0x64fa73 = getBotName();
    try {
      await _0x2ef02b.sendMessage(_0x58ed25, {
        react: {
          text: "🔮",
          key: _0x221055.key
        }
      });
    } catch {}
    const _0x355c93 = Object.keys(SIGNS).map(_0xffe7b8 => _0xffe7b8[0].toUpperCase() + _0xffe7b8.slice(1)).join(", ");
    const _0x4b6a30 = ["╔═|〔  HOROSCOPE 🔮 〕", "║", "║ ▸ *Usage*   : " + _0x5e151e + "horoscope <sign> [today|tomorrow|yesterday]", "║ ▸ *Example* : " + _0x5e151e + "horoscope scorpio", "║ ▸ *Example* : " + _0x5e151e + "horoscope leo tomorrow", "║", "║ ▸ *Signs* :", "║   " + _0x355c93, "║", "╚═|〔 " + _0x64fa73 + " 〕"].join("\n");
    const _0x57dc1b = _0x258a90[0];
    if (!_0x57dc1b) {
      return _0x2ef02b.sendMessage(_0x58ed25, {
        text: _0x4b6a30
      }, {
        quoted: _0x221055
      });
    }
    const _0x2c6e73 = resolveSign(_0x57dc1b);
    if (!_0x2c6e73) {
      return _0x2ef02b.sendMessage(_0x58ed25, {
        text: "╔═|〔  HOROSCOPE 〕\n║\n║ ▸ *Unknown sign* : " + _0x57dc1b + "\n║ ▸ *Valid signs*  : " + Object.keys(SIGNS).join(", ") + "\n║\n╚═|〔 " + _0x64fa73 + " 〕"
      }, {
        quoted: _0x221055
      });
    }
    const _0x253d7d = (_0x258a90[1] || "today").toLowerCase();
    const _0x53243a = DAYS[_0x253d7d] || "today";
    try {
      const _0x1fbe15 = await getHoroscope(_0x2c6e73, _0x53243a);
      const _0x5ea1bc = _0x2c6e73[0].toUpperCase() + _0x2c6e73.slice(1);
      const _0x51618b = SIGNS[_0x2c6e73];
      const _0x89978d = _0x53243a[0].toUpperCase() + _0x53243a.slice(1);
      const _0x1eb69a = ["╔═|〔  HOROSCOPE 🔮 〕", "║", "║ ▸ *Sign*       : " + _0x51618b + " " + _0x5ea1bc, "║ ▸ *Day*        : " + _0x89978d + " (" + (_0x1fbe15.current_date || "") + ")", "║", "║ 📖 *Reading*:", ..._0x1fbe15.description.split(". ").filter(Boolean).map(_0xf787c7 => "║   " + _0xf787c7.trim() + "."), "║", _0x1fbe15.lucky_number ? "║ ▸ *Lucky No.*  : " + _0x1fbe15.lucky_number : null, _0x1fbe15.lucky_time ? "║ ▸ *Lucky Time* : " + _0x1fbe15.lucky_time : null, _0x1fbe15.color ? "║ ▸ *Color*      : " + _0x1fbe15.color : null, _0x1fbe15.compatibility ? "║ ▸ *Compatible* : " + _0x1fbe15.compatibility : null, _0x1fbe15.mood ? "║ ▸ *Mood*       : " + _0x1fbe15.mood : null, "║", "╚═|〔 " + _0x64fa73 + " 〕"].filter(Boolean).join("\n");
      await _0x2ef02b.sendMessage(_0x58ed25, {
        text: _0x1eb69a
      }, {
        quoted: _0x221055
      });
    } catch (_0x1269ec) {
      await _0x2ef02b.sendMessage(_0x58ed25, {
        text: "╔═|〔  HOROSCOPE 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x1269ec.message + "\n║\n╚═|〔 " + _0x64fa73 + " 〕"
      }, {
        quoted: _0x221055
      });
    }
  }
};