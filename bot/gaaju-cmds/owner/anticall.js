'use strict';

const fs = require('fs');
const path = require('path');
const { getFooter } = require('../../lib/menuHelper.js');

const antiCallFile = path.join(process.cwd(), 'anticall.json');

const DEFAULT_MESSAGE =
    "Sorry, I don't accept calls. Please message me instead.";

let antiCallListenerAttached = false;
let activeSocket = null;

const handledCalls = new Map();
const sentMessages = new Map();

let lastAutoClearTime = Date.now();
let cacheInterval = null;

// ==================== STORAGE ====================

function ensureAntiCallFile() {
    if (!fs.existsSync(antiCallFile)) {
        saveAntiCall({
            settings: {},
            callLogs: [],
            blockedNumbers: [],
            lastCacheClear: new Date().toISOString()
        });
    }
}

function loadAntiCall() {
    ensureAntiCallFile();

    try {
        const data = JSON.parse(
            fs.readFileSync(antiCallFile, 'utf8')
        );

        return {
            settings: data.settings || {},
            callLogs: Array.isArray(data.callLogs)
                ? data.callLogs
                : [],
            blockedNumbers: Array.isArray(data.blockedNumbers)
                ? data.blockedNumbers
                : [],
            lastCacheClear:
                data.lastCacheClear ||
                new Date().toISOString()
        };
    } catch (error) {
        console.error('[ANTICALL] Failed to load settings:', error);

        return {
            settings: {},
            callLogs: [],
            blockedNumbers: [],
            lastCacheClear: new Date().toISOString()
        };
    }
}

function saveAntiCall(data) {
    try {
        fs.writeFileSync(
            antiCallFile,
            JSON.stringify(data, null, 2)
        );

        return true;
    } catch (error) {
        console.error('[ANTICALL] Failed to save settings:', error);
        return false;
    }
}

// ==================== JID HELPERS ====================

function cleanJid(jid) {
    if (!jid || typeof jid !== 'string') {
        return '';
    }

    return jid.split(':')[0];
}

function getBotJid(sock) {
    return cleanJid(sock.user?.id);
}

function getCallerJid(call) {
    const from = call?.from || call?.peerJid;

    if (!from) {
        return '';
    }

    return cleanJid(from);
}

// ==================== CACHE CLEANUP ====================

function startCacheCleanup() {
    if (cacheInterval) {
        return;
    }

    cacheInterval = setInterval(() => {
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000;

        for (const [id, timestamp] of handledCalls.entries()) {
            if (now - timestamp > fiveMinutes) {
                handledCalls.delete(id);
            }
        }

        for (const [id, timestamp] of sentMessages.entries()) {
            if (now - timestamp > fiveMinutes) {
                sentMessages.delete(id);
            }
        }

        const twentyFourHours = 24 * 60 * 60 * 1000;

        if (now - lastAutoClearTime >= twentyFourHours) {
            handledCalls.clear();
            sentMessages.clear();

            lastAutoClearTime = now;

            const data = loadAntiCall();
            data.lastCacheClear = new Date().toISOString();
            saveAntiCall(data);

            console.log('[ANTICALL] Daily cache cleared.');
        }
    }, 60000);

    if (typeof cacheInterval.unref === 'function') {
        cacheInterval.unref();
    }
}

startCacheCleanup();

// ==================== CALL LISTENER ====================

