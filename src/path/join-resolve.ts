import path from 'node:path'
import { Logger } from '@171h/log'

const logger = new Logger('src/path/join-resolve.ts')

const urls = [
  ['a', 'b', 'c'],
  ['G:\\repo', 'a', 'b', 'c'],
]

for (const url of urls) {
  logger.info('path.join', url, path.join(...url))
  logger.info('path.resolve', url, path.resolve(...url))
}
