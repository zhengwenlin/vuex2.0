import ModuleCollection from "./module/module-collection"
import { forEachValue } from "./util"

function getSate(store, path){
  // 根据路径获取状态
  return path.slice(0,-1).reduce((rootState, current) => {
    return rootState[current]
  }, store.state) // store.state是通过类的属性访问器获取属性，是最新的状态
}

// 安装模块
/**
  module = {
      state, mutations, actions, getters
  }
 */
function installModule(store, path, module, rootState){
    // 处理state
    if(path.length > 0){
        // 子模块，将子模块的state都合并到根模块状态中
        path.slice(0, -1).reduce((rootState, current) => {
            return rootState[current]
        }, rootState)
    }
    // 处理mutations
    if(module.mutations){ // commit(type, payload) -> store.mutations[type].forEach(fn => fn(payload))
        // 循环当前模块的mutations对象
        forEachValue(module.mutations, (fn, key) => {
            store.mutations[key] = (payload) => {
                // fn是用户定义的mutations，两个参数(state, paylaod)
                fn.call(store, getSate(store, path), payload)
            } 
        })
    }
    // 处理anctions
    if(module.actions){
        forEachValue(module.actions, (fn, key) => {
            store.actions[key] = (payload) => { // dispatch(type, payload)
                fn.call(store, store, payload)
            }
        })
    }

    if(module.getters) {

    }
    // 递归安装模块
    if(module._children){
        forEachValue(module._children, (child, key) => {
            installModule(store, path.concat(key), child, rootState)
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