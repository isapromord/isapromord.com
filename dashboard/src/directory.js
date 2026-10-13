/**
 * ISAPromoRD - Directory & Client Management Engine (Optimization HQ)
 * High-density compact view, cards view, intelligent search, filters,
 * domain auto-scan, client create/edit modal, and slide-over Mission Control drawer.
 */
import { state, STORAGE_KEYS } from './state.js';
import { saveClientsToStorage, syncClientToCloud, deleteClientFromCloud } from './sync.js';
import { showToast, escapeHtml, getBillingStatus, updateKpis, renderClientAvatarPills } from './ui.js';
import { pingSingleClient } from './uptime.js';

let currentDrawerClientId = null;
let currentDrawerTab = "roadmap";

export function setClientViewMode(mode) {
  state.clientViewMode = mode;
  localStorage.setItem(STORAGE_KEYS.viewMode, mode);
  
  const btnCompact = document.getElementById("btnViewCompact");
  const btnExpanded = document.getElementById("btnViewExpanded");

  if (btnCompact && btnExpanded) {
    if (mode === "compact") {
      btnCompact.className = "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-sm";
      btnExpanded.className = "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 text-slate-400 hover:text-slate-200";
    } else {
      btnExpanded.className = "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-sm";
      btnCompact.className = "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 text-slate-400 hover:text-slate-200";
    }
  }

  filterClients();
}

export function setQuickFilter(filterKey) {
  state.quickTrafficFilter = filterKey;
  
  const filters = ["all", "active", "maintenance", "pending_billing"];
  filters.forEach(k => {
    const el = document.getElementById(`qf-${k}`);
    if (!el) return;
    if (k === filterKey) {
      el.className = "px-3 py-1.5 rounded text-xs font-bold transition-all bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shrink-0 shadow-sm";
    } else {
      el.className = "px-3 py-1.5 rounded text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all shrink-0";
    }
  });

  filterClients();
}

export function updateQuickFilterCounts() {
  const clients = state.clients || [];
  const allCount = clients.length;
  const activeCount = clients.filter(c => c.status === "active").length;
  const maintCount = clients.filter(c => c.status === "maintenance").length;
  const billingCount = clients.filter(c => {
    const b = getBillingStatus(c.renewalDate);
    return c.status === "pending_payment" || b.status === "overdue" || b.status === "due_soon";
  }).length;

  const elAll = document.getElementById("qf-count-all");
  if (elAll) elAll.textContent = allCount;

  const elActive = document.getElementById("qf-count-active");
  if (elActive) elActive.textContent = activeCount;

  const elMaint = document.getElementById("qf-count-maintenance");
  if (elMaint) elMaint.textContent = maintCount;

  const elBilling = document.getElementById("qf-count-billing");
  if (elBilling) elBilling.textContent = billingCount;
}

