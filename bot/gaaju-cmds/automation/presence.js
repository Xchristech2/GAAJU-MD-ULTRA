'use strict';

const {
  getConfig,
  setConfig
} = require("../../lib/database");
const {
  getBotName
} = require("../../lib/botname");
function val(_0x1d8720) {
  return (process.env[_0x1d8720] || "off").toLowerCase();
}
function icon(_0xfe5a11) {
  if (_0xfe5a11 === "on") {
    return "✅ On";
  } else {
    return "❌ Off";
  }
}
async function setEnvDb(_0x156630, _0x1bd7d8) {
  process.env[_0x156630] = _0x1bd7d8;
  await setConfig(_0x156630, _0x1bd7d8);
}
module.exports = {
  name: "presence",
  aliases: ["indicator", "botpresence", "presenceindicator"],
  description: "Control both typing and recording indicators together",
  category: "automation",
  ownerOnly: true,
  sudoAllowed: true,
  async execute(_0xd6435f, _0x1b5990, _0x646425, _0x13e75d, _0x4fd531) {
    const _0x43a60a = _0x1b5990.key.remoteJid;
    if (!_0x4fd531?.isOwnerUser && !_0x4fd531?.isSudoUser) {
      return _0xd6435f.sendMessage(_0x43a60a, {
        text: "╔═|〔  PRESENCE INDICATOR 〕\n║\n║ ▸ ❌ Owner/sudo only\n║\n╚═╝"
      }, {
        quoted: _0x1b5990
      });
    }
    const _0x324870 = (_0x646425[0] || "").toLowerCase().trim();
    const _0x249655 = (_0x646425[1] || "all").toLowerCase().trim();
    if (!_0x324870 || _0x324870 === "status") {
      const _0x3d9eae = val("AUTO_TYPING");
      const _0x5d619f = val("AUTO_TYPING_GROUP");
      const _0x541b1f = val("AUTO_TYPING_DM");
      const _0xa61af8 = val("AUTO_RECORDING");
      const _0x328718 = val("AUTO_RECORDING_GROUP");
      const _0x5dc15a = val("AUTO_RECORDING_DM");
      const _0x24162e = _0x3d9eae === "on" || _0x5d619f === "on" || _0x541b1f === "on";
      const _0x2e5453 = _0xa61af8 === "on" || _0x328718 === "on" || _0x5dc15a === "on";
      const _0x2f49ff = _0x24162e ? "⌨️ Typing" : _0x2e5453 ? "🎙️ Recording" : "❌ None";
      return _0xd6435f.sendMessage(_0x43a60a, {
        text: ["╔═|〔  PRESENCE INDICATOR 〕", "║", "║ ▸ *Active Mode* : " + _0x2f49ff, "║", "║  ⌨️  TYPING", "║   ▸ Global : " + icon(_0x3d9eae) + "  │  Group : " + icon(_0x5d619f) + "  │  DM : " + icon(_0x541b1f), "║", "║  🎙️  RECORDING", "║   ▸ Global : " + icon(_0xa61af8) + "  │  Group : " + icon(_0x328718) + "  │  DM : " + icon(_0x5dc15a), "║", "║ ▸ *Usage*:", "║   " + _0x13e75d + "presence typing [all|group|dm]", "║   " + _0x13e75d + "presence recording [all|group|dm]", "║   " + _0x13e75d + "presence off", "║", "╚═╝"].join("\n")
      }, {
        quoted: _0x1b5990
      });
    }
    if (_0x324870 === "off") {
      for (const _0x36c7c8 of ["AUTO_TYPING", "AUTO_TYPING_DM", "AUTO_TYPING_GROUP", "AUTO_RECORDING", "AUTO_RECORDING_DM", "AUTO_RECORDING_GROUP"]) {
        await setEnvDb(_0x36c7c8, "off");
      }
      return _0xd6435f.sendMessage(_0x43a60a, {
        text: "╔═|〔  PRESENCE INDICATOR 〕\n║\n║ ▸ ❌ All indicators OFF\n║\n╚═╝"
      }, {
        quoted: _0x1b5990
      });
    }
    if (_0x324870 === "typing") {
      for (const _0x1963c7 of ["AUTO_RECORDING", "AUTO_RECORDING_DM", "AUTO_RECORDING_GROUP"]) {
        await setEnvDb(_0x1963c7, "off");
      }
      for (const _0xd37c04 of ["AUTO_TYPING", "AUTO_TYPING_DM", "AUTO_TYPING_GROUP"]) {
        await setEnvDb(_0xd37c04, "off");
      }
      let _0x5dc7fd = "all chats";
      if (_0x249655 === "group") {
        await setEnvDb("AUTO_TYPING_GROUP", "on");
        _0x5dc7fd = "groups only";
      } else if (_0x249655 === "dm") {
        await setEnvDb("AUTO_TYPING_DM", "on");
        _0x5dc7fd = "DMs only";
      } else {
        await setEnvDb("AUTO_TYPING", "on");
      }
      return _0xd6435f.sendMessage(_0x43a60a, {
        text: "╔═|〔  PRESENCE INDICATOR 〕\n║\n║ ▸ ⌨️ Typing ON (" + _0x5dc7fd + ")\n║ ▸ 🎙️ Recording OFF\n║\n╚═╝"
      }, {
        quoted: _0x1b5990
      });
    }
    if (_0x324870 === "recording") {
      for (const _0x2e7812 of ["AUTO_TYPING", "AUTO_TYPING_DM", "AUTO_TYPING_GROUP"]) {
        await setEnvDb(_0x2e7812, "off");
      }
      for (const _0x528941 of ["AUTO_RECORDING", "AUTO_RECORDING_DM", "AUTO_RECORDING_GROUP"]) {
        await setEnvDb(_0x528941, "off");
      }
      let _0x73099f = "all chats";
      if (_0x249655 === "group") {
        await setEnvDb("AUTO_RECORDING_GROUP", "on");
        _0x73099f = "groups only";
      } else if (_0x249655 === "dm") {
        await setEnvDb("AUTO_RECORDING_DM", "on");
        _0x73099f = "DMs only";
      } else {
        await setEnvDb("AUTO_RECORDING", "on");
      }
      return _0xd6435f.sendMessage(_0x43a60a, {
        text: "╔═|〔  PRESENCE INDICATOR 〕\n║\n║ ▸ 🎙️ Recording ON (" + _0x73099f + ")\n║ ▸ ⌨️ Typing OFF\n║\n╚═╝"
      }, {
        quoted: _0x1b5990
      });
    }
    return _0xd6435f.sendMessage(_0x43a60a, {
      text: ["╔═|〔  PRESENCE INDICATOR 〕", "║", "║ ▸ *Usage*:", "║   " + _0x13e75d + "presence              → show status", "║   " + _0x13e75d + "presence typing        → typing, all chats", "║   " + _0x13e75d + "presence typing group  → typing, groups only", "║   " + _0x13e75d + "presence typing dm     → typing, DMs only", "║   " + _0x13e75d + "presence recording     → recording, all chats", "║   " + _0x13e75d + "presence off           → disable all", "║", "╚═╝"].join("\n")
    }, {
      quoted: _0x1b5990
    });
  }
};