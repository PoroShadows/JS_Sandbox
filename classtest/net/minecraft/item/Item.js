export default class Item {

    constructor() {}

    /**
     *
     * @param {String} name
     * @returns {Item}
     */
    setUnlocalizedName(name) {
        this._unlocalizedName = name
        return this
    }

    /**
     *
     * @param {CreativeTabs} tab
     * @returns {Item}
     */
    setCreativeTab(tab) {
        this._creativeTab = tab
        return this
    }

    setRegistryName(regName) {
        this._regestryName = regName
        return this
    }
}