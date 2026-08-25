'use strict';

const {
    downloadMediaMessage
} = require('wolfsocket');

const {
    getBotName
} = require('../../lib/botname');

const {
    execFile
} = require('child_process');

const {
    promisify
} = require('util');

const sharp = require('sharp');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');

const execFileAsync =
    promisify(execFile);

/*
|--------------------------------------------------------------------------
| EXIF
|--------------------------------------------------------------------------
*/

function buildExifChunk(packName, author) {
    const metadata = JSON.stringify({
        'sticker-pack-id':
            crypto.randomBytes(8).toString('hex'),

        'sticker-pack-name':
            packName,

        'sticker-pack-publisher':
            author,

        'android-app-store-link':
            '',

        'ios-app-store-link':
            ''
    });

    const payload =
        Buffer.from(metadata, 'utf8');

    const headerSize = 32;

    const exif =
        Buffer.alloc(
            headerSize + payload.length
        );

    exif.write(
        'Exif\0\0',
        0,
        'ascii'
    );

    exif.writeUInt16LE(
        18761,
        6
    );

    exif.writeUInt16LE(
        42,
        8
    );

    exif.writeUInt32LE(
        8,
        10
    );

    exif.writeUInt16LE(
        1,
        14
    );

    exif.writeUInt16LE(
        270,
        16
    );

    exif.writeUInt16LE(
        2,
        18
    );

    exif.writeUInt32LE(
        payload.length,
        20
    );

    exif.writeUInt32LE(
        headerSize - 6,
        24
    );

    exif.writeUInt32LE(
        0,
        28
    );

    payload.copy(
        exif,
        headerSize
    );

    const chunk =
        Buffer.alloc(
            8 + exif.length
        );

    chunk.write(
        'EXIF',
        0,
        'ascii'
    );

    chunk.writeUInt32LE(
        exif.length,
        4
    );

    exif.copy(
        chunk,
        8
    );

    return chunk;
}

/*
|--------------------------------------------------------------------------
| INJECT EXIF INTO WEBP
|--------------------------------------------------------------------------
*/

function injectExifToWebp(
    webpBuffer,
    packName,
    author
) {
    if (
        webpBuffer
            .slice(0, 4)
            .toString('ascii') !== 'RIFF'
    ) {
        throw new Error(
            'Invalid WebP file'
        );
    }

    if (
        webpBuffer
            .slice(8, 12)
            .toString('ascii') !== 'WEBP'
    ) {
        throw new Error(
            'Invalid WebP file'
        );
    }

    const body =
        webpBuffer.slice(12);

    const chunks = [];

    let offset = 0;

    while (
        offset + 8 <= body.length
    ) {
        const type =
            body
                .slice(
                    offset,
                    offset + 4
                )
                .toString('ascii');

        const size =
            body.readUInt32LE(
                offset + 4
            );

        const padded =
            size % 2;

        const end =
            offset +
            8 +
            size +
            padded;

        if (end > body.length) {
            break;
        }

        /*
         * Remove old EXIF metadata.
         */
        if (type !== 'EXIF') {
            chunks.push(
                body.slice(
                    offset,
                    end
                )
            );
        }

        offset = end;
    }

    chunks.push(
        buildExifChunk(
            packName,
            author
        )
    );

    const newBody =
        Buffer.concat(chunks);

    const header =
        Buffer.alloc(12);

    header.write(
        'RIFF',
        0,
        'ascii'
    );

    header.writeUInt32LE(
        4 + newBody.length,
        4
    );

    header.write(
        'WEBP',
        8,
        'ascii'
    );

    return Buffer.concat([
        header,
        newBody
    ]);
}

/*
|--------------------------------------------------------------------------
| GET REPLIED MESSAGE
|--------------------------------------------------------------------------
*/

function getQuotedMessage(msg) {
    return (
        msg.message
            ?.extendedTextMessage
            ?.contextInfo
            ?.quotedMessage
    );
}

/*
|--------------------------------------------------------------------------
| TAKE COMMAND
|--------------------------------------------------------------------------
*/

