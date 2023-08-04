const file = document.getElementById('file')
const txt = document.getElementById('txt')
const img = document.getElementById('img')

file.addEventListener('change', (e) => {
  // arrayBuffer zip
  file.files[0].arrayBuffer().then(async (buffer) => {
    const u8 = new Uint8Array(buffer)
    // eslint-disable-next-line no-undef
    const zip = fflate.unzipSync(u8)
    const imgbuffer = zip['images/test1.jpg']
    const imgblob = new Blob([imgbuffer], { type: 'image/png' })
    img.src = URL.createObjectURL(imgblob)

    const txtbuffer = zip['Hello.txt']
    const txtblob = new Blob([txtbuffer], { type: 'text/plain' })
    txt.innerText = await txtblob.text()

    console.log(zip)
  })
})
