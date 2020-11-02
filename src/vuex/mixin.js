export let _Vue;
export function install(Vue, options) {
    _Vue = Vue;


    // 给组件都扩展$store属性
    Vue.mixin({
        beforeCreate() {
            if (this.$options.store) {
                // 根
                this.$store = this.$options.store
            } else {
                // 子组件
                if (this.$parent && this.$parent.$store) {
                    this.$store = this.$parent.$store
                }
            }
        },
    })
}