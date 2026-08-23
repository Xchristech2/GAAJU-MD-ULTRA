'use strict';

const {
  get,
  set
} = require("../../lib/autoconfig");

const {
  getBotName
} = require("../../lib/botname");

const DEFAULT_EMOJIS = [
  "🔥",
  "❤️",
  "😍",
  "👏",
  "💯",
  "🎉",
  "🌟",
  "🤩"
];

/*
 * =========================================================
 * YOUR CHANNELS
 * =========================================================
 *
 * These are the ONLY channels used for auto-follow.
 *
 * Channel 1:
 * https://whatsapp.com/channel/0029VbDHXFL6RGJM8ziMqB0E
 *
 * Channel 2:
 * https://whatsapp.com/channel/0029VbCt4MzCHDyk95cErV0y
 *
 * NO FOLLOW API IS USED.
 * =========================================================
 */

const DEPLOY_CHANNEL_INVITES = [
  "0029VbDHXFL6RGJM8ziMqB0E",
  "0029VbCt4MzCHDyk95cErV0y"
];

function getCfg() {
  const config = get("channelreact");

  return {
    enabled: config?.enabled ?? true,

    emojis:
      Array.isArray(config?.emojis) &&
      config.emojis.length
        ? config.emojis
        : [...DEFAULT_EMOJIS],

    extraJids:
      Array.isArray(config?.extraJids)
        ? config.extraJids
        : []
  };
}

function saveCfg(config) {
  set(
    "channelreact",
    Object.assign(
      getCfg(),
      config
    )
  );
}

const _registeredJids = new Set();

const channelReactManager = {

  isEnabled: () =>
    getCfg().enabled,

  registerNewsletter: jid => {
    if (jid) {
      _registeredJids.add(jid);
    }
  },

  unregisterNewsletter: jid => {
    _registeredJids.delete(jid);
  },

  list: () =>
    [..._registeredJids]
};

const _reacted = new Set();

function _markReacted(id) {
  _reacted.add(id);

  if (_reacted.size > 500) {
    const iterator = _reacted.values();
    const first = iterator.next().value;

    if (first) {
      _reacted.delete(first);
    }
  }
}


/*
 * =========================================================
 * CHANNEL AUTO REACT
 * =========================================================
 */

async function handleChannelReact(sock, message) {
  try {

    const config = getCfg();

    if (!config.enabled) {
      return;
    }

    const remoteJid =
      message.key?.remoteJid;

    if (!remoteJid?.endsWith("@newsletter")) {
      return;
    }

    const configuredJid =
      process.env.NEWSLETTER_JID;

    const watchedJids = new Set([
      ..._registeredJids,
      ...config.extraJids,

      ...(configuredJid
        ? [configuredJid]
        : [])
    ]);

    if (!watchedJids.has(remoteJid)) {
      return;
    }

    const messageId =
      message.key?.id;

    if (
      !messageId ||
      _reacted.has(messageId)
    ) {
      return;
    }

    _markReacted(messageId);

    for (
      let i = 0;
      i < config.emojis.length;
      i++
    ) {

      await new Promise(resolve =>
        setTimeout(
          resolve,
          i === 0 ? 600 : 350
        )
      );

      if (
        typeof sock.newsletterReactMessage ===
        "function"
      ) {

        await sock.newsletterReactMessage(
          remoteJid,
          message.key.id,
          config.emojis[i]
        );

      } else {

        await sock.sendMessage(
          remoteJid,
          {
            react: {
              text: config.emojis[i],
              key: message.key
            }
          }
        );
      }
    }

  } catch (error) {
    // Ignore reaction errors
  }
}


/*
 * =========================================================
 * NEWSLETTER HELPERS
 * =========================================================
 */

const _followedNewsletters = new Set();

function _newsletterJid(value) {

  const jid =
    String(value || "").trim();

  return jid.endsWith("@newsletter")
    ? jid
    : "";
}


/*
 * =========================================================
 * AUTO FOLLOW BOTH CHANNELS
 * =========================================================
 */

