import { _Vue } from "./mixin"
import ModuleCollection from "./module/module-collection"
import { forEachValue } from "./util"

function getSate(store, path) {
    // 根据路径获取状态
    return path.slice(0, -1).reduce((rootState, current) => {
        return rootState[current]
    }, store.state) // store.state是通过类的属性访问器获取属性，是最新的状态
}
// 安装模块
/**
  root = {_raw, _children, state}
 */
// 将state、mutataions、actons、getters都定义在store上
function installModule(store, path, module, rootState) {
    let namespaced = store._modules.getNamespace(path)
    console.log(namespaced, '***********')
    if (path.length > 0) {
        // 子模块  将子模块的状态合并到根状态
        // [a] [a, c] [b]
        let parent = path.slice(0, -1).reduce((prev, current) => {
            return prev[current]
        }, rootState)
        // 第一次的时候，[a] -> []  返回的就是rootState
        // path.a = xxx
        // parent[path[path.length - 1]] = module.state; 
        _Vue.set(parent, path[path.length - 1], module.state)
    }

    module.forEachMutations((mutationFn, key) => {
        store.mutations[key] = (store.mutations[key] || [])
        store.mutations[key].push((payload) => mutationFn.call(store, module.state, payload))
    })
    module.forEachActions((actionFn, key) => {
        store.actions[key] = (store.actions[key] || [])
        store.actions[key].push((payload) => actionFn.call(store, store, payload))
    })
    module.forEachGetters((getterFn, key) => {
        // 不是数组，重复就覆盖
        store.wrapGetters[key] = () => {
            getterFn.call(store, rootState)
        }
    })
    module.forEachChildren((childModule, key) => {
        installModule(store, path.concat(key), childModule, rootState)
    })

}

function resetStoreVM(store, state) {
    let computed = {}
    // 处理getters
    forEachValue(store.wrapGetters, (getter, key) => {
        computed[key] = getter
        Object.defineProperty(store.getters, key, {
            get: () => {
                return store._vm[key]
            }
        })
    })
    this._vm = new _Vue({
        data: {
            $$state: state
        },
        computed
    })
}

export default class Store {
    constructor(options) {
        // 收集模块 options => 树, 处理数据
        this._modules = new ModuleCollection(options)

        this.mutations = {} // 将所有模块的mutations都保存到这个对象中
        this.actions = {} // 将所有模块的actions都放到这个对象中
        this.wrapGetters = {}
        this.getters = {}


        let state = options.state; // 用户传入的状态

        // 安装模块 将模块中的state、mutations、actions、getters等进行模块合并
        installModule(this, [], this._modules.root, state)

        resetStoreVM(this, state)

        console.log(this._vm.myAge, 'vm**')
    }
    //属性访问器
    get state() {
        return this._vm._data.$$state;
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