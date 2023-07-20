import * as fs from 'node:fs'
import { BorderStyle, Document, HeadingLevel, IBorderOptions, Packer, Paragraph, SectionType, SymbolRun, TextRun } from 'docx'

const doc = new Document({
  sections: [{
    children: [
      new Paragraph({
        text: 'Bullet points',
        bullet: {
          level: 0, // How deep you want the bullet to be. Maximum level is 9
        },
      }),
      new Paragraph({
        text: 'Are awesome',
        bullet: {
          level: 0,
        },
      }),
      new Paragraph({
        text: 'Are awesome1',
        bullet: {
          level: 1,
        },
      }),
      new Paragraph({
        text: 'Are awesome2',
        bullet: {
          level: 2,
        },
      }),
      new Paragraph({
        text: 'Are awesome3',
        bullet: {
          level: 3,
        },
      }),
    ],
  }],
})

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync('./src/docx/demo-bullet-points.docx', buffer)
})
