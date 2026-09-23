'use strict';

/*
 * ==========================
 * ANTI-LINK
 * GAAJU-MD-ULTRA
 * ==========================
 */

const URL_PATTERNS = [
    /https?:\/\/[^\s]+/i,
    /www\.[^\s]+/i,

    /t\.me\/[^\s]+/i,

    /instagram\.com\/[^\s]+/i,
    /facebook\.com\/[^\s]+/i,
    /fb\.com\/[^\s]+/i,

    /twitter\.com\/[^\s]+/i,
    /x\.com\/[^\s]+/i,

    /youtube\.com\/[^\s]+/i,
    /youtu\.be\/[^\s]+/i,

    /whatsapp\.com\/[^\s]+/i,
    /chat\.whatsapp\.com\/[^\s]+/i,

    /discord\.gg\/[^\s]+/i,
    /discord\.com\/[^\s]+/i,

    /snapchat\.com\/[^\s]+/i,
    /tiktok\.com\/[^\s]+/i,
    /reddit\.com\/[^\s]+/i,
    /linkedin\.com\/[^\s]+/i,
    /github\.com\/[^\s]+/i,

    /bitly\.com\/[^\s]+/i,
    /tinyurl\.com\/[^\s]+/i,
    /goo\.gl\/[^\s]+/i,
    /ow\.ly\/[^\s]+/i,
    /is\.gd\/[^\s]+/i,
    /v\.gd\/[^\s]+/i,
    /cutt\.ly\/[^\s]+/i,
    /shorturl\.at\/[^\s]+/i,

    /wa\.me\/[^\s]+/i,
    /vm\.tiktok\.com\/[^\s]+/i,
    /pin\.it\/[^\s]+/i,

    /open\.spotify\.com\/[^\s]+/i,
    /spotify\.link\/[^\s]+/i
];

const BARE_DOMAIN_PATTERN =
    /\b(?:[a-z0-9-]+\.)+(?:com|net|org|xyz|info|biz|me|io|co|app|dev|ng|uk|us|site|online|store|tech|live|tv|gg|ly|link|cloud|shop|top|pro|vip|fun|club|one|world|website|space|click|today|win|work|digital|agency|solutions|social|media)\b/i;


/*
 * ==========================
 * GAAJU STYLE
 * ==========================
 */

const H =
    '┏━━❐➭ ANTI LINK ❐';

const F =
    '┗━━❐➭';

const SEP =
    '┃➭';


/*
 * ==========================
 * MESSAGE TEXT
 * ==========================
 */

function extractMessageText(message) {
    if (!message) return '';

    return (
        message.conversation ||
        message.extendedTextMessage?.text ||
        message.imageMessage?.caption ||
        message.videoMessage?.caption ||
        message.documentMessage?.caption ||
        message.buttonsResponseMessage?.selectedButtonId ||
        message.listResponseMessage?.singleSelectReply?.selectedRowId ||
        message.templateButtonReplyMessage?.selectedId ||
        message.interactiveResponseMessage?.body?.text ||
        ''
    );
}


/*
 * ==========================
 * LINK CHECK
 * ==========================
 */

function containsLink(text) {
    if (!text) return false;

    if (URL_PATTERNS.some(pattern => pattern.test(text))) {
        return true;
    }

    return BARE_DOMAIN_PATTERN.test(text);
}


function extractLinks(text) {
    if (!text) return [];

    const links = [];

    for (const pattern of URL_PATTERNS) {
        const matches = text.match(new RegExp(pattern.source, 'gi'));

        if (matches) {
            links.push(...matches);
        }
    }

    const domains = text.match(
        new RegExp(BARE_DOMAIN_PATTERN.source, 'gi')
    );

    if (domains) {
        links.push(...domains);
    }

    return [...new Set(links)];
}


/*
 * ==========================
 * JID CLEANER
 * ==========================
 */

function cleanJid(jid = '') {
    return jid
        .replace(/:\d+@/, '@')
        .replace(/@c\.us$/, '@s.whatsapp.net');
}


