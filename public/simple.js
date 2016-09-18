'use strict';
function extend(key, fn) {
    if (fn) fn.bind(this);
    var obj = {};
    if (typeof key === 'object') obj = key;
    else obj[key] = fn;
    for (var name in obj) if (obj.hasOwnProperty(name) && !this.hasOwnProperty(name))
        Object.defineProperty(this, name, Object.getOwnPropertyDescriptor(obj, name));
}
var simple = function (selector, other) {
        return new simple.prototype.init(selector, other);
    },
    /**
     * @type {HTMLDocument}
     * @private
     */
    doc = window.document;
simple.prototype = {
    version: '1.0',
    constructor: simple,
    length: 0,
    get: function (num) {
        return num ? this[num < 0 ? 0 : num > this.length - 1 ? this.length - 1 : num] : [].slice.call(this);
    },
    /**
     *
     * @param {Function} fn
     * @returns {*}
     * @public
     */
    each: function (fn) {
        return simple.each(this, fn);
    }
};
/**
 *
 * @param {Object} attrs
 * @param {String} key
 * @param {String} value
 * @returns {String}
 * @private
 */
function htmlTagAttrTest(attrs, key, value) {
    attrs[key] = (attrs.hasOwnProperty(key) ? attrs[key] + ' ' : '') + value;
    if (!value) return '';
    if (/"$|'$/g.test(value)) {
        attrs[key] = attrs[key].replace(/"$|'$/g, '');
        return '';
    }
    return key;
}
var init = simple.prototype.init = function (selector, other) {
    if (!selector) return this;
    if (typeof selector === 'string') {
        if (/^<.*>$/.test(selector)) {
            if (/\s+/g.test(selector)) {
                selector = selector.replace(/^<|>$/g, '');
                var attributes = selector.split(/\s/), attrs = {}, key = '';
                selector = attributes.splice(0, 1)[0];
                if (!/^(\s?)+$/.test(attributes.join(' '))) simple.each(attributes, function (item) {
                    key = htmlTagAttrTest(
                        attrs,
                        key ? key : /=+/.test(item) ? (item = item.split(/=/)).splice(0, 1)[0] : item,
                        key ? item : Array.isArray(item) ? item.join('=').replace(/^"|^'/g, '') : ''
                    );
                });
                this[this.length++] = doc.createElement(selector);
                this.attr(attrs);
                if (other) this.appendTo(other);
            } else {
                this[this.length++] = doc.createElement(selector.replace(/^<|>$/g, ''));
                if (other) this.attr(other);
            }
        } else {
            var context = other ? other.constructor.name === 'simple' ? other[0] : other : doc;
            var list = context.querySelectorAll(selector);
            for (var i = 0; i < list.length; i++) this[this.length++] = list[i];
        }
    }
    return this;
};
init.prototype = simple.prototype;
simple.extend = extend;
simple.prototype.extend = extend;
simple.extend({
    each: function (obj, fn) {
        var length = !!obj && 'length' in obj && obj.length,
            isLikeArray = typeof obj === 'function' ? false : (typeof obj === 'array' || length === 0 || typeof length === 'number' && length > 0 && (length - 1) in obj);
        if (isLikeArray) for (var i = 0; i < obj.length; i++) fn.call(obj[i], obj[i], i, obj);
        else for (var key in obj) if (obj.hasOwnProperty(key)) fn.call(obj[key], key, obj[key], obj);
        return obj;
    },
    /**
     * @param {string} value
     * @returns {number | boolean | string}
     * @public
     */
    returnType: function (value) {
        return !isNaN(Number.parseFloat(value)) ? Number.parseFloat(value) : parseBoolean(value) != undefined ? parseBoolean(value) : value;
    },
    /**
     * Parse a string to a boolean; undefined if it is not a boolean
     *
     * @param {string} value
     */
    parseBoolean: function (value) {
        return value == 'true' ? true : value == 'false' ? false : value == 0 ? false : value == 1 ? true : undefined;
    },
    /**
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
     * @param {string | number | boolean | Object} [value] - The cookie value
     * @param {number | string | Date} [end] - Then the cookie will expire
     * @param {string} [path] - The cookie path
     * @param {string} [domain] - The cookie domain
     * @param {boolean} [secure] - If the cookie is secure
     * @returns {string | number | boolean | undefined}
     * @public
     */
    cookie: function (key, value, end, path, domain, secure) {
        if (!value) {
            var cookie = decodeURIComponent(document.cookie.replace(new RegExp(`(?:(?:^|.*;)\\s*${encodeURIComponent(key).replace(/[\-.+*]/g, "\\$&")}\\s*\\=\\s*([^;]*).*$)|^.*$`), "$1")) || undefined;
            if (!cookie) return undefined;
            return returnType(cookie);
        } else {
            if (!key || /^(?:expires|max-age|path|domain|secure)$/i.test(key)) return false;
            document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}${end ? end.constructor == Number ? end === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + end : end.constructor == String ? '; expires=' + end : end.constructor == Date ? '; expires=' + end.toUTCString() : '' : ''}${(domain ? "; domain=" + domain : "")}${(path ? "; path=" + path : "")}${(secure ? "; secure" : "")}`;
            return true;
        }
    },
    /**
     * Check if a cookie exists or get all current keys of all cookies
     *
     * @param {string} [key]
     * @returns {boolean}
     * @public
     */
    cookies: function (key) {
        if (!key) {
            var keys = document.cookie.replace(/((?:^|\s*;)[^=]+)(?=;|$)|^\s*|\s*(?:=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:=[^;]*)?;\s*/);
            for (var i = 0; i < keys.length; i++) keys[i] = decodeURIComponent(keys[i]);
            return keys;
        } else return (new RegExp(`(?:^|;\\s*)${encodeURIComponent(sKey).replace(/[\-.+*]/g, "\\$&")}\\s*\\=`)).test(document.cookie);
    },
    /**
     * Remove a cookie
     *
     * @param {string} key
     * @param {string} [path]
     * @param {string} [domain]
     * @returns {void}
     * @public
     */
    removeCookie: function (key, path, domain) {
        if (simple.cookies(key))
            document.cookie = `${encodeURIComponent(key)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT${(domain ? "; domain=" + domain : "")}${(path ? "; path=" + path : "")}`;
    }
});
simple.prototype.extend({
    /**
     * Get/set/create a attribute for the element.
     *
     * @param {string | Object<string, string>} key - The key of the attribute or a key value object of ´name: value` pairs
     * @param {string | number | boolean} [value] - The value of the attribute
     * @returns {string | number | boolean | simple}
     * @public
     */
    attr: function (key, value) {
        var values = [];
        this.each(function (elem) {
            if (!value) {
                if (typeof key == 'string') values.push(returnType(elem.getAttribute(key)));
                else simple.each(key, elem.setAttribute);
            } else elem.setAttribute(key, '' + value);
        });
        return values.length > 0 ? values.length == 1 ? values[0] : values : this;
    },
    /**
     * Add a event listener to this element.
     *
     * @param {string} event
     * @param {function(Event) | function()} handler
     * @param {boolean} [useCapture]
     * @returns {simple}
     * @public
     */
    on: function (event, handler, useCapture) {
        this.each(function (elem) {
            elem.addEventListener(event, handler, !useCapture ? false : useCapture);
        });
        return this;
    },
    /**
     * Get/Set the parent of this element.
     *
     * @param {HTMLElement|simple} [parent] - The new parent
     * @returns {Node|Node[]|simple} The parent or this element
     * @public
     */
    parent: function (parent) {
        var values = [];
        this.each(function (elem) {
            if (parent) parent.appendChild(elem);
            else values.push(elem.parentNode);
        });
        return values.length > 0 ? values.length == 1 ? values[0] : values : this;
    },
    /**
     * Get/Set the text content of this element.
     *
     * @param {string} [text] - The new text
     * @returns {string | HTMLElement}
     * @public
     */
    text: function (text) {
        var values = [];
        this.each(function (elem) {
            if (text) elem.textContent = text;
            else values.push(elem.textContent);
        });
        return values.length > 0 ? values.length == 1 ? values[0] : values : this;
    },
    /**
     * Get/Set the value of this element.
     *
     * @param {string | number | boolean} [value]
     * @returns {string | number | boolean | HTMLElement}
     * @public
     * @deprecated
     */
    val: function (value) {
        if (value) this.value = value;
        else return simple.returnType(this.value);
        return this;
    },
    /**
     * Set what is going to happen when all DOM content has loaded.
     *
     * @param {function(Event) | EventListener} handler
     * @returns {Element} This element
     * @deprecated
     */
    ready: function (handler) {
        if (handler) document.addEventListener('DOMContentLoaded', handler);
        return this;
    },
    /**
     * Append one or more elements.
     *
     * @param {Element} children - The new child or children
     * @returns {Element} This element
     * @deprecated
     */
    append: function (...children) {
        if ((this.nodeType == 1 || this.nodeType == 11 || this.nodeType == 9) && children) children.forEach(this.appendChild);
        return this;
    },
    /**
     * Adds all specified classes if they more not exist.
     *
     * @param {string} classes
     * @returns {Element} The current element
     * @deprecated
     */
    addClass: function (...classes) {
        /** @type {string[]} */
        let elementClasses = this.className.split(' ');
        if (elementClasses[0] == '') elementClasses = [];
        classes.filter(clazz => !elementClasses.includes(clazz)).forEach(clazz => elementClasses.push(clazz));
        this.className = elementClasses.join(' ');
        return this;
    },
    /**
     * Removes all specified classes if the exist
     *
     * @param {String|String[]} classes
     * @returns {Element} The current element
     * @deprecated
     */
    removeClass: function (classes) {
        if (!Array.isArray(classes)) classes = [].push(classes);
        /** @type {string[]} */
        let elementClasses = this.className.split(' ');
        let newClasses = [];
        if (elementClasses[0] == '') elementClasses = [];
        elementClasses.filter(clazz => !classes.includes(clazz)).forEach(clazz => newClasses.push(clazz));
        this.className = newClasses.join(' ');
        if (!this.className) this.removeAttribute('class');
        return this;
    },
    /**
     * Removes all classes on the element
     *
     * @returns {Element} The current element
     * @deprecated
     */
    removeAllClasses: function () {
        this.removeAttribute('class');
        return this;
    },
    /**
     * Remove all of the children for this node.
     *
     * @returns {Element} This element
     * @deprecated
     */
    removeAllChildren: function () {
        while (this.firstChild) this.removeChild(this.firstChild);
        return this;
    },
});
// ------------------------------                  XML Http Requests                   ------------------------------ \\
{
    /**
     * Preform a xml http request or ajax request
     *
     * @param {string | object} method
     * @param {string} method.method
     * @param {string} method.url
     * @param {boolean} [method.async]
     * @param {string} [method.username]
     * @param {string} [method.password]
     * @param {object} [method.parameters]
     * @param {object} [method.headers]
     * @param {function(object, object)} [options.done]
     * @param {function(number, string, object)} [options.error]
     * @param {string} [url]
     * @param {object} [options]
     * @param {boolean} [options.async]
     * @param {string} [options.username]
     * @param {string} [options.password]
     * @param {object} [options.parameters]
     * @param {object} [options.headers]
     * @param {function(object, object, XMLHttpRequest)} [options.done]
     * @param {function(number, string, object, XMLHttpRequest)} [options.error]
     * @returns {void}
     */
    $.ajax = (method, url, options) => {
        if (typeof method == 'object') {
            options = method;
            if (options.hasOwnProperty('url')) {
                url = options.url;
                delete options.url;
            }
            if (options.hasOwnProperty('method')) {
                method = options.method;
                delete options.method;
            }
        }
        if (!method) console.error(`Missing property 'method'`);
        if (!url) console.error(`Missing property 'url'`);
        if (!method || !url) return;
        /** @type {XMLHttpRequest} */
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    let headers = {};
                    for (let line of xhr.getAllResponseHeaders().split('\n')) {
                        let split = line.split(': ', 2);
                        if (split.length != 1) headers[split[0]] = split[1];
                    }
                    if (options.hasOwnProperty('done')) options.done(xhr.response, headers, xhr)
                } else {
                    console.log(xhr.getAllResponseHeaders());
                    let headers = {};
                    if (xhr.getAllResponseHeaders() != '')
                        for (let line of xhr.getAllResponseHeaders().split('\n')) {
                            let split = line.split(': ', 1);
                            headers[split[0]] = split[1];
                        }
                    options.error(xhr.status, xhr.statusText, headers, xhr);
                }
            }
        }
        let pars = '';
        if (options.hasOwnProperty('parameters')) for (let par of Object.keys(options.parameters))
            if (options.parameters.hasOwnProperty(par)) pars += `&${par}=${options.parameters[par]}`;
        pars = pars != '' ? '?' + pars.substr(1) : '';
        if (options.hasOwnProperty('async') && options.hasOwnProperty('username') && options.hasOwnProperty('password'))
            xhr.open(method, url + pars, options.async, options.username, options.password);
        else if (options.hasOwnProperty('async'))
            xhr.open(method, url + pars, options.async);
        else xhr.open(method, url + pars);
        if (options.hasOwnProperty('headers')) for (let headerName of Object.keys(options.headers))
            if (options.headers.hasOwnProperty(headerName)) xhr.setRequestHeader(headerName, options.headers[headerName]);
        console.log(options.headers);
        xhr.send(null);
    };
}
// ------------------------------                        Other                         ------------------------------ \\
{
    /**
     * Get a parameter present in the url
     *
     * @param {string} name - The name of the parameter
     * @param {boolean} [decode] - Defaults to true
     * @param {string} [url] - Defaults to window.location.href
     * @returns {*}
     */
    $.getUrlParameter = (name, decode, url) => {
        if (!url) url = window.location.href;
        if (!decode) decode = true;
        name = name.replace(/[\[\]]/g, "\\$&");
        let regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
            results = regex.exec(url);
        if (!results) return undefined;
        if (!results[2]) return '';
        if (decode)
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        return results[2].replace(/\+/g, " ");
    }
}
// ------------------------------                        Tests                         ------------------------------ \\
/**
 * @protected
 * @type {Object<string, function[]>}
 */
let hashHandles;
function hashHandler() {
    let hash = window.location.hash.substring(1);
    if (hashHandles && hashHandles.hasOwnProperty(hash)) {
        console.log(hashHandles[hash]);
        hashHandles[hash].forEach(handler => {
            console.log(handler);
            handler();
        });
    }
}
{
    /**
     *
     * @param {string | object} method
     * @param {string} method.method
     * @param {string} method.url
     * @param {boolean} [method.async]
     * @param {string} [method.username]
     * @param {string} [method.password]
     * @param {object} [method.parameters]
     * @param {object} [method.headers]
     * @param {function(object, object, XMLHttpRequest)} [options.done]
     * @param {function(number, string, object, XMLHttpRequest)} [options.error]
     * @param {string} [url]
     * @param {object} [options]
     * @param {boolean} [options.async]
     * @param {string} [options.username]
     * @param {string} [options.password]
     * @param {object} [options.parameters]
     * @param {object} [options.headers]
     * @param {function(object, object, XMLHttpRequest)} [options.done]
     * @param {function(number, string, object, XMLHttpRequest)} [options.error]
     * @returns {void}
     * @deprecated
     */
    $.json = (method, url, options) => {
        $.ajax()
    };

    $.handleHash = (hashtag, handler) => {
        if (!hashHandles) hashHandles = {};
        if (hashHandles.hasOwnProperty(hashtag) && hashHandles[hashtag].includes(handler))
            return console.error('Tried to handle a hash with a handler that already handles the event!');
        if (hashHandles.hasOwnProperty(hashtag)) hashHandles[hashtag].push(handler);
        else {
            hashHandles[hashtag] = [];
            hashHandles[hashtag].push(handler);
        }
        console.log(handler);
        hashHandler()
    }
    /**
     * Get/Set the hash of this current window.
     *
     * @param {string} [hashtag] - The new location hashtag without the hash ('#')
     * @returns {string | undefined} The current hashtag without the hash ('#') or udefined if parameter hashtag is set
     */
    $.hash = hashtag => {
        if (hashtag) window.location.hash = `#${hashtag}`;
        else return window.location.hash.substring(1);
    };
}

window.addEventListener('hashchange', hashHandler);

var headers = new Headers({"Access-Control-Allow-Origin": 'all'});

fetch('cards/card0.jpg', {
    method: 'get',
    headers: headers,
    mode: 'no-cors',
    cache: 'default'
}).then(function (result) {
    console.log(result.blob());
});
function fetchUrl(url, options) {
    if (window.fetch) {
        return window.fetch(url, options);
    } else {
        var promise = new Promise()
    }
}
function ajax(method, url, args) {
    var promise = new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        var pars = '';

        if (args) {
            pars += '?';
            var argCount = 0;
            simple.each(args, function (key, value) {
                if (argCount++)
                    pars += '&';
                pars += encodeURIComponent(key) + '=' + encodeURIComponent(value);
            });
        }
        xhr.open(method, pars);
        xhr.send()
    });
}