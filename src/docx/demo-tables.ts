import * as fs from 'node:fs'
import type { INumberingOptions } from 'docx'
import {
  AlignmentType, BorderStyle, Document, HeadingLevel,
  IBorderOptions, Indent, LevelFormat, Numbering, Packer,
  Paragraph, SectionType, SymbolRun, Table, TableCell, TableRow, TextRun, WidthType,
} from 'docx'

const doc = new Document({
  sections: [{
    children: [
      new Table({
        columnWidths: [3505, 5505],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: {
                  size: 3505,
                  type: WidthType.DXA,
                },
                children: [new Paragraph('Hello')],
              }),
              new TableCell({
                width: {
                  size: 5505,
                  type: WidthType.DXA,
                },
                children: [],
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                width: {
                  size: 3505,
                  type: WidthType.DXA,
                },
                children: [],
              }),
              new TableCell({
                width: {
                  size: 5505,
                  type: WidthType.DXA,
                },
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
