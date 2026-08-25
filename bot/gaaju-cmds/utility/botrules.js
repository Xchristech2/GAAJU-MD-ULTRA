'use strict';

module.exports = {
    name: 'botrules',
    aliases: ['rules', 'botrule'],
    description: 'Show the bot usage rules',
    category: 'utility',

    async execute(sock, msg, args, prefix) {
        const p = prefix || '.';

        const text = `
┏━━❐ ✦ BOT RULES ✦ ❐
┃
┃ ✦ Please don't spam commands.
┃
┃ ✦ Do not use the bot too frequently
┃   in DM. Excessive DM usage can cause
┃   your WhatsApp account to be restricted.
┃
┃ ✦ Avoid sending the same command
┃   repeatedly within a short time.
┃
┃ ✦ Don't abuse download commands.
┃
┃ ✦ Don't use the bot for illegal,
┃   harmful, or abusive activities.
┃
┃ ✦ Respect WhatsApp's Terms of Service.
┃
┃ ✦ If a command isn't working, wait
┃   a little before trying again.
┃
┃ ✦ Don't flood groups with bot commands.
┃
┃ ✦ Use the bot responsibly.
┃
┗━━❐

┏━━❐ ✦ IMPORTANT ✦ ❐
┃
┃ ⚠️ Do not often use the bot on DM.
┃ It can cause restrictions on your
┃ WhatsApp account if abused.
┃
┗━━❐

        Powered by GAAJU-MD ULTRA
`;

        await sock.sendMessage(
            msg.key.remoteJid,
            { text },
            { quoted: msg }
        );
    }
};
