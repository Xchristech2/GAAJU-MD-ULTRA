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
    return fileConfig && typeof fileConfig === 'object'
      ? fileConfig
      : {};
  } catch {
    return {};
  }
}

function extractNumbers(data) {
  if (Array.isArray(data)) {
    return data.map(normalizeNumber).filter(Boolean);
  }

  const values = [
    ...(Array.isArray(data?.numbers) ? data.numbers : []),
    ...(Array.isArray(data?.developers) ? data.developers : []),
    ...(Array.isArray(data?.developerNumbers)
      ? data.developerNumbers
      : [])
  ];

  return values
    .map(value =>
      normalizeNumber(
        typeof value === 'object' ? value.number : value
      )
    )
    .filter(Boolean);
}

async function refreshDeveloperConfig(force = false) {
  const local = readLocalConfig();
  const refreshMinutes = Number(
    local.refreshMinutes || DEFAULT_REFRESH_MINUTES
  );

  if (
    !force &&
    Date.now() - lastRefresh < refreshMinutes * 60 * 1000
  ) {
    return;
  }

  const localNumbers = [
    ...extractNumbers(local),
    ...(Array.isArray(config.REACTDEV_NUMBERS)
      ? config.REACTDEV_NUMBERS
      : []),
    ...(Array.isArray(config.CREATORS)
      ? config.CREATORS
      : [])
  ]
    .map(normalizeNumber)
    .filter(Boolean);

  developerNumbers = new Set(localNumbers);

  if (local.emoji) {
    reactionEmoji = String(local.emoji);
  }

  const remoteUrl = String(
    local.url || config.REACTDEV_CONFIG_URL || ''
  ).trim();

  if (remoteUrl) {
    try {
      const response = await axios.get(remoteUrl, {
        timeout: 8000
      });

      const remoteNumbers = extractNumbers(response.data);

      if (remoteNumbers.length) {
        developerNumbers = new Set(remoteNumbers);
      }

      if (response.data?.emoji) {
        reactionEmoji = String(response.data.emoji);
      }
    } catch (error) {
      console.warn(
        '[REACTDEV] Remote config refresh failed:',
        error.message
      );
    }
  }

  lastRefresh = Date.now();
}

function senderNumber(msg) {
  const jid =
    msg?.key?.participant ||
    msg?.key?.remoteJid ||
    '';

  const raw = jid.split('@')[0].split(':')[0];
  const direct = normalizeNumber(raw);

  if (direct && !jid.includes('@lid')) {
    return direct;
  }

  const resolved =
    global.resolvePhoneFromLid?.(jid) ||
    global.lidPhoneCache?.get(raw);

  return normalizeNumber(resolved || raw);
}

async function handleReactDev(sock, msg) {
  try {
    if (!msg?.key?.id || !msg.message) return;

    // Ignore messages sent by the bot itself.
    if (msg.key.fromMe) return;

    const remoteJid = msg.key.remoteJid || '';

    if (!remoteJid || remoteJid === 'status@broadcast') {
      return;
    }

    // IMPORTANT:
    // Ignore all private DMs.
    // ReactDev works only in WhatsApp groups.
    if (!remoteJid.endsWith('@g.us')) {
      return;
    }

    const message = msg.message;

    // Ignore reaction and protocol messages.
    if (
      message.reactionMessage ||
      message.protocolMessage ||
      message.senderKeyDistributionMessage
    ) {
      return;
    }

    await refreshDeveloperConfig();

    const sender = senderNumber(msg);

    // Only react to registered developers.
    if (!developerNumbers.has(sender)) {
      return;
    }

    // Prevent reacting to the same message twice.
    const messageKey = `${remoteJid}:${msg.key.id}`;

    if (reactedMessages.has(messageKey)) {
      return;
    }

    console.log(
      `[REACTDEV] Developer message detected from ${sender} ` +
      `in group ${remoteJid}; reacting with ${reactionEmoji}`
    );

    await sock.sendMessage(remoteJid, {
      react: {
        text: reactionEmoji,
        key: msg.key
      }
    });

    reactedMessages.add(messageKey);

    if (reactedMessages.size > 500) {
      reactedMessages.delete(
        reactedMessages.values().next().value
      );
    }

    console.log(
      `[REACTDEV] Group reaction sent for ${msg.key.id}`
    );
  } catch (error) {
    console.warn(
      `[REACTDEV] Reaction failed: ${error?.message || error}`
    );
  }
}

refreshDeveloperConfig(true).catch(() => {});

module.exports = { handleReactDev };
