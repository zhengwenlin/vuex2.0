/**
 * 遍历对象
 * @param {*} target 
 * @param {*} fn 
 */
export function forEachValue(target = {}, fn) {
    Object.keys(target).forEach(key => fn(target[key], key))
}