/**
 * ISAPROMORD OS — Contracts Engine (50/50 Legal Terms & Document Vault)
 * Strict executive invoice styling, 50/50 split calculation, 5 business days grace,
 * takedown clause, calligraphic 1-click & canvas signature, hash sealing.
 * DGII / NCF completely purged.
 */

import { state, STORAGE_KEYS } from './state.js';
import { showToast, escapeHtml } from './ui.js';

const pendingContractDeletions = new Map();
let currentEditingContract = null;

export function getStoredContracts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONTRACTS);
    if (raw) return JSON.parse(raw);
    
    // Semilla inicial formal para Pasión Pecuaria RD
    const initialContracts = [
      {
        id: "ctr-pasion-pecuaria-2026",
        contractNumber: "CTR-2026-001",
        clientId: "client-pasion-pecuaria",
        clientName: "Pasión Pecuaria RD",
        clientRnc: "1-32-98471-2",
        clientRepresentative: "Dr. Veterinario / Dirección General",
        clientPhone: "+1 (829) 396-1318",
        clientEmail: "pasionpecuariard@gmail.com",
        proposalId: "prop-pasion-pecuaria",
        date: "8 de octubre de 2026",
        deliveryDays: "10 a 15 días laborables",
        status: "sent",
        services: [
          {
            name: "🌐 Landing Page Transaccional de Alta Conversión (<1s)",
            type: "onetime",
            price: 28000,
            deliverables: [
              "Desarrollo frontend en React 18 + Vite con arquitectura de ultra-velocidad.",
              "Catálogo interactivo con filtrado dinámico y carrito de cotización directo a WhatsApp.",
              "SEO On-Page y Schemas Schema.org JSON-LD para Google Search y Maps.",
              "Despliegue Anycast Global con certificado SSL de grado bancario."
            ]
          },
          {
            name: "🛡️ Mantenimiento Web, Hosting Anycast & Soporte Continuo",
            type: "monthly",
            price: 4500,
            deliverables: [
              "Alojamiento de alta velocidad Anycast CDN 24/7.",
              "Monitoreo continuo de uptime y seguridad preventiva.",
              "Actualizaciones mensuales de contenido y catálogo de productos."
            ]
          }
        ],
        totalSetup: 28000,
        totalMonthly: 4500,
        depositAmount: 14000,
        completionAmount: 14000,
        signedAt: null,
        signedBy: null,
        signerDocId: null,
        signatureData: null,
        signatureHash: null
      }
    ];
    localStorage.setItem(STORAGE_KEYS.CONTRACTS, JSON.stringify(initialContracts));
    return initialContracts;
  } catch (e) {
    return [];
  }
}

export function saveContractToStorage(contract) {
  const list = getStoredContracts();
  const idx = list.findIndex(c => c.id === contract.id);
  if (idx !== -1) {
    list[idx] = contract;
  } else {
    list.unshift(contract);
  }
  localStorage.setItem(STORAGE_KEYS.CONTRACTS, JSON.stringify(list));
  return contract;
}

export function generateContractUrl(c) {
  try {
    const jsonStr = JSON.stringify(c);
    const b64 = btoa(unescape(encodeURIComponent(jsonStr)));
    return `../contrato/?id=${encodeURIComponent(c.id)}#${b64}`;
  } catch (e) {
    return `../contrato/?id=${encodeURIComponent(c.id)}`;
  }
}

