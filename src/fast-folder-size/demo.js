import { createWriteStream, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { get, globalAgent } from 'node:https'
import path, { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import decompress from 'decompress'
import { HttpsProxyAgent } from 'https-proxy-agent'

import { fetch } from 'ofetch'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
console.log('__dirname', __dirname)

// Only run for Windows
if (process.platform !== 'win32')
  process.exit(0)

// check if du is already installed
if (
  existsSync(
    join(__dirname, 'bin', `du${process.arch === 'x64' ? '64' : ''}.exe`),
  )
)
  process.exit(0)

const duZipLocation
  = process.env.FAST_FOLDER_SIZE_DU_ZIP_LOCATION
  || 'https://download.sysinternals.com/files/DU.zip'

// checks for proxy variables in user environment
const proxyAddress
  = process.env.HTTPS_PROXY
  || process.env.https_proxy
  || process.env.HTTP_PROXY
  || process.env.http_proxy

if (proxyAddress) {
  const agent = new HttpsProxyAgent(proxyAddress)

  // globalAgent = agent
}

console.log('Downloading du.zip...', duZipLocation)
get(duZipLocation, { timeout: 10 }, (res) => {
  const tempFilePath = join(tmpdir(), 'du.zip')
  console.log('Saving du.zip to', tempFilePath)

  res
    .on('data', (d) => {
      process.stdout.write(d)
    })
    .on('error', (e) => {
      console.error(e)
    })

  // const fileStream = createWriteStream(tempFilePath)
  // console.log('fileStream:after')
  // res.pipe(fileStream, { end: true })
  // console.log('res.pipe:after')

  // fileStream.on('finish', () => {
  //   console.log('finish')
  //   fileStream.close()
  //   decompress(tempFilePath, join(__dirname, 'bin'))
  //   console.log('decompress')
  // })
})
