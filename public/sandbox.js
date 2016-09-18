'use strict';
/**
 * Custom Events.
 *
 * @type {Object<String, Event>}
 * @protected
 *
 $.events = {};
 /**
 *
 * @param {string | Object} url
 * @param url.url
 * @param url.type
 * @param url.method
 * @param url.success
 * @param url.error
 * @param {url} options
 * @param options.url
 * @param options.type
 * @param options.method
 * @param options.success
 * @param options.error
 * @deprecated
 *
 $.ajax = (url, options) => {

};*/
/*$.eventExists = name => {
 //Defined events
 if ('animationend, animationiteration, animationstart, beginEvent, endEvent, repeatEvent, ' +
 'chargingchange chargingtimechange, dischargingtimechange levelchange, ' +
 'alerting, busy, callschanged cfstatechange, connected, connecting, dialing, disconnected, disconnecting, error, held, holding, incoming, resuming, statechange, voicechange, ' +
 'CssRuleViewRefreshed, CssRuleViewChanged, CssRuleViewCSSLinkClicked, transitionend abort, blocked, complete, error (link), success, upgradeneeded, versionchange, ' +
 'DOMLinkAdded, DOMLinkRemoved, DOMMetaAdded, DOMMetaRemoved, DOMWillOpenModalDialog, DOMModalDialogClosed, unload, ' +
 'DOMAttributeNameChanged, DOMAttrModified, DOMCharacterDataModified, DOMContentLoaded, DOMElementNameChanged, DOMNodeInserted, DOMNodeInsertedIntoDocument, DOMNodeRemoved, DOMNodeRemovedFromDocument, DOMSubtreeModified, ' +
 'drag, dragdrop, dragend, dragenter, dragexit, draggesture, dragleave, dragover, dragstart, drop, ' +
 'invalid, overflow, underflow, DOMAutoComplete, command, commandupdate, ' +
 'blur, change, DOMFocusIn, DOMFocusOut, focus, focusin, focusout, ' +
 'reset, submit, ' +
 'mozbrowserclose, mozbrowsercontextmenu, mozbrowsererror, mozbrowsericonchange, mozbrowserlocationchange, mozbrowserloadend, mozbrowserloadstart, mozbrowseropenwindow, mozbrowsersecuritychange, mozbrowsershowmodalprompt (link), mozbrowsertitlechange, DOMFrameContentLoaded, ' +
 'click, contextmenu, DOMMouseScroll, dblclick, gamepadconnected, gamepaddisconnected, keydown, keypress, keyup, MozGamepadButtonDown, MozGamepadButtonUp, mousedown, mouseenter, mouseleave, mousemove, mouseout, mouseover, mouseup, mousewheel, MozMousePixelScroll, pointerlockchange, pointerlockerror, wheel, ' +
 'audioprocess, canplay, canplaythrough, durationchange, emptied, ended, ended, loadeddata, loadedmetadata, MozAudioAvailable, pause, play, playing, ratechange, seeked, seeking, stalled, suspend, timeupdate, volumechange, waiting, complete, ' +
 'DOMMenuItemActive, DOMMenuItemInactive, ' +
 'datachange, dataerror, disabled, enabled, offline, online, statuschange, connectionInfoUpdate, ' +
 'AlertActive, AlertClose, ' +
 'pointerover, pointerenter, pointerdown, pointermove, pointerup, pointercancel, pointerout, pointerleave, gotpointercapture, lostpointercapture, ' +
 'popuphidden, popuphiding, popupshowing, popupshown, DOMPopupBlocked, ' +
 'afterprint, beforeprint, ' +
 'abort, error, load, loadend, loadstart, progress, progress, timeout, uploadprogress, ' +
 'abort, cached, error, load, ' +
 'afterscriptexecute, beforescriptexecute, ' +
 'compassneedscalibration, devicelight, devicemotion, deviceorientation, deviceproximity, MozOrientation, orientationchange, userproximity, ' +
 'pagehide, pageshow, popstate, ' +
 'icccardlockerror, iccinfochange, smartcard-insert, smartcard-remove, stkcommand, stksessionend, cardstatechange, ' +
 'delivered, received, sent, ussdreceived, ' +
 'change, storage, ' +
 'SVGAbort, SVGError, SVGLoad, SVGResize, SVGScroll, SVGUnload, SVGZoom, ' +
 'tabviewsearchenabled, tabviewsearchdisabled, tabviewframeinitialized, tabviewshown, tabviewhidden, TabOpen, TabClose, TabSelect, TabShow, TabHide, TabPinned, TabUnpinned, SSTabClosing, SSTabRestoring, SSTabRestored, visibilitychange, ' +
 'compositionend, compositionstart, compositionupdate, copy, cut, paste, select, text, ' +
 'MozEdgeUIGesture, MozMagnifyGesture, MozMagnifyGestureStart, MozMagnifyGestureUpdate, MozPressTapGesture, MozRotateGesture, MozRotateGestureStart, MozRotateGestureUpdate, MozSwipeGesture, MozTapGesture, MozTouchDown, MozTouchMove, MozTouchUp, touchcancel, touchend, touchenter, touchleave, touchmove, touchstart, ' +
 'checking, downloading, error, noupdate, obsolete, updateready, ' +
 'broadcast, CheckboxStateChange, hashchange, input, RadioStateChange, readystatechange, ValueChange, ' +
 'fullscreen, fullscreenchange, fullscreenerror, MozEnteredDomFullscreen, MozScrolledAreaChanged, resize, scroll, sizemodechange, ' +
 'close, error, message, open, ' +
 'DOMWindowCreated, DOMWindowClose, DOMTitleChanged, MozBeforeResize, SSWindowClosing, SSWindowStateReady, SSWindowStateBusy, close, ' +
 'beforeunload, localized, message, message, message, MozAfterPaint, moztimechange, open, show, '.includes(name)) return true;
 return $.events.hasOwnProperty(name);
 };
 $.createEvent = (name, details) => {
 if (!$.eventExists(name)) {
 let event;
 if (details) {

 } else {
 event = new Event(name);
 }
 $.events[name] = '';
 }
 };*/
