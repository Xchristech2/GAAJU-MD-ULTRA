'use strict';

const {
  getBotName
} = require("../../lib/botname");
const CHARS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbol: "!@#$%^&*()-_=+[]{}|;:,.<>?"
};
function genPassword(_0x4ac12b = 16, _0x29ce05 = {}) {
  const _0x4713b2 = [_0x29ce05.lower !== false ? CHARS.lower : "", _0x29ce05.upper !== false ? CHARS.upper : "", _0x29ce05.digits !== false ? CHARS.digits : "", _0x29ce05.symbol ? CHARS.symbol : ""].join("");
  if (!_0x4713b2) {
    throw new Error("No character set selected");
  }
  let _0x15db05 = "";
  for (let _0x2ea953 = 0; _0x2ea953 < _0x4ac12b; _0x2ea953++) {
    _0x15db05 += _0x4713b2[Math.floor(Math.random() * _0x4713b2.length)];
  }
  return _0x15db05;
}
function parseDate(_0x11921e) {
  const _0x2f1907 = _0x11921e.split(/[-/]/);
  if (_0x2f1907.length !== 3) {
    return null;
  }
  let _0xe887b5;
  let _0x13f3a3;
  let _0x24825b;
  if (_0x2f1907[0].length === 4) {
    [_0x24825b, _0x13f3a3, _0xe887b5] = _0x2f1907.map(Number);
  } else {
    [_0xe887b5, _0x13f3a3, _0x24825b] = _0x2f1907.map(Number);
  }
  const _0x5539cc = new Date(_0x24825b, _0x13f3a3 - 1, _0xe887b5);
  if (isNaN(_0x5539cc.getTime())) {
    return null;
  }
  return _0x5539cc;
}
function calcAge(_0x11e9c0) {
  const _0x423331 = new Date();
  let _0x399129 = _0x423331.getFullYear() - _0x11e9c0.getFullYear();
  let _0x1b3f28 = _0x423331.getMonth() - _0x11e9c0.getMonth();
  let _0x1f6edd = _0x423331.getDate() - _0x11e9c0.getDate();
  if (_0x1f6edd < 0) {
    _0x1b3f28--;
    _0x1f6edd += new Date(_0x423331.getFullYear(), _0x423331.getMonth(), 0).getDate();
  }
  if (_0x1b3f28 < 0) {
    _0x399129--;
    _0x1b3f28 += 12;
  }
  const _0x26ef1c = Math.floor((_0x423331 - _0x11e9c0) / 86400000);
  const _0x204c41 = new Date(_0x423331.getFullYear(), _0x11e9c0.getMonth(), _0x11e9c0.getDate());
  if (_0x204c41 < _0x423331) {
    _0x204c41.setFullYear(_0x423331.getFullYear() + 1);
  }
  const _0x348b2f = Math.floor((_0x204c41 - _0x423331) / 86400000);
  return {
    years: _0x399129,
    months: _0x1b3f28,
    days: _0x1f6edd,
    totalDays: _0x26ef1c,
    daysToNext: _0x348b2f
  };
}
function calcCountdown(_0x2a01eb) {
  const _0x4c8483 = new Date();
  const _0x1525c8 = _0x2a01eb - _0x4c8483;
  if (_0x1525c8 < 0) {
    return null;
  }
  const _0x15df08 = Math.floor(_0x1525c8 / 86400000);
  const _0x38ecf9 = Math.floor(_0x1525c8 % 86400000 / 3600000);
  const _0x1a4372 = Math.floor(_0x1525c8 % 3600000 / 60000);
  const _0x45f291 = Math.floor(_0x15df08 / 7);
  const _0x5f5488 = Math.floor(_0x15df08 / 30.44);
  return {
    totalDays: _0x15df08,
    weeks: _0x45f291,
    months: _0x5f5488,
    hours: _0x38ecf9,
    minutes: _0x1a4372
  };
}
module.exports = [{
  name: "password",
  aliases: ["genpass", "generatepassword", "passgen", "makepassword", "strongpass"],
  description: "Generate a strong random password — .password [length] [+sym]",
  category: "utility",
  async execute(_0x2fb916, _0x30076d, _0x37f830, _0x279562) {
    const _0x75d21c = _0x30076d.key.remoteJid;
    const _0xda7b4e = getBotName();
    try {
      await _0x2fb916.sendMessage(_0x75d21c, {
        react: {
          text: "🔑",
          key: _0x30076d.key
        }
      });
    } catch {}
    let _0x2ca2c5 = parseInt(_0x37f830[0]) || 16;
    if (_0x2ca2c5 < 4) {
      _0x2ca2c5 = 4;
    }
    if (_0x2ca2c5 > 128) {
      _0x2ca2c5 = 128;
    }
    const _0x242fa0 = _0x37f830.join(" ").includes("+sym") || _0x37f830.includes("sym") || _0x37f830.includes("symbols");
    try {
      const _0x1ac558 = genPassword(_0x2ca2c5, {
        symbol: _0x242fa0
      });
      const _0x1786c3 = genPassword(_0x2ca2c5, {
        symbol: _0x242fa0
      });
      const _0x821e02 = genPassword(_0x2ca2c5, {
        symbol: _0x242fa0
      });
      const _0x3c67f3 = _0x2ca2c5 >= 20 && _0x242fa0 ? "🔒 Very Strong" : _0x2ca2c5 >= 16 ? "💪 Strong" : _0x2ca2c5 >= 12 ? "👍 Good" : "⚠️ Weak";
      await _0x2fb916.sendMessage(_0x75d21c, {
        text: ["╔═|〔  PASSWORD GENERATOR 🔑 〕", "║", "║ ▸ *Length*   : " + _0x2ca2c5 + " characters", "║ ▸ *Symbols*  : " + (_0x242fa0 ? "✅ Yes" : "❌ No (add +sym to include)"), "║ ▸ *Strength* : " + _0x3c67f3, "║", "║ 🔑 Option 1:", "║ `" + _0x1ac558 + "`", "║", "║ 🔑 Option 2:", "║ `" + _0x1786c3 + "`", "║", "║ 🔑 Option 3:", "║ `" + _0x821e02 + "`", "║", "║ 💡 " + _0x279562 + "password 24 +sym — 24 chars with symbols", "║", "╚═|〔 " + _0xda7b4e + " 〕"].join("\n")
      }, {
        quoted: _0x30076d
      });
    } catch (_0x451168) {
      await _0x2fb916.sendMessage(_0x75d21c, {
        text: "╔═|〔  PASSWORD GEN 〕\n║\n║ ▸ *Status* : ❌ " + _0x451168.message + "\n║\n╚═|〔 " + _0xda7b4e + " 〕"
      }, {
        quoted: _0x30076d
      });
    }
  }
}, {
  name: "coinflip",
  aliases: ["flipcoin", "flip", "headsortails", "toss"],
  description: "Flip a coin — .coinflip",
  category: "utility",
  async execute(_0x3c3969, _0x4e4e34, _0x2db273, _0x4eefab) {
    const _0x4012ab = _0x4e4e34.key.remoteJid;
    const _0xe66c38 = getBotName();
    const _0x37eba1 = (_0x4e4e34.key.participant || _0x4e4e34.key.remoteJid).split("@")[0].split(":")[0];
    const _0x5ca0ac = Math.random() < 0.5 ? "🪙 HEADS" : "🪙 TAILS";
    const _0x258f68 = Math.random() < 0.1 ? "\n║ ▸ 🎯 *Lucky flip!*" : "";
    await _0x3c3969.sendMessage(_0x4012ab, {
      text: ["╔═|〔  COIN FLIP 🪙 〕", "║", "║ ▸ *Flipped by* : @" + _0x37eba1, "║", "║ ▸ *Result*     : *" + _0x5ca0ac + "*" + _0x258f68, "║", "╚═|〔 " + _0xe66c38 + " 〕"].join("\n"),
      mentions: [_0x37eba1 + "@s.whatsapp.net"]
    }, {
      quoted: _0x4e4e34
    });
  }
}, {
  name: "age",
  aliases: ["howold", "birthday", "calcage", "myage", "agecheck"],
  description: "Calculate age from a birthdate — .age DD/MM/YYYY",
  category: "utility",
  async execute(_0x583da5, _0x4d9a05, _0x333fcd, _0x46a997) {
    const _0x3ccb7f = _0x4d9a05.key.remoteJid;
    const _0x1ef97e = getBotName();
    const _0x412480 = _0x333fcd[0]?.trim();
    if (!_0x412480) {
      return _0x583da5.sendMessage(_0x3ccb7f, {
        text: ["╔═|〔  AGE CALCULATOR 🎂 〕", "║", "║ ▸ *Usage*   : " + _0x46a997 + "age DD/MM/YYYY", "║ ▸ *Example* : " + _0x46a997 + "age 15/08/2000", "║ ▸ *Example* : " + _0x46a997 + "age 1990-06-01", "║", "╚═|〔 " + _0x1ef97e + " 〕"].join("\n")
      }, {
        quoted: _0x4d9a05
      });
    }
    const _0x46ed42 = parseDate(_0x412480);
    if (!_0x46ed42 || _0x46ed42 > new Date()) {
      return _0x583da5.sendMessage(_0x3ccb7f, {
        text: "╔═|〔  AGE CALCULATOR 〕\n║\n║ ▸ *Status* : ❌ Invalid date\n║ ▸ *Format* : DD/MM/YYYY or YYYY-MM-DD\n║\n╚═|〔 " + _0x1ef97e + " 〕"
      }, {
        quoted: _0x4d9a05
      });
    }
    const {
      years: _0x25501b,
      months: _0x56658d,
      days: _0xefa492,
      totalDays: _0xcee0c8,
      daysToNext: _0x57b9c9
    } = calcAge(_0x46ed42);
    const _0x2516d4 = getZodiac(_0x46ed42);
    await _0x583da5.sendMessage(_0x3ccb7f, {
      text: ["╔═|〔  AGE CALCULATOR 🎂 〕", "║", "║ ▸ *Birthdate* : " + _0x46ed42.toDateString(), "║", "║ ▸ *Age*       : " + _0x25501b + " years, " + _0x56658d + " months, " + _0xefa492 + " days", "║ ▸ *In days*   : " + _0xcee0c8.toLocaleString() + " days lived", "║ ▸ *Zodiac*    : " + _0x2516d4, "║", "║ ▸ *Next Bday* : in " + _0x57b9c9 + " day" + (_0x57b9c9 !== 1 ? "s" : "") + (_0x57b9c9 === 0 ? " 🎉 TODAY!" : ""), "║", "╚═|〔 " + _0x1ef97e + " 〕"].join("\n")
    }, {
      quoted: _0x4d9a05
    });
  }
}, {
  name: "countdown",
  aliases: ["daysleft", "daysuntil", "countdownto", "timer", "dayscount"],
  description: "Count days until a future date — .countdown DD/MM/YYYY",
  category: "utility",
  async execute(_0x6527e, _0x46517e, _0x183873, _0x409b14) {
    const _0x40c439 = _0x46517e.key.remoteJid;
    const _0x16d35b = getBotName();
    const _0x2fde5c = _0x183873[0]?.trim();
    if (!_0x2fde5c) {
      return _0x6527e.sendMessage(_0x40c439, {
        text: ["╔═|〔  COUNTDOWN ⏳ 〕", "║", "║ ▸ *Usage*   : " + _0x409b14 + "countdown DD/MM/YYYY", "║ ▸ *Example* : " + _0x409b14 + "countdown 25/12/2026", "║ ▸ *Example* : " + _0x409b14 + "countdown 2026-01-01", "║", "╚═|〔 " + _0x16d35b + " 〕"].join("\n")
      }, {
        quoted: _0x46517e
      });
    }
    const _0x475cf0 = parseDate(_0x2fde5c);
    if (!_0x475cf0) {
      return _0x6527e.sendMessage(_0x40c439, {
        text: "╔═|〔  COUNTDOWN 〕\n║\n║ ▸ *Status* : ❌ Invalid date\n║ ▸ *Format* : DD/MM/YYYY or YYYY-MM-DD\n║\n╚═|〔 " + _0x16d35b + " 〕"
      }, {
        quoted: _0x46517e
      });
    }
    const _0x45d572 = calcCountdown(_0x475cf0);
    if (!_0x45d572) {
      return _0x6527e.sendMessage(_0x40c439, {
        text: "╔═|〔  COUNTDOWN 〕\n║\n║ ▸ *Status* : ❌ That date has already passed!\n║\n╚═|〔 " + _0x16d35b + " 〕"
      }, {
        quoted: _0x46517e
      });
    }
    await _0x6527e.sendMessage(_0x40c439, {
      text: ["╔═|〔  COUNTDOWN ⏳ 〕", "║", "║ ▸ *Target Date* : " + _0x475cf0.toDateString(), "║", "║ ▸ *Days left*   : " + _0x45d572.totalDays.toLocaleString() + " days", "║ ▸ *Weeks*       : ~" + _0x45d572.weeks + " weeks", "║ ▸ *Months*      : ~" + _0x45d572.months + " months", "║ ▸ *Hours*       : +" + _0x45d572.hours + "h " + _0x45d572.minutes + "m today", "║", _0x45d572.totalDays === 0 ? "║ 🎉 *TODAY IS THE DAY!*" : null, _0x45d572.totalDays <= 7 ? "║ 🔥 Less than a week away!" : null, "║", "╚═|〔 " + _0x16d35b + " 〕"].filter(Boolean).join("\n")
    }, {
      quoted: _0x46517e
    });
  }
}];
function getZodiac(_0x397c3a) {
  const _0x858624 = _0x397c3a.getMonth() + 1;
  const _0x545ed3 = _0x397c3a.getDate();
  if (_0x858624 === 3 && _0x545ed3 >= 21 || _0x858624 === 4 && _0x545ed3 <= 19) {
    return "♈ Aries";
  }
  if (_0x858624 === 4 && _0x545ed3 >= 20 || _0x858624 === 5 && _0x545ed3 <= 20) {
    return "♉ Taurus";
  }
  if (_0x858624 === 5 && _0x545ed3 >= 21 || _0x858624 === 6 && _0x545ed3 <= 20) {
    return "♊ Gemini";
  }
  if (_0x858624 === 6 && _0x545ed3 >= 21 || _0x858624 === 7 && _0x545ed3 <= 22) {
    return "♋ Cancer";
  }
  if (_0x858624 === 7 && _0x545ed3 >= 23 || _0x858624 === 8 && _0x545ed3 <= 22) {
    return "♌ Leo";
  }
  if (_0x858624 === 8 && _0x545ed3 >= 23 || _0x858624 === 9 && _0x545ed3 <= 22) {
    return "♍ Virgo";
  }
  if (_0x858624 === 9 && _0x545ed3 >= 23 || _0x858624 === 10 && _0x545ed3 <= 22) {
    return "♎ Libra";
  }
  if (_0x858624 === 10 && _0x545ed3 >= 23 || _0x858624 === 11 && _0x545ed3 <= 21) {
    return "♏ Scorpio";
  }
  if (_0x858624 === 11 && _0x545ed3 >= 22 || _0x858624 === 12 && _0x545ed3 <= 21) {
    return "♐ Sagittarius";
  }
  if (_0x858624 === 12 && _0x545ed3 >= 22 || _0x858624 === 1 && _0x545ed3 <= 19) {
    return "♑ Capricorn";
  }
  if (_0x858624 === 1 && _0x545ed3 >= 20 || _0x858624 === 2 && _0x545ed3 <= 18) {
    return "♒ Aquarius";
  }
  return "♓ Pisces";
}