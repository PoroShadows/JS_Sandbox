/**
 * Test is the object is a instance of the primitive
 *
 * @param {Object} obj
 * @param {Function|Object} primitive
 * @return {Boolean}
 * @public
 */
function is(obj, primitive) {
    if (obj === undefined || obj === null)
        return false;
    if (obj.constructor === primitive)
        return true;
    var defaults = [Boolean, Number, Object, String, Array, Function];
    for (var i = 0; i < defaults.length; i++) if (primitive === defaults[i] && obj.constructor === defaults[i]) return true;
    return primitive.prototype ? primitive.prototype.isPrototypeOf(obj) : primitive.isPrototypeOf(obj);
}

/**
 * Iterate over:
 * array,
 * object like a array,
 * string,
 * number,
 * object
 *
 * This can also act as a gate to run a function or not
 * by giving it a boolean value.
 *
 * Null or undefined does not run at all.
 *
 * @example
 * <pre>// Object
 *each({hello: "world"}, function (key, value, object) {
 *    console.log(key);   // hello
 *    console.log(value); // "world"
 *});</pre>
 * @example
 * <pre>// Array
 *each(["hello", "world"], function (value, index, array) {
 *    console.log(value); // "hello", "world"
 *    console.log(index); // 0, 1
 *});</pre>
 * @example
 * <pre>// Object like array
 *each({ length: 2, 0: "hello", 1: "world"}, function (value, index, array) {
 *    console.log(value); // "hello", "world"
 *    console.log(index); // 0, 1
 *});</pre>
 * @example
 * <pre>// String
 *each("hello world", function (char, index, array) {
 *    console.log(char);  // 'h', 'e', 'l', 'l', 'o', ' ', 'w', ...
 *    console.log(index); // "hello world", "hello world", ...
 *});</pre>
 * @example
 * <pre>// Number
 *each(4, function (iteration, iterationAmount) {
 *    console.log(iteration);       // 0, 1, 2, 3
 *    console.log(iterationAmount); // 4, 4, 4, 4
 *});</pre>
 * @example
 * <pre>// Boolean
 *each(true, function () {
 *    console.log('Runs');
 *});
 *each(false, function () {
 *    console.log('Does not run');
 *});</pre>
 *
 * @param {*} obj - The whatever to iterate over
 * @param {Function} fn - The function to run
 * @param {*} [thisArg] - The this representation
 * @returns {*} The 'obj' reference
 * @public
 */
function each(obj, fn, thisArg) {
    if (obj == undefined || obj == null) return obj;
    var idx = 0, name = '';
    thisArg = thisArg || obj;
    if (isArray(obj) || is(obj, String)) for (; idx < obj['length']; idx++) fn.call(thisArg, obj[idx], idx, obj);
    else if (is(obj, Number)) for (; idx < obj; idx++) fn.call(thisArg, idx, obj);
    else if (is(obj, Object)) for (name in obj) if (obj.hasOwnProperty(name)) fn.call(thisArg, name, obj[name], obj);
    else if (is(obj, Boolean) && obj) fn.call(thisArg);
    return obj;
}

/**
 * Merge two objects
 *
 * @param {Object} first
 * @param {Object} second
 * @param {Boolean} [override=false]
 * @returns {Object}
 * @public
 */
function merge(first, second, override) {
    each(enumerableKeys(second), function (key) {
        if (!first.hasOwnProperty(key) || (first.hasOwnProperty(key) && override))
            first[key] = second[key];
    });
    return first;
}

/**
 * Get every enumerable field in a object
 *
 * @param {Object} obj
 * @return {String[]}
 * @public
 */
function enumerableKeys(obj) {
    var hasEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
        skippedEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'],
        enumerates = [];
    if (!is(obj, Object) && (!is(obj, Function) || obj === null))
        throw new TypeError('enumerates called on non-object');
    function add(val) {
        if (obj.hasOwnProperty(val))
            this.push(val);
    }

    each(obj, add, enumerates);
    if (hasEnumBug) each(skippedEnums, add, enumerates);
    return enumerates;
}

