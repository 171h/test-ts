const file = document.getElementById('file')
const txt = document.getElementById('txt')
const img = document.getElementById('img')

file.addEventListener('change', (e) => {
  // text
  // file.files[0].text().then((text) => {
  //   txt.innerText = text
  // })
  // arrayBuffer img
  // file.files[0].arrayBuffer().then((buffer) => {
  //   const blob = new Blob([buffer], { type: 'image/png' })
  //   const url = URL.createObjectURL(blob)
  //   img.src = url
  // })

  // arrayBuffer zip
  file.files[0].arrayBuffer().then(async (buffer) => {
    // eslint-disable-next-line no-undef
    const data2 = await JSZip.loadAsync(buffer)
    console.log(data2)
    const imgbuffer = data2.files['images/test1.jpg']._data.compressedContent
    const imgblob = new Blob([imgbuffer], { type: 'image/png' })
    img.src = URL.createObjectURL(imgblob)

    const txtbuffer = data2.files['Hello.txt']._data.compressedContent
    const txtblob = new Blob([txtbuffer], { type: 'text/plain' })
    txt.innerText = await txtblob.text()
  })
})
