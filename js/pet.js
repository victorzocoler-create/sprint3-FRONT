const user = getUser()

if (!user.pet) {
  user.pet = { hunger: 100, hygiene: 100, happiness: 100, energy: 100, lastTick: Date.now() }
  saveUser(user)
}

const ACTIONS = [
  { id:'feed',    label:'Alimentar', stat:'hunger',    boost:30, cost:50,  icon:'🍎', desc:'+30 Fome',     color:'#EF4444', bg:'#FEF2F2' },
  { id:'bath',    label:'Dar Banho', stat:'hygiene',   boost:35, cost:60,  icon:'🛁', desc:'+35 Higiene',  color:'#0EA5E9', bg:'#E0F4FD' },
  { id:'play',    label:'Brincar',   stat:'happiness', boost:25, cost:40,  icon:'🎾', desc:'+25 Alegria',  color:'#F5A623', bg:'#FEF6E7' },
  { id:'sleep',   label:'Dormir',    stat:'energy',    boost:40, cost:30,  icon:'💤', desc:'+40 Energia',  color:'#7C3AED', bg:'#F3F0FF' },
  { id:'treat',   label:'Petisco',   stat:'happiness', boost:40, cost:80,  icon:'🍬', desc:'+40 Alegria',  color:'#EC4899', bg:'#FDF2F8' },
  { id:'vitamin', label:'Vitamina',  stat:'hunger',    boost:50, cost:120, icon:'💊', desc:'+50 Fome',     color:'#28A745', bg:'#EAF6ED' },
]

// Decay desde último tick
const elapsed = (Date.now() - (user.pet.lastTick || Date.now())) / 1000 / 60
const decay   = Math.min(elapsed * 0.5, 40)
user.pet.hunger    = Math.max(0, user.pet.hunger    - decay)
user.pet.hygiene   = Math.max(0, user.pet.hygiene   - decay * 0.6)
user.pet.happiness = Math.max(0, user.pet.happiness - decay * 0.4)
user.pet.energy    = Math.max(0, user.pet.energy    - decay * 0.3)
user.pet.lastTick  = Date.now()
saveUser(user)

const petColor = user.petColor || '#4FACDE'

function updatePetUI() {
  const p   = user.pet
  const avg = (p.hunger + p.hygiene + p.happiness + p.energy) / 4
  const mood = avg > 70 ? 'happy' : avg > 40 ? 'neutral' : avg > 20 ? 'sad' : 'sick'

  const moodText  = { happy:'😄 Feliz e saudável!', neutral:'😐 Precisando de atenção', sad:'😢 Está tristinho...', sick:'🤒 Está doentinho!' }
  const moodColor = { happy:'#28A745', neutral:'#F5A623', sad:'#EF4444', sick:'#EF4444' }

  document.getElementById('pet-name').textContent  = user.petName || 'Bolinha'
  document.getElementById('pet-ps').textContent    = user.ps.toLocaleString('pt-BR') + ' PS'
  document.getElementById('nav-ps').textContent    = user.ps.toLocaleString('pt-BR') + ' PS'
  document.getElementById('pet-mood').textContent  = moodText[mood]
  document.getElementById('pet-mood').style.color  = moodColor[mood]

  setBar('hunger',    p.hunger)
  setBar('hygiene',   p.hygiene)
  setBar('happiness', p.happiness)
  setBar('energy',    p.energy)

  drawPet(mood)
}

function setBar(stat, value) {
  const pct = Math.round(value)
  document.getElementById(`val-${stat}`).textContent = pct + '%'
  const bar = document.getElementById(`bar-${stat}`)
  bar.style.width = pct + '%'
  bar.style.background = pct > 60 ? bar.style.background : pct > 30 ? '#F5A623' : '#EF4444'
}

