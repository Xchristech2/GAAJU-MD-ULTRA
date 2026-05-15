'use strict';

const {
  getBotName
} = require("../../lib/botname");
module.exports = {
  name: "unmute",
  aliases: ["open", "unlock", "unlockgroup", "unmutegrp"],
  description: "Unmute the group — all members can send messages (sudo/admin only)",
  category: "group",
  async execute(_0x475f7b, _0x33626d, _0x447e93, _0x1669e0, _0x5ce6a7) {
    const _0x687fe = _0x33626d.key.remoteJid;
    const _0x3e2533 = getBotName();
    try {
      await _0x475f7b.sendMessage(_0x687fe, {
        react: {
          text: "🔊",
          key: _0x33626d.key
        }
      });
    } catch {}
    if (!_0x687fe.endsWith("@g.us")) {
      return _0x475f7b.sendMessage(_0x687fe, {
        text: "╔═|〔  🔊 UNMUTE 〕\n║\n║ ▸ *Status* : ❌ Group only\n║\n╚═|〔 " + _0x3e2533 + " 〕"
      }, {
        quoted: _0x33626d
      });
    }
    let _0x59fb61 = _0x5ce6a7?.isOwnerUser || _0x5ce6a7?.isSudoUser;
    if (!_0x59fb61) {
      try {
        const _0x380f59 = await _0x475f7b.groupMetadata(_0x687fe);
        const _0xe0f265 = _0x33626d.key.participant || _0x33626d.key.remoteJid || "";
        const _0x2379f9 = _0xe0f265.replace(/:[\d]+@/, "@");
        const _0x1ad068 = _0xe0f265.split("@")[0].split(":")[0];
        const _0x5618d9 = _0xe0f265.split("@")[1] || "";
        _0x59fb61 = _0x380f59.participants.some(_0x4959f5 => {
          if (_0x4959f5.admin !== "admin" && _0x4959f5.admin !== "superadmin") {
            return false;
          }
          const _0x138fe3 = _0x4959f5.id || "";
          const _0x338bc6 = _0x138fe3.split("@")[1] || "";
          const _0x4fb900 = _0x138fe3.replace(/:[\d]+@/, "@");
          const _0x4a2b02 = _0x138fe3.split("@")[0].split(":")[0];
          return _0x138fe3 === _0xe0f265 || _0x4fb900 === _0x2379f9 || _0x4a2b02 === _0x1ad068 && _0x1ad068.length >= 5 && _0x338bc6 === _0x5618d9;
        });
      } catch {}
    }
    if (!_0x59fb61) {
      return _0x475f7b.sendMessage(_0x687fe, {
        text: "╔═|〔  🔊 UNMUTE 〕\n║\n║ ▸ *Status* : ❌ Permission denied\n║ ▸ *Reason* : Sudo users and group admins only\n║\n╚═|〔 " + _0x3e2533 + " 〕"
      }, {
        quoted: _0x33626d
      });
    }
    try {
      const _0x2827eb = await _0x475f7b.groupMetadata(_0x687fe);
      await _0x475f7b.groupSettingUpdate(_0x687fe, "not_announcement");
      await _0x475f7b.sendMessage(_0x687fe, {
        text: ["╔═|〔  🔊 UNMUTE 〕", "║", "║ ▸ *Group*  : " + _0x2827eb.subject, "║ ▸ *Status* : 🔊 Group unmuted", "║ ▸ *Effect* : All members can now send messages", "║", "╚═|〔 " + _0x3e2533 + " 〕"].join("\n")
      }, {
        quoted: _0x33626d
      });
    } catch (_0x584b13) {
      const _0x149087 = /not-authorized|forbidden/i.test(_0x584b13.message) ? "Bot is not an admin — promote the bot first" : _0x584b13.message;
      await _0x475f7b.sendMessage(_0x687fe, {
        text: "╔═|〔  🔊 UNMUTE 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x149087 + "\n║\n╚═|〔 " + _0x3e2533 + " 〕"
      }, {
        quoted: _0x33626d
      });
    }
  }
};