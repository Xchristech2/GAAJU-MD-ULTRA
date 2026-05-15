const {
  setConfig
} = require("../../lib/database");
module.exports = {
  name: "setprefix",
  aliases: ["prefix", "changeprefix"],
  description: "Change the bot command prefix",
  category: "utility",
  ownerOnly: true,
  async execute(_0x35df8b, _0x10d546, _0x373b21, _0x2daf79, _0x35cf55) {
    const _0x375429 = _0x10d546.key.remoteJid;
    try {
      await _0x35df8b.sendMessage(_0x375429, {
        react: {
          text: "✏️",
          key: _0x10d546.key
        }
      });
    } catch {}
    const {
      isSudoUser: _0x2fd80a,
      isOwnerUser: _0x77bdf1
    } = _0x35cf55 || {};
    if (!_0x2fd80a && !_0x77bdf1) {
      const _0x5fb61b = require("../../config");
      const {
        isSudoNumber: _0x24989a
      } = require("../../lib/sudo-store");
      const _0x1d7a64 = (_0x10d546.key.participant || _0x10d546.key.remoteJid || "").split("@")[0].split(":")[0].replace(/[^0-9]/g, "");
      const _0x499cb7 = (_0x5fb61b.OWNER_NUMBER || "").replace(/[^0-9]/g, "");
      const _0x352825 = _0x5fb61b.CREATORS.includes(_0x1d7a64);
      if (_0x1d7a64 !== _0x499cb7 && !_0x24989a(_0x1d7a64) && !_0x352825) {
        return _0x35df8b.sendMessage(_0x375429, {
          text: "╔═|〔  SET PREFIX 〕\n║\n║ ▸ *Status* : ❌ Owner Only\n║\n╚═╝"
        }, {
          quoted: _0x10d546
        });
      }
    }
    const _0x36e598 = _0x373b21[0];
    if (!_0x36e598 || _0x36e598.length > 3) {
      return _0x35df8b.sendMessage(_0x375429, {
        text: "╔═|〔  SET PREFIX 〕\n║\n║ ▸ *Usage*   : " + _0x2daf79 + "setprefix <symbol>\n║ ▸ *Example* : " + _0x2daf79 + "setprefix !\n║\n╚═╝"
      }, {
        quoted: _0x10d546
      });
    }
    if (typeof globalThis.updatePrefixImmediately === "function") {
      globalThis.updatePrefixImmediately(_0x36e598);
    } else {
      const _0x333e1e = {
        prefix: _0x36e598,
        isPrefixless: false,
        setAt: new Date().toISOString(),
        timestamp: Date.now()
      };
      await setConfig("prefix_config", _0x333e1e);
      await setConfig("bot_settings", {
        prefix: _0x36e598,
        isPrefixless: false,
        prefixSetAt: new Date().toISOString()
      });
      process.env.PREFIX = _0x36e598;
      if (global.botConfig) {
        global.botConfig.PREFIX = _0x36e598;
      }
      global.prefix = _0x36e598;
      global.CURRENT_PREFIX = _0x36e598;
      global.isPrefixless = false;
    }
    await _0x35df8b.sendMessage(_0x375429, {
      text: "╔═|〔  SET PREFIX 〕\n║\n║ ▸ *New Prefix* : " + _0x36e598 + "\n║ ▸ *Status*     : ✅ Updated\n║\n╚═╝"
    }, {
      quoted: _0x10d546
    });
  }
};