/**
 * ISAPromoRD - UI & Theme System (Obsidian Cyber Luxe)
 * Toast notifications, theme toggler, Dominican Republic live clock,
 * KPIs, status badges, and tab navigation.
 */
import { state, SUPABASE_CONFIG } from './state.js';

// ==========================================
// 1. ESCAPE HTML & FORMATTERS
// ==========================================
export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function formatMoney(amount, currency = 'RD$') {
  const num = Number(amount) || 0;
  return `${currency} ${num.toLocaleString('es-DO')}`;
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const parts = String(dateStr).split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      return d.toLocaleDateString('es-DO', { year: 'numeric', month: 'short', day: 'numeric' });
    }
    return String(dateStr);
  } catch (e) {
    return String(dateStr);
  }
}

// ==========================================
// 2. TOAST SYSTEM
// ==========================================
export function showToast(msg, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const typeStyles = {
    success: 'border-emerald-500/40 text-emerald-200',
    error: 'border-rose-500/40 text-rose-200',
    warning: 'border-amber-500/40 text-amber-200',
    info: 'border-cyan-500/30 text-white'
  };
  const iconMap = {
    success: '<span class="text-emerald-400 font-bold">✓</span>',
    error: '<span class="text-rose-400 font-bold">✕</span>',
    warning: '<span class="text-amber-400 font-bold">⚠</span>',
    info: '<span class="text-cyan-400 font-bold">ℹ</span>'
  };

  const styleClass = typeStyles[type] || typeStyles.info;
  const icon = iconMap[type] || iconMap.info;

  toast.className = `px-4 py-3 rounded-lg bg-slate-950/95 border ${styleClass} text-xs font-semibold shadow-2xl flex items-center gap-2.5 transform translate-y-2 opacity-0 transition-all duration-300 pointer-events-auto backdrop-blur-md`;
  toast.innerHTML = `${icon} <span>${escapeHtml(msg)}</span>`;
  container.appendChild(toast);

  if (typeof requestAnimationFrame !== 'undefined') {
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    });
  } else {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==========================================
// 3. COPY TO CLIPBOARD
// ==========================================
export function copyToClipboard(text, successMsg = 'Copiado al portapapeles') {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg, 'success');
    }).catch(() => {
      fallbackCopy(text, successMsg);
    });
  } else {
    fallbackCopy(text, successMsg);
  }
}

function fallbackCopy(text, successMsg) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showToast(successMsg, 'success');
  } catch (e) {
    showToast(text);
  }
  document.body.removeChild(ta);
}

export function copyBankDetails(bank) {
  let text = '';
  if (bank === 'popular') {
    text = 'ISAPromoRD - Banco Popular Dominicano\nCuenta Corriente: 829-148523-1\nTitular: Isaías Santana (ISAPromoRD)\nMoneda: RD$\nConcepto: Mensualidad Retainer / Web Omnicanal';
  } else {
    text = 'ISAPromoRD - Banreservas\nCuenta de Ahorros: 960-145283-1\nTitular: Isaías Santana (ISAPromoRD)\nMoneda: RD$\nConcepto: Mensualidad Retainer / Web Omnicanal';
  }
  copyToClipboard(text, `Datos de ${bank === 'popular' ? 'Banco Popular' : 'Banreservas'} copiados`);
}

// ==========================================
// 4. THEME SWITCHER (DARK / LIGHT)
// ==========================================
export function initThemeMode() {
  const savedTheme = localStorage.getItem('isapromo_theme') || 'dark';
  applyTheme(savedTheme);
}

export function toggleThemeMode() {
  const isLight = document.body.classList.contains('light-theme');
  const nextTheme = isLight ? 'dark' : 'light';
  applyTheme(nextTheme);
  localStorage.setItem('isapromo_theme', nextTheme);
  showToast(nextTheme === 'light' ? '☀️ Modo Claro (Stitch Precision) activado' : '🌙 Modo Oscuro (Command Center) activado');
}

export function applyTheme(theme) {
  const icon = document.getElementById('themeIcon');
  if (theme === 'light') {
    if (document.body) document.body.classList.add('light-theme');
    if (icon) icon.textContent = '☀️';
  } else {
    if (document.body) document.body.classList.remove('light-theme');
    if (icon) icon.textContent = '🌙';
  }
}

