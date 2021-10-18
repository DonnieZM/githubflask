const productSection = document.querySelector('.products')
const productContainer = document.querySelector('.products .container')
const catList = document.querySelector('.catNav-links')

async function getProducts() {
  try {
    const res = await fetch('/products')
    const products = await res.json()
    buildProducts(products)
    return 

  } catch (error) {
    console.error(error)
  }
}

async function getByCat(e) {
  const cats = document.querySelectorAll('.catNav-links-item')
  cats.forEach(cat => cat.classList.remove('active'))
  productContainer.innerHTML = ''
  const cat = e.innerText
  e.classList.add('active')

  try {
    const res = await fetch(`products?category=${cat}`)
    const products = await res.json()
    buildProducts(products)
    return

  } catch (error) {
    console.error(error)
  }
}

function buildProducts(products) {
  products.forEach((product) => {
    const productEl = document.createElement('div')
    productEl.classList.add('products-item')
    productEl.setAttribute('id', product.id)
    const photoDiv = document.createElement('div')
    photoDiv.classList.add('products-item-photo')
    const imgDiv = document.createElement('img')
    imgDiv.src = `/static/uploads/${product.image}`
    photoDiv.appendChild(imgDiv)
    const infoDiv = document.createElement('div')
    infoDiv.classList.add('products-item-info')
    const titleEl = document.createElement('h4')
    titleEl.classList.add('products-item-info-title')
    titleEl.innerText = product.name
    const priceEl = document.createElement('p')
    priceEl.classList.add('products-item-info-price')
    priceEl.innerText = '$' + product.price

    infoDiv.appendChild(titleEl)
    infoDiv.appendChild(priceEl)

    productEl.appendChild(photoDiv)
    productEl.appendChild(infoDiv)

    productEl.addEventListener('click', redirectToDetail)

    productContainer.appendChild(productEl)
  })
}

function redirectToDetail(e) {
  const prodId = e.target.parentElement.parentElement.getAttribute('id')
  document.cookie = 'prodId='+prodId
  window.location.href = `products/${prodId}`
}

getProducts()

