'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');
const SETTINGS_FILE = path.join(DATA_DIR, 'autochat.json');

const settings = {
  group: false,
  private: false
};

const conversations = new Map();
const lastReplies = new Map();

const BOT_PERSONA = `
You are GAAJU-MD-ULTRA, a friendly Nigerian WhatsApp assistant.
Chat naturally and casually.
Understand Nigerian English and Pidgin.
Keep replies relevant and reasonably short.
Do not claim to have performed actions you cannot perform.
`;

function loadSettings() {
  try {
    if (!fs.existsSync(SETTINGS_FILE)) return;

    const data = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));

    settings.group = data.group === true;
    settings.private = data.private === true;
  } catch (error) {
    console.error('[AUTOCHAT] Settings load error:', error.message);
  }
}

function saveSettings() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(
      SETTINGS_FILE,
      JSON.stringify(settings, null, 2)
    );
    return true;
  } catch (error) {
    console.error('[AUTOCHAT] Settings save error:', error.message);
    return false;
  }
}

loadSettings();

function getMessageText(message) {
  if (!message) return '';

  const m =
    message.ephemeralMessage?.message ||
    message.viewOnceMessage?.message ||
    message.viewOnceMessageV2?.message ||
    message;

  return (
    m.conversation ||
    m.extendedTextMessage?.text ||
    m.imageMessage?.caption ||
    m.videoMessage?.caption ||
    m.documentMessage?.caption ||
    ''
  ).trim();
}

function getMessageType(message) {
  const jid = message?.key?.remoteJid || '';

  if (jid.endsWith('@g.us')) return 'group';
  if (jid.endsWith('@s.whatsapp.net')) return 'private';

  return null;
}

function getPrefix() {
  try {
    const config = require('../../config');

    if (typeof config.PREFIX === 'string') return config.PREFIX;
    if (typeof config.prefix === 'string') return config.prefix;
  } catch {}

  return '+';
}

function isCommand(text) {
  const prefix = getPrefix();

  if (!prefix) return false;

  return text.startsWith(prefix);
}

function getBotNumber(sock) {
  return sock.user?.id?.split(':')[0]?.split('@')[0] || '';
}

function wasBotMentioned(message, botNumber) {
  const context =
    message?.message?.extendedTextMessage?.contextInfo ||
    message?.message?.imageMessage?.contextInfo ||
    message?.message?.videoMessage?.contextInfo;

  const mentioned = context?.mentionedJid || [];

  return mentioned.some(jid => jid.split('@')[0].split(':')[0] === botNumber);
}

function getHistory(chatId) {
  if (!conversations.has(chatId)) {
    conversations.set(chatId, []);
  }

  return conversations.get(chatId);
}

async function askAI(chatId, userText) {
  const history = getHistory(chatId);

  const prompt = [
    BOT_PERSONA,
    ...history.map(item =>
      `${item.role === 'user' ? 'User' : 'Assistant'}: ${item.text}`
    ),
    `User: ${userText}`,
    'Assistant:'
  ].join('\n\n');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(
      'https://text.pollinations.ai/' +
      encodeURIComponent(prompt) +
      '?model=openai',
      {
        method: 'GET',
        signal: controller.signal,
        headers: { Accept: 'text/plain' }
      }
    );

    if (!response.ok) {
      throw new Error(`AI service returned HTTP ${response.status}`);
    }

    const answer = (await response.text()).trim();

    if (!answer) {
      throw new Error('AI returned an empty response');
    }

    history.push({ role: 'user', text: userText });
    history.push({ role: 'assistant', text: answer });

    if (history.length > 12) {
      history.splice(0, history.length - 12);
    }

    return answer.slice(0, 4000);
  } finally {
    clearTimeout(timeout);
  }
}

async function handleAutoChatMessage(sock, msg) {
  try {
    if (!msg?.message || msg.key?.fromMe) return;
    if (msg.key?.remoteJid === 'status@broadcast') return;

    const chatId = msg.key?.remoteJid;
    if (!chatId || chatId.endsWith('@newsletter')) return;

    const type = getMessageType(msg);
    if (!type || !settings[type]) return;

    const text = getMessageText(msg.message);
    if (!text || isCommand(text)) return;

    const botNumber = getBotNumber(sock);

    if (type === 'group' && wasBotMentioned(msg, botNumber)) {
      // Let the existing mention/chatbot handler respond.
      return;
    }

    const now = Date.now();
    const last = lastReplies.get(chatId) || 0;

    if (now - last < 4000) return;

    lastReplies.set(chatId, now);

    const answer = await askAI(chatId, text);

    await sock.sendMessage(
      chatId,
      { text: answer },
      { quoted: msg }
    );
  } catch (error) {
    console.error('[AUTOCHAT] Message error:', error.message);
  }
}

const autochatCommand = {
  name: 'autochat',
  aliases: ['ac'],
  description: 'Enable or disable automatic AI chat',
  category: 'ai',

  async execute(sock, msg, args) {
    const chatId = msg.key?.remoteJid;
    const sender = msg.key?.participant || chatId;

    const text = args
      .map(arg => String(arg))
      .join(' ')
      .trim()
      .toLowerCase();

    const reply = async message => {
      await sock.sendMessage(
        chatId,
        { text: message },
        { quoted: msg }
      );
    };

    if (text === 'status') {
      return reply(
        `AutoChat status\nGroup: ${settings.group ? 'ON' : 'OFF'}\nPrivate: ${settings.private ? 'ON' : 'OFF'}`
      );
    }

    const match = text.match(/^(group|private|dm)\s+(on|off)$/);

    if (!match) {
      return reply(
        'Usage:\n.autochat group on\n.autochat group off\n.autochat private on\n.autochat private off\n.autochat dm on\n.autochat dm off\n.autochat status'
      );
    }

    let target = match[1];
    const value = match[2] === 'on';

    if (target === 'dm') target = 'private';

    let isOwner = false;

    try {
      const config = require('../../config');
      const ownerNumbers = [
        config.OWNER_NUMBER,
        config.ownerNumber,
        config.OWNER,
        config.owner
      ].flat().filter(Boolean).map(number =>
        String(number).replace(/\D/g, '')
      );

      const senderNumber = sender.split('@')[0].split(':')[0]
        .replace(/\D/g, '');

      isOwner = ownerNumbers.includes(senderNumber);
    } catch {}

    if (!isOwner) {
      return reply('Only the bot owner can change global AutoChat settings.');
    }

    settings[target] = value;

    if (!saveSettings()) {
      return reply('Could not save AutoChat settings. Check file permissions.');
    }

    return reply(
      `AutoChat ${target}: ${value ? 'ON' : 'OFF'}`
    );
  }
};
