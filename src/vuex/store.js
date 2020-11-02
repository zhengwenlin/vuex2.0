import ModuleCollection from "./module/module-collection"
import { forEachValue } from "./util"

// 安装模块
/**
  module = {
      state, mutations, actions, getters
  }
 */
function installModule(store, path, module, rootState){

    if(module.mutations){ // commit(type, payload) -> store.mutations[type].forEach(fn => fn(payload))
        forEachValue(module.mutations, (fn, key) => {
            store.mutations[key] = (payload) => {
                fn.call(store, payload)
            }
        })
    }
}
export default class Store {
    constructor(options) {
        // 收集模块 options => 树, 处理数据
        this._modules = new ModuleCollection(options)

        this.mutations = {} // 将所有模块的mutations都保存到这个对象中
        this.actions = {} // 将所有模块的actions都放到这个对象中
        this.getters = {}

        let state = options.state; // 用户传入的状态
        // 安装模块 将模块中的state、mutations、actions、getters等进行模块合并
        installModule(this, [], this._modules.root, state)
    }
}

/**
 * let root = {
 *    _raw: {state,mutations, actions, getters},
 *    state: rootState,
 *    _children: {
 *        a: {
 *          _raw: {state,mutations, actions, getters},
 *          state: aState,
 *          _children: {}
 *        }
 *    }
 * }
 */