/**
 * Define one or some properties to a object
 *
 * @param {Object|String} obj
 * @param {Object|String} [properties]
 * @param {Object|*} [desc]
 * @returns {Object} A 'obj' reference
 * @public
 */
function defineProps(obj, properties, desc) {
    function isDesc(obj) {
        return is(obj, Object) && ('set' in obj || 'get' in obj) && ('value' in obj || 'writable' in obj) &&
            enumerableKeys(obj).join('').replace(/set|get|value|writable|configurable|enumerable/g, '').length == 0
    }

    function regular(obj, name, desc) {
        if (isDesc(desc)) {
            desc.configurable = desc.configurable || false;
            desc.enumerable = desc.enumerable || true;
            if ('value' in desc) desc.writable = desc.writable || true;
            Object.defineProperty(obj, name, desc);
        } else obj[name] = desc;
        return obj;
    }

    if (is(obj, String)) return regular({}, obj, properties);
    if (is(properties, String)) return regular(obj, properties, desc);
    if (!properties) {
        properties = obj;
        obj = {};
    }
    var defaults = desc || {};

    function convert(desc) {
        if (!is(desc, Object) || desc == null)
            return desc;
        var descriptor = {};
        each(["enumerable", "configurable", "value", "writable"], function (name) {
            if (desc.hasOwnProperty(name) || defaults.hasOwnProperty(name))
                this[name] = !!desc[name] ? desc[name] : !!defaults[name] ? defaults[name] : undefined;
        }, descriptor);
        each(["get", "set"], function (name) {
            var fun = desc[name];
            if (fun === undefined) return;
            if (!is(fun, Function))
                throw new TypeError("Bad " + name);
            this[name] = fun;
        }, descriptor);
        if (('set' in obj || 'get' in obj) && ('value' in obj || 'writable' in obj))
            throw new TypeError("The descriptor is confused about its identity");
        return descriptor;
    }

    if (!is(obj, Object))
        throw new TypeError("Bad object");
    each(enumerableKeys(properties), function (key) {
        var item = convert(properties[key]);
        if (isDesc(item))
            Object.defineProperty(obj, key, item);
        else obj[key] = item;
    });
    return obj;
}

/**
 * Check if a object can be considered a array.
 *
 * @param {*} obj
 * @returns {Boolean}
 * @public
 */
function isArray(obj) {
    return is(obj, Array) ||
        is(obj, Object) && 'length' in obj && is(obj['length'], Number) && obj['length'] - 1 in obj
}

/**
 * WaterStream is a Promise polyfill
 *
 * @param {function(resolve, reject)} resolver
 * @public
 * @constructor
 */
