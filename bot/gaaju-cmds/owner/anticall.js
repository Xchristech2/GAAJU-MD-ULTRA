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
        return {
            ...DEFAULT_CONFIG,
            ...JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'))
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

function normalizeNumber(jid) {
    if (!jid) return null;
    return jid.split('@')[0].split(':')[0];
}

const processedCalls = new Map();
const initializedSockets = new WeakSet();

function initAntiCall(sock) {
    if (!sock?.ev || typeof sock.ev.on !== 'function') {
        console.error('[ANTICALL] Invalid WhatsApp socket.');
        return false;
    }

    if (initializedSockets.has(sock)) return true;

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
                    console.warn('[ANTICALL] Missing call ID or caller.');
                    continue;
                }

                if (processedCalls.has(callId)) continue;
                processedCalls.set(callId, Date.now());

                console.log(
                    `[ANTICALL] Incoming call from ${caller}; mode=${config.mode}`
                );

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

                if (config.mode === 'decline') continue;

                if (
                    config.mode === 'block' ||
                    config.mode === 'declineblock'
                ) {
                    try {
                        if (typeof sock.updateBlockStatus === 'function') {
                            await sock.updateBlockStatus(caller, 'block');
                            console.log(`[ANTICALL] Blocked ${caller}.`);
                        } else {
                            console.error('[ANTICALL] updateBlockStatus unavailable.');
                        }
                    } catch (error) {
                        console.error('[ANTICALL] Block failed:', error.message);
                    }

                    continue;
                }

                if (config.mode === 'declinetext') {
                    try {
                        const message = String(
                            config.message || DEFAULT_CONFIG.message
                        );

                        // Try the caller JID first, then the phone-number JID
                        // if the call event provides one.
                        const candidates = [
                            call.callerPn,
                            call.from,
                            call.peerJid,
                            caller
                        ].filter(Boolean);

                        const recipients = [...new Set(
                            candidates
                                .filter(jid => typeof jid === 'string' && jid.includes('@'))
                        )];

                        let sent = false;
                        let lastError;

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
                                lastError = error;
                                console.warn(
                                    `[ANTICALL] Could not message ${recipient}: ${error.message}`
                                );
                            }
                        }

                        if (!sent) {
                            console.error(
                                '[ANTICALL] Could not send automatic message.',
                                lastError?.message || 'No usable recipient JID.'
                            );
                        }
                    } catch (error) {
                        console.error(
                            '[ANTICALL] Automatic message failed:',
                            error.message
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

const cleanupTimer = setInterval(() => {
    const expiry = Date.now() - 60_000;

    for (const [id, timestamp] of processedCalls.entries()) {
        if (timestamp < expiry) processedCalls.delete(id);
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

        initAntiCall(sock);

        // DISPLAY HELP
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
┃ ◁ ${prefix}anticall decline <text>
┃ ◁ ${prefix}anticall declinetext
┃ ◁ ${prefix}anticall message <text>
┃ ◁ ${prefix}anticall block
┃ ◁ ${prefix}anticall declineblock
┃ ◁ ${prefix}anticall status
┃ ◁ ${prefix}anticall off
┗━━━━━━━━━━━━━━━━━━━━`
                },
                { quoted: msg }
            );
        }

        // CUSTOM MESSAGE THROUGH DECLINE <TEXT>
        if (input === 'decline' && args.length > 1) {
            const customMessage = args.slice(1).join(' ').trim();

            if (!customMessage) {
                return sock.sendMessage(
                    chatId,
                    { text: `Usage: ${prefix}anticall decline <your message>` },
                    { quoted: msg }
                );
            }

            const saved = saveConfig({
                ...current,
                mode: 'declinetext',
                message: customMessage
            });

            return sock.sendMessage(
                chatId,
                {
                    text: saved
                        ? `✅ *ANTICALL MESSAGE SAVED*\n\n*Mode:* DECLINETEXT\n*Message:* ${customMessage}\n\nIncoming calls will be rejected and the saved message will be sent.`
                        : '❌ Could not save your custom message.'
                },
                { quoted: msg }
            );
        }

        // CHANGE THE MESSAGE WITHOUT CHANGING THE MODE
        if (input === 'message') {
            const customMessage = args.slice(1).join(' ').trim();

            if (!customMessage) {
                return sock.sendMessage(
                    chatId,
                    {
                        text:
`*Current AntiCall message:*

${current.message}

To change it, use:
${prefix}anticall message <your message>`
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
                        ? `✅ Custom AntiCall message updated.\n\n${customMessage}`
                        : '❌ Could not save your custom message.'
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

        if (allowedModes.includes(input)) {
            const saved = saveConfig({
                ...current,
                mode: input
            });

            if (!saved) {
                return sock.sendMessage(
                    chatId,
                    { text: '❌ Could not save AntiCall settings.' },
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
┗━━━━━━━━━━━━━━━━`
                },
                { quoted: msg }
            );
        }

        return sock.sendMessage(
            chatId,
            {
                text:
`❌ Unknown option.

Use ${prefix}anticall to view the AntiCall menu.`
            },
            { quoted: msg }
        );
    }
};
