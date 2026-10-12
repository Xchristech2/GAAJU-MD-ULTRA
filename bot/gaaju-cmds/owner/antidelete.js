'use strict';

const fs = require('fs');
const path = require('path');
const { downloadMediaMessage } = require('wolfsocket');

const {
    get,
    set
} = require('../../lib/autoconfig');

const {
    getBotName
} = require('../../lib/botname');

const {
    resolveDisplay
} = require('../../lib/groupUtils');

const {
    isBotDeleted
} = require('../../lib/bot-delete-guard');

const config = require('../../config');

const _store = new Map();

const MAX_MSGS = 1000;
const STORE_TIME = 30 * 60 * 1000;

let _sock = null;

const _revokedIds = new Set();

const _registered = new WeakSet();

function cleanJid(jid = '') {
    return String(jid)
        .replace(/:\d+(?=@)/, '');
}

function markRevoked(id) {
    if (!id) return false;

    if (_revokedIds.has(id)) {
        return false;
    }

    _revokedIds.add(id);

    setTimeout(() => {
        _revokedIds.delete(id);
    }, 15000);

    return true;
}

function resolveContent(message) {
    if (!message) return null;

    if (message.ephemeralMessage?.message) {
        return resolveContent(message.ephemeralMessage.message);
    }

    if (message.viewOnceMessage?.message) {
        return resolveContent(message.viewOnceMessage.message);
    }

    if (message.viewOnceMessageV2?.message) {
        return resolveContent(message.viewOnceMessageV2.message);
    }

    if (message.viewOnceMessageV2Extension?.message) {
        return resolveContent(message.viewOnceMessageV2Extension.message);
    }

    return message;
}

function addToStore(msg) {
    if (!msg?.key?.id || !msg.message) {
        return;
    }

    if (msg.key.remoteJid === 'status@broadcast') {
        return;
    }

    const content = resolveContent(msg.message);

    if (!content) {
        return;
    }

    const id = msg.key.id;

    _store.set(id, {
        msg,
        content,
        chat: cleanJid(msg.key.remoteJid),
        timestamp: Date.now()
    });

    while (_store.size > MAX_MSGS) {
        const first = _store.keys().next().value;

        if (!first) break;

        _store.delete(first);
    }
}

function cleanupStore() {
    const now = Date.now();

    for (const [id, item] of _store.entries()) {
        if (!item?.timestamp) {
            _store.delete(id);
            continue;
        }

        if (now - item.timestamp > STORE_TIME) {
            _store.delete(id);
        }
    }
}

function getConfig() {
    const cfg = get('antidelete') || {};

    if (
        typeof cfg.enabled === 'boolean' &&
        cfg.global === undefined
    ) {
        cfg.global = cfg.enabled;
        delete cfg.enabled;
    }

    if (!cfg.chats || typeof cfg.chats !== 'object') {
        cfg.chats = {};
    }

    return cfg;
}

function getChatConfig(cfg, jid) {
    const item = cfg?.chats?.[jid];

    if (!item) {
        return null;
    }

    if (item === true) {
        return {
            enabled: true,
            mode: 'owner'
        };
    }

    return item;
}

function isChatEnabled(jid) {
    const cfg = getConfig();

    if (cfg.global === true) {
        return true;
    }

    const chat = getChatConfig(cfg, jid);

    return chat?.enabled === true;
}

function getChatMode(cfg, jid) {
    const chat = getChatConfig(cfg, jid);

    return chat?.mode === 'chat'
        ? 'chat'
        : 'owner';
}

function getOwnerNumber() {
    try {
        const number = String(
            config.OWNER_NUMBER || ''
        ).replace(/\D/g, '');

        if (number) {
            return number;
        }
    } catch {}

    return '';
}

function getOwnerJid() {
    const number = getOwnerNumber();

    if (!number) {
        return null;
    }

    return `${number}@s.whatsapp.net`;
}

async function getChatName(jid) {
    if (!jid) {
        return 'Unknown chat';
    }

    if (jid.endsWith('@g.us')) {
        try {
            const metadata = await _sock.groupMetadata(jid);

            return metadata?.subject ||
                jid.split('@')[0];
        } catch {
            return jid.split('@')[0];
        }
    }

    return 'Private chat';
}