function WaterStream(resolver) {
    var state = 'pending';
    var value;
    var deferred = null;
    var spread = false;

    //noinspection JSUnusedGlobalSymbols
    this.isFulfilled = function () {
        return state == 'fulfilled'
    };
    //noinspection JSUnusedGlobalSymbols
    this.isPending = function () {
        return state == 'pending'
    };
    //noinspection JSUnusedGlobalSymbols
    this.isRejected = function () {
        return state == 'fulfilled'
    };
    //noinspection JSUnusedGlobalSymbols
    this.isResolved = function () {
        return state == 'resolved'
    };

    function resolve(newValue) {
        try {
            if (newValue && typeof newValue.then === 'function') {
                newValue.then(resolve, reject);
                return;
            }
            state = 'resolved';
            value = newValue;

            if (deferred) {
                handle(deferred);
            }
        } catch (e) {
            reject(e);
        }
    }

    function reject(reason) {
        state = 'rejected';
        value = reason;

        if (deferred) {
            handle(deferred);
        }
    }

    function handle(handler) {
        if (state === 'pending') {
            deferred = handler;
            return;
        }
        setTimeout(function () {
            var handlerCallback = state === 'resolved' ? handler.onResolved : handler.onRejected;

            if (!handlerCallback) {
                handler[state === 'resolved' ? 'resolve' : 'reject'](value);
                return;
            }

            var ret;
            try {
                ret = handlerCallback(value);
                if (spread)
                    handler.resolve.apply(this, ret);
                else handler.resolve(ret);
                spread = false;
            } catch (e) {
                handler.reject(e);
            }
            state = 'fulfilled';
        }, 1);
    }

    /**
     * Resolve what to do with the value
     *
     * @param {function(value)} [onResolved]
     * @param {function(reason)} [onRejected]
     * @returns {WaterStream}
     * @public
     */
    this.then = function (onResolved, onRejected) {
        return new WaterStream(function (resolve, reject) {
            handle({
                onResolved: onResolved,
                onRejected: onRejected,
                resolve: resolve,
                reject: reject
            });
        });
    };
    //noinspection JSUnusedGlobalSymbols
    /**
     * Not standard do not expect this to work in other
     * Promise libraries
     *
     * Ensure error catch handles by the onRejected function
     *
     * @param {function(value)} [onResolved]
     * @param {function(reason)} [onRejected]
     * @returns {WaterStream}
     * @public
     */
    this.done = function (onResolved, onRejected) {
        return new WaterStream(function (resolve) {
            handle({
                onResolved: onResolved,
                onRejected: onRejected,
                resolve: resolve,
                reject: function reject(reason) {
                    state = 'resolved';
                    value = reason;
                    handle({
                        onResolved: onRejected,
                        resolve: resolve
                    });
                }
            });
        });
    };
    /**
     * Can be useful for error handling in your promise
     * composition.
     *
     * @param {function(reason)} [onRejected]
     * @returns {WaterStream}
     * @public
     */
    this.catch = function (onRejected) {
        return new WaterStream(function (resolve, reject) {
            handle({
                onResolved: undefined,
                onRejected: onRejected,
                resolve: resolve,
                reject: reject
            });
        });
    };
    //noinspection JSUnusedGlobalSymbols
    /**
     * NOT STANDARD
     *
     * If value is an array spread the arguments.
     * Else nothing function as normal then
     *
     * @param {function(value)} [onResolved]
     * @param {function(reason)} [onRejected]
     * @returns {WaterStream}
     * @public
     */
    this.spread = function (onResolved, onRejected) {
        spread = true;
        return this.then(onResolved, onRejected);
    };

    resolver(resolve, reject);
}

/**
 * WaterStream.all passes an array of values from
 * all the promises in the iterable object that it was
 * passed. The array of values maintains the order of the
 * original iterable object, not the order that the
 * promises were resolved in. If something passed in the
 * iterable array is not a promise, it's converted to one
 * by {@see WaterStream.resolve}.
 *
 * If any of the passed in promises rejects, the all
 * WaterStream immediately rejects with the value of the
 * promise that rejected, discarding all the other promises
 * whether or not they have resolved. If an empty array is
 * passed, then this method resolves immediately.
 *
 * @param {Array<WaterStream|*>} iterable - An iterable object
 * @returns {WaterStream}
 * @since 1.0
 * @public
 * @static
 */
WaterStream.all = function (iterable) {
    if (!iterable || iterable.length == 0)
        return WaterStream.resolve();
    var values = [];
    iterable = iterable.map(function (item) {
        return item && typeof item.then === 'function' ? item : WaterStream.resolve(item);
    });
    return new WaterStream(function (resolve, reject) {
        each(iterable, function (item, idx) {
            item.then(function (value) {
                values[idx] = value;
                if (values.length == iterable.length)
                    resolve(values);
            }, reject);
        });
    });
};
/**
 * The race function returns a WaterStream that is settled
 * the same way as the first passed water stream to settle.
 * It resolves or rejects, whichever happens first.
 *
 * @param {Array.<WaterStream>} iterable
 * @returns {WaterStream}
 * @since 1.0
 * @public
 * @static
 */
WaterStream.race = function (iterable) {
    var block = false;
    return new WaterStream(function (resolve, reject) {
        each(iterable, function (item) {
            item.then(function (value) {
                if (!block) {
                    block = true;
                    resolve(value);
                }
            }, function (value) {
                if (!block) {
                    block = true;
                    reject(value);
                }
            });
        });
    });
};
/**
 * Returns a WaterStream that is rejected. For debugging purposes
 * and selective error catching, it is useful to make reason
 * an instanceof {@see Error}.
 *
 * @param {Error|String} [reason]
 * @returns {WaterStream}
 * @since 1.0
 * @public
 * @static
 */
