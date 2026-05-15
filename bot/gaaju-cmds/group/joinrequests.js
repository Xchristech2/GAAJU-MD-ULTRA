'use strict';

function getSender(_0x5b0333) {
  return _0x5b0333.key.participant || _0x5b0333.key.remoteJid;
}
async function getBotJid(_0x3fe4af) {
  try {
    return _0x3fe4af.user?.id || _0x3fe4af.authState?.creds?.me?.id || null;
  } catch {
    return null;
  }
}
async function isAdmin(_0x58d58c, _0x1342bf, _0x40da21) {
  try {
    const _0x363b44 = await _0x58d58c.groupMetadata(_0x1342bf);
    const _0x498432 = _0x40da21.replace(/:\d+@/, "@");
    return _0x363b44.participants.some(_0x305502 => (_0x305502.id === _0x40da21 || _0x305502.id.replace(/:\d+@/, "@") === _0x498432) && (_0x305502.admin === "admin" || _0x305502.admin === "superadmin"));
  } catch {
    return false;
  }
}
module.exports = [{
  name: "listrequests",
  aliases: ["joinreqs", "pendingreqs", "joinlist"],
  description: "List all pending group join requests",
  category: "group",
  async execute(_0x340abe, _0x50474a, _0x384544, _0x424a85, _0x18415f) {
    const _0x566a22 = _0x50474a.key.remoteJid;
    if (!_0x566a22.endsWith("@g.us")) {
      return _0x340abe.sendMessage(_0x566a22, {
        text: "╔═|〔  JOIN REQUESTS 〕\n║\n║ ▸ Group only command\n║\n╚═╝"
      }, {
        quoted: _0x50474a
      });
    }
    try {
      await _0x340abe.sendMessage(_0x566a22, {
        react: {
          text: "📋",
          key: _0x50474a.key
        }
      });
    } catch {}
    try {
      const _0x1a043e = await _0x340abe.groupRequestParticipantsList(_0x566a22);
      if (!_0x1a043e || _0x1a043e.length === 0) {
        return _0x340abe.sendMessage(_0x566a22, {
          text: "╔═|〔  JOIN REQUESTS 〕\n║\n║ ▸ No pending join requests\n║\n╚═╝"
        }, {
          quoted: _0x50474a
        });
      }
      const _0x2ea2fc = _0x1a043e.map((_0x479574, _0x3ef2b9) => "║  " + (_0x3ef2b9 + 1) + ". +" + _0x479574.jid.replace(/[^0-9]/g, "")).join("\n");
      await _0x340abe.sendMessage(_0x566a22, {
        text: "╔═|〔  JOIN REQUESTS (" + _0x1a043e.length + ") 〕\n║\n" + _0x2ea2fc + "\n║\n║ ▸ *" + _0x424a85 + "acceptall* — approve all\n║ ▸ *" + _0x424a85 + "rejectall* — reject all\n║\n╚═╝"
      }, {
        quoted: _0x50474a
      });
    } catch (_0x2334ee) {
      await _0x340abe.sendMessage(_0x566a22, {
        text: "╔═|〔  JOIN REQUESTS 〕\n║\n║ ▸ ❌ " + (_0x2334ee.message || "Failed to fetch requests") + "\n║\n╚═╝"
      }, {
        quoted: _0x50474a
      });
    }
  }
}, {
  name: "acceptall",
  aliases: ["approveall", "acceptreqs"],
  description: "Accept all pending group join requests",
  category: "group",
  async execute(_0x583192, _0x1f5695, _0x5e8356, _0x146009, _0x3edf8c) {
    const _0x38bcaa = _0x1f5695.key.remoteJid;
    if (!_0x38bcaa.endsWith("@g.us")) {
      return _0x583192.sendMessage(_0x38bcaa, {
        text: "╔═|〔  JOIN REQUESTS 〕\n║\n║ ▸ Group only command\n║\n╚═╝"
      }, {
        quoted: _0x1f5695
      });
    }
    try {
      await _0x583192.sendMessage(_0x38bcaa, {
        react: {
          text: "✅",
          key: _0x1f5695.key
        }
      });
    } catch {}
    try {
      const _0x4846ba = await _0x583192.groupRequestParticipantsList(_0x38bcaa);
      if (!_0x4846ba || _0x4846ba.length === 0) {
        return _0x583192.sendMessage(_0x38bcaa, {
          text: "╔═|〔  JOIN REQUESTS 〕\n║\n║ ▸ No pending requests to accept\n║\n╚═╝"
        }, {
          quoted: _0x1f5695
        });
      }
      const _0x3151a8 = _0x4846ba.map(_0x1ae05e => _0x1ae05e.jid);
      await _0x583192.groupRequestParticipantsUpdate(_0x38bcaa, _0x3151a8, "approve");
      await _0x583192.sendMessage(_0x38bcaa, {
        text: "╔═|〔  JOIN REQUESTS 〕\n║\n║ ▸ ✅ Approved " + _0x3151a8.length + " request" + (_0x3151a8.length > 1 ? "s" : "") + "\n║\n╚═╝"
      }, {
        quoted: _0x1f5695
      });
    } catch (_0x5094a3) {
      await _0x583192.sendMessage(_0x38bcaa, {
        text: "╔═|〔  JOIN REQUESTS 〕\n║\n║ ▸ ❌ " + (_0x5094a3.message || "Failed") + "\n║\n╚═╝"
      }, {
        quoted: _0x1f5695
      });
    }
  }
}, {
  name: "rejectall",
  aliases: ["denyall", "rejectreqs"],
  description: "Reject all pending group join requests",
  category: "group",
  async execute(_0x46de88, _0x49a0e0, _0x412b4a, _0x42022b, _0x14bcce) {
    const _0x2af2af = _0x49a0e0.key.remoteJid;
    if (!_0x2af2af.endsWith("@g.us")) {
      return _0x46de88.sendMessage(_0x2af2af, {
        text: "╔═|〔  JOIN REQUESTS 〕\n║\n║ ▸ Group only command\n║\n╚═╝"
      }, {
        quoted: _0x49a0e0
      });
    }
    try {
      await _0x46de88.sendMessage(_0x2af2af, {
        react: {
          text: "❌",
          key: _0x49a0e0.key
        }
      });
    } catch {}
    try {
      const _0x2fa8b1 = await _0x46de88.groupRequestParticipantsList(_0x2af2af);
      if (!_0x2fa8b1 || _0x2fa8b1.length === 0) {
        return _0x46de88.sendMessage(_0x2af2af, {
          text: "╔═|〔  JOIN REQUESTS 〕\n║\n║ ▸ No pending requests to reject\n║\n╚═╝"
        }, {
          quoted: _0x49a0e0
        });
      }
      const _0x493c92 = _0x2fa8b1.map(_0x2a649d => _0x2a649d.jid);
      await _0x46de88.groupRequestParticipantsUpdate(_0x2af2af, _0x493c92, "reject");
      await _0x46de88.sendMessage(_0x2af2af, {
        text: "╔═|〔  JOIN REQUESTS 〕\n║\n║ ▸ ❌ Rejected " + _0x493c92.length + " request" + (_0x493c92.length > 1 ? "s" : "") + "\n║\n╚═╝"
      }, {
        quoted: _0x49a0e0
      });
    } catch (_0x4b7981) {
      await _0x46de88.sendMessage(_0x2af2af, {
        text: "╔═|〔  JOIN REQUESTS 〕\n║\n║ ▸ ❌ " + (_0x4b7981.message || "Failed") + "\n║\n╚═╝"
      }, {
        quoted: _0x49a0e0
      });
    }
  }
}, {
  name: "accept",
  aliases: ["approveone", "acceptone"],
  description: "Accept a specific join request by @mention or number",
  category: "group",
  async execute(_0x3dc49c, _0x24527e, _0x1ad95c, _0x31d691, _0x17a629) {
    const _0x323625 = _0x24527e.key.remoteJid;
    if (!_0x323625.endsWith("@g.us")) {
      return _0x3dc49c.sendMessage(_0x323625, {
        text: "╔═|〔  JOIN REQUESTS 〕\n║\n║ ▸ Group only command\n║\n╚═╝"
      }, {
        quoted: _0x24527e
      });
    }
    try {
      await _0x3dc49c.sendMessage(_0x323625, {
        react: {
          text: "✅",
          key: _0x24527e.key
        }
      });
    } catch {}
    const _0x41d957 = _0x24527e.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const _0x26514b = _0x1ad95c.find(_0x233859 => /^\d+/.test(_0x233859));
    let _0x4def96 = _0x41d957[0] || (_0x26514b ? _0x26514b.replace(/\D/g, "") + "@s.whatsapp.net" : null);
    if (!_0x4def96) {
      return _0x3dc49c.sendMessage(_0x323625, {
        text: "╔═|〔  JOIN REQUESTS 〕\n║\n║ ▸ *Usage* : " + _0x31d691 + "accept @mention\n║           " + _0x31d691 + "accept 254712345678\n║\n╚═╝"
      }, {
        quoted: _0x24527e
      });
    }
    try {
      await _0x3dc49c.groupRequestParticipantsUpdate(_0x323625, [_0x4def96], "approve");
      await _0x3dc49c.sendMessage(_0x323625, {
        text: "╔═|〔  JOIN REQUESTS 〕\n║\n║ ▸ ✅ Approved +" + _0x4def96.replace(/[^0-9]/g, "") + "\n║\n╚═╝"
      }, {
        quoted: _0x24527e
      });
    } catch (_0x570e4b) {
      await _0x3dc49c.sendMessage(_0x323625, {
        text: "╔═|〔  JOIN REQUESTS 〕\n║\n║ ▸ ❌ " + _0x570e4b.message + "\n║\n╚═╝"
      }, {
        quoted: _0x24527e
      });
    }
  }
}, {
  name: "reject",
  aliases: ["denyone", "rejectone"],
  description: "Reject a specific join request",
  category: "group",
  async execute(_0x4f1aaf, _0x14c4e1, _0x794c07, _0x21a6dc, _0x28f8b0) {
    const _0x1b77a0 = _0x14c4e1.key.remoteJid;
    if (!_0x1b77a0.endsWith("@g.us")) {
      return _0x4f1aaf.sendMessage(_0x1b77a0, {
        text: "╔═|〔  JOIN REQUESTS 〕\n║\n║ ▸ Group only command\n║\n╚═╝"
      }, {
        quoted: _0x14c4e1
      });
    }
    try {
      await _0x4f1aaf.sendMessage(_0x1b77a0, {
        react: {
          text: "❌",
          key: _0x14c4e1.key
        }
      });
    } catch {}
    const _0xba07bf = _0x14c4e1.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const _0x2d2a96 = _0x794c07.find(_0x4a60e6 => /^\d+/.test(_0x4a60e6));
    let _0x3b9c6c = _0xba07bf[0] || (_0x2d2a96 ? _0x2d2a96.replace(/\D/g, "") + "@s.whatsapp.net" : null);
    if (!_0x3b9c6c) {
      return _0x4f1aaf.sendMessage(_0x1b77a0, {
        text: "╔═|〔  JOIN REQUESTS 〕\n║\n║ ▸ *Usage* : " + _0x21a6dc + "reject @mention\n║\n╚═╝"
      }, {
        quoted: _0x14c4e1
      });
    }
    try {
      await _0x4f1aaf.groupRequestParticipantsUpdate(_0x1b77a0, [_0x3b9c6c], "reject");
      await _0x4f1aaf.sendMessage(_0x1b77a0, {
        text: "╔═|〔  JOIN REQUESTS 〕\n║\n║ ▸ ✅ Rejected +" + _0x3b9c6c.replace(/[^0-9]/g, "") + "\n║\n╚═╝"
      }, {
        quoted: _0x14c4e1
      });
    } catch (_0x52132a) {
      await _0x4f1aaf.sendMessage(_0x1b77a0, {
        text: "╔═|〔  JOIN REQUESTS 〕\n║\n║ ▸ ❌ " + _0x52132a.message + "\n║\n╚═╝"
      }, {
        quoted: _0x14c4e1
      });
    }
  }
}, {
  name: "togroupstatus",
  aliases: ["grouplock", "lockgroup", "groupunlock"],
  description: "Toggle group open/locked (join link on/off)",
  category: "group",
  async execute(_0x5e5af7, _0x11adea, _0x3b9e46, _0x336dac, _0x4765ce) {
    const _0x57abcf = _0x11adea.key.remoteJid;
    if (!_0x57abcf.endsWith("@g.us")) {
      return _0x5e5af7.sendMessage(_0x57abcf, {
        text: "╔═|〔  GROUP STATUS 〕\n║\n║ ▸ Group only command\n║\n╚═╝"
      }, {
        quoted: _0x11adea
      });
    }
    try {
      await _0x5e5af7.sendMessage(_0x57abcf, {
        react: {
          text: "🔒",
          key: _0x11adea.key
        }
      });
    } catch {}
    try {
      const _0x14086b = await _0x5e5af7.groupMetadata(_0x57abcf);
      const _0x3ffc73 = _0x14086b.announce === true;
      await _0x5e5af7.groupSettingUpdate(_0x57abcf, _0x3ffc73 ? "not_announcement" : "announcement");
      await _0x5e5af7.sendMessage(_0x57abcf, {
        text: "╔═|〔  GROUP STATUS 〕\n║\n║ ▸ " + (_0x3ffc73 ? "🔓 Group unlocked — all can send" : "🔒 Group locked — admins only") + "\n║\n╚═╝"
      }, {
        quoted: _0x11adea
      });
    } catch (_0x795078) {
      await _0x5e5af7.sendMessage(_0x57abcf, {
        text: "╔═|〔  GROUP STATUS 〕\n║\n║ ▸ ❌ " + _0x795078.message + "\n║\n╚═╝"
      }, {
        quoted: _0x11adea
      });
    }
  }
}];