import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import JSZip from 'jszip'

// @ts-expect-error missing types
import JSZipUtils from 'jszip-utils'
import { Logger } from '@171h/log'

const logger = new Logger('src/jszip/demo.ts')

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const savename = path.join(__dirname, 'temp', 'example.zip')

// Test zip
const zip = new JSZip()
zip.file('Hello.txt', 'Hello World\n')
const img = zip.folder('images')
const imgData = fs.readFileSync(path.join(__dirname, 'assets', 'test1.jpg'))
img?.file('test1.jpg', imgData, { base64: true })
zip.generateAsync({ type: 'nodebuffer' }).then((content) => {
  fs.writeFileSync(savename, content)
  // logger.log('Test zip', content)
})

// Test unzip

const data2 = await JSZip.loadAsync(fs.readFileSync(savename))
logger.log('Test unzip', data2)