WaterStream.reject = function (reason) {
    return new WaterStream(function (resolve, reject) {
        reject(reason);
    });
};
/**
 * Returns a WaterStream that is resolved.
 *
 * @param {T|WaterStream} [value]
 * @returns {WaterStream}
 * @template T
 * @since 1.0
 * @public
 * @static
 */
WaterStream.resolve = function (value) {
    return new WaterStream(function (resolve) {
        resolve(value);
    });
};

/**
 *
 * @param {String|*} select
 * @param {Element|String|Document|Object|null} [data]
 * @param {Element|String|Array.<Element|String>} [content]
 * @returns {Element|Element[]|WaterStream}
 */
function WaterLily(select, data, content) {
    if (is(select, String)) {
        if (is(data, undefined) || is(data, Document) || is(data, HTMLElement) || is(data, Element) || is(data, Window))
            return WaterLily.find(select, data);
        else return WaterLily.create.apply(this, arguments);
    } else if (is(select, Function)) {
        switch (select.length) {
            case 0:
            case 1:
                window.addEventListener('DOMContentLoaded', select);
                break;
            case 2:
                return new WaterStream(select);
        }
    }
}

/**
 * @see WaterStream.all
 * @param {Array<WaterStream|*>} iterable - An iterable object
 * @returns {WaterStream}
 * @since 1.0
 * @public
 * @static
 */
WaterLily.all = function (iterable) {
    return WaterStream.all(iterable);
};
/**
 * @see WaterStream.race
 * @param {Array.<WaterStream>} iterable
 * @returns {WaterStream}
 * @since 1.0
 * @public
 * @static
 */
WaterLily.race = function (iterable) {
    return WaterStream.race(iterable);
};
/**
 * @see WaterStream.reject
 * @param {Error|String} [reason]
 * @returns {WaterStream}
 * @since 1.0
 * @public
 * @static
 */
WaterLily.reject = function (reason) {
    return WaterStream.reject(reason);
};
/**
 * @see WaterStream.resolve
 * @param {T|WaterStream} [value]
 * @returns {WaterStream}
 * @template T
 * @since 1.0
 * @public
 * @static
 */
WaterLily.resolve = function (value) {
    return WaterStream.resolve(value);
};

/**
 * Find a element in the document or in a custom context
 *
 * @param {String} selector
 * @param {Element|String|Document} [context=document]
 * @returns {NodeList|Element|undefined}
 * @public
 * @static
 */
WaterLily.find = function (selector, context) {
    context = is(context, Element) ? context : is(context, String) ? WaterLily.find(context) : document;
    console.log(is(context, Element) || is(context, String));
    var list = context.querySelectorAll(selector);
    return list.length > 1 ? list : list.length == 1 ? list[0] : undefined;
};

/**
 * Create a element
 *
 * @param {String} [tagName='div']
 * @param {Object|null} [attributes=null]
 * @param {Element|String|Array.<Element|String>} [content=[]]
 * @returns {Element}
 * @public
 * @static
 */
