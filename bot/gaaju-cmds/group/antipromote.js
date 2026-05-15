'use strict';

const fs = require("fs");
const path = require("path");
const DATA_FILE = path.join(__dirname, "../../data/antipromote.json");
function load() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return {};
  }
}
function save(_0x43f3b3) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(_0x43f3b3, null, 2), "utf-8");
}
try {
  const _boot = load();
  let _dirty = false;
  for (const id of Object.keys(_boot)) {
    if (_boot[id]) {
      _boot[id] = false;
      _dirty = true;
    }
  }
  if (_dirty) {
    save(_boot);
  }
} catch {}
function isEnabled(_0x55eeb3) {
  return !!load()[_0x55eeb3];
}
async function handleGroupUpdate(_0x29689a, _0x37ee0b) {
  const {
    id: _0x307693,
    participants: _0x33285a,
    action: _0x19476b
  } = _0x37ee0b;
  if (_0x19476b !== "promote") {
    return;
  }
  if (!isEnabled(_0x307693)) {
    return;
  }
  for (const _0x27e2ef of _0x33285a) {
    try {
      await _0x29689a.groupParticipantsUpdate(_0x307693, [_0x27e2ef], "demote");
      await _0x29689a.sendMessage(_0x307693, {
        text: "╔═|〔  ANTI-PROMOTE 〕\n║\n║ ▸ 🚫 @" + _0x27e2ef.replace(/[^0-9]/g, "").slice(-6) + " was demoted\n║ ▸ Unauthorized promotion blocked\n║\n╚═╝",
        mentions: [_0x27e2ef]
      });
    } catch {}
  }
}
module.exports = {
  name: "antipromote",
  aliases: ["antiadmin", "antipromo"],
  description: "Toggle auto-demote of unauthorized promotions",
  category: "group",
  handleGroupUpdate: handleGroupUpdate,
  async execute(_0x15fdec, _0x233346, _0x1da497, _0x1e0e33, _0x283208) {
    const _0x57ba1b = _0x233346.key.remoteJid;
    if (!_0x57ba1b.endsWith("@g.us")) {
      return _0x15fdec.sendMessage(_0x57ba1b, {
        text: "╔═|〔  ANTI-PROMOTE 〕\n║\n║ ▸ Group only command\n║\n╚═╝"
      }, {
        quoted: _0x233346
      });
    }
    try {
      await _0x15fdec.sendMessage(_0x57ba1b, {
        react: {
          text: "🛡️",
          key: _0x233346.key
        }
      });
    } catch {}
    const _0x7ef202 = load();
    const _0x39828c = !!_0x7ef202[_0x57ba1b];
    _0x7ef202[_0x57ba1b] = !_0x39828c;
    save(_0x7ef202);
    const _0x1645ea = !_0x39828c ? "✅ ENABLED" : "❌ DISABLED";
    await _0x15fdec.sendMessage(_0x57ba1b, {
      text: "╔═|〔  ANTI-PROMOTE 〕\n║\n║ ▸ Status: *" + _0x1645ea + "*\n║\n║ ▸ " + (!_0x39828c ? "Anyone promoted without\n║   bot/owner consent will be\n║   automatically demoted." : "Anti-promote is now off.") + "\n║\n╚═╝"
    }, {
      quoted: _0x233346
    });
  }
};