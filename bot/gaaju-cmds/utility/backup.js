'use strict';

module.exports = {
  name: "backup",
  aliases: ["exportmembers", "vcfexport", "groupvcf"],
  description: "Export group member list as a VCF contacts file",
  category: "utility",
  async execute(_0x11f568, _0x571575, _0x4f087c, _0x37c415, _0x361074) {
    const _0x457dd5 = _0x571575.key.remoteJid;
    if (!_0x457dd5?.endsWith("@g.us")) {
      return _0x11f568.sendMessage(_0x457dd5, {
        text: "╔═|〔  BACKUP 〕\n║\n║ ▸ Groups only\n║\n╚═╝"
      }, {
        quoted: _0x571575
      });
    }
    if (!_0x361074?.isOwnerUser && !_0x361074?.isSudoUser && !_0x361074?.isGroupAdmin) {
      return _0x11f568.sendMessage(_0x457dd5, {
        text: "╔═|〔  BACKUP 〕\n║\n║ ▸ Admins/Owner only\n║\n╚═╝"
      }, {
        quoted: _0x571575
      });
    }
    try {
      await _0x11f568.sendMessage(_0x457dd5, {
        react: {
          text: "💾",
          key: _0x571575.key
        }
      });
    } catch {}
    let _0x22cb8a;
    try {
      _0x22cb8a = await _0x11f568.groupMetadata(_0x457dd5);
    } catch {
      return _0x11f568.sendMessage(_0x457dd5, {
        text: "╔═|〔  BACKUP 〕\n║\n║ ▸ ❌ Failed to fetch group info\n║\n╚═╝"
      }, {
        quoted: _0x571575
      });
    }
    const _0x2ad69e = _0x22cb8a.participants.map(_0x17288b => _0x17288b.id.split("@")[0].split(":")[0]).filter(_0x343f60 => /^\d+$/.test(_0x343f60));
    const _0x1cfcd4 = _0x2ad69e.map((_0x1cd7c8, _0x532457) => "BEGIN:VCARD\nVERSION:3.0\nFN:Member " + (_0x532457 + 1) + "\nTEL;TYPE=CELL:+" + _0x1cd7c8 + "\nEND:VCARD").join("\n");
    const _0x347213 = (_0x22cb8a.subject || "group").replace(/[^a-zA-Z0-9]/g, "_");
    await _0x11f568.sendMessage(_0x457dd5, {
      document: Buffer.from(_0x1cfcd4, "utf8"),
      mimetype: "text/vcard",
      fileName: _0x347213 + "_members.vcf",
      caption: ["╔═|〔  BACKUP 〕", "║", "║ ▸ *Group*   : " + _0x22cb8a.subject, "║ ▸ *Members* : " + _0x2ad69e.length, "║ ▸ *File*    : " + _0x347213 + "_members.vcf", "║", "╚═╝"].join("\n")
    }, {
      quoted: _0x571575
    });
  }
};