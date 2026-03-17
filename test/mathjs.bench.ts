import { describe, bench, it } from 'vitest'
import * as math from 'mathjs'

describe('mathjs', () => {
  bench('should calculate', () => {
    math.zeros(3)
    // math.ones(3)
  }, { iterations: 100000 })
})