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
Object.each = function each(obj, fn, thisArg) {
    if (obj == undefined || obj == null) return obj;
    var likeArray = Array.isArray(obj) || instanceOf(obj, String),
        idx = 0, name = '';
    thisArg = thisArg || obj;
    if (likeArray) for (; idx < obj['length']; idx++) fn.call(thisArg, obj[idx], idx, obj);
    else if (instanceOf(obj, Number)) for (; idx < obj; idx++) fn.call(thisArg, idx, obj);
    else if (instanceOf(obj, Object)) for (name in obj) if (obj.hasOwnProperty(name)) fn.call(thisArg, name, obj[name], obj);
    else if (instanceOf(obj, Boolean) && obj) fn.call(thisArg);
    return obj;
};
/**
 * Test is the object is a instance of the primitive
 *
 * @param {Object} obj
 * @param {Function|Object} primitive
 * @return {Boolean}
 * @public
 */
Object.instanceOf = function instanceOf(obj, primitive) {
    if (obj === undefined || obj === null)
        return false;
    if (obj.constructor === primitive)
        return true;
    var defaults = [Boolean, Number, Object, String, Array, Function];
    for (var i = 0; i < defaults.length; i++) if (primitive === defaults[i] && obj.constructor === defaults[i]) return true;
    return primitive.prototype.isPrototypeOf(obj);
};
/**
 * Get every property name that the object owns
 *
 * @param {Object} obj
 * @return {String[]}
 * @public
 */
Object.getOwnPropertyNames = function getOwnPropertyNames(obj) {
    var names = [];
    each(obj, function (key) {
        this.push(key);
    }, names);
    return names;
};
/**
 * Create a new object.
 *
 * @param {*} proto - The objects prototype
 * @param {Object} [properties] - Any additional properties
 * @returns {Object} Your new object
 * @public
 */
Object.create = function create(proto, properties) {
    function F() {
    }

    F.prototype = proto;
    return Object.defineProps(new F(), properties || {}, {enumerable: true});
};
/**
 * Get every enumerable field in a object
 *
 * @param {Object} obj
 * @return {String[]}
 * @public
 */
Object.keys = Object.enumerableKeys = function enumerableKeys(obj) {
    var hasEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
        skippedEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'],
        enumerates = [];
    if (!instanceOf(obj, Object) && (!instanceOf(obj, Function) || obj === null))
        throw new TypeError('enumerates called on non-object');
    function add(val) {
        if (obj.hasOwnProperty(val))
            this.push(val);
    }

    each(obj, add, enumerates);
    if (hasEnumBug) each(skippedEnums, add, enumerates);
    return enumerates;
};
/**
 * Define one or some properties to a object
 *
 * @param {Object|String} obj
 * @param {Object|String} [properties]
 * @param {Object|*} [desc]
 * @returns {Object} A 'obj' reference
 * @public
 */
Object.defineProperties = Object.defineProps = function defineProps(obj, properties, desc) {
    function regular(obj, name, desc) {
        if (instanceOf(desc, Object) && ('set' in desc || 'get' in desc || 'value' in desc || 'writable' in desc)) {
            desc.configurable = desc.configurable || false;
            desc.enumerable = desc.enumerable || true;
            if ('value' in desc) desc.writable = desc.writable || true;
            Object.defineProperty(obj, name, desc);
        } else obj[name] = desc;
        return obj;
    }

    if (instanceOf(obj, String)) return regular({}, obj, properties);
    if (instanceOf(properties, String)) return regular(obj, properties, desc);
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
            if (desc.hasOwnProperty(name) || defaults.hasOwnProperty(name))
                this[name] = !!desc[name] ? desc[name] : defaults !== undefined && !!defaults[name] ? defaults[name] : undefined;
        }, descriptor);
        each(["get", "set"], function (name) {
            var fun = desc[name];
            if (fun === undefined) return;
            if (!instanceOf(fun, Function))
                throw new TypeError("Bad " + name);
            this[name] = fun;
        }, descriptor);
        if (('set' in obj || 'get' in obj) && ('value' in obj || 'writable' in obj))
            throw new TypeError("The descriptor is confused about its identity");
        if (desc !== undefined)
            return descriptor;
    }

    if (!instanceOf(obj, Object) || obj === null)
        throw new TypeError("Bad object");
    each(enumerableKeys(Object(properties)), function (key) {
        Object.defineProperty(obj, key, convert(properties[key]));
    });
    return obj;
};
/**
 * Iterate over this object.
 * @see Object.each for more info
 *
 * @param {Function} fn - The function to run
 * @param {*} [thisArg] - The this representation
 * @returns {*} A reference to this object
 * @public
 */
Object.prototype.each = function each(fn, thisArg) {
    return Object.each(this, fn, thisArg);
};
/**
 * Test is this is a instance of the primitive
 *
 * @param {Function|Object} primitive
 * @return {Boolean}
 * @public
 */
Object.prototype.instanceOf = function instanceOf(primitive) {
    return instanceOf(this, primitive);
};
/**
 * Get every enumerable field in a object
 *
 * @return {Array.<String>}
 * @public
 */
