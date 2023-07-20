import * as fs from 'node:fs'
import { BorderStyle, Document, Footer, Header, HeadingLevel, HorizontalPositionAlign, HorizontalPositionRelativeFrom, IBorderOptions, ImageRun, Packer, Paragraph, SectionType, SymbolRun, TextRun, UnderlineType, VerticalPositionAlign, VerticalPositionRelativeFrom } from 'docx'

const doc = new Document({
  sections: [{
    properties: {
      titlePage: true, // To specify 'Different First Page', set titlePage: true in the sections array as shown below.
    },
    headers: {
      default: new Header({ // The standard default header on every page or header on odd pages when the 'Different Odd & Even Pages' option is activated
        children: [new Paragraph('Default header text')],
      }),
      first: new Header({ // The header on first page when the 'Different First Page' option is activated
        children: [new Paragraph('First page header text')],
      }),
      even: new Header({ // The header on even pages when the 'Different Odd & Even Pages' option is activated
        children: [new Paragraph('Even page header text')],
      }),
    },
    footers: {
      default: new Footer({ // The standard default footer on every page or footer on odd pages when the 'Different Odd & Even Pages' option is activated
        children: [new Paragraph('Default footer text')],
      }),
      first: new Footer({ // The footer on first page when the 'Different First Page' option is activated
        children: [new Paragraph('First page footer text')],
      }),
      even: new Footer({ // The footer on even pages when the 'Different Odd & Even Pages' option is activated
        children: [new Paragraph('Even page footer text')],
      }),
    },
    children: [],
  }],
})

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync('./src/docx/demo-headers&footers.docx', buffer)
})