/*
 * ==========================
 * CONFIG
 * ==========================
 */

function getConfigStore() {
    if (!globalThis._antilinkConfig) {
        globalThis._antilinkConfig = {};
    }

    return globalThis._antilinkConfig;
}


function saveConfigStore() {
    try {
        if (typeof globalThis._saveAntilinkConfig === 'function') {
            globalThis._saveAntilinkConfig(
                globalThis._antilinkConfig
            );
        }
    } catch (error) {
        console.error('ANTILINK CONFIG SAVE ERROR:', error);
    }
}


function getGroupConfig(groupId) {
    const store = getConfigStore();

    if (!store[groupId]) {
        store[groupId] = {
            enabled: false,
            mode: 'warn',
            allowedLinks: [],
            exemptAdmins: false,
            excludeTypes: []
        };
    }

    return store[groupId];
}


function isEnabled(groupId) {
    return getGroupConfig(groupId).enabled === true;
}


function getMode(groupId) {
    return getGroupConfig(groupId).mode || 'warn';
}


/*
 * ==========================
 * LINK TYPES
 * ==========================
 */

const LINK_TYPE_PATTERNS = {
    whatsapp: [
        /whatsapp\.com/i,
        /chat\.whatsapp\.com/i,
        /wa\.me/i
    ],

    telegram: [
        /t\.me/i,
        /telegram\.me/i
    ],

    instagram: [
        /instagram\.com/i
    ],

    facebook: [
        /facebook\.com/i,
        /fb\.com/i
    ],

    twitter: [
        /twitter\.com/i,
        /x\.com/i
    ],

    youtube: [
        /youtube\.com/i,
        /youtu\.be/i
    ],

    tiktok: [
        /tiktok\.com/i,
        /vm\.tiktok\.com/i
    ],

    discord: [
        /discord\.gg/i,
        /discord\.com/i
    ],

    github: [
        /github\.com/i
    ],

    snapchat: [
        /snapchat\.com/i
    ],

    reddit: [
        /reddit\.com/i
    ],

    linkedin: [
        /linkedin\.com/i
    ],

    spotify: [
        /spotify\.com/i,
        /spotify\.link/i
    ],

    shortener: [
        /bitly\.com/i,
        /tinyurl\.com/i,
        /goo\.gl/i,
        /ow\.ly/i,
        /is\.gd/i,
        /v\.gd/i,
        /cutt\.ly/i,
        /shorturl/i
    ],

    website: [
        BARE_DOMAIN_PATTERN
    ]
};


const VALID_EXCLUDE_TYPES = Object.keys(LINK_TYPE_PATTERNS);


function getLinkType(link) {
    if (!link) return 'website';

    for (const [type, patterns] of Object.entries(LINK_TYPE_PATTERNS)) {
        if (patterns.some(pattern => pattern.test(link))) {
            return type;
        }
    }

    return 'website';
}


function isExcludedType(groupId, link) {
    const config = getGroupConfig(groupId);
    const type = getLinkType(link);

    return config.excludeTypes.includes(type);
}


function getExcludeTypes(groupId) {
    return getGroupConfig(groupId).excludeTypes || [];
}


/*
 * ==========================
 * MESSAGE CHECK
 * ==========================
 */

function checkMessageForLinks(groupId, text) {
    if (!isEnabled(groupId)) {
        return {
            detected: false,
            links: []
        };
    }

    if (!containsLink(text)) {
        return {
            detected: false,
            links: []
        };
    }

    const links = extractLinks(text);

    const filteredLinks = links.filter(
        link => !isExcludedType(groupId, link)
    );

    return {
        detected: filteredLinks.length > 0,
        links: filteredLinks
    };
}


/*
 * ==========================
 * EXEMPTION
 * ==========================
 */

