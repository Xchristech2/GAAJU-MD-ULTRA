'use strict';

const { getBotName } = require("../../lib/botname");

globalThis.groupListCache = globalThis.groupListCache || [];
globalThis.groupListMsgIds = globalThis.groupListMsgIds || new Set();

module.exports = {
    name: "mygroups",
    aliases: ["groups", "listgroups", "grouplist"],
    description: "List all groups the bot is currently in",
    category: "utility",

    async execute(sock, msg, args, prefix, ctx) {

        const chatId = msg.key.remoteJid;

        try {
            await sock.sendMessage(chatId, {
                react: {
                    text: "👥",
                    key: msg.key
                }
            });
        } catch {}

        if (!ctx?.isOwnerUser && !ctx?.isSudoUser) {
            return sock.sendMessage(chatId, {
                text: "```❌ Owner only command.```"
            }, {
                quoted: msg
            });
        }

        try {
            await sock.sendMessage(chatId, {
                react: {
                    text: "⏳",
                    key: msg.key
                }
            });

            const groups = await sock.groupFetchAllParticipating();
            const list = Object.values(groups || {});

            if (!list.length) {
                return sock.sendMessage(chatId, {
                    text: "```ⓘ The bot is not in any groups.```"
                }, {
                    quoted: msg
                });
            }

            globalThis.groupListCache = list.map((g, i) => ({
                index: i + 1,
                id: g.id,
                name: g.subject || "Unknown",
                size: (g.participants || []).length
            }));

            const perPage = 20;
            const page = Math.max(0, parseInt(args[0]) - 1 || 0);

            const current = globalThis.groupListCache.slice(
                page * perPage,
                (page + 1) * perPage
            );

            const total = globalThis.groupListCache.length;
            const pages = Math.ceil(total / perPage);

            let text = `\`\`\`ⓘ My Groups\n\nTotal Groups: ${total}\n\n`;

            for (const group of current) {
                text += `${group.index}. ${group.name} (${group.size} members)\n`;
            }

            if (pages > 1) {
                text += `\nPage ${page + 1}/${pages}\nUse ${prefix}mygroups <page>`;
            }

            text += "```";

            const sent = await sock.sendMessage(chatId, {
                text
            }, {
                quoted: msg
            });

            if (sent?.key?.id) {
                globalThis.groupListMsgIds.add(sent.key.id);
            }

            await sock.sendMessage(chatId, {
                react: {
                    text: "✅",
                    key: msg.key
                }
            });

        } catch (err) {

            await sock.sendMessage(chatId, {
                react: {
                    text: "❌",
                    key: msg.key
                }
            });

            await sock.sendMessage(chatId, {
                text: `\`\`\`❌ Error\n${err.message}\`\`\``
            }, {
                quoted: msg
            });
        }
    }
};
