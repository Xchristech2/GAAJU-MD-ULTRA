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
        console.error('[ANTICALL] Config initialization failed:', error);
    }
}

function getConfig() {
    ensureConfig();

    try {
        return {
            ...DEFAULT_CONFIG,
            ...JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'))
        };
    } catch (error) {
        console.error('[ANTICALL] Config read failed:', error);
        return { ...DEFAULT_CONFIG };
    }
}

function saveConfig(config) {
    ensureConfig();

    try {
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
        console.error('[ANTICALL] Config save failed:', error);
        return false;
    }
}

function getCaller(call) {
    return call?.from || call?.peerJid || call?.callerPn || null;
}

function getCallId(call) {
    return call?.id || call?.callId || null;
}

function getCallStatus(call) {
    return String(call?.status || '').toLowerCase();
}

function isIncomingOffer(call) {
    return getCallStatus(call) === 'offer';
}

function normalizeNumber(jid) {
    if (!jid) return null;

    return jid
        .split('@')[0]
        .split(':')[0];
}

const processedCalls = new Map();
const initializedSockets = new WeakSet();

/**
 * Registers the incoming-call listener.
 *
 * This function must be called with the active WhatsApp socket.
 */
function initAntiCall(sock) {
    if (!sock || !sock.ev || typeof sock.ev.on !== 'function') {
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
                    console.warn(
                        '[ANTICALL] Incoming call is missing its ID or caller JID.'
                    );
                    continue;
                }

                if (processedCalls.has(callId)) continue;

                processedCalls.set(callId, Date.now());

                console.log(
                    `[ANTICALL] Incoming call from ${caller}; mode=${config.mode}`
                );

                // Reject the call first.
                try {
                    if (typeof sock.rejectCall === 'function') {
                        await sock.rejectCall(callId, caller);
                    } else {
                        console.error(
                            '[ANTICALL] This socket has no rejectCall method. ' +
                            'Check the installed Baileys version.'
                        );
                        continue;
                    }
                } catch (error) {
                    console.error(
                        '[ANTICALL] Failed to reject call:',
                        error.message
                    );

                    // Do not block or message someone if rejection failed.
                    continue;
                }

                console.log('[ANTICALL] Call rejected.');

                // DECLINE ONLY
                if (config.mode === 'decline') {
                    continue;
                }

                // DECLINE + BLOCK
                if (config.mode === 'declineblock') {
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
                            '[ANTICALL] Failed to block caller:',
                            error.message
                        );
                    }

                    continue;
                }

                // BLOCK ONLY
                // WhatsApp calls are rejected first, then the caller is blocked.
                if (config.mode === 'block') {
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
                            '[ANTICALL] Failed to block caller:',
                            error.message
                        );
                    }

                    continue;
                }

                // DECLINE + TEXT
                if (config.mode === 'declinetext') {
                    try {
                        const number = normalizeNumber(caller);

                        const message = String(
                            config.message ||
                            DEFAULT_CONFIG.message
                        ).replace(/@\{caller\}/gi, `@${number}`);

                        const options = number
                            ? { mentions: [caller] }
                            : {};

                        await sock.sendMessage(
                            caller,
                            {
                                text: message,
                                ...options
                            }
                        );

                        console.log(
                            `[ANTICALL] Automatic message sent to ${caller}.`
                        );
                    } catch (error) {
                        console.error(
                            '[ANTICALL] Failed to send automatic message:',
                            error.message
                        );
                    }
                }
            }
        } catch (error) {
            console.error('[ANTICALL] Call listener error:', error);
        }
    });

    return true;
}

// Clean up processed call IDs periodically.
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

    /**
     * The command registers the listener as a fallback.
     * Startup registration is still required for protection
     * immediately after a bot restart.
     */
    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;
        const mode = String(args?.[0] || '').toLowerCase();
        const current = getConfig();

        // Register listener when this command is used.
        initAntiCall(sock);

        if (!mode || mode === 'status') {
            const currentConfig = getConfig();

            return sock.sendMessage(
                chatId,
                {
                    text:
`┏━━❐◁ *ANTICALL SETTINGS*
┃
┃ *Status:* ${currentConfig.mode === 'off' ? 'DISABLED' : 'ENABLED'}
┃ *Mode:* ${currentConfig.mode.toUpperCase()}
┃
┃➽ ${prefix}anticall decline
┃➽ ${prefix}anticall block
┃➽ ${prefix}anticall declineblock
┃➽ ${prefix}anticall declinetext
┃➽ ${prefix}anticall message <text>
┃➽ ${prefix}anticall off
┃➽ ${prefix}anticall status
┗━━❐◁`
                },
                { quoted: msg }
            );
        }

        const allowedModes = [
            'decline',
            'block',
            'declineblock',
            'declinetext',
            'off'
        ];

        if (allowedModes.includes(mode)) {
            const saved = saveConfig({
                ...current,
                mode
            });

            if (!saved) {
                return sock.sendMessage(
                    chatId,
                    {
                        text: '❌ Failed to save AntiCall settings. Check the bot console.'
                    },
                    { quoted: msg }
                );
            }

            const descriptions = {
                decline: 'Incoming calls will be rejected.',
                block: 'Incoming calls will be rejected and callers blocked.',
                declineblock: 'Incoming calls will be rejected and callers blocked.',
                declinetext: 'Incoming calls will be rejected and an automatic message sent.',
                off: 'Automatic call handling is disabled.'
            };

            return sock.sendMessage(
                chatId,
                {
                    text:
`┏━━❐◁ *ANTICALL UPDATED*
┃
┃ *Mode:* ${mode.toUpperCase()}
┃
┃ ${descriptions[mode]}
┗━━❐◁`
                },
                { quoted: msg }
            );
        }

        if (mode === 'message') {
            const text = (args || []).slice(1).join(' ').trim();

            if (!text) {
                return sock.sendMessage(
                    chatId,
                    {
                        text:
`❌ Provide an automatic message.

Example:
${prefix}anticall message Hello, I'm busy. Please text me.`
                    },
                    { quoted: msg }
                );
            }

            const saved = saveConfig({
                ...current,
                message: text
            });

            return sock.sendMessage(
                chatId,
                {
                    text: saved
                        ? '✅ AntiCall automatic message updated.'
                        : '❌ Could not save the automatic message.'
                },
                { quoted: msg }
            );
        }

        return sock.sendMessage(
            chatId,
            {
                text:
`❌ Unknown AntiCall option.

Use:
${prefix}anticall
${prefix}anticall decline
${prefix}anticall block
${prefix}anticall declineblock
${prefix}anticall declinetext
${prefix}anticall message <text>
${prefix}anticall off`
            },
            { quoted: msg }
        );
    }
};
