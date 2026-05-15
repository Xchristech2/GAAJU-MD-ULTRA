'use strict';

const {
  getBotName
} = require("../../lib/botname");
module.exports = {
  name: "del",
  aliases: ["delete", "unsend", "rm"],
  description: "Delete a quoted message",
  category: "utility",
  async execute(_0x4bd12e, _0x595d2a, _0x5acb66, _0x4780cf, _0x558292) {
    const _0x3c5c63 = _0x595d2a.key.remoteJid;
    const _0xda6fb1 = _0x3c5c63.endsWith("@g.us");
    const _0x4aab17 = getBotName();
    const _0x3eaf2d = _0x558292.isOwner();
    const _0x1d9afe = _0x558292.isSudo();
    const _0x4b61e3 = _0x595d2a.message?.extendedTextMessage?.contextInfo || _0x595d2a.message?.imageMessage?.contextInfo || _0x595d2a.message?.videoMessage?.contextInfo || _0x595d2a.message?.audioMessage?.contextInfo || _0x595d2a.message?.documentMessage?.contextInfo || _0x595d2a.message?.stickerMessage?.contextInfo;
    if (!_0x4b61e3?.stanzaId) {
      return _0x4bd12e.sendMessage(_0x3c5c63, {
        text: "╔═|〔  DEL 〕\n║\n║ ▸ *Usage*  : Reply to a message\n║             with *" + _0x4780cf + "del*\n║ ▸ *Access* : Owner · Sudo · Admins\n║\n╚═|〔 " + _0x4aab17 + " 〕"
      }, {
        quoted: _0x595d2a
      });
    }
    let _0x522096 = _0x3eaf2d || _0x1d9afe;
    if (!_0x522096 && _0xda6fb1) {
      try {
        const _0x50831d = await _0x4bd12e.groupMetadata(_0x3c5c63);
        const _0x111786 = _0x595d2a.key.participant || _0x595d2a.key.remoteJid;
        const _0xc04ece = _0x4bd12e.user?.id?.replace(/:\d+/, "") + "@s.whatsapp.net";
        const _0x315b81 = _0x50831d.participants.find(_0x526d83 => _0x526d83.id === _0xc04ece || _0x526d83.id?.split(":")[0] + "@s.whatsapp.net" === _0xc04ece);
        const _0x1c03d6 = _0x315b81?.admin === "admin" || _0x315b81?.admin === "superadmin";
        const _0x58064c = _0x50831d.participants.find(_0x5eeaff => _0x5eeaff.id === _0x111786);
        const _0x15be52 = _0x58064c?.admin === "admin" || _0x58064c?.admin === "superadmin";
        if (_0x15be52 && _0x1c03d6) {
          _0x522096 = true;
        }
      } catch {}
    }
    if (!_0x522096) {
      try {
        await _0x4bd12e.sendMessage(_0x3c5c63, {
          react: {
            text: "🚫",
            key: _0x595d2a.key
          }
        });
      } catch {}
      return _0x4bd12e.sendMessage(_0x3c5c63, {
        text: "╔═|〔  DEL 〕\n║\n║ ▸ *Status* : ❌ Permission denied\n║ ▸ *Access* : Owner · Sudo · Admins\n║\n╚═|〔 " + _0x4aab17 + " 〕"
      }, {
        quoted: _0x595d2a
      });
    }
    const _0x206f4f = _0x4b61e3.participant || _0x4b61e3.remoteJid || _0x3c5c63;
    const _0x19ee63 = (_0x4bd12e.user?.id?.replace(/:\d+/, "") || "") + "@s.whatsapp.net";
    const _0x4bfe57 = _0x206f4f === _0x19ee63 || _0x4b61e3.participant === _0x4bd12e.user?.id;
    const _0x18ed89 = {
      remoteJid: _0x3c5c63,
      id: _0x4b61e3.stanzaId,
      participant: _0xda6fb1 ? _0x206f4f : undefined,
      fromMe: _0x4bfe57
    };
    try {
      await _0x4bd12e.sendMessage(_0x3c5c63, {
        delete: _0x18ed89
      });
    } catch (_0x403f72) {
      try {
        await _0x4bd12e.sendMessage(_0x3c5c63, {
          react: {
            text: "❌",
            key: _0x595d2a.key
          }
        });
      } catch {}
      return _0x4bd12e.sendMessage(_0x3c5c63, {
        text: "╔═|〔  DEL 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x403f72.message + "\n║\n╚═|〔 " + _0x4aab17 + " 〕"
      }, {
        quoted: _0x595d2a
      });
    }
    try {
      await _0x4bd12e.sendMessage(_0x3c5c63, {
        delete: _0x595d2a.key
      });
    } catch {}
  }
};