'use strict';

const { getBotName } = require('../../lib/botname.js');

const quotes = [
    "🔥 Greatness begins when you stop waiting for permission to succeed.",
    "💯 Your background may explain your beginning, but it doesn't decide your ending.",
    "🎯 Move in silence, work with purpose, and let your results speak.",
    "💭 Not every delay is a denial. Sometimes life is preparing you for more.",
    "🚀 Small steps every day can take you to places you once only dreamed of.",
    "🖤 Never let a temporary struggle make you doubt your permanent potential.",
    "💪 The strongest people are often fighting battles nobody knows about.",
    "🌍 You don't need everybody to believe in you. You need to believe in yourself.",
    "💎 Protect your peace, respect your journey, and stay true to your purpose.",
    "🙏 Pray like everything depends on God, and work like your dreams depend on you.",
    "⚡ Don't compete with another person's timeline. Build your own story.",
    "🛤️ Sometimes walking alone is better than following people going nowhere.",
    "💰 Chase your purpose first; build something valuable, and let the rewards follow.",
    "🧠 A focused mind can turn an ordinary opportunity into an extraordinary future.",
    "🌱 Never be ashamed of starting small. Every big tree was once a seed.",
    "👑 Real confidence doesn't need an audience.",
    "🔥 Let your pain teach you, your mistakes guide you, and your dreams push you.",
    "🕊️ Peace is valuable. Stop trading it for things that don't matter.",
    "💯 You may not be where you want to be, but be proud that you haven't given up.",
    "🌟 Your future needs your discipline more than your excuses.",
    "🙏 When nobody understands your journey, remember why you started.",
    "💪 Don't let one bad chapter convince you that your whole story is finished.",
    "🎯 Focus on becoming better, not on proving yourself to everybody.",
    "💎 Stay humble when things are good and stay hopeful when things are hard.",
    "🚶 Every successful journey begins with the courage to take the first step.",
    "🖤 Some lessons hurt, but they teach you what comfort never could.",
    "🌅 Every new day is another chance to become the person you promised yourself you'd be.",
    "⚡ Your consistency will take you further than motivation ever could.",
    "👑 Be the person your younger self needed and your future self will thank.",
    "🔥 The dream is free, but the discipline to achieve it comes at a price.",
    "🌍 Don't measure your progress by applause. Some of the biggest victories happen quietly.",
    "🙏 Keep God in your plans, gratitude in your heart, and hard work in your routine.",
    "💭 Sometimes the right path feels lonely because not everybody is meant to walk it with you.",
    "💪 You survived days you thought you couldn't. Give yourself credit for that.",
    "🎵 Turn your struggles into lessons and your experiences into something meaningful.",
    "🚀 Your opportunity may come unexpectedly, so prepare before it arrives.",
    "💯 Never sacrifice your future just to impress people who won't build it with you.",
    "🌱 Growth begins when you accept that you still have something to learn.",
    "🖤 Be kind, but don't let kindness make you forget your boundaries.",
    "🔥 One day, the work you're doing in private may become the story that inspires others."
];

const borders = [
    {
        top: '┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓',
        bottom: '┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛'
    },
    {
        top: '╭──────────────────────────╮',
        bottom: '╰──────────────────────────╯'
    },
    {
        top: '═══════ ✦ ✧ ✦ ═══════',
        bottom: '═══════ ✦ ✧ ✦ ═══════'
    }
];

module.exports = {
    name: 'quote',
    aliases: ['dailyquote', 'motivation', 'inspire'],
    description: 'Get an original motivational quote',
    category: 'fun',
    ownerOnly: false,

    async execute(sock, msg) {
        const jid = msg.key.remoteJid;

        try {
            const quote = quotes[
                Math.floor(Math.random() * quotes.length)
            ];

            const border = borders[
                Math.floor(Math.random() * borders.length)
            ];

            await sock.sendMessage(
                jid,
                {
                    text:
                        `✨ *A WORD TO REMEMBER*\n\n` +
                        `${border.top}\n` +
                        `${quote}\n` +
                        `${border.bottom}\n\n` +
                        `_Take the lesson. Trust the process._\n\n` +
                        `_Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ_`
                },
                { quoted: msg }
            );
        } catch (error) {
            console.error('[QUOTE] Error:', error);

            await sock.sendMessage(
                jid,
                {
                    text:
                        `❌ *QUOTE ERROR*\n\n` +
                        `I couldn't generate a quote right now. Please try again later.\n\n` +
                        `_Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ_`
                },
                { quoted: msg }
            );
        }
    }
};
