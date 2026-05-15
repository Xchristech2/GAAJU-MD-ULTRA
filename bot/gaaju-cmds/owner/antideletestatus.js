const {
  downloadMediaMessage
} = require("@whiskeysockets/baileys");
const {
  get,
  toggle
} = require("../../lib/autoconfig");
const {
  getBotName
} = require("../../lib/botname");
const config = require("../../config");
const _store = new Map();
const MAX_MSGS = 200;
let _sock = null;
let _resolveLid = null;
function _addToStore(_0x594f5) {
  if (!_0x594f5?.key?.id || !_0x594f5.message) {
    return;
  }
  _store.set(_0x594f5.key.id, {
    msg: _0x594f5,
    at: Date.now()
  });
  if (_store.size > MAX_MSGS) {
    const _0x2f711e = _store.keys().next().value;
    _store.delete(_0x2f711e);
  }
}
function _resolveNum(_0x3e9b0d) {
  if (!_0x3e9b0d) {
    return null;
  }
  const _0x2c8c69 = _0x3e9b0d.split("@")[0].split(":")[0];
  if (_0x3e9b0d.includes("@lid") && _resolveLid) {
    const _0x668f43 = _resolveLid(_0x3e9b0d);
    if (_0x668f43 && _0x668f43 !== _0x2c8c69) {
      return _0x668f43;
    }
  }
  return _0x2c8c69;
}
function initStatusAntidelete(_0x2fcfe8, _0x3e03bc) {
  _sock = _0x2fcfe8;
  if (_0x3e03bc) {
    _resolveLid = _0x3e03bc;
  }
  return Promise.resolve();
}
async function statusAntideleteStoreMessage(_0x542e0d) {
  if (_0x542e0d?.message) {
    _addToStore(_0x542e0d);
  }
}
async function statusAntideleteHandleUpdate(_0x20030a) {
  try {
    const _0x5caddf = get("antideletestatus");
    if (!_0x5caddf?.enabled) {
      return;
    }
    if (!_sock) {
      return;
    }
    const _0x136a0b = _0x20030a?.key;
    if (!_0x136a0b?.id) {
      return;
    }
    const _0x123be0 = _store.get(_0x136a0b.id);
    if (!_0x123be0) {
      return;
    }
    _store.delete(_0x136a0b.id);
    const {
      msg: _0x1a2274
    } = _0x123be0;
    const _0x466182 = (config.OWNER_NUMBER || "").replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    if (!_0x466182 || _0x466182 === "@s.whatsapp.net") {
      return;
    }
    const _0x316ad3 = _0x1a2274.key.participant || _0x1a2274.key.remoteJid || "";
    const _0x3c0192 = _resolveNum(_0x316ad3) || _0x316ad3.split("@")[0].split(":")[0] || "Unknown";
    const _0x87e1ac = _0x20030a?.key?.participant || _0x20030a?.key?.fromMe ? _0x316ad3 : _0x316ad3;
    const _0x48b782 = _resolveNum(_0x87e1ac) || _0x3c0192;
    const _0x3ae010 = "╔═|〔  STATUS RECOVERED 〕\n║\n" + ("║ ▸ *Posted By*  : +" + _0x3c0192 + "\n") + ("║ ▸ *Deleted By* : +" + _0x48b782 + "\n") + ("║\n╚═|〔 " + getBotName() + " 〕");
    const _0x26339c = _0x1a2274.message?.ephemeralMessage?.message || _0x1a2274.message;
    const _0x2675a6 = _0x26339c?.conversation || _0x26339c?.extendedTextMessage?.text;
    if (_0x2675a6) {
      await _sock.sendMessage(_0x466182, {
        text: _0x3ae010 + "\n\n" + _0x2675a6
      });
      return;
    }
    const _0x411920 = _0x26339c?.imageMessage || _0x26339c?.videoMessage || _0x26339c?.audioMessage;
    if (_0x411920) {
      try {
        const _0x4304d3 = {
          key: _0x1a2274.key,
          message: _0x26339c
        };
        const _0x755aa7 = await downloadMediaMessage(_0x4304d3, "buffer", {});
        if (_0x26339c?.imageMessage) {
          await _sock.sendMessage(_0x466182, {
            image: _0x755aa7,
            caption: _0x3ae010
          });
        } else if (_0x26339c?.videoMessage) {
          await _sock.sendMessage(_0x466182, {
            video: _0x755aa7,
            caption: _0x3ae010
          });
        } else if (_0x26339c?.audioMessage) {
          await _sock.sendMessage(_0x466182, {
            audio: _0x755aa7,
            mimetype: _0x26339c.audioMessage.mimetype || "audio/ogg; codecs=opus"
          });
        }
      } catch {
        await _sock.sendMessage(_0x466182, {
          text: _0x3ae010 + "\n\n[Status media could not be recovered]"
        });
      }
      return;
    }
    await _sock.sendMessage(_0x466182, {
      text: _0x3ae010 + "\n\n[Status deleted]"
    });
  } catch {}
}
function updateStatusAntideleteSock(_0x3778f2, _0x10a89f) {
  _sock = _0x3778f2;
  if (_0x10a89f) {
    _resolveLid = _0x10a89f;
  }
}
module.exports = {
  initStatusAntidelete: initStatusAntidelete,
  statusAntideleteStoreMessage: statusAntideleteStoreMessage,
  statusAntideleteHandleUpdate: statusAntideleteHandleUpdate,
  updateStatusAntideleteSock: updateStatusAntideleteSock,
  name: "antideletestatus",
  aliases: ["ads2", "antistatusdelete"],
  description: "Recover deleted WhatsApp statuses",
  category: "owner",
  async execute(_0x54535, _0x118e1c, _0x488b32, _0xb58d99, _0x6c2e54) {
    const _0x4cf125 = _0x118e1c.key.remoteJid;
    try {
      await _0x54535.sendMessage(_0x4cf125, {
        react: {
          text: "📋",
          key: _0x118e1c.key
        }
      });
    } catch {}
    const _0xe71bc9 = getBotName();
    if (!_0x6c2e54?.isOwnerUser && !_0x6c2e54?.isSudoUser) {
      return _0x54535.sendMessage(_0x4cf125, {
        text: "╔═|〔  ANTI DELETE STATUS 〕\n║\n║ ▸ *Status* : ❌ Owner only\n║\n╚═|〔 " + _0xe71bc9 + " 〕"
      }, {
        quoted: _0x118e1c
      });
    }
    const _0x14f318 = toggle("antideletestatus");
    return _0x54535.sendMessage(_0x4cf125, {
      text: "╔═|〔  ANTI DELETE STATUS 〕\n║\n║ ▸ *State*  : " + (_0x14f318 ? "✅ Enabled" : "❌ Disabled") + "\n║ ▸ *Note*   : Deleted statuses sent to your DM\n║\n╚═|〔 " + _0xe71bc9 + " 〕"
    }, {
      quoted: _0x118e1c
    });
  }
};