const form = document.querySelector('form')
const messageEl = document.querySelector('.login-message')
const userType = document.getElementById('userType')
const shopType = document.getElementById('shopType')
let loginType

form.addEventListener('submit', signup)

userType.addEventListener('click', (e) => {
  userType.classList.add('active')
  shopType.classList.remove('active')
  loginType = 'user'
  console.log('logintype: ', loginType)
})

shopType.addEventListener('click', (e) => {
  userType.classList.remove('active')
  shopType.classList.add('active')
  loginType = 'shop'
  console.log('logintype: ', loginType)
})

async function signup(e) {
  e.preventDefault()
  const username = form.username.value 
  const email = form.email.value
  const password = form.password.value
  const confirm = form.confirmPassword.value
  let invalid

  // Validaciones
  if(loginType === '') {
    console.log('loginType vacio: ', loginType)
    messageEl.classList.add('active')
    messageEl.innerText = 'Necesitas escoger un tipo de usuario'
    invalid = true
    return
  } 

  if(username.length === 0) {
    messageEl.classList.add('active')
    messageEl.innerText = 'Necesitas llenar todos los campos'
    form.username.style.borderColor = 'red'
    invalid = true

    setTimeout(() => {
      messageEl.classList.remove('active')
      messageEl.innerText = ''
      form.username.style.borderColor = 'transparent'
    }, 2000)
  }

  if(email.length === 0) {
    messageEl.classList.add('active')
    messageEl.innerText = 'Necesitas llenar todos los campos'
    form.email.style.borderColor = 'red'
    invalid = true

    setTimeout(() => {
      messageEl.classList.remove('active')
      messageEl.innerText = ''
      form.email.style.borderColor = 'transparent'
    }, 2000)
  }

  if(password.length === 0) {
    messageEl.classList.add('active')
    messageEl.innerText = 'Necesitas llenar todos los campos'
    form.password.style.borderColor = 'red'
    invalid = true

    setTimeout(() => {
      messageEl.classList.remove('active')
      messageEl.innerText = ''
      form.password.style.borderColor = 'transparent'
    }, 2000)
  }

  if(password !== confirm) {
    messageEl.classList.add('active')
    messageEl.innerText = 'Por favor revisa tu contraseña nuevamente'
    form.password.style.borderColor = 'red'
    form.confirmPassword.style.borderColor = 'red'
    invalid = true

    setTimeout(() => {
      messageEl.classList.remove('active')
      messageEl.innerText = ''
      form.password.style.borderColor = 'transparent'
      form.confirmPassword.style.borderColor = 'transparent'
    }, 2000)
  }

  if(invalid == true) return

  try {
    console.log(email, username, password)
    const res = await fetch('/signup',{
      method: 'POST',
      body: JSON.stringify({email, username, password, loginType}),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await res.json() // Recibir token con id de usuario
    console.log('data: ', data)
    document.cookie = `ezjwt=${data.token};max-age=${24*60*60}` // guardar token como cookie
    window.location.replace(data.redirectTo)

  } catch (error) {
    console.error(error)
  }
}

