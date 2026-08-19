'use strict';

const cfg = require("../../config");
const { getBotName } = require("../../lib/botname");

module.exports = {
    name: "alive",
    aliases: ["awake", "status", "online"],
    description: "Check if the bot is alive and running",
    category: "utility",

    async execute(sock, msg, args, prefix) {

        const chatId = msg.key.remoteJid;

        // ================= REACTION
        try {
            await sock.sendMessage(chatId, {
                react: {
                    text: "💚",
                    key: msg.key
                }
            });
        } catch {}

        const botName = getBotName();

        // ================= UPTIME
        const uptime = process.uptime();

        const h = Math.floor(uptime / 3600);
        const m = Math.floor((uptime % 3600) / 60);
        const s = Math.floor(uptime % 60);

        // ================= OWNER
        const owner = cfg.OWNER_NUMBER
            ? `+${cfg.OWNER_NUMBER}`
            : "Unknown";

        // ================= MODE
        const mode = (
            process.env.BOT_MODE ||
            cfg.MODE ||
            "public"
        ).toUpperCase();

        // ================= ALIVE MESSAGE
        const text = `╭━━━〔 💚 ${botName} 〕━━━⬣
┃
┃ ✦ Prefix : ${prefix || "."}
┃ ✦ Owner  : ${owner}
┃ ✦ Mode   : ${mode}
┃ ✦ Status : ✅ ONLINE
┃ ✦ Uptime : ${h}h ${m}m ${s}s
┃
╰━━━━━━〔 🚀 GAAJU ALIVE 〕⬣`;

        // ================= SEND
        await sock.sendMessage(
            chatId,
            {
                text
            },
            {
                quoted: msg
            }
        );
    }
};
