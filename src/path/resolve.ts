import path from 'node:path'

const urls = [
  path.resolve('G:\\repo\\mddoc\\test\\fixtures\\md\\', 'demo.md'),
  path.resolve('G:\\repo\\mddoc\\test\\fixtures\\md\\', './demo.md'),
  path.resolve('G:\\repo\\mddoc\\test\\fixtures\\md\\', '../demo.md'),
  path.resolve('G:\\repo\\mddoc\\test\\fixtures\\md\\', 'src/demo.md'),

  // new URL('G:\\repo\\mddoc\\test\\fixtures\\md\\', 'demo.md'),
  // new URL('G:\\repo\\mddoc\\test\\fixtures\\md\\', './demo.md'),
  // new URL('G:\\repo\\mddoc\\test\\fixtures\\md\\', '../demo.md'),
  // new URL('G:\\repo\\mddoc\\test\\fixtures\\md\\', 'src/demo.md'),
]

console.log(urls)

console.log(new URL('demo.md'))
console.log(new URL('./demo.md'))
console.log(new URL('../demo.md'))
console.log(new URL('src/demo.md'))
