import * as fs from 'node:fs'
import type { INumberingOptions } from 'docx'
import {
  AlignmentType, BorderStyle, DeletedTextRun, Document,
  Footer, Header, HeadingLevel, IBorderOptions, Indent,
  InsertedTextRun, LevelFormat, Math, MathFraction, MathRun, NumberFormat, Numbering,
  Packer, PageBreak, PageNumber, Paragraph, SectionType, StyleLevel, SymbolRun, Table, TableCell, TableOfContents, TableRow, TextRun, WidthType,
} from 'docx'

const doc = new Document({
  sections: [
    {
      children: [
        new Paragraph({
          children: [
            new TextRun('This is a simple demo '),
            new Math({
              children: [
                new MathRun('2+2'),
                new MathFraction({
                  numerator: [new MathRun('hi')],
                  denominator: [new MathRun('2')],
                }),
              ],
            }),
          ],
        }),
      ],
    },
  ],
})
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync('./src/docx/demo-math.docx', buffer)
})
