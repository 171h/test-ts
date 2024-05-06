const ls = ['a', 'b', 'c']

function fnTest(ls: any[]) {
  ls.push('d')
}

console.log('ls', ls)
fnTest(ls)
console.log('ls', ls)
