const user = getUser()

// Poderes disponíveis
const PODERES = [
  { id:'fire',  name:'Chama Vital', element:'Fogo',  icon:'🔥', color:'#EF4444', bg:'#FEF2F2', baseDamage:35, strong:'wind',  weak:'water' },
  { id:'water', name:'Fluxo Puro',  element:'Água',  icon:'💧', color:'#0EA5E9', bg:'#E0F4FD', baseDamage:30, strong:'fire',  weak:'earth' },
  { id:'earth', name:'Raiz Forte',  element:'Terra', icon:'🌱', color:'#16A34A', bg:'#DCFCE7', baseDamage:28, strong:'water', weak:'wind'  },
  { id:'wind',  name:'Mente Livre', element:'Vento', icon:'🌀', color:'#7C3AED', bg:'#F3F0FF', baseDamage:32, strong:'earth', weak:'fire'  },
]

const OPONENTES = [
  { id:'r1', name:'Ana Souza',     initials:'AS', ps:42500, color:'#1B6DB8', powers:['fire','water'], petColor:'#4FACDE' },
  { id:'r2', name:'Carlos Mendes', initials:'CM', ps:38200, color:'#F5A623', powers:['earth','wind'], petColor:'#F5A623' },
  { id:'r3', name:'Beatriz Lima',  initials:'BL', ps:29700, color:'#28A745', powers:['water','wind'], petColor:'#28A745' },
  { id:'r4', name:'João Ferreira', initials:'JF', ps:22100, color:'#7C3AED', powers:['fire'],         petColor:'#7C3AED' },
  { id:'r5', name:'Maria Costa',   initials:'MC', ps:18400, color:'#EC4899', powers:['earth'],        petColor:'#EC4899' },
]

// Pega oponente da URL
const params   = new URLSearchParams(window.location.search)
const oppId    = params.get('opp') || 'r1'
const opponent = OPONENTES.find(o => o.id === oppId) || OPONENTES[0]

// Poderes desbloqueados do usuário (para demo, todos desbloqueados)
const unlockedPowers = user.unlockedPowers || ['fire']
const myPowers = PODERES.filter(p => unlockedPowers.includes(p.id))

// Estado da batalha
let round         = 1
let playerHP      = 300
let opponentHP    = 300
let moves         = []
let selectedPower = null
let roundResults  = []

// Init UI
document.getElementById('batalha-sub').textContent  = `Seu Pet vs ${opponent.name}`
document.getElementById('batalha-ps').textContent   = user.ps.toLocaleString('pt-BR') + ' PS'
document.getElementById('opp-name-hp').textContent  = opponent.name
document.getElementById('opp-name-arena').textContent = opponent.name

// Estrelas de fundo
const starsEl = document.getElementById('arena-stars')
for (let i = 0; i < 12; i++) {
  const s = document.createElement('div')
  s.className = 'star'
  s.style.top  = Math.random() * 100 + '%'
  s.style.left = Math.random() * 100 + '%'
  starsEl.appendChild(s)
}

