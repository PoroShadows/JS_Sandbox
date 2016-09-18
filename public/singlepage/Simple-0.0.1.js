'use strict';
//noinspection JSValidateTypes
/**
 *
 * @type {string, function(Event)}
 * @returns {string | void}
 */
let hashHandlers = {};
/**
 * All handlers for handeling the device battery.
 * @type {Set}
 */
let batteryHandlers = new Set();
/**
 * Parse a string to a boolean; undefined if it is not a boolean
 *
 * @public
 * @param {string} value
 * @returns {boolean | undefined}
 */
let parseBoolean = value => value == 'true' ? true : value == 'false' ? false : undefined;
/**
 * @public
 * @param {string} value
 * @returns {number | boolean | string}
 */
let returnExactType = value => !isNaN(Number.parseFloat(value)) ? Number.parseFloat(value) : parseBoolean(value) != undefined ? parseBoolean(value) : value;
/**
 * @private
 * @constructor
 */
function BatteryManager2() {
    /**@type {boolean}
     * @public */this.charging = false;
    /**@type {number}
     * @public */this.level = 0;
    /**@type {number}
     * @public */this.chargingTime = 0;
    /**@type {number}
     * @public */this.dischargingTime = 0;
    /**@type {Function}
     * @public*/this.onlevelchange = null;
    /**@type {Function}
     * @public*/this.onchargingchange = null;
    /**@type {Function}
     * @public*/this.onchargingtimechange = null;
    /**@type {Function}
     * @public*/this.ondischargingtimechange = null;
    /**@public
     * @param {string} event
     * @param {Function} handler
     * @param {boolean} [useCapture]
     * @returns {void}
     */this.addEventListener = function (event, handler, useCapture = false) {};
    /**@public
     * @param {string} event
     * @param {Function} handler
     * @param {boolean} [useCapture]
     * @returns {void}
     */this.removeEventListener = function (event, handler, useCapture = false) {};
}
/**
 * @public
 * @param {HTMLElement} element
 * @constructor
 */
function Basic(element) {
    /**@type {HTMLElement}
     * @public*/
    this.element = element;
}
/**
 * Get/set/create a attribute for the element.
 *
 * @this {Simple}
 * @param {string | object} key
 * @param {string} [value]
 * @returns {Simple | number | boolean | string}
 */
Basic.prototype.attr = function (key, value) {
    return (() => {
        if (!value) {
            if (typeof key == 'string')
                return returnExactType(this.element.getAttribute(key));
            else for (let attr of Object.keys(key)) if (key.hasOwnProperty(attr)) this.element.setAttribute(attr, key[attr]);
        } else this.element.setAttribute(key, `${value}`);
        return this;
    })()
};
/**
 * Get/set the parent of the element.
 *
 * @param {Element} [parent] - The new parent
 * @returns {Node | Simple} The parent or this element
 */
Basic.prototype.parent = function (parent) {
    return (() => {
        if (this.element.nodeType == 1 || this.element.nodeType == 11 || this.element.nodeType == 9) {
            if (parent) parent.appendChild(this.element);
            else return this.element.parentNode;
        }
        return this;
    })();
}
/**
 * Get/set the text content of this element.
 *
 * @param {string} [text] - The new text
 * @returns {string | Simple}
 */
Basic.prototype.text = function (text) {
    return (() => {
        if (this.element.nodeType == 1 || this.element.nodeType == 11 || this.element.nodeType == 9) {
            if (text) this.element.textContent = text;
            else return this.element.textContent;
        }
        return this;
    })();
}
/**
 * Set some css styles of this element.
 *
 * @this {Element}
 * @param {string | Object<string, string>} key - The key of the attribute or a key value object of ´name: value` pairs
 * @param {string | number | boolean} [value] - The value of the attribute
 * @returns {string | number | boolean | Basic}
 */
Basic.prototype.css = function (key, value) {
    return (() => {
        if (!value) {
            if (typeof key == 'string') {
                /** @type {string} */
                let styleValue = this.element.getAttribute(key);
                return returnExactType(styleValue);
            } else for (let prop of Object.keys(key)) if (key.hasOwnProperty(prop)) this.element.style[prop] = key[prop];
        } else this.element.style[key] = `${value}`;
        return this;
    })();
};
/**
 * Add a event listener to this element.
 *
 * @this {Element}
 * @param {string} event
 * @param {function(Event) | function()} handler
 * @param {boolean} [useCapture]
 * @returns {Basic}
 */
