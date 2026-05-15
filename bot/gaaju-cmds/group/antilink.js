'use strict';

const { BOT_NAME } = require('../../config');

const URL_PATTERNS = [
    /https?:\/\/[^\s<>]+/gi,
    /www\.[^\s<>]+\.[a-zA-Z]{2,}/gi,
    /t\.me\/[^\s<>]+/gi,
    /instagram\.com\/[^\s<>]+/gi,
    /facebook\.com\/[^\s<>]+/gi,
    /fb\.com\/[^\s<>]+/gi,
    /twitter\.com\/[^\s<>]+/gi,
    /x\.com\/[^\s<>]+/gi,
    /youtube\.com\/[^\s<>]+/gi,
    /youtu\.be\/[^\s<>]+/gi,
    /whatsapp\.com\/[^\s<>]+/gi,
    /chat\.whatsapp\.com\/[^\s<>]+/gi,
    /discord\.gg\/[^\s<>]+/gi,
    /discord\.com\/[^\s<>]+/gi,
    /snapchat\.com\/[^\s<>]+/gi,
    /tiktok\.com\/[^\s<>]+/gi,
    /reddit\.com\/[^\s<>]+/gi,
    /linkedin\.com\/[^\s<>]+/gi,
    /github\.com\/[^\s<>]+/gi,
    /bit\.ly\/[^\s<>]+/gi,
    /tinyurl\.com\/[^\s<>]+/gi,
    /goo\.gl\/[^\s<>]+/gi,
    /ow\.ly\/[^\s<>]+/gi,
    /is\.gd\/[^\s<>]+/gi,
    /v\.gd\/[^\s<>]+/gi,
    /cutt\.ly\/[^\s<>]+/gi,
    /shorturl\.at\/[^\s<>]+/gi,
    /wa\.me\/[^\s<>]+/gi,
    /vm\.tiktok\.com\/[^\s<>]+/gi,
    /pin\.it\/[^\s<>]+/gi,
    /open\.spotify\.com\/[^\s<>]+/gi,
    /spotify\.link\/[^\s<>]+/gi,
];

const BARE_DOMAIN_PATTERN = /\b[a-zA-Z0-9][-a-zA-Z0-9]*\.(com|net|org|io|co|me|info|biz|xyz|dev|app|gg|tv|cc|ly|to|link|shop|store|site|online|live|club|pro|tech|space|fun|one|world|top|click|buzz|win|website)\b/gi;

function extractMessageText(message) {
    if (!message) return '';
    const parts = [];
    if (message.conversation) parts.push(message.conversation);
    if (message.extendedTextMessage?.text) parts.push(message.extendedTextMessage.text);
    if (message.imageMessage?.caption) parts.push(message.imageMessage.caption);
    if (message.videoMessage?.caption) parts.push(message.videoMessage.caption);
    if (message.documentMessage?.caption) parts.push(message.documentMessage.caption);
    if (message.documentMessage?.fileName) parts.push(message.documentMessage.fileName);
    if (message.contactMessage?.displayName) parts.push(message.contactMessage.displayName);
    if (message.contactMessage?.vcard) parts.push(message.contactMessage.vcard);
    if (message.listMessage?.title) parts.push(message.listMessage.title);
    if (message.listMessage?.description) parts.push(message.listMessage.description);
    if (message.buttonsMessage?.contentText) parts.push(message.buttonsMessage.contentText);
    if (message.buttonsMessage?.headerText) parts.push(message.buttonsMessage.headerText);
    if (message.templateMessage?.hydratedTemplate?.hydratedContentText) {
        parts.push(message.templateMessage.hydratedTemplate.hydratedContentText);
    }
    if (message.pollCreationMessage?.name) parts.push(message.pollCreationMessage.name);
    if (message.contactsArrayMessage?.contacts) {
        for (const c of message.contactsArrayMessage.contacts) {
            if (c.displayName) parts.push(c.displayName);
            if (c.vcard) parts.push(c.vcard);
        }
    }
    if (message.extendedTextMessage?.matchedText) parts.push(message.extendedTextMessage.matchedText);
    if (message.extendedTextMessage?.canonicalUrl) parts.push(message.extendedTextMessage.canonicalUrl);
    return parts.join(' ');
}