function setupAntiCallListener(sock) {
    if (!sock?.ev || typeof sock.ev.on !== 'function') {
        console.error('[ANTICALL] Invalid socket; listener not attached.');
        return false;
    }

    // Prevent duplicate listeners on the same socket.
    if (activeSocket === sock && antiCallListenerAttached) {
        return true;
    }

    activeSocket = sock;
    antiCallListenerAttached = true;

    console.log('[ANTICALL] Attaching call listener...');

    sock.ev.on('call', async (callArray) => {
        const calls = Array.isArray(callArray)
            ? callArray
            : [callArray];

        for (const call of calls) {
            try {
                if (!call) continue;

                console.log(
                    '[ANTICALL] Call event:',
                    call.status,
                    call.from || call.peerJid || 'unknown caller'
                );

                const status = String(call.status || '').toLowerCase();

                // Only process incoming call offers.
                if (status !== 'offer') {
                    continue;
                }

                const callId = call.id;
                const fromJid = getCallerJid(call);
                const botJid = getBotJid(sock);

                if (!callId || !fromJid || !botJid) {
                    console.warn(
                        '[ANTICALL] Missing call ID, caller JID, or bot JID.'
                    );
                    continue;
                }

                if (handledCalls.has(callId)) {
                    continue;
                }

                const data = loadAntiCall();
                const settings = data.settings || {};
                const userSettings = settings[botJid];

                if (!userSettings?.enabled) {
                    continue;
                }

                handledCalls.set(callId, Date.now());

                let actionTaken = 'decline';

                try {
                    if (typeof sock.rejectCall !== 'function') {
                        throw new Error(
                            'sock.rejectCall is unavailable in this Baileys version.'
                        );
                    }

                    await sock.rejectCall(callId, fromJid);

                    console.log(
                        `[ANTICALL] Declined call from ${fromJid}`
                    );
                } catch (error) {
                    handledCalls.delete(callId);

                    console.error(
                        '[ANTICALL] Call rejection failed:',
                        error
                    );

                    continue;
                }

                // Record the call.
                const log = {
                    callId,
                    from: fromJid,
                    action: actionTaken,
                    reason: 'anti_call_enabled',
                    timestamp: new Date().toISOString(),
                    messageSent: false,
                    status,
                    mode: userSettings.mode || 'decline'
                };

                data.callLogs.push(log);

                // Keep the latest 1000 logs.
                if (data.callLogs.length > 1000) {
                    data.callLogs.splice(
                        0,
                        data.callLogs.length - 1000
                    );
                }

                saveAntiCall(data);

                // Optional auto-reply.
                if (
                    userSettings.autoMessage &&
                    userSettings.message &&
                    !sentMessages.has(callId)
                ) {
                    // Mark before scheduling to prevent duplicate replies.
                    sentMessages.set(callId, Date.now());

                    setTimeout(async () => {
                        try {
                            await sock.sendMessage(fromJid, {
                                text: userSettings.message
                            });

                            const updatedData = loadAntiCall();
                            const matchingLog = updatedData.callLogs.find(
                                entry => entry.callId === callId
                            );

                            if (matchingLog) {
                                matchingLog.messageSent = true;
                                saveAntiCall(updatedData);
                            }

                            console.log(
                                `[ANTICALL] Auto-reply sent to ${fromJid}`
                            );
                        } catch (error) {
                            sentMessages.delete(callId);

                            console.error(
                                '[ANTICALL] Auto-reply failed:',
                                error
                            );
                        }
                    }, 1000);
                }
            } catch (error) {
                console.error(
                    '[ANTICALL] Error processing call:',
                    error
                );
            }
        }
    });

    console.log('[ANTICALL] Call listener attached.');
    return true;
}

// Optional startup hook. Your main bot file must call this on connection.
globalThis._anticallInit = (sock) => {
    return setupAntiCallListener(sock);
};

// ==================== COMMAND ====================

