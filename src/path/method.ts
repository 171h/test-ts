import path from 'node:path'
import { Logger } from '@171h/log'

const logger = new Logger('src/path/method.ts')

const filename = 'doc/theme/doc/theme/theme1.json'

logger.info('path.basename', filename, path.basename(filename))
logger.info('path.dirname', filename, path.dirname(filename))
logger.info('path.extname', filename, path.extname(filename))
// logger.info('path.parse', filename, path.parse(filename))
// logger.info('path.format', path.parse(filename), path.format(path.parse(filename)))
// logger.info('path.isAbsolute', filename, path.isAbsolute(filename))
// logger.info('path.join', filename, path.join(filename))
// logger.info('path.normalize', filename, path.normalize(filename))
// logger.info('path.relative', filename, path.relative(filename, 'doc/theme'))
// logger.info('path.resolve', filename, path.resolve(filename))
// logger.info('path.sep', filename, path.sep)
// logger.info('path.delimiter', filename, path.delimiter)
// logger.info('path.win32', filename, path.win32)
// logger.info('path.posix', filename, path.posix)
