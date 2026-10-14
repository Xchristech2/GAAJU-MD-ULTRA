'use strict';

module.exports = {
    name: "uptime",
    aliases: ["up", "runtime"],
    description: "Show how long the bot has been running",
    category: "utility",

    async execute(sock, msg) {
        const chatId = msg.key.remoteJid;

        try {
            await sock.sendMessage(chatId, {
                react: {
                    text: "⏱️",
                    key: msg.key
                }
            });
        } catch {}

        const uptime = process.uptime();

        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const parts = [];

        if (days) parts.push(`${days}d`);
        if (hours) parts.push(`${hours}h`);
        if (minutes) parts.push(`${minutes}m`);

        parts.push(`${seconds}s`);

        const text =
            `⏱️ *BOT UPTIME*\n\n` +
            `Runtime: *${parts.join(" ")}*\n` +
            `Status: ✅ Online`;

        await sock.sendMessage(
            chatId,
            { text },
            { quoted: msg }
        );
    }
};
