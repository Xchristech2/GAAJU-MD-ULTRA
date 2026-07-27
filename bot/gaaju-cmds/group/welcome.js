'use strict';

const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { getBotName } = require("../../lib/botname");
const { resolveDisplayWithName } = require("../../lib/groupUtils");

const CFG_FILE = path.join(__dirname, "../../data/welcome_data.json");

const CHANNEL_ID = "120363406588763460@newsletter";
const CHANNEL_LINK = "https://whatsapp.com/channel/0029VbBvGgyFsn0alyIDjw0z";

const DEFAULT_MSG = [
  "╭━━━〔 👋 WELCOME 〕━━━⬣",
  "┃",
  "┃ 🎉 {mention} just dropped in!",
  "┃ ✦ Group   : {group}",
  "┃ ✦ Member  : #{count}",
  "┃",
  "┃ 🌐 View Channel",
  "┃ 👉 " + CHANNEL_LINK,
  "┃",
  "╰━━━━━━━━━━━━━━━⬣"
].join("\n");

function loadCfg() {
  try {
    return JSON.parse(fs.readFileSync(CFG_FILE, "utf8"));
  } catch {
    return { groups: {} };
  }
}

function saveCfg(data) {
  fs.mkdirSync(path.dirname(CFG_FILE), { recursive: true });
  fs.writeFileSync(CFG_FILE, JSON.stringify(data, null, 2));
}

function applyVars(msg, data) {
  return msg
    .replace(/\{mention\}/g, data.mention || "")
    .replace(/\{name\}/g, data.name || "")
    .replace(/\{group\}/g, data.group || "")
    .replace(/\{count\}/g, data.count || "")
    .replace(/\{bot\}/g, data.bot || getBotName());
}

function normalizeJid(jid) {
  if (typeof jid === "string") {
    return jid.includes("@") ? jid : null;
  }
  return null;
}

async function fetchBuffer(url) {
  try {
    const res = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 10000
    });
    return Buffer.from(res.data);
  } catch {
    return null;
  }
}

function isWelcomeEnabled(id) {
  return !!loadCfg().groups?.[id]?.enabled;
}

function getWelcomeMessage(id) {
  return loadCfg().groups?.[id]?.message || DEFAULT_MSG;
}

async function sendWelcomeMessage(sock, groupId, users, msgTemplate, { approvedBy } = {}) {
  try {
    const meta = await sock.groupMetadata(groupId).catch(() => ({
      participants: [],
      subject: "Group"
    }));

    const groupName = meta.subject;
    const count = meta.participants.length;
    const bot = getBotName();

    for (const user of users) {

      const num = user.split("@")[0];

      const text = applyVars(msgTemplate, {
        mention: "@" + num,
        group: groupName,
        count,
        bot
      });

      await sock.sendMessage(groupId, {
        text,
        mentions: [user],

        contextInfo: {
          mentionedJid: [user],

          forwardedNewsletterMessageInfo: {
            newsletterJid: CHANNEL_ID,
            newsletterName: "GAAJU MD ULTRA",
            serverMessageId: 1
          },

          externalAdReply: {
            title: "🎉 Welcome to " + groupName,
            body: "👥 Member #" + count,
            mediaType: 1,
            sourceUrl: CHANNEL_LINK,
            renderLargerThumbnail: false
          }
        }
      });
    }

  } catch (e) {
    console.error("[WELCOME ERROR]", e.message);
  }
}

module.exports = {
  isWelcomeEnabled,
  getWelcomeMessage,
  sendWelcomeMessage,

  name: "welcome",
  aliases: ["setwelcome", "welcomeset"],
  category: "group",

  async execute(sock, msg, args, prefix, ctx) {

    const chatId = msg.key.remoteJid;

    const cfg = loadCfg();
    const group = cfg.groups?.[chatId] || {
      enabled: false,
      message: DEFAULT_MSG
    };

    const save = () => {
      cfg.groups = cfg.groups || {};
      cfg.groups[chatId] = group;
      saveCfg(cfg);
    };

    const cmd = args[0]?.toLowerCase();

    if (!cmd) {
      return sock.sendMessage(chatId, {
        text:
`╭━━━〔 👋 WELCOME 〕━━━⬣
┃
┃ ✦ State   : ${group.enabled ? "🟢 ON" : "🔴 OFF"}
┃
┃ 🌐 View Channel
┃ 👉 ${CHANNEL_LINK}
┃
╰━━━━━━━━━━━━━━━⬣`
      }, { quoted: msg });
    }

    if (cmd === "on") {
      group.enabled = true;
      save();
    }

    if (cmd === "off") {
      group.enabled = false;
      save();
    }

    return sock.sendMessage(chatId, {
      text:
`╭━━━〔 👋 WELCOME 〕━━━⬣
┃
┃ ✦ State : ${group.enabled ? "🟢 ON" : "🔴 OFF"}
┃
┃ 🌐 View Channel
┃ 👉 ${CHANNEL_LINK}
┃
╰━━━━━━━━━━━━━━━⬣`
    }, { quoted: msg });
  }
};
