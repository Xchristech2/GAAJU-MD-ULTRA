module.exports = {
  name: "glink",
  aliases: ["grouplink", "invitelink"],
  description: "Get group invite link",
  category: "group",
  async execute(_0x504aea, _0x1bfe04, _0x556719, _0x5b14d4, _0x4bf92a) {
    const _0x20fb65 = _0x1bfe04.key.remoteJid;
    try {
      await _0x504aea.sendMessage(_0x20fb65, {
        react: {
          text: "🔗",
          key: _0x1bfe04.key
        }
      });
    } catch {}
    if (!_0x20fb65.endsWith("@g.us")) {
      return _0x504aea.sendMessage(_0x20fb65, {
        text: "╔═|〔  LINK 〕\n║\n║ ▸ Group only command\n║\n╚═╝"
      }, {
        quoted: _0x1bfe04
      });
    }
    try {
      const _0x446955 = await _0x504aea.groupInviteCode(_0x20fb65);
      const _0x426236 = "https://chat.whatsapp.com/" + _0x446955;
      await _0x504aea.sendMessage(_0x20fb65, {
        text: "╔═|〔  GROUP LINK 〕\n║\n║ ▸ *Link* : " + _0x426236 + "\n║\n╚═╝"
      }, {
        quoted: _0x1bfe04
      });
    } catch (_0x5307e6) {
      await _0x504aea.sendMessage(_0x20fb65, {
        text: "╔═|〔  LINK 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x5307e6.message + "\n║\n╚═╝"
      }, {
        quoted: _0x1bfe04
      });
    }
  }
};