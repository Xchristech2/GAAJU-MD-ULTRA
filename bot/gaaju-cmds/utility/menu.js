'use strict';

const path = require('path');
const fs = require('fs');
const os = require('os');

const { getBotName } = require('../../lib/botname');
const cfg = require('../../config');

const CMDS_DIR = path.join(__dirname, '..');

const DEFAULT_LOGO_PATH = path.join(
    __dirname,
    '../../../assets/xd-logo.jpg'
);

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
    utility: '🔧 UTILITY'
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

/*
|--------------------------------------------------------------------------
| GET COMMANDS FROM FILES
|--------------------------------------------------------------------------
*/

function getCommandsFromCategory(category) {
    const categoryPath = path.join(
        CMDS_DIR,
        category
    );

    const names = [];

    if (!fs.existsSync(categoryPath)) {
        return names;
    }

    let files = [];

    try {
        files = fs
            .readdirSync(categoryPath)
            .filter(file => file.endsWith('.js'));
    } catch {
        return names;
    }

    for (const file of files) {
        try {
            const filePath = path.join(
                categoryPath,
                file
            );

            const mod = require(filePath);

            const raw = mod.default || mod;

            const list = Array.isArray(raw)
                ? raw
                : raw?.name
                    ? [raw]
                    : [];

            for (const cmd of list) {
                if (cmd?.name) {
                    names.push(
                        String(cmd.name).toLowerCase()
                    );
                }
            }
        } catch {}
    }

    return names;
}

/*
|--------------------------------------------------------------------------
| FORCE SUPPORT COMMAND
|--------------------------------------------------------------------------
|
| This makes sure support appears in Utility even when the
| command registry doesn't register it correctly.
|
*/

function addSupportCommand(names) {
    const supportPath = path.join(
        CMDS_DIR,
        'utility',
        'support.js'
    );

    if (
        fs.existsSync(supportPath) &&
        !names.some(
            x => String(x).toLowerCase() === 'support'
        )
    ) {
        names.push('support');
    }

    return names;
}

/*
|--------------------------------------------------------------------------
| CATEGORY DATA
|--------------------------------------------------------------------------
*/

