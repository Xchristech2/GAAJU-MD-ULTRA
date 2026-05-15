'use strict';

const {
  getTarget,
  resolveDisplay,
  checkPrivilege
} = require("../../lib/groupUtils");
const {
  getBotName
} = require("../../lib/botname");
const fs = require("fs");
const path = require("path");
const WARN_FILE = path.join(__dirname, "../../data/warnings.json");
const MAX_WARNS = 3;
function loadWarns() {
  try {
    return JSON.parse(fs.readFileSync(WARN_FILE, "utf8"));
  } catch {
    return {};
  }
}
function saveWarns(_0x366033) {
  fs.mkdirSync(path.dirname(WARN_FILE), {
    recursive: true
  });
  fs.writeFileSync(WARN_FILE, JSON.stringify(_0x366033, null, 2));
}
function getKey(_0x3e5ab5, _0x5b5bf5) {
  return _0x3e5ab5 + "::" + _0x5b5bf5.split("@")[0].split(":")[0];
}
module.exports = [{
  name: "warn",
  aliases: ["warning"],
  description: "Warn a group member — auto-kick at 3 warns (sudo/admin only)",
  category: "group",
  async execute(_0x2b0d71, _0x51a6fa, _0x3163ce, _0x1fd591, _0x56909b) {
    const _0x1adf15 = _0x51a6fa.key.remoteJid;
    const _0x1b4fae = getBotName();
    try {
      await _0x2b0d71.sendMessage(_0x1adf15, {
        react: {
          text: "⚠️",
          key: _0x51a6fa.key
        }
      });
    } catch {}
    if (!_0x1adf15.endsWith("@g.us")) {
      return _0x2b0d71.sendMessage(_0x1adf15, {
        text: "╔═|〔  WARN 〕\n║\n║ ▸ *Status* : ❌ Group only\n║\n╚═|〔 " + _0x1b4fae + " 〕"
      }, {
        quoted: _0x51a6fa
      });
    }
    const {
      ok: _0x12abb1
    } = await checkPrivilege(_0x2b0d71, _0x1adf15, _0x51a6fa, _0x56909b);
    if (!_0x12abb1) {
      return _0x2b0d71.sendMessage(_0x1adf15, {
        text: "╔═|〔  WARN 〕\n║\n║ ▸ *Status* : ❌ Permission denied\n║ ▸ *Reason* : Sudo users and group admins only\n║\n╚═|〔 " + _0x1b4fae + " 〕"
      }, {
        quoted: _0x51a6fa
      });
    }
    const _0x47987d = getTarget(_0x51a6fa, _0x3163ce);
    if (!_0x47987d) {
      return _0x2b0d71.sendMessage(_0x1adf15, {
        text: "╔═|〔  WARN 〕\n║\n║ ▸ *Usage* : " + _0x1fd591 + "warn @user [reason]\n║\n╚═|〔 " + _0x1b4fae + " 〕"
      }, {
        quoted: _0x51a6fa
      });
    }
    const _0x5eee8c = _0x3163ce.filter(_0x866a4 => !_0x866a4.startsWith("@")).join(" ").trim() || "No reason given";
    const _0x211d17 = await resolveDisplay(_0x2b0d71, _0x1adf15, _0x47987d);
    const _0x942837 = loadWarns();
    const _0x2db7eb = getKey(_0x1adf15, _0x47987d);
    _0x942837[_0x2db7eb] = (_0x942837[_0x2db7eb] || 0) + 1;
    saveWarns(_0x942837);
    const _0x5b8264 = _0x942837[_0x2db7eb];
    let _0x62d8fe = "";
    if (_0x5b8264 >= MAX_WARNS) {
      try {
        await _0x2b0d71.groupParticipantsUpdate(_0x1adf15, [_0x47987d], "remove");
        _0x62d8fe = "\n║ ▸ *Action*  : 🚫 Auto-kicked (" + MAX_WARNS + " warns)";
        _0x942837[_0x2db7eb] = 0;
        saveWarns(_0x942837);
      } catch {}
    }
    await _0x2b0d71.sendMessage(_0x1adf15, {
      text: "╔═|〔  WARN 〕\n║\n║ ▸ *User*   : " + _0x211d17 + "\n║ ▸ *Reason* : " + _0x5eee8c + "\n║ ▸ *Warns*  : " + Math.min(_0x5b8264, MAX_WARNS) + "/" + MAX_WARNS + _0x62d8fe + "\n║\n╚═|〔 " + _0x1b4fae + " 〕"
    }, {
      quoted: _0x51a6fa
    });
  }
}, {
  name: "warns",
  aliases: ["warnlist", "checkwarn"],
  description: "Check how many warnings a user has",
  category: "group",
  async execute(_0x151c51, _0x8c3f61, _0x1858a5, _0x28816d, _0x3a4142) {
    const _0x4b37a7 = _0x8c3f61.key.remoteJid;
    const _0x1f023a = getBotName();
    try {
      await _0x151c51.sendMessage(_0x4b37a7, {
        react: {
          text: "📋",
          key: _0x8c3f61.key
        }
      });
    } catch {}
    if (!_0x4b37a7.endsWith("@g.us")) {
      return _0x151c51.sendMessage(_0x4b37a7, {
        text: "╔═|〔  WARNS 〕\n║\n║ ▸ *Status* : ❌ Group only\n║\n╚═|〔 " + _0x1f023a + " 〕"
      }, {
        quoted: _0x8c3f61
      });
    }
    const _0x48732a = getTarget(_0x8c3f61, _0x1858a5);
    if (!_0x48732a) {
      return _0x151c51.sendMessage(_0x4b37a7, {
        text: "╔═|〔  WARNS 〕\n║\n║ ▸ *Usage* : " + _0x28816d + "warns @user or reply a message\n║\n╚═|〔 " + _0x1f023a + " 〕"
      }, {
        quoted: _0x8c3f61
      });
    }
    const _0x214ede = await resolveDisplay(_0x151c51, _0x4b37a7, _0x48732a);
    const _0x2aa9d6 = loadWarns();
    const _0x3b9c7e = _0x2aa9d6[getKey(_0x4b37a7, _0x48732a)] || 0;
    await _0x151c51.sendMessage(_0x4b37a7, {
      text: "╔═|〔  WARNS 〕\n║\n║ ▸ *User*  : " + _0x214ede + "\n║ ▸ *Warns* : " + _0x3b9c7e + "/" + MAX_WARNS + "\n║\n╚═|〔 " + _0x1f023a + " 〕"
    }, {
      quoted: _0x8c3f61
    });
  }
}, {
  name: "resetwarn",
  aliases: ["clearwarn", "unwarn"],
  description: "Reset warnings for a user (sudo/admin only)",
  category: "group",
  async execute(_0x54ec08, _0x4f31af, _0x196d11, _0x2f7d4b, _0x35f92b) {
    const _0x4b76c5 = _0x4f31af.key.remoteJid;
    const _0x4fabae = getBotName();
    try {
      await _0x54ec08.sendMessage(_0x4b76c5, {
        react: {
          text: "🔄",
          key: _0x4f31af.key
        }
      });
    } catch {}
    if (!_0x4b76c5.endsWith("@g.us")) {
      return _0x54ec08.sendMessage(_0x4b76c5, {
        text: "╔═|〔  RESET WARN 〕\n║\n║ ▸ *Status* : ❌ Group only\n║\n╚═|〔 " + _0x4fabae + " 〕"
      }, {
        quoted: _0x4f31af
      });
    }
    const {
      ok: _0x11f0b2
    } = await checkPrivilege(_0x54ec08, _0x4b76c5, _0x4f31af, _0x35f92b);
    if (!_0x11f0b2) {
      return _0x54ec08.sendMessage(_0x4b76c5, {
        text: "╔═|〔  RESET WARN 〕\n║\n║ ▸ *Status* : ❌ Permission denied\n║ ▸ *Reason* : Sudo users and group admins only\n║\n╚═|〔 " + _0x4fabae + " 〕"
      }, {
        quoted: _0x4f31af
      });
    }
    const _0x282419 = getTarget(_0x4f31af, _0x196d11);
    if (!_0x282419) {
      return _0x54ec08.sendMessage(_0x4b76c5, {
        text: "╔═|〔  RESET WARN 〕\n║\n║ ▸ *Usage* : " + _0x2f7d4b + "resetwarn @user or reply a message\n║\n╚═|〔 " + _0x4fabae + " 〕"
      }, {
        quoted: _0x4f31af
      });
    }
    const _0x252b95 = await resolveDisplay(_0x54ec08, _0x4b76c5, _0x282419);
    const _0x406e7e = loadWarns();
    _0x406e7e[getKey(_0x4b76c5, _0x282419)] = 0;
    saveWarns(_0x406e7e);
    await _0x54ec08.sendMessage(_0x4b76c5, {
      text: "╔═|〔  RESET WARN 〕\n║\n║ ▸ *User*   : " + _0x252b95 + "\n║ ▸ *Status* : ✅ Warnings cleared\n║\n╚═|〔 " + _0x4fabae + " 〕"
    }, {
      quoted: _0x4f31af
    });
  }
}];