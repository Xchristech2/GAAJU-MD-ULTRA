const {
  getBotName
} = require("../../lib/botname");
globalThis.groupListCache = globalThis.groupListCache || [];
globalThis.groupListMsgIds = globalThis.groupListMsgIds || new Set();
module.exports = {
  name: "mygroups",
  aliases: ["groups", "listgroups", "grouplist"],
  description: "List all groups the bot is currently in",
  category: "utility",
  async execute(_0x355911, _0x36789a, _0x29735c, _0x4ee8a0, _0x429ae9) {
    const _0x143fa1 = _0x36789a.key.remoteJid;
    try {
      await _0x355911.sendMessage(_0x143fa1, {
        react: {
          text: "👥",
          key: _0x36789a.key
        }
      });
    } catch {}
    const _0x4cb946 = getBotName();
    if (!_0x429ae9?.isOwnerUser && !_0x429ae9?.isSudoUser) {
      return _0x355911.sendMessage(_0x143fa1, {
        text: "╔═|〔  MY GROUPS 〕\n║\n║ ▸ *Status* : ❌ Owner only\n║\n╚═|〔 " + _0x4cb946 + " 〕"
      }, {
        quoted: _0x36789a
      });
    }
    try {
      await _0x355911.sendMessage(_0x143fa1, {
        react: {
          text: "⏳",
          key: _0x36789a.key
        }
      });
      const _0x3e08da = await _0x355911.groupFetchAllParticipating();
      const _0x4c0111 = Object.values(_0x3e08da || {});
      if (!_0x4c0111.length) {
        return _0x355911.sendMessage(_0x143fa1, {
          text: "╔═|〔  MY GROUPS 〕\n║\n║ ▸ Bot is not in any groups\n║\n╚═|〔 " + _0x4cb946 + " 〕"
        }, {
          quoted: _0x36789a
        });
      }
      globalThis.groupListCache = _0x4c0111.map((_0x93f387, _0x4fb764) => ({
        index: _0x4fb764 + 1,
        id: _0x93f387.id,
        name: _0x93f387.subject || "Unknown",
        size: (_0x93f387.participants || []).length
      }));
      const _0x2850af = 20;
      const _0x955c94 = Math.max(0, parseInt(_0x29735c[0]) - 1 || 0);
      const _0x184277 = globalThis.groupListCache.slice(_0x955c94 * _0x2850af, (_0x955c94 + 1) * _0x2850af);
      const _0x407b23 = globalThis.groupListCache.length;
      const _0x291262 = Math.ceil(_0x407b23 / _0x2850af);
      const _0xbfd152 = _0x184277.map(_0x5417ba => "║ ▸ *" + _0x5417ba.index + ".* " + _0x5417ba.name + " (" + _0x5417ba.size + " members)").join("\n");
      const _0xc59343 = _0x291262 > 1 ? "║\n║ ▸ Page " + (_0x955c94 + 1) + "/" + _0x291262 + " — use *" + _0x4ee8a0 + "mygroups <page>*" : "";
      const _0x1fcbff = await _0x355911.sendMessage(_0x143fa1, {
        text: "╔═|〔  MY GROUPS 〕\n║\n║ ▸ *Total* : " + _0x407b23 + " groups\n║\n" + _0xbfd152 + "\n" + _0xc59343 + "\n║\n╚═|〔 " + _0x4cb946 + " 〕"
      }, {
        quoted: _0x36789a
      });
      if (_0x1fcbff?.key?.id) {
        globalThis.groupListMsgIds.add(_0x1fcbff.key.id);
      }
      await _0x355911.sendMessage(_0x143fa1, {
        react: {
          text: "✅",
          key: _0x36789a.key
        }
      });
    } catch (_0x60778) {
      await _0x355911.sendMessage(_0x143fa1, {
        react: {
          text: "❌",
          key: _0x36789a.key
        }
      });
      await _0x355911.sendMessage(_0x143fa1, {
        text: "╔═|〔  MY GROUPS 〕\n║\n║ ▸ *Error* : " + _0x60778.message + "\n║\n╚═|〔 " + _0x4cb946 + " 〕"
      }, {
        quoted: _0x36789a
      });
    }
  }
};