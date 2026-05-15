'use strict';

const _userCount = new Map();
const MAX = 10;
function parseTime(_0x2ac6cf) {
  const _0x1bdae2 = _0x2ac6cf.match(/^(\d+)(s|m|h|d)$/i);
  if (!_0x1bdae2) {
    return null;
  }
  const _0x5d3a2c = parseInt(_0x1bdae2[1]);
  const _0x8ae65a = _0x1bdae2[2].toLowerCase();
  if (_0x5d3a2c < 1) {
    return null;
  }
  if (_0x8ae65a === "s" && _0x5d3a2c < 5) {
    return null;
  }
  if (_0x8ae65a === "d" && _0x5d3a2c > 7) {
    return null;
  }
  return _0x5d3a2c * {
    s: 1000,
    m: 60000,
    h: 3600000,
    d: 86400000
  }[_0x8ae65a];
}
module.exports = {
  name: "remind",
  aliases: ["reminder", "remindme"],
  description: "Set a personal reminder — bot DMs you after the given time",
  category: "utility",
  async execute(_0x806e37, _0x549a89, _0x28eeba, _0x5e7be8, _0x5eb0a4) {
    const _0x55b5fd = _0x549a89.key.remoteJid;
    const _0x529b26 = _0x549a89.key.participant || _0x549a89.key.remoteJid;
    const _0xbb3dc0 = _0x529b26.split("@")[0].split(":")[0] + "@s.whatsapp.net";
    if (!_0x28eeba[0]) {
      return _0x806e37.sendMessage(_0x55b5fd, {
        text: ["╔═|〔  REMIND 〕", "║", "║ ▸ *Usage* : " + _0x5e7be8 + "remind <time> <message>", "║", "║ ▸ *Examples*:", "║   " + _0x5e7be8 + "remind 30m call mom", "║   " + _0x5e7be8 + "remind 2h submit report", "║   " + _0x5e7be8 + "remind 1d water plants", "║", "║ ▸ *Units* : s (≥5s)  m  h  d (≤7d)", "║", "╚═╝"].join("\n")
      }, {
        quoted: _0x549a89
      });
    }
    const _0x3293aa = parseTime(_0x28eeba[0]);
    if (!_0x3293aa) {
      return _0x806e37.sendMessage(_0x55b5fd, {
        text: "╔═|〔  REMIND 〕\n║\n║ ▸ ❌ Invalid time — e.g. 30m, 2h, 1d\n║\n╚═╝"
      }, {
        quoted: _0x549a89
      });
    }
    const _0x4c417e = _0x28eeba.slice(1).join(" ").trim();
    if (!_0x4c417e) {
      return _0x806e37.sendMessage(_0x55b5fd, {
        text: "╔═|〔  REMIND 〕\n║\n║ ▸ ❌ Provide a reminder message\n║\n╚═╝"
      }, {
        quoted: _0x549a89
      });
    }
    const _0x2c331e = _0xbb3dc0.split("@")[0];
    const _0x23946c = _userCount.get(_0x2c331e) || 0;
    if (_0x23946c >= MAX) {
      return _0x806e37.sendMessage(_0x55b5fd, {
        text: "╔═|〔  REMIND 〕\n║\n║ ▸ ⚠️ Max " + MAX + " active reminders\n║\n╚═╝"
      }, {
        quoted: _0x549a89
      });
    }
    _userCount.set(_0x2c331e, _0x23946c + 1);
    await _0x806e37.sendMessage(_0x55b5fd, {
      text: "╔═|〔  REMIND 〕\n║\n║ ▸ ✅ Set\n║ ▸ *In*  : " + _0x28eeba[0] + "\n║ ▸ *Msg* : " + _0x4c417e + "\n║\n╚═╝"
    }, {
      quoted: _0x549a89
    });
    setTimeout(async () => {
      _userCount.set(_0x2c331e, Math.max(0, (_userCount.get(_0x2c331e) || 1) - 1));
      try {
        await _0x806e37.sendMessage(_0xbb3dc0, {
          text: "╔═|〔  ⏰ REMINDER 〕\n║\n║ ▸ " + _0x4c417e + "\n║\n╚═╝"
        });
      } catch {}
    }, _0x3293aa);
  }
};