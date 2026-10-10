'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'data');
const CONFIG_PATH = path.join(DATA_DIR, 'anticall.json');

const DEFAULT_CONFIG = {
    mode: 'off',
    message: "My owner is currently unavailable or busy. Please send a message instead."
};

function ensureConfig() {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }

        if (!fs.existsSync(CONFIG_PATH)) {
            fs.writeFileSync(
                CONFIG_PATH,
                JSON.stringify(DEFAULT_CONFIG, null, 2)
            );
        }
    } catch (error) {
        console.error('[ANTICALL] Config initialization failed:', error.message);
    }
}

function getConfig() {
    ensureConfig();

    try {
        const saved = JSON.parse(
            fs.readFileSync(CONFIG_PATH, 'utf8')
        );

        return {
            ...DEFAULT_CONFIG,
            ...saved
        };
    } catch (error) {
        console.error('[ANTICALL] Config read failed:', error.message);
        return { ...DEFAULT_CONFIG };
    }
}

function saveConfig(config) {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }

        fs.writeFileSync(
            CONFIG_PATH,
            JSON.stringify(
                { ...DEFAULT_CONFIG, ...config },
                null,
                2
            )
        );

        return true;
    } catch (error) {
        console.error('[ANTICALL] Config save failed:', error.message);
        return false;
    }
}

function getCaller(call) {
    return call?.from || call?.peerJid || call?.callerPn || null;
}

function getCallId(call) {
    return call?.id || call?.callId || null;
}

function isIncomingOffer(call) {
    return String(call?.status || '').toLowerCase() === 'offer';
}

const processedCalls = new Map();
const initializedSockets = new WeakSet();

/**
 * Register incoming-call handling on the active WhatsApp socket.
 */
function initAntiCall(sock) {
    if (!sock?.ev || typeof sock.ev.on !== 'function') {
        console.error('[ANTICALL] Invalid WhatsApp socket.');
        return false;
    }

    if (initializedSockets.has(sock)) {
        return true;
    }

    initializedSockets.add(sock);

    console.log('[ANTICALL] Incoming-call listener registered.');

    sock.ev.on('call', async (events) => {
        try {
            const calls = Array.isArray(events) ? events : [events];

            for (const call of calls) {
                if (!call || !isIncomingOffer(call)) continue;

                const config = getConfig();

                if (config.mode === 'off') continue;

                const callId = getCallId(call);
                const caller = getCaller(call);

                if (!callId || !caller) {
                    console.warn('[ANTICALL] Missing call ID or caller JID.');
                    continue;
                }

                if (processedCalls.has(callId)) continue;

                processedCalls.set(callId, Date.now());

                console.log(
                    `[ANTICALL] Incoming call from ${caller}; mode=${config.mode}`
                );

                // Reject the incoming call.
                try {
                    if (typeof sock.rejectCall !== 'function') {
                        console.error('[ANTICALL] rejectCall is unavailable.');
                        continue;
                    }

                    await sock.rejectCall(callId, caller);

                    console.log('[ANTICALL] Call rejected.');
                } catch (error) {
                    console.error(
                        '[ANTICALL] Call rejection failed:',
                        error.message
                    );
                    continue;
                }

                // Decline silently.
                if (config.mode === 'decline') {
                    continue;
                }

                // Decline and block.
                if (
                    config.mode === 'block' ||
                    config.mode === 'declineblock'
                ) {
                    try {
                        if (typeof sock.updateBlockStatus !== 'function') {
                            console.error(
                                '[ANTICALL] updateBlockStatus is unavailable.'
                            );
                            continue;
                        }

                        await sock.updateBlockStatus(caller, 'block');

                        console.log(`[ANTICALL] Blocked ${caller}.`);
                    } catch (error) {
                        console.error(
                            '[ANTICALL] Block failed:',
                            error.message
                        );
                    }

                    continue;
                }

                // Decline and send the saved custom message.
                if (config.mode === 'declinetext') {
                    const message = String(
                        config.message || DEFAULT_CONFIG.message
                    );

                    const candidates = [
                        call.callerPn,
                        call.from,
                        call.peerJid,
                        caller
                    ].filter(
                        jid => typeof jid === 'string' && jid.includes('@')
                    );

                    const recipients = [...new Set(candidates)];

                    let sent = false;

                    for (const recipient of recipients) {
                        try {
                            await sock.sendMessage(recipient, {
                                text: message
                            });

                            console.log(
                                `[ANTICALL] Automatic message sent to ${recipient}.`
                            );

                            sent = true;
                            break;
                        } catch (error) {
                            console.warn(
                                `[ANTICALL] Could not message ${recipient}: ${error.message}`
                            );
                        }
                    }

                    if (!sent) {
                        console.error(
                            '[ANTICALL] Failed to deliver automatic message.'
                        );
                    }
                }
            }
        } catch (error) {
            console.error('[ANTICALL] Listener error:', error.message);
        }
    });

    return true;
}

