'use strict';

const { setConfig } = require("../../lib/database");

module.exports = {
    name: "setprefix",
    aliases: ["prefix", "changeprefix"],
    description: "Change the bot command prefix",
    category: "utility",
    ownerOnly: true,

    async execute(sock, msg, args, prefix, ctx) {

        const chatId = msg.key.remoteJid;

        try {
            await sock.sendMessage(chatId, {
                react: {
                    text: "✏️",
                    key: msg.key
                }
            });
        } catch {}

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

            const isCreator = cfg.CREATORS.includes(sender);

            if (
                sender !== owner &&
                !isSudoNumber(sender) &&
                !isCreator
            ) {
                return sock.sendMessage(chatId, {
                    text: "```❌ Owner only command.```"
                }, {
                    quoted: msg
                });
            }
        }

        const newPrefix = args[0];

        if (!newPrefix || newPrefix.length > 3) {
            return sock.sendMessage(chatId, {
                text:
                    "```ⓘ Usage: " +
                    prefix +
                    "setprefix <symbol>\nExample: " +
                    prefix +
                    "setprefix !```"
            }, {
                quoted: msg
            });
        }

        if (typeof globalThis.updatePrefixImmediately === "function") {

            globalThis.updatePrefixImmediately(newPrefix);

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
            }

            global.prefix = newPrefix;
            global.CURRENT_PREFIX = newPrefix;
            global.isPrefixless = false;
        }

        await sock.sendMessage(chatId, {
            text: `\`\`\`✅ Prefix updated!\nNew Prefix: ${newPrefix}\`\`\``
        }, {
            quoted: msg
        });
    }
};
