const user = getUser()
document.getElementById('nav-ps').textContent = user.ps.toLocaleString('pt-BR') + ' PS'

const AVATAR_COLORS = ['#1B6DB8','#F5A623','#28A745','#7C3AED','#EC4899','#0EA5E9']

const RANKING_DATA = [
  { pos:1, name:'Ana Souza',      initials:'AS', ps:42500, level:'Mestre'   },
  { pos:2, name:'Carlos Mendes',  initials:'CM', ps:38200, level:'Mestre'   },
  { pos:3, name:'Beatriz Lima',   initials:'BL', ps:29700, level:'Guardião' },
  { pos:4, name:'João Ferreira',  initials:'JF', ps:22100, level:'Guardião' },
  { pos:5, name:'Maria Costa',    initials:'MC', ps:18400, level:'Guardião' },
  { pos:6, name: user.name,       initials: user.name.split(' ').map(n=>n[0]).join('').slice(0,2), ps: user.ps, level: getLevelInfo(user.ps).current.name, isUser: true },
].sort((a,b) => b.ps - a.ps).map((p,i) => ({ ...p, pos: i+1 }))

// Pódio
const podiumOrder = [RANKING_DATA[1], RANKING_DATA[0], RANKING_DATA[2]]
const podiumColors = ['#9AABB8','#F5A623','#CD7F32']
const podiumHeights = ['56px','80px','44px']
const podiumMedals  = ['🥈','🥇','🥉']

const podiumEl = document.getElementById('podium')
podiumOrder.forEach((p, i) => {
  podiumEl.innerHTML += `
    <div class="podium-item">
      <span style="font-size:18px">${podiumMedals[i]}</span>
      <div class="podium-avatar" style="background:${AVATAR_COLORS[p.pos-1]}">${p.initials}</div>
      <div class="podium-name">${p.name.split(' ')[0]}</div>
      <div class="podium-ps">${p.ps.toLocaleString('pt-BR')} PS</div>
      <div class="podium-base" style="height:${podiumHeights[i]}; background:${podiumColors[i]}">#${[2,1,3][i]}</div>
    </div>
  `
})

// Renderiza lista
function filterRanking() {
  const filter = document.getElementById('filter-level').value
  const list   = document.getElementById('ranking-list')
  list.innerHTML = ''

  const filtered = filter === 'all'
    ? RANKING_DATA
    : RANKING_DATA.filter(p => p.level === filter)

  filtered.forEach(p => {
    const row = document.createElement('div')
    row.className = `ranking-row ${p.isUser ? 'is-user' : ''}`
    row.innerHTML = `
        <div class="rank-pos">#${p.pos}</div>
        <div class="rank-avatar" style="background:${AVATAR_COLORS[(p.pos-1) % AVATAR_COLORS.length]}">${p.initials}</div>
        <div class="flex-fill">
            <div class="rank-name d-flex align-items-center gap-2">
                ${p.name}
                ${p.isUser ? '<span class="you-tag">você</span>' : ''}
            </div>
            <div class="rank-detail">${p.level}</div>
        </div>
        <div class="d-flex flex-column align-items-end gap-1">
            <div class="rank-ps">${p.ps.toLocaleString('pt-BR')} PS</div>
            ${!p.isUser ? `<button class="btn-batalhar" onclick="irBatalhar('${p.id}')">⚔️ Batalhar</button>` : ''}
        </div>
    `
    list.appendChild(row)
  })
}

filterRanking()

function irBatalhar(oppId) {
  window.location.href = `batalha.html?opp=${oppId}`
}