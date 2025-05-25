import { Decimal } from 'decimal.js'

Decimal.set({ precision: 16 })

const start = new Decimal(1.1)

const end = start.times(10000000000000000000000000000)

console.log(end.toNumber())