// Remove old call IDs periodically.
const cleanupTimer = setInterval(() => {
    const expiry = Date.now() - 60_000;

    for (const [id, timestamp] of processedCalls.entries()) {
        if (timestamp < expiry) {
            processedCalls.delete(id);
        }
    }
}, 30_000);

if (typeof cleanupTimer.unref === 'function') {
    cleanupTimer.unref();
}

module.exports = {
    name: 'anticall',
    aliases: ['ac'],
    description: 'Manage incoming call protection',
    category: 'owner',

    initAntiCall,

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const input = String(args?.[0] || '').toLowerCase();
        const current = getConfig();

        // Register listener as a fallback.
        initAntiCall(sock);

        // Display help or current status.
        if (!input || input === 'status') {
            const config = getConfig();

            return sock.sendMessage(
                chatId,
                {
                    text:
`┏━━❐◁ *ANTICALL SETTINGS* ◁❐━━
┃
┃ *Status:* ${config.mode === 'off' ? 'DISABLED' : 'ENABLED'}
┃ *Mode:* ${config.mode.toUpperCase()}
┃
┃ ◁ ${prefix}anticall decline
┃ ◁ ${prefix}anticall declinetext
┃ ◁ ${prefix}anticall message <text>
┃ ◁ ${prefix}anticall message view
┃ ◁ ${prefix}anticall message reset
┃ ◁ ${prefix}anticall block
┃ ◁ ${prefix}anticall declineblock
┃ ◁ ${prefix}anticall status
┃ ◁ ${prefix}anticall off
┗━━━━━━━━━━━━━━━━━━━━`
                },
                { quoted: msg }
            );
        }

        // Custom message options.
        if (input === 'message') {
            const action = String(args?.[1] || '').toLowerCase();

            // View saved message.
            if (action === 'view') {
                const config = getConfig();

                return sock.sendMessage(
                    chatId,
                    {
                        text:
`┏━━❐◁ *ANTICALL MESSAGE* ◁❐━━
┃
┃ *Mode:* ${config.mode.toUpperCase()}
┃
┃ *Saved message:*
┃ ${String(config.message).split('\n').join('\n┃ ')}
┗━━━━━━━━━━━━━━━━━━━━`
                    },
                    { quoted: msg }
                );
            }

            // Reset message to default.
            if (action === 'reset') {
                const saved = saveConfig({
                    ...current,
                    message: DEFAULT_CONFIG.message
                });

                return sock.sendMessage(
                    chatId,
                    {
                        text: saved
                            ? `✅ *ANTICALL MESSAGE RESET*\n\n${DEFAULT_CONFIG.message}`
                            : '❌ Could not reset the message.'
                    },
                    { quoted: msg }
                );
            }

            // Set custom message.
            const customMessage = args.slice(1).join(' ').trim();

            if (!customMessage) {
                return sock.sendMessage(
                    chatId,
                    {
                        text:
`❌ Please enter your custom message.

Example:
${prefix}anticall message Don't call me, please text me instead.

View message:
${prefix}anticall message view

Reset message:
${prefix}anticall message reset`
                    },
                    { quoted: msg }
                );
            }

            const saved = saveConfig({
                ...current,
                message: customMessage
            });

            return sock.sendMessage(
                chatId,
                {
                    text: saved
                        ? `✅ *CUSTOM ANTICALL MESSAGE UPDATED*\n\n${customMessage}\n\nUse ${prefix}anticall declinetext to activate it.`
                        : '❌ Could not save your custom message.'
                },
                { quoted: msg }
            );
        }

        // Supported modes.
        const allowedModes = [
            'decline',
            'block',
            'declineblock',
            'declinetext',
            'off'
        ];

        if (allowedModes.includes(input)) {
            const saved = saveConfig({
                ...current,
                mode: input
            });

            if (!saved) {
                return sock.sendMessage(
                    chatId,
                    {
                        text: '❌ Could not save AntiCall settings.'
                    },
                    { quoted: msg }
                );
            }

            const descriptions = {
                decline: 'Calls will be rejected without a message.',
                block: 'Calls will be rejected and callers blocked.',
                declineblock: 'Calls will be rejected and callers blocked.',
                declinetext: 'Calls will be rejected and your saved message will be sent.',
                off: 'Automatic call handling is disabled.'
            };

            return sock.sendMessage(
                chatId,
                {
                    text:
`┏━━❐◁ *ANTICALL UPDATED* ◁❐━━
┃
┃ *Mode:* ${input.toUpperCase()}
┃
┃ ${descriptions[input]}
┗━━━━━━━━━━━━━━━━━━━━`
                },
                { quoted: msg }
            );
        }

        return sock.sendMessage(
            chatId,
            {
                text: `❌ Unknown option.\n\nUse ${prefix}anticall to view the available commands.`
            },
            { quoted: msg }
        );
    }
};
