import * as fs from 'node:fs'
import {
  Document, FootnoteReferenceRun, Packer, Paragraph, TextRun,
} from 'docx'

const doc = new Document({
  footnotes: {
    1: { children: [new Paragraph('Foo'), new Paragraph('Bar')] },
    2: { children: [new Paragraph('Test')] },
  },
  sections: [
    {
      children: [
        new Paragraph({
          children: [
            new TextRun({
              children: ['Hello'],
            }),
            new FootnoteReferenceRun(1),
            new TextRun({
              children: [' World!'],
            }),
            new FootnoteReferenceRun(2),
          ],
        }),
      ],
    },
  ],
})

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync('./src/docx/demo-footnotes.docx', buffer)
})
