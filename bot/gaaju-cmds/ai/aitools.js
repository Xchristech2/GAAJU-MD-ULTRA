'use strict';

const { casperGet, dlBuffer } = require('../../lib/keithapi');
const { getBotName }          = require('../../lib/botname');

// ── TTS (Casper — 9 OpenAI-quality voices) ───────────────────────────────────
const VOICES = [
    { id: 'alloy',   label: 'Alloy (neutral)'     },
    { id: 'echo',    label: 'Echo (male)'          },
    { id: 'fable',   label: 'Fable (male warm)'    },
    { id: 'onyx',    label: 'Onyx (male deep)'     },
    { id: 'nova',    label: 'Nova (female warm)'   },
    { id: 'shimmer', label: 'Shimmer (female soft)'},
    { id: 'ash',     label: 'Ash (male calm)'      },
    { id: 'coral',   label: 'Coral (female)'       },
    { id: 'sage',    label: 'Sage (female)'        },
];

const ttsCmd = {
    name: 'tts',
    aliases: ['texttospeech', 'speak', 'voice'],
    description: 'Convert text to speech using AI voices',
    category: 'ai',
    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;
        const name   = getBotName();

        if (!args.length || args[0] === 'voices') {
            const list = VOICES.map((v, i) => `║ ▸ [${i + 1}] ${v.label}`).join('\n');
            return sock.sendMessage(chatId, {
                text: `╔═|〔  🔊 TTS VOICES 〕\n║\n${list}\n║\n║ *Usage* : ${prefix}tts <number> <text>\n║ *Example* : ${prefix}tts 5 Hello world\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }

        let voiceIndex = 0;
        let textArgs   = args;
        if (!isNaN(args[0]) && args.length > 1) {
            voiceIndex = Math.max(0, Math.min(parseInt(args[0]) - 1, VOICES.length - 1));
            textArgs   = args.slice(1);
        }

        const text = textArgs.join(' ').trim();
        if (!text) return sock.sendMessage(chatId, {
            text: `╔═|〔  🔊 TTS 〕\n║\n║ ▸ *Usage*  : ${prefix}tts <text>\n║ ▸ *Voices* : ${prefix}tts voices\n║\n╚═|〔 ${name} 〕`
        }, { quoted: msg });

        const voice = VOICES[voiceIndex];
        try {
            await sock.sendMessage(chatId, { react: { text: '🔊', key: msg.key } });
            const data = await casperGet('/api/tools/tts', { text, voice: voice.id });
            if (!data.success || !data.audioUrl) throw new Error(data.message || 'TTS failed');

            const buf = await dlBuffer(data.audioUrl);
            const caption = `╔═|〔  🔊 TTS 〕\n║\n║ ▸ *Voice* : ${voice.label}\n║ ▸ *Text*  : ${text.substring(0, 80)}${text.length > 80 ? '...' : ''}\n║\n╚═|〔 ${name} 〕`;
            await sock.sendMessage(chatId, { audio: buf, mimetype: 'audio/mpeg', ptt: false, caption }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(chatId, {
                text: `╔═|〔  🔊 TTS 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${e.message}\n║\n╚═|〔 ${name} 〕`
            }, { quoted: msg });
        }
    }
};

module.exports = [ttsCmd];
