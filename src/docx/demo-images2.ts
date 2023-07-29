import * as fs from 'node:fs'
import {
  AlignmentType, Document, ImageRun, Packer, Paragraph, TextRun,
} from 'docx'

let buffer
try {
  buffer = fs.readFileSync('./src/docx/demo2.jpg')
}
catch (err) {}

const doc = new Document({
  styles: {
    paragraphStyles: [
      {
        id: 'p',
        name: 'My Standard style',
        quickFormat: true,
        paragraph: {
          alignment: AlignmentType.CENTER,
        },
      },
      {
        id: 'title',
        name: 'Title',
        run: {
          bold: true,
        },
        paragraph: {
          alignment: AlignmentType.CENTER,
        },
      },
    ],
  },
  sections: [{
    children: [
      new Paragraph({
        children: [
          new ImageRun({
            data: buffer || '',
            transformation: {
              width: 150,
              height: 150,
            },
            altText: {
              title: 'This is an altText title',
              description: 'This is an altText description',
              name: 'This is an altText name',
            },
          }),
        ],
        style: 'p',
      }),
      new Paragraph({ text: 'Imgage Title', style: 'title' }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'This is my first paragraph, it contains a few lines',
          }),
          new TextRun({ break: 1 }),
          new TextRun({
            text: 'This is my first paragraph, it contains a few lines2',
            style: 'title',
          }),
        ],
      }),
    ],
  }],
})

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync('./src/docx/demo-images2.docx', buffer)
})