/**
 * @param {string} value
 * @returns {Number | Boolean | string}
 */
let returnExactType = value => !isNaN(Number.parseFloat(value)) ? Number.parseFloat(value) : parseBoolean(value) != undefined ? parseBoolean(value) : value;
/**
 *
 * @param {string} search
 * @param {string} replace
 * @returns {string}
 */
String.prototype.replaceAll = function(search, replace) {
    return (() => this.split(search).join(replace))()
};
/**
 *
 * @param {Number} index
 * @param {string} replace
 * @returns {string}
 */
String.prototype.replaceIndex = function(index, replace) {
    return (() => {
        let split = this.split('');
        let newSplit = [];
        for (let char of split) if (char != '') newSplit.push(char);
        newSplit[index] = replace;
        return newSplit.join();
    })()
};
/**
 * Parse a string to a boolean; undefined if it is not a boolean
 *
 * @param {string} value
 */
let parseBoolean = value => value == 'true' ? true : value == 'false' ? false : undefined;
/**
 *
 * @param {string | function(Event)} selector
 * @param {Object<string, string>} [attributes]
 * @param {Object<string, string>} [css]
 * @returns {Element | NodeList | Element}
 */
let $ = (selector, attributes, css) => {
    if (selector instanceof Function) return document.addEventListener('DOMContentLoaded', selector);
    /** @type {Element | NodeList | Element} */
    let element;
    function setAttr(lastKey, attrs, value, insideAttr) {
        let firstIndex = (value.indexOf('"') == 0 ? 1 : value.indexOf('\'') == 0 ? 1 : 0);
        let lastIndex = value.lastIndexOf('"') == value.length - 1 ? 1 : value.lastIndexOf('\'') == value.length - 1 ? 1 : 0;
        attrs[lastKey] = (insideAttr ? attrs[lastKey] + ' ' : '') + value.substr(firstIndex, value.length - lastIndex - (insideAttr ? 0 : 1));
        return lastIndex == 1 ? false : firstIndex == 1 ? true : insideAttr;
    }
    if (selector.includes('<') && selector.includes('>')) {
        if (selector.includes(' ')) {
            selector = selector.substr(1, selector.length - 2);
            let type = '';
            let insideAttr = false;
            let attrs = {};
            /** @type {string[]} */
            let values = selector.split('=');
            let lastKey = '';
            for (let i = 0; i < values.length; i++) {
                /** @type {string[]} */
                let subValues = values[i].split(' ');
                for (let j = 0; j < subValues.length; j++) {
                    if (i == 0 && j == 0) type = subValues[j];
                    else if ((subValues.length == 1 || j == 0) || (insideAttr && j != subValues.length - 1))
                        insideAttr = setAttr(lastKey, attrs, subValues[j], insideAttr);
                    else attrs[lastKey = subValues[j]] = '';
                }
            }
            element = document.createElement(type);
            element.attr(attrs);
        } else {
            element = document.createElement(selector.replace('<', '').replace('>', ''));
            if (attributes) element.attr(attributes);
            if (css) element.css(css);
        }
    } else {
        let nodeList = document.querySelectorAll(selector);
        if (nodeList.length > 1) element = nodeList;
        else element = document.querySelector(selector);
    }
    return element;
};
/**
 * (Basic cookie framework MDN [https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie/Simple_document.cookie_framework])
 *
 * Get/create/modify a cookie.
 *
 * If only the key is present then this method returns the value of
 * the cookie or undefined if it could not find the cookie.
 *
 * If more parameters are present then this method will create/modify
 * a cookie. Return true if it was successfully created/modified false
 * if not.
 *
 * @param {string} key - The cookie key
 * @param {string | Number | Boolean | Object} [value] - The cookie value
 * @param {Number | string | Date} [end] - Then the cookie will expire
 * @param {string} [path] - The cookie path
 * @param {string} [domain] - The cookie domain
 * @param {Boolean} [secure] - If the cookie is secure
 * @returns {string | Number | Boolean | undefined}
 */
