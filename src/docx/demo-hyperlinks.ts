import * as fs from 'node:fs'
import { Bookmark, BorderStyle, Document, ExternalHyperlink, Footer, Header, HeadingLevel, HorizontalPositionAlign, HorizontalPositionRelativeFrom, IBorderOptions, ImageRun, InternalHyperlink, Packer, PageReference, Paragraph, SectionType, SymbolRun, TextRun, UnderlineType, VerticalPositionAlign, VerticalPositionRelativeFrom } from 'docx'

const doc = new Document({
  sections: [{
    children: [
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [
          new Bookmark({
            id: 'anchorForChapter1',
            children: [
              new TextRun('Chapter 1'),
            ],
          }),
          new InternalHyperlink({
            children: [
              new TextRun({
                text: 'See Chapter 1',
                style: 'Hyperlink',
              }),
            ],
            anchor: 'anchorForChapter1',
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun('Chapter 1 can be seen on page '),
          new PageReference('anchorForChapter1'),
        ],
      }),
      // external hyperlink
      new Paragraph({
        children: [
          new ExternalHyperlink({
            children: [
              new TextRun({
                text: 'This is an external link!',
                style: 'Hyperlink',
              }),
            ],
            link: 'https://docx.js.org',
          }),
        ],
      }),
      new Paragraph({
        children: [
          new ExternalHyperlink({
            children: [
              new TextRun({
                text: 'This is a ',
                style: 'Hyperlink',
              }),
              new TextRun({
                text: 'bold',
                bold: true,
                style: 'Hyperlink',
              }),
              new TextRun({
                text: ' link!',
                style: 'Hyperlink',
              }),
            ],
            link: 'https://docx.js.org',
          }),
        ],
      }),
    ],
  }],
})

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync('./src/docx/demo-hyperlinks.docx', buffer)
})
