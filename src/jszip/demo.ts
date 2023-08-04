import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import JSZip, { InputType } from 'jszip'

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
// logger.log('Test unzip', data2)

// Test unzip and zip again
const savename2 = path.join(__dirname, 'temp', 'example2.zip')
const data3 = await JSZip.loadAsync(fs.readFileSync(savename))
const zip2 = new JSZip()
data3.forEach((relativePath, file) => {
  zip2.file(relativePath, file.async('nodebuffer'))
})
zip2.generateAsync({ type: 'nodebuffer' }).then((content) => {
  fs.writeFileSync(savename2, content)
  // logger.log('Test unzip and zip again', content)
})

// Test buffer
const savename4 = path.join(__dirname, 'temp', 'example2.zip')
const data4 = JSZip.loadAsync(fs.readFileSync(savename))
const map = new Map()

data4
  .then((data) => {
    data.forEach(async (relativePath, file) => {
      const buffer = await file.async('arraybuffer')
      logger.info('Test buffer', relativePath, buffer)
      map.set(relativePath, buffer)
      logger.info('Test buffer:then:map0', map)
    })
    logger.info('Test buffer:then:map', map)
  })
  .finally(() => {
    logger.info('Test buffer:finally:map', map)
  })

setTimeout(() => {
  logger.info('Test buffer:setTimeout:map', map)
}, 1000)
