'use strict';

const {
  getTarget,
  resolveDisplay,
  checkPrivilege
} = require("../../lib/groupUtils");

const {
  getBotName
} = require("../../lib/botname");

const fs = require("fs");
const path = require("path");

const WARN_FILE = path.join(
  __dirname,
  "../../data/warnings.json"
);

const MAX_WARNS = 3;

/*
|--------------------------------------------------------------------------
| WARN STORAGE
|--------------------------------------------------------------------------
*/

function loadWarns() {
  try {
    return JSON.parse(
      fs.readFileSync(WARN_FILE, "utf8")
    );
  } catch {
    return {};
  }
}

function saveWarns(data) {
  fs.mkdirSync(
    path.dirname(WARN_FILE),
    { recursive: true }
  );

  fs.writeFileSync(
    WARN_FILE,
    JSON.stringify(data, null, 2)
  );
}

function getKey(groupId, userId) {
  return (
    groupId +
    "::" +
    userId.split("@")[0].split(":")[0]
  );
}

/*
|--------------------------------------------------------------------------
| GAAJU MENU STYLE
|--------------------------------------------------------------------------
*/

function box(title, content, botName) {
  return [
    `┏━━❐ ${title} ❐`,
    `┃`,
    ...content.map(line => `┃✦ ${line}`),
    `┃`,
    `┗━━❐ ${botName} ❐`
  ].join("\n");
}

/*
|--------------------------------------------------------------------------
| COMMANDS
|--------------------------------------------------------------------------
*/

