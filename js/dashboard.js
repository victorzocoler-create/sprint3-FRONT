const user = getUser()
if (!user) window.location.href = 'index.html'

// Inicializa estado do dia
if (!user.completedToday) user.completedToday = {}
if (!user.streakDays)     user.streakDays     = [true, true, true, true, true, false, false]

// Navbar
document.getElementById('nav-streak').textContent = `${user.streak} dias`
document.getElementById('nav-ps').textContent      = user.ps.toLocaleString('pt-BR') + ' PS'
document.getElementById('hero-name').textContent   = user.name.split(' ')[0]
document.getElementById('hero-streak').textContent = user.streak

// Level bar
const { current, next, pct } = getLevelInfo(user.ps)
document.getElementById('level-name').textContent    = current.name
document.getElementById('level-name').style.color    = current.color
document.getElementById('level-next').textContent    = next ? next.minPS.toLocaleString('pt-BR') + ' PS' : 'Nível máximo!'
document.getElementById('level-bar').style.width     = pct + '%'
document.getElementById('level-pct').textContent     = pct + '%'
document.getElementById('level-discount').textContent = current.discount
document.getElementById('level-benefit').textContent  = current.benefit

// Progress ring
const done  = Object.keys(user.completedToday).length
const total = CHALLENGES.length
const circ  = 2 * Math.PI * 26
document.getElementById('ring-done').textContent = done
setTimeout(() => {
  document.getElementById('progress-circle').style.strokeDashoffset = circ * (1 - done / total)
}, 100)

// Challenges
const list = document.getElementById('challenges-list')
CHALLENGES.forEach((c, i) => {
  const isDone = !!user.completedToday[c.id]
  const card   = document.createElement('div')
  card.className = `challenge-card ${isDone ? 'done' : ''}`
  card.style.animationDelay = `${i * 60}ms`
  card.style.borderLeftColor = isDone ? c.color : '#D6E4F0'
  card.style.background      = isDone ? c.bg : 'white'
  card.innerHTML = `
    <div class="challenge-icon" style="background:${c.bg}">${c.icon}</div>
    <div class="flex-fill">
      <div class="challenge-name" style="color:${isDone ? c.color : '#1A2B3C'}">${c.name}</div>
      <div class="challenge-desc">${c.desc}</div>
      <span class="challenge-cat" style="background:${c.bg}; color:${c.color}">${c.cat}</span>
    </div>
    <span class="challenge-ps" style="background:${c.bg}; color:${c.color}">+${c.ps} PS</span>
    <div class="check-circle ${isDone ? 'done' : ''}">
      ${isDone ? '✓' : '○'}
    </div>
  `
  card.addEventListener('click', () => toggleChallenge(c, card))
  list.appendChild(card)
})

function toggleChallenge(c, card) {
  const isDone = !!user.completedToday[c.id]
  if (isDone) {
    delete user.completedToday[c.id]
    user.ps = Math.max(0, user.ps - c.ps)
  } else {
    user.completedToday[c.id] = true
    user.ps += c.ps
  }
  saveUser(user)
  location.reload()
}

// Streak bar
const streakBar = document.getElementById('streak-bar')
WEEK_DAYS.forEach((day, i) => {
  const isToday = i === 5
  const isPast  = i < 5
  const isDone  = user.streakDays[i]
  const div     = document.createElement('div')
  div.className = `streak-day ${isToday ? 'today' : isPast && isDone ? 'past' : 'future'}`
  div.innerHTML = `<span>${isToday ? '⚡' : isPast && isDone ? '✓' : '·'}</span><span>${day}</span>`
  streakBar.appendChild(div)
})

// Badges
const grid = document.getElementById('badges-grid')
BADGES.forEach(b => {
  const div = document.createElement('div')
  div.className = `badge-item ${b.unlocked ? 'unlocked' : 'locked'}`
  div.innerHTML = `<span class="badge-icon">${b.icon}</span><span class="badge-name">${b.name}</span>`
  grid.appendChild(div)
})