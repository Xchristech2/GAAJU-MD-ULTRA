'use strict';

const fs = require("fs");
const path = require("path");
const {
  registerBotDelete
} = require("../../lib/bot-delete-guard");
const CFG_FILE = path.join(__dirname, "../../data/wordfilter.json");
function loadCfg() {
  try {
    return JSON.parse(fs.readFileSync(CFG_FILE, "utf8"));
  } catch {
    return {};
  }
}
function saveCfg(_0x595950) {
  try {
    fs.mkdirSync(path.dirname(CFG_FILE), {
      recursive: true
    });
    fs.writeFileSync(CFG_FILE, JSON.stringify(_0x595950, null, 2));
  } catch {}
}
function defaultG() {
  return {
    enabled: false,
    words: []
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
const _wfReg = new WeakSet();
function setupWordFilterListener(_0x110c8f) {
  if (_wfReg.has(_0x110c8f)) {
    return;
  }
  _wfReg.add(_0x110c8f);
  const _0x3abee3 = Math.floor(Date.now() / 1000);
  _0x110c8f.ev.on("messages.upsert", async ({
    messages: _0x3b7a1f
  }) => {
    for (const _0x23dc9c of _0x3b7a1f) {
      if (!_0x23dc9c.message || _0x23dc9c.key.fromMe) {
        continue;
      }
      const _0x2ef6e8 = Number(_0x23dc9c.messageTimestamp || 0);
      if (_0x2ef6e8 && _0x2ef6e8 < _0x3abee3 - 5) {
        continue;
      }
      const _0xada46b = _0x23dc9c.key.remoteJid;
      if (!_0xada46b?.endsWith("@g.us")) {
        continue;
      }
      const _0x5acf0f = loadCfg()[_0xada46b];
      if (!_0x5acf0f?.enabled || !_0x5acf0f.words?.length) {
        continue;
      }
      const _0x224ea2 = (_0x23dc9c.message?.conversation || _0x23dc9c.message?.extendedTextMessage?.text || _0x23dc9c.message?.imageMessage?.caption || _0x23dc9c.message?.videoMessage?.caption || "").toLowerCase();
      if (!_0x224ea2) {
        continue;
      }
      const _0x2db71a = _0x5acf0f.words.find(_0x37f2cc => _0x224ea2.includes(_0x37f2cc.toLowerCase()));
      if (!_0x2db71a) {
        continue;
      }
      registerBotDelete(_0x23dc9c.key.id);
      try {
        await _0x110c8f.sendMessage(_0xada46b, {
          delete: _0x23dc9c.key
        });
      } catch {}
      await _0x110c8f.sendMessage(_0xada46b, {
        text: "╔═|〔  WORD FILTER 〕\n║\n║ ▸ *Action* : 🗑️ Message deleted\n║ ▸ *Reason* : Banned word detected\n║\n╚═╝"
      });
    }
  });
}
module.exports = {
  setupWordFilterListener: setupWordFilterListener,
  name: "wordfilter",
  aliases: ["wfilter", "badword", "antiword"],
  description: "Auto-delete messages containing banned words (per group)",
  category: "group",
  async execute(_0x1485bb, _0xaad4f1, _0x3362b7, _0x17e2d3, _0x2ccbdb) {
    const _0x9adba7 = _0xaad4f1.key.remoteJid;
    if (!_0x9adba7?.endsWith("@g.us")) {
      return _0x1485bb.sendMessage(_0x9adba7, {
        text: "╔═|〔  WORD FILTER 〕\n║\n║ ▸ Groups only\n║\n╚═╝"
      }, {
        quoted: _0xaad4f1
      });
    }
    if (!_0x2ccbdb?.isOwnerUser && !_0x2ccbdb?.isSudoUser && !_0x2ccbdb?.isGroupAdmin) {
      return _0x1485bb.sendMessage(_0x9adba7, {
        text: "╔═|〔  WORD FILTER 〕\n║\n║ ▸ Admins/Owner only\n║\n╚═╝"
      }, {
        quoted: _0xaad4f1
      });
    }
    const _0x5efabd = loadCfg();
    const _0x2e4534 = Object.assign(defaultG(), _0x5efabd[_0x9adba7] || {});
    const _0x2f4439 = () => {
      _0x5efabd[_0x9adba7] = _0x2e4534;
      saveCfg(_0x5efabd);
    };
    const _0x3167cb = _0x3362b7[0]?.toLowerCase();
    if (!_0x3167cb || _0x3167cb === "status") {
      return _0x1485bb.sendMessage(_0x9adba7, {
        text: ["╔═|〔  WORD FILTER 〕", "║", "║ ▸ *State* : " + (_0x2e4534.enabled ? "✅ ON" : "❌ OFF"), "║ ▸ *Words* : " + (_0x2e4534.words.length ? _0x2e4534.words.join(", ") : "none"), "║", "║ ▸ *Usage*:", "║   " + _0x17e2d3 + "wordfilter on/off", "║   " + _0x17e2d3 + "wordfilter add <word>", "║   " + _0x17e2d3 + "wordfilter remove <word>", "║   " + _0x17e2d3 + "wordfilter list", "║   " + _0x17e2d3 + "wordfilter clear", "║", "╚═╝"].join("\n")
      }, {
        quoted: _0xaad4f1
      });
    }
    if (_0x3167cb === "on") {
      _0x2e4534.enabled = true;
      _0x2f4439();
      return _0x1485bb.sendMessage(_0x9adba7, {
        text: "╔═|〔  WORD FILTER 〕\n║\n║ ▸ *State* : ✅ Enabled\n║\n╚═╝"
      }, {
        quoted: _0xaad4f1
      });
    }
    if (_0x3167cb === "off") {
      _0x2e4534.enabled = false;
      _0x2f4439();
      return _0x1485bb.sendMessage(_0x9adba7, {
        text: "╔═|〔  WORD FILTER 〕\n║\n║ ▸ *State* : ❌ Disabled\n║\n╚═╝"
      }, {
        quoted: _0xaad4f1
      });
    }
    if (_0x3167cb === "list") {
      return _0x1485bb.sendMessage(_0x9adba7, {
        text: "╔═|〔  WORD FILTER 〕\n║\n║ ▸ *Banned words* (" + _0x2e4534.words.length + "):\n" + (_0x2e4534.words.map(_0x489b96 => "║   • " + _0x489b96).join("\n") || "║   none") + "\n║\n╚═╝"
      }, {
        quoted: _0xaad4f1
      });
    }
    if (_0x3167cb === "clear") {
      _0x2e4534.words = [];
      _0x2f4439();
      return _0x1485bb.sendMessage(_0x9adba7, {
        text: "╔═|〔  WORD FILTER 〕\n║\n║ ▸ ✅ All words cleared\n║\n╚═╝"
      }, {
        quoted: _0xaad4f1
      });
    }
    if (_0x3167cb === "add") {
      const _0x1304d2 = _0x3362b7.slice(1).join(" ").toLowerCase().trim();
      if (!_0x1304d2) {
        return _0x1485bb.sendMessage(_0x9adba7, {
          text: "╔═|〔  WORD FILTER 〕\n║\n║ ▸ Usage: " + _0x17e2d3 + "wordfilter add <word>\n║\n╚═╝"
        }, {
          quoted: _0xaad4f1
        });
      }
      if (_0x2e4534.words.includes(_0x1304d2)) {
        return _0x1485bb.sendMessage(_0x9adba7, {
          text: "╔═|〔  WORD FILTER 〕\n║\n║ ▸ ⚠️ Already in list\n║\n╚═╝"
        }, {
          quoted: _0xaad4f1
        });
      }
      _0x2e4534.words.push(_0x1304d2);
      _0x2f4439();
      return _0x1485bb.sendMessage(_0x9adba7, {
        text: "╔═|〔  WORD FILTER 〕\n║\n║ ▸ ✅ Added: \"" + _0x1304d2 + "\"\n║ ▸ *Total* : " + _0x2e4534.words.length + "\n║\n╚═╝"
      }, {
        quoted: _0xaad4f1
      });
    }
    if (_0x3167cb === "remove" || _0x3167cb === "del") {
      const _0x2b82d0 = _0x3362b7.slice(1).join(" ").toLowerCase().trim();
      const _0x16229c = _0x2e4534.words.indexOf(_0x2b82d0);
      if (_0x16229c === -1) {
        return _0x1485bb.sendMessage(_0x9adba7, {
          text: "╔═|〔  WORD FILTER 〕\n║\n║ ▸ ⚠️ Not in list\n║\n╚═╝"
        }, {
          quoted: _0xaad4f1
        });
      }
      _0x2e4534.words.splice(_0x16229c, 1);
      _0x2f4439();
      return _0x1485bb.sendMessage(_0x9adba7, {
        text: "╔═|〔  WORD FILTER 〕\n║\n║ ▸ ✅ Removed: \"" + _0x2b82d0 + "\"\n║\n╚═╝"
      }, {
        quoted: _0xaad4f1
      });
    }
  }
};