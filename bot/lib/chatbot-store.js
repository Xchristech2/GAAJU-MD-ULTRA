'use strict';
const fs   = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '../data/chatbot.json');

function load() {
    try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch { return {}; }
}
function save(d) {
    try { fs.mkdirSync(path.dirname(FILE), { recursive: true }); fs.writeFileSync(FILE, JSON.stringify(d, null, 2)); } catch {}
}

// enabled: boolean  |  mode: 'all' | 'mention'
function isEnabled(chatId)          { return load()[chatId]?.enabled === true; }
function getMode(chatId)            { return load()[chatId]?.mode || 'all'; }

function setEnabled(chatId, val, mode) {
    const d = load();
    if (!d[chatId]) d[chatId] = {};
    d[chatId].enabled = !!val;
    if (mode) d[chatId].mode = mode;
    save(d);
}

function listEnabled() {
    const d = load();
    return Object.entries(d)
        .filter(([, v]) => v?.enabled === true)
        .map(([chatId, v]) => ({ chatId, mode: v.mode || 'all' }));
}

module.exports = { isEnabled, getMode, setEnabled, listEnabled };
