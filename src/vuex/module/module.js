import { forEachValue } from "../util"
export default class Module {
    constructor(rootModule) {
        this._raw = rootModule
        this.state = rootModule.state
        this._children = {}
    }

    getChild(key) {
        return this._children[key]
    }

    addChild(key, module) {
        return this._children[key] = module
    }
    forEachMutations(fn) {
        if (this._raw.mutations) {
            forEachValue(this._raw.mutations, fn)
        }
    }


    forEachActions(fn) {
        if (this._raw.actions) {
            forEachValue(this._raw.actions, fn)
        }
    }

    forEachGetters(fn) {
        if (this._raw.getters) {
            forEachValue(this._raw.getters, fn)
        }
    }

    forEachChildren(fn) {
        forEachValue(this._children, fn)
    }
}