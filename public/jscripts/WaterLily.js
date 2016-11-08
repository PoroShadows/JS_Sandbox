/*(function () {

 if ( typeof window.CustomEvent === "function" ) return false;

 function CustomEvent ( event, params ) {
 params = params || { bubbles: false, cancelable: false, detail: undefined };
 var evt = document.createEvent( 'CustomEvent' );
 evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
 return evt;
 }

 CustomEvent.prototype = window.Event.prototype;

 window.CustomEvent = CustomEvent;
 })();*/



/**
 * @param {NodeList|Element...|String} element
 * @constructor
 function Change(element) {
    element = is(element, String) ? WaterLily.find(element) : element;
    this.__elements = is(element, NodeList) ? element : Array.prototype.slice.call(arguments, 0);

    const template = (inst, attribute, name, value) => {
        if (value === undefined) {
            let ret
            const run = name => each.bind(null, inst.__elements,
                element => this.hasOwnProperty(name) ? this[name].push(element[attribute][name]) : this[name] = [element[attribute][name]],
                { thisArg: {}, gather: true })
            if (name === undefined) return inst.__elements[0][attribute];
            else if (is(name, Array))
                ret = each(name, name =>
                        inst.__elements.length == 1 ?
                        { [name]: inst.__elements[0][attribute][name] } :
                        { [name]: run(name) },
                    { gather: true })
            else if (is(name, String))
                ret = run(name)[name]
            else {

                return this;
            }
            return is(ret, Array) && ret.length == 1 ? ret[0] : ret;
        }
        return this;
    }

    /!**
     *
 * @param {String|Array.<String>|Object} name
 * @param {String|Number|Boolean|Function} [value]
 * @returns {Change}
 *!/
 this.css = (name, value) => template(this, 'style', name, value)
 this.attr = (name, value) => template(this, 'attributes', name, value)
 /!**
 * @param {Number} [idx]
 * @returns {Element|Array.<Element>}
 *!/
 this.get = idx => {
        const elements = this.__elements;
        return (
            !!idx ?
                idx < elements.length ?
                    idx >= 0 ?
                        elements[idx] :
                        elements[0] :
                    elements[this.__elements.length - 1] :
                elements.length == 1 ?
                    elements[0] :
                    elements
        );
    }
 }

 /!**
 *
 * @param {NodeList|Element...|String} element
 * @returns {Change}
 *!/
 WaterLily.change = element => new Change(element)*/





/*if (arguments[2].constructor.name === 'Module')
 module.exports = {
 WaterLily,
 flow,
 WaterStream
 }*/
