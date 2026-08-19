'use strict';

const {
  casperGet,
  keithTry,
  extractUrl,
  dlBuffer
} = require("../../lib/keithapi");

const {
  getBotName
} = require("../../lib/botname");

module.exports = {
  name: "fb",
  aliases: ["facebook", "fbdl", "fbdown"],
  description: "Download Facebook video (HD/SD)",
  category: "download",

  async execute(sock, msg, args, prefix) {

    const chatId = msg.key.remoteJid;
    const botName = getBotName();
    const url = args[0];

    // ================= USAGE
    if (!url) {
      return sock.sendMessage(chatId, {
        text: `╭━━━〔 📘 FACEBOOK 〕━━━⬣
┃
┃ ✦ Usage : ${prefix}fb <url>
┃
╰━━━━━━〔 🤖 ${botName} 〕⬣`
      }, {
        quoted: msg
      });
    }

    try {

      let downloadUrl;
      let title;
      let quality;

      // ================= CASPER API
      try {

        const result = await casperGet("/api/downloader/fb", {
          url: url
        });

        if (!result.success) {
          throw new Error(result.error || "Casper: no result");
        }

        downloadUrl =
          result.primaryDownload ||
          result.downloads?.[0]?.url;

        title =
          result.title ||
          "Facebook Video";

        quality =
          result.downloads?.[0]?.quality ||
          "HD";

        if (!downloadUrl) {
          throw new Error("Casper: no download URL");
        }

      } catch {

        // ================= KEITH FALLBACK
        const result = await keithTry(
          ["/download/fbdl", "/download/fbdown"],
          {
            url: url
          }
        );

        downloadUrl = extractUrl(result.result);
        title = "Facebook Video";
        quality = "HD";

        if (!downloadUrl) {
          throw new Error("No download URL found");
        }
      }

      // ================= DOWNLOAD
      const buffer = await dlBuffer(downloadUrl);

      const size =
        (buffer.length / 1024 / 1024).toFixed(2);

      // ================= CAPTION
      const caption = `╭━━━〔 📘 FACEBOOK 〕━━━⬣
┃
┃ ✦ Title   : ${title}
┃ ✦ Quality : ${quality}
┃ ✦ Size    : ${size} MB
┃ ✦ Status  : ✅ Downloaded
┃
╰━━━━━━〔 🤖 ${botName} 〕⬣`;

      // ================= SEND VIDEO
      await sock.sendMessage(chatId, {
        video: buffer,
        caption: caption
      }, {
        quoted: msg
      });

    } catch (error) {

      // ================= ERROR
      await sock.sendMessage(chatId, {
        text: `╭━━━〔 📘 FACEBOOK 〕━━━⬣
┃
┃ ✦ Status : ❌ Failed
┃ ✦ Reason : ${error.message}
┃
╰━━━━━━〔 🤖 ${botName} 〕⬣`
      }, {
        quoted: msg
      });
    }
  }
};
