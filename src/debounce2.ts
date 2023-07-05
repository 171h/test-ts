/* eslint-disable no-console */
import debounce from 'debounce'

const getRow = debounce(() => {
  console.log('[debounce]', 'row')
  return '[debounce] return row'
})

export async function testDebounce() {
  for (let i = 0; i < 10; i++)
    console.log(await getRow())
    // getRow().then((res) => {
    //   console.log(res)
    //   return res
    // })
}
