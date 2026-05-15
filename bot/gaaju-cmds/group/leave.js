'use strict';

const {
  getBotName
} = require("../../lib/botname");
module.exports = {
  name: "leave",
  aliases: ["leavegroup", "botleave"],
  description: "Bot leaves the current group (owner/sudo only)",
  category: "group",
  async execute(_0x19c1cc, _0x15b1bf, _0x3ed9ba, _0x6497e, _0x57d311) {
    const _0x4dda40 = _0x15b1bf.key.remoteJid;
    const _0x317414 = getBotName();
    try {
      await _0x19c1cc.sendMessage(_0x4dda40, {
        react: {
          text: "👋",
          key: _0x15b1bf.key
        }
      });
    } catch {}
    if (!_0x4dda40.endsWith("@g.us")) {
      return _0x19c1cc.sendMessage(_0x4dda40, {
        text: "╔═|〔  LEAVE 〕\n║\n║ ▸ *Status* : ❌ Group only\n║\n╚═|〔 " + _0x317414 + " 〕"
      }, {
        quoted: _0x15b1bf
      });
    }
    if (!_0x57d311?.isOwnerUser && !_0x57d311?.isSudoUser) {
      return _0x19c1cc.sendMessage(_0x4dda40, {
        text: "╔═|〔  LEAVE 〕\n║\n║ ▸ *Status* : ❌ Permission denied\n║ ▸ *Reason* : Owner / sudo users only\n║\n╚═|〔 " + _0x317414 + " 〕"
      }, {
        quoted: _0x15b1bf
      });
    }
    try {
      await _0x19c1cc.sendMessage(_0x4dda40, {
        text: "╔═|〔  LEAVE 〕\n║\n║ ▸ Goodbye everyone! 👋\n║ ▸ " + _0x317414 + " signing off...\n║\n╚═|〔 " + _0x317414 + " 〕"
      });
      await new Promise(_0x4183c8 => setTimeout(_0x4183c8, 1500));
      await _0x19c1cc.groupLeave(_0x4dda40);
    } catch (_0x487ea6) {
      await _0x19c1cc.sendMessage(_0x4dda40, {
        text: "╔═|〔  LEAVE 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x487ea6.message + "\n║\n╚═|〔 " + _0x317414 + " 〕"
      }, {
        quoted: _0x15b1bf
      });
    }
  }
};