/* eslint-disable no-console */
export const obj = {
  a: 1,
  b: 2,
}

export const proxy = new Proxy(obj, {
  get(target, prop: keyof typeof obj) {
    console.log('get', target, prop)
    return target[prop]
  },
  set(target, prop: keyof typeof obj, value: any) {
    console.log('set', target, prop, value)
    return target[prop] = value
  },
})

export const val = 1

// export const proxyVal = {
//   get value() {
//     return val
//   },
//   set value(v) {
//     value = v
//   },
// }
