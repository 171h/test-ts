import path from "pathe"
import fs from "fs-extra"

const inputDir = 'E:/Users/171h/OneDrive/乐高商业街/02.图纸/竣工图（整理）/缤纷里'
const outputDir = 'E:/Users/171h/OneDrive/乐高商业街/02.图纸/竣工图（整理）/缤纷里建筑、结构竣工图2025.5.25施工单位已签'


function getFileName(filePath: string, options: { exts: string[], diff?: boolean }) {
    let files = fs.readdirSync(filePath, { encoding: 'utf-8', recursive: true }).map(file => path.basename(file))
    if (options.diff) {
        files = Array.from(new Set(files))
    }
    if (options.exts && options.exts.length > 0)
        files = files.filter(file => options.exts.includes(path.extname(file).toLowerCase()))
    return files
}

function diff(inputFiles: string[], outputFiles: string[]) {
    const diffFiles = inputFiles.filter(file => !outputFiles.includes(file))
    return diffFiles
}

const inputFiles = getFileName(inputDir, { exts: ['.pdf'], diff: true })
const outputFiles = getFileName(outputDir, { exts: ['.pdf'] })
const diffFiles = diff(inputFiles, outputFiles)

console.log('Input file number:\t', inputFiles.length)
console.log('Output file number:\t', outputFiles.length)
console.log('------------------------- Diff files as follows -------------------------')
diffFiles.forEach(file => {
    console.log(file)
})