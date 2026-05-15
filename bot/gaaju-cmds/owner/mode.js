'use strict';

const {
  setConfig
} = require("../../lib/database");
const {
  getBotName
} = require("../../lib/botname");
const {
  isButtonModeEnabled,
  setButtonMode
} = require("../../lib/buttonMode");
const {
  isChannelModeEnabled,
  setChannelMode,
  getChannelInfo
} = require("../../lib/channelMode");
const MODES = {
  public: {
    label: "PUBLIC",
    icon: "🌍",
    desc: "Responds to everyone in all chats"
  },
  groups: {
    label: "GROUPS",
    icon: "👥",
    desc: "Responds only in group chats"
  },
  dms: {
    label: "DMS",
    icon: "💬",
    desc: "Responds only in private messages"
  },
  silent: {
    label: "SILENT",
    icon: "🔇",
    desc: "Responds only to the owner"
  },
  buttons: {
    label: "BUTTONS",
    icon: "🔘",
    desc: "Interactive button responses (overlay)"
  },
  channel: {
    label: "CHANNEL",
    icon: "📡",
    desc: "Replies as forwarded channel messages (overlay)"
  },
  default: {
    label: "DEFAULT",
    icon: "📝",
    desc: "Normal text responses — disables buttons & channel"
  }
};
function getCurrentMode() {
  return process.env.BOT_MODE || "public";
}
module.exports = {
  name: "mode",
  aliases: ["botmode", "setmode"],
  description: "Change bot operating mode",
  category: "owner",
  ownerOnly: true,
  async execute(_0x14b123, _0x21a95a, _0x2b73e1, _0x44e87f, _0x5bf564) {
    const _0x5a6543 = _0x21a95a.key.remoteJid;
    try {
      await _0x14b123.sendMessage(_0x5a6543, {
        react: {
          text: "⚙️",
          key: _0x21a95a.key
        }
      });
    } catch {}
    const _0x2a492c = getBotName();
    if (!_0x5bf564.isOwner() && !_0x5bf564.isSudo()) {
      return _0x14b123.sendMessage(_0x5a6543, {
        text: "╔═|〔  MODE 〕\n║\n║ ▸ *Status* : ❌ Owner only command\n║\n╚═|〔 " + _0x2a492c + " 〕"
      }, {
        quoted: _0x21a95a
      });
    }
    const _0x5b990e = "╔═|〔  BOT MODE 〕";
    const _0x5c37be = "╚═|〔 " + _0x2a492c + " 〕";
    const _0x3d212a = (_0x2b73e1[0] || "").toLowerCase().trim();
    if (!_0x3d212a) {
      const _0x2527f9 = getCurrentMode();
      const _0x1a50ff = MODES[_0x2527f9] || {
        icon: "❓",
        label: _0x2527f9.toUpperCase()
      };
      const _0x191116 = isButtonModeEnabled();
      const _0x1bfa6b = isChannelModeEnabled();
      const _0x2df47b = [_0x191116 ? "🔘 Buttons" : null, _0x1bfa6b ? "📡 Channel" : null].filter(Boolean).join(" + ") || "none";
      return _0x14b123.sendMessage(_0x5a6543, {
        text: [_0x5b990e, "║", "║ ▸ *Current* : " + _0x1a50ff.icon + " " + _0x1a50ff.label, "║ ▸ *Overlays*: " + _0x2df47b, "║", "║ ▸ *" + _0x44e87f + "mode public*   → everyone", "║ ▸ *" + _0x44e87f + "mode groups*   → groups only", "║ ▸ *" + _0x44e87f + "mode dms*      → DMs only", "║ ▸ *" + _0x44e87f + "mode silent*   → owner only", "║ ▸ *" + _0x44e87f + "mode buttons*  → toggle button responses", "║ ▸ *" + _0x44e87f + "mode channel*  → toggle channel forwarding", "║ ▸ *" + _0x44e87f + "mode default*  → reset to normal text", "║", _0x5c37be].join("\n")
      }, {
        quoted: _0x21a95a
      });
    }
    if (!MODES[_0x3d212a]) {
      return _0x14b123.sendMessage(_0x5a6543, {
        text: _0x5b990e + "\n║\n║ ▸ *Status* : ❌ Unknown mode\n║ ▸ *Valid*  : public, groups, dms, silent,\n║   buttons, channel, default\n║\n╚═╝"
      }, {
        quoted: _0x21a95a
      });
    }
    const _0x4c9d98 = MODES[_0x3d212a];
    if (_0x3d212a === "buttons") {
      const _0x2446e5 = !isButtonModeEnabled();
      setButtonMode(_0x2446e5);
      return _0x14b123.sendMessage(_0x5a6543, {
        text: _0x5b990e + "\n║\n║ ▸ *Overlay* : 🔘 Buttons\n║ ▸ *Status*  : " + (_0x2446e5 ? "✅ Enabled" : "❌ Disabled") + "\n║\n" + _0x5c37be
      }, {
        quoted: _0x21a95a
      });
    }
    if (_0x3d212a === "channel") {
      const _0x58d3ae = !isChannelModeEnabled();
      setChannelMode(_0x58d3ae);
      const _0x47143b = getChannelInfo();
      return _0x14b123.sendMessage(_0x5a6543, {
        text: _0x5b990e + "\n║\n║ ▸ *Overlay* : 📡 Channel\n║ ▸ *Status*  : " + (_0x58d3ae ? "✅ Enabled" : "❌ Disabled") + "\n" + (_0x58d3ae ? "║ ▸ *Channel* : " + _0x47143b.name + "\n" : "") + "║\n" + _0x5c37be
      }, {
        quoted: _0x21a95a
      });
    }
    if (_0x3d212a === "default") {
      setButtonMode(false);
      setChannelMode(false);
      await setConfig("MODE", "public");
      process.env.BOT_MODE = "public";
      if (typeof globalThis.updateBotModeCache === "function") {
        globalThis.updateBotModeCache("public");
      }
      if (global.BOT_MODE !== undefined) {
        global.BOT_MODE = "public";
      }
      return _0x14b123.sendMessage(_0x5a6543, {
        text: _0x5b990e + "\n║\n║ ▸ *Mode*    : 📝 DEFAULT (public)\n║ ▸ *Buttons* : ❌ Off\n║ ▸ *Channel* : ❌ Off\n║ ▸ *Note*    : Normal text responses restored\n║\n" + _0x5c37be
      }, {
        quoted: _0x21a95a
      });
    }
    await setConfig("MODE", _0x3d212a);
    process.env.BOT_MODE = _0x3d212a;
    if (typeof globalThis.updateBotModeCache === "function") {
      globalThis.updateBotModeCache(_0x3d212a);
    }
    if (global.BOT_MODE !== undefined) {
      global.BOT_MODE = _0x3d212a;
    }
    return _0x14b123.sendMessage(_0x5a6543, {
      text: _0x5b990e + "\n║\n║ ▸ *Mode*   : " + _0x4c9d98.icon + " " + _0x4c9d98.label + "\n║ ▸ *Effect* : " + _0x4c9d98.desc + "\n║\n" + _0x5c37be
    }, {
      quoted: _0x21a95a
    });
  }
};