'use strict';

const {
    postPersonalStatus,
    processQuotedForStatus,
    buildStatusJidList
} = require('../../lib/statusHelper.js');

const EMOJI_RE =
    /^(?:\p{Extended_Pictographic}|\p{Emoji_Presentation})(?:\uFE0F|\uFE0E|\u200D|\p{Emoji_Modifier}|\p{Emoji_Modifier_Base}|\p{Regional_Indicator}|\p{Emoji_Component}|\u20E3|\p{Extended_Pictographic})*$/u;

function parseEmoji(value) {
    if (typeof value !== 'string') return null;

    const emoji = value.trim();

    if (!emoji || emoji.length > 32) return null;

    return EMOJI_RE.test(emoji) ? emoji : null;
}

function getErrorMessage(error) {
    const message = error?.message || 'Unknown error';

    if (/connection closed|connection reset|socket hang up/i.test(message)) {
        return '❌ The WhatsApp connection dropped. Please try again.';
    }

    if (/timed?[\s-]?out|deadline exceeded/i.test(message)) {
        return '❌ The operation timed out. Please try again.';
    }

    if (/media|upload|download/i.test(message)) {
        return '❌ The status media could not be processed. It may be unavailable or too large.';
    }

    return `❌ Reshare failed: ${message}`;
}

module.exports = {
    name: 'reshare',
    aliases: ['repost', 'rs'],
    description: 'Reshare a quoted WhatsApp status to your own status',
    category: 'owner',
    ownerOnly: true,

    async execute(sock, msg, args, prefix, extra = {}) {
        const chatId = msg.key.remoteJid;

        const send = (text, options = {}) =>
            sock.sendMessage(
                chatId,
                { text, ...options },
                { quoted: msg }
            );

        // Owner and sudo authorization
        try {
            const jidManager = extra.jidManager;

            const isOwner =
                typeof jidManager?.isOwner === 'function' &&
                jidManager.isOwner(msg);

            const isSudo =
                typeof extra.isSudo === 'function' &&
                await extra.isSudo();

            if (!isOwner && !isSudo) {
                return send('❌ This command is restricted to the bot owner and authorized sudo users.');
            }
        } catch (error) {
            console.error('[RESHARE] Permission check failed:', error.message);
            return send('❌ Could not verify your permissions. Please try again.');
        }

        // Read the replied-to message
        const contextInfo =
            msg.message?.extendedTextMessage?.contextInfo ||
            msg.message?.imageMessage?.contextInfo ||
            msg.message?.videoMessage?.contextInfo;

        const quotedMsg = contextInfo?.quotedMessage;
        const isStatusReply =
            contextInfo?.remoteJid === 'status@broadcast';

        if (!quotedMsg || !isStatusReply) {
            return send(
                `📤 *RESHARE STATUS*\n\n` +
                `Reply directly to a WhatsApp status with:\n\n` +
                `▸ *${prefix}reshare* — Use the default 🔄 reaction\n` +
                `▸ *${prefix}reshare 🔥* — Choose your emoji\n\n` +
                `*Supported content depends on your status helper:* text, images, and videos.\n\n` +
                `_Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ_`
            );
        }

        const emoji = parseEmoji(args[0]) || '🔄';

        try {
            await sock.sendMessage(chatId, {
                react: {
                    text: '⏳',
                    key: msg.key
                }
            }).catch(() => {});

            // Extract the quoted status content
            const processed = await processQuotedForStatus(quotedMsg, '');

            if (!processed?.content) {
                await sock.sendMessage(chatId, {
                    react: {
                        text: '❌',
                        key: msg.key
                    }
                }).catch(() => {});

                return send(
                    '❌ Could not read the status content. The status may have expired or its media may be unavailable.'
                );
            }

            const { content, mediaType } = processed;

            // Prepare the recipients and publish the status
            const statusJidList = await buildStatusJidList(sock);

            if (!Array.isArray(statusJidList) || statusJidList.length === 0) {
                return send(
                    '❌ No status recipients were found. Check your status-helper configuration and WhatsApp privacy settings.'
                );
            }

            console.log(
                `[RESHARE] Publishing ${mediaType || 'Unknown'} status to ${statusJidList.length} recipients.`
            );

            const extraOpts =
                mediaType === 'Text'
                    ? {
                        backgroundColor: '#1b5e20',
                        font: 0
                    }
                    : {};

            const result = await postPersonalStatus(
                sock,
                content,
                statusJidList,
                extraOpts
            );

            if (result === false || result?.error) {
                throw new Error(
                    result?.error || 'The status helper reported that publishing failed.'
                );
            }

            console.log(
                `[RESHARE] Publish completed. Type: ${mediaType || 'Unknown'}; Message ID: ${result?.key?.id || 'unavailable'}`
            );

            // Update the command message, or react if editing is unsupported
            try {
                await sock.sendMessage(chatId, {
                    text: emoji,
                    edit: msg.key
                });
            } catch (editError) {
                console.log(
                    `[RESHARE] Message edit unavailable: ${editError.message}`
                );

                await sock.sendMessage(chatId, {
                    react: {
                        text: emoji,
                        key: msg.key
                    }
                }).catch(() => {});
            }

        } catch (error) {
            console.error('[RESHARE] Error:', error);

            await sock.sendMessage(chatId, {
                react: {
                    text: '❌',
                    key: msg.key
                }
            }).catch(() => {});

            return send(getErrorMessage(error));
        }
    }
};
