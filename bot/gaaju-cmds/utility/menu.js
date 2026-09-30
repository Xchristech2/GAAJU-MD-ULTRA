'use strict';

const path = require('path');
const fs = require('fs');
const { getBotName } = require('../../lib/botname');
const cfg = require('../../config');

const CMDS_DIR = path.join(__dirname, '..');

const CUSTOM_MENU_IMAGE = path.join(
    __dirname,
    '../../../assets/menu-image.jpg'
);

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

function addCommandOnce(list, command) {
    if (!list.includes(command)) {
        list.push(command);
    }
}

function addForcedCommands(cat, cmdNames) {

    if (cat === 'owner') {
        addCommandOnce(cmdNames, 'block');
        addCommandOnce(cmdNames, 'unblock');
        addCommandOnce(cmdNames, 'gaaju');
        addCommandOnce(cmdNames, 'anticall');
    }

    if (cat === 'utility') {

        addCommandOnce(cmdNames, 'botrules');
        addCommandOnce(cmdNames, 'support');
        addCommandOnce(cmdNames, 'deploy');
        addCommandOnce(cmdNames, 'menuimage');
        addCommandOnce(cmdNames, 'date');
        addCommandOnce(cmdNames, 'code');

        addCommandOnce(cmdNames, 'fakenumber');
        addCommandOnce(cmdNames, 'receivecode');
        addCommandOnce(cmdNames, 'tagcountry');
        addCommandOnce(cmdNames, 'muteuser');
        addCommandOnce(cmdNames, 'unmuteuser');
        addCommandOnce(cmdNames, 'disappearmessage');

        addCommandOnce(cmdNames, 'userid');
        addCommandOnce(cmdNames, 'listblocked');
        addCommandOnce(cmdNames, 'readreceipt');

        addCommandOnce(cmdNames, 'randomnumber');
        addCommandOnce(cmdNames, 'choose');
        addCommandOnce(cmdNames, 'repeat');
        addCommandOnce(cmdNames, 'echo');
        addCommandOnce(cmdNames, 'say');
        addCommandOnce(cmdNames, 'wordcount');
        addCommandOnce(cmdNames, 'vowelcount');
        addCommandOnce(cmdNames, 'consonantcount');

        addCommandOnce(cmdNames, 'binary');
        addCommandOnce(cmdNames, 'octal');
        addCommandOnce(cmdNames, 'decimal');
        addCommandOnce(cmdNames, 'roman');
        addCommandOnce(cmdNames, 'hex');
        addCommandOnce(cmdNames, 'shuffle');
        addCommandOnce(cmdNames, 'sort');
        addCommandOnce(cmdNames, 'capitalize');
        addCommandOnce(cmdNames, 'trim');
        addCommandOnce(cmdNames, 'removeemoji');
        addCommandOnce(cmdNames, 'removeextra');
        addCommandOnce(cmdNames, 'swapcase');
        addCommandOnce(cmdNames, 'isprime');
        addCommandOnce(cmdNames, 'fibonacci');
        addCommandOnce(cmdNames, 'factorial');

        addCommandOnce(cmdNames, 'edit');

        addCommandOnce(cmdNames, 'reverse');
        addCommandOnce(cmdNames, 'length');
        addCommandOnce(cmdNames, 'uppercase');
        addCommandOnce(cmdNames, 'lowercase');
        addCommandOnce(cmdNames, 'titlecase');
        addCommandOnce(cmdNames, 'repeatword');
        addCommandOnce(cmdNames, 'countwords');
        addCommandOnce(cmdNames, 'countlines');
        addCommandOnce(cmdNames, 'replace');
        addCommandOnce(cmdNames, 'remove');
        addCommandOnce(cmdNames, 'startswith');
        addCommandOnce(cmdNames, 'endswith');
        addCommandOnce(cmdNames, 'contains');
        addCommandOnce(cmdNames, 'randomword');
        addCommandOnce(cmdNames, 'randomletter');
        addCommandOnce(cmdNames, 'randomcolor');
        addCommandOnce(cmdNames, 'percentage');
        addCommandOnce(cmdNames, 'average');
        addCommandOnce(cmdNames, 'calculator');

        addCommandOnce(cmdNames, 'pair');
        addCommandOnce(cmdNames, 'helpers');
        addCommandOnce(cmdNames, 'panel');
        addCommandOnce(cmdNames, 'tovv');

        addCommandOnce(cmdNames, 'blur');
        addCommandOnce(cmdNames, 'unblur');
    }

    if (cat === 'group') {
        addCommandOnce(cmdNames, 'join');
        addCommandOnce(cmdNames, 'listonline');
        addCommandOnce(cmdNames, 'cancelkick');
        addCommandOnce(cmdNames, 'introcard');
        addCommandOnce(cmdNames, 'getgrouppic');
        addCommandOnce(cmdNames, 'disapproveall');
        addCommandOnce(cmdNames, 'editsettings');
        addCommandOnce(cmdNames, 'totalmembers');
        addCommandOnce(cmdNames, 'opentime');
        addCommandOnce(cmdNames, 'closetime');
    }

    if (cat === 'channel') {
        addCommandOnce(cmdNames, 'idch');
    }

    if (cat === 'download') {
        addCommandOnce(cmdNames, 'video');
    }

    if (cat === 'games') {
        addCommandOnce(cmdNames, 'blackjack');
        addCommandOnce(cmdNames, 'slot');
        addCommandOnce(cmdNames, 'racing');
    }
}