// Desenha pets
function drawPet(svgId, color, mood = 'happy') {
  const belly = lightenColor(color)
  const eyes = {
    happy:   `<ellipse cx="82" cy="108" rx="7" ry="8" fill="#1A2B3C"/><ellipse cx="118" cy="108" rx="7" ry="8" fill="#1A2B3C"/><ellipse cx="84" cy="106" rx="2.5" ry="3" fill="white"/><ellipse cx="120" cy="106" rx="2.5" ry="3" fill="white"/>`,
    neutral: `<ellipse cx="82" cy="110" rx="7" ry="7" fill="#1A2B3C"/><ellipse cx="118" cy="110" rx="7" ry="7" fill="#1A2B3C"/>`,
    sad:     `<path d="M75 110 Q82 118 89 110" stroke="#1A2B3C" stroke-width="2.5" fill="none"/><path d="M111 110 Q118 118 125 110" stroke="#1A2B3C" stroke-width="2.5" fill="none"/>`,
  }
  const mouths = {
    happy:   `<path d="M88 128 Q100 140 112 128" stroke="#1A2B3C" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
    neutral: `<path d="M90 130 Q100 130 110 130" stroke="#1A2B3C" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    sad:     `<path d="M88 135 Q100 125 112 135" stroke="#1A2B3C" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
  }
  document.getElementById(svgId).innerHTML = `
    <ellipse cx="100" cy="210" rx="55" ry="10" fill="rgba(0,0,0,0.15)"/>
    <ellipse cx="100" cy="145" rx="60" ry="65" fill="${color}"/>
    <ellipse cx="100" cy="158" rx="36" ry="40" fill="${belly}" opacity="0.7"/>
    <ellipse cx="52"  cy="88"  rx="18" ry="22" fill="${color}" transform="rotate(-15 52 88)"/>
    <ellipse cx="148" cy="88"  rx="18" ry="22" fill="${color}" transform="rotate(15 148 88)"/>
    <ellipse cx="100" cy="108" rx="52" ry="50" fill="${color}"/>
    <ellipse cx="66"  cy="122" rx="13" ry="9"  fill="#FF8FAB" opacity="0.5"/>
    <ellipse cx="134" cy="122" rx="13" ry="9"  fill="#FF8FAB" opacity="0.5"/>
    ${eyes[mood]}
    ${mouths[mood]}
    <ellipse cx="44"  cy="148" rx="14" ry="22" fill="${color}" transform="rotate(-20 44 148)"/>
    <ellipse cx="156" cy="148" rx="14" ry="22" fill="${color}" transform="rotate(20 156 148)"/>
    <ellipse cx="76"  cy="202" rx="18" ry="10" fill="${color}"/>
    <ellipse cx="124" cy="202" rx="18" ry="10" fill="${color}"/>
  `
}

function lightenColor(hex) {
  const r = parseInt(hex.slice(1,3),16)
  const g = parseInt(hex.slice(3,5),16)
  const b = parseInt(hex.slice(5,7),16)
  return `rgba(${Math.min(255,r+60)},${Math.min(255,g+60)},${Math.min(255,b+60)},0.7)`
}

drawPet('pet-player', user.petColor || '#4FACDE', 'happy')
drawPet('pet-opp', opponent.petColor, 'neutral')

// Renderiza poderes
function renderPowers() {
  const grid = document.getElementById('poderes-grid')
  grid.innerHTML = ''

  if (myPowers.length === 0) {
    grid.innerHTML = `<div style="grid-column:span 2; text-align:center; color:rgba(255,255,255,0.5); padding:20px;">
      <p style="font-size:32px">🔒</p>
      <p>Nenhum poder desbloqueado.<br>Complete desafios de saúde!</p>
    </div>`
    return
  }

  myPowers.forEach(p => {
    const isSelected = selectedPower?.id === p.id
    const btn = document.createElement('button')
    btn.className = `poder-btn ${isSelected ? 'selected' : ''}`
    btn.style.borderColor = isSelected ? p.color : 'rgba(255,255,255,0.1)'
    btn.style.background  = isSelected ? p.bg + '22' : '#1a2b3c'
    btn.innerHTML = `
      <div class="d-flex justify-content-between w-100 mb-2">
        <span class="poder-icon">${p.icon}</span>
        ${isSelected ? `<span class="poder-tag-sel" style="color:${p.color}">✓</span>` : ''}
      </div>
      <div class="poder-elem" style="color:${p.color}">${p.element}</div>
      <div class="poder-name">${p.name}</div>
      <span class="poder-dmg" style="background:${p.bg}22; color:${p.color}">⚔ ${p.baseDamage} dano</span>
    `
    btn.addEventListener('click', () => {
      selectedPower = p
      const btnAtacar = document.getElementById('btn-atacar')
      btnAtacar.disabled = false
      btnAtacar.textContent = `${p.icon} Atacar com ${p.element}!`
      btnAtacar.style.background = `linear-gradient(135deg, ${p.color}, #1B6DB8)`
      renderPowers()
    })
    grid.appendChild(btn)
  })
}

renderPowers()

// Calcula dano
function calcDamage(attacker, defenderPowerId) {
  const isAdv  = attacker.strong === defenderPowerId
  const isWeak = attacker.weak   === defenderPowerId
  let dmg = attacker.baseDamage
  if (isAdv)  dmg = Math.round(dmg * 1.5)
  if (isWeak) dmg = Math.round(dmg * 0.6)
  return { dmg, isAdv, isWeak }
}

// Atualiza HP bars
function updateHP() {
  const pPct = Math.max(0, Math.round((playerHP   / 300) * 100))
  const oPct = Math.max(0, Math.round((opponentHP / 300) * 100))

  document.getElementById('hp-player').style.width = pPct + '%'
  document.getElementById('hp-opp').style.width    = oPct + '%'
  document.getElementById('hp-player-val').textContent = Math.max(0, playerHP)   + ' HP'
  document.getElementById('hp-opp-val').textContent    = Math.max(0, opponentHP) + ' HP'

  // Cor conforme HP
  const playerBar = document.getElementById('hp-player')
  playerBar.style.background = pPct > 50 ? '#28A745' : pPct > 25 ? '#F5A623' : '#EF4444'
}

