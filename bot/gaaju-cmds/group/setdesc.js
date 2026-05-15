'use strict';

const {
  checkPrivilege
} = require("../../lib/groupUtils");
const {
  getBotName
} = require("../../lib/botname");
module.exports = {
  name: "setdesc",
  aliases: ["groupdesc", "setgroupdesc", "description"],
  description: "Change the group description (sudo/admin only)",
  category: "group",
  async execute(_0x186e6a, _0x4def2f, _0x4cdb0c, _0x4a9b32, _0x138b2a) {
    const _0x444563 = _0x4def2f.key.remoteJid;
    const _0x359e31 = getBotName();
    try {
      await _0x186e6a.sendMessage(_0x444563, {
        react: {
          text: "📝",
          key: _0x4def2f.key
        }
      });
    } catch {}
    if (!_0x444563.endsWith("@g.us")) {
      return _0x186e6a.sendMessage(_0x444563, {
        text: "╔═|〔  SET DESC 〕\n║\n║ ▸ *Status* : ❌ Group only\n║\n╚═|〔 " + _0x359e31 + " 〕"
      }, {
        quoted: _0x4def2f
      });
    }
    const {
      ok: _0x41ec46
    } = await checkPrivilege(_0x186e6a, _0x444563, _0x4def2f, _0x138b2a);
    if (!_0x41ec46) {
      return _0x186e6a.sendMessage(_0x444563, {
        text: "╔═|〔  SET DESC 〕\n║\n║ ▸ *Status* : ❌ Permission denied\n║ ▸ *Reason* : Sudo users and group admins only\n║\n╚═|〔 " + _0x359e31 + " 〕"
      }, {
        quoted: _0x4def2f
      });
    }
    const _0x231373 = _0x4cdb0c.join(" ").trim();
    if (!_0x231373) {
      return _0x186e6a.sendMessage(_0x444563, {
        text: "╔═|〔  SET DESC 〕\n║\n║ ▸ *Usage* : " + _0x4a9b32 + "setdesc <description>\n║\n╚═|〔 " + _0x359e31 + " 〕"
      }, {
        quoted: _0x4def2f
      });
    }
    try {
      await _0x186e6a.groupUpdateDescription(_0x444563, _0x231373);
      await _0x186e6a.sendMessage(_0x444563, {
        text: "╔═|〔  SET DESC 〕\n║\n║ ▸ *Desc*   : " + _0x231373.slice(0, 80) + (_0x231373.length > 80 ? "..." : "") + "\n║ ▸ *Status* : ✅ Updated\n║\n╚═|〔 " + _0x359e31 + " 〕"
      }, {
        quoted: _0x4def2f
      });
    } catch (_0x4cae29) {
      await _0x186e6a.sendMessage(_0x444563, {
        text: "╔═|〔  SET DESC 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x4cae29.message + "\n║\n╚═|〔 " + _0x359e31 + " 〕"
      }, {
        quoted: _0x4def2f
      });
    }
  }
};