function getCategoryData() {

    const liveRegistry =
        globalThis._botCommandCategories;

    if (
        liveRegistry &&
        liveRegistry.size > 0
    ) {

        const allCats = [
            ...liveRegistry.keys()
        ];

        if (!allCats.includes('games')) {
            allCats.push('games');
        }

        const ordered = [
            ...CATEGORY_ORDER.filter(c =>
                allCats.includes(c)
            ),
            ...allCats
                .filter(c =>
                    !CATEGORY_ORDER.includes(c)
                )
                .sort()
        ];

        const catData = [];
        let totalCmds = 0;

        for (const cat of ordered) {

            const cmdNames = [
                ...new Set(
                    liveRegistry.get(cat) || []
                )
            ];

            addForcedCommands(
                cat,
                cmdNames
            );

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

    let allCats = [];

    try {

        allCats = fs
            .readdirSync(CMDS_DIR)
            .filter(item => {

                try {
                    return fs.statSync(
                        path.join(
                            CMDS_DIR,
                            item
                        )
                    ).isDirectory();
                } catch {
                    return false;
                }
            });

    } catch (error) {

        console.error(
            '[MENU] Failed to read commands directory:',
            error
        );

        return {
            catData: [],
            totalCmds: 0
        };
    }

    const ordered = [
        ...CATEGORY_ORDER.filter(c =>
            allCats.includes(c)
        ),
        ...allCats
            .filter(c =>
                !CATEGORY_ORDER.includes(c)
            )
            .sort()
    ];

    const catData = [];
    let totalCmds = 0;

    for (const cat of ordered) {

        const names = [];

        try {

            const categoryPath =
                path.join(
                    CMDS_DIR,
                    cat
                );

            const files = fs
                .readdirSync(categoryPath)
                .filter(file =>
                    file.endsWith('.js')
                );

            for (const file of files) {

                try {

                    const filePath =
                        path.join(
                            categoryPath,
                            file
                        );

                    const mod =
                        require(filePath);

                    const raw =
                        mod.default || mod;

                    const list =
                        Array.isArray(raw)
                            ? raw
                            : raw?.name
                                ? [raw]
                                : [];

                    for (const cmd of list) {

                        if (
                            cmd &&
                            cmd.name
                        ) {

                            addCommandOnce(
                                names,
                                cmd.name
                            );
                        }
                    }

                } catch (error) {

                    console.error(
                        `[MENU] Failed loading ${cat}/${file}:`,
                        error.message
                    );
                }
            }

        } catch (error) {

            console.error(
                `[MENU] Failed reading category ${cat}:`,
                error.message
            );
        }

        addForcedCommands(
            cat,
            names
        );

        if (!names.length) {
            continue;
        }

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

function getUptime() {

    const s =
        Math.floor(
            process.uptime()
        );

    const h =
        Math.floor(
            s / 3600
        );

    const m =
        Math.floor(
            (s % 3600) / 60
        );

    const sec =
        s % 60;

    return `${h}h ${m}m ${sec}s`;
}

function getUsage() {

    const memory =
        process.memoryUsage();

    const usedMB =
        memory.heapUsed /
        1024 /
        1024;

    const totalMB =
        memory.heapTotal /
        1024 /
        1024;

    const percent =
        totalMB > 0
            ? Math.min(
                100,
                Math.max(
                    0,
                    (usedMB / totalMB) * 100
                )
            )
            : 0;

    return {
        text:
            `${usedMB.toFixed(1)} MB / ` +
            `${totalMB.toFixed(1)} MB`,
        percent
    };
}

function getSpeed(msg) {

    if (
        msg &&
        msg._botReceivedAt
    ) {

        return (
            Date.now() -
            msg._botReceivedAt
        ) + 'ms';
    }

    return 'N/A';
}

function getBar(percent) {

    const total = 12;

    const filled =
        Math.round(
            (percent / 100) *
            total
        );

    return (
        '[' +
        '█'.repeat(filled) +
        '░'.repeat(
            total - filled
        ) +
        '] ' +
        Math.round(percent) +
        '%'
    );
}


/*
 * ==========================================================
 * REAL WHATSAPP READ MORE
 * ==========================================================
 *
 * WhatsApp detects the long invisible character sequence
 * and displays the expandable "Read more" option.
 *
 * Every separate message gets its own Read More.
 */

const READ_MORE_LENGTH = 4000;

function getReadMore() {
    return String.fromCharCode(8206).repeat(
        READ_MORE_LENGTH
    );
}


/*
 * ==========================================================
 * BUILD CATEGORY BLOCK
 * ==========================================================
 */

function buildCategoryBlock(
    categoryData,
    prefix
) {

    const lines = [];

    for (const {
        cat,
        cmdNames
    } of categoryData) {

        const label =
            CATEGORY_LABELS[cat] ||
            `📁 ${cat.toUpperCase()}`;

        lines.push(
            `┃ ╭━━━〔 *${label}* 〕`
        );

        for (const cmd of cmdNames) {

            lines.push(
                `┃ ➽ ${prefix}${cmd}`
            );
        }

        lines.push(
            `╰━━━━━━━━━━━`
        );

        lines.push('');
    }

    return lines.join('\n');
}


/*
 * ==========================================================
 * SPLIT 19 CATEGORIES INTO EXACTLY 11 PARTS
 * ==========================================================
 *
 * 19 categories:
 *
 * Part 1  = 2 categories
 * Part 2  = 2 categories
 * Part 3  = 2 categories
 * Part 4  = 2 categories
 * Part 5  = 2 categories
 * Part 6  = 2 categories
 * Part 7  = 2 categories
 * Part 8  = 2 categories
 * Part 9  = 1 category
 * Part 10 = 1 category
 * Part 11 = 1 category
 *
 * Total = 19
 */

function splitIntoElevenParts(catData) {

    const parts = [];

    const sizes = [
        2, 2, 2, 2, 2,
        2, 2, 2,
        1, 1, 1
    ];

    let position = 0;

    for (const size of sizes) {

        const part =
            catData.slice(
                position,
                position + size
            );

        if (part.length) {
            parts.push(part);
        }

        position += size;
    }

    return parts;
}


/*
 * ==========================================================
 * BUILD HEADER
 * ==========================================================
 */

function buildHeader(
    botName,
    p,
    owner,
    mode,
    totalCmds,
    usage,
    msg
) {

    const lines = [];

    lines.push(
        `┏━━❐➽ *${botName}* ➽❐━━`
    );

    lines.push(
        `┃ *Prefix:* [${p}]`
    );

    lines.push(
        `┃ *Owner:* ${owner}`
    );

    lines.push(
        `┃ *Mode:* *${mode}*`
    );

    lines.push(
        `┃ *Platform:* *${getPlatform()}*`
    );

    lines.push(
        `┃ *Speed:* *${getSpeed(msg)}*`
    );

    lines.push(
        `┃ *Uptime:* *${getUptime()}*`
    );

    lines.push(
        `┃ *Version:* *${BOT_VERSION}*`
    );

    lines.push(
        `┃ *Usage:* *${usage.text}*`
    );

    lines.push(
        `┃ *RAM:* ${getBar(
            usage.percent
        )}`
    );

    lines.push(
        `┃ *Commands:* *${totalCmds}*`
    );

    lines.push(
        `┗━━❐➽`
    );

    return lines.join('\n');
}


/*
 * ==========================================================
 * MODULE
 * ==========================================================
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
             * Make sure the menu has
             * exactly the 19 expected
             * category positions.
             */
            const menuParts =
                splitIntoElevenParts(
                    catData
                );

            /*
             * If there are no commands,
             * stop here.
             */
            if (!menuParts.length) {

                return await sock.sendMessage(
                    chatId,
                    {
                        text:
                            '❌ No commands available.'
                    },
                    {
                        quoted: msg
                    }
                );
            }

            /*
             * ==================================================
             * SEND 11 SEPARATE READ MORE MESSAGES
             * ==================================================
             */

            for (
                let i = 0;
                i < menuParts.length;
                i++
            ) {

                const categoryText =
                    buildCategoryBlock(
                        menuParts[i],
                        p
                    );

                /*
                 * First part gets the full bot header.
                 */
                let visibleText;

                if (i === 0) {

                    visibleText =
                        buildHeader(
                            botName,
                            p,
                            owner,
                            mode,
                            totalCmds,
                            usage,
                            msg
                        );

                } else {

                    visibleText =
                        `┏━━❐➽ *${botName}* ➽❐━━`;
                }

                /*
                 * The important part:
                 *
                 * visible text
                 * +
                 * 4000 invisible characters
                 * +
                 * hidden menu content
                 *
                 * WhatsApp displays the expandable
                 * "Read more" behavior.
                 */
                const caption =
                    visibleText +
                    '\n' +
                    getReadMore() +
                    '\n' +
                    categoryText;

                /*
                 * First message:
                 * use your custom menu image.
                 *
                 * Remaining 10 messages:
                 * text only.
                 */

                if (
                    i === 0 &&
                    fs.existsSync(
                        CUSTOM_MENU_IMAGE
                    )
                ) {

                    const img =
                        fs.readFileSync(
                            CUSTOM_MENU_IMAGE
                        );

                    await sock.sendMessage(
                        chatId,
                        {
                            image: img,
                            caption,
                            mimetype: 'image/jpeg'
                        },
                        {
                            quoted: msg
                        }
                    );

                } else {

                    await sock.sendMessage(
                        chatId,
                        {
                            text: caption
                        },
                        {
                            quoted: msg
                        }
                    );
                }

                /*
                 * Small delay between messages.
                 * This helps prevent the 11 messages
                 * from being fired at exactly the
                 * same moment.
                 */
                if (
                    i <
                    menuParts.length - 1
                ) {

                    await new Promise(
                        resolve =>
                            setTimeout(
                                resolve,
                                350
                            )
                    );
                }
            }

            /*
             * ==================================================
             * FINAL FOOTER MESSAGE
             * ==================================================
             *
             * Kept separate so the actual menu messages
             * remain focused on the 19 categories.
             */

            await sock.sendMessage(
                chatId,
                {
                    text:
                        ` ${botName}\n` +
                        '> Powered by ᴄʜʀɪs ɢᴀᴀᴊᴜ'
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
                            '❌ Menu failed to load. Please check the bot console for the error.'
                    },
                    {
                        quoted: msg
                    }
                );

            } catch {}
        }
    }
};
