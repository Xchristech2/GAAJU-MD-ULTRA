/**
   * GAAJU-MD — Settings / Config Store
   * Lightweight JSON-file persistence. No native modules needed.
   * Stores all bot settings in data/config.json
   */
  const fs   = require('fs');
  const path = require('path');

  const DATA_DIR  = path.join(__dirname, '../data');
  const DB_FILE   = path.join(DATA_DIR, 'config.json');
  const WARN_FILE = path.join(DATA_DIR, 'warnings.json');

  // ── In-memory cache — prevents repeated disk reads on every getConfig call ──
  let _configCache   = null;
  let _configCacheTs = 0;
  const CONFIG_CACHE_TTL = 5000; // 5 seconds

  function _ensureDir() {
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  function _load(file) {
      try {
          if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
      } catch {}
      return {};
  }

  function _loadCached() {
      const now = Date.now();
      if (_configCache && now - _configCacheTs < CONFIG_CACHE_TTL) return _configCache;
      _configCache = _load(DB_FILE);
      _configCacheTs = now;
      return _configCache;
  }

  function _invalidateCache() {
      _configCache = null;
      _configCacheTs = 0;
  }

  function _save(file, data) {
      _ensureDir();
      fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  }

  // ── Init ─────────────────────────────────────────────────────────────────────
  async function initTables() { _ensureDir(); }

  // ── Legacy compat: getClient() called by index.js before useSQLiteAuthState ──
  // authState.js ignores the value; stub is enough.
  function getClient() {
      return { db: null, type: 'json-file' };
  }

  // ── Config (settings) ────────────────────────────────────────────────────────
  async function getConfig(key, defaultValue) {
      const data = _loadCached();
      return key in data ? data[key] : (defaultValue !== undefined ? defaultValue : null);
  }

  async function setConfig(key, value) {
      const data = _load(DB_FILE);
      data[key] = value;
      _save(DB_FILE, data);
      _configCache = data;
      _configCacheTs = Date.now();
      return true;
  }

  async function getAllConfig() {
      return _loadCached();
  }

  async function deleteConfig(key) {
      const data = _load(DB_FILE);
      delete data[key];
      _save(DB_FILE, data);
      _invalidateCache();
      return true;
  }

  // ── Bot ID helpers (called in index.js after sock connects) ──────────────────
  function setConfigBotId(jid) {
      const data = _load(DB_FILE);
      data['botId'] = jid;
      _save(DB_FILE, data);
      _configCache = data;
      _configCacheTs = Date.now();
  }

  function getConfigBotId() {
      return _loadCached()['botId'] || null;
  }

  // ── Warnings ─────────────────────────────────────────────────────────────────
  async function getWarnings(jid) {
      const data = _load(WARN_FILE);
      return data[jid] || 0;
  }

  async function addWarning(jid) {
      const data = _load(WARN_FILE);
      data[jid] = (data[jid] || 0) + 1;
      _save(WARN_FILE, data);
      return data[jid];
  }

  async function removeWarning(jid) {
      const data = _load(WARN_FILE);
      delete data[jid];
      _save(WARN_FILE, data);
      return true;
  }

  async function getAllWarnings() {
      return _load(WARN_FILE);
  }

  // ── Migration helper ──────────────────────────────────────────────────────────
  async function migrateJSONToConfig(jsonFile, configKey) {
      try {
          const existing = await getConfig(configKey, null);
          if (existing !== null) return;
          if (!fs.existsSync(jsonFile)) return;
          const data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
          await setConfig(configKey, data);
      } catch {}
  }

  module.exports = {
      initTables,
      getClient,
      setConfigBotId, getConfigBotId,
      getConfig, setConfig, getAllConfig, deleteConfig,
      getWarnings, addWarning, removeWarning, getAllWarnings,
      migrateJSONToConfig,
  };
  