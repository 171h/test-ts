const file = document.getElementById('file')
const txt = document.getElementById('txt')
const img = document.getElementById('img')

file.addEventListener('change', (e) => {
  // arrayBuffer zip
  file.files[0].arrayBuffer().then(async (buffer) => {
    const massiveFile = new Uint8Array(buffer)
    // eslint-disable-next-line no-undef
    const massiveAgain = fflate.unzlibSync(massiveFile)

    // console.log(data2)
    // // const imgbuffer = data2.files['images/test1.jpg']._data.compressedContent
    // const imgbuffer = await data2.files['images/test1.jpg'].async('arraybuffer')
    // const imgblob = new Blob([imgbuffer], { type: 'image/png' })
    // img.src = URL.createObjectURL(imgblob)

    // // const txtbuffer = data2.files['Hello.txt']._data.compressedContent
    // const txtbuffer = await data2.files['Hello.txt'].async('string')
    // const txtblob = new Blob([txtbuffer], { type: 'text/plain' })
    // txt.innerText = await txtblob.text()
  })
})
