const map: Map<object, any> = new Map()

map.set(Date, new Date())
map.set(Date, new Date('2000/1/1'))
map.set( new Date('2000/1/1').constructor, new Date('2000/1/1'))

console.log(map)
