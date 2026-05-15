const {
  casperGet
} = require("../../lib/keithapi");
const {
  getBotName
} = require("../../lib/botname");
module.exports = {
  name: "npm",
  aliases: ["npminfo", "npmsearch", "package"],
  description: "Search and get info about any NPM package",
  category: "utility",
  async execute(_0x4cf067, _0x2e63ff, _0x49313f, _0x171684, _0x2bbecf) {
    const _0x519177 = _0x2e63ff.key.remoteJid;
    const _0x29c274 = getBotName();
    const _0x206e2f = _0x49313f.join(" ").trim();
    if (!_0x206e2f) {
      return _0x4cf067.sendMessage(_0x519177, {
        text: "╔═|〔  NPM SEARCH 〕\n║\n║ ▸ *Usage* : " + _0x171684 + "npm <package-name>\n║ ▸ *Example* : " + _0x171684 + "npm express\n║\n╚═|〔 " + _0x29c274 + " 〕"
      }, {
        quoted: _0x2e63ff
      });
    }
    try {
      await _0x4cf067.sendMessage(_0x519177, {
        react: {
          text: "🔍",
          key: _0x2e63ff.key
        }
      });
      const _0x25cabf = await casperGet("/api/downloader/npm", {
        query: _0x206e2f
      });
      if (!_0x25cabf.success || !_0x25cabf.package) {
        throw new Error(_0x25cabf.error || "Package not found");
      }
      const _0x44e25e = _0x25cabf.download;
      const _0x3b03a9 = _0x44e25e.latestVersion || "unknown";
      const _0x1d5829 = _0x44e25e.description || "No description";
      const _0x5be5e5 = _0x44e25e.versions?.[0];
      const _0x308c09 = _0x5be5e5?.tarball || "";
      const _0x583381 = _0x5be5e5?.publishDate ? new Date(_0x5be5e5.publishDate).toDateString() : "N/A";
      const _0xaa8f86 = _0x44e25e.versions?.length || 0;
      const _0x2bdafe = "╔═|〔  📦 NPM PACKAGE 〕\n║\n" + ("║ ▸ *Name*        : " + (_0x44e25e.name || _0x206e2f) + "\n") + ("║ ▸ *Description* : " + _0x1d5829 + "\n") + ("║ ▸ *Latest Ver*  : v" + _0x3b03a9 + "\n") + ("║ ▸ *Published*   : " + _0x583381 + "\n") + ("║ ▸ *Versions*    : " + _0xaa8f86 + " available\n") + (_0x308c09 ? "║ ▸ *Tarball*     : " + _0x308c09 + "\n" : "") + ("║\n╚═|〔 " + _0x29c274 + " 〕");
      await _0x4cf067.sendMessage(_0x519177, {
        text: _0x2bdafe
      }, {
        quoted: _0x2e63ff
      });
    } catch (_0x16e4f1) {
      await _0x4cf067.sendMessage(_0x519177, {
        text: "╔═|〔  NPM SEARCH 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x16e4f1.message + "\n║\n╚═|〔 " + _0x29c274 + " 〕"
      }, {
        quoted: _0x2e63ff
      });
    }
  }
};