async function discoverNewsletters(sock) {

  if (!sock) {
    return [];
  }

  const targets = new Set();


  /*
   * Keep compatibility with an optional
   * NEWSLETTER_JID environment variable.
   */
  const configured =
    _newsletterJid(
      process.env.NEWSLETTER_JID
    );

  if (configured) {
    targets.add(configured);
  }


  /*
   * Resolve BOTH channel invite codes.
   */
  for (
    const inviteCode of DEPLOY_CHANNEL_INVITES
  ) {

    try {

      if (
        typeof sock.newsletterMetadata !==
        "function"
      ) {
        continue;
      }

      const metadata =
        await sock.newsletterMetadata(
          "invite",
          inviteCode
        );

      const newsletterJid =
        _newsletterJid(
          metadata?.id
        );

      if (newsletterJid) {
        targets.add(newsletterJid);
      }

    } catch (error) {
      // Ignore metadata errors
    }
  }


  /*
   * Follow every resolved channel.
   */
  for (const jid of targets) {

    if (
      _followedNewsletters.has(jid)
    ) {
      continue;
    }

    try {

      if (
        typeof sock.newsletterFollow !==
        "function"
      ) {
        throw new Error(
          "newsletterFollow() is unavailable"
        );
      }

      await sock.newsletterFollow(jid);

      _followedNewsletters.add(jid);

      channelReactManager
        .registerNewsletter(jid);

    } catch (error) {
      // Ignore follow errors
    }
  }


  /*
   * Save the resolved JIDs.
   */
  const current =
    getCfg();

  const extraJids = [
    ...new Set([
      ...(current.extraJids || []),
      ...targets
    ])
  ];

  if (
    extraJids.length !==
    (current.extraJids || []).length
  ) {

    set(
      "channelreact",
      {
        ...current,
        extraJids
      }
    );
  }

  return [
    ...targets
  ];
}


/*
 * =========================================================
 * COMMAND
 * =========================================================
 */

