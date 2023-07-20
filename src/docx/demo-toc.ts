import * as fs from 'node:fs'
import type { INumberingOptions } from 'docx'
import {
  AlignmentType, BorderStyle, Document, HeadingLevel,
  IBorderOptions, Indent, LevelFormat, Numbering, Packer,
  Paragraph, SectionType, StyleLevel, SymbolRun, Table, TableCell, TableOfContents, TableRow, TextRun, WidthType,
} from 'docx'

const doc = new Document({
  features: {
    updateFields: true,
  },
  styles: {
    paragraphStyles: [
      {
        id: 'MySpectacularStyle',
        name: 'My Spectacular Style',
        basedOn: 'Heading1',
        next: 'Heading1',
        quickFormat: true,
        run: {
          italics: true,
          color: '990000',
        },
      },
    ],
  },
  sections: [
    {
      children: [
        new TableOfContents('Summary', {
          hyperlink: true,
          headingStyleRange: '1-5',
          stylesWithLevels: [new StyleLevel('MySpectacularStyle', 1)],
        }),
        new Paragraph({
          text: 'Header #1',
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
        }),
        new Paragraph('I\'m a little text very nicely written.\''),
        new Paragraph({
          text: 'Header #2',
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
        }),
        new Paragraph('I\'m a other text very nicely written.\''),
        new Paragraph({
          text: 'Header #2.1',
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph('I\'m a another text very nicely written.\''),
        new Paragraph({
          text: 'My Spectacular Style #1',
          style: 'MySpectacularStyle',
          pageBreakBefore: true,
        }),
      ],
    },
  ],
})
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync('./src/docx/demo-toc.docx', buffer)
})
