'use strict';

let _channelMode = false;
let _setBy       = null;
let _channelInfo = { name: 'GAAJU-MD ULTRA', jid: null };

function isChannelModeEnabled()       { return _channelMode; }
function setChannelMode(val, who)     { _channelMode = !!val; _setBy = who || null; }
function getChannelModeSetBy()        { return _setBy; }
function getChannelInfo()             { return { ..._channelInfo }; }
function setChannelInfo(jid, name)    { _channelInfo = { jid: jid || null, name: name || 'GAAJU-MD ULTRA' }; }

module.exports = { isChannelModeEnabled, setChannelMode, getChannelModeSetBy, getChannelInfo, setChannelInfo };
