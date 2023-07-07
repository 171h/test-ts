/* eslint-disable no-console */
import fs from 'node:fs'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()
const mdContent = fs.readFileSync('./src/markdown-it/demo.md', 'utf8')
const result = md.render(mdContent)
console.log(result)
