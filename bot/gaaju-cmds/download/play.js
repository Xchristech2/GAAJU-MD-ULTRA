'use strict';

const yts = require("yt-search");
const { dlBuffer } = require("../../lib/keithapi");
const axios = require("axios");
const { getBotName } = require("../../lib/botname");

// ===== HARDCODED CONFIGURATION =====
const API_BASE = 'https://api-red-iota-56.vercel.app';
const API_KEY = 'nova_510035';
const TIMEOUT = 120000;

function trunc(text, max = 38) {
    if (text && text.length > max) {
        return text.slice(0, max - 1) + "…";
    }

    return text || "";
}

module.exports = {

    name: "play",

    aliases: [
        "music",
        "song",
        "playsong"
    ],

    description:
        "Search and play a song from YouTube (128kbps MP3)",

    category: "download",

    async execute(
        sock,
        msg,
        args,
        prefix,
        ctx
    ) {

        const jid =
            msg.key.remoteJid;

        const botName =
            getBotName();

        const p =
            prefix || ".";

        const query =
            args.join(" ").trim();

        /*
        |--------------------------------------------------------------------------
        | USAGE
        |--------------------------------------------------------------------------
        */

        if (!query) {

            return sock.sendMessage(
                jid,
                {
                    text:
`┏━━❐ 🎵 PLAY ❐
┃
┃ ✦ Usage:
┃   ${p}play <song name>
┃
┃ ✦ Example:
┃   ${p}play Rema Calm Down
┃
┗━━❐
⚡ ${botName}`
                },
                {
                    quoted: msg
                }
            );
        }

        try {

            /*
            |--------------------------------------------------------------------------
            | REACTION
            |--------------------------------------------------------------------------
            */

            await sock.sendMessage(
                jid,
                {
                    react: {
                        text: "🎵",
                        key: msg.key
                    }
                }
            );

            /*
            |--------------------------------------------------------------------------
            | API REQUEST
            |--------------------------------------------------------------------------
            */

            const response =
                await axios.get(
                    `${API_BASE}/music/song3`,
                    {
                        params: {
                            apikey: API_KEY,
                            query: query
                        },
                        timeout: TIMEOUT
                    }
                );

            /*
            |--------------------------------------------------------------------------
            | CHECK RESPONSE
            |--------------------------------------------------------------------------
            */

            if (
                !response.data ||
                !response.data.success
            ) {
                throw new Error(
                    response.data?.message ||
                    'Song download failed'
                );
            }

            const song =
                response.data.song;

            const download =
                response.data.download;

            /*
            |--------------------------------------------------------------------------
            | THUMBNAIL
            |--------------------------------------------------------------------------
            */

            let thumbnailBuffer = null;

            if (song.thumbnail_base64) {

                try {

                    const base64Data =
                        song.thumbnail_base64
                            .split(',')[1];

                    if (base64Data) {

                        thumbnailBuffer =
                            Buffer.from(
                                base64Data,
                                'base64'
                            );
                    }

                } catch {}
            }

            if (
                !thumbnailBuffer &&
                song.thumbnail
            ) {

                try {

                    const imgRes =
                        await axios.get(
                            song.thumbnail,
                            {
                                responseType:
                                    'arraybuffer',

                                timeout: 15000
                            }
                        );

                    thumbnailBuffer =
                        Buffer.from(
                            imgRes.data
                        );

                } catch {}
            }

            /*
            |--------------------------------------------------------------------------
            | AUDIO
            |--------------------------------------------------------------------------
            */

            let audioBuffer;

            try {

                audioBuffer =
                    Buffer.from(
                        download.audio,
                        'base64'
                    );

            } catch {

                throw new Error(
                    'Failed to decode audio'
                );
            }

            if (
                !audioBuffer ||
                audioBuffer.length < 10000
            ) {

                throw new Error(
                    'Downloaded audio is invalid'
                );
            }

            /*
            |--------------------------------------------------------------------------
            | FILE NAME
            |--------------------------------------------------------------------------
            */

            const filename =
                song.filename ||
                `${song.title
                    .replace(
                        /[^\w\s-]/g,
                        ''
                    )
                    .substring(0, 50)
                }.mp3`;

            /*
            |--------------------------------------------------------------------------
            | SIMPLE INFO
            |--------------------------------------------------------------------------
            */

            const caption =
`┏━━❐ 🎵 PLAY MUSIC ❐
┃
┃ ✦ Title:
┃   ${trunc(song.title, 50)}
┃
┃ ✦ Artist:
┃   ${song.author || 'Unknown'}
┃
┃ ✦ Duration:
┃   ${song.duration || 'Unknown'}
┃
┃ ✦ Quality:
┃   128kbps MP3
┃
┗━━❐
🎶 ${botName}`;

            /*
            |--------------------------------------------------------------------------
            | SEND THUMBNAIL + INFO
            |--------------------------------------------------------------------------
            */

            if (
                thumbnailBuffer &&
                thumbnailBuffer.length > 1000
            ) {

                await sock.sendMessage(
                    jid,
                    {
                        image:
                            thumbnailBuffer,

                        caption:
                            caption
                    },
                    {
                        quoted: msg
                    }
                );
            }

            /*
            |--------------------------------------------------------------------------
            | SEND AUDIO
            |--------------------------------------------------------------------------
            */

            await sock.sendMessage(
                jid,
                {
                    audio:
                        audioBuffer,

                    mimetype:
                        "audio/mpeg",

                    ptt:
                        false,

                    fileName:
                        filename,

                    contextInfo: {

                        externalAdReply: {

                            showAdAttribution:
                                false,

                            renderLargerThumbnail:
                                true,

                            mediaType:
                                1,

                            title:
                                trunc(
                                    song.title
                                ),

                            body:
                                botName,

                            thumbnailUrl:
                                song.thumbnail ||
                                "",

                            sourceUrl:
                                song.url ||
                                ""
                        }
                    }
                },
                {
                    quoted: msg
                }
            );

        } catch (error) {

            console.error(
                '[PLAY ERROR]',
                error
            );

            /*
            |--------------------------------------------------------------------------
            | SIMPLE ERROR
            |--------------------------------------------------------------------------
            */

            await sock.sendMessage(
                jid,
                {
                    text:
`┏━━❐ ❌ PLAY ❐
┃
┃ ✦ Song:
┃   ${trunc(query, 50)}
┃
┃ ✦ Status:
┃   Failed
┃
┃ ✦ Reason:
┃   ${error.message || 'Unknown error'}
┃
┗━━❐
⚡ ${botName}`
                },
                {
                    quoted: msg
                }
            );
        }
    }
};
