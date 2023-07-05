/* eslint-disable no-console */
import { debounce } from '@171h/debounce'

const getRow = debounce(() => {
  console.log('[@171h/debounce]', 'row')
  return '[@171h/debounce] return row '
}, 25, { trailing: true })

export async function testDebounce() {
  for (let i = 0; i < 10; i++)
    console.log(await getRow())
}
