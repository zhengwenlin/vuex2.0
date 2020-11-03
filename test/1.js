// 如何处理数据结构
/*
    1. 如何遍历一棵树
       - 树都有树根，遍历是从树根遍历的
       - 树的遍历都是递归遍历，要有递归函数
       - 如果子元素是对象（_children:{}）这种的，可以使用数组[]来记录父子关系
*/
// 比如sore的配置对象
let storeOptions = {
    state: {
        name: 'zf',
        age: 11
    },
    getters: {
        myAge(state) {
            return state.age
        }
    },
    mutations: {
        changeAge(state, payload) {
            state.age += payload
        }
    },
    actions: {
        changeAge(store, payload) {
            setTimeout(() => {
                store.commit('changeAge', payload)
            }, 1000)
        }
    },
    modules: {
        a: {
            namespaced: true,
            state: {
                aname: 'aname',
                age: 100
            },
            getters: {
                myname(state) {
                    return state.aname
                }
            },
            mutations: {
                changeAge(state, payload) {
                    console.log(state, '**')
                    state.age += payload
                }
            },
            actions: {
                changeAge(store, payload) {
                    setTimeout(() => {
                        store.commit('changeAge', payload)
                    }, 1000)
                }
            },
            modules: {
                c: {
                    namespaced: true,
                    state: {},
                    mutations: {
                        changeAge(state, payload) {
                            state.age += payload
                        }
                    },
                    actions: {
                        changeAge(store, payload) {
                            setTimeout(() => {
                                store.commit('changeAge', payload)
                            }, 1000)
                        }
                    }
                }
            }
        },
        b: {
            state: {
                aname: 'bname',
                age: 200
            },
            mutations: {
                changeAge(state, payload) {
                    state.age += payload
                }
            },
            actions: {
                changeAge(store, payload) {
                    setTimeout(() => {
                        store.commit('changeAge', payload)
                    }, 1000)
                }
            },
        }
    }
}
/**
 * 
 * {
 *   state: {},
 *   mutations: {},
 *   actions: {},
 *   getters: {},
 *   modules: {
 *     namespaced: true,           --- >         {_raw, state, _children}
 *     state: {},
 *     mutations: {},
 *     actions: {},
 *     getters: {},
 *     modules: {}
 *   }
 * }
 */
// 怎么处理这种类型的数据
// 比如我想将每个模块的
/**
 * 循环对象的方法
 * @param {*} target 
 * @param {*} fn 
 */
function forEachValue(target, fn) {
    Object.keys(target).forEach(key => fn(target[key], key))
}
let root;
// 处理树数据，-- > 处理成什么样的？ 结果想要一棵树，还是打平操作
function isntallModule(rootModule, path) {
    // 返回的结果还希望是一棵树
    // 肯定的定义一个树根
    
    // 创建成自己想要的数据结构
    let newModule = {
        _raw: rootModule,
        state: rootModule.state,
        _children: {} // children给默认值，因为递归的时候才知道儿子是啥
    }

    // 构建父子关系 根据path  path.length=0 根 / path.length > 0 子
    if (path.length == 0) {
        // 根
        root = newModule
    } else {
        // 子
        // 怎么找爸爸
        // 代码走到这里，root肯定是有值了，可以根据path来找爸爸，比如： [a, c] 
        // 当前就是 root._chilren[a]，就是[a]对应的module模块
        let parent = path.slice(0, -1).reduce((prev, current) => {
            return prev._children[current]
        }, root) // 从root开始找
        parent._children[path[path.length - 1]] = newModule // 设置当前的模块
    }

    // 递归创建
    if (rootModule.modules) { // 如果有儿子，递归创建
        forEachValue(rootModule.modules, (module, key) => {
            isntallModule(module, path.concat(key))
        })
    }

    return root;
}

let r = isntallModule(storeOptions, [])
console.log(JSON.stringify(r, null, 2))