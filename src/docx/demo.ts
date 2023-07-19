import * as fs from 'node:fs'
import { BorderStyle, Document, HeadingLevel, IBorderOptions, Packer, Paragraph, SectionType, SymbolRun, TextRun } from 'docx'

// Documents contain sections, you can have multiple sections per document, go here to learn more about sections
// This simple example will only contain one section
const doc = new Document({
  creator: '171h',
  description: 'demo.ts generate test',
  title: 'Demo.ts',
  subject: 'subject test',
  keywords: 'keywords test mddoc',
  lastModifiedBy: '171h',
  revision: 1,
  customProperties: [
    {
      name: 'version',
      value: '1.0.0',
    },
  ],
  background: {
    // color: '#FF0000',
  },
  sections: [
    {
      properties: {
        type: SectionType.ODD_PAGE,

      },
      children: [
        new Paragraph({
          children: [
            new TextRun('Hello World1'),
            new TextRun({
              text: 'Foo Bar',
              bold: true,
            }),
            new TextRun({
              text: '\tGithub is the best',
              bold: true,
            }),
            new SymbolRun('F071'),
          ],
          heading: HeadingLevel.HEADING_1,
          border: {
            bottom: {
              style: BorderStyle.DASHED,
              size: 10,
              color: '#FF0000',
            },
          },
          widowControl: true,
          spacing: {
            before: 100,
            after: 100,
          },
        }),
        new Paragraph({
          children: [
            new TextRun('Hello World1'),
            new TextRun({
              text: 'Foo Bar',
              bold: true,
            }),
            new TextRun({
              text: '\tGithub is the best',
              bold: true,
            }),
            new SymbolRun('F071'),
          ],
          heading: HeadingLevel.HEADING_1,
          border: {
            bottom: {
              style: BorderStyle.DASHED,
              size: 10,
              color: '#FF0000',
            },
          },
          widowControl: true,
          spacing: {
            before: 100,
            after: 100,
          },
        }),
      ],
    },
  ],
})

// Used to export the file into a .docx file
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync('./src/docx/My Document.docx', buffer)
})

// Done! A file called 'My Document.docx' will be in your file system.