export function renderRoadmapContractsTab(client) {
  const container = document.getElementById("roadmapContractsList");
  const badge = document.getElementById("roadmapModalContractBadge");
  if (!container) return;

  const allContracts = getStoredContracts();
  const clientNameNorm = (client.name || "").trim().toLowerCase();

  const matching = allContracts.filter(c => {
    if (c.clientId && c.clientId === client.id) return true;
    if (c.clientName && c.clientName.trim().toLowerCase() === clientNameNorm) return true;
    return false;
  });

  if (badge) badge.textContent = matching.length;

  if (matching.length === 0) {
    container.innerHTML = `
      <div class="p-6 rounded-lg bg-[#0a0e17] border border-dashed border-slate-700 text-center space-y-3">
        <div class="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-xl flex items-center justify-center mx-auto">
          📜
        </div>
        <h4 class="text-sm font-bold text-white">No hay contratos registrados para ${escapeHtml(client.name)} aún</h4>
        <p class="text-xs text-slate-400 max-w-md mx-auto">
          Formaliza los acuerdos comerciales con el esquema 50/50, firma electrónica vinculante, 5 días de gracia y cláusula de suspensión por mora antes de iniciar el trabajo.
        </p>
        <div class="pt-2">
          <button onclick="openNewContractForClient('${client.id}')" class="px-4 py-2 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-slate-950 font-bold text-xs rounded-md shadow-md shadow-indigo-500/20 transition-all cursor-pointer">
            📜 Redactar Contrato Oficial Ahora
          </button>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = matching.map(c => {
    const isSigned = c.status === 'signed';
    const isSent = c.status === 'sent';
    const statusBadge = isSigned ? 
      '<span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">🟢 Firmado Digitalmente</span>' :
      (isSent ? 
        '<span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">🔵 Enviado a Firma</span>' :
        '<span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/25">🟡 Borrador Editable</span>'
      );

    const contractUrl = generateContractUrl(c);
    const deposit = c.depositAmount !== undefined ? c.depositAmount : Math.round((c.totalSetup || 0) * 0.5);
    const completion = c.completionAmount !== undefined ? c.completionAmount : Math.round((c.totalSetup || 0) * 0.5);
    const servicesCount = (c.services || []).length;

    const rawPhone = (c.clientPhone || client.phone || "").replace(/[^0-9]/g, '');
    const phoneFormatted = rawPhone.length === 10 ? ('1' + rawPhone) : rawPhone;
    const fullShareUrl = window.location.origin + window.location.pathname.replace(/\/dashboard\/.*$/, '/') + 'contrato/?id=' + encodeURIComponent(c.id) + '#' + (contractUrl.split('#')[1] || '');
    const waMsg = `Estimado(a) ${c.clientRepresentative || c.clientName}, le compartimos el Contrato Oficial de Servicios Tecnológicos de ISAPromoRD (${c.contractNumber}) para su revisión y firma digital vinculante:\n\n${fullShareUrl}`;
    const waLink = phoneFormatted ? `https://wa.me/${phoneFormatted}?text=${encodeURIComponent(waMsg)}` : `https://wa.me/?text=${encodeURIComponent(waMsg)}`;

    return `
      <div class="p-4 rounded-lg bg-[#0a0e17] border ${isSigned ? 'border-emerald-500/30' : 'border-white/[0.08]'} space-y-3.5 transition-all">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/[0.06]">
          <div class="space-y-0.5">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs font-black text-cyan-300 font-mono tracking-wide">${escapeHtml(c.contractNumber || 'CTR-2026')}</span>
              ${statusBadge}
              <span class="text-[10px] font-mono text-slate-400">📅 ${escapeHtml(c.date || '')}</span>
              ${c.deliveryDays ? `<span class="text-[10px] text-slate-400 font-mono">⏱️ ${escapeHtml(c.deliveryDays)}</span>` : ''}
            </div>
            <p class="text-[11px] text-slate-300">
              Cliente: <strong class="text-white">${escapeHtml(c.clientName)}</strong>
              ${c.clientRnc ? ` • <span class="font-mono text-slate-400">RNC: ${escapeHtml(c.clientRnc)}</span>` : ''}
            </p>
          </div>

          <div class="flex items-center gap-2 self-end sm:self-auto shrink-0 flex-wrap">
            <a href="${contractUrl}" target="_blank" class="px-3 py-1.5 rounded bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5" title="Abrir documento para firma interactiva">
              <span>👁️ Ver / Firmar</span>
            </a>
            <button onclick="navigator.clipboard.writeText('${contractUrl}'); showToast('Enlace de firma copiado al portapapeles', 'success');" class="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-bold transition-colors cursor-pointer" title="Copiar enlace de firma">
              📋 Link
            </button>
            <a href="${waLink}" target="_blank" class="px-3 py-1.5 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-colors" title="Compartir vía WhatsApp">
              💬 WhatsApp
            </a>
            <button onclick="openContractEditorModal('${c.id}')" class="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-white/10 text-xs font-bold transition-colors cursor-pointer" title="Editar contrato">
              ✏️
            </button>
            <button onclick="deleteContractWithUndo('${c.id}')" class="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition-all cursor-pointer" title="Eliminar contrato">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </div>
        </div>

        <!-- Resumen Financiero 50/50 -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div class="p-2.5 rounded bg-[#06080d] border border-white/[0.05]">
            <span class="text-[10px] text-slate-400 uppercase tracking-wider block">Inversión Setup</span>
            <span class="text-xs font-black text-white">RD$ ${(c.totalSetup || 0).toLocaleString('es-DO')}</span>
          </div>
          <div class="p-2.5 rounded bg-indigo-950/30 border border-indigo-500/20">
            <span class="text-[10px] text-indigo-300 uppercase tracking-wider font-bold block">50% Anticipo (Inicio)</span>
            <span class="text-xs font-black text-indigo-300">RD$ ${deposit.toLocaleString('es-DO')}</span>
          </div>
          <div class="p-2.5 rounded bg-emerald-950/30 border border-emerald-500/20">
            <span class="text-[10px] text-emerald-300 uppercase tracking-wider font-bold block">50% Contra Entrega</span>
            <span class="text-xs font-black text-emerald-300">RD$ ${completion.toLocaleString('es-DO')}</span>
          </div>
          <div class="p-2.5 rounded bg-[#06080d] border border-white/[0.05]">
            <span class="text-[10px] text-slate-400 uppercase tracking-wider block">Mensualidad</span>
            <span class="text-xs font-black text-cyan-300">${(c.totalMonthly || 0) > 0 ? `RD$ ${(c.totalMonthly).toLocaleString('es-DO')}/mes` : 'N/A'}</span>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400 pt-1">
          <div>
            <span>📦 <strong>${servicesCount}</strong> servicio${servicesCount === 1 ? '' : 's'} contratado${servicesCount === 1 ? '' : 's'}</span>
            <span class="mx-1.5">•</span>
            <span>⚖️ 5 días de gracia tras entrega</span>
          </div>
          ${isSigned ? `
            <div class="text-emerald-400 font-mono text-[10px] flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <span>✓ Ratificado por ${escapeHtml(c.signedBy || 'Cliente')} (${escapeHtml(c.signerDocId || '')})</span>
              <span>• Hash: ${escapeHtml((c.signatureHash || '').substring(0, 12))}...</span>
            </div>
          ` : `
            <div class="text-amber-400 text-[10px] flex items-center gap-1">
              <span>⏳ Pendiente de firma y depósito del 50%</span>
            </div>
          `}
        </div>
      </div>
    `;
  }).join('');
}

