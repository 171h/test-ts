import path from 'node:path'
import { fetch, ofetch } from 'ofetch'
import { isObject } from '@171h/utils'
import { Logger } from '@171h/log'
import isUrlHttp from 'is-url-http'

// @ts-expect-error missing types
import isURL from 'isurl'

const logger = new Logger('ofetch')

const urls = [
  'https://jsonplaceholder.typicode.com/todos/1',
  'https://kikobeats.com',
  'https://www.kikobeats.com',
  'www.kikobeats.com',
  path.resolve('../css/demo.html'),
]

for (const url of urls) {
  // logger.info('for isurl', url, '----', isURL(new URL(url)))
  logger.info('for is-url-http', url, '----', isUrlHttp(url))
  await ofetch(url)
    .then((res) => {
      logger.log('for ofetch', url, '----', isObject(res) ? JSON.stringify(res).length : res.length)
    })
    .catch(() => {
      logger.log('for ofetch', url, '----', 'err')
    })
}
