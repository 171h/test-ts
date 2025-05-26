import { getDocumentProxy } from 'unpdf'
import fs from 'fs-extra'
import path from 'pathe'

async function getPdfSize(buffer: Buffer) {
    const pdf = await getDocumentProxy(new Uint8Array(buffer))
    const width = (await pdf.getPage(1)).getViewport({ scale: 1 }).width / 28.3498
    const height = (await pdf.getPage(1)).getViewport({ scale: 1 }).height / 28.3498
    return [width, height]
}

function getMappableUnit(size: [number, number]) {
    let [width, height] = size
    if (width < height) {
        const temp = width
        width = height
        height = temp
    }
    if (height > 84.1) {
        if (width > 118.9 * 1.2)
            return 'A0+'
        return 'A0'
    } else if (height > 59.4) {
        if (width > 84.1 * 1.2)
            return 'A1+'
        return 'A1'
    } else if (width > 59.4 && height > 42.0) {
        if (width > 59.4 * 1.2)
            return 'A2+'
        return 'A2'
    } else if (width > 42.0 && height > 29.7) {
        if (width >  42.0 * 1.2)
            return 'A3+'
        return 'A3'
    } else if (width > 29.7 && height > 21.0) {
        if (width > 29.7 * 1.2)
            return 'A4+'
        return 'A4'
    } else if (width > 21.0 && height > 14.8) {
        if (width > 21.0 * 1.2)
            return 'A5+'
        return 'A5'
    }
}

const pdfFolder = 'E:/Users/171h/OneDrive/乐高商业街/02.图纸/竣工图（整理）/缤纷里/结构/PDF'

const files = fs.readdirSync(pdfFolder, { encoding: 'utf-8', recursive: true })

for (const file of files) {
    if(!file.endsWith('.pdf')) 
        continue

    const buffer = await fs.readFile(path.join(pdfFolder, file))
    const pdf = await getDocumentProxy(new Uint8Array(buffer))
    const [width, height] = await getPdfSize(buffer)
    const mappableUnit = getMappableUnit([width, height])
    await pdf.destroy()
    const fileStr = `${mappableUnit}:\t ${file} (${width.toFixed(2)} x ${height.toFixed(2)})`
    console.log(fileStr)
}