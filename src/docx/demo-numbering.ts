import * as fs from 'node:fs'
import type { INumberingOptions } from 'docx'
import {
  AlignmentType, BorderStyle, Document, HeadingLevel,
  IBorderOptions, Indent, LevelFormat, Numbering, Packer,
  Paragraph, SectionType, SymbolRun, TextRun,
} from 'docx'

const numbering: INumberingOptions = {
  config: [
    {
      reference: 'my-crazy-numbering',
      levels: [
        {
          level: 0,
          format: LevelFormat.UPPER_ROMAN,
          text: '%1',
          alignment: AlignmentType.START,
          style: {
            paragraph: {
              indent: { left: '3cm', hanging: '2cm' },
            },
          },
        },
        {
          level: 1,
          format: LevelFormat.DECIMAL,
          text: '%2.',
          alignment: AlignmentType.START,
          style: {
            paragraph: {
              indent: { left: 1440, hanging: 980 },
            },
          },
        },
        {
          level: 2,
          format: LevelFormat.LOWER_LETTER,
          text: '%3)',
          alignment: AlignmentType.START,
          style: {
            paragraph: {
              indent: { left: 2160, hanging: 1700 },
            },
          },
        },
        {
          level: 3,
          format: LevelFormat.UPPER_LETTER,
          text: '%4)',
          alignment: AlignmentType.START,
          style: {
            paragraph: {
              indent: { left: 2880, hanging: 2420 },
            },
          },
        },
      ],
    },
  ],
}

const doc = new Document({
  numbering,
  sections: [{
    children: [
      new Paragraph({
        text: 'Hey you',
        numbering: {
          reference: 'my-crazy-numbering',
          level: 0,
        },
      }),
      new Paragraph({
        text: 'What\'s up fam',
        numbering: {
          reference: 'my-crazy-numbering',
          level: 1,
        },
      }),
      new Paragraph({
        text: 'Hello World 2',
        numbering: {
          reference: 'my-crazy-numbering',
          level: 1,
        },
      }),
      new Paragraph({
        text: 'Yeah boi',
        numbering: {
          reference: 'my-crazy-numbering',
          level: 2,
        },
      }),
      new Paragraph({
        text: 'Hey you',
        bullet: {
          level: 0,
        },
      }),
      new Paragraph({
        text: 'What\'s up fam',
        bullet: {
          level: 1,
        },
      }),
      new Paragraph({
        text: 'Hello World 2',
        bullet: {
          level: 2,
        },
      }),
      new Paragraph({
        text: 'Yeah boi',
        bullet: {
          level: 3,
        },
      }),
      new Paragraph({
        text: '101 MSXFM',
        numbering: {
          reference: 'my-crazy-numbering',
          level: 3,
        },
      }),
      new Paragraph({
        text: 'back to level 1',
        numbering: {
          reference: 'my-crazy-numbering',
          level: 1,
        },
      }),
      new Paragraph({
        text: 'back to level 0',
        numbering: {
          reference: 'my-crazy-numbering',
          level: 0,
        },
      }),
    ],
  }],
})
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync('./src/docx/demo-numberings.docx', buffer)
})
