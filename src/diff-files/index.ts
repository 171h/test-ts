import path from "pathe"
import fs from "fs-extra"
import chalk from "chalk"
import crypto from "crypto"

const left = 'D:/171h/Documents/海南果蔬项目/02.图纸/02.最新图纸（整理）'
const right = 'E:/02.最新图纸（整理）'

/**
 * 总开关：是否使用 hash 值对比文件内容
 * - true : 文件名 + 内容 hash 双重对比（能发现同名但内容不同的文件，需读取全部文件，较慢）
 * - false: 仅按文件名（相对路径）对比（速度快）
 * 单次调用可用 printDiff 的 { hash: true/false } 覆盖此开关
 */
const USE_HASH_COMPARE = false

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
    // 直接对 Buffer 求哈希，避免 fileContent.buffer 携带池化内存中的多余字节，导致哈希结果不稳定
    return crypto.createHash('md5').update(fs.readFileSync(filePath)).digest('hex')
}

/**
 * 收集目录下的所有文件，返回「相对 fileDir 的路径 -> 绝对路径」映射
 * exts 为空时收集全部文件
 */
function collectFiles(fileDir: string, options?: { exts?: string[] }) {
    const fileMap = new Map<string, string>()
    if (!fs.existsSync(fileDir)) {
        console.error(`Directory does not exist: ${fileDir}`)
        return fileMap
    }

    const exts = options?.exts
    fs.readdirSync(fileDir, { encoding: 'utf-8', recursive: true }).forEach(file => {
        const absPath = path.join(fileDir, file)
        if (!fs.statSync(absPath).isFile())
            return
        const relativePath = path.normalize(file)
        if (exts && exts.length > 0 && !exts.includes(path.extname(relativePath).toLowerCase()))
            return
        fileMap.set(relativePath, absPath)
    })
    return fileMap
}

function getFileHashs(fileDir: string, options?: { exts?: string[] }) {
    const fileHashs: Record<string, string> = {}
    collectFiles(fileDir, options).forEach((absPath) => {
        fileHashs[absPath] = calculateFileHash(absPath)
        console.log(fileHashs[absPath], `\t\t ${absPath}`)
    })
    return fileHashs
}

/**
 * 对比两个目录中「相对路径相同（同名）」的文件内容（md5）
 * 返回内容相同的文件列表，以及内容不同的文件及其哈希值
 */
function diffByHash(inputDir: string, outputDir: string, options?: { exts?: string[] }) {
    const inputFiles = collectFiles(inputDir, options)
    const outputFiles = collectFiles(outputDir, options)

    const sameContent: string[] = []
    const diffContent: { file: string, inputHash: string, outputHash: string }[] = []

    inputFiles.forEach((inputAbsPath, relativePath) => {
        const outputAbsPath = outputFiles.get(relativePath)
        // 只对比两个目录中同时存在的同名文件，单边存在的文件已由名称对比列出
        if (!outputAbsPath)
            return

        const inputHash = calculateFileHash(inputAbsPath)
        const outputHash = calculateFileHash(outputAbsPath)
        if (inputHash === outputHash)
            sameContent.push(relativePath)
        else
            diffContent.push({ file: relativePath, inputHash, outputHash })
    })

    return { sameContent, diffContent }
}

function diff(inputFiles: string[], outputFiles: string[]) {
    const diffFiles = inputFiles.filter(file => !outputFiles.includes(file))
    return diffFiles
}

function printDiff(inputDir: string, outputDir: string, options?: { diabledDetailLog?: boolean, exts?: string[], hash?: boolean }) {
    // hash 对比开关：优先使用调用参数，未指定时取全局开关 USE_HASH_COMPARE
    const useHash = options?.hash ?? USE_HASH_COMPARE

    console.log(`-------- 本程序使用文件名称${useHash ? ' + hash 值' : ''}对比两个文件夹中的文件差异 --------`)

    const inputFiles = getFileName(inputDir, { exts: options?.exts || [], diff: false, onlyFile: true, dir: true })
    const outputFiles = getFileName(outputDir, { exts: options?.exts || [], diff: false, onlyFile: true, dir: true })
    const diffFiles1 = diff(inputFiles, outputFiles)
    const diffFiles2 = diff(outputFiles, inputFiles)

    const hashResult = useHash
        ? diffByHash(inputDir, outputDir, { exts: options?.exts })
        : undefined

    // console.log(inputFiles[156])

    console.log('Input file number:\t', inputFiles.length, `\t\t ${inputDir}`)
    console.log('Output file number:\t', outputFiles.length, `\t\t ${outputDir}`)

    if (diffFiles1.length === 0 && diffFiles2.length === 0 && (hashResult?.diffContent.length ?? 0) === 0) {
        const hashInfo = hashResult
            ? ` \t\t (hash equal file number: ${hashResult.sameContent.length})`
            : ' \t\t (hash compare disabled)'
        console.log(chalk.green(`Result: \t\t Euqal!!${hashInfo}`))
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

    // 名称（相对路径）相同，但文件内容 hash 不一致的文件
    if (hashResult && hashResult.diffContent.length > 0) {
        console.log('-------- Same Name But Different Content By Hash --------')
        hashResult.diffContent.forEach(({ file, inputHash, outputHash }) => {
            console.log(chalk.yellow(file))
            console.log(`    input : ${inputHash}`)
            console.log(`    output: ${outputHash}`)
        })
        console.log(`Hash different file number: ${hashResult.diffContent.length}`)
    }
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
    // 是否使用 hash 对比由全局开关 USE_HASH_COMPARE 决定，
    // 如需单独控制某一条，可在选项里显式写 { hash: true } 或 { hash: false } 覆盖全局开关
    const sign0_1: [string, string, { diabledDetailLog?: boolean, exts?: string[], hash?: boolean }][] = [
        [left, right, { diabledDetailLog: false }]
    ]

    console.log(chalk.blue('sign0_1******************************************************************************'))

    sign0_1.forEach((params) => {
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
