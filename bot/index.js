{
  const _fs = require("fs");
  const _path = require("path");
  const _stopFlag = _path.join(__dirname, "data", ".bot-stopped");
  if (_fs.existsSync(_stopFlag)) {
    process.exit(0);
  }
}
const originalConsoleMethods = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
  debug: console.debug,
  trace: console.trace,
  dir: console.dir,
  dirxml: console.dirxml,
  table: console.table
};
globalThis.originalConsoleMethods = originalConsoleMethods;
const _keepRef = {
  time: console.time,
  timeEnd: console.timeEnd,
  timeLog: console.timeLog,
  group: console.group,
  groupEnd: console.groupEnd,
  groupCollapsed: console.groupCollapsed,
  clear: console.clear,
  count: console.count,
  countReset: console.countReset,
  assert: console.assert,
  profile: console.profile,
  profileEnd: console.profileEnd,
  timeStamp: console.timeStamp,
  context: console.context
};
const _noisyTokens = ["closing session", "sessionentry", "registrationid", "currentratchet", "indexinfo", "pendingprekey", "ephemeralkeypair", "lastremoteephemeralkey", "rootkey", "basekey", "signalkey", "signalprotocol", "_chains", "chains", "chainkey", "ratchet", "cipher", "decrypt", "encrypt", "prekey", "signedkey", "identitykey", "sessionstate", "keystore", "senderkey", "groupcipher", "signalgroup", "signalstore", "signalrepository", "signalprotocolstore", "sessioncipher", "sessionbuilder", "senderkeystore", "senderkeydistribution", "keyexchange", "<buffer", "05 ", "0x", "pubkey", "privkey", "connection.update", "creds.update", "presence.update", "chat.update", "message.receipt.update", "message.update", "failed to decrypt", "received error", "sessionerror", "bad mac", "stream errored", "[asm-debug]", "interactive send:", "native_flow", "tag: 'biz'", "app state resync", "syncing critical app state", "[dotenv"];
const _importantTokens = ["command", "┌", "│", "└", "╔", "║", "╚", "✅", "❌", "👥", "👤", "📊", "🔧", "🐺", "🚀", "⚠️", "📱", "🗑️", "📤", "👑", "🎯", "🛡️", "🎵", "🎬", "📘", "📷", "💾", "🔒", "🔍", "💬"];
const shouldShowLog = args => {
  if (args.length === 0) {
    return true;
  }
  const firstArg = args[0];
  let lowerMsg;
  if (typeof firstArg === "string") {
    lowerMsg = firstArg.toLowerCase();
  } else if (firstArg && typeof firstArg === "object") {
    try {
      lowerMsg = JSON.stringify(firstArg).toLowerCase();
    } catch {
      return true;
    }
  } else {
    return true;
  }
  for (let i = 0; i < _importantTokens.length; i++) {
    if (lowerMsg.includes(_importantTokens[i])) {
      return true;
    }
  }
  for (let i = 0; i < _noisyTokens.length; i++) {
    if (lowerMsg.includes(_noisyTokens[i])) {
      return false;
    }
  }
  return true;
};
for (const method of Object.keys(originalConsoleMethods)) {
  if (typeof console[method] === "function") {
    console[method] = function (...args) {
      if (shouldShowLog(args)) {
        originalConsoleMethods[method].apply(console, args);
      }
    };
  }
}

// Process-level filtering
function setupProcessFilter() {
  const originalStdoutWrite = process.stdout.write;
  const originalStderrWrite = process.stderr.write;
  const _stdoutNoisy = ["closing session", "sessionentry", "registrationid", "currentratchet", "indexinfo", "pendingprekey", "_chains", "ephemeralkeypair", "lastremoteephemeralkey", "rootkey", "basekey", "signalprotocol", "ratchet", "chainkey", "senderkey", "groupcipher", "sessioncipher", "sessionbuilder", "interactive send", "native_flow", "tag: 'biz'", "app state resync", "syncing critical app state", "[dotenv"];
  const filterOutput = chunk => {
    if (typeof chunk !== "string" && !Buffer.isBuffer(chunk)) {
      return true;
    }
    const lowerChunk = (typeof chunk === "string" ? chunk : chunk.toString()).toLowerCase();
    if (lowerChunk.length < 5) {
      return true;
    }
    for (let i = 0; i < _stdoutNoisy.length; i++) {
      if (lowerChunk.includes(_stdoutNoisy[i])) {
        return false;
      }
    }
    return true;
  };
  process.stdout.write = function (chunk, encoding, callback) {
    if (filterOutput(chunk)) {
      return originalStdoutWrite.call(this, chunk, encoding, callback);
    }
    if (callback) {
      callback();
    }
    return true;
  };
  process.stderr.write = function (chunk, encoding, callback) {
    if (filterOutput(chunk)) {
      return originalStderrWrite.call(this, chunk, encoding, callback);
    }
    if (callback) {
      callback();
    }
    return true;
  };
}

// Set environment variables
process.env.DEBUG = "";
process.env.NODE_ENV = "production";
process.env.BAILEYS_LOG_LEVEL = "fatal";
process.env.PINO_LOG_LEVEL = "fatal";
process.env.BAILEYS_DISABLE_LOG = "true";
process.env.DISABLE_BAILEYS_LOG = "true";
process.env.PINO_DISABLE = "true";

// Import modules
const {
  fileURLToPath
} = require("url");
const {
  dirname,
  join
} = require("path");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const chalk = require("chalk");
const readline = require("readline");
const {
  exec,
  execSync
} = require("child_process");
const axios = require("axios");
const {
  normalizeMessageContent,
  downloadContentFromMessage,
  downloadMediaMessage,
  jidNormalizedUser,
  generateWAMessageFromContent,
  proto
} = require("@whiskeysockets/baileys");
const NodeCache = require("node-cache");
const {
  isSudoNumber,
  isSudoJid,
  getSudoMode,
  addSudoJid,
  mapLidToPhone,
  isSudoByLid,
  getPhoneFromLid,
  getSudoList,
  hasUnmappedSudos
} = require("./lib/sudo-store.js");
const db = require("./lib/database.js");
const {
  setConfigBotId
} = require("./lib/database.js");
const {
  useSQLiteAuthState,
  getSessionStats
} = require("./lib/authState.js");
const {
  getBotName: _getBotName,
  clearBotNameCache
} = require("./lib/botname.js");
const isGaajuAITrigger = () => false;
const handleGaajuAI = async () => false;
const isGaajuAIEnabled = () => false;
const isButtonModeEnabled = () => false;
const isChannelModeEnabled = () => false;
const getChannelInfo = () => ({});
const _activeCommandMap = new Map();
const setActiveCommand = (chatId, command, args, sender) => {
  if (chatId) {
    _activeCommandMap.set(chatId, {
      command: command || "",
      args: args || [],
      sender: sender || "",
      ts: Date.now()
    });
  }
};
const clearActiveCommand = chatId => {
  if (chatId) {
    _activeCommandMap.delete(chatId);
  }
};
const getActiveCommand = chatId => {
  if (!chatId) {
    return null;
  }
  const entry = _activeCommandMap.get(chatId);
  if (!entry) {
    return null;
  }
  if (Date.now() - entry.ts > 60000) {
    _activeCommandMap.delete(chatId);
    return null;
  }
  return entry;
};
const buildCommandButtons = () => [];
const {
  migrateSudoToSupabase,
  initSudo,
  setBotId
} = require("./lib/sudo-store.js");
const {
  migrateWarningsToSupabase
} = require("./lib/warnings-store.js");
const {
  detectPlatform
} = require("./lib/platformDetect.js");
const {
  applyFont: _applyFont
} = require("./lib/fontTransformer.js");
const msgRetryCounterCache = new NodeCache({
  stdTTL: 600
});
globalThis.msgRetryCounterCache_ref = msgRetryCounterCache;
let currentSock = null;
const lidPhoneCache = new Map();
const phoneLidCache = new Map();
function cacheLidPhone(lidNum, phoneNum) {
  if (!lidNum || !phoneNum || lidNum === phoneNum) {
    return;
  }
  lidPhoneCache.set(lidNum, phoneNum);
  phoneLidCache.set(phoneNum, lidNum);
  _capMap(lidPhoneCache, MAX_LID_CACHE);
  _capMap(phoneLidCache, MAX_LID_CACHE);
  mapLidToPhone(lidNum, phoneNum);
}
function resolvePhoneFromLid(jid) {
  if (!jid) {
    return null;
  }
  const lidNum = jid.split("@")[0].split(":")[0];
  const cached = lidPhoneCache.get(lidNum);
  if (cached) {
    return cached;
  }
  const stored = getPhoneFromLid(lidNum);
  if (stored) {
    lidPhoneCache.set(lidNum, stored);
    return stored;
  }
  if (!currentSock) {
    return null;
  }
  try {
    if (currentSock.signalRepository?.lidMapping?.getPNForLID) {
      const pn = currentSock.signalRepository.lidMapping.getPNForLID(jid);
      if (pn) {
        const num = String(pn).split("@")[0].replace(/[^0-9]/g, "");
        if (num.length >= 7 && num !== lidNum) {
          cacheLidPhone(lidNum, num);
          return num;
        }
      }
    }
  } catch {}
  try {
    const fullLid = jid.includes("@") ? jid : `${jid}@lid`;
    if (currentSock.signalRepository?.lidMapping?.getPNForLID) {
      const formats = [fullLid, `${lidNum}:0@lid`, `${lidNum}@lid`];
      for (const fmt of formats) {
        try {
          const pn = currentSock.signalRepository.lidMapping.getPNForLID(fmt);
          if (pn) {
            const num = String(pn).split("@")[0].replace(/[^0-9]/g, "");
            if (num.length >= 7 && num.length <= 15 && num !== lidNum) {
              cacheLidPhone(lidNum, num);
              return num;
            }
          }
        } catch {}
      }
    }
  } catch {}
  return null;
}
async function resolvePhoneFromGroup(senderJid, chatId, sock) {
  return resolveSenderFromGroup(senderJid, chatId, sock);
}
function getDisplayNumber(senderJid) {
  if (!senderJid) {
    return "unknown";
  }
  const raw = senderJid.split("@")[0].split(":")[0];
  const full = senderJid.split("@")[0];
  if (senderJid.includes("@lid")) {
    let phone = lidPhoneCache.get(raw) || lidPhoneCache.get(full) || getPhoneFromLid(raw) || getPhoneFromLid(full) || resolvePhoneFromLid(senderJid);
    if (!phone) {
      const isOwnerLid = OWNER_LID && (senderJid === OWNER_LID || raw === OWNER_LID.split("@")[0]?.split(":")[0]);
      if (isOwnerLid && currentSock?.user?.id && !currentSock.user.id.includes("@lid")) {
        phone = currentSock.user.id.split("@")[0]?.split(":")[0];
        if (phone) {
          cacheLidPhone(raw, phone);
        }
      }
      if (!phone && isOwnerLid && currentSock?.user?.lid) {
        const lidPhone = currentSock.user.lid.split("@")[0]?.split(":")[0];
        if (lidPhone && lidPhone !== raw && lidPhone.length >= 7) {
          phone = lidPhone;
          cacheLidPhone(raw, phone);
        }
      }
    }
    if (phone) {
      return `+${phone}`;
    } else {
      return `LID:${raw.substring(0, 8)}...`;
    }
  }
  return `+${raw}`;
}
function getPresenceType(chatId) {
  if (!chatId) {
    return null;
  }
  const isGroup = chatId.endsWith("@g.us");
  if (isGroup) {
    if (global.AUTOTYPING_GROUP_ENABLED || process.env.AUTO_TYPING_GROUP === "on") {
      return "composing";
    }
    if (global.AUTORECORDING_GROUP_ENABLED || process.env.AUTO_RECORDING_GROUP === "on") {
      return "recording";
    }
  } else {
    if (global.AUTOTYPING_DM_ENABLED || process.env.AUTO_TYPING_DM === "on") {
      return "composing";
    }
    if (global.AUTORECORDING_DM_ENABLED || process.env.AUTO_RECORDING_DM === "on") {
      return "recording";
    }
  }
  if (global.AUTOTYPING_ENABLED || process.env.AUTO_TYPING === "on") {
    return "composing";
  }
  if (global.AUTORECORDING_ENABLED || process.env.AUTO_RECORDING === "on") {
    return "recording";
  }
  return null;
}

function resolvePresenceJid(jid) {
  if (!jid) {
    return jid;
  }
  if (jid.endsWith("@lid")) {
    const r = resolvePhoneFromLid(jid);
    if (r) {
      return `${r}@s.whatsapp.net`;
    }
  }
  if (jid.includes(":") && !jid.endsWith("@g.us")) {
    return jid.split(":")[0] + "@s.whatsapp.net";
  }
  return jid;
}
const groupMetadataCache = new Map();
globalThis.groupMetadataCache = groupMetadataCache;
globalThis.lidPhoneCache = lidPhoneCache;
globalThis.phoneLidCache = phoneLidCache;
globalThis.viewOnceCache_ref = null;
globalThis.msgRetryCounterCache_ref = null;
const GROUP_CACHE_TTL = 600000;
const MAX_LID_CACHE = 500;
const MAX_GROUP_META_CACHE = 50;
const MAX_GROUP_DIAG = 200;
const groupDiagDone = new Set();
const _pendingGroupFetches = new Map();
function _capMap(map, max) {
  if (map.size <= max) {
    return;
  }
  const excess = map.size - Math.floor(max * 0.6);
  let i = 0;
  for (const k of map.keys()) {
    if (i++ >= excess) {
      break;
    }
    map.delete(k);
  }
}
function _capSet(set, max) {
  if (set.size <= max) {
    return;
  }
  const arr = [...set];
  set.clear();
  for (let i = arr.length - Math.floor(max * 0.6); i < arr.length; i++) {
    set.add(arr[i]);
  }
}
async function getCachedGroupMetadata(chatId, sock) {
  const cached = groupMetadataCache.get(chatId);
  if (cached && Date.now() - cached.ts < GROUP_CACHE_TTL) {
    return cached.data;
  }
  const pending = _pendingGroupFetches.get(chatId);
  if (pending) {
    return pending;
  }
  const fetchPromise = (async () => {
    try {
      const metadata = await Promise.race([sock.groupMetadata(chatId), new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 8000))]);
      groupMetadataCache.set(chatId, {
        data: metadata,
        ts: Date.now()
      });
      _capMap(groupMetadataCache, MAX_GROUP_META_CACHE);
      return metadata;
    } catch (err) {
      if (cached) {
        return cached.data;
      }
      return null;
    } finally {
      _pendingGroupFetches.delete(chatId);
    }
  })();
  _pendingGroupFetches.set(chatId, fetchPromise);
  return fetchPromise;
}
async function resolveDisplayNumber(jid, chatId, sock) {
  if (!jid) {
    return "unknown";
  }
  const raw = jid.split("@")[0].split(":")[0];
  const full = jid.split("@")[0];
  if (!jid.includes("@lid")) {
    return `+${raw}`;
  }
  const cached = lidPhoneCache.get(raw) || lidPhoneCache.get(full) || getPhoneFromLid(raw) || getPhoneFromLid(full);
  if (cached) {
    return `+${cached}`;
  }
  const fromSignal = resolvePhoneFromLid(jid);
  if (fromSignal) {
    return `+${fromSignal}`;
  }
  if (chatId?.includes("@g.us") && sock) {
    try {
      const resolved = await resolveSenderFromGroup(jid, chatId, sock);
      if (resolved) {
        return `+${resolved}`;
      }
    } catch {}
  }
  return `LID:${raw.substring(0, 8)}...`;
}
async function generateRetrievalCaption(senderJid, retrieverJid, chatId, groupName, sock) {
  const isGroup = chatId?.includes("@g.us");
  let resolvedGroupName = groupName;
  if (isGroup && !resolvedGroupName && sock) {
    try {
      const metadata = await getCachedGroupMetadata(chatId, sock);
      if (metadata?.subject) {
        resolvedGroupName = metadata.subject;
      }
    } catch {}
  }
  const senderNumber = await resolveDisplayNumber(senderJid, chatId, sock);
  const isAutoDetect = retrieverJid === "auto-detect";
  const retrieverDisplay = isAutoDetect ? `${getCurrentBotName()} (Auto)` : await resolveDisplayNumber(retrieverJid, chatId, sock);
  const chatName = resolvedGroupName || (isGroup ? chatId.split("@")[0] : "Private Chat");
  const timeStr = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: process.env.TIME_ZONE || "Africa/Lagos"
  });
  const botName = getCurrentBotName();
  const chatType = isGroup ? "Group" : "Chat";
  const caption = `╔═|〔  VIEW ONCE 〕\n║\n║ ▸ *From*      : ${senderNumber}\n║ ▸ *Retrieved* : ${retrieverDisplay}\n║ ▸ *${chatType}*      : ${chatName}\n║ ▸ *Time*      : ${timeStr}\n║\n╚═|〔 ${botName} 〕`;
  return caption;
}
async function buildLidMapFromGroup(chatId, sock) {
  const metadata = await getCachedGroupMetadata(chatId, sock);
  if (!metadata) {
    return 0;
  }
  const participants = metadata.participants || [];
  let mapped = 0;
  if (!groupDiagDone.has(chatId) && participants.length > 0) {
    groupDiagDone.add(chatId);
    _capSet(groupDiagDone, MAX_GROUP_DIAG);
    const sample = participants.slice(0, 3).map(p => ({
      id: p.id || "none",
      lid: p.lid || "none",
      phoneNumber: p.phoneNumber || "none",
      admin: p.admin || "none",
      keys: Object.keys(p).filter(k => !["id", "lid", "admin", "phoneNumber"].includes(k)).join(",")
    }));
    // participant structure debug log suppressed
  }
  for (const p of participants) {
    const {
      phoneNum,
      lidNum
    } = extractParticipantInfo(p, sock);
    if (phoneNum && lidNum && phoneNum !== lidNum) {
      cacheLidPhone(lidNum, phoneNum);
      mapLidToPhone(lidNum, phoneNum);
      mapped++;
    }
  }
  return mapped;
}
const _lidResolveAttempts = new Map();
const LID_RESOLVE_COOLDOWN = 300000;
let _activeGroupFetches = 0;
const MAX_CONCURRENT_GROUP_FETCHES = 2;
async function resolveSenderFromGroup(senderJid, chatId, sock) {
  if (!senderJid || !chatId || !sock) {
    return null;
  }
  const senderLidNum = senderJid.split("@")[0].split(":")[0];
  const senderFull = senderJid.split("@")[0];
  let resolved = lidPhoneCache.get(senderLidNum) || lidPhoneCache.get(senderFull) || getPhoneFromLid(senderLidNum) || getPhoneFromLid(senderFull);
  if (resolved) {
    return resolved;
  }
  const attemptKey = `${senderLidNum}:${chatId}`;
  const lastAttempt = _lidResolveAttempts.get(attemptKey);
  if (lastAttempt && Date.now() - lastAttempt < LID_RESOLVE_COOLDOWN) {
    return null;
  }
  _lidResolveAttempts.set(attemptKey, Date.now());
  if (_lidResolveAttempts.size > 500) {
    const cutoff = Date.now() - LID_RESOLVE_COOLDOWN;
    for (const [k, ts] of _lidResolveAttempts) {
      if (ts < cutoff) {
        _lidResolveAttempts.delete(k);
      }
    }
  }
  if (_activeGroupFetches >= MAX_CONCURRENT_GROUP_FETCHES) {
    return null;
  }
  _activeGroupFetches++;
  try {
    await buildLidMapFromGroup(chatId, sock);
  } finally {
    _activeGroupFetches--;
  }
  resolved = lidPhoneCache.get(senderLidNum) || lidPhoneCache.get(senderFull) || getPhoneFromLid(senderLidNum) || getPhoneFromLid(senderFull);
  if (resolved) {
    UltraCleanLogger.info(`🔗 LID resolved: ${senderLidNum.substring(0, 8)}... → +${resolved}`);
  }
  return resolved;
}
function extractParticipantInfo(p, sock) {
  const pid = p.id || "";
  const plid = p.lid || "";
  let phoneNum = null;
  let lidNum = null;
  if (p.phoneNumber) {
    const num = String(p.phoneNumber).replace(/[^0-9]/g, "");
    if (num.length >= 7 && num.length <= 15) {
      phoneNum = num;
    }
  }
  if (!phoneNum && pid && !pid.includes("@lid")) {
    const num = pid.split("@")[0].split(":")[0].replace(/[^0-9]/g, "");
    if (num.length >= 7 && num.length <= 15) {
      phoneNum = num;
    }
  }
  if (!phoneNum && plid && !plid.includes("@lid")) {
    const num = plid.split("@")[0].split(":")[0].replace(/[^0-9]/g, "");
    if (num.length >= 7 && num.length <= 15) {
      phoneNum = num;
    }
  }
  if (pid.includes("@lid")) {
    lidNum = pid.split("@")[0].split(":")[0];
  }
  if (!lidNum && plid && plid.includes("@lid")) {
    lidNum = plid.split("@")[0].split(":")[0];
  }
  if (!lidNum && plid) {
    lidNum = plid.split("@")[0].split(":")[0];
  }
  if (!phoneNum && lidNum) {
    try {
      const theLid = pid.includes("@lid") ? pid : plid || pid;
      if (sock?.signalRepository?.lidMapping?.getPNForLID) {
        const pn = sock.signalRepository.lidMapping.getPNForLID(theLid);
        if (pn) {
          const num = String(pn).split("@")[0].replace(/[^0-9]/g, "");
          if (num.length >= 7 && num.length <= 15) {
            phoneNum = num;
          }
        }
      }
    } catch {}
  }
  return {
    phoneNum,
    lidNum
  };
}
async function autoScanGroupsForSudo(sock) {
  try {
    const {
      sudoers
    } = getSudoList();
    if (sudoers.length === 0) {
      return;
    }
    const allSudosMapped = sudoers.every(num => {
      for (const [, phone] of lidPhoneCache) {
        if (phone === num) {
          return true;
        }
      }
      const stored = getPhoneFromLid(num);
      if (stored) {
        return true;
      }
      return false;
    });
    if (allSudosMapped) {
      UltraCleanLogger.info(`All ${sudoers.length} sudo(s) already have LID mappings`);
      return;
    }
    UltraCleanLogger.info(`Scanning groups to link ${sudoers.length} sudo user(s)...`);
    const groups = await Promise.race([sock.groupFetchAllParticipating(), new Promise((_, rej) => setTimeout(() => rej(new Error("scan_timeout")), 15000))]);
    if (!groups) {
      return;
    }
    let linked = 0;
    let totalParticipants = 0;
    let diagLogged = false;
    const groupEntries = Object.entries(groups);
    for (let gi = 0; gi < groupEntries.length; gi++) {
      const [groupId, metadata] = groupEntries[gi];
      const participants = metadata.participants || [];
      totalParticipants += participants.length;
      if (!diagLogged && participants.length > 0) {
        diagLogged = true;
        const sample = participants.slice(0, 2).map(p => ({
          id: p.id || "none",
          lid: p.lid || "none",
          phoneNumber: p.phoneNumber || "none",
          keys: Object.keys(p).filter(k => !["id", "lid", "admin", "phoneNumber"].includes(k)).join(",")
        }));
        // scan participant structure debug log suppressed
      }
      for (const p of participants) {
        const {
          phoneNum,
          lidNum
        } = extractParticipantInfo(p, sock);
        if (phoneNum && lidNum && phoneNum !== lidNum) {
          cacheLidPhone(lidNum, phoneNum);
          mapLidToPhone(lidNum, phoneNum);
          if (sudoers.includes(phoneNum)) {
            linked++;
          }
        }
        const pid = p.id || "";
        const plid = p.lid || "";
        if (pid && !pid.includes("@lid")) {
          const phoneN = pid.split("@")[0].split(":")[0].replace(/[^0-9]/g, "");
          if (phoneN && sudoers.includes(phoneN)) {
            const lidJid = plid || pid;
            if (lidJid.includes("@lid")) {
              const lNum = lidJid.split("@")[0].split(":")[0];
              cacheLidPhone(lNum, phoneN);
              linked++;
            }
          }
        }
      }
      if (gi % 10 === 9) {
        await new Promise(r => setTimeout(r, 0));
      }
    }
    UltraCleanLogger.info(`Scanned ${Object.keys(groups).length} groups, ${totalParticipants} participants`);
    if (linked > 0) {
      UltraCleanLogger.success(`Auto-linked ${linked} sudo user(s) from group scan`);
    } else {
      UltraCleanLogger.info(`No sudo users found via group scan. Use =linksudo in a group with your sudo user.`);
    }
  } catch (err) {
    UltraCleanLogger.warning(`Sudo auto-scan: ${err.message}`);
  }
}

// Import automation handlers
const {
  handleAutoReact
} = require("./gaaju-cmds/automation/autoreactstatus.js");
const {
  handleChannelReact,
  discoverNewsletters,
  channelReactManager
} = require("./gaaju-cmds/channel/channelreact.js");
const {
  handleReactOwner
} = require("./gaaju-cmds/automation/reactowner.js");
const {
  handleReactDev
} = require("./gaaju-cmds/automation/reactdev.js");
const {
  handleAutoView
} = require("./gaaju-cmds/automation/autoviewstatus.js");
const {
  handleAutoDownloadStatus
} = require("./gaaju-cmds/automation/autodownloadstatus.js");
const {
  initializeAutoJoin
} = require("./gaaju-cmds/group/add.js");
const antidemote = require("./gaaju-cmds/group/antidemote.js");
const {
  isBugMessage: antibugCheck,
  isEnabled: antibugEnabled,
  getAction: antibugGetAction
} = require("./gaaju-cmds/group/antibug.js");
const {
  checkMessageForLinks: antilinkCheck,
  isEnabled: antilinkEnabled,
  getMode: antilinkGetMode,
  getGroupConfig: antilinkGetConfig,
  isLinkExempt: antilinkIsExempt,
  isExcludedType: antilinkIsExcludedType
} = require("./gaaju-cmds/group/antilink.js");
const {
  checkMessageForBadWord,
  isGroupEnabled: isBadWordEnabled,
  getGroupAction: getBadWordAction
} = require("./lib/badwords-store.js");
const {
  isEnabled: antispamEnabled,
  getAction: antispamGetAction,
  checkSpam: antispamCheck
} = require("./gaaju-cmds/group/antispam.js");
const banCommand = require("./gaaju-cmds/group/ban.js");
const {
  setupWebServer,
  updateWebStatus
} = require("./lib/webServer.js");

// Pre-imported group event modules (avoids dynamic import disk I/O in hot event handlers)
const {
  handleGroupParticipantUpdate: antidemoteHandler
} = require("./gaaju-cmds/group/antidemote.js");
const {
  handleGroupUpdate: antipromoteHandler
} = require("./gaaju-cmds/group/antipromote.js");
const {
  isWelcomeEnabled,
  getWelcomeMessage,
  sendWelcomeMessage
} = require("./gaaju-cmds/group/welcome.js");
const {
  isGoodbyeEnabled,
  getGoodbyeMessage,
  sendGoodbyeMessage
} = require("./gaaju-cmds/group/goodbye.js");
const {
  handleStatusMention: statusMentionHandler
} = require("./gaaju-cmds/group/antistatusmention.js");
const {
  setupAntiGroupStatusListener
} = require("./gaaju-cmds/group/antigroupstatus.js");
const {
  setupAntiTagListener
} = require("./gaaju-cmds/group/antitag.js");
const {
  setupAntiGroupMentionListener
} = require("./gaaju-cmds/group/antigroupmention.js");
const {
  setupWordFilterListener
} = require("./gaaju-cmds/group/wordfilter.js");
const {
  setupAutoReplyListener
} = require("./gaaju-cmds/group/autoreply.js");
const {
  setupSlowModeListener
} = require("./gaaju-cmds/group/slowmode.js");
const {
  isWhitelisted
} = require("./gaaju-cmds/owner/whitelist.js");
const {
  isBlacklisted
} = require("./gaaju-cmds/owner/blacklist.js");

// Import antidelete system (listeners registered in index.js, always active)
const {
  initAntidelete,
  antideleteStoreMessage,
  antideleteHandleUpdate,
  updateAntideleteSock
} = require("./gaaju-cmds/owner/antidelete.js");

// Import status antidelete system (always on, handles status messages exclusively)
const {
  initStatusAntidelete,
  statusAntideleteStoreMessage,
  statusAntideleteHandleUpdate,
  updateStatusAntideleteSock
} = require("./gaaju-cmds/owner/antideletestatus.js");
const {
  initStatusReplyListener
} = require("./lib/statusReplyListener.js");

// Import W.O.L.F chatbot system
const {
  isChatbotActiveForChat,
  handleChatbotMessage
} = require("./gaaju-cmds/ai/chatbot.js");

// ====== ENVIRONMENT SETUP ======
dotenv.config({
  path: path.join(__dirname, "../.env")
}); // root .env

// ====== CONFIGURATION ======
const SESSION_DIR = "./session";
try {
  const _bnFile = path.join(__dirname, "bot_name.json");
  if (fs.existsSync(_bnFile)) {
    const _bnData = JSON.parse(fs.readFileSync(_bnFile, "utf8"));
    if (_bnData.botName && _bnData.botName.trim()) {
      global.BOT_NAME = _bnData.botName.trim();
    }
  }
} catch {}
let BOT_NAME = _getBotName();
global.BOT_NAME = BOT_NAME;
function getCurrentBotName() {
  return _getBotName();
}
const VERSION = "1.2.0";
global.VERSION = VERSION;
const _rawEnvPrefix = process.env.BOT_PREFIX || process.env.PREFIX || "";
const DEFAULT_PREFIX = _rawEnvPrefix && _rawEnvPrefix.length <= 5 ? _rawEnvPrefix : ".";
const OWNER_FILE = "./owner.json";
const PREFIX_CONFIG_FILE = "./prefix_config.json";
const BOT_SETTINGS_FILE = "./bot_settings.json";
const BOT_MODE_FILE = "./bot_mode.json";
const WHITELIST_FILE = "./whitelist.json";
const BLOCKED_USERS_FILE = "./blocked_users.json";
const WELCOME_DATA_FILE = "./data/welcome_data.json";
let _cache_owner_data = null;
let _cache_prefix_config = null;
let _cache_bot_settings = null;
let _cache_bot_mode = null;
let _cache_whitelist = null;
let _cache_blocked_users = null;
let _cache_welcome_data = null;
let _cache_status_logs = null;
let _cache_member_detection = null;
let _cache_antiviewonce_config = null;
let _cache_antiviewonce_history = null;
let _cache_antiviewonce_captured_count = 0;
async function _loadConfigCache(key, defaultValue) {
  try {
    const val = await db.getConfig(key, defaultValue);
    return val;
  } catch {
    return defaultValue;
  }
}
function _saveConfigCache(key, value) {
  db.setConfig(key, value).catch(err => {
    UltraCleanLogger.warning(`DB save error for ${key}: ${err.message}`);
  });
}
globalThis.updateBotModeCache = function (newMode) {
  _cache_bot_mode = {
    mode: newMode
  };
  BOT_MODE = newMode;
  process.env.BOT_MODE = newMode;
  _saveConfigCache("bot_mode", {
    mode: newMode
  });
  updateWebStatus({
    botMode: newMode
  });
};
globalThis._fontConfig = {
  font: "default"
};
globalThis._antibugConfig = null;
globalThis._saveAntibugConfig = function (data) {
  _saveConfigCache("antibug_config", data);
};
_loadConfigCache("antibug_config", {}).then(config => {
  globalThis._antibugConfig = config || {};
}).catch(() => {
  globalThis._antibugConfig = {};
});
globalThis._antilinkConfig = null;
globalThis._saveAntilinkConfig = function (data) {
  _saveConfigCache("antilink_config", data);
};
_loadConfigCache("antilink_config", {}).then(config => {
  globalThis._antilinkConfig = config || {};
}).catch(() => {
  globalThis._antilinkConfig = {};
});
globalThis._antispamConfig = null;
globalThis._saveAntispamConfig = function (data) {
  _saveConfigCache("antispam_config", data);
};
_loadConfigCache("antispam_config", {}).then(config => {
  globalThis._antispamConfig = config || {};
}).catch(() => {
  globalThis._antispamConfig = {};
});
globalThis.reloadConfigCaches = reloadConfigCaches;
async function reloadConfigCaches() {
  try {
    _cache_owner_data = await _loadConfigCache("owner_data", {});
    _cache_prefix_config = await _loadConfigCache("prefix_config", {
      prefix: DEFAULT_PREFIX
    });
    _cache_bot_settings = await _loadConfigCache("bot_settings", {});
    _cache_bot_mode = await _loadConfigCache("bot_mode", null);
    if (!_cache_bot_mode || !_cache_bot_mode.mode) {
      const _legacyMode = await _loadConfigCache("MODE", null);
      const _validModes = ["public", "groups", "dms", "silent", "buttons", "channel", "default"];
      if (_legacyMode && _validModes.includes(String(_legacyMode).toLowerCase())) {
        _cache_bot_mode = {
          mode: String(_legacyMode).toLowerCase()
        };
      } else {
        // Seed from Pterodactyl panel MODE env var on first-ever run
        const _envMode = (process.env.MODE || process.env.BOT_MODE || "").toLowerCase();
        const _validEnvModes = ["public", "groups", "dms", "silent", "buttons", "channel", "default"];
        _cache_bot_mode = {
          mode: _validEnvModes.includes(_envMode) ? _envMode : "public"
        };
      }
    }
    _cache_whitelist = await _loadConfigCache("whitelist", {
      whitelist: []
    });
    _cache_blocked_users = await _loadConfigCache("blocked_users", {
      blocked: []
    });
    _cache_welcome_data = await _loadConfigCache("welcome_data", {});
    _cache_status_logs = await _loadConfigCache("status_detection_logs", {});
    _cache_member_detection = await _loadConfigCache("member_detection", {});
    _cache_antiviewonce_config = await _loadConfigCache("antiviewonce_config", DEFAULT_ANTIVIEWONCE_CONFIG);
    _cache_antiviewonce_history = await _loadConfigCache("antiviewonce_history", {});

    // Apply saved prefix to prefixCache now that _cache_prefix_config is loaded
    const _reloadedPrefix = loadPrefixFromFiles();
    if (_reloadedPrefix !== prefixCache) {
      prefixCache = _reloadedPrefix;
      isPrefixless = _reloadedPrefix === "";
      process.env.PREFIX = _reloadedPrefix;
      global.prefix = _reloadedPrefix;
      global.CURRENT_PREFIX = _reloadedPrefix;
      global.isPrefixless = isPrefixless;
    }

    // Reload font, antilink & antibug configs with the correct bot ID (they were
    // initially loaded at module startup before login, so bot_id was 'default')
    const fontData = await _loadConfigCache("font_config", {
      font: "default"
    });
    if (fontData && fontData.font) {
      globalThis._fontConfig = fontData;
    }
    const antibugData = await _loadConfigCache("antibug_config", {});
    globalThis._antibugConfig = antibugData && Object.keys(antibugData).length > 0 ? antibugData : globalThis._antibugConfig || {};
    const antilinkData = await _loadConfigCache("antilink_config", {});
    globalThis._antilinkConfig = antilinkData && Object.keys(antilinkData).length > 0 ? antilinkData : globalThis._antilinkConfig || {};
    const antispamData = await _loadConfigCache("antispam_config", {});
    globalThis._antispamConfig = antispamData && Object.keys(antispamData).length > 0 ? antispamData : globalThis._antispamConfig || {};
    if (_cache_owner_data && Object.keys(_cache_owner_data).length === 0) {
      _cache_owner_data = null;
    }
    if (_cache_bot_settings && Object.keys(_cache_bot_settings).length === 0) {
      _cache_bot_settings = null;
    }
    if (_cache_welcome_data && Object.keys(_cache_welcome_data).length === 0) {
      _cache_welcome_data = null;
    }

    // Keep BOT_MODE in sync with the reloaded cache
    if (_cache_bot_mode && _cache_bot_mode.mode) {
      BOT_MODE = _cache_bot_mode.mode;
      process.env.BOT_MODE = _cache_bot_mode.mode;
    }

    // Auto-typing / auto-recording: restore saved settings from database (persists across restarts)
    try {
      const _at = await _loadConfigCache("AUTO_TYPING", "off");
      const _atd = await _loadConfigCache("AUTO_TYPING_DM", "off");
      const _atg = await _loadConfigCache("AUTO_TYPING_GROUP", "off");
      const _ar = await _loadConfigCache("AUTO_RECORDING", "off");
      const _ard = await _loadConfigCache("AUTO_RECORDING_DM", "off");
      const _arg = await _loadConfigCache("AUTO_RECORDING_GROUP", "off");
      process.env.AUTO_TYPING = typeof _at === "string" ? _at : "off";
      process.env.AUTO_TYPING_DM = typeof _atd === "string" ? _atd : "off";
      process.env.AUTO_TYPING_GROUP = typeof _atg === "string" ? _atg : "off";
      process.env.AUTO_RECORDING = typeof _ar === "string" ? _ar : "off";
      process.env.AUTO_RECORDING_DM = typeof _ard === "string" ? _ard : "off";
      process.env.AUTO_RECORDING_GROUP = typeof _arg === "string" ? _arg : "off";
    } catch {
      process.env.AUTO_TYPING = process.env.AUTO_TYPING_DM = process.env.AUTO_TYPING_GROUP = "off";
      process.env.AUTO_RECORDING = process.env.AUTO_RECORDING_DM = process.env.AUTO_RECORDING_GROUP = "off";
    }
  } catch {}
}

// Auto-connect features
const AUTO_CONNECT_ON_LINK = true;
const AUTO_CONNECT_ON_START = true;

// SPEED OPTIMIZATION
const RATE_LIMIT_ENABLED = true;
const MIN_COMMAND_DELAY = 100;
const STICKER_DELAY = 400;

// // Auto-join group configuration
// const AUTO_JOIN_ENABLED = true;
// const AUTO_JOIN_DELAY = 5000;
// const SEND_WELCOME_MESSAGE = true;
// const GROUP_LINK = 'https://chat.whatsapp.com/J2H0ksHUHaLDhYkjxVzvvl';
// const GROUP_INVITE_CODE = GROUP_LINK.split('/').pop();
// const GROUP_NAME = 'GAAJU-MD Community';
// const AUTO_JOIN_LOG_FILE = './auto_join_log.json';

// ====== SILENCE BAILEYS ======
function silenceBaileysCompletely() {
  try {
    const pino = require("pino");
    pino({
      level: "silent",
      enabled: false
    });
  } catch {}
}
silenceBaileysCompletely();

// ====== CLEAN CONSOLE SETUP ======
console.clear();
setupProcessFilter();

// Ultra clean logger
const _logSuppressSet = new Set(["closing session", "sessionentry", "_chains", "registrationid", "currentratchet", "indexinfo", "pendingprekey", "ephemeralkeypair", "lastremoteephemeralkey", "rootkey", "basekey", "signalprotocol", "signalkey", "signalgroup", "signalstore", "signalrepository", "sessioncipher", "sessionbuilder", "sessionstate", "senderkeystore", "senderkeydistribution", "keyexchange", "groupcipher", "ratchet", "chainkey", "keypair", "pubkey", "privkey", "keystore", "<buffer", "05 ", "0x", "failed to decrypt", "bad mac", "stream errored", "sessionerror", "received error", "connection.update", "creds.update", "messages.upsert", "presence.update", "chat.update", "message.receipt.update", "message.update", "[asm-debug]", "autoreact", "autoview"]);
const _logSuppressArr = [..._logSuppressSet];
const _errSuppressArr = ["bad mac", "failed to decrypt", "decrypt", "session error", "sessioncipher", "sessionbuilder", "session_cipher", "signalprotocol", "ratchet", "closed session", "stream errored", "verifymac", "libsignal", "hmac", "pre-key", "prekey"];
const _warnSuppressArr = ["decrypted message with closed session", "failed to decrypt", "bad mac", "closing session", "closing open session", "incoming prekey bundle", "stream errored", "signalprotocol", "ratchet", "sessioncipher", "sessionbuilder", "sessionentry", "sessionstate", "sessionerror"];
function _isLogSuppressed(msg) {
  for (let i = 0; i < _logSuppressArr.length; i++) {
    if (msg.includes(_logSuppressArr[i])) {
      return true;
    }
  }
  return false;
}
// ─── ANSI palette ─────────────────────────────────────────────────────
const _RST    = "\x1b[0m";
const _BOLD   = "\x1b[1m";
const _DIM    = "\x1b[2m";
const _GREEN  = "\x1b[38;2;80;215;100m";
const _GREENB = "\x1b[1m\x1b[38;2;80;215;100m";
const _GREEND = "\x1b[2m\x1b[38;2;80;215;100m";
const _CYAN   = "\x1b[38;2;60;210;255m";
const _CYANB  = "\x1b[1m\x1b[38;2;60;210;255m";
const _BLUE   = "\x1b[38;2;100;160;255m";
const _YELLOW = "\x1b[38;2;255;200;60m";
const _YELLOWB= "\x1b[1m\x1b[38;2;255;200;60m";
const _YELLOWD= "\x1b[2m\x1b[38;2;255;200;60m";
const _RED    = "\x1b[38;2;255;90;90m";
const _REDB   = "\x1b[1m\x1b[38;2;255;90;90m";
const _MAG    = "\x1b[38;2;195;110;255m";
const _MAGB   = "\x1b[1m\x1b[38;2;195;110;255m";
const _ORANGE = "\x1b[38;2;255;155;50m";
const _ORANGEB= "\x1b[1m\x1b[38;2;255;155;50m";
const _GRAY   = "\x1b[38;2;130;130;130m";
const _WHITE  = "\x1b[38;2;210;210;210m";
// Legacy aliases — keep for compatibility throughout the rest of the file
const _Y = _YELLOW;  const _YB = _YELLOWB; const _YD = _YELLOWD;
const _G = _GREEN;   const _GB = _GREENB;  const _GD = _GREEND;
const _R = _RST;
const _BL  = _BLUE;   const _BLB = "\x1b[1m\x1b[38;2;100;160;255m";
const _ORG = _ORANGE; const _ORGB= _ORANGEB;
// ─── Box drawing helpers ─────────────────────────────────────────────
const _BOX_W = 54;
function _boxHdr(label, time, cBold) {
  const tag   = `─[ ${label} ]`;
  const stamp = ` ${time} ─`;
  const fill  = Math.max(2, _BOX_W - tag.length - stamp.length);
  return `${cBold}┌${tag}${"\u2500".repeat(fill)}${stamp}┐${_RST}`;
}
function _boxRow(text, c) { return `${c}│  ${text}${_RST}`; }
function _boxFtr(c)        { return `${c}└${"\u2500".repeat(_BOX_W)}┘${_RST}`; }
const _systemBuffer = [];
const _FLUSH_INTERVAL = 0;
let _lastFlush = Date.now();
let _flushTimer = null;
const _systemPatterns = ["disk cleanup", "trimming caches", "high memory", "media stored", "saved sticker", "saved media", "trimmed to", "cleanup:", "disk space", "low disk", "[antidelete] media", "antiedit: saved", "antiedit: stored", "items removed", "cache trimmed", "disk manager"];
function _isSystemLog(text) {
  if (!text) {
    return false;
  }
  const lower = text.toLowerCase();
  for (let i = 0; i < _systemPatterns.length; i++) {
    if (lower.includes(_systemPatterns[i])) {
      return true;
    }
  }
  return false;
}
function _getTime() {
  return new Date().toLocaleTimeString("en-GB", {
    timeZone: process.env.TIME_ZONE || "Africa/Lagos",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
  });
}
function _flushSystemBuffer() {
  if (_systemBuffer.length === 0) return;
  const items = _systemBuffer.splice(0);
  _lastFlush = Date.now();
  const counts = {};
  const details = [];
  for (const item of items) {
    const text = item.text;
    if (/disk cleanup.*removed (\d+)/i.test(text)) {
      const m = text.match(/removed (\d+)/i);
      counts.diskCleanup = (counts.diskCleanup || 0) + parseInt(m[1]);
    } else if (/high memory.*?(\d+)MB/i.test(text)) {
      const m = text.match(/(\d+)MB/i);
      counts.highMemory = parseInt(m[1]);
    } else if (/media stored/i.test(text)) {
      counts.mediaStored = (counts.mediaStored || 0) + 1;
    } else if (/saved sticker/i.test(text)) {
      counts.stickersStored = (counts.stickersStored || 0) + 1;
    } else if (/trimmed to|trimming caches/i.test(text)) {
      counts.cacheTrimmed = (counts.cacheTrimmed || 0) + 1;
    } else {
      const short = text.length > 58 ? text.substring(0, 55) + "…" : text;
      details.push(short);
    }
  }
  const rows = [];
  if (counts.diskCleanup)    rows.push(`🧹 Disk  ·  ${counts.diskCleanup} items removed`);
  if (counts.highMemory)     rows.push(`⚠  Memory peak  ·  ${counts.highMemory} MB`);
  if (counts.mediaStored)    rows.push(`💾 Media  ·  ${counts.mediaStored} file${counts.mediaStored > 1 ? "s" : ""} stored`);
  if (counts.stickersStored) rows.push(`🎨 Stickers  ·  ${counts.stickersStored} saved`);
  if (counts.cacheTrimmed)   rows.push(`📦 Cache  ·  trimmed ${counts.cacheTrimmed}x`);
  for (const d of details.slice(0, 3)) rows.push(d);
  if (details.length > 3) rows.push(`+${details.length - 3} more`);
  if (rows.length === 0) return;
  const time = _getTime();
  originalConsoleMethods.log(_boxHdr("SYSTEM", time, _YELLOWB));
  for (const row of rows) originalConsoleMethods.log(_boxRow(row, _YELLOW));
  originalConsoleMethods.log(_boxFtr(_YELLOW));
}
function _bufferSystemLog(text) {
  _systemBuffer.push({
    text,
    time: Date.now()
  });
  if (_FLUSH_INTERVAL === 0) {
    _flushSystemBuffer();
    return;
  }
  if (!_flushTimer) {
    _flushTimer = setTimeout(() => {
      _flushTimer = null;
      _flushSystemBuffer();
    }, _FLUSH_INTERVAL);
  }
}
class UltraCleanLogger {
  static _inline(badge, badgeColor, msgColor, ...args) {
    const t   = `${_GRAY}[${_getTime()}]${_RST}`;
    const lv  = `${badgeColor}${badge}${_RST}`;
    const msg = `${msgColor}${args.join(" ")}${_RST}`;
    originalConsoleMethods.log(`${t}  ${lv}  ${msg}`);
  }
  static _block(label, cBold, cLine, ...bodyLines) {
    const time = _getTime();
    originalConsoleMethods.log(_boxHdr(label, time, cBold));
    for (const line of bodyLines) originalConsoleMethods.log(_boxRow(line, cLine));
    originalConsoleMethods.log(_boxFtr(cLine));
  }
  static log(...args) {
    const firstArg = args[0];
    if (typeof firstArg === "string") {
      const lower = firstArg.toLowerCase();
      if (_isLogSuppressed(lower)) return;
      if (_isSystemLog(firstArg)) { _bufferSystemLog(args.join(" ")); return; }
    }
    const t = `${_GRAY}[${_getTime()}]${_RST}`;
    originalConsoleMethods.log(`${t}  ${_GRAY}·${_RST}  ${_WHITE}${args.join(" ")}${_RST}`);
  }
  static error(...args) {
    const message = args.join(" ").toLowerCase();
    for (let i = 0; i < _errSuppressArr.length; i++) if (message.includes(_errSuppressArr[i])) return;
    UltraCleanLogger._block("ERROR", _REDB, _RED, args.join(" "));
  }
  static success(...args) {
    const text = args.join(" ");
    if (_isSystemLog(text)) { _bufferSystemLog(text); return; }
    UltraCleanLogger._inline("✓", _GREENB, _GREEN, text);
  }
  static info(...args) {
    const text = args.join(" ");
    if (_isSystemLog(text)) { _bufferSystemLog(text); return; }
    UltraCleanLogger._inline("i", _BLUE, _WHITE, text);
  }
  static warning(...args) {
    const message = args.join(" ").toLowerCase();
    for (let i = 0; i < _warnSuppressArr.length; i++) if (message.includes(_warnSuppressArr[i])) return;
    const text = args.join(" ");
    if (_isSystemLog(text)) { _bufferSystemLog(text); return; }
    UltraCleanLogger._block("WARNING", _YELLOWB, _YELLOW, text);
  }
  static event(...args)   { UltraCleanLogger._inline("◆", _MAGB, _MAG, ...args); }
  static command(...args) { UltraCleanLogger._inline("»", _CYANB, _CYAN, ...args); }
  static ownerCommand(...args) {
    UltraCleanLogger._block("OWNER", _GREENB, _GREEN, args.join(" "));
  }
  static ownerMessage(...args) {
    UltraCleanLogger._block("MSG", _GREEND, _GREEND, args.join(" "));
  }
  static critical(...args) {
    UltraCleanLogger._block("CRITICAL", _REDB, _RED, args.join(" "));
  }
  static group(...args)         { UltraCleanLogger._inline("◈", _MAGB, _MAG, ...args); }
  static member(...args)        { UltraCleanLogger._inline("◉", _CYANB, _CYAN, ...args); }
  static antiviewonce(...args)  { UltraCleanLogger._inline("⊕", _MAGB, _MAG, ...args); }
  static message(phone, chatType, groupName, text, time) {
    const t = time || _getTime();
    const isGroup = chatType === "GROUP";
    const label = isGroup ? "GROUP" : "DM";
    const cB = isGroup ? _CYANB   : _ORANGEB;
    const c  = isGroup ? _CYAN    : _ORANGE;
    const preview = text.length > 80 ? text.substring(0, 77) + "…" : text;
    const who = isGroup && groupName ? `+${phone}  ·  ${groupName}` : `+${phone}`;
    originalConsoleMethods.log(_boxHdr(label, t, cB));
    originalConsoleMethods.log(_boxRow(who, c));
    originalConsoleMethods.log(_boxRow(`"${preview}"`, c));
    originalConsoleMethods.log(_boxFtr(c));
  }
  static flushSystem() { _flushSystemBuffer(); }
}

// Replace console methods
console.log = UltraCleanLogger.log;
console.error = UltraCleanLogger.error;
console.info = UltraCleanLogger.info;
console.warn = UltraCleanLogger.warning;
console.debug = () => {};

// Add custom methods
global.logSuccess = UltraCleanLogger.success;
global.logInfo = UltraCleanLogger.info;
global.logWarning = UltraCleanLogger.warning;
global.logEvent = UltraCleanLogger.event;
global.logCommand = UltraCleanLogger.command;
global.logGroup = UltraCleanLogger.group;
global.logMember = UltraCleanLogger.member;
global.logAntiViewOnce = UltraCleanLogger.antiviewonce;

// Ultra silent baileys logger
const ultraSilentLogger = {
  level: "silent",
  trace: () => {},
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
  fatal: () => {},
  child: () => ultraSilentLogger,
  log: () => {},
  success: () => {},
  warning: () => {},
  event: () => {},
  command: (...args) => {
    UltraCleanLogger.command(...args);
  }
};

// Anti-viewonce configuration
const ANTIVIEWONCE_DATA_DIR = "./data/antiviewonce";
const ANTIVIEWONCE_SAVE_DIR = "./data/viewonce_messages";
const ANTIVIEWONCE_PRIVATE_DIR = "./data/viewonce_private";
const ANTIVIEWONCE_HISTORY_FILE = join(ANTIVIEWONCE_SAVE_DIR, "history.json");
const ANTIVIEWONCE_CONFIG_FILE = join(ANTIVIEWONCE_DATA_DIR, "config.json");
const ANTIVIEWONCE_VERSION = "1.0.0";
const DEFAULT_ANTIVIEWONCE_CONFIG = {
  mode: "private",
  autoSave: true,
  ownerJid: "",
  enabled: false,
  maxHistory: 500
};

// ====== DYNAMIC PREFIX SYSTEM ======
let prefixCache = DEFAULT_PREFIX;
let prefixHistory = [];
let isPrefixless = false;
function getCurrentPrefix() {
  if (isPrefixless) {
    return "";
  } else {
    return prefixCache;
  }
}
function savePrefixToFile(newPrefix) {
  try {
    const isNone = newPrefix === "none" || newPrefix === "\"\"" || newPrefix === "''" || newPrefix === "";
    const config = {
      prefix: isNone ? "" : newPrefix,
      isPrefixless: isNone,
      userSet: true,
      setAt: new Date().toISOString(),
      timestamp: Date.now(),
      version: VERSION,
      previousPrefix: prefixCache,
      previousIsPrefixless: isPrefixless
    };
    _cache_prefix_config = config;
    _saveConfigCache("prefix_config", config);
    updateWebStatus({
      prefix: isNone ? "none" : newPrefix
    });
    const settings = {
      prefix: isNone ? "" : newPrefix,
      isPrefixless: isNone,
      prefixSetAt: new Date().toISOString(),
      prefixChangedAt: Date.now(),
      previousPrefix: prefixCache,
      previousIsPrefixless: isPrefixless,
      version: VERSION
    };
    _cache_bot_settings = settings;
    _saveConfigCache("bot_settings", settings);
    UltraCleanLogger.info(`Prefix settings saved: "${newPrefix}", prefixless: ${isNone}`);
    return true;
  } catch (error) {
    UltraCleanLogger.error(`Error saving prefix: ${error.message}`);
    return false;
  }
}
function loadPrefixFromFiles() {
  try {
    // ENV VAR TAKES PRIORITY — critical for Heroku/Railway/Koyeb deployers.
    // The PREFIX or BOT_PREFIX env var always wins unless the user explicitly
    // changed prefix at runtime via the setprefix command (userSet flag).
    const _rawEnv = process.env.BOT_PREFIX || process.env.PREFIX || "";
    const _envPrefix = _rawEnv && _rawEnv.trim().length > 0 && _rawEnv.trim().length <= 5 ? _rawEnv.trim() : "";
    if (_cache_prefix_config) {
      const config = _cache_prefix_config;
      if (config.isPrefixless !== undefined) {
        isPrefixless = config.isPrefixless;
      }
      if (config.prefix !== undefined) {
        if (config.prefix.trim() === "" && config.isPrefixless) {
          return "";
        } else if (config.prefix.trim() !== "") {
          // If prefix was saved by the user via setprefix, honour it.
          // Otherwise let the env var win (clean Heroku deployments).
          if (config.userSet) {
            return config.prefix.trim();
          }
          if (_envPrefix) {
            return _envPrefix;
          }
          return config.prefix.trim();
        }
      }
    }

    // No saved config — use env var or DEFAULT_PREFIX
    if (_envPrefix) {
      return _envPrefix;
    }
    if (_cache_bot_settings) {
      const settings = _cache_bot_settings;
      if (settings.isPrefixless !== undefined) {
        isPrefixless = settings.isPrefixless;
      }
      if (settings.prefix && settings.prefix.trim() !== "") {
        return settings.prefix.trim();
      }
    }
  } catch (error) {
    UltraCleanLogger.warning(`Error loading prefix: ${error.message}`);
  }
  return DEFAULT_PREFIX;
}
function updatePrefixImmediately(newPrefix) {
  const oldPrefix = prefixCache;
  const oldIsPrefixless = isPrefixless;
  const isNone = newPrefix === "none" || newPrefix === "\"\"" || newPrefix === "''" || newPrefix === "";
  if (isNone) {
    isPrefixless = true;
    prefixCache = "";
    UltraCleanLogger.success(`Prefixless mode enabled`);
  } else {
    if (!newPrefix || newPrefix.trim() === "") {
      UltraCleanLogger.error("Cannot set empty prefix");
      return {
        success: false,
        error: "Empty prefix"
      };
    }
    if (newPrefix.length > 5) {
      UltraCleanLogger.error("Prefix too long (max 5 characters)");
      return {
        success: false,
        error: "Prefix too long"
      };
    }
    const trimmedPrefix = newPrefix.trim();
    prefixCache = trimmedPrefix;
    isPrefixless = false;
    UltraCleanLogger.info(`Prefix changed to: "${trimmedPrefix}"`);
  }
  if (typeof global !== "undefined") {
    global.prefix = getCurrentPrefix();
    global.CURRENT_PREFIX = getCurrentPrefix();
    global.isPrefixless = isPrefixless;
  }
  process.env.PREFIX = getCurrentPrefix();
  savePrefixToFile(newPrefix);
  prefixHistory.push({
    oldPrefix: oldIsPrefixless ? "none" : oldPrefix,
    newPrefix: isPrefixless ? "none" : prefixCache,
    isPrefixless: isPrefixless,
    oldIsPrefixless: oldIsPrefixless,
    timestamp: new Date().toISOString(),
    time: Date.now()
  });
  if (prefixHistory.length > 10) {
    prefixHistory = prefixHistory.slice(-10);
  }
  updateTerminalHeader();
  UltraCleanLogger.success(`Prefix updated: "${oldIsPrefixless ? "none" : oldPrefix}" → "${isPrefixless ? "none (prefixless)" : prefixCache}"`);
  return {
    success: true,
    oldPrefix: oldIsPrefixless ? "none" : oldPrefix,
    newPrefix: isPrefixless ? "none" : prefixCache,
    isPrefixless: isPrefixless,
    timestamp: new Date().toISOString()
  };
}
globalThis.updatePrefixImmediately = updatePrefixImmediately;

// ====== GLOBAL VARIABLES ======
let OWNER_NUMBER = null;
let OWNER_JID = null;
let OWNER_CLEAN_JID = null;
let OWNER_CLEAN_NUMBER = null;
let OWNER_LID = null;
let SOCKET_INSTANCE = null;
let isConnected = false;
let store = null;
let heartbeatInterval = null;
let lastActivityTime = Date.now();
let connectionAttempts = 0;
let connectionStableTimer = null;
let autoRestartTimer = null;
let MAX_RETRY_ATTEMPTS = 10;
let BOT_MODE = "public";
let WHITELIST = new Set();
let AUTO_LINK_ENABLED = true;
let AUTO_CONNECT_COMMAND_ENABLED = true;
let AUTO_ULTIMATE_FIX_ENABLED = true;
let isWaitingForPairingCode = false;
let RESTART_AUTO_FIX_ENABLED = true;
let _lastRestartMsgTime = 0;
const _MSG_COOLDOWN_MS = 300000;
let hasAutoConnectedOnStart = false;
let hasSentWelcomeMessage = false;
let initialCommandsLoaded = false;
let commandsLoaded = false;
let _lastConnectionMsgTime = 0;
let conflictCount = 0;
let isConflictRecovery = false;
let connectionOpenTime = 0;
let _allManagedIntervals = [];
let _lagCheckTs = Date.now();
setInterval(() => {
  const now = Date.now();
  const lag = now - _lagCheckTs - 5000;
  _lagCheckTs = now;
  if (lag > 2000) {
    originalConsoleMethods.log(`⚠️ [EVENT-LOOP] Lag detected: ${lag}ms`);
  }
}, 5000);
const DiskManager = {
  WARNING_MB: 200,
  CRITICAL_MB: 80,
  CHECK_INTERVAL: 180000,
  CLEANUP_INTERVAL: 600000,
  lastWarning: 0,
  lastCleanup: 0,
  isLow: false,
  _cachedDiskFree: null,
  _lastDiskCheck: 0,
  _diskCheckInFlight: false,
  getDiskFree() {
    return this._cachedDiskFree;
  },
  async getDiskFreeAsync() {
    const now = Date.now();
    if (now - this._lastDiskCheck < 60000 && this._cachedDiskFree !== null) {
      return this._cachedDiskFree;
    }
    if (this._diskCheckInFlight) {
      return this._cachedDiskFree;
    }
    this._diskCheckInFlight = true;
    try {
      const result = await new Promise((resolve, reject) => {
        exec("df -BM --output=avail . 2>/dev/null || df -m . 2>/dev/null", {
          encoding: "utf8",
          timeout: 3000
        }, (err, stdout) => {
          if (err) {
            reject(err);
          } else {
            resolve(stdout);
          }
        });
      });
      const match = result.match(/(\d+)M?\s*$/m);
      this._cachedDiskFree = match ? parseInt(match[1]) : null;
      this._lastDiskCheck = now;
    } catch {
      this._lastDiskCheck = now;
    } finally {
      this._diskCheckInFlight = false;
    }
    return this._cachedDiskFree;
  },
  getDirSize(dirPath) {
    let total = 0;
    try {
      if (!fs.existsSync(dirPath)) {
        return 0;
      }
      const entries = fs.readdirSync(dirPath);
      for (const entry of entries) {
        try {
          const full = path.join(dirPath, entry);
          const stat = fs.statSync(full);
          if (stat.isFile()) {
            total += stat.size;
          } else if (stat.isDirectory()) {
            total += this.getDirSize(full);
          }
        } catch {}
      }
    } catch {}
    return total;
  },
  getCleanupReport() {
    const sessionFiles = this._countSessionSignalFiles();
    const voMedia = 0;
    const adMedia = this.getDirSize("./data/antidelete/media");
    const statusMedia = this.getDirSize("./data/antidelete/status/media");
    const tempFiles = this.getDirSize("./temp") + this.getDirSize("./gaaju-cmds/temp");
    const backupFiles = this.getDirSize("./session_backup");
    const statusLogs = (() => {
      try {
        if (_cache_status_logs) {
          return JSON.stringify(_cache_status_logs).length;
        } else {
          return 0;
        }
      } catch {
        return 0;
      }
    })();
    const freeMB = this.getDiskFree();
    return {
      freeMB,
      sessionSignalFiles: sessionFiles.count,
      sessionSignalMB: Math.round(sessionFiles.bytes / 1024 / 1024 * 10) / 10,
      viewonceMediaMB: Math.round(voMedia / 1024 / 1024 * 10) / 10,
      antideleteMediaMB: Math.round(adMedia / 1024 / 1024 * 10) / 10,
      statusMediaMB: Math.round(statusMedia / 1024 / 1024 * 10) / 10,
      tempFilesMB: Math.round(tempFiles / 1024 / 1024 * 10) / 10,
      backupMB: Math.round(backupFiles / 1024 / 1024 * 10) / 10,
      statusLogsMB: Math.round(statusLogs / 1024 / 1024 * 10) / 10
    };
  },
  _countSessionSignalFiles() {
    let count = 0;
    let bytes = 0;
    try {
      if (!fs.existsSync(SESSION_DIR)) {
        return {
          count: 0,
          bytes: 0
        };
      }
      const files = fs.readdirSync(SESSION_DIR);
      for (const file of files) {
        if (file.startsWith("sender-key-") || file.startsWith("pre-key-") || file.startsWith("app-state-sync-version-")) {
          count++;
          try {
            bytes += fs.statSync(path.join(SESSION_DIR, file)).size;
          } catch {}
        }
      }
    } catch {}
    return {
      count,
      bytes
    };
  },
  async _yieldBatch(i, batchSize = 50) {
    if (i > 0 && i % batchSize === 0) {
      await new Promise(r => setImmediate(r));
    }
  },
  async cleanSessionSignalFilesAsync(aggressive = false) {
    let removed = 0;
    try {
      if (!fs.existsSync(SESSION_DIR)) {
        return 0;
      }
      const files = await fs.promises.readdir(SESSION_DIR);
      const senderKeys = files.filter(f => f.startsWith("sender-key-"));
      const preKeys = files.filter(f => f.startsWith("pre-key-"));
      const appSync = files.filter(f => f.startsWith("app-state-sync-version-"));
      const senderLimit = aggressive ? 10 : 40;
      const preKeyLimit = aggressive ? 10 : 40;
      const appSyncLimit = aggressive ? 3 : 10;
      const removeFiles = async (list, limit) => {
        if (list.length <= limit) {
          return 0;
        }
        const toRemove = list.slice(0, list.length - limit);
        let count = 0;
        for (let i = 0; i < toRemove.length; i++) {
          try {
            await fs.promises.unlink(path.join(SESSION_DIR, toRemove[i]));
            count++;
          } catch {}
          await this._yieldBatch(i);
        }
        return count;
      };
      removed += await removeFiles(senderKeys, senderLimit);
      removed += await removeFiles(preKeys, preKeyLimit);
      removed += await removeFiles(appSync, appSyncLimit);
    } catch {}
    return removed;
  },
  async cleanOldMediaAsync(dirPath, maxAgeDays = 3, aggressive = false) {
    let removed = 0;
    try {
      if (!fs.existsSync(dirPath)) {
        return 0;
      }
      const now = Date.now();
      const maxAge = aggressive ? 1800000 : maxAgeDays * 24 * 60 * 60 * 1000;
      const files = await fs.promises.readdir(dirPath);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.endsWith(".json")) {
          continue;
        }
        try {
          const full = path.join(dirPath, file);
          const stat = await fs.promises.stat(full);
          if (stat.isFile() && now - stat.mtimeMs > maxAge) {
            await fs.promises.unlink(full);
            removed++;
          }
        } catch {}
        await this._yieldBatch(i);
      }
    } catch {}
    return removed;
  },
  async cleanTempFilesAsync(aggressive = false) {
    let removed = 0;
    const tempDirs = ["./temp", "./temp/ig", "./temp/snapchat", "./temp/compressed", "./temp/apk", "./gaaju-cmds/temp", "./viewonce_stealth", "./viewonce_downloads", "./temp_stickers", "./temp_url_uploads", "./collected_stickers", "./sticker_packs"];
    const now = Date.now();
    const maxAge = aggressive ? 120000 : 900000;
    for (const dir of tempDirs) {
      try {
        if (!fs.existsSync(dir)) {
          continue;
        }
        const files = await fs.promises.readdir(dir);
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          try {
            const full = path.join(dir, file);
            const stat = await fs.promises.stat(full);
            if (stat.isFile() && now - stat.mtimeMs > maxAge) {
              await fs.promises.unlink(full);
              removed++;
            }
          } catch {}
          await this._yieldBatch(i);
        }
      } catch {}
    }
    return removed;
  },
  async cleanBackupsAsync() {
    let removed = 0;
    try {
      if (!fs.existsSync("./session_backup")) {
        return 0;
      }
      const files = await fs.promises.readdir("./session_backup");
      for (let i = 0; i < files.length; i++) {
        try {
          await fs.promises.unlink(path.join("./session_backup", files[i]));
          removed++;
        } catch {}
        await this._yieldBatch(i);
      }
      try {
        await fs.promises.rmdir("./session_backup");
      } catch {}
    } catch {}
    return removed;
  },
  async truncateStatusLogsAsync() {
    try {
      const logFile = "./data/status_detection_logs.json";
      if (!fs.existsSync(logFile)) {
        return false;
      }
      const raw = await fs.promises.readFile(logFile, "utf8");
      const data = JSON.parse(raw);
      if (data.logs && data.logs.length > 50) {
        data.logs = data.logs.slice(-50);
        await fs.promises.writeFile(logFile, JSON.stringify(data));
        return true;
      }
    } catch {}
    return false;
  },
  async cleanStatusMediaAsync(aggressive = false) {
    let removed = 0;
    const statusMediaDir = "./data/antidelete/status/media";
    try {
      if (!fs.existsSync(statusMediaDir)) {
        return 0;
      }
      const now = Date.now();
      const maxAge = aggressive ? 900000 : 3600000;
      const files = await fs.promises.readdir(statusMediaDir);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const full = path.join(statusMediaDir, file);
          const stat = await fs.promises.stat(full);
          if (stat.isFile() && now - stat.mtimeMs > maxAge) {
            await fs.promises.unlink(full);
            removed++;
          }
        } catch {}
        await this._yieldBatch(i);
      }
    } catch {}
    return removed;
  },
  runCleanup(aggressive = false) {
    this.runCleanupAsync(aggressive).catch(() => {});
  },
  async cleanLogFilesAsync() {
    let removed = 0;
    try {
      const logDirs = [".", "./logs"];
      const now = Date.now();
      for (const dir of logDirs) {
        try {
          if (!fs.existsSync(dir)) {
            continue;
          }
          const files = await fs.promises.readdir(dir);
          for (const file of files) {
            if (!file.endsWith(".log")) {
              continue;
            }
            try {
              const full = path.join(dir, file);
              const stat = await fs.promises.stat(full);
              if (stat.isFile() && (stat.size > 5242880 || now - stat.mtimeMs > 86400000)) {
                await fs.promises.unlink(full);
                removed++;
              }
            } catch {}
          }
        } catch {}
      }
    } catch {}
    return removed;
  },
  async runCleanupAsync(aggressive = false) {
    const yieldToLoop = () => new Promise(r => setImmediate(r));
    const results = {};
    results.sessionFiles = await this.cleanSessionSignalFilesAsync(aggressive);
    await yieldToLoop();
    results.viewonceMedia = (await this.cleanOldMediaAsync("./data/viewonce_messages", 1 / 12, aggressive)) + (await this.cleanOldMediaAsync("./data/viewonce_private", 1 / 12, aggressive));
    await yieldToLoop();
    results.antideleteMedia = await this.cleanOldMediaAsync("./data/antidelete/media", 1 / 48, aggressive);
    await yieldToLoop();
    results.statusMedia = await this.cleanStatusMediaAsync(aggressive);
    await yieldToLoop();
    results.tempFiles = await this.cleanTempFilesAsync(aggressive);
    await yieldToLoop();
    results.backups = aggressive ? await this.cleanBackupsAsync() : 0;
    results.statusLogs = (await this.truncateStatusLogsAsync()) ? 1 : 0;
    results.logFiles = await this.cleanLogFilesAsync();
    const total = Object.values(results).reduce((a, b) => a + b, 0);
    if (total > 0) {
      UltraCleanLogger.info(`🧹 Disk cleanup: removed ${total} items (session: ${results.sessionFiles}, viewonce: ${results.viewonceMedia}, antidelete: ${results.antideleteMedia}, status-media: ${results.statusMedia}, temp: ${results.tempFiles}, backups: ${results.backups}, logs: ${results.logFiles})`);
    }
    this.lastCleanup = Date.now();
    return results;
  },
  async monitorAsync() {
    const freeMB = await this.getDiskFreeAsync();
    if (freeMB === null) {
      return;
    }
    if (freeMB < this.CRITICAL_MB) {
      this.isLow = true;
      UltraCleanLogger.error(`🚨 CRITICAL: Only ${freeMB}MB disk space left! Running aggressive cleanup...`);
      await this.runCleanupAsync(true);
    } else if (freeMB < this.WARNING_MB) {
      this.isLow = true;
      if (Date.now() - this.lastWarning > 1800000) {
        UltraCleanLogger.warning(`⚠️ Low disk space: ${freeMB}MB remaining. Running cleanup...`);
        this.lastWarning = Date.now();
      }
      await this.runCleanupAsync(false);
    } else {
      this.isLow = false;
    }
  },
  _intervals: [],
  _started: false,
  async start() {
    if (this._started) {
      return;
    }
    this._started = true;
    const freeMB = await this.getDiskFreeAsync();
    if (freeMB !== null && freeMB < this.WARNING_MB) {
      UltraCleanLogger.warning(`⚠️ Low disk on startup: ${freeMB}MB free. Running immediate cleanup...`);
      await this.runCleanupAsync(freeMB < this.CRITICAL_MB);
    } else {
      this.runCleanupAsync(false).catch(() => {});
    }
    this._intervals.push(setInterval(() => this.monitorAsync().catch(() => {}), this.CHECK_INTERVAL));
    this._intervals.push(setInterval(() => {
      if (!this.isLow) {
        this.runCleanupAsync(false).catch(() => {});
      }
    }, this.CLEANUP_INTERVAL));
    UltraCleanLogger.info("💾 Disk space manager: ✅ ACTIVE");
  }
};
function safeWriteFile(filePath, data) {
  const content = typeof data === "string" || Buffer.isBuffer(data) ? data : JSON.stringify(data, null, 2);
  try {
    fs.writeFileSync(filePath, content);
    return true;
  } catch (err) {
    if (err.code === "ENOSPC") {
      UltraCleanLogger.error(`💾 Disk full! Cannot write ${filePath}. Running emergency cleanup...`);
      DiskManager._lastDiskCheck = 0;
      DiskManager.runCleanup(true);
      try {
        fs.writeFileSync(filePath, content);
        return true;
      } catch {
        return false;
      }
    }
    throw err;
  }
}
async function safeWriteFileAsync(filePath, data) {
  const fsPromises = fs.promises;
  try {
    await fsPromises.writeFile(filePath, typeof data === "string" ? data : JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    if (err.code === "ENOSPC") {
      UltraCleanLogger.error(`💾 Disk full! Cannot write ${filePath}. Running emergency cleanup...`);
      DiskManager.runCleanup(true);
      try {
        await fsPromises.writeFile(filePath, typeof data === "string" ? data : JSON.stringify(data, null, 2));
        return true;
      } catch {
        return false;
      }
    }
    throw err;
  }
}

// Utility functions
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// ====== JID/LID HANDLING SYSTEM ======
class JidManager {
  constructor() {
    this.ownerJids = new Set();
    this.ownerLids = new Set();
    this.owner = null;
    this.loadOwnerData();
    this.loadWhitelist();
    UltraCleanLogger.success("JID Manager initialized");
  }
  loadOwnerData() {
    try {
      const data = _cache_owner_data;
      if (data) {
        const ownerJid = data.OWNER_JID;
        if (ownerJid) {
          const cleaned = this.cleanJid(ownerJid);
          this.owner = {
            rawJid: ownerJid,
            cleanJid: cleaned.cleanJid,
            cleanNumber: cleaned.cleanNumber,
            isLid: cleaned.isLid,
            linkedAt: data.linkedAt || new Date().toISOString()
          };
          this.ownerJids.clear();
          this.ownerLids.clear();
          this.ownerJids.add(cleaned.cleanJid);
          this.ownerJids.add(ownerJid);
          if (cleaned.isLid) {
            this.ownerLids.add(ownerJid);
            const lidNumber = ownerJid.split("@")[0];
            this.ownerLids.add(lidNumber);
            OWNER_LID = ownerJid;
          }
          OWNER_JID = ownerJid;
          OWNER_NUMBER = cleaned.cleanNumber;
          OWNER_CLEAN_JID = cleaned.cleanJid;
          OWNER_CLEAN_NUMBER = cleaned.cleanNumber;
          UltraCleanLogger.success(`Loaded owner: ${cleaned.cleanJid}`);
        }
      }
    } catch {
      // Silent fail
    }
  }
  loadWhitelist() {
    try {
      const data = _cache_whitelist;
      if (data && data.whitelist && Array.isArray(data.whitelist)) {
        data.whitelist.forEach(item => {
          WHITELIST.add(item);
        });
      }
    } catch {
      // Silent fail
    }
  }
  cleanJid(jid) {
    if (!jid) {
      return {
        cleanJid: "",
        cleanNumber: "",
        raw: jid,
        isLid: false
      };
    }
    const isLid = jid.includes("@lid");
    if (isLid) {
      const lidFull = jid.split("@")[0];
      const lidNumber = lidFull.split(":")[0];
      return {
        raw: jid,
        cleanJid: jid,
        cleanNumber: lidNumber,
        isLid: true
      };
    }
    const [numberPart] = jid.split("@")[0].split(":");
    const serverPart = jid.split("@")[1] || "s.whatsapp.net";
    const cleanNumber = numberPart.replace(/[^0-9]/g, "");
    const normalizedNumber = cleanNumber.startsWith("0") ? cleanNumber.substring(1) : cleanNumber;
    const cleanJid = `${normalizedNumber}@${serverPart}`;
    return {
      raw: jid,
      cleanJid: cleanJid,
      cleanNumber: normalizedNumber,
      isLid: false
    };
  }
  isOwner(msg) {
    if (!msg || !msg.key) {
      return false;
    }
    const chatJid = msg.key.remoteJid;
    const participant = msg.key.participant;
    const senderJid = participant || chatJid;
    const cleaned = this.cleanJid(senderJid);
    if (!this.owner || !this.owner.cleanNumber) {
      return false;
    }
    if (this.ownerJids.has(cleaned.cleanJid) || this.ownerJids.has(senderJid)) {
      return true;
    }
    if (cleaned.isLid) {
      const lidNumber = cleaned.cleanNumber;
      if (this.ownerLids.has(senderJid) || this.ownerLids.has(lidNumber)) {
        return true;
      }
      if (OWNER_LID && (senderJid === OWNER_LID || lidNumber === OWNER_LID.split("@")[0])) {
        return true;
      }
    }
    return false;
  }
  isSudo(msg) {
    if (!msg || !msg.key) {
      return false;
    }
    const chatJid = msg.key.remoteJid;
    const participant = msg.key.participant;
    const senderJid = participant || chatJid;
    if (isSudoJid(senderJid)) {
      return true;
    }
    const cleaned = this.cleanJid(senderJid);
    if (isSudoNumber(cleaned.cleanNumber)) {
      return true;
    }
    const rawNum = senderJid.split("@")[0].split(":")[0];
    if (rawNum !== cleaned.cleanNumber && isSudoNumber(rawNum)) {
      return true;
    }
    if (senderJid.includes("@lid")) {
      const phone = resolvePhoneFromLid(senderJid);
      if (phone && isSudoNumber(phone)) {
        mapLidToPhone(rawNum, phone);
        return true;
      }
    }
    if (isSudoByLid(rawNum)) {
      return true;
    }
    if (isSudoByLid(cleaned.cleanNumber)) {
      return true;
    }
    const lidNum = senderJid.split("@")[0].split(":")[0];
    const cachedPhone = lidPhoneCache.get(lidNum);
    if (cachedPhone && isSudoNumber(cachedPhone)) {
      return true;
    }
    if (rawNum.length > 15) {
      for (const [cachedLid, cachedPhoneVal] of lidPhoneCache) {
        if (cachedLid === rawNum && isSudoNumber(cachedPhoneVal)) {
          return true;
        }
      }
    }
    return false;
  }
  async isSudoAsync(msg, sock) {
    if (this.isSudo(msg)) {
      return true;
    }
    if (!msg || !msg.key) {
      return false;
    }
    const chatJid = msg.key.remoteJid;
    const participant = msg.key.participant;
    const senderJid = participant || chatJid;
    const {
      sudoers
    } = getSudoList();
    if (sudoers.length === 0) {
      return false;
    }
    const senderLidNum = senderJid.split("@")[0].split(":")[0];
    const senderFull = senderJid.split("@")[0];
    try {
      if (chatJid.includes("@g.us") && sock) {
        await buildLidMapFromGroup(chatJid, sock);
        const resolved = lidPhoneCache.get(senderLidNum) || lidPhoneCache.get(senderFull) || getPhoneFromLid(senderLidNum) || getPhoneFromLid(senderFull);
        if (resolved && isSudoNumber(resolved)) {
          return true;
        }
        if (this.isSudo(msg)) {
          return true;
        }
      }
    } catch (err) {
      UltraCleanLogger.info(`⚠️ isSudoAsync group error: ${err.message}`);
    }
    try {
      if (!chatJid.includes("@g.us") && sock && senderJid.includes("@lid")) {
        const _alreadyResolved = lidPhoneCache.get(senderLidNum) || lidPhoneCache.get(senderFull) || getPhoneFromLid(senderLidNum) || getPhoneFromLid(senderFull);
        if (_alreadyResolved) {
          if (isSudoNumber(_alreadyResolved)) {
            UltraCleanLogger.info(`Sudo LID resolved from cache: +${_alreadyResolved}`);
            return true;
          }
          return false;
        }
        if (!hasUnmappedSudos()) {
          return false;
        }
        const _now = Date.now();
        const _lastGlobalScan = isSudoAsync._lastGlobalScan || 0;
        const _scanning = isSudoAsync._scanning || false;
        if (!_scanning && _now - _lastGlobalScan > 600000) {
          isSudoAsync._scanning = true;
          isSudoAsync._lastGlobalScan = _now;
          try {
            const groups = await sock.groupFetchAllParticipating();
            if (groups) {
              for (const [groupId, groupData] of Object.entries(groups)) {
                const participants = groupData.participants || [];
                for (const p of participants) {
                  const {
                    phoneNum,
                    lidNum
                  } = extractParticipantInfo(p, sock);
                  if (phoneNum && lidNum && phoneNum !== lidNum) {
                    cacheLidPhone(lidNum, phoneNum);
                    mapLidToPhone(lidNum, phoneNum);
                  }
                }
              }
            }
          } finally {
            isSudoAsync._scanning = false;
          }
        }
        const resolved = lidPhoneCache.get(senderLidNum) || lidPhoneCache.get(senderFull) || getPhoneFromLid(senderLidNum) || getPhoneFromLid(senderFull);
        if (resolved && isSudoNumber(resolved)) {
          UltraCleanLogger.info(`Sudo LID resolved from group scan: +${resolved}`);
          return true;
        }
      }
    } catch (err) {
      isSudoAsync._scanning = false;
      UltraCleanLogger.info(`⚠️ isSudoAsync DM scan error: ${err.message}`);
    }
    return false;
  }
  setNewOwner(newJid, isAutoLinked = false) {
    try {
      const cleaned = this.cleanJid(newJid);
      this.ownerJids.clear();
      this.ownerLids.clear();
      WHITELIST.clear();
      this.owner = {
        rawJid: newJid,
        cleanJid: cleaned.cleanJid,
        cleanNumber: cleaned.cleanNumber,
        isLid: cleaned.isLid,
        linkedAt: new Date().toISOString(),
        autoLinked: isAutoLinked
      };
      this.ownerJids.add(cleaned.cleanJid);
      this.ownerJids.add(newJid);
      if (cleaned.isLid) {
        this.ownerLids.add(newJid);
        const lidNumber = newJid.split("@")[0];
        this.ownerLids.add(lidNumber);
        OWNER_LID = newJid;
      } else {
        OWNER_LID = null;
      }
      OWNER_JID = newJid;
      OWNER_NUMBER = cleaned.cleanNumber;
      OWNER_CLEAN_JID = cleaned.cleanJid;
      OWNER_CLEAN_NUMBER = cleaned.cleanNumber;
      const ownerData = {
        OWNER_JID: newJid,
        OWNER_NUMBER: cleaned.cleanNumber,
        OWNER_CLEAN_JID: cleaned.cleanJid,
        OWNER_CLEAN_NUMBER: cleaned.cleanNumber,
        ownerLID: cleaned.isLid ? newJid : null,
        linkedAt: new Date().toISOString(),
        autoLinked: isAutoLinked,
        previousOwnerCleared: true,
        version: VERSION
      };
      _cache_owner_data = ownerData;
      _saveConfigCache("owner_data", ownerData);
      UltraCleanLogger.success(`New owner set: ${cleaned.cleanJid}`);
      return {
        success: true,
        owner: this.owner,
        isLid: cleaned.isLid
      };
    } catch {
      return {
        success: false,
        error: "Failed to set new owner"
      };
    }
  }
  getOwnerInfo() {
    return {
      ownerJid: this.owner?.cleanJid || null,
      ownerNumber: this.owner?.cleanNumber || null,
      ownerLid: OWNER_LID || null,
      jidCount: this.ownerJids.size,
      lidCount: this.ownerLids.size,
      whitelistCount: WHITELIST.size,
      isLid: this.owner?.isLid || false,
      linkedAt: this.owner?.linkedAt || null
    };
  }
}
const jidManager = new JidManager();

// ====== NEW MEMBER DETECTION SYSTEM ======
class NewMemberDetector {
  constructor() {
    this.enabled = true;
    this.detectedMembers = new Map();
    this.groupMembersCache = new Map();
    this.loadDetectionData();
    UltraCleanLogger.success("New Member Detector initialized");
  }
  loadDetectionData() {
    try {
      if (_cache_member_detection && _cache_member_detection.detectedMembers) {
        for (const [groupId, members] of Object.entries(_cache_member_detection.detectedMembers)) {
          this.detectedMembers.set(groupId, members);
        }
        UltraCleanLogger.info(`📊 Loaded ${this.detectedMembers.size} groups member data`);
        return;
      }
      db.getConfig("member_detection", {}).then(data => {
        try {
          _cache_member_detection = data;
          if (data && data.detectedMembers) {
            for (const [groupId, members] of Object.entries(data.detectedMembers)) {
              this.detectedMembers.set(groupId, members);
            }
            UltraCleanLogger.info(`📊 Loaded ${this.detectedMembers.size} groups member data`);
          }
        } catch {}
      }).catch(err => {
        UltraCleanLogger.warning(`Could not load member detection data: ${err.message}`);
      });
    } catch (error) {
      UltraCleanLogger.warning(`Could not load member detection data: ${error.message}`);
    }
  }
  saveDetectionData() {
    try {
      const data = {
        detectedMembers: {},
        updatedAt: new Date().toISOString(),
        totalGroups: this.detectedMembers.size
      };
      for (const [groupId, members] of this.detectedMembers.entries()) {
        data.detectedMembers[groupId] = members;
      }
      _cache_member_detection = data;
      db.setConfig("member_detection", data).catch(err => {
        UltraCleanLogger.warning(`Could not save member detection data: ${err.message}`);
      });
    } catch (error) {
      UltraCleanLogger.warning(`Could not save member detection data: ${error.message}`);
    }
  }
  async detectNewMembers(sock, groupUpdate) {
    try {
      if (!this.enabled) {
        return null;
      }
      if (!sock?.ws?.isOpen) {
        return null;
      }
      const groupId = groupUpdate.id;
      const action = groupUpdate.action;
      if (action === "add" || action === "invite") {
        const participants = groupUpdate.participants || [];
        const _cachedMeta = groupMetadataCache.get(groupId);
        const groupName = _cachedMeta?.data?.subject || _cachedMeta?.subject || "Unknown Group";
        let cachedMembers = this.groupMembersCache.get(groupId) || new Set();
        const newMembers = [];
        for (const participant of participants) {
          let userJid;
          if (typeof participant === "string") {
            userJid = participant.includes("@") ? participant : null;
          } else if (participant && typeof participant === "object") {
            const jid = participant.jid || participant.id || participant.userJid || participant.participant || participant.user;
            if (typeof jid === "string" && jid.includes("@")) {
              userJid = jid;
            } else if (typeof jid === "string" && /^\d+$/.test(jid)) {
              userJid = `${jid}@s.whatsapp.net`;
            } else {
              userJid = null;
            }
          } else {
            userJid = null;
          }
          if (!userJid) {
            continue;
          }
          if (!cachedMembers.has(userJid)) {
            try {
              if (!sock?.ws?.isOpen) {
                return null;
              }
              let userName = userJid.split("@")[0];
              try {
                const _timeout = new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 5000));
                const userInfo = await Promise.race([sock.onWhatsApp(userJid), _timeout]);
                userName = userInfo[0]?.name || userName;
              } catch {}
              const userNumber = userJid.split("@")[0];
              newMembers.push({
                jid: userJid,
                name: userName,
                number: userNumber,
                addedAt: new Date().toISOString(),
                timestamp: Date.now(),
                action: action,
                addedBy: groupUpdate.actor || "unknown"
              });
              cachedMembers.add(userJid);
              this.showMemberNotification(groupName, userName, userNumber, action);
            } catch (error) {
              UltraCleanLogger.warning(`Could not get user info for ${userJid}: ${error.message}`);
            }
          }
        }
        this.groupMembersCache.set(groupId, cachedMembers);
        if (newMembers.length > 0) {
          const groupEvents = this.detectedMembers.get(groupId) || [];
          groupEvents.push(...newMembers);
          this.detectedMembers.set(groupId, groupEvents.slice(-50));
          if (Math.random() < 0.2) {
            this.saveDetectionData();
          }
          return newMembers;
        }
      }
      return null;
    } catch (error) {
      UltraCleanLogger.error(`Member detection error: ${error.message}`);
      return null;
    }
  }
  showMemberNotification(groupName, userName, userNumber, action) {
    const actionEmoji = action === "add" ? "➕" : "📨";
    const actionText = action === "add" ? "ADDED" : "INVITED";
    logMember(`${actionEmoji} ${actionText}: ${userName} (+${userNumber})`);
    logGroup(`👥 Group: ${groupName}`);
  }
  async checkWelcomeSystem(sock, groupId, newMembers) {
    try {
      const welcomeData = this.loadWelcomeData();
      const groupWelcome = welcomeData.groups?.[groupId];
      if (groupWelcome?.enabled) {
        for (const member of newMembers) {
          await this.sendWelcomeMessage(sock, groupId, member.jid, groupWelcome.message);
        }
      }
    } catch (error) {
      UltraCleanLogger.warning(`Welcome system check failed: ${error.message}`);
    }
  }
  async sendWelcomeMessage(sock, groupId, userId, message) {
    try {
      const userInfo = await sock.onWhatsApp(userId);
      const userName = userInfo[0]?.name || userId.split("@")[0];
      const metadata = await sock.groupMetadata(groupId);
      const memberCount = metadata.participants.length;
      const groupName = metadata.subject || "Our Group";
      const welcomeText = this.replaceWelcomeVariables(message, {
        name: userName,
        group: groupName,
        members: memberCount,
        mention: `@${userId.split("@")[0]}`
      });
      let profilePic = null;
      try {
        profilePic = await sock.profilePictureUrl(userId, "image");
      } catch {
        profilePic = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
      }
      await sock.sendMessage(groupId, {
        image: {
          url: profilePic
        },
        caption: welcomeText,
        mentions: [userId],
        contextInfo: {
          mentionedJid: [userId]
        }
      });
      const welcomeData = this.loadWelcomeData();
      if (welcomeData.groups?.[groupId]) {
        welcomeData.groups[groupId].lastWelcome = Date.now();
        this.saveWelcomeData(welcomeData);
      }
      UltraCleanLogger.info(`✅ Welcome sent to ${userName} in ${groupName}`);
    } catch (error) {
      UltraCleanLogger.warning(`Could not send welcome message: ${error.message}`);
    }
  }
  replaceWelcomeVariables(message, variables) {
    return message.replace(/{name}/g, variables.name).replace(/{group}/g, variables.group).replace(/{members}/g, variables.members).replace(/{mention}/g, variables.mention);
  }
  loadWelcomeData() {
    try {
      if (_cache_welcome_data) {
        return _cache_welcome_data;
      }
    } catch (error) {
      UltraCleanLogger.warning(`Error loading welcome data: ${error.message}`);
    }
    return {
      groups: {},
      version: "1.0",
      created: new Date().toISOString()
    };
  }
  saveWelcomeData(data) {
    try {
      data.updated = new Date().toISOString();
      _cache_welcome_data = data;
      _saveConfigCache("welcome_data", data);
      return true;
    } catch (error) {
      UltraCleanLogger.warning(`Error saving welcome data: ${error.message}`);
      return false;
    }
  }
  getStats() {
    let totalEvents = 0;
    for (const events of this.detectedMembers.values()) {
      totalEvents += events.length;
    }
    return {
      enabled: this.enabled,
      totalGroups: this.detectedMembers.size,
      totalEvents: totalEvents,
      cachedGroups: this.groupMembersCache.size
    };
  }
}
const memberDetector = new NewMemberDetector();

// ====== AUTO GROUP JOIN SYSTEM ======
// class AutoGroupJoinSystem {
//     constructor() {
//         this.initialized = false;
//         this.invitedUsers = new Set();
//         this.loadInvitedUsers();
//         UltraCleanLogger.success('Auto-Join System initialized');
//     }

//     loadInvitedUsers() {
//         try {
//             if (fs.existsSync(AUTO_JOIN_LOG_FILE)) {
//                 const data = JSON.parse(fs.readFileSync(AUTO_JOIN_LOG_FILE, 'utf8'));
//                 data.users.forEach(user => this.invitedUsers.add(user));
//                 UltraCleanLogger.info(`📊 Loaded ${this.invitedUsers.size} previously invited users`);
//             }
//         } catch (error) {
//             // Silent fail
//         }
//     }

//     saveInvitedUser(userJid) {
//         try {
//             this.invitedUsers.add(userJid);

//             let data = { 
//                 users: [], 
//                 lastUpdated: new Date().toISOString(),
//                 totalInvites: 0
//             };

//             if (fs.existsSync(AUTO_JOIN_LOG_FILE)) {
//                 data = JSON.parse(fs.readFileSync(AUTO_JOIN_LOG_FILE, 'utf8'));
//             }

//             if (!data.users.includes(userJid)) {
//                 data.users.push(userJid);
//                 data.totalInvites = data.users.length;
//                 data.lastUpdated = new Date().toISOString();
//                 fs.writeFileSync(AUTO_JOIN_LOG_FILE, JSON.stringify(data, null, 2));
//                 UltraCleanLogger.success(`✅ Saved invited user: ${userJid}`);
//             }
//         } catch (error) {
//             UltraCleanLogger.error(`❌ Error saving invited user: ${error.message}`);
//         }
//     }

//     isOwner(userJid, jidManager) {
//         if (!jidManager.owner || !jidManager.owner.cleanNumber) return false;
//         return userJid === jidManager.owner.cleanJid || 
//                userJid === jidManager.owner.rawJid ||
//                userJid.includes(jidManager.owner.cleanNumber);
//     }

//     async sendWelcomeMessage(sock, userJid) {
//         if (!SEND_WELCOME_MESSAGE) return;

//         try {
//             await sock.sendMessage(userJid, {
//                 text: `🎉 *WELCOME TO GAAJU-MD!*\n\n` +
//                       `Thank you for connecting with GAAJU-MD! 🤖\n\n` +
//                       `✨ *Features Available:*\n` +
//                       `• Multiple command categories\n` +
//                       `• Group management tools\n` +
//                       `• Media downloading\n` +
//                       `• Anti-ViewOnce system\n` +
//                       `• And much more!\n\n` +
//                       `You're being automatically invited to join our official community group...\n` +
//                       `Please wait a moment... ⏳`
//             });
//         } catch (error) {
//             UltraCleanLogger.error(`❌ Could not send welcome message: ${error.message}`);
//         }
//     }

//     async sendGroupInvitation(sock, userJid, isOwner = false) {
//         try {
//             const message = isOwner 
//                 ? `👑 *OWNER AUTO-JOIN*\n\n` +
//                   `You are being automatically added to the group...\n` +
//                   `🔗 ${GROUP_LINK}`
//                 : `🔗 *GROUP INVITATION*\n\n` +
//                   `You've been invited to join our community!\n\n` +
//                   `*Group Name:* ${GROUP_NAME}\n` +
//                   `*Features:*\n` +
//                   `• Bot support & updates\n` +
//                   `• Community chat\n` +
//                   `• Exclusive features\n` +
//                   `• Anti-ViewOnce protection\n\n` +
//                   `Click to join: ${GROUP_LINK}`;

//             await sock.sendMessage(userJid, { text: message });
//             return true;
//         } catch (error) {
//             UltraCleanLogger.error(`❌ Could not send group invitation: ${error.message}`);
//             return false;
//         }
//     }

//     async attemptAutoAdd(sock, userJid, isOwner = false) {
//         try {
//             UltraCleanLogger.info(`🔄 Attempting to auto-add ${isOwner ? 'owner' : 'user'} ${userJid} to group...`);

//             let groupId;
//             try {
//                 groupId = await sock.groupAcceptInvite(GROUP_INVITE_CODE);
//                 UltraCleanLogger.success(`✅ Successfully accessed group: ${groupId}`);
//             } catch (inviteError) {
//                 UltraCleanLogger.warning(`⚠️ Could not accept invite, trying direct add: ${inviteError.message}`);
//                 throw new Error('Could not access group with invite code');
//             }

//             await sock.groupParticipantsUpdate(groupId, [userJid], 'add');
//             UltraCleanLogger.success(`✅ Successfully added ${userJid} to group`);

//             const successMessage = isOwner
//                 ? `✅ *SUCCESSFULLY JOINED!*\n\n` +
//                   `You have been automatically added to the group!\n` +
//                   `The bot is now fully operational there. 🎉`
//                 : `✅ *WELCOME TO THE GROUP!*\n\n` +
//                   `You have been successfully added to ${GROUP_NAME}!\n` +
//                   `Please introduce yourself when you join. 👋`;

//             await sock.sendMessage(userJid, { text: successMessage });

//             return true;

//         } catch (error) {
//             UltraCleanLogger.error(`❌ Auto-add failed for ${userJid}: ${error.message}`);

//             const manualMessage = isOwner
//                 ? `⚠️ *MANUAL JOIN REQUIRED*\n\n` +
//                   `Could not auto-add you to the group.\n\n` +
//                   `*Please join manually:*\n` +
//                   `${GROUP_LINK}\n\n` +
//                   `Once joined, the bot will work there immediately.`
//                 : `⚠️ *MANUAL JOIN REQUIRED*\n\n` +
//                   `Could not auto-add you to the group.\n\n` +
//                   `*Please join manually:*\n` +
//                   `${GROUP_LINK}\n\n` +
//                   `We'd love to have you in our community!`;

//             await sock.sendMessage(userJid, { text: manualMessage });

//             return false;
//         }
//     }

//     async autoJoinGroup(sock, userJid) {
//         if (!AUTO_JOIN_ENABLED) {
//             UltraCleanLogger.info('Auto-join is disabled in settings');
//             return false;
//         }

//         if (this.invitedUsers.has(userJid)) {
//             UltraCleanLogger.info(`User ${userJid} already invited, skipping`);
//             return false;
//         }

//         const isOwner = this.isOwner(userJid, jidManager);
//         UltraCleanLogger.info(`${isOwner ? '👑 Owner' : '👤 User'} ${userJid} connected, initiating auto-join...`);

//         await this.sendWelcomeMessage(sock, userJid);

//         await new Promise(resolve => setTimeout(resolve, AUTO_JOIN_DELAY));

//         await this.sendGroupInvitation(sock, userJid, isOwner);

//         await new Promise(resolve => setTimeout(resolve, 3000));

//         const success = await this.attemptAutoAdd(sock, userJid, isOwner);

//         this.saveInvitedUser(userJid);

//         return success;
//     }

//     async startupAutoJoin(sock) {
//         if (!AUTO_JOIN_ENABLED || !jidManager.owner) return;

//         try {
//             UltraCleanLogger.info('🚀 Running startup auto-join check...');

//             const ownerJid = jidManager.owner.cleanJid;

//             if (jidManager.owner.autoJoinedGroup) {
//                 UltraCleanLogger.info('👑 Owner already auto-joined previously');
//                 return;
//             }

//             UltraCleanLogger.info(`👑 Attempting to auto-join owner ${ownerJid} to group...`);

//             await new Promise(resolve => setTimeout(resolve, 10000));

//             const success = await this.autoJoinGroup(sock, ownerJid);

//             if (success) {
//                 UltraCleanLogger.success('✅ Startup auto-join completed successfully');
//                 if (jidManager.owner) {
//                     jidManager.owner.autoJoinedGroup = true;
//                     jidManager.owner.lastAutoJoin = new Date().toISOString();
//                 }
//             } else {
//                 UltraCleanLogger.warning('⚠️ Startup auto-join failed');
//             }

//         } catch (error) {
//             UltraCleanLogger.error(`Startup auto-join error: ${error.message}`);
//         }
//     }
// }

// const autoGroupJoinSystem = new AutoGroupJoinSystem();

// ====== ULTIMATE FIX SYSTEM ======
class UltimateFixSystem {
  constructor() {
    this.fixedJids = new Set();
    this.fixApplied = false;
    this.restartFixAttempted = false;
  }
  async applyUltimateFix(sock, senderJid, cleaned, isFirstUser = false, isRestart = false) {
    try {
      const fixType = isRestart ? "RESTART" : isFirstUser ? "FIRST" : "NORMAL";
      UltraCleanLogger.info(`🔧 Applying Ultimate Fix (${fixType}) in background for: ${cleaned.cleanJid}`);
      const originalIsOwner = jidManager.isOwner;
      jidManager.isOwner = function (message) {
        try {
          const isFromMe = message?.key?.fromMe;
          if (isFromMe) {
            return true;
          }
          if (!this.owner || !this.owner.cleanNumber) {
            this.loadOwnerDataFromFile();
          }
          return originalIsOwner.call(this, message);
        } catch {
          return message?.key?.fromMe || false;
        }
      };
      jidManager.loadOwnerDataFromFile = function () {
        try {
          const data = _cache_owner_data;
          if (data) {
            let cleanNumber = data.OWNER_CLEAN_NUMBER || data.OWNER_NUMBER;
            let cleanJid = data.OWNER_CLEAN_JID || data.OWNER_JID;
            if (cleanNumber && cleanNumber.includes(":")) {
              cleanNumber = cleanNumber.split(":")[0];
            }
            this.owner = {
              cleanNumber: cleanNumber,
              cleanJid: cleanJid,
              rawJid: data.OWNER_JID,
              isLid: cleanJid?.includes("@lid") || false
            };
            return true;
          }
        } catch {
          // Silent fail
        }
        return false;
      };
      global.OWNER_NUMBER = cleaned.cleanNumber;
      global.OWNER_CLEAN_NUMBER = cleaned.cleanNumber;
      global.OWNER_JID = cleaned.cleanJid;
      global.OWNER_CLEAN_JID = cleaned.cleanJid;
      this.fixedJids.add(senderJid);
      this.fixApplied = true;
      UltraCleanLogger.success(`✅ Ultimate Fix applied (${fixType}) in background: ${cleaned.cleanJid}`);
      return {
        success: true,
        jid: cleaned.cleanJid,
        number: cleaned.cleanNumber,
        isLid: cleaned.isLid,
        isRestart: isRestart
      };
    } catch (error) {
      UltraCleanLogger.error(`Ultimate Fix failed: ${error.message}`);
      return {
        success: false,
        error: "Fix failed"
      };
    }
  }
  isFixNeeded(jid) {
    return !this.fixedJids.has(jid);
  }
  shouldRunRestartFix(ownerJid) {
    const hasOwnerData = !!_cache_owner_data;
    const isFixNeeded = this.isFixNeeded(ownerJid);
    const notAttempted = !this.restartFixAttempted;
    return hasOwnerData && isFixNeeded && notAttempted && RESTART_AUTO_FIX_ENABLED;
  }
  markRestartFixAttempted() {
    this.restartFixAttempted = true;
  }
}
const ultimateFixSystem = new UltimateFixSystem();

// ====== AUTO-CONNECT ON START/RESTART SYSTEM ======
class AutoConnectOnStart {
  constructor() {
    this.hasRun = false;
    this.isEnabled = AUTO_CONNECT_ON_START;
  }
  async trigger(sock) {
    try {
      if (!this.isEnabled || this.hasRun) {
        UltraCleanLogger.info(`Auto-connect on start ${this.hasRun ? "already ran" : "disabled"}`);
        return;
      }
      if (!sock || !sock.user?.id) {
        UltraCleanLogger.error("No socket or user ID for auto-connect");
        return;
      }
      const ownerJid = sock.user.id;
      const cleaned = jidManager.cleanJid(ownerJid);
      UltraCleanLogger.info(`⚡ Auto-connect on start triggered for ${cleaned.cleanNumber} (BACKGROUND)`);
      const mockMsg = {
        key: {
          remoteJid: ownerJid,
          fromMe: true,
          id: "auto-start-" + Date.now(),
          participant: ownerJid
        },
        message: {
          conversation: ".connect"
        }
      };
      await handleConnectCommand(sock, mockMsg, [], cleaned);
      this.hasRun = true;
      hasAutoConnectedOnStart = true;
      UltraCleanLogger.success("✅ Auto-connect on start completed in background");
    } catch (error) {
      UltraCleanLogger.error(`Auto-connect on start failed: ${error.message}`);
    }
  }
  reset() {
    this.hasRun = false;
    hasAutoConnectedOnStart = false;
  }
}
const autoConnectOnStart = new AutoConnectOnStart();

// ====== AUTO-LINKING SYSTEM ======
class AutoLinkSystem {
  constructor() {
    this.linkAttempts = new Map();
    this.MAX_ATTEMPTS = 3;
    this.autoConnectEnabled = AUTO_CONNECT_ON_LINK;
  }
  async shouldAutoLink(sock, msg) {
    if (!AUTO_LINK_ENABLED) {
      return false;
    }
    const senderJid = msg.key.participant || msg.key.remoteJid;
    const cleaned = jidManager.cleanJid(senderJid);
    if (!jidManager.owner || !jidManager.owner.cleanNumber) {
      UltraCleanLogger.info(`🔗 New owner detected: ${cleaned.cleanJid}`);
      const result = await this.autoLinkNewOwner(sock, senderJid, cleaned, true);
      if (result && this.autoConnectEnabled) {
        setTimeout(async () => {
          await this.triggerAutoConnect(sock, msg, cleaned, true);
        }, 1500);
      }
      return result;
    }
    if (msg.key.fromMe) {
      return false;
    }
    if (jidManager.isOwner(msg)) {
      return false;
    }
    const currentOwnerNumber = jidManager.owner.cleanNumber;
    if (this.isSimilarNumber(cleaned.cleanNumber, currentOwnerNumber)) {
      const isDifferentDevice = !jidManager.ownerJids.has(cleaned.cleanJid);
      if (isDifferentDevice) {
        UltraCleanLogger.info(`📱 New device detected for owner: ${cleaned.cleanJid}`);
        jidManager.ownerJids.add(cleaned.cleanJid);
        jidManager.ownerJids.add(senderJid);
        if (AUTO_ULTIMATE_FIX_ENABLED && ultimateFixSystem.isFixNeeded(senderJid)) {
          setTimeout(async () => {
            await ultimateFixSystem.applyUltimateFix(sock, senderJid, cleaned, false);
          }, 800);
        }
        await this.sendDeviceLinkedMessage(sock, senderJid, cleaned);
        if (this.autoConnectEnabled) {
          setTimeout(async () => {
            await this.triggerAutoConnect(sock, msg, cleaned, false);
          }, 1500);
        }
        return true;
      }
    }
    return false;
  }
  isSimilarNumber(num1, num2) {
    if (!num1 || !num2) {
      return false;
    }
    if (num1 === num2) {
      return true;
    }
    if (num1.includes(num2) || num2.includes(num1)) {
      return true;
    }
    if (num1.length >= 6 && num2.length >= 6) {
      const last6Num1 = num1.slice(-6);
      const last6Num2 = num2.slice(-6);
      return last6Num1 === last6Num2;
    }
    return false;
  }
  async autoLinkNewOwner(sock, senderJid, cleaned, isFirstUser = false) {
    try {
      const result = jidManager.setNewOwner(senderJid, true);
      if (!result.success) {
        return false;
      }
      await this.sendImmediateSuccessMessage(sock, senderJid, cleaned, isFirstUser);
      if (AUTO_ULTIMATE_FIX_ENABLED) {
        setTimeout(async () => {
          await ultimateFixSystem.applyUltimateFix(sock, senderJid, cleaned, isFirstUser);
        }, 1200);
      }

      // if (AUTO_JOIN_ENABLED) {
      //     setTimeout(async () => {
      //         UltraCleanLogger.info(`🚀 Auto-joining new owner ${cleaned.cleanJid} to group...`);
      //         try {
      //             await autoGroupJoinSystem.autoJoinGroup(sock, senderJid);
      //         } catch (error) {
      //             UltraCleanLogger.error(`❌ Auto-join for new owner failed: ${error.message}`);
      //         }
      //     }, 3000);
      // }

      return true;
    } catch {
      return false;
    }
  }
  async triggerAutoConnect(sock, msg, cleaned, isNewOwner = false) {
    try {
      if (!this.autoConnectEnabled) {
        UltraCleanLogger.info(`Auto-connect disabled, skipping for ${cleaned.cleanNumber}`);
        return;
      }
      UltraCleanLogger.info(`⚡ Auto-triggering connect command for ${cleaned.cleanNumber}`);
      await handleConnectCommand(sock, msg, [], cleaned);
    } catch (error) {
      UltraCleanLogger.error(`Auto-connect failed: ${error.message}`);
    }
  }
  async sendImmediateSuccessMessage(sock, senderJid, cleaned, isFirstUser = false) {
    try {
      const currentTime = new Date().toLocaleTimeString("en-US", { timeZone: process.env.TIME_ZONE || "Africa/Lagos" });
      const currentPrefix = getCurrentPrefix();
      const prefixDisplay = isPrefixless ? "none (prefixless)" : `"${currentPrefix}"`;
      let successMsg = `✅ *${BOT_NAME.toUpperCase()} v${VERSION} CONNECTED!*\n\n`;
      if (isFirstUser) {
        successMsg += `🎉 *FIRST TIME SETUP COMPLETE!*\n\n`;
      } else {
        successMsg += `🔄 *NEW OWNER LINKED!*\n\n`;
      }
      successMsg += `📋 *YOUR INFORMATION:*\n`;
      successMsg += `├─ Your Number: +${cleaned.cleanNumber}\n`;
      successMsg += `├─ Device Type: ${cleaned.isLid ? "Linked Device 🔗" : "Regular Device 📱"}\n`;
      successMsg += `├─ JID: ${cleaned.cleanJid}\n`;
      successMsg += `├─ Prefix: ${prefixDisplay}\n`;
      successMsg += `├─ Mode: ${BOT_MODE}\n`;
      successMsg += `├─ Anti-ViewOnce: ✅ ACTIVE\n`;
      successMsg += `└─ Status: ✅ LINKED SUCCESSFULLY\n\n`;
      successMsg += `⚡ *Background Processes:*\n`;
      successMsg += `├─ Ultimate Fix: Initializing...\n`;
      successMsg += `├─ Auto-Join: ${AUTO_JOIN_ENABLED ? "Initializing..." : "Disabled"}\n`;
      successMsg += `├─ Member Detection: ✅ ACTIVE\n`;
      successMsg += `├─ Anti-ViewOnce: ✅ ACTIVE\n`;
      successMsg += `└─ All systems: ✅ ACTIVE\n\n`;
      if (!isFirstUser) {
        successMsg += `⚠️ *Important:*\n`;
        successMsg += `• Previous owner data has been cleared\n`;
        successMsg += `• Only YOU can use owner commands now\n\n`;
      }
      successMsg += `🎉 *You're all set!* Bot is now ready to use.`;
      await sock.sendMessage(senderJid, {
        text: successMsg
      });
    } catch {
      // Silent fail
    }
  }
  async sendDeviceLinkedMessage(sock, senderJid, cleaned) {
    try {
      const message = `📱 *Device Linked Successfully!*\n\n✅ Your device has been added to owner devices.\n🔒 You can now use owner commands from this device.\n🔄 Ultimate Fix applied automatically in background.\n🔐 Anti-ViewOnce protection active.\n\n🎉 All systems are now active and ready!`;
      await sock.sendMessage(senderJid, {
        text: message
      });
      UltraCleanLogger.info(`📱 Device linked message sent to ${cleaned.cleanNumber}`);
    } catch {
      // Silent fail
    }
  }
}
const autoLinkSystem = new AutoLinkSystem();

// ====== LIGHTWEIGHT MEMORY MONITOR ======
const memoryMonitor = {
  _interval: null,
  _trimInterval: null,
  _emergencyInterval: null,
  start() {
    if (this._interval) {
      return;
    }
    this._lastMemWarn = 0;
    // Main check every 30 seconds — catch memory spikes before they cascade
    this._interval = setInterval(() => {
      try {
        const memMB = Math.round(process.memoryUsage().rss / 1024 / 1024);
        if (memMB > 200) {
          const now = Date.now();
          if (now - this._lastMemWarn > 180000) {
            UltraCleanLogger.warning(`High memory: ${memMB}MB - trimming caches`);
            this._lastMemWarn = now;
          }
          setImmediate(() => this.trimCaches(memMB > 400));
        }
      } catch {}
    }, 15000);
    // Routine trim every 3 minutes regardless of memory level
    this._trimInterval = setInterval(() => {
      try {
        this.trimCaches(false);
      } catch {}
    }, 90000);
    // Emergency GC every 10 seconds when memory is high
    this._lastEmergencyGCLog = 0;
    this._emergencyInterval = setInterval(() => {
      try {
        const memMB = Math.round(process.memoryUsage().rss / 1024 / 1024);
        if (memMB > 450) {
          if (global.gc) {
            global.gc();
            global.gc();
          }
          setImmediate(() => this.trimCaches(true));
          if (memMB > 700) {
            const now = Date.now();
            if (now - this._lastEmergencyGCLog > 60000) {
              UltraCleanLogger.warning(`Emergency GC: ${memMB}MB - forcing collection`);
              this._lastEmergencyGCLog = now;
            }
          }
        }
      } catch {}
    }, 10000);
  },
  stop() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
    if (this._trimInterval) {
      clearInterval(this._trimInterval);
      this._trimInterval = null;
    }
    if (this._emergencyInterval) {
      clearInterval(this._emergencyInterval);
      this._emergencyInterval = null;
    }
  },
  trimCaches(aggressive = false) {
    try {
      const trimMap = (map, maxSize, keepCount, label) => {
        if (!map || map.size <= maxSize) {
          return;
        }
        const excess = map.size - keepCount;
        let removed = 0;
        for (const key of map.keys()) {
          if (removed >= excess) {
            break;
          }
          map.delete(key);
          removed++;
        }
        if (label) {
          UltraCleanLogger.info(`${label} trimmed to ${map.size} entries`);
        }
      };
      const now = Date.now();
      for (const [k, v] of groupMetadataCache) {
        if (now - v.ts > GROUP_CACHE_TTL) {
          groupMetadataCache.delete(k);
        }
      }
      _capSet(groupDiagDone, MAX_GROUP_DIAG);
      const factor = aggressive ? 0.4 : 1;
      trimMap(lidPhoneCache, Math.floor(factor * 300), Math.floor(factor * 150), "LID cache");
      trimMap(phoneLidCache, Math.floor(factor * 300), Math.floor(factor * 150), null);
      trimMap(groupMetadataCache, Math.floor(factor * 20), Math.floor(factor * 10), "Group metadata cache");
      // contactNames stores up to 5 keys per contact — keep cap low
      trimMap(global.contactNames, Math.floor(factor * 500), Math.floor(factor * 200), null);
      if (store && store.messages) {
        trimMap(store.messages, Math.floor(factor * 100), Math.floor(factor * 50), "Message store");
      }
      if (store && store.sentMessages) {
        trimMap(store.sentMessages, Math.floor(factor * 80), Math.floor(factor * 40), null);
      }
      trimMap(viewOnceCache, Math.floor(factor * 50), Math.floor(factor * 20), null);
      trimMap(_lidResolveAttempts, 80, 40, null);
      trimMap(_pendingGroupFetches, 20, 10, null);
      // Clean stale antispam tracker entries (older than 5 minutes)
      if (globalThis._antispamTracker instanceof Map && globalThis._antispamTracker.size > 0) {
        const _antispamNow = Date.now();
        for (const [key, val] of globalThis._antispamTracker.entries()) {
          const ts = val?.lastTime || 0;
          if (_antispamNow - ts > 300000) {
            globalThis._antispamTracker.delete(key);
          }
        }
        trimMap(globalThis._antispamTracker, 1500, 750, null);
      }
      if (global.gc) {
        global.gc();
      }
      // Aggressive trim runs silently — no console spam
    } catch {}
  }
};

// ====== ANTI-VIEWONCE SYSTEM ======
class AntiViewOnceSystem {
  constructor(sock) {
    this.sock = sock;
    this.config = this.loadConfig();
    this.detectedMessages = [];
    this.setupDirectories();
    this.loadHistory();
    let downloadFunc;
    try {
      import("@whiskeysockets/baileys").then(baileys => {
        downloadFunc = baileys.downloadContentFromMessage;
      }).catch(() => {
        downloadFunc = null;
      });
    } catch {
      downloadFunc = null;
    }
    this.downloadContentFromMessage = downloadFunc;
    UltraCleanLogger.success("🔐 Anti-ViewOnce System initialized");
  }
  setupDirectories() {}
  loadConfig() {
    try {
      if (_cache_antiviewonce_config) {
        UltraCleanLogger.info("🔧 Loaded anti-viewonce config from cache");
        return _cache_antiviewonce_config;
      }
      db.getConfig("antiviewonce_config", DEFAULT_ANTIVIEWONCE_CONFIG).then(config => {
        try {
          _cache_antiviewonce_config = config;
          this.config = config;
          UltraCleanLogger.info("🔧 Loaded anti-viewonce config from DB");
        } catch {}
      }).catch(() => {});
    } catch (error) {
      UltraCleanLogger.warning(`Config load warning: ${error.message}`);
    }
    return DEFAULT_ANTIVIEWONCE_CONFIG;
  }
  saveConfig(config) {
    try {
      _cache_antiviewonce_config = config;
      db.setConfig("antiviewonce_config", config).then(() => {
        UltraCleanLogger.info("💾 Anti-viewonce config saved");
      }).catch(err => {
        UltraCleanLogger.error(`Config save error: ${err.message}`);
      });
    } catch (error) {
      UltraCleanLogger.error(`Config save error: ${error.message}`);
    }
  }
  loadHistory() {
    try {
      if (_cache_antiviewonce_history) {
        this.detectedMessages = _cache_antiviewonce_history.messages || [];
        UltraCleanLogger.info(`📊 Loaded ${this.detectedMessages.length} viewonce records from cache`);
        return;
      }
      db.getConfig("antiviewonce_history", {}).then(data => {
        try {
          _cache_antiviewonce_history = data;
          if (data && data.messages) {
            this.detectedMessages = data.messages;
            UltraCleanLogger.info(`📊 Loaded ${this.detectedMessages.length} viewonce records from DB`);
          }
        } catch {}
      }).catch(err => {
        UltraCleanLogger.warning(`History load warning: ${err.message}`);
      });
    } catch (error) {
      UltraCleanLogger.warning(`History load warning: ${error.message}`);
    }
  }
  saveHistory() {
    try {
      const data = {
        messages: this.detectedMessages.slice(-this.config.maxHistory),
        updatedAt: new Date().toISOString(),
        total: this.detectedMessages.length,
        mode: this.config.mode
      };
      _cache_antiviewonce_history = data;
      db.setConfig("antiviewonce_history", data).catch(err => {
        UltraCleanLogger.warning(`History save warning: ${err.message}`);
      });
    } catch (error) {
      UltraCleanLogger.warning(`History save warning: ${error.message}`);
    }
  }
  getFileExtension(mimetype) {
    const extensions = {
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/webp": "webp",
      "video/mp4": "mp4",
      "video/3gp": "3gp",
      "video/quicktime": "mov",
      "video/webm": "webm",
      "audio/mpeg": "mp3",
      "audio/mp4": "m4a",
      "audio/ogg": "ogg",
      "audio/webm": "webm",
      "audio/aac": "aac",
      "audio/opus": "opus"
    };
    return extensions[mimetype] || "bin";
  }
  generateFilename(sender, type, timestamp, mimetype) {
    const date = new Date(timestamp * 1000);
    const dateStr = date.toISOString().split("T")[0];
    const timeStr = date.toTimeString().split(" ")[0].replace(/:/g, "-");
    const senderShort = sender.split("@")[0].replace(/[^0-9]/g, "").slice(-8);
    const ext = this.getFileExtension(mimetype);
    return `${dateStr}_${timeStr}_${senderShort}_${type}.${ext}`;
  }
  async downloadBuffer(msg, type) {
    try {
      if (!this.downloadContentFromMessage) {
        const baileys = await import("@whiskeysockets/baileys");
        this.downloadContentFromMessage = baileys.downloadContentFromMessage;
      }
      const stream = await this.downloadContentFromMessage(msg, type);
      let buffer = Buffer.from([]);
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }
      return buffer;
    } catch (error) {
      UltraCleanLogger.error(`Download error: ${error.message}`);
      return null;
    }
  }
  async saveMediaToFile(buffer, filename, isPrivate = false) {
    try {
      const mimetype = filename.endsWith(".jpg") ? "image/jpeg" : filename.endsWith(".mp4") ? "video/mp4" : filename.endsWith(".mp3") ? "audio/mpeg" : filename.endsWith(".webp") ? "image/webp" : filename.endsWith(".ogg") ? "audio/ogg" : "application/octet-stream";
      const folder = isPrivate ? "viewonce_private" : "viewonce";
      const storagePath = await db.uploadMedia(filename, buffer, mimetype, folder);
      if (!storagePath) {
        UltraCleanLogger.error(`💾 Cannot save media to DB`);
        return null;
      }
      _cache_antiviewonce_captured_count++;
      const sizeKB = Math.round(buffer.length / 1024);
      UltraCleanLogger.success(`💾 Saved: ${filename} (${sizeKB}KB) to DB ${isPrivate ? "private" : "public"}`);
      return storagePath;
    } catch (error) {
      UltraCleanLogger.error(`Save error: ${error.message}`);
      return null;
    }
  }
  detectViewOnceType(message) {
    if (message.imageMessage?.viewOnce) {
      return {
        type: "image",
        media: message.imageMessage,
        caption: message.imageMessage.caption || ""
      };
    } else if (message.videoMessage?.viewOnce) {
      return {
        type: "video",
        media: message.videoMessage,
        caption: message.videoMessage.caption || ""
      };
    } else if (message.audioMessage?.viewOnce) {
      return {
        type: "audio",
        media: message.audioMessage,
        caption: ""
      };
    }
    return null;
  }
  showTerminalNotification(sender, type, size, caption, isPrivate = false) {
    const senderShort = sender.split("@")[0];
    const sizeKB = Math.round(size / 1024);
    const time = new Date().toLocaleTimeString("en-US", { timeZone: process.env.TIME_ZONE || "Africa/Nairobi" });
    const typeEmoji = {
      image: "🖼️",
      video: "🎬",
      audio: "🎵"
    }[type] || "📁";
    const modeTag = isPrivate ? "[PRIVATE]" : "[AUTO]";
    const captionText = caption ? ` - "${caption.substring(0, 30)}${caption.length > 30 ? "..." : ""}"` : "";
    logAntiViewOnce(`${modeTag} ${typeEmoji} VIEW-ONCE DETECTED`);
    logAntiViewOnce(`   👤 From: ${senderShort}`);
    logAntiViewOnce(`   📦 Type: ${type} (${sizeKB}KB)`);
    logAntiViewOnce(`   📝 Caption: ${captionText || "None"}`);
    logAntiViewOnce(`   🕒 Time: ${time}`);
  }
  async handleViewOnceDetection(msg) {
    try {
      if (!this.config.enabled || this.config.mode === "off") {
        return null;
      }
      const message = msg.message;
      if (!message) {
        return null;
      }
      const viewOnceData = this.detectViewOnceType(message);
      if (!viewOnceData) {
        return null;
      }
      const {
        type,
        media,
        caption
      } = viewOnceData;
      const chatId = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;
      const messageId = msg.key.id;
      const timestamp = msg.messageTimestamp || Math.floor(Date.now() / 1000);
      UltraCleanLogger.info(`🔍 Detected view-once ${type} from ${sender.split("@")[0]}`);
      const buffer = await this.downloadBuffer(media, type);
      if (!buffer) {
        UltraCleanLogger.error("❌ Download failed");
        return null;
      }
      const mimetype = media.mimetype || this.getDefaultMimeType(type);
      const filename = this.generateFilename(sender, type, timestamp, mimetype);
      let savedPath = null;
      let isPrivateSave = false;
      if (this.config.mode === "private" && this.config.ownerJid) {
        savedPath = await this.saveMediaToFile(buffer, filename, true);
        isPrivateSave = true;
        await this.sendToOwner(sender, type, buffer, caption, filename, chatId);
      } else if (this.config.mode === "auto") {
        savedPath = await this.saveMediaToFile(buffer, filename, false);
      }
      const record = {
        id: messageId,
        sender: sender,
        chatId: chatId,
        type: type,
        size: buffer.length,
        caption: caption,
        timestamp: timestamp,
        detectedAt: new Date().toISOString(),
        saved: !!savedPath,
        mode: this.config.mode,
        filename: savedPath ? filename : null,
        isPrivate: isPrivateSave
      };
      this.detectedMessages.push(record);
      if (this.detectedMessages.length > this.config.maxHistory * 2) {
        this.detectedMessages = this.detectedMessages.slice(-this.config.maxHistory);
      }
      this.showTerminalNotification(sender, type, buffer.length, caption, isPrivateSave);
      if (Math.random() < 0.1) {
        this.saveHistory();
      }
      return record;
    } catch (error) {
      UltraCleanLogger.error(`View-once handling error: ${error.message}`);
      return null;
    }
  }
  getDefaultMimeType(type) {
    const defaults = {
      image: "image/jpeg",
      video: "video/mp4",
      audio: "audio/mpeg"
    };
    return defaults[type] || "application/octet-stream";
  }
  async sendToOwner(sender, type, buffer, caption, filename, chatId) {
    try {
      if (!this.config.ownerJid) {
        UltraCleanLogger.warning("⚠️ Owner JID not set, skipping owner notification");
        return;
      }
      const retrievalCaption = await generateRetrievalCaption(sender, "auto-detect", chatId, null, this.sock);
      const mediaOptions = {
        caption: retrievalCaption,
        fileName: filename
      };
      switch (type) {
        case "image":
          await this.sock.sendMessage(this.config.ownerJid, {
            image: buffer,
            ...mediaOptions
          });
          break;
        case "video":
          await this.sock.sendMessage(this.config.ownerJid, {
            video: buffer,
            ...mediaOptions
          });
          break;
        case "audio":
          await this.sock.sendMessage(this.config.ownerJid, {
            audio: buffer,
            ...mediaOptions
          });
          break;
      }
      UltraCleanLogger.info(`📤 Sent ${type} to owner`);
    } catch (error) {
      UltraCleanLogger.error(`Owner send error: ${error.message}`);
    }
  }
  async handleManualRecovery(msg) {
    try {
      const chatId = msg.key.remoteJid;
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      if (!quoted) {
        await this.sock.sendMessage(chatId, {
          text: "❌ Reply to a view-once message"
        }, {
          quoted: msg
        });
        return;
      }
      const viewOnceData = this.detectViewOnceType(quoted);
      if (!viewOnceData) {
        await this.sock.sendMessage(chatId, {
          text: "❌ Not a view-once message"
        }, {
          quoted: msg
        });
        return;
      }
      const {
        type,
        media,
        caption
      } = viewOnceData;
      await this.sock.sendMessage(chatId, {
        text: `🔍 Downloading ${type}...`
      }, {
        quoted: msg
      });
      const buffer = await this.downloadBuffer(media, type);
      if (!buffer) {
        await this.sock.sendMessage(chatId, {
          text: "❌ Download failed"
        }, {
          quoted: msg
        });
        return;
      }
      const contextInfo = msg.message?.extendedTextMessage?.contextInfo;
      const originalSender = contextInfo?.participant || chatId;
      const retrieverJid = msg.key.participant || msg.key.remoteJid;
      const mediaOptions = {
        caption: await generateRetrievalCaption(originalSender, retrieverJid, chatId, null, this.sock),
        quoted: msg
      };
      switch (type) {
        case "image":
          await this.sock.sendMessage(chatId, {
            image: buffer,
            ...mediaOptions
          });
          break;
        case "video":
          await this.sock.sendMessage(chatId, {
            video: buffer,
            ...mediaOptions
          });
          break;
        case "audio":
          await this.sock.sendMessage(chatId, {
            audio: buffer,
            ...mediaOptions
          });
          break;
      }
      UltraCleanLogger.success(`🔄 Manual recovery of ${type} completed`);
    } catch (error) {
      UltraCleanLogger.error(`Recovery error: ${error.message}`);
    }
  }
  getStats() {
    const stats = {
      total: this.detectedMessages.length,
      byType: {
        image: 0,
        video: 0,
        audio: 0
      },
      totalSize: 0
    };
    for (const msg of this.detectedMessages) {
      if (stats.byType[msg.type] !== undefined) {
        stats.byType[msg.type]++;
      }
      stats.totalSize += msg.size || 0;
    }
    return {
      ...stats,
      totalSizeKB: Math.round(stats.totalSize / 1024),
      mode: this.config.mode,
      enabled: this.config.enabled,
      autoSave: this.config.autoSave
    };
  }
  updateConfig(newConfig) {
    this.config = {
      ...this.config,
      ...newConfig
    };
    this.saveConfig(this.config);
    return this.config;
  }
}
let antiViewOnceSystem = null;
let antideleteInitDone = false;
let statusAntideleteInitDone = false;

// ====== RATE LIMIT PROTECTION ======
class RateLimitProtection {
  constructor() {
    this.commandTimestamps = new Map();
    this.userCooldowns = new Map();
    this.globalCooldown = Date.now();
    this.stickerSendTimes = new Map();
    this._cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }
  canSendCommand(chatId, userId, command) {
    if (!RATE_LIMIT_ENABLED) {
      return {
        allowed: true
      };
    }
    const now = Date.now();
    const userKey = `${userId}_${command}`;
    const chatKey = `${chatId}_${command}`;
    if (this.userCooldowns.has(userKey)) {
      const lastTime = this.userCooldowns.get(userKey);
      const timeDiff = now - lastTime;
      if (timeDiff < MIN_COMMAND_DELAY) {
        const remaining = Math.ceil((MIN_COMMAND_DELAY - timeDiff) / 1000);
        return {
          allowed: false,
          reason: `Please wait ${remaining}s before using ${command} again.`
        };
      }
    }
    if (this.commandTimestamps.has(chatKey)) {
      const lastTime = this.commandTimestamps.get(chatKey);
      const timeDiff = now - lastTime;
      if (timeDiff < MIN_COMMAND_DELAY) {
        const remaining = Math.ceil((MIN_COMMAND_DELAY - timeDiff) / 1000);
        return {
          allowed: false,
          reason: `Command cooldown: ${remaining}s remaining.`
        };
      }
    }
    if (now - this.globalCooldown < 10) {
      return {
        allowed: false,
        reason: "System is busy. Please try again in a moment."
      };
    }
    this.userCooldowns.set(userKey, now);
    this.commandTimestamps.set(chatKey, now);
    this.globalCooldown = now;
    return {
      allowed: true
    };
  }
  async waitForSticker(chatId) {
    if (!RATE_LIMIT_ENABLED) {
      await this.delay(STICKER_DELAY);
      return;
    }
    const now = Date.now();
    const lastSticker = this.stickerSendTimes.get(chatId) || 0;
    const timeDiff = now - lastSticker;
    if (timeDiff < STICKER_DELAY) {
      const waitTime = STICKER_DELAY - timeDiff;
      await this.delay(waitTime);
    }
    this.stickerSendTimes.set(chatId, Date.now());
  }
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  cleanup() {
    const now = Date.now();
    const fiveMinutes = 300000;
    for (const [key, timestamp] of this.userCooldowns.entries()) {
      if (now - timestamp > fiveMinutes) {
        this.userCooldowns.delete(key);
      }
    }
    for (const [key, timestamp] of this.commandTimestamps.entries()) {
      if (now - timestamp > fiveMinutes) {
        this.commandTimestamps.delete(key);
      }
    }
  }
}
const rateLimiter = new RateLimitProtection();

// ====== STATUS DETECTOR ======
class StatusDetector {
  constructor() {
    this.detectionEnabled = true;
    this.statusLogs = [];
    this.lastDetection = null;
    this.setupDataDir();
    this.loadStatusLogs();
    UltraCleanLogger.success("Status Detector initialized");
  }
  setupDataDir() {
    try {
      if (!fs.existsSync("./data")) {
        fs.mkdirSync("./data", {
          recursive: true
        });
      }
    } catch (error) {
      UltraCleanLogger.error(`Error setting up data directory: ${error.message}`);
    }
  }
  loadStatusLogs() {
    try {
      if (_cache_status_logs) {
        const data = _cache_status_logs;
        if (Array.isArray(data.logs)) {
          this.statusLogs = data.logs.slice(-100);
        }
        return;
      }
      db.getConfig("status_detection_logs", {}).then(data => {
        try {
          _cache_status_logs = data;
          if (data && Array.isArray(data.logs)) {
            this.statusLogs = data.logs.slice(-100);
          }
        } catch {}
      }).catch(() => {});
    } catch (error) {
      // Silent fail
    }
  }
  saveStatusLogs() {
    try {
      const data = {
        logs: this.statusLogs.slice(-1000),
        updatedAt: new Date().toISOString(),
        count: this.statusLogs.length
      };
      _cache_status_logs = data;
      db.setConfig("status_detection_logs", data).catch(() => {});
    } catch (error) {
      // Silent fail
    }
  }
  async detectStatusUpdate(msg) {
    try {
      if (!this.detectionEnabled) {
        return null;
      }
      const sender = msg.key.participant || "unknown";
      const shortSender = sender.split("@")[0];
      const timestamp = msg.messageTimestamp || Date.now();
      const statusTime = new Date(timestamp * 1000).toLocaleTimeString();
      const statusInfo = this.extractStatusInfo(msg);
      this.showDetectionMessage(shortSender, statusTime, statusInfo);
      const logEntry = {
        sender: shortSender,
        fullSender: sender,
        type: statusInfo.type,
        caption: statusInfo.caption,
        fileInfo: statusInfo.fileInfo,
        postedAt: statusTime,
        detectedAt: new Date().toLocaleTimeString("en-US", { timeZone: process.env.TIME_ZONE || "Africa/Lagos" }),
        timestamp: Date.now()
      };
      this.statusLogs.push(logEntry);
      this.lastDetection = logEntry;
      if (this.statusLogs.length % 5 === 0) {
        this.saveStatusLogs();
      }
      return logEntry;
    } catch (error) {
      return null;
    }
  }
  extractStatusInfo(msg) {
    try {
      const message = msg.message;
      let type = "unknown";
      let caption = "";
      let fileInfo = "";
      if (message.imageMessage) {
        type = "image";
        caption = message.imageMessage.caption || "";
        const size = Math.round((message.imageMessage.fileLength || 0) / 1024);
        fileInfo = `🖼️ ${message.imageMessage.width}x${message.imageMessage.height} | ${size}KB`;
      } else if (message.videoMessage) {
        type = "video";
        caption = message.videoMessage.caption || "";
        const size = Math.round((message.videoMessage.fileLength || 0) / 1024);
        const duration = message.videoMessage.seconds || 0;
        fileInfo = `🎬 ${duration}s | ${size}KB`;
      } else if (message.audioMessage) {
        type = "audio";
        const size = Math.round((message.audioMessage.fileLength || 0) / 1024);
        const duration = message.audioMessage.seconds || 0;
        fileInfo = `🎵 ${duration}s | ${size}KB`;
      } else if (message.extendedTextMessage) {
        type = "text";
        caption = message.extendedTextMessage.text || "";
      } else if (message.conversation) {
        type = "text";
        caption = message.conversation;
      } else if (message.stickerMessage) {
        type = "sticker";
        fileInfo = "🩹 Sticker";
      }
      return {
        type,
        caption: caption.substring(0, 100),
        fileInfo
      };
    } catch (error) {
      return {
        type: "unknown",
        caption: "",
        fileInfo: ""
      };
    }
  }
  getStats() {
    return {
      totalDetected: this.statusLogs.length,
      lastDetection: this.lastDetection ? `${this.lastDetection.sender} - ${this.getTimeAgo(this.lastDetection.timestamp)}` : "None",
      detectionEnabled: this.detectionEnabled
    };
  }
  getTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) {
      return "Just now";
    }
    if (minutes < 60) {
      return `${minutes}m ago`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours}h ago`;
    }
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }
}
let statusDetector = null;

// ====== HELPER FUNCTIONS ======
function isUserBlocked(jid) {
  try {
    const data = _cache_blocked_users;
    if (data) {
      return data.users && data.users.includes(jid);
    }
  } catch {
    return false;
  }
  return false;
}
function checkBotMode(msg, commandName, isSudoOverride = false) {
  try {
    if (jidManager.isOwner(msg)) {
      return true;
    }
    if (isSudoOverride || jidManager.isSudo(msg)) {
      return true;
    }
    if (_cache_bot_mode) {
      BOT_MODE = _cache_bot_mode.mode || "public";
    } else {
      BOT_MODE = "public";
    }
    const chatJid = msg.key.remoteJid;
    const isGroup = chatJid.includes("@g.us");
    switch (BOT_MODE) {
      case "public":
      case "buttons":
      case "channel":
      case "default":
        return true;
      case "groups":
        return isGroup;
      case "dms":
        return !isGroup;
      case "silent":
        return false;
      default:
        return true;
    }
  } catch {
    return true;
  }
}
function isPresenceEnabled() {
  try {
    const cfg = JSON.parse(fs.readFileSync("./data/presence/config.json", "utf8"));
    return cfg?.enabled === true;
  } catch {
    return false;
  }
}
function startHeartbeat(sock) {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
  }
  heartbeatInterval = setInterval(() => {
    if (isConnected && sock && isPresenceEnabled()) {
      const presenceTimeout = new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 5000));
      Promise.race([sock.sendPresenceUpdate("available"), presenceTimeout]).then(() => {
        lastActivityTime = Date.now();
      }).catch(() => {});
    }
  }, 60000);
}
function stopHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}
function ensureSessionDir() {
  if (!fs.existsSync(SESSION_DIR)) {
    fs.mkdirSync(SESSION_DIR, {
      recursive: true
    });
  }
}

// Replace the cleanSession function with this:
function cleanSession(preserveExisting = false) {
  try {
    if (preserveExisting && fs.existsSync(SESSION_DIR)) {
      // Backup existing session if it exists
      const backupDir = "./session_backup";
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, {
          recursive: true
        });
      }

      // Copy session files to backup
      const files = fs.readdirSync(SESSION_DIR);
      for (const file of files) {
        const source = path.join(SESSION_DIR, file);
        const dest = path.join(backupDir, file);
        fs.copyFileSync(source, dest);
      }
      UltraCleanLogger.info("📁 Existing session backed up");
    }
    if (fs.existsSync(SESSION_DIR)) {
      fs.rmSync(SESSION_DIR, {
        recursive: true,
        force: true
      });
    }

    // Restore backup if needed
    if (preserveExisting) {
      const backupDir = "./session_backup";
      if (fs.existsSync(backupDir)) {
        if (!fs.existsSync(SESSION_DIR)) {
          fs.mkdirSync(SESSION_DIR, {
            recursive: true
          });
        }
        const files = fs.readdirSync(backupDir);
        for (const file of files) {
          const source = path.join(backupDir, file);
          const dest = path.join(SESSION_DIR, file);
          fs.copyFileSync(source, dest);
        }

        // Clean up backup
        fs.rmSync(backupDir, {
          recursive: true,
          force: true
        });
        UltraCleanLogger.info("📁 Session restored from backup");
      }
    }
    return true;
  } catch (error) {
    UltraCleanLogger.error(`Session cleanup error: ${error.message}`);
    return false;
  }
}
const viewOnceCache = new Map();
globalThis.viewOnceCache_ref = viewOnceCache;
const VIEW_ONCE_CACHE_MAX = 50;
function cacheViewOnceMessage(chatId, messageId, msg) {
  try {
    const key = `${chatId}|${messageId}`;
    let deepCopy;
    if (typeof structuredClone === "function") {
      try {
        deepCopy = structuredClone(msg);
      } catch {
        deepCopy = JSON.parse(JSON.stringify(msg));
      }
    } else {
      deepCopy = JSON.parse(JSON.stringify(msg));
    }
    viewOnceCache.set(key, deepCopy);
    if (viewOnceCache.size > VIEW_ONCE_CACHE_MAX) {
      const oldest = viewOnceCache.keys().next().value;
      viewOnceCache.delete(oldest);
    }
    // [SILENT] originalConsoleMethods.log(`🔐 [VO-CACHE] Stored view-once msg ${messageId.substring(0, 8)}... in dedicated cache (total: ${viewOnceCache.size})`);
  } catch {}
}
function getViewOnceFromCache(chatId, messageId) {
  const key = `${chatId}|${messageId}`;
  return viewOnceCache.get(key) || null;
}
class MessageStore {
  constructor() {
    this.messages = new Map();
    this.maxMessages = 150;
    this.sentMessages = new Map();
    this.maxSentMessages = 100;
  }
  addMessage(jid, messageId, message) {
    try {
      const key = `${jid}|${messageId}`;
      this.messages.set(key, message);
      if (this.messages.size > this.maxMessages) {
        const oldestKey = this.messages.keys().next().value;
        this.messages.delete(oldestKey);
      }
    } catch {}
  }
  addSentMessage(jid, messageId, messageContent) {
    try {
      const key = `${jid}|${messageId}`;
      this.sentMessages.set(key, messageContent);
      if (this.sentMessages.size > this.maxSentMessages) {
        const oldestKey = this.sentMessages.keys().next().value;
        this.sentMessages.delete(oldestKey);
      }
    } catch {}
  }
  getMessage(jid, messageId) {
    try {
      const key = `${jid}|${messageId}`;
      const msg = this.messages.get(key);
      if (msg) {
        return msg;
      }
      const sent = this.sentMessages.get(key);
      if (sent) {
        return {
          message: sent
        };
      }
      return null;
    } catch {
      return null;
    }
  }
}
const commands = new Map();
const commandCategories = new Map();
// Expose globally so menu.js can use the authoritative loaded registry
globalThis._botCommandCategories = commandCategories;
globalThis._botCommandsMap = commands;
async function loadCommandsFromFolder(folderPath, category = "general") {
  const absolutePath = path.resolve(folderPath);
  if (!fs.existsSync(absolutePath)) {
    return;
  }
  try {
    const items = fs.readdirSync(absolutePath);
    let categoryCount = 0;
    for (const item of items) {
      const fullPath = path.join(absolutePath, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        await loadCommandsFromFolder(fullPath, item);
      } else if (item.endsWith(".js")) {
        try {
          if (item.includes(".test.") || item.includes(".disabled.")) {
            continue;
          }
          const commandModule = await import(`file://${fullPath}`);
          const raw = commandModule.default || commandModule;
          const cmdsToLoad = Array.isArray(raw) ? raw : raw && raw.name ? [raw] : [];
          for (const command of cmdsToLoad) {
            if (!command || !command.name) {
              continue;
            }
            command.category = category;
            commands.set(command.name.toLowerCase(), command);
            if (!commandCategories.has(category)) {
              commandCategories.set(category, []);
            }
            commandCategories.get(category).push(command.name);
            categoryCount++;
            const aliasList = Array.isArray(command.alias) ? command.alias : Array.isArray(command.aliases) ? command.aliases : [];
            aliasList.forEach(alias => {
              commands.set(alias.toLowerCase(), command);
            });
          }
        } catch {
          // Silent fail
        }
      }
    }
    if (categoryCount > 0) {
      // silent — total reported after full load
    }
  } catch {
    // Silent fail
  }
}
// Add this function near the other helper functions
function checkSessionValidity() {
  try {
    const sessionPath = path.join(SESSION_DIR, "creds.json");
    if (!fs.existsSync(sessionPath)) {
      return {
        valid: false,
        reason: "No session file"
      };
    }
    const sessionData = JSON.parse(fs.readFileSync(sessionPath, "utf8"));

    // Check for required Baileys session fields
    const requiredFields = ["noiseKey", "signedIdentityKey", "pairingEphemeralKeyPair"];
    for (const field of requiredFields) {
      if (!sessionData[field]) {
        return {
          valid: false,
          reason: `Missing field: ${field}`
        };
      }
    }

    // Check if session is expired (older than 90 days)
    const sessionAge = Date.now() - (sessionData.registrationId || 0);
    const maxAge = 7776000000; // 90 days in milliseconds

    if (sessionAge > maxAge) {
      return {
        valid: false,
        reason: "Session expired"
      };
    }
    return {
      valid: true,
      data: sessionData
    };
  } catch (error) {
    return {
      valid: false,
      reason: `Error: ${error.message}`
    };
  }
}

// ====== SESSION ID PARSER ======
function parseBotSession(sessionString) {
  try {
    let cleanedSession = sessionString.trim();
    cleanedSession = cleanedSession.replace(/^["']|["']$/g, "");
    if (cleanedSession.startsWith("GAAJU-MD:")) {
      UltraCleanLogger.info("🔍 Detected GAAJU-MD: prefix");
      let base64Part = cleanedSession.substring(9).trim();
      base64Part = base64Part.replace(/^~+/, "");
      if (!base64Part) {
        throw new Error("No data found after GAAJU-MD:");
      }
      try {
        const decodedString = Buffer.from(base64Part, "base64").toString("utf8");
        return JSON.parse(decodedString);
      } catch (base64Error) {
        return JSON.parse(base64Part);
      }
    }
    try {
      const decodedString = Buffer.from(cleanedSession, "base64").toString("utf8");
      return JSON.parse(decodedString);
    } catch (base64Error) {
      return JSON.parse(cleanedSession);
    }
  } catch (error) {
    UltraCleanLogger.error("❌ Failed to parse session:", error.message);
    return null;
  }
}

// ====== HEROKU SESSION HANDLING ======
function setupHerokuSession() {
  try {
    // Check if running on Heroku with SESSION_ID env var
    const herokuSessionId = process.env.SESSION_ID;
    if (herokuSessionId && herokuSessionId.trim() !== "") {
      UltraCleanLogger.success("🚀 Detected Heroku deployment with SESSION_ID");

      // Parse GAAJU-MD session format
      if (herokuSessionId.startsWith("GAAJU-MD:")) {
        UltraCleanLogger.info("🔐 Processing GAAJU-MD session format...");
        try {
          // Remove GAAJU-MD: prefix and decode
          const base64Part = herokuSessionId.substring(9).trim().replace(/^~+/, "");
          const decodedSession = Buffer.from(base64Part, "base64").toString("utf8");
          const sessionData = JSON.parse(decodedSession);

          // Save to session directory
          ensureSessionDir();
          const sessionPath = path.join(SESSION_DIR, "creds.json");
          fs.writeFileSync(sessionPath, JSON.stringify(sessionData, null, 2));
          UltraCleanLogger.success(`💾 Heroku session saved to: ${sessionPath}`);

          // Set flag to skip login prompts
          process.env.HEROKU_DEPLOYMENT = "true";
          process.env.AUTO_START = "true";
          return true;
        } catch (error) {
          UltraCleanLogger.error(`❌ Failed to parse Heroku session: ${error.message}`);
          return false;
        }
      } else {
        UltraCleanLogger.info("🔐 Processing raw session string...");
        try {
          // Try direct JSON parsing
          const sessionData = JSON.parse(herokuSessionId);

          // Save to session directory
          ensureSessionDir();
          const sessionPath = path.join(SESSION_DIR, "creds.json");
          fs.writeFileSync(sessionPath, JSON.stringify(sessionData, null, 2));
          UltraCleanLogger.success(`💾 Heroku session saved to: ${sessionPath}`);
          process.env.HEROKU_DEPLOYMENT = "true";
          process.env.AUTO_START = "true";
          return true;
        } catch (jsonError) {
          UltraCleanLogger.warning(`JSON parse failed, trying base64: ${jsonError.message}`);
          try {
            // Try base64 decoding
            const decodedSession = Buffer.from(herokuSessionId, "base64").toString("utf8");
            const sessionData = JSON.parse(decodedSession);
            ensureSessionDir();
            const sessionPath = path.join(SESSION_DIR, "creds.json");
            fs.writeFileSync(sessionPath, JSON.stringify(sessionData, null, 2));
            UltraCleanLogger.success(`💾 Heroku session saved (base64): ${sessionPath}`);
            process.env.HEROKU_DEPLOYMENT = "true";
            process.env.AUTO_START = "true";
            return true;
          } catch (base64Error) {
            UltraCleanLogger.error(`❌ All Heroku session parsing attempts failed`);
            return false;
          }
        }
      }
    }
    return false;
  } catch (error) {
    UltraCleanLogger.error(`Heroku setup error: ${error.message}`);
    return false;
  }
}

// ====== HEROKU HEALTH CHECK ======
function setupHerokuHealthCheck() {
  // Health check is fully handled by lib/webServer.js (PORT-aware, ESM-safe).
  // No duplicate server needed here.
  UltraCleanLogger.info("🌐 Health check endpoint served by webServer.js — no duplicate server needed");
}

// ====== HEROKU KEEP-ALIVE ======
function setupHerokuKeepAlive() {
  // process.env.DYNO is set automatically by Heroku; HEROKU must be added manually
  const onHeroku = !!process.env.HEROKU || !!process.env.DYNO;
  if (onHeroku) {
    UltraCleanLogger.info("🔧 Setting up Heroku keep-alive system...");

    // Auto-restart prevention
    let restartCount = 0;
    const maxDailyRestarts = 5;

    // Periodic activity to prevent sleeping
    setInterval(() => {
      UltraCleanLogger.info("💓 Heroku keep-alive pulse");
      lastActivityTime = Date.now();
    }, 1200000); // Every 20 minutes

    // Memory monitoring for Heroku
    setInterval(() => {
      const memoryUsage = process.memoryUsage();
      const memoryMB = Math.round(memoryUsage.rss / 1024 / 1024);
      if (memoryMB > 300) {
        UltraCleanLogger.warning(`⚠️ High memory usage: ${memoryMB}MB`);
        memoryMonitor.trimCaches(memoryMB > 400);
        if (global.gc) {
          setImmediate(() => {
            try {
              global.gc({
                type: "minor"
              });
            } catch {
              try {
                global.gc();
              } catch {}
            }
          });
        }
      }
    }, 300000); // Every 5 minutes
  }
}
async function authenticateWithSessionId(sessionId) {
  try {
    UltraCleanLogger.info("🔄 Processing Session ID...");
    const sessionData = parseBotSession(sessionId);
    if (!sessionData) {
      throw new Error("Could not parse session data");
    }
    if (!fs.existsSync(SESSION_DIR)) {
      fs.mkdirSync(SESSION_DIR, {
        recursive: true
      });
      UltraCleanLogger.info("📁 Created session directory");
    }
    const filePath = path.join(SESSION_DIR, "creds.json");
    fs.writeFileSync(filePath, JSON.stringify(sessionData, null, 2));
    UltraCleanLogger.success("💾 Session saved to session/creds.json");
    try {
      const envPath = path.join(process.cwd(), ".env");
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, "utf8");
        if (!envContent.includes("SESSION_ID=")) {
          fs.appendFileSync(envPath, `\nSESSION_ID=${sessionId}\n`);
          UltraCleanLogger.info("📝 Added SESSION_ID to .env file");
        }
      }
    } catch (envError) {
      // Ignore .env errors
    }
    return true;
  } catch (error) {
    UltraCleanLogger.error("❌ Session authentication failed:", error.message);
    throw error;
  }
}

// ====== LOGIN MANAGER ======
class LoginManager {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }
  async selectMode() {
    console.log(chalk.yellow("\n🤖 GAAJU-MD ULTRA v" + VERSION + " - LOGIN SYSTEM"));
    console.log(chalk.blue("1) Pairing Code Login (Recommended)"));
    console.log(chalk.blue("2) Clean Session & Start Fresh"));
    console.log(chalk.magenta("3) Use Session ID from Environment"));
    const choice = await this.ask("Choose option (1-3, default 1): ");
    switch (choice.trim()) {
      case "1":
        return await this.pairingCodeMode();
      case "2":
        return await this.cleanStartMode();
      case "3":
        return await this.sessionIdMode();
      default:
        return await this.pairingCodeMode();
    }
  }
  async sessionIdMode() {
    console.log(chalk.magenta("\n🔐 SESSION ID LOGIN"));
    let sessionId = process.env.SESSION_ID;
    if (!sessionId || sessionId.trim() === "") {
      console.log(chalk.yellow("ℹ️ No SESSION_ID found in environment"));
      const input = await this.ask("\nWould you like to:\n1) Paste Session ID now\n2) Go back to main menu\nChoice (1-2): ");
      if (input.trim() === "1") {
        sessionId = await this.ask("Paste your Session ID (GAAJU-MD:... or base64): ");
        if (!sessionId || sessionId.trim() === "") {
          console.log(chalk.red("❌ No Session ID provided"));
          return await this.selectMode();
        }
        console.log(chalk.green("✅ Session ID received"));
      } else {
        return await this.selectMode();
      }
    } else {
      console.log(chalk.green("✅ Found Session ID in environment"));
      const proceed = await this.ask("Use existing Session ID? (y/n, default y): ");
      if (proceed.toLowerCase() === "n") {
        const newSessionId = await this.ask("Enter new Session ID: ");
        if (newSessionId && newSessionId.trim() !== "") {
          sessionId = newSessionId;
          console.log(chalk.green("✅ Session ID updated"));
        }
      }
    }
    console.log(chalk.yellow("🔄 Processing session ID..."));
    try {
      await authenticateWithSessionId(sessionId);
      return {
        mode: "session",
        sessionId: sessionId.trim()
      };
    } catch (error) {
      console.log(chalk.red("❌ Session authentication failed"));
      console.log(chalk.yellow("📝 Falling back to pairing code mode..."));
      return await this.pairingCodeMode();
    }
  }
  async pairingCodeMode() {
    console.log(chalk.cyan("\n📱 PAIRING CODE LOGIN"));
    console.log(chalk.gray("Enter phone number with country code (without +)"));
    console.log(chalk.gray("Example: 2348069675806"));
    const phone = await this.ask("Phone number: ");
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      console.log(chalk.red("❌ Invalid phone number"));
      return await this.selectMode();
    }
    return {
      mode: "pair",
      phone: cleanPhone
    };
  }
  async cleanStartMode() {
    console.log(chalk.yellow("\n⚠️ CLEAN SESSION"));
    console.log(chalk.red("This will delete all session data!"));
    const confirm = await this.ask("Are you sure? (y/n): ");
    if (confirm.toLowerCase() === "y") {
      cleanSession();
      console.log(chalk.green("✅ Session cleaned. Starting fresh..."));
      return await this.pairingCodeMode();
    } else {
      return await this.pairingCodeMode();
    }
  }
  ask(question) {
    return new Promise(resolve => {
      this.rl.question(chalk.yellow(question), answer => {
        resolve(answer);
      });
    });
  }
  close() {
    if (this.rl) {
      this.rl.close();
    }
  }
}

// ====== TERMINAL HEADER UPDATE ======
function updateTerminalHeader() {
  console.clear();
}
let _dbInitReady = false;
function printStartupBox() {
  const prefixDisplay = isPrefixless ? "none" : `"${getCurrentPrefix()}"`;
  const modeDisplay = isPrefixless ? "Prefixless" : "Prefix";
  const dbDisplay = _dbInitReady ? "ready" : "unavailable";
  const inner = 32;
  const row = s => `│ ${s}${" ".repeat(Math.max(0, inner - s.length))} │`;
  const bar = `┌${"─".repeat(inner + 2)}┐`;
  const end = `└${"─".repeat(inner + 2)}┘`;
  const box = [bar, row(`  🤖 ${getCurrentBotName()} v${VERSION}`), row(`  Prefix : ${prefixDisplay}   Mode: ${modeDisplay}`), row(`  SQLite : ${dbDisplay}`), row(`  Status : all systems ready ✓`), end].join("\n");
  process.stdout.write("\n" + chalk.blueBright(box) + "\n\n");
}

// Initialize with loaded prefix
prefixCache = loadPrefixFromFiles();
isPrefixless = prefixCache === "" ? true : false;
updateTerminalHeader();

// ====== DATABASE INIT ======
async function initDatabase() {
  await db.initTables();
  _dbInitReady = true;
  try {
    const {
      loadBotName
    } = await import("./lib/botname.js");
    const name = loadBotName();
    if (name) {
      BOT_NAME = name;
      global.BOT_NAME = name;
    }
  } catch {}
  await runDataMigrations();
  return true;
}
async function runDataMigrations() {
  try {
    await initSudo();
    await migrateSudoToSupabase();
    await migrateWarningsToSupabase();
    const configFiles = [{
      file: "./bot_mode.json",
      key: "bot_mode"
    }, {
      file: "./bot_settings.json",
      key: "bot_settings"
    }, {
      file: "./prefix_config.json",
      key: "prefix_config"
    }, {
      file: "./owner.json",
      key: "owner_data"
    }, {
      file: "./whitelist.json",
      key: "whitelist"
    }, {
      file: "./blocked_users.json",
      key: "blocked_users"
    }, {
      file: "./data/welcome_data.json",
      key: "welcome_data"
    }, {
      file: "./data/autoViewConfig.json",
      key: "autoview_config"
    }, {
      file: "./data/autoReactConfig.json",
      key: "autoreact_config"
    }, {
      file: "./data/member_detection.json",
      key: "member_detection"
    }, {
      file: "./data/antiviewonce/config.json",
      key: "antiviewonce_config"
    }, {
      file: "./data/viewonce_messages/history.json",
      key: "antiviewonce_history"
    }, {
      file: "./data/status_detection_logs.json",
      key: "status_detection_logs"
    }];
    for (const {
      file,
      key
    } of configFiles) {
      await db.migrateJSONToConfig(file, key);
    }
    _cache_owner_data = await _loadConfigCache("owner_data", {});
    _cache_prefix_config = await _loadConfigCache("prefix_config", {
      prefix: DEFAULT_PREFIX
    });
    _cache_bot_settings = await _loadConfigCache("bot_settings", {});
    _cache_bot_mode = await _loadConfigCache("bot_mode", null);
    if (!_cache_bot_mode || !_cache_bot_mode.mode) {
      const _legacyMode = await _loadConfigCache("MODE", null);
      const _validModes = ["public", "groups", "dms", "silent", "buttons", "channel", "default"];
      if (_legacyMode && _validModes.includes(String(_legacyMode).toLowerCase())) {
        _cache_bot_mode = {
          mode: String(_legacyMode).toLowerCase()
        };
      } else {
        _cache_bot_mode = {
          mode: "public"
        };
      }
    }
    _cache_whitelist = await _loadConfigCache("whitelist", {
      whitelist: []
    });
    _cache_blocked_users = await _loadConfigCache("blocked_users", {
      blocked: []
    });
    _cache_welcome_data = await _loadConfigCache("welcome_data", {});
    _cache_status_logs = await _loadConfigCache("status_detection_logs", {});
    _cache_member_detection = await _loadConfigCache("member_detection", {});
    _cache_antiviewonce_config = await _loadConfigCache("antiviewonce_config", DEFAULT_ANTIVIEWONCE_CONFIG);
    _cache_antiviewonce_history = await _loadConfigCache("antiviewonce_history", {});
    if (_cache_owner_data && Object.keys(_cache_owner_data).length === 0) {
      _cache_owner_data = null;
    }
    if (_cache_bot_settings && Object.keys(_cache_bot_settings).length === 0) {
      _cache_bot_settings = null;
    }
    if (_cache_welcome_data && Object.keys(_cache_welcome_data).length === 0) {
      _cache_welcome_data = null;
    }
  } catch (err) {
    UltraCleanLogger.error(`💾 Database: Migration error - ${err.message}`);
  }
}
const _dbInitPromise = initDatabase().catch(err => {
  console.error(`\n❌ FATAL: SQLite failed to initialize — ${err.message}\n`);
  process.exit(1);
});

// ── Module-level message dedup: persists across reconnects so re-delivered
// messages (after 440 or auto-restart) are never double-processed ──────────
const _processedMsgIds = new Set();
const _MSG_DEDUP_MAX = 500;
const _subscribedPresenceJids = new Set(); // dedup: avoid re-subscribing same JID

// ====== MAIN BOT FUNCTION ======
async function startBot(loginMode = "auto", loginData = null) {
  try {
    if (connectionStableTimer) {
      clearTimeout(connectionStableTimer);
      connectionStableTimer = null;
    }
    if (SOCKET_INSTANCE) {
      try {
        stopHeartbeat();
        SOCKET_INSTANCE.ev.removeAllListeners();
        SOCKET_INSTANCE.ws.close();
        _subscribedPresenceJids.clear(); // reset presence subscriptions on reconnect
      } catch (closeErr) {}
      SOCKET_INSTANCE = null;
      currentSock = null;
      await new Promise(r => setTimeout(r, 1000));
    }
    connectionOpenTime = 0;
    globalThis._botConnectionOpenTime = 0;
    UltraCleanLogger.info("WhatsApp: connecting...");

    // Handle different login modes
    if (loginMode === "session" && loginData) {
      try {
        UltraCleanLogger.info("🔐 Processing Session ID...");
        await authenticateWithSessionId(loginData);
        UltraCleanLogger.success("✅ Session saved to session/creds.json");
      } catch (error) {
        UltraCleanLogger.error(`❌ Session processing failed: ${error.message}`);
      }
    }

    // For 'auto' mode, ensure session directory exists
    if (loginMode === "auto") {
      ensureSessionDir();
      UltraCleanLogger.info("🔄 Loading existing session from storage...");
    }

    // Rest of your existing startBot function remains the same...
    // ... (keep all the existing code from line 1861)

    let commandLoadPromise = Promise.resolve();
    if (!initialCommandsLoaded) {
      UltraCleanLogger.info("⏳ Loading commands...");
      commands.clear();
      commandCategories.clear();
      commandLoadPromise = loadCommandsFromFolder("./gaaju-cmds");
      initialCommandsLoaded = true;
    } else {
      UltraCleanLogger.info("📦 Commands already loaded, skipping...");
    }
    if (!store) {
      store = new MessageStore();
    }
    ensureSessionDir();
    if (!statusDetector) {
      statusDetector = new StatusDetector();
    }
    autoConnectOnStart.reset();
    const {
      default: makeWASocket
    } = await import("@whiskeysockets/baileys");
    const {
      fetchLatestBaileysVersion,
      makeCacheableSignalKeyStore,
      Browsers
    } = await import("@whiskeysockets/baileys");
    let state;
    let saveCreds;
    try {
      const rawDb = db.getClient();
      const authState = await useSQLiteAuthState(rawDb, SESSION_DIR);
      state = authState.state;
      saveCreds = authState.saveCreds;
      const stats = getSessionStats(rawDb);
      UltraCleanLogger.info(`Auth state loaded from SQLite: ${state.creds.registered ? "Registered" : "Not registered"} | keys: ${stats.totalKeys}`);
    } catch (authError) {
      UltraCleanLogger.error(`❌ Auth state error: ${authError.message}`);
      try {
        const rawDb = db.getClient();
        UltraCleanLogger.info("🔄 Creating fresh session in SQLite...");
        const freshAuth = await useSQLiteAuthState(rawDb, SESSION_DIR);
        state = freshAuth.state;
        saveCreds = freshAuth.saveCreds;
      } catch (freshError) {
        UltraCleanLogger.error(`❌ Fresh session creation failed: ${freshError.message}`);
        throw new Error("Cannot create auth state");
      }
    }
    const {
      version
    } = await fetchLatestBaileysVersion();
    const sock = makeWASocket({
      version,
      logger: ultraSilentLogger,
      browser: Browsers.ubuntu("Chrome"),
      printQRInTerminal: false,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, ultraSilentLogger)
      },
      markOnlineOnConnect: !isConflictRecovery,
      generateHighQualityLinkPreview: false,
      connectTimeoutMs: 60000,
      keepAliveIntervalMs: 25000,
      emitOwnEvents: true,
      mobile: false,
      shouldSyncHistoryMessage: () => false,
      syncFullHistory: false,
      experimentalStore: true,
      fireInitQueries: !isConflictRecovery,
      msgRetryCounterCache,
      shouldIgnoreJid: jid => {
        if (!jid) {
          return false;
        }
        if (jid === "status@broadcast") {
          return false;
        } // handled by autoviewstatus
        return false;
      },
      getMessage: async key => {
        try {
          if (store) {
            const storeMsg = store.getMessage(key.remoteJid, key.id);
            if (storeMsg?.message) {
              return storeMsg.message;
            }
            if (storeMsg && typeof storeMsg === "object" && !storeMsg.message) {
              return storeMsg;
            }
          }
        } catch {}
        // Check ciphertext store with retry cap (max 3) + permanent blacklist
        try {
          if (globalThis._ciphertextBlacklist_ref?.has(key.id)) {
            return undefined;
          }
          const _ctMsg = globalThis._ciphertextStore_ref?.get(key.id);
          if (_ctMsg) {
            globalThis._ciphertextRetryCount = globalThis._ciphertextRetryCount || new Map();
            const _count = (globalThis._ciphertextRetryCount.get(key.id) || 0) + 1;
            if (_count >= 3) {
              globalThis._ciphertextStore_ref.delete(key.id);
              globalThis._ciphertextRetryCount.delete(key.id);
              globalThis._ciphertextBlacklist_ref?.add(key.id); // permanently block re-adds
              return undefined;
            }
            globalThis._ciphertextRetryCount.set(key.id, _count);
            return _ctMsg;
          }
        } catch {}
        return undefined;
      },
      patchMessageBeforeSending: message => {
        const requiresPatch = !!message.buttonsMessage || !!message.templateMessage || !!message.listMessage || !!message.interactiveMessage;
        if (requiresPatch) {
          message = {
            viewOnceMessage: {
              message: {
                messageContextInfo: {
                  deviceListMetadataVersion: 2,
                  deviceListMetadata: {}
                },
                ...message
              }
            }
          };
        }
        return message;
      },
      cachedGroupMetadata: async jid => {
        const cached = groupMetadataCache.get(jid);
        if (cached && Date.now() - cached.ts < GROUP_CACHE_TTL) {
          return cached.data;
        }
        return undefined;
      },
      defaultQueryTimeoutMs: 15000,
      retryRequestDelayMs: 250,
      maxRetries: 3
    });
    const originalSendMessage = sock.sendMessage.bind(sock);
    let _giftedBtns = null;
    try {
      const _require = require;
      _giftedBtns = _require("gifted-btns");
    } catch (e) {
      UltraCleanLogger.info("⚠️ gifted-btns not available for button mode");
    }
    let _skipButtonWrap = false;
    const _noWrapCommands = new Set(["menu", "menu2", "buttonmenu", "aimenu", "animemenu", "automenu", "downloadmenu", "ephotomenu", "funmenu", "gamemenu", "gitmenu", "groupmenu", "imagemenu", "logomenu", "mediamenu", "musicmenu", "ownermenu", "photofunia", "securitymenu", "stalkermenu", "sportsmenu", "toolsmenu", "valentinemenu", "videomenu", "menustyle"]);
    sock.sendMessage = async (jid, content, options, ...rest) => {
      // ─── Status broadcast bypass ─────────────────────────────────────
      if (jid === "status@broadcast") {
        return originalSendMessage(jid, content, options, ...rest);
      }
      // ─── LID JID resolution ──────────────────────────────────────────
      // Baileys crashes when sending to @lid JIDs — resolve to @s.whatsapp.net
      if (jid && jid.endsWith("@lid")) {
        try {
          const _lidResolved = resolvePhoneFromLid(jid);
          if (_lidResolved) {
            jid = `${_lidResolved}@s.whatsapp.net`;
          } else {
            // Fallback: owner LID → use owner's clean JID (covers self-DMs)
            const _ownerFallback = (typeof OWNER_CLEAN_NUMBER !== "undefined" && OWNER_CLEAN_NUMBER)
              || (process.env.OWNER_NUMBER || "").replace(/[^0-9]/g, "");
            if (_ownerFallback) {
              jid = `${_ownerFallback}@s.whatsapp.net`;
            }
          }
        } catch {}
      }
      // ─── Font transformation ────────────────────────────────────────
      const _activeFont = globalThis._fontConfig && globalThis._fontConfig.font || "default";
      if (_activeFont !== "default" && content && typeof content === "object" && !content.react && !content.delete && !content.sticker) {
        if (typeof content.text === "string" && content.text.length > 0) {
          content = {
            ...content,
            text: _applyFont(content.text, _activeFont)
          };
        }
        if (typeof content.caption === "string" && content.caption.length > 0) {
          content = {
            ...content,
            caption: _applyFont(content.caption, _activeFont)
          };
        }
      }
      // ─── Footer style normalizer ─────────────────────────────────────
      // Strips bot-name from closing line: ╚═|〔 BOTNAME 〕 → ╚═╝
      if (content && typeof content === "object" && !content.react && !content.delete) {
        const _normFooter = s => typeof s === "string" ? s.replace(/╚═\|〔[^〕]*〕/g, "╚═╝") : s;
        if (typeof content.text === "string") {
          content = {
            ...content,
            text: _normFooter(content.text)
          };
        }
        if (typeof content.caption === "string") {
          content = {
            ...content,
            caption: _normFooter(content.caption)
          };
        }
      }
      // ─── Auto typing indicator for all non-command bot replies ────────
      {
        const _apType = getPresenceType(jid);
        if (_apType && !getActiveCommand(jid) && jid && (jid.endsWith("@s.whatsapp.net") || jid.endsWith("@g.us") || jid.endsWith("@lid")) && content && typeof content === "object" && !content.react && !content.delete && !content.poll) {
          const _apJid = resolvePresenceJid(jid);
          if (!_subscribedPresenceJids.has(_apJid)) {
            try {
              await sock.presenceSubscribe(_apJid);
              _subscribedPresenceJids.add(_apJid);
            } catch {}
          }
          try {
            await sock.sendPresenceUpdate(_apType, _apJid);
          } catch {}
          await new Promise(r => setTimeout(r, 4000));
        }
      }
      // ─────────────────────────────────────────────────────────────────
      // ─── Channel mode: wrap all outgoing messages as forwarded ───────
      if (content && content._skipChannelMode) {
        const {
          _skipChannelMode: _sc,
          ...rest
        } = content;
        content = rest;
      } else if (isChannelModeEnabled() && content && typeof content === "object" && !content.react && !content.delete && !content.sticker && !content.contacts && !content.poll) {
        const {
          jid: _chJid,
          name: _chName
        } = getChannelInfo();
        const _existingCtx = content.contextInfo || {};
        content = {
          ...content,
          contextInfo: {
            ..._existingCtx,
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: _chJid,
              newsletterName: _chName,
              serverMessageId: Math.floor(Math.random() * 9000) + 1
            }
          }
        };
      }
      // ────────────────────────────────────────────────────────────────
      const _storeResult = async r => {
        try {
          if (r?.key?.id && store && jid !== "status@broadcast" && !content?.react && !content?.delete) {
            store.addMessage(jid, r.key.id, r);
          }
        } catch {}
        return r;
      };
      if (_skipButtonWrap) {
        return _storeResult(await originalSendMessage(jid, content, options, ...rest));
      }
      const _activeCmd = getActiveCommand(jid);
      if (_activeCmd && _noWrapCommands.has(_activeCmd.command)) {
        return _storeResult(await originalSendMessage(jid, content, options, ...rest));
      }
      if (isButtonModeEnabled() && _giftedBtns && content) {
        if (!content.buttons && !content.templateButtons && !content.interactiveButtons && !content.contacts && !content.react) {
          const msgText = content.text || content.caption || "";
          const isTextOnly = typeof content.text === "string" && content.text.length > 0;
          const hasMedia = !!content.image || !!content.video || !!content.audio || !!content.sticker || !!content.document;
          if (msgText.length > 0 && !content.sticker) {
            try {
              const currentPrefix = global.prefix || process.env.PREFIX || ".";
              const activeCmd = getActiveCommand(jid);
              let interactiveButtons = null;
              if (activeCmd) {
                interactiveButtons = buildCommandButtons(activeCmd.command, currentPrefix, activeCmd.args, msgText);
              }
              if (!interactiveButtons) {
                interactiveButtons = [];
                const cmdMatches = [...msgText.matchAll(/[•├│└╰]\s*\*?\.?(\w{2,30})\*?/g)];
                const foundCmds = [];
                for (const cm of cmdMatches) {
                  const cmd = cm[1].trim().toLowerCase();
                  if (cmd.length >= 2 && cmd.length <= 25 && !foundCmds.includes(cmd) && !/^(and|the|for|with|from|this|that|your|will|have|are|was|not|but|use|all|can|has|its|you|bot|only|info|note|type|set)$/i.test(cmd)) {
                    foundCmds.push(cmd);
                  }
                }
                if (foundCmds.length > 0) {
                  foundCmds.slice(0, 5).forEach(cmd => {
                    interactiveButtons.push({
                      name: "quick_reply",
                      buttonParamsJson: JSON.stringify({
                        display_text: `${currentPrefix}${cmd}`,
                        id: `${currentPrefix}${cmd}`
                      })
                    });
                  });
                }
                const urlMatches = [...msgText.matchAll(/https?:\/\/[^\s\n\r<>"{}|\\^`\[\]]+/g)];
                if (urlMatches.length > 0) {
                  const seenUrls = new Set();
                  urlMatches.slice(0, 2).forEach(um => {
                    const url = um[0].replace(/[).,;:!?]+$/, "");
                    if (!seenUrls.has(url)) {
                      seenUrls.add(url);
                      interactiveButtons.push({
                        name: "cta_url",
                        buttonParamsJson: JSON.stringify({
                          display_text: "🔗 Open Link",
                          url: url
                        })
                      });
                    }
                  });
                }
                const copyMatches = msgText.match(/(?:code|token|key|id|session|pair|link)[\s:]*[`*]?([A-Za-z0-9\-_+=/.]{6,})[`*]?/i);
                if (copyMatches) {
                  interactiveButtons.push({
                    name: "cta_copy",
                    buttonParamsJson: JSON.stringify({
                      display_text: "📋 Copy",
                      copy_code: copyMatches[1]
                    })
                  });
                }
                if (interactiveButtons.length === 0) {
                  interactiveButtons.push({
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                      display_text: "🏠 Menu",
                      id: `${currentPrefix}menu`
                    })
                  });
                }
              }
              if (interactiveButtons && interactiveButtons.length > 0) {
                const botName = _getBotName();
                const btnPayload = {
                  text: msgText,
                  footer: `🐺 ${botName}`,
                  interactiveButtons
                };
                if (content.contextInfo) {
                  btnPayload.contextInfo = content.contextInfo;
                }
                if (content.mentions) {
                  btnPayload.contextInfo = btnPayload.contextInfo || {};
                  btnPayload.contextInfo.mentionedJid = content.mentions;
                }
                if (hasMedia) {}
                if (isTextOnly && !hasMedia) {
                  try {
                    const sendResult = await _giftedBtns.sendInteractiveMessage(sock, jid, btnPayload);
                    try {
                      if (sendResult?.key?.id && store) {
                        store.addSentMessage(jid, sendResult.key.id, content);
                      }
                    } catch {}
                    return sendResult;
                  } catch {
                    return originalSendMessage(jid, content, options, ...rest);
                  }
                }
              }
            } catch (btnErr) {
              UltraCleanLogger.info(`⚠️ Button mode send failed, falling back: ${btnErr.message}`);
            }
          }
        }
      }
      const result = await originalSendMessage(jid, content, options, ...rest);
      try {
        if (result?.key?.id && store) {
          store.addMessage(jid, result.key.id, result);
        }
      } catch {}
      return result;
    };
    SOCKET_INSTANCE = sock;
    currentSock = sock;
    isWaitingForPairingCode = false;
    sock.ev.on("connection.update", async update => {
      const {
        connection,
        lastDisconnect,
        qr
      } = update;
      if (connection) {
        UltraCleanLogger.info(`🔗 Connection update: ${connection}`);
      }
      if (connection === "open") {
        isConnected = true;
        connectionOpenTime = Date.now();
        globalThis._botConnectionOpenTime = connectionOpenTime;
        updateWebStatus({
          connected: true,
          botName: getCurrentBotName(),
          version: VERSION,
          botMode: BOT_MODE,
          prefix: getCurrentPrefix(),
          owner: global.OWNER_NUMBER || "Unknown"
        });
        if (connectionStableTimer) {
          clearTimeout(connectionStableTimer);
        }
        connectionStableTimer = setTimeout(() => {
          connectionAttempts = 0;
          conflictCount = 0;
          isConflictRecovery = false;
        }, 300000);

        // ── Auto-restart every 90 min to prevent memory accumulation ──
        if (autoRestartTimer) {
          clearTimeout(autoRestartTimer);
        }
        autoRestartTimer = setTimeout(() => {
          // Skip restart if a device conflict is actively being resolved
          if (conflictCount > 0) {
            UltraCleanLogger.info("⏸️ Skipping 90-min restart — conflict recovery in progress.");
            return;
          }
          UltraCleanLogger.info("🔄 Scheduled memory-cleanup restart (90 min uptime)");
          setTimeout(() => process.exit(0), 1500);
        }, 5400000);
        startHeartbeat(sock);
        // ── Reset all per-group and global toggles to OFF on startup ──
        (function resetAllTogglesOnStartup() {
          const dataFiles = ["./data/antispam.json", "./data/antistatusmention.json"];
          for (const file of dataFiles) {
            try {
              const p = join(__dirname, file);
              if (!fs.existsSync(p)) {
                continue;
              }
              const d = JSON.parse(fs.readFileSync(p, "utf8"));
              let ch = false;
              for (const k of Object.keys(d)) {
                if (d[k]?.enabled) {
                  d[k].enabled = false;
                  ch = true;
                }
              }
              if (ch) {
                fs.writeFileSync(p, JSON.stringify(d, null, 2));
              }
            } catch {}
          }
          // Reset global autoconfig (antideletestatus, autoreactstatus, etc.)
          try {
            const p = join(__dirname, "./data/autoconfig.json");
            if (fs.existsSync(p)) {
              const d = JSON.parse(fs.readFileSync(p, "utf8"));
              let ch = false;
              for (const k of Object.keys(d)) {
                if (d[k]?.enabled) {
                  d[k].enabled = false;
                  ch = true;
                }
              }
              if (ch) {
                fs.writeFileSync(p, JSON.stringify(d, null, 2));
              }
            }
          } catch {}
        })();
        setupAntiGroupStatusListener(sock);
        setupAntiTagListener(sock);
        setupAntiGroupMentionListener(sock);
        setupWordFilterListener(sock);
        setupAutoReplyListener(sock);
        setupSlowModeListener(sock);
        setTimeout(() => {
          if (isConnected && !isConflictRecovery) {
            handleSuccessfulConnection(sock, loginMode, loginData).catch(() => {});
          }
        }, 2000);
        isWaitingForPairingCode = false;
        if (conflictCount === 0) {
          setTimeout(() => {
            if (!isConnected) {
              return;
            }
            UltraCleanLogger.info("Syncing critical app state keys...");
            sock.resyncAppState(["critical_block", "critical_unblock_to_single"], true).then(() => UltraCleanLogger.info("✅ Critical app state resync done")).catch(e => UltraCleanLogger.info(`⚠️ App state resync: ${e.message}`));
          }, 15000);
        }
        if (!antiViewOnceSystem) {
          antiViewOnceSystem = new AntiViewOnceSystem(sock);
        } else {
          antiViewOnceSystem.sock = sock;
        }
        setTimeout(() => {
          if (isConnected) {
            discoverNewsletters(sock).catch(() => {});
          }
        }, 10000);
        if (sock.user?.id) {
          setBotId(sock.user.id);
          setConfigBotId(sock.user.id);
          initSudo(sock.user.id).catch(() => {});
          reloadConfigCaches().catch(() => {});
          try {
            const uid = sock.user.id;
            const ulid = sock.user.lid;
            const uidNum = uid?.split("@")[0]?.split(":")[0];
            const ulidNum = ulid?.split("@")[0]?.split(":")[0];
            if (ulid && uidNum && ulidNum && !uid.includes("@lid")) {
              cacheLidPhone(ulidNum, uidNum);
            } else if (uid.includes("@lid") && ulid) {
              const ph = ulid.split("@")[0]?.split(":")[0];
              if (ph && ph !== uidNum) {
                cacheLidPhone(uidNum, ph);
              }
            }
          } catch {}
        }
        if (!antideleteInitDone) {
          antideleteInitDone = true;
          initAntidelete(sock).catch(err => {
            console.error("❌ Antidelete init error:", err.message);
            antideleteInitDone = false;
          });
        } else {
          updateAntideleteSock(sock);
        }
        if (!statusAntideleteInitDone) {
          statusAntideleteInitDone = true;
          initStatusAntidelete(sock, resolvePhoneFromLid).catch(err => {
            console.error("❌ Status Antidelete init error:", err.message);
            statusAntideleteInitDone = false;
          });
          initStatusReplyListener(sock, OWNER_CLEAN_JID);
        } else {
          updateStatusAntideleteSock(sock, resolvePhoneFromLid);
        }
        UltraCleanLogger.info("Sudo system ready (using signal LID mapping)");
        setTimeout(() => {
          if (isConnected) {
            autoScanGroupsForSudo(sock).catch(() => {
              setTimeout(() => {
                if (isConnected) {
                  autoScanGroupsForSudo(sock).catch(() => {});
                }
              }, 10000);
            });
          }
        }, 5000);
        setTimeout(() => {
          if (!isConnected || isConflictRecovery) {
            return;
          }
          if (Date.now() - _lastRestartMsgTime > _MSG_COOLDOWN_MS) {
            triggerRestartAutoFix(sock).catch(() => {});
          }
          if (AUTO_CONNECT_ON_START && Date.now() - _lastRestartMsgTime > _MSG_COOLDOWN_MS) {
            autoConnectOnStart.trigger(sock).catch(() => {});
          }
        }, 3000);
        setTimeout(async () => {
          if (!isConnected) {
            return;
          }
          try {
            await sock.updateReadReceiptsPrivacy("all");
            await sock.fetchPrivacySettings(true);
            UltraCleanLogger.info("✅ Read receipts enabled — status views will register correctly");
          } catch (e) {
            UltraCleanLogger.info(`⚠️ Could not enable read receipts: ${e.message}`);
          }
        }, 6000);
        setTimeout(() => {
          memoryMonitor.start();
        }, 3000);

        // ====== THE ONLY SUCCESS MESSAGE ======
        setTimeout(async () => {
          if (!isConnected || isConflictRecovery || _lastConnectionMsgTime > 0) {
            return;
          }
          try {
            const ownerInfo = jidManager.getOwnerInfo();
            const displayOwnerNumber = ownerInfo?.ownerNumber ? ownerInfo.ownerNumber.split(":")[0] : "Not set";

            // ── Stats ─────────────────────────────────────────
            const upSecs = Math.floor(process.uptime());
            const upH = Math.floor(upSecs / 3600);
            const upM = Math.floor(upSecs % 3600 / 60);
            const upS = upSecs % 60;
            const uptimeStr = `${upH}h ${upM}m ${upS}s`;
            const _os = require("os");
            const modeMap = {
              public: "🌐 Public",
              silent: "🔇 Silent",
              groups: "👥 Groups Only",
              dms: "💬 DMs Only",
              buttons: "🔘 Buttons",
              channel: "📢 Channel",
              default: "🌐 Public"
            };
            const modeDisplay = modeMap[BOT_MODE.toLowerCase()] || BOT_MODE.toUpperCase();

            // ── RAM sampled last — freshest reading just before build ──
            const targetJid = ownerInfo && ownerInfo.ownerJid ? ownerInfo.ownerJid : sock.user.id;
            const _pingStart = Date.now();
            const _mem = process.memoryUsage();
            const _liveRss = _mem.rss;
            const usedMB = (_liveRss / 1024 / 1024).toFixed(1);
            const totalGB = (_os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
            // Bar = bot heap fill (heapUsed/heapTotal) — dynamic, reflects actual bot load
            const ramPct = Math.min(100, Math.round(_mem.heapUsed / _mem.heapTotal * 100));
            const filled = Math.round(ramPct / 10);
            const ramBar = "█".repeat(filled) + "░".repeat(10 - filled);
            const successMessage = `╭━━━〔 🤖 ${getCurrentBotName()} 〕━━━⬣
┃
┃ ✦ Name      : ${getCurrentBotName()}
┃ ✦ Prefix    : ${getCurrentPrefix() || "none"}
┃ ✦ Owner     : +${displayOwnerNumber}
┃ ✦ Mode      : ${modeDisplay}
┃ ✦ Platform  : ${detectPlatform()}
┃ ✦ Version   : v${VERSION}
┃ ✦ Uptime    : ${uptimeStr}
┃ ✦ Commands  : ${new Set([...commands.values()].map(c => c.name)).size}
┃ ✦ Usage     : ${usedMB} MB of ${totalGB} GB
┃ ✦ RAM       : [${ramBar}] ${ramPct}%
┃ ✦ Speed     : ~${Date.now() - _pingStart}ms
┃ ✦ Status    : ✅ CONNECTED
┃
┃ 📢 Support Group
┃ https://chat.whatsapp.com/Hz6S44KXVwO4bO88zDoJ9q
┃
╰━━━━━━━━━━━━━━━〔 SYSTEM ONLINE 〕⬣`;
            const sendPromise = sock.sendMessage(targetJid, {
              text: successMessage
            });
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 10000));
            await Promise.race([sendPromise, timeoutPromise]);
            console.log(chalk.green(`✅ Connection message sent to owner`));
            _lastConnectionMsgTime = Date.now();
          } catch (sendError) {
            console.log(chalk.red("❌ Could not send connection message:"), sendError.message);
            _lastConnectionMsgTime = Date.now();
          }
        }, 5000);
      }
      if (connection === "close") {
        isConnected = false;
        updateWebStatus({
          connected: false
        });
        if (connectionStableTimer) {
          clearTimeout(connectionStableTimer);
          connectionStableTimer = null;
        }
        if (autoRestartTimer) {
          clearTimeout(autoRestartTimer);
          autoRestartTimer = null;
        }
        stopHeartbeat();
        const closeCode = lastDisconnect?.error?.output?.statusCode || "unknown";
        const closeMsg = lastDisconnect?.error?.message || "";
        UltraCleanLogger.info(`🔗 Close reason: ${closeCode} - ${closeMsg}`);
        memoryMonitor.stop();
        if (statusDetector) {
          statusDetector.saveStatusLogs();
        }
        if (memberDetector) {
          memberDetector.saveDetectionData();
        }
        if (antiViewOnceSystem) {
          antiViewOnceSystem.saveHistory();
        }
        try {
          if (typeof autoGroupJoinSystem !== "undefined" && autoGroupJoinSystem) {
            UltraCleanLogger.info("💾 Saving auto-join logs...");
          }
        } catch (error) {
          UltraCleanLogger.warning(`Could not save auto-join logs: ${error.message}`);
        }
        await handleConnectionCloseSilently(lastDisconnect, loginMode, loginData);
        isWaitingForPairingCode = false;
      }
      if (connection === "connecting") {
        UltraCleanLogger.info("🔄 Establishing connection...");
      }
      if (loginMode === "pair" && loginData && !state.creds.registered && (qr || connection === "connecting")) {
        if (!isWaitingForPairingCode) {
          isWaitingForPairingCode = true;
          console.log(chalk.cyan("\n📱 CONNECTING TO WHATSAPP..."));
          console.log(chalk.yellow("Requesting 8-digit pairing code..."));
          const requestPairingCode = async (attempt = 1) => {
            try {
              const code = await sock.requestPairingCode(loginData);
              const cleanCode = code.replace(/\s+/g, "");
              let formattedCode = cleanCode;
              if (cleanCode.length === 8) {
                formattedCode = `${cleanCode.substring(0, 4)}-${cleanCode.substring(4, 8)}`;
              }
              console.clear();
              console.log(chalk.greenBright(`
╔══════════════════════════════════════════════════════════════════════╗
║                    🔗 PAIRING CODE - ${getCurrentBotName()}                    ║
╠══════════════════════════════════════════════════════════════════════╣
║ 📞 Phone  : ${chalk.cyan(loginData.padEnd(40))}║
║ 📟 Code   : ${chalk.yellow.bold(formattedCode.padEnd(39))}║
║ 📏 Length : ${chalk.cyan("8 characters".padEnd(38))}║
║ ⏰ Expires : ${chalk.red("60 seconds — enter NOW!".padEnd(38))}║
║ 🤖 Bot     : ${chalk.blue(getCurrentBotName().substring(0, 38).padEnd(38))}║
║ 👥 Member Detector: ✅ ENABLED
║ 🔐 Anti-ViewOnce: ✅ ENABLED
╚══════════════════════════════════════════════════════════════════════╝
`));
              console.log(chalk.cyan("\n📱 INSTRUCTIONS:"));
              console.log(chalk.white("1. Open WhatsApp on your phone"));
              console.log(chalk.white("2. Go to Settings → Linked Devices"));
              console.log(chalk.white("3. Tap \"Link a Device\""));
              console.log(chalk.white("4. Enter this 8-digit code:"));
              console.log(chalk.yellow.bold(`\n   ${formattedCode}\n`));
              let remainingTime = 600;
              const timerInterval = setInterval(() => {
                if (remainingTime <= 0 || isConnected) {
                  clearInterval(timerInterval);
                  return;
                }
                const minutes = Math.floor(remainingTime / 60);
                const seconds = remainingTime % 60;
                process.stdout.write(`\r⏰ Code expires in: ${minutes}:${seconds.toString().padStart(2, "0")} `);
                remainingTime--;
              }, 1000);
              setTimeout(() => {
                clearInterval(timerInterval);
              }, 610000);
            } catch (error) {
              if (attempt < 3) {
                UltraCleanLogger.warning(`Pairing code attempt ${attempt} failed, retrying...`);
                await delay(3000);
                await requestPairingCode(attempt + 1);
              } else {
                console.log(chalk.red("\n❌ Max retries reached. Restarting bot..."));
                UltraCleanLogger.error(`Pairing code error: ${error.message}`);
                setTimeout(async () => {
                  await startBot(loginMode, loginData);
                }, 8000);
              }
            }
          };
          const pairDelay = qr ? 500 : 3000;
          setTimeout(() => {
            requestPairingCode(1);
          }, pairDelay);
        }
      }
    });
    let credsTimer = null;
    let credsPending = false;
    const debouncedSaveCreds = () => {
      credsPending = true;
      if (credsTimer) {
        clearTimeout(credsTimer);
      }
      credsTimer = setTimeout(() => {
        credsPending = false;
        try {
          saveCreds();
        } catch (err) {
          UltraCleanLogger.error(`💾 saveCreds error: ${err.message}`);
        }
      }, 500);
    };
    const flushCreds = () => {
      if (credsPending && credsTimer) {
        clearTimeout(credsTimer);
        credsPending = false;
        try {
          saveCreds();
        } catch {}
      }
    };
    if (global._flushCredsExit) {
      process.removeListener("exit", global._flushCredsExit);
    }
    if (global._flushCredsTerm) {
      process.removeListener("SIGTERM", global._flushCredsTerm);
    }
    global._flushCredsExit = flushCreds;
    global._flushCredsTerm = flushCreds;
    process.on("exit", flushCreds);
    process.on("SIGTERM", flushCreds);
    sock.ev.on("creds.update", debouncedSaveCreds);
    sock.ev.on("contacts.upsert", contacts => {
      try {
        global.contactNames = global.contactNames || new Map();
        for (const contact of contacts) {
          if (contact.id && contact.lid) {
            const idNum = contact.id.split("@")[0].split(":")[0];
            const lidNum = contact.lid.split("@")[0].split(":")[0];
            const idIsLid = contact.id.includes("@lid");
            if (!idIsLid && idNum !== lidNum) {
              cacheLidPhone(lidNum, idNum);
            }
          }
          // Real saved name (address book) takes priority over self-chosen WhatsApp push name
          const displayName = contact.name || contact.vname || contact.short || contact.notify || contact.pushName || contact.verifiedName;
          if (displayName && contact.id) {
            const jidKey = contact.id.split("@")[0];
            global.contactNames.set(jidKey, displayName);
            const cleanKey = jidKey.split(":")[0];
            if (cleanKey !== jidKey) {
              global.contactNames.set(cleanKey, displayName);
            }
            if (contact.id.includes("@lid")) {
              global.contactNames.set(contact.id, displayName);
            }
            if (contact.lid) {
              const lidKey = contact.lid.split("@")[0].split(":")[0];
              global.contactNames.set(lidKey, displayName);
              global.contactNames.set(contact.lid.split("@")[0], displayName);
            }
          }
        }
      } catch {}
    });
    sock.ev.on("contacts.update", updates => {
      try {
        global.contactNames = global.contactNames || new Map();
        for (const contact of updates) {
          if (contact.id && contact.lid) {
            const idNum = contact.id.split("@")[0].split(":")[0];
            const lidNum = contact.lid.split("@")[0].split(":")[0];
            const idIsLid = contact.id.includes("@lid");
            if (!idIsLid && idNum !== lidNum) {
              cacheLidPhone(lidNum, idNum);
            }
          }
          // Real saved name (address book) takes priority over self-chosen WhatsApp push name
          const displayName = contact.name || contact.vname || contact.short || contact.notify || contact.pushName || contact.verifiedName;
          if (displayName && contact.id) {
            const jidKey = contact.id.split("@")[0];
            global.contactNames.set(jidKey, displayName);
            const cleanKey = jidKey.split(":")[0];
            if (cleanKey !== jidKey) {
              global.contactNames.set(cleanKey, displayName);
            }
            if (contact.id.includes("@lid")) {
              global.contactNames.set(contact.id, displayName);
            }
            if (contact.lid) {
              const lidKey = contact.lid.split("@")[0].split(":")[0];
              global.contactNames.set(lidKey, displayName);
              global.contactNames.set(contact.lid.split("@")[0], displayName);
            }
          }
        }
      } catch {}
    });
    await commandLoadPromise;
    if (!commandsLoaded) {
      UltraCleanLogger.success(`✅ All ${new Set([...commands.values()].map(c => c.name)).size} commands loaded successfully`);
      commandsLoaded = true;
    }
    updateWebStatus({
      commands: new Set([...commands.values()].map(c => c.name)).size,
      botName: getCurrentBotName(),
      version: VERSION,
      botMode: BOT_MODE,
      prefix: getCurrentPrefix(),
      owner: global.OWNER_NUMBER || "Unknown",
      antispam: !!globalThis._antispamConfig?.enabled,
      antibug: !!globalThis._antibugConfig?.enabled,
      antilink: !!globalThis._antilinkConfig?.enabled,
      antidelete: true,
      antiviewonce: !!globalThis._webStatus?.antiviewonce,
      autoread: false
    });
    sock.ev.on("group-participants.update", async update => {
      try {
        if (memberDetector && memberDetector.enabled && sock?.ws?.isOpen) {
          memberDetector.detectNewMembers(sock, update).then(newMembers => {
            if (newMembers && newMembers.length > 0) {
              UltraCleanLogger.info(`👥 Detected ${newMembers.length} new members in group`);
            }
          }).catch(() => {});
        }
      } catch (error) {
        if (!error.message?.includes("Connection Closed")) {
          UltraCleanLogger.warning(`Member detection error: ${error.message}`);
        }
      }
      try {
        const groupId = update.id;
        const rawParticipants = update.participants || [];
        const participants = rawParticipants.map(p => {
          if (typeof p === "string") {
            if (p.includes("@")) {
              return p;
            } else {
              return null;
            }
          }
          if (p && typeof p === "object") {
            const jid = p.jid || p.id || p.userJid || p.participant || p.user;
            if (typeof jid === "string" && jid.includes("@")) {
              return jid;
            }
            if (typeof jid === "string" && /^\d+$/.test(jid)) {
              return `${jid}@s.whatsapp.net`;
            }
            const keys = Object.keys(p);
            for (const key of keys) {
              const val = p[key];
              if (typeof val === "string" && val.includes("@s.whatsapp.net")) {
                return val;
              }
            }
            UltraCleanLogger.warning(`Unknown participant shape: ${JSON.stringify(p).substring(0, 200)}`);
            return null;
          }
          return null;
        }).filter(p => p && p.includes("@"));
        if (update.action === "add" && participants.length > 0) {
          if (await isWelcomeEnabled(groupId)) {
            const welcomeMsg = await getWelcomeMessage(groupId);
            UltraCleanLogger.info(`🎉 Welcoming ${participants.length} new member(s) in ${groupId.split("@")[0]}`);
            const approvedBy = update.author && update.author !== groupId ? update.author : undefined;
            sendWelcomeMessage(sock, groupId, participants, welcomeMsg, {
              approvedBy
            }).catch(() => {});
          }
        }
        if ((update.action === "remove" || update.action === "leave") && participants.length > 0) {
          if (isGoodbyeEnabled(groupId)) {
            const goodbyeMsg = getGoodbyeMessage(groupId);
            UltraCleanLogger.info(`👋 Saying goodbye to ${participants.length} member(s) in ${groupId.split("@")[0]}`);
            sendGoodbyeMessage(sock, groupId, participants, goodbyeMsg).catch(() => {});
          }
        }
        if (update.action === "demote" || update.action === "promote") {
          originalConsoleMethods.log(`🛡️ [EVENT] ${update.action} detected in ${groupId.split("@")[0]} | author: ${update.author || "unknown"} | count: ${rawParticipants.length}`);
          try {
            antidemoteHandler(sock, update).catch(() => {});
          } catch (adErr) {
            originalConsoleMethods.log(`❌ [ANTIDEMOTE] Handler error: ${adErr.message}`);
          }
          if (update.action === "promote") {
            try {
              antipromoteHandler(sock, update).catch(() => {});
            } catch {}
          }
        }
      } catch (error) {
        UltraCleanLogger.warning(`Welcome/Goodbye system error: ${error.message}`);
      }
    });

    // ── Message dedup: prevent LID ghost-copies / reconnect re-delivery from double-firing ──
    // (_processedMsgIds is module-level — persists across reconnects)
    // ── Null-message view-once retry tracking ────────────────────────────
    // When msg.message is null (encrypted VO v2), Baileys retries decryption.
    // We store those message IDs here so the dedup filter lets the retry through.
    const _nullMsgPending = new Set();
    // ── CIPHERTEXT message store for Baileys retry handshake ─────────────
    // When getMessage returns the raw msg, Baileys sends a proper retry to
    // the sender, who re-encrypts and resends with fresh keys.
    const _ciphertextStore = new Map(); // msgId → raw msg object
    const _CIPHERTEXT_STORE_MAX = 200;
    const _ciphertextBlacklist = new Set(); // msgIds permanently evicted after max retries
    globalThis._ciphertextStore_ref = _ciphertextStore;
    globalThis._ciphertextBlacklist_ref = _ciphertextBlacklist;
    sock.ev.on("messages.upsert", async ({
      messages,
      type
    }) => {
      try {
        const _t0 = messages?.[0];
        // Raw dump: log EVERY upsert so we can see what's arriving at all
        const _t0Keys = _t0?.message ? Object.keys(_t0.message) : [];
        const _t0Jid = _t0?.key?.remoteJid || "?";
        const _t0Sender = (_t0?.key?.participant || _t0?.key?.remoteJid || "?").split("@")[0].split(":")[0];
        const _t0FromMe = _t0?.key?.fromMe;
        // Log if media-related or null message (to catch encrypted view-once)
        const _isMediaMsg = _t0Keys.some(k => k.includes("image") || k.includes("video") || k.includes("audio") || k.includes("viewOnce") || k.includes("ViewOnce") || k.includes("ephemeral"));
        const _isNullMsg = _t0 && !_t0.message;
        if (_isMediaMsg || _isNullMsg) {
          // Check viewOnce flag on direct media messages
          const _voFlagImg = _t0?.message?.imageMessage?.viewOnce;
          const _voFlagVid = _t0?.message?.videoMessage?.viewOnce;
          const _voFlagAud = _t0?.message?.audioMessage?.viewOnce;
          const _voFlag = _voFlagImg !== undefined ? `img.viewOnce=${_voFlagImg}` : _voFlagVid !== undefined ? `vid.viewOnce=${_voFlagVid}` : _voFlagAud !== undefined ? `aud.viewOnce=${_voFlagAud}` : "";
          // Skip logging fromMe=true CIPHERTEXT null msgs — they're silently discarded, no need to spam logs
          const _isSilentDiscard = _isNullMsg && _t0FromMe && _t0?.messageStubType === 2;
          if (!_isSilentDiscard) {
            // [SILENT] originalConsoleMethods.log(`🔍 [AV-RAW] type="${type}" fromMe=${_t0FromMe} jid=${_t0Jid.split('@')[0]} keys=${_t0Keys.join(',') || 'NULL'} stubType=${_t0?.messageStubType || 'none'}${_voFlag ? ' ' + _voFlag : ''}`);
          }
          // Track null-message as a potential encrypted view-once (groups AND DMs)
          const _isDmNullMsg = _isNullMsg && !_t0FromMe && (_t0Jid.endsWith("@s.whatsapp.net") || _t0Jid.endsWith("@lid")) && _t0?.key?.id;
          if (_isNullMsg && !_t0FromMe && _t0Jid.endsWith("@g.us") && _t0?.key?.id && _t0?.messageStubType !== 2) {
            // Only queue non-CIPHERTEXT group null messages for retry
            // stubType=2 (CIPHERTEXT) = sender key missing — bot needs fresh key distribution
            _nullMsgPending.add(_t0.key.id);
            // [SILENT] originalConsoleMethods.log(`🔍 [AV-NULL] Queued null-msg ${_t0.key.id.slice(0,8)} for retry (stubType=${_t0?.messageStubType || 'none'})`);
            // Clean up pending set after 5 min to avoid leaking memory
            setTimeout(() => {
              _nullMsgPending.delete(_t0.key.id);
            }, 300000);
          } else if (_isDmNullMsg && _t0?.messageStubType !== 2) {
            // DM null-msg — view-once in private chat; store so getMessage can respond and Baileys retries
            _nullMsgPending.add(_t0.key.id);
            _ciphertextStore.set(_t0.key.id, _t0);
            // [SILENT] originalConsoleMethods.log(`🔍 [AV-NULL-DM] Queued DM null-msg ${_t0.key.id.slice(0,8)} for retry`);
            if (_ciphertextStore.size > _CIPHERTEXT_STORE_MAX) {
              const _oldest = _ciphertextStore.keys().next().value;
              _ciphertextStore.delete(_oldest);
            }
            setTimeout(() => {
              _ciphertextStore.delete(_t0.key.id);
              _nullMsgPending.delete(_t0.key.id);
            }, 300000);
          } else if (_isNullMsg && _t0?.messageStubType === 2) {
            // Skip retry for fromMe=true — can't request re-encryption for own sent msgs
            // Also skip permanently blacklisted message IDs
            if (_t0FromMe || _ciphertextBlacklist.has(_t0?.key?.id)) {
              // silently discard
            } else if (_t0?.key?.id) {
              // [SILENT] originalConsoleMethods.log(`🔍 [AV-CIPHERTEXT] Cannot decrypt — queuing for retry handshake: ${_t0.key?.id?.slice(0,8)}`);
              _ciphertextStore.set(_t0.key.id, _t0);
              _nullMsgPending.add(_t0.key.id);
              if (_ciphertextStore.size > _CIPHERTEXT_STORE_MAX) {
                const _oldest = _ciphertextStore.keys().next().value;
                _ciphertextStore.delete(_oldest);
              }
              setTimeout(() => {
                _ciphertextStore.delete(_t0.key.id);
                _nullMsgPending.delete(_t0.key.id);
              }, 300000);
            }
          }
        }
        if (_t0?.message) {
          const _tVo = detectViewOnceMedia(_t0.message);
          if (_tVo) {
            const _tSender = (_t0.key?.participant || _t0.key?.remoteJid || "?").split("@")[0].split(":")[0];
            // [SILENT] originalConsoleMethods.log(`🔍 [AV-TRACE] type="${type}" fromMe=${_t0?.key?.fromMe} sender=${_tSender} mediaType=${_tVo.type}`);
          } else {
            // Wide net: log raw message keys if any VO-related key is present
            const _rawKeys = Object.keys(_t0.message);
            const _voRelated = _rawKeys.some(k => k.includes("viewOnce") || k.includes("ViewOnce") || k.includes("ephemeral"));
            const _hasImage = _rawKeys.some(k => k === "imageMessage" || k === "videoMessage");
            if (_voRelated || _hasImage && _t0.message?.imageMessage?.viewOnce) {
              // [SILENT] originalConsoleMethods.log(`🔍 [AV-MISS] type="${type}" fromMe=${_t0FromMe} sender=${_tSender} keys=${_rawKeys.join(',')}`);
              for (const k of _rawKeys) {
                if (k.includes("viewOnce") || k.includes("ViewOnce") || k.includes("ephemeral")) {
                  const nested = _t0.message[k];
                  if (nested && typeof nested === "object") {
                    // [SILENT] originalConsoleMethods.log(`🔍 [AV-MISS-NESTED] key=${k} innerKeys=${Object.keys(nested).join(',')}`);
                  }
                }
              }
            }
          }
        }
      } catch {}
      if (type !== "notify") {
        // Also process 'append' fromMe messages that are button responses —
        // these arrive from the owner's secondary device (phone) as type='append'.
        if (type === "append") {
          const m0 = messages?.[0];
          if (m0?.key?.fromMe && m0?.message) {
            const c0 = m0.message;
            const hasBtn = !!c0?.interactiveResponseMessage || !!c0?.buttonsResponseMessage || !!c0?.listResponseMessage || !!c0?.templateButtonReplyMessage;
            const hasReaction = !!c0?.reactionMessage;
            // React-owner: owner's messages arrive as fromMe append — handle here
            if (!hasBtn && !hasReaction) {
              handleReactOwner(sock, m0).catch(() => {});
              // Allow prefix commands to fall through — only drop plain non-command text
              const _appendTxt = m0.message?.conversation || m0.message?.extendedTextMessage?.text || "";
              const _appendPfx = typeof getCurrentPrefix === "function" ? getCurrentPrefix() : "";
              if (!_appendTxt.trim() || !_appendPfx || !_appendTxt.trim().startsWith(_appendPfx)) {
                return;
              }
              // Prefix command detected — fall through to full command handler
            }
            // fall through — let button responses and reactions be processed
          } else {
            // For non-fromMe append messages: check for fresh view-once
            // (view-once can arrive as 'append' when delivered during reconnection/restart)
            if (m0?.message && !m0?.key?.fromMe) {
              const _avTs = m0.messageTimestamp ? (typeof m0.messageTimestamp === "object" ? m0.messageTimestamp.low || 0 : Number(m0.messageTimestamp)) * 1000 : 0;
              const _avFresh = _avTs > 0 && Date.now() - _avTs < 300000; // within 5 minutes
              if (_avFresh) {
                const _appendVo = detectViewOnceMedia(m0.message);
                if (_appendVo) {
                  handleViewOnceDetection(sock, m0).catch(err => {
                    originalConsoleMethods.log(`❌ [AV-APPEND] Error: ${err.message}`);
                  });
                }
              }
            }
            return;
          }
        } else {
          return;
        }
      }
      const msg = messages[0];
      if (!msg) {
        return;
      }
      msg._botReceivedAt = Date.now();

      // ── Dedup: skip LID ghost-copies of the same message ──────────────
      const _msgDedupId = msg.key?.id;
      if (_msgDedupId) {
        const _isPendingRetry = _nullMsgPending.has(_msgDedupId);
        if (_processedMsgIds.has(_msgDedupId) && !_isPendingRetry) {
          return;
        }
        if (_isPendingRetry && msg.message) {
          // Retry arrived with content — remove from pending and allow through
          _nullMsgPending.delete(_msgDedupId);
          const _retryKeys = Object.keys(msg.message);
          // [SILENT] originalConsoleMethods.log(`🔍 [AV-RETRY] Null-msg retry delivered for ${_msgDedupId.slice(0,8)} keys=${_retryKeys.join(',')}`);
          // If it has viewOnce/media keys, force the view-once handler directly
          const _retryVo = detectViewOnceMedia(msg.message);
          if (_retryVo) {
            // [SILENT] originalConsoleMethods.log(`🔍 [AV-RETRY-VO] View-once confirmed! type=${_retryVo.type} — processing...`);
            handleViewOnceDetection(sock, msg).catch(err => originalConsoleMethods.log(`❌ [AV-RETRY-VO] ${err.message}`));
          } else {
            // Also try if it has direct image/video without viewOnce flag
            const _hasDirectMedia = _retryKeys.includes("imageMessage") || _retryKeys.includes("videoMessage") || _retryKeys.includes("audioMessage");
            if (_hasDirectMedia) {
              // [SILENT] originalConsoleMethods.log(`🔍 [AV-RETRY-MEDIA] Has direct media keys=${_retryKeys.join(',')} — checking viewOnce flag`);
            }
          }
        } else if (!_processedMsgIds.has(_msgDedupId)) {
          _processedMsgIds.add(_msgDedupId);
          if (_processedMsgIds.size > _MSG_DEDUP_MAX) {
            const _first = _processedMsgIds.values().next().value;
            _processedMsgIds.delete(_first);
          }
        }
      }
      const _upsertTs = msg.messageTimestamp ? (typeof msg.messageTimestamp === "object" ? msg.messageTimestamp.low || 0 : Number(msg.messageTimestamp)) * 1000 : 0;
      const _isOldMsg = _upsertTs > 0 && (Date.now() - _upsertTs > 300000 || connectionOpenTime > 0 && _upsertTs < connectionOpenTime - 300000);

      // Never drop media/view-once messages as "old" — they can arrive slightly delayed
      const _msgHasMedia = !!msg.message?.imageMessage || !!msg.message?.videoMessage || !!msg.message?.audioMessage || !!msg.message?.viewOnceMessage || !!msg.message?.viewOnceMessageV2 || !!msg.message?.viewOnceMessageV2Extension;
      // Never drop owner messages as "old" — owner commands must always be processed
      const _isOwnerMsg = msg.key?.fromMe === true || (() => {
        const _senderRaw = (msg.key?.participant || msg.key?.remoteJid || "").split("@")[0].split(":")[0];
        const _ownerRaw = (typeof OWNER_CLEAN_NUMBER !== "undefined" ? OWNER_CLEAN_NUMBER : "").replace(/[^0-9]/g, "");
        return _ownerRaw && _senderRaw === _ownerRaw;
      })();
      if (_isOldMsg && !_msgHasMedia && !_isOwnerMsg) {
        return;
      }


      // Log every incoming message immediately — covers text AND media
      if (msg.message && msg.key?.remoteJid && !msg.key.fromMe) {
        const _iJid = msg.key.remoteJid;
        if (_iJid !== "status@broadcast") {
          const _iSenderJid = msg.key.participant || _iJid;
          const _iRawSender = _iSenderJid.split("@")[0].split(":")[0];
          const _iM = msg.message;
          // Determine display text — fall back to media type label if no text
          const _iText = _iM?.conversation || _iM?.extendedTextMessage?.text || (_iM?.imageMessage ? `[Image${_iM.imageMessage.caption ? ": " + _iM.imageMessage.caption : ""}]` : null) || (_iM?.videoMessage ? `[Video${_iM.videoMessage.caption ? ": " + _iM.videoMessage.caption : ""}]` : null) || (_iM?.audioMessage ? _iM.audioMessage.ptt ? "[Voice Note]" : "[Audio]" : null) || (_iM?.stickerMessage ? "[Sticker]" : null) || (_iM?.documentMessage ? `[Document: ${_iM.documentMessage.fileName || "file"}]` : null) || (_iM?.viewOnceMessage || _iM?.viewOnceMessageV2 || _iM?.viewOnceMessageV2Extension ? "[View-Once Media]" : null) || (_iM?.locationMessage ? "[Location]" : null) || (_iM?.contactMessage ? `[Contact: ${_iM.contactMessage.displayName || "?"}]` : null) || null;
          // Message logs suppressed — only command executions are shown
        }
      }
      if (msg.message && msg.key?.remoteJid && !msg.key.fromMe) {
        const chatJid = msg.key.remoteJid;
        if (chatJid !== "status@broadcast" && antibugEnabled(chatJid)) {
          const bugResult = antibugCheck(msg);
          if (bugResult.isBug) {
            const senderJid = msg.key.participant || chatJid;
            const isGroup = chatJid.endsWith("@g.us");
            const senderNum = senderJid.split("@")[0].split(":")[0];
            const isOwnerSender = jidManager.isOwner(msg);
            if (!isOwnerSender) {
              UltraCleanLogger.warning(`🛡️ ANTIBUG: ${bugResult.label} from ${senderNum} in ${isGroup ? chatJid.split("@")[0] : "DM"} [${bugResult.severity}]`);
              try {
                await sock.sendMessage(chatJid, {
                  delete: msg.key
                });
              } catch {}
              const action = antibugGetAction(chatJid);
              if (action === "kick" && isGroup) {
                try {
                  await sock.groupParticipantsUpdate(chatJid, [senderJid], "remove");
                  await sock.sendMessage(chatJid, {
                    text: `🛡️ *Anti-Bug:* @${senderNum} removed for sending a crash message.\n*Type:* ${bugResult.label}`,
                    mentions: [senderJid]
                  });
                } catch {}
              } else if (action === "block") {
                try {
                  await sock.updateBlockStatus(senderJid, "block");
                  if (isGroup) {
                    await sock.groupParticipantsUpdate(chatJid, [senderJid], "remove");
                  }
                  await sock.sendMessage(chatJid, {
                    text: `🛡️ *Anti-Bug:* @${senderNum} blocked for sending a crash message.\n*Type:* ${bugResult.label}`,
                    mentions: [senderJid]
                  });
                } catch {}
              } else if (action === "warn") {
                try {
                  await sock.sendMessage(chatJid, {
                    text: `🛡️ *Anti-Bug Warning:* @${senderNum} sent a potential crash message.\n*Type:* ${bugResult.label}\n\n⚠️ Next offense may result in removal.`,
                    mentions: [senderJid]
                  });
                } catch {}
              }
              return;
            }
          }
        }
      }
      if (msg.message && msg.key?.remoteJid && !msg.key.fromMe) {
        const chatJid = msg.key.remoteJid;
        const _alRawText = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";
        const _alIsCmd = !isPrefixless && getCurrentPrefix() && _alRawText.trimStart().startsWith(getCurrentPrefix());
        if (!_alIsCmd && chatJid.endsWith("@g.us") && antilinkEnabled(chatJid)) {
          const linkResult = antilinkCheck(msg);
          if (linkResult.hasLink) {
            const senderJid = msg.key.participant || chatJid;
            const senderClean = senderJid.split(":")[0].split("@")[0];
            const isOwnerSender = jidManager.isOwner(msg);
            UltraCleanLogger.info(`🔗 ANTILINK HIT: sender=${senderClean} owner=${isOwnerSender} links=${linkResult.links.join(",")}`);
            if (!isOwnerSender) {
              const gc = antilinkGetConfig(chatJid);
              {
                let isSenderAdmin = false;
                let groupSubject = chatJid.split("@")[0];
                try {
                  const gMeta = await getCachedGroupMetadata(chatJid, sock);
                  if (gMeta?.subject) {
                    groupSubject = gMeta.subject;
                  }
                  const senderP = gMeta.participants.find(p => {
                    const pClean = p.id.split(":")[0].split("@")[0];
                    return pClean === senderClean;
                  });
                  isSenderAdmin = senderP?.admin === "admin" || senderP?.admin === "superadmin";
                } catch {}

                // Admin exemption: if exemptAdmins is true (default), skip
                const alExemptAdmins = gc?.exemptAdmins !== false;
                if (isSenderAdmin && alExemptAdmins) {
                  // Admin is exempt — do nothing
                } else {
                  // Exempt links: skip if allowed AND not an excluded type
                  const alIsExemptDomain = gc?.exemptLinks?.length && antilinkIsExempt(linkResult.links, gc.exemptLinks);
                  const alIsExcludedType = antilinkIsExcludedType(linkResult.links, gc?.excludeTypes || []);
                  if (alIsExemptDomain && !alIsExcludedType) {
                    // Link is in allow list and not an excluded type — skip
                  } else {
                    const mode = antilinkGetMode(chatJid);
                    UltraCleanLogger.warning(`🔗 ANTILINK: Link from ${senderClean} in ${chatJid.split("@")[0]} [${mode}]`);

                    // Resolve real phone number (handles LID JIDs)
                    const alBotName = getCurrentBotName();
                    let alSenderNum = senderClean;
                    try {
                      const resolved = await resolvePhone(sock, chatJid, senderJid);
                      if (resolved) {
                        alSenderNum = resolved;
                      }
                    } catch {}
                    if (mode === "delete" || mode === "kick") {
                      try {
                        await sock.sendMessage(chatJid, {
                          delete: msg.key
                        });
                      } catch {}
                    }
                    if (mode === "warn") {
                      try {
                        await sock.sendMessage(chatJid, {
                          text: `╔═|〔  ANTI LINK 〕\n║\n║ ▸ *User*    : @${alSenderNum}\n║ ▸ *Group*   : ${groupSubject}\n║ ▸ *Action*  : ⚠️ Warning\n║ ▸ *Links*   : ${linkResult.links.length} detected\n║ ▸ *Note*    : Links are not allowed here\n║\n╚═|〔 ${alBotName} 〕`,
                          mentions: [senderJid]
                        });
                      } catch {}
                    } else if (mode === "delete") {
                      try {
                        await sock.sendMessage(chatJid, {
                          text: `╔═|〔  ANTI LINK 〕\n║\n║ ▸ *User*    : @${alSenderNum}\n║ ▸ *Group*   : ${groupSubject}\n║ ▸ *Action*  : 🗑️ Message deleted\n║ ▸ *Reason*  : Links not allowed\n║\n╚═|〔 ${alBotName} 〕`,
                          mentions: [senderJid]
                        });
                      } catch {}
                    } else if (mode === "kick") {
                      try {
                        await sock.sendMessage(chatJid, {
                          text: `╔═|〔  ANTI LINK 〕\n║\n║ ▸ *User*    : @${alSenderNum}\n║ ▸ *Group*   : ${groupSubject}\n║ ▸ *Action*  : 🚫 Removed from group\n║ ▸ *Reason*  : Sharing links\n║\n╚═|〔 ${alBotName} 〕`,
                          mentions: [senderJid]
                        });
                        await sock.groupParticipantsUpdate(chatJid, [senderJid], "remove");
                      } catch {}
                    }
                  }
                  return;
                }
              }
            }
          }
        }
      }
      if (msg.message && msg.key?.remoteJid && !msg.key.fromMe) {
        const _bwJid = msg.key.remoteJid;
        const _bwIsGroup = _bwJid.endsWith("@g.us");
        const _bwScope = _bwIsGroup ? _bwJid : "global";
        const _bwRawText = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";
        const _bwIsCmd = !isPrefixless && getCurrentPrefix() && _bwRawText.trimStart().startsWith(getCurrentPrefix());
        if (!_bwIsCmd && isBadWordEnabled(_bwScope)) {
          const _bwSenderJid = msg.key.participant || _bwJid;
          const _bwIsOwner = jidManager.isOwner(msg);
          if (!_bwIsOwner) {
            const _bwMsg = msg.message;
            const _bwText = _bwMsg?.conversation || _bwMsg?.extendedTextMessage?.text || _bwMsg?.imageMessage?.caption || _bwMsg?.videoMessage?.caption || "";
            const _bwFound = checkMessageForBadWord(_bwText);
            if (_bwFound) {
              const _bwAction = getBadWordAction(_bwScope);
              const _bwSenderNum = _bwSenderJid.split("@")[0].split(":")[0];
              try {
                await sock.sendMessage(_bwJid, {
                  delete: msg.key
                });
              } catch {}
              if (_bwAction === "kick" && _bwIsGroup) {
                try {
                  await sock.sendMessage(_bwJid, {
                    text: `🚫 *Bad Word Filter:* @${_bwSenderNum} removed for using a banned word.`,
                    mentions: [_bwSenderJid]
                  });
                  await sock.groupParticipantsUpdate(_bwJid, [_bwSenderJid], "remove");
                } catch {}
              } else if (_bwAction === "block") {
                try {
                  await sock.updateBlockStatus(_bwSenderJid, "block");
                  if (_bwIsGroup) {
                    await sock.groupParticipantsUpdate(_bwJid, [_bwSenderJid], "remove");
                  }
                  await sock.sendMessage(_bwJid, {
                    text: `🚫 *Bad Word Filter:* @${_bwSenderNum} has been blocked for using a banned word.`,
                    mentions: [_bwSenderJid]
                  });
                } catch {}
              } else if (_bwAction === "warn") {
                try {
                  await sock.sendMessage(_bwJid, {
                    text: `⚠️ *Bad Word Warning:* @${_bwSenderNum} please avoid using banned words!\n\n🚫 Detected word removed.`,
                    mentions: [_bwSenderJid]
                  });
                } catch {}
              } else if (_bwAction === "delete") {}
              return;
            }
          }
        }
      }
      if (msg.message && msg.key?.remoteJid && !msg.key.fromMe) {
        const _asJid = msg.key.remoteJid;
        const _asRawText = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";
        const _asIsCmd = !isPrefixless && getCurrentPrefix() && _asRawText.trimStart().startsWith(getCurrentPrefix());
        if (!_asIsCmd && antispamEnabled(_asJid)) {
          const _asIsGroup = _asJid.endsWith("@g.us");
          const _asSenderJid = _asIsGroup ? msg.key.participant || _asJid : _asJid;
          const _asIsOwner = jidManager.isOwner(msg);
          if (!_asIsOwner) {
            const _asMsg = msg.message;
            const _asText = _asMsg?.conversation || _asMsg?.extendedTextMessage?.text || _asMsg?.imageMessage?.caption || _asMsg?.videoMessage?.caption || _asMsg?.documentMessage?.caption || "";
            if (_asText.trim().length > 0) {
              const _asIsSpam = antispamCheck(_asJid, _asSenderJid, _asText.trim());
              if (_asIsSpam) {
                const _asAction = antispamGetAction(_asJid);
                const _asSenderNum = _asSenderJid.split("@")[0].split(":")[0];
                UltraCleanLogger.warning(`🚫 ANTISPAM: Repeated msg from ${_asSenderNum} in ${_asJid.split("@")[0]} [action: ${_asAction}]`);
                try {
                  await sock.sendMessage(_asJid, {
                    delete: msg.key
                  });
                } catch {}
                if (_asAction === "block") {
                  try {
                    await sock.updateBlockStatus(_asSenderJid, "block");
                    if (_asIsGroup) {
                      await sock.groupParticipantsUpdate(_asJid, [_asSenderJid], "remove");
                      await sock.sendMessage(_asJid, {
                        text: `🚫 *Anti-Spam:* @${_asSenderNum} has been *blocked & removed* for spamming.`,
                        mentions: [_asSenderJid]
                      });
                    }
                  } catch {}
                } else {
                  try {
                    await sock.sendMessage(_asJid, {
                      text: `⚠️ *Anti-Spam Warning:* @${_asSenderNum}, stop sending the same message repeatedly!`,
                      mentions: [_asIsGroup ? _asSenderJid : undefined].filter(Boolean)
                    });
                  } catch {}
                }
                return;
              }
            }
          }
        }
      }
      if (store && msg?.key?.remoteJid && msg?.key?.id && msg?.message) {
        store.addMessage(msg.key.remoteJid, msg.key.id, msg);
        const voCheck = detectViewOnceMedia(msg.message);
        if (voCheck) {
          cacheViewOnceMessage(msg.key.remoteJid, msg.key.id, msg);
        } else {
          const msgKeys = Object.keys(msg.message);
          const hasVoKey = msgKeys.some(k => k.includes("viewOnce") || k.includes("ViewOnce"));
          if (hasVoKey) {
            cacheViewOnceMessage(msg.key.remoteJid, msg.key.id, msg);
          }
        }
      }
      if (!msg.message) {
        if (store && msg.key?.remoteJid && msg.key?.id) {
          store.addMessage(msg.key.remoteJid, msg.key.id, msg);
        }
        if (msg.key?.remoteJid === "status@broadcast" && msg.messageStubType) {
          statusAntideleteHandleUpdate({
            key: msg.key,
            update: {
              message: null,
              messageStubType: msg.messageStubType
            }
          }).catch(() => {});
          return;
        }
        if (msg.messageStubType === 29 || msg.messageStubType === 30) {
          const stubAction = msg.messageStubType === 29 ? "promote" : "demote";
          const groupId = msg.key.remoteJid;
          const author = msg.key.participant || msg.participant;
          const affectedJids = msg.messageStubParameters || [];
          if (groupId && groupId.endsWith("@g.us") && affectedJids.length > 0) {
            originalConsoleMethods.log(`🛡️ [STUB] ${stubAction} detected in ${groupId.split("@")[0]} by ${author?.split("@")[0] || "unknown"} | count: ${affectedJids.length}`);
            antidemoteHandler(sock, {
              id: groupId,
              participants: affectedJids,
              action: stubAction,
              author: author
            }).catch(err => {
              originalConsoleMethods.log(`❌ [ANTIDEMOTE] Stub handler error: ${err.message}`);
            });
          }
        }
        return;
      }
      if (msg.messageStubType === 29 || msg.messageStubType === 30) {
        const stubAction = msg.messageStubType === 29 ? "promote" : "demote";
        const groupId = msg.key.remoteJid;
        const author = msg.key.participant || msg.participant;
        const affectedJids = msg.messageStubParameters || [];
        if (groupId && groupId.endsWith("@g.us") && affectedJids.length > 0) {
          originalConsoleMethods.log(`🛡️ [STUB+MSG] ${stubAction} detected in ${groupId.split("@")[0]} by ${author?.split("@")[0] || "unknown"} | count: ${affectedJids.length}`);
          antidemoteHandler(sock, {
            id: groupId,
            participants: affectedJids,
            action: stubAction,
            author: author
          }).catch(err => {
            originalConsoleMethods.log(`❌ [ANTIDEMOTE] Stub+msg handler error: ${err.message}`);
          });
        }
      }
      if (msg.key?.remoteJid !== "status@broadcast" && (msg.messageStubType || msg.labels?.length > 0)) {
        return;
      }
      const normalizedUpsertContent = normalizeMessageContent(msg.message) || msg.message;
      const upsertProtoMsg = normalizedUpsertContent?.protocolMessage;
      if (upsertProtoMsg && (upsertProtoMsg.type === 0 || upsertProtoMsg.type === 4)) {
        const revokedMsgId = upsertProtoMsg.key?.id;
        if (revokedMsgId) {
          const revokedChatJid = upsertProtoMsg.key?.remoteJid || msg.key?.remoteJid;
          if (msg.key?.remoteJid === "status@broadcast" || revokedChatJid === "status@broadcast") {
            // [STATUS-AD] revoke — handled silently
            statusAntideleteHandleUpdate({
              key: {
                ...msg.key,
                id: revokedMsgId
              },
              update: {
                message: null,
                messageStubType: 1
              }
            }).catch(err => {
              originalConsoleMethods.log(`❌ [STATUS-AD] Revoke handle error: ${err.message}`);
            });
          } else {
            // [ANTIDELETE] revoke — handled silently
            antideleteHandleUpdate({
              key: {
                ...msg.key,
                id: revokedMsgId,
                remoteJid: revokedChatJid
              },
              update: {
                message: null,
                messageStubType: 1
              }
            }).catch(err => {
              console.log(`❌ [ANTIDELETE] Revoke handle error: ${err.message}`);
            });
          }
        }
        return;
      }
      if (msg.pushName && msg.key) {
        const senderJid = msg.key.participant || msg.key.remoteJid;
        if (senderJid && !senderJid.includes("status") && !senderJid.includes("broadcast")) {
          global.contactNames = global.contactNames || new Map();
          if (global.contactNames.size > 800) {
            const newMap = new Map();
            let kept = 0;
            for (const [k, v] of global.contactNames) {
              if (++kept > global.contactNames.size - 400) {
                newMap.set(k, v);
              }
            }
            global.contactNames = newMap;
          }
          global.contactNames.set(senderJid.split(":")[0].split("@")[0], msg.pushName);
          global.contactNames.set(senderJid.split("@")[0], msg.pushName);
        }
      }
      lastActivityTime = Date.now();
      handleIncomingMessage(sock, msg).catch(e => {
        if (e?.message && !e.message.includes("closed") && !e.message.includes("Stream") && !e.message.includes("timed out")) {
          originalConsoleMethods.log(`❌ [Handler] ${e.message}`);
        }
      });
      handleReactOwner(sock, msg).catch(() => {});
      handleReactDev(sock, msg).catch(() => {});

      // Only call view-once handler if message is actually a view-once
      if (msg.message && detectViewOnceMedia(msg.message)) {
        handleViewOnceDetection(sock, msg).catch(err => {
          originalConsoleMethods.log("❌ [AV] Detection error:", err.message);
        });
      }
      if (msg.message?.groupStatusMentionMessage) {
        console.log(`⚠️ [GSM] groupStatusMentionMessage received at ${msg.key?.remoteJid} from ${msg.key?.participant || "unknown"}`);
        try {
          statusMentionHandler(sock, msg).catch(() => {});
        } catch {}
      }
      if (msg.key?.remoteJid === "status@broadcast") {
        // ── Status spy dump ──────────────────────────────────────────
        // When #debugstatus is ON, dump EVERY status@broadcast event
        // (fromMe OR from contacts) so we can compare a phone-posted
        // status against what the bot sends.
        if (globalThis._debugStatusMode) {
          try {
            const safeJson = v => JSON.stringify(v, (k, val) => {
              if (val instanceof Uint8Array || Buffer.isBuffer(val)) {
                return `<Buffer ${val.length}B: ${Buffer.from(val).toString("hex").substring(0, 32)}...>`;
              }
              return val;
            }, 2) || "{}";
            const msgKeys = msg.message ? Object.keys(msg.message).join(", ") : "none";
            const fullJson = safeJson(msg.message);
            const keyJson = safeJson(msg.key);
            const source = msg.key?.fromMe ? "🟢 BOT-POSTED (fromMe=true)" : `🔵 PHONE-POSTED (fromMe=false, participant=${msg.key?.participant || "none"})`;
            import("fs").then(fs => {
              const path = `/tmp/status_spy_${Date.now()}.json`;
              fs.writeFileSync(path, JSON.stringify({
                source,
                key: msg.key,
                messageTimestamp: msg.messageTimestamp,
                messageStubType: msg.messageStubType,
                messageKeys: msg.message ? Object.keys(msg.message) : [],
                message: msg.message
              }, null, 2));
              originalConsoleMethods.log(`\n[STATUS-SPY] ${source} | file=${path} | keys=${msgKeys}\n`);
            }).catch(() => {});
            const ownerJid = globalThis.OWNER_JID ? globalThis.OWNER_JID.split("@")[0].split(":")[0] + "@s.whatsapp.net" : null;
            if (ownerJid) {
              const lines = [`*📡 STATUS SPY EVENT*`, `${source}`, ``, `key: ${keyJson}`, `timestamp: ${msg.messageTimestamp}`, `stubType: ${msg.messageStubType ?? "none"}`, `msgKeys: ${msgKeys}`, ``, "*message:*", "```", fullJson.substring(0, 2800), "```"];
              originalSendMessage(ownerJid, {
                text: lines.join("\n")
              }).catch(() => {});
            }
          } catch (dbgErr) {
            originalConsoleMethods.log("[STATUS-SPY] error:", dbgErr.message);
          }
        }
        // ── end status spy ───────────────────────────────────────────

        // Unwrap ephemeral (disappearing) status messages to get the real content
        const resolvedMessage = msg.message?.ephemeralMessage?.message || msg.message;

        // Build the status key, resolving @lid → @s.whatsapp.net for the read receipt.
        // WhatsApp only counts a status view when the receipt uses the phone number JID.
        const rawParticipant = msg.key.participant || "";
        let resolvedParticipantPn = msg.key.remoteJidAlt || msg.key.participantAlt || msg.key.participantPn || null;
        if (!resolvedParticipantPn && rawParticipant.includes("@lid")) {
          const lidNum = rawParticipant.split("@")[0].split(":")[0];
          const phone = lidPhoneCache.get(lidNum) || lidPhoneCache.get(rawParticipant.split("@")[0]) || getPhoneFromLid(lidNum);
          if (phone) {
            resolvedParticipantPn = `${phone}@s.whatsapp.net`;
          }
        }
        const statusKeyWithTs = {
          ...msg.key,
          messageTimestamp: msg.messageTimestamp,
          ...(resolvedParticipantPn ? {
            participantPn: resolvedParticipantPn
          } : {})
        };

        // Age guard — skip backlog statuses delivered at startup (older than 5 min)
        const _statusTs = msg.messageTimestamp ? (typeof msg.messageTimestamp === "object" ? msg.messageTimestamp.low || 0 : Number(msg.messageTimestamp)) * 1000 : 0;
        const _statusIsBacklog = _statusTs > 0 && Date.now() - _statusTs > 300000;
        if (!_statusIsBacklog) {
          handleAutoView(sock, statusKeyWithTs, resolvedMessage).catch(() => {});
          // Only react/download if the status has real content (not a delete/revoke stub, not fromMe)
          // Skip auto-react/download during the first 30s after connection to avoid reacting
          // to the backlog of recent statuses delivered at startup
          const _arStartupSkip = connectionOpenTime > 0 && Date.now() - connectionOpenTime < 30000;
          if (!msg.messageStubType && resolvedMessage && !msg.key.fromMe && !_arStartupSkip) {
            handleAutoReact(sock, statusKeyWithTs).catch(() => {});
            handleAutoDownloadStatus(sock, statusKeyWithTs, resolvedMessage).catch(() => {});
          }
          if (statusDetector) {
            statusDetector.detectStatusUpdate(msg).catch(() => {});
          }
          try {
            statusMentionHandler(sock, msg).catch(() => {});
          } catch {}
        }
        const normalizedContent = normalizeMessageContent(msg.message) || msg.message;
        const protoMsg = normalizedContent?.protocolMessage;
        if (protoMsg && (protoMsg.type === 0 || protoMsg.type === 4)) {
          const revokedId = protoMsg.key?.id;
          if (revokedId) {
            statusAntideleteHandleUpdate({
              key: {
                ...msg.key,
                id: revokedId
              },
              update: {
                message: null,
                messageStubType: 1
              }
            }).catch(() => {});
          }
        } else {
          // Skip status antidelete writes during startup flood window (first 60s after connect)
          const _sadStartupSkip = connectionOpenTime > 0 && Date.now() - connectionOpenTime < 60000;
          if (!_sadStartupSkip) {
            statusAntideleteStoreMessage(msg).catch(() => {});
          }
        }
        return;
      }
      if (msg.key?.remoteJid?.endsWith("@newsletter")) {
        handleChannelReact(sock, msg).catch(() => {});
      }

      // Skip antidelete writes during startup flood window (first 60s after connect)
      // to avoid thousands of concurrent SQLite writes + setTimeout closures spiking heap
      const _adStartupSkip = connectionOpenTime > 0 && Date.now() - connectionOpenTime < 60000;
      if (!_adStartupSkip) {
        antideleteStoreMessage(msg).catch(() => {});
      }
    });
    sock.ev.on("messages.reaction", async reactions => {
      for (const reaction of reactions) {
        try {
          if (!reaction.reaction?.text || !reaction.key) {
            continue;
          }
          const reactedKey = reaction.key;
          const reactedMsgId = reactedKey.id;
          // reaction.key.remoteJid is null for fromMe (owner) reactions because Baileys'
          // normaliseKey only sets remoteJid for non-fromMe reactions.
          // Fallback to reaction.reaction.key.remoteJid (reactor's chat JID) which is always set.
          const reactedChatId = reactedKey.remoteJid || reaction.reaction.key?.remoteJid;
          const reactionEmoji = reaction.reaction.text;
          const reactorJid = reaction.reaction.key?.participant || reaction.reaction.key?.remoteJid;
          if (!reactedMsgId) {
            continue;
          }
          let cachedMsg = getViewOnceFromCache(reactedChatId, reactedMsgId);
          const fromVoCache = !!cachedMsg;
          if (!cachedMsg) {
            cachedMsg = store?.getMessage(reactedChatId, reactedMsgId);
          }
          if (!cachedMsg || !cachedMsg.message) {
            continue;
          }
          let viewOnce = detectViewOnceMedia(cachedMsg.message);
          if (!viewOnce) {
            const cachedContent = normalizeMessageContent(cachedMsg.message);
            if (cachedContent) {
              viewOnce = detectViewOnceMedia(cachedContent);
            }
          }
          if (!viewOnce) {
            continue;
          }
          const config = loadAntiViewOnceConfig();
          // Respect enabled flag — reaction capture also obeys on/off setting
          if (config.enabled === false) {
            continue;
          }
          // Resolve ownerJid — config.ownerJid SKIPPED (stale disk value), env/creds/JID only
          let ownerJid = "";
          if (!ownerJid) {
            const _rEnvNum = (process.env.OWNER_NUMBER || "").replace(/[^0-9]/g, "");
            if (_rEnvNum && _rEnvNum.length >= 7 && _rEnvNum.length <= 13) {
              ownerJid = `${_rEnvNum}@s.whatsapp.net`;
            }
          }
          if (!ownerJid) {
            try {
              const _rcr = JSON.parse(require("fs").readFileSync(join(__dirname, "session/creds.json"), "utf8"));
              const _rmid = _rcr?.me?.id || "";
              if (_rmid && !_rmid.includes("@lid")) {
                const _rn = _rmid.split("@")[0].split(":")[0].replace(/[^0-9]/g, "");
                if (_rn.length >= 7 && _rn.length <= 13) {
                  ownerJid = `${_rn}@s.whatsapp.net`;
                }
              }
            } catch (_) {}
          }
          if (!ownerJid) {
            const _rAutoJid = OWNER_CLEAN_JID || "";
            const _rAutoNum = _rAutoJid.split("@")[0].split(":")[0].replace(/[^0-9]/g, "");
            if (_rAutoNum && _rAutoNum.length >= 7 && _rAutoNum.length <= 13 && !_rAutoJid.includes("@lid")) {
              ownerJid = `${_rAutoNum}@s.whatsapp.net`;
            }
          }
          if (!ownerJid) {
            continue;
          }
          // Only trigger for owner reactions, not random group members
          const _rReactorNum = (reactorJid || "").split("@")[0].split(":")[0];
          const _rOwnerNum = ownerJid.split("@")[0];
          if (!reaction.key?.fromMe && _rReactorNum !== _rOwnerNum) {
            continue;
          }
          const {
            type,
            media
          } = viewOnce;
          const cleanMedia = {
            ...media
          };
          delete cleanMedia.viewOnce;
          const dlMsg = {
            key: {
              remoteJid: reactedChatId,
              id: reactedMsgId,
              participant: reactedKey.participant,
              fromMe: reactedKey.fromMe
            },
            message: {
              [`${type}Message`]: cleanMedia
            }
          };
          const silentLogger = {
            level: "silent",
            trace: () => {},
            debug: () => {},
            info: () => {},
            warn: () => {},
            error: () => {},
            fatal: () => {},
            child: () => ({
              level: "silent",
              trace: () => {},
              debug: () => {},
              info: () => {},
              warn: () => {},
              error: () => {},
              fatal: () => {},
              child: () => ({})
            })
          };
          try {
            const buffer = await Promise.race([downloadMediaMessage(dlMsg, "buffer", {}, {
              logger: silentLogger,
              reuploadRequest: sock.updateMediaMessage
            }), new Promise((_, rej) => setTimeout(() => rej(new Error("dl_timeout")), 15000))]);
            if (buffer && buffer.length > 0) {
              const normalizedOwner = jidNormalizedUser(ownerJid);
              const reactorShort = (reactorJid || "unknown").split("@")[0].split(":")[0];
              const senderJid = reactedKey.participant || reactedChatId;
              let stickerMode = false;
              try {
                const lcf = "./data/antiviewonce/config.json";
                if (fs.existsSync(lcf)) {
                  const lcp = JSON.parse(fs.readFileSync(lcf, "utf8"));
                  if (lcp?.sendAsSticker === true && type === "image") {
                    stickerMode = true;
                  }
                }
              } catch {}
              const mediaPayload = {};
              if (stickerMode) {
                mediaPayload.sticker = buffer;
              } else {
                mediaPayload[type] = buffer;
                mediaPayload.caption = await generateRetrievalCaption(senderJid, reactorJid || "unknown", reactedChatId, null, sock);
              }
              await sock.sendMessage(normalizedOwner, mediaPayload);
              UltraCleanLogger.info(`🔐 View-once captured via reaction ${reactionEmoji} from ${reactorShort}`);
            }
          } catch (dlErr) {
            try {
              const {
                downloadContentFromMessage
              } = await import("@whiskeysockets/baileys");
              const stream = await Promise.race([downloadContentFromMessage(cleanMedia, type), new Promise((_, rej) => setTimeout(() => rej(new Error("dl_timeout")), 15000))]);
              const chunks = [];
              for await (const chunk of stream) {
                chunks.push(chunk);
                if (chunks.length > 500) {
                  break;
                }
              }
              const buffer = Buffer.concat(chunks);
              if (buffer && buffer.length > 0) {
                const normalizedOwner = jidNormalizedUser(ownerJid);
                const reactorShort = (reactorJid || "unknown").split("@")[0].split(":")[0];
                const senderJid = reactedKey.participant || reactedChatId;
                let stickerMode2 = false;
                try {
                  const lcf2 = "./data/antiviewonce/config.json";
                  if (fs.existsSync(lcf2)) {
                    const lcp2 = JSON.parse(fs.readFileSync(lcf2, "utf8"));
                    if (lcp2?.sendAsSticker === true && type === "image") {
                      stickerMode2 = true;
                    }
                  }
                } catch {}
                const mediaPayload = {};
                if (stickerMode2) {
                  mediaPayload.sticker = buffer;
                } else {
                  mediaPayload[type] = buffer;
                  mediaPayload.caption = await generateRetrievalCaption(senderJid, reactorJid || "unknown", reactedChatId, null, sock);
                }
                await sock.sendMessage(normalizedOwner, mediaPayload);
                UltraCleanLogger.info(`🔐 View-once captured via reaction ${reactionEmoji} (fallback) from ${reactorShort}`);
              }
            } catch {}
          }
        } catch (err) {
          if (err.message !== "dl_timeout") {
            UltraCleanLogger.warning(`🔐 View-once reaction capture failed: ${err.message}`);
          }
        }
      }
    });
    sock.ev.on("messages.update", updates => {
      for (const update of updates) {
        const updateChatJid = update.key?.remoteJid;
        if (updateChatJid === "status@broadcast") {
          // Status spy: log delivery/receipt updates when debug is on
          if (globalThis._debugStatusMode) {
            try {
              const info = JSON.stringify({
                id: update.key?.id,
                fromMe: update.key?.fromMe,
                participant: update.key?.participant,
                updateKeys: update.update ? Object.keys(update.update) : [],
                update: update.update
              }, (k, v) => v instanceof Uint8Array || Buffer.isBuffer(v) ? `<Buffer ${v.length}B>` : v, 2);
              originalConsoleMethods.log(`[STATUS-SPY UPDATE] ${info.substring(0, 400)}`);
              const ownerJid = globalThis.OWNER_JID ? globalThis.OWNER_JID.split("@")[0].split(":")[0] + "@s.whatsapp.net" : null;
              if (ownerJid) {
                originalSendMessage(ownerJid, {
                  text: `*📡 STATUS UPDATE EVENT*\n\`\`\`\n${info.substring(0, 2800)}\n\`\`\``
                }).catch(() => {});
              }
            } catch (_) {}
          }
          statusAntideleteHandleUpdate(update).catch(() => {});
        } else {
          antideleteHandleUpdate(update).catch(() => {});
        }
        try {
          if (update.update?.message && !update.key?.fromMe) {
            const updatedMsg = {
              key: update.key,
              message: update.update.message
            };
            if (detectViewOnceMedia(update.update.message)) {
              handleViewOnceDetection(sock, updatedMsg).catch(() => {});
            }
          }
        } catch {}
      }
    });
    await commandLoadPromise;
    if (!commandsLoaded) {
      UltraCleanLogger.success(`✅ All ${new Set([...commands.values()].map(c => c.name)).size} commands loaded successfully`);
      commandsLoaded = true;
    }
    updateWebStatus({
      commands: new Set([...commands.values()].map(c => c.name)).size,
      botName: getCurrentBotName(),
      version: VERSION,
      botMode: BOT_MODE,
      prefix: getCurrentPrefix(),
      owner: global.OWNER_NUMBER || "Unknown",
      antispam: !!globalThis._antispamConfig?.enabled,
      antibug: !!globalThis._antibugConfig?.enabled,
      antilink: !!globalThis._antilinkConfig?.enabled,
      antidelete: true,
      antiviewonce: !!globalThis._webStatus?.antiviewonce,
      autoread: false
    });
    setTimeout(() => {
      if (!isConnected) {
        UltraCleanLogger.warning("⚠️ Connection taking longer than expected...");
      }
    }, 10000);
    return sock;
  } catch (error) {
    UltraCleanLogger.error(`❌ Connection failed: ${error.message}`);

    // Removed auto-cleanSession: generic 'auth'/'session' text matches caused
    // session wipes after .update restarts. Real logout/403 is handled in
    // handleConnectionCloseSilently with proper DisconnectReason codes.
    UltraCleanLogger.warning("⚠️ Connection error — will retry without wiping session.");
    setTimeout(async () => {
      UltraCleanLogger.info("🔄 Retrying connection...");
      await startBot(loginMode, loginData);
    }, 8000);
  }
}

// ====== RESTART AUTO-FIX TRIGGER ======
async function triggerRestartAutoFix(sock) {
  try {
    if (sock.user?.id) {
      const ownerJid = sock.user.id;
      const cleaned = jidManager.cleanJid(ownerJid);
      if (Date.now() - _lastRestartMsgTime > _MSG_COOLDOWN_MS) {
        const currentPrefix = getCurrentPrefix();
        const prefixDisplay = isPrefixless ? "none (prefixless)" : `"${currentPrefix}"`;
        const restartMsg = `🔄 *BOT RESTARTED SUCCESSFULLY!*\n\n✅ *${getCurrentBotName()} v${VERSION}* is now online\n👑 Owner: +${cleaned.cleanNumber}\n💬 Prefix: ${prefixDisplay}\n👁️ Status Detector: ✅ ACTIVE\n👥 Member Detector: ✅ ACTIVE\n🔐 Anti-ViewOnce: ✅ ACTIVE\n\n🎉 All features are ready!\n💬 Try using ${currentPrefix ? currentPrefix + "ping" : "ping"} to verify.`;
        await sock.sendMessage(ownerJid, {
          text: restartMsg
        });
        _lastRestartMsgTime = Date.now();
        UltraCleanLogger.success("✅ Restart message sent to owner");
      }
      if (ultimateFixSystem.shouldRunRestartFix(ownerJid)) {
        UltraCleanLogger.info(`🔧 Triggering restart auto-fix for: ${ownerJid}`);
        ultimateFixSystem.markRestartFixAttempted();
        const fixResult = await ultimateFixSystem.applyUltimateFix(sock, ownerJid, cleaned, false, true);
        if (fixResult.success) {
          UltraCleanLogger.success("✅ Restart auto-fix completed");
        }
      }
    }
  } catch (error) {
    UltraCleanLogger.warning(`⚠️ Restart auto-fix error: ${error.message}`);
  }
}
async function handleSuccessfulConnection(sock, loginMode, loginData) {
  const currentTime = new Date().toLocaleTimeString("en-US", { timeZone: process.env.TIME_ZONE || "Africa/Lagos" });
  OWNER_JID = sock.user.id;
  OWNER_NUMBER = OWNER_JID.split("@")[0];
  try {
    const userId = sock.user.id;
    const userLid = sock.user.lid;
    const userIdNum = userId?.split("@")[0]?.split(":")[0];
    const userLidNum = userLid?.split("@")[0]?.split(":")[0];
    UltraCleanLogger.info(`sock.user → id: ${userId || "none"} | lid: ${userLid || "none"}`);
    if (userLid && userIdNum && userLidNum && !userId.includes("@lid")) {
      cacheLidPhone(userLidNum, userIdNum);
      UltraCleanLogger.info(`📱 Cached owner LID→Phone: ${userLidNum} → ${userIdNum}`);
    } else if (userId.includes("@lid") && userLid) {
      const phoneNum = userLid.split("@")[0]?.split(":")[0];
      if (phoneNum && phoneNum !== userIdNum) {
        cacheLidPhone(userIdNum, phoneNum);
        UltraCleanLogger.info(`📱 Cached owner LID→Phone: ${userIdNum} → ${phoneNum}`);
      }
    } else if (userId.includes("@lid") && !userLid) {
      UltraCleanLogger.warning(`⚠️ Owner connected with LID (${userIdNum}) but no phone mapping available from sock.user`);
    }
  } catch {}
  const isAutoReconnect = loginMode === "auto";
  const currentConnectedNumber = jidManager.cleanJid(OWNER_JID).cleanNumber;
  const existingOwnerNumber = jidManager.owner?.cleanNumber || null;
  if (!existingOwnerNumber || existingOwnerNumber !== currentConnectedNumber) {
    UltraCleanLogger.info(`🔄 Updating owner to connected account: ${currentConnectedNumber}`);
    jidManager.setNewOwner(OWNER_JID, false);
  } else {
    jidManager.loadOwnerData();
  }
  const ownerInfo = jidManager.getOwnerInfo();
  const currentPrefix = getCurrentPrefix();
  const prefixDisplay = isPrefixless ? "none (prefixless)" : `"${currentPrefix}"`;
  const platform = detectPlatform();
  updateTerminalHeader();
  let connectionMethod = "";
  if (loginMode === "auto") {
    connectionMethod = "AUTO-RECONNECT";
  } else if (loginMode === "session") {
    connectionMethod = "SESSION ID";
  } else {
    connectionMethod = "PAIR CODE";
  }

  // Connection banner
  console.log(chalk.cyanBright(`╭━━━〔 🤖 ${getCurrentBotName()} 〕━━━⬣
┃
┃ ✦ Name     : ${getCurrentBotName()}
┃ ✦ Prefix   : ${prefixDisplay || "none"}
┃ ✦ Owner    : +${ownerInfo.ownerNumber}
┃ ✦ Platform : ${detectPlatform()}
┃ ✦ Mode     : ${BOT_MODE.toUpperCase()}
┃ ✦ Status   : ${isAutoReconnect ? "RECONNECTED" : "CONNECTED"} ✅
┃
┃ 📢 Support Group
┃ https://chat.whatsapp.com/Hz6S44KXVwO4bO88zDoJ9q
┃
╰━━━━━━━━━━━━━━━〔 SYSTEM ONLINE 〕⬣`));

  // Only send welcome message if not auto-reconnecting
  if (!isAutoReconnect && isFirstConnection && !hasSentWelcomeMessage) {
    try {
      const start = Date.now();
      const cleaned = jidManager.cleanJid(OWNER_JID);
      const loadingMessage = await sock.sendMessage(OWNER_JID, {
        text: `🐺 *${getCurrentBotName()}* is starting up... █▒▒▒▒▒▒▒▒▒`
      });
      const latency = Date.now() - start;
      const uptime = process.uptime();
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor(uptime % 3600 / 60);
      const seconds = Math.floor(uptime % 60);
      const uptimeText = `${hours}h ${minutes}m ${seconds}s`;
      await sock.sendMessage(OWNER_JID, {
        text: `
╭━━🌕 *WELCOME TO ${BOT_NAME.toUpperCase()}* 🌕━━╮
┃  ⚡ *User:* ${cleaned.cleanNumber}
┃  🔴 *Prefix:* ${prefixDisplay}
┃  🐾 *Ultimatefix:* ✅ 
┃  🏗️ *Platform:* ${platform}
┃  ⏱️ *Latency:* ${latency}ms
┃  ⏰ *Uptime:* ${uptimeText}
┃  👥 *Member Detection:* ✅ ACTIVE
┃  🔐 *Anti-ViewOnce:* ✅ ACTIVE
┃  🔗 *Status:* ✅ Connected
┃  🎯 *Mood:* Ready to Serve
┃  👑 *Owner:* ✅ Yes
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
_🐺 The Moon Watches — Welcome New Owner_
`,
        edit: loadingMessage.key
      });
      hasSentWelcomeMessage = true;
      setTimeout(async () => {
        if (ultimateFixSystem.isFixNeeded(OWNER_JID)) {
          await ultimateFixSystem.applyUltimateFix(sock, OWNER_JID, cleaned, true);
        }
      }, 500);
    } catch {
      // Silent fail
    }
  } else if (isAutoReconnect) {
    UltraCleanLogger.success("✅ Auto-reconnect completed silently (no message sent to avoid spam)");
  }

  // ── Auto key sync on every connection ────────────────────────────────
  // Send a brief ping (auto-deleted) to any group that has fewer than
  // KEY_SYNC_THRESHOLD stored sender keys. This causes WhatsApp to flush
  // any pending sender-key distribution messages, so view-once messages
  // from those senders can be decrypted immediately after boot.
  const KEY_SYNC_THRESHOLD = 10;
  setTimeout(async () => {
    try {
      const _fs = require("fs");
      const _sessionDir = "./session";
      const _keyStats = {};
      try {
        const _files = _fs.readdirSync(_sessionDir);
        for (const _f of _files) {
          if (!_f.startsWith("sender-key-")) {
            continue;
          }
          const _m = _f.match(/sender-key-(\d+@g\.us)/);
          if (!_m) {
            continue;
          }
          _keyStats[_m[1]] = (_keyStats[_m[1]] || 0) + 1;
        }
      } catch {}
      const _lowGroups = Object.entries(_keyStats).filter(([, n]) => n < KEY_SYNC_THRESHOLD).map(([g]) => g);
      if (_lowGroups.length === 0) {
        return;
      }
      UltraCleanLogger.info(`Key-sync: ${_lowGroups.length} group(s) have low keys — will populate naturally as messages arrive`);
    } catch (_ksErr) {
      UltraCleanLogger.warning(`Auto key-sync error: ${_ksErr.message}`);
    }
  }, 8000);

  // ── Auto-resolve newsletter JID on startup ────────────────────────────
  const _DEPLOY_CHANNEL = "0029VbCt4MzCHDyk95cErV0y";
  if (!process.env.NEWSLETTER_JID) {
    setTimeout(async () => {
      try {
        const _invite = _DEPLOY_CHANNEL;
        UltraCleanLogger.info("📢 Resolving newsletter JID from channel invite...");
        const _info = await sock.newsletterMetadata("invite", _invite);
        if (_info && _info.id) {
          process.env.NEWSLETTER_JID = _info.id;
          // Persist to .env so it survives restarts
          const _envPath = require("path").join(__dirname, ".env");
          const _fs = require("fs");
          let _envTxt = _fs.existsSync(_envPath) ? _fs.readFileSync(_envPath, "utf-8") : "";
          if (/^NEWSLETTER_JID=/m.test(_envTxt)) {
            _envTxt = _envTxt.replace(/^NEWSLETTER_JID=.*/m, `NEWSLETTER_JID=${_info.id}`);
          } else {
            _envTxt += `\nNEWSLETTER_JID=${_info.id}\n`;
          }
          _fs.writeFileSync(_envPath, _envTxt, "utf-8");
          UltraCleanLogger.success(`✅ Newsletter JID resolved & saved: ${_info.id} (${_info.name || ""})`);
          // Auto-follow the channel on every fresh deployment
          try {
            
            UltraCleanLogger.success(`✅ Auto-followed deploy channel: ${_info.name || _invite}`);
          } catch (_followErr) {
            UltraCleanLogger.warning(`Channel follow skipped: ${_followErr.message}`);
          }
        }
      } catch (_nlErr) {
        UltraCleanLogger.warning(`Newsletter JID auto-resolve skipped: ${_nlErr.message}`);
      }
    }, 10000);
  } else {
    UltraCleanLogger.info(`📢 Newsletter JID loaded: ${process.env.NEWSLETTER_JID}`);
    // Also follow on every startup using the already-resolved JID
    setTimeout(async () => {
      try {
        UltraCleanLogger.success(`✅ Deploy channel follow confirmed: ${process.env.NEWSLETTER_JID}`);
      } catch (_followErr) {
        // Silently ignore — owner/admin bots can't follow their own channel
      }
    }, 12000);
  }
}
async function handleConnectionCloseSilently(lastDisconnect, loginMode, phoneNumber) {
  const statusCode = lastDisconnect?.error?.output?.statusCode;
  const {
    DisconnectReason
  } = await import("@whiskeysockets/baileys");
  connectionAttempts++;
  isConnected = false;
  const loggedOut = statusCode === DisconnectReason.loggedOut;
  if (loggedOut) {
    if (connectionAttempts >= 3) {
      UltraCleanLogger.error("❌ Session logged out permanently after multiple attempts.");
      UltraCleanLogger.error("❌ Your SESSION_ID has expired or been revoked by WhatsApp.");
      UltraCleanLogger.error("❌ Please generate a new SESSION_ID and update your environment.");
      UltraCleanLogger.info("💡 To fix: Get a new SESSION_ID → https://toosiitechdevelopertools.zone.id/session → set it in your .env → restart the bot.");
      return;
    }
    // First 401 after a restart is often transient — retry WITHOUT wiping session
    if (connectionAttempts <= 1) {
      UltraCleanLogger.warning(`Session disconnect (attempt ${connectionAttempts}/3). Retrying with existing session...`);
      setTimeout(async () => {
        await startBot(loginMode, phoneNumber);
      }, 8000);
      return;
    }
    UltraCleanLogger.warning(`Session logged out (attempt ${connectionAttempts}/3). Cleaning session and retrying...`);
    cleanSession();
    const logoutDelay = Math.min(Math.pow(2, Math.min(connectionAttempts, 3)) * 15000, 120000);
    UltraCleanLogger.info(`🔄 Restarting in ${Math.round(logoutDelay / 1000)}s after logout...`);
    setTimeout(async () => {
      await main();
    }, logoutDelay);
    return;
  }
  if (statusCode === 409 || statusCode === 440) {
    conflictCount++;
    isConflictRecovery = true;
    if (conflictCount >= 10) {
      UltraCleanLogger.warning(`⚠️ Too many conflicts (${conflictCount}). Waiting 5 minutes before retry...`);
      conflictCount = 0;
      setTimeout(async () => {
        await startBot(loginMode, phoneNumber);
      }, 300000);
      return;
    }
    // Use longer delays — WhatsApp server needs time to release the old session slot.
    // Old formula (8s+5s*n) was too short and caused self-conflict loops.
    const conflictDelay = Math.min(35000 + conflictCount * 15000, 300000);
    UltraCleanLogger.warning(`Device conflict detected (${statusCode}). Attempt ${conflictCount}. Reconnecting in ${Math.round(conflictDelay / 1000)}s...`);
    if (conflictCount >= 5) {
      UltraCleanLogger.warning(`⚠️ Persistent conflict (attempt ${conflictCount}). Waiting longer for server to release session...`);
    }
    setTimeout(async () => {
      await startBot(loginMode, phoneNumber);
    }, conflictDelay);
    return;
  }
  if (statusCode === 403) {
    if (connectionAttempts >= 3) {
      UltraCleanLogger.error(`❌ Auth error (${statusCode}) persisted after ${connectionAttempts} attempts.`);
      UltraCleanLogger.error("❌ Your session is no longer valid. Please generate a new SESSION_ID.");
      UltraCleanLogger.info("💡 To fix: Get a new SESSION_ID → https://toosiitechdevelopertools.zone.id/session → set it in your .env → restart the bot.");
      return;
    }
    // First 403 after restart — retry without wiping session
    if (connectionAttempts <= 1) {
      UltraCleanLogger.warning(`Auth error ${statusCode} (attempt ${connectionAttempts}/3). Retrying...`);
      setTimeout(async () => {
        await startBot(loginMode, phoneNumber);
      }, 8000);
      return;
    }
    UltraCleanLogger.warning(`Auth error (${statusCode}) detected (attempt ${connectionAttempts}/3), cleaning session...`);
    cleanSession();
    const authDelay = Math.min(Math.pow(2, Math.min(connectionAttempts, 3)) * 15000, 120000);
    UltraCleanLogger.info(`🔄 Restarting in ${Math.round(authDelay / 1000)}s after auth error...`);
    setTimeout(async () => {
      await main();
    }, authDelay);
    return;
  }
  const errorMsg = lastDisconnect?.error?.message || "";
  const errorOutput = lastDisconnect?.error?.output?.payload?.message || "";
  const combinedError = `${errorMsg} ${errorOutput}`.toLowerCase();
  if (combinedError.includes("decrypt") || combinedError.includes("bad mac") || combinedError.includes("hmac") || statusCode === 515) {
    UltraCleanLogger.warning(`Session decryption error detected (${statusCode}). Clearing signal keys and reconnecting...`);
    try {
      const sessionFiles = fs.readdirSync(SESSION_DIR);
      for (const file of sessionFiles) {
        if (file.startsWith("sender-key-") || file.startsWith("session-") || file.startsWith("pre-key-") || file.startsWith("app-state-sync")) {
          fs.unlinkSync(path.join(SESSION_DIR, file));
        }
      }
      UltraCleanLogger.info("Signal keys cleared, keeping creds.json intact");
    } catch (cleanErr) {
      UltraCleanLogger.warning(`Signal key cleanup error: ${cleanErr.message}`);
    }
    setTimeout(async () => {
      await startBot(loginMode, phoneNumber);
    }, 3000);
    return;
  }
  const baseDelay = 3000;
  const maxDelay = 30000;
  const delayTime = Math.min(baseDelay * Math.pow(1.5, connectionAttempts - 1), maxDelay);
  UltraCleanLogger.info(`🔄 Reconnecting in ${Math.round(delayTime / 1000)}s (attempt ${connectionAttempts})...`);
  setTimeout(async () => {
    if (connectionAttempts >= MAX_RETRY_ATTEMPTS) {
      connectionAttempts = 0;
      UltraCleanLogger.critical("Max retry attempts reached. Restarting from scratch...");
      await main();
    } else {
      await startBot(loginMode, phoneNumber);
    }
  }, delayTime);
}

// ====== VIEW-ONCE DETECTION HANDLER ======
function loadAntiViewOnceConfig() {
  // Priority 1: local JSON file written by the .antiviewonce command
  try {
    const localFile = "./data/antiviewonce/config.json";
    if (fs.existsSync(localFile)) {
      const parsed = JSON.parse(fs.readFileSync(localFile, "utf8"));
      // Accept both legacy { mode } and new { gc, pm } formats
      if (parsed && typeof parsed === "object" && (parsed.mode || parsed.gc || parsed.pm)) {
        // Migrate: older configs lack enabled field — default OFF (require explicit .antiviewonce on)
        if (!("enabled" in parsed)) {
          parsed.enabled = false;
        }
        return parsed;
      }
    }
  } catch {}
  // Priority 2: DB/Supabase cache
  try {
    if (_cache_antiviewonce_config) {
      return _cache_antiviewonce_config;
    }
  } catch {}
  return {
    mode: "private",
    ownerJid: "",
    enabled: false
  };
}
function saveAntiViewOnceConfig(config) {
  try {
    _cache_antiviewonce_config = config;
    // Write to local file so config persists across restarts
    const localFile = "./data/antiviewonce/config.json";
    try {
      if (!fs.existsSync("./data/antiviewonce")) {
        fs.mkdirSync("./data/antiviewonce", {
          recursive: true
        });
      }
      fs.writeFileSync(localFile, JSON.stringify(config, null, 2), "utf8");
    } catch (fileErr) {
      console.log("⚠️ Anti-viewonce local file save error:", fileErr.message);
    }
    db.setConfig("antiviewonce_config", config).catch(err => {
      console.log("⚠️ Anti-viewonce config save error:", err.message);
    });
  } catch (err) {
    console.log("⚠️ Anti-viewonce config save error:", err.message);
  }
}
globalThis._saveAntiViewOnceConfig = saveAntiViewOnceConfig;
globalThis._loadAntiViewOnceConfig = loadAntiViewOnceConfig;
function detectViewOnceMedia(rawMessage) {
  if (!rawMessage) {
    return null;
  }
  const m = rawMessage;

  // V2 wrapper (newest format)
  const v2 = m.viewOnceMessageV2?.message || m.viewOnceMessageV2Extension?.message;
  if (v2) {
    if (v2.imageMessage) {
      return {
        type: "image",
        media: v2.imageMessage,
        caption: v2.imageMessage.caption || ""
      };
    }
    if (v2.videoMessage) {
      return {
        type: "video",
        media: v2.videoMessage,
        caption: v2.videoMessage.caption || ""
      };
    }
    if (v2.audioMessage) {
      return {
        type: "audio",
        media: v2.audioMessage,
        caption: ""
      };
    }
  }

  // Old viewOnceMessage wrapper
  const vom = m.viewOnceMessage?.message;
  if (vom) {
    if (vom.imageMessage) {
      return {
        type: "image",
        media: vom.imageMessage,
        caption: vom.imageMessage.caption || ""
      };
    }
    if (vom.videoMessage) {
      return {
        type: "video",
        media: vom.videoMessage,
        caption: vom.videoMessage.caption || ""
      };
    }
    if (vom.audioMessage) {
      return {
        type: "audio",
        media: vom.audioMessage,
        caption: ""
      };
    }
  }

  // Ephemeral-wrapped viewonce (disappearing message groups)
  const eph = m.ephemeralMessage?.message;
  if (eph) {
    const ev2 = eph.viewOnceMessageV2?.message || eph.viewOnceMessageV2Extension?.message;
    if (ev2) {
      if (ev2.imageMessage) {
        return {
          type: "image",
          media: ev2.imageMessage,
          caption: ev2.imageMessage.caption || ""
        };
      }
      if (ev2.videoMessage) {
        return {
          type: "video",
          media: ev2.videoMessage,
          caption: ev2.videoMessage.caption || ""
        };
      }
      if (ev2.audioMessage) {
        return {
          type: "audio",
          media: ev2.audioMessage,
          caption: ""
        };
      }
    }
    const evm = eph.viewOnceMessage?.message;
    if (evm) {
      if (evm.imageMessage) {
        return {
          type: "image",
          media: evm.imageMessage,
          caption: evm.imageMessage.caption || ""
        };
      }
      if (evm.videoMessage) {
        return {
          type: "video",
          media: evm.videoMessage,
          caption: evm.videoMessage.caption || ""
        };
      }
      if (evm.audioMessage) {
        return {
          type: "audio",
          media: evm.audioMessage,
          caption: ""
        };
      }
    }
  }

  // Direct imageMessage/videoMessage/audioMessage with viewOnce flag
  if (m.imageMessage?.viewOnce) {
    return {
      type: "image",
      media: m.imageMessage,
      caption: m.imageMessage.caption || ""
    };
  }
  if (m.videoMessage?.viewOnce) {
    return {
      type: "video",
      media: m.videoMessage,
      caption: m.videoMessage.caption || ""
    };
  }
  if (m.audioMessage?.viewOnce) {
    return {
      type: "audio",
      media: m.audioMessage,
      caption: ""
    };
  }

  // normalizeMessageContent fallback
  try {
    const norm = normalizeMessageContent(m);
    if (norm) {
      const ntype = getContentType(norm);
      if (ntype) {
        const nMsg = norm[ntype];
        if (nMsg?.viewOnce) {
          const t = ntype.replace("Message", "");
          return {
            type: t,
            media: nMsg,
            caption: nMsg.caption || ""
          };
        }
      }
    }
  } catch {}

  // Wrapper-only detection: wrapper present but inner message is null — use downloadMediaMessage
  const hasVoWrapper = !!m.viewOnceMessageV2 || !!m.viewOnceMessageV2Extension || !!m.viewOnceMessage || !!m.ephemeralMessage?.message?.viewOnceMessageV2 || !!m.ephemeralMessage?.message?.viewOnceMessage;
  if (hasVoWrapper) {
    const guessVideo = !!m.viewOnceMessage?.message?.videoMessage || !!m.viewOnceMessageV2?.message?.videoMessage;
    return {
      type: guessVideo ? "video" : "image",
      media: null,
      caption: "",
      useMessageDownload: true
    };
  }
  return null;
}
async function handleViewOnceDetection(sock, msg) {
  try {
    if (msg.key?.fromMe) {
      return;
    }
    const rawMessage = msg.message;
    if (!rawMessage) {
      return;
    }

    // Quick pre-check: skip obvious non-viewonce messages
    const voKeys = ["viewOnceMessage", "viewOnceMessageV2", "viewOnceMessageV2Extension", "imageMessage", "videoMessage", "audioMessage", "ephemeralMessage"];
    if (!Object.keys(rawMessage).some(k => voKeys.includes(k))) {
      return;
    }
    const config = loadAntiViewOnceConfig();
    const chatId = msg.key.remoteJid;
    const isGroup = chatId?.endsWith("@g.us");

    // Determine effective enabled/mode from gc/pm config
    let enabled;
    let deliveryMode;
    if (config.gc && config.pm) {
      const scope = isGroup ? config.gc : config.pm;
      enabled = scope.enabled;
      deliveryMode = scope.mode || "private";
    } else {
      // Legacy flat config
      enabled = config.enabled !== false && config.mode !== "off";
      deliveryMode = config.mode === "public" ? "chat" : "private";
    }
    if (!enabled) {
      return;
    }
    const viewOnce = detectViewOnceMedia(rawMessage);
    if (!viewOnce) {
      return;
    }
    const {
      type,
      media,
      useMessageDownload
    } = viewOnce;
    const sender = msg.key.participant || msg.key.remoteJid;
    const senderShort = sender.split("@")[0].split(":")[0];
    UltraCleanLogger.antiviewonce(`🔐 View-Once detected: ${type} from ${senderShort}`);
    const DL_TIMEOUT = 15000;
    let buffer;
    if (useMessageDownload) {
      // Wrapper-only: inner message was null, use downloadMediaMessage on the whole msg
      try {
        buffer = await Promise.race([downloadMediaMessage(msg, "buffer", {}), new Promise((_, rej) => setTimeout(() => rej(new Error("dl_timeout")), DL_TIMEOUT))]);
      } catch (err) {
        UltraCleanLogger.warning(`Anti-ViewOnce: downloadMediaMessage fallback failed — ${err.message}`);
        return;
      }
    } else {
      const cleanMedia = {
        ...media
      };
      delete cleanMedia.viewOnce;
      try {
        const dlMsg = {
          key: msg.key,
          message: {
            [`${type}Message`]: cleanMedia
          }
        };
        buffer = await Promise.race([downloadMediaMessage(dlMsg, "buffer", {}, {
          logger: {
            level: "silent",
            trace: () => {},
            debug: () => {},
            info: () => {},
            warn: () => {},
            error: () => {},
            fatal: () => {},
            child: () => ({
              level: "silent",
              trace: () => {},
              debug: () => {},
              info: () => {},
              warn: () => {},
              error: () => {},
              fatal: () => {},
              child: () => ({})
            })
          },
          reuploadRequest: sock.updateMediaMessage
        }), new Promise((_, rej) => setTimeout(() => rej(new Error("dl_timeout")), DL_TIMEOUT))]);
      } catch {
        try {
          const stream = await Promise.race([downloadContentFromMessage(cleanMedia, type), new Promise((_, rej) => setTimeout(() => rej(new Error("dl_timeout")), DL_TIMEOUT))]);
          const chunks = [];
          for await (const chunk of stream) {
            chunks.push(chunk);
            if (chunks.length > 500) {
              break;
            }
          }
          buffer = Buffer.concat(chunks);
        } catch (dlErr2) {
          UltraCleanLogger.warning(`Anti-ViewOnce: All download methods failed — ${dlErr2.message}`);
          return;
        }
      }
    }
    if (!buffer || buffer.length === 0) {
      return;
    }
    const timestamp = Date.now();
    const ext = type === "image" ? "jpg" : type === "video" ? "mp4" : "mp3";
    const filename = `viewonce_${type}_${senderShort}_${timestamp}.${ext}`;
    const retrievalCaption = await generateRetrievalCaption(sender, "auto-detect", chatId, null, sock);
    const sendAsSticker = config.sendAsSticker === true && type === "image";
    const mediaPayload = {};
    if (sendAsSticker) {
      mediaPayload.sticker = buffer;
    } else {
      mediaPayload[type] = buffer;
      mediaPayload.caption = retrievalCaption;
      mediaPayload.fileName = filename;
    }

    // Resolve owner JID — config.ownerJid SKIPPED (stale disk value causes wrong target)
    // Priority: process.env → creds.json me.id → OWNER_CLEAN_JID (non-LID only)
    let ownerJid = "";
    // 1. process.env.OWNER_NUMBER (Pterodactyl env var or .env)
    if (!ownerJid) {
      const _envNum = (process.env.OWNER_NUMBER || "").replace(/[^0-9]/g, "");
      if (_envNum && _envNum.length >= 7 && _envNum.length <= 13) {
        ownerJid = `${_envNum}@s.whatsapp.net`;
      }
    }
    // 2. creds.json me.id — real phone JID stored at pairing time
    if (!ownerJid) {
      try {
        const _cr = JSON.parse(require("fs").readFileSync(join(__dirname, "session/creds.json"), "utf8"));
        const _mid = _cr?.me?.id || "";
        if (_mid && !_mid.includes("@lid")) {
          const _cn = _mid.split("@")[0].split(":")[0].replace(/[^0-9]/g, "");
          if (_cn.length >= 7 && _cn.length <= 13) {
            ownerJid = `${_cn}@s.whatsapp.net`;
          }
        }
      } catch (_) {}
    }
    // 3. OWNER_CLEAN_JID — only genuine phone-number JIDs (reject LID and >13 digits)
    if (!ownerJid) {
      const _autoJid = OWNER_CLEAN_JID || "";
      const _autoNum = _autoJid.split("@")[0].split(":")[0].replace(/[^0-9]/g, "");
      if (_autoNum && _autoNum.length >= 7 && _autoNum.length <= 13 && !_autoJid.includes("@lid")) {
        ownerJid = `${_autoNum}@s.whatsapp.net`;
      }
    }

    // Determine target(s)
    // DMs (not groups): ALWAYS send to owner's saved messages for privacy
    // Groups: respect the chosen deliveryMode (private / chat / both)
    const targets = [];
    if (!isGroup) {
      // View-once from a DM — always forward to owner regardless of mode
      if (ownerJid) {
        targets.push(jidNormalizedUser(ownerJid));
      }
    } else {
      if (deliveryMode === "private" || deliveryMode === "both") {
        if (ownerJid) {
          targets.push(jidNormalizedUser(ownerJid));
        }
      }
      if ((deliveryMode === "chat" || deliveryMode === "both") && chatId !== ownerJid) {
        targets.push(chatId);
      }
      if (targets.length === 0 && ownerJid) {
        targets.push(jidNormalizedUser(ownerJid));
      }
    }
    for (const target of targets) {
      try {
        await sock.sendMessage(target, mediaPayload);
        UltraCleanLogger.antiviewonce(`🔐 View-Once sent to ${target}`);
      } catch (sendErr) {
        UltraCleanLogger.warning(`Anti-ViewOnce send failed to ${target}: ${sendErr.message}`);
      }
    }
    try {
      const mimetype = type === "image" ? "image/jpeg" : type === "video" ? "video/mp4" : "audio/mpeg";
      await db.uploadMedia(filename, buffer, mimetype, "viewonce");
      _cache_antiviewonce_captured_count++;
    } catch {}
  } catch (error) {
    UltraCleanLogger.warning(`Anti-ViewOnce error: ${error.message}`);
  }
}

// ====== CONNECT COMMAND HANDLER ======
async function handleConnectCommand(sock, msg, args, cleaned) {
  try {
    const chatJid = msg.key.remoteJid || cleaned.cleanJid;
    const start = Date.now();
    const currentPrefix = getCurrentPrefix();
    const prefixDisplay = isPrefixless ? "none (prefixless)" : `"${currentPrefix}"`;
    const platform = detectPlatform();

    // const loadingMessage = await sock.sendMessage(chatJid, {
    //     text: `🐺 *${getCurrentBotName()}* is checking connection... █▒▒▒▒▒▒▒▒▒`
    // }, { quoted: msg });

    const latency = Date.now() - start;
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor(uptime % 3600 / 60);
    const seconds = Math.floor(uptime % 60);
    const uptimeText = `${hours}h ${minutes}m ${seconds}s`;
    const isOwnerUser = jidManager.isOwner(msg);
    const ultimatefixStatus = isOwnerUser ? "✅" : "❌";
    const memberStats = memberDetector ? memberDetector.getStats() : null;
    const antiviewonceStats = antiViewOnceSystem ? antiViewOnceSystem.getStats() : null;
    let statusEmoji;
    let statusText;
    let mood;
    if (latency <= 100) {
      statusEmoji = "🟢";
      statusText = "Excellent";
      mood = "⚡Superb Connection";
    } else if (latency <= 300) {
      statusEmoji = "🟡";
      statusText = "Good";
      mood = "📡Stable Link";
    } else {
      statusEmoji = "🔴";
      statusText = "Slow";
      mood = "🌑Needs Optimization";
    }

    //         await sock.sendMessage(chatJid, {
    //             text: `
    // ╭━━🌕 *CONNECTION STATUS* 🌕━━╮
    // ┃  ⚡ *User:* ${cleaned.cleanNumber}
    // ┃  🔴 *Prefix:* ${prefixDisplay}
    // ┃  🐾 *Ultimatefix:* ${ultimatefixStatus}
    // ┃  🏗️ *Platform:* ${platform}
    // ┃  ⏱️ *Latency:* ${latency}ms ${statusEmoji}
    // ┃  ⏰ *Uptime:* ${uptimeText}
    // ┃  👥 *Members:* ${memberStats ? `${memberStats.totalEvents} events` : 'Not loaded'}
    // ┃  🔐 *ViewOnce:* ${antiviewonceStats ? `${antiviewonceStats.total} captured` : 'Not loaded'}
    // ┃  🔗 *Status:* ${statusText}
    // ┃  🎯 *Mood:* ${mood}
    // ┃  👑 *Owner:* ${isOwnerUser ? '✅ Yes' : '❌ No'}
    // ╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
    // _🐺 The Moon Watches — ..._
    // `,
    //             edit: loadingMessage.key
    //         }, { quoted: msg });

    UltraCleanLogger.command(`Connect from ${cleaned.cleanNumber}`);
    return true;
  } catch {
    return false;
  }
}

// ====== MESSAGE HANDLER ======

function extractTextFromMessage(messageObj) {
  const content = normalizeMessageContent(messageObj);
  if (!content) {
    return "";
  }
  if (content.interactiveResponseMessage) {
    const irm = content.interactiveResponseMessage;
    try {
      const nativeFlow = irm?.nativeFlowResponseMessage;
      if (nativeFlow?.paramsJson) {
        const params = JSON.parse(nativeFlow.paramsJson);
        if (params.id) {
          console.log("[BtnClick] nativeFlow.id:", params.id);
          return params.id;
        }
      }
    } catch {}
    try {
      if (irm?.nativeFlowResponseMessage?.name === "quick_reply") {
        const params = JSON.parse(irm.nativeFlowResponseMessage.paramsJson || "{}");
        if (params.id) {
          return params.id;
        }
      }
    } catch {}
    const body = irm?.body?.text;
    if (body) {
      console.log("[BtnClick] body.text fallback:", body);
      return body;
    }
    console.log("[BtnClick] Raw interactiveResponseMessage keys:", JSON.stringify(Object.keys(irm || {})));
    try {
      console.log("[BtnClick] Full IRM:", JSON.stringify(irm).substring(0, 500));
    } catch {}
  }
  if (content.buttonsResponseMessage) {
    const btnId = content.buttonsResponseMessage.selectedButtonId || content.buttonsResponseMessage.selectedDisplayText || "";
    if (btnId) {
      console.log("[BtnClick] buttonsResponse:", btnId);
    }
    return btnId;
  }
  if (content.listResponseMessage) {
    return content.listResponseMessage.singleSelectReply?.selectedRowId || content.listResponseMessage.title || "";
  }
  if (content.templateButtonReplyMessage) {
    return content.templateButtonReplyMessage.selectedId || content.templateButtonReplyMessage.selectedDisplayText || "";
  }
  return content.conversation || content.extendedTextMessage?.text || content.imageMessage?.caption || content.videoMessage?.caption || content.documentMessage?.caption || content.documentWithCaptionMessage?.message?.documentMessage?.caption || "";
}
async function handleIncomingMessage(sock, msg) {
  const startTime = Date.now();
  try {
    // ─── Resolve LID chatId → canonical @s.whatsapp.net ─────────────
    // IMPORTANT: also write back to msg.key.remoteJid so every command
    // that reads msg.key.remoteJid directly gets the resolved JID.
    let chatId = msg.key.remoteJid;
    if (chatId && chatId.endsWith("@lid")) {
      try {
        const _lidPhone = resolvePhoneFromLid(chatId);
        if (_lidPhone) {
          chatId = `${_lidPhone}@s.whatsapp.net`;
        } else {
          const _ownerNum = (typeof OWNER_CLEAN_NUMBER !== "undefined" && OWNER_CLEAN_NUMBER)
            || (process.env.OWNER_NUMBER || "").replace(/[^0-9]/g, "");
          if (msg.key.fromMe && _ownerNum) {
            chatId = `${_ownerNum}@s.whatsapp.net`;
          }
        }
      } catch {}
      // Patch the message object so all downstream command code sees the resolved JID
      if (!chatId.endsWith("@lid")) {
        msg.key.remoteJid = chatId;
      }
    }
    const senderJid = msg.key.participant || chatId;
    const isGroup = chatId.includes("@g.us");

    // DM trace: log every non-fromMe DM arrival so we can see if messages reach the handler
    if (!isGroup && !msg.key.fromMe && chatId !== "status@broadcast") {
      const _dmSender = senderJid.split("@")[0].split(":")[0];
      const _dmContent = msg.message ? Object.keys(msg.message)[0] : "NULL";
      const _dmText = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";
      // [SILENT] originalConsoleMethods.log(`🔍 [DM-IN] sender=${_dmSender} chatId=${chatId} type=${_dmContent} text="${_dmText.substring(0,40)}"`);
    }
    if (isGroup && senderJid.includes("@lid")) {
      resolvePhoneFromLid(senderJid);
    }
    if (isUserBlocked(senderJid)) {
      return;
    }
    try {
      autoLinkSystem.shouldAutoLink(sock, msg).then(linked => {
        if (linked) {
          UltraCleanLogger.info(`✅ Auto-linking completed for ${senderJid.split("@")[0]}`);
        }
      }).catch(() => {});
    } catch {}

    // ─── Always show typing/recording bubble on any incoming message ──
    const _presRealContent = msg.message && (msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.imageMessage || msg.message.videoMessage || msg.message.audioMessage || msg.message.documentMessage || msg.message.stickerMessage || msg.message.ephemeralMessage);
    {
      const _pType = getPresenceType(chatId);
      if (_presRealContent && chatId !== "status@broadcast" && (chatId.endsWith("@s.whatsapp.net") || chatId.endsWith("@g.us") || chatId.endsWith("@lid")) && _pType) {
        const _pJid = resolvePresenceJid(chatId);
        (async () => {
          if (!_subscribedPresenceJids.has(_pJid)) {
            try {
              await sock.presenceSubscribe(_pJid);
              _subscribedPresenceJids.add(_pJid);
            } catch {}
          }
          try {
            await sock.sendPresenceUpdate(_pType, _pJid);
          } catch {}
        })();
      }
    }
    // ─────────────────────────────────────────────────────────────────

    try {
      const isOwnerMsg = jidManager.isOwner(msg) || msg.key.fromMe;
      const rawMsg = msg.message || {};
      const msgContent = normalizeMessageContent(rawMsg) || rawMsg;
      const isSticker = !!msgContent.stickerMessage;
      let rawText = msgContent.conversation || msgContent.extendedTextMessage?.text || msgContent.imageMessage?.caption || "";
      if (!rawText && msgContent.interactiveResponseMessage) {
        try {
          const nf = msgContent.interactiveResponseMessage?.nativeFlowResponseMessage;
          if (nf?.paramsJson) {
            const p = JSON.parse(nf.paramsJson);
            if (p.id) {
              rawText = p.id;
            }
          }
        } catch {}
        if (!rawText) {
          rawText = msgContent.interactiveResponseMessage?.body?.text || "";
        }
      }
      if (!rawText && msgContent.buttonsResponseMessage) {
        rawText = msgContent.buttonsResponseMessage.selectedButtonId || "";
      }
      if (!rawText && msgContent.listResponseMessage) {
        rawText = msgContent.listResponseMessage.singleSelectReply?.selectedRowId || "";
      }
      if (!rawText && msgContent.templateButtonReplyMessage) {
        rawText = msgContent.templateButtonReplyMessage.selectedId || "";
      }
      const trimmed = rawText.trim();
      const isEmojiOnly = trimmed.length > 0 && trimmed.length <= 10 && /^[\p{Emoji_Presentation}\p{Emoji}\u200d\ufe0f\s]+$/u.test(trimmed);
      if ((isSticker || isEmojiOnly) && isOwnerMsg) {
        const replyCtx = msgContent.stickerMessage?.contextInfo || msgContent.extendedTextMessage?.contextInfo || msgContent.imageMessage?.contextInfo || msgContent.videoMessage?.contextInfo;
        if (replyCtx?.quotedMessage) {
          const viewOnceCheck = detectViewOnceMedia(replyCtx.quotedMessage);
          if (viewOnceCheck) {
            (async () => {
              try {
                const config = loadAntiViewOnceConfig();
                const ownerJid = config.ownerJid || OWNER_CLEAN_JID;
                if (!ownerJid) {
                  return;
                }
                const {
                  type,
                  media
                } = viewOnceCheck;
                const cleanMedia = {
                  ...media
                };
                delete cleanMedia.viewOnce;
                const dlMsg = {
                  key: {
                    remoteJid: replyCtx.remoteJid || chatId,
                    id: replyCtx.stanzaId,
                    participant: replyCtx.participant,
                    fromMe: replyCtx.fromMe
                  },
                  message: {
                    [`${type}Message`]: cleanMedia
                  }
                };
                const silentLogger = {
                  level: "silent",
                  trace: () => {},
                  debug: () => {},
                  info: () => {},
                  warn: () => {},
                  error: () => {},
                  fatal: () => {},
                  child: () => ({
                    level: "silent",
                    trace: () => {},
                    debug: () => {},
                    info: () => {},
                    warn: () => {},
                    error: () => {},
                    fatal: () => {},
                    child: () => ({})
                  })
                };
                const buffer = await Promise.race([downloadMediaMessage(dlMsg, "buffer", {}, {
                  logger: silentLogger,
                  reuploadRequest: sock.updateMediaMessage
                }), new Promise((_, rej) => setTimeout(() => rej(new Error("dl_timeout")), 15000))]);
                if (buffer && buffer.length > 0) {
                  const normalizedOwner = jidNormalizedUser(ownerJid);
                  const replierJid = msg.key.participant || msg.key.remoteJid;
                  const voSenderJid = replyCtx.participant || replyCtx.remoteJid || chatId;
                  const replierShort = replierJid.split("@")[0].split(":")[0];
                  const mediaPayload = {
                    [type]: buffer
                  };
                  mediaPayload.caption = await generateRetrievalCaption(voSenderJid, replierJid, chatId, null, sock);
                  await sock.sendMessage(normalizedOwner, mediaPayload);
                  UltraCleanLogger.info(`🔐 View-once auto-captured via ${isSticker ? "sticker" : "emoji"} reply from ${replierShort}`);
                }
              } catch (dlErr) {
                UltraCleanLogger.warning(`🔐 View-once auto-capture failed: ${dlErr.message}`);
              }
            })();
          }
        }
      }
    } catch {}
    try {
      const isOwnerReaction = jidManager.isOwner(msg) || msg.key.fromMe;
      const rawMsg = msg.message || {};
      const msgContent2 = normalizeMessageContent(rawMsg) || rawMsg;
      const reactionMsg = msgContent2.reactionMessage;
      if (reactionMsg && reactionMsg.key && reactionMsg.text && isOwnerReaction) {
        const reactedKey = reactionMsg.key;
        const reactedMsgId = reactedKey.id;
        const reactedChatId = reactedKey.remoteJid || chatId;
        let cachedMsg = getViewOnceFromCache(reactedChatId, reactedMsgId);
        if (!cachedMsg) {
          cachedMsg = store?.getMessage(reactedChatId, reactedMsgId);
        }
        if (cachedMsg) {
          let viewOnceReactCheck = detectViewOnceMedia(cachedMsg.message || cachedMsg);
          if (!viewOnceReactCheck) {
            const cachedContent = normalizeMessageContent(cachedMsg.message || cachedMsg);
            if (cachedContent) {
              viewOnceReactCheck = detectViewOnceMedia(cachedContent);
            }
          }
          if (viewOnceReactCheck) {
            (voCheck => {
              (async () => {
                try {
                  const config = loadAntiViewOnceConfig();
                  const ownerJid = config.ownerJid || OWNER_CLEAN_JID;
                  if (!ownerJid) {
                    return;
                  }
                  const {
                    type,
                    media
                  } = voCheck;
                  const cleanMedia = {
                    ...media
                  };
                  delete cleanMedia.viewOnce;
                  const dlMsg = {
                    key: {
                      remoteJid: reactedChatId,
                      id: reactedMsgId,
                      participant: reactedKey.participant,
                      fromMe: reactedKey.fromMe
                    },
                    message: {
                      [`${type}Message`]: cleanMedia
                    }
                  };
                  const silentLogger = {
                    level: "silent",
                    trace: () => {},
                    debug: () => {},
                    info: () => {},
                    warn: () => {},
                    error: () => {},
                    fatal: () => {},
                    child: () => ({
                      level: "silent",
                      trace: () => {},
                      debug: () => {},
                      info: () => {},
                      warn: () => {},
                      error: () => {},
                      fatal: () => {},
                      child: () => ({})
                    })
                  };
                  const buffer = await Promise.race([downloadMediaMessage(dlMsg, "buffer", {}, {
                    logger: silentLogger,
                    reuploadRequest: sock.updateMediaMessage
                  }), new Promise((_, rej) => setTimeout(() => rej(new Error("dl_timeout")), 15000))]);
                  if (buffer && buffer.length > 0) {
                    const normalizedOwner = jidNormalizedUser(ownerJid);
                    const reactorJid2 = msg.key.participant || msg.key.remoteJid;
                    const reactorShort = reactorJid2.split("@")[0].split(":")[0];
                    const senderJid2 = reactedKey.participant || reactedChatId;
                    const senderShort = senderJid2.split("@")[0].split(":")[0];
                    const mediaPayload = {
                      [type]: buffer
                    };
                    mediaPayload.caption = await generateRetrievalCaption(senderJid2, reactorJid2, reactedChatId, null, sock);
                    await sock.sendMessage(normalizedOwner, mediaPayload);
                    UltraCleanLogger.info(`🔐 View-once auto-captured via reaction ${reactionMsg.text} from ${reactorShort} on ${senderShort}'s message`);
                  }
                } catch (dlErr) {
                  UltraCleanLogger.warning(`🔐 View-once reaction capture failed: ${dlErr.message}`);
                }
              })();
            })(viewOnceReactCheck);
          }
        }
      }
    } catch {}
    const textMsg = extractTextFromMessage(msg.message);
    if (!isGroup && !msg.key.fromMe && chatId !== "status@broadcast") {
      // [SILENT] originalConsoleMethods.log(`🔍 [DM-TXT] textMsg="${(textMsg||'').substring(0,40)}" → ${textMsg ? 'ok' : 'DROPPED (empty)'}`);
    }
    if (!textMsg) {
      return;
    }
    if (isGaajuAIEnabled() && isGaajuAITrigger(textMsg) && !msg.key.fromMe) {
      const isOwnerW = jidManager.isOwner(msg);
      let isSudoW = jidManager.isSudo(msg);
      if (isOwnerW || isSudoW) {
        try {
          const currentPrefixForAI = getCurrentPrefix();
          const executeGaajuAICommand = async (cmdName, cmdArgs) => {
            const cmd = commands.get(cmdName);
            if (!cmd) {
              return;
            }
            if (cmd.ownerOnly && !isOwnerW && !isSudoW) {
              await sock.sendMessage(chatId, {
                text: `❌ *Owner Only Command*\n\nThe \`${cmdName}\` command can only be used by the bot owner or sudo users.`
              }, {
                quoted: msg
              });
              return;
            }
            setActiveCommand(chatId, cmdName, cmdArgs, senderJid);
            {
              const _presType2 = getPresenceType(chatId);
              if (_presType2) {
                const _presJid2 = resolvePresenceJid(chatId);
                if (!_subscribedPresenceJids.has(_presJid2)) {
                  sock.presenceSubscribe(_presJid2).then(() => _subscribedPresenceJids.add(_presJid2)).catch(() => {});
                }
                sock.sendPresenceUpdate(_presType2, _presJid2).catch(() => {});
              }
            }
            try {
              await cmd.execute(sock, msg, cmdArgs, currentPrefixForAI, {
                OWNER_NUMBER: OWNER_CLEAN_NUMBER,
                OWNER_JID: OWNER_CLEAN_JID,
                OWNER_LID: OWNER_LID,
                BOT_NAME: getCurrentBotName(),
                VERSION,
                isOwner: () => isOwnerW,
                isSudo: () => isSudoW || jidManager.isSudo(msg),
                jidManager,
                store,
                statusDetector,
                updatePrefix: updatePrefixImmediately,
                getCurrentPrefix,
                rateLimiter,
                memberDetector,
                antiViewOnceSystem,
                isPrefixless,
                DiskManager
              });
            } finally {
              clearActiveCommand(chatId, senderJid);
              if (getPresenceType(chatId)) {
                try {
                  await sock.sendPresenceUpdate("paused", resolvePresenceJid(chatId));
                } catch {}
              }
            }
          };
          const handled = await handleGaajuAI(sock, msg, commands, executeGaajuAICommand, textMsg);
          if (handled) {
            const aiDisplay = getDisplayNumber(senderJid);
            const aiLocTag = isGroup ? `[${chatId.split("@")[0].substring(0, 10)}]` : "[DM]";
            const aiPreview = textMsg.length > 50 ? textMsg.substring(0, 50) + "…" : textMsg;
            UltraCleanLogger.info(`🤖 Gaaju AI: ${aiDisplay} ${aiLocTag} → "${aiPreview}"`);
            return;
          }
        } catch (aiErr) {
          UltraCleanLogger.error(`🤖 Gaaju AI error: ${aiErr.message}`);
        }
      }
    }
    const currentPrefix = getCurrentPrefix();
    let commandName = "";
    let args = [];
    if (!isPrefixless && textMsg.startsWith(currentPrefix)) {
      const spaceIndex = textMsg.indexOf(" ", currentPrefix.length);
      commandName = spaceIndex === -1 ? textMsg.slice(currentPrefix.length).toLowerCase().trim() : textMsg.slice(currentPrefix.length, spaceIndex).toLowerCase().trim();
      args = spaceIndex === -1 ? [] : textMsg.slice(spaceIndex).trim().split(/\s+/);
    } else if (isPrefixless) {
      const words = textMsg.trim().split(/\s+/);
      const firstWord = words[0].toLowerCase();
      if (commands.has(firstWord)) {
        commandName = firstWord;
        args = words.slice(1);
      } else {
        const defaultCommands = ["ping", "help", "uptime", "statusstats", "ultimatefix", "prefixinfo", "antiviewonce", "av"];
        if (defaultCommands.includes(firstWord)) {
          commandName = firstWord;
          args = words.slice(1);
        }
      }
    }

    // ── Blacklist gate — fires before commands AND chatbot plain-text ─────────
    // Handles regular JIDs (234xxx@s.whatsapp.net) AND LID JIDs (@lid)
    if (!msg.key.fromMe) {
      const _blRaw = senderJid.split("@")[0].split(":")[0];
      // LID senders: resolve to real phone via the existing lidPhoneCache
      const _blPhone = senderJid.includes("@lid") ? lidPhoneCache.get(_blRaw) || _blRaw : _blRaw;
      if (isBlacklisted(_blPhone) || _blPhone !== _blRaw && isBlacklisted(_blRaw)) {
        return; // silently drop — blocked user gets zero response
      }
    }
    if (!commandName) {
      const prefixBypassNames = ["prefix", "prefixinfo", "myprefix", "botprefix"];
      const stripped = textMsg.replace(/^[^a-zA-Z0-9]+/, "").toLowerCase().trim().split(/\s+/)[0];
      if (prefixBypassNames.includes(stripped)) {
        commandName = "prefixinfo";
        args = [];
      }
    }

    // If the user replied to a mygroups list message with a plain number,
    // route it to the mygroups command even though it has no prefix
    if (!commandName && /^\d+$/.test(textMsg.trim())) {
      const stanzaId = msg.message?.extendedTextMessage?.contextInfo?.stanzaId;
      if (stanzaId && globalThis.groupListMsgIds?.has(stanzaId)) {
        commandName = "mygroups";
        args = [textMsg.trim()];
      }
    }
    if (!isGroup && !msg.key.fromMe && chatId !== "status@broadcast") {
      // [SILENT] originalConsoleMethods.log(`🔍 [DM-CMD] commandName="${commandName}" text="${textMsg.substring(0,30)}" prefix="${getCurrentPrefix()}" prefixless=${isPrefixless}`);
    }
    if (!commandName) {
      if (jidManager.isOwner(msg) && textMsg && textMsg.trim().length > 0) {
        if (senderJid.includes("@lid")) {
          resolvePhoneFromLid(senderJid);
          const _lidRaw = senderJid.split("@")[0].split(":")[0];
          const _ownerNum = OWNER_CLEAN_NUMBER || (process.env.OWNER_NUMBER || "").replace(/[^0-9]/g, "");
          if (_ownerNum && !lidPhoneCache.get(_lidRaw)) {
            cacheLidPhone(_lidRaw, _ownerNum);
            if (!OWNER_LID) {
              OWNER_LID = senderJid;
            }
          }
        }
        const ownerDisplay = getDisplayNumber(senderJid);
        const ownerLocTag = isGroup ? `[${chatId.split("@")[0].substring(0, 10)}]` : "[DM]";
        const preview = textMsg.length > 60 ? textMsg.substring(0, 60) + "…" : textMsg;
        UltraCleanLogger.ownerMessage(`${ownerDisplay} ${ownerLocTag} → "${preview}"`);
      }
      if (isChatbotActiveForChat(chatId)) {
        if (chatId !== "status@broadcast" && !msg.key.fromMe) {
          handleChatbotMessage(sock, msg, commands).catch(() => {});
        }
      }
      return;
    }

    // Quick mode gate BEFORE rate limiter — prevents info leaks in silent/groups/dms modes
    {
      const _qMode = (_cache_bot_mode?.mode || BOT_MODE || "public").toLowerCase();
      if (_qMode !== "public" && _qMode !== "buttons" && _qMode !== "channel" && _qMode !== "default") {
        const _qOwner = jidManager.isOwner(msg);
        let _qSudo = jidManager.isSudo(msg);
        // LID async fallback: sync isSudo misses group LID senders — resolve phone now
        if (!_qOwner && !_qSudo && senderJid.includes("@lid") && isGroup) {
          try {
            _qSudo = await jidManager.isSudoAsync(msg, sock);
          } catch {}
        }
        if (!_qOwner && !_qSudo) {
          // LID fallback: sender may arrive as a LID in groups — resolve to phone and recheck
          let _qBypass = false;
          const _qRaw = senderJid.split("@")[0].split(":")[0];
          const _qOwnerNum = (OWNER_CLEAN_NUMBER || "").replace(/[^0-9]/g, "");
          // 1. Direct numeric match (handles edge cases where JID contains phone directly)
          if (_qRaw && _qOwnerNum && _qRaw === _qOwnerNum) {
            _qBypass = true;
          }
          // 2. LID resolution — look up cached LID→phone mapping
          if (!_qBypass && senderJid.includes("@lid")) {
            const _qPhone = resolvePhoneFromLid(senderJid) || lidPhoneCache.get(_qRaw);
            if (_qPhone && (_qPhone === _qOwnerNum || isSudoNumber(_qPhone))) {
              _qBypass = true;
            }
          }
          // Whitelist bypass — whitelisted users pass regardless of mode
          if (!_qBypass) {
            const _wlNum = senderJid.split("@")[0].split(":")[0];
            if (isWhitelisted(_wlNum)) {
              _qBypass = true;
            }
          }
          if (!_qBypass) {
            if (_qMode === "silent") {
              return;
            }
            if (_qMode === "groups" && !isGroup) {
              try {
                await sock.sendMessage(chatId, {
                  text: `⚠️ *Bot is currently in Groups-Only mode.*\nCommands can only be used inside groups.`
                }, { quoted: msg });
              } catch {}
              return;
            }
            if (_qMode === "dms" && isGroup) {
              try {
                await sock.sendMessage(chatId, {
                  text: `⚠️ *Bot is currently in DMs-Only mode.*\nPlease send commands in a private chat with the bot.`
                }, { quoted: msg });
              } catch {}
              return;
            }
          }
        }
      }
    }
    const rateLimitCheck = rateLimiter.canSendCommand(chatId, senderJid, commandName);
    if (!rateLimitCheck.allowed) {
      await sock.sendMessage(chatId, {
        text: `⚠️ ${rateLimitCheck.reason}`
      });
      return;
    }
    if (senderJid.includes("@lid")) {
      resolvePhoneFromLid(senderJid);
      if (isGroup) {
        resolveSenderFromGroup(senderJid, chatId, sock).catch(() => {});
      }
    }
    let isOwnerUser = jidManager.isOwner(msg);
    let isSudoUser = jidManager.isSudo(msg);

    // Fallback: direct number match — fixes LID mismatch + empty OWNER_NUMBER in env
    if (!isOwnerUser && !isSudoUser) {
      const _cfgOwner = require("./config");
      const _senderRaw = senderJid.split("@")[0].split(":")[0].replace(/[^0-9]/g, "");
      const _storedOwner = (OWNER_CLEAN_NUMBER || _cfgOwner.OWNER_NUMBER || "").replace(/[^0-9]/g, "");
      if (_senderRaw && _storedOwner && _senderRaw === _storedOwner) {
        isOwnerUser = true;
        isSudoUser = true;
      }
    }
    if (!isSudoUser && !isOwnerUser && senderJid.includes("@lid")) {
      const senderRaw = senderJid.split("@")[0].split(":")[0];
      const senderFull = senderJid.split("@")[0];
      let resolvedPhone = lidPhoneCache.get(senderRaw) || lidPhoneCache.get(senderFull) || getPhoneFromLid(senderRaw) || getPhoneFromLid(senderFull);
      if (resolvedPhone && isSudoNumber(resolvedPhone)) {
        isSudoUser = true;
        UltraCleanLogger.info(`Sudo detected via LID cache: +${resolvedPhone}`);
      }
    }

    // Once owner confirmed — cache their LID so display resolves correctly
    if (isOwnerUser && senderJid.includes("@lid")) {
      const _cLidRaw = senderJid.split("@")[0].split(":")[0];
      const _cOwnerNum = OWNER_CLEAN_NUMBER || (process.env.OWNER_NUMBER || "").replace(/[^0-9]/g, "");
      if (_cOwnerNum && !lidPhoneCache.get(_cLidRaw)) {
        cacheLidPhone(_cLidRaw, _cOwnerNum);
        if (!OWNER_LID) {
          OWNER_LID = senderJid;
        }
        UltraCleanLogger.info(`📱 Cached owner LID: ${_cLidRaw} → ${_cOwnerNum}`);
      }
    }
    const senderDisplay = getDisplayNumber(senderJid);
    const prefixDisplay = isPrefixless ? "" : currentPrefix;
    const roleTag = isOwnerUser ? "👑" : isSudoUser ? "🛡️" : "👤";
    const locationTag = isGroup ? `[${chatId.split("@")[0].substring(0, 10)}]` : "[DM]";
    if (isOwnerUser) {
      UltraCleanLogger.ownerCommand(`${senderDisplay} ${locationTag} → ${prefixDisplay}${commandName} (${Date.now() - startTime}ms)`);
    } else {
      UltraCleanLogger.command(`${roleTag} ${senderDisplay} ${locationTag} → ${prefixDisplay}${commandName} (${Date.now() - startTime}ms)`);
    }
    if (!checkBotMode(msg, commandName, isSudoUser)) {
      if (!isOwnerUser && !isSudoUser) {
        const _currentMode = (_cache_bot_mode?.mode || BOT_MODE || "public").toLowerCase();
        if (_currentMode === "groups" && !isGroup) {
          try {
            await sock.sendMessage(chatId, {
              text: `⚠️ *Bot is in Groups-Only mode.*\nSend commands inside a group.`
            }, { quoted: msg });
          } catch {}
        } else if (_currentMode === "dms" && isGroup) {
          try {
            await sock.sendMessage(chatId, {
              text: `⚠️ *Bot is in DMs-Only mode.*\nSend commands in a private chat with the bot.`
            }, { quoted: msg });
          } catch {}
        }
        return;
      }
    }
    if (commandName === "connect" || commandName === "link") {
      const cleaned = jidManager.cleanJid(senderJid);
      await handleConnectCommand(sock, msg, args, cleaned);
      return;
    }
    const command = commands.get(commandName);
    if (command) {
      try {
        if (command.ownerOnly && !isOwnerUser) {
          const sudoAllowed = command.sudoAllowed !== false;
          if (sudoAllowed && !isSudoUser && senderJid.includes("@lid")) {
            try {
              const sudoTimeout = new Promise(resolve => setTimeout(() => resolve(false), 3000));
              isSudoUser = await Promise.race([jidManager.isSudoAsync(msg, sock), sudoTimeout]);
              if (isSudoUser) {
                UltraCleanLogger.info(`Sudo confirmed at owner gate via async`);
              }
            } catch {}
          }
          if (!sudoAllowed || !isSudoUser) {
            try {
              await sock.sendMessage(chatId, {
                text: `❌ *Owner Only Command*\n\nThe \`${commandName}\` command can only be used by the bot owner or sudo users.`
              }, { quoted: msg });
            } catch {}
            return;
          }
        }
        setActiveCommand(chatId, commandName, args, senderJid);
        {
          const _presType = getPresenceType(chatId);
          if (_presType) {
            const _presJid = resolvePresenceJid(chatId);
            if (!_subscribedPresenceJids.has(_presJid)) {
              sock.presenceSubscribe(_presJid).then(() => _subscribedPresenceJids.add(_presJid)).catch(() => {});
            }
            sock.sendPresenceUpdate(_presType, _presJid).catch(() => {});
          }
        }
        try {
          try {
            const _cmdEmojiMap = {
              // AI
              ai: "🤖", gpt: "🧠", gpt4: "🧠", gemini: "✨", bard: "🌟", claude: "💡",
              deepseek: "🔭", grok: "🚀", mistral: "🌬️", llama: "🦙", qwen: "🐉",
              chatbot: "💬", imagine: "🎨", makemusic: "🎵", gaaju: "🤖",
              aibibl: "📖", aimuslim: "🕌",
              // Games
              "8ball": "🎱", dice: "🎲", rps: "✂️", riddle: "🧩", trivia: "🏆",
              wordchain: "🔤", tictactoe: "❌", truth: "💯", dare: "😈", tod: "🎭",
              ship: "💑", coinflip: "🪙", quiz: "❓", paranoia: "😱", nhie: "🙈",
              wyr: "🤔", roll: "🎰", dicebegin: "🎲", diceend: "🎲", dicejoin: "🎲",
              dicescores: "🏅", tttboard: "❌", tttend: "🏁", tttjoin: "🎮",
              wcplay: "🔤", wcend: "🏁",
              // Download
              yta: "🎵", ytv: "🎬", play: "▶️", spotify: "🎧", fb: "📥", ig: "📸",
              tiktok: "🎵", twitter: "🐦", ncs: "🎼", sc: "☁️", mf: "📂",
              tg: "✈️", xnxxdownload: "🔞", xvideosdownload: "🔞", apk: "📱",
              // Group
              add: "➕", ban: "🔨", kick: "👢", kickall: "💥", promote: "⬆️",
              demote: "⬇️", mute: "🔇", unmute: "🔊", tagall: "📣", hidetag: "👥",
              link: "🔗", revoke: "🔄", setname: "✏️", setdesc: "📝", seticon: "🖼️",
              setgpp: "🖼️", welcome: "👋", goodbye: "👋", poll: "📊", groupinfo: "ℹ️",
              groupstats: "📊", admins: "👑", newgroup: "🆕", leave: "🚪",
              antilink: "🔗", antispam: "🛡️", antidemote: "🛡️", antipromote: "🛡️",
              antitag: "🛡️", antistatusmention: "🛡️", antigroupstatus: "🛡️",
              antigroupmention: "🛡️", antibug: "🐛", wordfilter: "🚫",
              slowmode: "🐢", autoreply: "↩️", joinrequests: "📋",
              listrequests: "📋", accept: "✅", acceptall: "✅", reject: "❌",
              rejectall: "❌", pin: "📌", move: "🔀", glink: "🔗",
              togroupstatus: "📊", warn: "⚠️", warns: "⚠️", resetwarn: "🔄",
              // Owner
              broadcast: "📢", eval: "💻", restart: "🔄", update: "⬆️",
              mode: "⚙️", setpp: "🖼️", setbotname: "🤖", addsudo: "👑",
              delsudo: "🗑️", listsudo: "📋", blacklist: "⛔", whitelist: "✅",
              repo: "📦", setnewsletter: "📰", antidelete: "🛡️",
              antideletestatus: "🛡️", antiviewonce: "👁️", backup: "💾",
              reactowner: "👑", reactdev: "💻",
              // Utility
              ping: "🏓", uptime: "⏱️", alive: "💚", menu: "📋", listall: "📃",
              sticker: "🎭", toimg: "🖼️", take: "📌", del: "🗑️", save: "💾",
              qr: "📷", translate: "🌐", tts: "🗣️", calc: "🧮", weather: "🌤️",
              worldclock: "🕐", time: "🕐", currency: "💱", crypto: "💰",
              cryptotop: "📈", rates: "💹", horoscope: "♈", numfact: "🔢",
              fact: "💡", quote: "💬", zenquote: "🧘", joke: "😂", meme: "😂",
              compliment: "💝", roast: "🔥", pickupline: "💌", poem: "📜",
              font: "🔤", allfont: "🔤", uppercase: "🔠", lowercase: "🔡",
              reverse: "🔄", charcount: "🔢", encode: "🔒", decode: "🔓",
              ebase: "🔒", dbase: "🔓", ebinary: "💾", debinary: "💾",
              ehex: "🔢", dhex: "🔢", base64encode: "🔒", base64decode: "🔓",
              password: "🔐", countdown: "⏳", remind: "⏰", vcf: "👤",
              mygroups: "👥", pp: "🖼️", vv: "👁️", tostatus: "📤",
              ephoto: "📸", img: "🖼️", wallpaper: "🖼️", telegramsticker: "🎭",
              setprefix: "⚙️", presence: "👁️", channeloperate: "📡",
              channelreact: "📡",
              // Search & Info
              wiki: "📖", wikisearch: "📖", dict: "📚", news: "📰",
              technews: "💻", footballnews: "⚽", trending: "📈",
              recipe: "🍳", mealsearch: "🍽️", movie: "🎬", newmovies: "🎬",
              hotmovies: "🔥", lyrics: "🎵", npm: "📦", npmstalk: "📦",
              github: "🐙", ghrepo: "🗂️", ghstalk: "🔍", ghtrend: "📈",
              country: "🌍", countryinfo: "🌍", playersearch: "⚽",
              teamsearch: "⚽", weather2: "🌤️", age: "🎂", actor: "🎬",
              drama: "🎭", fruit: "🍎",
              // Spiritual
              bible: "✝️", biblesearch: "✝️", hymn: "🎵", aibibl: "✝️",
              aimuslim: "🕌", randverse: "📖", surahlist: "📖",
              // Fun/Stalker
              dog: "🐕", cat: "🐱", fox: "🦊", mbox: "📬",
              // Notes
              addnote: "📝", getnote: "📝", getnotes: "📋", delnote: "🗑️",
              delallnotes: "🗑️", updatenote: "✏️", notes: "📝",
              // Status automation
              autoviewstatus: "👁️", autodownloadstatus: "📥",
              autolikestatus: "❤️", autotyping: "⌨️", autorecording: "🎙️",
              // Fonts/3D (image effects)
              "3D Classic": "🎨", "3D Cubic": "🎨", "3D Silver": "🎨",
              "3D Style": "🎨", "3D Wood": "🎨", "3D Wooden Logo": "🎨",
              "Avengers 3D": "🦸", "Beach 3D": "🏖️", "Birthday 3D": "🎂",
              "Blackpink Neon": "💗", "Blue Neon": "💙", "Blue Neon Logo": "💙",
              "Christmas Snow 3D": "❄️", "Christmas Sparkle 3D": "✨",
              "Colorful Glow": "🌈", "Colorful Neon Light": "🌈",
              "Comic 3D": "💥", "Crack 3D": "💎", "CS:GO": "🎮",
              "Cute Pig 3D": "🐷", "Decorative Metal": "⚙️",
              "Decorative Metal 3D": "⚙️", "Devil Wings Neon": "😈",
              "Effect #": "✨", "Foil Balloon 3D": "🎈",
              "Galaxy Class": "🌌", "Galaxy Neon": "🌌",
              "Glossy Silver": "⚪", "Glossy Silver 3D": "⚪",
              "Glowing Text": "✨", "Gold Glitter 3D": "🌟",
              "Gradient 3D": "🎨", "Gradient 3D v2": "🎨",
              "Gradient Logo 3D": "🎨", "Graffiti 3D": "🎨",
              "Green Neon": "💚", "Green Neon Logo": "💚",
              "Hacker Cyan Neon": "💻", "Hologram 3D": "🔮",
              "Icon Logo": "🎨", "League of Legends": "🎮",
              "LOL Avatar": "🎮", "LOL Pentakill": "🎮",
              "Mascot Logo": "🎨", "Metal 3D": "⚙️",
              "Metallic Shiny": "✨", "Metallic Shiny 3D": "✨",
              "Metal Logo": "⚙️", "Metal Logo 3D": "⚙️",
              "Multicolor Neon": "🌈", "Neon Classic": "💡",
              "Neon Glitch": "⚡", "Neon Light": "💡",
              "Neon Online": "🟢", "Neon Text": "✨",
              "Overwatch Avatar": "🎮", "Overwatch Cover": "🎮",
              "Overwatch Logo": "🎮", "Paint 3D": "🎨",
              "Paper Cut 3D": "✂️", "Polygon Logo": "🔷",
              "Project Yasuo": "⚔️", "PUBG Banner": "🎮",
              "PUBG Cover": "🎮", "Retro Neon": "📺",
              "Ruby Stone 3D": "💎", "Sand 3D": "🏜️",
              "Snow 3D": "❄️", "Space 3D": "🌌",
              "Stone 3D": "🪨", "Underwater 3D": "🌊",
              "USA Flag 3D": "🇺🇸", "Vintage Bulb 3D": "💡",
              "Water 3D": "🌊", "Wolf Galaxy": "🐺",
              "Wood 3D v2": "🌲", "Wooden 3D": "🌲",
              "Zombie 3D": "🧟",
              // misc
              hentai: "🔞", xnxxsearch: "🔞", xvideossearch: "🔞",
              qfun: "😄",
            };
            const _reactEmoji = _cmdEmojiMap[commandName] || "⚡";
            await sock.sendMessage(chatId, { react: { text: _reactEmoji, key: msg.key } });
          } catch {}
          await command.execute(sock, msg, args, currentPrefix, {
            OWNER_NUMBER: OWNER_CLEAN_NUMBER,
            OWNER_JID: OWNER_CLEAN_JID,
            OWNER_LID: OWNER_LID,
            BOT_NAME: getCurrentBotName(),
            VERSION,
            isOwner: () => jidManager.isOwner(msg),
            isSudo: () => isSudoUser || jidManager.isSudo(msg),
            isSudoUser: isOwnerUser || isSudoUser,
            isOwnerUser: isOwnerUser,
            jidManager,
            store,
            statusDetector: statusDetector,
            updatePrefix: updatePrefixImmediately,
            getCurrentPrefix: getCurrentPrefix,
            rateLimiter: rateLimiter,
            memberDetector: memberDetector,
            antiViewOnceSystem: antiViewOnceSystem,
            isPrefixless: isPrefixless,
            DiskManager: DiskManager
          });
        } finally {
          clearActiveCommand(chatId, senderJid);
          if (getPresenceType(chatId)) {
            try {
              await sock.sendPresenceUpdate("paused", resolvePresenceJid(chatId));
            } catch {}
          }
        }
      } catch (error) {
        if (error?.code === "ENOSPC") {
          UltraCleanLogger.error(`💾 Disk full during command ${commandName}! Running emergency cleanup...`);
          DiskManager.runCleanup(true);
        } else {
          UltraCleanLogger.error(`Command ${commandName} failed: ${error.message}`);
        }
      }
    } else {
      await handleDefaultCommands(commandName, sock, msg, args, currentPrefix);
    }
  } catch (error) {
    if (error?.code === "ENOSPC") {
      UltraCleanLogger.error(`💾 Disk full in message handler! Running emergency cleanup...`);
      DiskManager.runCleanup(true);
    } else {
      UltraCleanLogger.error(`Message handler error: ${error.message}`);
    }
  }
}

// ====== DEFAULT COMMANDS ======
async function handleDefaultCommands(commandName, sock, msg, args, currentPrefix) {
  const chatId = msg.key.remoteJid;
  const isOwnerUser = jidManager.isOwner(msg);
  const ownerInfo = jidManager.getOwnerInfo();
  const prefixDisplay = isPrefixless ? "" : currentPrefix;
  try {
    switch (commandName) {
      case "ping":
        {
          const _pingStart = Date.now();
          const _pingLatency = Date.now() - _pingStart;
          const _pingRating = _pingLatency < 300 ? "🟢 Fast" : _pingLatency < 700 ? "🟡 Medium" : "🔴 Slow";
          const _pingName = getCurrentBotName();
          await sock.sendMessage(chatId, {
            text: [`╔═|〔  PING 〕`, `║`, `║ ▸ *Speed*    : ${_pingLatency}ms`, `║ ▸ *Rating*   : ${_pingRating}`, `║ ▸ *Prefix*   : "${isPrefixless ? "none" : currentPrefix}"`, `║ ▸ *Mode*     : ${BOT_MODE}`, `║ ▸ *Status*   : Online ✅`, `║`, `╚═|〔 ${_pingName} 〕`].join("\n")
          }, {
            quoted: msg
          });
          break;
        }
      case "help":
        {
          const _helpName = getCurrentBotName();
          const _helpLines = [`╔═| ●-《  ${_helpName} 》-●`, `║`, `║ ▸ *Prefix*   : "${isPrefixless ? "none" : currentPrefix}"`, `║ ▸ *Mode*     : ${BOT_MODE}`, `║ ▸ *Commands* : ${new Set([...commands.values()].map(c => c.name)).size}`, `║`, `╠═| ■-🔧 QUICK HELP -■`, `║  ◇ ${prefixDisplay}menu        → full command list`, `║  ◇ ${prefixDisplay}av          → anti view-once`, `║  ◇ ${prefixDisplay}members     → member detector`, `║  ◇ ${prefixDisplay}statusstats → status stats`, `║  ◇ ${prefixDisplay}setprefix   → change prefix`, `║  ◇ ${prefixDisplay}ultimatefix → fix owner access`, `║`, `╚═╝`];
          await sock.sendMessage(chatId, {
            text: _helpLines.join("\n")
          }, {
            quoted: msg
          });
          break;
        }
      case "uptime":
        {
          const _up = process.uptime();
          const _upH = Math.floor(_up / 3600);
          const _upM = Math.floor(_up % 3600 / 60);
          const _upS = Math.floor(_up % 60);
          const _upName = getCurrentBotName();
          await sock.sendMessage(chatId, {
            text: [`╔═|〔  UPTIME 〕`, `║`, `║ ▸ *Uptime*   : ${_upH}h ${_upM}m ${_upS}s`, `║ ▸ *Owner*    : +${ownerInfo.ownerNumber}`, `║ ▸ *Prefix*   : "${isPrefixless ? "none" : currentPrefix}"`, `║ ▸ *Mode*     : ${BOT_MODE}`, `║ ▸ *Commands* : ${new Set([...commands.values()].map(c => c.name)).size}`, `║ ▸ *Platform* : ${detectPlatform()}`, `║ ▸ *Status*   : Online ✅`, `║`, `╚═|〔 ${_upName} 〕`].join("\n")
          }, {
            quoted: msg
          });
          break;
        }
      case "statusstats":
        {
          const _ssName = getCurrentBotName();
          if (statusDetector) {
            const _ssStats = statusDetector.getStats();
            const _ssRecent = statusDetector.statusLogs ? statusDetector.statusLogs.slice(-3).reverse() : [];
            const _ssLines = [`╔═|〔  STATUS DETECTOR 〕`, `║`, `║ ▸ *Status*   : ✅ Active`, `║ ▸ *Detected* : ${_ssStats.totalDetected}`, `║ ▸ *Last*     : ${_ssStats.lastDetection || "None yet"}`, `║`];
            if (_ssRecent.length > 0) {
              _ssLines.push(`║ ▸ *Recent*:`);
              _ssRecent.forEach((s, i) => {
                _ssLines.push(`║   ${i + 1}. ${s.sender} — ${s.type}`);
              });
              _ssLines.push(`║`);
            }
            _ssLines.push(`╚═|〔 ${_ssName} 〕`);
            await sock.sendMessage(chatId, {
              text: _ssLines.join("\n")
            }, {
              quoted: msg
            });
          } else {
            await sock.sendMessage(chatId, {
              text: `╔═|〔  STATUS DETECTOR 〕\n║\n║ ▸ *Status* : ❌ Not initialized\n║\n╚═|〔 ${_ssName} 〕`
            }, {
              quoted: msg
            });
          }
          break;
        }
      case "members":
      case "memberstats":
        {
          if (!isOwnerUser) {
            await sock.sendMessage(chatId, {
              text: `╔═|〔  MEMBERS 〕\n║\n║ ▸ *Status* : ❌ Owner only\n║\n╚═|〔 ${getCurrentBotName()} 〕`
            }, {
              quoted: msg
            });
            break;
          }
          const _mbAction = (args[0] || "").toLowerCase();

          // ── on/off toggle ─────────────────────────────────────────
          if (_mbAction === "on" || _mbAction === "enable") {
            if (memberDetector) {
              memberDetector.enabled = true;
            }
            await sock.sendMessage(chatId, {
              text: `╔═|〔  MEMBER DETECTOR 〕\n║\n║ ▸ *State* : ✅ Enabled\n║\n╚═|〔 ${getCurrentBotName()} 〕`
            }, {
              quoted: msg
            });
            break;
          }
          if (_mbAction === "off" || _mbAction === "disable") {
            if (memberDetector) {
              memberDetector.enabled = false;
            }
            await sock.sendMessage(chatId, {
              text: `╔═|〔  MEMBER DETECTOR 〕\n║\n║ ▸ *State* : ❌ Disabled\n║\n╚═|〔 ${getCurrentBotName()} 〕`
            }, {
              quoted: msg
            });
            break;
          }

          // ── group: show participants list ──────────────────────────
          const _mbIsGroup = chatId.endsWith("@g.us");
          if (_mbIsGroup) {
            try {
              const _mbMeta = await sock.groupMetadata(chatId);
              const _mbAll = _mbMeta.participants || [];
              const _mbTotal = _mbAll.length;
              const _mbAdminCount = _mbAll.filter(p => p.admin).length;
              const _mbLimit = 100;
              const _mbShown = _mbAll.slice(0, _mbLimit);
              const _mbName = getCurrentBotName();

              // Participant list — use same resolveDisplayWithName as .admins
              const {
                resolveDisplayWithName: _mbRDWN
              } = require("./lib/groupUtils");
              const _mbLines = await Promise.all(_mbShown.map(async p => {
                const roleEmoji = p.admin === "superadmin" ? "👑" : p.admin ? "⭐" : "👤";
                const roleLabel = p.admin === "superadmin" ? "superadmin" : p.admin ? "admin" : "member";
                const display = await _mbRDWN(sock, chatId, p.id || "", p.notify || null).catch(() => {
                  const {
                    phoneNum
                  } = extractParticipantInfo(p, sock);
                  if (phoneNum) {
                    return `+${phoneNum}`;
                  } else {
                    return "[hidden]";
                  }
                });
                return `║ ▸ ${roleEmoji} ${display} [${roleLabel}]`;
              }));

              // Single combined message
              const _mbFull = [`╔═|〔  GROUP MEMBERS 〕`, `║`, `║ ▸ *Group*   : ${_mbMeta.subject}`, `║ ▸ *Total*   : ${_mbTotal} members`, `║ ▸ *Admins*  : ${_mbAdminCount}`, `║ ▸ *Showing* : first ${Math.min(_mbLimit, _mbTotal)} of ${_mbTotal}`, `║`, ..._mbLines, `║`, `╚═|〔 ${_mbName} 〕`].join("\n");
              await sock.sendMessage(chatId, {
                text: _mbFull
              }, {
                quoted: msg
              });
            } catch (_mbErr) {
              await sock.sendMessage(chatId, {
                text: `╔═|〔  GROUP PARTICIPANTS 〕\n║\n║ ▸ *Status* : ❌ Failed\n║ ▸ *Reason* : ${_mbErr.message}\n║\n╚═|〔 ${getCurrentBotName()} 〕`
              }, {
                quoted: msg
              });
            }
            break;
          }

          // ── DM: show detector stats ────────────────────────────────
          if (memberDetector) {
            const stats = memberDetector.getStats();
            const _mbName = getCurrentBotName();
            const _mbLines = [`╔═|〔  MEMBER DETECTOR 〕`, `║`, `║ ▸ *Status*  : ${stats.enabled ? "✅ Active" : "❌ Disabled"}`, `║ ▸ *Events*  : ${stats.totalEvents}`, `║ ▸ *Groups*  : ${stats.totalGroups}`, `║ ▸ *Cached*  : ${stats.cachedGroups}`, `║`, `║ ▸ *Usage*:`, `║   ${prefixDisplay}members on   → enable`, `║   ${prefixDisplay}members off  → disable`, `║   (use in a group to see participants)`, `║`, `╚═|〔 ${_mbName} 〕`];
            await sock.sendMessage(chatId, {
              text: _mbLines.join("\n")
            }, {
              quoted: msg
            });
          } else {
            await sock.sendMessage(chatId, {
              text: `╔═|〔  MEMBER DETECTOR 〕\n║\n║ ▸ *Status* : ❌ Not initialized\n║\n╚═|〔 ${getCurrentBotName()} 〕`
            }, {
              quoted: msg
            });
          }
          break;
        }
      case "welcomeset":
      case "welcomeconfig":
        {
          const _wcName = getCurrentBotName();
          await sock.sendMessage(chatId, {
            text: [`╔═|〔  WELCOME SYSTEM 〕`, `║`, `║ ▸ *Status*  : ✅ Auto-enabled`, `║`, `║ ▸ *How it works*:`, `║   1. Bot detects new group members`, `║   2. Sends welcome with profile pic`, `║   3. Mentions the new member`, `║`, `║ ▸ *Variables*:`, `║   {name}    → member's name`, `║   {group}   → group name`, `║   {members} → total members`, `║   {mention} → mention tag`, `║`, `╚═|〔 ${_wcName} 〕`].join("\n")
          }, {
            quoted: msg
          });
          break;
        }
      case "ultimatefix":
      case "solveowner":
      case "fixall":
        {
          try {
            await sock.sendMessage(chatId, {
              react: {
                text: "🔧",
                key: msg.key
              }
            });
          } catch {}
          const _ufName = getCurrentBotName();
          const fixSenderJid = msg.key.participant || chatId;
          const fixCleaned = jidManager.cleanJid(fixSenderJid);
          if (!jidManager.isOwner(msg) && !msg.key.fromMe) {
            await sock.sendMessage(chatId, {
              text: `╔═|〔  ULTIMATEFIX 〕\n║\n║ ▸ *Access* : ❌ Owner only\n║\n╚═|〔 ${_ufName} 〕`
            }, {
              quoted: msg
            });
            return;
          }
          const fixResult = await ultimateFixSystem.applyUltimateFix(sock, fixSenderJid, fixCleaned, false);
          if (fixResult.success) {
            await sock.sendMessage(chatId, {
              text: [`╔═|〔  ULTIMATEFIX 〕`, `║`, `║ ▸ *Result*  : ✅ Applied`, `║ ▸ *Access*  : Full owner access restored`, `║`, `╚═|〔 ${_ufName} 〕`].join("\n")
            }, {
              quoted: msg
            });
          } else {
            await sock.sendMessage(chatId, {
              text: `╔═|〔  ULTIMATEFIX 〕\n║\n║ ▸ *Result* : ❌ Fix failed\n║\n╚═|〔 ${_ufName} 〕`
            }, {
              quoted: msg
            });
          }
          break;
        }
      case "prefixinfo":
        {
          try {
            await sock.sendMessage(chatId, {
              react: {
                text: "ℹ️",
                key: msg.key
              }
            });
          } catch {}
          const _piName = getCurrentBotName();
          await sock.sendMessage(chatId, {
            text: [`╔═|〔  PREFIX INFO 〕`, `║`, `║ ▸ *Current*   : "${isPrefixless ? "none" : currentPrefix}"`, `║ ▸ *Default*   : ${DEFAULT_PREFIX}`, `║ ▸ *Prefixless*: ${isPrefixless ? "✅ Enabled" : "❌ Disabled"}`, `║ ▸ *DB Cache*  : ${_cache_bot_settings ? "✅" : "❌"} settings | ${_cache_prefix_config ? "✅" : "❌"} prefix`, `║`, `║ ▸ *Tip* : Changes persist after restart`, `║`, `╚═|〔 ${_piName} 〕`].join("\n")
          }, {
            quoted: msg
          });
          break;
        }
      case "forcerestart":
        {
          try {
            await sock.sendMessage(chatId, {
              react: {
                text: "🔄",
                key: msg.key
              }
            });
          } catch {}
          const _frName = getCurrentBotName();
          if (!jidManager.isOwner(msg)) {
            await sock.sendMessage(chatId, {
              text: `╔═|〔  FORCE RESTART 〕\n║\n║ ▸ *Access* : ❌ Owner only\n║\n╚═|〔 ${_frName} 〕`
            }, {
              quoted: msg
            });
            return;
          }
          await sock.sendMessage(chatId, {
            text: [`╔═|〔  FORCE RESTART 〕`, `║`, `║ ▸ *Status* : 🔄 Restarting in 5s...`, `║`, `╚═|〔 ${_frName} 〕`].join("\n")
          }, {
            quoted: msg
          });
          setTimeout(() => {
            process.exit(1);
          }, 5000);
          break;
        }
      default:
        {
          const _prefixStr = currentPrefix || '';
          try {
            await sock.sendMessage(chatId, {
              text: `❓ *Unknown command:* \`${_prefixStr}${commandName}\`\n\nUse *${_prefixStr}menu* to see all available commands.`
            }, { quoted: msg });
          } catch {}
          break;
        }
    }
  } catch (error) {
    UltraCleanLogger.error(`Default command error: ${error.message}`);
  }
}

// // ====== MAIN APPLICATION ======
// // ====== MAIN APPLICATION ======
// // ====== MAIN APPLICATION ======
// async function main() {
//     try {
//         UltraCleanLogger.success(`Bot starting — ${getCurrentBotName()} v${VERSION}`);
//         UltraCleanLogger.info(`Loaded prefix: "${isPrefixless ? 'none (prefixless)' : getCurrentPrefix()}"`);
//         UltraCleanLogger.info(`Prefixless mode: ${isPrefixless ? '✅ ENABLED' : '❌ DISABLED'}`);
//         UltraCleanLogger.info(`Auto-connect on link: ${AUTO_CONNECT_ON_LINK ? '✅' : '❌'}`);
//         UltraCleanLogger.info(`Auto-connect on start: ${AUTO_CONNECT_ON_START ? '✅' : '❌'}`);
//         UltraCleanLogger.info(`Rate limit protection: ${RATE_LIMIT_ENABLED ? '✅' : '❌'}`);
//         UltraCleanLogger.info(`Console filtering: ✅ ULTRA CLEAN ACTIVE`);
//         UltraCleanLogger.info(`⚡ Response speed: OPTIMIZED (Reduced delays by 50-70%)`);
//         UltraCleanLogger.info(`🔐 Session ID support: ✅ ENABLED (GAAJU-MD: format)`);
//         UltraCleanLogger.info(`🎯 Member Detection: ✅ ENABLED (New members in groups)`);
//         UltraCleanLogger.info(`🔐 Anti-ViewOnce: ✅ ENABLED (Private/Auto modes)`);
//         UltraCleanLogger.info(`👥 Welcome System: ✅ ENABLED (Auto-welcome new members)`);
//         UltraCleanLogger.info(`🎯 Background processes: ✅ ENABLED`);

//         // ====== AGGRESSIVE AUTO-RECONNECT LOGIC ======
//         // 1. First try to load existing session directory
//         const sessionDirExists = fs.existsSync(SESSION_DIR);
//         const credsExist = fs.existsSync(path.join(SESSION_DIR, 'creds.json'));

//         if (sessionDirExists && credsExist) {
//             UltraCleanLogger.success('🔐 Found session directory with creds.json, attempting auto-reconnect...');

//             try {
//                 // Try to read the session file
//                 const sessionData = JSON.parse(fs.readFileSync(path.join(SESSION_DIR, 'creds.json'), 'utf8'));

//                 // Check for basic required fields (more lenient check)
//                 if (sessionData && (sessionData.noiseKey || sessionData.signedIdentityKey || sessionData.creds)) {
//                     UltraCleanLogger.success('✅ Session file looks valid, auto-connecting...');
//                     await startBot('auto', null);
//                     return;
//                 } else {
//                     UltraCleanLogger.warning('⚠️ Session file exists but may be corrupted');
//                 }
//             } catch (sessionError) {
//                 UltraCleanLogger.error(`❌ Error loading session: ${sessionError.message}`);
//             }
//         }

//         // 2. Check for SESSION_ID in .env as secondary option
//         const sessionIdFromEnv = process.env.SESSION_ID;
//         const hasEnvSession = sessionIdFromEnv && sessionIdFromEnv.trim() !== '';

//         if (hasEnvSession) {
//             UltraCleanLogger.info('🔐 Found SESSION_ID in .env, attempting auto-login...');

//             try {
//                 const sessionData = parseBotSession(sessionIdFromEnv);
//                 if (sessionData) {
//                     UltraCleanLogger.success('✅ Valid session ID found in .env, auto-connecting...');
//                     await startBot('session', sessionIdFromEnv);
//                     return;
//                 }
//             } catch (error) {
//                 UltraCleanLogger.warning(`❌ Session ID validation failed: ${error.message}`);
//             }
//         }

//         // 3. If no session found, check if we should attempt pairing with saved phone
//         const ownerFileExists = fs.existsSync(OWNER_FILE);
//         if (ownerFileExists) {
//             try {
//                 const ownerData = JSON.parse(fs.readFileSync(OWNER_FILE, 'utf8'));
//                 if (ownerData.OWNER_NUMBER) {
//                     UltraCleanLogger.info(`📱 Found saved owner number: ${ownerData.OWNER_NUMBER}, attempting to reconnect...`);

//                     // Try to reconnect with saved phone number
//                     await startBot('pair', ownerData.OWNER_NUMBER);
//                     return;
//                 }
//             } catch (error) {
//                 UltraCleanLogger.warning(`Could not load owner data: ${error.message}`);
//             }
//         }

//         // 4. If all else fails, show login options
//         UltraCleanLogger.info('📱 No valid session found, showing login options...');
//         const loginManager = new LoginManager();
//         const loginInfo = await loginManager.selectMode();
//         loginManager.close();

//         const loginData = loginInfo.mode === 'session' ? loginInfo.sessionId : loginInfo.phone;
//         await startBot(loginInfo.mode, loginData);

//     } catch (error) {
//         UltraCleanLogger.error(`Main error: ${error.message}`);
//         setTimeout(async () => {
//             await main();
//         }, 8000);
//     }
// }

// ====== MAIN APPLICATION ======
// ====== MAIN APPLICATION ======
async function main() {
  try {
    // ====== HEROKU INITIALIZATION ======

    // ====== HEROKU DETECTION & SETUP ======
    const isHeroku = process.env.HEROKU_APP_NAME || process.env.DYNO || process.env.HEROKU_API_KEY || false;
    const herokuSessionId = process.env.SESSION_ID;
    if (isHeroku) {
      UltraCleanLogger.info(`🏗️ Platform: ${detectPlatform()}`);
      UltraCleanLogger.info(`📦 Dyno: ${process.env.DYNO || "Unknown"}`);

      // Check if we have SESSION_ID from Heroku Config Vars
      if (herokuSessionId && herokuSessionId.trim() !== "") {
        UltraCleanLogger.success("🔐 Heroku SESSION_ID detected");

        // Setup Heroku session automatically
        const herokuSetupSuccess = setupHerokuSession();
        if (herokuSetupSuccess) {
          UltraCleanLogger.success("✅ Heroku session configured successfully");
          UltraCleanLogger.info("🔄 Starting bot with Heroku session...");

          // Auto-start with Heroku session
          await startBot("auto", null);
          return;
        } else {
          UltraCleanLogger.warning("⚠️ Heroku session setup failed, falling back to normal login");
        }
      } else {
        UltraCleanLogger.warning("⚠️ Heroku detected but no SESSION_ID found");
        UltraCleanLogger.info("💡 Add SESSION_ID to Heroku Config Vars for auto-login");
      }
    }
    try {
      await _dbInitPromise;
    } catch {}
    if (!_cache_prefix_config) {
      try {
        _cache_prefix_config = await _loadConfigCache("prefix_config", {
          prefix: DEFAULT_PREFIX
        });
      } catch {}
    }
    prefixCache = loadPrefixFromFiles();
    isPrefixless = prefixCache === "" ? true : false;
    printStartupBox();
    await setupWebServer();
    setupHerokuKeepAlive();
    DiskManager.start();

    // ====== AUTO-RECONNECT LOGIC ======
    // 1. First try SESSION_ID from .env (works on any platform)
    const sessionIdFromEnv = process.env.SESSION_ID;
    const hasEnvSession = sessionIdFromEnv && sessionIdFromEnv.trim() !== "";

    // Auto-restore session from backup if session files are missing
    // Primary: session/creds_backup.json (inside .gitignored dir — survives git clean -fd)
    // Secondary: data/session_creds_backup.json (redundant)
    const _primaryBackup = path.join(SESSION_DIR, "creds_backup.json");
    const _dataBackup = path.join("./data", "session_creds_backup.json");
    if (!fs.existsSync(path.join(SESSION_DIR, "creds.json"))) {
      const _backupSrc = fs.existsSync(_primaryBackup) ? _primaryBackup : fs.existsSync(_dataBackup) ? _dataBackup : null;
      if (_backupSrc) {
        try {
          if (!fs.existsSync(SESSION_DIR)) {
            fs.mkdirSync(SESSION_DIR, {
              recursive: true
            });
          }
          fs.copyFileSync(_backupSrc, path.join(SESSION_DIR, "creds.json"));
          UltraCleanLogger.success("✅ Session restored from backup: " + _backupSrc);
        } catch (_restoreErr) {
          UltraCleanLogger.warning("⚠️ Could not restore session backup: " + _restoreErr.message);
        }
      }
    }
    const sessionDirExists = fs.existsSync(SESSION_DIR);
    const credsPath = path.join(SESSION_DIR, "creds.json");
    const credsExist = fs.existsSync(credsPath);
    if (sessionDirExists && credsExist) {
      try {
        const existingCreds = JSON.parse(fs.readFileSync(credsPath, "utf8"));
        if (existingCreds && (existingCreds.noiseKey || existingCreds.signedIdentityKey)) {
          UltraCleanLogger.success("🔐 Found existing evolved session, using it (not overwriting with SESSION_ID)...");
          await startBot("auto", null);
          return;
        }
      } catch (readErr) {
        UltraCleanLogger.warning(`⚠️ Existing creds.json unreadable: ${readErr.message}`);
      }
    }
    if (hasEnvSession) {
      UltraCleanLogger.info("🔐 No valid existing session, applying SESSION_ID...");
      try {
        const parsedSession = parseBotSession(sessionIdFromEnv);
        if (parsedSession) {
          ensureSessionDir();
          fs.writeFileSync(credsPath, JSON.stringify(parsedSession, null, 2));
          UltraCleanLogger.success("✅ Session ID applied to creds.json, auto-connecting...");
          await startBot("auto", null);
          return;
        }
      } catch (error) {
        UltraCleanLogger.warning(`⚠️ SESSION_ID parsing failed: ${error.message}`);
      }
    }

    // 3. Fallback: try existing session that might have creds but no noise/signal keys
    if (sessionDirExists && credsExist) {
      UltraCleanLogger.success("🔐 Found existing session, attempting auto-reconnect...");
      try {
        const sessionData = JSON.parse(fs.readFileSync(credsPath, "utf8"));
        if (sessionData && (sessionData.noiseKey || sessionData.signedIdentityKey || sessionData.creds)) {
          UltraCleanLogger.success("✅ Session file valid, auto-connecting...");
          await startBot("auto", null);
          return;
        } else {
          UltraCleanLogger.warning("⚠️ Session file exists but may be corrupted");
        }
      } catch (sessionError) {
        UltraCleanLogger.error(`❌ Error loading session: ${sessionError.message}`);
      }
    }

    // 3. Check for PHONE_NUMBER env var (explicit override for pairing)
    if (process.env.PHONE_NUMBER && process.env.PHONE_NUMBER.trim() !== "") {
      const envPhone = process.env.PHONE_NUMBER.replace(/[^0-9]/g, "");
      if (envPhone.length >= 10) {
        UltraCleanLogger.info(`📱 PHONE_NUMBER env var found: ${envPhone}, auto-pairing...`);
        await startBot("pair", envPhone);
        return;
      }
    }

    // 4. If all else fails, show login options — but skip readline on any headless/cloud env
    const isRailway = !!process.env.RAILWAY_ENVIRONMENT || !!process.env.RAILWAY_PROJECT_NAME || !!process.env.RAILWAY_PROJECT_ID || !!process.env.RAILWAY_SERVICE_NAME;
    const isCloudEnv = isHeroku || isRailway || !!process.env.RENDER || !!process.env.RENDER_SERVICE_ID || !!process.env.KOYEB_APP || !!process.env.KOYEB_REGION;
    if (isCloudEnv) {
      const platformLabel = isRailway ? "Railway" : isHeroku ? "Heroku" : "Cloud";
      UltraCleanLogger.error(`❌ ${platformLabel} deployment: No valid session found`);
      UltraCleanLogger.info("💡 Set SESSION_ID in your environment/service variables and restart.");
      setInterval(() => {
        UltraCleanLogger.warning("⏳ Waiting for SESSION_ID to be configured — set it in env vars and restart.");
      }, 600000);
      return;
    }

    // 5. Show login options for interactive environments
    UltraCleanLogger.info("📱 No valid session found, showing login options...");
    const loginManager = new LoginManager();
    const loginInfo = await loginManager.selectMode();
    loginManager.close();
    const loginData = loginInfo.mode === "session" ? loginInfo.sessionId : loginInfo.phone;
    await startBot(loginInfo.mode, loginData);
  } catch (error) {
    UltraCleanLogger.error(`Main error: ${error.message}`);

    // Handle restarts based on platform
    if (process.env.HEROKU || process.env.DYNO) {
      // Longer delay on Heroku to avoid rapid restarts
      UltraCleanLogger.warning("🔄 Heroku restart scheduled in 30 seconds...");
      setTimeout(async () => {
        await main();
      }, 30000);
    } else {
      // Faster restart for local/panel deployments
      UltraCleanLogger.warning("🔄 Restarting in 8 seconds...");
      setTimeout(async () => {
        await main();
      }, 8000);
    }
  }
}
// ====== PROCESS HANDLERS ======
process.on("SIGINT", () => {
  console.log(chalk.yellow("\n👋 Shutting down gracefully..."));
  stopHeartbeat();
  memoryMonitor.stop();
  if (SOCKET_INSTANCE) {
    SOCKET_INSTANCE.ws.close();
  }
  process.exit(0);
});
let _isRecoveringFromException = false;
process.on("uncaughtException", error => {
  UltraCleanLogger.error(`Uncaught exception: ${error.message}`);
  UltraCleanLogger.error(error.stack);
  if (!error.message?.includes("SIGINT") && !error.message?.includes("shutdown")) {
    if (_isRecoveringFromException) {
      UltraCleanLogger.error("Recovery already in progress, skipping duplicate recovery attempt.");
      return;
    }
    _isRecoveringFromException = true;
    setTimeout(async () => {
      UltraCleanLogger.info("🔄 Auto-recovering from uncaught exception...");
      try {
        await main();
      } catch (e) {
        UltraCleanLogger.error(`Recovery failed: ${e.message}`);
      } finally {
        _isRecoveringFromException = false;
      }
    }, 5000);
  }
});
process.on("unhandledRejection", error => {
  UltraCleanLogger.error(`Unhandled rejection: ${error?.message || error}`);
});

// Start the bot
main().catch(error => {
  UltraCleanLogger.critical(`Fatal error: ${error.message}`);
  process.exit(1);
});
