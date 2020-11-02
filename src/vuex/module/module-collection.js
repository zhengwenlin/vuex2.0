import { forEachValue } from "../util"
import Module from "./module"

export default class ModuleCollection {
    constructor(options) {
        // 使用栈的方式来记录父子关系
        this.register([], options)
    }


    register(path, rootModule) {
        // 树有树根
        // let newModule = {
        //     _raw: rootModule,
        //     state: rootModule.state,
        //     _children: {}
        // }
        let newModule = new Module(rootModule)

        if(path.length === 0){
            // 根
            this.root = newModule
        }else{
            // 子
            // [a] [a, c] [b]
            // 找到父亲，放到父亲的_children中去即可
            let parent = path.slice(0,-1).reduce((prev, current, index,arr) => {
                // return prev._children[current]
                return prev.getChild(current)
            }, this.root)
            // parent._children[path[path.length - 1]] = newModule

            parent.addChild(path[path.length - 1],newModule)

        }

        // 如果有模块
        if(rootModule.modules){
            forEachValue(rootModule.modules, (module, key) => {
                this.register(path.concat(key), module)
            })
        }
    }
}