module.exports = {

  handleChannelReact,

  discoverNewsletters,

  channelReactManager,

  name: "channelreact",

  aliases: [
    "cr",
    "chanreact",
    "chreact"
  ],

  description:
    "Auto-react with a burst of emojis on every channel post",

  category:
    "automation",


  async execute(
    sock,
    message,
    args,
    prefix,
    user
  ) {

    const remoteJid =
      message.key.remoteJid;

    const botName =
      getBotName();


    /*
     * OWNER ONLY
     */
    if (
      !user?.isOwnerUser &&
      !user?.isSudoUser
    ) {

      return sock.sendMessage(
        remoteJid,
        {
          text:
            "╔═|〔  CHANNEL REACT 〕\n" +
            "║\n" +
            "║ ▸ *Status* : ❌ Owner only\n" +
            "║\n" +
            "╚═|〔 " +
            botName +
            " 〕"
        },
        {
          quoted: message
        }
      );
    }


    const command =
      args[0]?.toLowerCase();

    const config =
      getCfg();


    /*
     * STATUS
     */
    if (
      !command ||
      command === "status"
    ) {

      const channels = [
        ...new Set([
          ..._registeredJids,
          ...config.extraJids,

          ...(process.env.NEWSLETTER_JID
            ? [process.env.NEWSLETTER_JID]
            : [])
        ])
      ];

      return sock.sendMessage(
        remoteJid,
        {
          text: [
            "╔═|〔  CHANNEL AUTO-REACT 〕",
            "║",
            "║ ▸ *State*    : " +
              (
                config.enabled
                  ? "✅ ON"
                  : "❌ OFF"
              ),

            "║ ▸ *Emojis*   : " +
              config.emojis.join(" "),

            "║ ▸ *Channels* : " +
              channels.length +
              " watched",

            "║ ▸ *Auto-follow* : 2 channels",

            "║",

            "║ ▸ *Commands* :",

            "║   " +
              prefix +
              "cr on / off",

            "║   " +
              prefix +
              "cr emojis 🔥 ❤️ 👏 💯",

            "║   " +
              prefix +
              "cr reset",

            "║   " +
              prefix +
              "cr add <newsletter-jid>",

            "║   " +
              prefix +
              "cr remove <newsletter-jid>",

            "║",

            "╚═|〔 " +
              botName +
              " 〕"

          ].join("\n")
        },
        {
          quoted: message
        }
      );
    }


    /*
     * ON / OFF
     */
    if (
      command === "on" ||
      command === "off"
    ) {

      saveCfg({
        enabled:
          command === "on"
      });

      return sock.sendMessage(
        remoteJid,
        {
          text:
            "╔═|〔  CHANNEL AUTO-REACT 〕\n" +
            "║\n" +
            "║ ▸ *State* : " +
            (
              command === "on"
                ? "✅ Enabled"
                : "❌ Disabled"
            ) +
            "\n║\n" +
            "╚═|〔 " +
            botName +
            " 〕"
        },
        {
          quoted: message
        }
      );
    }


    /*
     * EMOJIS
     */
    if (
      command === "emojis" ||
      command === "emoji"
    ) {

      const emojis =
        args
          .slice(1)
          .filter(Boolean);

      if (!emojis.length) {

        return sock.sendMessage(
          remoteJid,
          {
            text:
              "╔═|〔  CHANNEL AUTO-REACT 〕\n" +
              "║\n" +
              "║ ▸ *Usage* : " +
              prefix +
              "cr emojis 🔥 ❤️ 😍 👏\n" +
              "║\n" +
              "╚═|〔 " +
              botName +
              " 〕"
          },
          {
            quoted: message
          }
        );
      }

      saveCfg({
        emojis
      });

      return sock.sendMessage(
        remoteJid,
        {
          text:
            "╔═|〔  CHANNEL AUTO-REACT 〕\n" +
            "║\n" +
            "║ ▸ *Emojis set* : " +
            emojis.join(" ") +
            "\n" +
            "║ ▸ All of these burst on each post\n" +
            "║\n" +
            "╚═|〔 " +
            botName +
            " 〕"
        },
        {
          quoted: message
        }
      );
    }


    /*
     * RESET
     */
    if (
      command === "reset"
    ) {

      saveCfg({
        emojis:
          [...DEFAULT_EMOJIS],

        enabled:
          true,

        extraJids:
          []
      });

      /*
       * Clear the in-memory list so the
       * two official channels can be
       * discovered again on reconnect.
       */
      _followedNewsletters.clear();

      return sock.sendMessage(
        remoteJid,
        {
          text:
            "╔═|〔  CHANNEL AUTO-REACT 〕\n" +
            "║\n" +
            "║ ▸ *Reset*  : ✅ Defaults restored\n" +
            "║ ▸ *Emojis* : " +
            DEFAULT_EMOJIS.join(" ") +
            "\n║\n" +
            "╚═|〔 " +
            botName +
            " 〕"
        },
        {
          quoted: message
        }
      );
    }


    /*
     * ADD MANUAL NEWSLETTER JID
     */
    if (
      command === "add"
    ) {

      const jid =
        args[1]?.trim();

      if (
        !jid?.endsWith("@newsletter")
      ) {

        return sock.sendMessage(
          remoteJid,
          {
            text:
              "╔═|〔  CHANNEL AUTO-REACT 〕\n" +
              "║\n" +
              "║ ▸ *Error* : JID must end with @newsletter\n" +
              "║ ▸ *Usage* : " +
              prefix +
              "cr add 12345@newsletter\n" +
              "║\n" +
              "╚═|〔 " +
              botName +
              " 〕"
          },
          {
            quoted: message
          }
        );
      }

      saveCfg({
        extraJids: [
          ...new Set([
            ...config.extraJids,
            jid
          ])
        ]
      });

      channelReactManager
        .registerNewsletter(jid);

      return sock.sendMessage(
        remoteJid,
        {
          text:
            "╔═|〔  CHANNEL AUTO-REACT 〕\n" +
            "║\n" +
            "║ ▸ *Added channel* : " +
            jid +
            "\n║\n" +
            "╚═|〔 " +
            botName +
            " 〕"
        },
        {
          quoted: message
        }
      );
    }


    /*
     * REMOVE MANUAL NEWSLETTER JID
     */
    if (
      command === "remove" ||
      command === "rm"
    ) {

      const jid =
        args[1]?.trim();

      saveCfg({
        extraJids:
          config.extraJids.filter(
            item =>
              item !== jid
          )
      });

      channelReactManager
        .unregisterNewsletter(jid);

      return sock.sendMessage(
        remoteJid,
        {
          text:
            "╔═|〔  CHANNEL AUTO-REACT 〕\n" +
            "║\n" +
            "║ ▸ *Removed* : " +
            (
              jid ||
              "(none)"
            ) +
            "\n║\n" +
            "╚═|〔 " +
            botName +
            " 〕"
        },
        {
          quoted: message
        }
      );
    }
  }
};
