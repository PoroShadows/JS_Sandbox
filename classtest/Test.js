
import { Minecraft } from './net/minecraft/client'
import { ModelResourceLocation } from './net/minecraft/client/renderer/block/model'
import CreativeTabs from './net/minecraft/creativetab/CreativeTabs'
import { Items } from './net/minecraft/init'
import Mod from './net/minecraftforge/fml/common/Mod'
import EventHandler from './net/minecraftforge/fml/common/Mod.EventHandler'
import FMLPreInitializationEvent from './net/minecraftforge/fml/common/event/FMLPreInitializationEvent'
import FMLInitializationEvent from './net/minecraftforge/fml/common/event/FMLInitializationEvent'
import GameRegistry from './net/minecraftforge/fml/common/registry/GameRegistry'
import Item from './net/minecraft/item/Item'
import ItemStack from './net/minecraft/item/ItemStack'
import { ThatToolCanDoIt } from './'

//@Mod(modid = "")
export default class Test {

    constructor() {
        this.thatToolCanDoIt = new ThatToolCanDoIt().setUnlocalizedName("that_tool_can_do_it").setCreativeTab(CreativeTabs.TOOLS)
        this.whatABinding = new Item().setUnlocalizedName("what_a_binding").setCreativeTab(CreativeTabs.MISC).setRegistryName("what_a_binding")
    }

    preInit(event) {
        GameRegistry.register(this.thatToolCanDoIt)
        GameRegistry.register(this.whatABinding)
    }

    /**
     * @return {String}
     */
    static get ID () {
        return 'test'
    }

    /**
     * @return {String}
     */
    static get NAME () {
        return 'test'
    }

    /**
     * @return {String}
     */
    static get VERSION () {
        return 'test'
    }
}