Basic.prototype.on = function (event, handler, useCapture) {
    return (() => {
        this.element.addEventListener(event, handler, !useCapture ? false : useCapture);
        return this;
    })();
};
/**
 * Get/Set the value of this element.
 *
 * @param {string | number | boolean} [value]
 * @returns {string | number | boolean | Basic}
 */
Basic.prototype.val = function (value) {
    return (() => {
        if (value) this.element.value = value;
        else return returnExactType(this.element.value);
        return this;
    })();
};
/**
 * Append one or more elements.
 *
 * @param {Element} children - The new child or children
 * @returns {Basic}
 */
Basic.prototype.append = function (...children) {
    return (() => {
        if ((this.element.nodeType == 1 || this.element.nodeType == 11 || this.nodeType == 9) && children)
            children.forEach(this.element.appendChild);
        return this;
    })();
};
/**
 * Adds all specified classes if they more not exist.
 *
 * @param {string} classes
 * @returns {Basic}
 */
Basic.prototype.addClass = function (...classes) {
    return (() => {
        /** @type {string[]} */
        let elementClasses = this.element.className.split(' ');
        if (elementClasses[0] == '') elementClasses = [];
        classes.filter(clazz => !elementClasses.includes(clazz)).forEach(clazz => elementClasses.push(clazz));
        this.element.className = elementClasses.join(' ');
        return this;
    })();
};
/**
 * Removes all specified classes if the exist
 *
 * @param {string} classes
 * @returns {Basic}
 */
Basic.prototype.removeClass = function (...classes) {
    return (() => {
        /** @type {string[]} */
        let elementClasses = this.element.className.split(' ');
        let newClasses = [];
        if (elementClasses[0] == '') elementClasses = [];
        elementClasses.filter(clazz => !classes.includes(clazz)).forEach(clazz => newClasses.push(clazz));
        this.element.className = newClasses.join(' ');
        if (this.element.className == '') this.element.removeAttribute('class');
        return this;
    })();
};
/**
 * Removes all classes on the element
 *
 * @returns {Basic}
 */
Basic.prototype.removeAllClasses = function () {
    return (() => {
        this.element.removeAttribute('class');
        return this;
    })();
};
/**
 * Remove all of the children for this node.
 *
 * @returns {Basic}
 */
Basic.prototype.removeAllChildren = function () {
    return (() => {
        while (this.element.firstChild) this.element.removeChild(this.element.firstChild);
        return this;
    })();
};
/**
 * @returns {HTMLElement}
 */
Basic.prototype.get = function () {
    return (() => this.element)();
}
/**
 *
 * @public
 * @param {function(Event)} handler
 * @returns {void}
 */
Basic.ready = handler => document.addEventListener('DOMContentLoaded', handler);
/**
 * @public
 * @param {HTMLElement | string} element
 * @returns {Basic}
 */
Basic.more = element => new Basic(typeof element === 'string' ? Basic.element(element) : element);
/**
 * Create / select elements.
 *
 * Select elements with a query selector.
 *
 * Create elements by setting the element param to tag name and
 * attributes as a key value pair with attribute name is the key
 * and value is the attribute value.
 *
 * Or create elements with html markup. Examples:
 * '<input value="2" type="text" required>'
 * '<div class="shadow">'
 *
 * @public
 * @param {string} element
 * @param {Object<string, string>} [attributes]
 * @returns {Element | NodeList}
 */
Basic.element = (element, attributes) => {
    /** @type {Element | NodeList} */
    let returnElement;

    function setAttr(lastKey, attrs, value, insideAttr) {
        let firstIndex = (value.indexOf('"') == 0 ? 1 : value.indexOf('\'') == 0 ? 1 : 0);
        let lastIndex = value.lastIndexOf('"') == value.length - 1 ? 1 : value.lastIndexOf('\'') == value.length - 1 ? 1 : 0;
        attrs[lastKey] = (insideAttr ? attrs[lastKey] + ' ' : '') + value.substr(firstIndex, value.length - lastIndex - (insideAttr ? 0 : 1));
        return lastIndex == 1 ? false : firstIndex == 1 ? true : insideAttr;
    }

    if ((element.includes('<') && element.includes('>')) || attributes) {
        if (element.includes(' ')) {
            element = element.substr(1, element.length - 2);
            let type = '';
            let insideAttr = false;
            let attrs = {};
            /** @type {string[]} */
            let values = element.split('=');
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
            returnElement = document.createElement(type);
            if (Object.keys(attrs).length > 0)
                Basic.more(returnElement).attr(attrs);
        } else {
            returnElement = document.createElement(element.replace('<', '').replace('>', ''));
            if (attributes) returnElement.attr(attributes);
        }
    } else {
        let nodeList = document.querySelectorAll(element);
        if (nodeList.length > 1) returnElement = nodeList;
        else returnElement = document.querySelector(element);
    }
    return returnElement;
};
/**
 * Get/set the hash of this current window or add a event
 * handler that getts triggerd when the hash is changed to
 * specified hash.
 *
 * @public
 * @param {string} [hash] - The new location hash
 * @param {function(Event)} [handler]
 * @returns {string | void}
 */