WaterLily.create = function (tagName, attributes, content) {
    tagName = tagName || 'div';
    content = is(content, Array) ? content : Array.prototype.slice.call(arguments, 2);
    if (/\s+|^<.*>$/g.test(tagName)) {
        tagName = tagName.replace(/^<|>$/g, '');
        //noinspection SpellCheckingInspection
        var attribs = tagName.split(/\s/), attrs = {}, key = '';
        tagName = attribs.splice(0, 1)[0];
        if (!/^(\s?)+$/.test(attribs.join(' '))) each(attribs, function (item) {
            key = this(attrs,
                key ? key : /=+/.test(item) ? (item = item.split(/=/)).splice(0, 1)[0] : item,
                key ? item : Array.isArray(item) ? item.join('=').replace(/^"|^'/g, '') : ''
            );
        }, function (attrs, key, value) {
            attrs[key] = (attrs.hasOwnProperty(key) ? attrs[key] + ' ' : '') + value;
            if (!value) return '';
            if (/"$|'$/g.test(value)) {
                attrs[key] = attrs[key].replace(/"$|'$/g, '');
                return '';
            }
            return key;
        });
        attributes = defineProps(attributes || {}, attrs);
    }
    var elem = document.createElement(tagName);
    each(attributes || {}, HTMLElement.prototype.setAttribute, elem);
    each(content, function (item) {
        this.appendChild(is(item, String) ? document.createTextNode(item) : item);
    }, elem);
    return elem;
};

/**
 * Request an external source.
 *
 * @param {String} url
 * @param {Object} [req]
 * @param {String} [req.method=GET] - GET, POST, PUT, DELETE, OPTIONS, HEAD, ...
 * @param {String} [req.type=''] - arraybuffer (ArrayBuffer), blob (Blob), document (Document), json (Object), text (DOMString)
 * @param {Object} [req.headers={}]
 * @param {Object} [req.query={}]
 * @returns {WaterStream}
 * @public
 * @static
 */
WaterLily.request = function (url, req) {
    return new WaterStream(function (resolve, reject) {
        var xhr = new XMLHttpRequest;
        xhr.responseType = req.type || '';
        each(req.headers || {}, xhr.setRequestHeader);
        var params = '';
        each(req.query || {}, function (name, value) {
            params += (this.indexOf(name) == 0 ? '?' : '&') + encodeURIComponent(name) + '=' + encodeURIComponent(value);
        }, enumerableKeys(req.query || {}));
        xhr.open(req.method || 'GET', url + params);
        xhr.send();
        //noinspection SpellCheckingInspection
        xhr.onload = function () {
            if (200 <= this.status < 300)
                resolve(this.response);
            else reject(this.statusText);
        };
        //noinspection SpellCheckingInspection
        xhr.onerror = function () {
            reject(this.statusText)
        };
    });
};

/**
 * @param {NodeList|Element...|String} element
 * @constructor
 */
function Change(element) {
    element = is(element, String) ? WaterLily.find(element) : element;
    this.__elements = is(element, NodeList) ? element : Array.prototype.slice.call(arguments, 0);

    function template(inst, attribute, name, value) {
        if (value === undefined) {
            var ret;
            if (name === undefined) {
                return inst.__elements[0][attribute];
            } else if (isArray(name)) {
                ret = {};
                each(name, function (name) {
                    if (inst.__elements.length == 1)
                        ret[name] = inst.__elements[0][attribute][name];
                    else each(inst.__elements, function (element) {
                        if (ret.hasOwnProperty(name))
                            ret[name].push(element[attribute][name]);
                        else ret[name] = [element[attribute][name]];
                    });
                });
            } else if (is(name, String)) {
                ret = [];
                each(inst.__elements, function (element) {
                    this.push(element[attribute][name]);
                }, ret = []);
            } else {

                return this;
            }
            return isArray(ret) && ret.length == 1 ? ret[0] : ret;
        }
        return this;
    }

    /**
     *
     * @param {String|Array.<String>|Object} name
     * @param {String|Number|Boolean|Function} [value]
     * @returns {Change}
     */
    this.css = function (name, value) {
        return template(this, 'style', name, value);
    };
    this.attr = function (name, value) {
        return template(this, 'attributes', name, value);
    };
    /**
     * @param {Number} [idx]
     * @returns {Element|Array.<Element>}
     */
    this.get = function (idx) {
        return (
            !!idx ?
                idx < this.__elements.length ?
                    idx >= 0 ?
                        this.__elements[idx] :
                        this.__elements[0] :
                    this.__elements[this.__elements.length - 1] :
                this.__elements.length == 1 ?
                    this.__elements[0] :
                    this.__elements
        );
    }
}

/**
 *
 * @param {NodeList|Element...|String} element
 * @returns {Change}
 */
WaterLily.change = function (element) {
    return new Change(element);
};

var r = {
    is: is,
    each: each,
    merge: merge,
    enumerableKeys: enumerableKeys,
    defineProps: defineProps,
    isArray: isArray,
    WaterLily: WaterLily,
    WaterStream: WaterStream
};