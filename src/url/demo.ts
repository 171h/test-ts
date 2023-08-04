import { URL } from 'node:url'
import { Logger } from '@171h/log'

const logger = new Logger('url/demo.ts')

const url = new URL('../cats', 'http://www.example.com/dogs')
logger.log('url', url) // Object
logger.log('url.toString()', url.toString())
logger.log('url.href', url.href) // "http://www.example.com/cats"
logger.log('url.hostname', url.hostname) // "www.example.com"
logger.log('url.pathname', url.pathname) // "/cats"

url.hash = 'tabby'
logger.log(url.href) // "http://www.example.com/cats#tabby"
