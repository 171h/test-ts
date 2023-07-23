import * as fs from 'node:fs'
import * as path from 'node:path'
import type { INumberingOptions } from 'docx'
import {
  AlignmentType, BorderStyle, Document, HeadingLevel,
  IBorderOptions, Indent, LevelFormat, Numbering, Packer,
  Paragraph, SectionType, SymbolRun, Table, TableCell, TableRow, TextRun, WidthType,
} from 'docx'

const styles = fs.readFileSync(path.resolve('./src/docx/assets/custom-styles.xml'), 'utf-8')

const doc = new Document({
  externalStyles: styles,
  sections: [{
    children: [
      new Table({
        // style: 'MyCustomTableStyle',
        // columnWidths: [3505, 5505],
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                // width: {
                //   size: 3505,
                //   type: WidthType.DXA,
                // },
                children: [new Paragraph('Hello')],
              }),
              new TableCell({
                // width: {
                //   // size: 5505,
                //   type: WidthType.DXA,
                // },
                children: [],
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                // width: {
                //   size: 3505,
                //   type: WidthType.DXA,
                // },
                children: [],
              }),
              new TableCell({
                // width: {
                //   size: 5505,
                //   type: WidthType.DXA,
                // },
                children: [new Paragraph('World')],
              }),
            ],
          }),
        ],
      }),
    ],
  }],
})
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync('./src/docx/demo-tables.docx', buffer)
})
