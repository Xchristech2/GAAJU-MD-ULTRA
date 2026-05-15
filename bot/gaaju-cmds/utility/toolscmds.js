'use strict';

const { getBotName } = require('../../lib/botname');

module.exports = [
    {
        name:        'base64encode',
        aliases:     ['b64e', 'encode64'],
        description: 'Encode text to Base64',
        category:    'utility',

        async execute(sock, msg, args, prefix) {
            const chatId = msg.key.remoteJid;
            const name   = getBotName();
            const text   = args.join(' ').trim();

            if (!text) {
                return sock.sendMessage(chatId, {
                    text: `╔═|〔  BASE64 ENCODE 〕\n║\n║ ▸ *Usage* : ${prefix}base64encode <text>\n║\n╚═|〔 ${name} 〕`
                }, { quoted: msg });
            }

            const result = Buffer.from(text).toString('base64');
            await sock.sendMessage(chatId, {
                text: `╔═|〔  BASE64 ENCODE 〕\n║\n║ ▸ *Input*  : ${text.slice(0, 50)}\n║ ▸ *Result* : ${result}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }
    },
    {
        name:        'base64decode',
        aliases:     ['b64d', 'decode64'],
        description: 'Decode Base64 to text',
        category:    'utility',

        async execute(sock, msg, args, prefix) {
            const chatId = msg.key.remoteJid;
            const name   = getBotName();
            const text   = args.join(' ').trim();

            if (!text) {
                return sock.sendMessage(chatId, {
                    text: `╔═|〔  BASE64 DECODE 〕\n║\n║ ▸ *Usage* : ${prefix}base64decode <base64>\n║\n╚═|〔 ${name} 〕`
                }, { quoted: msg });
            }

            try {
                const result = Buffer.from(text, 'base64').toString('utf8');
                await sock.sendMessage(chatId, {
                    text: `╔═|〔  BASE64 DECODE 〕\n║\n║ ▸ *Input*  : ${text.slice(0, 50)}\n║ ▸ *Result* : ${result}\n║\n╚═|〔 ${name} 〕`
                }, { quoted: msg });
            } catch {
                await sock.sendMessage(chatId, {
                    text: `╔═|〔  BASE64 DECODE 〕\n║\n║ ▸ *Error* : Invalid Base64 string\n║\n╚═|〔 ${name} 〕`
                }, { quoted: msg });
            }
        }
    },
    {
        name:        'charcount',
        aliases:     ['cc', 'lettercount', 'wordcount'],
        description: 'Count characters, words and lines in text',
        category:    'utility',

        async execute(sock, msg, args, prefix) {
            const chatId = msg.key.remoteJid;
            const name   = getBotName();

            const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const text   = args.join(' ').trim()
                || quoted?.conversation
                || quoted?.extendedTextMessage?.text
                || '';

            if (!text) {
                return sock.sendMessage(chatId, {
                    text: `╔═|〔  CHAR COUNT 〕\n║\n║ ▸ *Usage* : ${prefix}charcount <text> or reply a message\n║\n╚═|〔 ${name} 〕`
                }, { quoted: msg });
            }

            const chars  = text.length;
            const words  = text.trim().split(/\s+/).filter(Boolean).length;
            const lines  = text.split('\n').length;
            const spaces = (text.match(/ /g) || []).length;

            await sock.sendMessage(chatId, {
                text: [
                    `╔═|〔  CHAR COUNT 〕`,
                    `║`,
                    `║ ▸ *Characters* : ${chars}`,
                    `║ ▸ *Words*      : ${words}`,
                    `║ ▸ *Lines*      : ${lines}`,
                    `║ ▸ *Spaces*     : ${spaces}`,
                    `║`,
                    `╚═|〔 ${name} 〕`
                ].join('\n')
            }, { quoted: msg });
        }
    },
    {
        name:        'reverse',
        aliases:     ['rev', 'flip'],
        description: 'Reverse the given text',
        category:    'utility',

        async execute(sock, msg, args, prefix) {
            const chatId = msg.key.remoteJid;
            const name   = getBotName();
            const text   = args.join(' ').trim();

            if (!text) {
                return sock.sendMessage(chatId, {
                    text: `╔═|〔  REVERSE 〕\n║\n║ ▸ *Usage* : ${prefix}reverse <text>\n║\n╚═|〔 ${name} 〕`
                }, { quoted: msg });
            }

            const result = [...text].reverse().join('');
            await sock.sendMessage(chatId, {
                text: `╔═|〔  REVERSE 〕\n║\n║ ▸ *Input*  : ${text}\n║ ▸ *Result* : ${result}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }
    },
    {
        name:        'uppercase',
        aliases:     ['upper', 'caps'],
        description: 'Convert text to UPPERCASE',
        category:    'utility',

        async execute(sock, msg, args, prefix) {
            const chatId = msg.key.remoteJid;
            const name   = getBotName();
            const text   = args.join(' ').trim();
            if (!text) return sock.sendMessage(chatId, { text: `╔═|〔  UPPERCASE 〕\n║\n║ ▸ *Usage* : ${prefix}uppercase <text>\n║\n╚═|〔 ${name} 〕` }, { quoted: msg });
            await sock.sendMessage(chatId, { text: `╔═|〔  UPPERCASE 〕\n║\n║ ▸ ${text.toUpperCase()}\n║\n╚═|〔 ${name} 〕` }, { quoted: msg });
        }
    },
    {
        name:        'lowercase',
        aliases:     ['lower', 'small'],
        description: 'Convert text to lowercase',
        category:    'utility',

        async execute(sock, msg, args, prefix) {
            const chatId = msg.key.remoteJid;
            const name   = getBotName();
            const text   = args.join(' ').trim();
            if (!text) return sock.sendMessage(chatId, { text: `╔═|〔  LOWERCASE 〕\n║\n║ ▸ *Usage* : ${prefix}lowercase <text>\n║\n╚═|〔 ${name} 〕` }, { quoted: msg });
            await sock.sendMessage(chatId, { text: `╔═|〔  LOWERCASE 〕\n║\n║ ▸ ${text.toLowerCase()}\n║\n╚═|〔 ${name} 〕` }, { quoted: msg });
        }
    }
];
