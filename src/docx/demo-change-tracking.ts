import * as fs from 'node:fs'
import type { INumberingOptions } from 'docx'
import {
  AlignmentType, BorderStyle, DeletedTextRun, Document,
  Footer, Header, HeadingLevel, IBorderOptions, Indent,
  InsertedTextRun, LevelFormat, NumberFormat, Numbering, Packer, PageBreak, PageNumber,
  Paragraph, SectionType, StyleLevel, SymbolRun, Table, TableCell, TableOfContents, TableRow, TextRun, WidthType,
} from 'docx'

const doc = new Document({
  sections: [
    {
      children: [
        new Paragraph({
          children: [
            new TextRun('This is a simple demo '),
            new TextRun({
              text: 'on how to ',
            }),
            new InsertedTextRun({
              text: 'mark a text as an insertion ',
              id: 0,
              author: 'Firstname Lastname',
              date: '2020-10-06T09:00:00Z',
            }),
            new DeletedTextRun({
              text: 'or a deletion.',
              id: 1,
              author: 'Firstname Lastname',
              date: '2020-10-06T09:00:00Z',
            }),
          ],
        }),
      ],
    },
  ],
})
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync('./src/docx/demo-change-tracking.docx', buffer)
})
