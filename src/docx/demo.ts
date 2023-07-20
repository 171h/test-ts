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
        // new Paragraph({
        //   children: [
        //     new Paragraph({
        //       children: [
        //         new TextRun('Hello World1'),
        //       ],
        //     }),
        //   ],
        // }),

        // new TextRun('Hello World1'),

        new Paragraph({
          children: [
            new TextRun('Hello World1'),
          ],
        }),
      ],
    },
  ],
})

// Used to export the file into a .docx file
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync('./src/docx/demo.docx', buffer)
})

// Done! A file called 'My Document.docx' will be in your file system.
