'use strict';

const {
  removeSudoNumber,
  getSudoList
} = require("../../lib/sudo-store");
const {
  getBotName
} = require("../../lib/botname");
const H = "╔═|〔  DEL SUDO 〕";
const F = () => "╚═|〔 " + getBotName() + " 〕";
function resolveRealNumber(_0x2d1583, _0x3aa46e) {
  if (!_0x2d1583) {
    return null;
  }
  if (!_0x2d1583.includes("@lid")) {
    const _0x5556b0 = _0x2d1583.split("@")[0].split(":")[0].replace(/[^0-9]/g, "");
    if (_0x5556b0 && _0x5556b0.length >= 7 && _0x5556b0.length <= 15) {
      return _0x5556b0;
    } else {
      return null;
    }
  }
  if (_0x3aa46e) {
    try {
      if (_0x3aa46e.signalRepository?.lidMapping?.getPNForLID) {
        const _0xe5bf1a = _0x3aa46e.signalRepository.lidMapping.getPNForLID(_0x2d1583);
        if (_0xe5bf1a) {
          const _0x529ac5 = String(_0xe5bf1a).split("@")[0].replace(/[^0-9]/g, "");
          if (_0x529ac5.length >= 7) {
            return _0x529ac5;
          }
        }
      }
    } catch {}
  }
  return null;
}
module.exports = {
  name: "delsudo",
  aliases: ["removesudo", "unsudo"],
  description: "Remove a user from the sudo list",
  category: "owner",
  ownerOnly: true,
  sudoAllowed: false,
  async execute(_0x585f99, _0x502f2b, _0x262b41, _0x69663, _0x2ffa0e) {
    const _0x3f4513 = _0x502f2b.key.remoteJid;
    const _0x40811d = getBotName();
    try {
      await _0x585f99.sendMessage(_0x3f4513, {
        react: {
          text: "🗑️",
          key: _0x502f2b.key
        }
      });
    } catch {}
    if (!_0x2ffa0e.isOwner()) {
      return _0x585f99.sendMessage(_0x3f4513, {
        text: H + "\n║\n║ ▸ *Status* : ❌ Owner only command\n║\n" + F()
      }, {
        quoted: _0x502f2b
      });
    }
    const _0x1fc024 = _0x502f2b.message?.extendedTextMessage?.contextInfo?.participant;
    const _0x3118e6 = _0x502f2b.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    let _0x11ec5c = null;
    if (_0x1fc024) {
      const _0x21c42b = resolveRealNumber(_0x1fc024, _0x585f99);
      _0x11ec5c = _0x21c42b || _0x262b41[0]?.replace(/[^0-9]/g, "") || null;
    } else if (_0x3118e6) {
      const _0x2c61cb = resolveRealNumber(_0x3118e6, _0x585f99);
      _0x11ec5c = _0x2c61cb || _0x262b41[0]?.replace(/[^0-9]/g, "") || null;
    } else if (_0x262b41[0]) {
      _0x11ec5c = _0x262b41[0].replace(/[^0-9]/g, "");
    }
    if (!_0x11ec5c || _0x11ec5c.length < 7) {
      const {
        sudoers: _0x346a92
      } = getSudoList();
      const _0x26d8cc = _0x346a92.length ? _0x346a92.map((_0x2a459a, _0x58d6e9) => "║  " + (_0x58d6e9 + 1) + ". +" + _0x2a459a).join("\n") : "║  (none)";
      return _0x585f99.sendMessage(_0x3f4513, {
        text: H + "\n║\n║ ▸ *Usage*   : " + _0x69663 + "delsudo <number>\n║ ▸ *Reply*   : reply a message + " + _0x69663 + "delsudo\n║ ▸ *Mention* : @tag someone + " + _0x69663 + "delsudo\n║\n║ 📋 *Current sudo list:*\n" + _0x26d8cc + "\n║\n" + F()
      }, {
        quoted: _0x502f2b
      });
    }
    const {
      sudoers: _0x22199f
    } = getSudoList();
    if (!_0x22199f.includes(_0x11ec5c)) {
      return _0x585f99.sendMessage(_0x3f4513, {
        text: H + "\n║\n║ ▸ *Number* : +" + _0x11ec5c + "\n║ ▸ *Status* : ⚠️ Not in sudo list\n║\n" + F()
      }, {
        quoted: _0x502f2b
      });
    }
    removeSudoNumber(_0x11ec5c);
    const {
      sudoers: _0x39bf8d
    } = getSudoList();
    if (!_0x39bf8d.includes(_0x11ec5c)) {
      return _0x585f99.sendMessage(_0x3f4513, {
        text: H + "\n║\n║ ▸ *Number* : +" + _0x11ec5c + "\n║ ▸ *Status* : ✅ Removed from sudo list\n║ ▸ *Access* : Revoked\n║\n" + F()
      }, {
        quoted: _0x502f2b
      });
    }
    return _0x585f99.sendMessage(_0x3f4513, {
      text: H + "\n║\n║ ▸ *Number* : +" + _0x11ec5c + "\n║ ▸ *Status* : ❌ Failed to remove\n║\n" + F()
    }, {
      quoted: _0x502f2b
    });
  }
};