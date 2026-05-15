'use strict';

const {
  checkPrivilege
} = require("../../lib/groupUtils");
const {
  getBotName
} = require("../../lib/botname");
module.exports = {
  name: "kickall",
  aliases: ["removeall", "cleargroup"],
  description: "Kick all non-admin members from the group (sudo/admin only)",
  category: "group",
  async execute(_0x58e349, _0x4eb90f, _0x174dbe, _0x4e2d70, _0x53a48f) {
    const _0x260d35 = _0x4eb90f.key.remoteJid;
    const _0x8ef257 = getBotName();
    try {
      await _0x58e349.sendMessage(_0x260d35, {
        react: {
          text: "🧹",
          key: _0x4eb90f.key
        }
      });
    } catch {}
    if (!_0x260d35.endsWith("@g.us")) {
      return _0x58e349.sendMessage(_0x260d35, {
        text: "╔═|〔  KICK ALL 〕\n║\n║ ▸ *Status* : ❌ Group only\n║\n╚═|〔 " + _0x8ef257 + " 〕"
      }, {
        quoted: _0x4eb90f
      });
    }
    const {
      ok: _0x149598
    } = await checkPrivilege(_0x58e349, _0x260d35, _0x4eb90f, _0x53a48f);
    if (!_0x149598) {
      return _0x58e349.sendMessage(_0x260d35, {
        text: "╔═|〔  KICK ALL 〕\n║\n║ ▸ *Status* : ❌ Permission denied\n║ ▸ *Reason* : Sudo users and group admins only\n║\n╚═|〔 " + _0x8ef257 + " 〕"
      }, {
        quoted: _0x4eb90f
      });
    }
    const _0x4e1cdd = _0x174dbe[0]?.toLowerCase();
    if (_0x4e1cdd !== "yes") {
      return _0x58e349.sendMessage(_0x260d35, {
        text: "╔═|〔  KICK ALL 〕\n║\n║ ▸ ⚠️ This will kick ALL non-admin\n║    members from the group!\n║\n║ ▸ *Confirm* : " + _0x4e2d70 + "kickall yes\n║\n╚═|〔 " + _0x8ef257 + " 〕"
      }, {
        quoted: _0x4eb90f
      });
    }
    try {
      const _0x1f60e5 = await _0x58e349.groupMetadata(_0x260d35);
      const _0x4e146c = (_0x58e349.user?.id || "").split("@")[0].split(":")[0];
      const _0x5f0c13 = _0x1f60e5.participants.filter(_0x333cdc => {
        if (_0x333cdc.admin) {
          return false;
        }
        const _0x1b278e = (_0x333cdc.id || "").split("@")[0].split(":")[0];
        return _0x1b278e !== _0x4e146c;
      });
      if (!_0x5f0c13.length) {
        return _0x58e349.sendMessage(_0x260d35, {
          text: "╔═|〔  KICK ALL 〕\n║\n║ ▸ No non-admin members to kick\n║\n╚═|〔 " + _0x8ef257 + " 〕"
        }, {
          quoted: _0x4eb90f
        });
      }
      await _0x58e349.sendMessage(_0x260d35, {
        text: "╔═|〔  KICK ALL 〕\n║\n║ ▸ Kicking " + _0x5f0c13.length + " member(s)...\n║\n╚═|〔 " + _0x8ef257 + " 〕"
      }, {
        quoted: _0x4eb90f
      });
      let _0x20b047 = 0;
      for (const _0x1b31bf of _0x5f0c13) {
        try {
          await _0x58e349.groupParticipantsUpdate(_0x260d35, [_0x1b31bf.id], "remove");
          _0x20b047++;
          await new Promise(_0x28b101 => setTimeout(_0x28b101, 700));
        } catch {}
      }
      await _0x58e349.sendMessage(_0x260d35, {
        text: "╔═|〔  KICK ALL 〕\n║\n║ ▸ *Kicked* : " + _0x20b047 + "/" + _0x5f0c13.length + "\n║ ▸ *Status* : ✅ Done\n║\n╚═|〔 " + _0x8ef257 + " 〕"
      });
    } catch (_0x532561) {
      const _0x332ee7 = /not-authorized|forbidden/i.test(_0x532561.message) ? "Bot is not an admin — promote the bot first" : _0x532561.message;
      await _0x58e349.sendMessage(_0x260d35, {
        text: "╔═|〔  KICK ALL 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x332ee7 + "\n║\n╚═|〔 " + _0x8ef257 + " 〕"
      }, {
        quoted: _0x4eb90f
      });
    }
  }
};