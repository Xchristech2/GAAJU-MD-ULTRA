module.exports = {
  name: "groupinfo",
  aliases: ["ginfo"],
  description: "Show group information",
  category: "group",

  async execute(_0x2c1543, _0x519910, _0x4a634a, _0x580dec, _0x5dcf53) {

    const _0x17b0cd = _0x519910.key.remoteJid;

    const CHANNEL_ID = "120363406588763460@newsletter";
    const CHANNEL_LINK = "https://whatsapp.com/channel/0029VbBvGgyFsn0alyIDjw0z";

    try {
      await _0x2c1543.sendMessage(_0x17b0cd, {
        react: {
          text: "ℹ️",
          key: _0x519910.key
        }
      });
    } catch {}

    if (!_0x17b0cd.endsWith("@g.us")) {
      return _0x2c1543.sendMessage(_0x17b0cd, {
        text:
          "╔═|〔  GROUP INFO 〕\n║\n║ ▸ Group only command\n║\n╚═╝",

        contextInfo: {
          forwardedNewsletterMessageInfo: {
            newsletterJid: CHANNEL_ID,
            newsletterName: "GAAJU MD ULTRA",
            serverMessageId: 1
          },
          externalAdReply: {
            title: "GAAJU MD ULTRA",
            body: "View Channel",
            mediaType: 1,
            renderLargerThumbnail: false,
            showAdAttribution: true,
            sourceUrl: CHANNEL_LINK
          }
        }
      }, { quoted: _0x519910 });
    }

    try {

      const _0x3c069b = await _0x2c1543.groupMetadata(_0x17b0cd);

      const _0x4b501c =
        _0x3c069b.participants.filter(p => p.admin).length;

      const _0x146e29 =
        _0x3c069b.participants.length;

      const _0x5f00f0 =
        new Date(_0x3c069b.creation * 1000).toLocaleDateString("en-KE", {
          timeZone: "Africa/Lagos"
        });

      await _0x2c1543.sendMessage(_0x17b0cd, {
        text: [
          "╔═|〔  GROUP INFO 〕",
          "║",
          "║ ▸ *Name*    : " + _0x3c069b.subject,
          "║ ▸ *Members* : " + _0x146e29,
          "║ ▸ *Admins*  : " + _0x4b501c,
          "║ ▸ *Created* : " + _0x5f00f0,
          _0x3c069b.desc ? "║ ▸ *Desc*    : " + _0x3c069b.desc.slice(0, 80) : null,
          "║",
          "╚═╝"
        ].filter(Boolean).join("\n"),

        contextInfo: {
          forwardedNewsletterMessageInfo: {
            newsletterJid: CHANNEL_ID,
            newsletterName: "GAAJU MD ULTRA",
            serverMessageId: 1
          },
          externalAdReply: {
            title: "GAAJU MD ULTRA",
            body: "View Channel",
            mediaType: 1,
            renderLargerThumbnail: false,
            showAdAttribution: true,
            sourceUrl: CHANNEL_LINK
          }
        }
      }, { quoted: _0x519910 });

    } catch (_0x316e70) {

      await _0x2c1543.sendMessage(_0x17b0cd, {
        text:
          "╔═|〔  GROUP INFO 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : " + _0x316e70.message + "\n║\n╚═╝",

        contextInfo: {
          forwardedNewsletterMessageInfo: {
            newsletterJid: CHANNEL_ID,
            newsletterName: "GAAJU MD ULTRA",
            serverMessageId: 1
          },
          externalAdReply: {
            title: "GAAJU MD ULTRA",
            body: "View Channel",
            mediaType: 1,
            renderLargerThumbnail: false,
            showAdAttribution: true,
            sourceUrl: CHANNEL_LINK
          }
        }
      }, { quoted: _0x519910 });
    }
  }
};
