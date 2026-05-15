'use strict';

const axios = require("axios");
const fs = require("fs");
const path = require("path");
const {
  getBotName
} = require("../../lib/botname");
const {
  resolveDisplayWithName
} = require("../../lib/groupUtils");
const CFG_FILE = path.join(__dirname, "../../data/welcome_data.json");
const DEFAULT_MSG = ["╔═|〔  WELCOME 〕", "║", "║ 🎉 {mention} just dropped in!", "║ ▸ *Group*   : {group}", "║ ▸ *Member*  : #{count}", "║", "║ 😂 WiFi password won't be shared", "║    until you behave 😏", "║ ⚠️  This group is highly addictive", "║    — you've been warned! 🫡", "║", "╚═╝"].join("\n");
function loadCfg() {
  try {
    return JSON.parse(fs.readFileSync(CFG_FILE, "utf8"));
  } catch {
    return {
      groups: {}
    };
  }
}
function saveCfg(_0x18c30a) {
  fs.mkdirSync(path.dirname(CFG_FILE), {
    recursive: true
  });
  fs.writeFileSync(CFG_FILE, JSON.stringify(_0x18c30a, null, 2));
}
try {
  const _boot = loadCfg();
  let _dirty = false;
  for (const id of Object.keys(_boot.groups || {})) {
    if (_boot.groups[id]?.enabled) {
      _boot.groups[id].enabled = false;
      _dirty = true;
    }
  }
  if (_dirty) {
    saveCfg(_boot);
  }
} catch {}
function applyVars(_0x42c9cd, _0x26af88) {
  return _0x42c9cd.replace(/\{mention\}/g, _0x26af88.mention || "").replace(/\{name\}/g, _0x26af88.name || "").replace(/\{group\}/g, _0x26af88.group || "").replace(/\{count\}/g, _0x26af88.count || "").replace(/\{members\}/g, _0x26af88.count || "").replace(/\{bot\}/g, _0x26af88.bot || getBotName());
}
function normalizeJid(_0x4a8861) {
  if (typeof _0x4a8861 === "string") {
    if (_0x4a8861.includes("@")) {
      return _0x4a8861;
    } else {
      return null;
    }
  }
  if (_0x4a8861 && typeof _0x4a8861 === "object") {
    const _0x271e07 = _0x4a8861.jid || _0x4a8861.id || _0x4a8861.userJid || _0x4a8861.participant || _0x4a8861.user;
    if (typeof _0x271e07 === "string" && _0x271e07.includes("@")) {
      return _0x271e07;
    }
    if (typeof _0x271e07 === "string" && /^\d+$/.test(_0x271e07)) {
      return _0x271e07 + "@s.whatsapp.net";
    }
    if (typeof _0x271e07 === "object" && _0x271e07?.user) {
      return _0x271e07.user + "@s.whatsapp.net";
    }
    for (const _0x72c220 of Object.keys(_0x4a8861)) {
      const _0x79a301 = _0x4a8861[_0x72c220];
      if (typeof _0x79a301 === "string" && _0x79a301.includes("@s.whatsapp.net")) {
        return _0x79a301;
      }
    }
    return null;
  }
  return null;
}
async function fetchBuffer(_0x382e3a) {
  try {
    const _0x3383c8 = await axios.get(_0x382e3a, {
      responseType: "arraybuffer",
      timeout: 10000
    });
    return Buffer.from(_0x3383c8.data);
  } catch {
    return null;
  }
}
function isWelcomeEnabled(_0x4b6343) {
  return !!loadCfg().groups?.[_0x4b6343]?.enabled;
}
function getWelcomeMessage(_0x9f89c1) {
  return loadCfg().groups?.[_0x9f89c1]?.message || DEFAULT_MSG;
}
async function sendWelcomeMessage(_0x2a6ec7, _0x15f907, _0x179981, _0x3a9909, {
  approvedBy: _0x548d5b
} = {}) {
  try {
    let _0x554086;
    try {
      _0x554086 = await _0x2a6ec7.groupMetadata(_0x15f907);
    } catch {
      _0x554086 = {
        participants: [],
        subject: "Our Group"
      };
    }
    const _0x2d2231 = _0x554086.subject || _0x15f907.split("@")[0];
    const _0xa616cd = _0x554086.participants.length;
    const _0x6e14c4 = getBotName();
    const _0x477af8 = _0x3a9909 || DEFAULT_MSG;
    let _0x7aa63f = null;
    let _0x2d8104 = null;
    try {
      _0x7aa63f = await _0x2a6ec7.profilePictureUrl(_0x15f907, "image");
      if (_0x7aa63f) {
        _0x2d8104 = await fetchBuffer(_0x7aa63f);
      }
    } catch {}
    for (const _0x3753f5 of _0x179981) {
      const _0x529eb0 = normalizeJid(_0x3753f5);
      if (!_0x529eb0 || _0x529eb0 === "undefined" || _0x529eb0 === "[object Object]") {
        continue;
      }
      try {
        const _0x4273e7 = _0x529eb0.split("@")[0].split(":")[0];
        const _0x967bf8 = await resolveDisplayWithName(_0x2a6ec7, _0x15f907, _0x529eb0, null).catch(() => "+" + _0x4273e7);
        const _0x226b54 = applyVars(_0x477af8, {
          mention: "@" + _0x4273e7,
          name: _0x967bf8,
          group: _0x2d2231,
          count: String(_0xa616cd),
          bot: _0x6e14c4
        });
        const _0x2d2fbd = _0x548d5b ? _0x548d5b.split("@")[0].split(":")[0] : null;
        const _0x56f46a = _0x2d2fbd ? "╔═|〔  JOIN APPROVED 〕\n║ ▸ *Approved by* : @" + _0x2d2fbd + "\n╚══════════════════\n\n" + _0x226b54 : _0x226b54;
        const _0x5b8c61 = _0x548d5b ? [_0x529eb0, _0x548d5b] : [_0x529eb0];
        let _0x53d783 = null;
        try {
          const _0x351567 = await _0x2a6ec7.profilePictureUrl(_0x529eb0, "image");
          if (_0x351567) {
            _0x53d783 = await fetchBuffer(_0x351567);
          }
        } catch {}
        const _0x188345 = _0x53d783 || _0x2d8104;
        if (_0x188345) {
          await _0x2a6ec7.sendMessage(_0x15f907, {
            image: _0x188345,
            caption: _0x56f46a,
            mentions: _0x5b8c61,
            contextInfo: {
              mentionedJid: _0x5b8c61,
              externalAdReply: {
                title: "🎉 Welcome to " + _0x2d2231,
                body: "👥 Member #" + _0xa616cd,
                mediaType: 1,
                thumbnailUrl: _0x7aa63f || "",
                sourceUrl: "",
                renderLargerThumbnail: false
              }
            }
          });
        } else {
          await _0x2a6ec7.sendMessage(_0x15f907, {
            text: _0x56f46a,
            mentions: _0x5b8c61
          });
        }
        console.log("[WELCOME] ✅ Welcomed " + _0x4273e7 + " in " + _0x15f907.split("@")[0]);
      } catch (_0x211931) {
        console.error("[WELCOME] ❌ Error welcoming " + _0x529eb0 + ": " + _0x211931.message);
        try {
          const _0x118399 = typeof _0x529eb0 === "string" ? _0x529eb0.split("@")[0] : "member";
          await _0x2a6ec7.sendMessage(_0x15f907, {
            text: "🎉 Welcome @" + _0x118399 + " to *" + _0x2d2231 + "*! 🎊\n👥 Members: " + _0xa616cd,
            mentions: [_0x529eb0]
          });
        } catch {}
      }
    }
  } catch (_0x3c4e87) {
    console.error("[WELCOME] ❌ Fatal error: " + _0x3c4e87.message);
  }
}
module.exports = {
  isWelcomeEnabled: isWelcomeEnabled,
  getWelcomeMessage: getWelcomeMessage,
  sendWelcomeMessage: sendWelcomeMessage,
  name: "welcome",
  aliases: ["setwelcome", "welcomeset"],
  description: "Welcome new members when they join the group",
  category: "group",
  async execute(_0x9ad3, _0x3b2c32, _0x592f4e, _0x5f5d1c, _0x40c7b8) {
    const _0x58dfcb = _0x3b2c32.key.remoteJid;
    try {
      await _0x9ad3.sendMessage(_0x58dfcb, {
        react: {
          text: "👋",
          key: _0x3b2c32.key
        }
      });
    } catch {}
    const _0x238f08 = getBotName();
    if (!_0x40c7b8?.isOwnerUser && !_0x40c7b8?.isSudoUser && !_0x40c7b8?.isGroupAdmin) {
      return _0x9ad3.sendMessage(_0x58dfcb, {
        text: "╔═|〔  WELCOME 〕\n║\n║ ▸ *Status* : ❌ Admins/Owner only\n║\n╚═╝"
      }, {
        quoted: _0x3b2c32
      });
    }
    if (!_0x58dfcb.endsWith("@g.us")) {
      return _0x9ad3.sendMessage(_0x58dfcb, {
        text: "╔═|〔  WELCOME 〕\n║\n║ ▸ *Status* : ❌ Groups only\n║\n╚═╝"
      }, {
        quoted: _0x3b2c32
      });
    }
    const _0xc687ba = _0x592f4e[0]?.toLowerCase();
    const _0x35d3b6 = loadCfg();
    const _0x461059 = _0x35d3b6.groups?.[_0x58dfcb] || {
      enabled: false,
      message: DEFAULT_MSG
    };
    const _0x58f58c = () => {
      _0x35d3b6.groups = _0x35d3b6.groups || {};
      _0x35d3b6.groups[_0x58dfcb] = _0x461059;
      saveCfg(_0x35d3b6);
    };
    if (!_0xc687ba || _0xc687ba === "status") {
      return _0x9ad3.sendMessage(_0x58dfcb, {
        text: ["╔═|〔  WELCOME 〕", "║", "║ ▸ *State*   : " + (_0x461059.enabled ? "✅ ON" : "❌ OFF"), "║ ▸ *Message* : " + (_0x461059.message === DEFAULT_MSG ? "Default" : "Custom ✏️"), "║", "║ ▸ *Usage* :", "║   " + _0x5f5d1c + "welcome on / off", "║   " + _0x5f5d1c + "welcome set <your message>", "║   " + _0x5f5d1c + "welcome reset", "║   " + _0x5f5d1c + "welcome test", "║   " + _0x5f5d1c + "welcome msg", "║", "║ ▸ *Placeholders* :", "║   {mention} {name} {group} {count} {bot}", "║", "╚═╝"].join("\n")
      }, {
        quoted: _0x3b2c32
      });
    }
    if (_0xc687ba === "on" || _0xc687ba === "enable") {
      _0x461059.enabled = true;
      _0x58f58c();
      return _0x9ad3.sendMessage(_0x58dfcb, {
        text: "╔═|〔  WELCOME 〕\n║\n║ ▸ *State* : ✅ Enabled\n║ ▸ *Note*  : Members will be welcomed with pic\n║\n╚═╝"
      }, {
        quoted: _0x3b2c32
      });
    }
    if (_0xc687ba === "off" || _0xc687ba === "disable") {
      _0x461059.enabled = false;
      _0x58f58c();
      return _0x9ad3.sendMessage(_0x58dfcb, {
        text: "╔═|〔  WELCOME 〕\n║\n║ ▸ *State* : ❌ Disabled\n║\n╚═╝"
      }, {
        quoted: _0x3b2c32
      });
    }
    if (_0xc687ba === "set") {
      const _0x5b2c2a = _0x592f4e.slice(1).join(" ").trim();
      if (!_0x5b2c2a) {
        return _0x9ad3.sendMessage(_0x58dfcb, {
          text: "╔═|〔  WELCOME 〕\n║\n║ ▸ *Usage* : " + _0x5f5d1c + "welcome set <message>\n║ ▸ *Vars*  : {mention} {name} {group} {count} {bot}\n║\n╚═╝"
        }, {
          quoted: _0x3b2c32
        });
      }
      _0x461059.message = _0x5b2c2a;
      _0x58f58c();
      return _0x9ad3.sendMessage(_0x58dfcb, {
        text: "╔═|〔  WELCOME 〕\n║\n║ ▸ *Message* : ✅ Saved\n║\n╚═╝"
      }, {
        quoted: _0x3b2c32
      });
    }
    if (_0xc687ba === "reset" || _0xc687ba === "default") {
      _0x461059.message = DEFAULT_MSG;
      _0x58f58c();
      return _0x9ad3.sendMessage(_0x58dfcb, {
        text: "╔═|〔  WELCOME 〕\n║\n║ ▸ *Message* : ✅ Reset to default\n║\n╚═╝"
      }, {
        quoted: _0x3b2c32
      });
    }
    if (_0xc687ba === "test" || _0xc687ba === "preview" || _0xc687ba === "demo") {
      const _0x3cb19a = _0x3b2c32.key.participant || _0x3b2c32.key.remoteJid;
      await sendWelcomeMessage(_0x9ad3, _0x58dfcb, [_0x3cb19a], _0x461059.message);
      return;
    }
    if (_0xc687ba === "msg" || _0xc687ba === "message") {
      return _0x9ad3.sendMessage(_0x58dfcb, {
        text: "╔═|〔  WELCOME MESSAGE 〕\n║\n" + _0x461059.message + "\n║\n╚═╝"
      }, {
        quoted: _0x3b2c32
      });
    }
    if (_0xc687ba) {
      return;
    }
    _0x461059.enabled = !_0x461059.enabled;
    _0x58f58c();
    return _0x9ad3.sendMessage(_0x58dfcb, {
      text: "╔═|〔  WELCOME 〕\n║\n║ ▸ *State* : " + (_0x461059.enabled ? "✅ Enabled" : "❌ Disabled") + "\n║\n╚═╝"
    }, {
      quoted: _0x3b2c32
    });
  }
};