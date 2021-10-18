const getCookie = (name) => {
  const cookies = document.cookie.split(';')
  for (let i = 0; i < cookies.length; i++) {
      let c = cookies[i].trim().split('=')
      if (c[0] === name) {
          return c[1];
      }
  }
  return
}

const productId = getCookie('prodId')

async function getProductById(id) {
  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`)
    const product = await res.json()

    buildProduct(product)

  } catch (error) {
    console.error(error)
  }
}

function buildProduct(product) {
  const imgCol = document.querySelector('.detail-imgCol')
  const imgEl = document.createElement('img')
  imgEl.src = product.image
  imgCol.appendChild(imgEl)

  document.querySelector('.detail-infoCol-title').innerText = product.title
  document.querySelector('.detail-infoCol-price').innerText = '$' + product.price
  document.querySelector('.detail-infoCol-description').innerText = product.description
}

getProductById(productId)