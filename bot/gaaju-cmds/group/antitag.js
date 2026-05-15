const fs = require("fs");
const path = require("path");
const {
  getBotName
} = require("../../lib/botname");
const {
  isSudoNumber,
  getPhoneFromLid
} = require("../../lib/sudo-store");
const {
  resolveDisplayWithName
} = require("../../lib/groupUtils");
const {
  registerBotDelete
} = require("../../lib/bot-delete-guard");
const CFG_FILE = path.join(__dirname, "../../data/antitag.json");
const WARN_FILE = path.join(__dirname, "../../data/warnings.json");
function bareNum(_0x5a1fb5 = "") {
  return _0x5a1fb5.split("@")[0].split(":")[0];
}
function loadCfg() {
  try {
    return JSON.parse(fs.readFileSync(CFG_FILE, "utf8"));
  } catch {
    return {};
  }
}
function saveCfg(_0x48886a) {
  try {
    fs.mkdirSync(path.dirname(CFG_FILE), {
      recursive: true
    });
    fs.writeFileSync(CFG_FILE, JSON.stringify(_0x48886a, null, 2));
  } catch {}
}
function loadWarns() {
  try {
    return JSON.parse(fs.readFileSync(WARN_FILE, "utf8"));
  } catch {
    return {};
  }
}
function saveWarns(_0x11304e) {
  try {
    fs.mkdirSync(path.dirname(WARN_FILE), {
      recursive: true
    });
    fs.writeFileSync(WARN_FILE, JSON.stringify(_0x11304e, null, 2));
  } catch {}
}
function warnKey(_0x1874d7, _0x105afb) {
  return _0x1874d7 + "::" + bareNum(_0x105afb);
}
function defaultGcfg() {
  return {
    enabled: false,
    action: "warn",
    threshold: 5,
    exemptAdmins: true,
    exemptSudos: true,
    exempt: []
  };
}
const TYPES = ["extendedTextMessage", "imageMessage", "videoMessage", "audioMessage", "documentMessage", "stickerMessage", "buttonsMessage", "templateMessage", "listMessage", "productMessage", "groupMentionedMessage"];
function getContextInfo(_0x182510) {
  const _0x1c0821 = _0x182510.message;
  if (!_0x1c0821) {
    return null;
  }
  for (const _0x9a745d of TYPES) {
    if (_0x1c0821[_0x9a745d]?.contextInfo) {
      return _0x1c0821[_0x9a745d].contextInfo;
    }
  }
  const _0x5d6124 = _0x1c0821.ephemeralMessage?.message || _0x1c0821.viewOnceMessage?.message || _0x1c0821.viewOnceMessageV2?.message?.viewOnceMessage?.message;
  if (_0x5d6124) {
    for (const _0x3f587d of TYPES) {
      if (_0x5d6124[_0x3f587d]?.contextInfo) {
        return _0x5d6124[_0x3f587d].contextInfo;
      }
    }
  }
  return null;
}
function getMentions(_0x13d25d) {
  const _0x39b697 = getContextInfo(_0x13d25d);
  return _0x39b697?.mentionedJid || [];
}
function isGroupTag(_0x58d39c, _0x2aa6b3, _0x2fb3bd) {
  const _0x4fff0d = getContextInfo(_0x58d39c);
  if (!_0x4fff0d) {
    return false;
  }
  const _0x2bca7f = _0x4fff0d.mentionedJid || [];
  const _0x51dc92 = _0x4fff0d.nonJidMentions;
  if (_0x51dc92 && (Array.isArray(_0x51dc92) ? _0x51dc92.length > 0 : _0x51dc92 > 0)) {
    return true;
  }
  if (_0x4fff0d.groupMentions?.length) {
    return true;
  }
  if (_0x2bca7f.includes(_0x2aa6b3)) {
    return true;
  }
  if (_0x2fb3bd > 0 && _0x2bca7f.length >= _0x2fb3bd) {
    return true;
  }
  return false;
}
async function resolvePhone(_0x1b924e, _0x248005) {
  const _0x3a7d62 = bareNum(_0x248005);
  const _0x5c9a15 = _0x248005.endsWith("@lid") || !_0x248005.includes("@") && /^\d{15,}$/.test(_0x3a7d62);
  if (!_0x5c9a15) {
    return _0x3a7d62;
  }
  const _0x1dfbd0 = getPhoneFromLid(_0x3a7d62);
  if (_0x1dfbd0) {
    return String(_0x1dfbd0).replace(/[^0-9]/g, "");
  }
  if (_0x1b924e?.signalRepository?.lidMapping?.getPNForLID) {
    try {
      for (const _0x283055 of [_0x248005, _0x3a7d62 + "@lid", _0x3a7d62 + ":0@lid"]) {
        const _0x21dfa3 = await _0x1b924e.signalRepository.lidMapping.getPNForLID(_0x283055);
        if (_0x21dfa3) {
          const _0x38c5d1 = String(_0x21dfa3).replace(/[^0-9]/g, "");
          if (_0x38c5d1 && _0x38c5d1 !== _0x3a7d62 && _0x38c5d1.length >= 7) {
            return _0x38c5d1;
          }
        }
      }
    } catch {}
  }
  return _0x3a7d62;
}
async function isExempt(_0x4b4900, _0x121790, _0x5b1586, _0x2553a0) {
  const _0xb2525d = bareNum(_0x5b1586);
  const _0x51e2b9 = await resolvePhone(_0x4b4900, _0x5b1586);
  if (_0x2553a0.exemptSudos !== false && (isSudoNumber(_0x51e2b9) || isSudoNumber(_0xb2525d))) {
    return true;
  }
  if ((_0x2553a0.exempt || []).some(_0x515e5f => {
    const _0x187ab3 = bareNum(_0x515e5f);
    return _0x187ab3 === _0x51e2b9 || _0x187ab3 === _0xb2525d;
  })) {
    return true;
  }
  if (_0x2553a0.exemptAdmins !== false) {
    try {
      const _0x4e884d = await _0x4b4900.groupMetadata(_0x121790);
      const _0x30e872 = _0x5b1586.replace(/:[\d]+@/, "@");
      const _0x496371 = _0x5b1586.split("@")[1] || "";
      const _0x3cf0fb = _0x4e884d.participants.find(_0x34a31a => {
        if (_0x34a31a.admin !== "admin" && _0x34a31a.admin !== "superadmin") {
          return false;
        }
        const _0x375eeb = _0x34a31a.id || "";
        const _0x4ce53a = _0x375eeb.replace(/:[\d]+@/, "@");
        const _0x3e5355 = bareNum(_0x375eeb);
        const _0x25da50 = _0x375eeb.split("@")[1] || "";
        return _0x375eeb === _0x5b1586 || _0x4ce53a === _0x30e872 || _0x3e5355 === _0xb2525d && _0xb2525d.length >= 5 && _0x25da50 === _0x496371 || _0x51e2b9 && _0x3e5355 === _0x51e2b9 && _0x51e2b9.length >= 5 && _0x25da50 === "s.whatsapp.net";
      });
      if (_0x3cf0fb) {
        return true;
      }
    } catch {}
  }
  return false;
}
const _ataRegistered = new WeakSet();
function setupAntiTagListener(_0x1ca81f) {
  if (_ataRegistered.has(_0x1ca81f)) {
    return;
  }
  _ataRegistered.add(_0x1ca81f);
  const _0xbd9030 = Math.floor(Date.now() / 1000);
  _0x1ca81f.ev.on("messages.upsert", async ({
    messages: _0x4d014e
  }) => {
    for (const _0x1ba42f of _0x4d014e) {
      if (!_0x1ba42f.message) {
        continue;
      }
      if (_0x1ba42f.key.fromMe) {
        continue;
      }
      const _0x31e18c = Number(_0x1ba42f.messageTimestamp || 0);
      if (_0x31e18c && _0x31e18c < _0xbd9030 - 5) {
        continue;
      }
      const _0x375afd = _0x1ba42f.key.remoteJid;
      if (!_0x375afd?.endsWith("@g.us")) {
        continue;
      }
      const _0x4225e2 = loadCfg();
      const _0x472ce3 = _0x4225e2[_0x375afd];
      if (_0x472ce3?.enabled !== true) {
        continue;
      }
      if (!isGroupTag(_0x1ba42f, _0x375afd, _0x472ce3.threshold ?? 5)) {
        continue;
      }
      const _0x3e27ad = _0x1ba42f.key.participant || _0x1ba42f.key.remoteJid || "";
      const _0x16c771 = await resolvePhone(_0x1ca81f, _0x3e27ad);
      if (await isExempt(_0x1ca81f, _0x375afd, _0x3e27ad, _0x472ce3)) {
        continue;
      }
      if (loadCfg()[_0x375afd]?.enabled !== true) {
        continue;
      }
      const _0xee7732 = _0x472ce3.action || "warn";
      const _0x958b6 = await resolveDisplayWithName(_0x1ca81f, _0x375afd, _0x3e27ad).catch(() => "+" + bareNum(_0x3e27ad));
      const _0x2ab442 = getBotName();
      registerBotDelete(_0x1ba42f.key.id);
      try {
        await _0x1ca81f.sendMessage(_0x375afd, {
          delete: _0x1ba42f.key
        });
      } catch {}
      if (_0xee7732 === "delete") {
        await _0x1ca81f.sendMessage(_0x375afd, {
          text: "╔═|〔  ANTI TAG 〕\n║\n║ ▸ *User*   : " + _0x958b6 + "\n║ ▸ *Action* : 🗑️ Message deleted\n║\n╚═|〔 " + _0x2ab442 + " 〕"
        });
      } else if (_0xee7732 === "warn") {
        const _0x19176a = loadWarns();
        const _0x52d36b = warnKey(_0x375afd, _0x3e27ad);
        _0x19176a[_0x52d36b] = (_0x19176a[_0x52d36b] || 0) + 1;
        const _0xf4021b = _0x19176a[_0x52d36b];
        const _0x3c37dc = 3;
        let _0x29437c = "";
        if (_0xf4021b >= _0x3c37dc) {
          try {
            await _0x1ca81f.groupParticipantsUpdate(_0x375afd, [_0x3e27ad], "remove");
            _0x29437c = "\n║ ▸ *Removed* : ✅ Auto-removed (" + _0x3c37dc + " warns)";
            _0x19176a[_0x52d36b] = 0;
          } catch {}
        }
        saveWarns(_0x19176a);
        await _0x1ca81f.sendMessage(_0x375afd, {
          text: "╔═|〔  ANTI TAG 〕\n║\n║ ▸ *User*   : " + _0x958b6 + "\n║ ▸ *Reason* : Tagging all members\n║ ▸ *Warns*  : " + Math.min(_0xf4021b, _0x3c37dc) + "/" + _0x3c37dc + _0x29437c + "\n║\n╚═|〔 " + _0x2ab442 + " 〕"
        });
      } else if (_0xee7732 === "remove" || _0xee7732 === "kick") {
        try {
          await _0x1ca81f.groupParticipantsUpdate(_0x375afd, [_0x3e27ad], "remove");
          await _0x1ca81f.sendMessage(_0x375afd, {
            text: "╔═|〔  ANTI TAG 〕\n║\n║ ▸ *User*   : " + _0x958b6 + "\n║ ▸ *Action* : 🚫 Removed (tagged all)\n║\n╚═|〔 " + _0x2ab442 + " 〕"
          });
        } catch {
          await _0x1ca81f.sendMessage(_0x375afd, {
            text: "╔═|〔  ANTI TAG 〕\n║\n║ ▸ *User*   : " + _0x958b6 + "\n║ ▸ *Action* : ❌ Remove failed (bot not admin?)\n║\n╚═|〔 " + _0x2ab442 + " 〕"
          });
        }
      }
    }
  });
}
module.exports = {
  setupAntiTagListener: setupAntiTagListener,
  name: "antitag",
  aliases: ["antitagall", "ata", "antitaggroup"],
  description: "Delete/warn/remove when members tag all in a group",
  category: "group",
  async execute(_0x1172be, _0x2fdb58, _0x361502, _0x105626, _0x57c5c3) {
    const _0x284492 = _0x2fdb58.key.remoteJid;
    const _0x89a3d9 = getBotName();
    if (!_0x57c5c3?.isOwnerUser && !_0x57c5c3?.isSudoUser) {
      return _0x1172be.sendMessage(_0x284492, {
        text: "╔═|〔  ANTI TAG 〕\n║\n║ ▸ *Status* : ❌ Owner only\n║\n╚═|〔 " + _0x89a3d9 + " 〕"
      }, {
        quoted: _0x2fdb58
      });
    }
    if (!_0x284492.endsWith("@g.us")) {
      return _0x1172be.sendMessage(_0x284492, {
        text: "╔═|〔  ANTI TAG 〕\n║\n║ ▸ *Status* : ❌ Groups only\n║\n╚═|〔 " + _0x89a3d9 + " 〕"
      }, {
        quoted: _0x2fdb58
      });
    }
    const _0x3e2639 = _0x361502[0]?.toLowerCase();
    const _0x4cf985 = _0x361502[1]?.toLowerCase();
    const _0x5a2c30 = loadCfg();
    const _0x171e2e = Object.assign(defaultGcfg(), _0x5a2c30[_0x284492] || {});
    if (!Array.isArray(_0x171e2e.exempt)) {
      _0x171e2e.exempt = [];
    }
    const _0x3e3772 = () => {
      _0x5a2c30[_0x284492] = _0x171e2e;
      saveCfg(_0x5a2c30);
    };
    const _0x38d6b7 = _0x22f932 => _0x22f932 !== false ? "✅ ON" : "❌ OFF";
    const _0x49ecc9 = {
      delete: "🗑️ Delete",
      warn: "⚠️ Warn",
      remove: "🚫 Remove",
      kick: "🚫 Remove"
    };
    if (!_0x3e2639 || _0x3e2639 === "status") {
      const _0x20ef0d = _0x171e2e.exempt.length ? _0x171e2e.exempt.map(_0x11f2a8 => "║    • +" + bareNum(_0x11f2a8)).join("\n") : "║    • none";
      return _0x1172be.sendMessage(_0x284492, {
        text: ["╔═|〔  ANTI TAG 〕", "║", "║ ▸ *State*         : " + (_0x171e2e.enabled ? "✅ ON" : "❌ OFF"), "║ ▸ *Action*        : " + (_0x49ecc9[_0x171e2e.action] || _0x171e2e.action), "║ ▸ *Threshold*     : " + _0x171e2e.threshold + " mentions", "║ ▸ *Exempt admins* : " + _0x38d6b7(_0x171e2e.exemptAdmins), "║ ▸ *Exempt sudos*  : " + _0x38d6b7(_0x171e2e.exemptSudos), "║ ▸ *Extra exempt*  :", _0x20ef0d, "║", "║ ▸ *Commands* :", "║   " + _0x105626 + "antitag on / off", "║   " + _0x105626 + "antitag delete / warn / remove (kick)", "║   " + _0x105626 + "antitag threshold <number>", "║   " + _0x105626 + "antitag admins on / off", "║   " + _0x105626 + "antitag sudos on / off", "║   " + _0x105626 + "antitag exempt @user", "║   " + _0x105626 + "antitag unexempt @user", "║", "╚═|〔 " + _0x89a3d9 + " 〕"].join("\n")
      }, {
        quoted: _0x2fdb58
      });
    }
    if (_0x3e2639 === "on" || _0x3e2639 === "off") {
      _0x171e2e.enabled = _0x3e2639 === "on";
      _0x3e3772();
      return _0x1172be.sendMessage(_0x284492, {
        text: "╔═|〔  ANTI TAG 〕\n║\n║ ▸ *State* : " + (_0x171e2e.enabled ? "✅ Enabled" : "❌ Disabled") + "\n║\n╚═|〔 " + _0x89a3d9 + " 〕"
      }, {
        quoted: _0x2fdb58
      });
    }
    if (["delete", "warn", "remove", "kick"].includes(_0x3e2639)) {
      _0x171e2e.action = _0x3e2639 === "kick" ? "remove" : _0x3e2639;
      _0x3e3772();
      return _0x1172be.sendMessage(_0x284492, {
        text: "╔═|〔  ANTI TAG 〕\n║\n║ ▸ *Action* : " + _0x49ecc9[_0x3e2639] + "\n║\n╚═|〔 " + _0x89a3d9 + " 〕"
      }, {
        quoted: _0x2fdb58
      });
    }
    if (_0x3e2639 === "threshold") {
      const _0x2d0b27 = parseInt(_0x4cf985);
      if (isNaN(_0x2d0b27) || _0x2d0b27 < 1) {
        return _0x1172be.sendMessage(_0x284492, {
          text: "╔═|〔  ANTI TAG 〕\n║\n║ ▸ *Usage* : " + _0x105626 + "antitag threshold <number>\n║ ▸ *Tip*   : 0 = group-tag only, 5 = tag 5+ members\n║\n╚═|〔 " + _0x89a3d9 + " 〕"
        }, {
          quoted: _0x2fdb58
        });
      }
      _0x171e2e.threshold = _0x2d0b27;
      _0x3e3772();
      return _0x1172be.sendMessage(_0x284492, {
        text: "╔═|〔  ANTI TAG 〕\n║\n║ ▸ *Threshold* : " + _0x2d0b27 + " mentions\n║\n╚═|〔 " + _0x89a3d9 + " 〕"
      }, {
        quoted: _0x2fdb58
      });
    }
    if (_0x3e2639 === "admins") {
      _0x171e2e.exemptAdmins = _0x4cf985 === "on" ? true : _0x4cf985 === "off" ? false : !_0x171e2e.exemptAdmins;
      _0x3e3772();
      return _0x1172be.sendMessage(_0x284492, {
        text: "╔═|〔  ANTI TAG 〕\n║\n║ ▸ *Exempt group admins* : " + _0x38d6b7(_0x171e2e.exemptAdmins) + "\n║\n╚═|〔 " + _0x89a3d9 + " 〕"
      }, {
        quoted: _0x2fdb58
      });
    }
    if (_0x3e2639 === "sudos") {
      _0x171e2e.exemptSudos = _0x4cf985 === "on" ? true : _0x4cf985 === "off" ? false : !_0x171e2e.exemptSudos;
      _0x3e3772();
      return _0x1172be.sendMessage(_0x284492, {
        text: "╔═|〔  ANTI TAG 〕\n║\n║ ▸ *Exempt owner/sudos* : " + _0x38d6b7(_0x171e2e.exemptSudos) + "\n║\n╚═|〔 " + _0x89a3d9 + " 〕"
      }, {
        quoted: _0x2fdb58
      });
    }
    if (_0x3e2639 === "exempt" || _0x3e2639 === "unexempt") {
      const _0x3e2e7a = _0x2fdb58.message?.extendedTextMessage?.contextInfo;
      const _0x140c06 = _0x3e2e7a?.participant || _0x3e2e7a?.mentionedJid?.[0] || null;
      if (!_0x140c06) {
        return _0x1172be.sendMessage(_0x284492, {
          text: "╔═|〔  ANTI TAG 〕\n║\n║ ▸ Reply to or @mention the user\n║\n╚═|〔 " + _0x89a3d9 + " 〕"
        }, {
          quoted: _0x2fdb58
        });
      }
      const _0x35194c = bareNum(_0x140c06);
      if (_0x3e2639 === "exempt") {
        if (!_0x171e2e.exempt.some(_0x3500ee => bareNum(_0x3500ee) === _0x35194c)) {
          _0x171e2e.exempt.push(_0x140c06);
        }
        _0x3e3772();
        return _0x1172be.sendMessage(_0x284492, {
          text: "╔═|〔  ANTI TAG 〕\n║\n║ ▸ *Exempted* : +" + _0x35194c + "\n║\n╚═|〔 " + _0x89a3d9 + " 〕"
        }, {
          quoted: _0x2fdb58
        });
      } else {
        _0x171e2e.exempt = _0x171e2e.exempt.filter(_0x2bf908 => bareNum(_0x2bf908) !== _0x35194c);
        _0x3e3772();
        return _0x1172be.sendMessage(_0x284492, {
          text: "╔═|〔  ANTI TAG 〕\n║\n║ ▸ *Removed* : +" + _0x35194c + "\n║\n╚═|〔 " + _0x89a3d9 + " 〕"
        }, {
          quoted: _0x2fdb58
        });
      }
    }
    if (_0x3e2639) {
      return;
    }
    _0x171e2e.enabled = !_0x171e2e.enabled;
    _0x3e3772();
    return _0x1172be.sendMessage(_0x284492, {
      text: "╔═|〔  ANTI TAG 〕\n║\n║ ▸ *State* : " + (_0x171e2e.enabled ? "✅ Enabled" : "❌ Disabled") + "\n║\n╚═|〔 " + _0x89a3d9 + " 〕"
    }, {
      quoted: _0x2fdb58
    });
  }
};