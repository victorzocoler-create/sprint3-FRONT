const user = getUser()

const VOUCHERS = [
  { id:'v1', name:'10% off Academia',  partner:'Smart Fit',   ps:2000, icon:'🏋️', cat:'Exercício', available:true  },
  { id:'v2', name:'15% off Farmácia',  partner:'Drogasil',    ps:1500, icon:'💊', cat:'Saúde',     available:true  },
  { id:'v3', name:'Consulta Nutrição', partner:'Care Plus',   ps:3000, icon:'🥗', cat:'Nutrição',  available:false },
  { id:'v4', name:'Desconto Óptica',   partner:'Ótica Carol', ps:2500, icon:'👓', cat:'Bem-Estar', available:true  },
  { id:'v5', name:'Sorteio Exclusivo', partner:'Care Plus',   ps:5000, icon:'🎰', cat:'Premium',   available:false },
]

if (!user.redeemedVouchers) user.redeemedVouchers = []

let pendingVoucher = null

// Atualiza UI
function updateUI() {
  document.getElementById('nav-ps').textContent    = user.ps.toLocaleString('pt-BR') + ' PS'
  document.getElementById('saldo-ps').textContent  = user.ps.toLocaleString('pt-BR') + ' PS'
  document.getElementById('saldo-nivel').textContent = getLevelInfo(user.ps).current.name
}

// Render vouchers
function renderVouchers() {
  const list = document.getElementById('vouchers-list')
  list.innerHTML = ''

  VOUCHERS.forEach(v => {
    const redeemed  = user.redeemedVouchers.includes(v.id)
    const canAfford = user.ps >= v.ps
    const canRedeem = v.available && canAfford && !redeemed

    const row = document.createElement('div')
    row.className = `voucher-row ${redeemed ? 'redeemed' : canRedeem ? 'can-redeem' : !v.available ? 'locked' : ''}`
    row.innerHTML = `
      <div class="voucher-icon" style="background:${canRedeem ? '#FEF6E7' : redeemed ? '#EAF6ED' : '#F0F4F8'}">${v.icon}</div>
      <div class="flex-fill">
        <div class="voucher-name" style="color:${redeemed ? '#28A745' : '#1A2B3C'}">${v.name}</div>
        <div class="voucher-part">${v.partner}</div>
        <span class="tag" style="background:${canRedeem ? '#FEF6E7' : '#F0F4F8'}; color:${canRedeem ? '#D4891A' : '#9AABB8'}">${v.cat}</span>
      </div>
      <div class="d-flex flex-column align-items-end gap-2">
        <span class="voucher-cost" style="background:${redeemed ? '#EAF6ED' : canRedeem ? '#FEF6E7' : '#F0F4F8'}; color:${redeemed ? '#28A745' : canRedeem ? '#D4891A' : '#9AABB8'}">
          ${redeemed ? '✓ Resgatado' : `−${v.ps.toLocaleString('pt-BR')} PS`}
        </span>
        ${!redeemed ? `<button class="voucher-btn" ${!canRedeem ? 'disabled' : ''} onclick="openModal('${v.id}')">Resgatar</button>` : ''}
      </div>
    `
    list.appendChild(row)
  })
}

// Abre modal
function openModal(voucherId) {
  const v = VOUCHERS.find(x => x.id === voucherId)
  if (!v) return
  pendingVoucher = v

  document.getElementById('modal-icon').textContent    = v.icon
  document.getElementById('modal-name').textContent    = v.name
  document.getElementById('modal-partner').textContent = v.partner
  document.getElementById('modal-cost').textContent    = v.ps.toLocaleString('pt-BR') + ' PS'
  document.getElementById('modal-saldo').textContent   = user.ps.toLocaleString('pt-BR') + ' PS'
  document.getElementById('modal-after').textContent   = (user.ps - v.ps).toLocaleString('pt-BR') + ' PS'

  new bootstrap.Modal(document.getElementById('modal-voucher')).show()
}

// Confirma resgate
function confirmRedeem() {
  if (!pendingVoucher) return
  user.ps -= pendingVoucher.ps
  user.redeemedVouchers.push(pendingVoucher.id)
  saveUser(user)
  pendingVoucher = null
  bootstrap.Modal.getInstance(document.getElementById('modal-voucher')).hide()
  updateUI()
  renderVouchers()
}

updateUI()
renderVouchers()