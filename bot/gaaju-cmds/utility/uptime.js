module.exports = {
  name: "uptime",
  aliases: ["up", "runtime"],
  description: "Show how long the bot has been running",
  category: "utility",
  async execute(_0x9d31e, _0x8e593c, _0x4abf4d, _0xe49667, _0x1249d6) {
    const _0x1cadeb = _0x8e593c.key.remoteJid;
    try {
      await _0x9d31e.sendMessage(_0x1cadeb, {
        react: {
          text: "⏱️",
          key: _0x8e593c.key
        }
      });
    } catch {}
    const _0x80fd31 = process.uptime();
    const _0x2b6d98 = Math.floor(_0x80fd31 / 86400);
    const _0x253a7a = Math.floor(_0x80fd31 % 86400 / 3600);
    const _0xc8e476 = Math.floor(_0x80fd31 % 3600 / 60);
    const _0x39e2d7 = Math.floor(_0x80fd31 % 60);
    const _0xbd8bb2 = [];
    if (_0x2b6d98) {
      _0xbd8bb2.push(_0x2b6d98 + "d");
    }
    if (_0x253a7a) {
      _0xbd8bb2.push(_0x253a7a + "h");
    }
    if (_0xc8e476) {
      _0xbd8bb2.push(_0xc8e476 + "m");
    }
    _0xbd8bb2.push(_0x39e2d7 + "s");
    await _0x9d31e.sendMessage(_0x1cadeb, {
      text: "╔═|〔  UPTIME 〕\n║\n║ ▸ *Runtime* : " + _0xbd8bb2.join(" ") + "\n║\n╚═╝"
    }, {
      quoted: _0x8e593c
    });
  }
};