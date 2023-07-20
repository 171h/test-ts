import * as fs from 'node:fs'
import { BorderStyle, Document, HeadingLevel, IBorderOptions, Packer, Paragraph, SectionType, SymbolRun, TextRun, UnderlineType } from 'docx'

const doc = new Document({
  sections: [{
    children: [
      new Paragraph({
        children: [
          new TextRun('My awesome text here for my university dissertation.'),
          new TextRun('Foo Bar'),
          new TextRun({
            text: 'Foo Bar',
            bold: true,
          }),
          new TextRun({
            text: 'Foo Bar',
            italics: true,
          }),
          // underline
          new TextRun({
            text: 'vanilla underline',
            underline: { },
          }),
          new TextRun({
            text: 'and then underlined ',
            underline: {
              type: UnderlineType.DOUBLE,
              color: '990011',
            },
          }),
          // emphasis mark
          new TextRun({
            text: ' and then emphasis mark',
            emphasisMark: {},
          }),
          // Shading and Highlighting
          new TextRun({
            text: ' highlighting',
            highlight: 'yellow',
          }),
          // Strike through
          new TextRun({
            text: 'strike',
            strike: true,
          }),
          // Double strike through
          new TextRun({
            text: 'doubleStrike',
            doubleStrike: true,
          }),
          // Subscript
          new TextRun({
            text: 'subScript',
            subScript: true,
          }),
          // Superscript
          new TextRun({
            text: 'superScript',
            superScript: true,
          }),
          // All Capitals
          new TextRun({
            text: 'allCaps',
            allCaps: true,
          }),
          // Small Caps
          new TextRun({
            text: 'smallCaps',
            smallCaps: true,
          }),
          // Vanish and SpecVanish
          new TextRun({
            text: 'This text will be hidden',
            vanish: true,
          }),
          // break
          new TextRun({
            text: 'break',
            break: 1,
          }),
          new TextRun({
            text: 'break',
            break: 2,
          }),
          new TextRun({
            text: 'new text',
          }),
        ],
      }),
    ],
  }],
})

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync('./src/docx/demo-text.docx', buffer)
})