module.exports = {
    name: 'anticall',
    aliases: ['callblock', 'blockcall'],
    description: 'Manage automatic call handling and blocking',
    category: 'owner',
    ownerOnly: true,

    async execute(sock, msg, args, PREFIX, extra) {
        const chatId = msg.key.remoteJid;
        const botJid = getBotJid(sock);
        const prefix = PREFIX || '.';

        const reply = (text) => {
            return sock.sendMessage(
                chatId,
                { text },
                { quoted: msg }
            );
        };

        if (!botJid) {
            return reply(
                '❌ Unable to identify the bot account. Please reconnect the bot.'
            );
        }

        // Ensure the listener is attached when the command runs.
        setupAntiCallListener(sock);

        const data = loadAntiCall();
        const settings = data.settings;
        const blockedNumbers = data.blockedNumbers;
        const callLogs = data.callLogs;

        const subCommand = String(args[0] || '').toLowerCase();
        const action = String(args[1] || '').toLowerCase();

        // ==================== STATUS ====================

        if (subCommand === 'status') {
            const userSettings = settings[botJid] || {
                enabled: false,
                mode: 'decline',
                autoMessage: false,
                message: DEFAULT_MESSAGE
            };

            const lastClear = Date.parse(data.lastCacheClear);
            const nextClear = (
                Number.isFinite(lastClear) ? lastClear : Date.now()
            ) + 24 * 60 * 60 * 1000;

            const remaining = Math.max(0, nextClear - Date.now());
            const hours = Math.floor(remaining / 3600000);
            const minutes = Math.floor(
                (remaining % 3600000) / 60000
            );

            let text = `╭─⌈ 📞 *ANTICALL STATUS* ⌋\n`;
            text += `│\n`;
            text += `├─⊷ *Status:* ${userSettings.enabled ? '🟢 ON' : '🔴 OFF'}\n`;
            text += `├─⊷ *Mode:* ${(userSettings.mode || 'decline').toUpperCase()}\n`;
            text += `├─⊷ *Auto-reply:* ${userSettings.autoMessage ? '✅ ON' : '❌ OFF'}\n`;

            if (userSettings.autoMessage && userSettings.message) {
                text += `├─⊷ *Message:* ${userSettings.message.substring(0, 40)}${userSettings.message.length > 40 ? '…' : ''}\n`;
            }

            text += `│\n`;
            text += `├─⊷ *Calls handled:* ${callLogs.length}\n`;
            text += `├─⊷ *Blocked list entries:* ${blockedNumbers.length}\n`;
            text += `├─⊷ *Tracked calls:* ${handledCalls.size}\n`;
            text += `├─⊷ *Next cache clear:* ${hours}h ${minutes}m\n`;

            if (callLogs.length) {
                text += `│\n├─⊷ *Recent calls:*\n`;

                callLogs.slice(-3).reverse().forEach((log, index) => {
                    const time = new Date(log.timestamp).toLocaleTimeString();

                    text += `│  ${index + 1}. ${log.from?.split('@')[0] || 'Unknown'} — ${log.action} (${time})\n`;
                });
            }

            text += `╰⊷ *Listener:* ${antiCallListenerAttached ? '✅ Active' : '❌ Inactive'}`;

            return reply(text);
        }

        // ==================== ENABLE ====================

        if (subCommand === 'enable') {
            if (action === 'block') {
                return reply(
                    `╭─⌈ 📞 *ANTICALL* ⌋\n│\n` +
                    `├─⊷ Block mode is not enabled in this version.\n` +
                    `├─⊷ Use: *${prefix}anticall enable decline*\n` +
                    `╰⊷ Incoming calls will be declined.`
                );
            }

            if (action !== 'decline') {
                return reply(
                    `╭─⌈ 📞 *ANTICALL SETUP* ⌋\n│\n` +
                    `├─⊷ *${prefix}anticall enable decline*\n` +
                    `│  └⊷ Automatically decline calls\n` +
                    `╰⊷ Choose the decline mode.`
                );
            }

            settings[botJid] = {
                enabled: true,
                mode: 'decline',
                autoMessage: settings[botJid]?.autoMessage || false,
                message: settings[botJid]?.message || DEFAULT_MESSAGE,
                lastUpdated: new Date().toISOString()
            };

            data.settings = settings;
            saveAntiCall(data);

            return reply(
                `╭─⌈ 📞 *ANTICALL* ⌋\n│\n` +
                `├─⊷ *Status:* 🟢 ON\n` +
                `├─⊷ *Mode:* DECLINE\n` +
                `╰⊷ Incoming calls will be declined while the listener is active.`
            );
        }

        // ==================== DISABLE ====================

        if (subCommand === 'disable') {
            if (settings[botJid]?.enabled) {
                settings[botJid].enabled = false;
                settings[botJid].lastUpdated = new Date().toISOString();

                data.settings = settings;
                saveAntiCall(data);

                return reply(
                    `╭─⌈ 📞 *ANTICALL* ⌋\n│\n` +
                    `├─⊷ *Status:* 🔴 OFF\n` +
                    `╰⊷ Incoming calls will no longer be automatically declined.`
                );
            }

            return reply(
                `╭─⌈ 📞 *ANTICALL* ⌋\n│\n` +
                `╰⊷ Anti-call is already disabled.`
            );
        }

        // ==================== AUTO-REPLY ====================

        if (subCommand === 'message') {
            const messageText = args.slice(1).join(' ').trim();

            if (!messageText) {
                return reply(
                    `╭─⌈ 📞 *ANTICALL* ⌋\n│\n` +
                    `├─⊷ *${prefix}anticall message [text]*\n` +
                    `│  └⊷ Set your auto-reply\n` +
                    `╰⊷ Example: ${prefix}anticall message I can't take calls`
                );
            }

            if (!settings[botJid]) {
                settings[botJid] = {
                    enabled: false,
                    mode: 'decline',
                    autoMessage: true,
                    message: messageText,
                    lastUpdated: new Date().toISOString()
                };
            } else {
                settings[botJid].autoMessage = true;
                settings[botJid].message = messageText;
                settings[botJid].lastUpdated = new Date().toISOString();
            }

            data.settings = settings;
            saveAntiCall(data);

            return reply(
                `╭─⌈ 📞 *ANTICALL* ⌋\n│\n` +
                `├─⊷ *Auto-reply:* ✅ ON\n` +
                `├─⊷ *Message:* ${messageText.substring(0, 60)}${messageText.length > 60 ? '…' : ''}\n` +
                `╰⊷ The message will be sent after a call is declined.`
            );
        }

        // ==================== DISABLE AUTO-REPLY ====================

        if (subCommand === 'nomessage') {
            if (!settings[botJid]) {
                settings[botJid] = {
                    enabled: false,
                    mode: 'decline',
                    autoMessage: false,
                    message: DEFAULT_MESSAGE,
                    lastUpdated: new Date().toISOString()
                };
            } else {
                settings[botJid].autoMessage = false;
                settings[botJid].lastUpdated = new Date().toISOString();
            }

            data.settings = settings;
            saveAntiCall(data);

            return reply(
                `╭─⌈ 📞 *ANTICALL* ⌋\n│\n` +
                `├─⊷ *Auto-reply:* ❌ OFF\n` +
                `╰⊷ No auto-reply will be sent after calls.`
            );
        }

        // ==================== CLEAR CACHE ====================

        if (subCommand === 'clearhandled') {
            handledCalls.clear();
            sentMessages.clear();

            lastAutoClearTime = Date.now();
            data.lastCacheClear = new Date().toISOString();

            saveAntiCall(data);

            return reply(
                `╭─⌈ 📞 *ANTICALL* ⌋\n│\n` +
                `├─⊷ *Cache cleared:* ✅\n` +
                `╰⊷ Next automatic cleanup in 24 hours.`
            );
        }

        // ==================== CALL LOGS ====================

        if (subCommand === 'logs') {
            const parsedLimit = parseInt(args[1], 10);
            const limit = Number.isFinite(parsedLimit)
                ? Math.min(100, Math.max(1, parsedLimit))
                : 10;

            const recent = callLogs.slice(-limit).reverse();

            if (!recent.length) {
                return reply(
                    `╭─⌈ 📞 *CALL LOGS* ⌋\n│\n` +
                    `╰⊷ No calls have been handled yet.`
                );
            }

            let text = `╭─⌈ 📞 *CALL LOGS* ⌋\n│\n`;

            recent.forEach((log, index) => {
                const time = new Date(log.timestamp).toLocaleString();

                text += `├─⊷ ${index + 1}. ${log.from?.split('@')[0] || 'Unknown'}\n`;
                text += `│  └⊷ ${(log.action || 'unknown').toUpperCase()} • ${time}\n`;
            });

            text += `╰⊷ Total: ${callLogs.length} call(s)`;

            return reply(text);
        }

        // ==================== DEBUG ====================

        if (subCommand === 'debug') {
            const userSettings = settings[botJid];

            let text = `╭─⌈ 🔍 *ANTICALL DEBUG* ⌋\n│\n`;
            text += `├─⊷ *Bot JID:* ${botJid}\n`;
            text += `├─⊷ *Listener attached:* ${antiCallListenerAttached}\n`;
            text += `├─⊷ *Tracked calls:* ${handledCalls.size}\n`;
            text += `├─⊷ *Tracked replies:* ${sentMessages.size}\n`;
            text += `├─⊷ *Enabled:* ${Boolean(userSettings?.enabled)}\n`;
            text += `├─⊷ *Mode:* ${userSettings?.mode || 'not set'}\n`;
            text += `├─⊷ *Auto-reply:* ${Boolean(userSettings?.autoMessage)}\n`;
            text += `├─⊷ *Call logs:* ${callLogs.length}\n`;
            text += `╰⊷ *Blocked list:* ${blockedNumbers.length}`;

            return reply(text);
        }

        // ==================== HELP ====================

        return reply(
            `╭─⌈ 📞 *ANTICALL* ⌋\n│\n` +
            `├─⊷ *${prefix}anticall enable decline*\n│  └⊷ Enable automatic call rejection\n` +
            `├─⊷ *${prefix}anticall disable*\n│  └⊷ Disable anti-call\n` +
            `├─⊷ *${prefix}anticall status*\n│  └⊷ View settings and statistics\n` +
            `├─⊷ *${prefix}anticall message [text]*\n│  └⊷ Set auto-reply\n` +
            `├─⊷ *${prefix}anticall nomessage*\n│  └⊷ Disable auto-reply\n` +
            `├─⊷ *${prefix}anticall logs [number]*\n│  └⊷ View recent call logs\n` +
            `├─⊷ *${prefix}anticall debug*\n│  └⊷ Inspect listener/settings\n` +
            `├─⊷ *${prefix}anticall clearhandled*\n│  └⊷ Clear tracking cache\n` +
            `╰⊷ ${getFooter(msg.key.participant || msg.key.remoteJid)}`
        );
    }
};
