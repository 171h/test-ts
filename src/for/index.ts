const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const obj = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
  f: 6,
  g: 7,
  h: 8,
  i: 9,
  j: 10
}

for (let item in arr2) {
  console.log('for...in array', item)
}

for (let item in obj) {
  console.log('for...in object', item)
}

for (let item of arr2) {
  console.log('for...of array', item)
}

// for (let item of obj) {
//   console.log('for...of object', item)
// }
