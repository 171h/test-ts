/* eslint-disable no-console */
const mySet = new Set()

mySet.add(1)
mySet.add(5)
mySet.add(5)
mySet.add('some text')
const o = { a: 1, b: 2 }
mySet.add(o)

console.log(mySet) // true

for (const item of mySet)
  console.log(item)

const arr = Array.from(mySet)
console.log(arr)
