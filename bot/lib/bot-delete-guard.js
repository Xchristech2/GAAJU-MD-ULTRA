/**
 * bot-delete-guard.js
 *
 * Shared registry of message IDs that the bot intentionally deleted
 * via protection features (antitag, antilink, antibug, etc.).
 *
 * Antidelete checks this before restoring a message — if the ID is here
 * it silently skips recovery so the delete actually sticks.
 *
 * IDs are auto-expired after 30 s to avoid the set growing unbounded.
 */

const _ids     = new Map();   // id → expireAt (ms)
const TTL_MS   = 30_000;

function registerBotDelete(msgId) {
    if (!msgId) return;
    _ids.set(msgId, Date.now() + TTL_MS);
}

function isBotDeleted(msgId) {
    if (!msgId) return false;
    const exp = _ids.get(msgId);
    if (!exp) return false;
    if (Date.now() > exp) { _ids.delete(msgId); return false; }
    return true;
}

/** Periodic cleanup — call from setInterval if desired */
function purgeExpired() {
    const now = Date.now();
    for (const [id, exp] of _ids) {
        if (now > exp) _ids.delete(id);
    }
}

module.exports = { registerBotDelete, isBotDeleted, purgeExpired };
