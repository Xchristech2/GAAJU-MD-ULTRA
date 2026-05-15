'use strict';

let _buttonMode = false;
let _setBy      = null;

function isButtonModeEnabled()       { return _buttonMode; }
function setButtonMode(val, who)     { _buttonMode = !!val; _setBy = who || null; }
function getButtonModeSetBy()        { return _setBy; }
function isGiftedBtnsAvailable()     { try { require('gifted-btns'); return true; } catch { return false; } }

module.exports = { isButtonModeEnabled, setButtonMode, getButtonModeSetBy, isGiftedBtnsAvailable };