module.exports = {

    name: 'take',

    aliases: [
        'steal',
        'stickerpack',
        'stkpack',
        'taka'
    ],

    description:
        'Convert replied media to a sticker with custom pack information',

    category:
        'utility',

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
             * Reaction
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
             * Pack name and author
             *
             * Example:
             *
             * .take GAAJU | Chris
             */
            const input =
                Array.isArray(args)
                    ? args.join(' ').trim()
                    : '';

            let packName =
                botName;

            let author =
                botName;

            if (input.includes('|')) {

                const parts =
                    input
                        .split('|')
                        .map(
                            x => x.trim()
                        );

                packName =
                    parts[0] ||
                    botName;

                author =
                    parts[1] ||
                    botName;

            } else if (input) {

                packName =
                    input;

            }

            /*
             * Get quoted message.
             */
            const quoted =
                getQuotedMessage(msg);

            if (!quoted) {
                return await sock.sendMessage(
                    chatId,
                    {
                        text:
                            `╔═|〔 🎨 TAKE STICKER 〕\n` +
                            `║\n` +
                            `║ ▸ Reply to a:\n` +
                            `║   • Sticker\n` +
                            `║   • Image\n` +
                            `║   • Video\n` +
                            `║   • Document\n` +
                            `║\n` +
                            `║ ▸ Usage:\n` +
                            `║   ${p}take\n` +
                            `║   ${p}take MyPack | Author\n` +
                            `║\n` +
                            `╚═|〔 ${botName} 〕`
                    },
                    {
                        quoted: msg
                    }
                );
            }

            /*
             * Detect media.
             */
            const sticker =
                quoted.stickerMessage;

            const image =
                quoted.imageMessage;

            const video =
                quoted.videoMessage;

            const document =
                quoted.documentMessage;

            if (
                !sticker &&
                !image &&
                !video &&
                !document
            ) {
                return await sock.sendMessage(
                    chatId,
                    {
                        text:
                            `❌ The replied message does not contain supported media.\n\n` +
                            `Supported:\n` +
                            `• Sticker\n` +
                            `• Image\n` +
                            `• Video\n` +
                            `• Document`
                    },
                    {
                        quoted: msg
                    }
                );
            }

            /*
             * Temporary files.
             */
            const tempDir =
                os.tmpdir();

            const id =
                `${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

            const inputFile =
                path.join(
                    tempDir,
                    `take_${id}`
                );

            const outputFile =
                path.join(
                    tempDir,
                    `take_${id}.webp`
                );

            let inputBuffer;

            try {

                /*
                 * Create a message object that
                 * downloadMediaMessage can understand.
                 */
                const mediaMessage = {
                    key: {
                        remoteJid:
                            chatId,

                        id:
                            msg.message
                                ?.extendedTextMessage
                                ?.contextInfo
                                ?.stanzaId,

                        participant:
                            msg.message
                                ?.extendedTextMessage
                                ?.contextInfo
                                ?.participant,

                        fromMe:
                            false
                    },

                    message:
                        quoted
                };

                inputBuffer =
                    await downloadMediaMessage(
                        mediaMessage,
                        'buffer',
                        {}
                    );

                if (
                    !inputBuffer ||
                    !inputBuffer.length
                ) {
                    throw new Error(
                        'Unable to download the replied media'
                    );
                }

            } catch (downloadError) {

                console.error(
                    '[TAKE DOWNLOAD ERROR]',
                    downloadError
                );

                throw new Error(
                    'Could not download the replied media'
                );
            }

            let webpBuffer;

            /*
             * Existing sticker
             */
            if (sticker) {

                webpBuffer =
                    inputBuffer;

            }

            /*
             * Image
             */
            else if (image) {

                webpBuffer =
                    await sharp(
                        inputBuffer
                    )
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
                            lossless: true
                        })
                        .toBuffer();

            }

            /*
             * Document
             *
             * If the document contains an image,
             * Sharp will process it.
             */
            else if (document) {

                try {

                    webpBuffer =
                        await sharp(
                            inputBuffer
                        )
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
                                lossless: true
                            })
                            .toBuffer();

                } catch {

                    throw new Error(
                        'The document must contain an image that Sharp can process.'
                    );

                }

            }

            /*
             * Video
             */
            else if (video) {

                const videoFile =
                    `${inputFile}.mp4`;

                fs.writeFileSync(
                    videoFile,
                    inputBuffer
                );

                try {

                    await execFileAsync(
                        'ffmpeg',
                        [
                            '-y',

                            '-i',
                            videoFile,

                            '-vf',
                            'scale=512:512:force_original_aspect_ratio=decrease,' +
                            'pad=512:512:(ow-iw)/2:(oh-ih)/2,' +
                            'fps=15',

                            '-t',
                            '10',

                            '-an',

                            '-loop',
                            '0',

                            '-preset',
                            'default',

                            outputFile
                        ],
                        {
                            timeout: 30000
                        }
                    );

                    webpBuffer =
                        fs.readFileSync(
                            outputFile
                        );

                } finally {

                    try {
                        fs.unlinkSync(
                            videoFile
                        );
                    } catch {}

                }

            }

            if (
                !webpBuffer ||
                !webpBuffer.length
            ) {
                throw new Error(
                    'Could not convert the media into a sticker'
                );
            }

            /*
             * Add sticker metadata.
             */
            const finalSticker =
                injectExifToWebp(
                    webpBuffer,
                    packName,
                    author
                );

            /*
             * Send sticker.
             */
            await sock.sendMessage(
                chatId,
                {
                    sticker:
                        finalSticker
                },
                {
                    quoted: msg
                }
            );

            /*
             * Success message.
             */
            await sock.sendMessage(
                chatId,
                {
                    text:
                        `╔═|〔 🎨 TAKE STICKER 〕\n` +
                        `║\n` +
                        `║ ▸ *Pack*   : ${packName}\n` +
                        `║ ▸ *Author* : ${author}\n` +
                        `║ ▸ *Status* : ✅ Done\n` +
                        `║\n` +
                        `╚═|〔 ${botName} 〕`
                },
                {
                    quoted: msg
                }
            );

        } catch (error) {

            console.error(
                '[TAKE ERROR]',
                error
            );

            await sock.sendMessage(
                chatId,
                {
                    text:
                        `╔═|〔 🎨 TAKE STICKER 〕\n` +
                        `║\n` +
                        `║ ▸ *Status* : ❌ Failed\n` +
                        `║ ▸ *Reason* : ${error?.message || 'Unknown error'}\n` +
                        `║\n` +
                        `╚═|〔 ${botName} 〕`
                },
                {
                    quoted: msg
                }
            );

        } finally {

            /*
             * Cleanup temporary output.
             */
            try {
                if (
                    fs.existsSync(
                        outputFile
                    )
                ) {
                    fs.unlinkSync(
                        outputFile
                    );
                }
            } catch {}

            try {
                if (
                    fs.existsSync(
                        inputFile
                    )
                ) {
                    fs.unlinkSync(
                        inputFile
                    );
                }
            } catch {}
        }
    }
};