module.exports = [

  /*
  |--------------------------------------------------------------------------
  | WARN
  |--------------------------------------------------------------------------
  */

  {
    name: "warn",

    aliases: [
      "warning"
    ],

    description:
      "Warn a group member — auto-kick at 3 warns",

    category: "group",

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
        prefix || ".";

      try {
        await sock.sendMessage(
          chatId,
          {
            react: {
              text: "⚠️",
              key: msg.key
            }
          }
        );
      } catch {}

      /*
      |--------------------------------------------------------------------------
      | GROUP ONLY
      |--------------------------------------------------------------------------
      */

      if (!chatId.endsWith("@g.us")) {

        return sock.sendMessage(
          chatId,
          {
            text: box(
              "⚠️ WARN",
              [
                "Status: ❌ Group only",
                `Usage: ${p}warn @user [reason]`
              ],
              botName
            )
          },
          {
            quoted: msg
          }
        );
      }

      /*
      |--------------------------------------------------------------------------
      | PERMISSION
      |--------------------------------------------------------------------------
      */

      const {
        ok
      } = await checkPrivilege(
        sock,
        chatId,
        msg,
        ctx
      );

      if (!ok) {

        return sock.sendMessage(
          chatId,
          {
            text: box(
              "⚠️ WARN",
              [
                "Status: ❌ Permission denied",
                "Reason: Sudo users and group admins only"
              ],
              botName
            )
          },
          {
            quoted: msg
          }
        );
      }

      /*
      |--------------------------------------------------------------------------
      | TARGET
      |--------------------------------------------------------------------------
      */

      const target =
        getTarget(
          msg,
          args
        );

      if (!target) {

        return sock.sendMessage(
          chatId,
          {
            text: box(
              "⚠️ WARN",
              [
                `Usage: ${p}warn @user [reason]`,
                "You can also reply to the user's message."
              ],
              botName
            )
          },
          {
            quoted: msg
          }
        );
      }

      /*
      |--------------------------------------------------------------------------
      | REASON
      |--------------------------------------------------------------------------
      */

      const reason =
        args
          .filter(
            x => !x.startsWith("@")
          )
          .join(" ")
          .trim() ||
        "No reason given";

      /*
      |--------------------------------------------------------------------------
      | USER DISPLAY
      |--------------------------------------------------------------------------
      */

      const display =
        await resolveDisplay(
          sock,
          chatId,
          target
        );

      /*
      |--------------------------------------------------------------------------
      | SAVE WARNING
      |--------------------------------------------------------------------------
      */

      const warns =
        loadWarns();

      const key =
        getKey(
          chatId,
          target
        );

      warns[key] =
        (warns[key] || 0) + 1;

      saveWarns(warns);

      const count =
        warns[key];

      /*
      |--------------------------------------------------------------------------
      | AUTO KICK
      |--------------------------------------------------------------------------
      */

      let action = "";

      if (count >= MAX_WARNS) {

        try {

          await sock.groupParticipantsUpdate(
            chatId,
            [target],
            "remove"
          );

          action =
            `Action: 🚫 Auto-kicked (${MAX_WARNS} warns)`;

          warns[key] = 0;

          saveWarns(warns);

        } catch {

          action =
            "Action: ❌ Could not remove user";
        }
      }

      /*
      |--------------------------------------------------------------------------
      | RESULT
      |--------------------------------------------------------------------------
      */

      return sock.sendMessage(
        chatId,
        {
          text: box(
            "⚠️ WARN",
            [
              `User: ${display}`,
              `Reason: ${reason}`,
              `Warns: ${Math.min(
                count,
                MAX_WARNS
              )}/${MAX_WARNS}`,
              ...(action
                ? [action]
                : [])
            ],
            botName
          )
        },
        {
          quoted: msg
        }
      );
    }
  },

  /*
  |--------------------------------------------------------------------------
  | WARNS
  |--------------------------------------------------------------------------
  */

  {
    name: "warns",

    aliases: [
      "warnlist",
      "checkwarn"
    ],

    description:
      "Check how many warnings a user has",

    category: "group",

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
        prefix || ".";

      try {
        await sock.sendMessage(
          chatId,
          {
            react: {
              text: "📋",
              key: msg.key
            }
          }
        );
      } catch {}

      if (!chatId.endsWith("@g.us")) {

        return sock.sendMessage(
          chatId,
          {
            text: box(
              "📋 WARNS",
              [
                "Status: ❌ Group only"
              ],
              botName
            )
          },
          {
            quoted: msg
          }
        );
      }

      const target =
        getTarget(
          msg,
          args
        );

      if (!target) {

        return sock.sendMessage(
          chatId,
          {
            text: box(
              "📋 WARNS",
              [
                `Usage: ${p}warns @user`,
                "You can also reply to a user's message."
              ],
              botName
            )
          },
          {
            quoted: msg
          }
        );
      }

      const display =
        await resolveDisplay(
          sock,
          chatId,
          target
        );

      const warns =
        loadWarns();

      const count =
        warns[
          getKey(
            chatId,
            target
          )
        ] || 0;

      return sock.sendMessage(
        chatId,
        {
          text: box(
            "📋 WARNS",
            [
              `User: ${display}`,
              `Warnings: ${count}/${MAX_WARNS}`,
              count >= MAX_WARNS
                ? "Status: 🚫 Maximum reached"
                : "Status: ✅ Active"
            ],
            botName
          )
        },
        {
          quoted: msg
        }
      );
    }
  },

  /*
  |--------------------------------------------------------------------------
  | RESET WARN
  |--------------------------------------------------------------------------
  */

  {
    name: "resetwarn",

    aliases: [
      "clearwarn",
      "unwarn"
    ],

    description:
      "Reset warnings for a user",

    category: "group",

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
        prefix || ".";

      try {
        await sock.sendMessage(
          chatId,
          {
            react: {
              text: "🔄",
              key: msg.key
            }
          }
        );
      } catch {}

      if (!chatId.endsWith("@g.us")) {

        return sock.sendMessage(
          chatId,
          {
            text: box(
              "🔄 RESET WARN",
              [
                "Status: ❌ Group only"
              ],
              botName
            )
          },
          {
            quoted: msg
          }
        );
      }

      const {
        ok
      } = await checkPrivilege(
        sock,
        chatId,
        msg,
        ctx
      );

      if (!ok) {

        return sock.sendMessage(
          chatId,
          {
            text: box(
              "🔄 RESET WARN",
              [
                "Status: ❌ Permission denied",
                "Reason: Sudo users and group admins only"
              ],
              botName
            )
          },
          {
            quoted: msg
          }
        );
      }

      const target =
        getTarget(
          msg,
          args
        );

      if (!target) {

        return sock.sendMessage(
          chatId,
          {
            text: box(
              "🔄 RESET WARN",
              [
                `Usage: ${p}resetwarn @user`,
                "You can also reply to a user's message."
              ],
              botName
            )
          },
          {
            quoted: msg
          }
        );
      }

      const display =
        await resolveDisplay(
          sock,
          chatId,
          target
        );

      const warns =
        loadWarns();

      warns[
        getKey(
          chatId,
          target
        )
      ] = 0;

      saveWarns(warns);

      return sock.sendMessage(
        chatId,
        {
          text: box(
            "🔄 RESET WARN",
            [
              `User: ${display}`,
              "Status: ✅ Warnings cleared",
              "Warnings: 0/3"
            ],
            botName
          )
        },
        {
          quoted: msg
        }
      );
    }
  }

];

No "CHANNEL_ID", no "CHANNEL_LINK", and no View Channel code is included.
