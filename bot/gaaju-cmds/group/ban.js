'use strict';

const {
  getTarget,
  resolveDisplay,
  checkPrivilege
} = require("../../lib/groupUtils");

const {
  getBotName
} = require("../../lib/botname");

module.exports = {
  name: "ban",
  aliases: ["kick", "remove"],
  description: "Remove a member from the group (sudo/admin only)",
  category: "group",

  async execute(_0x5150ef, _0x48b3cc, _0x2c4160, _0x1a349c, _0x5da54a) {

    const _0x4d5d09 = _0x48b3cc.key.remoteJid;
    const _0x492bfb = getBotName();

    try {
      await _0x5150ef.sendMessage(_0x4d5d09, {
        react: {
          text: "🔨",
          key: _0x48b3cc.key
        }
      });
    } catch {}

    if (!_0x4d5d09.endsWith("@g.us")) {
      return _0x5150ef.sendMessage(_0x4d5d09, {
        text:
          `╭━━━〔 🚫 BAN 〕━━━⬣
┃
┃ ✦ Status : ❌ Group Only
┃
╰━━━━━━━━━━━━━━━〔 ${_0x492bfb} 〕⬣`,

        
        quoted: _0x48b3cc
      });
    }

    const { ok: _0x22c382 } =
      await checkPrivilege(_0x5150ef, _0x4d5d09, _0x48b3cc, _0x5da54a);

    if (!_0x22c382) {
      return _0x5150ef.sendMessage(_0x4d5d09, {
        text:
          `╭━━━〔 🚫 BAN 〕━━━⬣
┃
┃ ✦ Status : ❌ Permission Denied
┃ ✦ Reason : Sudo Users & Group Admins Only
┃
╰━━━━━━━━━━━━━━━〔 ${_0x492bfb} 〕⬣`,

        
        quoted: _0x48b3cc
      });
    }

    const _0xf2338b = getTarget(_0x48b3cc, _0x2c4160);

    if (!_0xf2338b) {
      return _0x5150ef.sendMessage(_0x4d5d09, {
        text:
          `╭━━━〔 🚫 BAN 〕━━━⬣
┃
┃ ✦ Usage : ${_0x1a349c}ban @user
┃ ✦         or reply to a message
┃
╰━━━━━━━━━━━━━━━〔 ${_0x492bfb} 〕⬣`,

        
        quoted: _0x48b3cc
      });
    }

    try {
      const _0x445f1f = await resolveDisplay(_0x5150ef, _0x4d5d09, _0xf2338b);

      await _0x5150ef.groupParticipantsUpdate(
        _0x4d5d09,
        [_0xf2338b],
        "remove"
      );

      await _0x5150ef.sendMessage(_0x4d5d09, {
        text:
          `╭━━━〔 🚫 BAN 〕━━━⬣
┃
┃ ✦ User   : ${_0x445f1f}
┃ ✦ Status : ✅ Removed from Group
┃
╰━━━━━━━━━━━━━━━〔 ${_0x492bfb} 〕⬣`,

        
        quoted: _0x48b3cc
      });

    } catch (_0x5b9e58) {

      const _0x32c9fd =
        /not-authorized|forbidden/i.test(_0x5b9e58.message)
          ? "Bot is not an admin — promote the bot first"
          : _0x5b9e58.message;

      await _0x5150ef.sendMessage(_0x4d5d09, {
        text:
          `╭━━━〔 🚫 BAN 〕━━━⬣
┃
┃ ✦ Status : ❌ Failed
┃ ✦ Reason : ${_0x32c9fd}
┃
╰━━━━━━━━━━━━━━━〔 ${_0x492bfb} 〕⬣`,

        
        quoted: _0x48b3cc
      });
    }
  }
};
