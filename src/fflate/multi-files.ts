import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'fs-extra'
import { Logger } from '@171h/log'
import * as fflate from 'fflate'

const logger = new Logger('fflate/multi-files.ts')

const __dirname = path.dirname(fileURLToPath(import.meta.url))

logger.info('__dirname', __dirname)

const aMassiveFile = fs.readFileSync(path.join(__dirname, './assets/aMassiveFile.txt'))
const bse = fs.readFileSync(path.join(__dirname, './assets/bse.bmp'))
const aMassiveImage = fs.readFileSync(path.join(__dirname, './assets/aMassiveImage.jpg'))

// Note that the asynchronous version (see below) runs in parallel and
// is *much* (up to 3x) faster for larger archives.
const zipped = fflate.zipSync({
  // Directories can be nested structures, as in an actual filesystem
  'dir1': {
    'nested': {
      // You can use Unicode in filenames
      '你好.txt': fflate.strToU8('Hey there!'),
    },
    // You can also manually write out a directory path
    'other/tmp.txt': new Uint8Array([97, 98, 99, 100]),
  },

  // You can also provide compression options
  'massiveImage.bmp': [bse, {
    level: 9,
    mem: 12,
  }],
  // PNG is pre-compressed; no need to waste time
  'superTinyFile.jpg': [aMassiveImage, { level: 0 }],

  // Directories take options too
  'exec': [{
    'hello.sh': [fflate.strToU8('echo hello world'), {
      // ZIP only: Set the operating system to Unix
      os: 3,
      // ZIP only: Make this file executable on Unix
      attrs: 0o755 << 16,
    }],
  }, {
    // ZIP and GZIP support mtime (defaults to current time)
    mtime: new Date('10/20/2020'),
  }],
}, {
  // These options are the defaults for all files, but file-specific
  // options take precedence.
  level: 1,
  // Obfuscate last modified time by default
  mtime: new Date('1/1/1980'),
})
const saveDir = path.join(__dirname, './temp')
fs.ensureDirSync(saveDir)
fs.writeFileSync(path.join(saveDir, 'myzip.zip'), zipped)

// If you write the zipped data to myzip.zip and unzip, the folder
// structure will be outputted as:

// myzip.zip (original file)
// dir1
// |-> nested
// |   |-> 你好.txt
// |-> other
// |   |-> tmp.txt
// massiveImage.bmp
// superTinyFile.png

// When decompressing, folders are not nested; all filepaths are fully
// written out in the keys. For example, the return value may be:
// { 'nested/directory/structure.txt': Uint8Array(2) [97, 97] }
// const decompressed = fflate.unzipSync(zipped, {
//   // You may optionally supply a filter for files. By default, all files in a
//   // ZIP archive are extracted, but a filter can save resources by telling
//   // the library not to decompress certain files
//   filter(file) {
//     // Don't decompress the massive image or any files larger than 10 MiB
//     return file.name != 'massiveImage.bmp' && file.originalSize <= 10_000_000
//   },
// })
