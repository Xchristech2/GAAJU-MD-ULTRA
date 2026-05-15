'use strict';

const fs = require("fs");
const path = require("path");
const CFG_FILE = path.join(__dirname, "../../data/autoreply.json");
function loadCfg() {
  try {
    return JSON.parse(fs.readFileSync(CFG_FILE, "utf8"));
  } catch {
    return {};
  }
}
function saveCfg(_0x3f3dfe) {
  try {
    fs.mkdirSync(path.dirname(CFG_FILE), {
      recursive: true
    });
    fs.writeFileSync(CFG_FILE, JSON.stringify(_0x3f3dfe, null, 2));
  } catch {}
}
function defaultG() {
  return {
    enabled: false,
    triggers: {}
  };
}
try {
  const _b = loadCfg();
  let _c = false;
  for (const id of Object.keys(_b)) {
    if (_b[id]?.enabled) {
      _b[id].enabled = false;
      _c = true;
    }
  }
  if (_c) {
    saveCfg(_b);
  }
} catch {}
const _arReg = new WeakSet();
function setupAutoReplyListener(_0xa713ce) {
  if (_arReg.has(_0xa713ce)) {
    return;
  }
  _arReg.add(_0xa713ce);
  const _0x314f8e = Math.floor(Date.now() / 1000);
  _0xa713ce.ev.on("messages.upsert", async ({
    messages: _0x45a3b5
  }) => {
    for (const _0x4726cf of _0x45a3b5) {
      if (!_0x4726cf.message || _0x4726cf.key.fromMe) {
        continue;
      }
      const _0x447fe1 = Number(_0x4726cf.messageTimestamp || 0);
      if (_0x447fe1 && _0x447fe1 < _0x314f8e - 5) {
        continue;
      }
      const _0x2a2649 = _0x4726cf.key.remoteJid;
      const _0x31cb5f = loadCfg()[_0x2a2649];
      if (!_0x31cb5f?.enabled || !Object.keys(_0x31cb5f.triggers || {}).length) {
        continue;
      }
      const _0x3d3700 = (_0x4726cf.message?.conversation || _0x4726cf.message?.extendedTextMessage?.text || "").toLowerCase().trim();
      if (!_0x3d3700) {
        continue;
      }
      for (const [_0x155615, _0x5b2c4a] of Object.entries(_0x31cb5f.triggers)) {
        if (_0x3d3700.includes(_0x155615.toLowerCase())) {
          await _0xa713ce.sendMessage(_0x2a2649, {
            text: _0x5b2c4a
          }, {
            quoted: _0x4726cf
          });
          break;
        }
      }
    }
  });
}
module.exports = {
  setupAutoReplyListener: setupAutoReplyListener,
  name: "autoreply",
  aliases: ["ar", "autoresponse"],
  description: "Set keyword-triggered auto-replies per group",
  category: "group",
  async execute(_0x22905d, _0x4b5f5c, _0x1c20c7, _0x4a8f80, _0x24f259) {
    const _0x49ff9c = _0x4b5f5c.key.remoteJid;
    if (!_0x24f259?.isOwnerUser && !_0x24f259?.isSudoUser && !_0x24f259?.isGroupAdmin) {
      return _0x22905d.sendMessage(_0x49ff9c, {
        text: "╔═|〔  AUTO REPLY 〕\n║\n║ ▸ Admins/Owner only\n║\n╚═╝"
      }, {
        quoted: _0x4b5f5c
      });
    }
    const _0x54adc6 = loadCfg();
    const _0x2f9c7b = Object.assign(defaultG(), _0x54adc6[_0x49ff9c] || {});
    const _0x49e746 = () => {
      _0x54adc6[_0x49ff9c] = _0x2f9c7b;
      saveCfg(_0x54adc6);
    };
    const _0xcbdc54 = _0x1c20c7[0]?.toLowerCase();
    if (!_0xcbdc54 || _0xcbdc54 === "status") {
      const _0x5a3467 = Object.keys(_0x2f9c7b.triggers).length;
      return _0x22905d.sendMessage(_0x49ff9c, {
        text: ["╔═|〔  AUTO REPLY 〕", "║", "║ ▸ *State*    : " + (_0x2f9c7b.enabled ? "✅ ON" : "❌ OFF"), "║ ▸ *Triggers* : " + _0x5a3467, "║", "║ ▸ *Usage*:", "║   " + _0x4a8f80 + "autoreply on/off", "║   " + _0x4a8f80 + "autoreply add <keyword> | <reply>", "║   " + _0x4a8f80 + "autoreply remove <keyword>", "║   " + _0x4a8f80 + "autoreply list", "║   " + _0x4a8f80 + "autoreply clear", "║", "╚═╝"].join("\n")
      }, {
        quoted: _0x4b5f5c
      });
    }
    if (_0xcbdc54 === "on") {
      _0x2f9c7b.enabled = true;
      _0x49e746();
      return _0x22905d.sendMessage(_0x49ff9c, {
        text: "╔═|〔  AUTO REPLY 〕\n║\n║ ▸ *State* : ✅ Enabled\n║\n╚═╝"
      }, {
        quoted: _0x4b5f5c
      });
    }
    if (_0xcbdc54 === "off") {
      _0x2f9c7b.enabled = false;
      _0x49e746();
      return _0x22905d.sendMessage(_0x49ff9c, {
        text: "╔═|〔  AUTO REPLY 〕\n║\n║ ▸ *State* : ❌ Disabled\n║\n╚═╝"
      }, {
        quoted: _0x4b5f5c
      });
    }
    if (_0xcbdc54 === "list") {
      const _0x49ff61 = Object.entries(_0x2f9c7b.triggers);
      const _0x570deb = _0x49ff61.length ? _0x49ff61.map(([_0x1f6ddd, _0xf8d169]) => "║   • *" + _0x1f6ddd + "* → " + (_0xf8d169.length > 40 ? _0xf8d169.slice(0, 40) + "…" : _0xf8d169)).join("\n") : "║   none";
      return _0x22905d.sendMessage(_0x49ff9c, {
        text: "╔═|〔  AUTO REPLY 〕\n║\n║ ▸ *Triggers* (" + _0x49ff61.length + "):\n" + _0x570deb + "\n║\n╚═╝"
      }, {
        quoted: _0x4b5f5c
      });
    }
    if (_0xcbdc54 === "clear") {
      _0x2f9c7b.triggers = {};
      _0x49e746();
      return _0x22905d.sendMessage(_0x49ff9c, {
        text: "╔═|〔  AUTO REPLY 〕\n║\n║ ▸ ✅ All triggers cleared\n║\n╚═╝"
      }, {
        quoted: _0x4b5f5c
      });
    }
    if (_0xcbdc54 === "add") {
      const _0x3f24ba = _0x1c20c7.slice(1).join(" ");
      const _0x250051 = _0x3f24ba.split("|");
      if (_0x250051.length < 2) {
        return _0x22905d.sendMessage(_0x49ff9c, {
          text: "╔═|〔  AUTO REPLY 〕\n║\n║ ▸ Usage: " + _0x4a8f80 + "autoreply add <keyword> | <reply>\n║\n╚═╝"
        }, {
          quoted: _0x4b5f5c
        });
      }
      const _0x3827bd = _0x250051[0].trim().toLowerCase();
      const _0x1a377c = _0x250051.slice(1).join("|").trim();
      if (!_0x3827bd || !_0x1a377c) {
        return;
      }
      _0x2f9c7b.triggers[_0x3827bd] = _0x1a377c;
      _0x49e746();
      return _0x22905d.sendMessage(_0x49ff9c, {
        text: "╔═|〔  AUTO REPLY 〕\n║\n║ ▸ ✅ Added\n║ ▸ *Keyword* : " + _0x3827bd + "\n║ ▸ *Reply*   : " + _0x1a377c.slice(0, 40) + "\n║\n╚═╝"
      }, {
        quoted: _0x4b5f5c
      });
    }
    if (_0xcbdc54 === "remove" || _0xcbdc54 === "del") {
      const _0x5b76b9 = _0x1c20c7.slice(1).join(" ").toLowerCase().trim();
      if (!_0x2f9c7b.triggers[_0x5b76b9]) {
        return _0x22905d.sendMessage(_0x49ff9c, {
          text: "╔═|〔  AUTO REPLY 〕\n║\n║ ▸ ⚠️ Not found: \"" + _0x5b76b9 + "\"\n║\n╚═╝"
        }, {
          quoted: _0x4b5f5c
        });
      }
      delete _0x2f9c7b.triggers[_0x5b76b9];
      _0x49e746();
      return _0x22905d.sendMessage(_0x49ff9c, {
        text: "╔═|〔  AUTO REPLY 〕\n║\n║ ▸ ✅ Removed: \"" + _0x5b76b9 + "\"\n║\n╚═╝"
      }, {
        quoted: _0x4b5f5c
      });
    }
  }
};