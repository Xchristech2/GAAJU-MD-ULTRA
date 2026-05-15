const {
  get,
  set
} = require("../../lib/autoconfig");
const {
  getBotName
} = require("../../lib/botname");
const DEFAULT_EMOJIS = ["❤️", "🔥", "😍", "👍", "🎉", "💯", "😂", "🥰", "🫶", "✨"];
function getCfg() {
  const _0x3d6bbb = get("autoreactstatus");
  return {
    enabled: _0x3d6bbb?.enabled ?? false,
    mode: _0x3d6bbb?.mode ?? "fixed",
    emoji: _0x3d6bbb?.emoji ?? "❤️",
    emojis: Array.isArray(_0x3d6bbb?.emojis) && _0x3d6bbb.emojis.length ? _0x3d6bbb.emojis : [...DEFAULT_EMOJIS]
  };
}
function saveCfg(_0x254641) {
  const _0x9c0cfb = getCfg();
  set("autoreactstatus", Object.assign(_0x9c0cfb, _0x254641));
}
function pickEmoji(_0x5620af) {
  if (_0x5620af.mode === "random") {
    const _0x1f95f3 = _0x5620af.emojis.length ? _0x5620af.emojis : DEFAULT_EMOJIS;
    return _0x1f95f3[Math.floor(Math.random() * _0x1f95f3.length)];
  }
  return _0x5620af.emoji || "❤️";
}
async function handleAutoReact(_0x4337b0, _0x1d522b) {
  try {
    const _0x25a25d = getCfg();
    if (!_0x25a25d.enabled) {
      return;
    }
    const _0xa44ef4 = pickEmoji(_0x25a25d);
    const _0x3f4402 = _0x1d522b.participantPn || (_0x1d522b.participant && !_0x1d522b.participant.includes("@lid") ? _0x1d522b.participant : null) || _0x1d522b.remoteJid;
    const _0x284e58 = {
      remoteJid: "status@broadcast",
      id: _0x1d522b.id,
      fromMe: false,
      participant: _0x3f4402
    };
    await _0x4337b0.sendMessage("status@broadcast", {
      react: {
        text: _0xa44ef4,
        key: _0x284e58
      }
    }, {
      statusJidList: [_0x3f4402]
    });
  } catch {}
}
module.exports = {
  handleAutoReact: handleAutoReact,
  name: "autolikestatus",
  aliases: ["als", "autoreactstatus", "ars", "autoreact"],
  description: "Auto-react to WhatsApp status updates (fixed or random emoji)",
  category: "automation",
  async execute(_0x152a76, _0x480677, _0x335524, _0x544347, _0x273b9c) {
    const _0x20fcf7 = _0x480677.key.remoteJid;
    const _0x369328 = getBotName();
    if (!_0x273b9c?.isOwnerUser && !_0x273b9c?.isSudoUser) {
      return _0x152a76.sendMessage(_0x20fcf7, {
        text: "╔═|〔  AUTO REACT STATUS 〕\n║\n║ ▸ *Status* : ❌ Owner only\n║\n╚═|〔 " + _0x369328 + " 〕"
      }, {
        quoted: _0x480677
      });
    }
    const _0x24f9fa = _0x335524[0]?.toLowerCase();
    const _0x28d566 = getCfg();
    if (!_0x24f9fa || _0x24f9fa === "status") {
      const _0x5506a1 = _0x28d566.mode === "random" ? "🎲 Random  (" + _0x28d566.emojis.join(" ") + ")" : "📌 Fixed   → " + _0x28d566.emoji;
      return _0x152a76.sendMessage(_0x20fcf7, {
        text: ["╔═|〔  AUTO REACT STATUS 〕", "║", "║ ▸ *State* : " + (_0x28d566.enabled ? "✅ ON" : "❌ OFF"), "║ ▸ *Mode*  : " + _0x5506a1, "║", "║ ▸ *Usage* :", "║   " + _0x544347 + "als on / off", "║   " + _0x544347 + "als fixed ❤️", "║   " + _0x544347 + "als random", "║   " + _0x544347 + "als emojis 🔥 ❤️ 😍 👍", "║   " + _0x544347 + "als reset", "║", "╚═|〔 " + _0x369328 + " 〕"].join("\n")
      }, {
        quoted: _0x480677
      });
    }
    if (_0x24f9fa === "on" || _0x24f9fa === "off") {
      saveCfg({
        enabled: _0x24f9fa === "on"
      });
      const _0x5d2664 = getCfg();
      return _0x152a76.sendMessage(_0x20fcf7, {
        text: ["╔═|〔  AUTO REACT STATUS 〕", "║", "║ ▸ *State* : " + (_0x5d2664.enabled ? "✅ Enabled" : "❌ Disabled"), "║ ▸ *Mode*  : " + (_0x5d2664.mode === "random" ? "🎲 Random (" + _0x5d2664.emojis.join(" ") + ")" : "📌 Fixed → " + _0x5d2664.emoji), "║", "╚═|〔 " + _0x369328 + " 〕"].join("\n")
      }, {
        quoted: _0x480677
      });
    }
    if (_0x24f9fa === "fixed" || _0x24f9fa === "emoji") {
      const _0x60f158 = _0x335524[1] || "❤️";
      saveCfg({
        mode: "fixed",
        emoji: _0x60f158
      });
      return _0x152a76.sendMessage(_0x20fcf7, {
        text: "╔═|〔  AUTO REACT STATUS 〕\n║\n║ ▸ *Mode*  : 📌 Fixed\n║ ▸ *Emoji* : " + _0x60f158 + "\n║\n╚═|〔 " + _0x369328 + " 〕"
      }, {
        quoted: _0x480677
      });
    }
    if (_0x24f9fa === "random") {
      saveCfg({
        mode: "random"
      });
      const _0x180373 = getCfg();
      return _0x152a76.sendMessage(_0x20fcf7, {
        text: "╔═|〔  AUTO REACT STATUS 〕\n║\n║ ▸ *Mode*   : 🎲 Random\n║ ▸ *Emojis* : " + _0x180373.emojis.join(" ") + "\n║\n╚═|〔 " + _0x369328 + " 〕"
      }, {
        quoted: _0x480677
      });
    }
    if (_0x24f9fa === "emojis" || _0x24f9fa === "list") {
      const _0xfa8b03 = _0x335524.slice(1).filter(Boolean);
      if (!_0xfa8b03.length) {
        return _0x152a76.sendMessage(_0x20fcf7, {
          text: "╔═|〔  AUTO REACT STATUS 〕\n║\n║ ▸ *Usage* : " + _0x544347 + "als emojis 🔥 ❤️ 😍 👍\n║\n╚═|〔 " + _0x369328 + " 〕"
        }, {
          quoted: _0x480677
        });
      }
      saveCfg({
        emojis: _0xfa8b03,
        mode: "random"
      });
      return _0x152a76.sendMessage(_0x20fcf7, {
        text: "╔═|〔  AUTO REACT STATUS 〕\n║\n║ ▸ *Mode*   : 🎲 Random\n║ ▸ *Emojis* : " + _0xfa8b03.join(" ") + "\n║\n╚═|〔 " + _0x369328 + " 〕"
      }, {
        quoted: _0x480677
      });
    }
    if (_0x24f9fa === "reset") {
      saveCfg({
        mode: "fixed",
        emoji: "❤️",
        emojis: [...DEFAULT_EMOJIS]
      });
      return _0x152a76.sendMessage(_0x20fcf7, {
        text: "╔═|〔  AUTO REACT STATUS 〕\n║\n║ ▸ *Reset* : ✅ Defaults restored\n║ ▸ *Mode*  : 📌 Fixed → ❤️\n║\n╚═|〔 " + _0x369328 + " 〕"
      }, {
        quoted: _0x480677
      });
    }
    if (_0x24f9fa) {
      return;
    }
    saveCfg({
      enabled: !_0x28d566.enabled
    });
    const _0x23bc12 = getCfg();
    return _0x152a76.sendMessage(_0x20fcf7, {
      text: "╔═|〔  AUTO REACT STATUS 〕\n║\n║ ▸ *State* : " + (_0x23bc12.enabled ? "✅ Enabled" : "❌ Disabled") + "\n║\n╚═|〔 " + _0x369328 + " 〕"
    }, {
      quoted: _0x480677
    });
  }
};