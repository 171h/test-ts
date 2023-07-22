import * as fs from 'node:fs'
import {
  AlignmentType, CheckBox, Document, HeadingLevel, LevelFormat, LevelSuffix, Packer, Paragraph,
  TextRun, UnderlineType, convertInchesToTwip, convertMillimetersToTwip,
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
            reference: 'multi',
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
            reference: 'multi',
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
            reference: 'multi',
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
            reference: 'multi',
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
            reference: 'multi',
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
            reference: 'multi',
            level: 5,
          },
        },
      },
      title: {
        run: {
          size: 56,
          bold: true,
          color: '#00FF00',
        },
      },
      strong: {
        name: '正文加粗',
        basedOn: 'normal',
        run: {
          bold: true,
        },
      },
      listParagraph: {
        quickFormat: false,
      },
      footnoteReference: {
        quickFormat: false,
      },
      footnoteText: {
        quickFormat: false,
      },
      hyperlink: {
        quickFormat: false,
      },
      footnoteTextChar: {
        quickFormat: false,
      },
    },
    /**
     * 需要配置的样式
     * 标题：heading1 ~ heading6
     * 正文：paragraph
     * 要点：strong
     * 引用：blockquote
     * 代码：code
     * 无序列表：bulletList
     * 有序列表：orderedList
     * 任务列表：taskList
     * 表格：table
     * callout：callout
     */
    paragraphStyles: [
      {
        id: 'normal',
        name: '正文',
        quickFormat: true,
        run: {
          color: '#ff0000',
        },
        paragraph: {
        },
      },
      {
        id: 'quote',
        name: '引用',
        basedOn: 'normal',
        quickFormat: true,
        run: {
          italics: true,
        },
      },
      {
        id: 'ul',
        name: '无序列表',
        next: 'ul',
        quickFormat: true,
        paragraph: {
          numbering: {
            reference: 'ul',
            level: 0,
          },
        },
      },
      {
        id: 'ol',
        name: '有序列表',
        next: 'ol',
        quickFormat: true,
        paragraph: {
          numbering: {
            reference: 'ol',
            level: 0,
          },
        },
      },
      {
        id: 'taskList',
        name: '任务列表',
        next: 'taskList',
        quickFormat: true,
        run: {
          color: '#0000ff',
        },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: 'multi',
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
      {
        reference: 'ul',
        levels: [
          {
            level: 0,
            alignment: AlignmentType.LEFT,
            format: LevelFormat.DECIMAL_ENCLOSED_CIRCLE,
            text: '•',
          },
          {
            level: 1,
            alignment: AlignmentType.LEFT,
            format: LevelFormat.CUSTOM,
            text: '◦',
          },
          {
            level: 2,
            alignment: AlignmentType.LEFT,
            format: LevelFormat.CUSTOM,
            text: '▪',
          },
          {
            level: 3,
            alignment: AlignmentType.LEFT,
            format: LevelFormat.CUSTOM,
            text: '▫',
          },
          {
            level: 4,
            alignment: AlignmentType.LEFT,
            format: LevelFormat.CUSTOM,
            text: '-',
          },
          {
            level: 5,
            alignment: AlignmentType.LEFT,
            format: LevelFormat.CUSTOM,
            text: '+',
          },
        ],
      },
      {
        reference: 'ol',
        levels: [
          {
            level: 0,
            alignment: AlignmentType.LEFT,
            format: LevelFormat.CHINESE_LEGAL_SIMPLIFIED,
            text: '%1.',
            suffix: LevelSuffix.SPACE,
          },
          {
            level: 1,
            alignment: AlignmentType.LEFT,
            format: LevelFormat.CHINESE_COUNTING,
            text: '%2.',
          },
          {
            level: 2,
            alignment: AlignmentType.LEFT,
            format: LevelFormat.DECIMAL,
            text: '%3.',
          },
          {
            level: 3,
            alignment: AlignmentType.LEFT,
            format: LevelFormat.UPPER_LETTER,
            text: '%4.',
          },
          {
            level: 4,
            alignment: AlignmentType.LEFT,
            format: LevelFormat.LOWER_LETTER,
            text: '%5.',
          },
          {
            level: 5,
            alignment: AlignmentType.LEFT,
            format: LevelFormat.LOWER_ROMAN,
            text: '%6.',
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
          heading: HeadingLevel.TITLE,
        }),
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
        new Paragraph({ text: 'Paragraph lorem', style: 'heading1' }),
        new Paragraph({ text: 'Paragraph 正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文', style: 'normal' }),
        new Paragraph({ text: 'Paragraph 要点要点要点要点要点要点要点要点要点要点要点要点要点要点要点', style: 'Strong' }),
        new Paragraph({ text: 'Paragraph 引用引用引用引用引用引用引用引用引用引用引用引用引用引用引用', style: 'quote' }),

        new Paragraph({ text: 'Paragraph 无序列表1', style: 'ul' }),
        new Paragraph({ text: 'Paragraph 无序列表2', style: 'ul' }),
        new Paragraph({ text: 'Paragraph 无序列表3', style: 'ul' }),
        new Paragraph({ text: 'Paragraph 无序列表4', style: 'ul' }),
        new Paragraph({ text: 'Paragraph 无序列表5', style: 'ul' }),

        new Paragraph({ text: 'Paragraph 有序列表1', style: 'ol' }),
        new Paragraph({ text: 'Paragraph 有序列表2', style: 'ol' }),
        new Paragraph({ text: 'Paragraph 有序列表3', style: 'ol' }),
        new Paragraph({ text: 'Paragraph 有序列表4', style: 'ol' }),
        new Paragraph({ text: 'Paragraph 有序列表5', style: 'ol' }),

        new Paragraph({
          style: 'taskList',
          children: [
            new CheckBox({ checked: true, checkedState: { value: '2611' }, uncheckedState: { value: '2610' } }),
            new TextRun({ text: 'Paragraph 任务列表1' }),
          ],
        }),
        new Paragraph({
          style: 'taskList',
          children: [
            new CheckBox({ checked: false, checkedState: { value: '2611' }, uncheckedState: { value: '2610' } }),
            new TextRun({ text: 'Paragraph 任务列表2' }),
          ],
        }),
        new Paragraph({
          style: 'taskList',
          children: [
            new CheckBox({ checked: true, checkedState: { value: '2611' }, uncheckedState: { value: '2610' } }),
            new TextRun({ text: 'Paragraph 任务列表3' }),
          ],
        }),

      ],
    },
  ],
})
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync('./src/docx/demo-advanced-styling.docx', buffer)
})
