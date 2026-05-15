const { useMultiFileAuthState } = require('@whiskeysockets/baileys');

async function useSQLiteAuthState(rawDb, sessionDir) {
    const dir = sessionDir || './session';
    return useMultiFileAuthState(dir);
}

async function getSessionStats() { return {}; }

module.exports = { useSQLiteAuthState, getSessionStats };