//noinspection JSDuplicatedDeclaration
const { WaterLily, WaterStream, Delta } = (() => {
    /**
     * Test is the object is a instance of the primitive
     *
     * @param {*} obj
     * @param {Function|Object} primitive
     * @param {Boolean} [strict]
     * @return {Boolean}
     * @public
     */
    const is = (obj, primitive, strict) => {
        return (
            obj == undefined ?
                primitive == undefined :
                primitive.constructor === Function || primitive.constructor === Object ?
                    strict || false ?
                        obj.constructor === primitive :
                        primitive.constructor === Array ?
                            (obj.constructor === Object && 'length' in obj && obj['length'].constructor === Number && obj['length'] - 1 in obj) || true :
                            obj.constructor === primitive ?
                                true :
                                primitive.isPrototypeOf(obj) :
                    strict || true ?
                        obj === primitive :
                        obj == primitive
        )
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
     * @param {*} obj - The whatever to iterate over
     * @param {Function} fn - The function to run
     * @param {Object} [opts] - Options
     * @param {*} [opts.thisArg] - The this representation
     * @param {Function} [opts.predicate] - The this representation
     * @param {*} [opts.returns] - The this representation
     * @param {Boolean} [opts.gather=false] - The this representation
     * @param {Boolean} [opts.promise=false] - The this representation
     * @param {Boolean} [opts.onlyIf=true] - The this representation
     * @param {Boolean} [opts.mustOwn=true] - If object must own the iterated name
     * @returns {*} The 'obj' reference
     * @public
     */
    const each = (obj, fn, opts) => {
        if (is(obj, undefined, false) || is(fn, undefined)) return obj
        opts = defaults(opts, {
            gather: false,
            promise: false,
            runIf: true,
            returns: obj,
            predicate: () => true,
            thisArg: obj,
            mustOwn: true
        })
        let idx = 0, name = '', next = {}, gather = []

        if (opts.runIf) {
            const run = (...args) => gather.push(opts.predicate(...args) ? fn.apply(opts.thisArg, args) : null)

            if (is(obj, Array) || is(obj, String)) for (; idx < obj['length']; idx++)                   run(obj[idx], idx, obj)
            else if (is(obj, Number)) for (; idx < obj; idx++)                                          run(idx, obj)
            else if (is(obj, Object)) if (!opts.mustOwn || opts.mustOwn && obj.hasOwnProperty(name))    run(name, obj[name], obj)
            else if (is(obj, Boolean) && obj)                                                           run(obj)
            else if ('Symbol' in window && is(obj, Symbol)) while (!(next = obj.next()).done)           run(next.value, next.done, obj)

            if (gather.filter(item => !is(item, Object)).length == 0) {
                let temp = {}
                for (let i = 0, obj = gather[i]; i < gather.length; i++, obj = gather[i])
                    temp = mergeObjects(temp, obj)
                gather = temp
            }
        }
        const ret = opts.gather ? gather : opts.returns
        return opts.promise ? WaterStream.resolve(ret) : ret
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
    const mergeObjects = (first, second, override) => {
        for (let i = 0, keys = Object.keys(second), key = keys[i]; i < keys.length; i++, key = keys[i])
            if (!(key in first) || key in first && override)
                first[key] = second[key]
        return first
    }
    /**
     *
     * @param {Object} actual
     * @param {Object} defaults
     */
    const defaults = (actual, defaults) => actual == undefined ? defaults : mergeObjects(actual, defaults)
    /**
     * Define one or some properties to a object
     *
     * @param {Object|String} obj
     * @param {Object|String} [properties]
     * @param {Object|*} [desc]
     * @returns {Object} A 'obj' reference
     * @public
     */
    const defineProps = (obj, properties, desc) => {
        const isDesc = obj => is(obj, Object) && ('set' in obj || 'get' in obj) && ('value' in obj || 'writable' in obj) &&
        Object.keys(obj).join('').replace(/set|get|value|writable|configurable|enumerable/g, '').length == 0


        const regular = (obj, name, desc) => {
            if (isDesc(desc)) {
                desc.configurable = desc.configurable || false
                desc.enumerable = desc.enumerable || true
                if ('value' in desc) desc.writable = desc.writable || true
                Object.defineProperty(obj, name, desc)
            } else obj[name] = desc
            return obj
        }

        if (is(obj, String)) return regular({}, obj, properties)
        if (is(properties, String)) return regular(obj, properties, desc)
        if (!properties) {
            properties = obj
            obj = {}
        }
        const defaults = desc || {}

        const convert = desc => {
            if (is(desc, undefined) || !is(desc, Object))
                return desc;
            let descriptor = {}
            each(["enumerable", "configurable", "value", "writable"],
                name => this[name] = !!desc[name] ? desc[name] : !!defaults[name] ? defaults[name] : undefined,
                { thisArg: descriptor, predicate: name => desc.hasOwnProperty(name) || defaults.hasOwnProperty(name) })
            each(["get", "set"],
                name => {
                    const fun = desc[name]
                    if (!is(fun, Function))
                        throw new TypeError("Bad " + name)
                    this[name] = fun;
                },
                { thisArg: descriptor, predicate: name => desc[name] !== undefined })
            if (('set' in obj || 'get' in obj) && ('value' in obj || 'writable' in obj))
                throw new TypeError("The descriptor is confused about its identity")
            return descriptor
        }

        if (!is(obj, Object))
            throw new TypeError("Bad object")
        each(Object.keys(properties), key => {
            const desc = convert(properties[key])
            if (isDesc(desc))
                Object.defineProperty(obj, key, desc)
            else obj[key] = desc
        })
        return obj
    }


    /**
     * WaterStream is a Promise polyfill
     *
     * The function onCancel takes a function that runs when the promise is canceled
     *
     * @param {function(resolve, reject, onCancel)} resolver
     * @returns {WaterStream}
     * @public
     * @constructor
     */
    function WaterStream(resolver) {
        let state = 'pending',
            value,
            deferred,
            cancellationFunction

        //noinspection JSUnusedGlobalSymbols
        /**
         * If the promise has fulfilled
         *
         * @returns {Boolean}
         * @public
         */
        this.isFulfilled = () => state == 'fulfilled'
        //noinspection JSUnusedGlobalSymbols
        /**
         * If the promise is pending
         *
         * @returns {Boolean}
         * @public
         */
        this.isPending = () => state == 'pending'
        //noinspection JSUnusedGlobalSymbols
        /**
         * If the promise has rejected
         *
         * @returns {Boolean}
         * @public
         */
        this.isRejected = () => state == 'fulfilled'
        //noinspection JSUnusedGlobalSymbols
        /**
         * If the promise has resolved
         *
         * @returns {Boolean}
         * @public
         */
        this.isResolved = () => state == 'resolved'
        /**
         * Returns if the promise is cancelable
         *
         * @returns {Boolean}
         */
        this.isCancelable = () => cancellationFunction != undefined

        const onCancel = fn => cancellationFunction = fn
        const resolve = newValue => {
            try {
                if (newValue && typeof newValue.then === 'function')
                    return newValue.then(resolve, reject);
                state = 'resolved';
                value = newValue;

                if (deferred)
                    handle(deferred);
            } catch (e) {
                reject(e);
            }
        }
        const reject = reason => {
            state = 'rejected';
            value = reason;

            if (deferred)
                handle(deferred)
        }
        const handle = handler => {
            if (state === 'pending')
                return deferred = handler;
            setTimeout(() => {
                const isResolved = state === 'resolved',
                    handlerFN = isResolved ? handler.onResolved : handler.onRejected

                if (!handlerFN)
                    return handler[isResolved ? 'resolve' : 'reject'](value)

                let ret
                try {
                    ret = handlerFN(value)
                    if (!this.isFulfilled())
                        handler.resolve(ret)
                } catch (e) {
                    if (!this.isFulfilled())
                        handler.reject(e)
                }
                state = 'fulfilled'
            }, 1)
        }

        /**
         * Resolve what to do with the value
         *
         * @param {function(value)} [onResolved]
         * @param {function(reason)} [onRejected]
         * @returns {WaterStream}
         * @public
         */
        this.then = (onResolved, onRejected) => new WaterStream((resolve, reject) => handle({
            onResolved: onResolved,
            onRejected: onRejected,
            resolve: resolve,
            reject: reject
        }))
        /**
         * Can be useful for error handling in your promise
         * composition.
         *
         * The Error type is not a standard parameter!!!
         * Catch only if it is a specific error *.catch(type, onRejected)
         *
         * @param {function(reason)|Function} [onRejected]
         * @param {function(reason)} [fn]
         * @returns {WaterStream}
         * @public
         */
        this.catch = (onRejected) => new WaterStream((resolve, reject) => handle({
            onResolved: undefined,
            onRejected: onRejected,
            resolve: resolve,
            reject: reject
        }))



        /**
         * NOT STANDARD
         * Do not expect this to work in other Promise libraries.
         *
         * Ensure error catch handles by the onRejected function
         *
         * @param {function(value)} [onResolved]
         * @param {function(reason)} [onRejected]
         * @returns {WaterStream}
         * @public
         */
        this.try = (onResolved, onRejected) => this.then(onResolved).catch(onRejected)
        /**
         * NOT STANDARD
         * Do not expect this to work in other Promise libraries.
         *
         * Make a callback from the promise.
         *
         * @param {Function} cb
         * @param {*} [ctx]
         * @returns {WaterStream|void}
         * @public
         */
        this.callback = (cb, ctx) => {
            if (typeof cb !== 'function') return this;
            this.then(value => cb.call(ctx, null, value))
                .catch(reason => cb.call(ctx, reason))
        }
        /**
         * NOT STANDARD
         *
         * Cancel this promise if it is cancelable
         */
        this.cancel = () => {
            if (this.isCancelable()) {
                cancellationFunction()
                state = 'canceled'
            } else return this
        }



        //noinspection JSCheckFunctionSignatures
        resolver(resolve, reject, onCancel)
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
    WaterStream.all = iterable => new WaterStream((resolve, reject) => {
        const values = [];
        iterable = iterable.map(item => item && typeof item.then === 'function' ? item : WaterStream.resolve(item))
        for (let i = 0; i < iterable.length; i++)
            iterable[i].then(value => {
                values[i] = value;
                if (values.length == iterable.length)
                    resolve(values);
            }, reject);
    })
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
    WaterStream.race = iterable => new WaterStream((resolve, reject) => {
        let block = false
        const bfn = (fn, v) => {
            if (block) return
            else block = true
            fn(v)
        }
        for (let i = 0; i < iterable.length; i++)
            iterable[i].then(value => bfn(resolve, value), reason => bfn(reject, reason))
    })
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
    WaterStream.reject = reason => new WaterStream((resolve, reject) => reject(reason))
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
    WaterStream.resolve = value => new WaterStream(resolve => resolve(value))
    /**
     * Make a function return a promise.
     *
     * Useful for callback functions
     *
     * @param {Function} fn
     * @param {Number} [argumentCount] - The amount of parameters the function will have
     * @param {Boolean} [hasErrorPar=true] - If the callback has error in callback
     * @returns {Function}
     */
    WaterStream.promisify = (fn, argumentCount, hasErrorPar) => {
        argumentCount = argumentCount || Infinity
        hasErrorPar = hasErrorPar || true
        return function () {
            const self = this
            const args = Array.prototype.slice.call(arguments)
            return new WaterStream((resolve, reject) => {
                while (args.length && args.length > argumentCount) args.pop()
                args.push((err, res) => {
                    if (!hasErrorPar)
                        resolve['apply'](Array.prototype.slice.call(arguments))
                    else if (err) reject(err)
                    else resolve(res)
                })
                const result = fn.apply(self, args)
                if (result) resolve(result)
            });
        }
    }
    /**
     * Make asynchronous code look like synchronous
     *
     * @param {Generator|Function} co
     * @returns {WaterStream}
     */
    WaterStream.flow = co => {
        const iterator = co(),
            iterate = iteration => {
                if (iteration.done) return iteration.value
                const value = iteration.value
                return typeof value.then === 'function' ?
                    value.then(val => iterate(iterator.next(val))) :
                    WaterStream.resolve(iterate(iterator.next(value)))
            }
        return iterate(iterator.next())
    }

    /**
     *
     * @param {String|Function} select
     * @param {Object|null|Element|Document|String} [data]
     * @param {Element...|String...|Array.<Element|String>...} [content]
     * @returns {Element|Element[]|WaterStream}
     */
    const WaterLily = function (select, data, content) {
        return new (function () {
            if (is(select, String))
                return /\s+|^<.*>$/g.test(select) || is(data, null) || is(data, Object) ?
                    WaterLily.create.apply(null, arguments) :
                    WaterLily.find(select, data)
            else if (is(select, Function))
                switch (select.length) {
                    case 0:
                    case 1:
                        window.addEventListener('DOMContentLoaded', select)
                        break
                    case 2:
                        return new WaterStream(select)
                }
            else if (is(select, Array)) {

            }
        })(select, data, content)
    }
    WaterLily.prototype = {
        length: 0,
        constructor: WaterLily,
        get (idx) {
            return is(idx, Number) ? this[idx] : []
        }
    }

    /**
     * Find a element in the document or in a custom context
     *
     * @param {String} selector
     * @param {Element|String|Document} [context=document]
     * @returns {NodeList|Element|undefined}
     * @public
     * @static
     */
    WaterLily.find = (selector, context) => {
        context = is(context, Element) ? context : is(context, String) ? WaterLily.find(context) : document
        const list = context.querySelectorAll(selector)
        return list.length > 1 ? list : list.length == 1 ? list[0] : undefined
    }
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
        tagName = tagName || 'div'
        content = is(content, Array) ? content : Array.prototype.slice.call(arguments, 2)
        if (/\s+|^<.*>$/g.test(tagName)) {
            tagName = tagName.replace(/^<|>$/g, '')
            //noinspection SpellCheckingInspection
            let attribs = tagName.split(/\s/), attrs = {}, key = ''
            tagName = attribs.splice(0, 1)[0]
            each(attribs,
                function (item) {
                    key = this(attrs,
                        key ? key : /=+/.test(item) ? (item = item.split(/=/)).splice(0, 1)[0] : item,
                        key ? item : Array.isArray(item) ? item.join('=').replace(/^"|^'/g, '') : ''
                    );
                },
                {
                    thisArg: (attrs, key, value) => {
                        attrs[key] = (attrs.hasOwnProperty(key) ? attrs[key] + ' ' : '') + value;
                        if (!value) return '';
                        if (/"$|'$/g.test(value)) {
                            attrs[key] = attrs[key].replace(/"$|'$/g, '');
                            return '';
                        }
                        return key;
                    }, runIf: !/^(\s?)+$/.test(attribs.join(' '))
                })
            attributes = defineProps(attributes || {}, attrs)
        }
        const elem = document.createElement(tagName)
        each(attributes || {}, HTMLElement.prototype.setAttribute, { thisArg: elem })
        each(content,
            item => elem.appendChild(is(item, String) ? document.createTextNode(item) : item))
        return elem
    }
    WaterLily.is = is

    function Response(data, error, xhr) {
        this.data = data
        this.error = error
        this.type = xhr.responseType || 'text'

        this.json = () => WaterStream.resolve(JSON.parse(this.data))
    }

    /**
     * Make ajax call.
     *
     * @param {String} url
     * @param {Object} [req]
     * @param {String} [req.method=GET] - GET, POST, PUT, DELETE, OPTIONS, HEAD, ...
     * @param {String} [req.type=''] - arraybuffer (ArrayBuffer), blob (Blob), document (Document), json (Object), text (DOMString)
     * @param {Object} [req.headers={}]
     * @param {Object} [req.query={}]
     * @param {String|ArrayBuffer|Blob|Document|FormData} [req.post]
     * @param {Boolean} [req.async=true]
     * @param {String} [req.user]
     * @param {String} [req.password]
     * @returns {WaterStream}
     * @public
     * @static
     */
    WaterLily.ajax = (url, req) => new WaterStream((resolve, reject, onCancel) => {
        if (is(url))
        if (!is(url, String)) {
            url = req
            url = req.url
        }
        req = defaults(req, {
            method: 'GET',
            type: '',
            headers: {},
            query: {},
            post: undefined,
            async: true,
            user: undefined,
            password: undefined
        })
        let xhr
        try {
            xhr = new XMLHttpRequest()
        } catch (e) {
            let namespaces = ["MSXML2.XMLHTTP.5.0", "MSXML2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"],
                success = false
            for (let i = 0; i < namespaces.length && !success; success = xhr != undefined, i++)
                try { xhr = new ActiveXObject(namespaces[i]) } catch (e) {}
            if (!success) throw new Error("AJAX is unavailable");
        }
        onCancel(() => xhr.abort())
        xhr.responseType = req.type || ''
        each(req.headers, xhr.setRequestHeader)
        let params = each(req.query,
            (name, value) => `${this.indexOf(name) == 0 ? '?' : '&'}${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
            { thisArg: Object.keys(req.query), gather: true }).join('')
        if (url.includes('?')) params = params.replace(/^?/, '&')
        xhr.open(req.method, url + params, req.async, req.user, req.password)
        //noinspection SpellCheckingInspection
        xhr.onload = () => 200 <= xhr.status < 300 ?
            resolve(new Response(xhr.response, undefined, xhr)) :
            reject(new Response(undefined, xhr.statusText, xhr))
        //noinspection SpellCheckingInspection
        xhr.onerror = () => reject(new Response(undefined, Error('Network failed'), xhr))
        xhr.send(req.post)
    })



    /**
     *
     * @return {{go: go, init: init, remove: remove, addRoute: (function(RegExp, Element))}}
     * @constructor
     */
    const Delta = function () {
        let routes = {}
        let searchAttribute = 'route'
        let inTransition = false
        let currentView, newView

        function onChanged() {
            const path = window.location.pathname
            const regRoutes = Object.keys(routes)
            const route = regRoutes.find(x => x.test(path))
            const data = route.exec(path)

            if (!route) return WaterStream.reject(new Error("Could not find a matching route"))

            newView = routes[route]

            if (inTransition) return WaterStream.resolve()
            inTransition = true

            let outViewPromise = Promise.resolve()

            if (currentView) {
                if (currentView === newView) {
                    inTransition = false
                    return currentView.update(data)
                }
                outViewPromise = currentView.out(data)
            }

            return outViewPromise.then(_ => {
                currentView = newView
                inTransition = false
                return newView.in(data)
            })
        }

        const clearRoutes = () => routes = {}
        const addRoute = (regExp, view) => {
            if (routes.hasOwnProperty(regExp))
                return console.warn(`Route already exists: ${regExp}`)
            view.update = view.update || WaterStream.resolve()
            view.in = view.in || WaterStream.resolve()
            view.out = view.out || WaterStream.resolve()
            routes[regExp] = view
        }

        function addRoutes() {
            each(document.querySelectorAll(`[${searchAttribute}]`),
                view => addRoute(new RegExp(view.getAttribute(searchAttribute), 'i'), view),
                { thisArg: this, predicate: view => !view.getAttribute(searchAttribute) })
        }

        function init(attribute) {
            searchAttribute = attribute || searchAttribute
            window.addEventListener('popstate', onChanged)
            clearRoutes()
            addRoutes()
            onChanged()
        }

        function remove() {
            window.removeEventListener('popstate', onChanged)
        }

        function go(url) {
            window.history.pushState(null, null, url)
            return onChanged()
        }

        return {
            go,
            init,
            remove,
            addRoute
        }
    }

    return {
        WaterLily,
        WaterStream,
        Delta
    }
})()
//export {WaterLily}