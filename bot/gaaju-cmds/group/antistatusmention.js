const fs = require("fs");
const path = require("path");
const {
  getBotName
} = require("../../lib/botname");
const {
  resolveDisplayWithName
} = require("../../lib/groupUtils");
const {
  OWNER_NUMBER
} = require("../../config");
const CFG_FILE = path.join(__dirname, "../../data/antistatusmention.json");
const WARN_FILE = path.join(__dirname, "../../data/warnings.json");
function loadCfg() {
  try {
    const _0x20c461 = JSON.parse(fs.readFileSync(CFG_FILE, "utf8"));
    if (typeof _0x20c461.enabled === "boolean" && !_0x20c461["@migrated"]) {
      return {};
    }
    return _0x20c461;
  } catch {
    return {};
  }
}
function saveCfg(_0x4758f9) {
  try {
    fs.writeFileSync(CFG_FILE, JSON.stringify(_0x4758f9, null, 2));
  } catch {}
}
try {
  const _boot = loadCfg();
  let _dirty = false;
  for (const id of Object.keys(_boot)) {
    if (_boot[id]?.enabled) {
      _boot[id].enabled = false;
      _dirty = true;
    }
  }
  if (_dirty) {
    saveCfg(_boot);
  }
} catch {}
function loadWarns() {
  try {
    return JSON.parse(fs.readFileSync(WARN_FILE, "utf8"));
  } catch {
    return {};
  }
}
function saveWarns(_0x4918f0) {
  fs.mkdirSync(path.dirname(WARN_FILE), {
    recursive: true
  });
  fs.writeFileSync(WARN_FILE, JSON.stringify(_0x4918f0, null, 2));
}
function warnKey(_0x2d548d, _0x45beb7) {
  return _0x2d548d + "::" + _0x45beb7.split("@")[0].split(":")[0];
}
async function _deleteMsg(_0xd207e8, _0x5bb094, _0x561874) {
  const _0x133882 = {
    remoteJid: _0x5bb094,
    fromMe: false,
    id: _0x561874.id,
    participant: _0x561874.participant || _0x561874.remoteJid
  };
  await _0xd207e8.sendMessage(_0x5bb094, {
    delete: _0x133882
  });
}
async function _doAction(_0x58955f, _0x11702c, _0x1b122b, _0x2ea22c, _0x222e89, _0xa858f5, _0x55637c) {
  const _0xfd8fc1 = 3;
  let _0xc7110c = false;
  try {
    await _deleteMsg(_0x58955f, _0x1b122b, _0x11702c.key);
    _0xc7110c = true;
  } catch (_0x2ee10a) {
    console.error("[ASM] delete failed: " + _0x2ee10a.message);
  }
  if (_0xa858f5 === "delete") {
    await _0x58955f.sendMessage(_0x1b122b, {
      text: ["╔═|〔  ANTI STATUS MENTION 〕", "║", "║ ▸ *User*   : " + _0x222e89, "║ ▸ *Action* : " + (_0xc7110c ? "🗑️ Message deleted" : "❌ Delete failed (bot not admin?)"), "║ ▸ *Reason* : No status mentions allowed", "║", "╚═╝"].join("\n")
    });
    return;
  }
  if (_0xa858f5 === "warn") {
    const _0x1ce09b = loadWarns();
    const _0x512e57 = warnKey(_0x1b122b, _0x2ea22c);
    _0x1ce09b[_0x512e57] = (_0x1ce09b[_0x512e57] || 0) + 1;
    saveWarns(_0x1ce09b);
    const _0x946e9d = _0x1ce09b[_0x512e57];
    let _0x3f82d6 = "";
    if (_0x946e9d >= _0xfd8fc1) {
      try {
        await _0x58955f.groupParticipantsUpdate(_0x1b122b, [_0x2ea22c], "remove");
        _0x3f82d6 = "\n║ ▸ *Auto*   : 🚫 Kicked (" + _0xfd8fc1 + "/" + _0xfd8fc1 + " warns)";
        _0x1ce09b[_0x512e57] = 0;
        saveWarns(_0x1ce09b);
      } catch {}
    }
    await _0x58955f.sendMessage(_0x1b122b, {
      text: ["╔═|〔  ANTI STATUS MENTION 〕", "║", "║ ▸ *User*   : " + _0x222e89, "║ ▸ *Action* : ⚠️ Warned", "║ ▸ *Warns*  : " + Math.min(_0x946e9d, _0xfd8fc1) + "/" + _0xfd8fc1, "║ ▸ *Reason* : Status mention in group" + _0x3f82d6, "║", "╚═╝"].join("\n")
    });
    return;
  }
  if (_0xa858f5 === "kick") {
    let _0x2a5225 = false;
    try {
      await _0x58955f.groupParticipantsUpdate(_0x1b122b, [_0x2ea22c], "remove");
      _0x2a5225 = true;
    } catch {}
    await _0x58955f.sendMessage(_0x1b122b, {
      text: ["╔═|〔  ANTI STATUS MENTION 〕", "║", "║ ▸ *User*   : " + _0x222e89, "║ ▸ *Action* : " + (_0x2a5225 ? "🚫 Kicked" : "❌ Kick failed (bot not admin?)"), "║ ▸ *Reason* : Status mention in group", "║", "╚═╝"].join("\n")
    });
    return;
  }
}
async function handleStatusMention(_0x521f9f, _0x1f7211) {
  try {
    const _0x391752 = _0x1f7211.key.remoteJid;
    if (!_0x391752?.endsWith("@g.us")) {
      return;
    }
    const _0x23bdba = _0x1f7211.message?.groupStatusMentionMessage;
    if (!_0x23bdba) {
      return;
    }
    const _0x8c4285 = loadCfg();
    const _0x568392 = _0x8c4285[_0x391752];
    if (!_0x568392?.enabled) {
      return;
    }
    const _0xc98c69 = _0x568392.action || "delete";
    const _0x5e82e8 = getBotName();
    const _0x7322a1 = _0x1f7211.key.participant || _0x1f7211.key.remoteJid || "";
    const _0x43c694 = await resolveDisplayWithName(_0x521f9f, _0x391752, _0x7322a1, _0x1f7211.pushName || null).catch(() => "+" + _0x7322a1.split("@")[0].split(":")[0]);
    await _doAction(_0x521f9f, _0x1f7211, _0x391752, _0x7322a1, _0x43c694, _0xc98c69, _0x5e82e8);
  } catch {}
}
module.exports = {
  handleStatusMention: handleStatusMention,
  name: "antistatusmention",
  aliases: ["asm", "statusmention"],
  description: "Auto-delete/warn/kick when someone shares a status mention in the group",
  category: "group",
  async execute(_0x51ee7b, _0x4e804e, _0x243ca5, _0x1a3198, _0x1dceb4) {
    const _0x106eca = _0x4e804e.key.remoteJid;
    const _0x4053ec = getBotName();
    if (!_0x1dceb4?.isOwnerUser && !_0x1dceb4?.isSudoUser && !_0x1dceb4?.isGroupAdmin) {
      return _0x51ee7b.sendMessage(_0x106eca, {
        text: "╔═|〔  ANTI STATUS MENTION 〕\n║\n║ ▸ *Status* : ❌ Admins/Owner only\n║\n╚═╝"
      }, {
        quoted: _0x4e804e
      });
    }
    if (!_0x106eca.endsWith("@g.us")) {
      return _0x51ee7b.sendMessage(_0x106eca, {
        text: "╔═|〔  ANTI STATUS MENTION 〕\n║\n║ ▸ *Status* : ❌ Groups only\n║\n╚═╝"
      }, {
        quoted: _0x4e804e
      });
    }
    const _0x5a6715 = _0x243ca5[0]?.toLowerCase();
    const _0x1fd010 = loadCfg();
    const _0x5e5da6 = _0x1fd010[_0x106eca] || {
      enabled: false,
      action: "delete"
    };
    const _0x5b3453 = _0x50eee8 => _0x50eee8 === "kick" ? "🚫 Kick" : _0x50eee8 === "warn" ? "⚠️ Warn" : "🗑️ Delete";
    if (!_0x5a6715 || _0x5a6715 === "status") {
      return _0x51ee7b.sendMessage(_0x106eca, {
        text: ["╔═|〔  ANTI STATUS MENTION 〕", "║", "║ ▸ *State*  : " + (_0x5e5da6.enabled ? "✅ ON" : "❌ OFF"), "║ ▸ *Action* : " + _0x5b3453(_0x5e5da6.action || "delete"), "║", "║ ▸ *Usage*  :", "║   " + _0x1a3198 + "asm on / off", "║   " + _0x1a3198 + "asm delete", "║   " + _0x1a3198 + "asm warn", "║   " + _0x1a3198 + "asm kick", "║", "╚═╝"].join("\n")
      }, {
        quoted: _0x4e804e
      });
    }
    if (_0x5a6715 === "on" || _0x5a6715 === "off") {
      _0x5e5da6.enabled = _0x5a6715 === "on";
      _0x1fd010[_0x106eca] = _0x5e5da6;
      saveCfg(_0x1fd010);
      return _0x51ee7b.sendMessage(_0x106eca, {
        text: ["╔═|〔  ANTI STATUS MENTION 〕", "║", "║ ▸ *State*  : " + (_0x5e5da6.enabled ? "✅ Enabled" : "❌ Disabled"), "║ ▸ *Action* : " + _0x5b3453(_0x5e5da6.action || "delete"), "║", "╚═╝"].join("\n")
      }, {
        quoted: _0x4e804e
      });
    }
    if (_0x5a6715 === "delete" || _0x5a6715 === "warn" || _0x5a6715 === "kick" || _0x5a6715 === "remove") {
      _0x5e5da6.action = _0x5a6715 === "remove" ? "kick" : _0x5a6715;
      _0x1fd010[_0x106eca] = _0x5e5da6;
      saveCfg(_0x1fd010);
      return _0x51ee7b.sendMessage(_0x106eca, {
        text: ["╔═|〔  ANTI STATUS MENTION 〕", "║", "║ ▸ *State*  : " + (_0x5e5da6.enabled ? "✅ ON" : "❌ OFF"), "║ ▸ *Action* : " + _0x5b3453(_0x5e5da6.action) + " ✅ Set", "║", "╚═╝"].join("\n")
      }, {
        quoted: _0x4e804e
      });
    }
    return;
  }
};