export function openNewContractForClient(clientId) {
  let client = null;
  if (clientId) client = state.clients.find(c => c.id === clientId);
  if (!client && state.currentDrilldownClientId) client = state.clients.find(c => c.id === state.currentDrilldownClientId);
  if (!client && state.clients.length > 0) client = state.clients[0];

  const existingContracts = getStoredContracts();
  const contractNum = `CTR-2026-${String(existingContracts.length + 1).padStart(3, '0')}`;

  const defaultServices = [
    {
      name: "🌐 Landing Page Transaccional de Alta Conversión (<1s)",
      type: "onetime",
      price: 28000,
      deliverables: [
        "Desarrollo frontend en React 18 + Vite con arquitectura de ultra-velocidad.",
        "Catálogo interactivo con carrito directo a WhatsApp.",
        "SEO On-Page y Schemas Schema.org JSON-LD para Google Search y Maps.",
        "Despliegue Anycast Global con certificado SSL de grado bancario."
      ]
    },
    {
      name: "🛡️ Mantenimiento Web, Hosting Anycast & Soporte Continuo",
      type: "monthly",
      price: 4500,
      deliverables: [
        "Alojamiento de alta velocidad Anycast CDN 24/7.",
        "Monitoreo continuo de uptime y seguridad preventiva.",
        "Actualizaciones mensuales de contenido y catálogo de productos."
      ]
    }
  ];

  const prefill = {
    id: "ctr-" + Date.now(),
    contractNumber: contractNum,
    clientId: client ? client.id : "",
    clientName: client ? client.name : "",
    clientRnc: client ? (client.rnc || "") : "",
    clientRepresentative: client ? (client.contactPerson || "") : "",
    clientPhone: client ? (client.phone || "") : "",
    clientEmail: client ? (client.email || "") : "",
    proposalId: null,
    date: new Date().toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' }),
    deliveryDays: "10 a 15 días laborables",
    status: "draft",
    services: defaultServices,
    totalSetup: 28000,
    totalMonthly: 4500,
    depositAmount: 14000,
    completionAmount: 14000
  };

  openContractEditorModal(null, prefill);
}