// Confirma ataque
function confirmarAtaque() {
  if (!selectedPower) return

  const currentRound = round
  const myMove       = selectedPower
  const oppMoveId    = opponent.powers[(currentRound - 1) % opponent.powers.length]
  const oppMove      = PODERES.find(p => p.id === oppMoveId)

  // Mostra animação
  document.getElementById('phase-select').classList.add('hidden')
  document.getElementById('phase-fighting').classList.remove('hidden')
  document.getElementById('arena-vs').textContent = myMove.icon

  setTimeout(() => {
    // Calcula danos
    const myResult  = calcDamage(myMove,  oppMoveId)
    const oppResult = calcDamage(oppMove, myMove.id)

    playerHP   -= oppResult.dmg
    opponentHP -= myResult.dmg

    moves.push(myMove.id)
    roundResults.push({
      round:          currentRound,
      playerPower:    myMove,
      opponentPower:  oppMove,
      playerDamage:   myResult.dmg,
      opponentDamage: oppResult.dmg,
      advantage:      myResult.isAdv ? 'player' : myResult.isWeak ? 'opponent' : 'none',
    })

    updateHP()
    renderRoundResult(roundResults[roundResults.length - 1])

    document.getElementById('phase-fighting').classList.add('hidden')

    if (currentRound >= 3) {
      // Fim de batalha
      finalizarBatalha()
    } else {
      round++
      selectedPower = null
      document.getElementById('arena-round').textContent = `Rodada ${round}/3`
      document.getElementById('select-title').textContent = `Rodada ${round} — Escolha seu ataque`
      document.getElementById('btn-atacar').disabled = true
      document.getElementById('btn-atacar').textContent = 'Selecione um poder'
      document.getElementById('btn-atacar').style.background = '#2a3a4a'
      document.getElementById('phase-select').classList.remove('hidden')
      renderPowers()
    }
  }, 1200)
}

// Renderiza resultado de uma rodada
function renderRoundResult(r) {
  const container = document.getElementById('round-results')
  const advText = {
    player:   { text: '⚡ Vantagem!',    color: '#28A745' },
    opponent: { text: '💀 Desvantagem!', color: '#EF4444' },
    none:     { text: '⚖️ Neutro',       color: 'rgba(255,255,255,0.5)' },
  }
  const adv = advText[r.advantage]

  const card = document.createElement('div')
  card.className = 'round-result-card'
  card.innerHTML = `
    <div class="round-result-title">Rodada ${r.round}</div>
    <div class="round-result-row">
      <div class="round-col">
        <div class="round-power-icon">${r.playerPower.icon}</div>
        <div class="round-power-name" style="color:${r.playerPower.color}">${r.playerPower.element}</div>
        <div class="round-dmg">−${r.playerDamage} HP</div>
        <div class="round-dmg-label">no oponente</div>
      </div>
      <div style="text-align:center; flex-shrink:0;">
        <div class="round-adv" style="color:${adv.color}">${adv.text}</div>
        <div style="font-size:20px; margin-top:4px;">⚔️</div>
      </div>
      <div class="round-col">
        <div class="round-power-icon">${r.opponentPower.icon}</div>
        <div class="round-power-name" style="color:${r.opponentPower.color}">${r.opponentPower.element}</div>
        <div class="round-dmg">−${r.opponentDamage} HP</div>
        <div class="round-dmg-label">em você</div>
      </div>
    </div>
  `
  container.appendChild(card)
}

// Finaliza batalha
function finalizarBatalha() {
  const playerWins = playerHP > opponentHP

  // Atualiza PS
  const psChange = playerWins ? 200 : -150
  user.ps = Math.max(0, user.ps + psChange)
  if (!user.battleHistory) user.battleHistory = {}
  const prev = user.battleHistory[opponent.id] || { wins: 0, losses: 0 }
  user.battleHistory[opponent.id] = {
    wins:   playerWins ? prev.wins + 1   : prev.wins,
    losses: playerWins ? prev.losses     : prev.losses + 1,
    lastBattle: Date.now(),
  }
  saveUser(user)

  // Atualiza pet na arena
  drawPet('pet-player', user.petColor || '#4FACDE', playerWins ? 'happy' : 'sad')
  drawPet('pet-opp', opponent.petColor, playerWins ? 'sad' : 'happy')

  // Mostra resultado
  document.getElementById('phase-select').classList.add('hidden')

  const resultCard = document.getElementById('result-card')
  resultCard.className = `result-card ${playerWins ? 'win' : 'lose'}`

  document.getElementById('result-emoji').textContent = playerWins ? '🏆' : '💀'
  document.getElementById('result-title').textContent = playerWins ? 'Vitória!' : 'Derrota!'
  document.getElementById('result-desc').textContent  = playerWins
    ? `${opponent.name} perdeu 150 PS e caiu no ranking!`
    : 'Cuide melhor do seu pet e tente novamente!'
  document.getElementById('result-ps').textContent    = playerWins ? '+200 PS' : '−150 PS'

  const btnVoltar = document.querySelector('.btn-voltar')
  btnVoltar.style.color = playerWins ? '#28A745' : '#EF4444'

  document.getElementById('phase-result').classList.remove('hidden')

  // Volta automaticamente em 3s
  setTimeout(() => { window.location.href = 'ranking.html' }, 3000)
}

// Toast
function showToast(msg) {
  const t = document.getElementById('toast-cp')
  t.textContent = msg
  t.classList.add('show')
  setTimeout(() => t.classList.remove('show'), 2800)
}