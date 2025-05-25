import { Logger } from '@171h/log'

const logger = new Logger('import.meta')

logger.log('import.meta', import.meta)
logger.log('import.meta.url', import.meta.url)
logger.log("new URL(import.meta.url)", new URL(import.meta.url))
logger.log("import.meta.resolve('./test.ts')", import.meta.resolve('./test.ts'))

logger.log('', new URL('https://yiyan.baidu.com/?utm_source=itab'))
logger.log('', new URL('https://yiyan.baidu.com/?utm_source=itab').searchParams.get('utm_source'))