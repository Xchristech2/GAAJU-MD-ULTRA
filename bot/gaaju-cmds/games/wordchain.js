'use strict';

const { getBotName } = require('../../lib/botname');

const games = new Map();

module.exports = [
    {
        name:        'wordchain',
        aliases:     ['wc', 'wordgame'],
        description: 'Start a word chain game — each word must start with the last letter of the previous',
        category:    'games',

        async execute(sock, msg, args, prefix) {
            const chatId = msg.key.remoteJid;
            const name   = getBotName();

            if (games.has(chatId)) {
                const g = games.get(chatId);
                return sock.sendMessage(chatId, {
                    text: `╔═|〔  WORD CHAIN 〕\n║\n║ ▸ Game already active!\n║ ▸ *Last word* : ${g.lastWord}\n║ ▸ *Next must start with* : *${g.lastWord.slice(-1).toUpperCase()}*\n║ ▸ Type ${prefix}wcend to stop\n║\n╚═|〔 ${name} 〕`
                }, { quoted: msg });
            }

            const startWord = (args[0] || 'chain').toLowerCase().replace(/[^a-z]/g, '');
            games.set(chatId, {
                lastWord: startWord,
                used: new Set([startWord]),
                startedBy: msg.key.participant || msg.key.remoteJid,
                startedAt: Date.now()
            });

            await sock.sendMessage(chatId, {
                text: [
                    `╔═|〔  WORD CHAIN 〕`,
                    `║`,
                    `║ ▸ *Game started!*`,
                    `║ ▸ *First word* : ${startWord}`,
                    `║ ▸ *Next must start with* : *${startWord.slice(-1).toUpperCase()}*`,
                    `║`,
                    `║  Reply with a word starting with that letter.`,
                    `║  Type ${prefix}wcend to stop.`,
                    `║`,
                    `╚═|〔 ${name} 〕`
                ].join('\n')
            }, { quoted: msg });
        }
    },
    {
        name:        'wcplay',
        aliases:     ['wcp'],
        description: 'Submit your word in an active word chain game',
        category:    'games',

        async execute(sock, msg, args, prefix) {
            const chatId = msg.key.remoteJid;
            const name   = getBotName();
            const g      = games.get(chatId);

            if (!g) {
                return sock.sendMessage(chatId, {
                    text: `╔═|〔  WORD CHAIN 〕\n║\n║ ▸ No active game. Start one with ${prefix}wordchain\n║\n╚═|〔 ${name} 〕`
                }, { quoted: msg });
            }

            const word = (args[0] || '').toLowerCase().replace(/[^a-z]/g, '');
            if (!word) {
                return sock.sendMessage(chatId, {
                    text: `╔═|〔  WORD CHAIN 〕\n║\n║ ▸ *Usage* : ${prefix}wcplay <word>\n║\n╚═|〔 ${name} 〕`
                }, { quoted: msg });
            }

            const needed = g.lastWord.slice(-1);
            if (word[0] !== needed) {
                return sock.sendMessage(chatId, {
                    text: `╔═|〔  WORD CHAIN 〕\n║\n║ ▸ ❌ Word must start with *${needed.toUpperCase()}*\n║ ▸ *Last word was* : ${g.lastWord}\n║\n╚═|〔 ${name} 〕`
                }, { quoted: msg });
            }

            if (g.used.has(word)) {
                return sock.sendMessage(chatId, {
                    text: `╔═|〔  WORD CHAIN 〕\n║\n║ ▸ ❌ *${word}* was already used!\n║\n╚═|〔 ${name} 〕`
                }, { quoted: msg });
            }

            g.lastWord = word;
            g.used.add(word);

            await sock.sendMessage(chatId, {
                text: `╔═|〔  WORD CHAIN 〕\n║\n║ ▸ ✅ *${word}* accepted!\n║ ▸ *Next must start with* : *${word.slice(-1).toUpperCase()}*\n║ ▸ *Words used* : ${g.used.size}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }
    },
    {
        name:        'wcend',
        aliases:     ['wordchainend', 'wcstop'],
        description: 'End the active word chain game',
        category:    'games',

        async execute(sock, msg, args, prefix) {
            const chatId = msg.key.remoteJid;
            const name   = getBotName();
            const g      = games.get(chatId);

            if (!g) {
                return sock.sendMessage(chatId, {
                    text: `╔═|〔  WORD CHAIN 〕\n║\n║ ▸ No active game.\n║\n╚═|〔 ${name} 〕`
                }, { quoted: msg });
            }

            games.delete(chatId);

            await sock.sendMessage(chatId, {
                text: `╔═|〔  WORD CHAIN 〕\n║\n║ ▸ *Game ended!*\n║ ▸ *Total words* : ${g.used.size}\n║ ▸ *Last word*   : ${g.lastWord}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }
    }
];
