import * as fs from 'node:fs'
import { BorderStyle, CheckBox, Document, HeadingLevel, IBorderOptions, Packer, Paragraph, SectionType, SymbolRun, TextRun, UnderlineType } from 'docx'

const doc = new Document({
  sections: [
    {
      children: [
        new Paragraph({
          children: [
            new TextRun('Section 1 My awesome text here for my university dissertation.'),
            new TextRun('Foo Bar'),
            new TextRun({
              text: 'Foo Bar',
              bold: true,
            }),
          ],
          indent: {
            start: 720,
            end: 720,
            firstLine: 720,
            hanging: 720,
            left: 720,
            right: 720,
          },
        }),
      ],
    },
    {
      children: [
        new Paragraph({
          children: [
            new TextRun('Section 2 My awesome text here for my university dissertation.'),
            new TextRun('Foo Bar'),
            new TextRun({
              text: 'Foo Bar',
              bold: true,
            }),
          ],
          indent: {
            start: 720,
            end: 720,
            firstLine: 720,
            hanging: 720,
            left: 720,
            right: 720,
          },
        }),
      ],
    },
  ],
})

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync('./src/docx/demo-section.docx', buffer)
})
