'use strict';

const path = require('path');
const fs = require('fs');
const os = require('os');
const { getBotName } = require('../../lib/botname');
const cfg = require('../../config');

const CMDS_DIR = path.join(__dirname, '..');

// Default menu image
const DEFAULT_LOGO_PATH = path.join(__dirname, '../../../assets/xd-logo.jpg');

// Custom image set with .setmenuimage
const CUSTOM_MENU_IMAGE = path.join(
    __dirname,
    '../../../assets/menu-image.jpg'
);

const CHANNEL_URL =
    'https://whatsapp.com/channel/0029VbBvGgyFsn0alyIDjw0z';

let BOT_VERSION = 'v1.2.0';

try {
    const pkg = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, '../../package.json'),
            'utf8'
        )
    );

    if (pkg.version) {
        BOT_VERSION = `v${pkg.version}`;
    }
} catch {}

const CATEGORY_LABELS = {
    ai: '🤖 AI',
    adult: '🔞 ADULT',
    automation: '⚙️ AUTOMATION',
    channel: '📢 CHANNEL',
    download: '📥 DOWNLOAD',
    education: '📚 EDUCATION',
    fun: '😂 FUN',
    games: '🎮 GAMES',
    group: '👥 GROUP',
    image: '🖼️ IMAGE',
    movie: '🎬 MOVIE',
    news: '📰 NEWS',
    owner: '👑 OWNER',
    search: '🔎 SEARCH',
    spiritual: '🕊️ SPIRITUAL',
    sports: '⚽ SPORTS',
    stalker: '🔍 STALKER',
    utility: '🔧 UTILITY',
};

const CATEGORY_ORDER = [
    'utility',
    'owner',
    'ai',
    'group',
    'automation',
    'channel',
    'download',
    'education',
    'spiritual',
    'fun',
    'sports',
    'news',
    'stalker',
    'image',
    'movie',
    'search',
    'adult',
    'games'
];

function getCategoryData() {
    const liveRegistry = globalThis._botCommandCategories;

    if (liveRegistry && liveRegistry.size > 0) {
        const allCats = [...liveRegistry.keys()];

        const ordered = [
            ...CATEGORY_ORDER.filter(c => allCats.includes(c)),
            ...allCats
                .filter(c => !CATEGORY_ORDER.includes(c))
                .sort()
        ];

        const catData = [];
        let totalCmds = 0;

        for (const cat of ordered) {
            const cmdNames = [
                ...new Set(liveRegistry.get(cat) || [])
            ];

            if (!cmdNames.length) continue;

            totalCmds += cmdNames.length;

            catData.push({
                cat,
                cmdNames
            });
        }

        return {
            catData,
            totalCmds
        };
    }

    const allCats = fs
        .readdirSync(CMDS_DIR)
        .filter(item => {
            try {
                return fs.statSync(
                    path.join(CMDS_DIR, item)
                ).isDirectory();
            } catch {
                return false;
            }
        });

    const ordered = [
        ...CATEGORY_ORDER.filter(c => allCats.includes(c)),
        ...allCats
            .filter(c => !CATEGORY_ORDER.includes(c))
            .sort()
    ];

    let totalCmds = 0;
    const catData = [];

    for (const cat of ordered) {
        const names = [];

        try {
            const files = fs
                .readdirSync(path.join(CMDS_DIR, cat))
                .filter(f => f.endsWith('.js'));

            for (const file of files) {
                try {
                    const mod = require(
                        path.join(CMDS_DIR, cat, file)
                    );

                    const raw = mod.default || mod;

                    const list = Array.isArray(raw)
                        ? raw
                        : raw?.name
                            ? [raw]
                            : [];

                    for (const cmd of list) {
                        if (cmd?.name) {
                            names.push(cmd.name);
                        }
                    }
                } catch {}
            }
        } catch {}

        if (!names.length) continue;

        totalCmds += names.length;

        catData.push({
            cat,
            cmdNames: names
        });
    }

    return {
        catData,
        totalCmds
    };
}

function getPlatform() {
    if (process.env.DYNO) return 'Heroku';
    if (process.env.RAILWAY_ENVIRONMENT) return 'Railway';
    if (process.env.RENDER) return 'Render';

    return 'VPS';
}

function getUptime() {
    const s = Math.floor(process.uptime());

    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;

    return `${h}h ${m}m ${sec}s`;
}

function getUsage() {
    const usedMB =
        process.memoryUsage().rss / 1024 / 1024;

    const totalGB =
        os.totalmem() / 1024 / 1024 / 1024;

    return {
        text: `${usedMB.toFixed(1)} MB of ${totalGB.toFixed(2)} GB`,

        percent: Math.min(
            100,
            (usedMB / (totalGB * 1024)) * 100
        )
    };
}

function getSpeed(msg) {
    if (msg._botReceivedAt) {
        return `${Date.now() - msg._botReceivedAt}ms`;
    }

    return 'N/A';
}

function getBar(percent) {
    const total = 10;

    const filled = Math.round(
        (percent / 100) * total
    );

    return `[${'█'.repeat(filled)}${'░'.repeat(
        total - filled
    )}] ${Math.round(percent)}%`;
}

