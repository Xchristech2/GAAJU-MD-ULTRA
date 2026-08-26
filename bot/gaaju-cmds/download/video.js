'use strict';

const { getBotName } = require('../../lib/botname');

const API_URL = 'https://apis.davidcyril.name.ng/hdvideo';
const MAX_SIZE = 60 * 1024 * 1024;

function getDownloadUrl(result) {
    if (!result) return null;

    if (typeof result === 'string') {
        return result.startsWith('http')
            ? result
            : null;
    }

    if (Array.isArray(result)) {
        for (const item of result) {
            const url = getDownloadUrl(item);
            if (url) return url;
        }
        return null;
    }

    if (typeof result === 'object') {
        const keys = [
            'downloadURL',
            'downloadUrl',
            'download_url',
            'proxyURL',
            'proxyUrl',
            'video',
            'videoUrl',
            'video_url',
            'url',
            'link',
            'dl_link',
            'download',
            'media'
        ];

        for (const key of keys) {
            if (
                typeof result[key] === 'string' &&
                result[key].startsWith('http')
            ) {
                return result[key];
            }
        }

        for (const value of Object.values(result)) {
            if (value && typeof value === 'object') {
                const url = getDownloadUrl(value);
                if (url) return url;
            }
        }
    }

    return null;
}

async function downloadVideo(url) {
    const response = await fetch(url, {
        signal: AbortSignal.timeout(90000)
    });

    if (!response.ok) {
        throw new Error(
            `Download HTTP ${response.status}`
        );
    }

    const length = parseInt(
        response.headers.get('content-length') || '0',
        10
    );

    if (length > MAX_SIZE) {
        throw new Error('Video is larger than 60 MB');
    }

    const buffer = Buffer.from(
        await response.arrayBuffer()
    );

    if (buffer.length > MAX_SIZE) {
        throw new Error('Video is larger than 60 MB');
    }

    return buffer;
}

module.exports = {
    name: 'video',

    aliases: [
        'videodl',
        'hdvideo',
        'vid'
    ],

    description:
        'Download video from a direct video URL',

    category: 'download',

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

        const url =
            args?.[0];

        // ================= USAGE =================

        if (!url) {
            return sock.sendMessage(
                chatId,
                {
                    text:
`╔═|〔  VIDEO 〕
║
║ ▸ *Status* : ❌ Missing URL
║
║ ▸ *Usage* : ${p}video <url>
║
║ ▸ *Example* :
║   ${p}video https://example.com/video.mp4
║
╚═|〔 ${botName} 〕`
                },
                {
                    quoted: msg
                }
            );
        }

        // ================= URL CHECK =================

        let videoUrl;

        try {
            videoUrl = new URL(url).href;
        } catch {
            return sock.sendMessage(
                chatId,
                {
                    text:
`╔═|〔  VIDEO 〕
║
║ ▸ *Status* : ❌ Invalid URL
║ ▸ *Reason* : Please provide a valid video URL
║
╚═|〔 ${botName} 〕`
                },
                {
                    quoted: msg
                }
            );
        }

        try {

            // ================= REACTION =================

            try {
                await sock.sendMessage(
                    chatId,
                    {
                        react: {
                            text: '📥',
                            key: msg.key
                        }
                    }
                );
            } catch {}

            // ================= API =================

            const endpoint =
                `${API_URL}?url=${encodeURIComponent(
                    videoUrl
                )}`;

            const apiResponse =
                await fetch(
                    endpoint,
                    {
                        signal:
                            AbortSignal.timeout(
                                45000
                            )
                    }
                );

            if (!apiResponse.ok) {
                throw new Error(
                    `API HTTP ${apiResponse.status}`
                );
            }

            const data =
                await apiResponse.json();

            if (!data?.success) {
                throw new Error(
                    data?.message ||
                    data?.error ||
                    'API request failed'
                );
            }

            // ================= GET MEDIA URL =================

            const downloadUrl =
                getDownloadUrl(
                    data.result
                ) ||
                getDownloadUrl(data);

            if (!downloadUrl) {
                throw new Error(
                    'No video download URL returned by API'
                );
            }

            // ================= DOWNLOAD =================

            const buffer =
                await downloadVideo(
                    downloadUrl
                );

            if (!buffer.length) {
                throw new Error(
                    'Downloaded video is empty'
                );
            }

            const size =
                (
                    buffer.length /
                    1024 /
                    1024
                ).toFixed(2);

            const title =
                data.result?.title ||
                data.result?.name ||
                'Video';

            // ================= SEND =================

            await sock.sendMessage(
                chatId,
                {
                    video: buffer,

                    mimetype:
                        'video/mp4',

                    caption:
`╔═|〔  VIDEO 〕
║
║ ▸ *Status* : ✅ Downloaded
║ ▸ *Title*  : ${title}
║ ▸ *Size*   : ${size} MB
║
╚═|〔 ${botName} 〕`
                },
                {
                    quoted: msg
                }
            );

            // ================= SUCCESS =================

            try {
                await sock.sendMessage(
                    chatId,
                    {
                        react: {
                            text: '✅',
                            key: msg.key
                        }
                    }
                );
            } catch {}

        } catch (error) {

            console.error(
                '[VIDEO ERROR]',
                error
            );

            try {
                await sock.sendMessage(
                    chatId,
                    {
                        react: {
                            text: '❌',
                            key: msg.key
                        }
                    }
                );
            } catch {}

            await sock.sendMessage(
                chatId,
                {
                    text:
`╔═|〔  VIDEO 〕
║
║ ▸ *Status* : ❌ Failed
║ ▸ *Reason* : ${
    error?.message ||
    'Unknown error'
}
║
╚═|〔 ${botName} 〕`
                },
                {
                    quoted: msg
                }
            );
        }
    }
};
