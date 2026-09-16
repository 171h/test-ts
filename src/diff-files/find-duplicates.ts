import path from "pathe"
import fs from "fs-extra"
import chalk from "chalk"
import crypto from "crypto"
import minimist from "minimist"
import { fileURLToPath } from "node:url"

/**
 * 查找给定目录下的重复文件，并在命令行列出重复的文件名及数量
 *
 * 用法（本文件自带 main()，直接运行即可，不依赖 index.ts —— index.ts 顶层会直接执行 diffSigns()）：
 *   esno src/diff-files/find-duplicates.ts <目录>                     # 默认按 hash 值（文件内容）查找
 *   esno src/diff-files/find-duplicates.ts <目录> --mode name         # 按文件名查找
 *   esno src/diff-files/find-duplicates.ts <目录> --exts .pdf,.dwg    # 只查找指定扩展名
 *   esno src/diff-files/find-duplicates.ts <目录> --case-sensitive    # 按文件名查找时区分大小写
 *   esno src/diff-files/find-duplicates.ts <目录> --keep-empty        # 不忽略空文件（默认忽略）
 *   esno src/diff-files/find-duplicates.ts <目录> --verbose           # 打印每个文件的处理过程
 *   esno src/diff-files/find-duplicates.ts <目录> --html              # 额外生成 HTML 报告（默认 ./duplicates-report.html）
 *   esno src/diff-files/find-duplicates.ts <目录> --out report.html   # 额外生成 HTML 报告到指定路径
 */

/** 查找重复文件的方式 */
export type DuplicateMode =
    /** hash：按文件内容 md5 查找，内容完全相同即为重复（与文件名无关） */
    | 'hash'
    /** name：按文件名查找，只看文件名不看内容 */
    | 'name'

export interface FindDuplicatesOptions {
    /** 查找方式，默认 'hash' */
    mode?: DuplicateMode
    /** 只处理这些扩展名（含点，大小写不敏感），如 ['.pdf']；为空表示全部文件 */
    exts?: string[]
    /** name 模式是否区分大小写，默认 false（a.PDF 与 a.pdf 视为同名） */
    caseSensitive?: boolean
    /** hash 模式是否忽略空文件，默认 true（空文件内容都相同，会把结果冲得没意义） */
    ignoreEmpty?: boolean
    /** 是否打印每个文件的处理过程，默认 false */
    verbose?: boolean
    /**
     * 是否把最终结果额外生成一份 HTML 报告
     * - true     : 输出到当前工作目录下的 duplicates-report.html
     * - string   : 输出到指定路径（可以是相对路径）
     * - 不传/false: 不生成
     */
    html?: boolean | string
}

interface FileItem {
    /** 相对目标目录的路径，如 sub/a.pdf */
    file: string
    /** 绝对路径 */
    absPath: string
    size: number
}

export interface DuplicateGroup {
    /** 分组依据：hash 模式为 md5 值，name 模式为文件名（可能已被小写化） */
    key: string
    /** 同一组内的重复文件（至少 2 个） */
    files: FileItem[]
}

function calculateFileHash(filePath: string): string {
    // 直接对 Buffer 求哈希，避免 fileContent.buffer 携带池化内存中的多余字节，导致哈希结果不稳定
    return crypto.createHash('md5').update(fs.readFileSync(filePath)).digest('hex')
}

/**
 * 收集目录下所有文件（递归），返回带相对路径/绝对路径/大小的列表
 * exts 为空时收集全部文件
 */
export function collectFiles(targetDir: string, options?: FindDuplicatesOptions): FileItem[] {
    const items: FileItem[] = []
    if (!fs.existsSync(targetDir)) {
        console.error(`Directory does not exist: ${targetDir}`)
        return items
    }

    const exts = normalizeExts(options?.exts)
    fs.readdirSync(targetDir, { encoding: 'utf-8', recursive: true }).forEach(file => {
        const absPath = path.join(targetDir, file)
        if (!fs.statSync(absPath).isFile())
            return

        const relativePath = path.normalize(file)
        if (exts.length > 0 && !exts.includes(path.extname(relativePath).toLowerCase()))
            return

        items.push({ file: relativePath, absPath, size: fs.statSync(absPath).size })
    })
    return items
}

