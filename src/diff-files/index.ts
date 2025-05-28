import path from "pathe"
import fs from "fs-extra"
import { F } from "ofetch/dist/shared/ofetch.8459ad38"

const sign0 = 'E:/Users/171h/OneDrive/乐高商业街/02.图纸/竣工图（签章）/00.未签章pdf'
const sign0_S = 'E:/Users/171h/OneDrive/乐高商业街/02.图纸/竣工图（签章）/00.未签章pdf/缤纷里/结构'
const sign0_A = 'E:/Users/171h/OneDrive/乐高商业街/02.图纸/竣工图（签章）/00.未签章pdf/缤纷里/建筑'
const sign0_P = 'E:/Users/171h/OneDrive/乐高商业街/02.图纸/竣工图（签章）/00.未签章pdf/缤纷里/给排水'
const sign0_E = 'E:/Users/171h/OneDrive/乐高商业街/02.图纸/竣工图（签章）/00.未签章pdf/缤纷里/电气'
const sign0_M = 'E:/Users/171h/OneDrive/乐高商业街/02.图纸/竣工图（签章）/00.未签章pdf/缤纷里/暖通'
const sign1 = 'E:/Users/171h/OneDrive/乐高商业街/02.图纸/竣工图（签章）/01.施工已签章'
const sign1_S = 'E:/Users/171h/OneDrive/乐高商业街/02.图纸/竣工图（签章）/01.施工已签章/缤纷里/结构'
const sign1_A = 'E:/Users/171h/OneDrive/乐高商业街/02.图纸/竣工图（签章）/01.施工已签章/缤纷里/建筑'
const sign1_P = 'E:/Users/171h/OneDrive/乐高商业街/02.图纸/竣工图（签章）/01.施工已签章/缤纷里/给排水'
const sign1_E = 'E:/Users/171h/OneDrive/乐高商业街/02.图纸/竣工图（签章）/01.施工已签章/缤纷里/电气'
const sign1_M = 'E:/Users/171h/OneDrive/乐高商业街/02.图纸/竣工图（签章）/01.施工已签章/缤纷里/暖通'
const sign2 = 'E:/Users/171h/OneDrive/乐高商业街/02.图纸/竣工图（签章）/02.施工、设计已签章'
const sign2_S = 'E:/Users/171h/OneDrive/乐高商业街/02.图纸/竣工图（签章）/02.施工、设计已签章/缤纷里/结构'
const sign2_A = 'E:/Users/171h/OneDrive/乐高商业街/02.图纸/竣工图（签章）/02.施工、设计已签章/缤纷里/建筑'
const sign2_P = 'E:/Users/171h/OneDrive/乐高商业街/02.图纸/竣工图（签章）/02.施工、设计已签章/缤纷里/给排水'
const sign2_E = 'E:/Users/171h/OneDrive/乐高商业街/02.图纸/竣工图（签章）/02.施工、设计已签章/缤纷里/电气'
const sign2_M = 'E:/Users/171h/OneDrive/乐高商业街/02.图纸/竣工图（签章）/02.施工、设计已签章/缤纷里/暖通'
const sign3 = 'E:/Users/171h/OneDrive/乐高商业街/02.图纸/竣工图（签章）/03.签章完成'
const sign3_S = 'E:/Users/171h/OneDrive/乐高商业街/02.图纸/竣工图（签章）/03.签章完成/缤纷里/结构'
const sign3_A = 'E:/Users/171h/OneDrive/乐高商业街/02.图纸/竣工图（签章）/03.签章完成/缤纷里/建筑'
const sign3_P = 'E:/Users/171h/OneDrive/乐高商业街/02.图纸/竣工图（签章）/03.签章完成/缤纷里/给排水'
const sign3_E = 'E:/Users/171h/OneDrive/乐高商业街/02.图纸/竣工图（签章）/03.签章完成/缤纷里/电气'
const sign3_M = 'E:/Users/171h/OneDrive/乐高商业街/02.图纸/竣工图（签章）/03.签章完成/缤纷里/暖通'

