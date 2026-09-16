import type { DuplicateGroup } from '../src/diff-files/find-duplicates'
import crypto from 'node:crypto'
import os from 'node:os'
import { isAbsolute } from 'node:path'
import fs from 'fs-extra'
import path from 'pathe'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import {
  collectFiles,
  findDuplicates,
  findDuplicatesByHash,
  findDuplicatesByName,
  printDuplicates,
  renderHtmlReport,
  writeHtmlReport,
} from '../src/diff-files/find-duplicates'

const md5 = (content: string) => crypto.createHash('md5').update(content).digest('hex')

/** 测试根目录，beforeAll 后会被写入测试文件 */
const baseDir = path.join(os.tmpdir(), `find-duplicates-test-${process.pid}-${Date.now()}`)
/** 主测试目录，结构见 beforeAll */
const rootDir = path.join(baseDir, 'root')

/** 主目录中的文件个数（按相对路径列出的全部文件） */
const ALL_FILES = [
  'a.txt',
  'b.txt',
  'c.txt',
  'empty1.txt',
  'empty2.txt',
  'same.pdf',
  'sub/a.txt',
  'sub/same.pdf',
]

function writeFile(dir: string, relativePath: string, content: string) {
  const absPath = path.join(dir, relativePath)
  fs.ensureDirSync(path.dirname(absPath))
  fs.writeFileSync(absPath, content)
}

/** 打印每组的 key 与文件列表，便于断言分组结果 */
function summarize(groups: DuplicateGroup[]) {
  return groups.map(group => ({ key: group.key, files: group.files.map(file => file.file) }))
}

/** 取出 HTML 中所有「文件名（不含目录）」单元格的内容 */
function getNamesCells(html: string) {
  return [...html.matchAll(/<td class="names">(.*?)<\/td>/g)].map(match => match[1])
}

describe('collectFiles', () => {
  it('递归收集目录下所有文件', () => {
    const files = collectFiles(rootDir)
    expect(files.map(file => file.file).sort()).toEqual([...ALL_FILES].sort())
    // 绝对路径与文件大小应被一并带回
    expect(files.every(file => isAbsolute(file.absPath))).toBe(true)
    expect(files.find(file => file.file === 'a.txt')?.size).toBe('hello'.length)
  })

  it('按扩展名过滤，且不区分大小写、可省略点', () => {
    expect(collectFiles(rootDir, { exts: ['.pdf'] })).toHaveLength(2)
    expect(collectFiles(rootDir, { exts: ['pdf'] })).toHaveLength(2)
    expect(collectFiles(rootDir, { exts: ['.PDF'] })).toHaveLength(2)
    expect(collectFiles(rootDir, { exts: ['.txt'] })).toHaveLength(6)
    expect(collectFiles(rootDir, { exts: ['.pdf', '.txt'] })).toHaveLength(ALL_FILES.length)
    expect(collectFiles(rootDir, { exts: [] })).toHaveLength(ALL_FILES.length)
  })

  it('目录不存在时返回空数组并提示错误', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      expect(collectFiles(path.join(rootDir, 'not-exist'))).toEqual([])
      expect(errorSpy).toHaveBeenCalledOnce()
    } finally {
      errorSpy.mockRestore()
    }
  })
})

describe('findDuplicatesByHash', () => {
  it('按内容 md5 找出重复文件，忽略仅出现一次和空文件', () => {
    const groups = findDuplicatesByHash(collectFiles(rootDir))
    expect(summarize(groups)).toEqual([
      {
        key: md5('hello'),
        files: ['a.txt', 'b.txt', 'sub/a.txt'],
      },
    ])
    // 内容不同的同名 pdf 不属于重复文件
    expect(groups.some(group => group.key === md5('pdf-content'))).toBe(false)
  })

  it('ignoreEmpty 为 false 时把内容相同的空文件也视为重复', () => {
    const groups = findDuplicatesByHash(collectFiles(rootDir), { ignoreEmpty: false })
    expect(summarize(groups)).toEqual([
      { key: md5('hello'), files: ['a.txt', 'b.txt', 'sub/a.txt'] },
      { key: md5(''), files: ['empty1.txt', 'empty2.txt'] },
    ])
  })

  it('组内文件按相对路径排序，且为空目录时返回空数组', () => {
    const groups = findDuplicatesByHash(collectFiles(rootDir))
    expect(groups[0].files.map(file => file.file)).toEqual(['a.txt', 'b.txt', 'sub/a.txt'])
    expect(findDuplicatesByHash([])).toEqual([])
  })
})

