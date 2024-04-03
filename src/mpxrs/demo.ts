import { exec, execSync } from 'node:child_process'
import fs from 'node:fs'
import pathe from 'pathe'

function mpx2json(mpxrs_path: string, input_filename: string, output_filename: string) {
  const cmd = `${mpxrs_path} ${input_filename} ${output_filename}`
  return execSync(cmd).toString()
}

function test() {
  const mpxrs_path = 'D:\\dev_env\\mpxrs\\release\\mpxrs.exe'
  const input_filename = pathe.resolve('./src/mpxrs/example.mpp')
  const output_filename = pathe.resolve('./src/mpxrs/example4.json')
  const json = mpx2json(mpxrs_path, input_filename, output_filename)
}

test()
