const {
  casperGet,
  keithGet,
  extractUrl,
  dlBuffer
} = require("../../lib/keithapi");
const {
  getBotName
} = require("../../lib/botname");
module.exports = {
  name: "mf",
  aliases: ["mediafire", "mfire"],
  description: "Download file from MediaFire",
  category: "download",
  async execute(_0x11dc35, _0x36cb34, _0xab916d, _0x40bb66, _0x3846ad) {
    const _0x2865a0 = _0x36cb34.key.remoteJid;
    const _0x213c85 = getBotName();
    const _0x2aae33 = _0xab916d[0];
    if (!_0x2aae33) {
      return _0x11dc35.sendMessage(_0x2865a0, {
        text: "╔═|〔  MEDIAFIRE 〕\n║\n║ ▸ *Usage* : " + _0x40bb66 + "mf <mediafire_url>\n║\n╚═|〔 " + _0x213c85 + " 〕"
      }, {
        quoted: _0x36cb34
      });
    }
    try {
      let _0x2b8b35;
      let _0x4612b2;
      let _0x4a222a;
      try {
        const _0x2ae551 = await casperGet("/api/downloader/mediafire", {
          query: _0x2aae33
        });
        if (!_0x2ae551.success) {
          throw new Error(_0x2ae551.error || "Casper: no result");
        }
        const _0x205bd0 = _0x2ae551.file;
        if (!_0x205bd0?.downloadUrl) {
          throw new Error("Casper: no download URL");
        }
        _0x4612b2 = _0x205bd0.filename || _0x205bd0.title || _0x2aae33.split("/").pop()?.split("?")[0] || "file";
        _0x4a222a = _0x205bd0.fileSize || "";
        _0x2b8b35 = await dlBuffer(_0x205bd0.downloadUrl);
      } catch {
        const _0x572851 = await keithGet("/download/mfire", {
          url: _0x2aae33
        });
        if (!_0x572851.status) {
          throw new Error(_0x572851.error || "fallback failed");
        }
        const _0x12475f = extractUrl(_0x572851.result);
        if (!_0x12475f) {
          throw new Error("No fallback URL");
        }
        _0x2b8b35 = await dlBuffer(_0x12475f);
        _0x4612b2 = _0x2aae33.split("/").pop()?.split("?")[0] || "file";
        _0x4a222a = "";
      }
      const _0x57652c = "╔═|〔  MEDIAFIRE 〕\n║\n║ ▸ *File* : " + _0x4612b2 + "\n║ ▸ *Size* : " + (_0x4a222a || (_0x2b8b35.length / 1024 / 1024).toFixed(2) + " MB") + "\n║\n╚═|〔 " + _0x213c85 + " 〕";
      await _0x11dc35.sendMessage(_0x2865a0, {
        document: _0x2b8b35,
        mimetype: "application/octet-stream",
        fileName: _0x4612b2,
        caption: _0x57652c
      }, {
        quoted: _0x36cb34
      });
    } catch (_0xa8ae00) {
      await _0x11dc35.sendMessage(_0x2865a0, {
        text: "╔═|〔  MEDIAFIRE 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0xa8ae00.message + "\n║\n╚═|〔 " + _0x213c85 + " 〕"
      }, {
        quoted: _0x36cb34
      });
    }
  }
};