/** 统一扩展名格式：补上点、转小写，过滤空值 */
function normalizeExts(exts?: string[]): string[] {
    return (exts || [])
        .map(ext => ext.trim().toLowerCase())
        .filter(ext => ext.length > 0)
        .map(ext => ext.startsWith('.') ? ext : `.${ext}`)
}

/** 过滤掉只有 1 个文件的分组，并按组内文件数从多到少排序 */
function toGroups(map: Map<string, FileItem[]>): DuplicateGroup[] {
    const groups: DuplicateGroup[] = []
    map.forEach((files, key) => {
        if (files.length < 2)
            return
        groups.push({
            key,
            files: [...files].sort((a, b) => a.file.localeCompare(b.file)),
        })
    })
    return groups.sort((a, b) => b.files.length - a.files.length || a.key.localeCompare(b.key))
}

/** 按文件内容（md5）查找重复文件 */
export function findDuplicatesByHash(files: FileItem[], options?: FindDuplicatesOptions): DuplicateGroup[] {
    const ignoreEmpty = options?.ignoreEmpty ?? true

    // 先按「文件大小」粗筛：大小不同的文件内容必然不同，这样能省掉大量 hash 计算
    const bySize = new Map<number, FileItem[]>()
    files.forEach(file => {
        if (ignoreEmpty && file.size === 0)
            return
        const list = bySize.get(file.size) || []
        list.push(file)
        bySize.set(file.size, list)
    })

    const byHash = new Map<string, FileItem[]>()
    bySize.forEach(list => {
        // 该大小只有 1 个文件，不可能是重复文件，无需读文件算 hash
        if (list.length < 2)
            return
        list.forEach(file => {
            const hash = calculateFileHash(file.absPath)
            const group = byHash.get(hash) || []
            group.push(file)
            byHash.set(hash, group)
            if (options?.verbose)
                console.log(`${hash}\t\t ${file.file}`)
        })
    })

    return toGroups(byHash)
}

/** 按文件名查找重复文件（同名文件，内容可能不同） */
export function findDuplicatesByName(files: FileItem[], options?: FindDuplicatesOptions): DuplicateGroup[] {
    const byName = new Map<string, FileItem[]>()
    files.forEach(file => {
        const baseName = path.basename(file.file)
        const key = options?.caseSensitive ? baseName : baseName.toLowerCase()
        const group = byName.get(key) || []
        group.push(file)
        byName.set(key, group)
    })
    return toGroups(byName)
}

/** 查找重复文件，根据 options.mode 决定按 hash 还是按文件名 */
export function findDuplicates(targetDir: string, options?: FindDuplicatesOptions): DuplicateGroup[] {
    const files = collectFiles(targetDir, options)
    return options?.mode === 'name'
        ? findDuplicatesByName(files, options)
        : findDuplicatesByHash(files, options)
}

function formatSize(size: number): string {
    if (size < 1024)
        return `${size} B`
    const units = ['KB', 'MB', 'GB', 'TB']
    let value = size / 1024
    let unitIndex = 0
    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024
        unitIndex++
    }
    return `${value.toFixed(2)} ${units[unitIndex]}`
}

