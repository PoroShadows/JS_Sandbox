export default class CreativeTabs {

    /**
     * @returns {CreativeTabs}
     */
    static get TOOLS() {
        if (this._tools == undefined)
            this._tools = new CreativeTabs()
        return this._tools
    }

    /**
     * @returns {CreativeTabs}
     */
    static get MISC() {
        if (this._misc == undefined)
            this._misc = new CreativeTabs()
        return this._misc
    }
}