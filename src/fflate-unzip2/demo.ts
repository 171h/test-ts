import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'pathe'
import unzip from 'fflate-unzip'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const file = path.join(__dirname, './总进度计划20240105.mpp')

console.log('file', file)

unzip(fs.readFileSync(file), { to: '/tmp/out' })