function isLinkExempt(groupId, jid, groupMetadata = null) {
    const config = getGroupConfig(groupId);

    if (!jid) return false;

    const cleaned = cleanJid(jid);

    /*
     * Bot itself
     */
    if (
        globalThis.sock?.user?.id &&
        cleanJid(globalThis.sock.user.id) === cleaned
    ) {
        return true;
    }

    /*
     * Admin exemption
     */
    if (config.exemptAdmins && groupMetadata?.participants) {
        const participant = groupMetadata.participants.find(
            p => cleanJid(p.id) === cleaned
        );

        if (
            participant &&
            (participant.admin === 'admin' ||
                participant.admin === 'superadmin')
        ) {
            return true;
        }
    }

    return false;
}


/*
 * ==========================
 * COMMAND
 * ==========================
 */

module.exports = {
    name: 'antilink',

    aliases: [
        'antilink'
    ],

    description: 'Control anti-link protection',

    category: 'group',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;

        /*
         * ==========================
         * GROUP CHECK
         * ==========================
         */

        if (!chatId?.endsWith('@g.us')) {
            return sock.sendMessage(
                chatId,
                {
                    text:
                        `${H}\n` +
                        `${SEP}➭ This command can only be used in groups.\n` +
                        `${F}`
                },
                { quoted: msg }
            );
        }


        /*
         * ==========================
         * HELPERS
         * ==========================
         */

        const sender =
            msg.key.participant ||
            msg.participant ||
            msg.key.remoteJid;

        const cleanSender = cleanJid(sender);

        let groupMetadata;

        try {
            groupMetadata = await sock.groupMetadata(chatId);
        } catch (error) {
            console.error('ANTILINK GROUP METADATA ERROR:', error);
        }

        const participant = groupMetadata?.participants?.find(
            p => cleanJid(p.id) === cleanSender
        );

        const isAdmin =
            participant?.admin === 'admin' ||
            participant?.admin === 'superadmin';

        const ownerNumber =
            globalThis.config?.OWNER_NUMBER ||
            globalThis.ownerNumber ||
            globalThis.owner;

        const isOwner =
            ownerNumber &&
            cleanSender.replace(/\D/g, '') ===
            String(ownerNumber).replace(/\D/g, '');

        const isSudo =
            typeof globalThis.isSudo === 'function'
                ? await globalThis.isSudo(cleanSender)
                : false;

        if (!isAdmin && !isOwner && !isSudo) {
            return sock.sendMessage(
                chatId,
                {
                    text:
                        `${H}\n` +
                        `${SEP}➭ Admin/owner only.\n` +
                        `${F}`
                },
                { quoted: msg }
            );
        }


        /*
         * ==========================
         * ARGS
         * ==========================
         */

        const action = (args[0] || '').toLowerCase();
        const value = args.slice(1).join(' ').trim();

        const config = getGroupConfig(chatId);


        /*
         * ==========================
         * HELP
         * ==========================
         */

        if (!action) {
            return sock.sendMessage(
                chatId,
                {
                    text:
                        `${H}\n` +
                        `${SEP}➭ ${prefix}antilink on [warn|delete|kick]\n` +
                        `${SEP}➭ ${prefix}antilink off\n` +
                        `${SEP}➭ ${prefix}antilink status\n` +
                        `${SEP}➭ ${prefix}antilink allow [link]\n` +
                        `${SEP}➭ ${prefix}antilink disallow [link]\n` +
                        `${SEP}➭ ${prefix}antilink listallowed\n` +
                        `${SEP}➭ ${prefix}antilink exemptadmins on/off\n` +
                        `${SEP}➭ ${prefix}antilink exclude [type]\n` +
                        `${SEP}➭ ${prefix}antilink removeexclude [type]\n` +
                        `${SEP}➭ ${prefix}antilink listexclude\n` +
                        `${SEP}➭ ${prefix}antilink test [text]\n` +
                        `${F}`
                },
                { quoted: msg }
            );
        }


        /*
         * ==========================
         * ON
         * ==========================
         */

        if (action === 'on') {
            const mode =
                ['warn', 'delete', 'kick'].includes(
                    value.toLowerCase()
                )
                    ? value.toLowerCase()
                    : 'warn';

            config.enabled = true;
            config.mode = mode;

            saveConfigStore();

            return sock.sendMessage(
                chatId,
                {
                    text:
                        `${H}\n` +
                        `${SEP}➭ Status : ✅ Enabled\n` +
                        `${SEP}➭ Mode   : ${mode}\n` +
                        `${F}`
                },
                { quoted: msg }
            );
        }


        /*
         * ==========================
         * OFF
         * ==========================
         */

        if (action === 'off') {
            config.enabled = false;

            saveConfigStore();

            return sock.sendMessage(
                chatId,
                {
                    text:
                        `${H}\n` +
                        `${SEP}➭ Status : ❌ Disabled\n` +
                        `${F}`
                },
                { quoted: msg }
            );
        }


        /*
         * ==========================
         * STATUS
         * ==========================
         */

        if (action === 'status') {
            return sock.sendMessage(
                chatId,
                {
                    text:
                        `${H}\n` +
                        `${SEP}➭ Status       : ${config.enabled ? '✅ Enabled' : '❌ Disabled'}\n` +
                        `${SEP}➭ Mode         : ${config.mode}\n` +
                        `${SEP}➭ Admin Exempt : ${config.exemptAdmins ? '✅ On' : '❌ Off'}\n` +
                        `${SEP}➭ Allowed      : ${config.allowedLinks.length}\n` +
                        `${SEP}➭ Excluded     : ${config.excludeTypes.length}\n` +
                        `${F}`
                },
                { quoted: msg }
            );
        }


        /*
         * ==========================
         * ALLOW
         * ==========================
         */

        if (action === 'allow') {
            if (!value) {
                return sock.sendMessage(
                    chatId,
                    {
                        text:
                            `${H}\n` +
                            `${SEP}➭ Enter a link/type to allow.\n` +
                            `${F}`
                    },
                    { quoted: msg }
                );
            }

            if (!config.allowedLinks.includes(value)) {
                config.allowedLinks.push(value);
            }

            saveConfigStore();

            return sock.sendMessage(
                chatId,
                {
                    text:
                        `${H}\n` +
                        `${SEP}➭ Allowed : ${value}\n` +
                        `${F}`
                },
                { quoted: msg }
            );
        }


        /*
         * ==========================
         * DISALLOW / REMOVE
         * ==========================
         */

        if (
            action === 'disallow' ||
            action === 'remove'
        ) {
            if (!value) {
                return sock.sendMessage(
                    chatId,
                    {
                        text:
                            `${H}\n` +
                            `${SEP}➭ Enter a link/type to remove.\n` +
                            `${F}`
                    },
                    { quoted: msg }
                );
            }

            config.allowedLinks =
                config.allowedLinks.filter(
                    item =>
                        item.toLowerCase() !==
                        value.toLowerCase()
                );

            saveConfigStore();

            return sock.sendMessage(
                chatId,
                {
                    text:
                        `${H}\n` +
                        `${SEP}➭ Removed : ${value}\n` +
                        `${F}`
                },
                { quoted: msg }
            );
        }


        /*
         * ==========================
         * LIST ALLOWED
         * ==========================
         */

        if (
            action === 'listallowed' ||
            action === 'list'
        ) {
            const allowed =
                config.allowedLinks.length
                    ? config.allowedLinks
                        .map(x => `${SEP} ${x}`)
                        .join('\n')
                    : `${SEP} None`;

            return sock.sendMessage(
                chatId,
                {
                    text:
                        `${H}\n` +
                        `${allowed}\n` +
                        `${F}`
                },
                { quoted: msg }
            );
        }


        /*
         * ==========================
         * EXEMPT ADMINS
         * ==========================
         */

        if (
            action === 'exemptadmins' ||
            action === 'exempt'
        ) {
            const setting =
                value.toLowerCase();

            if (
                setting !== 'on' &&
                setting !== 'off'
            ) {
                return sock.sendMessage(
                    chatId,
                    {
                        text:
                            `${H}\n` +
                            `${SEP}➭ Use: ${prefix}antilink exemptadmins on/off\n` +
                            `${F}`
                    },
                    { quoted: msg }
                );
            }

            config.exemptAdmins =
                setting === 'on';

            saveConfigStore();

            return sock.sendMessage(
                chatId,
                {
                    text:
                        `${H}\n` +
                        `${SEP}➭ Admin Exempt : ${config.exemptAdmins ? '✅ On' : '❌ Off'}\n` +
                        `${F}`
                },
                { quoted: msg }
            );
        }


        /*
         * ==========================
         * EXCLUDE
         * ==========================
         */

        if (
            action === 'exclude' ||
            action === 'addexclude'
        ) {
            const type =
                value.toLowerCase();

            if (!VALID_EXCLUDE_TYPES.includes(type)) {
                return sock.sendMessage(
                    chatId,
                    {
                        text:
                            `${H}\n` +
                            `${SEP}➭ Invalid type.\n` +
                            `${SEP}➭ Available: ${VALID_EXCLUDE_TYPES.join(', ')}\n` +
                            `${F}`
                    },
                    { quoted: msg }
                );
            }

            if (!config.excludeTypes.includes(type)) {
                config.excludeTypes.push(type);
            }

            saveConfigStore();

            return sock.sendMessage(
                chatId,
                {
                    text:
                        `${H}\n` +
                        `${SEP}➭ Excluded : ${type}\n` +
                        `${F}`
                },
                { quoted: msg }
            );
        }


        /*
         * ==========================
         * REMOVE EXCLUDE
         * ==========================
         */

        if (
            action === 'removeexclude' ||
            action === 'unexclude'
        ) {
            const type =
                value.toLowerCase();

            config.excludeTypes =
                config.excludeTypes.filter(
                    item => item !== type
                );

            saveConfigStore();

            return sock.sendMessage(
                chatId,
                {
                    text:
                        `${H}\n` +
                        `${SEP}➭ Removed : ${type}\n` +
                        `${F}`
                },
                { quoted: msg }
            );
        }


        /*
         * ==========================
         * LIST EXCLUDES
         * ==========================
         */

        if (
            action === 'listexclude' ||
            action === 'excludes'
        ) {
            const excludes =
                getExcludeTypes(chatId);

            return sock.sendMessage(
                chatId,
                {
                    text:
                        `${H}\n` +
                        `${SEP}➭ ${excludes.length ? excludes.join(', ') : 'None'}\n` +
                        `${F}`
                },
                { quoted: msg }
            );
        }


        /*
         * ==========================
         * TEST
         * ==========================
         */

        if (action === 'test') {
            if (!value) {
                return sock.sendMessage(
                    chatId,
                    {
                        text:
                            `${H}\n` +
                            `${SEP}➭ Enter text to test.\n` +
                            `${F}`
                    },
                    { quoted: msg }
                );
            }

            const result =
                checkMessageForLinks(
                    chatId,
                    value
                );

            return sock.sendMessage(
                chatId,
                {
                    text:
                        `${H}\n` +
                        `${SEP}➭ Link Found : ${result.detected ? '✅ Yes' : '❌ No'}\n` +
                        `${SEP}➭ Links     : ${result.links.length}\n` +
                        `${F}`
                },
                { quoted: msg }
            );
        }


        /*
         * ==========================
         * UNKNOWN ACTION
         * ==========================
         */

        return sock.sendMessage(
            chatId,
            {
                text:
                    `${H}\n` +
                    `${SEP}➭ Unknown option.\n` +
                    `${SEP}➭ Use ${prefix}antilink for help.\n` +
                    `${F}`
            },
            { quoted: msg }
        );
    },


    /*
     * ==========================
     * EXPORTED HELPERS
     * ==========================
     */

    extractMessageText,
    containsLink,
    extractLinks,
    cleanJid,

    getGroupConfig,
    isEnabled,
    getMode,

    checkMessageForLinks,
    isLinkExempt,

    getLinkType,
    isExcludedType,
    getExcludeTypes,

    LINK_TYPE_PATTERNS,
    VALID_EXCLUDE_TYPES
};
