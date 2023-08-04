import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Logger } from '@171h/log'
import * as fflate from 'fflate'

const logger = new Logger('fflate/demo.ts')

const __dirname = path.dirname(fileURLToPath(import.meta.url))

logger.info('__dirname', __dirname)

// This is an ArrayBuffer of data
// const massiveFileBuf = await fetch('/aMassiveFile').then(
//   res => res.arrayBuffer(),
// )
// To use fflate, you need a Uint8Array
// const massiveFile = new Uint8Array(massiveFileBuf)
// Note that Node.js Buffers work just fine as well:
const massiveFile = fs.readFileSync(path.join(__dirname, './assets/aMassiveFile.txt'))

// Higher level means lower performance but better compression
// The level ranges from 0 (no compression) to 9 (max compression)
// The default level is 6
const notSoMassive = fflate.zlibSync(massiveFile, { level: 9 })
const massiveAgain = fflate.unzlibSync(notSoMassive)
const gzipped = fflate.gzipSync(massiveFile, {
  // GZIP-specific: the filename to use when decompressed
  filename: 'aMassiveFile.txt',
  // GZIP-specific: the modification time. Can be a Date, date string,
  // or Unix timestamp
  mtime: '9/1/16 2:00 PM',
})

const decompressed = fflate.decompressSync(notSoMassive)
const origText = fflate.strFromU8(decompressed)

// logger.info('massiveFile', massiveFile)
// logger.info('notSoMassive', notSoMassive)
// logger.info('massiveAgain', massiveAgain)
// logger.info('gzipped', gzipped)
logger.info('decompressed', decompressed)
logger.info('origText', origText)
