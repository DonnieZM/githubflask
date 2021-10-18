const stripe = Stripe('pk_test_51JjPWsJkRyrBj4D7z2JknCLkkUfveFXhMRcOsf9F2BwyUgM6uE5d5WyrgLZIeAUtSryyEA0IKME64nP007EFgFHQ00AVR2j2GI')
// const cart = JSON.parse(sessionStorage.getItem('cart'))
const totalDiv = document.querySelector('.cart-footer-total')
const buyBtn = document.querySelector('.cart-footer-payBtn')

function buildCart() {
  const cart = JSON.parse(sessionStorage.getItem('cart'))
  const cartBody = document.querySelector('.cart-body')
  let total = 0
  cartBody.innerHTML = ''

  cart.forEach((item) => {
    const cartItem = JSON.parse(item)
    // const cartItem = item
    const id = cartItem.id
    const title = cartItem.title
    const price = cartItem.price
    const imgUrl = cartItem.imgUrl
    const qty = cartItem.qty
  
    const itemEl = document.createElement('div')
    itemEl.classList.add('cart-item')
    itemEl.setAttribute('id', id)
    const imgContainerEl = document.createElement('div')
    imgContainerEl.classList.add('cart-item-img')
    const imgEl = document.createElement('img')
    imgEl.src = imgUrl
    const infoEl = document.createElement('div')
    infoEl.classList.add('cart-item-info')
    const titleEl = document.createElement('div')
    titleEl.classList.add('cart-item-info-title')
    titleEl.innerText = title
    const qtyEl = document.createElement('div')
    qtyEl.classList.add('cart-item-info-qty')
    const plusEl = document.createElement('i')
    plusEl.classList.add('fas', 'fa-plus-circle')
    const numberEl = document.createElement('div')
    numberEl.classList.add('number')
    numberEl.innerText = qty
    const minusEl = document.createElement('i')
    minusEl.classList.add('fas', 'fa-minus-circle')
    const priceEl = document.createElement('div')
    priceEl.classList.add('cart-item-price')
    priceEl.innerText = `$${price * qty}`
    const deleteEl = document.createElement('div')
    deleteEl.classList.add('cart-item-delete')
    const delBtn = document.createElement('button')
    delBtn.innerText = 'Eliminar'
  
    cartBody.appendChild(itemEl)
    itemEl.appendChild(imgContainerEl)
    imgContainerEl.appendChild(imgEl)
    itemEl.appendChild(infoEl)
    infoEl.appendChild(titleEl)
    infoEl.appendChild(qtyEl)
    qtyEl.appendChild(plusEl)
    qtyEl.appendChild(numberEl)
    qtyEl.appendChild(minusEl)
    itemEl.appendChild(priceEl)
    itemEl.appendChild(deleteEl)
    deleteEl.appendChild(delBtn)
  
    plusEl.addEventListener('click', (e) => {
      const target = e.target.parentElement.parentElement.parentElement
      const id = target.id
      const operation = 'plus'
      changeQty(id, operation)
    })

    minusEl.addEventListener('click', (e) => {
      const target = e.target.parentElement.parentElement.parentElement
      const id = target.id
      const operation = 'minus'
      changeQty(id, operation)
    })

    const extPrice = price * qty
    total += extPrice
  })
  totalDiv.innerText = `$${total}`
}



function changeQty(id, operation) {
  const chCart = JSON.parse(sessionStorage.getItem('cart'))
  let newCart = []
  console.log('id: ', id)

  chCart.forEach((item) => {
    // console.log('item: ', item)
    // console.log('item id: ', item.id)

    const cartItem = JSON.parse(item)
    const cartItemId = cartItem.id

    // console.log('cartItem: ', cartItem)
    // console.log('cartItemId: ', cartItem.id)
    
    if(cartItemId === id) {
      if(operation == 'plus') {
        cartItem.qty++
      } else {
        if(cartItem.qty > 1) {
          console.log('mayor a uno')
          cartItem.qty--
        } else {
          console.log('menor a uno, abortar')
        }
      }
    }

    const newProduct = JSON.stringify(cartItem)
    newCart.push(newProduct)
  })

  // sessionStorage.setItem('newcart', JSON.stringify(newCart))
  sessionStorage.setItem('cart', JSON.stringify(newCart))
  buildCart()
}


function buy(e) {
  e.preventDefault()
  console.log('buy')

  fetch('/create-checkout-session', {
    method: 'POST',
    // body: JSON.stringify({ id }),
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  .then (function(res) {
    console.log('res: ', res)
    return res.json()
  })
  .then (function(session) {
    return stripe.redirectToCheckout({ sessionId: session.id})
  })
}

buyBtn.addEventListener('click', buy)

buildCart()