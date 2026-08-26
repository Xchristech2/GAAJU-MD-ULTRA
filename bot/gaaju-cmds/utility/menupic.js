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

const DEFAULT_MENU_IMAGE = path.join(
    ASSETS_DIR,
    'xd-logo.jpg'
);

/*
|--------------------------------------------------------------------------
| BACKUP FILE
|--------------------------------------------------------------------------
|
| When the custom menu image is removed, it is moved here.
| This allows .menupic restore to bring it back.
|
*/

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

    name: 'menupic',

    aliases: [
        'menuimage',
        'menupicture',
        'menuphoto'
    ],

    description:
        'Manage the bot menu image',

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

`┏━━❐ 🖼️ MENU PICTURE ❐
┃✦ ${p}menupic remove
┃✦ ${p}menupic restore
┃✦ ${p}menupic status
┗━━❐

┏━━❐ ✦ INFORMATION ✦ ❐
┃✦ remove  → Use normal menu image
┃✦ restore → Restore custom image
┃✦ status  → Check current image
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

            let status =
                '❌ No menu image found';

            if (
                fs.existsSync(
                    CUSTOM_MENU_IMAGE
                )
            ) {

                status =
                    '🖼️ Custom menu image is ACTIVE';

            } else if (
                fs.existsSync(
                    DEFAULT_MENU_IMAGE
                )
            ) {

                status =
                    '🖼️ Normal/default menu image is ACTIVE';

            }


            return send(
                sock,
                chatId,

`┏━━❐ 🖼️ MENU PICTURE ❐
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
        | REMOVE CUSTOM MENU IMAGE
        |--------------------------------------------------------------------------
        */

        if (
            action === 'remove' ||
            action === 'delete' ||
            action === 'off'
        ) {

            try {

                /*
                 * If custom image doesn't exist,
                 * check whether it was already backed up.
                 */

                if (
                    !fs.existsSync(
                        CUSTOM_MENU_IMAGE
                    )
                ) {

                    if (
                        fs.existsSync(
                            BACKUP_MENU_IMAGE
                        )
                    ) {

                        return send(
                            sock,
                            chatId,

`┏━━❐ 🖼️ MENU PICTURE ❐
┃✦ Status : ℹ️ Already removed
┃✦ Menu   : Normal image
┗━━❐

┃✦ Use ${p}menupic restore
┃  to restore the custom image.

┏━━❐ ✦ ${botName} ✦ ❐
┃✦ Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ
┗━━❐`,
                            msg
                        );

                    }


                    return send(
                        sock,
                        chatId,

`┏━━❐ 🖼️ MENU PICTURE ❐
┃✦ Status : ℹ️ No custom image
┃✦ Menu   : Normal image
┗━━❐`,
                        msg
                    );

                }


                /*
                 * Remove an old backup first.
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
                 * Move custom image to backup.
                 */

                fs.renameSync(
                    CUSTOM_MENU_IMAGE,
                    BACKUP_MENU_IMAGE
                );


                /*
                 * Make sure default image exists.
                 */

                if (
                    !fs.existsSync(
                        DEFAULT_MENU_IMAGE
                    )
                ) {

                    return send(
                        sock,
                        chatId,

`┏━━❐ 🖼️ MENU PICTURE ❐
┃✦ Status : ⚠️ Removed
┃✦ Warning: Default image not found
┃✦ Path   : assets/xd-logo.jpg
┗━━❐`,
                        msg
                    );

                }


                return send(
                    sock,
                    chatId,

`┏━━❐ 🖼️ MENU PICTURE ❐
┃✦ Status : ✅ Removed
┃✦ Menu   : Normal image
┃✦ Backup : ✅ Saved
┗━━❐

┃✦ Your menu will now use
┃  the normal profile image.

┏━━❐ ✦ INFORMATION ✦ ❐
┃✦ Restore with:
┃✦ ${p}menupic restore
┗━━❐

┏━━❐ ✦ ${botName} ✦ ❐
┃✦ Powered by ᴄʜʀɪꜱ ɢᴀᴀᴊᴜ
┗━━❐`,
                    msg
                );

            } catch (error) {

                console.error(
                    '[MENUPIC REMOVE ERROR]',
                    error
                );

                return send(
                    sock,
                    chatId,

`┏━━❐ 🖼️ MENU PICTURE ❐
┃✦ Status : ❌ Failed
┃✦ Reason : ${error?.message || error}
┗━━❐`,
                    msg
                );

            }

        }


        /*
        |--------------------------------------------------------------------------
        | RESTORE CUSTOM MENU IMAGE
        |--------------------------------------------------------------------------
        */

        if (
            action === 'restore' ||
            action === 'on' ||
            action === 'back'
        ) {

            try {

                /*
                 * Custom image is already active.
                 */

                if (
                    fs.existsSync(
                        CUSTOM_MENU_IMAGE
                    )
                ) {

                    return send(
                        sock,
                        chatId,

`┏━━❐ 🖼️ MENU PICTURE ❐
┃✦ Status : ℹ️ Already active
┃✦ Menu   : Custom image
┗━━❐`,
                        msg
                    );

                }


                /*
                 * No backup available.
                 */

                if (
                    !fs.existsSync(
                        BACKUP_MENU_IMAGE
                    )
                ) {

                    return send(
                        sock,
                        chatId,

`┏━━❐ 🖼️ MENU PICTURE ❐
┃✦ Status : ❌ Cannot restore
┃✦ Reason : No backup image found
┗━━❐

┃✦ If you previously used
┃  .setmenuimage, upload/set
┃  the custom image again.`,
                        msg
                    );

                }


                /*
                 * Restore backup.
                 */

                fs.renameSync(
                    BACKUP_MENU_IMAGE,
                    CUSTOM_MENU_IMAGE
                );


                return send(
                    sock,
                    chatId,

`┏━━❐ 🖼️ MENU PICTURE ❐
┃✦ Status : ✅ Restored
┃✦ Menu   : Custom image
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
                    '[MENUPIC RESTORE ERROR]',
                    error
                );

                return send(
                    sock,
                    chatId,

`┏━━❐ 🖼️ MENU PICTURE ❐
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

`┏━━❐ 🖼️ MENU PICTURE ❐
┃✦ Unknown option : ${action}
┗━━❐

┏━━❐ ✦ AVAILABLE ✦ ❐
┃✦ ${p}menupic remove
┃✦ ${p}menupic restore
┃✦ ${p}menupic status
┗━━❐`,
            msg
        );

    }

};
