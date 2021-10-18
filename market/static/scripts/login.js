const form = document.querySelector('form')
const messageEl = document.querySelector('.login-message')
const userType = document.getElementById('userType')
const shopType = document.getElementById('shopType')
let loginType

form.addEventListener('submit', login)

userType.addEventListener('click', (e) => {
  userType.classList.add('active')
  shopType.classList.remove('active')
  loginType = 'user'
  console.log('logintype: ', loginType)
})

shopType.addEventListener('click', () => {
  userType.classList.remove('active')
  shopType.classList.add('active')
  loginType = 'shop'
  console.log('logintype: ', loginType)
})



async function login(e) {
  e.preventDefault()
  const email = form.email.value
  const password = form.password.value
  let invalid

  // Validaciones
  if(loginType === '') {
    console.log('loginType vacio: ', loginType)
    messageEl.classList.add('active')
    messageEl.innerText = 'Necesitas escoger un tipo de usuario'
    invalid = true
    return
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

  if(invalid == true) return


  try {
    const res = await fetch('/login',{
      method: 'POST',
      body: JSON.stringify({email, password, loginType}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await res.json()
    console.log('data: ', data)

    if(data.status == 200) {
      console.log('autenticado')
      document.cookie = `ezjwt=${data.token};max-age=${24*60*60}` // guardar token como cookie
      window.location.replace(data.redirectTo)

    } else {
      console.log('no autenticado')
      messageEl.classList.add('active') // mostrar mensaje
      messageEl.innerText = data
  
      setTimeout(() => { // borrar mensaje 2 segundos despues
        messageEl.classList.remove('active')
        messageEl.innerText = ''
      }, 2000)
    }

  } catch (error) {
    console.error(error)
  }


}