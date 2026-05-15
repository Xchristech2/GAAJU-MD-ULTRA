const fs   = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '../.botname.json');

function getBotName() {
    try {
        if (fs.existsSync(FILE)) {
            const d = JSON.parse(fs.readFileSync(FILE, 'utf8'));
            if (d.name) return d.name;
        }
    } catch (_) {}
    return 'GAAJU-MD ULTRA';
}

function setBotName(name) {
    fs.writeFileSync(FILE, JSON.stringify({ name }), 'utf8');
}

function clearBotNameCache() {}

module.exports = { getBotName, setBotName, clearBotNameCache };
