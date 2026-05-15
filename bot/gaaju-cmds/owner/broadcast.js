'use strict';

const {
  getBotName
} = require("../../lib/botname");
module.exports = {
  name: "broadcast",
  aliases: ["bc", "bcast"],
  description: "Broadcast a message to all groups (owner only)",
  category: "owner",
  async execute(_0x4a8ce0, _0x207d0b, _0xbc85be, _0x7b39ea, _0x148766) {
    const _0x2b1aae = _0x207d0b.key.remoteJid;
    const _0x1e1b1c = getBotName();
    if (!_0x148766.isOwner()) {
      return _0x4a8ce0.sendMessage(_0x2b1aae, {
        text: "╔═|〔  BROADCAST 〕\n║\n║ ▸ *Status* : ❌ Owner only\n║\n╚═|〔 " + _0x1e1b1c + " 〕"
      }, {
        quoted: _0x207d0b
      });
    }
    const _0x1416c6 = _0xbc85be.join(" ").trim();
    if (!_0x1416c6) {
      return _0x4a8ce0.sendMessage(_0x2b1aae, {
        text: "╔═|〔  BROADCAST 〕\n║\n║ ▸ *Usage* : " + _0x7b39ea + "broadcast <message>\n║\n╚═|〔 " + _0x1e1b1c + " 〕"
      }, {
        quoted: _0x207d0b
      });
    }
    try {
      await _0x4a8ce0.sendMessage(_0x2b1aae, {
        react: {
          text: "📢",
          key: _0x207d0b.key
        }
      });
    } catch {}
    const _0x2b8fb8 = await _0x4a8ce0.groupFetchAllParticipating();
    const _0x34278e = Object.keys(_0x2b8fb8);
    if (_0x34278e.length === 0) {
      return _0x4a8ce0.sendMessage(_0x2b1aae, {
        text: "╔═|〔  BROADCAST 〕\n║\n║ ▸ *Status* : ❌ Bot is in no groups\n║\n╚═|〔 " + _0x1e1b1c + " 〕"
      }, {
        quoted: _0x207d0b
      });
    }
    const _0x291931 = "📢 *BROADCAST*\n\n" + _0x1416c6 + "\n\n_— " + _0x1e1b1c + "_";
    let _0x55f508 = 0;
    let _0x29e8e3 = 0;
    for (const _0x1cfbf0 of _0x34278e) {
      try {
        await _0x4a8ce0.sendMessage(_0x1cfbf0, {
          text: _0x291931
        });
        _0x55f508++;
        await new Promise(_0x17c610 => setTimeout(_0x17c610, 800));
      } catch {
        _0x29e8e3++;
      }
    }
    await _0x4a8ce0.sendMessage(_0x2b1aae, {
      text: "╔═|〔  BROADCAST 〕\n║\n║ ▸ *Sent*   : ✅ " + _0x55f508 + " groups\n║ ▸ *Failed* : ❌ " + _0x29e8e3 + " groups\n║\n╚═|〔 " + _0x1e1b1c + " 〕"
    }, {
      quoted: _0x207d0b
    });
  }
};