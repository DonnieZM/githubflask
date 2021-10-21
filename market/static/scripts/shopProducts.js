const addBtn = document.getElementById('addProduct')
let selectedId

addBtn.addEventListener('click', () => {
  console.log('shop id: ', shop.id)
})


async function getProducts() {
  const pieces = window.location.href.split('/')
  const id = pieces[pieces.length-2]

  try {
    const res = await fetch(`/shop/${id}/getproducts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await res.json()
    console.log('data: ', data)
    const products = data.products
    const productsEl = document.querySelector('.shop-products')
    products.forEach((product) => {
      console.log('product name: ', product.name)
      const itemEl = document.createElement('div')
      itemEl.classList.add('shop-products-item')
      itemEl.setAttribute('id', product.id)
      const photoEl = document.createElement('div')
      photoEl.classList.add('shop-products-item-photo')
      itemEl.appendChild(photoEl)
      const imgEl = document.createElement('img')
      imgEl.src = `/static/uploads/${product.image}`
      photoEl.appendChild(imgEl)
      const infoEl = document.createElement('div')
      infoEl.classList.add('shop-products-item-info')
      itemEl.appendChild(infoEl)
      const rowEl = document.createElement('div')
      rowEl.classList.add('row')
      infoEl.appendChild(rowEl)
      const nameEl = document.createElement('div')
      nameEl.classList.add('shop-products-item-name')
      nameEl.innerText = product.name
      rowEl.appendChild(nameEl)
      const priceEl = document.createElement('div')
      priceEl.classList.add('shop-products-item-price')
      priceEl.innerText = `$${product.price}`
      rowEl.appendChild(priceEl)
      const descEl = document.createElement('p')
      descEl.classList.add('shop-products-item-description')
      descEl.innerText = product.description
      infoEl.appendChild(descEl)
      const buttonsEl = document.createElement('div')
      buttonsEl.classList.add('shop-products-item-buttons')
      infoEl.appendChild(buttonsEl)
      const editEl = document.createElement('button')
      editEl.classList.add('shopBtn')
      editEl.id = 'editBtn'
      editEl.innerText = 'Editar'
      buttonsEl.appendChild(editEl)
      const deleteEl = document.createElement('button')
      deleteEl.classList.add('shopBtn')
      deleteEl.id = 'deleteBtn'
      deleteEl.innerText = 'Eliminar'
      deleteEl.addEventListener('click', deleteItem)
      buttonsEl.appendChild(deleteEl)
      productsEl.appendChild(itemEl)
    })


  } catch (error) {
    console.error(error)
  }
}

function deleteItem(e) {
  const parent = e.target.parentElement.parentElement.parentElement
  selectedId = parent.getAttribute('id')
  const alertEl = document.createElement('div')
  alertEl.classList.add('item-alert')
  const textEl = document.createElement('p')
  textEl.classList.add('item-alert-text')
  textEl.innerText = '¿Estás seguro que deseas eliminar este producto?'
  const rowEl = document.createElement('div')
  rowEl.classList.add('row')
  const yesEl = document.createElement('button')
  yesEl.classList.add('alertBtn')
  yesEl.innerText = 'Sí'
  const noEl = document.createElement('button')
  noEl.classList.add('alertBtn')
  noEl.innerText = 'No'
  yesEl.addEventListener('click', confirmDelete)
  noEl.addEventListener('click', cancelDelete)
  alertEl.appendChild(textEl)
  alertEl.appendChild(rowEl)
  rowEl.appendChild(yesEl)
  rowEl.appendChild(noEl)
  parent.appendChild(alertEl)
  console.log('selected id: ', selectedId)
}

async function confirmDelete(e) {
  console.log('confirmDelete')
  e.preventDefault()
  const id = selectedId

  try {
    const res = await fetch('/shop/product', {
      method: 'DELETE',
      body: JSON.stringify({id}),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await res.json()
    console.log('data: ', data)
    location.reload()
    
  } catch (error) {
    console.error(error)
  }
}

function cancelDelete(e) {
  logEvent('cancelDeleteProduct')
  const parent = e.target.parentElement.parentElement
  parent.remove() 
}


async function logEvent(eventName) {
  console.log(eventName)
  try {
    const res = await fetch('/event', {
      method: 'POST', 
      body: JSON.stringify({eventName}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await res.json()

  } catch (error) {
    console.error(error)
  }
}




getProducts()