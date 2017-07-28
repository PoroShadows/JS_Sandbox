module brev {
    interface BrevListener {
        executed: number
        max: number
        listener: (event: any) => void
    }

    class Brev {
        _listeners: Object

        private _search<E>(eventName: string, listener: (event: any) => void): number {
            if (eventName in this._listeners)
                for (let i: number = 0, array: BrevListener[] = this._listeners[eventName]; i < array.length; i++)
                    if (array[i].listener === listener)
                        return i
            return -1
        }

        on(eventName: string, listener: (event: any) => void): void {
            this.many(eventName, Infinity, listener)
        }

        off(eventName: string, listener: (event: any) => void): void {
            const search: number = this._search(eventName, listener)
            if (search !== -1)
                this._listeners[eventName].splice(search, 1)
        }

        once<Result>(eventName: string, listener?: (event: any) => Result): PromiseLike<any | Result> {
            return new Promise(resolve => this.on(eventName, event => {
                if (listener)
                    resolve(listener(event))
                resolve(event)
            }))
        }

        many(eventName: string, max: number, listener: (event: any) => void): void {
            if (this._search(eventName, listener) == -1) {
                const ref = this._listeners[eventName] || (this._listeners[eventName] = [])
                ref.push({
                    executed: 0,
                    max: max,
                    listener
                })
            }
        }

        emit(eventName: string, event?: any): void {
            if (eventName in this._listeners) {
                const brevListeners: BrevListener[] = this._listeners[eventName]
                for (let brevListener of brevListeners) {
                    brevListener.listener(event)
                    brevListener.executed++
                    if (brevListener.executed >= brevListener.max)
                        this.off(eventName, brevListener.listener)
                }
            }
        }
    }

    function createBus(): Brev {
        return new Brev()
    }

    function reflect(bus: Brev, eventName?: string): string[] | BrevListener[] {
        return eventName ? bus._listeners[eventName] : Object.keys(bus._listeners)
    }
}