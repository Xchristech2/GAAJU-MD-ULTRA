const {
  setBotName
} = require("../../lib/botname");
module.exports = {
  name: "setbotname",
  aliases: ["botname", "rename"],
  description: "Change the bot display name",
  category: "utility",
  ownerOnly: true,
  async execute(_0x37cf0c, _0x5ed07b, _0x54e6c2, _0x12212b, _0x560853) {
    const _0x2f8387 = _0x5ed07b.key.remoteJid;
    try {
      await _0x37cf0c.sendMessage(_0x2f8387, {
        react: {
          text: "🏷️",
          key: _0x5ed07b.key
        }
      });
    } catch {}
    const {
      isSudoUser: _0x563559,
      isOwnerUser: _0x1c92e8
    } = _0x560853 || {};
    if (!_0x563559 && !_0x1c92e8) {
      const _0x220f7c = require("../../config");
      const {
        isSudoNumber: _0x162e41
      } = require("../../lib/sudo-store");
      const _0x50b805 = (_0x5ed07b.key.participant || _0x5ed07b.key.remoteJid || "").split("@")[0].split(":")[0].replace(/[^0-9]/g, "");
      const _0x7dbf33 = (_0x220f7c.OWNER_NUMBER || "").replace(/[^0-9]/g, "");
      const _0x2c5f97 = _0x220f7c.CREATORS.includes(_0x50b805);
      if (_0x50b805 !== _0x7dbf33 && !_0x162e41(_0x50b805) && !_0x2c5f97) {
        return _0x37cf0c.sendMessage(_0x2f8387, {
          text: "╔═|〔  SET BOT NAME 〕\n║\n║ ▸ *Status* : ❌ Owner Only\n║\n╚═╝"
        }, {
          quoted: _0x5ed07b
        });
      }
    }
    const _0x4731fe = _0x54e6c2.join(" ").trim();
    if (!_0x4731fe) {
      return _0x37cf0c.sendMessage(_0x2f8387, {
        text: "╔═|〔  SET BOT NAME 〕\n║\n║ ▸ *Usage* : " + _0x12212b + "setbotname <name>\n║\n╚═╝"
      }, {
        quoted: _0x5ed07b
      });
    }
    setBotName(_0x4731fe);
    await _0x37cf0c.sendMessage(_0x2f8387, {
      text: "╔═|〔  SET BOT NAME 〕\n║\n║ ▸ *New Name* : " + _0x4731fe + "\n║ ▸ *Status*   : ✅ Updated\n║\n╚═╝"
    }, {
      quoted: _0x5ed07b
    });
  }
};