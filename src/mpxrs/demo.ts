import { exec } from 'node:child_process'
import fs from 'node:fs'
import pathe from 'pathe'

function mpx2json(mpxrs_path: string, input_filename: string, output_filename: string) {
  const cmd = `${mpxrs_path} ${input_filename} ${output_filename}`
  // 执行命令并返回值
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`)
      return
    }
    return stdout
  })
}

function test() {
  const mpxrs_path = 'D:\\dev_env\\mpxrs\\release\\mpxrs.exe'
  const input_filename = pathe.resolve('./src/mpxrs/example.mpp')
  const output_filename = pathe.resolve('./src/mpxrs/example.json')

  mpx2json(mpxrs_path, input_filename, output_filename)

  const file = fs.readFileSync(output_filename, 'utf-8')
  console.log(file)
}

test()
