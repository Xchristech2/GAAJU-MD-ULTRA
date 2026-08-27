'use strict';

const fs = require('fs');
const path = require('path');

const { getBotName } = require('../../lib/botname');

/*
|--------------------------------------------------------------------------
| MENU IMAGE PATHS
|--------------------------------------------------------------------------
*/

const ASSETS_DIR = path.join(
    __dirname,
    '../../../assets'
);

const CUSTOM_MENU_IMAGE = path.join(
    ASSETS_DIR,
    'menu-image.jpg'
);

const BACKUP_MENU_IMAGE = path.join(
    ASSETS_DIR,
    'menu-image.backup.jpg'
);


/*
|--------------------------------------------------------------------------
| SEND MESSAGE HELPER
|--------------------------------------------------------------------------
*/

async function send(sock, chatId, text, msg) {

    return sock.sendMessage(
        chatId,
        {
            text
        },
        {
            quoted: msg
        }
    );
}


/*
|--------------------------------------------------------------------------
| COMMAND
|--------------------------------------------------------------------------
*/

module.exports = {

    name: 'menuimage',

    aliases: [],

    description:
        'Turn the menu image on or off',

    category: 'utility',

    async execute(
        sock,
        msg,
        args,
        prefix,
        ctx
    ) {

        const chatId =
            msg.key.remoteJid;

        const botName =
            getBotName();

        const p =
            prefix || '.';

        const action =
            String(args?.[0] || '')
                .toLowerCase()
                .trim();


        /*
        |--------------------------------------------------------------------------
        | REACTION
        |--------------------------------------------------------------------------
        */

        try {

            await sock.sendMessage(
                chatId,
                {
                    react: {
                        text: '🖼️',
                        key: msg.key
                    }
                }
            );

        } catch {}


        /*
        |--------------------------------------------------------------------------
        | HELP
        |--------------------------------------------------------------------------
        */

        if (!action) {

            return send(
                sock,
                chatId,

`┏━━❐ 🖼️ MENU IMAGE ❐
┃✦ ${p}menuimage off
┃✦ ${p}menuimage on
┃✦ ${p}menuimage status
┗━━❐

┏━━❐ ✦ INFORMATION ✦ ❐
┃✦ off    → Remove menu image
┃✦ on     → Restore menu image
┃✦ status → Check current mode
┗━━❐

┏━━❐ ✦ ${botName} ✦ ❐
┃✦ Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ
┗━━❐`,
                msg
            );

        }


        /*
        |--------------------------------------------------------------------------
        | STATUS
        |--------------------------------------------------------------------------
        */

        if (action === 'status') {

            let status;

            if (
                fs.existsSync(
                    CUSTOM_MENU_IMAGE
                )
            ) {

                status =
                    '🖼️ Menu image is ACTIVE';

            } else {

                status =
                    '📝 Menu image is OFF — text-only menu';

            }


            return send(
                sock,
                chatId,

`┏━━❐ 🖼️ MENU IMAGE ❐
┃✦ Status : ${status}
┗━━❐

┏━━❐ ✦ ${botName} ✦ ❐
┃✦ Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ
┗━━❐`,
                msg
            );

        }


        /*
        |--------------------------------------------------------------------------
        | TURN IMAGE OFF
        |--------------------------------------------------------------------------
        */

        if (
            action === 'off' ||
            action === 'remove'
        ) {

            try {

                /*
                 * If image is already off,
                 * do nothing.
                 */

                if (
                    !fs.existsSync(
                        CUSTOM_MENU_IMAGE
                    )
                ) {

                    return send(
                        sock,
                        chatId,

`┏━━❐ 🖼️ MENU IMAGE ❐
┃✦ Status : ℹ️ Already OFF
┃✦ Menu   : 📝 Text only
┗━━❐

┃✦ No menu image will be used.`,
                        msg
                    );

                }


                /*
                 * Remove old backup first.
                 */

                if (
                    fs.existsSync(
                        BACKUP_MENU_IMAGE
                    )
                ) {

                    try {

                        fs.unlinkSync(
                            BACKUP_MENU_IMAGE
                        );

                    } catch {}

                }


                /*
                 * Save the current custom
                 * image so "on" can restore it.
                 */

                fs.renameSync(
                    CUSTOM_MENU_IMAGE,
                    BACKUP_MENU_IMAGE
                );


                return send(
                    sock,
                    chatId,

`┏━━❐ 🖼️ MENU IMAGE ❐
┃✦ Status : ✅ OFF
┃✦ Image  : ❌ Removed
┃✦ Menu   : 📝 Text only
┗━━❐

┃✦ The menu will no longer
┃  show any image or old logo.

┏━━❐ ✦ RESTORE ✦ ❐
┃✦ Use ${p}menuimage on
┃  to restore the image.

┏━━❐ ✦ ${botName} ✦ ❐
┃✦ Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ
┗━━❐`,
                    msg
                );

            } catch (error) {

                console.error(
                    '[MENUIMAGE OFF ERROR]',
                    error
                );

                return send(
                    sock,
                    chatId,

`┏━━❐ 🖼️ MENU IMAGE ❐
┃✦ Status : ❌ Failed
┃✦ Reason : ${error?.message || error}
┗━━❐`,
                    msg
                );

            }

        }


        /*
        |--------------------------------------------------------------------------
        | TURN IMAGE ON
        |--------------------------------------------------------------------------
        */

        if (
            action === 'on' ||
            action === 'restore'
        ) {

            try {

                /*
                 * Image is already active.
                 */

                if (
                    fs.existsSync(
                        CUSTOM_MENU_IMAGE
                    )
                ) {

                    return send(
                        sock,
                        chatId,

`┏━━❐ 🖼️ MENU IMAGE ❐
┃✦ Status : ℹ️ Already ON
┃✦ Menu   : 🖼️ Image
┗━━❐`,
                        msg
                    );

                }


                /*
                 * Check for saved image.
                 */

                if (
                    !fs.existsSync(
                        BACKUP_MENU_IMAGE
                    )
                ) {

                    return send(
                        sock,
                        chatId,

`┏━━❐ 🖼️ MENU IMAGE ❐
┃✦ Status : ❌ Cannot restore
┃✦ Reason : No saved menu image
┗━━❐

┃✦ Set/upload the menu image
┃  again before using:

┃✦ ${p}menuimage on`,
                        msg
                    );

                }


                /*
                 * Restore image.
                 */

                fs.renameSync(
                    BACKUP_MENU_IMAGE,
                    CUSTOM_MENU_IMAGE
                );


                return send(
                    sock,
                    chatId,

`┏━━❐ 🖼️ MENU IMAGE ❐
┃✦ Status : ✅ ON
┃✦ Image  : 🖼️ Restored
┃✦ Menu   : Image enabled
┗━━❐

┃✦ Your custom menu image
┃  is active again.

┏━━❐ ✦ ${botName} ✦ ❐
┃✦ Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ
┗━━❐`,
                    msg
                );

            } catch (error) {

                console.error(
                    '[MENUIMAGE ON ERROR]',
                    error
                );

                return send(
                    sock,
                    chatId,

`┏━━❐ 🖼️ MENU IMAGE ❐
┃✦ Status : ❌ Failed
┃✦ Reason : ${error?.message || error}
┗━━❐`,
                    msg
                );

            }

        }


        /*
        |--------------------------------------------------------------------------
        | UNKNOWN OPTION
        |--------------------------------------------------------------------------
        */

        return send(
            sock,
            chatId,

`┏━━❐ 🖼️ MENU IMAGE ❐
┃✦ Unknown option : ${action}
┗━━❐

┏━━❐ ✦ AVAILABLE ✦ ❐
┃✦ ${p}menuimage off
┃✦ ${p}menuimage on
┃✦ ${p}menuimage status
┗━━❐`,
            msg
        );

    }

};
