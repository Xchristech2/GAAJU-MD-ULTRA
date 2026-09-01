'use strict';

const { setConfig } = require("../../lib/database");
const { getBotName } = require("../../lib/botname");

module.exports = {
    name: "setprefix",
    aliases: ["prefix", "changeprefix"],
    description: "Change the bot command prefix",
    category: "utility",
    ownerOnly: true,

    async execute(sock, msg, args, prefix, ctx) {

        const chatId = msg.key.remoteJid;
        const botName = getBotName();

        try {
            await sock.sendMessage(chatId, {
                react: {
                    text: "✏️",
                    key: msg.key
                }
            });
        } catch {}

        // =========================
        // OWNER / SUDO CHECK
        // =========================

        const {
            isSudoUser,
            isOwnerUser
        } = ctx || {};

        if (!isSudoUser && !isOwnerUser) {

            const cfg = require("../../config");
            const { isSudoNumber } = require("../../lib/sudo-store");

            const sender = (
                msg.key.participant ||
                msg.key.remoteJid ||
                ""
            )
                .split("@")[0]
                .split(":")[0]
                .replace(/[^0-9]/g, "");

            const owner = (cfg.OWNER_NUMBER || "")
                .replace(/[^0-9]/g, "");

            const creators = Array.isArray(cfg.CREATORS)
                ? cfg.CREATORS
                : [];

            const isCreator = creators.some(num =>
                String(num)
                    .replace(/[^0-9]/g, "") === sender
            );

            if (
                sender !== owner &&
                !isSudoNumber(sender) &&
                !isCreator
            ) {
                return sock.sendMessage(chatId, {
                    text: "┏━━❐ *SET PREFIX* ❐━━\n" +
                          "┃✦ ❌ Owner only command.\n" +
                          "┗━━❐ *" + botName + "* ❐"
                }, {
                    quoted: msg
                });
            }
        }

        // =========================
        // CHECK ARGUMENT
        // =========================

        const input = String(args[0] || "").trim();

        if (!input) {
            return sock.sendMessage(chatId, {
                text:
                    "┏━━❐ *SET PREFIX* ❐━━\n" +
                    "┃✦ Usage: " + prefix + "setprefix <symbol>\n" +
                    "┃\n" +
                    "┃✦ Examples:\n" +
                    "┃  • " + prefix + "setprefix !\n" +
                    "┃  • " + prefix + "setprefix #\n" +
                    "┃  • " + prefix + "setprefix none\n" +
                    "┃  • " + prefix + "setprefix non\n" +
                    "┃  • " + prefix + "setprefix off\n" +
                    "┃\n" +
                    "┃✦ Use *none* to disable the prefix.\n" +
                    "┗━━❐ *" + botName + "* ❐"
            }, {
                quoted: msg
            });
        }

        // =========================
        // PREFIXLESS MODE
        // =========================

        const prefixlessWords = [
            "none",
            "non",
            "off",
            "noprefix"
        ];

        const isPrefixless = prefixlessWords.includes(
            input.toLowerCase()
        );

        try {

            // -------------------------
            // PREFIXLESS
            // -------------------------

            if (isPrefixless) {

                if (
                    typeof globalThis.updatePrefixImmediately ===
                    "function"
                ) {

                    // Keep the existing helper call style.
                    // The helper receives an empty prefix.
                    await globalThis.updatePrefixImmediately("");

                } else {

                    await setConfig("prefix_config", {
                        prefix: "",
                        isPrefixless: true,
                        setAt: new Date().toISOString(),
                        timestamp: Date.now()
                    });

                    await setConfig("bot_settings", {
                        prefix: "",
                        isPrefixless: true,
                        prefixSetAt: new Date().toISOString()
                    });

                    process.env.PREFIX = "";

                    if (global.botConfig) {
                        global.botConfig.PREFIX = "";
                        global.botConfig.isPrefixless = true;
                    }

                    global.prefix = "";
                    global.CURRENT_PREFIX = "";
                    global.isPrefixless = true;
                }

                // Make sure global state reflects the mode.
                global.isPrefixless = true;
                global.prefix = "";
                global.CURRENT_PREFIX = "";

                if (global.botConfig) {
                    global.botConfig.PREFIX = "";
                    global.botConfig.isPrefixless = true;
                }

                process.env.PREFIX = "";

                return await sock.sendMessage(chatId, {
                    text:
                        "┏━━❐ *SET PREFIX* ❐━━\n" +
                        "┃✦ ✅ Prefix disabled!\n" +
                        "┃\n" +
                        "┃✦ Mode: *PREFIXLESS*\n" +
                        "┃✦ Prefix: *NONE*\n" +
                        "┃\n" +
                        "┃✦ Commands can now be used without a prefix\n" +
                        "┃  if your command handler supports prefixless mode.\n" +
                        "┗━━❐ *" + botName + "* ❐"
                }, {
                    quoted: msg
                });
            }

            // =========================
            // NORMAL PREFIX MODE
            // =========================

            if (input.length > 3) {
                return await sock.sendMessage(chatId, {
                    text:
                        "┏━━❐ *SET PREFIX* ❐━━\n" +
                        "┃✦ ❌ Prefix is too long.\n" +
                        "┃✦ Maximum: *3 characters*\n" +
                        "┗━━❐ *" + botName + "* ❐"
                }, {
                    quoted: msg
                });
            }

            const newPrefix = input;

            if (
                typeof globalThis.updatePrefixImmediately ===
                "function"
            ) {

                // Keep the same one-argument interface
                // used by your existing code.
                await globalThis.updatePrefixImmediately(newPrefix);

            } else {

                await setConfig("prefix_config", {
                    prefix: newPrefix,
                    isPrefixless: false,
                    setAt: new Date().toISOString(),
                    timestamp: Date.now()
                });

                await setConfig("bot_settings", {
                    prefix: newPrefix,
                    isPrefixless: false,
                    prefixSetAt: new Date().toISOString()
                });

                process.env.PREFIX = newPrefix;

                if (global.botConfig) {
                    global.botConfig.PREFIX = newPrefix;
                    global.botConfig.isPrefixless = false;
                }

                global.prefix = newPrefix;
                global.CURRENT_PREFIX = newPrefix;
                global.isPrefixless = false;
            }

            // Keep global state synchronized.
            global.prefix = newPrefix;
            global.CURRENT_PREFIX = newPrefix;
            global.isPrefixless = false;
            process.env.PREFIX = newPrefix;

            if (global.botConfig) {
                global.botConfig.PREFIX = newPrefix;
                global.botConfig.isPrefixless = false;
            }

            return await sock.sendMessage(chatId, {
                text:
                    "┏━━❐ *SET PREFIX* ❐━━\n" +
                    "┃✦ ✅ Prefix updated!\n" +
                    "┃\n" +
                    "┃✦ New Prefix: *" + newPrefix + "*\n" +
                    "┃✦ Mode: *PREFIX MODE*\n" +
                    "┗━━❐ *" + botName + "* ❐"
            }, {
                quoted: msg
            });

        } catch (error) {

            console.error("[SETPREFIX ERROR]", error);

            return await sock.sendMessage(chatId, {
                text:
                    "┏━━❐ *SET PREFIX* ❐━━\n" +
                    "┃✦ ❌ Failed to update prefix.\n" +
                    "┃✦ Error: " +
                    (error.message || "Unknown error") +
                    "\n" +
                    "┗━━❐ *" + botName + "* ❐"
            }, {
                quoted: msg
            });
        }
    }
};