export function renderClients(clientsToRender = state.clients) {
  renderClientAvatarPills();
  const container = document.getElementById("clientsContainer");
  const emptyState = document.getElementById("emptyState");
  if (!container) return;

  updateQuickFilterCounts();

  if (!clientsToRender || clientsToRender.length === 0) {
    container.innerHTML = "";
    if (emptyState) emptyState.classList.remove("hidden");
    return;
  }

  if (emptyState) emptyState.classList.add("hidden");

  const statusBadges = {
    active: { text: "🟢 Activo", bg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
    maintenance: { text: "🟡 Mantenimiento", bg: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
    pending_payment: { text: "🔴 Cobro Pendiente", bg: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
    lead: { text: "⚪ Prospecto", bg: "bg-slate-700/50 text-slate-300 border-slate-600" }
  };

  if (state.clientViewMode === "compact") {
    container.innerHTML = clientsToRender.map(client => {
      const currentBadge = statusBadges[client.status] || statusBadges.active;
      const score = client.healthScore !== undefined ? client.healthScore : 100;
      const healthColor = score >= 85 ? "text-emerald-400" : (score >= 60 ? "text-amber-400" : "text-rose-400");

      let uptimeDot = client.uptimeStatus === "offline" 
        ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20"><span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>Offline</span>`
        : (client.uptimeStatus === "checking" 
            ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono text-slate-400 bg-slate-800/60 border border-slate-700/60"><span class="w-1.5 h-1.5 rounded-full bg-slate-400 animate-ping"></span>Verificando</span>`
            : `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>${client.latencyMs || '380'}ms</span>`);

      return `
        <div onclick="selectClientDrilldown('${client.id}')" class="client-card-row p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 group cursor-pointer hover:border-cyan-500/50 hover:bg-[#131c2e] transition-all">
          <div class="flex items-center gap-3 min-w-0 flex-1">
            <div class="min-w-0 space-y-1 flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <h4 class="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors stitch-title">
                  ${escapeHtml(client.name)}
                </h4>
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold ${currentBadge.bg} border shrink-0">
                  ${currentBadge.text}
                </span>
                ${uptimeDot}
              </div>
              <div class="flex items-center gap-2 text-xs sm:text-sm font-mono text-slate-400 truncate stitch-subtext">
                <a href="${client.liveUrl}" target="_blank" onclick="event.stopPropagation()" class="text-slate-300 hover:text-cyan-400 hover:underline truncate">${client.liveUrl ? escapeHtml(client.liveUrl.replace(/^https?:\/\//, '')) : 'Sin Dominio'}</a>
                <span class="text-slate-600">•</span>
                <span class="text-slate-400 font-sans truncate">${escapeHtml(client.category || 'General')}</span>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between md:justify-end gap-3 sm:gap-6 pt-2 md:pt-0 border-t md:border-t-0 border-white/[0.05]">
            <div class="flex flex-col items-start md:items-end">
              <span class="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300">HEALTH SCORE</span>
              <span class="text-sm sm:text-base font-black font-mono ${healthColor} mt-0.5">
                ${score}/100
              </span>
            </div>

            <div class="flex flex-col items-start md:items-end">
              <span class="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300">RETAINER MENSUAL</span>
              <span class="text-sm sm:text-base font-black font-mono text-white mt-0.5 stitch-title">
                ${state.presentationMode ? '•••••' : (client.fee ? client.fee.replace(' / mes', '') : 'RD$ 0')}
              </span>
            </div>

            <div class="flex items-center gap-1.5" onclick="event.stopPropagation()">
              <button onclick="event.stopPropagation(); runServicesAudit('${client.id}')" class="p-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 transition-colors" title="Auditar Servicios">
                <span>⚡</span>
              </button>
              <button onclick="event.stopPropagation(); openProposalForClient('${client.id}')" class="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 transition-colors" title="Propuesta">
                <span>📝</span>
              </button>
              <button onclick="event.stopPropagation(); editClient('${client.id}')" class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors" title="Editar">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  } else {
    // Vista Expandida (Tarjetas HQ)
    container.innerHTML = clientsToRender.map(client => {
      const currentBadge = statusBadges[client.status] || statusBadges.active;
      const completedTasks = (client.tasks || []).filter(t => t.done).length;
      const totalTasks = (client.tasks || []).length;
      const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      let uptimeMarkup = client.uptimeStatus === "offline" 
        ? `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30"><span class="w-2 h-2 rounded-full bg-rose-500"></span>Inaccesible</span>`
        : (client.uptimeStatus === "checking" 
            ? `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700"><span class="w-2 h-2 rounded-full bg-slate-400 animate-ping"></span>Verificando...</span>`
            : `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"><span class="w-2 h-2 rounded-full bg-emerald-400"></span>Online (${client.latencyMs || '380'}ms)</span>`);

      return `
        <div onclick="selectClientDrilldown('${client.id}')" class="bg-[#101726] rounded-lg p-6 sm:p-7 border border-slate-700/80 shadow-2xl hover:border-cyan-500/50 hover:bg-[#131c2e] transition-all relative overflow-hidden text-slate-100 cursor-pointer group">
          <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-7">
            <div class="space-y-4 flex-1">
              <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3.5">
                <div class="flex flex-wrap items-center gap-3">
                  <h3 class="text-2xl font-black text-white tracking-tight group-hover:text-cyan-300 transition-colors">${escapeHtml(client.name)}</h3>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${currentBadge.bg} border">
                    ${currentBadge.text}
                  </span>
                  ${uptimeMarkup}
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    ⚡ Madurez Digital: ${client.healthScore !== undefined ? client.healthScore : 100}/100
                  </span>
                </div>
                
                <div class="flex items-center gap-2" onclick="event.stopPropagation()">
                  <button onclick="event.stopPropagation(); runServicesAudit('${client.id}')" class="px-3.5 py-2 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer" title="Auditoría 360° de servicios ISAPromoRD">
                    <span>⚡ Auditar Servicios</span>
                  </button>
                  <button onclick="event.stopPropagation(); openProposalForClient('${client.id}')" class="px-3.5 py-2 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer" title="Crear propuesta para ${escapeHtml(client.name)}">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    <span>Propuestas</span>
                  </button>
                  <button onclick="event.stopPropagation(); editClient('${client.id}')" class="px-3.5 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer">
                    <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    <span>Editar</span>
                  </button>
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-300">
                <span class="flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                  ${escapeHtml(client.category || 'General')}
                </span>
                <span class="flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  ${escapeHtml(client.contactPerson || 'Sin contacto')}
                </span>
                ${client.phone ? `
                  <a href="https://wa.me/${client.phone.replace(/\D/g, '')}" target="_blank" class="flex items-center gap-1.5 font-mono text-emerald-400 hover:text-emerald-300 bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-700/60 hover:border-emerald-500 transition-colors">
                    <svg class="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 2.052.88 3.203.88l.004-.001 5.769-.001c3.18 0 5.766-2.587 5.766-5.767.001-3.18-2.585-5.764-5.765-5.764z"></path></svg>
                    <span>${escapeHtml(client.phone)}</span>
                  </a>
                ` : '<span class="font-mono text-slate-400">Sin teléfono</span>'}
              </div>

              <div class="p-3 bg-[#090e1a] rounded border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div class="flex items-center gap-2 overflow-hidden">
                  <span class="font-mono text-slate-400 font-bold">URL:</span>
                  <a href="${client.liveUrl}" target="_blank" class="font-mono font-semibold text-cyan-400 hover:text-cyan-300 hover:underline truncate">
                    ${escapeHtml(client.liveUrl)}
                  </a>
                </div>
                <span class="px-2.5 py-0.5 bg-slate-800 border border-slate-700 rounded-md font-mono text-[11px] text-slate-300 shrink-0">
                  ${escapeHtml(client.platform || 'Hosting')}
                </span>
              </div>

              <div class="pt-2 space-y-2.5">
                <div class="flex items-center justify-between text-xs font-bold text-white">
                  <span class="flex items-center gap-2">
                    <span class="text-cyan-400 font-mono">🚀</span>
                    <span>Roadmap Operativo</span>
                    <span class="px-2 py-0.5 rounded-md text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      ${completedTasks}/${totalTasks} (${progressPct}%)
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
}

export function filterClients(explicitSearchTerm) {
  const inputDir = document.getElementById("clientFilterSearchInput");
  const inputHead = document.getElementById("searchInput");
  
  let term = "";
  if (typeof explicitSearchTerm === "string") {
    term = explicitSearchTerm.toLowerCase().trim();
  } else if (inputDir && inputDir.value) {
    term = inputDir.value.toLowerCase().trim();
  } else if (inputHead && inputHead.value) {
    term = inputHead.value.toLowerCase().trim();
  }

  if (inputDir && inputHead && inputDir.value !== inputHead.value) {
    if (document.activeElement === inputDir) inputHead.value = inputDir.value;
    else if (document.activeElement === inputHead) inputDir.value = inputHead.value;
  }

  const dateSortEl = document.getElementById("clientSortDateFilter");
  const sortMode = dateSortEl ? dateSortEl.value : "newest";

  let filtered = (state.clients || []).filter(c => {
    const nameMatch = (c.name || "").toLowerCase().includes(term);
    const urlMatch = (c.liveUrl || "").toLowerCase().includes(term);
    const catMatch = (c.category || "").toLowerCase().includes(term);
    const notesMatch = (c.notes || "").toLowerCase().includes(term);
    const contactMatch = (c.contactPerson || "").toLowerCase().includes(term);
    const phoneMatch = (c.phone || "").toLowerCase().includes(term);
    const matchesSearch = !term || (nameMatch || urlMatch || catMatch || notesMatch || contactMatch || phoneMatch);

    let matchesStatus = true;
    if (state.quickTrafficFilter === "active") {
      matchesStatus = c.status === "active";
    } else if (state.quickTrafficFilter === "maintenance") {
      matchesStatus = c.status === "maintenance";
    } else if (state.quickTrafficFilter === "pending_billing" || state.quickTrafficFilter === "pending_payment") {
      const b = getBillingStatus(c.renewalDate);
      matchesStatus = (c.status === "pending_payment" || b.status === "overdue" || b.status === "due_soon");
    }

    let matchesDate = true;
    if (sortMode === "month_current") {
      matchesDate = (c.joinedDate || "").startsWith("2026-10");
    } else if (sortMode === "month_prev") {
      matchesDate = (c.joinedDate || "").startsWith("2026-09");
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  if (sortMode === "newest") {
    filtered.sort((a, b) => new Date(b.joinedDate || 0) - new Date(a.joinedDate || 0));
  } else if (sortMode === "oldest") {
    filtered.sort((a, b) => new Date(a.joinedDate || 0) - new Date(b.joinedDate || 0));
  } else if (sortMode === "alpha") {
    filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  } else if (sortMode === "mrr") {
    const parseFee = (str) => {
      const m = (str || "").match(/[\d,]+/);
      return m ? parseInt(m[0].replace(/,/g, ''), 10) : 0;
    };
    filtered.sort((a, b) => parseFee(b.fee) - parseFee(a.fee));
  }

  renderClients(filtered);
}

export function toggleClientOptimizationPillar(clientId, pillar) {
  const client = state.clients.find(c => c.id === clientId);
  if (!client) return;

  if (!client.optimizationMatrix) {
    client.optimizationMatrix = { seo: "65%", whatsapp: "70%", geo: "60%", ai: "50%" };
  }

  const current = client.optimizationMatrix[pillar];
  const isHigh = parseInt(current, 10) >= 80;
  client.optimizationMatrix[pillar] = isHigh ? "60%" : "95%";

  saveClientsToStorage(true);
  renderClients();
  if (typeof window.renderClientDrilldown === 'function') window.renderClientDrilldown();
  showToast(`Pilar ${pillar.toUpperCase()} de ${client.name} actualizado a ${client.optimizationMatrix[pillar]}`, 'info');
}

export async function autoScanDomainData() {
  const urlInput = document.getElementById("clientLiveUrl");
  const btn = document.getElementById("autoScanBtn");
  const feedback = document.getElementById("autoScanFeedback");
  if (!urlInput || !btn) return;
  
  let rawUrl = (urlInput.value || "").trim();
  if (!rawUrl) {
    alert("Por favor introduce una dirección web (ej: https://ejemplo.com o www.cliente.com).");
    urlInput.focus();
    return;
  }

  if (!/^https?:\/\//i.test(rawUrl)) {
    rawUrl = "https://" + rawUrl;
    urlInput.value = rawUrl;
  }

  btn.disabled = true;
  btn.innerHTML = `<span class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> <span>Extrayendo...</span>`;
  if (feedback) {
    feedback.classList.remove("hidden");
    feedback.className = "text-[11px] font-medium text-purple-700 animate-pulse";
    feedback.textContent = "Conectando con el sitio web y extrayendo metadatos, stack y contactos...";
  }

  try {
    let domain = "";
    try {
      domain = new URL(rawUrl).hostname;
    } catch(e) {
      domain = rawUrl.replace(/^https?:\/\//, '').split('/')[0];
    }

    const resp = await fetch(`https://api.microlink.io?url=${encodeURIComponent(rawUrl)}&palette=true`, { cache: "no-store" });
    const json = await resp.json();

    let meta = (json.status === "success" && json.data) ? json.data : {};
    let headers = json.headers || {};

    let extractedName = "";
    if (meta.publisher && !meta.publisher.includes(".") && meta.publisher.length > 2) {
      extractedName = meta.publisher;
    } else if (meta.title) {
      const parts = meta.title.split(/[|\-—•]/).map(p => p.trim()).filter(Boolean);
      if (parts.length > 0) {
        extractedName = parts[0];
      }
    }
    if (!extractedName || extractedName.length < 2) {
      extractedName = domain.replace(/^www\./, '').split('.')[0];
      extractedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);
    }

    let combinedText = ((meta.title || "") + " " + (meta.description || "")).toLowerCase();
    let detectedCategory = "Servicios Profesionales";
    if (/apartamento|torre|inmueble|bienes ra[ií]ces|realty|penthouse|residencial/i.test(combinedText)) {
      detectedCategory = "Bienes Raíces & Inmobiliaria";
    } else if (/veterinari|pecuari|ganader|agrop|finca|animal/i.test(combinedText)) {
      detectedCategory = "Agropecuaria & Tienda Online";
    } else if (/dent|odont|cl[ií]nic|m[eé]dic|salud|doctor|est[eé]tic/i.test(combinedText)) {
      detectedCategory = "Salud & Especialidades Médicas";
    } else if (/abogad|legal|jur[ií]dic|notar/i.test(combinedText)) {
      detectedCategory = "Servicios Legales & Consultoría";
    } else if (/restauran|caf[eé]|comida|bar|gourmet|pizza/i.test(combinedText)) {
      detectedCategory = "Gastronomía & Restaurante";
    } else if (/hotel|resort|turis|viaje|hospedaje/i.test(combinedText)) {
      detectedCategory = "Turismo & Hospitalidad";
    } else if (/tienda|shop|compra|producto|ropa|calzado/i.test(combinedText)) {
      detectedCategory = "Comercio Electrónico / Retail";
    }

    let detectedPlatform = "Hosting Cloud Web";
    const serverHeader = (headers.server || "").toLowerCase();
    if (serverHeader.includes("vercel") || domain.includes("vercel.app")) {
      detectedPlatform = "Vercel Anycast (React 18 / Vite)";
    } else if (serverHeader.includes("github") || domain.includes("github.io")) {
      detectedPlatform = "GitHub Pages (Edge CDN)";
    } else if (serverHeader.includes("cloudflare")) {
      detectedPlatform = "Cloudflare Edge Network";
    } else if (serverHeader.includes("nginx")) {
      detectedPlatform = "Nginx Cloud Server";
    } else if (combinedText.includes("wordpress") || combinedText.includes("wp-content")) {
      detectedPlatform = "WordPress Engine";
    } else if (combinedText.includes("shopify")) {
      detectedPlatform = "Shopify Cloud";
    }

    let detectedPhone = "";
    const phoneMatch = combinedText.match(/(?:\+?1[\s.-]?)?\(?(809|829|849)\)?[\s.-]?(\d{3})[\s.-]?(\d{4})/);
    if (phoneMatch) {
      detectedPhone = `+1 (${phoneMatch[1]}) ${phoneMatch[2]}-${phoneMatch[3]}`;
    }

    let detectedEmail = "";
    const emailMatch = combinedText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch && !emailMatch[0].includes("example.com") && !emailMatch[0].includes("sentry")) {
      detectedEmail = emailMatch[0];
    }

    let extractedNotes = meta.description || "";
    if (extractedNotes && !extractedNotes.endsWith(".")) {
      extractedNotes += ".";
    }

    const nameInput = document.getElementById("clientName");
    const catInput = document.getElementById("clientCategory");
    const platInput = document.getElementById("clientPlatform");
    const phoneInput = document.getElementById("clientPhone");
    const emailInput = document.getElementById("clientEmail");
    const notesInput = document.getElementById("clientNotes");

    if (nameInput) { nameInput.value = extractedName; triggerHighlight(nameInput); }
    if (catInput) { catInput.value = detectedCategory; triggerHighlight(catInput); }
    if (platInput) { platInput.value = detectedPlatform; triggerHighlight(platInput); }
    if (phoneInput && detectedPhone) { phoneInput.value = detectedPhone; triggerHighlight(phoneInput); }
    if (emailInput && detectedEmail) { emailInput.value = detectedEmail; triggerHighlight(emailInput); }
    if (notesInput && extractedNotes) { notesInput.value = extractedNotes; triggerHighlight(notesInput); }

    if (feedback) {
      feedback.className = "text-[11px] font-bold text-emerald-400";
      feedback.innerHTML = `✓ Metadatos extraídos con éxito: Nombre <b>"${escapeHtml(extractedName)}"</b>, categoría <b>"${escapeHtml(detectedCategory)}"</b> y plataforma <b>"${escapeHtml(detectedPlatform)}"</b> detectados.`;
    }
    showToast(`✨ Dominio ${domain} analizado y completado`);

  } catch (err) {
    let domainFallback = "";
    try { domainFallback = new URL(rawUrl).hostname.replace(/^www\./, '').split('.')[0]; } catch(e) {}
    if (domainFallback) {
      const capName = domainFallback.charAt(0).toUpperCase() + domainFallback.slice(1);
      const nameIn = document.getElementById("clientName");
      if (nameIn) nameIn.value = capName;
    }
    if (feedback) {
      feedback.className = "text-[11px] font-medium text-amber-700";
      feedback.textContent = "Dominio configurado. Algunos metadatos externos no respondieron, puedes ajustar los campos manualmente.";
    }
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<span>✨ Auto-Escanear</span>`;
  }
}

function triggerHighlight(el) {
  el.classList.add("ring-2", "ring-emerald-500", "bg-emerald-50/40");
  setTimeout(() => {
    el.classList.remove("ring-2", "ring-emerald-500", "bg-emerald-50/40");
  }, 2500);
}

export function openNewClientModal() {
  const modalTitle = document.getElementById("modalTitle");
  if (modalTitle) modalTitle.textContent = "Registrar Nuevo Cliente";
  const form = document.getElementById("clientForm");
  if (form) form.reset();
  const idInput = document.getElementById("clientId");
  if (idInput) idInput.value = "";
  
  const feedback = document.getElementById("autoScanFeedback");
  if (feedback) {
    feedback.classList.add("hidden");
    feedback.textContent = "";
  }

  const modal = document.getElementById("clientModal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
  const urlIn = document.getElementById("clientLiveUrl");
  if (urlIn) urlIn.focus();
}

export function editClient(id) {
  const client = state.clients.find(c => c.id === id);
  if (!client) return;

  const modalTitle = document.getElementById("modalTitle");
  if (modalTitle) modalTitle.textContent = "Editar Ficha de Cliente";
  const idInput = document.getElementById("clientId");
  if (idInput) idInput.value = client.id;
  const nameInput = document.getElementById("clientName");
  if (nameInput) nameInput.value = client.name || "";
  const catInput = document.getElementById("clientCategory");
  if (catInput) catInput.value = client.category || "";
  const urlInput = document.getElementById("clientLiveUrl");
  if (urlInput) urlInput.value = client.liveUrl || "";
  const platInput = document.getElementById("clientPlatform");
  if (platInput) platInput.value = client.platform || "";
  const contInput = document.getElementById("clientContact");
  if (contInput) contInput.value = client.contactPerson || "";
  const phoneInput = document.getElementById("clientPhone");
  if (phoneInput) phoneInput.value = client.phone || "";
  const emailInput = document.getElementById("clientEmail");
  if (emailInput) emailInput.value = client.email || "";
  const statInput = document.getElementById("clientStatus");
  if (statInput) statInput.value = client.status || "active";
  const feeInput = document.getElementById("clientFee");
  if (feeInput) feeInput.value = client.fee || "";
  const renInput = document.getElementById("clientRenewal");
  if (renInput) renInput.value = client.renewalDate || "";
  const repoInput = document.getElementById("clientRepo");
  if (repoInput) repoInput.value = client.repoUrl || "";
  const notesInput = document.getElementById("clientNotes");
  if (notesInput) notesInput.value = client.notes || "";

  const feedback = document.getElementById("autoScanFeedback");
  if (feedback) feedback.classList.add("hidden");

  const modal = document.getElementById("clientModal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

export function closeClientModal() {
  const modal = document.getElementById("clientModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

export function saveClient(e) {
  if (e && e.preventDefault) e.preventDefault();
  const id = document.getElementById("clientId")?.value || "";
  const name = document.getElementById("clientName")?.value.trim() || "";
  const category = document.getElementById("clientCategory")?.value.trim() || "";
  const liveUrl = document.getElementById("clientLiveUrl")?.value.trim() || "";
  const platform = document.getElementById("clientPlatform")?.value.trim() || "";
  const contactPerson = document.getElementById("clientContact")?.value.trim() || "";
  const phone = document.getElementById("clientPhone")?.value.trim() || "";
  const email = document.getElementById("clientEmail")?.value.trim() || "";
  const status = document.getElementById("clientStatus")?.value || "active";
  const fee = document.getElementById("clientFee")?.value.trim() || "";
  const renewalDate = document.getElementById("clientRenewal")?.value || "";
  const repoUrl = document.getElementById("clientRepo")?.value.trim() || "";
  const notes = document.getElementById("clientNotes")?.value.trim() || "";

  const today = new Date().toISOString().split('T')[0];

  if (id) {
    const index = state.clients.findIndex(c => c.id === id);
    if (index !== -1) {
      state.clients[index] = {
        ...state.clients[index],
        name, category, liveUrl, platform, contactPerson, phone, email, status, fee, renewalDate, repoUrl, notes
      };
    }
  } else {
    let initialScore = 70;
    let initialLatency = 350;
    let initialTasks = [
      {
        id: 1,
        title: "Auditoría inicial de requerimientos técnicos y velocidad",
        done: true,
        date: today,
        guide: {
          summary: "Inspección técnica de código, cabeceras, meta tags y tiempos de carga.",
          details: "Diagnóstico inicial ejecutado por ISAPromoRD."
        }
      },
      {
        id: 2,
        title: "Optimización integral SEO, OpenGraph WhatsApp y Schemas JSON-LD",
        done: false,
        date: today,
        guide: {
          summary: "Inyección de metadatos transaccionales y tarjetas enriquecidas.",
          details: "Meta Description, Canonical, OpenGraph 1200x630, Geo Meta Tags y Schema LocalBusiness."
        }
      },
      {
        id: 3,
        title: "Generación de robots.txt, sitemap.xml y llms.txt para IA",
        done: false,
        date: today,
        guide: {
          summary: "Protocolos de rastreo para Googlebot y motores de Inteligencia Artificial.",
          details: "Autorización para GPTBot, ClaudeBot, PerplexityBot y mapa de sitio completo."
        }
      },
      {
        id: 4,
        title: "Verificación en Google Search Console y envío de Sitemap",
        done: false,
        date: today,
        guide: {
          summary: "Verificación de propiedad técnica y envío prioritario a Googlebot.",
          details: "Ingresar sitemap.xml completo y solicitar indexación en Search Console."
        }
      },
      {
        id: 5,
        title: "Creación y optimización de ficha en Google Business Profile (Maps)",
        done: false,
        date: today,
        guide: {
          summary: "Aparición garantizada en el mapa y en el Google Local 3-Pack.",
          details: "Registrar o verificar perfil con nombre, teléfono, horario y web oficial."
        }
      }
    ];

    if (window._pendingAuditGapsForNewClient) {
      initialScore = window._pendingAuditGapsForNewClient.score || initialScore;
      initialLatency = window._pendingAuditGapsForNewClient.latencyMs || initialLatency;
      if (window._pendingAuditGapsForNewClient.gaps && window._pendingAuditGapsForNewClient.gaps.length > 0) {
        initialTasks = [
          {
            id: 1,
            title: "Auditoría inicial 360° ejecutada con éxito",
            done: true,
            date: today,
            guide: {
              summary: `Diagnóstico completado con Health Score de ${initialScore}/100.`,
              details: "Inspección de SEO, Maps, OpenGraph, IA y arquitectura realizada."
            }
          },
          ...window._pendingAuditGapsForNewClient.gaps.map((g, idx) => ({
            id: idx + 2,
            title: g.taskTitle,
            done: false,
            date: today,
            guide: {
              summary: g.needed,
              details: `${g.findings} Solución recomendada por ISAPromoRD: ${g.solution}`
            }
          }))
        ];
      }
      window._pendingAuditGapsForNewClient = null;
    }

    const newId = "client-" + Date.now();
    state.clients.unshift({
      id: newId,
      name, category, liveUrl, platform, contactPerson, phone, email, status, fee, renewalDate, repoUrl, notes,
      joinedDate: today,
      healthScore: initialScore,
      latencyMs: initialLatency,
      optimizationMatrix: {
        seo: initialScore >= 80 ? "85%" : "65%",
        whatsapp: "80%",
        geo: "70%",
        ai: "60%"
      },
      tasks: initialTasks,
      uptimeStatus: "online"
    });
  }

  const targetClient = id ? state.clients.find(c => c.id === id) : state.clients[0];
  saveClientsToStorage(true);
  if (targetClient) {
    syncClientToCloud(targetClient);
  }
  closeClientModal();
  renderClients();
  updateKpis();

  if (liveUrl) {
    pingSingleClient(id || state.clients[0].id);
  }
  showToast(`Cliente "${name}" guardado exitosamente`, 'success');
}

export function deleteClient(id) {
  const client = state.clients.find(c => c.id === id);
  if (!client) return;

  if (confirm(`¿Estás seguro de que deseas eliminar el registro de "${client.name}"?`)) {
    state.clients = state.clients.filter(c => c.id !== id);
    saveClientsToStorage(false);
    deleteClientFromCloud(id);
    renderClients();
    updateKpis();
    showToast(`Cliente eliminado de la cartera`, 'info');
  }
}

// ==========================================
// DRAWER LATERAL: MISSION CONTROL SLIDE-OVER
// ==========================================
export function openClientDrawer(clientId, forceModal = false) {
  if (!forceModal) {
    if (window.selectClientDrilldown) {
      window.selectClientDrilldown(clientId);
      return;
    }
  }
  currentDrawerClientId = clientId;
  state.currentDrawerClientId = clientId;
  const client = state.clients.find(c => c.id === clientId);
  if (!client) return;

  const nameEl = document.getElementById("drawerClientName");
  if (nameEl) nameEl.textContent = client.name;
  const catEl = document.getElementById("drawerClientCategory");
  if (catEl) catEl.textContent = client.category || "General";
  
  const linkEl = document.getElementById("drawerClientUrlLink");
  const visitBtn = document.getElementById("drawerVisitWebBtn");
  if (client.liveUrl) {
    if (linkEl) {
      linkEl.href = client.liveUrl;
      linkEl.textContent = client.liveUrl.replace(/^https?:\/\//, '');
      linkEl.onclick = null;
    }
    if (visitBtn) {
      visitBtn.href = client.liveUrl;
      visitBtn.onclick = null;
      visitBtn.title = 'Visitar ' + client.liveUrl;
    }
  } else {
    if (linkEl) {
      linkEl.removeAttribute('href');
      linkEl.textContent = "Sin URL asignada";
      linkEl.onclick = (e) => { e.preventDefault(); showToast("Este cliente aún no tiene URL en vivo", "warning"); };
    }
    if (visitBtn) {
      visitBtn.removeAttribute('href');
      visitBtn.onclick = (e) => { e.preventDefault(); showToast("Este cliente aún no tiene URL en vivo", "warning"); };
      visitBtn.title = "Sin URL asignada";
    }
  }

  const statusBadges = {
    active: { text: "🟢 Activo en Producción", bg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
    maintenance: { text: "🟡 En Mantenimiento", bg: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
    pending_payment: { text: "🔴 Cobro Pendiente", bg: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
    lead: { text: "⚪ Prospecto / Cotización", bg: "bg-slate-700/50 text-slate-300 border-slate-600" }
  };
  const badge = statusBadges[client.status] || statusBadges.active;
  const statusBadgeEl = document.getElementById("drawerClientStatusBadge");
  if (statusBadgeEl) {
    statusBadgeEl.className = `px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.bg}`;
    statusBadgeEl.textContent = badge.text;
  }

  const healthBadgeEl = document.getElementById("drawerClientHealthBadge");
  if (healthBadgeEl) {
    const score = client.healthScore !== undefined ? client.healthScore : 100;
    const healthClass = score >= 85 ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : (score >= 60 ? "bg-amber-500/15 text-amber-300 border-amber-500/30" : "bg-rose-500/15 text-rose-300 border-rose-500/30");
    healthBadgeEl.className = `px-2.5 py-0.5 rounded-full text-xs font-bold border font-mono ${healthClass}`;
    healthBadgeEl.textContent = `⚡ Madurez Digital: ${score}/100`;
  }

  renderDrawerContent();

  const modal = document.getElementById("clientDrawerModal");
  const panel = document.getElementById("clientDrawerPanel");
  if (modal && panel) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    requestAnimationFrame(() => {
      panel.classList.remove("translate-x-full");
    });
  }
}

export function closeClientDrawer() {
  const modal = document.getElementById("clientDrawerModal");
  const panel = document.getElementById("clientDrawerPanel");
  if (panel) panel.classList.add("translate-x-full");
  setTimeout(() => {
    if (modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }
    currentDrawerClientId = null;
    state.currentDrawerClientId = null;
  }, 250);
}

export function handleDrawerBackdropClick(e) {
  if (e.target.id === "clientDrawerModal") {
    closeClientDrawer();
  }
}

export function switchDrawerTab(tabKey) {
  currentDrawerTab = tabKey;
  ["roadmap", "billing", "info"].forEach(t => {
    const btn = document.getElementById(`drawerTabBtn-${t}`);
    if (!btn) return;
    if (t === tabKey) {
      btn.className = "px-4 py-3 text-xs font-bold border-b-2 border-cyan-400 text-cyan-300 transition-colors flex items-center gap-2 shrink-0";
    } else {
      btn.className = "px-4 py-3 text-xs font-bold border-b-2 border-transparent text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-2 shrink-0";
    }
  });
  renderDrawerContent();
}

export function renderDrawerContent() {
  if (!currentDrawerClientId) return;
  const client = state.clients.find(c => c.id === currentDrawerClientId);
  if (!client) return;

  const body = document.getElementById("drawerBodyContent");
  if (!body) return;

  if (currentDrawerTab === "roadmap") {
    const completedTasks = (client.tasks || []).filter(t => t.done).length;
    const totalTasks = (client.tasks || []).length;
    const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    body.innerHTML = `
      <div class="p-4 rounded-md bg-[#090e1b] border border-slate-800 space-y-3">
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold text-white">Progreso de Entregables</span>
          <span class="font-mono text-cyan-400 font-bold">${completedTasks} / ${totalTasks} (${progressPct}%)</span>
        </div>
        <div class="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
          <div class="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" style="width: ${progressPct}%"></div>
        </div>
      </div>

      <div class="space-y-2 mt-4">
        ${(client.tasks || []).map(task => `
          <div class="p-3 rounded bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
            <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleTask('${client.id}', ${task.id})" class="mt-0.5 rounded text-cyan-500 focus:ring-cyan-400 cursor-pointer shrink-0" />
            <div class="min-w-0 flex-1">
              <span class="text-xs ${task.done ? 'line-through text-slate-400' : 'text-slate-200'} font-medium block">${escapeHtml(task.title)}</span>
              ${task.guide?.summary ? `<span class="text-[11px] text-slate-400 block mt-0.5">${escapeHtml(task.guide.summary)}</span>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } else if (currentDrawerTab === "billing") {
    const billing = getBillingStatus(client.renewalDate);
    body.innerHTML = `
      <div class="space-y-4">
        <div class="p-5 rounded-md bg-[#090e1b] border border-slate-800 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mantenimiento Mensual</span>
              <div class="text-2xl font-black text-emerald-400 font-mono mt-0.5">
                ${state.presentationMode ? 'RD$ •••••' : (client.fee || 'No asignado')}
              </div>
            </div>
            <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${billing.badgeClass}">
              ${billing.text}
            </span>
          </div>

          <div class="pt-3 border-t border-slate-800 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span class="text-slate-400 block text-[11px]">Próximo Cobro:</span>
              <span class="font-bold text-white font-mono">${client.renewalDate || 'Sin fecha'}</span>
            </div>
            <div>
              <span class="text-slate-400 block text-[11px]">Último Pago:</span>
              <span class="font-bold text-emerald-400 font-mono">${client.lastPaymentDate || 'Sin registro'}</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <button onclick="drawerOpenBillingNotice()" class="py-3 px-3 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/40 flex items-center justify-center gap-2 transition-colors">
            <span>💳 Aviso Cobro WhatsApp</span>
          </button>
          <button onclick="drawerRegisterPayment()" class="py-3 px-3 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 transition-colors">
            <span>✓ Registrar Pago (+1 Mes)</span>
          </button>
        </div>

        <button onclick="openReportModal('${client.id}')" class="w-full py-2.5 px-3 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center justify-center gap-2 transition-colors">
          <span>Generar Reporte Técnico para WhatsApp</span>
        </button>
      </div>
    `;
  } else if (currentDrawerTab === "info") {
    body.innerHTML = `
      <div class="space-y-4">
        <div class="p-5 rounded-md bg-[#090e1b] border border-slate-800 space-y-3.5 text-xs">
          <h5 class="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">Información de Contacto</h5>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span class="text-slate-400 block text-[11px]">Contacto:</span>
              <span class="font-bold text-white">${escapeHtml(client.contactPerson || 'Sin contacto')}</span>
            </div>
            <div>
              <span class="text-slate-400 block text-[11px]">Plataforma / Hosting:</span>
              <span class="font-mono text-cyan-300">${escapeHtml(client.platform || 'Hosting Cloud')}</span>
            </div>
            <div>
              <span class="text-slate-400 block text-[11px]">Teléfono / WhatsApp:</span>
              ${client.phone ? `
                <a href="https://wa.me/${client.phone.replace(/\D/g, '')}" target="_blank" class="font-mono text-emerald-400 hover:underline">
                  ${escapeHtml(client.phone)}
                </a>
              ` : '<span class="text-slate-400">Sin teléfono</span>'}
            </div>
            <div>
              <span class="text-slate-400 block text-[11px]">Correo Electrónico:</span>
              ${client.email ? `
                <a href="mailto:${client.email}" class="text-cyan-400 hover:underline">
                  ${escapeHtml(client.email)}
                </a>
              ` : '<span class="text-slate-400">Sin email</span>'}
            </div>
          </div>

          ${client.repoUrl ? `
            <div class="pt-2 border-t border-slate-800">
              <span class="text-slate-400 block text-[11px]">Repositorio GitHub:</span>
              <a href="${client.repoUrl}" target="_blank" class="font-mono text-cyan-400 hover:underline">
                ${escapeHtml(client.repoUrl)}
              </a>
            </div>
          ` : ''}
        </div>

        <div class="p-4 rounded-md bg-[#090e1b] border border-slate-800 space-y-2 text-xs">
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Notas & Alcance:</span>
          <p class="text-slate-300 leading-relaxed">${escapeHtml(client.notes || 'Sin notas registradas.')}</p>
        </div>
      </div>
    `;
  }
}

export function drawerRunAudit() {
  if (!currentDrawerClientId) return;
  const cid = currentDrawerClientId;
  closeClientDrawer();
  setTimeout(() => {
    if (window.runServicesAudit) window.runServicesAudit(cid);
  }, 300);
}

export function drawerEditClient() {
  if (!currentDrawerClientId) return;
  const cid = currentDrawerClientId;
  closeClientDrawer();
  setTimeout(() => {
    editClient(cid);
  }, 300);
}
