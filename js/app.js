// Dados do usuário logado
function getUser() {
  const raw = localStorage.getItem('cp_logged')
  if (!raw) { window.location.href = 'index.html'; return null }
  return JSON.parse(raw)
}

function saveUser(user) {
  localStorage.setItem('cp_logged', JSON.stringify(user))
  // Atualiza também na lista de usuários
  const users = JSON.parse(localStorage.getItem('cp_users') || '[]')
  const idx   = users.findIndex(u => u.email === user.email)
  if (idx !== -1) { users[idx] = user; localStorage.setItem('cp_users', JSON.stringify(users)) }
}

function logout() {
  localStorage.removeItem('cp_logged')
  window.location.href = 'index.html'
}

// Nível do usuário
const LEVELS = [
  { id: 'recruta',  name: 'Recruta',  minPS: 0,     maxPS: 15000,  discount: '5%',  benefit: 'Clube de Vantagens e vouchers básicos', color: '#6B7E91' },
  { id: 'guardiao', name: 'Guardião', minPS: 15001, maxPS: 35000,  discount: '10%', benefit: 'Vouchers Premium e sorteios exclusivos',  color: '#1B6DB8' },
  { id: 'mestre',   name: 'Mestre',   minPS: 35001, maxPS: 999999, discount: '15%', benefit: 'Catálogo completo e Consultoria gratuita', color: '#F5A623' },
]

function getLevelInfo(ps) {
  const current = LEVELS.find(l => ps >= l.minPS && ps <= l.maxPS) || LEVELS[0]
  const nextIdx = LEVELS.indexOf(current) + 1
  const next    = LEVELS[nextIdx] || null
  const range   = (current.maxPS === 999999 ? current.minPS + 20000 : current.maxPS) - current.minPS
  const pct     = Math.min(100, Math.round(((ps - current.minPS) / range) * 100))
  return { current, next, pct }
}

// Challenges
const CHALLENGES = [
  { id: 'checkup',  name: 'Agendar check-up anual',   desc: 'Marque sua consulta preventiva', ps: 500, icon: '🩺', color: '#1B6DB8', bg: '#EBF3FB', cat: 'Prevenção'   },
  { id: 'walk',     name: 'Caminhar 30 minutos',       desc: 'Qualquer horário, qualquer lugar', ps: 80, icon: '🚶', color: '#28A745', bg: '#EAF6ED', cat: 'Exercício'   },
  { id: 'water',    name: 'Beber 2L de água',          desc: 'Hidratação é saúde',               ps: 50, icon: '💧', color: '#0EA5E9', bg: '#E0F4FD', cat: 'Hidratação'  },
  { id: 'food',     name: 'Refeição saudável',         desc: 'Registre uma refeição equilibrada', ps: 60, icon: '🥗', color: '#16A34A', bg: '#DCFCE7', cat: 'Nutrição'    },
  { id: 'vaccine',  name: 'Registrar vacinação',       desc: 'Confirme sua carteira de vacinas',  ps: 300, icon: '💉', color: '#7C3AED', bg: '#F3F0FF', cat: 'Imunização'  },
  { id: 'sleep',    name: 'Dormir 8 horas',            desc: 'Registre seu horário de sono',      ps: 100, icon: '😴', color: '#6366F1', bg: '#EEF2FF', cat: 'Sono'        },
  { id: 'meditate', name: 'Meditar 10 minutos',        desc: 'Saúde mental também conta',         ps: 70,  icon: '🧘', color: '#EC4899', bg: '#FDF2F8', cat: 'Mental'      },
]

const BADGES = [
  { id: 'imunidade',    name: 'Imunidade Blindada',  icon: '🛡️', unlocked: true  },
  { id: 'checkup_hero', name: 'Herói da Prevenção',  icon: '🩺', unlocked: true  },
  { id: 'caminhante',   name: 'Caminhante Dedicado', icon: '🚶', unlocked: true  },
  { id: 'guardiao_n',   name: 'Guardião da Saúde',   icon: '🏆', unlocked: false },
  { id: 'mente_sa',     name: 'Mente Sã',            icon: '🧠', unlocked: false },
  { id: 'hidratado',    name: 'Super Hidratado',      icon: '💧', unlocked: false },
  { id: 'mestre_n',     name: 'Mestre da Saúde',     icon: '⭐', unlocked: false },
  { id: 'social',       name: 'Saúde em Família',    icon: '👥', unlocked: false },
]

const WEEK_DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']