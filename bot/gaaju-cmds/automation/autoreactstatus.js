'use strict';

const { get, set } = require("../../lib/autoconfig");

const DEFAULT_EMOJIS = [
    "❤️", "🔥", "😍", "👍", "🎉",
    "💯", "😂", "🥰", "🫶", "✨"
];

function getCfg() {
    const config = get("autoreactstatus");

    return {
        enabled: config?.enabled ?? false,
        mode: config?.mode ?? "fixed",
        emoji: config?.emoji ?? "❤️",
        emojis: Array.isArray(config?.emojis) && config.emojis.length
            ? config.emojis
            : [...DEFAULT_EMOJIS]
    };
}

function saveCfg(updates) {
    const current = getCfg();

    set("autoreactstatus", {
        ...current,
        ...updates
    });
}

function pickEmoji(config) {
    if (config.mode === "random") {
        const emojis = config.emojis.length
            ? config.emojis
            : DEFAULT_EMOJIS;

        return emojis[Math.floor(Math.random() * emojis.length)];
    }

    return config.emoji || "❤️";
}

async function handleAutoReact(sock, status) {
    try {
        const config = getCfg();

        if (!config.enabled || !status?.id) return;

        const participant =
            status.participantPn ||
            (
                status.participant &&
                !status.participant.includes("@lid")
                    ? status.participant
                    : null
            ) ||
            status.remoteJid;

        if (!participant) return;

        const key = {
            remoteJid: "status@broadcast",
            id: status.id,
            fromMe: false,
            participant
        };

        await sock.sendMessage(
            "status@broadcast",
            {
                react: {
                    text: pickEmoji(config),
                    key
                }
            },
            {
                statusJidList: [participant]
            }
        );
    } catch (error) {
        // Ignore individual status reaction failures.
    }
}

async function sendText(sock, chatId, msg, text) {
    return sock.sendMessage(
        chatId,
        { text },
        { quoted: msg }
    );
}

module.exports = {
    name: "autolikestatus",
    aliases: ["als", "autoreactstatus", "ars", "autoreact"],
    description: "Automatically react to WhatsApp status updates",
    category: "automation",

    handleAutoReact,

    async execute(sock, msg, args, prefix, extra) {
        const chatId = msg.key.remoteJid;

        if (!extra?.isOwnerUser && !extra?.isSudoUser) {
            return sendText(
                sock,
                chatId,
                msg,
                "❌ This command is only available to the bot owner and sudo users."
            );
        }

        const action = (args[0] || "status").toLowerCase();
        const config = getCfg();
        const command = `${prefix || "."}als`;

        if (action === "status") {
            const mode = config.mode === "random"
                ? `🎲 Random\nEmojis: ${config.emojis.join(" ")}`
                : `📌 Fixed\nEmoji: ${config.emoji}`;

            return sendText(
                sock,
                chatId,
                msg,
                `❤️ *Auto Status Reaction*\n\n` +
                `Status: ${config.enabled ? "✅ Enabled" : "❌ Disabled"}\n` +
                `Mode: ${mode}\n\n` +
                `*Commands*\n` +
                `${command} on\n` +
                `${command} off\n` +
                `${command} fixed <emoji>\n` +
                `${command} random\n` +
                `${command} emojis <emoji> <emoji>\n` +
                `${command} reset`
            );
        }

        if (action === "on" || action === "off") {
            const enabled = action === "on";

            saveCfg({ enabled });

            return sendText(
                sock,
                chatId,
                msg,
                `❤️ Auto status reaction ${enabled ? "enabled" : "disabled"}.\n` +
                `Mode: ${getCfg().mode === "random" ? "Random 🎲" : "Fixed 📌"}`
            );
        }

        if (action === "fixed" || action === "emoji") {
            const emoji = args[1];

            if (!emoji) {
                return sendText(
                    sock,
                    chatId,
                    msg,
                    `Usage: ${command} fixed <emoji>\nExample: ${command} fixed 🔥`
                );
            }

            saveCfg({
                mode: "fixed",
                emoji
            });

            return sendText(
                sock,
                chatId,
                msg,
                `✅ Fixed reaction updated.\nEmoji: ${emoji}\nStatus: ${getCfg().enabled ? "Enabled" : "Disabled"}`
            );
        }

        if (action === "random") {
            saveCfg({ mode: "random" });

            return sendText(
                sock,
                chatId,
                msg,
                `🎲 Random reaction enabled.\nEmojis: ${getCfg().emojis.join(" ")}\nStatus: ${getCfg().enabled ? "Enabled" : "Disabled"}`
            );
        }

        if (action === "emojis" || action === "list") {
            const emojis = args.slice(1).filter(Boolean);

            if (!emojis.length) {
                return sendText(
                    sock,
                    chatId,
                    msg,
                    `Usage: ${command} emojis <emoji> <emoji>\nExample: ${command} emojis 🔥 ❤️ 😍 👍`
                );
            }

            saveCfg({
                emojis,
                mode: "random"
            });

            return sendText(
                sock,
                chatId,
                msg,
                `✅ Random emoji list updated.\nEmojis: ${emojis.join(" ")}\nStatus: ${getCfg().enabled ? "Enabled" : "Disabled"}`
            );
        }

        if (action === "reset") {
            saveCfg({
                mode: "fixed",
                emoji: "❤️",
                emojis: [...DEFAULT_EMOJIS]
            });

            return sendText(
                sock,
                chatId,
                msg,
                `✅ Reaction settings restored to defaults.\nMode: Fixed\nEmoji: ❤️\nStatus: ${getCfg().enabled ? "Enabled" : "Disabled"}`
            );
        }

        return sendText(
            sock,
            chatId,
            msg,
            `Unknown option: ${action}\nUse ${command} status to see the available commands.`
        );
    }
};