async function getSenderName(original) {
    try {
        const chat = cleanJid(
            original.key.remoteJid || ''
        );

        const participant = cleanJid(
            original.key.participant ||
            original.key.remoteJid ||
            ''
        );

        if (original.key.fromMe) {
            return 'You';
        }

        const name = await resolveDisplay(
            _sock,
            chat,
            participant
        );

        if (name) {
            return name;
        }

        return participant
            .split('@')[0]
            .split(':')[0];

    } catch {
        return (
            original.key.participant ||
            original.key.remoteJid ||
            'Unknown'
        )
            .split('@')[0]
            .split(':')[0];
    }
}

function getText(content) {
    if (!content) return null;

    return (
        content.conversation ||
        content.extendedTextMessage?.text ||
        content.imageMessage?.caption ||
        content.videoMessage?.caption ||
        content.documentMessage?.caption ||
        content.buttonsResponseMessage?.selectedDisplayText ||
        content.listResponseMessage?.title ||
        content.templateButtonReplyMessage?.selectedDisplayText ||
        null
    );
}

function getMediaType(content) {
    if (!content) return null;

    if (content.imageMessage) return 'image';
    if (content.videoMessage) return 'video';
    if (content.audioMessage) return 'audio';
    if (content.stickerMessage) return 'sticker';
    if (content.documentMessage) return 'document';

    return null;
}

function buildHeader(sender, chatName) {
    return (
        `🗑️ *Anti Delete*\n\n` +
        `👤 From: ${sender}\n` +
        `💬 Chat: ${chatName}\n`
    );
}

async function sendRecoveredMessage(
    destination,
    original,
    content,
    sender,
    chatName
) {
    const header = buildHeader(
        sender,
        chatName
    );

    const text = getText(content);

    if (text) {
        await _sock.sendMessage(
            destination,
            {
                text:
                    `${header}\n` +
                    `📝 Message:\n${text}`
            }
        );

        return;
    }

    const mediaType = getMediaType(content);

    if (!mediaType) {
        await _sock.sendMessage(
            destination,
            {
                text:
                    `${header}\n` +
                    `⚠️ Unsupported deleted message type.`
            }
        );

        return;
    }

    let buffer;

    try {
        buffer = await downloadMediaMessage(
            {
                key: original.key,
                message: content
            },
            'buffer',
            {},
            {
                logger: console,
                reuploadRequest: _sock.updateMediaMessage
            }
        );
    } catch (error) {
        console.log(
            '[ANTIDELETE] Media download error:',
            error.message
        );

        await _sock.sendMessage(
            destination,
            {
                text:
                    `${header}\n\n` +
                    `⚠️ Media could not be recovered.`
            }
        );

        return;
    }

    if (!buffer || !buffer.length) {
        await _sock.sendMessage(
            destination,
            {
                text:
                    `${header}\n\n` +
                    `⚠️ Media buffer is empty.`
            }
        );

        return;
    }

    if (mediaType === 'image') {
        await _sock.sendMessage(
            destination,
            {
                image: buffer,
                caption: header
            }
        );

        return;
    }

    if (mediaType === 'video') {
        await _sock.sendMessage(
            destination,
            {
                video: buffer,
                caption: header,
                mimetype:
                    content.videoMessage?.mimetype ||
                    'video/mp4'
            }
        );

        return;
    }

    if (mediaType === 'audio') {
        await _sock.sendMessage(
            destination,
            {
                audio: buffer,
                mimetype:
                    content.audioMessage?.mimetype ||
                    'audio/ogg; codecs=opus',
                ptt: !!content.audioMessage?.ptt
            }
        );

        return;
    }

    if (mediaType === 'sticker') {
        await _sock.sendMessage(
            destination,
            {
                sticker: buffer
            }
        );

        return;
    }

    if (mediaType === 'document') {
        await _sock.sendMessage(
            destination,
            {
                document: buffer,
                mimetype:
                    content.documentMessage?.mimetype ||
                    'application/octet-stream',
                fileName:
                    content.documentMessage?.fileName ||
                    'deleted-file'
            }
        );
    }
}

