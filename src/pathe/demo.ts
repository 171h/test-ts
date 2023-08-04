import path from 'node:path'
import pathe from 'pathe'
import { Logger } from '@171h/log'

const logger = new Logger('src/pathe/demo.ts')

const urls = [
  ['a', 'b', 'c'],
  ['G:\\repo', 'a', 'b', 'c'],
]

for (const url of urls) {
  logger.info('pathe.join', url, pathe.join(...url))
  logger.info('pathe.resolve', url, pathe.resolve(...url))
}

for (const url of urls) {
  logger.info('path.join', url, path.join(...url))
  logger.info('path.resolve', url, path.resolve(...url))
}
