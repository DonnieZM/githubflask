const productSection = document.querySelector('.products');
const productContainer = document.querySelector('.products .container');
const catList = document.querySelector('.catNav-links');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const cogBtn = document.getElementById('cogBtn');
const modal = document.querySelector('.modal');
const closeModal = document.getElementById('closeModal');
const imgInput = document.getElementById('imgInput');
const imgForm = document.querySelector('.modal-photoContainer');
const cogSearch = document.getElementById('cogSearch');

async function getProducts() {
  try {
    const res = await fetch('/products');
    const products = await res.json();
    buildProducts(products);
    return;
  } catch (error) {
    console.error(error);
  }
}

async function searchProducts() {
  const search = searchInput.value;

  try {
    const res = await fetch('/products', {
      method: 'POST',
      body: JSON.stringify({ search }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const products = await res.json();
    buildProducts(products);
    return;
  } catch (error) {
    console.error(error);
  }
}

cogBtn.addEventListener('click', () => {
  modal.style.display = 'flex';
});

async function getByCat(e) {
  const cats = document.querySelectorAll('.catNav-links-item');
  cats.forEach((cat) => cat.classList.remove('active'));
  // productContainer.innerHTML = ''
  const cat = e.innerText;
  e.classList.add('active');

  try {
    const res = await fetch(`products?category=${cat}`);
    const products = await res.json();
    buildProducts(products);
    return;
  } catch (error) {
    console.error(error);
  }
}

function buildProducts(products) {
  productContainer.innerHTML = '';
  products.forEach((product) => {
    const productEl = document.createElement('div');
    productEl.classList.add('products-item');
    productEl.setAttribute('id', product.id);
    const photoDiv = document.createElement('div');
    photoDiv.classList.add('products-item-photo');
    const imgDiv = document.createElement('img');
    imgDiv.src = `/static/uploads/${product.image}`;
    photoDiv.appendChild(imgDiv);
    const infoDiv = document.createElement('div');
    infoDiv.classList.add('products-item-info');
    const titleEl = document.createElement('h4');
    titleEl.classList.add('products-item-info-title');
    titleEl.innerText = product.name;
    const priceEl = document.createElement('p');
    priceEl.classList.add('products-item-info-price');
    priceEl.innerText = '$' + product.price;

    infoDiv.appendChild(titleEl);
    infoDiv.appendChild(priceEl);

    productEl.appendChild(photoDiv);
    productEl.appendChild(infoDiv);

    productEl.addEventListener('click', redirectToDetail);

    productContainer.appendChild(productEl);
  });
}

function redirectToDetail(e) {
  const prodId = e.target.parentElement.parentElement.getAttribute('id');
  document.cookie = 'prodId=' + prodId;
  window.location.href = `products/${prodId}`;
}

imgInput.addEventListener('change', async (e) => {
  e.preventDefault();
  if (imgForm.image.value === '') {
    console.log('is empty');
    return;
  } else {
    try {
      const formdata = new FormData();
      formdata.append('image', imgInput.files[0]);
      const res = await fetch('/upload-cogImage', {
        method: 'POST',
        body: formdata,
      });
      const data = await res.json();
      imgForm.style.backgroundImage = `url('/static/uploads/${data}')`;
    } catch (error) {
      console.error(error);
    }
  }
});

searchBtn.addEventListener('click', searchProducts);

cogSearch.addEventListener('click', async (e) => {
  e.preventDefault();
  try {
    const formdata = new FormData();
    formdata.append('image', imgInput.files[0]);
    const res = await fetch('/cognitivo');
    const products = await res.json();
    modal.style.display = 'none';
    buildProducts(products);
    console.log('products: ', data);
  } catch (error) {
    console.error(error);
  }
});

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

getProducts();