export function openContractEditorModal(contractId, prefill) {
  const modal = document.getElementById("contractEditorModal");
  if (!modal) return;

  const select = document.getElementById("contractEditClientSelect");
  if (select) {
    select.innerHTML = state.clients.map(c => 
      `<option value="${c.id}">${escapeHtml(c.name)}</option>`
    ).join('');
  }

  let data = null;
  if (contractId) {
    const stored = getStoredContracts();
    data = stored.find(c => c.id === contractId);
  } else if (prefill) {
    data = prefill;
  }

  if (!data) {
    data = {
      id: "ctr-" + Date.now(),
      contractNumber: `CTR-2026-${String(getStoredContracts().length + 1).padStart(3, '0')}`,
      clientId: state.clients.length > 0 ? state.clients[0].id : "",
      clientName: state.clients.length > 0 ? state.clients[0].name : "",
      clientRnc: "",
      clientRepresentative: "",
      deliveryDays: "10 a 15 días laborables",
      date: new Date().toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' }),
      services: [],
      totalSetup: 0,
      totalMonthly: 0
    };
  }

  currentEditingContract = data;

  const editId = document.getElementById("contractEditId");
  const editPropId = document.getElementById("contractEditProposalId");
  const editNumber = document.getElementById("contractEditNumber");
  const editDate = document.getElementById("contractEditDate");
  const editRnc = document.getElementById("contractEditRnc");
  const editRep = document.getElementById("contractEditRepresentative");
  const editDelivery = document.getElementById("contractEditDeliveryDays");

  if (editId) editId.value = data.id || ("ctr-" + Date.now());
  if (editPropId) editPropId.value = data.proposalId || "";
  if (editNumber) editNumber.value = data.contractNumber || "";
  if (editDate) editDate.value = data.date || new Date().toLocaleDateString('es-DO');
  if (editRnc) editRnc.value = data.clientRnc || "";
  if (editRep) editRep.value = data.clientRepresentative || "";
  if (editDelivery) editDelivery.value = data.deliveryDays || "10 a 15 días laborables";

  if (select && data.clientId) {
    select.value = data.clientId;
  }

  const container = document.getElementById("contractServicesContainer");
  if (container) {
    container.innerHTML = "";
    const svcs = data.services && data.services.length > 0 ? data.services : [];
    if (svcs.length === 0) {
      addContractServiceRow();
    } else {
      svcs.forEach(s => addContractServiceRow(s));
    }
  }

  if (contractId) {
    if (delBtn) delBtn.classList.remove("hidden");
    if (viewBtn) viewBtn.classList.remove("hidden");
  } else {
    if (delBtn) delBtn.classList.add("hidden");
    if (viewBtn) viewBtn.classList.add("hidden");
  }

  if (data.totalSetup !== undefined && data.totalSetup !== null && data.totalSetup > 0) {
    const totalSetupInput = document.getElementById("contractEditTotalSetup");
    if (totalSetupInput) totalSetupInput.value = data.totalSetup;
    handleManualTotalSetupChange();
  } else {
    recalcContractAmounts();
  }

  if (data.totalMonthly !== undefined && data.totalMonthly !== null) {
    const totalMonthlyInput = document.getElementById("contractEditMonthlyFee");
    if (totalMonthlyInput) totalMonthlyInput.value = data.totalMonthly;
  }

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

export function closeContractEditorModal() {
  const modal = document.getElementById("contractEditorModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

export function handleContractClientSelectChange() {
  const select = document.getElementById("contractEditClientSelect");
  if (!select) return;
  const client = state.clients.find(c => c.id === select.value);
  if (client) {
    const editRnc = document.getElementById("contractEditRnc");
    const editRep = document.getElementById("contractEditRepresentative");
    if (editRnc && client.rnc) editRnc.value = client.rnc;
    if (editRep && client.contactPerson) editRep.value = client.contactPerson;
  }
}

export function addContractServiceRow(svcData) {
  const container = document.getElementById("contractServicesContainer");
  if (!container) return;

  const svc = svcData || {
    name: "",
    type: "onetime",
    price: 0,
    deliverables: []
  };

  const rowId = "svc_row_" + Math.random().toString(36).substr(2, 9);
  const row = document.createElement("div");
  row.id = rowId;
  row.className = "p-3 rounded-lg bg-[#06080d] border border-white/10 space-y-2.5 relative group";

  const delivsText = Array.isArray(svc.deliverables) ? svc.deliverables.join("\n") : (svc.deliverables || "");

  row.innerHTML = `
    <div class="flex items-center gap-2">
      <input type="text" class="contract-svc-name flex-1 px-3 py-1.5 rounded bg-slate-900 border border-white/10 text-white font-bold text-xs focus:ring-1 focus:ring-cyan-400 focus:outline-none" placeholder="Nombre del servicio o entregable" value="${escapeHtml(svc.name || '')}" required />
      <select class="contract-svc-type px-2.5 py-1.5 rounded bg-slate-900 border border-white/10 text-cyan-300 font-mono text-xs focus:outline-none" onchange="recalcContractAmounts()">
        <option value="onetime" ${svc.type !== 'monthly' ? 'selected' : ''}>Setup Único</option>
        <option value="monthly" ${svc.type === 'monthly' ? 'selected' : ''}>Mensual</option>
      </select>
      <div class="flex items-center gap-1">
        <span class="text-slate-400 font-mono text-xs">RD$</span>
        <input type="number" class="contract-svc-price w-24 sm:w-28 px-2 py-1.5 rounded bg-slate-900 border border-white/10 text-emerald-400 font-mono font-bold text-xs text-right focus:outline-none" placeholder="0" value="${svc.price || 0}" oninput="recalcContractAmounts()" required />
      </div>
      <button type="button" onclick="removeContractServiceRow('${rowId}')" class="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-rose-500/10 transition-colors cursor-pointer" title="Quitar servicio">
        ✕
      </button>
    </div>
    <div>
      <textarea class="contract-svc-delivs w-full px-3 py-1.5 rounded bg-slate-950 border border-white/5 text-slate-300 text-[11px] font-sans focus:outline-none" rows="2" placeholder="Entregables específicos (uno por línea)...">${escapeHtml(delivsText)}</textarea>
    </div>
  `;

  container.appendChild(row);
  recalcContractAmounts();
}

export function removeContractServiceRow(rowId) {
  const row = document.getElementById(rowId);
  if (row) {
    row.remove();
    recalcContractAmounts();
  }
}

export function recalcContractAmounts() {
  const rows = document.querySelectorAll("#contractServicesContainer > div");
  let totalSetup = 0;
  let totalMonthly = 0;

  rows.forEach(r => {
    const typeSelect = r.querySelector(".contract-svc-type");
    const priceInput = r.querySelector(".contract-svc-price");
    const type = typeSelect ? typeSelect.value : "onetime";
    const price = priceInput ? (parseFloat(priceInput.value) || 0) : 0;

    if (type === "monthly") {
      totalMonthly += price;
    } else {
      totalSetup += price;
    }
  });

  const totalSetupInput = document.getElementById("contractEditTotalSetup");
  const totalMonthlyInput = document.getElementById("contractEditMonthlyFee");

  if (totalSetupInput) totalSetupInput.value = totalSetup;
  if (totalMonthlyInput) totalMonthlyInput.value = totalMonthly;

  handleManualTotalSetupChange();
}

export function handleManualTotalSetupChange() {
  const totalSetupInput = document.getElementById("contractEditTotalSetup");
  const totalSetup = totalSetupInput ? (parseFloat(totalSetupInput.value) || 0) : 0;

  const deposit = Math.round(totalSetup * 0.5);
  const completion = totalSetup - deposit;

  const depEl = document.getElementById("contractEditDepositDisplay");
  const compEl = document.getElementById("contractEditCompletionDisplay");

  if (depEl) depEl.textContent = `RD$ ${deposit.toLocaleString('es-DO')}`;
  if (compEl) compEl.textContent = `RD$ ${completion.toLocaleString('es-DO')}`;
}

export function handleManualMonthlyChange() {
  // Permite edición libre de la mensualidad sin sobreescrituras automáticas
}

export function saveContractFromModal(e) {
  if (e) e.preventDefault();

  const contractId = document.getElementById("contractEditId")?.value || ("ctr-" + Date.now());
  const contractNumber = document.getElementById("contractEditNumber")?.value.trim() || "CTR-2026-001";
  const clientSelect = document.getElementById("contractEditClientSelect");
  const clientId = clientSelect ? clientSelect.value : "";
  const clientObj = state.clients.find(c => c.id === clientId) || {};
  const clientName = clientObj.name || (clientSelect ? clientSelect.options[clientSelect.selectedIndex]?.text : "Cliente");
  const proposalId = document.getElementById("contractEditProposalId")?.value || null;
  const date = document.getElementById("contractEditDate")?.value.trim() || new Date().toLocaleDateString('es-DO');
  const rnc = document.getElementById("contractEditRnc")?.value.trim() || "";
  const representative = document.getElementById("contractEditRepresentative")?.value.trim() || "";
  const deliveryDays = document.getElementById("contractEditDeliveryDays")?.value.trim() || "10 a 15 días laborables";
  const totalSetup = parseFloat(document.getElementById("contractEditTotalSetup")?.value) || 0;
  const totalMonthly = parseFloat(document.getElementById("contractEditMonthlyFee")?.value) || 0;
  const depositAmount = Math.round(totalSetup * 0.5);
  const completionAmount = totalSetup - depositAmount;

  const rows = document.querySelectorAll("#contractServicesContainer > div");
  const services = [];
  rows.forEach(r => {
    const nameInput = r.querySelector(".contract-svc-name");
    const typeSelect = r.querySelector(".contract-svc-type");
    const priceInput = r.querySelector(".contract-svc-price");
    const delivsTextarea = r.querySelector(".contract-svc-delivs");

    const sName = nameInput ? nameInput.value.trim() : "";
    if (!sName) return;

    const sType = typeSelect ? typeSelect.value : "onetime";
    const sPrice = priceInput ? (parseFloat(priceInput.value) || 0) : 0;
    const sDelivsRaw = delivsTextarea ? delivsTextarea.value.trim() : "";
    const sDelivs = sDelivsRaw ? sDelivsRaw.split("\n").map(l => l.trim()).filter(Boolean) : [];

    services.push({
      name: sName,
      type: sType,
      price: sPrice,
      deliverables: sDelivs
    });
  });

  const existing = currentEditingContract || {};
  const contract = {
    id: contractId,
    contractNumber: contractNumber,
    clientId: clientId,
    clientName: clientName,
    clientRnc: rnc,
    clientRepresentative: representative,
    clientPhone: clientObj.phone || existing.clientPhone || "",
    clientEmail: clientObj.email || existing.clientEmail || "",
    proposalId: proposalId,
    date: date,
    deliveryDays: deliveryDays,
    status: existing.status && existing.status === 'signed' ? 'signed' : (existing.status || 'sent'),
    services: services,
    totalSetup: totalSetup,
    totalMonthly: totalMonthly,
    depositAmount: depositAmount,
    completionAmount: completionAmount,
    signedAt: existing.signedAt || null,
    signedBy: existing.signedBy || null,
    signerDocId: existing.signerDocId || null,
    signatureData: existing.signatureData || null,
    signatureHash: existing.signatureHash || null
  };

  saveContractToStorage(contract);
  closeContractEditorModal();

  if (clientObj.id && state.currentDrilldownClientId === clientObj.id) {
    renderRoadmapContractsTab(clientObj);
  }

  showToast(`¡Contrato ${contract.contractNumber} guardado con éxito!`, "success");
}

export function viewCurrentEditingContract() {
  if (!currentEditingContract) return;
  const url = generateContractUrl(currentEditingContract);
  window.open(url, '_blank');
}

export function deleteCurrentEditingContract() {
  if (!currentEditingContract) return;
  const id = currentEditingContract.id;
  closeContractEditorModal();
  deleteContractWithUndo(id);
}

export function deleteContractWithUndo(contractId) {
  const list = getStoredContracts();
  const index = list.findIndex(c => c.id === contractId);
  if (index === -1) return;

  const [removed] = list.splice(index, 1);
  localStorage.setItem(STORAGE_KEYS.CONTRACTS, JSON.stringify(list));

  if (state.currentDrilldownClientId) {
    const currentClient = state.clients.find(c => c.id === state.currentDrilldownClientId);
    if (currentClient) renderRoadmapContractsTab(currentClient);
  }

  const toastId = `undo_toast_contract_${contractId}`;
  const existingToast = document.getElementById(toastId);
  if (existingToast) existingToast.remove();

  let secondsLeft = 6;
  const toastEl = document.createElement("div");
  toastEl.id = toastId;
  toastEl.className = "fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#0f172a] text-white rounded-lg shadow-2xl border border-indigo-500/40 animate-in slide-in-from-bottom-5 duration-200";
  toastEl.innerHTML = `
    <div class="flex items-center gap-2 text-xs">
      <span class="text-rose-400">🗑️</span>
      <span>Contrato <strong class="text-white">${removed.contractNumber || removed.id}</strong> eliminado.</span>
    </div>
    <button onclick="undoContractDelete('${contractId}')" class="px-2.5 py-1 rounded bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm">
      Deshacer (<span id="undoContractCount_${contractId}">${secondsLeft}</span>s)
    </button>
    <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-white text-xs p-1 cursor-pointer transition-colors" title="Cerrar">✕</button>
  `;
  document.body.appendChild(toastEl);

  const intervalId = setInterval(() => {
    secondsLeft--;
    const countSpan = document.getElementById(`undoContractCount_${contractId}`);
    if (countSpan) countSpan.textContent = secondsLeft;
    if (secondsLeft <= 0) {
      clearInterval(intervalId);
      if (toastEl) toastEl.remove();
    }
  }, 1000);

  pendingContractDeletions.set(contractId, { item: removed, intervalId, toastEl });
}

export function undoContractDelete(contractId) {
  if (!pendingContractDeletions.has(contractId)) return;
  const { item, intervalId, toastEl } = pendingContractDeletions.get(contractId);
  clearInterval(intervalId);
  if (toastEl) toastEl.remove();
  pendingContractDeletions.delete(contractId);

  const list = getStoredContracts();
  list.unshift(item);
  localStorage.setItem(STORAGE_KEYS.CONTRACTS, JSON.stringify(list));

  if (state.currentDrilldownClientId) {
    const currentClient = state.clients.find(c => c.id === state.currentDrilldownClientId);
    if (currentClient) renderRoadmapContractsTab(currentClient);
  }
  showToast(`Contrato ${item.contractNumber || item.id} restaurado`, "success");
}

export function createContractFromProposal(proposalId, clientId) {
  let client = null;
  if (clientId) client = state.clients.find(c => c.id === clientId);

  let payload = null;
  try {
    const raw = localStorage.getItem("proposal_" + proposalId);
    if (raw) payload = JSON.parse(raw);
  } catch (e) {}

  const services = [];
  let totalSetup = 28000;
  let totalMonthly = 4500;

  if (payload) {
    const isCombo = payload.mode === 'comparison' && payload.offeredPackage && payload.offeredPackage.id !== 'pack-none' && payload.offeredPackage.id !== 'pack-custom';
    
    if (isCombo) {
      const pkg = payload.offeredPackage;
      services.push({
        name: pkg.title || 'Desarrollo Web & Plataforma',
        type: 'onetime',
        price: Number(pkg.price || payload.proposalSetup || 28000),
        deliverables: (pkg.deliverables && pkg.deliverables.length > 0) ? pkg.deliverables : [
          'Desarrollo frontend ultra-rápido en React 18 + Vite (<1s)',
          'Diseño responsive y catálogo optimizado para conversión',
          'Integración directa de canal transaccional de WhatsApp',
          'Despliegue Anycast Global con certificado SSL TLS 1.3'
        ]
      });

      const includedIds = pkg.includedAddonIds || [];
      const addons = payload.selectedServices || payload.addons || [];
      if (Array.isArray(addons)) {
        addons.forEach(a => {
          if (!includedIds.includes(a.id)) {
            services.push({
              name: a.name || 'Servicio Contratado',
              type: a.type === 'monthly' ? 'monthly' : 'onetime',
              price: Number(a.price || 0),
              deliverables: a.description ? [a.description] : [a.name]
            });
          }
        });
      }
    } else {
      // Modo A la Carta: Solo los servicios y módulos individuales seleccionados
      const addons = payload.selectedServices || payload.addons || [];
      if (Array.isArray(addons)) {
        addons.forEach(a => {
          services.push({
            name: a.name || 'Servicio Contratado',
            type: a.type === 'monthly' ? 'monthly' : 'onetime',
            price: Number(a.price || 0),
            deliverables: a.description ? [a.description] : [a.name]
          });
        });
      }
    }

    if (payload.proposalSetup !== undefined) totalSetup = Number(payload.proposalSetup);
    else if (payload.packageTotals?.setup !== undefined) totalSetup = Number(payload.packageTotals.setup);
    else if (payload.alacarteTotals?.setup !== undefined) totalSetup = Number(payload.alacarteTotals.setup);

    if (payload.proposalMonthly !== undefined) totalMonthly = Number(payload.proposalMonthly);
    else if (payload.packageTotals?.monthly !== undefined) totalMonthly = Number(payload.packageTotals.monthly);
    else if (payload.alacarteTotals?.monthly !== undefined) totalMonthly = Number(payload.alacarteTotals.monthly);
  }

  const existingContracts = getStoredContracts();
  const contractNum = `CTR-2026-${String(existingContracts.length + 1).padStart(3, '0')}`;

  const prefill = {
    id: "ctr-" + Date.now(),
    contractNumber: contractNum,
    clientId: client ? client.id : "",
    clientName: client ? client.name : (payload?.clientName || "Cliente"),
    clientRnc: client ? (client.rnc || "") : "",
    clientRepresentative: client ? (client.contactPerson || "") : "",
    clientPhone: client ? (client.phone || "") : (payload?.clientPhone || ""),
    clientEmail: client ? (client.email || "") : (payload?.clientEmail || ""),
    proposalId: proposalId,
    date: new Date().toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' }),
    deliveryDays: "10 a 15 días laborables",
    status: "draft",
    services: services,
    totalSetup: totalSetup,
    totalMonthly: totalMonthly,
    depositAmount: Math.round(totalSetup * 0.5),
    completionAmount: Math.round(totalSetup * 0.5)
  };

  openContractEditorModal(null, prefill);
}
