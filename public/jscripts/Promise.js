/**
 * Test is the object is a instance of the primitive
 *
 * @param {Object} obj
 * @param {Function|Object} primitive
 * @return {Boolean}
 * @public
 */
function instanceOf(obj, primitive) {
    if (obj === undefined || obj === null)
        return false;
    if (obj.constructor === primitive)
        return true;
    var defaults = [Boolean, Number, Object, String, Array, Function];
    for (var i = 0; i < defaults.length; i++) {
        if (primitive === defaults[i] && obj.constructor === defaults[i]) {
            return true;
        }
    }
    return primitive.prototype.isPrototypeOf(obj);
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
    if (obj == undefined || obj == null) {
        return obj;
    }
    var likeArray = Array.isArray(obj) || instanceOf(obj, String) || instanceOf(obj, Object) && 'length' in obj && instanceOf(obj['length'], Number) && obj['length'] - 1 in obj,
        idx = 0, name = '';
    thisArg = thisArg || obj;
    if (likeArray) {
        for (; idx < obj['length']; idx++) {
            fn.call(thisArg, obj[idx], idx, obj);
        }
    } else if (instanceOf(obj, Number)) {
        for (; idx < obj; idx++) {
            fn.call(thisArg, idx, obj);
        }
    } else if (instanceOf(obj, Object)) {
        for (name in obj) {
            if (obj.hasOwnProperty(name)) {
                fn.call(thisArg, name, obj[name], obj);
            }
        }
    } else if (instanceOf(obj, Boolean)) {
        if (obj) {
            fn.call(thisArg);
        }
    }
    return obj;
}
/**
 * Get every property name that the object owns
 *
 * @param {Object} obj
 * @return {String[]}
 * @public
 */
function getOwnPropertyNames(obj) {
    var names = [];
    each(obj, function (key) { this.push(key) }, names);
    return names;
}
/**
 * Get every enumerable field in a object
 *
 * @param {Object} obj
 * @return {String[]}
 * @public
 */
