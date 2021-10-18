const form = document.querySelector('.shop-form')
const imgForm = document.querySelector('.imgForm')
const imgContainer = document.querySelector('.shop-fileForm-imgContainer')
const imgInput = document.getElementById('imgInput')
const imgNameInput = document.getElementById('imgNameInput')
const displayImg = document.getElementById('displayImg')

form.addEventListener('submit', async(e) => {
  e.preventDefault()
  const pieces = window.location.href.split('/')
  const id = pieces[pieces.length-2]

  const name = form.name.value
  const price = form.price.value
  const description = form.description.value
  const category = 1
  const image = form.imgName.value

  try {
    const res = await fetch(`/shop/${id}/product`, {
      method: 'POST',
      body: JSON.stringify({name, price, description, category, image}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await res.json()
    window.location.replace(`/shop/${id}/products`)

  } catch (error) {
    console.error(error)
  }
})


imgInput.addEventListener('change', async(e) => {
  e.preventDefault()
  if (imgForm.image.value === '') {
    console.log('is empty')
    return

  } else {
    
    try {
      const formdata = new FormData()
      formdata.append('image', imgInput.files[0])
      const res = await fetch('/upload-image', {
        method: 'POST',
        body: formdata
      })
      const data = await res.json()
      imgNameInput.value = data
      imgContainer.style.backgroundImage = `url('/static/uploads/${data}')`

    } catch (error) {
      console.error(error)
    }
  }
})



