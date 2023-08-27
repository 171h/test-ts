import * as fs from 'node:fs'
import { BorderStyle, CheckBox, Document, HeadingLevel, IBorderOptions, LineRuleType, Packer, Paragraph, SectionType, SymbolRun, TextRun, UnderlineType, convertInchesToTwip } from 'docx'

const doc = new Document({
  sections: [{
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: 'My awesome text here for my university dissertation.',
            size: 18,
          }),
        ],
        spacing: {
          line: 720,
          lineRule: LineRuleType.EXACT,
        },
      }),
    ],
  }],
})

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync('./src/docx/demo-paragraph-spacing.docx', buffer)
})
