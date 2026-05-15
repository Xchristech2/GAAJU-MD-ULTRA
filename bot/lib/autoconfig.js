const fs   = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '../data/autoconfig.json');

const DEFAULTS = {
    antidelete:          { enabled: false, mode: 'chat' },
    antideletestatus:    { enabled: false },
    autoviewstatus:      { enabled: false },
    autoreactstatus:     { enabled: false, emoji: '❤️' },
    autodownloadstatus:  { enabled: false },
    reactowner:          { enabled: false, emoji: '❤️' },
    reactdev:            { enabled: false, emoji: '🔥' },
    antigroupstatus:     { enabled: false },
    antistatusmention:   { enabled: false },
    antispam:            {},
};

function load() {
    try {
        return Object.assign({}, DEFAULTS, JSON.parse(fs.readFileSync(FILE, 'utf8')));
    } catch { return Object.assign({}, DEFAULTS); }
}

function save(data) {
    try { fs.writeFileSync(FILE, JSON.stringify(data, null, 2)); } catch {}
}

function get(key) { return (load()[key]) ?? DEFAULTS[key]; }

function set(key, value) {
    const data = load();
    data[key]  = value;
    save(data);
}

function toggle(key, field = 'enabled') {
    const data = load();
    if (!data[key]) data[key] = {};
    data[key][field] = !data[key][field];
    save(data);
    return data[key][field];
}

module.exports = { load, save, get, set, toggle };
