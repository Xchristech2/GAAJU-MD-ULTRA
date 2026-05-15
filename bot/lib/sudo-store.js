/**
     * GAAJU-MD — Sudo / Owner Store
     * Persists sudo list and LID mappings in data/sudo.json
     */
    const fs   = require('fs');
    const path = require('path');
    const cfg  = require('../config');

    const DATA_DIR  = path.join(__dirname, '../data');
    const SUDO_FILE = path.join(DATA_DIR, 'sudo.json');

    let sudoSet = new Set();
    let _botId  = null;

    // LID ↔ phone mapping (persisted to disk)
    const lidMap   = new Map();  // lid → phone
    const phoneLid = new Map();  // phone → lid

    function _ensureDir() {
        if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    function _load() {
        try {
            if (fs.existsSync(SUDO_FILE)) {
                const d = JSON.parse(fs.readFileSync(SUDO_FILE, 'utf8'));
                // Load LID mappings if saved
                if (d.lidMappings && typeof d.lidMappings === 'object') {
                    for (const [lid, phone] of Object.entries(d.lidMappings)) {
                        if (lid && phone) {
                            lidMap.set(lid, phone);
                            phoneLid.set(phone, lid);
                        }
                    }
                }
                return Array.isArray(d.sudoers) ? d.sudoers : [];
            }
        } catch {}
        return [];
    }

    function _save() {
        _ensureDir();
        const ownerNum = (cfg.OWNER_NUMBER || '').replace(/[^0-9]/g, '');
        const toWrite  = [...sudoSet].filter(n => n !== ownerNum);
        // Persist LID→phone mappings so sudo LID users survive restarts
        const lidMappings = {};
        for (const [lid, phone] of lidMap) {
            if (phone && toWrite.includes(phone)) {
                lidMappings[lid] = phone;
            }
        }
        fs.writeFileSync(SUDO_FILE, JSON.stringify({ sudoers: toWrite, lidMappings }, null, 2), 'utf8');
    }

    async function initSudo(botId) {
        _botId = botId;
        // Load only explicitly added sudo users — owner access is handled separately
        // by isSudoNumber() which checks cfg.OWNER_NUMBER directly. Adding the owner
        // to sudoSet caused false-positive LID mappings granting others sudo access.
        const loaded = _load().filter(n => {
            const ownerNum = (cfg.OWNER_NUMBER || '').replace(/[^0-9]/g, '');
            return n !== ownerNum;
        });
        sudoSet = new Set(loaded);
    }

    function setBotId(id) { _botId = id; }

    function isSudoNumber(num) {
        if (!num) return false;
        const clean = String(num).replace(/[^0-9]/g, '');
        const ownerNum = (cfg.OWNER_NUMBER || '').replace(/[^0-9]/g, '');
        return clean === ownerNum || sudoSet.has(clean);
    }

    function isSudoJid(jid) {
        if (!jid) return false;
        const num = jid.split('@')[0].split(':')[0].replace(/[^0-9]/g, '');
        // For LID JIDs, also check via LID→phone mapping
        if (jid.includes('@lid') || (num && num.length > 15)) {
            const phone = lidMap.get(num);
            if (phone && isSudoNumber(phone)) return true;
        }
        return isSudoNumber(num);
    }

    function getSudoMode() {
        return (cfg.MODE || 'public').toLowerCase();
    }

    function addSudoNumber(num) {
        const clean = String(num).replace(/[^0-9]/g, '');
        sudoSet.add(clean);
        _save();
    }

    function addSudo(num, lid = null) {
        const clean = String(num).replace(/[^0-9]/g, '');
        if (!clean || clean.length < 7) return { success: false, number: clean, reason: 'Invalid number' };
        const ownerNum = (cfg.OWNER_NUMBER || '').replace(/[^0-9]/g, '');
        if (clean === ownerNum) return { success: false, number: clean, reason: 'Already the owner' };
        const alreadySudo = sudoSet.has(clean);
        sudoSet.add(clean);
        if (lid) mapLidToPhone(lid, clean);
        _save();
        if (alreadySudo) return { success: false, number: clean, reason: 'Already a sudo user' };
        return { success: true, number: clean };
    }

    function addSudoJid(jid) {
        const num = jid.split('@')[0].split(':')[0].replace(/[^0-9]/g, '');
        addSudoNumber(num);
    }

    function removeSudoNumber(num) {
        const clean = String(num).replace(/[^0-9]/g, '');
        sudoSet.delete(clean);
        phoneLid.forEach((lid, phone) => {
            if (phone === clean) {
                lidMap.delete(lid);
                phoneLid.delete(phone);
            }
        });
        _save();
    }

    function getSudoList() {
        const ownerNum = (cfg.OWNER_NUMBER || '').replace(/[^0-9]/g, '');
        return { sudoers: [...sudoSet].filter(n => n !== ownerNum) };
    }

    // LID helpers
    function mapLidToPhone(lid, phone) {
        if (!lid || !phone) return;
        lidMap.set(lid, phone);
        phoneLid.set(phone, lid);
        // Persist immediately so the mapping survives a restart
        try { _save(); } catch {}
    }

    function isSudoByLid(lid) {
        if (!lid) return false;
        const phone = lidMap.get(lid);
        return phone ? isSudoNumber(phone) : false;
    }
    function getPhoneFromLid(lid) { return lidMap.get(lid) || null; }
    function hasUnmappedSudos() { return false; }
    async function migrateSudoToSupabase() {}

    module.exports = {
        initSudo, setBotId,
        isSudoNumber, isSudoJid, getSudoMode,
        addSudo, addSudoNumber, addSudoJid, removeSudoNumber, getSudoList,
        mapLidToPhone, isSudoByLid, getPhoneFromLid, hasUnmappedSudos,
        migrateSudoToSupabase,
    };
  