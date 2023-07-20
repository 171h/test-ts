import * as fs from 'node:fs'
import { BorderStyle, Document, Footer, Header, HeadingLevel, HorizontalPositionAlign, HorizontalPositionRelativeFrom, IBorderOptions, ImageRun, Packer, Paragraph, SectionType, SymbolRun, TextRun, UnderlineType, VerticalPositionAlign, VerticalPositionRelativeFrom } from 'docx'

const doc = new Document({
  sections: [{
    children: [
      new Paragraph({
        children: [
          new ImageRun({
            data: fs.readFileSync('./src/docx/demo.jpg'),
            transformation: {
              width: 150,
              height: 150,
            },
          }),
          new ImageRun({
            data: fs.readFileSync('./src/docx/demo.jpg'),
            transformation: {
              width: 200,
              height: 200,
            },
            floating: {
              horizontalPosition: {
                offset: 1014400,
              },
              verticalPosition: {
                offset: 1014400,
              },
            },
          }),
        ],
      }),
      new Paragraph({
        children: [
          new ImageRun({
            data: fs.readFileSync('./src/docx/demo.jpg'),
            transformation: {
              width: 100,
              height: 100,
            },
            altText: {
              title: 'This is an ultimate title',
              description: 'This is an ultimate image',
              name: 'My Ultimate Image',
            },
          }),
        ],
      }),
      new Paragraph({
        children: [
          new ImageRun({
            data: fs.readFileSync('./src/docx/demo.jpg').toString('base64'),
            transformation: {
              width: 100,
              height: 100,
            },
          }),
        ],
      }),
      new Paragraph({
        children: [
          new ImageRun({
            data: fs.readFileSync('./src/docx/demo.jpg'),
            transformation: {
              width: 100,
              height: 100,
              flip: {
                vertical: true,
              },
            },
          }),
        ],
      }),
      new Paragraph({
        children: [
          new ImageRun({
            data: fs.readFileSync('./src/docx/demo.jpg'),
            transformation: {
              width: 150,
              height: 150,
              flip: {
                horizontal: true,
              },
              rotation: 225,
            },
          }),
        ],
      }),
      new Paragraph({
        children: [
          new ImageRun({
            data: fs.readFileSync('./src/docx/demo.jpg'),
            transformation: {
              width: 200,
              height: 200,
              flip: {
                horizontal: true,
                vertical: true,
              },
            },
          }),
        ],
      }),
      new Paragraph({
        children: [
          new ImageRun({
            data: fs.readFileSync('./src/docx/demo.jpg'),
            transformation: {
              width: 200,
              height: 200,
              rotation: 45,
            },
            floating: {
              zIndex: 10,
              horizontalPosition: {
                offset: 1014400,
              },
              verticalPosition: {
                offset: 1014400,
              },
            },
          }),
        ],
      }),
      new Paragraph({
        children: [
          new ImageRun({
            data: fs.readFileSync('./src/docx/demo.jpg'),
            transformation: {
              width: 200,
              height: 200,
            },
            floating: {
              zIndex: 5,
              horizontalPosition: {
                relative: HorizontalPositionRelativeFrom.PAGE,
                align: HorizontalPositionAlign.RIGHT,
              },
              verticalPosition: {
                relative: VerticalPositionRelativeFrom.PAGE,
                align: VerticalPositionAlign.BOTTOM,
              },
            },
          }),
        ],
      }),
    ],
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            children: [
              new ImageRun({
                data: fs.readFileSync('./src/docx/demo.jpg'),
                transformation: {
                  width: 100,
                  height: 100,
                },
              }),
            ],
          }),
        ],
      }),
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            children: [
              new ImageRun({
                data: fs.readFileSync('./src/docx/demo.jpg'),
                transformation: {
                  width: 100,
                  height: 100,
                },
              }),
            ],
          }),
        ],
      }),
    },
  }],
})

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync('./src/docx/demo-images.docx', buffer)
})
