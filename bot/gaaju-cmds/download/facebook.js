'use strict';

const {
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

      // ================= GZ FACEBOOK API
      const apiUrl =
        `https://gzapis.vercel.app/api/facebook?apikey=Godszeal&url=${encodeURIComponent(url)}`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();

      if (!result || result.status !== "success") {
        throw new Error(
          result?.message ||
          result?.error ||
          "Facebook API returned no result"
        );
      }

      // ================= GET DOWNLOAD URL
      const downloadUrl =
        result.download ||
        result.downloadUrl ||
        result.url ||
        result.video ||
        result.hd ||
        result.hd_url ||
        result.links?.hd ||
        result.links?.["720p"] ||
        result.data?.download ||
        result.data?.hd;

      const title =
        result.title ||
        result.caption ||
        result.data?.title ||
        "Facebook Video";

      const quality =
        result.quality ||
        result.data?.quality ||
        "HD";

      if (!downloadUrl) {
        throw new Error("No Facebook video download URL found");
      }

      // ================= DOWNLOAD VIDEO
      const buffer = await dlBuffer(downloadUrl);

      if (!buffer || !buffer.length) {
        throw new Error("Failed to download Facebook video");
      }

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

      console.error("[FB ERROR]", error);

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
