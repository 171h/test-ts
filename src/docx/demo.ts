import * as fs from 'node:fs'
import { Document, Packer, Paragraph, TextRun } from 'docx'

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
  sections: [
    {
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun('Hello World'),
            new TextRun({
              text: 'Foo Bar',
              bold: true,
            }),
            new TextRun({
              text: '\tGithub is the best',
              bold: true,
            }),
          ],
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
