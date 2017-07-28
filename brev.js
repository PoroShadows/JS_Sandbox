var brev;
(function (brev) {
    var Brev = (function () {
        function Brev() {
        }
        Brev.prototype._search = function (eventName, listener) {
            if (eventName in this._listeners)
                for (var i = 0, array = this._listeners[eventName]; i < array.length; i++)
                    if (array[i].listener === listener)
                        return i;
            return -1;
        };
        Brev.prototype.on = function (eventName, listener) {
            this.many(eventName, Infinity, listener);
        };
        Brev.prototype.off = function (eventName, listener) {
            var search = this._search(eventName, listener);
            if (search !== -1)
                this._listeners[eventName].splice(search, 1);
        };
        Brev.prototype.once = function (eventName, listener) {
            var _this = this;
            return new Promise(function (resolve) { return _this.on(eventName, function (event) {
                if (listener)
                    resolve(listener(event));
                resolve(event);
            }); });
        };
        Brev.prototype.many = function (eventName, max, listener) {
            if (this._search(eventName, listener) == -1) {
                var ref = this._listeners[eventName] || (this._listeners[eventName] = []);
                ref.push({
                    executed: 0,
                    max: max,
                    listener: listener
                });
            }
        };
        Brev.prototype.emit = function (eventName, event) {
            if (eventName in this._listeners) {
                var brevListeners = this._listeners[eventName];
                for (var _i = 0, brevListeners_1 = brevListeners; _i < brevListeners_1.length; _i++) {
                    var brevListener = brevListeners_1[_i];
                    brevListener.listener(event);
                    brevListener.executed++;
                    if (brevListener.executed >= brevListener.max)
                        this.off(eventName, brevListener.listener);
                }
            }
        };
        return Brev;
    }());
    function createBus() {
        return new Brev();
    }
    function reflect(bus, eventName) {
        return eventName ? bus._listeners[eventName] : Object.keys(bus._listeners);
    }
})(brev || (brev = {}));
