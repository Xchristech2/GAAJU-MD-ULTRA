'use strict';

const { getBotName } = require('../../lib/botname');

async function pollinationsAI(prompt, model = 'openai', timeoutMs = 30000) {
    const encoded = encodeURIComponent(prompt);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetch(`https://text.pollinations.ai/${encoded}?model=${model}`, {
            signal: controller.signal,
            headers: { 'User-Agent': 'Gaaju/1.0', Accept: 'text/plain,*/*' }
        });
        if (!res.ok) throw new Error(`AI HTTP ${res.status}`);
        const text = await res.text();
        if (!text?.trim()) throw new Error('No response from AI');
        return text.trim();
    } finally { clearTimeout(timer); }
}

function fmtReply(reply) {
    return reply.split('\n').map(l => `║ ${l}`).join('\n');
}

function makeModel({ name, aliases, description, model, label, emoji }) {
    return {
        name, aliases, description,
        category: 'ai',
        async execute(sock, msg, args, prefix) {
            const chatId  = msg.key.remoteJid;
            const botName = getBotName();
            const prompt  = args.join(' ').trim();

            if (!prompt) {
                return sock.sendMessage(chatId, {
                    text: `╔═|〔  ${emoji} ${label} 〕\n║\n║ ▸ *Usage*   : ${prefix}${name} <your question>\n║ ▸ *Example* : ${prefix}${name} explain quantum computing\n║\n╚═|〔 ${botName} 〕`
                }, { quoted: msg });
            }

            try {
                await sock.sendMessage(chatId, { react: { text: emoji, key: msg.key } });
                const reply = await pollinationsAI(prompt, model);
                await sock.sendMessage(chatId, {
                    text: `╔═|〔  ${emoji} ${label} 〕\n║\n${fmtReply(reply)}\n║\n╚═|〔 ${botName} 〕`
                }, { quoted: msg });
            } catch (e) {
                await sock.sendMessage(chatId, {
                    text: `╔═|〔  ${emoji} ${label} 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═|〔 ${botName} 〕`
                }, { quoted: msg });
            }
        }
    };
}

module.exports = [
    makeModel({ name: 'gpt',      aliases: ['chatgpt', 'gptai'],                      model: 'openai',   label: 'GPT AI',       emoji: '🧠' }),
    makeModel({ name: 'mistral',  aliases: ['mistralai'],                              model: 'mistral',  label: 'MISTRAL AI',   emoji: '🌪️' }),
    makeModel({ name: 'gemini',   aliases: ['geminikey', 'googleai', 'gemiai'],        model: 'gemini',   label: 'GEMINI AI',    emoji: '✨' }),
    makeModel({ name: 'deepseek', aliases: ['ds', 'deepseekr1', 'dsr1'],              model: 'deepseek', label: 'DEEPSEEK',     emoji: '🌊' }),
    makeModel({ name: 'llama',    aliases: ['ilama', 'llamaai', 'meta-llama'],         model: 'llama',    label: 'LLAMA AI',     emoji: '🦙' }),
    makeModel({ name: 'claude',   aliases: ['claudeai', 'anthropic'],                  model: 'claude-hybridspace', label: 'CLAUDE AI', emoji: '🧩' }),
    makeModel({ name: 'qwen',     aliases: ['qwenai', 'qwena'],                        model: 'qwen',     label: 'QWEN AI',      emoji: '🐉' }),
    makeModel({ name: 'gpt4',     aliases: ['gptfour', 'openai4', 'chatgpt4', 'cgpt4'], model: 'openai', label: 'GPT-4',        emoji: '🤖' }),
    makeModel({ name: 'bard',     aliases: ['bardai', 'google', 'metai', 'meta'],      model: 'gemini',   label: 'BARD AI',      emoji: '🎭' }),
    makeModel({ name: 'grok',     aliases: ['grokkey', 'xai', 'grokai'],               model: 'openai',   label: 'GROK AI',      emoji: '🚀' }),
];
