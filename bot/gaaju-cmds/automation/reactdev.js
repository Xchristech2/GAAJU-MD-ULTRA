const fs = require('fs');
const path = require('path');
const axios = require('axios');
const config = require('../../config');

const CONFIG_FILE = path.join(__dirname, '../../reactdev.json');
const DEFAULT_REFRESH_MINUTES = 10;
const reactedMessages = new Set();

let developerNumbers = new Set();
let reactionEmoji = config.REACTDEV_EMOJI || '🔥';
let lastRefresh = 0;

function normalizeNumber(value) {
  return String(value || '').replace(/\D/g, '');
}

function readLocalConfig() {
  try {
    const fileConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    return fileConfig && typeof fileConfig === 'object' ? fileConfig : {};
  } catch {
    return {};
  }
}

function extractNumbers(data) {
  if (Array.isArray(data)) return data.map(normalizeNumber).filter(Boolean);

  const values = [
    ...(Array.isArray(data?.numbers) ? data.numbers : []),
    ...(Array.isArray(data?.developers) ? data.developers : []),
    ...(Array.isArray(data?.developerNumbers) ? data.developerNumbers : [])
  ];

  return values.map(value => normalizeNumber(typeof value === 'object' ? value.number : value)).filter(Boolean);
}

async function refreshDeveloperConfig(force = false) {
  const local = readLocalConfig();
  const refreshMinutes = Number(local.refreshMinutes || DEFAULT_REFRESH_MINUTES);

  if (!force && Date.now() - lastRefresh < refreshMinutes * 60 * 1000) return;

  const localNumbers = [
    ...extractNumbers(local),
    ...(Array.isArray(config.REACTDEV_NUMBERS) ? config.REACTDEV_NUMBERS : []),
    ...(Array.isArray(config.CREATORS) ? config.CREATORS : [])
  ].map(normalizeNumber).filter(Boolean);

  developerNumbers = new Set(localNumbers);
  if (local.emoji) reactionEmoji = String(local.emoji);

  const remoteUrl = String(local.url || config.REACTDEV_CONFIG_URL || '').trim();
  if (remoteUrl) {
    try {
      const response = await axios.get(remoteUrl, { timeout: 8000 });
      const remoteNumbers = extractNumbers(response.data);
      if (remoteNumbers.length) developerNumbers = new Set(remoteNumbers);
      if (response.data?.emoji) reactionEmoji = String(response.data.emoji);
    } catch {}
  }

  lastRefresh = Date.now();
}

function senderNumber(msg) {
  const jid = msg?.key?.participant || msg?.key?.remoteJid || '';
  const raw = jid.split('@')[0].split(':')[0];
  const direct = normalizeNumber(raw);
  if (direct && !jid.includes('@lid')) return direct;

  const resolved = global.resolvePhoneFromLid?.(jid) || global.lidPhoneCache?.get(raw);
  return normalizeNumber(resolved || raw);
}

async function handleReactDev(sock, msg) {
  try {
    if (!msg?.key?.id || !msg.message) return;
    if (msg.key.fromMe) return;

    const remoteJid = msg.key.remoteJid || '';
    if (!remoteJid || remoteJid === 'status@broadcast') return;

    const message = msg.message;
    if (message.reactionMessage || message.protocolMessage || message.senderKeyDistributionMessage) return;

    await refreshDeveloperConfig();
    const sender = senderNumber(msg);
    if (!developerNumbers.has(sender)) return;
    if (reactedMessages.has(msg.key.id)) return;

    console.log(`[REACTDEV] developer text detected from ${sender} in ${remoteJid}; reacting with ${reactionEmoji}`);

    reactedMessages.add(msg.key.id);
    if (reactedMessages.size > 500) {
      reactedMessages.delete(reactedMessages.values().next().value);
    }

    await sock.sendMessage(remoteJid, {
      react: { text: reactionEmoji, key: msg.key }
    });
    console.log(`[REACTDEV] reaction sent for ${msg.key.id}`);
  } catch (error) {
    console.warn(`[REACTDEV] reaction failed: ${error?.message || error}`);
  }
}

refreshDeveloperConfig(true).catch(() => {});

module.exports = { handleReactDev };