async function handleDeletedMessage(
    deletedKey
) {
    try {
        if (!deletedKey?.id) {
            return;
        }

        const id = deletedKey.id;

        if (!markRevoked(id)) {
            return;
        }

        const original = _store.get(id);

        if (!original) {
            console.log(
                `[ANTIDELETE] Message not found in cache: ${id}`
            );
            return;
        }

        _store.delete(id);

        const chatJid = cleanJid(
            original.msg.key.remoteJid ||
            deletedKey.remoteJid ||
            ''
        );

        if (!chatJid || chatJid === 'status@broadcast') {
            return;
        }

        if (!isChatEnabled(chatJid)) {
            return;
        }

        if (isBotDeleted(id)) {
            return;
        }

        const cfg = getConfig();

        const mode = getChatMode(
            cfg,
            chatJid
        );

        const destination =
            mode === 'chat'
                ? chatJid
                : getOwnerJid();

        if (!destination) {
            console.log(
                '[ANTIDELETE] OWNER_NUMBER is not configured.'
            );
            return;
        }

        const sender = await getSenderName(
            original.msg
        );

        const chatName = await getChatName(
            chatJid
        );

        console.log(
            `[ANTIDELETE] Recovering ${id} → ${destination}`
        );

        await sendRecoveredMessage(
            destination,
            original.msg,
            original.content,
            sender,
            chatName
        );

    } catch (error) {
        console.log(
            '[ANTIDELETE] Recovery error:',
            error.message
        );
    }
}

function extractDeletedKey(update) {
    if (!update) {
        return null;
    }

    const message =
        update.update?.message ||
        update.message ||
        null;

    const protocol =
        message?.protocolMessage ||
        update.update?.protocolMessage ||
        update.protocolMessage ||
        null;

    if (!protocol) {
        return null;
    }

    const type = protocol.type;

    /*
     * WhatsApp revoke/delete:
     * REVOKE = 0
     */
    if (
        type !== 0 &&
        type !== '0' &&
        String(type).toUpperCase() !== 'REVOKE'
    ) {
        return null;
    }

    return protocol.key || null;
}

function registerListeners(sock) {
    if (!sock || _registered.has(sock)) {
        return;
    }

    _registered.add(sock);

    _sock = sock;

    sock.ev.on(
        'messages.upsert',
        ({ messages = [] }) => {
            for (const message of messages) {
                try {
                    if (!message?.key?.id) {
                        continue;
                    }

                    if (
                        message.key.remoteJid ===
                        'status@broadcast'
                    ) {
                        continue;
                    }

                    /*
                     * Never store revoke protocol messages.
                     */
                    if (
                        message.message?.protocolMessage
                    ) {
                        continue;
                    }

                    if (!message.message) {
                        continue;
                    }

                    addToStore(message);
                } catch (error) {
                    console.log(
                        '[ANTIDELETE] Store error:',
                        error.message
                    );
                }
            }

            cleanupStore();
        }
    );

    sock.ev.on(
        'messages.update',
        async updates => {
            for (const update of updates || []) {
                try {
                    const deletedKey =
                        extractDeletedKey(update);

                    if (deletedKey) {
                        await handleDeletedMessage(
                            deletedKey
                        );
                    }
                } catch (error) {
                    console.log(
                        '[ANTIDELETE] Update error:',
                        error.message
                    );
                }
            }

            cleanupStore();
        }
    );

    console.log(
        '[ANTIDELETE] Listener registered'
    );
}

async function initAntidelete(sock) {
    _sock = sock;

    registerListeners(sock);

    return Promise.resolve();
}

async function antideleteStoreMessage(msg) {
    if (msg?.message) {
        addToStore(msg);
    }
}

async function antideleteHandleUpdate(update) {
    const deletedKey =
        extractDeletedKey(update);

    if (deletedKey) {
        await handleDeletedMessage(
            deletedKey
        );
    }
}

function updateAntideleteSock(sock) {
    _sock = sock;

    registerListeners(sock);
}

