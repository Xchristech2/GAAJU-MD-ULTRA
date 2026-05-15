'use strict';

const REPEAT_LIMIT   = 4;
const WINDOW_MS      = 60 * 1000;

if (!globalThis._antispamTracker) globalThis._antispamTracker = new Map();

function _getGroupConfig(jid) {
    const cfg = globalThis._antispamConfig || {};
    return (cfg.groups && cfg.groups[jid]) || null;
}

function isEnabled(jid) {
    const grp = _getGroupConfig(jid);
    if (grp !== null) return !!grp.enabled;
    const cfg = globalThis._antispamConfig || {};
    return !!cfg.enabled;
}

function getAction(jid) {
    const grp = _getGroupConfig(jid);
    if (grp && grp.action) return grp.action;
    const cfg = globalThis._antispamConfig || {};
    return cfg.action || 'warn';
}

function checkSpam(jid, senderJid, text) {
    if (!jid || !senderJid || !text) return false;
    const key  = `${jid}::${senderJid}`;
    const now  = Date.now();
    const prev = globalThis._antispamTracker.get(key);

    if (prev && prev.text === text && (now - prev.ts) < WINDOW_MS) {
        prev.count += 1;
        prev.ts = now;
        globalThis._antispamTracker.set(key, prev);
        return prev.count >= REPEAT_LIMIT;
    }

    globalThis._antispamTracker.set(key, { text, count: 1, ts: now });
    return false;
}

module.exports = { isEnabled, getAction, checkSpam };