module.exports = {
    name: 'menu',

    aliases: [
        'help',
        'cmds',
        'commands',
        'list'
    ],

    description: 'Show all available bot commands',

    category: 'utility',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;

        const botName = getBotName();

        const p =
            prefix ||
            cfg.PREFIX ||
            '.';

        const owner = cfg.OWNER_NUMBER
            ? `+${cfg.OWNER_NUMBER}`
            : (cfg.OWNER_NAME || 'GAAJU');

        const mode =
            (cfg.MODE || 'public').toUpperCase();

        const {
            catData,
            totalCmds
        } = getCategoryData();

        const usage = getUsage();

        // READ MORE SYSTEM
        const readMore =
            String.fromCharCode(8206).repeat(4000);

        const lines = [];

        // ================= HEADER =================

        lines.push(
            `┏━━❐✧ ${botName} ✧❐`
        );

        lines.push(
            `┃✦ Prefix: [${p}]`
        );

        lines.push(
            `┃✦ Owner: ${owner}`
        );

        lines.push(
            `┃✦ Mode: ${mode}`
        );

        lines.push(
            `┃✦ Platform: ${getPlatform()}`
        );

        lines.push(
            `┃✦ Speed: ${getSpeed(msg)}`
        );

        lines.push(
            `┃✦ Uptime: ${getUptime()}`
        );

        lines.push(
            `┃✦ Version: ${BOT_VERSION}`
        );

        lines.push(
            `┃✦ Usage: ${usage.text}`
        );

        lines.push(
            `┃✦ RAM: ${getBar(usage.percent)}`
        );

        lines.push(
            `┃✦ Commands: ${totalCmds}`
        );

        lines.push(
            `┗━━❐`
        );

        // READ MORE
        lines.push(readMore);

        const mid1 =
            Math.floor(catData.length / 3);

        const mid2 =
            Math.floor(catData.length * 2 / 3);

        // ================= PART 1 =================

        for (let i = 0; i < mid1; i++) {
            const {
                cat,
                cmdNames
            } = catData[i];

            const label =
                CATEGORY_LABELS[cat] ||
                `📁 ${cat.toUpperCase()}`;

            lines.push(
                `\n┏━━❐ ${label} ❐`
            );

            for (const cmd of cmdNames) {
                lines.push(
                    `┃✦ ${p}${cmd}`
                );
            }

            lines.push(
                `┗━━❐`
            );
        }

        // READ MORE 1
        lines.push(readMore);

        // ================= PART 2 =================

        for (let i = mid1; i < mid2; i++) {
            const {
                cat,
                cmdNames
            } = catData[i];

            const label =
                CATEGORY_LABELS[cat] ||
                `📁 ${cat.toUpperCase()}`;

            lines.push(
                `\n┏━━❐ ${label} ❐`
            );

            for (const cmd of cmdNames) {
                lines.push(
                    `┃✦ ${p}${cmd}`
                );
            }

            lines.push(
                `┗━━❐`
            );
        }

        // READ MORE 2
        lines.push(readMore);

        // ================= PART 3 =================

        for (let i = mid2; i < catData.length; i++) {
            const {
                cat,
                cmdNames
            } = catData[i];

            const label =
                CATEGORY_LABELS[cat] ||
                `📁 ${cat.toUpperCase()}`;

            lines.push(
                `\n┏━━❐ ${label} ❐`
            );

            for (const cmd of cmdNames) {
                lines.push(
                    `┃✦ ${p}${cmd}`
                );
            }

            lines.push(
                `┗━━❐`
            );
        }

        // FINAL READ MORE
        lines.push(readMore);

        // ================= FOOTER =================

        lines.push('');
        lines.push('');

        lines.push(
            ` ${botName}`
        );

        lines.push(
            '> Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ'
        );

        const caption =
            lines.join('\n');

        const msgOptions = {
            quoted: msg
        };

        // ================= CHANNEL =================

        msgOptions.contextInfo = {
            externalAdReply: {
                title: botName,

                body: '📢 View Channel',

                sourceUrl: CHANNEL_URL,

                mediaType: 1,

                renderLargerThumbnail: false,

                showAdAttribution: true,
            }
        };

        try {

            // =================================================
            // USE CUSTOM MENU IMAGE IF IT EXISTS
            // OTHERWISE USE ORIGINAL LOGO
            // =================================================

            const imagePath =
                fs.existsSync(CUSTOM_MENU_IMAGE)
                    ? CUSTOM_MENU_IMAGE
                    : DEFAULT_LOGO_PATH;

            const img =
                fs.readFileSync(imagePath);

            await sock.sendMessage(
                chatId,
                {
                    image: img,

                    caption,

                    mimetype: 'image/jpeg',
                },
                msgOptions
            );

        } catch (error) {

            console.error(
                '[MENU IMAGE ERROR]',
                error
            );

            // FALLBACK TO TEXT MENU
            await sock.sendMessage(
                chatId,
                {
                    text: caption
                },
                msgOptions
            );
        }
    },
};
