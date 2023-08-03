import randomstring from 'randomstring'
import { Logger } from '@171h/log'

const logger = new Logger('src/randomstring/demo.ts')

for (let i = 0; i < 10; i++)
  logger.info('randomstring', randomstring.generate(20))
