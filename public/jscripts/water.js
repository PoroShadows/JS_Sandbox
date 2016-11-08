/**
 * Created on 22/09/2016.
 */

var __scope = eval('this');

/**
 *
 * @param {Function} constructor
 * @param {Function} [extending]
 * @param {*...} [superArg]
 */
function fix(constructor, extending, superArg) {
    var args = Array.from(arguments);
    constructor.prototype = (extending || Object).apply(constructor.prototype, args.length > 2 ? args.slice(2) : []);
    constructor.prototype.constructor = constructor;
}

function Water(kind) {
    fix(Water);
    this.kind = kind;
}

function Stream2(kind) {
    fix(Stream2, Water, kind)
}

console.log(new Stream2('yeas').constructor);