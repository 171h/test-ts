import { defu } from 'defu'

const defaults = [
  { a: 1, b: 2 },
  { c: 1, d: 2 },
]

const options = [
  { a: 2, a1: [3, { a: 10 }] },
  { c: 2, c1: 3 },
]

const result = defu(options, defaults)
// console.log(result)

const defaults2 = {
  a: 1,
  b: [
    { a: 1, b: 2 },
    { c: 1, d: 2 },
  ],
}

const options2 = {
  a: 2,
  b: [
    { a: 2, b: 10000 },
  ],
}

const result2 = defu(options2, undefined)
console.log(result2)

console.log('{}', { ...options2, b: [], c: 1 })
