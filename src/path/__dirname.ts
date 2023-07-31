import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Logger } from '@171h/log'
import './subdir/__dirname'

const logger = new Logger('src/path/demo2.ts')

const __dirname = path.dirname(fileURLToPath(import.meta.url))

logger.info('__dirname', __dirname)
logger.info('import.meta.url', import.meta.url)
