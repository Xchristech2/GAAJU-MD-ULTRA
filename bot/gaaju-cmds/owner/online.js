'use strict';

const fs = require('fs');
const path = require('path');

const PRESENCE_DIR = path.join(
    process.cwd(),
    'data',
    'presence'
);

const PRESENCE_FILE = path.join(
    PRESENCE_DIR,
    'config.json'
);

const ONLINE_INTERVAL_MS = 2 * 60 * 1000;
const OFFLINE_INTERVAL_MS = 30 * 1000;

function ensureDir() {
    fs.mkdirSync(PRESENCE_DIR, { recursive: true });
}

function loadConfig() {
    ensureDir();

    try {
        if (fs.existsSync(PRESENCE_FILE)) {
            return JSON.parse(
                fs.readFileSync(PRESENCE_FILE, 'utf8')
            );
        }
    } catch (error) {
        console.error(
            '[ONLINE] Failed to load config:',
            error.message
        );
    }

    return {
        enabled: false,
        mode: 'available',
        interval: 2
    };
}

function saveConfig(config) {
    ensureDir();

    fs.writeFileSync(
        PRESENCE_FILE,
        JSON.stringify(config, null, 2)
    );
}

function stopAllPresenceIntervals() {
    if (global.PRESENCE_INTERVAL) {
        clearInterval(global.PRESENCE_INTERVAL);
        global.PRESENCE_INTERVAL = null;
    }

    if (global.PRESENCE_OFF_INTERVAL) {
        clearInterval(global.PRESENCE_OFF_INTERVAL);
        global.PRESENCE_OFF_INTERVAL = null;
    }
}

function startOnlineInterval(sock) {
    stopAllPresenceIntervals();

    global.PRESENCE_INTERVAL = setInterval(async () => {
        try {
            await sock.sendPresenceUpdate('available');
        } catch {}
    }, ONLINE_INTERVAL_MS);

    sock.sendPresenceUpdate('available').catch(() => {});
}

function startOfflineInterval(sock) {
    stopAllPresenceIntervals();

    global.PRESENCE_OFF_INTERVAL = setInterval(async () => {
        try {
            await sock.sendPresenceUpdate('unavailable');
        } catch {}
    }, OFFLINE_INTERVAL_MS);

    sock.sendPresenceUpdate('unavailable').catch(() => {});
}

/**
 * Call initPresence(sock) when the WhatsApp connection opens.
 */
function initPresence(sock) {
    const config = loadConfig();

    if (config.enabled) {
        startOnlineInterval(sock);
    } else {
        startOfflineInterval(sock);
    }
}

module.exports = {
    name: 'online',

    aliases: [
        'ghost',
        'presence',
        'fakeonline',
        'alwaysonline'
    ],

    category: 'owner',

    description: 'Toggle always-online presence',

    ownerOnly: true,

    initPresence,

    async execute(sock, msg, args, prefix, ctx = {}) {
        const chatId = msg.key.remoteJid;

        // =========================
        // OWNER / SUDO CHECK
        // =========================

        let isOwner = false;

        try {
            if (ctx.jidManager?.isOwner) {
                isOwner = ctx.jidManager.isOwner(msg);
            }
        } catch {}

        let isSudoUser = false;

        try {
            if (typeof ctx.isSudo === 'function') {
                isSudoUser = Boolean(ctx.isSudo());
            }
        } catch {}

        if (!isOwner && !isSudoUser) {
            return sock.sendMessage(
                chatId,
                {
                    text: '❌ *Owner Only Command*'
                },
                { quoted: msg }
            );
        }

        const command = (
            args[0] || 'toggle'
        ).toLowerCase();

        const config = loadConfig();

        // =========================
        // ENABLE ALWAYS ONLINE
        // =========================

        if (
            ['on', 'enable', 'start'].includes(command)
        ) {
            config.enabled = true;
            config.mode = 'available';
            config.startedAt = new Date().toISOString();

            saveConfig(config);
            startOnlineInterval(sock);

            return sock.sendMessage(
                chatId,
                {
                    text:
                        '🟢 *ALWAYS ONLINE ENABLED*\n\n' +
                        '✅ Status: ENABLED\n' +
                        '👁️ Presence updates are being sent periodically.\n' +
                        '🔒 This does not guarantee that every WhatsApp client will hide your last seen.\n\n' +
                        `⏱️ Interval: Every ${config.interval || 2} minutes\n\n` +
                        `• ${prefix}online off — Disable\n` +
                        `• ${prefix}privacy — View privacy settings`
                },
                { quoted: msg }
            );
        }

        // =========================
        // DISABLE ALWAYS ONLINE
        // =========================

        if (
            ['off', 'disable', 'stop'].includes(command)
        ) {
            config.enabled = false;

            saveConfig(config);
            startOfflineInterval(sock);

            return sock.sendMessage(
                chatId,
                {
                    text:
                        '🔴 *ALWAYS ONLINE DISABLED*\n\n' +
                        '❌ Always-online mode is disabled.\n' +
                        '📱 The bot is sending unavailable presence updates periodically.\n\n' +
                        `• ${prefix}online on — Enable\n` +
                        `• ${prefix}privacy — View privacy settings`
                },
                { quoted: msg }
            );
        }

        // =========================
        // TOGGLE STATUS
        // =========================

        config.enabled = !config.enabled;
        saveConfig(config);

        if (config.enabled) {
            config.mode = 'available';
            config.startedAt = new Date().toISOString();
            saveConfig(config);

            startOnlineInterval(sock);
        } else {
            startOfflineInterval(sock);
        }

        return sock.sendMessage(
            chatId,
            {
                text: config.enabled
                    ? (
                        '🟢 *ALWAYS ONLINE ENABLED*\n\n' +
                        '👁️ Periodic online presence updates are active.\n' +
                        '🔒 Last-seen visibility depends on WhatsApp privacy settings.\n\n' +
                        `• ${prefix}online off — Disable\n` +
                        `• ${prefix}privacy — View privacy settings`
                    )
                    : (
                        '🔴 *ALWAYS ONLINE DISABLED*\n\n' +
                        '📱 Unavailable presence updates are active.\n\n' +
                        `• ${prefix}online on — Enable\n` +
                        `• ${prefix}privacy — View privacy settings`
                    )
            },
            { quoted: msg }
        );
    }
};
