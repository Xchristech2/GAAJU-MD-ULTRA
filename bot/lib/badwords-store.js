function checkMessageForBadWord(msg) { return false; }
function isGroupEnabled(gid) { return false; }
function getGroupAction(gid) { return 'warn'; }
module.exports = { checkMessageForBadWord, isGroupEnabled: isGroupEnabled, isBadWordEnabled: isGroupEnabled, isGroupEnabled, getGroupAction, getBadWordAction: getGroupAction };
