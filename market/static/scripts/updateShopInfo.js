const shopForm = document.querySelector('.shop-form');
const updateBtn = document.getElementById('updateBtn');
const messageEl = document.querySelector('.shop-message');

updateBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  const pieces = window.location.href.split('/');
  const id = pieces[pieces.length - 1];

  const name = shopForm.name.value;
  const email = shopForm.email.value;
  const password = shopForm.password.value;

  if (name === '' && (email === '') & (password === '')) {
    console.log('todos los campos vacios');
    messageEl.classList.add('active');
    messageEl.innerText = 'No hay cambios que guardar';

    setTimeout(() => {
      // borrar mensaje 2 segundos despues
      messageEl.classList.remove('active');
      messageEl.innerText = '';
    }, 2000);

    return;
  }

  try {
    const res = await fetch(`/shop/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    location.reload();
  } catch (error) {
    console.error(error);
  }
});
