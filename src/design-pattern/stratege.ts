import { Logger } from '@171h/log'

const logger = new Logger('strategy.ts')

const operate = {
  add: (a: number, b: number) => {
    return a + b
  },
  sub(a: number, b: number) {
    return a - b
  },
  mul(a: number, b: number) {
    return a * b
  },
  div(a: number, b: number) {
    return a / b
  },
}

const calc = function (cmd: 'add' | 'sub' | 'mul' | 'div', arg1: number, arg2: number) {
  return operate[cmd](arg1, arg2)
}

logger.verbose('add', calc('add', 1, 2))
logger.verbose('sub', calc('sub', 1, 2))
logger.verbose('mul', calc('mul', 1, 2))
logger.verbose('div', calc('div', 1, 2))