describe('findDuplicatesByName', () => {
  it('按文件名找出同名文件（内容可以不同）', () => {
    const groups = findDuplicatesByName(collectFiles(rootDir))
    expect(summarize(groups)).toEqual([
      { key: 'a.txt', files: ['a.txt', 'sub/a.txt'] },
      { key: 'same.pdf', files: ['same.pdf', 'sub/same.pdf'] },
    ])
  })

  it('默认忽略大小写，caseSensitive 为 true 时区分大小写', () => {
    // Windows 文件系统不区分大小写，无法在磁盘上造出 A.TXT/a.txt 两个文件，这里直接构造文件列表
    const files = [
      { file: 'a.txt', absPath: 'C:/temp/a.txt', size: 5 },
      { file: 'A.TXT', absPath: 'C:/temp/A.TXT', size: 5 },
    ]

    const groups = findDuplicatesByName(files)
    expect(groups).toHaveLength(1)
    expect(groups[0].key).toBe('a.txt')
    expect(groups[0].files.map(file => file.file).sort()).toEqual(['A.TXT', 'a.txt'])
    expect(findDuplicatesByName(files, { caseSensitive: true })).toEqual([])
  })
})

describe('findDuplicates', () => {
  it('默认按 hash 查找，mode 为 name 时按文件名查找', () => {
    expect(findDuplicates(rootDir)).toHaveLength(1)
    expect(findDuplicates(rootDir, { mode: 'hash' })).toHaveLength(1)
    expect(findDuplicates(rootDir, { mode: 'name' })).toHaveLength(2)
  })

  it('exts 同时作用于两种查找方式', () => {
    expect(findDuplicates(rootDir, { exts: ['.pdf'] })).toEqual([])
    expect(findDuplicates(rootDir, { exts: ['.pdf'], mode: 'name' })).toHaveLength(1)
  })
})

describe('printDuplicates', () => {
  it('列出重复的文件名与数量', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    try {
      const groups = printDuplicates(rootDir)
      const output = logSpy.mock.calls.map(args => args.join(' ')).join('\n')

      expect(groups).toHaveLength(1)
      expect(output).toContain('Duplicate group number:')
      expect(output).toContain('Total duplicate file number: 3')
      expect(output).toContain('(group: 1, redundant: 2)')
      // 重复的文件名都需要被列出
      expect(output).toContain('a.txt')
      expect(output).toContain('b.txt')
      expect(output).toContain('sub/a.txt')
      // 非重复文件不应出现
      expect(output).not.toContain('c.txt')
    } finally {
      logSpy.mockRestore()
    }
  })

  it('按文件名查找时同样输出数量统计', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    try {
      const groups = printDuplicates(rootDir, { mode: 'name' })
      const output = logSpy.mock.calls.map(args => args.join(' ')).join('\n')

      expect(groups).toHaveLength(2)
      expect(output).toContain('Duplicate file number:')
      expect(output).toContain('Total duplicate file number: 4')
      expect(output).toContain('same.pdf')
    } finally {
      logSpy.mockRestore()
    }
  })

  it('没有重复文件时输出提示', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    try {
      const groups = printDuplicates(rootDir, { exts: ['.pdf'] })
      const output = logSpy.mock.calls.map(args => args.join(' ')).join('\n')

      expect(groups).toEqual([])
      expect(output).toContain('No Duplicate File!!')
      expect(output).toContain('Redundant file number:')
    } finally {
      logSpy.mockRestore()
    }
  })
})