function containsLink(text) {
    if (!text || typeof text !== 'string') return false;
    const cleanText = text.replace(/[*_~`|]/g, '');
    for (const pattern of URL_PATTERNS) {
        pattern.lastIndex = 0;
        if (pattern.test(cleanText)) return true;
    }
    BARE_DOMAIN_PATTERN.lastIndex = 0;
    if (BARE_DOMAIN_PATTERN.test(cleanText)) return true;
    return false;
}

function extractLinks(text) {
    if (!text || typeof text !== 'string') return [];
    const links = new Set();
    const cleanText = text.replace(/[*_~`|]/g, '');
    for (const pattern of URL_PATTERNS) {
        pattern.lastIndex = 0;
        const matches = cleanText.match(pattern);
        if (matches) {
            for (let link of matches) {
                link = link.trim().replace(/[.,;:!?]+$/, '');
                if (link.startsWith('www.') && !link.startsWith('https://')) link = 'https://' + link;
                links.add(link);
            }
        }
    }
    BARE_DOMAIN_PATTERN.lastIndex = 0;
    const bareMatches = cleanText.match(BARE_DOMAIN_PATTERN);
    if (bareMatches) for (const m of bareMatches) links.add(m.trim());
    return [...links];
}

function cleanJid(jid) {
    if (!jid) return jid;
    const clean = jid.split(':')[0];
    return clean.includes('@') ? clean : clean + '@s.whatsapp.net';
}

function loadConfig() {
    if (typeof globalThis._antilinkConfig === 'object' && globalThis._antilinkConfig !== null) {
        return globalThis._antilinkConfig;
    }
    return {};
}

function saveConfig(data) {
    globalThis._antilinkConfig = data;
    if (typeof globalThis._saveAntilinkConfig === 'function') {
        globalThis._saveAntilinkConfig(data);
    }
}

function isEnabled(chatJid) {
    const config = loadConfig();
    return config[chatJid]?.enabled || false;
}

function getMode(chatJid) {
    const config = loadConfig();
    return config[chatJid]?.mode || 'delete';
}

function getGroupConfig(chatJid) {
    const config = loadConfig();
    return config[chatJid] || null;
}

function checkMessageForLinks(msg) {
    if (!msg.message) return { hasLink: false, links: [], text: '' };
    const text = extractMessageText(msg.message);
    const hasLink = containsLink(text);
    const links = hasLink ? extractLinks(text) : [];
    return { hasLink, links, text };
}

