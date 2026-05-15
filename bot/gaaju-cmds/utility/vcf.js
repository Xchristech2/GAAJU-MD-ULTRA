'use strict';

const fs = require("fs");
const os = require("os");
const path = require("path");
const {
  resolveDisplayWithName
} = require("../../lib/groupUtils");
function e164(_0x4ad8f4) {
  return "+" + _0x4ad8f4;
}
function escapeName(_0x21e2b9) {
  return (_0x21e2b9 || "").replace(/[;:,\\]/g, " ").trim();
}
function parseDisplayStr(_0x3a5fc8) {
  const _0x652888 = _0x3a5fc8.indexOf(" ~ *");
  if (_0x652888 >= 0) {
    return {
      phone: _0x3a5fc8.slice(0, _0x652888).trim(),
      name: _0x3a5fc8.slice(_0x652888 + 4).replace(/\*$/, "").trim() || null
    };
  }
  return {
    phone: _0x3a5fc8.trim(),
    name: null
  };
}
function makeVcard(_0x1ed011, _0x55fbba) {
  const _0x122e49 = _0x55fbba ? escapeName(_0x55fbba) : null;
  const _0x7caacf = _0x122e49 ? _0x122e49 + " - " + e164(_0x1ed011) : e164(_0x1ed011);
  const _0x42d025 = _0x122e49 ? _0x122e49.split(" ") : [];
  const _0x47c96c = _0x42d025[0] || "";
  const _0xd6fcca = _0x42d025.slice(1).join(" ");
  return ["BEGIN:VCARD", "VERSION:3.0", "FN:" + _0x7caacf, "N:" + _0x47c96c + ";" + _0xd6fcca + ";;;", "TEL;type=CELL;type=VOICE;waid=" + _0x1ed011 + ":" + e164(_0x1ed011), "END:VCARD"].join("\r\n");
}
module.exports = {
  name: "vcf",
  aliases: ["contact", "vcard", "sendcontact", "groupvcf", "savecontacts"],
  description: "Single contact card, or export all group members as an importable .vcf file",
  category: "utility",
  async execute(_0x139e1a, _0x35301c, _0xccffaf, _0x3bc1b6, _0x518864) {
    const _0x1ae48e = _0x35301c.key.remoteJid;
    const _0x29babf = _0x1ae48e.endsWith("@g.us");
    const _0x315283 = _0xccffaf.join(" ").trim();
    try {
      await _0x139e1a.sendMessage(_0x1ae48e, {
        react: {
          text: "📇",
          key: _0x35301c.key
        }
      });
    } catch {}
    if (_0x315283) {
      const _0x380446 = _0x315283.split(/\s+/);
      const _0xcf51ef = _0x380446.find(_0x8af7c7 => /^[+\d]/.test(_0x8af7c7) && _0x8af7c7.replace(/\D/g, "").length >= 7);
      const _0x35b583 = _0x380446.filter(_0xc64c5c => _0xc64c5c !== _0xcf51ef).join(" ").trim();
      if (!_0xcf51ef) {
        return _0x139e1a.sendMessage(_0x1ae48e, {
          text: "╔═|〔  CONTACT CARD 〕\n║\n║ ▸ ❌ No phone number found\n║ ▸ Include country code: +254...\n║\n║ ▸ *Usage* : " + _0x3bc1b6 + "vcf <name> <number>\n║ ▸ *Group* : " + _0x3bc1b6 + "vcf  (no args = export all)\n║\n╚═╝"
        }, {
          quoted: _0x35301c
        });
      }
      const _0x565929 = _0xcf51ef.replace(/\D/g, "");
      const _0x4560ac = _0x35b583 || e164(_0x565929);
      await _0x139e1a.sendMessage(_0x1ae48e, {
        contacts: {
          displayName: _0x4560ac,
          contacts: [{
            vcard: makeVcard(_0x565929, _0x35b583 || null)
          }]
        }
      }, {
        quoted: _0x35301c
      });
      return;
    }
    if (!_0x29babf) {
      return _0x139e1a.sendMessage(_0x1ae48e, {
        text: "╔═|〔  CONTACT CARD 〕\n║\n║ ▸ *Usage* : " + _0x3bc1b6 + "vcf <name> <number>\n║ ▸ Example : " + _0x3bc1b6 + "vcf John +254712345678\n║\n║ ▸ In a group (no args):\n║   Exports all members as a .vcf file\n║   Tap the file → Import all contacts\n║\n╚═╝"
      }, {
        quoted: _0x35301c
      });
    }
    let _0x4c675a;
    try {
      _0x4c675a = await _0x139e1a.groupMetadata(_0x1ae48e);
    } catch (_0x14cf8d) {
      return _0x139e1a.sendMessage(_0x1ae48e, {
        text: "╔═|〔  GROUP CONTACTS 〕\n║\n║ ▸ ❌ " + _0x14cf8d.message + "\n║\n╚═╝"
      }, {
        quoted: _0x35301c
      });
    }
    const _0x4f01bd = _0x4c675a.participants || [];
    if (!_0x4f01bd.length) {
      return _0x139e1a.sendMessage(_0x1ae48e, {
        text: "╔═|〔  GROUP CONTACTS 〕\n║\n║ ▸ ❌ No members found\n║\n╚═╝"
      }, {
        quoted: _0x35301c
      });
    }
    const _0x28c0d9 = [];
    const _0x457a5a = [];
    for (const _0x20feee of _0x4f01bd) {
      const _0x5f4f15 = _0x20feee.id || _0x20feee.jid || "";
      if (!_0x5f4f15) {
        continue;
      }
      try {
        const _0x4c3c0e = await resolveDisplayWithName(_0x139e1a, _0x1ae48e, _0x5f4f15, _0x20feee.notify || null);
        const {
          phone: _0x4fe419,
          name: _0x2d3134
        } = parseDisplayStr(_0x4c3c0e);
        if (!_0x4fe419.startsWith("+")) {
          _0x457a5a.push(_0x5f4f15);
          continue;
        }
        const _0x4edf98 = _0x4fe419.replace(/\D/g, "");
        if (_0x4edf98.length < 7 || _0x4edf98.length > 15) {
          _0x457a5a.push(_0x5f4f15);
          continue;
        }
        _0x28c0d9.push(makeVcard(_0x4edf98, _0x2d3134));
      } catch {
        _0x457a5a.push(_0x5f4f15);
      }
    }
    if (!_0x28c0d9.length) {
      return _0x139e1a.sendMessage(_0x1ae48e, {
        text: "╔═|〔  GROUP CONTACTS 〕\n║\n║ ▸ ❌ Could not resolve any numbers\n║ ▸ Members : " + _0x4f01bd.length + "\n║ ▸ Skipped : " + _0x457a5a.length + " (unresolved LIDs)\n║\n║ ▸ Tip: Ask members to send a message\n║   so the bot learns their numbers\n║\n╚═╝"
      }, {
        quoted: _0x35301c
      });
    }
    const _0x39ba3f = (_0x4c675a.subject || "Group").replace(/[^a-zA-Z0-9 _-]/g, "").trim() || "Group";
    const _0x41b656 = _0x39ba3f + "_contacts.vcf";
    const _0x4e7fd7 = path.join(os.tmpdir(), "vcf_" + Date.now() + "_" + _0x41b656);
    fs.writeFileSync(_0x4e7fd7, _0x28c0d9.join("\r\n") + "\r\n", "utf-8");
    const _0x3651ea = _0x457a5a.length ? "\n║ ▸ Skipped  : " + _0x457a5a.length + " (unresolved)" : "";
    try {
      const _0x221c7c = fs.readFileSync(_0x4e7fd7);
      await _0x139e1a.sendMessage(_0x1ae48e, {
        document: _0x221c7c,
        mimetype: "text/vcard",
        fileName: _0x41b656,
        caption: "╔═|〔  GROUP CONTACTS 〕\n║\n║ ▸ ✅ *" + _0x39ba3f + "*\n║ ▸ Contacts : " + _0x28c0d9.length + "/" + _0x4f01bd.length + _0x3651ea + "\n║\n║ ▸ 📲 Tap the file → *Import*\n║   to save all numbers at once\n║\n╚═╝"
      }, {
        quoted: _0x35301c
      });
    } finally {
      try {
        fs.unlinkSync(_0x4e7fd7);
      } catch {}
    }
  }
};