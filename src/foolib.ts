/* eslint-disable no-console */
import { Hookable } from 'hookable'

export default class FooLib extends Hookable {
  constructor() {
    // Call to parent to initialize
    super()
    // Initialize Hookable with custom logger
    // super(consola)
    // this.hook('hook1', () => {
    //   console.log('hook1 self')
    // })

    // this.hook('hook1', async () => {
    //   setTimeout(() => {
    //     console.log('hook1 self 2 with setTimeout 1000')
    //   }, 1000)
    // })
  }

  async someFunction() {
    // Call and wait for `hook1` hooks (if any) sequential
    console.log('someFunction before hook1', 'start...')
    await this.callHook('hook1')
    console.log('someFunction after hook1', 'start...')
  }

  async somFunction2() {
    const arg = {
      a: 1,
      b: 2,
    }
    await this.callHook('hook1:before', arg)
    setTimeout(() => {
      this.callHook('hook1:after')
    }, 25)
    // this.callHook('hook1', { a, b })
    console.log(arg)
    return 'someFunction2'
  }
}
