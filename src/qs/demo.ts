import qs from 'qs'
import { Logger } from '@171h/log'

const logger = new Logger('src/qs/demo.ts')

const path = 'G:\\repo\\test\\test-ts\\混凝土模板支撑架安全专项施工方案A类.docx'

logger.info('qs', { before: path, after: qs.stringify({ path }) })
