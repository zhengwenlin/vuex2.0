import Vue from 'vue'
import Vuex from '../vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    name: 'zf',
    age: 11
  },
  getters:{
    myAge(state){
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
      getters:{
        myname(state){
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
})
