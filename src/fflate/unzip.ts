import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Buffer } from 'node:buffer'
import { Logger } from '@171h/log'
import * as fflate from 'fflate'

const logger = new Logger('fflate/unzip.ts')

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const filename = path.join(__dirname, './assets/myzip.zip')
const buffer = fs.readFileSync(filename)
const u8 = new Uint8Array(buffer)
logger.info('u8', u8)

const massive = fflate.unzipSync(u8)
logger.info('massive:str:before', fflate.strFromU8(massive['dir1/nested/你好.txt']))
logger.info('massive:img:before', massive['superTinyFile.jpg'])
// logger.info('massive:img:before', Buffer.from(massive['superTinyFile.jpg']))

massive['dir1/nested/你好.txt'] = fflate.strToU8('Test modify string')
const modifyImg = fs.readFileSync(path.join(__dirname, './assets/bse.bmp'))
massive['superTinyFile.jpg'] = new Uint8Array(modifyImg)

// add new file
massive['newFile.txt'] = fflate.strToU8('Test add new file')
const newImg = fs.readFileSync(path.join(__dirname, './assets/newimg.png'))
massive['newimg.png'] = new Uint8Array(newImg)

// delete file
delete massive['dir1/nested/你好.txt']

// transfer to fflate.Zippable
// const zippable = fflate.unzipSync(u8, { consume: true })

// rename file
// massive['dir1/nested/你好.txt']

logger.info('massive:str:after', fflate.strFromU8(massive['dir1/nested/你好.txt']))
logger.info('massive:img:after', massive['superTinyFile.jpg'])

const modifiedZip = fflate.zipSync(massive)
fs.writeFileSync(path.join(__dirname, './temp/modified.zip'), Buffer.from(modifiedZip))
