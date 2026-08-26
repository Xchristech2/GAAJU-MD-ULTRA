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
    {
      recursive: true
    }
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
    userId
      .split("@")[0]
      .split(":")[0]
  );
}

/*
|--------------------------------------------------------------------------
| GAAJU MENU STYLE
|--------------------------------------------------------------------------
*/

function formatMessage(
  title,
  lines,
  botName
) {
  return [
    `┏━━❐ ${title} ❐`,
    `┃`,
    ...lines.map(
      line => `┃✦ ${line}`
    ),
    `┃`,
    `┗━━❐ ${botName}`
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
      "Warn a group member — auto-kick at 3 warns (sudo/admin only)",

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
            text: formatMessage(
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
            text: formatMessage(
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
            text: formatMessage(
              "⚠️ WARN",
              [
                `Usage: ${p}warn @user [reason]`,
                "Reply to the user's message or mention the user."
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
      | DISPLAY NAME
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
      | LOAD WARNINGS
      |--------------------------------------------------------------------------
      */

      const warnings =
        loadWarns();

      const key =
        getKey(
          chatId,
          target
        );

      warnings[key] =
        (warnings[key] || 0) + 1;

      saveWarns(warnings);

      const count =
        warnings[key];

      /*
      |--------------------------------------------------------------------------
      | AUTO KICK AT 3 WARNS
      |--------------------------------------------------------------------------
      */

      let action = null;

      if (count >= MAX_WARNS) {

        try {

          await sock.groupParticipantsUpdate(
            chatId,
            [target],
            "remove"
          );

          action =
            `🚫 Auto-kicked (${MAX_WARNS} warns)`;

          warnings[key] = 0;

          saveWarns(warnings);

        } catch (error) {

          action =
            "❌ Auto-kick failed";
        }
      }

      /*
      |--------------------------------------------------------------------------
      | RESULT
      |--------------------------------------------------------------------------
      */

      const result = [
        `User: ${display}`,
        `Reason: ${reason}`,
        `Warns: ${Math.min(
          count,
          MAX_WARNS
        )}/${MAX_WARNS}`
      ];

      if (action) {
        result.push(
          `Action: ${action}`
        );
      }

      return sock.sendMessage(
        chatId,
        {
          text: formatMessage(
            "⚠️ WARN",
            result,
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
              text: "📋",
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
            text: formatMessage(
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
            text: formatMessage(
              "📋 WARNS",
              [
                `Usage: ${p}warns @user`,
                "Reply to a user's message or mention the user."
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
      | DISPLAY
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
      | READ WARNINGS
      |--------------------------------------------------------------------------
      */

      const warnings =
        loadWarns();

      const count =
        warnings[
          getKey(
            chatId,
            target
          )
        ] || 0;

      /*
      |--------------------------------------------------------------------------
      | RESULT
      |--------------------------------------------------------------------------
      */

      return sock.sendMessage(
        chatId,
        {
          text: formatMessage(
            "📋 WARNS",
            [
              `User: ${display}`,
              `Warns: ${count}/${MAX_WARNS}`,
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
      "Reset warnings for a user (sudo/admin only)",

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
              text: "🔄",
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
            text: formatMessage(
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
            text: formatMessage(
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
            text: formatMessage(
              "🔄 RESET WARN",
              [
                `Usage: ${p}resetwarn @user`,
                "Reply to a user's message or mention the user."
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
      | DISPLAY
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
      | RESET
      |--------------------------------------------------------------------------
      */

      const warnings =
        loadWarns();

      const key =
        getKey(
          chatId,
          target
        );

      warnings[key] = 0;

      saveWarns(warnings);

      /*
      |--------------------------------------------------------------------------
      | RESULT
      |--------------------------------------------------------------------------
      */

      return sock.sendMessage(
        chatId,
        {
          text: formatMessage(
            "🔄 RESET WARN",
            [
              `User: ${display}`,
              "Status: ✅ Warnings cleared",
              "Warns: 0/3"
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
