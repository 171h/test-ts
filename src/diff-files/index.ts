import path from "pathe"
import fs from "fs-extra"
import chalk from "chalk"
import crypto from "crypto"

const left = 'D:/171h/Documents/海南果蔬项目/02.图纸/00整理/25.7.22收全套PDF图/新建文件夹'
const right = 'D:/171h/Documents/海南果蔬项目/02.图纸/00整理/25.7.22收全套PDF图/新建文件夹 (2)'


function getFileName(filePath: string, options: { exts: string[], diff?: boolean, onlyFile?: boolean, dir?: boolean }) {
    let files = fs.readdirSync(filePath, { encoding: 'utf-8', recursive: true })
    if(options.onlyFile)
        files = files.filter(file => fs.statSync(path.join(filePath, file)).isFile())
    // dir 为 true 时保留子文件夹名（相对 filePath 的路径，如 sub/a.pdf），否则只保留文件名（a.pdf）
    files = options.dir
        ? files.map(file => path.normalize(file))
        : files.map(file => path.basename(file))
    if (options.diff) {
        files = Array.from(new Set(files))
    }
    if (options.exts && options.exts.length > 0)
        files = files.filter(file => options.exts.includes(path.extname(file).toLowerCase()))
    return files
}

function calculateFileHash(filePath: string): string {
    const fileContent = fs.readFileSync(filePath)
    const hash = crypto.createHash('md5')
    hash.update(new Uint8Array(fileContent.buffer))
    return hash.digest('hex')
}

function getFileHashs(fileDir: string, options?: { exts?: string[] }) {
    if (!fs.existsSync(fileDir)) {
        console.error(`Directory does not exist: ${fileDir}`)
        return {}
    }

    const files = fs.readdirSync(fileDir, { encoding: 'utf-8', recursive: true }).map(file => path.join(fileDir, file))
    let fileHashs: Record<string, string> = {}
    files.forEach(file => {
        if (fs.statSync(file).isFile()) {
            if (options && options.exts && options.exts.length > 0) {
                if (options.exts.includes(path.extname(file).toLowerCase())) {
                    fileHashs[file] = calculateFileHash(file)
                }
            } else {
                fileHashs[file] = calculateFileHash(file)
            }
            console.log(fileHashs[file], `\t\t ${file}`)
        }
    })
    return fileHashs
}

function diff(inputFiles: string[], outputFiles: string[]) {
    const diffFiles = inputFiles.filter(file => !outputFiles.includes(file))
    return diffFiles
}

function printDiff(inputDir: string, outputDir: string, options?: { diabledDetailLog: boolean, exts?: string[] }) {
    console.log('-------- 本程序使用文件名称对比两个文件夹中的文件差异 --------')

    const inputFiles = getFileName(inputDir, { exts: options?.exts || [], diff: false, onlyFile: true, dir: true })
    const outputFiles = getFileName(outputDir, { exts: options?.exts || [], diff: false, onlyFile: true, dir: true })
    const diffFiles1 = diff(inputFiles, outputFiles)
    const diffFiles2 = diff(outputFiles, inputFiles)

    // console.log(inputFiles[156])

    console.log('Input file number:\t', inputFiles.length, `\t\t ${inputDir}`)
    console.log('Output file number:\t', outputFiles.length, `\t\t ${outputDir}`)

    if (diffFiles1.length === 0 && diffFiles2.length === 0) {
        console.log(chalk.green('Result: \t\t Euqal!!'))
        return
    }

    console.log(chalk.red('Result: \t\t Different!!'))

    if (options && options.diabledDetailLog)
        return

    console.log('-------- Only in Input Directory --------', inputDir)
    diffFiles1.forEach(file => {
        console.log(file)
    })

    console.log('-------- Only in Output Directory --------', outputDir)
    diffFiles2.forEach(file => {
        console.log(file)
    })
}

function getDrawingID(fileName: string) {
    const regexS = /(S-[0-9]{2}-[0-9]{2}-[0-9]{2}-?[0-9]*)[\._]/
    const matches = regexS.exec(fileName)
    if (matches) {
        return matches[1]
    }
    return ''
}

function renameFiles(inputDir: string, outputDir: string, options?: { rename?: boolean }) {
    console.log('-------- RenameFiles start --------')

    const inputFiles = getFileName(inputDir, { exts: ['.pdf'], diff: true })
    const outputFiles = getFileName(outputDir, { exts: ['.pdf'] })
    const diffFiles1 = diff(inputFiles, outputFiles)
    const diffFiles2 = diff(outputFiles, inputFiles)
    const outputFilesIDMap: Record<string, string> = {}
    outputFiles.forEach(file => {
        const fileID = getDrawingID(file)
        outputFilesIDMap[fileID] = file
    })

    console.log('Input file number:\t', inputFiles.length, `\t\t ${inputDir}`)
    console.log('Output file number:\t', outputFiles.length, `\t\t ${outputDir}`)

    if (diffFiles1.length === 0 && diffFiles2.length === 0) {
        console.log('Result: \t\t Euqal!!')
        return
    }

    console.log('Result: \t\t Different!!')

    const renameMap: Record<string, string> = {}
    diffFiles1.forEach(file => {
        const fileID = getDrawingID(file)
        if (outputFilesIDMap[fileID]) {
            renameMap[path.join(inputDir, file)] = path.join(inputDir, outputFilesIDMap[fileID])
        }
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

function diffSigns() {
    const sign0_1 = [
        [left, right, { diabledDetailLog: false }]
    ]

    console.log(chalk.blue('sign0_1******************************************************************************'))

    sign0_1.forEach((params) => {
        // @ts-ignore
        printDiff(...params)
    })

    console.log(chalk.blue('End******************************************************************************'))
}

function deleteEmptyDirectories(directory: string, recursive?: boolean) {
    if (!fs.existsSync(directory)) {
        console.error(`Directory does not exist: ${directory}`)
        return
    }

    let num = 0
    const files = fs.readdirSync(directory)

    files.forEach(file => {
        const filePath = path.join(directory, file)
        // 判断目录是否为空目录
        if (fs.statSync(filePath).isDirectory()) {
            const subFiles = fs.readdirSync(filePath)
            if (subFiles.length === 0) {
                console.log(`Deleting empty directory: ${filePath}`)
                fs.rmdirSync(filePath)
                console.log(`Deleted empty directory: ${filePath}`)
                num++;
            } else if (recursive) {
                // 如果是递归删除，则继续检查子目录
                subFiles.forEach(subFile => {
                    deleteEmptyDirectories(filePath, recursive)
                })
            }
        }
    })
    console.log(`Empty directories count: ${num}`)
}

// const gitDir = 'E:/Users/171h/OneDrive/乐高商业街/.git/objects'
// const testDIr = 'E:/Users/171h/Desktop/temp'
// deleteEmptyDirectories(testDIr, true)
// renameFiles(sign0_S, sign1_S, { rename: false })
diffSigns()

// getFileHashs(sign3_RF, { exts: ['.pdf'] })

// printDiff(tiebaLeft, tiebaRight)
