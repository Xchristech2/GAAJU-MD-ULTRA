'use strict';

const {
  checkPrivilege
} = require("../../lib/groupUtils");
const {
  getBotName
} = require("../../lib/botname");
module.exports = {
  name: "hidetag",
  aliases: ["htag", "silentall", "stag"],
  description: "Mention all members silently without showing tags (sudo/admin only)",
  category: "group",
  async execute(_0x452ba2, _0x2cda87, _0x5f37f8, _0xe4f7a2, _0x32b25e) {
    const _0x16bc7a = _0x2cda87.key.remoteJid;
    const _0x3078cb = getBotName();
    try {
      await _0x452ba2.sendMessage(_0x16bc7a, {
        react: {
          text: "📢",
          key: _0x2cda87.key
        }
      });
    } catch {}
    if (!_0x16bc7a.endsWith("@g.us")) {
      return _0x452ba2.sendMessage(_0x16bc7a, {
        text: "╔═|〔  HIDETAG 〕\n║\n║ ▸ *Status* : ❌ Group only\n║\n╚═|〔 " + _0x3078cb + " 〕"
      }, {
        quoted: _0x2cda87
      });
    }
    const {
      ok: _0x4696c3
    } = await checkPrivilege(_0x452ba2, _0x16bc7a, _0x2cda87, _0x32b25e);
    if (!_0x4696c3) {
      return _0x452ba2.sendMessage(_0x16bc7a, {
        text: "╔═|〔  HIDETAG 〕\n║\n║ ▸ *Status* : ❌ Permission denied\n║ ▸ *Reason* : Sudo users and group admins only\n║\n╚═|〔 " + _0x3078cb + " 〕"
      }, {
        quoted: _0x2cda87
      });
    }
    const _0x150676 = _0x5f37f8.join(" ").trim() || "📢 Attention everyone!";
    try {
      const _0x192cb7 = await _0x452ba2.groupMetadata(_0x16bc7a);
      const _0x1ecfc0 = _0x192cb7.participants.map(_0x41dcd5 => _0x41dcd5.id);
      await _0x452ba2.sendMessage(_0x16bc7a, {
        text: _0x150676,
        mentions: _0x1ecfc0
      });
    } catch (_0x41d64b) {
      await _0x452ba2.sendMessage(_0x16bc7a, {
        text: "╔═|〔  HIDETAG 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x41d64b.message + "\n║\n╚═|〔 " + _0x3078cb + " 〕"
      }, {
        quoted: _0x2cda87
      });
    }
  }
};