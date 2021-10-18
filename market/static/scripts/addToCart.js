const addToCartBtn = document.querySelector('.detail-infoCol-buyBtn')


addToCartBtn.addEventListener('click', (e) => {
  e.preventDefault()
  // conseguir id del producto de la url
  const pieces = window.location.href.split('/')
  const id = pieces[pieces.length-1]

  const title = document.querySelector('.detail-infoCol-title').innerText
  const price = parseInt(document.querySelector('.detail-infoCol-price').innerText.split('$')[1])
  const imgUrl = document.querySelector('.detail-imgCol img').src
  const qty = 1
  
  const product = JSON.stringify({id, title, price, imgUrl, qty})
  saveToSession(product)
})


function saveToSession(item) {
  if(sessionStorage.getItem('cart')) {
    let cart = JSON.parse(sessionStorage.getItem('cart'))
    
    const cartIds = []
    const newItem = JSON.parse(item)
    const newId = newItem.id // id de producto seleccionado

    cart.forEach((item) => { // crear lista de ids en carrito
      cartItem = JSON.parse(item)
      // cartItem = item
      id = cartItem.id
      cartIds.push(id)
    })

    if(cartIds.includes(newId)) {
      return // no agregar a carrito si ya había uno
    } else {
      cart.push(item)
      sessionStorage.setItem('cart', JSON.stringify(cart)) // agregar a carrito
    }

  } else {
    let cart = []
    cart.push(item)
    sessionStorage.setItem('cart', JSON.stringify(cart))
  }
}
