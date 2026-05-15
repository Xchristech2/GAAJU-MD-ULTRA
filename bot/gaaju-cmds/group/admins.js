const {
  resolveDisplayWithName
} = require("../../lib/groupUtils");
module.exports = {
  name: "admins",
  aliases: ["listadmins", "groupadmins", "admin"],
  description: "List all group admins",
  category: "group",
  async execute(_0x525ebb, _0x3616aa, _0x5d3c4d, _0x5cc8aa, _0x22b405) {
    const _0x6a4818 = _0x3616aa.key.remoteJid;
    try {
      await _0x525ebb.sendMessage(_0x6a4818, {
        react: {
          text: "👑",
          key: _0x3616aa.key
        }
      });
    } catch {}
    if (!_0x6a4818.endsWith("@g.us")) {
      return _0x525ebb.sendMessage(_0x6a4818, {
        text: "╔═|〔  ADMINS 〕\n║\n║ ▸ Group only command\n║\n╚═╝"
      }, {
        quoted: _0x3616aa
      });
    }
    try {
      const _0x276ebc = await _0x525ebb.groupMetadata(_0x6a4818);
      const _0x453d7b = _0x276ebc.participants.filter(_0xea7d8b => _0xea7d8b.admin === "admin" || _0xea7d8b.admin === "superadmin");
      if (!_0x453d7b.length) {
        return _0x525ebb.sendMessage(_0x6a4818, {
          text: "╔═|〔  ADMINS 〕\n║\n║ ▸ No admins found\n║\n╚═╝"
        }, {
          quoted: _0x3616aa
        });
      }
      const _0x465050 = await Promise.all(_0x453d7b.map(async _0x4ebe9c => {
        const _0x1464c7 = _0x4ebe9c.admin === "superadmin" ? "👑" : "⭐";
        const _0x51f185 = await resolveDisplayWithName(_0x525ebb, _0x6a4818, _0x4ebe9c.id || "", _0x4ebe9c.notify || null);
        return "║  " + _0x1464c7 + " " + _0x51f185;
      }));
      await _0x525ebb.sendMessage(_0x6a4818, {
        text: "╔═|〔  ADMINS 〕\n║\n║ ▸ *Group* : " + _0x276ebc.subject + "\n║ ▸ *Count* : " + _0x453d7b.length + "\n║\n" + _0x465050.join("\n") + "\n║\n╚═╝"
      }, {
        quoted: _0x3616aa
      });
    } catch (_0x903ff0) {
      await _0x525ebb.sendMessage(_0x6a4818, {
        text: "╔═|〔  ADMINS 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x903ff0.message + "\n║\n╚═╝"
      }, {
        quoted: _0x3616aa
      });
    }
  }
};