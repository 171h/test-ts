import * as fs from 'node:fs'
import {
  AlignmentType, Document, HeadingLevel, LevelFormat, Packer, Paragraph,
  TextRun, UnderlineType, convertInchesToTwip,
} from 'docx'

const doc = new Document({
  creator: 'Clippy',
  title: 'Sample Document',
  description: 'A brief example of using docx',
  styles: {
    default: {
      heading1: {
        run: {
          size: 28,
          bold: true,
          italics: true,
          color: 'FF0000',
        },
        paragraph: {
          spacing: {
            after: 120,
          },
          numbering: {
            reference: 'my-crazy-numbering',
            level: 0,
          },
        },
      },
      heading2: {
        run: {
          size: 26,
          bold: true,
          underline: {
            type: UnderlineType.DOUBLE,
            color: 'FF0000',
          },
        },
        paragraph: {
          spacing: {
            before: 240,
            after: 120,
          },
          numbering: {
            reference: 'my-crazy-numbering',
            level: 1,
          },
        },
      },
      heading3: {
        run: {
          size: 26,
          bold: true,
          underline: {
            type: UnderlineType.DOUBLE,
            color: 'FF0000',
          },
        },
        paragraph: {
          spacing: {
            before: 240,
            after: 120,
          },
          numbering: {
            reference: 'my-crazy-numbering',
            level: 2,
          },
        },
      },
      heading4: {
        run: {
          size: 26,
          bold: true,
          underline: {
            type: UnderlineType.DOUBLE,
            color: 'FF0000',
          },
        },
        paragraph: {
          spacing: {
            before: 240,
            after: 120,
          },
          numbering: {
            reference: 'my-crazy-numbering',
            level: 3,
          },
        },
      },
      heading5: {
        run: {
          size: 26,
          bold: true,
          underline: {
            type: UnderlineType.DOUBLE,
            color: 'FF0000',
          },
        },
        paragraph: {
          spacing: {
            before: 240,
            after: 120,
          },
          numbering: {
            reference: 'my-crazy-numbering',
            level: 4,
          },
        },
      },
      heading6: {
        run: {
          size: 26,
          bold: true,
          underline: {
            type: UnderlineType.DOUBLE,
            color: 'FF0000',
          },
        },
        paragraph: {
          spacing: {
            before: 240,
            after: 120,
          },
          numbering: {
            reference: 'my-crazy-numbering',
            level: 5,
          },
        },
      },
    },
  },
  numbering: {
    config: [
      {
        reference: 'my-crazy-numbering',
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: '第 %1 章',
            alignment: AlignmentType.LEFT,
          },
          {
            level: 1,
            format: LevelFormat.DECIMAL,
            text: '%1.%2',
            alignment: AlignmentType.LEFT,
          },
          {
            level: 2,
            format: LevelFormat.DECIMAL,
            text: '%1.%2.%3',
            alignment: AlignmentType.LEFT,
          },
          {
            level: 3,
            format: LevelFormat.DECIMAL,
            text: '%1.%2.%3.%4',
            alignment: AlignmentType.LEFT,
          },
          {
            level: 4,
            format: LevelFormat.DECIMAL,
            text: '%1.%2.%3.%4.%5',
            alignment: AlignmentType.LEFT,
          },
          {
            level: 5,
            format: LevelFormat.DECIMAL,
            text: '%1.%2.%3.%4.%5.%6',
            alignment: AlignmentType.LEFT,
          },
          {
            level: 6,
            format: LevelFormat.DECIMAL,
            text: '%1.%2.%3.%4.%5.%6.%7',
            alignment: AlignmentType.LEFT,
          },
        ],
      },
    ],
  },
  sections: [
    {
      children: [
        new Paragraph({
          text: 'Test heading1, bold and italicized',
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph('Some simple content'),
        new Paragraph({
          text: 'Test heading2 with double red underline',
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({
          text: 'Test heading3 with double red underline',
          heading: HeadingLevel.HEADING_3,
        }),
        new Paragraph({
          text: 'Test heading4 with double red underline',
          heading: HeadingLevel.HEADING_4,
        }),
        new Paragraph({
          text: 'Test heading5 with double red underline',
          heading: HeadingLevel.HEADING_5,
        }),
        new Paragraph({
          text: 'Test heading6 with double red underline',
          heading: HeadingLevel.HEADING_6,
        }),
        new Paragraph({ text: 'Option1' }),
      ],
    },
  ],
})
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync('./src/docx/demo-advanced-styling.docx', buffer)
})
