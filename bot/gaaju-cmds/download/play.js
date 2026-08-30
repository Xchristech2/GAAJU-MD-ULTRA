'use strict';

const yts = require("yt-search");
const { dlBuffer } = require("../../lib/keithapi");
const axios = require("axios");
const { getBotName } = require("../../lib/botname");

// ===== HARDCODED CONFIGURATION =====
const API_BASE = 'https://api-red-iota-56.vercel.app';
const API_KEY = 'nova_510035';
const TIMEOUT = 120000; // 2 minutes

function trunc(text, max = 38) {
    if (text && text.length > max) {
        return text.slice(0, max - 1) + "…";
    }

    return text || "";
}

function fmtSize(size) {
    if (!size) {
        return "? MB";
    }

    if (size >= 1048576) {
        return (size / 1024 / 1024).toFixed(2) + " MB";
    }

    return (size / 1024).toFixed(1) + " KB";
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
`┏━━❐ 🎵 PLAY MUSIC ❐
┃
┃ ✦ Usage:
┃   ${p}play <song name>
┃
┃ ✦ Example:
┃   ${p}play Alan Walker Faded
┃
┃ ✦ Aliases:
┃   ${p}music
┃   ${p}song
┃   ${p}playsong
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
            | SEARCHING MESSAGE
            |--------------------------------------------------------------------------
            */

            const searching =
                await sock.sendMessage(
                    jid,
                    {
                        text:
`┏━━❐ 🔎 MUSIC SEARCH ❐
┃
┃ ✦ Query:
┃   ${trunc(query, 50)}
┃
┃ ✦ Status: Searching...
┃
┃ ⏳ Please wait...
┃
┗━━❐
⚡ ${botName}`
                    },
                    {
                        quoted: msg
                    }
                );

            /*
            |--------------------------------------------------------------------------
            | NOVA API
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

                await sock.sendMessage(
                    jid,
                    {
                        delete: searching.key
                    }
                );

                throw new Error(
                    response.data?.message ||
                    'Failed to download song'
                );
            }

            const song =
                response.data.song;

            const download =
                response.data.download;

            /*
            |--------------------------------------------------------------------------
            | DELETE SEARCH MESSAGE
            |--------------------------------------------------------------------------
            */

            await sock.sendMessage(
                jid,
                {
                    delete: searching.key
                }
            );

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

                } catch (e) {

                    thumbnailBuffer = null;
                }
            }

            /*
            |--------------------------------------------------------------------------
            | THUMBNAIL URL FALLBACK
            |--------------------------------------------------------------------------
            */

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

                } catch (e) {

                    thumbnailBuffer = null;
                }
            }

            /*
            |--------------------------------------------------------------------------
            | FILE SIZE
            |--------------------------------------------------------------------------
            */

            const sizeMB =
                (
                    song.size /
                    1024 /
                    1024
                ).toFixed(2);

            const sizeLabel =
                sizeMB > 1
                    ? `${sizeMB} MB`
                    : `${(
                        song.size /
                        1024
                    ).toFixed(1)} KB`;

            /*
            |--------------------------------------------------------------------------
            | AUDIO BUFFER
            |--------------------------------------------------------------------------
            */

            let audioBuffer;

            try {

                audioBuffer =
                    Buffer.from(
                        download.audio,
                        'base64'
                    );

            } catch (e) {

                throw new Error(
                    'Failed to decode audio data'
                );
            }

            /*
            |--------------------------------------------------------------------------
            | VALIDATE AUDIO
            |--------------------------------------------------------------------------
            */

            if (
                !audioBuffer ||
                audioBuffer.length < 10000
            ) {

                throw new Error(
                    'Downloaded file is too small'
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
            | CAPTION
            |--------------------------------------------------------------------------
            */

            const caption =
`┏━━❐ 🎵 NOW PLAYING ❐
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
┃ ✦ Size:
┃   ${sizeLabel}
┃
┃ ✦ Status:
┃   ✅ Ready
┃
┗━━❐

🎶 ${botName}

> Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ`;

            /*
            |--------------------------------------------------------------------------
            | SEND THUMBNAIL
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
                                "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ",

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

            /*
            |--------------------------------------------------------------------------
            | SUCCESS
            |--------------------------------------------------------------------------
            */

            await sock.sendMessage(
                jid,
                {
                    text:
`┏━━❐ ✅ DOWNLOAD COMPLETE ❐
┃
┃ ✦ Song:
┃   ${trunc(song.title, 50)}
┃
┃ ✦ Quality:
┃   128kbps MP3
┃
┃ ✦ Status:
┃   Successfully downloaded
┃
┗━━❐

🎶 ${botName}

> Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ`
                },
                {
                    quoted: msg
                }
            );

        } catch (error) {

            /*
            |--------------------------------------------------------------------------
            | ERROR
            |--------------------------------------------------------------------------
            */

            console.error(
                '[PLAY ERROR]',
                error
            );

            await sock.sendMessage(
                jid,
                {
                    text:
`┏━━❐ ❌ PLAY MUSIC ❐
┃
┃ ✦ Query:
┃   ${trunc(query, 50)}
┃
┃ ✦ Status:
┃   ❌ Failed
┃
┃ ✦ Reason:
┃   ${error.message || 'Unknown error'}
┃
┗━━❐

🎶 ${botName}

> Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ`
                },
                {
                    quoted: msg
                }
            );
        }
    }
};