function enumerableKeys(obj) {
    var hasEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
        skippedEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'],
        enumerates = [];
    if (!instanceOf(obj, Object) && (!instanceOf(obj, Function) || obj === null)) {
        throw new TypeError('enumerates called on non-object');
    }
    function add(val) {
        if (obj.hasOwnProperty(val)) {
            this.push(val);
        }
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
    function regular(obj, name, desc) {
        if (instanceOf(desc, Object) && ('set' in desc || 'get' in desc || 'value' in desc || 'writable' in desc)) {
            desc.configurable = desc.configurable || false;
            desc.enumerable = desc.enumerable || true;
            if ('value' in desc) desc.writable = desc.writable || true;
            Object.defineProperty(obj, name, desc);
        } else {
            obj[name] = desc;
        }
        return obj;
    }
    if (instanceOf(obj, String)) {
        return regular({}, obj, properties)
    } else if (instanceOf(properties, String)) {
        return regular(obj, properties, desc)
    }
    if (!properties) {
        properties = obj;
        obj = {};
    }
    var defaults = desc;
    function convert(desc) {
        if (!instanceOf(desc, Object) || desc === null) {
            return desc;
        }
        var descriptor = {};
        each(["enumerable", "configurable", "value", "writable"], function (name) {
            if (desc.hasOwnProperty(name) || defaults.hasOwnProperty(name)) {
                this[name] = !!desc[name] ? desc[name] : defaults !== undefined && !!defaults[name] ? defaults[name] : undefined;
            }
        }, descriptor);
        each(["get", "set"], function (name) {
            var fun = desc[name];
            if (fun === undefined) {
                return;
            }
            if (!instanceOf(fun, Function)) {
                throw new TypeError("Bad " + name);
            }
            this[name] = fun;
        }, descriptor);
        if (('set' in obj || 'get' in obj) && ('value' in obj || 'writable' in obj)) {
            new TypeError("The descriptor is confused about its identity");
        }
        if (desc !== undefined)
        return descriptor;
    }
    if (!instanceOf(obj, Object) || obj === null) {
        throw new TypeError("Bad object");
    }
    each(enumerableKeys(Object(properties)), function (key) {
        Object.defineProperty(obj, key, convert(properties[key]));
    });
    return obj;
}
/**
 * Create a new object.
 *
 * @param {*} proto - The objects prototype
 * @param {Object} [properties] - Any additional properties
 * @returns {Object} Your new object
 * @public
 */
function create(proto, properties) {
    function F() {}
    F.prototype = proto;
    return defineProps(new F(), properties || {}, { enumerable: true });
}



/*
function noop() {}

function Promise(executor) {
    if (typeof this !== "object") {
        throw new TypeError("Promises must be constructed via new");
    }
    if (typeof executor !== "function") {
        throw new TypeError("not a function");
    }
    this.__state = 0;
    this.__next = null;
    this.__chain = [];
    if (executor === noop) return;
    doResolve(executor, this);
}

function doResolve(fn, promise) {
    var done = false;
    var res = tryCall(fn, function(value) {
        if (done) return;
        done = true;
        resolve(promise, value);
    }, function(reason) {
        if (done) return;
        done = true;
        reject(promise, reason);
    });
    if (!done && res === isError) {
        done = true;
        reject(promise, error);
    }
}

var error = null;
var isError = {};

function tryCall(fn, args) {
    try {
        var funArgs = arguments.copyWithin(arguments.length, 1);
        return fn.apply(fn, funArgs);
    } catch (e) {
        error = e;
        return isError;
    }
}

Promise.prototype.then = function(onFulfilled, onRejected) {
    if (this.constructor !== Promise) {
        return safeThen(this, onFulfilled, onRejected);
    }
    var res = new Promise(noop);
    handle(this, { fulfilled: onFulfilled, rejected: onRejected, promise: res });
    return res;
};
function safeThen(self, onFulfilled, onRejected) {
    return new self.constructor(function(resolve, reject) {
        var res = new Promise(noop);
        res.then(resolve, reject);
        handle(self, { fulfilled: onFulfilled, rejected: onRejected, promise: res });
    });
}
function handle(self, deferred) {
    while (self.__state === 3) {
        self = self.__next;
    }
    if (self.__state === 0) {
        debugger;
        self.__chain.push(deferred);
        return;
    }
    (function() {
        var cb = self.__state === 1 ? deferred.fulfilled : deferred.rejected;
        if (cb === null) {
            if (self.__state === 1) {
                resolve(deferred.promise, self.__next);
            } else {
                reject(deferred.promise, self.__next);
            }
            return;
        }
        var ret = tryCall(cb, self.__next);
        if (ret === isError) {
            reject(deferred.promise, error);
        } else {
            resolve(deferred.promise, ret);
        }
    })();
}
Promise.resolve = function (newValue) {
    resolve(new Promise(function (resolve) {
        resolve(newValue);
    }), newValue)
};
function resolve(self, newValue) {
    if (newValue === self) {
        return reject(self, new TypeError("A promise cannot be resolved with itself."));
    }
    if (newValue && (typeof newValue === "object" || typeof newValue === "function")) {
        var then = tryCall(newValue);
        debugger;
        if (then === isError) {
            return reject(self, error);
        }
        if (then === self.then && newValue instanceof Promise) {
            self.__state = 3;
            self.__next = newValue;
            finale(self);
            return;
        } else if (typeof then === "function") {
            doResolve(then.bind(newValue), self);
            return;
        }
    }
    self.__state = 1;
    self.__next = newValue;
    finale(self);
}
function reject(self, newValue) {
    self.__state = 2;
    self.__next = newValue;
    finale(self);
}
function finale(self) {
    debugger;
    each(self.__chain, function (section) {
        handle(self, section)
    });
    self.__chain = null;
}
*/

/*Promise.resolve(function () {
    console.log("first");
    return "second"
}).then(function (str) {
    console.log(str);
});*/

// Make available in Object
each(['instanceOf', 'getOwnPropertyNames', ['enumerableKeys', 'keys'], ['defineProps', 'defineProperties'], 'create'], function (name) {
    if (instanceOf(name, String)) {
        if (!Object[name]) {
            Object[name] = eval(name);
        }
    } else {
        each(name.length, function (i) {
            if (!Object[name[i]]) {
                Object[name[i]] = eval(name[0]);
            }
        });
    }
});

// Make available in node.js
if (typeof module === 'object' && typeof module.exports === 'object')
    module.exports = {
        instanceOf: instanceOf,
        each: each,
        getOwnPropertyNames: getOwnPropertyNames,
        enumerableKeys: enumerableKeys,
        define: defineProps,
        create: create
    };

// Test section
