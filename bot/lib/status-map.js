'use strict';

const fs   = require('fs');
const path = require('path');

const MAP_FILE = path.join(__dirname, '..', 'data', 'status-msgmap.json');
const MAX_ENTRIES = 500;

let _map = null;

function _load() {
    if (_map) return _map;
    try {
        _map = JSON.parse(fs.readFileSync(MAP_FILE, 'utf8'));
    } catch {
        _map = {};
    }
    return _map;
}

function _save() {
    try {
        fs.mkdirSync(path.dirname(MAP_FILE), { recursive: true });
        fs.writeFileSync(MAP_FILE, JSON.stringify(_map), 'utf8');
    } catch {}
}

function _prune() {
    const keys = Object.keys(_map);
    if (keys.length > MAX_ENTRIES) {
        const toDelete = keys.slice(0, keys.length - MAX_ENTRIES);
        for (const k of toDelete) delete _map[k];
    }
}

/** Store msgId → senderPhone (called by auto-downloader after sendMessage) */
function storeStatusSender(msgId, senderPhone) {
    if (!msgId || !senderPhone) return;
    const m = _load();
    m[msgId] = senderPhone;
    _prune();
    _save();
}

/** Look up original poster's phone by the quoted message ID */
function getStatusSender(msgId) {
    if (!msgId) return null;
    return _load()[msgId] || null;
}

module.exports = { storeStatusSender, getStatusSender };
