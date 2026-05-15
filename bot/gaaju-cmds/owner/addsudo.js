'use strict';

const {
  addSudo,
  mapLidToPhone,
  getSudoList
} = require("../../lib/sudo-store");
const {
  getBotName
} = require("../../lib/botname");
const H = "╔═|〔  ADD SUDO 〕";
const F = () => "╚═|〔 " + getBotName() + " 〕";
function resolveRealNumber(_0x370bc0, _0x4cb3b6) {
  if (!_0x370bc0) {
    return null;
  }
  if (!_0x370bc0.includes("@lid")) {
    const _0x3deb81 = _0x370bc0.split("@")[0].split(":")[0].replace(/[^0-9]/g, "");
    if (_0x3deb81 && _0x3deb81.length >= 7 && _0x3deb81.length <= 15) {
      return _0x3deb81;
    } else {
      return null;
    }
  }
  if (_0x4cb3b6) {
    try {
      if (_0x4cb3b6.signalRepository?.lidMapping?.getPNForLID) {
        const _0x1bd341 = _0x4cb3b6.signalRepository.lidMapping.getPNForLID(_0x370bc0);
        if (_0x1bd341) {
          const _0x42947a = String(_0x1bd341).split("@")[0].replace(/[^0-9]/g, "");
          if (_0x42947a.length >= 7) {
            return _0x42947a;
          }
        }
      }
    } catch {}
  }
  return null;
}
module.exports = {
  name: "addsudo",
  aliases: ["sudo"],
  description: "Add a user to the sudo list (trusted users with owner-level access)",
  category: "owner",
  ownerOnly: true,
  sudoAllowed: false,
  async execute(_0x52715f, _0x372d29, _0x16ec29, _0x3efd34, _0x28758c) {
    const _0x2c4d03 = _0x372d29.key.remoteJid;
    try {
      await _0x52715f.sendMessage(_0x2c4d03, {
        react: {
          text: "🛡️",
          key: _0x372d29.key
        }
      });
    } catch {}
    const _0x42532d = getBotName();
    if (!_0x28758c.isOwner()) {
      return _0x52715f.sendMessage(_0x2c4d03, {
        text: "╔═|〔  ADD SUDO 〕\n║\n║ ▸ *Status* : ❌ Owner only command\n║\n╚═|〔 " + _0x42532d + " 〕"
      }, {
        quoted: _0x372d29
      });
    }
    const _0x31f8ad = _0x372d29.message?.extendedTextMessage?.contextInfo?.participant;
    const _0x269316 = _0x372d29.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    let _0x3c3a39 = null;
    let _0x4190c2 = null;
    if (_0x31f8ad) {
      const _0x558cca = resolveRealNumber(_0x31f8ad, _0x52715f);
      if (_0x558cca) {
        _0x3c3a39 = _0x558cca;
      } else if (_0x16ec29[0]) {
        _0x3c3a39 = _0x16ec29[0].replace(/[^0-9]/g, "");
      } else {
        return _0x52715f.sendMessage(_0x2c4d03, {
          text: H + "\n║\n║ ▸ *Usage*  : " + _0x3efd34 + "addsudo <number>\n║ ▸ *Reply*  : reply a message + " + _0x3efd34 + "addsudo\n║\n╚═╝"
        }, {
          quoted: _0x372d29
        });
      }
      if (_0x31f8ad.includes("@lid")) {
        _0x4190c2 = _0x31f8ad.split("@")[0].split(":")[0];
      }
    } else if (_0x269316) {
      const _0x454a42 = resolveRealNumber(_0x269316, _0x52715f);
      _0x3c3a39 = _0x454a42 || _0x16ec29[0]?.replace(/[^0-9]/g, "") || null;
    } else if (_0x16ec29[0]) {
      _0x3c3a39 = _0x16ec29[0].replace(/[^0-9]/g, "");
    }
    if (!_0x3c3a39 || _0x3c3a39.length < 7) {
      return _0x52715f.sendMessage(_0x2c4d03, {
        text: H + "\n║\n║ ▸ *Usage*   : " + _0x3efd34 + "addsudo <number>\n║ ▸ *Reply*   : reply a message + " + _0x3efd34 + "addsudo\n║ ▸ *Mention* : @tag someone + " + _0x3efd34 + "addsudo\n║\n╚═╝"
      }, {
        quoted: _0x372d29
      });
    }
    const _0x306c7a = (_0x28758c.OWNER_NUMBER || "").replace(/[^0-9]/g, "");
    if (_0x3c3a39 === _0x306c7a) {
      return _0x52715f.sendMessage(_0x2c4d03, {
        text: H + "\n║\n║ ▸ *Status* : You are already the owner\n║\n╚═╝"
      }, {
        quoted: _0x372d29
      });
    }
    const _0x1b85c6 = addSudo(_0x3c3a39, _0x4190c2);
    if (_0x4190c2 && _0x4190c2 !== _0x3c3a39) {
      mapLidToPhone(_0x4190c2, _0x3c3a39);
    }
    if (_0x1b85c6.success) {
      return _0x52715f.sendMessage(_0x2c4d03, {
        text: H + "\n║\n║ ▸ *Number* : +" + _0x1b85c6.number + "\n║ ▸ *Status* : ✅ Added to sudo list\n║ ▸ *Access* : Owner-level commands\n" + (_0x4190c2 ? "║ ▸ *LID*    : Linked ✅\n" : "") + "║\n" + F()
      }, {
        quoted: _0x372d29
      });
    }
    if (_0x1b85c6.reason === "Already a sudo user") {
      return _0x52715f.sendMessage(_0x2c4d03, {
        text: H + "\n║\n║ ▸ *Number* : +" + _0x1b85c6.number + "\n║ ▸ *Status* : Already a sudo user" + (_0x4190c2 ? "\n║ ▸ *LID*    : Re-linked ✅" : "") + "\n║\n╚═╝"
      }, {
        quoted: _0x372d29
      });
    }
    return _0x52715f.sendMessage(_0x2c4d03, {
      text: H + "\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x1b85c6.reason + "\n║\n╚═╝"
    }, {
      quoted: _0x372d29
    });
  }
};