function getCategoryData() {
    const liveRegistry =
        globalThis._botCommandCategories;

    const categoryMap = new Map();

    /*
     * First use the live command registry.
     */
    if (
        liveRegistry &&
        typeof liveRegistry.entries === 'function'
    ) {
        for (const [cat, commands] of liveRegistry.entries()) {
            categoryMap.set(
                cat,
                [
                    ...new Set(
                        (commands || []).map(x =>
                            String(x).toLowerCase()
                        )
                    )
                ]
            );
        }
    }

    /*
     * Add categories discovered directly from folders.
     * This also makes the menu work when the registry is incomplete.
     */
    let folders = [];

    try {
        folders = fs
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
    } catch {}

    for (const category of folders) {
        const existing =
            categoryMap.get(category) || [];

        const discovered =
            getCommandsFromCategory(category);

        categoryMap.set(
            category,
            [
                ...new Set([
                    ...existing,
                    ...discovered
                ])
            ]
        );
    }

    /*
     * FORCE UTILITY CATEGORY
     */
    let utilityCommands =
        categoryMap.get('utility') || [];

    utilityCommands =
        addSupportCommand(utilityCommands);

    categoryMap.set(
        'utility',
        [
            ...new Set(utilityCommands)
        ]
    );

    /*
     * Order categories.
     */
    const allCats = [
        ...categoryMap.keys()
    ];

    const ordered = [
        ...CATEGORY_ORDER.filter(
            cat => allCats.includes(cat)
        ),
        ...allCats
            .filter(
                cat => !CATEGORY_ORDER.includes(cat)
            )
            .sort()
    ];

    const catData = [];

    let totalCmds = 0;

    for (const cat of ordered) {
        const cmdNames = [
            ...new Set(
                categoryMap.get(cat) || []
            )
        ];

        if (!cmdNames.length) {
            continue;
        }

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

/*
|--------------------------------------------------------------------------
| PLATFORM
|--------------------------------------------------------------------------
*/

function getPlatform() {
    if (process.env.DYNO) {
        return 'Heroku';
    }

    if (process.env.RAILWAY_ENVIRONMENT) {
        return 'Railway';
    }

    if (process.env.RENDER) {
        return 'Render';
    }

    return 'VPS';
}

/*
|--------------------------------------------------------------------------
| UPTIME
|--------------------------------------------------------------------------
*/

function getUptime() {
    const seconds =
        Math.floor(process.uptime());

    const hours =
        Math.floor(seconds / 3600);

    const minutes =
        Math.floor(
            (seconds % 3600) / 60
        );

    const secs =
        seconds % 60;

    return `${hours}h ${minutes}m ${secs}s`;
}

/*
|--------------------------------------------------------------------------
| MEMORY
|--------------------------------------------------------------------------
*/

function getUsage() {
    const usedMB =
        process.memoryUsage().rss /
        1024 /
        1024;

    const totalGB =
        os.totalmem() /
        1024 /
        1024 /
        1024;

    const percent =
        Math.min(
            100,
            (usedMB /
                (totalGB * 1024)) *
                100
        );

    return {
        text:
            `${usedMB.toFixed(1)} MB of ${totalGB.toFixed(2)} GB`,

        percent
    };
}

/*
|--------------------------------------------------------------------------
| SPEED
|--------------------------------------------------------------------------
*/

function getSpeed(msg) {
    if (msg && msg._botReceivedAt) {
        return `${Date.now() - msg._botReceivedAt}ms`;
    }

    return 'N/A';
}

/*
|--------------------------------------------------------------------------
| RAM BAR
|--------------------------------------------------------------------------
*/

function getBar(percent) {
    const total = 10;

    const filled =
        Math.round(
            (percent / 100) * total
        );

    return `[${'█'.repeat(filled)}${'░'.repeat(
        total - filled
    )}] ${Math.round(percent)}%`;
}

/*
|--------------------------------------------------------------------------
| BUILD CATEGORY
|--------------------------------------------------------------------------
*/

function buildCategory(
    lines,
    category,
    commands,
    prefix
) {
    const label =
        CATEGORY_LABELS[category] ||
        `📁 ${String(category).toUpperCase()}`;

    lines.push(
        `\n┏━━❐ ${label} ❐`
    );

    for (const command of commands) {
        lines.push(
            `┃✦ ${prefix}${command}`
        );
    }

    lines.push(
        `┗━━❐`
    );
}

/*
|--------------------------------------------------------------------------
| MENU COMMAND
|--------------------------------------------------------------------------
*/

module.exports = {
    name: 'menu',

    aliases: [
        'help',
        'cmds',
        'commands',
        'list'
    ],

    description:
        'Show all available bot commands',

    category: 'utility',

    async execute(
        sock,
        msg,
        args,
        prefix,
        ctx
    ) {
        try {
            const chatId =
                msg.key.remoteJid;

            const botName =
                getBotName();

            const p =
                prefix ||
                cfg.PREFIX ||
                '.';

            const owner =
                cfg.OWNER_NUMBER
                    ? `+${cfg.OWNER_NUMBER}`
                    : (
                        cfg.OWNER_NAME ||
                        'GAAJU'
                    );

            const mode =
                (
                    cfg.MODE ||
                    'public'
                ).toUpperCase();

            const {
                catData,
                totalCmds
            } = getCategoryData();

            const usage =
                getUsage();

            /*
             * READ MORE
             */
            const readMore =
                String.fromCharCode(8206)
                    .repeat(4000);

            const lines = [];

            /*
             * HEADER
             */
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
                `┃✦ RAM: ${getBar(
                    usage.percent
                )}`
            );

            lines.push(
                `┃✦ Commands: ${totalCmds}`
            );

            lines.push(
                `┗━━❐`
            );

            lines.push(
                readMore
            );

            /*
             * CATEGORIES
             */
            for (const {
                cat,
                cmdNames
            } of catData) {
                buildCategory(
                    lines,
                    cat,
                    cmdNames,
                    p
                );
            }

            /*
             * FOOTER
             */
            lines.push(
                `\n┏━━❐ ✦ INFORMATION ✦ ❐`
            );

            lines.push(
                `┃✦ ${p}menu`
            );

            lines.push(
                `┃✦ ${p}support`
            );

            lines.push(
                `┃✦ ${p}owner`
            );

            lines.push(
                `┗━━❐`
            );

            /*
             * FINAL MENU TEXT
             */
            const menuText =
                lines.join('\n');

            /*
             * SELECT IMAGE
             */
            let imagePath =
                DEFAULT_LOGO_PATH;

            if (
                fs.existsSync(
                    CUSTOM_MENU_IMAGE
                )
            ) {
                imagePath =
                    CUSTOM_MENU_IMAGE;
            }

            /*
             * SEND MENU
             */
            if (
                imagePath &&
                fs.existsSync(imagePath)
            ) {
                try {
                    await sock.sendMessage(
                        chatId,
                        {
                            image: {
                                url: imagePath
                            },

                            caption: menuText,

                            contextInfo: {
                                externalAdReply: {
                                    title:
                                        `${botName} ${BOT_VERSION}`,

                                    body:
                                        'Multi Device WhatsApp Bot',

                                    thumbnailUrl:
                                        CHANNEL_URL,

                                    sourceUrl:
                                        CHANNEL_URL,

                                    mediaType: 1,

                                    renderLargerThumbnail:
                                        true
                                }
                            }
                        },
                        {
                            quoted: msg
                        }
                    );

                    return;
                } catch (imageError) {
                    console.log(
                        '[MENU IMAGE ERROR]',
                        imageError?.message ||
                            imageError
                    );
                }
            }

            /*
             * FALLBACK TEXT MENU
             */
            await sock.sendMessage(
                chatId,
                {
                    text: menuText,

                    contextInfo: {
                        externalAdReply: {
                            title:
                                `${botName} ${BOT_VERSION}`,

                            body:
                                'Multi Device WhatsApp Bot',

                            sourceUrl:
                                CHANNEL_URL,

                            mediaType: 1
                        }
                    }
                },
                {
                    quoted: msg
                }
            );
        } catch (error) {
            console.error(
                '[MENU ERROR]',
                error
            );

            try {
                await sock.sendMessage(
                    msg.key.remoteJid,
                    {
                        text:
                            `❌ Menu error:\n${error.message}`
                    },
                    {
                        quoted: msg
                    }
                );
            } catch {}
        }
    }
};