Basic.hash = (hash, handler) => {
    if (handler) {
        if (hash.includes('#', 0)) hash = hash.substring(1);
        if (hashHandlers.hasOwnProperty(hash)) {
            if (!hashHandlers[hash].includes(handler)) hashHandlers[hash].push(handler);
        }
        else hashHandlers[hash] = [handler];
        if (window.location.hash === `#${hash}`)
            handler();
    } else if (hash) window.location.hash = (hash.includes('#', 0) ? '#' : '') + hash;
    else return window.location.hash;
}
/**
 * Get/set/modify cookie.
 *
 * If value is not defined then you get
 * the value of the cookie with the
 * specified name.
 *
 * Else you set/modify a cookie.
 *
 * @public
 * @param  {string} name
 * @param {*} value
 * @param {number|string|Date} end
 * @param {string} path
 * @param {string} domain
 * @param {boolean} secure
 * @returns {string|null|void}
 */
Basic.cookie = (name, value, end, path, domain, secure) => {
    if (value){
        let name = encodeURIComponent(name);
        let value = encodeURIComponent(value);
        let expires = end.constructor == Number ? end === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : `;max-age=${end}` :
            end.constructor == String ? `; expires=${end}` :
                end.constructor == Date ? `; expires=${end.toUTCString()}` : '';
        let path = path ? `; path=${path}` : '';
        let domain = domain ? `; domain=${domain}` : '';
        let secure = secure === true ? '; secure' : '';
        document.cookie = `${name}=${value}${expires}${domain}${path}${secure}`
    } else return decodeURIComponent(document.cookie.replace(new RegExp(`(?:(?:^|.*;)\\s*${encodeURIComponent(name).replace(/[\-.+*]/g, "\\$&")}\\s*\\=\\s*([^;]*).*$)|^.*$`), "$1")) || null;
};
/**
 * If no params are present this returns
 * all cookie keys that exists.
 *
 * If any other params are present then
 * this functions as a cookie remover.
 *
 * @public
 * @param {string} [name]
 * @param {string} [path]
 * @param {string} [domain]
 * @returns {string[] | void}
 */