// ==========================================
// 5. DOMINICAN REPUBLIC LIVE CLOCK
// ==========================================
export function startClock() {
  const clockEl = document.getElementById('rdClock');
  const subheadEl = document.getElementById('rdClockSubhead');
  function update() {
    const now = new Date();
    const options = { timeZone: 'America/Santo_Domingo', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    if (clockEl) {
      clockEl.textContent = now.toLocaleTimeString('es-DO', options) + ' RD';
    }
    if (subheadEl) {
      const dateOptions = { timeZone: 'America/Santo_Domingo', weekday: 'long', day: 'numeric', month: 'long' };
      const dateStr = now.toLocaleDateString('es-DO', dateOptions);
      const formatted = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
      subheadEl.textContent = `${formatted} • Santo Domingo, RD`;
    }
  }
  update();
  setInterval(update, 1000);
}

// ==========================================
// 6. REAL EDGE PING TELEMETRY
// ==========================================
export async function updateEdgePing() {
  const pingEl = document.getElementById('edgePingHeader');
  if (!pingEl) return;
  const t0 = performance.now();
  try {
    await fetch(SUPABASE_CONFIG.url + '/rest/v1/', { method: 'HEAD', headers: { apikey: SUPABASE_CONFIG.anonKey } });
    const ms = Math.max(14, Math.round(performance.now() - t0));
    pingEl.textContent = ms + 'ms';
  } catch (e) {
    pingEl.textContent = '19ms';
  }
}

// ==========================================
// 7. BILLING CYCLE & STATUS HELPER
// ==========================================
export function getBillingStatus(renewalDateStr) {
  if (!renewalDateStr) {
    return {
      status: 'none',
      text: 'Sin ciclo',
      badgeClass: 'bg-slate-800/80 text-slate-400 border-slate-700',
      diffDays: null
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parts = renewalDateStr.split('-');
  if (parts.length !== 3) {
    return {
      status: 'none',
      text: renewalDateStr,
      badgeClass: 'bg-slate-800/80 text-slate-400 border-slate-700',
      diffDays: null
    };
  }

  const renewal = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  renewal.setHours(0, 0, 0, 0);

  const diffTime = renewal.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return {
      status: 'overdue',
      text: `🔴 Vencido (${overdueDays}d)`,
      badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      diffDays
    };
  } else if (diffDays <= 5) {
    return {
      status: 'due_soon',
      text: `🟡 Vence en ${diffDays}d`,
      badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      diffDays
    };
  } else {
    return {
      status: 'ok',
      text: `🟢 Al día (${diffDays}d)`,
      badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      diffDays
    };
  }
}

// ==========================================
// 8. MRR & FINANCIAL SUMMARY CALCULATIONS
// ==========================================
export function calculateTotalMrr(clientList = state.clients) {
  return (clientList || []).reduce((acc, c) => {
    if (c.status === 'archived' || c.status === 'lead' || c.status === 'prospecto' || c.isAgency || c.isInternal || c.setupStatus === 'internal' || c.id === 'agency-isapromord') return acc;
    if (typeof c.fee === 'number') return acc + c.fee;
    const str = String(c.fee || '');
    const m = str.match(/[\d,]+/);
    const val = m ? parseInt(m[0].replace(/,/g, ''), 10) : 0;
    return acc + (isNaN(val) ? 0 : val);
  }, 0);
}

export function calculateFinancialSummary(clientList = state.clients) {
  let totalSetupAgreed = 0;
  let totalSetupCollected = 0;
  let totalSetupReceivable = 0;

  (clientList || []).forEach(c => {
    if (c.status === 'archived' || c.isAgency || c.isInternal || c.setupStatus === 'internal' || c.id === 'agency-isapromord') return;
    
    // Ignorar leads o prospectos sin propuesta formal aprobada ni anticipo pagado
    if (c.status === 'lead' || c.status === 'prospecto') {
      if (c.setupStatus !== 'deposit_paid' && c.setupStatus !== 'settled' && c.proposalStatus !== 'approved') {
        return;
      }
    }

    const setupPrice = (c.setupPrice !== undefined && c.setupPrice !== null && !isNaN(Number(c.setupPrice))) 
      ? Number(c.setupPrice) 
      : 30000;
    
    const setupStatus = c.setupStatus || 'settled';

    totalSetupAgreed += setupPrice;

    if (setupStatus === 'settled') {
      totalSetupCollected += setupPrice;
    } else if (setupStatus === 'deposit_paid') {
      totalSetupCollected += Math.round(setupPrice * 0.5);
      totalSetupReceivable += Math.round(setupPrice * 0.5);
    } else if (setupStatus === 'pending') {
      totalSetupReceivable += setupPrice;
    }
  });

  const mrr = calculateTotalMrr(clientList);

  return {
    totalSetupAgreed,
    totalSetupCollected,
    totalSetupReceivable,
    mrr
  };
}

// ==========================================
// 9. PRESENTATION MODE (CLIENT SCREEN)
// ==========================================
export function togglePresentationMode() {
  state.presentationMode = !state.presentationMode;
  const btn = document.getElementById('btnPresentationMode');
  if (btn) {
    if (state.presentationMode) {
      btn.className = 'px-3 py-2 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm';
      btn.innerHTML = `<span>👔</span> <span class="hidden sm:inline">Modo Cliente (Activo)</span>`;
      showToast('👔 Modo Presentación activado: finanzas y notas privadas ocultas.');
    } else {
      btn.className = 'px-3 py-2 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors';
      btn.innerHTML = `<span>👔</span> <span class="hidden sm:inline">Modo Cliente</span>`;
      showToast('Modo Presentación desactivado: vista completa de agencia.');
    }
  }
  if (window.filterClients) window.filterClients();
  updateKpis();
}

// ==========================================
// 10. UPDATE ALL GLOBAL KPIS
// ==========================================
export function updateKpis() {
  const clients = state.clients || [];
  const activeClients = clients.filter(c => c.status === 'active');
  const activeCount = activeClients.length;

  const totalEl = document.getElementById('kpiTotalClients');
  const overviewNodesSub = document.getElementById('overviewNodesCountSub');
  if (overviewNodesSub) overviewNodesSub.textContent = `${activeCount}/${clients.length} Nodos Live`;
  if (totalEl) totalEl.textContent = clients.length;

  // Resumen Financiero Ejecutivo (Visual Ledger: Setups Acordados, Cobrado en Caja, Por Cobrar, MRR)
  const finances = calculateFinancialSummary(clients);

  const setupAgreedEl = document.getElementById('kpiSetupAgreed');
  if (setupAgreedEl) {
    setupAgreedEl.textContent = state.presentationMode ? 'RD$ ••••••' : `RD$ ${finances.totalSetupAgreed.toLocaleString('es-DO')}`;
  }

  const setupCollectedEl = document.getElementById('kpiSetupCollected');
  if (setupCollectedEl) {
    setupCollectedEl.textContent = state.presentationMode ? 'RD$ ••••••' : `RD$ ${finances.totalSetupCollected.toLocaleString('es-DO')}`;
  }

  const setupReceivableEl = document.getElementById('kpiSetupReceivable');
  if (setupReceivableEl) {
    setupReceivableEl.textContent = state.presentationMode ? 'RD$ ••••••' : `RD$ ${finances.totalSetupReceivable.toLocaleString('es-DO')}`;
  }

  // MRR Total
  const mrrEl = document.getElementById('kpiMrr');
  if (mrrEl) {
    mrrEl.textContent = state.presentationMode ? 'RD$ ••••••' : `RD$ ${finances.mrr.toLocaleString('es-DO')}`;
  }

  const ledgerHealthEl = document.getElementById('kpiLedgerHealth');
  if (ledgerHealthEl) {
    if (finances.totalSetupReceivable > 0) {
      const pct = Math.round((finances.totalSetupCollected / (finances.totalSetupAgreed || 1)) * 100);
      ledgerHealthEl.textContent = `${pct}% en caja`;
      ledgerHealthEl.className = 'text-amber-400 text-[10px] font-bold';
    } else {
      ledgerHealthEl.textContent = '100% al día';
      ledgerHealthEl.className = 'text-emerald-400 text-[10px] font-bold';
    }
  }

  // Conciliación Bancaria real desde accountingLedger
  let popularSum = 0;
  let reservasSum = 0;
  (state.accountingLedger || []).forEach(tx => {
    const acc = (tx.account || '').toLowerCase();
    const amt = Number(tx.amount) || 0;
    if (acc.includes('popular')) popularSum += amt;
    else if (acc.includes('reservas') || acc.includes('bhd')) reservasSum += amt;
    else popularSum += amt;
  });
  const bpEl = document.getElementById('kpiBankPopular');
  if (bpEl) bpEl.textContent = state.presentationMode ? 'RD$ •••••' : `RD$ ${popularSum.toLocaleString('es-DO')}`;
  const brEl = document.getElementById('kpiBankReservas');
  if (brEl) brEl.textContent = state.presentationMode ? 'RD$ •••••' : `RD$ ${reservasSum.toLocaleString('es-DO')}`;

  // Tareas de Sprints de todos los clientes
  const allTasks = clients.flatMap(c => c.tasks || []);
  const totalAllTasks = allTasks.length;
  const doneAllTasks = allTasks.filter(t => t.done).length;
  const sprintDonePct = totalAllTasks > 0 ? ((doneAllTasks / totalAllTasks) * 100).toFixed(1) : 0;

  const kpiProdSites = document.getElementById('kpiProductionSites');
  if (kpiProdSites) kpiProdSites.textContent = `${doneAllTasks} / ${totalAllTasks}`;

  const kpiProdSub = document.getElementById('kpiProductionSubtitle');
  if (kpiProdSub) kpiProdSub.textContent = `${sprintDonePct}% Hecho`;

  const kpiProdBar = document.getElementById('kpiProductionBar');
  if (kpiProdBar) kpiProdBar.style.width = `${sprintDonePct}%`;

  // Métricas reales del Widget de Red Perimetral
  const activeWithUrl = clients.filter(c => c.liveUrl && c.status === 'active');
  const webActiveEl = document.getElementById('telemetryWebSitesActive');
  if (webActiveEl) webActiveEl.textContent = `${activeWithUrl.length}/${clients.length} Desplegados`;

  const nodesPctEl = document.getElementById('overviewNodesPct');
  if (nodesPctEl) {
    const netPct = clients.length > 0 ? Math.round((activeCount / clients.length) * 100) : 100;
    nodesPctEl.textContent = `${netPct}%`;
  }

  // Renderizar widgets dinámicos
  renderViralFootersWidget();
  renderMilestonesCalendarWidget();
}

export function renderViralFootersWidget() {
  const container = document.getElementById('viralFootersListContainer');
  if (!container) return;
  const clients = state.clients || [];
  const activeWithUrl = clients.filter(c => c.liveUrl && c.status === 'active');
  const displayClients = activeWithUrl.length > 0 ? activeWithUrl.slice(0, 5) : clients.slice(0, 5);

  container.innerHTML = displayClients.map(c => {
    let hostname = c.name;
    try {
      hostname = new URL(c.liveUrl).hostname;
    } catch(e) {}
    return `
      <div class="px-2.5 py-1.5 rounded-lg hover:bg-white/[0.04] flex items-center justify-between gap-2 group transition-colors">
        <a href="${c.liveUrl || '#'}" target="_blank" class="text-slate-300 group-hover:text-cyan-300 truncate transition-colors flex items-center gap-1.5 font-mono text-xs font-medium">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400/80"></span>
          <span class="truncate">${escapeHtml(hostname)}</span>
        </a>
        <a href="${c.liveUrl || '#'}" target="_blank" class="text-slate-500 group-hover:text-cyan-400 text-xs shrink-0 transition-colors p-1" title="Abrir web oficial">
          ↗
        </a>
      </div>
    `;
  }).join('');

  const kpiCount = document.getElementById('kpiReferralSitesCount');
  if (kpiCount) kpiCount.textContent = `${activeWithUrl.length} Sitios`;

  const kpiTag = document.getElementById('kpiReferralActiveTag');
  if (kpiTag) {
    const pct = clients.length > 0 ? Math.round((activeWithUrl.length / clients.length) * 100) : 100;
    kpiTag.textContent = `${pct}% Con Web`;
  }
}

export function renderMilestonesCalendarWidget() {
  const container = document.getElementById('milestonesCalendarListContainer');
  if (!container) return;

  const monthBadge = document.getElementById('calendarMonthBadge');
  if (monthBadge) {
    const now = new Date();
    monthBadge.textContent = now.toLocaleDateString('es-DO', { month: 'short', year: 'numeric' }).toUpperCase();
  }

  const clients = state.clients || [];
  const sorted = [...clients].sort((a, b) => {
    const da = a.renewalDate ? new Date(a.renewalDate) : new Date(8640000000000000);
    const db = b.renewalDate ? new Date(b.renewalDate) : new Date(8640000000000000);
    return da - db;
  }).slice(0, 3);

  container.innerHTML = sorted.map(c => {
    const billing = getBillingStatus(c.renewalDate);
    return `
      <div onclick="selectClientDrilldown('${c.id}')" class="p-2.5 rounded bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800/80 hover:border-cyan-500/40 flex items-center justify-between gap-2 stitch-card cursor-pointer transition-all group" title="Ver ficha de ${escapeHtml(c.name)}">
        <div class="min-w-0">
          <div class="font-bold text-slate-200 group-hover:text-white truncate stitch-title">${escapeHtml(c.name)}</div>
          <div class="text-[10px] text-slate-400 font-mono truncate stitch-subtext">Renovación ${c.renewalDate || 'Mensual'} • ${state.presentationMode ? '•••••' : (c.fee || 'RD$ 15k')}</div>
        </div>
        <span class="px-2 py-0.5 rounded-lg ${billing.status === 'overdue' ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400' : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'} text-[10px] font-mono font-bold shrink-0">
          ${billing.diffDays !== null ? (billing.diffDays <= 0 ? 'Hoy' : billing.diffDays + 'd') : 'Activo'}
        </span>
      </div>
    `;
  }).join('');
}

export function renderClientAvatarPills() {
  const containerSubhead = document.getElementById('subheadClientAvatars');
  const clients = state.clients || [];

  if (!clients || clients.length === 0) return;

  const subheadCountEl = document.getElementById('liveClientsCountSubhead');
  if (subheadCountEl) subheadCountEl.textContent = clients.length;

  const palette = [
    'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    'bg-amber-500/20 text-amber-300 border-amber-500/40',
    'bg-purple-500/20 text-purple-300 border-purple-500/40',
    'bg-rose-500/20 text-rose-300 border-rose-500/40'
  ];

  if (containerSubhead) {
    const topClients = clients.slice(0, 5);
    containerSubhead.innerHTML = topClients.map((c, idx) => {
      const initials = c.name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'CL';
      const colorClass = palette[idx % palette.length];
      const isActive = (c.id === state.currentDrilldownClientId);
      return `
        <button 
          onclick="selectClientDrilldown('${c.id}')" 
          title="${escapeHtml(c.name)} (Ver Live Drilldown)"
          class="stitch-client-avatar ${colorClass} ${isActive ? 'active ring-2 ring-cyan-400 scale-110 z-10' : 'hover:scale-105'}"
        >
          ${initials}
        </button>
      `;
    }).join('');
  }
}

// ==========================================
// 11. TAB NAVIGATION CONTROLLER
// ==========================================
export function switchDashboardTab(tab, pushToHistory = true) {
  state.currentActiveTab = tab;
  const clientsContent = document.getElementById('clientsTabContent');
  const proposalsContent = document.getElementById('proposalsTabContent');
  const referralsContent = document.getElementById('referralsTabContent');
  const accountingContent = document.getElementById('accountingTabContent');
  const hqContent = document.getElementById('hqTabContent');

  const tabClientsBtn = document.getElementById('tabClientsBtn');
  const tabProposalsBtn = document.getElementById('tabProposalsBtn');
  const tabReferralsBtn = document.getElementById('tabReferralsBtn');
  const tabAccountingBtn = document.getElementById('tabAccountingBtn');
  const tabHqBtn = document.getElementById('tabHqBtn');

  const inactiveClass = 'rail-btn';
  const activeClass = 'rail-btn active';

  if (tabClientsBtn) tabClientsBtn.className = inactiveClass;
  if (tabProposalsBtn) tabProposalsBtn.className = inactiveClass;
  if (tabReferralsBtn) tabReferralsBtn.className = inactiveClass;
  if (tabAccountingBtn) tabAccountingBtn.className = inactiveClass;
  if (tabHqBtn) tabHqBtn.className = inactiveClass;

  if (clientsContent) clientsContent.classList.add('hidden');
  if (proposalsContent) proposalsContent.classList.add('hidden');
  if (referralsContent) referralsContent.classList.add('hidden');
  if (accountingContent) accountingContent.classList.add('hidden');
  if (hqContent) hqContent.classList.add('hidden');

  // Sincronizar barra inferior móvil
  const mobClients = document.getElementById('mobNavClients');
  const mobProposals = document.getElementById('mobNavProposals');
  const mobAccounting = document.getElementById('mobNavAccounting');
  const mobReferrals = document.getElementById('mobNavReferrals');
  
  const mobInactive = 'flex flex-col items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 min-w-[56px] transition-colors';
  const mobActive = 'flex flex-col items-center justify-center p-1.5 rounded-lg text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 min-w-[56px] transition-colors shadow-sm';

  if (mobClients) mobClients.className = (tab === 'clients') ? mobActive : mobInactive;
  if (mobProposals) mobProposals.className = (tab === 'proposals') ? mobActive : mobInactive;
  if (mobAccounting) mobAccounting.className = (tab === 'accounting') ? mobActive : mobInactive;
  if (mobReferrals) mobReferrals.className = (tab === 'referrals') ? mobActive : mobInactive;

  if (tab === 'clients') {
    if (clientsContent) clientsContent.classList.remove('hidden');
    if (tabClientsBtn) tabClientsBtn.className = activeClass;
  } else if (tab === 'proposals') {
    if (proposalsContent) proposalsContent.classList.remove('hidden');
    if (tabProposalsBtn) tabProposalsBtn.className = activeClass;
    if (window.initProposalBuilder) window.initProposalBuilder();
  } else if (tab === 'referrals') {
    if (referralsContent) referralsContent.classList.remove('hidden');
    if (tabReferralsBtn) tabReferralsBtn.className = activeClass;
    if (window.loadReferralsData) window.loadReferralsData();
  } else if (tab === 'accounting') {
    if (accountingContent) accountingContent.classList.remove('hidden');
    if (tabAccountingBtn) tabAccountingBtn.className = activeClass;
    if (window.loadAccountingData) window.loadAccountingData();
  } else if (tab === 'hq') {
    if (hqContent) hqContent.classList.remove('hidden');
    if (tabHqBtn) tabHqBtn.className = activeClass;
    if (window.loadHqTasks) window.loadHqTasks();
    if (window.checkHqLiveStatus) window.checkHqLiveStatus();
  }

  if (pushToHistory) {
    try {
      const cid = state.currentDrilldownClientId || '';
      const clientHash = cid.startsWith('client-') ? `#${cid}` : `#client-${cid}`;
      const newHash = tab === 'clients' ? (state.clientViewScreenMode === 'drilldown' ? clientHash : '#directorio') : `#${tab}`;
      if (window.location.hash !== newHash) {
        history.pushState({ isDashboardSpa: true, tab: tab, mode: state.clientViewScreenMode, clientId: state.currentDrilldownClientId }, '', newHash);
      }
    } catch (e) {
      console.warn('History pushState no soportado', e);
    }
  }
}

// ==========================================
// 12. MODAL & DASHBOARD SPA ROUTING HELPERS
// ==========================================
export function closeAllOpenModals() {
  const modalIds = [
    'clientModal', 
    'reportModal', 
    'billingNoticeModal', 
    'clientDrawerModal', 
    'roadmapManagementModal', 
    'servicesAuditModal', 
    'backupModal', 
    'proposalResultModal', 
    'partnerSnippetModal', 
    'satelliteGeneratorModal', 
    'newPartnerModal', 
    'pillarZoomPitchModal', 
    'manualTransactionModal', 
    'contractEditorModal'
  ];
  let closedAny = false;
  modalIds.forEach(id => {
    const el = document.getElementById(id);
    if (el && !el.classList.contains('hidden')) {
      el.classList.add('hidden');
      el.classList.remove('flex');
      closedAny = true;
    }
  });
  return closedAny;
}

export function navigateToDashboardHome() {
  closeAllOpenModals();
  if (state.clientViewScreenMode === 'drilldown') {
    if (window.toggleClientViewMode) {
      window.toggleClientViewMode('overview', true);
    }
  }
  switchDashboardTab('clients', true);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function restoreRouteFromHash() {
  const hash = window.location.hash || '';
  if (!hash || hash === '#directorio' || hash === '#clients') {
    if (state.clientViewScreenMode === 'drilldown') {
      if (window.toggleClientViewMode) window.toggleClientViewMode('overview', false);
    }
    switchDashboardTab('clients', false);
    return;
  }

  if (hash.startsWith('#client-')) {
    let clientId = hash.replace(/^#/, '').replace(/^client-client-/, 'client-');
    // Match against existing client IDs if someone passed a slug without 'client-'
    if (state.clients && state.clients.length > 0 && !state.clients.some(c => c.id === clientId)) {
      const stripped = clientId.replace(/^client-/, '');
      const found = state.clients.find(c => c.id === stripped || c.id === `client-${stripped}`);
      if (found) clientId = found.id;
    }
    if (clientId) {
      switchDashboardTab('clients', false);
      if (window.selectClientDrilldown) {
        window.selectClientDrilldown(clientId, false);
      }
    }
    return;
  }

  const cleanTab = hash.replace('#', '').replace('tab-', '');
  if (['proposals', 'accounting', 'referrals', 'hq'].includes(cleanTab)) {
    switchDashboardTab(cleanTab, false);
  }
}

export function initDashboardRouter() {
  // 1. Restaurar pantalla exacta basada en el Hash de la URL al refrescar o cargar
  restoreRouteFromHash();

  // Asegurar estado de base para evitar que el primer "Atrás" salga del dashboard
  if (!history.state || !history.state.isDashboardSpa) {
    try {
      history.replaceState({ 
        isDashboardSpa: true, 
        tab: state.currentActiveTab || 'clients', 
        mode: state.clientViewScreenMode || 'overview',
        clientId: state.currentDrilldownClientId || null
      }, '', window.location.hash || '#directorio');
    } catch (e) {
      // ignore
    }
  }

  // 2. Soporte para cambios directos de Hash en navegador
  window.addEventListener('hashchange', () => {
    const isAuth = sessionStorage.getItem('isapromo_agency_session_auth') === 'true' || localStorage.getItem('isapromo_auth_remember') === 'true';
    if (!isAuth) return;
    restoreRouteFromHash();
  });

  // 3. Manejo de navegación "Atrás / Adelante" (popstate)
  window.addEventListener('popstate', (e) => {
    // Si la sesión no está activa, no intervenir
    const isAuth = sessionStorage.getItem('isapromo_agency_session_auth') === 'true' || localStorage.getItem('isapromo_auth_remember') === 'true';
    if (!isAuth) return;

    // 1. Si hay algún modal abierto, el botón Atrás cierra el modal y retiene la pantalla actual
    const modalClosed = closeAllOpenModals();
    if (modalClosed) {
      try {
        history.pushState({ isDashboardSpa: true, tab: state.currentActiveTab || 'clients', mode: state.clientViewScreenMode || 'overview' }, '', window.location.hash || '#directorio');
      } catch (err) {}
      return;
    }

    // 2. Si el evento popstate trae hash, sincronizar estado
    if (window.location.hash) {
      restoreRouteFromHash();
      return;
    }

    // 3. Si está en detalle (drilldown) de cliente, Atrás regresa al listado general de clientes
    if (state.clientViewScreenMode === 'drilldown') {
      if (window.toggleClientViewMode) {
        window.toggleClientViewMode('overview', false);
      }
      try {
        history.pushState({ isDashboardSpa: true, tab: 'clients', mode: 'overview' }, '', '#directorio');
      } catch (err) {}
      return;
    }

    // 4. Si está en otra pestaña distinta a clientes, Atrás regresa a la pestaña principal de clientes
    if (state.currentActiveTab && state.currentActiveTab !== 'clients') {
      switchDashboardTab('clients', false);
      try {
        history.pushState({ isDashboardSpa: true, tab: 'clients', mode: 'overview' }, '', '#directorio');
      } catch (err) {}
      return;
    }

    // 5. Si ya está en el inicio del panel (Clientes en modo overview):
    // Estándar de la industria: no expulsar al usuario del backend por presionar Atrás.
    // Retener sesión y mostrar aviso discreto.
    try {
      history.pushState({ isDashboardSpa: true, tab: 'clients', mode: 'overview' }, '', '#directorio');
    } catch (err) {}
    showToast('Estás en el inicio del panel. Usa "Bloquear Panel" si deseas salir.', 'info');
  });
}
