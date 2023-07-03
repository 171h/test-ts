/* eslint-disable no-console */
import { createHooks } from 'hookable'

// Create a hookable instance
const hooks = createHooks()

hooks.hook('hello', () => {
  console.log('Hello World')
})
// hooks.addHooks({
//   // 'hello:before': () => console.log('Before Hello World'),
//   // 'hello': () => {
//   //   console.log('Hello World')
//   // },
//   // 'hello:after': () => console.log('After Hello World'),
//   hello: {
//     before: () => console.log('Before Hello World'),
//     after: () => console.log('After Hello World'),
//   },
// })

const hello2 = hooks.hook('hello', () => {
  console.log('Hello World 2')
})

hooks.callHook('hello')

setTimeout(() => {
  hello2()
  hooks.callHook('hello')
}, 1000)