describe('HTML 报告', () => {
  it('renderHtmlReport 包含统计信息与全部重复文件名', () => {
    const files = collectFiles(rootDir)
    const groups = findDuplicatesByHash(files)
    const html = renderHtmlReport(rootDir, files, groups, { mode: 'hash' })

    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('重复文件报告')
    // 带目录的重复文件列表列
    expect(html).toContain('<code>sub/a.txt</code>')
    // 不含目录的文件名列：同名只出现一次，不同名各占一行
    expect(getNamesCells(html)).toEqual(['<code>a.txt</code><code>b.txt</code>'])
    // 统计卡片：扫描文件数 / 重复文件数 / 可清理冗余数
    expect(html).toContain(`<div class="value">${ALL_FILES.length}</div>`)
    expect(html).toContain('<div class="value">3</div>')
    expect(html).toContain('<div class="value">2</div>')
    // 非重复文件不应出现在报告中
    expect(html).not.toContain('c.txt')
  })

  it('没有重复文件时也给出提示而不是空表格', () => {
    const files = collectFiles(rootDir, { exts: ['.pdf'] })
    const html = renderHtmlReport(rootDir, files, findDuplicatesByHash(files), { exts: ['.pdf'] })

    expect(html).toContain('没有发现重复文件')
    expect(html).not.toContain('<tbody>')
    // 扩展名筛选条件也写入报告
    expect(html).toContain('.pdf')
  })

  it('文件名列不含目录：同名只显示一个，且不使用折叠', () => {
    const files = collectFiles(rootDir)
    const html = renderHtmlReport(rootDir, files, findDuplicatesByName(files), { mode: 'name' })

    // 两组都是「不同目录下的同名文件」，文件名列各只出现一次
    expect(getNamesCells(html)).toEqual(['<code>a.txt</code>', '<code>same.pdf</code>'])
    // 带目录的列表列则把两个路径都列出来（且每项都带大小）
    expect(html).toContain('<code>a.txt</code><span class="size">')
    expect(html).toContain('<code>sub/a.txt</code>')
    expect(html).toContain('<code>sub/same.pdf</code>')
    // details 只属于文件列表列，数量等于组数（文件名列没有折叠）
    expect(html.match(/<details/g)).toHaveLength(2)
  })

  it('组内文件名不同时，文件名列逐个换行放在同一格', () => {
    const group = {
      key: 'md5-x',
      files: [
        { file: '图纸A/平面图.dwg', absPath: 'C:/temp/1.dwg', size: 100 },
        { file: '图纸B/总图.dwg', absPath: 'C:/temp/2.dwg', size: 100 },
      ],
    }
    const html = renderHtmlReport('C:/temp', group.files, [group])

    expect(getNamesCells(html)).toEqual(['<code>平面图.dwg</code><code>总图.dwg</code>'])
    // 带目录的两行仍保留在列表列
    expect(html).toContain('<code>图纸A/平面图.dwg</code>')
    expect(html).toContain('<code>图纸B/总图.dwg</code>')
  })

  it('转义文件名与分组依据中的 HTML 特殊字符', () => {
    const files = [
      { file: 'dir/a<b>&"x".txt', absPath: 'C:/temp/a.txt', size: 10 },
      { file: 'sub/a<b>.txt', absPath: 'C:/temp/b.txt', size: 10 },
    ]
    const html = renderHtmlReport('C:/temp<script>', files, [{ key: '<img src=x onerror=1>', files }], { mode: 'name' })

    expect(html).not.toContain('<img src=x')
    expect(html).toContain('&lt;img src=x onerror=1&gt;')
    expect(html).toContain('a&lt;b&gt;&amp;&quot;x&quot;.txt')
    expect(html).toContain('&lt;script&gt;')
  })

  it('writeHtmlReport 自动创建不存在的目录并写入文件', () => {
    const htmlPath = path.join(baseDir, 'nested', 'dir', 'report.html')
    const files = collectFiles(rootDir)
    const absPath = writeHtmlReport(htmlPath, rootDir, files, findDuplicatesByHash(files))

    expect(fs.existsSync(absPath)).toBe(true)
    expect(fs.readFileSync(absPath, 'utf-8')).toContain('<code>a.txt</code>')
  })

  it('printDuplicates 传 html 时生成报告文件并输出路径', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    try {
      const htmlPath = path.join(baseDir, 'report', 'by-print.html')
      printDuplicates(rootDir, { html: htmlPath })
      const output = logSpy.mock.calls.map(args => args.join(' ')).join('\n')

      expect(fs.existsSync(htmlPath)).toBe(true)
      expect(output).toContain('Html report:')
      expect(output).toContain('by-print.html')
    } finally {
      logSpy.mockRestore()
    }
  })
})

beforeAll(() => {
  fs.removeSync(baseDir)
  // 内容完全相同的 3 个文件
  writeFile(rootDir, 'a.txt', 'hello')
  writeFile(rootDir, 'b.txt', 'hello')
  writeFile(rootDir, 'sub/a.txt', 'hello')
  // 内容唯一
  writeFile(rootDir, 'c.txt', 'world')
  // 同名但内容不同的 pdf（大小也不同）
  writeFile(rootDir, 'same.pdf', 'pdf-content')
  writeFile(rootDir, 'sub/same.pdf', 'other-content')
  // 空文件
  writeFile(rootDir, 'empty1.txt', '')
  writeFile(rootDir, 'empty2.txt', '')
})

afterAll(() => {
  fs.removeSync(baseDir)
})
