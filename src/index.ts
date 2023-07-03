/* eslint-disable no-console */
import FooLib from './foolib'
import { proxy } from './proxy'

const foolib = new FooLib()

foolib.hook('hook1:before', async (arg) => {
  arg.a = 100
  console.log('hook1 add 1', arg)
})

foolib.hook('hook1', async () => {
  setTimeout(() => {
    console.log('hook1 add 2 with setTimeout 0')
  }, 0)
})

foolib.hook('hook1:before', async () => {
  console.log('hook1:before add 1')
})
foolib.hook('hook1:after', async () => {
  console.log('hook1:after add 1')
})

// foolib.someFunction()

// console.log(foolib.somFunction2())

// console.log(obj.a)
console.log(proxy.a)
proxy.a = 2