const inputDir = sign0_P
const outputDir = sign1_P


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

function printDiff(inputDir: string, outputDir: string, options?: { diabledDetailLog: boolean }) {
    console.log('-------- 本程序使用文件名称对比两个文件夹中的文件差异 --------')

    const inputFiles = getFileName(inputDir, { exts: ['.pdf'], diff: true })
    const outputFiles = getFileName(outputDir, { exts: ['.pdf'] })
    const diffFiles1 = diff(inputFiles, outputFiles)
    const diffFiles2 = diff(outputFiles, inputFiles)

    console.log('Input file number:\t', inputFiles.length, `\t\t ${inputDir}`)
    console.log('Output file number:\t', outputFiles.length, `\t\t ${outputDir}`)

    if (diffFiles1.length === 0 && diffFiles2.length === 0) {
        console.log('Result: \t\t Euqal!!')
        return
    }

    console.log('Result: \t\t Different!!')

    if (options && options.diabledDetailLog)
        return

    console.log('-------- Only in Input Directory --------')
    diffFiles1.forEach(file => {
        console.log(file)
    })

    console.log('-------- Only in Output Directory --------')
    diffFiles2.forEach(file => {
        console.log(file)
    })
}

function renameFiles(inputDir: string, outputDir: string, options?: { rename?: boolean }) {
    console.log('-------- RenameFiles start --------')

    const inputFiles = getFileName(inputDir, { exts: ['.pdf'], diff: true })
    const outputFiles = getFileName(outputDir, { exts: ['.pdf'] })
    const diffFiles1 = diff(inputFiles, outputFiles)
    const diffFiles2 = diff(outputFiles, inputFiles)

    console.log('Input file number:\t', inputFiles.length, `\t\t ${inputDir}`)
    console.log('Output file number:\t', outputFiles.length, `\t\t ${outputDir}`)

    if (diffFiles1.length === 0 && diffFiles2.length === 0) {
        console.log('Result: \t\t Euqal!!')
        return
    }

    console.log('Result: \t\t Different!!')

    const renameMap: Record<string, string> = {}
    diffFiles1.forEach(file => {
        const filename = file.split('_')[0]
        outputFiles.find((file2) => {
            const includeSimilar = file2.split('_')[0] === filename
            if (includeSimilar) {
                renameMap[path.join(inputDir, file)] = path.join(inputDir, file2)
                return true
            }
            return includeSimilar
        })
    })


    if (options && options.rename) {
        Object.entries(renameMap).forEach(([oldName, newName]) => {
            console.log(`Start rename file:\t\t ${path.basename(oldName)} -> ${path.basename(newName)}`)
            fs.renameSync(oldName, newName)
            console.log(`Finish rename file:\t\t ${oldName} -> ${newName} OK!!!`)
        })
    } else {
        console.log('Try to rename files as below:')
        Object.entries(renameMap).forEach(([oldName, newName]) => {
            console.log(`${path.basename(oldName)} -> ${path.basename(newName)}`)
        })
    }
}

const sign0_1 = [
    [sign0, sign1, { diabledDetailLog: true }],
    [sign0_S, sign1_S, { diabledDetailLog: true }],
    [sign0_A, sign1_A, { diabledDetailLog: true }],
    [sign0_P, sign1_P, { diabledDetailLog: false }],
    [sign0_E, sign1_E, { diabledDetailLog: true }],
    [sign0_M, sign1_M, { diabledDetailLog: true }],
]

const sign1_2 = [
    [sign1, sign2, { diabledDetailLog: true }],
    [sign1_S, sign2_S, { diabledDetailLog: false }],
    [sign1_A, sign2_A, { diabledDetailLog: false }],
    [sign1_P, sign2_P, { diabledDetailLog: true }],
    [sign1_E, sign2_E, { diabledDetailLog: true }],
    [sign1_M, sign2_M, { diabledDetailLog: true }],
]

sign0_1.forEach((params) => {
    // @ts-ignore
    printDiff(...params)

    console.log('======================================================================================')
})

// renameFiles(sign1_S, sign2_S, { rename: true })