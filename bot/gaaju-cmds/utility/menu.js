'use strict';

const path = require('path');
const fs = require('fs');
const { getBotName } = require('../../lib/botname');
const cfg = require('../../config');

let giftedBtns;

try {
    giftedBtns = require('wolfbtns');
} catch (error) {
    console.error('[MENU] wolfbtns is unavailable:', error.message);
}

const CMDS_DIR = path.join(__dirname, '..');

const CUSTOM_MENU_IMAGE = path.join(
    __dirname,
    '../../../assets/menu-image.jpg'
);

const REPO_URL =
    'https://github.com/Xchristech2/GAAJU-MD-ULTRA';

const ZIP_URL =
    'https://github.com/Xchristech2/GAAJU-MD-ULTRA/archive/refs/heads/main.zip';

const OWNER_NUMBER = '2348069675806';

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
    ai: 'AI',
    adult: 'ADULT',
    automation: 'AUTOMATION',
    channel: 'CHANNEL',
    download: 'DOWNLOAD',
    education: 'EDUCATION',
    fun: 'FUN',
    games: 'GAMES',
    group: 'GROUP',
    image: 'IMAGE',
    movie: 'MOVIE',
    news: 'NEWS',
    owner: 'OWNER',
    search: 'SEARCH',
    spiritual: 'SPIRITUAL',
    sports: 'SPORTS',
    stalker: 'STALKER',
    utility: 'UTILITY'
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

const LOADING_DURATION = 2500;
const LOADING_STEPS = 10;

const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));

function addCommandOnce(list, command) {
    if (!list.includes(command)) {
        list.push(command);
    }
}

function addForcedCommands(cat, cmdNames) {
    if (cat === 'owner') {
        [
            'block',
            'unblock',
            'gaaju',
            'anticall',
            'setprofile',
            'addjid',
            'lastseen',
            'anticallmessage',
            'health',
            'groupadd',
            'reshare'
        ].forEach(command =>
            addCommandOnce(cmdNames, command)
        );
    }

    if (cat === 'utility') {
        [
            'botrules', 'support', 'deploy', 'menuimage',
            'date', 'code', 'fakenumber', 'receivecode',
            'tagcountry', 'muteuser', 'unmuteuser',
            'disappearmessage', 'userid', 'listblocked',
            'readreceipt', 'randomnumber', 'choose',
            'repeat', 'echo', 'say', 'wordcount',
            'vowelcount', 'consonantcount', 'binary',
            'octal', 'decimal', 'roman', 'hex',
            'shuffle', 'sort', 'capitalize', 'trim',
            'removeemoji', 'removeextra', 'swapcase',
            'isprime', 'fibonacci', 'factorial', 'edit',
            'reverse', 'length', 'uppercase', 'lowercase',
            'titlecase', 'repeatword', 'countwords',
            'countlines', 'replace', 'remove', 'startswith',
            'endswith', 'contains', 'randomword',
            'randomletter', 'randomcolor', 'percentage',
            'average', 'calculator', 'pair', 'helpers',
            'panel', 'tovv', 'blur', 'unblur',
            'hosting', 'checkbotname'
        ].forEach(command =>
            addCommandOnce(cmdNames, command)
        );
    }

    if (cat === 'group') {
        [
            'join', 'listonline', 'cancelkick', 'introcard',
            'getgrouppic', 'disapproveall', 'editsettings',
            'totalmembers', 'opentime', 'closetime'
        ].forEach(command =>
            addCommandOnce(cmdNames, command)
        );
    }

    if (cat === 'channel') {
        addCommandOnce(cmdNames, 'idch');
    }

    if (cat === 'download') {
        addCommandOnce(cmdNames, 'video');
    }

    if (cat === 'games') {
        ['blackjack', 'slot', 'racing'].forEach(command =>
            addCommandOnce(cmdNames, command)
        );
    }

    if (cat === 'fun') {
        [
            'hack',
            'insult',
            'quote',
            'fakeblank'
        ].forEach(command =>
            addCommandOnce(cmdNames, command)
        );
    }
}