function drawPet(mood) {
  const belly = lightenColor(petColor)
  const cheek = '#FF8FAB'

  const eyes = {
    happy:   `<ellipse cx="82" cy="108" rx="7" ry="8" fill="#1A2B3C"/><ellipse cx="118" cy="108" rx="7" ry="8" fill="#1A2B3C"/><ellipse cx="84" cy="106" rx="2.5" ry="3" fill="white"/><ellipse cx="120" cy="106" rx="2.5" ry="3" fill="white"/>`,
    neutral: `<ellipse cx="82" cy="110" rx="7" ry="7" fill="#1A2B3C"/><ellipse cx="118" cy="110" rx="7" ry="7" fill="#1A2B3C"/><ellipse cx="84" cy="108" rx="2.5" ry="2.5" fill="white"/><ellipse cx="120" cy="108" rx="2.5" ry="2.5" fill="white"/>`,
    sad:     `<path d="M75 110 Q82 118 89 110" stroke="#1A2B3C" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M111 110 Q118 118 125 110" stroke="#1A2B3C" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
    sick:    `<path d="M76 107 L88 113M76 113 L88 107" stroke="#1A2B3C" stroke-width="2.5" stroke-linecap="round"/><path d="M112 107 L124 113M112 113 L124 107" stroke="#1A2B3C" stroke-width="2.5" stroke-linecap="round"/>`,
  }

  const mouths = {
    happy:   `<path d="M88 128 Q100 140 112 128" stroke="#1A2B3C" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
    neutral: `<path d="M90 130 Q100 130 110 130" stroke="#1A2B3C" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    sad:     `<path d="M88 135 Q100 125 112 135" stroke="#1A2B3C" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
    sick:    `<path d="M88 135 Q100 125 112 135" stroke="#1A2B3C" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
  }

  document.getElementById('pet-svg').innerHTML = `
    <ellipse cx="100" cy="210" rx="55" ry="10" fill="rgba(0,0,0,0.08)"/>
    <ellipse cx="100" cy="145" rx="60" ry="65" fill="${petColor}"/>
    <ellipse cx="100" cy="158" rx="36" ry="40" fill="${belly}" opacity="0.7"/>
    <ellipse cx="52" cy="88" rx="18" ry="22" fill="${petColor}" transform="rotate(-15 52 88)"/>
    <ellipse cx="52" cy="88" rx="10" ry="13" fill="${belly}" opacity="0.6" transform="rotate(-15 52 88)"/>
    <ellipse cx="148" cy="88" rx="18" ry="22" fill="${petColor}" transform="rotate(15 148 88)"/>
    <ellipse cx="148" cy="88" rx="10" ry="13" fill="${belly}" opacity="0.6" transform="rotate(15 148 88)"/>
    <ellipse cx="100" cy="108" rx="52" ry="50" fill="${petColor}"/>
    <ellipse cx="66" cy="122" rx="13" ry="9" fill="${cheek}" opacity="0.55"/>
    <ellipse cx="134" cy="122" rx="13" ry="9" fill="${cheek}" opacity="0.55"/>
    ${eyes[mood]}
    ${mouths[mood]}
    <ellipse cx="44" cy="148" rx="14" ry="22" fill="${petColor}" transform="rotate(-20 44 148)"/>
    <ellipse cx="156" cy="148" rx="14" ry="22" fill="${petColor}" transform="rotate(20 156 148)"/>
    <ellipse cx="76" cy="202" rx="18" ry="10" fill="${petColor}"/>
    <ellipse cx="124" cy="202" rx="18" ry="10" fill="${petColor}"/>
    ${mood === 'happy' ? `<path d="M158 72 L160 66 L162 72 L168 74 L162 76 L160 82 L158 76 L152 74 Z" fill="#F5A623" opacity="0.9"/>` : ''}
    ${mood === 'sick'  ? `<circle cx="148" cy="72" r="14" fill="#FFE4B5" stroke="#F5A623" stroke-width="1.5"/><text x="148" y="77" text-anchor="middle" font-size="14">🤒</text>` : ''}
  `
}

function lightenColor(hex) {
  const r = parseInt(hex.slice(1,3),16)
  const g = parseInt(hex.slice(3,5),16)
  const b = parseInt(hex.slice(5,7),16)
  return `rgba(${Math.min(255,r+60)},${Math.min(255,g+60)},${Math.min(255,b+60)},0.7)`
}

// Renderiza botões de ação
const actionsEl = document.getElementById('pet-actions')
ACTIONS.forEach(a => {
  const canAfford = user.ps >= a.cost
  const btn = document.createElement('button')
  btn.className = 'pet-action-btn'
  btn.disabled  = !canAfford
  btn.innerHTML = `
    <span class="pet-action-icon">${a.icon}</span>
    <div class="pet-action-name">${a.label}</div>
    <div class="pet-action-desc">${a.desc}</div>
    <span class="pet-action-cost" style="background:${a.bg}; color:${a.color}">−${a.cost} PS</span>
  `
  btn.addEventListener('click', () => {
    if (user.ps < a.cost) return
    user.ps -= a.cost
    user.pet[a.stat] = Math.min(100, user.pet[a.stat] + a.boost)
    saveUser(user)
    updatePetUI()
    // Atualiza botões
    document.querySelectorAll('.pet-action-btn').forEach((b, i) => {
      b.disabled = user.ps < ACTIONS[i].cost
    })
  })
  actionsEl.appendChild(btn)
})

updatePetUI()

// ─── Poderes Elementais ───────────────────────────────────────────────────────

const PODERES_DATA = [
  {
    id: 'fire',
    name: 'Chama Vital',
    element: 'Fogo',
    icon: '🔥',
    color: '#EF4444',
    bg: '#FEF2F2',
    passive: 'Energia do pet decai 50% mais devagar',
    unlock:'Complete 3 dias de exercício',
    unlockCost: 0,
    strong: 'Vento',
    weak: 'Água',
  },
  {
    id: 'water',
    name: 'Fluxo Puro',
    element: 'Água',
    icon: '💧',
    color: '#0EA5E9',
    bg: '#E0F4FD',
    passive: 'Fome do pet decai 50% mais devagar',
    unlock:'Beba 2L de água por 5 dias',
    unlockCost: 0,
    strong: 'Fogo',
    weak: 'Terra',
  },
  {
    id: 'earth',
    name: 'Raiz Forte',
    element: 'Terra',
    icon: '🌱',
    color: '#16A34A',
    bg: '#DCFCE7',
    passive: '+20 em todas as stats ao desbloquear',
    unlock:'Realize 1 consulta médica',
    unlockCost: 0,
    strong: 'Água',
    weak: 'Vento',
  },
  {
    id: 'wind',
    name: 'Mente Livre',
    element: 'Vento',
    icon: '🌀',
    color: '#7C3AED',
    bg: '#F3F0FF',
    passive: 'Alegria do pet decai 50% mais devagar',
    unlock: 'Complete 21 dias de meditação',
    unlockCost: 0,
    strong: 'Terra',
    weak: 'Fogo',
  },
]

// Condições de desbloqueio (simuladas para demo)
function checkUnlockCondition(powerId) {
  const u = user
  switch (powerId) {
    case 'fire':  return (u.exerciseStreak  || 0) >= 3
    case 'water': return (u.waterStreak     || 0) >= 5
    case 'earth': return (u.totalCheckups   || 0) >= 1
    case 'wind':  return (u.meditationDays  || 0) >= 5
    default: return false
  }
}

function unlockPower(powerId) {
  if (!user.unlockedPowers) user.unlockedPowers = []
  if (user.unlockedPowers.includes(powerId)) return

  user.unlockedPowers.push(powerId)

  // Bônus especial do poder Terra
  if (powerId === 'earth') {
    user.pet.hunger    = Math.min(100, user.pet.hunger    + 20)
    user.pet.hygiene   = Math.min(100, user.pet.hygiene   + 20)
    user.pet.happiness = Math.min(100, user.pet.happiness + 20)
    user.pet.energy    = Math.min(100, user.pet.energy    + 20)
  }

  saveUser(user)
  renderPoderes()
  updatePetUI()
  showToastPet(`⚡ Poder ${PODERES_DATA.find(p => p.id === powerId).name} desbloqueado!`)
}

function showToastPet(msg) {
  // Reusa o sistema de toast do Bootstrap ou cria um simples
  const existing = document.getElementById('pet-toast')
  if (existing) existing.remove()

  const t = document.createElement('div')
  t.id = 'pet-toast'
  t.style.cssText = `
    position: fixed; bottom: 90px; left: 50%;
    transform: translateX(-50%);
    background: #1B6DB8; color: white;
    font-size: 13px; font-weight: 700;
    padding: 10px 20px; border-radius: 999px;
    white-space: nowrap; z-index: 999;
    box-shadow: 0 4px 20px rgba(27,109,184,0.4);
    animation: fadeInUp 0.3s ease;
  `
  t.textContent = msg
  document.body.appendChild(t)
  setTimeout(() => t.remove(), 2800)
}

function renderPoderes() {
  if (!user.unlockedPowers) user.unlockedPowers = []

  const list = document.getElementById('poderes-list')
  list.innerHTML = ''

  PODERES_DATA.forEach((p, i) => {
    const isUnlocked = user.unlockedPowers.includes(p.id)
    const canUnlock  = checkUnlockCondition(p.id)

    const card = document.createElement('div')
    card.className = `poder-card ${isUnlocked ? 'unlocked' : 'locked'}`
    card.style.setProperty('--border-color', p.color + '40')
    card.style.setProperty('--bg-color',     p.bg)
    if (isUnlocked) {
      card.style.borderColor = p.color + '40'
      card.style.background  = p.bg
    }

    card.innerHTML = `
      <div class="poder-card-icon" style="background:${isUnlocked ? p.bg : '#F0F4F8'}">
        ${p.icon}
      </div>

      <div class="flex-fill">
        <div class="poder-card-name" style="color:${isUnlocked ? p.color : '#9AABB8'}">
          ${p.name}
          <span style="font-size:10px; font-weight:600; color:#6B7E91; margin-left:4px;">${p.element}</span>
        </div>

        ${isUnlocked
          ? `<div class="poder-card-info">
               🛡 ${p.passive}<br>
               ⚔️ Forte vs ${p.strong} · Fraco vs ${p.weak}
             </div>`
          : `<div class="poder-card-info">🔒 ${p.unlock}</div>`
        }
      </div>

      <div class="d-flex flex-column align-items-end gap-2">
        ${isUnlocked
          ? `<span class="poder-card-badge" style="background:${p.color}; color:white;">ATIVO</span>`
          : canUnlock
          ? `<button class="poder-unlock-btn" style="background:${p.color}" onclick="unlockPower('${p.id}')">
               Desbloquear!
             </button>`
          : `<span class="poder-card-badge" style="background:#F0F4F8; color:#9AABB8;">BLOQUEADO</span>`
        }
      </div>
    `

    list.appendChild(card)
  })
}

renderPoderes()