/** 转义 HTML 特殊字符，避免文件名/路径（可能含 < > & " '）破坏报告结构 */
function escapeHtml(text: string): string {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '\'': '&#39;',
    }
    return text.replace(/[&<>"']/g, char => map[char])
}

/** 统计结果：命令行与 HTML 报告共用 */
function getStats(files: FileItem[], groups: DuplicateGroup[]) {
    const duplicateFileCount = groups.reduce((total, group) => total + group.files.length, 0)
    return {
        fileCount: files.length,
        groupCount: groups.length,
        duplicateFileCount,
        // 每组保留 1 个，其余都是可清理的冗余文件
        redundantCount: duplicateFileCount - groups.length,
        redundantSize: groups.reduce((total, group) => total + group.files[0].size * (group.files.length - 1), 0),
    }
}

/** 生成 HTML 报告内容（不写文件，方便单测与自定义输出） */
export function renderHtmlReport(
    targetDir: string,
    files: FileItem[],
    groups: DuplicateGroup[],
    options?: FindDuplicatesOptions,
): string {
    const mode = options?.mode ?? 'hash'
    const keyLabel = mode === 'hash' ? 'MD5（文件内容）' : '文件名'
    const modeText = mode === 'hash' ? 'hash 值（文件内容）' : '文件名'
    const exts = normalizeExts(options?.exts)
    const stats = getStats(files, groups)

    const groupRows = groups.map((group, index) => {
        const redundantSize = group.files[0].size * (group.files.length - 1)
        // 只在 hash 模式下显示大小，name 模式下组内文件大小可能不同
        const sizeText = mode === 'hash' ? formatSize(group.files[0].size) : group.files.map(file => formatSize(file.size)).join(' / ')
        // 带目录的相对路径，支持折叠
        const fileItems = group.files.map(file => `<li><code>${escapeHtml(file.file)}</code><span class="size">${formatSize(file.size)}</span></li>`).join('\n                        ')
        // 不带目录的文件名：同名只显示一个，不同名各占一行，不折叠
        const baseNames = Array.from(new Set(group.files.map(file => path.basename(file.file))))
        const nameItems = baseNames.map(name => `<code>${escapeHtml(name)}</code>`).join('')

        return `<tr>
                    <td class="index">${index + 1}</td>
                    <td><code class="key">${escapeHtml(group.key)}</code></td>
                    <td class="num">${group.files.length}</td>
                    <td class="num">${sizeText}</td>
                    <td class="num">${formatSize(redundantSize)}</td>
                    <td class="names">${nameItems}</td>
                    <td>
                        <details${index < 3 ? ' open' : ''}>
                            <summary>${group.files.length} 个重复文件</summary>
                            <ul class="files">
                        ${fileItems}
                            </ul>
                        </details>
                    </td>
                </tr>`
    }).join('\n                ')

    const groupSection = groups.length === 0
        ? '<p class="empty">没有发现重复文件</p>'
        : `<table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>${keyLabel}</th>
                    <th>文件数</th>
                    <th>单文件大小</th>
                    <th>冗余大小</th>
                    <th>文件名（不含目录）</th>
                    <th>重复文件列表（含目录）</th>
                </tr>
            </thead>
            <tbody>
                ${groupRows}
            </tbody>
        </table>`

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>重复文件报告 - ${escapeHtml(path.basename(targetDir) || targetDir)}</title>
<style>
    :root {
        --bg: #f5f7fa;
        --card: #ffffff;
        --text: #1f2937;
        --muted: #6b7280;
        --border: #e5e7eb;
        --primary: #2563eb;
        --warn: #d97706;
        --danger: #dc2626;
    }
    * { box-sizing: border-box; }
    body {
        margin: 0;
        padding: 32px 16px;
        background: var(--bg);
        color: var(--text);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', Roboto, sans-serif;
        line-height: 1.6;
    }
    .wrap { max-width: 1100px; margin: 0 auto; }
    header { margin-bottom: 24px; }
    h1 { margin: 0 0 8px; font-size: 24px; }
    .meta { color: var(--muted); font-size: 13px; word-break: break-all; }
    .cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 12px;
        margin: 20px 0 28px;
    }
    .card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 14px 16px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, .04);
    }
    .card .label { color: var(--muted); font-size: 12px; }
    .card .value { font-size: 22px; font-weight: 600; margin-top: 4px; }
    .card.warn .value { color: var(--warn); }
    .card.danger .value { color: var(--danger); }
    table {
        width: 100%;
        border-collapse: collapse;
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 10px;
        overflow: hidden;
        font-size: 14px;
    }
    th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid var(--border); vertical-align: top; }
    th { background: #f9fafb; font-size: 12px; color: var(--muted); font-weight: 600; white-space: nowrap; }
    tbody tr:last-child td { border-bottom: none; }
    td.num, th:nth-child(3), th:nth-child(4), th:nth-child(5) { text-align: right; white-space: nowrap; }
    td.index { color: var(--muted); text-align: right; width: 40px; }
    code {
        font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
        font-size: 12.5px;
        background: #f3f4f6;
        padding: 1px 5px;
        border-radius: 4px;
        word-break: break-all;
    }
    code.key { background: #eff6ff; color: var(--primary); }
    /* 文件名列：不折叠，同一组内不同名时每个文件名各占一行 */
    td.names { white-space: nowrap; }
    td.names code { display: block; width: fit-content; margin-bottom: 4px; }
    td.names code:last-child { margin-bottom: 0; }
    details summary { cursor: pointer; color: var(--primary); font-size: 13px; }
    ul.files { list-style: none; margin: 8px 0 0; padding: 0; }
    ul.files li { display: flex; justify-content: space-between; gap: 12px; padding: 3px 0; }
    ul.files .size { color: var(--muted); font-size: 12px; white-space: nowrap; }
    .empty {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 24px;
        text-align: center;
        color: var(--muted);
    }
    footer { margin-top: 20px; color: var(--muted); font-size: 12px; }
</style>
</head>
<body>
<div class="wrap">
    <header>
        <h1>重复文件报告</h1>
        <div class="meta">
            <div>目录：<code>${escapeHtml(targetDir)}</code></div>
            <div>查找方式：${modeText}${exts.length > 0 ? ` &nbsp;|&nbsp; 扩展名：${escapeHtml(exts.join(', '))}` : ''}</div>
            <div>生成时间：${new Date().toLocaleString()}</div>
        </div>
    </header>

    <div class="cards">
        <div class="card"><div class="label">扫描文件数</div><div class="value">${stats.fileCount}</div></div>
        <div class="card"><div class="label">重复组数</div><div class="value">${stats.groupCount}</div></div>
        <div class="card warn"><div class="label">重复文件数</div><div class="value">${stats.duplicateFileCount}</div></div>
        <div class="card danger"><div class="label">可清理冗余文件</div><div class="value">${stats.redundantCount}</div></div>
        <div class="card danger"><div class="label">可清理占用空间</div><div class="value">${formatSize(stats.redundantSize)}</div></div>
    </div>

    ${groupSection}

    <footer>由 find-duplicates.ts 生成 · 每组保留 1 个文件，其余 ${stats.redundantCount} 个为可清理的冗余文件</footer>
</div>
</body>
</html>
`
}

/** 生成 HTML 报告并写入文件，返回写入的绝对路径 */
export function writeHtmlReport(
    htmlPath: string,
    targetDir: string,
    files: FileItem[],
    groups: DuplicateGroup[],
    options?: FindDuplicatesOptions,
): string {
    const absPath = path.resolve(htmlPath)
    fs.ensureDirSync(path.dirname(absPath))
    fs.writeFileSync(absPath, renderHtmlReport(targetDir, files, groups, options), 'utf-8')
    return absPath
}

/** 查找重复文件并打印结果：重复的文件名、每组数量、总计 */
export function printDuplicates(targetDir: string, options?: FindDuplicatesOptions) {
    const mode = options?.mode ?? 'hash'
    const modeText = mode === 'hash' ? 'hash 值（文件内容）' : '文件名'

    console.log(`-------- 本程序按 ${modeText} 查找目录下的重复文件 --------`)

    const files = collectFiles(targetDir, options)
    const groups = mode === 'name'
        ? findDuplicatesByName(files, options)
        : findDuplicatesByHash(files, options)
    const stats = getStats(files, groups)

    console.log('Directory:\t\t', targetDir)
    console.log('File number:\t', stats.fileCount, options?.exts?.length ? `\t\t (exts: ${normalizeExts(options.exts).join(', ')})` : '')
    console.log('Duplicate group number:\t', stats.groupCount)
    console.log('Duplicate file number:\t', stats.duplicateFileCount)
    console.log('Redundant file number:\t', stats.redundantCount, `\t\t (${formatSize(stats.redundantSize)})`)

    if (groups.length === 0) {
        console.log(chalk.green(`Result: \t\t No Duplicate File!! \t\t (${mode} compare)`))
    } else {
        console.log(chalk.blue('-------- Duplicate Files --------'))
        groups.forEach((group, index) => {
            const sizeInfo = mode === 'hash' ? formatSize(group.files[0].size) : 'name only'
            console.log(chalk.yellow(`[${index + 1}] ${group.files.length} files \t\t ${sizeInfo} \t\t ${group.key}`))
            group.files.forEach(file => {
                console.log(`    ${file.file}`)
            })
        })

        console.log(`Total duplicate file number: ${stats.duplicateFileCount} \t\t (group: ${stats.groupCount}, redundant: ${stats.redundantCount})`)
    }

    // 无论有没有重复文件都生成报告，方便留档
    if (options?.html) {
        const htmlPath = typeof options.html === 'string' ? options.html : 'duplicates-report.html'
        const absPath = writeHtmlReport(htmlPath, targetDir, files, groups, options)
        console.log(`Html report: \t\t ${absPath}`)
    }

    return groups
}

function main() {
    const argv = minimist(process.argv.slice(2), {
        string: ['dir', 'mode', 'exts', 'out'],
        boolean: ['case-sensitive', 'verbose', 'keep-empty', 'html'],
        alias: { d: 'dir', m: 'mode', e: 'exts', o: 'out' },
        default: { mode: 'hash' },
    })

    const targetDir = String(argv.dir || argv._[0] || '')
    if (!targetDir) {
        console.log('用法: esno src/diff-files/find-duplicates.ts <目录> [--mode hash|name] [--exts .pdf,.dwg] [--case-sensitive] [--verbose] [--keep-empty] [--html] [--out report.html]')
        return
    }

    // --out 指定路径时隐含生成报告；只写 --html 时输出到默认的 duplicates-report.html
    const out = argv.out ? String(argv.out) : undefined
    const html: boolean | string | undefined = out || (argv.html ? true : undefined)

    const mode: DuplicateMode = argv.mode === 'name' ? 'name' : 'hash'
    printDuplicates(targetDir, {
        mode,
        exts: argv.exts ? String(argv.exts).split(',') : [],
        caseSensitive: !!argv['case-sensitive'],
        ignoreEmpty: !argv['keep-empty'],
        verbose: !!argv.verbose,
        html,
    })
}

/** 是否作为入口文件直接运行（被 import 时返回 false，避免单测引入本文件就执行 main） */
function isDirectRun(): boolean {
    const entry = process.argv[1]
    if (!entry)
        return false
    try {
        const thisFile = path.normalize(fileURLToPath(import.meta.url))
        const targetFile = path.normalize(entry)
        if (thisFile === targetFile)
            return true
        // 兼容 Windows 下盘符/路径大小写不一致的情况
        return process.platform === 'win32' && thisFile.toLowerCase() === targetFile.toLowerCase()
    } catch {
        // 个别转换器下 import.meta.url 不可用，退化为文件名匹配
        return /find-duplicates\.[cm]?[jt]s$/.test(entry)
    }
}

if (isDirectRun())
    main()
