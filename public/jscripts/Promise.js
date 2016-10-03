/**
 * WaterStream polyfill
 *
 * @param {function(resolve, reject)} resolver
 * @constructor
 */
function Promise(resolver) {
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
     * @returns {Promise}
     * @public
     */
    this.then = function (onResolved, onRejected) {
        return new Promise(function (resolve, reject) {
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
     * promise libraries
     *
     * Ensure error catch handles by the onRejected function
     *
     * @param {function(value)} [onResolved]
     * @param {function(reason)} [onRejected]
     * @returns {Promise}
     * @public
     */
    this.done = function (onResolved, onRejected) {
        return new Promise(function (resolve, reject) {
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
     * @returns {Promise}
     * @public
     */
    this.catch = function (onRejected) {
        return new Promise(function (resolve, reject) {
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
     * If value is an array spread the arguments.
     * Else nothing function as normal then
     *
     * @param {function(value)} [onResolved]
     * @param {function(reason)} [onRejected]
     * @returns {Promise}
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
Promise.all = function (iterable) {
    if (!iterable || iterable.length == 0)
        return Promise.resolve();
    var values = [];
    iterable = iterable.map(function (item) {
        return item && typeof item.then === 'function' ? item : Promise.resolve(item);
    });
    return new Promise(function (resolve, reject) {
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
 * the same way as the first passed promise to settle.
 * It resolves or rejects, whichever happens first.
 *
 * @param {Array.<WaterStream>} iterable
 * @returns {WaterStream}
 * @since 1.0
 * @public
 * @static
 */
Promise.race = function (iterable) {
    var calls = 0;
    return new Promise(function (resolve, reject) {
        each(iterable, function (item) {
            item.then(function (value) {
                if (calls < 1) {
                    ++calls;
                    resolve(value);
                }
            }, function (value) {
                if (calls < 1) {
                    ++calls;
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
Promise.reject = function (reason) {
    return new Promise(function (resolve, reject) {
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
Promise.resolve = function (value) {
    return new Promise(function (resolve) {
        resolve(value);
    });
};