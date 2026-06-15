const user = getUser()

const initials = user.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()
document.getElementById('perfil-avatar').textContent  = initials
document.getElementById('perfil-name').textContent    = user.name
document.getElementById('perfil-ps').textContent      = user.ps.toLocaleString('pt-BR')
document.getElementById('perfil-streak').textContent  = user.streak
document.getElementById('stat-streak').textContent    = user.streak

const { current } = getLevelInfo(user.ps)
document.getElementById('perfil-level').textContent = current.name
document.getElementById('perfil-level').style.background = current.color + '30'
document.getElementById('perfil-level').style.color = current.color