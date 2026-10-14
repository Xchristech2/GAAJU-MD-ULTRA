'use strict';

const { isEnabled, getMode, setEnabled, listEnabled } = require('../../lib/chatbot-store');
const { detectIntent, runIntent } = require('../../lib/ai-intent');
const cfg = require('../../config');

const BOT_PERSONA =
  `You are Gaaju AI, a witty, funny, and friendly WhatsApp assistant created by Xchristech2, also known as GAAJU ULTRA. ` +
  `Always reply in the same language the user writes in. ` +
  `Use relevant emojis naturally. Be humorous and playful while still being helpful. ` +
  `Keep replies concise unless the question needs more detail. ` +
  `If asked who made you, say Xchris Tech, also known as GAAJU ULTRA.`;

async function pollinationsReply(userText, timeoutMs = 25000) {
  const prompt = encodeURIComponent(
    `${BOT_PERSONA}\n\nUser: ${userText}\nGaaju AI:`
  );

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(
      `https://text.pollinations.ai/${prompt}?model=openai`,
      {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Gaaju/1.0',
          Accept: 'text/plain,*/*'
        }
      }
    );

    if (!res.ok) throw new Error(`AI HTTP ${res.status}`);

    const text = (await res.text()).trim();
    if (!text) throw new Error('Empty response from AI');

    return text;
  } finally {
    clearTimeout(timer);
  }
}

const lastReply = new Map();

function isRateLimited(chatId) {
  const last = lastReply.get(chatId) || 0;

  if (Date.now() - last < 5000) return true;

  lastReply.set(chatId, Date.now());
  return false;
}

function botWasMentioned(msg, sock) {
  const botNum = (sock.user?.id || '').split('@')[0].split(':')[0];
  const m = msg.message;

  const mentions =
    m?.extendedTextMessage?.contextInfo?.mentionedJid ||
    m?.imageMessage?.contextInfo?.mentionedJid ||
    m?.videoMessage?.contextInfo?.mentionedJid ||
    [];

  return mentions.some(
    jid => jid.split('@')[0].split(':')[0] === botNum
  );
}

function isChatbotActiveForChat(chatId) {
  return isEnabled(chatId);
}

async function handleChatbotMessage(sock, msg) {
  if (!msg?.message || msg.key?.fromMe) return;

  const chatId = msg.key?.remoteJid;
  if (!chatId || !isEnabled(chatId)) return;

  const isGroup = chatId.endsWith('@g.us');

  if (isGroup && getMode(chatId) === 'mention') {
    if (!botWasMentioned(msg, sock)) return;
  }

  const m = msg.message;

  const text = (
    m.conversation ||
    m.extendedTextMessage?.text ||
    m.imageMessage?.caption ||
    m.videoMessage?.caption ||
    ''
  ).trim();

  if (!text || isRateLimited(chatId)) return;

  try {
    const detected = detectIntent(text);

    if (detected && detected.args?.length) {
      const prefix = cfg.PREFIX || ',';
      const handled = await runIntent(sock, msg, detected, prefix, null);

      if (handled) return;
    }
  } catch {}

  try {
    try {
      await sock.sendMessage(chatId, {
        react: { text: '🤖', key: msg.key }
      });
    } catch {}

    const reply = await pollinationsReply(text);

    await sock.sendMessage(
      chatId,
      { text: `🤖 *GAAJU AI*\n\n${reply}` },
      { quoted: msg }
    );
  } catch (error) {
    console.error('[CHATBOT] Reply error:', error.message);
  }
}

async function senderIsAdmin(sock, msg, chatId) {
  if (!chatId.endsWith('@g.us')) return true;

  try {
    const senderJid = msg.key.participant || msg.key.remoteJid;
    const senderNum = senderJid.split('@')[0].split(':')[0];
    const meta = await sock.groupMetadata(chatId);

    const participant = meta.participants.find(p =>
      p.id.split('@')[0].split(':')[0] === senderNum
    );

    return (
      participant?.admin === 'admin' ||
      participant?.admin === 'superadmin'
    );
  } catch {
    return false;
  }
}

module.exports = [
  {
    name: 'chatbot',
    aliases: ['cb', 'autoai', 'gaajumode', 'aimode'],
    description: 'Toggle Gaaju AI automatic replies',
    category: 'ai',

    async execute(sock, msg, args, prefix, ctx) {
      const chatId = msg.key.remoteJid;
      const isGroup = chatId.endsWith('@g.us');
      const sub = (args[0] || '').toLowerCase();
      const modeArg = (args[1] || '').toLowerCase();

      const reply = text =>
        sock.sendMessage(chatId, { text }, { quoted: msg });

      if (sub === 'list') {
        if (!ctx?.isOwnerUser && !ctx?.isSudoUser) {
          return reply('❌ Only the bot owner or sudo can view the active chatbot list.');
        }

        const enabled = listEnabled();

        if (!enabled.length) {
          return reply('📋 No active chatbot conversations.');
        }

        const lines = enabled.map(({ chatId: cid, mode }) => {
          const label = cid.endsWith('@g.us') ? 'Group' : 'Private';
          return `• ${label}: ${cid.split('@')[0]} (${mode})`;
        });

        return reply(
          `📋 *Active chatbot conversations: ${enabled.length}*\n\n${lines.join('\n')}`
        );
      }

      if (!sub || sub === 'status') {
        const on = isEnabled(chatId);
        const mode = getMode(chatId);

        return reply(
          `🤖 *GAAJU AI MODE*\n\n` +
          `Status: ${on ? '✅ ON' : '❌ OFF'}\n` +
          `Mode: ${on ? mode : 'disabled'}\n\n` +
          `Usage:\n` +
          `${prefix}chatbot on\n` +
          `${prefix}chatbot on mention\n` +
          `${prefix}chatbot off\n` +
          `${prefix}chatbot status`
        );
      }

      if (sub === 'on' || sub === 'off') {
        const isOwnerOrSudo =
          ctx?.isOwnerUser || ctx?.isSudoUser;

        if (!isOwnerOrSudo) {
          if (!isGroup) {
            return reply('❌ Only the bot owner or sudo can change chatbot settings in private chats.');
          }

          const admin = await senderIsAdmin(sock, msg, chatId);

          if (!admin) {
            return reply('❌ Group admins, the bot owner, or sudo are required to change this setting.');
          }
        }

        if (sub === 'on') {
          const mode =
            isGroup && modeArg === 'mention' ? 'mention' : 'all';

          setEnabled(chatId, true, mode);

          const modeMessage = mode === 'mention'
            ? 'I will reply when you mention me.'
            : 'I will reply to messages in this chat.';

          return reply(
            `🤖 *GAAJU AI MODE*\n\n` +
            `Status: ✅ ON\n` +
            `Mode: ${mode}\n\n` +
            `${modeMessage}\n` +
            `You can send a message without a command prefix.`
          );
        }

        setEnabled(chatId, false);

        return reply(
          '🤖 *GAAJU AI MODE*\n\nStatus: ❌ OFF'
        );
      }

      return reply(
        `🤖 *GAAJU AI MODE*\n\n` +
        `${prefix}chatbot on — enable replies\n` +
        `${prefix}chatbot on mention — reply when mentioned\n` +
        `${prefix}chatbot off — disable replies\n` +
        `${prefix}chatbot status — check status\n` +
        `${prefix}chatbot list — list active chats`
      );
    }
  }
];

module.exports.isChatbotActiveForChat = isChatbotActiveForChat;
module.exports.handleChatbotMessage = handleChatbotMessage;
