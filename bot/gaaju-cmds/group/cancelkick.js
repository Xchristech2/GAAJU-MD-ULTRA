'use strict';

const {
  checkPrivilege
} = require("../../lib/groupUtils");

const {
  getBotName
} = require("../../lib/botname");

// Use the exact same global state created by kickall.js.
const kickallState =
  globalThis.__GAAJU_KICKALL_STATE ||
  (globalThis.__GAAJU_KICKALL_STATE = new Map());

module.exports = {
  name: "cancelkick",
  aliases: ["stopkick", "abortkick"],
  description: "Cancel a running kickall process",
  category: "group",

  async execute(sock, msg, args, PREFIX, extra) {
    const chatId = msg.key.remoteJid;
    const botName = getBotName();

    try {
      await sock.sendMessage(chatId, {
        react: {
          text: "🛑",
          key: msg.key
        }
      });
    } catch {}

    if (!chatId.endsWith("@g.us")) {
      return sock.sendMessage(chatId, {
        text:
          `╔═|〔  CANCEL KICK 〕\n` +
          `║\n` +
          `║ ▸ *Status* : ❌ Group only\n` +
          `║\n` +
          `╚═|〔 ${botName} 〕`
      }, { quoted: msg });
    }

    const { ok } = await checkPrivilege(
      sock,
      chatId,
      msg,
      extra
    );

    if (!ok) {
      return sock.sendMessage(chatId, {
        text:
          `╔═|〔  CANCEL KICK 〕\n` +
          `║\n` +
          `║ ▸ *Status* : ❌ Permission denied\n` +
          `║ ▸ *Reason* : Sudo users and group admins only\n` +
          `║\n` +
          `╚═|〔 ${botName} 〕`
      }, { quoted: msg });
    }

    const state = kickallState.get(chatId);

    if (!state) {
      return sock.sendMessage(chatId, {
        text:
          `╔═|〔  CANCEL KICK 〕\n` +
          `║\n` +
          `║ ▸ *Status* : ℹ️ No kickall running\n` +
          `║\n` +
          `╚═|〔 ${botName} 〕`
      }, { quoted: msg });
    }

    // Tell the running kickall loop to stop.
    state.cancelled = true;

    return sock.sendMessage(chatId, {
      text:
        `╔═|〔  CANCEL KICK 〕\n` +
        `║\n` +
        `║ ▸ *Status* : 🛑 Cancellation requested\n` +
        `║ ▸ *Kicked* : ${state.kicked}/${state.total}\n` +
        `║ ▸ Remaining members will be left alone.\n` +
        `║\n` +
        `╚═|〔 ${botName} 〕`
    }, { quoted: msg });
  }
};
