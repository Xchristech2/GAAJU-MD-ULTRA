module.exports = {
  name: "add",
  aliases: ["addmember", "adduser"],
  description: "Add a member to the group",
  category: "group",
  async execute(_0x198f04, _0x40d7cc, _0x2f2e5c, _0x206808, _0x112397) {
    const _0x412920 = _0x40d7cc.key.remoteJid;
    try {
      await _0x198f04.sendMessage(_0x412920, {
        react: {
          text: "➕",
          key: _0x40d7cc.key
        }
      });
    } catch {}
    if (!_0x412920.endsWith("@g.us")) {
      return _0x198f04.sendMessage(_0x412920, {
        text: "╔═|〔  ADD 〕\n║\n║ ▸ Group only command\n║\n╚═╝"
      }, {
        quoted: _0x40d7cc
      });
    }
    const _0x2b48aa = (_0x2f2e5c[0] || "").replace(/[^0-9]/g, "");
    if (!_0x2b48aa || _0x2b48aa.length < 7) {
      return _0x198f04.sendMessage(_0x412920, {
        text: "╔═|〔  ADD 〕\n║\n║ ▸ *Usage*   : " + _0x206808 + "add <phone>\n║ ▸ *Example* : " + _0x206808 + "add 254712345678\n║\n╚═╝"
      }, {
        quoted: _0x40d7cc
      });
    }
    const _0x4b39b2 = _0x2b48aa + "@s.whatsapp.net";
    try {
      const _0x3f7b43 = await _0x198f04.groupParticipantsUpdate(_0x412920, [_0x4b39b2], "add");
      const _0x37806a = _0x3f7b43?.[0]?.status;
      const _0x55fab8 = _0x37806a === "200" ? "✅ Added successfully" : _0x37806a === "403" ? "❌ Blocked by privacy settings" : _0x37806a === "408" ? "❌ Number not on WhatsApp" : _0x37806a === "409" ? "⚠️ Already in group" : "Code: " + _0x37806a;
      await _0x198f04.sendMessage(_0x412920, {
        text: "╔═|〔  ADD 〕\n║\n║ ▸ *User*   : +" + _0x2b48aa + "\n║ ▸ *Status* : " + _0x55fab8 + "\n║\n╚═╝"
      }, {
        quoted: _0x40d7cc
      });
    } catch (_0x3d2faa) {
      await _0x198f04.sendMessage(_0x412920, {
        text: "╔═|〔  ADD 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x3d2faa.message + "\n║\n╚═╝"
      }, {
        quoted: _0x40d7cc
      });
    }
  }
};