module.exports = {
    initAntidelete,
    antideleteStoreMessage,
    antideleteHandleUpdate,
    updateAntideleteSock,

    name: 'antidelete',

    aliases: [
        'antidel'
    ],

    description:
        'Recover deleted messages',

    category: 'owner',

    async execute(
        sock,
        msg,
        args,
        prefix,
        extra = {}
    ) {
        const jid =
            msg.key.remoteJid;

        try {
            await sock.sendMessage(
                jid,
                {
                    react: {
                        text: '🗑️',
                        key: msg.key
                    }
                }
            );
        } catch {}

        const isOwner =
            extra?.isOwnerUser === true;

        const isSudo =
            extra?.isSudoUser === true;

        if (!isOwner && !isSudo) {
            return sock.sendMessage(
                jid,
                {
                    text:
                        '❌ *Owner/Sudo only*\n\n' +
                        'You do not have permission to configure Anti Delete.'
                },
                { quoted: msg }
            );
        }

        const action =
            String(args?.[0] || 'status')
                .toLowerCase();

        const option =
            String(args?.[1] || '')
                .toLowerCase();

        const cfg = getConfig();

        if (action === 'status') {
            const chat =
                getChatConfig(
                    cfg,
                    jid
                );

            return sock.sendMessage(
                jid,
                {
                    text:
                        `🗑️ *Anti Delete*\n\n` +
                        `Status: ${
                            cfg.global ||
                            chat?.enabled
                                ? '✅ ON'
                                : '❌ OFF'
                        }\n` +
                        `Mode: ${
                            chat?.mode ||
                            'owner'
                        }\n` +
                        `Cached: ${_store.size} messages\n\n` +
                        `Usage:\n` +
                        `${prefix}antidelete on\n` +
                        `${prefix}antidelete off\n` +
                        `${prefix}antidelete on chat\n` +
                        `${prefix}antidelete on owner\n` +
                        `${prefix}antidelete mode chat\n` +
                        `${prefix}antidelete mode owner\n` +
                        `${prefix}antidelete on all\n` +
                        `${prefix}antidelete off all`
                },
                { quoted: msg }
            );
        }

        if (
            action === 'on' ||
            action === 'off'
        ) {
            const enabled =
                action === 'on';

            if (option === 'all') {
                cfg.global = enabled;

                set(
                    'antidelete',
                    cfg
                );

                return sock.sendMessage(
                    jid,
                    {
                        text:
                            `🗑️ *Anti Delete*\n\n` +
                            `Global: ${
                                enabled
                                    ? '✅ Enabled'
                                    : '❌ Disabled'
                            }`
                    },
                    { quoted: msg }
                );
            }

            cfg.chats = cfg.chats || {};

            if (!enabled) {
                delete cfg.chats[jid];
            } else {
                cfg.chats[jid] = {
                    enabled: true,
                    mode:
                        option === 'chat'
                            ? 'chat'
                            : 'owner'
                };
            }

            set(
                'antidelete',
                cfg
            );

            const current =
                getChatConfig(
                    cfg,
                    jid
                );

            return sock.sendMessage(
                jid,
                {
                    text:
                        `🗑️ *Anti Delete*\n\n` +
                        `Status: ${
                            enabled
                                ? '✅ Enabled'
                                : '❌ Disabled'
                        }` +
                        (
                            enabled
                                ? `\nMode: ${current?.mode || 'owner'}`
                                : ''
                        )
                },
                { quoted: msg }
            );
        }

        if (
            action === 'mode' &&
            (
                option === 'chat' ||
                option === 'owner'
            )
        ) {
            cfg.chats = cfg.chats || {};

            const current =
                getChatConfig(
                    cfg,
                    jid
                ) || {
                    enabled: false
                };

            cfg.chats[jid] = {
                ...current,
                enabled: true,
                mode: option
            };

            set(
                'antidelete',
                cfg
            );

            return sock.sendMessage(
                jid,
                {
                    text:
                        `🗑️ *Anti Delete*\n\n` +
                        `Mode: *${option}*\n` +
                        (
                            option === 'chat'
                                ? 'Deleted messages will be recovered in this chat.'
                                : 'Deleted messages will be forwarded to the owner.'
                        )
                },
                { quoted: msg }
            );
        }

        return sock.sendMessage(
            jid,
            {
                text:
                    `🗑️ *Anti Delete*\n\n` +
                    `Use:\n` +
                    `${prefix}antidelete on\n` +
                    `${prefix}antidelete off\n` +
                    `${prefix}antidelete on chat\n` +
                    `${prefix}antidelete on owner\n` +
                    `${prefix}antidelete mode chat\n` +
                    `${prefix}antidelete mode owner`
            },
            { quoted: msg }
        );
    }
};