$.cookie = (key, value, end, path, domain, secure) => {
    if (!value) {
        let cookie = decodeURIComponent(document.cookie.replace(new RegExp(`(?:(?:^|.*;)\\s*${encodeURIComponent(key).replace(/[\-.+*]/g, "\\$&")}\\s*\\=\\s*([^;]*).*$)|^.*$`), "$1")) || undefined;
        if (cookie == undefined) return undefined;
        return returnExactType(cookie);
    } else {
        if (!key || /^(?:expires|max-age|path|domain|secure)$/i.test(key)) return false;
        let expires = "";
        if (end) {
            switch (end.constructor) {
                case Number:
                    expires = end === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + end;
                    break;
                case String:
                    expires = "; expires=" + end;
                    break;
                case Date:
                    expires = "; expires=" + end.toUTCString();
                    break;
            }
        }
        document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}${expires}${(domain ? "; domain=" + domain : "")}${(path ? "; path=" + path : "")}${(secure ? "; secure" : "")}`;
        return true;
    }
};
/**
 * (Basic cookie framework MDN [https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie/Simple_document.cookie_framework])
 *
 * Get all current keys of all cookies
 *
 * @returns {string[]} All keys
 */
$.cookie.keys = () => {
    let keys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (let len = keys.length, idx = 0; idx < len; idx++) { keys[idx] = decodeURIComponent(keys[idx]); }
    return keys;
};
/**
 * (Basic cookie framework MDN [https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie/Simple_document.cookie_framework])
 *
 * Check if a cookie exists
 *
 * @param {string} key
 * @returns {Boolean}
 */
$.cookie.has = key => {
    if (!key) return false;
    return (new RegExp(`(?:^|;\\s*)${encodeURIComponent(sKey).replace(/[\-.+*]/g, "\\$&")}\\s*\\=`)).test(document.cookie);
};
/**
 * (Basic cookie framework MDN [https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie/Simple_document.cookie_framework])
 *
 * Remove a cookie
 *
 * @param {string} key
 * @param {string} [path]
 * @param {string} [domain]
 */
$.cookie.remove = (key, path, domain) => {
    if ($.cookie.has(key))
        document.cookie = `${encodeURIComponent(key)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT${(domain ? "; domain=" + domain : "")}${(path ? "; path=" + path : "")}`;
};
/**
 * Add a event listener to this element.
 *
 * @this {Element}
 * @param {string} event
 * @param {EventListener | function(Event)} handler
 * @param {Boolean} [useCapture]
 * @returns {Element}
 */
Element.prototype.on = function (event, handler, useCapture) {
    return (() => {
        this.addEventListener(event, handler, !useCapture ? false : useCapture);
        return this;
    })();
};
/**
 * Set some attributes of this element.
 *
 * @this {Element}
 * @param {string | Object<string, string>} key - The key of the attribute or a key value object of ´name: value` pairs
 * @param {string | Number | Boolean} [value] - The value of the attribute
 * @returns {string | Number | Boolean | Element}
 */
Element.prototype.attr = function(key, value) {
    return (() => {
        if (!value) {
            if (typeof key == 'string') {
                /** @type {string} */
                let attributeValue = this.getAttribute(key);
                return returnExactType(attributeValue);
            } else for (let attr of Object.keys(key)) if (key.hasOwnProperty(attr)) this.setAttribute(attr, key[attr]);
        } else this.setAttribute(key, `${value}`);
        return this;
    })();
};
/**
 * Set some css styles of this element.
 *
 * @this {Element}
 * @param {string | Object<string, string>} key - The key of the attribute or a key value object of ´name: value` pairs
 * @param {string | Number | Boolean} [value] - The value of the attribute
 * @returns {string | Number | Boolean | Element}
 */
Element.prototype.css = function(key, value) {
    return (() => {
        if (!value) {
            if (typeof key == 'string') {
                /** @type {string} */
                let styleValue = this.getAttribute(key);
                return returnExactType(styleValue);
            } else for (let prop of Object.keys(key)) if (key.hasOwnProperty(prop)) this.style[prop] = key[prop];
        } else this.style[key] = `${value}`;
        return this;
    })();
};
/**
 * Get/Set the parent of this element.
 *
 * @param {Element} [parent] - The new parent
 * @returns {Node | Element} The parent or this element
 */
Element.prototype.parent = function (parent) {
    return (() => {
        if (this.nodeType == 1 || this.nodeType == 11 || this.nodeType == 9) {
            if (parent) parent.appendChild(this);
            else return this.parentNode;
        }
        return this;
    })();
};
/**
 * Get/Set the text content of this element.
 *
 * @param {string} [text] - The new text
 * @returns {string | Element}
 */
Element.prototype.text = function (text) {
    return (() => {
        if (this.nodeType == 1 || this.nodeType == 11 || this.nodeType == 9) {
            if (text) this.textContent = text;
            else return this.textContent;
        }
        return this;
    })();
};
/**
 * Get/Set the value of this element.
 *
 * @param {string | Number | Boolean} [value]
 * @returns {string | Number | Boolean | Element}
 */
Element.prototype.val = function (value) {
    return (() => {
        if (value) this.value = value;
        else return !isNaN(Number.parseFloat(this.value)) ? Number.parseFloat(this.value) :
            parseBoolean(this.value) != undefined ? parseBoolean(this.value) : this.value;
        return this;
    })();
};
/**
 * Set what is going to happen when all DOM content has loaded.
 *
 * @param {function(Event) | EventListener} handler
 * @returns {Element} This element
 */
Element.prototype.ready = function (handler) {
    return (() => {
        if (handler) document.addEventListener('DOMContentLoaded', handler);
        return this;
    })();
};
/**
 * Append one or more elements.
 *
 * @param {Element} children - The new child or children
 * @returns {Element} This element
 */
Element.prototype.append = function (...children) {
    return (() => {
        if ((this.nodeType == 1 || this.nodeType == 11 || this.nodeType == 9) && children) children.forEach(this.appendChild);
        return this;
    })();
};
/**
 * Adds all specified classes if they more not exist.
 *
 * @param {string} classes
 * @returns {Element} The current element
 */
Element.prototype.addClass = function (...classes) {
    return (() => {
        /** @type {string[]} */
        let elementClasses = this.className.split(' ');
        if (elementClasses[0] == '') elementClasses = [];
        classes.filter(clazz => !elementClasses.includes(clazz)).forEach(clazz => elementClasses.push(clazz));
        this.className = elementClasses.join(' ');
        return this;
    })();
};
/**
 * Removes all specified classes if the exist
 *
 * @param {string} classes
 * @returns {Element} The current element
 */
Element.prototype.removeClass = function (...classes) {
    return (() => {
        /** @type {string[]} */
        let elementClasses = this.className.split(' ');
        let newClasses = [];
        if (elementClasses[0] == '') elementClasses = [];
        elementClasses.filter(clazz => !classes.includes(clazz)).forEach(clazz => newClasses.push(clazz));
        this.className = newClasses.join(' ');
        if (this.className == '') this.removeAttribute('class');
        return this;
    })();
};
/**
 * Removes all classes on the element
 *
 * @returns {Element} The current element
 */
Element.prototype.removeAllClasses = function () {
    return (() => {
        this.removeAttribute('class');
        return this;
    })();
};
/**
 * Remove all of the children for this node.
 *
 * @returns {Element} This element
 */
Element.prototype.removeAllChildren = function () {
    return (() => {
        while (this.firstChild) this.removeChild(this.firstChild);
        return this;
    })();
};
Math.clamp = (value, min, max) => value < min ? min: value > max ? max : value;
class Card {

    /**
     * 
     * @param {Number} cardIndex
     * @param {string} faceImageUrl
     * @param {string} backImageUrl
     */
    constructor(cardIndex, faceImageUrl, backImageUrl) {
        /** @type {Number}
         * @private */
        this.index = cardIndex;
        /** @type {string}
         * @private */
        this.faceUrl = faceImageUrl;
        /** @type {string}
         * @private */
        this.backUrl = backImageUrl;
        /** @type {Boolean} 
         * @private */
        this.locked = false;
        /** @type {Boolean} 
         * @private */
        this.faceUp = false;
    }

    /**
     * If the front face of the card is up
     *
     * @returns {Boolean} If front face up
     * @public
     */
    isFaceUp() {
        return this.faceUp;
    }

    /**
     * If the card is locked in place
     *
     * @returns {Boolean} If card is locked
     * @public
     */
    isLocked() {
        return this.locked;
    }

    /**
     * Get the card index
     *
     * @returns {Number} Card index
     * @public
     */
    getIndex() {
        return this.index;
    }

    /**
     * Set the card index
     *
     * @param {Number} index - The new index
     * @public
     */
    setIndex(index) {
        this.index = index;
    }

    /**
     * Get the card index
     *
     * @returns {string} Card face image url
     * @public
     */
    getFaceUrl() {
        return this.faceUrl;
    }

    /**
     * Set the card face image url
     *
     * @param {string} faceUrl - The new url
     * @public
     */
    setFaceUrl(faceUrl) {
        this.faceUrl = faceUrl
    }

    /**
     * Get the card back image url
     *
     * @returns {string} Card back image url
     * @public
     */
    getBackUrl() {
        return this.backUrl;
    }

    /**
     * Set the card back image url
     *
     * @param {string} backUrl - The new url
     * @public
     */
    setBackUrl(backUrl) {
        this.backUrl = backUrl;
    }

    /**
     * 
     * @param {Element} img - The image element for this card
     * @public
     */
    flip(img) {
        if (!this.locked) img.setAttribute('src', this.faceUp = (img.getAttribute('src') == this.faceUrl) ? this.backUrl : this.faceUrl);
        else console.error('Cannot flip a locked card!');
    }
}
class Player {

    constructor(name) {
        /** @type {string}
         * @private */ this.name = name;
        /** @type {Number}
         * @private */ this.points = 0;
    }

    /**
     * Get the player name
     *
     * @returns {string} Player name
     */
    getName() {
        return this.name;
    }

    /**
     * Set the player's name
     *
     * @param {string} name - The new name
     */
    setName(name) {
        this.name = name
    }

    /**
     * Add a point or the specified amount
     *
     * @param {Number} [amount] - Nothing or a amount
     */
    addPoints(amount) {
        this.points += amount || 1;
    }

    /**
     * Remove a point or the specified amount.
     * The points can never be below 0.
     *
     * @param {Number} [amount] - Nothing or a amount
     */
    removePoints(amount) {
        this.points -= amount ? Math.min(amount, this.points) : Math.min(1, this.points);
    }

    /**
     * Get the player's points
     *
     * @returns {Number} The player points
     */
    getPoints() {
        return this.points;
    }
}
class Game {

    constructor(maxPlayers) {
        /** @type {Number}
         * @private */ this.maxPlayers = maxPlayers;
        /** @type {Number}
         * @private */ this.turnPosition = 1;
        /** @type {Player[]}
         * @private */ this.players = [];
        /** @type {Card[]}
         * @private */ this.cards = [];

        for (let i = 0; i < maxPlayers; i++)
            this.players[i] = null;
        let cardAmount = 20;
        for (let i = 0; i < cardAmount; i++)
            this.cards[i] = new Card(i, `cards/card${i % (cardAmount / 2)}.jpg`, 'cards/cardback.jpg');
        let shuffle = array => {
            let currentIndex = array.length, temporaryValue, randomIndex;
            while (0 !== currentIndex) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
            return array;
        };
        shuffle(this.cards);
    }

    getTurnPosition() {
        return this.turnPosition;
    }

    nextPlayerTurn() {
        this.turnPosition = this.turnPosition + 1 > this.maxPlayers ? 1 : this.turnPosition++;
    }

    /**
     * Get the player array
     *
     * @returns {Player[]} Player array
     */
    getPlayers() {
        return this.players;
    }

    /**
     * Get the number of max players
     *
     * @returns {Number} Max players
     */
    getMaxPlayers() {
        return this.maxPlayers;
    }

    /**
     * Get a player from the player array
     *
     * @param {Number} index - The index not position
     * @returns {null | Player}
     */
    getPlayer(index) {
        if (index + 1 > this.maxPlayers || index < 0 || this.players[index] == null) {
            console.error('Trying to get a player that does not exist');
            return null;
        }
        return this.players[index];
    }

    /**
     * Add a player to the game
     *
     * @param {Number} position - The game position
     * @param {string} [name] - The player name
     * @returns {Boolean | Player} False if player creation failed else the created player
     */
    addPlayer(position, name) {
        let indexPos = position - 1;
        if (position > this.maxPlayers || position < 0 || this.players[indexPos] != null) {
            console.error('The position specified is higher or lower than the limit');
            return false;
        }
        this.players[indexPos] = new Player(name || `Player ${position}`);
        return this.players[indexPos];
    }

    /**
     * Remove a player from the game
     *
     * @param {Number} position - The game position
     * @returns {Player | null} The removed player
     */
    removePlayer(position) {
        let player = this.players[position - 1];
        this.players[position - 1] = null;
        return player;
    }

    /**
     * Get all cards
     *
     * @returns {Card[]} All cards
     */
    getCards() {
        return this.cards;
    }

    /**
     * Get a card by index
     *
     * @param {Number} index - Th card index
     * @returns {Card} The card
     */
    getCard(index) {
        return this.cards[index];
    }
}



let startScreen = () => {
    console.log($.cookie('_csrf'));
    /** @type {Element} */
    let body = $(`body`);
    /** @type {Element} */
    let playerNumberInput = $(`<input type="range" max="8" min="2">`).parent(body);
    /** @type {Element} */
    let playerNumber = $(`<span>`).text('Players: 5').parent(body);
    /** @type {Element} */
    let startButton = $(`<button>`).text('Start').parent(body);
    playerNumberInput.on('input', event => playerNumber.text(`Players: ${event.target.val()}`));
    playerNumberInput.on('change', event => playerNumber.text(`Players: ${event.target.val()}`));
    startButton.on('click', function () {
        /** @type {Game} */
        let game = new Game($(`input`).val());
        console.log(`Max Players: ${game.getMaxPlayers()}`);
        body.removeAllChildren();
        let cardContainer = $(`<div class="card-container">`).parent(body);
        for (let card of game.getCards()) {
            let cardImage = $(`<img src="${card.getBackUrl()}" class="card" height="100" width="100" data-card-index="${card.getIndex()}">`).on('click', event => {
                /** @type {Element} */
                let cardImage = event.target;
                let card = game.getCard(Number.parseInt(cardImage.attr('data-card-index')));
                card.flip(cardImage);
            }).parent(cardContainer);
        }
        let playerList = $(`<ul class="player-list">`).parent(body);
        function setNewName(event, shouldNameSet, stateChange) {
            /** @type {Number} */
            let dci = Number.parseInt(event.target.parentNode.attributes['data-creating-index'].value);
            let editImage = $(`div[data-creating-index='${dci}'] > img`);
            let playerName = $(`div[data-creating-index='${dci}'] > span`);
            let playerNameInput = $(`div[data-creating-index='${dci}'] > input`);
            if ((event.keyCode && event.keyCode == 13) || !event.keyCode) {
                if ((shouldNameSet != undefined && shouldNameSet) || event.keyCode == 13)
                    playerName.text(playerNameInput.val() == '' ? playerName.text() : playerNameInput.val());
                editImage.attr('src', 'https://s-media-cache-ak0.pinimg.com/favicons/e5841c5219f87203429584b99e8953bef138064966804862bbb136e3.png?9da9720952c463e9f05b27baef4b8e3b');
                playerName.css('display', '');
                playerNameInput.css('display', 'none');
            }
            if (stateChange) {
                if (!editImage.attr('src').includes('https://image')) {
                    playerNameInput.css('display', 'inline-block');
                    editImage.attr('src', 'https://image.freepik.com/free-icon/cancel-or-close-cross-symbol_318-30725.jpg');
                    playerNameInput.focus();
                } else setNewName(event, false);
            }
        }
        let i = 0;
        for (let player of game.getPlayers()) {
            let item = $(`<li class="player-drop-zone">`).parent(playerList);
            let playerItem = $(`<div class="player-draggable" draggable="true" data-creating-index="${++i}">`).on('dragstart', event => event.dataTransfer.setData('text/plain',null)).parent(item);
            let playerName = $(`<span>`).text(player == null ? 'Slot available' : player.getName()).parent(playerItem);
            let nameInput = $(`<input class="new-player-name" autocomplete>`).on('blur', event => setNewName(event, true)).on('keyup', setNewName).parent(playerItem);
            let editPlayerName = $(`<img src="https://s-media-cache-ak0.pinimg.com/favicons/e5841c5219f87203429584b99e8953bef138064966804862bbb136e3.png?9da9720952c463e9f05b27baef4b8e3b" class="name-edit" height="20" width="20">`).parent(playerItem);
            editPlayerName.on('click', event => setNewName(event, false, true));
        }
    });
};
$(startScreen);

let dragged;
/* events fired on the draggable target */
document.addEventListener("drag", event => {

});
document.addEventListener("dragstart", event => {
    // store a ref. on the dragged elem
    dragged = event.target;
    // make it half transparent
    //event.target.style.opacity = .5;
});
document.addEventListener("dragend", event => {
    // reset the transparency
    event.target.style.opacity = "";
});
/* events fired on the drop targets */
document.addEventListener("dragover", event => {
    // prevent default to allow drop
    event.preventDefault();
});
document.addEventListener("dragenter", event => {
    // highlight potential drop target when the draggable element enters it
    if (event.target.className.includes("player-drop-zone"))
        event.target.style.background = "lightblue";
    if (event.target.className.includes("player-draggable"))
        event.target.style.background = "lightblue";
});
document.addEventListener("dragleave", event => {
    // reset background of potential drop target when the draggable element leaves it
    if (event.target.className.includes("player-drop-zone"))
        event.target.style.background = "";
    if (event.target.className.includes("player-draggable"))
        event.target.style.background = "";
});
document.addEventListener("drop", event => {
    // prevent default action (open as link for some elements)
    event.preventDefault();
    // move dragged elem to the selected drop target
    if ( event.target.className == "player-drop-zone" ) {
        event.target.style.background = "";
        let targetChild = event.target.firstChild;
        dragged.parentNode.appendChild(targetChild);
        dragged.parentNode.removeChild( dragged );
        event.target.appendChild( dragged );
    }
    if ( event.target.className == "player-draggable" ) {
        event.target.parentNode.style.background = "";
        let parent = event.target.parentNode;
        let targetChild = event.target.parentNode.firstChild;
        dragged.parentNode.appendChild(targetChild);
        //dragged.parentNode.removeChild( dragged );
        parent.appendChild( dragged );
    }
});