const cfg = require("../../config");
const {
  getBotName
} = require("../../lib/botname");
module.exports = {
  name: "alive",
  aliases: ["awake", "status", "online"],
  description: "Check if the bot is alive and running",
  category: "utility",
  async execute(_0x891d1b, _0x134a78, _0x57dee3, _0xd4c078, _0x2dbf50) {
    const _0x4d4367 = _0x134a78.key.remoteJid;
    try {
      await _0x891d1b.sendMessage(_0x4d4367, {
        react: {
          text: "💚",
          key: _0x134a78.key
        }
      });
    } catch {}
    const _0x384c57 = getBotName();
    const _0x2d8e2a = process.uptime();
    const _0x5dfa83 = Math.floor(_0x2d8e2a / 3600);
    const _0x32d129 = Math.floor(_0x2d8e2a % 3600 / 60);
    const _0x5b3b10 = Math.floor(_0x2d8e2a % 60);
    const _0x4b2823 = (..._0x2ea9bf) => {
      const _0x16111f = _0xc27fc5 => {
        if (!_0xc27fc5) {
          return "";
        }
        const _0x1b5de0 = String(_0xc27fc5).replace(/[^0-9]/g, "");
        if (_0x1b5de0.length >= 7 && _0x1b5de0.length <= 13) {
          return _0x1b5de0;
        } else {
          return "";
        }
      };
      let _0x17162e = "";
      try {
        const _0x7d7064 = require("path").join(__dirname, "../../session/creds.json");
        const _0x535f85 = JSON.parse(require("fs").readFileSync(_0x7d7064, "utf8"));
        const _0x3784b = _0x535f85?.me?.id || "";
        if (_0x3784b && !_0x3784b.includes("@lid")) {
          _0x17162e = _0x16111f(_0x3784b.split("@")[0].split(":")[0]);
        }
      } catch (_0x41e7ab) {}
      for (const _0x40b718 of [process.env.OWNER_NUMBER, require("../../config").OWNER_NUMBER, _0x17162e, ..._0x2ea9bf]) {
        const _0x30c457 = _0x16111f(_0x40b718);
        if (_0x30c457) {
          return _0x30c457;
        }
      }
      return "";
    };
    const _0xee2787 = _0x4b2823(global.OWNER_NUMBER, global.OWNER_CLEAN_NUMBER);
    const _0x121962 = _0xee2787 ? "+" + _0xee2787 : "Unknown";
    const _0x4bc523 = (process.env.BOT_MODE || cfg.MODE || "public").toUpperCase();
    const _0x3adf28 = ["╔═| ●-《  " + _0x384c57 + " 》-●", "║", "║ ▸ *Name*     : " + _0x384c57, "║ ▸ *Prefix*   : " + (_0xd4c078 || "."), "║ ▸ *Owner*    : " + _0x121962, "║ ▸ *Platform* : Replit", "║ ▸ *Mode*     : " + _0x4bc523, "║ ▸ *Uptime*   : " + _0x5dfa83 + "h " + _0x32d129 + "m " + _0x5b3b10 + "s", "║ ▸ *Status*   : CONNECTED ✅", "║", "╚═|  ☆ SYSTEM ONLINE  ☆"].join("\n");
    await _0x891d1b.sendMessage(_0x4d4367, {
      text: _0x3adf28
    }, {
      quoted: _0x134a78
    });
  }
};