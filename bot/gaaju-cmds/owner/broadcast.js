'use strict';

const {
  getBotName
} = require("../../lib/botname");

module.exports = {
  name: "broadcast",
  aliases: ["bc", "bcast"],
  description: "Broadcast a message to groups, chats and WhatsApp status",
  category: "owner",

  async execute(sock, msg, args, prefix, ctx) {

    const chatId = msg.key.remoteJid;
    const botName = getBotName();

    // ================= OWNER =================
    if (!ctx.isOwner()) {
      return sock.sendMessage(chatId, {
        text: `╭━━━〔 🚫 ACCESS DENIED 〕━━━╮
┃
┃  This command is restricted
┃  to the bot owner.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
      }, { quoted: msg });
    }

    // ================= TARGET =================
    const target = (args[0] || '').toLowerCase();

    if (!['groups', 'group', 'chats', 'chat', 'all'].includes(target)) {
      return sock.sendMessage(chatId, {
        text: `╭━━━〔 📡 BROADCAST CENTER 〕━━━╮
┃
┃  ${prefix}broadcast groups <text>
┃  ${prefix}broadcast chats <text>
┃  ${prefix}broadcast all <text>
┃
┃  ◉ GROUPS
┃    Send to all groups
┃
┃  ◉ CHATS
┃    Send to private chats
┃
┃  ◉ ALL
┃    Groups + private chats
┃
╰━━━━━━〔 ⚡ ${botName} 〕━━━━━━╯`
      }, { quoted: msg });
    }

    const targetName =
      target === 'group' ? 'groups' :
      target === 'chat' ? 'chats' :
      target;

    // ================= MESSAGE =================
    const broadcastText = args.slice(1).join(" ").trim();

    if (!broadcastText) {
      return sock.sendMessage(chatId, {
        text: `╭━━━〔 ⚠️ BROADCAST CENTER 〕━━━╮
┃
┃  Message not provided.
┃
┃  Example:
┃  ${prefix}broadcast groups Hello
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
      }, { quoted: msg });
    }

    try {

      // ================= GROUPS =================
      let groupChats = [];

      try {
        const groups = await sock.groupFetchAllParticipating();
        groupChats = Object.keys(groups || {});
      } catch {}

      // ================= PRIVATE CHATS =================
      let privateChats = [];

      try {

        const stores = [
          sock.store?.chats,
          sock.chats,
          globalThis.store?.chats,
          globalThis.chatStore?.chats,
          globalThis._chatStore?.chats
        ];

        for (const source of stores) {

          if (!source) continue;

          if (typeof source.all === 'function') {

            for (const chat of source.all() || []) {

              const id =
                chat?.id ||
                chat?.jid ||
                chat?.key?.remoteJid;

              if (
                id &&
                !id.endsWith('@g.us') &&
                !id.endsWith('@broadcast') &&
                id !== 'status@broadcast'
              ) {
                privateChats.push(id);
              }
            }

          } else if (source instanceof Map) {

            for (const [id, chat] of source.entries()) {

              const jid = chat?.id || id;

              if (
                jid &&
                !jid.endsWith('@g.us') &&
                !jid.endsWith('@broadcast') &&
                jid !== 'status@broadcast'
              ) {
                privateChats.push(jid);
              }
            }

          } else if (typeof source === 'object') {

            for (const [id, chat] of Object.entries(source)) {

              const jid = chat?.id || id;

              if (
                jid &&
                !jid.endsWith('@g.us') &&
                !jid.endsWith('@broadcast') &&
                jid !== 'status@broadcast'
              ) {
                privateChats.push(jid);
              }
            }
          }
        }

      } catch {}

      groupChats = [...new Set(groupChats)];
      privateChats = [...new Set(privateChats)];

      // ================= RECIPIENTS =================
      let recipients = [];

      if (targetName === 'groups') {
        recipients = groupChats;
      }

      if (targetName === 'chats') {
        recipients = privateChats;
      }

      if (targetName === 'all') {
        recipients = [
          ...new Set([
            ...groupChats,
            ...privateChats
          ])
        ];
      }

      if (!recipients.length) {
        return sock.sendMessage(chatId, {
          text: `╭━━━〔 📡 BROADCAST 〕━━━╮
┃
┃  ⚠️ No recipients found.
┃
┃  Target: ${targetName.toUpperCase()}
┃
╰━━━━━━〔 ${botName} 〕━━━━━━╯`
        }, { quoted: msg });
      }

      // ================= PROGRESS =================
      const progress = await sock.sendMessage(chatId, {
        text: `╭━━━〔 📡 LIVE BROADCAST 〕━━━╮
┃
┃  🎯 Target
┃     ${targetName.toUpperCase()}
┃
┃  📬 Recipients
┃     ${recipients.length} chat(s)
┃
┃  ⚡ Status
┃     Broadcasting...
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
      }, { quoted: msg });

      // ================= MESSAGE =================
      const broadcastMessage = `╭━━〔 📢 ANNOUNCEMENT 〕━━╮

${broadcastText}

╰━━〔 ${botName} 〕━━╯`;

      let sent = 0;
      let failed = 0;

      // ================= SEND =================
      for (const jid of recipients) {

        try {

          await sock.sendMessage(jid, {
            text: broadcastMessage
          });

          sent++;

          await new Promise(resolve =>
            setTimeout(resolve, 800)
          );

        } catch {

          failed++;
        }
      }

      // ================= STATUS =================
      let statusSent = false;

      try {

        await sock.sendMessage(
          'status@broadcast',
          {
            text: broadcastMessage
          }
        );

        statusSent = true;

      } catch {}

      // ================= RESULT =================
      const result = `╭━━━〔 📡 BROADCAST REPORT 〕━━━╮
┃
┃  🎯 Target   : ${targetName.toUpperCase()}
┃  📬 Delivered: ${sent}
┃  ❌ Failed   : ${failed}
┃  📱 Status   : ${statusSent ? 'ONLINE ✅' : 'FAILED ❌'}
┃
╰━━━〔 ⚡ ${botName} 〕━━━╯`;

      try {

        await sock.sendMessage(chatId, {
          text: result,
          edit: progress.key
        });

      } catch {

        await sock.sendMessage(chatId, {
          text: result
        }, { quoted: msg });
      }

      try {

        await sock.sendMessage(chatId, {
          react: {
            text: "📡",
            key: msg.key
          }
        });

      } catch {}

    } catch (error) {

      console.error("[BROADCAST ERROR]", error);

      await sock.sendMessage(chatId, {
        text: `╭━━━〔 ❌ BROADCAST ERROR 〕━━━╮
┃
┃  ${error.message}
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
      }, { quoted: msg });
    }
  }
};
