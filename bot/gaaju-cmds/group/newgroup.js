'use strict';

module.exports = {
  name: "newgroup",
  aliases: ["creategroup", "makegroup", "mkgroup"],
  description: "Create a new WhatsApp group with mentioned members",
  category: "group",
  async execute(_0x48d6ab, _0x564eb6, _0x211a97, _0x59cf82, _0x20cf3f) {
    const _0x3d51e9 = _0x564eb6.key.remoteJid;
    try {
      await _0x48d6ab.sendMessage(_0x3d51e9, {
        react: {
          text: "👥",
          key: _0x564eb6.key
        }
      });
    } catch {}
    const _0x1b4035 = _0x211a97.join(" ").replace(/@\d+/g, "").trim();
    if (!_0x1b4035) {
      return _0x48d6ab.sendMessage(_0x3d51e9, {
        text: "╔═|〔  NEW GROUP 〕\n║\n║ ▸ *Usage* : " + _0x59cf82 + "newgroup <name> @members\n║ ▸ Example : " + _0x59cf82 + "newgroup Study Group @member1 @member2\n║\n╚═╝"
      }, {
        quoted: _0x564eb6
      });
    }
    const _0x463a52 = _0x564eb6.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (_0x463a52.length === 0) {
      return _0x48d6ab.sendMessage(_0x3d51e9, {
        text: "╔═|〔  NEW GROUP 〕\n║\n║ ▸ Mention at least one member\n║ ▸ *Usage* : " + _0x59cf82 + "newgroup <name> @member\n║\n╚═╝"
      }, {
        quoted: _0x564eb6
      });
    }
    const _0x560eea = _0x564eb6.key.participant || _0x564eb6.key.remoteJid;
    const _0x331ea8 = [...new Set([_0x560eea, ..._0x463a52])];
    try {
      const _0x11083d = await _0x48d6ab.groupCreate(_0x1b4035, _0x331ea8);
      const _0x16b99d = _0x11083d.id;
      const _0x132515 = await _0x48d6ab.groupInviteCode(_0x16b99d).then(_0x1598d4 => "https://chat.whatsapp.com/" + _0x1598d4).catch(() => "N/A");
      await _0x48d6ab.sendMessage(_0x3d51e9, {
        text: "╔═|〔  NEW GROUP 〕\n║\n║ ▸ ✅ Group created!\n║\n║ ▸ *Name* : " + _0x1b4035 + "\n║ ▸ *Members* : " + _0x331ea8.length + "\n║ ▸ *Link* : " + _0x132515 + "\n║\n╚═╝"
      }, {
        quoted: _0x564eb6
      });
      try {
        await _0x48d6ab.sendMessage(_0x16b99d, {
          text: "👋 Welcome to *" + _0x1b4035 + "*!\n\nThis group was created by the bot.\n\n" + _0x132515
        });
      } catch {}
    } catch (_0x50410d) {
      await _0x48d6ab.sendMessage(_0x3d51e9, {
        text: "╔═|〔  NEW GROUP 〕\n║\n║ ▸ ❌ Failed to create group\n║ ▸ " + (_0x50410d.message || _0x50410d) + "\n║\n╚═╝"
      }, {
        quoted: _0x564eb6
      });
    }
  }
};