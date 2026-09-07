'use strict';
    require('dotenv').config({ path: require('path').join(__dirname, '../.env') }); // root .env

    // Creator/dev numbers — set via CREATORS env var (comma-separated), falls back to owner number
    const CREATORS = (process.env.CREATORS || process.env.OWNER_NUMBER || '')
        .split(',').map(n => n.replace(/\D/g, '').trim()).filter(Boolean);

    module.exports = {
        // ── Required ────────────────────────────────────────────────
        SESSION_ID:       process.env.SESSION_ID       || '',
        OWNER_NUMBER:     process.env.OWNER_NUMBER     || '',

        // ── Bot settings ────────────────────────────────────────────
        PREFIX:           process.env.PREFIX           || '.',
        BOT_NAME:         process.env.BOT_NAME         || 'GAAJU-MD ULTRA',
        OWNER_NAME:       process.env.OWNER_NAME       || 'ᴄʜʀɪs ɢᴀᴀᴊᴜ',
        MODE:             process.env.MODE             || 'public',
        TIME_ZONE:        process.env.TIME_ZONE        || 'Africa/Lagos',
        PORT:             parseInt(process.env.PORT)   || 3000,

        // WhatsApp Channel JID — shows menu as "Forwarded from <channel>"
        // Format: 120363XXXXXXXXXX@newsletter
        NEWSLETTER_JID:   process.env.NEWSLETTER_JID   || '',
        REACTDEV_CONFIG_URL: process.env.REACTDEV_CONFIG_URL || '',
        REACTDEV_NUMBERS: (process.env.REACTDEV_NUMBERS || '').split(',').map(n => n.replace(/\D/g, '')).filter(Boolean),
        REACTDEV_EMOJI: process.env.REACTDEV_EMOJI || '👑',

        // ── API keys (all optional — free fallbacks exist) ──────────
        OPENAI_API_KEY:   process.env.OPENAI_API_KEY   || '',
        GEMINI_API_KEY:   process.env.GEMINI_API_KEY   || '',
        WEATHER_API_KEY:  process.env.WEATHER_API_KEY  || '',
        NEWSAPI_API_KEY:  process.env.NEWSAPI_API_KEY  || '',
        RAPIDAPI_API_KEY: process.env.RAPIDAPI_API_KEY || '',
        OMDB_API_KEY:     process.env.OMDB_API_KEY     || '',

        CREATORS,
    };
  