function getCategoryData() {
    const liveRegistry = globalThis._botCommandCategories;

    if (liveRegistry && liveRegistry.size > 0) {
        const allCats = [...liveRegistry.keys()];

        for (const cat of ['games', 'owner', 'fun']) {
            if (!allCats.includes(cat)) {
                allCats.push(cat);
            }
        }

        const ordered = [
            ...CATEGORY_ORDER.filter(c => allCats.includes(c)),
            ...allCats.filter(c => !CATEGORY_ORDER.includes(c)).sort()
        ];

        const catData = [];
        let totalCmds = 0;

        for (const cat of ordered) {
            const cmdNames = [
                ...new Set(liveRegistry.get(cat) || [])
            ];

            addForcedCommands(cat, cmdNames);

            if (!cmdNames.length) continue;

            totalCmds += cmdNames.length;
            catData.push({ cat, cmdNames });
        }

        return { catData, totalCmds };
    }

    let allCats = [];

    try {
        allCats = fs.readdirSync(CMDS_DIR).filter(item => {
            try {
                return fs.statSync(
                    path.join(CMDS_DIR, item)
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

        return { catData: [], totalCmds: 0 };
    }

    for (const cat of ['owner', 'fun']) {
        if (!allCats.includes(cat)) {
            allCats.push(cat);
        }
    }

    const ordered = [
        ...CATEGORY_ORDER.filter(c => allCats.includes(c)),
        ...allCats.filter(c => !CATEGORY_ORDER.includes(c)).sort()
    ];

    const catData = [];
    let totalCmds = 0;

    for (const cat of ordered) {
        const names = [];

        try {
            const categoryPath = path.join(CMDS_DIR, cat);

            const files = fs.readdirSync(categoryPath)
                .filter(file => file.endsWith('.js'));

            for (const file of files) {
                try {
                    const filePath = path.join(categoryPath, file);
                    const mod = require(filePath);
                    const raw = mod.default || mod;

                    const list = Array.isArray(raw)
                        ? raw
                        : raw?.name
                            ? [raw]
                            : [];

                    for (const cmd of list) {
                        if (cmd && cmd.name) {
                            addCommandOnce(names, cmd.name);
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

        addForcedCommands(cat, names);

        if (!names.length) continue;

        totalCmds += names.length;
        catData.push({ cat, cmdNames: names });
    }

    return { catData, totalCmds };
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
    const memory = process.memoryUsage();

    const usedMB = memory.heapUsed / 1024 / 1024;
    const totalMB = memory.heapTotal / 1024 / 1024;

    const percent = totalMB > 0
        ? Math.min(100, Math.max(0, (usedMB / totalMB) * 100))
        : 0;

    return {
        text: `${usedMB.toFixed(1)} MB / ${totalMB.toFixed(1)} MB`,
        percent
    };
}

function getSpeed(msg) {
    if (msg && msg._botReceivedAt) {
        return `${Date.now() - msg._botReceivedAt}ms`;
    }

    return 'N/A';
}

function getBar(percent) {
    const total = 12;

    const filled = Math.round(
        (percent / 100) * total
    );

    return (
        '[' +
        '█'.repeat(filled) +
        '░'.repeat(total - filled) +
        '] ' +
        Math.round(percent) +
        '%'
    );
}

function getLoadingBar(percent) {
    const total = 10;
    const filled = Math.round((percent / 100) * total);

    return (
        '▰'.repeat(filled) +
        '▱'.repeat(total - filled) +
        ` ${percent}%`
    );
}

function getReadMore() {
    return String.fromCharCode(8206).repeat(4000);
}

function buildMenu(botName, prefix, owner, mode, msg) {
    const { catData, totalCmds } = getCategoryData();
    const usage = getUsage();
    const lines = [];

    lines.push(`┏━━❐◁ *${botName}*`);
    lines.push(`┃ *ᴘʀᴇꜰɪx:* [${prefix}]`);
    lines.push(`┃ *ᴏᴡɴᴇʀ:* ${owner}`);
    lines.push(`┃ *ᴍᴏᴅᴇ:* ${mode}`);
    lines.push(`┃ *ᴘʟᴀᴛꜰᴏʀᴍ:* ${getPlatform()}`);
    lines.push(`┃ *ꜱᴘᴇᴇᴅ:* ${getSpeed(msg)}`);
    lines.push(`┃ *ᴜᴘᴛɪᴍᴇ:* ${getUptime()}`);
    lines.push(`┃ *ᴠᴇʀꜱɪᴏɴ:* ${BOT_VERSION}`);
    lines.push(`┃ *ᴜꜱᴀɢᴇ:* ${usage.text}`);
    lines.push(`┃ *ʀᴀᴍ:* ${getBar(usage.percent)}`);
    lines.push(`┃ *ᴄᴏᴍᴍᴀɴᴅꜱ:* ${totalCmds}`);
    lines.push('┗━━❐◁');

    lines.push(getReadMore());

    const totalCategories = catData.length;
    const totalReadMores = 9;

    const sectionSize = Math.max(
        1,
        Math.ceil(totalCategories / totalReadMores)
    );

    let categoryIndex = 0;
    let readMoreCount = 1;

    for (const { cat, cmdNames } of catData) {
        const label = CATEGORY_LABELS[cat] || cat.toUpperCase();

        lines.push(`┏━━❐◁ *${label}*`);

        for (const cmd of cmdNames) {
            lines.push(`┃➽ ${prefix}${cmd}`);
        }

        lines.push('┗━━❐◁');

        categoryIndex++;

        if (
            categoryIndex < totalCategories &&
            readMoreCount < totalReadMores &&
            categoryIndex % sectionSize === 0
        ) {
            lines.push(getReadMore());
            readMoreCount++;
        }
    }

    lines.push(` ${botName}`);
    lines.push('> Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ');

    return lines.join('\n');
}

function getMenuButtons() {
    return [
        {
            name: 'cta_url',
            buttonParamsJson: JSON.stringify({
                display_text: '📂 OPEN REPOSITORY',
                url: REPO_URL
            })
        },
        {
            name: 'cta_url',
            buttonParamsJson: JSON.stringify({
                display_text: '📦 DOWNLOAD ZIP',
                url: ZIP_URL
            })
        },
        {
            name: 'cta_url',
            buttonParamsJson: JSON.stringify({
                display_text: '👑 MESSAGE OWNER',
                url: `https://wa.me/${OWNER_NUMBER}`
            })
        },
        {
            name: 'cta_url',
            buttonParamsJson: JSON.stringify({
                display_text: '📢 VISIT CHANNEL',
                url: CHANNEL_URL
            })
        }
    ];
}

async function sendNormalMenu(sock, chatId, msg, caption) {
    const buttons = getMenuButtons();

    /*
     * Use wolfbtns for interactive buttons.
     */
    if (giftedBtns?.sendInteractiveMessage) {
        try {
            const payload = {
                text: caption,
                footer: 'Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ',
                interactiveButtons: buttons
            };

            /*
             * If an image exists, attach it to the
             * interactive message when supported.
             */
            if (fs.existsSync(CUSTOM_MENU_IMAGE)) {
                payload.image = fs.readFileSync(CUSTOM_MENU_IMAGE);
            }

            await giftedBtns.sendInteractiveMessage(
                sock,
                chatId,
                payload
            );

            return;
        } catch (error) {
            console.error(
                '[MENU] Interactive menu failed:',
                error.message
            );
        }
    }

    /*
     * Fallback: show the menu and all links as
     * ordinary clickable URLs.
     */
    const fallbackCaption =
        caption +
        '\n\n' +
        '╭━━━〔 🔗 QUICK LINKS 〕\n' +
        '┃ 📂 *OPEN REPOSITORY*\n' +
        `${REPO_URL}\n\n` +
        '┃ 📦 *DOWNLOAD ZIP*\n' +
        `${ZIP_URL}\n\n` +
        '┃ 👑 *MESSAGE OWNER*\n' +
        `https://wa.me/${OWNER_NUMBER}\n\n` +
        '┃ 📢 *VISIT CHANNEL*\n' +
        `${CHANNEL_URL}\n` +
        '╰━━━━━━━━━━━━━━';

    const msgOptions = { quoted: msg };

    if (fs.existsSync(CUSTOM_MENU_IMAGE)) {
        await sock.sendMessage(
            chatId,
            {
                image: fs.readFileSync(CUSTOM_MENU_IMAGE),
                caption: fallbackCaption,
                mimetype: 'image/jpeg'
            },
            msgOptions
        );

        return;
    }

    await sock.sendMessage(
        chatId,
        { text: fallbackCaption },
        msgOptions
    );
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
        let loadingMessage;

        try {
            const botName = getBotName() || 'GAAJU-MD-ULTRA';
            const p = prefix || cfg.PREFIX || '.';
            const owner = cfg.OWNER_NAME || 'Chris Gaaju';
            const mode = (cfg.MODE || 'public').toUpperCase();

            loadingMessage = await sock.sendMessage(
                chatId,
                {
                    text:
                        `GAAJU-ULTRA LOADING... ` +
                        getLoadingBar(1)
                },
                { quoted: msg }
            );

            for (let step = 1; step <= LOADING_STEPS; step++) {
                const percent = step * 10;

                if (step > 1) {
                    await sleep(
                        LOADING_DURATION / LOADING_STEPS
                    );
                }

                await sock.sendMessage(
                    chatId,
                    {
                        text:
                            `GAAJU-ULTRA LOADING... ` +
                            getLoadingBar(percent),
                        edit: loadingMessage.key
                    }
                );
            }

            try {
                await sock.sendMessage(
                    chatId,
                    {
                        delete: loadingMessage.key
                    }
                );
            } catch (deleteError) {
                console.error(
                    '[MENU] Could not delete loading message:',
                    deleteError.message
                );
            }

            const caption = buildMenu(
                botName,
                p,
                owner,
                mode,
                msg
            );

            await sendNormalMenu(
                sock,
                chatId,
                msg,
                caption
            );

        } catch (error) {
            console.error('[MENU ERROR]', error);

            if (loadingMessage) {
                try {
                    await sock.sendMessage(
                        chatId,
                        {
                            delete: loadingMessage.key
                        }
                    );
                } catch {}
            }

            try {
                await sock.sendMessage(
                    chatId,
                    {
                        text:
                            '❌ Menu failed to load. ' +
                            'Please check the bot console for the error.'
                    },
                    { quoted: msg }
                );
            } catch {}
        }
    }
};
