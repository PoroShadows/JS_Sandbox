

function no_op() {
}
function Promise(executor) {
    if (!instanceOf(this, Object)) {
        throw new TypeError('Promises must be constructed via new');
    }
    if (!instanceOf(executor, Function))
        throw new TypeError("'executor' is not a function");
    this.__state = 0;
    this.__next = null;
    this.__chain = [];
    if (executor === no_op) {
        return;
    }
    doResolve(executor, this);
}
function doResolve(executor, promise) {

}

/*

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
each([
    'instanceOf',
    'getOwnPropertyNames',
    ['enumerableKeys', 'keys'],
    ['defineProps', 'defineProperties'],
    'create'
], function (name) {
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
if (instanceOf(module, Object) && instanceOf(module.exports, Object))
    module.exports = {
        instanceOf: instanceOf,
        each: each,
        getOwnPropertyNames: getOwnPropertyNames,
        enumerableKeys: enumerableKeys,
        define: defineProps,
        create: create
    };

// Test section

