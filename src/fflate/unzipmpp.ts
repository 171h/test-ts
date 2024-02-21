import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Buffer } from 'node:buffer'
import { Logger } from '@171h/log'
import * as fflate from 'fflate'

const logger = new Logger('fflate/unzip.ts')

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const filename = path.join(__dirname, './assets/总进度计划20240105.zip')
// const filename = path.join(__dirname, './assets/myzip.zip')
// const filename = path.join(__dirname, './assets/test.docx')

const buffer = fs.readFileSync(filename)
const u8 = new Uint8Array(buffer)
logger.info('u8', u8)

const massive = fflate.unzipSync(u8)

logger.info('massive', massive)
