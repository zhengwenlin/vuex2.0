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
}