Object.prototype.keys = function keys() {
    return enumerableKeys(this);
};
/**
 * Get every enumerable field in a object
 *
 * @return {Array.<String>}
 * @public
 */
Object.prototype.enumerableKeys = function enumerableKeys() {
    return enumerableKeys(this);
};
/**
 * Get every property name that the object owns
 *
 * @return {Array.<String>}
 * @public
 */
Object.prototype.getOwnPropertyNames = function getOwnPropertyNames() {
    return getOwnPropertyNames(this);
};
/**
 * Define one or some properties to a object
 *
 * @param {Object|String} [properties]
 * @param {Object|*} [desc]
 * @returns {Object} A this reference
 * @public
 */
Object.prototype.defineProps = function defineProps(properties, desc) {
    return defineProps(this, properties, desc);
};
/**
 * Define one or some properties to a object
 *
 * @param {Object|String} [properties]
 * @param {Object|*} [desc]
 * @returns {Object} A this reference
 * @public
 */
Object.prototype.defineProperties = function defineProperties(properties, desc) {
    return defineProps(this, properties, desc);
};


/**
 * Check if a object can be considered a array.
 *
 * @param {*} obj
 * @returns {Boolean}
 * @public
 */
Array.isArray = function (obj) {
    return instanceOf(obj, Array) ||
        instanceOf(obj, Object) && 'length' in obj && instanceOf(obj['length'], Number) && obj['length'] - 1 in obj
};
/**
 * Filter the array to a new array
 *
 * @param {Function} predicate
 * @param {*} [thisArg]
 * @returns {Array.<T>}
 * @template T
 * @public
 */
Array.prototype.filter = function filter(predicate, thisArg) {
    var len = this.length,
        idx = 0,
        item,
        result = [];
    thisArg = thisArg || this;
    while (idx < len) {
        predicate.item = predicate.it = item = this[idx];
        predicate.index = predicate.i = idx;
        predicate.array = this;
        if (predicate.call(thisArg, item, idx, this)) result.push(item);
        idx++;
    }
    return result;
};
/**
 * Get the first item matching the [predicate]
 *
 * @param {Function} predicate
 * @param {*} [thisArg]
 * @returns {T}
 * @template T
 * @public
 */
Array.prototype.first = function first(predicate, thisArg) {
    var len = this.length,
        idx = 0,
        item,
        result;
    thisArg = thisArg || this;
    while (idx < len && result == undefined) {
        predicate.item = predicate.it = item = this[idx];
        predicate.index = predicate.i = idx;
        predicate.array = this;
        if (predicate.call(thisArg, item, idx, this)) result = item;
        idx++;
    }
    return result;
};
/**
 * Loop through the array
 *
 * @param {Function} callback
 * @param {*} thisArg
 * @returns {void}
 * @public
 */
Array.prototype.forEach = function forEach(callback, thisArg) {
    var len = this.length,
        idx = 0,
        item;
    thisArg = thisArg || this;
    while (idx < len) {
        callback.item = callback.it = item = this[idx];
        callback.index = callback.i = idx;
        callback.array = this;
        callback.call(thisArg, item, idx, this);
        idx++;
    }
};
/**
 * Map items of an array to to something else.
 *
 * @param {Function} callback
 * @param {*} thisArg
 * @returns {Array.<T>}
 * @template T
 * @public
 */
Array.prototype.map = function map(callback, thisArg) {
    var len = this.length,
        idx = 0,
        item,
        result = [];
    thisArg = thisArg || this;
    while (idx < len) {
        callback.item = callback.it = item = this[idx];
        callback.index = callback.i = idx;
        callback.array = this;
        result.push(callback.call(thisArg, item, idx, this));
        idx++;
    }
    return result;
};
/**
 * Parse every item to a Number
 *
 * @param {Number} [radix]
 * @returns {Array.<Number>}
 * @public
 */
Array.prototype.mapToNumber = function (radix) {
    var item = it;
    return this.map(function () {
        return parseInt(item, radix || 10)
    });
};
/**
 * Get a item in the array
 *
 * @param  {Number} index
 * @returns {*}
 * @public
 */
Array.prototype.get = function get(index) {
    return this[index];
};


/**
 * Clamp this number between a max and a min
 *
 * @this {Number}
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
Number.prototype.clamp = function clamp(min, max) {
    return this < min ? min : this > max ? max : this;
};


/**
 * Clamp a number between a max and a min
 *
 * @param {Number} value
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
Math.clamp = function clamp(value, min, max) {
    return value < min ? min : value > max ? max : value;
};

/**
 * Copy an array
 *
 * @param {Array} arr
 * @param {Number} [from]
 * @param {Number} [to]
 */
function copy(arr, from, to) {
    var result = [];
    if (from === undefined) {
        each(arr, function (val) {
            this.push(val);
        }, result);
        return result;
    }
    var newLength = (to !== undefined ? to + 1 : arr.length) - from;
    if (0 < newLength <= arr.length) each(newLength, function (idx) {
        this.push(arr[from + idx]);
    }, result);
    return result;
}
/**
 *
 * @param {T...} element
 * @returns {Array.<T>}
 * @template T
 */
function arrayOf(element) {
    return arguments;
}