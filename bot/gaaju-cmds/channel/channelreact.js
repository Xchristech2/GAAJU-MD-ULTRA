'use strict';

const {
  get,
  set
} = require("../../lib/autoconfig");
const {
  getBotName
} = require("../../lib/botname");
const DEFAULT_EMOJIS = ["🔥", "❤️", "😍", "👏", "💯", "🎉", "🌟", "🤩"];
function getCfg() {
  const _0x4e1c38 = get("channelreact");
  return {
    enabled: _0x4e1c38?.enabled ?? true,
    emojis: Array.isArray(_0x4e1c38?.emojis) && _0x4e1c38.emojis.length ? _0x4e1c38.emojis : [...DEFAULT_EMOJIS],
    extraJids: Array.isArray(_0x4e1c38?.extraJids) ? _0x4e1c38.extraJids : []
  };
}
function saveCfg(_0x40d7a1) {
  set("channelreact", Object.assign(getCfg(), _0x40d7a1));
}
const _registeredJids = new Set();
const channelReactManager = {
  isEnabled: () => getCfg().enabled,
  registerNewsletter: _0x2f1e2a => {
    if (_0x2f1e2a) {
      _registeredJids.add(_0x2f1e2a);
    }
  },
  unregisterNewsletter: _0x58f15f => {
    _registeredJids.delete(_0x58f15f);
  },
  list: () => [..._registeredJids]
};
const _reacted = new Set();
function _markReacted(_0x44031c) {
  _reacted.add(_0x44031c);
  if (_reacted.size > 500) {
    const _0x552916 = _reacted.values();
    _0x552916.next();
    _reacted.delete(_0x552916.next().value);
  }
}
async function handleChannelReact(_0x5913ea, _0xe5f518) {
  try {
    const _0x5c28a3 = getCfg();
    if (!_0x5c28a3.enabled) {
      return;
    }
    const _0x1bb660 = _0xe5f518.key?.remoteJid;
    if (!_0x1bb660?.endsWith("@newsletter")) {
      return;
    }
    const _0x3bb985 = process.env.NEWSLETTER_JID;
    const _0x56c37a = new Set([..._registeredJids, ..._0x5c28a3.extraJids, ...(_0x3bb985 ? [_0x3bb985] : [])]);
    if (!_0x56c37a.has(_0x1bb660)) {
      return;
    }
    const _0x88d732 = _0xe5f518.key?.id;
    if (!_0x88d732 || _reacted.has(_0x88d732)) {
      return;
    }
    _markReacted(_0x88d732);
    const _0x520a5a = _0x5c28a3.emojis;
    for (let _0x37453e = 0; _0x37453e < _0x520a5a.length; _0x37453e++) {
      await new Promise(_0x45846e => setTimeout(_0x45846e, _0x37453e === 0 ? 600 : 350));
      await (typeof _0x5913ea.newsletterReactMessage === "function" ? _0x5913ea.newsletterReactMessage(_0x1bb660, _0xe5f518?.key?.id, _0x520a5a[_0x37453e]) : _0x5913ea.sendMessage(_0x1bb660, {
        react: {
          text: _0x520a5a[_0x37453e],
          key: _0xe5f518.key
        }
      }));
    }
  } catch {}
}
async function discoverNewsletters(_0x3fef64) {}
module.exports = {
  handleChannelReact: handleChannelReact,
  discoverNewsletters: discoverNewsletters,
  channelReactManager: channelReactManager,
  name: "channelreact",
  aliases: ["cr", "chanreact", "chreact"],
  description: "Auto-react with a burst of emojis on every channel post",
  category: "automation",
  async execute(_0x3d5ca7, _0x531193, _0x440611, _0x1f313f, _0x3f7859) {
    const _0x207538 = _0x531193.key.remoteJid;
    const _0x1e7dc1 = getBotName();
    if (!_0x3f7859?.isOwnerUser && !_0x3f7859?.isSudoUser) {
      return _0x3d5ca7.sendMessage(_0x207538, {
        text: "╔═|〔  CHANNEL REACT 〕\n║\n║ ▸ *Status* : ❌ Owner only\n║\n╚═|〔 " + _0x1e7dc1 + " 〕"
      }, {
        quoted: _0x531193
      });
    }
    const _0x417450 = _0x440611[0]?.toLowerCase();
    const _0x2c7e06 = getCfg();
    if (!_0x417450 || _0x417450 === "status") {
      const _0x24c71c = process.env.NEWSLETTER_JID || "(not resolved yet)";
      const _0x5d2cd6 = [...new Set([..._registeredJids, ..._0x2c7e06.extraJids, ...(process.env.NEWSLETTER_JID ? [process.env.NEWSLETTER_JID] : [])])];
      return _0x3d5ca7.sendMessage(_0x207538, {
        text: ["╔═|〔  CHANNEL AUTO-REACT 〕", "║", "║ ▸ *State*    : " + (_0x2c7e06.enabled ? "✅ ON" : "❌ OFF"), "║ ▸ *Emojis*   : " + _0x2c7e06.emojis.join(" "), "║ ▸ *Channels* : " + _0x5d2cd6.length + " watched", "║ ▸ *Owner ch* : ..." + _0x24c71c.slice(-20), "║", "║ ▸ *Commands* :", "║   " + _0x1f313f + "cr on / off", "║   " + _0x1f313f + "cr emojis 🔥 ❤️ 👏 💯", "║   " + _0x1f313f + "cr reset", "║   " + _0x1f313f + "cr add <newsletter-jid>", "║   " + _0x1f313f + "cr remove <newsletter-jid>", "║", "╚═|〔 " + _0x1e7dc1 + " 〕"].join("\n")
      }, {
        quoted: _0x531193
      });
    }
    if (_0x417450 === "on" || _0x417450 === "off") {
      saveCfg({
        enabled: _0x417450 === "on"
      });
      return _0x3d5ca7.sendMessage(_0x207538, {
        text: "╔═|〔  CHANNEL AUTO-REACT 〕\n║\n║ ▸ *State* : " + (_0x417450 === "on" ? "✅ Enabled" : "❌ Disabled") + "\n║\n╚═|〔 " + _0x1e7dc1 + " 〕"
      }, {
        quoted: _0x531193
      });
    }
    if (_0x417450 === "emojis" || _0x417450 === "emoji") {
      const _0x4a7115 = _0x440611.slice(1).filter(Boolean);
      if (!_0x4a7115.length) {
        return _0x3d5ca7.sendMessage(_0x207538, {
          text: "╔═|〔  CHANNEL AUTO-REACT 〕\n║\n║ ▸ *Usage* : " + _0x1f313f + "cr emojis 🔥 ❤️ 😍 👏\n║\n╚═|〔 " + _0x1e7dc1 + " 〕"
        }, {
          quoted: _0x531193
        });
      }
      saveCfg({
        emojis: _0x4a7115
      });
      return _0x3d5ca7.sendMessage(_0x207538, {
        text: "╔═|〔  CHANNEL AUTO-REACT 〕\n║\n║ ▸ *Emojis set* : " + _0x4a7115.join(" ") + "\n║ ▸ All of these burst on each post\n║\n╚═|〔 " + _0x1e7dc1 + " 〕"
      }, {
        quoted: _0x531193
      });
    }
    if (_0x417450 === "reset") {
      saveCfg({
        emojis: [...DEFAULT_EMOJIS],
        enabled: true,
        extraJids: []
      });
      return _0x3d5ca7.sendMessage(_0x207538, {
        text: "╔═|〔  CHANNEL AUTO-REACT 〕\n║\n║ ▸ *Reset*  : ✅ Defaults restored\n║ ▸ *Emojis* : " + DEFAULT_EMOJIS.join(" ") + "\n║\n╚═|〔 " + _0x1e7dc1 + " 〕"
      }, {
        quoted: _0x531193
      });
    }
    if (_0x417450 === "add") {
      const _0x33759a = _0x440611[1]?.trim();
      if (!_0x33759a?.endsWith("@newsletter")) {
        return _0x3d5ca7.sendMessage(_0x207538, {
          text: "╔═|〔  CHANNEL AUTO-REACT 〕\n║\n║ ▸ *Error* : JID must end with @newsletter\n║ ▸ *Usage* : " + _0x1f313f + "cr add 12345@newsletter\n║\n╚═|〔 " + _0x1e7dc1 + " 〕"
        }, {
          quoted: _0x531193
        });
      }
      saveCfg({
        extraJids: [...new Set([..._0x2c7e06.extraJids, _0x33759a])]
      });
      channelReactManager.registerNewsletter(_0x33759a);
      return _0x3d5ca7.sendMessage(_0x207538, {
        text: "╔═|〔  CHANNEL AUTO-REACT 〕\n║\n║ ▸ *Added channel* : " + _0x33759a + "\n║\n╚═|〔 " + _0x1e7dc1 + " 〕"
      }, {
        quoted: _0x531193
      });
    }
    if (_0x417450 === "remove" || _0x417450 === "rm") {
      const _0x16171b = _0x440611[1]?.trim();
      saveCfg({
        extraJids: _0x2c7e06.extraJids.filter(_0x3218be => _0x3218be !== _0x16171b)
      });
      channelReactManager.unregisterNewsletter(_0x16171b);
      return _0x3d5ca7.sendMessage(_0x207538, {
        text: "╔═|〔  CHANNEL AUTO-REACT 〕\n║\n║ ▸ *Removed* : " + (_0x16171b || "(none)") + "\n║\n╚═|〔 " + _0x1e7dc1 + " 〕"
      }, {
        quoted: _0x531193
      });
    }
  }
};