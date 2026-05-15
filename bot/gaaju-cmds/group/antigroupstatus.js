const fs = require("fs");
const path = require("path");
const {
  getBotName
} = require("../../lib/botname");
const {
  isSudoNumber
} = require("../../lib/sudo-store");
const CFG_FILE = path.join(__dirname, "../../data/antigroupstatus.json");
let _sock = null;
function loadCfg() {
  try {
    return JSON.parse(fs.readFileSync(CFG_FILE, "utf8"));
  } catch {
    return {};
  }
}
function saveCfg(_0x2b3124) {
  try {
    fs.mkdirSync(path.dirname(CFG_FILE), {
      recursive: true
    });
    fs.writeFileSync(CFG_FILE, JSON.stringify(_0x2b3124, null, 2));
  } catch {}
}
function bareNum(_0x104ec1 = "") {
  return _0x104ec1.split("@")[0].split(":")[0];
}
function defaultGcfg() {
  return {
    enabled: false,
    exemptAdmins: true,
    exemptSudos: true,
    exempt: []
  };
}
async function isExempt(_0x25d34e, _0x5636c6, _0xa0fee9, _0x3c02c2) {
  const _0x3cb91b = bareNum(_0xa0fee9);
  if (_0x3c02c2.exemptSudos !== false && isSudoNumber(_0x3cb91b)) {
    return true;
  }
  const _0xbcf84 = _0x3c02c2.exempt || [];
  if (_0xbcf84.some(_0x4017ac => bareNum(_0x4017ac) === _0x3cb91b)) {
    return true;
  }
  if (_0x3c02c2.exemptAdmins !== false) {
    try {
      const _0x329ba5 = await _0x25d34e.groupMetadata(_0x5636c6);
      const _0x2fc690 = _0xa0fee9.replace(/:[\d]+@/, "@");
      const _0x59ca36 = _0xa0fee9.split("@")[1] || "";
      const _0x56c9b8 = _0x329ba5.participants.some(_0x34ebb7 => {
        if (_0x34ebb7.admin !== "admin" && _0x34ebb7.admin !== "superadmin") {
          return false;
        }
        const _0x549246 = _0x34ebb7.id || "";
        const _0x5a0a45 = _0x549246.replace(/:[\d]+@/, "@");
        const _0x36ac7b = bareNum(_0x549246);
        const _0x471e54 = _0x549246.split("@")[1] || "";
        return _0x549246 === _0xa0fee9 || _0x5a0a45 === _0x2fc690 || _0x36ac7b === _0x3cb91b && _0x3cb91b.length >= 5 && _0x471e54 === _0x59ca36;
      });
      if (_0x56c9b8) {
        return true;
      }
    } catch {}
  }
  return false;
}
const _agsRegistered = new WeakSet();
function setupAntiGroupStatusListener(_0x43f1b9) {
  _sock = _0x43f1b9;
  if (_agsRegistered.has(_0x43f1b9)) {
    return;
  }
  _agsRegistered.add(_0x43f1b9);
  _0x43f1b9.ev.on("messages.upsert", async ({
    messages: _0x56223d
  }) => {
    for (const _0x1b6b8e of _0x56223d) {
      if (!_0x1b6b8e.message?.groupStatusMentionMessage) {
        continue;
      }
      const _0xb2e93e = _0x1b6b8e.key.remoteJid;
      if (!_0xb2e93e?.endsWith("@g.us")) {
        continue;
      }
      const _0x87b21d = loadCfg();
      const _0x3f1b5c = _0x87b21d[_0xb2e93e];
      if (_0x3f1b5c?.enabled !== true) {
        continue;
      }
      const _0x37ebbf = _0x1b6b8e.key.participant || _0x1b6b8e.key.remoteJid || "";
      if (await isExempt(_0x43f1b9, _0xb2e93e, _0x37ebbf, _0x3f1b5c)) {
        continue;
      }
      if (loadCfg()[_0xb2e93e]?.enabled !== true) {
        continue;
      }
      try {
        await _0x43f1b9.sendMessage(_0xb2e93e, {
          delete: _0x1b6b8e.key
        });
      } catch {}
    }
  });
}
module.exports = {
  setupAntiGroupStatusListener: setupAntiGroupStatusListener,
  name: "antigroupstatus",
  aliases: ["ags", "antigroupstatus", "antigrpstatus", "antistatusgroupmention", "asgm"],
  description: "Block group status mentions with per-group exempt control",
  category: "group",
  async execute(_0x2b5660, _0x23371b, _0x4febf7, _0x372c93, _0x2473b1) {
    const _0x41c6a9 = _0x23371b.key.remoteJid;
    const _0x524ed0 = getBotName();
    _sock = _0x2b5660;
    if (!_0x2473b1?.isOwnerUser && !_0x2473b1?.isSudoUser) {
      return _0x2b5660.sendMessage(_0x41c6a9, {
        text: "╔═|〔  ANTI GROUP STATUS 〕\n║\n║ ▸ *Status* : ❌ Owner only\n║\n╚═|〔 " + _0x524ed0 + " 〕"
      }, {
        quoted: _0x23371b
      });
    }
    if (!_0x41c6a9.endsWith("@g.us")) {
      return _0x2b5660.sendMessage(_0x41c6a9, {
        text: "╔═|〔  ANTI GROUP STATUS 〕\n║\n║ ▸ *Status* : ❌ Groups only\n║\n╚═|〔 " + _0x524ed0 + " 〕"
      }, {
        quoted: _0x23371b
      });
    }
    const _0x4a8557 = _0x4febf7[0]?.toLowerCase();
    const _0x447f76 = _0x4febf7[1]?.toLowerCase();
    const _0xa78c3 = loadCfg();
    const _0x40b37b = Object.assign(defaultGcfg(), _0xa78c3[_0x41c6a9] || {});
    if (!Array.isArray(_0x40b37b.exempt)) {
      _0x40b37b.exempt = [];
    }
    const _0x45ec36 = () => {
      _0xa78c3[_0x41c6a9] = _0x40b37b;
      saveCfg(_0xa78c3);
    };
    const _0x3ea59b = _0x1496d8 => _0x1496d8 !== false ? "✅ ON" : "❌ OFF";
    if (!_0x4a8557 || _0x4a8557 === "status") {
      const _0x491482 = _0x40b37b.exempt.length ? _0x40b37b.exempt.map(_0x3cc507 => "║    • +" + bareNum(_0x3cc507)).join("\n") : "║    • none";
      return _0x2b5660.sendMessage(_0x41c6a9, {
        text: ["╔═|〔  ANTI GROUP STATUS 〕", "║", "║ ▸ *State*         : " + (_0x40b37b.enabled ? "✅ ON" : "❌ OFF"), "║ ▸ *Exempt admins* : " + _0x3ea59b(_0x40b37b.exemptAdmins), "║ ▸ *Exempt sudos*  : " + _0x3ea59b(_0x40b37b.exemptSudos), "║ ▸ *Extra exempt*  :", _0x491482, "║", "║ ▸ *Commands* :", "║   " + _0x372c93 + "ags on / off", "║   " + _0x372c93 + "ags admins on / off", "║   " + _0x372c93 + "ags sudos on / off", "║   " + _0x372c93 + "ags exempt @user", "║   " + _0x372c93 + "ags unexempt @user", "║", "╚═|〔 " + _0x524ed0 + " 〕"].join("\n")
      }, {
        quoted: _0x23371b
      });
    }
    if (_0x4a8557 === "on" || _0x4a8557 === "off") {
      _0x40b37b.enabled = _0x4a8557 === "on";
      _0x45ec36();
      return _0x2b5660.sendMessage(_0x41c6a9, {
        text: "╔═|〔  ANTI GROUP STATUS 〕\n║\n║ ▸ *State* : " + (_0x40b37b.enabled ? "✅ Enabled" : "❌ Disabled") + "\n║\n╚═|〔 " + _0x524ed0 + " 〕"
      }, {
        quoted: _0x23371b
      });
    }
    if (_0x4a8557 === "admins") {
      if (_0x447f76 === "on" || _0x447f76 === "off") {
        _0x40b37b.exemptAdmins = _0x447f76 === "on";
        _0x45ec36();
        return _0x2b5660.sendMessage(_0x41c6a9, {
          text: "╔═|〔  ANTI GROUP STATUS 〕\n║\n║ ▸ *Exempt group admins* : " + _0x3ea59b(_0x40b37b.exemptAdmins) + "\n║\n╚═|〔 " + _0x524ed0 + " 〕"
        }, {
          quoted: _0x23371b
        });
      }
      _0x40b37b.exemptAdmins = !_0x40b37b.exemptAdmins;
      _0x45ec36();
      return _0x2b5660.sendMessage(_0x41c6a9, {
        text: "╔═|〔  ANTI GROUP STATUS 〕\n║\n║ ▸ *Exempt group admins* : " + _0x3ea59b(_0x40b37b.exemptAdmins) + "\n║\n╚═|〔 " + _0x524ed0 + " 〕"
      }, {
        quoted: _0x23371b
      });
    }
    if (_0x4a8557 === "sudos") {
      if (_0x447f76 === "on" || _0x447f76 === "off") {
        _0x40b37b.exemptSudos = _0x447f76 === "on";
        _0x45ec36();
        return _0x2b5660.sendMessage(_0x41c6a9, {
          text: "╔═|〔  ANTI GROUP STATUS 〕\n║\n║ ▸ *Exempt owner/sudos* : " + _0x3ea59b(_0x40b37b.exemptSudos) + "\n║\n╚═|〔 " + _0x524ed0 + " 〕"
        }, {
          quoted: _0x23371b
        });
      }
      _0x40b37b.exemptSudos = !_0x40b37b.exemptSudos;
      _0x45ec36();
      return _0x2b5660.sendMessage(_0x41c6a9, {
        text: "╔═|〔  ANTI GROUP STATUS 〕\n║\n║ ▸ *Exempt owner/sudos* : " + _0x3ea59b(_0x40b37b.exemptSudos) + "\n║\n╚═|〔 " + _0x524ed0 + " 〕"
      }, {
        quoted: _0x23371b
      });
    }
    if (_0x4a8557 === "exempt" || _0x4a8557 === "unexempt") {
      const _0x2f1744 = _0x23371b.message?.extendedTextMessage?.contextInfo;
      const _0xde3c8f = _0x2f1744?.participant || _0x2f1744?.mentionedJid?.[0] || null;
      if (!_0xde3c8f) {
        return _0x2b5660.sendMessage(_0x41c6a9, {
          text: "╔═|〔  ANTI GROUP STATUS 〕\n║\n║ ▸ Reply to or @mention the user\n║\n╚═|〔 " + _0x524ed0 + " 〕"
        }, {
          quoted: _0x23371b
        });
      }
      const _0x4a5f13 = bareNum(_0xde3c8f);
      if (_0x4a8557 === "exempt") {
        if (!_0x40b37b.exempt.some(_0x300440 => bareNum(_0x300440) === _0x4a5f13)) {
          _0x40b37b.exempt.push(_0xde3c8f);
        }
        _0x45ec36();
        return _0x2b5660.sendMessage(_0x41c6a9, {
          text: "╔═|〔  ANTI GROUP STATUS 〕\n║\n║ ▸ *Exempted* : +" + _0x4a5f13 + "\n║\n╚═|〔 " + _0x524ed0 + " 〕"
        }, {
          quoted: _0x23371b
        });
      } else {
        _0x40b37b.exempt = _0x40b37b.exempt.filter(_0x13d2eb => bareNum(_0x13d2eb) !== _0x4a5f13);
        _0x45ec36();
        return _0x2b5660.sendMessage(_0x41c6a9, {
          text: "╔═|〔  ANTI GROUP STATUS 〕\n║\n║ ▸ *Removed* : +" + _0x4a5f13 + "\n║\n╚═|〔 " + _0x524ed0 + " 〕"
        }, {
          quoted: _0x23371b
        });
      }
    }
    if (_0x4a8557) {
      return;
    }
    _0x40b37b.enabled = !_0x40b37b.enabled;
    _0x45ec36();
    return _0x2b5660.sendMessage(_0x41c6a9, {
      text: "╔═|〔  ANTI GROUP STATUS 〕\n║\n║ ▸ *State* : " + (_0x40b37b.enabled ? "✅ Enabled" : "❌ Disabled") + "\n║\n╚═|〔 " + _0x524ed0 + " 〕"
    }, {
      quoted: _0x23371b
    });
  }
};