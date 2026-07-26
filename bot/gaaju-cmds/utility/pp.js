'use strict';

const { getBotName } = require("../../lib/botname");
const { getTarget, resolveDisplay } = require("../../lib/groupUtils");
const { dlBuffer } = require("../../lib/keithapi");

module.exports = {
    name: "pp",
    aliases: ["pfp", "profilepic", "avatar", "dp"],
    description: "Get someone's profile picture",
    category: "utility",

    async execute(sock, msg, args) {
        const chatId = msg.key.remoteJid;

        try {
            await sock.sendMessage(chatId, {
                react: {
                    text: "📸",
                    key: msg.key
                }
            });
        } catch {}

        let target = getTarget(msg, args);

        if (!target) {
            target = msg.key.participant || msg.key.remoteJid;
        }

        if (!target.includes("@")) {
            target = target.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        }

        const display = await resolveDisplay(sock, chatId, target).catch(() => null);
        const user = display || target.split("@")[0].split(":")[0];

        try {
            const url = await sock.profilePictureUrl(target, "image");
            const buffer = await dlBuffer(url);

            await sock.sendMessage(chatId, {
                image: buffer,
                caption: `\`\`\`ⓘ Profile Picture\nUser: ${user.startsWith("+") ? user : "+" + user}\`\`\``
            }, {
                quoted: msg
            });

        } catch {
            await sock.sendMessage(chatId, {
                text: `\`\`\`❌ No profile picture found.\nUser: ${user.startsWith("+") ? user : "+" + user}\`\`\``
            }, {
                quoted: msg
            });
        }
    }
};
