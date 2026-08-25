'use strict';

const {
    downloadMediaMessage
} = require('wolfsocket');

const {
    getBotName
} = require('../../lib/botname');

const sharp = require('sharp');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFile } = require('child_process');
const { promisify } = require('util');

const execFileAsync = promisify(execFile);

module.exports = {
    name: 'take',

    aliases: [
        'steal',
        'stickerpack',
        'stkpack',
        'taka'
    ],

    description:
        'Create a sticker from a replied sticker, image, video or supported document',

    category: 'utility',

    async execute(
        sock,
        msg,
        args,
        prefix
    ) {
        const chatId =
            msg.key.remoteJid;

        const botName =
            getBotName();

        const p =
            prefix || '.';

        try {

            /*
            |--------------------------------------------------------------------------
            | REACT
            |--------------------------------------------------------------------------
            */

            try {
                await sock.sendMessage(
                    chatId,
                    {
                        react: {
                            text: '🎨',
                            key: msg.key
                        }
                    }
                );
            } catch {}

            /*
            |--------------------------------------------------------------------------
            | PACK NAME / AUTHOR
            |--------------------------------------------------------------------------
            */

            const input =
                Array.isArray(args)
                    ? args.join(' ').trim()
                    : String(args || '').trim();

            let packName =
                botName;

            let author =
                botName;

            if (input.includes('|')) {

                const parts =
                    input
                        .split('|')
                        .map(x => x.trim());

                packName =
                    parts[0] || botName;

                author =
                    parts.slice(1).join('|').trim() ||
                    botName;

            } else if (input) {

                packName =
                    input;
            }

            /*
            |--------------------------------------------------------------------------
            | GET QUOTED MESSAGE
            |--------------------------------------------------------------------------
            */

            const context =
                msg.message
                    ?.extendedTextMessage
                    ?.contextInfo;

            const quotedMessage =
                context?.quotedMessage;

            if (!quotedMessage) {

                return await sock.sendMessage(
                    chatId,
                    {
                        text:
`┏━━❐ 🎨 TAKE ❐
┃
┃✦ Reply to a sticker
┃✦ Reply to an image
┃✦ Reply to a video
┃✦ Reply to a supported document
┃
┃✦ Usage:
┃  ${p}take
┃
┃✦ Custom pack:
┃  ${p}take My Pack | Author
┃
┗━━❐`
                    },
                    {
                        quoted: msg
                    }
                );
            }

            /*
            |--------------------------------------------------------------------------
            | DETECT MEDIA
            |--------------------------------------------------------------------------
            */

            const sticker =
                quotedMessage.stickerMessage;

            const image =
                quotedMessage.imageMessage;

            const video =
                quotedMessage.videoMessage;

            const document =
                quotedMessage.documentMessage;

            let mediaType =
                null;

            if (sticker) {
                mediaType = 'sticker';
            } else if (image) {
                mediaType = 'image';
            } else if (video) {
                mediaType = 'video';
            } else if (document) {
                mediaType = 'document';
            }

            if (!mediaType) {

                return await sock.sendMessage(
                    chatId,
                    {
                        text:
`┏━━❐ 🎨 TAKE ❐
┃
┃✦ ❌ Unsupported media
┃
┃Reply to:
┃✦ Sticker
┃✦ Image
┃✦ Video
┃✦ Image/video document
┃
┗━━❐`
                    },
                    {
                        quoted: msg
                    }
                );
            }

            /*
            |--------------------------------------------------------------------------
            | DOWNLOAD MEDIA
            |--------------------------------------------------------------------------
            */

            const quotedKey = {
                remoteJid: chatId,
                id: context.stanzaId,
                participant: context.participant,
                fromMe: false
            };

            const downloadableMessage = {
                key: quotedKey,
                message: quotedMessage
            };

            let buffer;

            try {

                buffer =
                    await downloadMediaMessage(
                        downloadableMessage,
                        'buffer',
                        {}
                    );

            } catch (downloadError) {

                console.error(
                    '[TAKE DOWNLOAD ERROR]',
                    downloadError
                );

                return await sock.sendMessage(
                    chatId,
                    {
                        text:
`┏━━❐ 🎨 TAKE ❐
┃
┃✦ ❌ Download failed
┃
┃✦ The quoted media could not
┃  be downloaded.
┃
┗━━❐`
                    },
                    {
                        quoted: msg
                    }
                );
            }

            if (
                !buffer ||
                !Buffer.isBuffer(buffer) ||
                buffer.length === 0
            ) {

                return await sock.sendMessage(
                    chatId,
                    {
                        text:
`┏━━❐ 🎨 TAKE ❐
┃
┃✦ ❌ Empty media
┃
┃✦ I couldn't read the
┃  replied file.
┃
┗━━❐`
                    },
                    {
                        quoted: msg
                    }
                );
            }

            /*
            |--------------------------------------------------------------------------
            | TEMP FILES
            |--------------------------------------------------------------------------
            */

            const id =
                `${Date.now()}_${crypto
                    .randomBytes(4)
                    .toString('hex')}`;

            const inputPath =
                path.join(
                    os.tmpdir(),
                    `gaaju_take_${id}_input`
                );

            const outputPath =
                path.join(
                    os.tmpdir(),
                    `gaaju_take_${id}.webp`
                );

            fs.writeFileSync(
                inputPath,
                buffer
            );

            /*
            |--------------------------------------------------------------------------
            | CREATE STICKER
            |--------------------------------------------------------------------------
            */

            try {

                /*
                | STICKER
                */

                if (mediaType === 'sticker') {

                    /*
                     * Validate the sticker first.
                     * If it is already valid WebP,
                     * re-encode it through Sharp.
                     */

                    await sharp(buffer)
                        .resize(
                            512,
                            512,
                            {
                                fit: 'contain',
                                background: {
                                    r: 0,
                                    g: 0,
                                    b: 0,
                                    alpha: 0
                                }
                            }
                        )
                        .webp({
                            quality: 90,
                            lossless: true
                        })
                        .toFile(outputPath);
                }

                /*
                | IMAGE
                */

                else if (mediaType === 'image') {

                    await sharp(buffer)
                        .rotate()
                        .resize(
                            512,
                            512,
                            {
                                fit: 'contain',
                                background: {
                                    r: 0,
                                    g: 0,
                                    b: 0,
                                    alpha: 0
                                }
                            }
                        )
                        .webp({
                            quality: 90
                        })
                        .toFile(outputPath);
                }

                /*
                | VIDEO
                */

                else if (mediaType === 'video') {

                    await execFileAsync(
                        'ffmpeg',
                        [
                            '-y',
                            '-i',
                            inputPath,

                            '-vf',
                            'scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=black@0,fps=15',

                            '-t',
                            '8',

                            '-an',

                            '-c:v',
                            'libwebp',

                            '-lossless',
                            '0',

                            '-q:v',
                            '70',

                            '-loop',
                            '0',

                            outputPath
                        ],
                        {
                            timeout: 60000
                        }
                    );
                }

                /*
                | DOCUMENT
                */

                else if (mediaType === 'document') {

                    const mimetype =
                        String(
                            document.mimetype || ''
                        ).toLowerCase();

                    /*
                     * Image document
                     */

                    if (
                        mimetype.startsWith('image/')
                    ) {

                        await sharp(buffer)
                            .rotate()
                            .resize(
                                512,
                                512,
                                {
                                    fit: 'contain',
                                    background: {
                                        r: 0,
                                        g: 0,
                                        b: 0,
                                        alpha: 0
                                    }
                                }
                            )
                            .webp({
                                quality: 90
                            })
                            .toFile(outputPath);

                    }

                    /*
                     * Video document
                     */

                    else if (
                        mimetype.startsWith('video/')
                    ) {

                        await execFileAsync(
                            'ffmpeg',
                            [
                                '-y',
                                '-i',
                                inputPath,

                                '-vf',
                                'scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=black@0,fps=15',

                                '-t',
                                '8',

                                '-an',

                                '-c:v',
                                'libwebp',

                                '-q:v',
                                '70',

                                '-loop',
                                '0',

                                outputPath
                            ],
                            {
                                timeout: 60000
                            }
                        );

                    } else {

                        throw new Error(
                            'This document is not an image or video.'
                        );
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | VERIFY OUTPUT
                |--------------------------------------------------------------------------
                */

                if (
                    !fs.existsSync(outputPath)
                ) {
                    throw new Error(
                        'Sticker conversion produced no file.'
                    );
                }

                const stickerBuffer =
                    fs.readFileSync(
                        outputPath
                    );

                if (
                    !stickerBuffer ||
                    stickerBuffer.length < 100
                ) {
                    throw new Error(
                        'Generated sticker is invalid or empty.'
                    );
                }

                /*
                |--------------------------------------------------------------------------
                | SEND STICKER
                |--------------------------------------------------------------------------
                */

                await sock.sendMessage(
                    chatId,
                    {
                        sticker: stickerBuffer,

                        /*
                         * These are standard sticker
                         * metadata fields supported by
                         * Baileys-style implementations.
                         */
                        packname: packName,
                        author: author
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
                    chatId,
                    {
                        text:
`┏━━❐ 🎨 TAKE ❐
┃
┃✦ Pack: ${packName}
┃✦ Author: ${author}
┃✦ Type: ${mediaType}
┃✦ Status: ✅ Done
┃
┃✦ Powered by
┃  ${botName}
┗━━❐`
                    },
                    {
                        quoted: msg
                    }
                );

            } finally {

                /*
                |--------------------------------------------------------------------------
                | CLEAN TEMP FILES
                |--------------------------------------------------------------------------
                */

                try {
                    if (
                        fs.existsSync(inputPath)
                    ) {
                        fs.unlinkSync(inputPath);
                    }
                } catch {}

                try {
                    if (
                        fs.existsSync(outputPath)
                    ) {
                        fs.unlinkSync(outputPath);
                    }
                } catch {}
            }

        } catch (error) {

            console.error(
                '[TAKE ERROR]',
                error
            );

            await sock.sendMessage(
                chatId,
                {
                    text:
`┏━━❐ 🎨 TAKE ❐
┃
┃✦ Status: ❌ Failed
┃
┃✦ Reason:
┃  ${error?.message || 'Unknown error'}
┃
┃✦ Try replying to an image,
┃  video or sticker and use:
┃  ${p}take
┃
┗━━❐`
                },
                {
                    quoted: msg
                }
            );
        }
    }
};
