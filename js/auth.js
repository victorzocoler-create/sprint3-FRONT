// Cor selecionada no cadastro
let selectedColor = '#4FACDE'

// Alterna entre as abas Login e Cadastro
function showTab(tab) {
  const formLogin    = document.getElementById('form-login')
  const formRegister = document.getElementById('form-register')
  const tabLogin     = document.getElementById('tab-login')
  const tabRegister  = document.getElementById('tab-register')

  if (tab === 'login') {
    formLogin.classList.remove('hidden')
    formRegister.classList.add('hidden')
    tabLogin.classList.add('active')
    tabRegister.classList.remove('active')
  } else {
    formLogin.classList.add('hidden')
    formRegister.classList.remove('hidden')
    tabLogin.classList.remove('active')
    tabRegister.classList.add('active')
  }
}

// Seleciona cor do pet
function selectColor(btn) {
  document.querySelectorAll('.color-option').forEach(b => b.classList.remove('selected'))
  btn.classList.add('selected')
  selectedColor = btn.dataset.color
}

// Login
function handleLogin(event) {
  event.preventDefault()
  const email    = document.getElementById('login-email').value.trim()
  const password = document.getElementById('login-password').value
  const errorEl  = document.getElementById('login-error')

  const users = JSON.parse(localStorage.getItem('cp_users') || '[]')
  const user  = users.find(u => u.email === email && u.password === password)

  if (!user) {
    errorEl.classList.remove('hidden')
    return
  }

  errorEl.classList.add('hidden')
  localStorage.setItem('cp_logged', JSON.stringify(user))
  window.location.href = 'dashboard.html'
}

// Cadastro
function handleRegister(event) {
  event.preventDefault()
  const name     = document.getElementById('reg-name').value.trim()
  const email    = document.getElementById('reg-email').value.trim()
  const password = document.getElementById('reg-password').value
  const petName  = document.getElementById('reg-pet-name').value.trim()
  const errorEl  = document.getElementById('register-error')

  const users = JSON.parse(localStorage.getItem('cp_users') || '[]')

  if (users.find(u => u.email === email)) {
    errorEl.classList.remove('hidden')
    return
  }

  const newUser = { name, email, password, petName, petColor: selectedColor, ps: 9200, streak: 5 }
  users.push(newUser)
  localStorage.setItem('cp_users', JSON.stringify(users))
  localStorage.setItem('cp_logged', JSON.stringify(newUser))

  window.location.href = 'dashboard.html'
}

// Redireciona se já estiver logado
if (localStorage.getItem('cp_logged')) {
  window.location.href = 'dashboard.html'
}