function isLinkExempt(links, exemptLinks) {
    if (!exemptLinks || exemptLinks.length === 0) return false;
    return links.some(link => {
        const cleanLink = link.replace(/^https?:\/\//, '').toLowerCase();
        return exemptLinks.some(exempt => cleanLink.includes(exempt) || exempt.includes(cleanLink));
    });
}

const LINK_TYPE_PATTERNS = {
    grouplinks: [/chat\.whatsapp\.com/i, /wa\.me\//i],
    instagram:  [/instagram\.com/i],
    facebook:   [/facebook\.com/i, /fb\.com/i],
    twitter:    [/twitter\.com/i, /x\.com\//i],
    youtube:    [/youtube\.com/i, /youtu\.be/i],
    tiktok:     [/tiktok\.com/i, /vm\.tiktok\.com/i],
    telegram:   [/t\.me\//i],
    discord:    [/discord\.gg/i, /discord\.com\/invite/i],
    shortened:  [/bit\.ly\//i, /tinyurl\.com/i, /goo\.gl\//i, /ow\.ly\//i, /is\.gd\//i,
                 /v\.gd\//i, /cutt\.ly\//i, /shorturl\.at\//i, /pin\.it\//i, /spotify\.link\//i],
};

const VALID_EXCLUDE_TYPES = Object.keys(LINK_TYPE_PATTERNS);

function getLinkType(link) {
    const lower = link.toLowerCase();
    for (const [type, patterns] of Object.entries(LINK_TYPE_PATTERNS)) {
        if (patterns.some(p => p.test(lower))) return type;
    }
    return 'other';
}

function isExcludedType(links, excludeTypes) {
    if (!excludeTypes || excludeTypes.length === 0) return false;
    return links.some(link => excludeTypes.includes(getLinkType(link)));
}

function getExcludeTypes(chatJid) {
    const config = loadConfig();
    return config[chatJid]?.excludeTypes || [];
}

const H = '╔═|〔  ANTI LINK 〕';
const F = `╚═|〔 ${BOT_NAME} 〕`;
const SEP = '║';

module.exports = {
    name: 'antilink',
    description: 'Control link sharing in the group with different actions',
    category: 'group',

    checkMessageForLinks,
    isEnabled,
    getMode,
    getGroupConfig,
    isLinkExempt,
    isExcludedType,
    getExcludeTypes,
    containsLink,
    extractLinks,
    extractMessageText,

    async execute(sock, msg, args, PREFIX, extra) {
        const chatId = msg.key.remoteJid;
        try { await sock.sendMessage(chatId, { react: { text: '🔗', key: msg.key } }); } catch {}
        const isGroup = chatId.endsWith('@g.us');

        if (!isGroup) {
            return sock.sendMessage(chatId, {
                text: `${H}\n${SEP}\n${SEP} ▸ Group only command\n${SEP}\n╚═╝`
            }, { quoted: msg });
        }

        let sender = msg.key.participant || (msg.key.fromMe ? sock.user.id : chatId);
        sender = cleanJid(sender);

        let isAdmin = false;
        try {
            const groupMetadata = await sock.groupMetadata(chatId);
            const participant = groupMetadata.participants.find(p => cleanJid(p.id) === sender);
            isAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin';
        } catch {
            return sock.sendMessage(chatId, {
                text: `${H}\n${SEP}\n${SEP} ▸ *Status* : ❌ Failed to fetch group info\n${SEP}\n╚═╝`
            }, { quoted: msg });
        }

        const isOwner = extra?.isOwner ? extra.isOwner() : false;
        const isSudo = extra?.isSudo ? extra.isSudo() : false;

        if (!isAdmin && !isOwner && !isSudo) {
            return sock.sendMessage(chatId, {
                text: `${H}\n${SEP}\n${SEP} ▸ Admins only command\n${SEP}\n╚═╝`
            }, { quoted: msg });
        }

        const config = loadConfig();
        const sub = (args[0] || '').toLowerCase();

        // ── ON ──────────────────────────────────────────────────────────
        if (sub === 'on') {
            const mode = (args[1] || '').toLowerCase();
            if (!mode || !['warn', 'delete', 'kick'].includes(mode)) {
                return sock.sendMessage(chatId, {
                    text: `${H}\n${SEP}\n${SEP} ▸ *Usage*  : ${PREFIX}antilink on [mode]\n${SEP}\n${SEP} ▸ *warn*   → warn senders\n${SEP} ▸ *delete* → auto-delete links\n${SEP} ▸ *kick*   → kick senders\n${SEP}\n╚═╝`
                }, { quoted: msg });
            }
            config[chatId] = {
                enabled: true,
                mode,
                exemptAdmins: config[chatId]?.exemptAdmins ?? true,
                exemptLinks: config[chatId]?.exemptLinks || [],
                warningCount: config[chatId]?.warningCount || {}
            };
            saveConfig(config);
            return sock.sendMessage(chatId, {
                text: `${H}\n${SEP}\n${SEP} ▸ *Status* : ✅ Enabled\n${SEP} ▸ *Mode*   : ${mode.toUpperCase()}\n${SEP} ▸ *Admins* : ${config[chatId].exemptAdmins ? 'Exempt' : 'Not exempt'}\n${SEP}\n${F}`
            }, { quoted: msg });
        }

        // ── OFF ─────────────────────────────────────────────────────────
        if (sub === 'off') {
            if (config[chatId]) {
                config[chatId].enabled = false;
                saveConfig(config);
            }
            return sock.sendMessage(chatId, {
                text: `${H}\n${SEP}\n${SEP} ▸ *Status* : ❌ Disabled\n${SEP} ▸ *Note*   : Links allowed again\n${SEP}\n${F}`
            }, { quoted: msg });
        }

        // ── STATUS ──────────────────────────────────────────────────────
        if (sub === 'status') {
            const gc = config[chatId];
            if (gc?.enabled) {
                const excludeList = gc.excludeTypes?.length ? gc.excludeTypes.join(', ') : 'none';
                return sock.sendMessage(chatId, {
                    text: `${H}\n${SEP}\n${SEP} ▸ *Status*   : ✅ ENABLED\n${SEP} ▸ *Mode*     : ${gc.mode.toUpperCase()}\n${SEP} ▸ *Admins*   : ${gc.exemptAdmins ? 'Exempt' : 'Not exempt'}\n${SEP} ▸ *Allowed*  : ${gc.exemptLinks?.length || 0} link(s)\n${SEP} ▸ *Excluded* : ${excludeList}\n${SEP}\n${F}`
                }, { quoted: msg });
            }
            return sock.sendMessage(chatId, {
                text: `${H}\n${SEP}\n${SEP} ▸ *Status* : ❌ DISABLED\n${SEP} ▸ *Enable* : ${PREFIX}antilink on [mode]\n${SEP}\n╚═╝`
            }, { quoted: msg });
        }

        // ── ALLOW ───────────────────────────────────────────────────────
        if (sub === 'allow') {
            const linkToAllow = args.slice(1).join(' ').trim();
            if (!linkToAllow) {
                return sock.sendMessage(chatId, {
                    text: `${H}\n${SEP}\n${SEP} ▸ *Usage* : ${PREFIX}antilink allow [link]\n${SEP} ▸ *e.g.*  : ${PREFIX}antilink allow youtube.com\n${SEP}\n╚═╝`
                }, { quoted: msg });
            }
            if (!config[chatId]) config[chatId] = { enabled: false, mode: 'delete', exemptAdmins: true, exemptLinks: [], warningCount: {} };
            if (!config[chatId].exemptLinks) config[chatId].exemptLinks = [];
            const cleanLink = linkToAllow.replace(/^https?:\/\//, '').toLowerCase();
            if (config[chatId].exemptLinks.includes(cleanLink)) {
                return sock.sendMessage(chatId, {
                    text: `${H}\n${SEP}\n${SEP} ▸ *Link*   : ${cleanLink}\n${SEP} ▸ *Status* : Already allowed\n${SEP}\n╚═╝`
                }, { quoted: msg });
            }
            config[chatId].exemptLinks.push(cleanLink);
            saveConfig(config);
            return sock.sendMessage(chatId, {
                text: `${H}\n${SEP}\n${SEP} ▸ *Link*   : ${cleanLink}\n${SEP} ▸ *Status* : ✅ Added to allow list\n${SEP}\n${F}`
            }, { quoted: msg });
        }

        // ── DISALLOW ────────────────────────────────────────────────────
        if (sub === 'disallow' || sub === 'remove') {
            const linkToRemove = args.slice(1).join(' ').trim();
            if (!linkToRemove) {
                return sock.sendMessage(chatId, {
                    text: `${H}\n${SEP}\n${SEP} ▸ *Usage* : ${PREFIX}antilink disallow [link]\n${SEP}\n╚═╝`
                }, { quoted: msg });
            }
            if (!config[chatId]?.exemptLinks?.length) {
                return sock.sendMessage(chatId, {
                    text: `${H}\n${SEP}\n${SEP} ▸ No allowed links to remove\n${SEP}\n╚═╝`
                }, { quoted: msg });
            }
            const cleanLink = linkToRemove.replace(/^https?:\/\//, '').toLowerCase();
            const idx = config[chatId].exemptLinks.indexOf(cleanLink);
            if (idx === -1) {
                return sock.sendMessage(chatId, {
                    text: `${H}\n${SEP}\n${SEP} ▸ *Link*   : ${cleanLink}\n${SEP} ▸ *Status* : Not in allow list\n${SEP}\n╚═╝`
                }, { quoted: msg });
            }
            config[chatId].exemptLinks.splice(idx, 1);
            saveConfig(config);
            return sock.sendMessage(chatId, {
                text: `${H}\n${SEP}\n${SEP} ▸ *Link*   : ${cleanLink}\n${SEP} ▸ *Status* : ✅ Removed from allow list\n${SEP}\n${F}`
            }, { quoted: msg });
        }

        // ── LIST ALLOWED ─────────────────────────────────────────────────
        if (sub === 'listallowed' || sub === 'list') {
            const exemptLinks = config[chatId]?.exemptLinks || [];
            if (exemptLinks.length === 0) {
                return sock.sendMessage(chatId, {
                    text: `${H}\n${SEP}\n${SEP} ▸ No links in allow list\n${SEP}\n╚═╝`
                }, { quoted: msg });
            }
            const rows = exemptLinks.map((link, i) => `${SEP} ▸ *${i + 1}.* ${link}`).join('\n');
            return sock.sendMessage(chatId, {
                text: `${H}\n${SEP}\n${rows}\n${SEP}\n${SEP} ▸ *Total* : ${exemptLinks.length}\n${SEP}\n╚═╝`
            }, { quoted: msg });
        }

        // ── EXEMPTADMINS ─────────────────────────────────────────────────
        if (sub === 'exemptadmins') {
            const toggle = (args[1] || '').toLowerCase();
            if (!config[chatId]) config[chatId] = { enabled: false, mode: 'delete', exemptAdmins: true, exemptLinks: [], warningCount: {} };
            if (toggle === 'on') {
                config[chatId].exemptAdmins = true;
                saveConfig(config);
                return sock.sendMessage(chatId, {
                    text: `${H}\n${SEP}\n${SEP} ▸ *Admins* : ✅ Exempt from antilink\n${SEP}\n${F}`
                }, { quoted: msg });
            }
            if (toggle === 'off') {
                config[chatId].exemptAdmins = false;
                saveConfig(config);
                return sock.sendMessage(chatId, {
                    text: `${H}\n${SEP}\n${SEP} ▸ *Admins* : ❌ Not exempt — subject to antilink\n${SEP}\n${F}`
                }, { quoted: msg });
            }
            const current = config[chatId].exemptAdmins !== false ? '✅ Exempt' : '❌ Not exempt';
            return sock.sendMessage(chatId, {
                text: `${H}\n${SEP}\n${SEP} ▸ *Admins* : ${current}\n${SEP} ▸ *Usage*  : ${PREFIX}antilink exemptadmins on/off\n${SEP}\n╚═╝`
            }, { quoted: msg });
        }

        // ── EXCLUDE ──────────────────────────────────────────────────────
        if (sub === 'exclude' || sub === 'addexclude') {
            const typeName = (args[1] || '').toLowerCase();
            if (!typeName || !VALID_EXCLUDE_TYPES.includes(typeName)) {
                return sock.sendMessage(chatId, {
                    text: `${H}\n${SEP}\n${SEP} ▸ *Usage*  : ${PREFIX}antilink exclude [type]\n${SEP}\n${SEP} ▸ *Types*  :\n${SEP}   grouplinks, instagram, facebook\n${SEP}   twitter, youtube, tiktok\n${SEP}   telegram, discord, shortened\n${SEP}\n${SEP} ▸ *Note*   : Excluded types are always\n${SEP}   actioned even if domain is allowed\n${SEP}\n╚═╝`
                }, { quoted: msg });
            }
            if (!config[chatId]) config[chatId] = { enabled: false, mode: 'delete', exemptAdmins: true, exemptLinks: [], warningCount: {}, excludeTypes: [] };
            if (!config[chatId].excludeTypes) config[chatId].excludeTypes = [];
            if (config[chatId].excludeTypes.includes(typeName)) {
                return sock.sendMessage(chatId, {
                    text: `${H}\n${SEP}\n${SEP} ▸ *Type*   : ${typeName}\n${SEP} ▸ *Status* : Already excluded\n${SEP}\n╚═╝`
                }, { quoted: msg });
            }
            config[chatId].excludeTypes.push(typeName);
            saveConfig(config);
            return sock.sendMessage(chatId, {
                text: `${H}\n${SEP}\n${SEP} ▸ *Type*   : ${typeName}\n${SEP} ▸ *Status* : ✅ Added to exclude list\n${SEP} ▸ *Mode*   : ${getMode(chatId).toUpperCase()}\n${SEP}\n${F}`
            }, { quoted: msg });
        }

        // ── REMOVEEXCLUDE ────────────────────────────────────────────────
        if (sub === 'removeexclude' || sub === 'unexclude') {
            const typeName = (args[1] || '').toLowerCase();
            if (!typeName) {
                return sock.sendMessage(chatId, {
                    text: `${H}\n${SEP}\n${SEP} ▸ *Usage* : ${PREFIX}antilink removeexclude [type]\n${SEP}\n╚═╝`
                }, { quoted: msg });
            }
            const excludeTypes = config[chatId]?.excludeTypes || [];
            const idx = excludeTypes.indexOf(typeName);
            if (idx === -1) {
                return sock.sendMessage(chatId, {
                    text: `${H}\n${SEP}\n${SEP} ▸ *Type*   : ${typeName}\n${SEP} ▸ *Status* : Not in exclude list\n${SEP}\n╚═╝`
                }, { quoted: msg });
            }
            config[chatId].excludeTypes.splice(idx, 1);
            saveConfig(config);
            return sock.sendMessage(chatId, {
                text: `${H}\n${SEP}\n${SEP} ▸ *Type*   : ${typeName}\n${SEP} ▸ *Status* : ✅ Removed from exclude list\n${SEP}\n${F}`
            }, { quoted: msg });
        }

        // ── LISTEXCLUDE ──────────────────────────────────────────────────
        if (sub === 'listexclude' || sub === 'excludes') {
            const excludeTypes = config[chatId]?.excludeTypes || [];
            if (excludeTypes.length === 0) {
                return sock.sendMessage(chatId, {
                    text: `${H}\n${SEP}\n${SEP} ▸ No excluded types\n${SEP} ▸ *Add*  : ${PREFIX}antilink exclude [type]\n${SEP}\n╚═╝`
                }, { quoted: msg });
            }
            const rows = excludeTypes.map((t, i) => `${SEP} ▸ *${i + 1}.* ${t}`).join('\n');
            return sock.sendMessage(chatId, {
                text: `${H}\n${SEP}\n${rows}\n${SEP}\n${SEP} ▸ *Total* : ${excludeTypes.length}\n${SEP}\n╚═╝`
            }, { quoted: msg });
        }

        // ── TEST ─────────────────────────────────────────────────────────
        if (sub === 'test') {
            const testText = args.slice(1).join(' ') || 'Test message with https://example.com and youtube.com/watch?v=abc';
            const hasLink = containsLink(testText);
            const extracted = extractLinks(testText);
            let rows = `${SEP} ▸ *Found*  : ${hasLink ? '✅ Yes' : '❌ No'}\n`;
            if (hasLink && extracted.length > 0) {
                rows += `${SEP} ▸ *Links*  : ${extracted.length} detected\n`;
                extracted.forEach((link, i) => { rows += `${SEP}   ${i + 1}. ${link}\n`; });
            }
            return sock.sendMessage(chatId, {
                text: `${H}\n${SEP}\n${SEP} ▸ *Text*   : ${testText}\n${SEP}\n${rows}${SEP}\n╚═╝`
            }, { quoted: msg });
        }

        // ── unknown arg → ignore silently ────────────────────────────────
        return;
    }
};