Basic.cookies = (name, path, domain) => {
    if (name) {
        if (Basic.cookieExist(name))
            document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT${(domain ? `; domain=${domain}` : '')}${(path ? `; path=${path}` : '')}`;
    } else {
        let keys = document.cookie.replace(/((?:^|\s*;)[^=]+)(?=;|$)|^\s*|\s*(?:=[^;]*)?(?:\1|$)/g, '').split(/\s*(?:=[^;]*)?;\s*/);
        for (var len = keys.length, idx = 0; idx < len; idx++)
            keys[idx] = decodeURIComponent(keys[idx]);
        return keys;
    }
};
/**
 * Check if a specific cookie exists.
 *
 * @public
 * @param {string} name
 * @returns {boolean}
 */
Basic.cookieExist = name => (new RegExp(`(?:^|;\\s*)${encodeURIComponent(name).replace(/[\-.+*]/g, "\\$&")}\\s*\\=`)).test(document.cookie);
/**
 * Get/set keys in the local storage.
 *
 * With only the key defined; gets the value it
 * has in local storage.
 *
 * Key defined and value defined; sets the key
 * with the value in the local storage.
 *
 * @public
 * @param {string} key
 * @param {string|*} [value]
 * @returns {string|void}
 */
Basic.localStorage = (key, value) => !value ? window.localStorage.getItem(key) : window.localStorage.setItem(key, value);
/**
 * If index is a number then this returns the name of
 * the key.
 *
 * If index is a string then this returns a number
 * where it is.
 *
 * If index is not defined then this returns a array
 * of all keys in local storage.
 *
 * @public
 * @param {number|string} [index]
 * @returns {void|string[]|number|string}
 */
Basic.localStorageKeys = index => {
    if (index && index instanceof Number) return window.localStorage.key(index);
    else {
        let keys = [];
        for (let i = 0; i < window.localStorage.length; i++)
            keys[i] = window.localStorage.key(i);
        if (index) return keys.indexOf(index);
        return keys;
    }
};
/**
 * Remove a key from local storage
 *
 * @public
 * @param {string} key
 * @returns {void}
 */
Basic.localStorageRemove = key => window.localStorage.removeItem(key);
/**
 * Clear local storage
 *
 * @public
 * @returns {void}
 */
Basic.localStorageClear = () => window.localStorage.clear();
/**
 * Get/set keys in the session storage.
 *
 * With only the key defined; gets the value it
 * has in session storage.
 *
 * Key defined and value defined; sets the key
 * with the value in the session storage.
 *
 * @public
 * @param {string} key
 * @param {string|*} [value]
 * @returns {string|void}
 */
Basic.sessionStorage = (key, value) => !value ? window.sessionStorage.getItem(key) : window.sessionStorage.setItem(key, value);
/**
 * If index is a number then this returns the name of
 * the key.
 *
 * If index is a string then this returns a number
 * where it is.
 *
 * If index is not defined then this returns a array
 * of all keys in session storage.
 *
 * @public
 * @param {number|string} [index]
 * @returns {void|string[]|number|string}
 */
Basic.sessionStorageKeys = index => {
    if (index && index instanceof Number) return window.sessionStorage.key(index);
    else {
        let keys = [];
        for (let i = 0; i < window.sessionStorage.length; i++)
            keys[i] = window.sessionStorage.key(i);
        if (index) return keys.indexOf(index);
        return keys;
    }
};
/**
 * Remove a key from session storage
 *
 * @public
 * @param {string} key
 * @returns {void}
 */
Basic.sessionStorageRemove = key => window.sessionStorage.removeItem(key);
/**
 * Clear session storage
 *
 * @public
 * @returns {void}
 */
Basic.sessionStorageClear = () => window.sessionStorage.clear();
/**
 * Check if the Notification API is supported.
 *
 * @public
 * @returns {boolean}
 */
Basic.hasNotificationSupport = () => 'Notification' in window;
/**
 * Check if you have permission to send notifications
 *
 * @public
 * @returns {boolean}
 */
Basic.hasPermissionToNotify = () => Basic.hasNotificationSupport() ? Notification.permission === 'granted' : false;
/**
 * Request for permission to send notifications.
 *
 * @public
 * @param {function() | function(boolean)} success - Called when the permission was granted or when gotten a callback
 * @param {function()} [denied] - Called when permission to send notifications was denied
 * @returns {void}
 */
Basic.requestNotificationPermission = (success, denied) => {
    if (!Basic.hasPermissionToNotify()) Notification.requestNotificationPermission(result => {
        if (!denied) return success(result === 'granted');
        else {
            if ((result === 'granted') && success) success();
            else if (denied) denied();
        }
    });
};
/**
 * Spawn a notification.
 *
 * @public
 * @param {string} title - The notification title
 * @param {string} [body] - The notification body text
 * @param {string} [iconUrl] - The notification icon url
 * @param {function(Event)} [click] - The notification click handler
 * @param {object} [other] - The other notification settings
 * @returns {void}
 */
Basic.spawnNotification = (title, body, iconUrl, click, other) => {
    if (Basic.hasNotificationSupport()) {
        let options = {};
        if (body) options.body = body;
        if (iconUrl) options.icon = iconUrl;
        if (other) options += other;
        Basic.requestNotificationPermission(() => {
            /** @type {Notification} */
            let notification = new Notification(title, options);
            if (click) notification.addEventListener('click', click);
        });
    }
};
/**
 * Do something with device battery information
 *
 * @param {function(BatteryManager2)} handler
 * @returns {void}
 */
Basic.battery = handler => batteryHandlers.add(handler);
/**
 * @param {HTMLElement} element
 * @param {string} event
 * @param {EventInit} [init]
 */
Basic.dispatchEvent = (element, event, init) = {
    if (init) {
        element.dispatchEvent()
    }
}
window.addEventListener('hashchange', function (event) {
    let hash = window.location.hash.substring(1),
        handlers = hashHandlers;
    if (handlers && handlers.hasOwnProperty(hash))
        handlers[hash].forEach(handler => handler(event));
});
navigator.getBattery().then(battery => {for (let handler of batteryHandlers) handler(battery);});