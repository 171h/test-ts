/* eslint-disable no-console */
import path from 'node:path'
import { fetch, ofetch } from 'ofetch'

const urls = [
  'https://jsonplaceholder.typicode.com/todos/1',
  path.resolve('../css/demo.html'),
]

for (const url of urls) {
  ofetch(url).then((res) => {
    console.log(res)
  })
}
