'use strict';

const fs = require("fs");
const path = require("path");
const BL_FILE = path.join(__dirname, "../../data/blacklist.json");
function load() {
  try {
    return JSON.parse(fs.readFileSync(BL_FILE, "utf8"));
  } catch {
    return [];
  }
}
function save(_0x161e16) {
  try {
    fs.mkdirSync(path.dirname(BL_FILE), {
      recursive: true
    });
    fs.writeFileSync(BL_FILE, JSON.stringify(_0x161e16, null, 2));
  } catch {}
}
function normalize(_0x33bb1c) {
  return String(_0x33bb1c || "").replace(/[^0-9]/g, "");
}
function isBlacklisted(_0x117b81) {
  const _0x22437c = normalize(_0x117b81);
  if (!_0x22437c) {
    return false;
  }
  return load().some(_0x5bce0a => normalize(_0x5bce0a) === _0x22437c);
}
function resolveNumber(_0x38b6c3, _0x4b5a80) {
  const _0xccae5f = normalize(_0x4b5a80[0] || "");
  if (_0xccae5f) {
    return _0xccae5f;
  }
  const _0x132b2a = _0x38b6c3.message?.extendedTextMessage?.contextInfo;
  const _0x232d9d = (_0x132b2a?.mentionedJid || [])[0];
  if (_0x232d9d) {
    return normalize(_0x232d9d.split("@")[0].split(":")[0]);
  }
  if (_0x132b2a?.participant) {
    return normalize(_0x132b2a.participant.split("@")[0].split(":")[0]);
  }
  return null;
}
module.exports = {
  isBlacklisted: isBlacklisted,
  name: "blacklist",
  aliases: ["bl", "banuser", "blockuser"],
  description: "Blacklist numbers — blocked users cannot use any bot commands",
  category: "owner",
  ownerOnly: true,
  sudoAllowed: true,
  async execute(_0x56ebba, _0x1e3da8, _0x334794, _0x18d740, _0x277b04) {
    const _0x3b24bb = _0x1e3da8.key.remoteJid;
    if (!_0x277b04?.isOwnerUser && !_0x277b04?.isSudoUser) {
      return _0x56ebba.sendMessage(_0x3b24bb, {
        text: "╔═|〔  BLACKLIST 〕\n║\n║ ▸ ❌ Owner/sudo only\n║\n╚═╝"
      }, {
        quoted: _0x1e3da8
      });
    }
    const _0x34efe3 = (_0x334794[0] || "").toLowerCase();
    const _0x2574c5 = load();
    if (!_0x34efe3 || _0x34efe3 === "list") {
      const _0x27c683 = _0x2574c5.length ? _0x2574c5.map((_0x509e97, _0x20f873) => "║   " + (_0x20f873 + 1) + ". +" + _0x509e97).join("\n") : "║   (empty)";
      return _0x56ebba.sendMessage(_0x3b24bb, {
        text: ["╔═|〔  BLACKLIST 〕", "║", "║ ▸ *Blocked* : " + _0x2574c5.length + " number(s)", "║", _0x27c683, "║", "║ ▸ *Usage*:", "║   " + _0x18d740 + "blacklist add <number | @mention | reply>", "║   " + _0x18d740 + "blacklist remove <number>", "║   " + _0x18d740 + "blacklist check <number>", "║   " + _0x18d740 + "blacklist clear", "║", "╚═╝"].join("\n")
      }, {
        quoted: _0x1e3da8
      });
    }
    if (_0x34efe3 === "add") {
      const _0x3163b1 = resolveNumber(_0x1e3da8, _0x334794.slice(1));
      if (!_0x3163b1) {
        return _0x56ebba.sendMessage(_0x3b24bb, {
          text: "╔═|〔  BLACKLIST 〕\n║\n║ ▸ ❌ Provide a number, @mention, or reply to a message\n║\n╚═╝"
        }, {
          quoted: _0x1e3da8
        });
      }
      if (_0x2574c5.some(_0x390ce8 => normalize(_0x390ce8) === _0x3163b1)) {
        return _0x56ebba.sendMessage(_0x3b24bb, {
          text: "╔═|〔  BLACKLIST 〕\n║\n║ ▸ ⚠️ Already blacklisted: +" + _0x3163b1 + "\n║\n╚═╝"
        }, {
          quoted: _0x1e3da8
        });
      }
      _0x2574c5.push(_0x3163b1);
      save(_0x2574c5);
      return _0x56ebba.sendMessage(_0x3b24bb, {
        text: "╔═|〔  BLACKLIST 〕\n║\n║ ▸ 🚫 Blocked : +" + _0x3163b1 + "\n║ ▸ *Total*   : " + _0x2574c5.length + "\n║\n╚═╝"
      }, {
        quoted: _0x1e3da8
      });
    }
    if (_0x34efe3 === "remove" || _0x34efe3 === "del") {
      const _0xa9720a = resolveNumber(_0x1e3da8, _0x334794.slice(1));
      if (!_0xa9720a) {
        return _0x56ebba.sendMessage(_0x3b24bb, {
          text: "╔═|〔  BLACKLIST 〕\n║\n║ ▸ ❌ Provide a number, @mention, or reply\n║\n╚═╝"
        }, {
          quoted: _0x1e3da8
        });
      }
      const _0xd112ca = _0x2574c5.findIndex(_0x2834ab => normalize(_0x2834ab) === _0xa9720a);
      if (_0xd112ca === -1) {
        return _0x56ebba.sendMessage(_0x3b24bb, {
          text: "╔═|〔  BLACKLIST 〕\n║\n║ ▸ ⚠️ Not found: +" + _0xa9720a + "\n║\n╚═╝"
        }, {
          quoted: _0x1e3da8
        });
      }
      _0x2574c5.splice(_0xd112ca, 1);
      save(_0x2574c5);
      return _0x56ebba.sendMessage(_0x3b24bb, {
        text: "╔═|〔  BLACKLIST 〕\n║\n║ ▸ ✅ Unblocked : +" + _0xa9720a + "\n║ ▸ *Total*     : " + _0x2574c5.length + "\n║\n╚═╝"
      }, {
        quoted: _0x1e3da8
      });
    }
    if (_0x34efe3 === "check") {
      const _0x3d4e13 = resolveNumber(_0x1e3da8, _0x334794.slice(1));
      if (!_0x3d4e13) {
        return _0x56ebba.sendMessage(_0x3b24bb, {
          text: "╔═|〔  BLACKLIST 〕\n║\n║ ▸ ❌ Provide a number\n║\n╚═╝"
        }, {
          quoted: _0x1e3da8
        });
      }
      const _0x7eca7 = _0x2574c5.some(_0x5cf068 => normalize(_0x5cf068) === _0x3d4e13);
      return _0x56ebba.sendMessage(_0x3b24bb, {
        text: "╔═|〔  BLACKLIST 〕\n║\n║ ▸ *Number* : +" + _0x3d4e13 + "\n║ ▸ *Status* : " + (_0x7eca7 ? "🚫 Blacklisted" : "✅ Not blacklisted") + "\n║\n╚═╝"
      }, {
        quoted: _0x1e3da8
      });
    }
    if (_0x34efe3 === "clear") {
      save([]);
      return _0x56ebba.sendMessage(_0x3b24bb, {
        text: "╔═|〔  BLACKLIST 〕\n║\n║ ▸ ✅ All " + _0x2574c5.length + " number(s) cleared\n║\n╚═╝"
      }, {
        quoted: _0x1e3da8
      });
    }
    return _0x56ebba.sendMessage(_0x3b24bb, {
      text: ["╔═|〔  BLACKLIST 〕", "║", "║ ▸ Unknown: \"" + _0x34efe3 + "\"", "║", "║ ▸ *Subcommands*:", "║   list | add | remove | check | clear", "║", "╚═╝"].join("\n")
    }, {
      quoted: _0x1e3da8
    });
  }
};