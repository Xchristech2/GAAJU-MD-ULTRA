const {
  downloadMediaMessage
} = require("@whiskeysockets/baileys");
const {
  get,
  set
} = require("../../lib/autoconfig");
const {
  getBotName
} = require("../../lib/botname");
const {
  resolveDisplay
} = require("../../lib/groupUtils");
const {
  isBotDeleted
} = require("../../lib/bot-delete-guard");
const config = require("../../config");
const _store = new Map();
const MAX_MSGS = 500;
let _sock = null;
const _revokedIds = new Set();
function _markRevoked(_0x3acd88) {
  if (_revokedIds.has(_0x3acd88)) {
    return false;
  }
  _revokedIds.add(_0x3acd88);
  setTimeout(() => _revokedIds.delete(_0x3acd88), 10000);
  return true;
}
function _resolveContent(_0x1d3285) {
  if (!_0x1d3285) {
    return null;
  }
  return _0x1d3285.ephemeralMessage?.message || _0x1d3285.viewOnceMessage?.message || _0x1d3285.viewOnceMessageV2?.message?.viewOnceMessage?.message || _0x1d3285;
}
function _addToStore(_0x4711c7) {
  if (!_0x4711c7?.key?.id) {
    return;
  }
  const _0x1e3caa = _resolveContent(_0x4711c7.message);
  if (!_0x1e3caa) {
    return;
  }
  _store.set(_0x4711c7.key.id, {
    msg: _0x4711c7,
    content: _0x1e3caa,
    at: Date.now()
  });
  if (_store.size > MAX_MSGS) {
    _store.delete(_store.keys().next().value);
  }
}
function _getCfg() {
  const _0x3240db = get("antidelete") || {};
  if (typeof _0x3240db.enabled === "boolean" && _0x3240db.global === undefined) {
    _0x3240db.global = _0x3240db.enabled;
    delete _0x3240db.enabled;
  }
  if (!_0x3240db.chats) {
    _0x3240db.chats = {};
  }
  return _0x3240db;
}
function _chatCfg(_0x5b0310, _0x55d284) {
  const _0x58dc1b = _0x5b0310.chats?.[_0x55d284];
  if (!_0x58dc1b) {
    return null;
  }
  if (_0x58dc1b === true) {
    return {
      enabled: true,
      mode: "owner"
    };
  }
  return _0x58dc1b;
}
function _isChatEnabled(_0x55c211) {
  const _0x38b38c = _getCfg();
  if (_0x38b38c.global === true) {
    return true;
  }
  const _0x331430 = _chatCfg(_0x38b38c, _0x55c211);
  return _0x331430?.enabled === true;
}
function _getChatMode(_0x452a1a, _0x17cb69) {
  const _0x5108e8 = _chatCfg(_0x452a1a, _0x17cb69);
  return _0x5108e8?.mode || "owner";
}
const _adRegistered = new WeakSet();
function initAntidelete(_0x511fc0) {
  _sock = _0x511fc0;
  if (_adRegistered.has(_0x511fc0)) {
    console.log("[ANTIDELETE] Self-listener already registered for this sock — skipping duplicate");
    return Promise.resolve();
  }
  _adRegistered.add(_0x511fc0);
  _0x511fc0.ev.on("messages.upsert", ({
    messages: _0x20f903
  }) => {
    for (const _0x22764 of _0x20f903) {
      try {
        if (_0x22764?.key?.remoteJid === "status@broadcast") {
          continue;
        }
        if (!_0x22764?.key?.id || !_0x22764.message) {
          continue;
        }
        if (_0x22764.messageStubType) {
          continue;
        }
        const _0x49b6d4 = _0x22764.message?.protocolMessage;
        if (_0x49b6d4 && (_0x49b6d4.type === 0 || _0x49b6d4.type === 4)) {
          continue;
        }
        _addToStore(_0x22764);
      } catch {}
    }
  });
  console.log("[ANTIDELETE] Self-listener registered — storing from connect-time");
  return Promise.resolve();
}
async function antideleteStoreMessage(_0x1a3b02) {
  if (_0x1a3b02?.message) {
    _addToStore(_0x1a3b02);
  }
}
async function antideleteHandleUpdate(_0xc1e411) {
  try {
    const _0x16983 = _0xc1e411?.update?.message === null || _0xc1e411?.update?.messageStubType != null;
    if (!_0x16983) {
      return;
    }
    const _0x4c5d29 = _0xc1e411?.key;
    if (!_0x4c5d29?.id) {
      return;
    }
    const _0x2d12ec = _0x4c5d29.remoteJid;
    if (!_markRevoked(_0x4c5d29.id)) {
      console.log("[ANTIDELETE] ⏭️ Dedup skip for " + _0x4c5d29.id);
      return;
    }
    if (!_isChatEnabled(_0x2d12ec)) {
      return;
    }
    if (!_sock) {
      console.log("[ANTIDELETE] Sock not ready");
      return;
    }
    if (isBotDeleted(_0x4c5d29.id)) {
      console.log("[ANTIDELETE] ⏭️ Skipped — bot-deleted: " + _0x4c5d29.id);
      _store.delete(_0x4c5d29.id);
      return;
    }
    console.log("[ANTIDELETE] Revoke for " + _0x4c5d29.id + " | store: " + _store.size);
    const _0xe845cd = _store.get(_0x4c5d29.id);
    if (!_0xe845cd) {
      const _0x1741f6 = [..._store.keys()].slice(0, 4).join(", ");
      console.log("[ANTIDELETE] ⚠️ Not in store | sample: [" + _0x1741f6 + "]");
      return;
    }
    _store.delete(_0x4c5d29.id);
    const {
      msg: _0x44c26,
      content: _0x13e538
    } = _0xe845cd;
    const _0x10db2f = _0x4c5d29.remoteJid || _0x44c26.key.remoteJid;
    if (!_0x10db2f || _0x10db2f === "status@broadcast") {
      return;
    }
    const _0x507d7c = _getCfg();
    const _0x5b08bf = _getChatMode(_0x507d7c, _0x10db2f);
    const _0xa577ad = (config.OWNER_NUMBER || "").replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    const _0x5a564d = _0x5b08bf === "owner" ? _0xa577ad : _0x10db2f;
    if (!_0x5a564d || _0x5a564d === "@s.whatsapp.net") {
      console.log("[ANTIDELETE] ⚠️ No valid destination — set OWNER_NUMBER in config");
      return;
    }
    const _0x45889c = (_sock?.user?.id || "").split(":")[0].split("@")[0];
    const _0x2a64c1 = _0x5a564d.split("@")[0];
    const _0x5909a0 = _0x45889c && _0x2a64c1 === _0x45889c;
    console.log("[ANTIDELETE] Dest: " + _0x2a64c1 + " | mode: " + _0x5b08bf + (_0x5909a0 ? " (→ Saved Messages on your WhatsApp)" : ""));
    const _0x25f510 = _0x44c26.key.participant || _0x44c26.key.remoteJid || "";
    const _0x566713 = _0x44c26.key.fromMe;
    const _0x3bc34e = _0x566713 ? "You" : await resolveDisplay(_sock, _0x10db2f, _0x25f510).catch(() => _0x25f510.split("@")[0].split(":")[0]);
    let _0x217db1 = "DM";
    if (_0x10db2f.endsWith("@g.us")) {
      try {
        const _0x51ddf1 = await _sock.groupMetadata(_0x10db2f);
        _0x217db1 = _0x51ddf1?.subject || _0x10db2f.split("@")[0];
      } catch {
        _0x217db1 = _0x10db2f.split("@")[0];
      }
    }
    const _0xb8d0e9 = "╔═|〔  ANTI DELETE 〕\n║\n║ ▸ *From* : " + _0x3bc34e + "\n║ ▸ *Chat* : " + _0x217db1 + "\n║\n╚═|〔 " + getBotName() + " 〕";
    const _0x3b9719 = _0x13e538?.conversation || _0x13e538?.extendedTextMessage?.text || _0x13e538?.buttonsResponseMessage?.selectedDisplayText || _0x13e538?.listResponseMessage?.title || _0x13e538?.templateButtonReplyMessage?.selectedDisplayText;
    if (_0x3b9719) {
      console.log("[ANTIDELETE] ✅ Text → " + _0x5a564d.split("@")[0]);
      await _sock.sendMessage(_0x5a564d, {
        text: _0xb8d0e9 + "\n\n" + _0x3b9719
      });
      return;
    }
    const _0x567462 = _0x13e538?.imageMessage;
    const _0x4ec229 = _0x13e538?.videoMessage;
    const _0x5e2fdd = _0x13e538?.audioMessage;
    const _0x256e1a = _0x13e538?.stickerMessage;
    const _0x3d9fc6 = _0x13e538?.documentMessage;
    if (_0x567462 || _0x4ec229 || _0x5e2fdd || _0x256e1a || _0x3d9fc6) {
      const _0x139c82 = _0x567462 ? "image" : _0x4ec229 ? "video" : _0x5e2fdd ? "audio" : _0x256e1a ? "sticker" : "doc";
      console.log("[ANTIDELETE] ✅ Media (" + _0x139c82 + ") → " + _0x5a564d.split("@")[0]);
      try {
        const _0x11d1fd = await downloadMediaMessage({
          key: _0x44c26.key,
          message: _0x13e538
        }, "buffer", {});
        if (!_0x11d1fd?.length) {
          throw new Error("empty buffer");
        }
        if (_0x567462) {
          await _sock.sendMessage(_0x5a564d, {
            image: _0x11d1fd,
            caption: _0xb8d0e9
          });
        } else if (_0x4ec229) {
          await _sock.sendMessage(_0x5a564d, {
            video: _0x11d1fd,
            caption: _0xb8d0e9,
            mimetype: _0x4ec229.mimetype || "video/mp4"
          });
        } else if (_0x5e2fdd) {
          await _sock.sendMessage(_0x5a564d, {
            audio: _0x11d1fd,
            mimetype: _0x5e2fdd.mimetype || "audio/ogg; codecs=opus",
            ptt: !!_0x5e2fdd.ptt
          });
        } else if (_0x256e1a) {
          await _sock.sendMessage(_0x5a564d, {
            sticker: _0x11d1fd
          });
        } else if (_0x3d9fc6) {
          await _sock.sendMessage(_0x5a564d, {
            document: _0x11d1fd,
            mimetype: _0x3d9fc6.mimetype || "application/octet-stream",
            fileName: _0x3d9fc6.fileName || "file",
            caption: _0xb8d0e9
          });
        }
      } catch (_0x4d1a40) {
        console.log("[ANTIDELETE] ⚠️ Media dl: " + _0x4d1a40.message);
        await _sock.sendMessage(_0x5a564d, {
          text: _0xb8d0e9 + "\n\n⚠️ [Media — download failed]"
        });
      }
      return;
    }
    const _0x5e1de4 = Object.keys(_0x13e538 || {}).join(", ");
    console.log("[ANTIDELETE] ⚠️ Unknown type: " + _0x5e1de4);
    await _sock.sendMessage(_0x5a564d, {
      text: _0xb8d0e9 + "\n\n⚠️ [Unsupported type: " + _0x5e1de4 + "]"
    });
  } catch (_0x15ea41) {
    console.log("[ANTIDELETE] ❌ " + _0x15ea41.message);
  }
}
function updateAntideleteSock(_0x282eeb) {
  _sock = _0x282eeb;
}
module.exports = {
  initAntidelete: initAntidelete,
  antideleteStoreMessage: antideleteStoreMessage,
  antideleteHandleUpdate: antideleteHandleUpdate,
  updateAntideleteSock: updateAntideleteSock,
  name: "antidelete",
  aliases: ["antidel"],
  description: "Recover deleted messages — fully per-group",
  category: "owner",
  async execute(_0x1d8dc9, _0xb38b4b, _0x414baa, _0x1fa01e, _0x587e36) {
    const _0x503b5e = _0xb38b4b.key.remoteJid;
    try {
      await _0x1d8dc9.sendMessage(_0x503b5e, {
        react: {
          text: "🗑️",
          key: _0xb38b4b.key
        }
      });
    } catch {}
    const _0x2e5cd4 = getBotName();
    const _0x1c2f1b = _0x503b5e.endsWith("@g.us");
    const _0x3d3f9a = _0x1c2f1b ? "This group" : "This DM";
    if (!_0x587e36?.isOwnerUser && !_0x587e36?.isSudoUser) {
      return _0x1d8dc9.sendMessage(_0x503b5e, {
        text: "╔═|〔  ANTI DELETE 〕\n║\n║ ▸ *Status* : ❌ Owner/sudo only\n║\n╚═|〔 " + _0x2e5cd4 + " 〕"
      }, {
        quoted: _0xb38b4b
      });
    }
    let _0x1d1b8e = (_0x414baa[0] ?? "").toLowerCase().trim();
    let _0x2405d9 = (_0x414baa[1] ?? "").toLowerCase().trim();
    const _0x529219 = _0x3f6b2c => _0x3f6b2c === "chat" || _0x3f6b2c === "owner";
    const _0x32bb47 = _0x46ac2f => _0x46ac2f === "on" || _0x46ac2f === "off";
    if (_0x529219(_0x1d1b8e) && (_0x32bb47(_0x2405d9) || !_0x2405d9)) {
      const _0x267805 = _0x1d1b8e;
      _0x1d1b8e = _0x2405d9 || "on";
      _0x2405d9 = _0x267805;
    }
    console.log("[ANTIDELETE CMD] action=\"" + _0x1d1b8e + "\" arg1=\"" + _0x2405d9 + "\" from " + _0x503b5e.split("@")[0]);
    const _0x387cc2 = _getCfg();
    const _0x313f35 = _chatCfg(_0x387cc2, _0x503b5e) || {
      enabled: false,
      mode: "owner"
    };
    if (!_0x1d1b8e || _0x1d1b8e === "status") {
      const _0x3fd563 = Object.entries(_0x387cc2.chats || {}).filter(([, _0x553bb3]) => _0x553bb3 === true || _0x553bb3?.enabled).map(([_0x5cefea, _0x2f64fc]) => {
        const _0x167718 = _0x2f64fc === true ? "owner" : _0x2f64fc?.mode || "owner";
        return "║ ▸ " + (_0x5cefea.endsWith("@g.us") ? "👥" : "💬") + " " + _0x5cefea.split("@")[0] + " [" + _0x167718 + "]";
      }).join("\n");
      return _0x1d8dc9.sendMessage(_0x503b5e, {
        text: "╔═|〔  ANTI DELETE 〕\n║\n" + ("║ ▸ *" + _0x3d3f9a + "* : " + (_0x313f35.enabled ? "✅ ON" : "❌ OFF") + "\n") + ("║ ▸ *Mode*      : " + (_0x313f35.mode || "owner") + " (chat/owner)\n") + ("║ ▸ *Global*    : " + (_0x387cc2.global ? "✅ ON" : "❌ OFF") + "\n") + ("║ ▸ *Cached*   : " + _store.size + " messages\n║\n") + (_0x3fd563 ? _0x3fd563 + "\n║\n" : "") + "║ ▸ *Usage*:\n" + ("║   " + _0x1fa01e + "antidelete on          → enable here (owner DM)\n") + ("║   " + _0x1fa01e + "antidelete on chat     → enable here (same chat)\n") + ("║   " + _0x1fa01e + "antidelete off         → disable here\n") + ("║   " + _0x1fa01e + "antidelete mode owner  → change mode this chat\n") + ("║   " + _0x1fa01e + "antidelete mode chat   → change mode this chat\n") + ("║   " + _0x1fa01e + "antidelete on all      → global on\n") + ("║   " + _0x1fa01e + "antidelete off all     → global off\n") + ("║\n╚═|〔 " + _0x2e5cd4 + " 〕")
      }, {
        quoted: _0xb38b4b
      });
    }
    if (_0x1d1b8e === "on" || _0x1d1b8e === "off") {
      const _0x4c6e04 = _0x1d1b8e === "on";
      if (_0x2405d9 === "all") {
        _0x387cc2.global = _0x4c6e04;
        set("antidelete", _0x387cc2);
        return _0x1d8dc9.sendMessage(_0x503b5e, {
          text: "╔═|〔  ANTI DELETE 〕\n║\n║ ▸ *Global* : " + (_0x4c6e04 ? "✅ Enabled for ALL chats" : "❌ Disabled globally") + "\n║\n╚═|〔 " + _0x2e5cd4 + " 〕"
        }, {
          quoted: _0xb38b4b
        });
      }
      _0x387cc2.chats = _0x387cc2.chats || {};
      if (!_0x4c6e04) {
        delete _0x387cc2.chats[_0x503b5e];
      } else {
        const _0x530813 = _0x2405d9 === "chat" ? "chat" : "owner";
        _0x387cc2.chats[_0x503b5e] = {
          enabled: true,
          mode: _0x530813
        };
      }
      set("antidelete", _0x387cc2);
      const _0x2160f9 = _chatCfg(_0x387cc2, _0x503b5e) || {
        enabled: false,
        mode: "owner"
      };
      return _0x1d8dc9.sendMessage(_0x503b5e, {
        text: "╔═|〔  ANTI DELETE 〕\n║\n" + ("║ ▸ *" + _0x3d3f9a + "* : " + (_0x4c6e04 ? "✅ Enabled" : "❌ Disabled") + "\n") + (_0x4c6e04 ? "║ ▸ *Mode*      : " + _0x2160f9.mode + "\n" : "") + ("║ ▸ *Global*    : " + (_0x387cc2.global ? "✅ ON" : "❌ OFF") + "\n") + ("║\n╚═|〔 " + _0x2e5cd4 + " 〕")
      }, {
        quoted: _0xb38b4b
      });
    }
    if (_0x1d1b8e === "mode" && _0x2405d9) {
      const _0x3aaf19 = _0x2405d9 === "chat" ? "chat" : "owner";
      _0x387cc2.chats = _0x387cc2.chats || {};
      const _0x912e6c = _chatCfg(_0x387cc2, _0x503b5e) || {
        enabled: false,
        mode: "owner"
      };
      _0x387cc2.chats[_0x503b5e] = {
        ..._0x912e6c,
        mode: _0x3aaf19
      };
      set("antidelete", _0x387cc2);
      return _0x1d8dc9.sendMessage(_0x503b5e, {
        text: "╔═|〔  ANTI DELETE 〕\n║\n" + ("║ ▸ *Mode* : *" + _0x3aaf19 + "* saved for this chat\n") + "║ ▸ chat  = recover in same chat\n║ ▸ owner = forward to owner DM\n" + ("║\n╚═|〔 " + _0x2e5cd4 + " 〕")
      }, {
        quoted: _0xb38b4b
      });
    }
    return;
  }
};