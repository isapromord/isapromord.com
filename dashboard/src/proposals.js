/**
 * ISAPromoRD - Proposals Engine & A La Carte Calculator
 * Custom pricing, packages, ROI calculator, proposal history, WhatsApp link,
 * and seamless bridging into the 50/50 contracts generator.
 */
import { 
  state, 
  STORAGE_KEYS, 
  PROPOSAL_BASE_PACKAGES, 
  PROPOSAL_ADDONS,
  FACTORY_BASE_PACKAGES,
  FACTORY_ADDONS,
  saveMasterCatalog,
  resetMasterCatalog
} from './state.js';
import { supabaseClient, syncVaultToCloud } from './sync.js';
import { showToast, escapeHtml } from './ui.js';

let currentProposalAddons = JSON.parse(JSON.stringify(PROPOSAL_ADDONS));
let customPackageOverrides = {};
let lastGeneratedProposalUrl = "";
let lastGeneratedProposalData = null;
const pendingProposalDeletions = new Map();

export function getPackageData(pkgKey) {
  const base = PROPOSAL_BASE_PACKAGES[pkgKey] || PROPOSAL_BASE_PACKAGES["pack-ia"] || PROPOSAL_BASE_PACKAGES["pack-esencial"];
  const override = customPackageOverrides[pkgKey] || {};
  return {
    ...base,
    ...override,
    price: override.price !== undefined ? override.price : base.price,
    monthlyPrice: override.monthlyPrice !== undefined ? override.monthlyPrice : base.monthlyPrice,
    title: override.title !== undefined ? override.title : base.title
  };
}

export function initProposalBuilder() {
  const select = document.getElementById("proposalClientSelect");
  if (!select) return;

  const clients = state.clients || [];
  select.innerHTML = `
    <option value="">-- Seleccionar de clientes --</option>
    ${clients.map(c => `<option value="${escapeHtml(c.name)}">${escapeHtml(c.name)}</option>`).join('')}
    <option value="__custom__">➕ Escribir cliente nuevo...</option>
  `;

  if (clients.length > 0) {
    select.value = clients[0].name;
    const catInput = document.getElementById("proposalCategory");
    if (catInput) catInput.value = clients[0].category || "";
    const phoneInput = document.getElementById("proposalClientPhone");
    if (phoneInput) phoneInput.value = clients[0].phone || "";
  }

  ['pack-esencial', 'pack-ia', 'pack-ecosistema'].forEach(key => updatePackageCardDisplay(key));
  handlePackageSelect('pack-ia');
  renderProposalsHistory();
}

export function handleProposalClientSelect() {
  const select = document.getElementById("proposalClientSelect");
  const customInput = document.getElementById("proposalClientCustom");
  const categoryInput = document.getElementById("proposalCategory");
  const phoneInput = document.getElementById("proposalClientPhone");
  if (!select) return;

  if (select.value === "__custom__") {
    if (customInput) {
      customInput.classList.remove("hidden");
      customInput.focus();
    }
    if (categoryInput) categoryInput.value = "";
    if (phoneInput) phoneInput.value = "";
  } else {
    if (customInput) customInput.classList.add("hidden");
    const found = state.clients.find(c => c.name === select.value);
    if (found) {
      if (categoryInput) categoryInput.value = found.category || "";
      if (phoneInput) phoneInput.value = found.phone || "";
    }
  }
}

export function syncPackageCustomizerUI() {
  const selectedBaseKey = document.querySelector('input[name="basePkg"]:checked')?.value || "pack-ia";
  const customizerEl = document.getElementById("proposalPackageCustomizer");
  if (!customizerEl) return;

  if (selectedBaseKey === 'pack-none') {
    customizerEl.classList.add("hidden");
    return;
  }

  customizerEl.classList.remove("hidden");
  const pkg = getPackageData(selectedBaseKey);

  const titleInput = document.getElementById("pkgCustomTitle");
  const setupInput = document.getElementById("pkgCustomSetupPrice");
  const monthlyInput = document.getElementById("pkgCustomMonthlyPrice");
  const activeTitle = document.getElementById("pkgCustomizerActiveTitle");
  const badge = document.getElementById("pkgCustomModifiedBadge");

  if (titleInput) titleInput.value = pkg.title || "";
  if (setupInput) setupInput.value = pkg.price !== undefined ? pkg.price : "";
  if (monthlyInput) monthlyInput.value = pkg.monthlyPrice !== undefined ? pkg.monthlyPrice : "";
  if (activeTitle) activeTitle.textContent = pkg.title || "";

  const isModified = !!customPackageOverrides[selectedBaseKey]?.isCustom;
  if (badge) {
    if (isModified) badge.classList.remove("hidden");
    else badge.classList.add("hidden");
  }
}

export function updatePackageCardDisplay(pkgKey) {
  const pkg = getPackageData(pkgKey);
  const priceEl = document.getElementById(`pkgCardPrice_${pkgKey}`);
  const monthlyEl = document.getElementById(`pkgCardMonthly_${pkgKey}`);
  const titleEl = document.getElementById(`pkgCardTitle_${pkgKey}`);

  if (priceEl && pkg.price !== undefined) {
    priceEl.innerHTML = `RD$ ${pkg.price.toLocaleString('es-DO')} <span class="text-xs font-normal text-slate-400">setup</span>`;
  }
  if (monthlyEl && pkg.monthlyPrice !== undefined) {
    monthlyEl.innerHTML = `+ RD$ ${pkg.monthlyPrice.toLocaleString('es-DO')} <span class="font-normal text-[11px] text-slate-400">/ mes</span>`;
  }
  if (titleEl && pkg.title) {
    titleEl.textContent = pkg.title;
  }
}

export function updateCustomPackagePrice(setupPrice, monthlyPrice, customTitle) {
  const selectedBaseKey = document.querySelector('input[name="basePkg"]:checked')?.value || "pack-ia";
  if (selectedBaseKey === 'pack-none') return;

  if (!customPackageOverrides[selectedBaseKey]) {
    customPackageOverrides[selectedBaseKey] = {};
  }

  if (setupPrice !== undefined && setupPrice !== null && setupPrice !== '') {
    customPackageOverrides[selectedBaseKey].price = Math.max(0, Number(setupPrice) || 0);
  }
  if (monthlyPrice !== undefined && monthlyPrice !== null && monthlyPrice !== '') {
    customPackageOverrides[selectedBaseKey].monthlyPrice = Math.max(0, Number(monthlyPrice) || 0);
  }
  if (customTitle !== undefined && customTitle !== null) {
    customPackageOverrides[selectedBaseKey].title = customTitle.trim();
  }
  customPackageOverrides[selectedBaseKey].isCustom = true;

  updatePackageCardDisplay(selectedBaseKey);
  syncPackageCustomizerUI();
  updateProposalTotals();
}

export function resetCurrentPackagePrice() {
  const selectedBaseKey = document.querySelector('input[name="basePkg"]:checked')?.value || "pack-ia";
  if (customPackageOverrides[selectedBaseKey]) {
    delete customPackageOverrides[selectedBaseKey];
  }
  const original = PROPOSAL_BASE_PACKAGES[selectedBaseKey];
  if (original) {
    updatePackageCardDisplay(selectedBaseKey);
  }
  syncPackageCustomizerUI();
  updateProposalTotals();
  showToast("Precio y título del paquete restaurados a los valores oficiales.", "info");
}

const expandedProposalAddonIds = new Set();

export function toggleProposalAddonDetails(id) {
  if (expandedProposalAddonIds.has(id)) {
    expandedProposalAddonIds.delete(id);
  } else {
    expandedProposalAddonIds.add(id);
  }
  renderProposalAddonsList();
}

export function renderProposalAddonsList() {
  const container = document.getElementById("proposalAddonsList");
  if (!container) return;

  const selectedBaseKey = document.querySelector('input[name="basePkg"]:checked')?.value || "pack-ia";
  const basePkg = getPackageData(selectedBaseKey);
  const includedIds = basePkg?.includedAddonIds || [];

  container.innerHTML = currentProposalAddons.map(addon => {
    const isEditing = !!addon.isEditing;
    const isExpanded = expandedProposalAddonIds.has(addon.id);

    if (isEditing) {
      return `
        <div class="p-3.5 rounded-lg bg-[#0d1424] border border-cyan-500/40 shadow-lg space-y-3 animate-in fade-in duration-150">
          <div class="flex items-center justify-between gap-2 border-b border-white/[0.06] pb-2">
            <span class="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <span>✏️</span> Editando Servicio: <strong class="text-white">${escapeHtml(addon.name)}</strong>
            </span>
            <div class="flex items-center gap-1.5">
              ${addon.isCustom ? `
                <button type="button" onclick="deleteCustomProposalService('${addon.id}')" class="px-2 py-1 rounded bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-[11px] font-bold transition-all cursor-pointer" title="Eliminar servicio">
                  🗑️ Eliminar
                </button>
              ` : ''}
              <button type="button" onclick="cancelEditProposalAddon('${addon.id}')" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1" title="Descartar cambios y conservar el valor que ya tenía">
                ✕ Cancelar
              </button>
              <button type="button" onclick="saveEditProposalAddon('${addon.id}')" class="px-3 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black transition-all cursor-pointer shadow-md shadow-cyan-500/20">
                ✓ Listo
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nombre / Título del Servicio *</label>
              <input 
                type="text" 
                value="${escapeHtml(addon.name)}" 
                oninput="updateProposalAddonField('${addon.id}', 'name', this.value)" 
                placeholder="Nombre del servicio o módulo" 
                class="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-white font-bold focus:ring-1 focus:ring-cyan-400 focus:outline-none"
              />
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Precio RD$ *</label>
                <input 
                  type="number" 
                  min="0" 
                  step="500" 
                  value="${addon.price !== undefined ? addon.price : 0}" 
                  oninput="updateProposalAddonField('${addon.id}', 'price', this.value)" 
                  class="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-emerald-400 font-mono font-bold focus:ring-1 focus:ring-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tipo de Cobro *</label>
                <select 
                  onchange="updateProposalAddonField('${addon.id}', 'type', this.value)" 
                  class="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:ring-1 focus:ring-cyan-400 focus:outline-none cursor-pointer"
                >
                  <option value="onetime" ${addon.type === 'onetime' ? 'selected' : ''}>Pago Único</option>
                  <option value="monthly" ${addon.type === 'monthly' ? 'selected' : ''}>Mensual (/mes)</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Descripción del Servicio / Entregable</label>
            <textarea 
              rows="2" 
              oninput="updateProposalAddonField('${addon.id}', 'description', this.value)" 
              placeholder="Detalle de qué incluye este servicio..." 
              class="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
            >${escapeHtml(addon.description || '')}</textarea>
          </div>
        </div>
      `;
    }

    const isInCombo = selectedBaseKey !== 'pack-none' && includedIds.includes(addon.id);

    return `
      <div class="group px-4 py-2.5 transition-all ${addon.checked ? 'bg-cyan-500/[0.03]' : 'opacity-60 hover:opacity-100'} hover:bg-white/[0.02]">
        <div class="flex items-center justify-between gap-3">
          
          <!-- Lado Izquierdo: Título y detalles -->
          <div class="flex items-center gap-2 min-w-0 flex-1 cursor-pointer select-none" onclick="toggleProposalAddon('${addon.id}')">
            <span class="text-xs font-semibold ${addon.checked ? 'text-white font-bold' : 'text-slate-300'} truncate group-hover:text-cyan-300 transition-colors">
              ${escapeHtml(addon.name)}
            </span>

            ${isInCombo ? `
              <span class="text-[10px] font-mono text-emerald-400 font-semibold shrink-0" title="Incluido en el paquete base seleccionado">
                • combo
              </span>
            ` : ''}

            ${addon.isCustom ? `
              <span class="text-[9px] font-bold text-purple-300 bg-purple-500/15 px-1.5 py-0.2 rounded border border-purple-500/25 shrink-0">
                Personalizado
              </span>
            ` : ''}

            <!-- Botón sutil desplegar descripción -->
            <button 
              type="button" 
              onclick="event.stopPropagation(); toggleProposalAddonDetails('${addon.id}')"
              class="text-[10px] text-slate-500 hover:text-cyan-300 px-1 py-0.5 rounded transition-colors shrink-0"
              title="${isExpanded ? 'Ocultar explicación' : 'Ver explicación breve'}"
            >
              ${isExpanded ? '▲' : 'ℹ️'}
            </button>
          </div>

          <!-- Lado Derecho: Inversión, lápiz y switch -->
          <div class="flex items-center gap-3 shrink-0">
            
            <!-- Inversión -->
            <div class="text-right">
              <span class="font-mono font-bold text-xs ${addon.checked ? 'text-white' : 'text-slate-400'}">
                RD$ ${(addon.price || 0).toLocaleString('es-DO')}
              </span>
              <span class="text-[10px] ${addon.type === 'monthly' ? 'text-amber-400/90' : 'text-slate-400'} font-mono ml-0.5">
                ${addon.type === 'monthly' ? '/m' : 'u'}
              </span>
            </div>

            <!-- Botón Editar Inline -->
            <button 
              type="button" 
              onclick="toggleEditProposalAddon('${addon.id}')" 
              class="p-1 rounded text-slate-500 hover:text-cyan-300 hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" 
              title="Editar precio o textos de este servicio"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            </button>

            <!-- Switch Toggle Moderno (Sin cuadros) -->
            <button 
              type="button" 
              role="switch" 
              aria-checked="${addon.checked ? 'true' : 'false'}"
              onclick="toggleProposalAddon('${addon.id}')" 
              class="w-8 h-4.5 rounded-full transition-colors relative cursor-pointer focus:outline-none flex items-center px-0.5 ${addon.checked ? 'bg-cyan-500 shadow-sm shadow-cyan-500/20' : 'bg-slate-700'}"
              title="${addon.checked ? 'Activo (Clic para desactivar)' : 'Inactivo (Clic para activar)'}"
            >
              <span class="block w-3.5 h-3.5 rounded-full bg-white transition-transform shadow-sm ${addon.checked ? 'translate-x-3.5' : 'translate-x-0'}"></span>
            </button>

          </div>
        </div>

        <!-- Párrafo explicativo desplegado bajo demanda -->
        ${isExpanded ? `
          <div class="mt-2 pt-2 border-t border-white/[0.04] text-[11px] text-slate-400 pl-1 leading-relaxed">
            ${escapeHtml(addon.description || 'Sin descripción detallada.')}
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

export function toggleEditProposalAddon(id) {
  const addon = currentProposalAddons.find(a => a.id === id);
  if (!addon) return;

  if (!addon.isEditing) {
    // Entrar a edición: respaldar valores actuales
    addon._backup = {
      name: addon.name,
      price: addon.price,
      type: addon.type,
      description: addon.description
    };
    addon.isEditing = true;
    renderProposalAddonsList();
  } else {
    saveEditProposalAddon(id);
  }
}

export function saveEditProposalAddon(id) {
  const addon = currentProposalAddons.find(a => a.id === id);
  if (addon) {
    delete addon._backup;
    addon.isEditing = false;
    delete addon.isNew;
    renderProposalAddonsList();
    updateProposalTotals();
    showToast("✓ Cambios guardados para este servicio", "success");
  }
}

export function cancelEditProposalAddon(id) {
  const addon = currentProposalAddons.find(a => a.id === id);
  if (addon) {
    if (addon.isNew) {
      deleteCustomProposalService(id);
      return;
    }
    if (addon._backup) {
      addon.name = addon._backup.name;
      addon.price = addon._backup.price;
      addon.type = addon._backup.type;
      addon.description = addon._backup.description;
      delete addon._backup;
    }
    addon.isEditing = false;
    renderProposalAddonsList();
    updateProposalTotals();
    showToast("✕ Edición cancelada. Se mantuvo el valor anterior.", "info");
  }
}

export function updateProposalAddonField(id, field, value) {
  const addon = currentProposalAddons.find(a => a.id === id);
  if (!addon) return;

  if (field === 'price') {
    addon.price = Math.max(0, Number(value) || 0);
  } else if (field === 'type') {
    addon.type = value === 'monthly' ? 'monthly' : 'onetime';
  } else if (field === 'name') {
    addon.name = value;
  } else if (field === 'description') {
    addon.description = value;
  }

  if (field === 'price' || field === 'type') {
    updateProposalTotals();
  }
}

export function addCustomProposalService() {
  const newId = "custom-" + Date.now();
  currentProposalAddons.unshift({
    id: newId,
    name: "Servicio Personalizado Adicional",
    description: "Detalle y alcance del servicio acordado con el cliente.",
    price: 15000,
    type: "onetime",
    checked: true,
    isCustom: true,
    isEditing: true
  });
  renderProposalAddonsList();
  updateProposalTotals();
  showToast("✨ Nuevo servicio creado. Puedes personalizar su título y precio.", "success");
}

export function deleteCustomProposalService(id) {
  const index = currentProposalAddons.findIndex(a => a.id === id);
  if (index !== -1) {
    currentProposalAddons.splice(index, 1);
    renderProposalAddonsList();
    updateProposalTotals();
    showToast("Servicio eliminado de la propuesta.", "info");
  }
}

export function resetProposalAddonsCatalog() {
  currentProposalAddons = JSON.parse(JSON.stringify(PROPOSAL_ADDONS));
  customPackageOverrides = {};
  const selectedBaseKey = document.querySelector('input[name="basePkg"]:checked')?.value || "pack-ia";
  ['pack-esencial', 'pack-ia', 'pack-ecosistema'].forEach(key => updatePackageCardDisplay(key));
  handlePackageSelect(selectedBaseKey);
  renderProposalAddonsList();
  updateProposalTotals();
  showToast("↺ Catálogo y precios de paquetes restaurados a los valores oficiales.", "success");
}

export function handlePackageSelect(pkgKey) {
  const basePkg = PROPOSAL_BASE_PACKAGES[pkgKey];
  if (basePkg && basePkg.includedAddonIds) {
    currentProposalAddons.forEach(a => {
      a.checked = basePkg.includedAddonIds.includes(a.id);
    });
    renderProposalAddonsList();
  }
  syncPackageCustomizerUI();
  updateProposalTotals();
}

export function toggleProposalAddon(id) {
  const addon = currentProposalAddons.find(a => a.id === id);
  if (addon) {
    addon.checked = !addon.checked;
    renderProposalAddonsList();
    updateProposalTotals();
  }
}

export function applyAuditPreselectionToProposal(addonIds = []) {
  if (!Array.isArray(addonIds) || addonIds.length === 0) return;
  const radioNone = document.querySelector('input[name="basePkg"][value="pack-none"]');
  if (radioNone) radioNone.checked = true;
  currentProposalAddons.forEach(a => {
    a.checked = addonIds.includes(a.id);
  });
  renderProposalAddonsList();
  syncPackageCustomizerUI();
  updateProposalTotals();
}

export function updateProposalTotals() {
  let alacarteSetup = 0;
  let alacarteMonthly = 0;

  currentProposalAddons.forEach(a => {
    if (a.checked) {
      if (a.type === "monthly") alacarteMonthly += (a.price || 0);
      else alacarteSetup += (a.price || 0);
    }
  });

  const badge = document.getElementById("alacarteSubtotalBadge");
  if (badge) {
    badge.textContent = `A la Carta: RD$ ${alacarteSetup.toLocaleString('es-DO')} setup + RD$ ${alacarteMonthly.toLocaleString('es-DO')}/mes`;
  }

  const selectedBaseKey = document.querySelector('input[name="basePkg"]:checked')?.value || "pack-ia";
  const basePkg = getPackageData(selectedBaseKey);

  const elCompAlacarteTotal = document.getElementById("compAlacarteTotal");
  const elCompAlacarteMonthly = document.getElementById("compAlacarteMonthly");
  const elCompPackageTotal = document.getElementById("compPackageTotal");
  const elCompPackageMonthly = document.getElementById("compPackageMonthly");
  const elCompSavingsTotal = document.getElementById("compSavingsTotal");
  const elCompSavingsMonthly = document.getElementById("compSavingsMonthly");

  if (elCompAlacarteTotal) elCompAlacarteTotal.textContent = `RD$ ${alacarteSetup.toLocaleString('es-DO')}`;
  if (elCompAlacarteMonthly) elCompAlacarteMonthly.textContent = `+ RD$ ${alacarteMonthly.toLocaleString('es-DO')}/mes`;

  let finalSetup = 0;
  let finalMonthly = 0;

  if (selectedBaseKey === 'pack-none') {
    if (elCompPackageTotal) elCompPackageTotal.textContent = "Sin paquete";
    if (elCompPackageMonthly) elCompPackageMonthly.textContent = "Solo a la carta";
    if (elCompSavingsTotal) elCompSavingsTotal.textContent = "Cotización Regular";
    if (elCompSavingsMonthly) elCompSavingsMonthly.textContent = "Sin combo comparativo";

    finalSetup = alacarteSetup;
    finalMonthly = alacarteMonthly;
  } else {
    const pkgSetup = basePkg.price !== undefined ? basePkg.price : 0;
    const pkgMonthly = basePkg.monthlyPrice || 0;

    if (elCompPackageTotal) elCompPackageTotal.textContent = `RD$ ${pkgSetup.toLocaleString('es-DO')}`;
    if (elCompPackageMonthly) elCompPackageMonthly.textContent = `+ RD$ ${pkgMonthly.toLocaleString('es-DO')}/mes`;

    const diffSetup = alacarteSetup - pkgSetup;
    const diffMonthly = alacarteMonthly - pkgMonthly;

    if (elCompSavingsTotal) {
      if (diffSetup > 0) {
        elCompSavingsTotal.textContent = `Ahorra RD$ ${diffSetup.toLocaleString('es-DO')}`;
      } else {
        elCompSavingsTotal.textContent = `Mejor Valor Combo`;
      }
    }

    if (elCompSavingsMonthly) {
      if (diffMonthly > 0) {
        elCompSavingsMonthly.textContent = `+ Ahorra RD$ ${diffMonthly.toLocaleString('es-DO')}/mes`;
      } else {
        elCompSavingsMonthly.textContent = `en mantenimiento recurrente`;
      }
    }

    finalSetup = pkgSetup;
    finalMonthly = pkgMonthly;
  }

  const elOnetime = document.getElementById("proposalOnetimeTotal");
  if (elOnetime) elOnetime.textContent = `RD$ ${finalSetup.toLocaleString('es-DO')}`;
  const elMonthly = document.getElementById("proposalMonthlyTotal");
  if (elMonthly) elMonthly.textContent = `RD$ ${finalMonthly.toLocaleString('es-DO')} / mes`;
}

export function handleGenerateProposal(e) {
  if (e && e.preventDefault) e.preventDefault();

  const select = document.getElementById("proposalClientSelect");
  const customInput = document.getElementById("proposalClientCustom");
  let clientName = select?.value === "__custom__" ? customInput?.value.trim() : select?.value;
  if (!clientName) clientName = "Cliente Estimado";

  const catEl = document.getElementById("proposalCategory");
  const category = catEl?.value.trim() || "Servicios Comerciales";
  const selectedBaseKey = document.querySelector('input[name="basePkg"]:checked')?.value || "pack-ia";
  const basePkg = getPackageData(selectedBaseKey);

  const selectedServices = currentProposalAddons.filter(a => a.checked).map(a => ({ ...a, isEditing: false }));

  let alacarteSetup = 0;
  let alacarteMonthly = 0;
  selectedServices.forEach(a => {
    if (a.type === "monthly") alacarteMonthly += (a.price || 0);
    else alacarteSetup += (a.price || 0);
  });

  const isComparison = selectedBaseKey !== 'pack-none';
  const offeredPkg = isComparison ? basePkg : null;
  const pkgSetup = isComparison ? (basePkg.price || 0) : alacarteSetup;
  const pkgMonthly = isComparison ? (basePkg.monthlyPrice || 0) : alacarteMonthly;

  const diffSetup = isComparison ? Math.max(0, alacarteSetup - pkgSetup) : 0;
  const diffMonthly = isComparison ? Math.max(0, alacarteMonthly - pkgMonthly) : 0;

  const today = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const dateFormatted = today.toLocaleDateString('es-DO', options);

  const focusMode = document.getElementById("proposalFocusOption")?.value || "auto";
  let hideStrategicFocus = false;
  let customFocusTitle = "";
  let customFocusSubtitle = "";
  let customFocusBody = "";

  if (focusMode === "hidden") {
    hideStrategicFocus = true;
  } else if (focusMode === "custom") {
    customFocusTitle = document.getElementById("proposalFocusCustomTitle")?.value.trim() || "";
    customFocusSubtitle = document.getElementById("proposalFocusCustomSub")?.value.trim() || "";
    customFocusBody = document.getElementById("proposalFocusCustomBody")?.value.trim() || "";
  } else if (focusMode === "web") {
    customFocusTitle = "Enfoque Comercial: Plataforma Web de Alta Conversión & Velocidad";
    customFocusSubtitle = `Diseñado para proyectar la identidad de ${clientName} y maximizar conversiones directas.`;
    customFocusBody = `Más del <strong>80% de los visitantes abandona un sitio web si tarda más de 3 segundos en cargar</strong>. Esta propuesta implementa una plataforma digital moderna, ultrarrápida (<1s) y optimizada para dispositivos móviles, diseñada para proyectar la máxima exclusividad y canalizar cada interacción directamente a compras y consultas vía WhatsApp.`;
  } else if (focusMode === "google") {
    customFocusTitle = "Enfoque Comercial: Posicionamiento en Google & Retorno de Inversión";
    customFocusSubtitle = "Diseñado para captar clientes con alta intención de compra en República Dominicana.";
    customFocusBody = `En República Dominicana, el <strong>92% de los usuarios de smartphones</strong> busca servicios locales en Google y el <strong>75% genera una llamada, mensaje de WhatsApp o visita en menos de 24 horas</strong>. Esta propuesta está diseñada para posicionar tu negocio en las primeras posiciones de Google Search y Google Maps, canalizando la demanda transaccional directamente hacia tu WhatsApp y equipo de ventas.`;
  } else if (focusMode === "crm") {
    customFocusTitle = "Enfoque Operativo: Control, Automatización & Eficiencia";
    customFocusSubtitle = `Optimización de procesos comerciales y gestión de operaciones para ${clientName}.`;
    customFocusBody = `Esta propuesta está diseñada para <strong>eliminar tiempos muertos, centralizar información y automatizar flujos operativos</strong>. Permite a tu equipo registrar clientes, controlar inventarios y dar seguimiento a pedidos con trazabilidad total y métricas en tiempo real.`;
  }

  const proposalPayload = {
    id: "prop-" + Date.now(),
    clientName: clientName,
    clientCategory: category,
    dateStr: dateFormatted,
    validity: "15 Días Hábiles",
    mode: isComparison ? 'comparison' : 'alacarte',
    selectedServices: selectedServices,
    alacarteTotals: {
      setup: alacarteSetup,
      monthly: alacarteMonthly
    },
    offeredPackage: offeredPkg,
    packageTotals: {
      setup: pkgSetup,
      monthly: pkgMonthly
    },
    savings: {
      setup: diffSetup,
      monthly: diffMonthly
    },
    proposalSetup: isComparison ? pkgSetup : alacarteSetup,
    proposalMonthly: isComparison ? pkgMonthly : alacarteMonthly,
    basePackage: isComparison ? basePkg : { id: 'pack-custom', title: 'Cotización A la Carta', price: alacarteSetup, monthlyPrice: alacarteMonthly, deliverables: [] },
    addons: selectedServices,
    strategicFocusMode: focusMode,
    hideStrategicFocus: hideStrategicFocus,
    customFocusTitle: customFocusTitle,
    customFocusSubtitle: customFocusSubtitle,
    customFocusBody: customFocusBody
  };

  lastGeneratedProposalData = proposalPayload;
  localStorage.setItem(`proposal_${proposalPayload.id}`, JSON.stringify(proposalPayload));

  const origin = window.location.origin;
  const pathname = window.location.pathname.replace(/\/dashboard(\/.*)?$/, '');
  
  const clientSlug = clientName.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  let fullUrl = "";
  if (clientSlug.includes("pasion-pecuaria") || clientSlug.includes("pasionpecuaria")) {
    fullUrl = `${origin}${pathname}/propuestas/pasionpecuaria/`;
  } else {
    const shortPlan = selectedBaseKey.replace(/^pack-/, '');
    const jsonStr = JSON.stringify(proposalPayload);
    const dataParam = btoa(unescape(encodeURIComponent(jsonStr)));
    fullUrl = `${origin}${pathname}/propuesta/?cliente=${encodeURIComponent(clientName)}&plan=${shortPlan}&id=${proposalPayload.id}&d=${dataParam}`;
  }
  
  const downloadPdfUrl = fullUrl.includes('?') ? `${fullUrl}&download=1` : `${fullUrl}?download=1`;
  lastGeneratedProposalUrl = fullUrl;

  const clientNameNorm = clientName.trim().toLowerCase();
  const matchedClient = state.clients.find(c => 
    (c.name && c.name.trim().toLowerCase() === clientNameNorm) || 
    (select?.value !== "__custom__" && c.name === select?.value)
  );
  const matchedClientId = matchedClient ? matchedClient.id : null;
  proposalPayload.clientId = matchedClientId;

  const nowIso = new Date().toISOString();
  saveProposalToHistory({
    id: proposalPayload.id,
    clientId: matchedClientId,
    clientName: clientName,
    category: category,
    status: 'draft',
    date: nowIso.split('T')[0],
    createdAt: nowIso,
    onetime: isComparison ? pkgSetup : alacarteSetup,
    monthly: isComparison ? pkgMonthly : alacarteMonthly,
    url: fullUrl,
    basePackageKey: selectedBaseKey,
    packageTitle: isComparison ? basePkg.title : 'A la Carta',
    deliverablesCount: (isComparison ? basePkg.deliverables.length : 0) + selectedServices.length
  });

  saveProposalToCloud({
    id: proposalPayload.id,
    clientName: clientName,
    category: category,
    onetime: isComparison ? pkgSetup : alacarteSetup,
    monthly: isComparison ? pkgMonthly : alacarteMonthly,
    url: fullUrl,
    createdAt: nowIso
  });

  const genLinkInput = document.getElementById("generatedLinkInput");
  if (genLinkInput) genLinkInput.value = fullUrl;
  const resClient = document.getElementById("modalResClient");
  if (resClient) resClient.textContent = clientName;
  const resAlacarte = document.getElementById("modalResAlacarte");
  if (resAlacarte) resAlacarte.textContent = `RD$ ${alacarteSetup.toLocaleString('es-DO')} setup + RD$ ${alacarteMonthly.toLocaleString('es-DO')}/mes`;
  const resPackage = document.getElementById("modalResPackage");
  if (resPackage) resPackage.textContent = isComparison ? `${basePkg.title} (RD$ ${pkgSetup.toLocaleString('es-DO')} setup)` : 'Solo A la Carta';
  
  const savingsRow = document.getElementById("modalResSavingsRow");
  if (savingsRow) {
    if (isComparison && (diffSetup > 0 || diffMonthly > 0)) {
      savingsRow.classList.remove("hidden");
      const resSavings = document.getElementById("modalResSavings");
      if (resSavings) resSavings.textContent = `RD$ ${diffSetup > 0 ? diffSetup.toLocaleString('es-DO') + ' setup' : ''} ${diffMonthly > 0 ? '+ RD$ ' + diffMonthly.toLocaleString('es-DO') + '/mes' : ''}`;
    } else {
      savingsRow.classList.add("hidden");
    }
  }

  const openBtn = document.getElementById("modalResOpenBtn");
  if (openBtn) openBtn.href = fullUrl;
  const pdfBtn = document.getElementById("modalResPdfBtn");
  if (pdfBtn) pdfBtn.href = downloadPdfUrl;

  let waMessage = `Hola ${clientName}, un placer saludarte.\n\nDesde *ISAPromoRD* te hemos preparado una *Propuesta Digital Interactiva* personalizada`;
  if (isComparison && diffSetup > 0) {
    waMessage += ` donde podrás comparar la cotización de los servicios solicitados frente a la opción en combo con un *ahorro de RD$ ${diffSetup.toLocaleString('es-DO')} en setup*:\n\n`;
  } else {
    waMessage += ` con el detalle y alcance de los servicios para tu negocio:\n\n`;
  }
  waMessage += `👉 Abre tu propuesta en vivo aquí:\n${fullUrl}\n\nEn este enlace interactivo puedes revisar el alcance de cada módulo, ver la comparativa de inversión y aprobarla o descargarla en PDF con un clic. Quedo atento a tus comentarios.`;

  const phoneInput = document.getElementById("proposalClientPhone");
  let rawPhone = phoneInput ? phoneInput.value.replace(/[^0-9]/g, '') : "";
  let waTarget = "";
  if (rawPhone.length >= 10) {
    const cleanNumber = rawPhone.length === 10 ? ('1' + rawPhone) : rawPhone;
    waTarget = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(waMessage)}`;
  } else {
    waTarget = `https://wa.me/?text=${encodeURIComponent(waMessage)}`;
  }
  const waBtn = document.getElementById("modalResWhatsappBtn");
  if (waBtn) waBtn.href = waTarget;

  const roadmapBox = document.getElementById("modalResRoadmapBox");
  const roadmapBtn = document.getElementById("modalResRoadmapBtn");
  if (roadmapBox) {
    if (matchedClient) {
      roadmapBox.classList.remove("hidden");
      const totalDelivs = (isComparison ? basePkg.deliverables.length : 0) + selectedServices.length;
      if (roadmapBtn) {
        roadmapBtn.innerHTML = `<span>🚀 Activar ${totalDelivs} Entregables en Roadmap de ${escapeHtml(matchedClient.name)}</span>`;
      }
    } else {
      roadmapBox.classList.add("hidden");
    }
  }

  const modal = document.getElementById("proposalResultModal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

export function closeProposalResultModal() {
  const modal = document.getElementById("proposalResultModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

export function copyGeneratedProposalLink() {
  const input = document.getElementById("generatedLinkInput");
  if (!input) return;
  input.select();
  navigator.clipboard.writeText(input.value).then(() => {
    const btn = document.getElementById("copyProposalLinkBtn");
    if (btn) {
      const original = btn.textContent;
      btn.textContent = "¡Copiado!";
      setTimeout(() => btn.textContent = original, 2000);
    }
  });
}

export function getStoredProposals() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.proposals) || "[]");
  } catch (e) {
    return [];
  }
}

export function saveProposalToHistory(proposal) {
  const list = getStoredProposals();
  list.unshift(proposal);
  localStorage.setItem(STORAGE_KEYS.proposals, JSON.stringify(list));
  syncVaultToCloud();
  renderProposalsHistory();
}

export function renderProposalsHistory() {
  const container = document.getElementById("proposalsHistoryContainer");
  if (!container) return;

  const list = getStoredProposals();
  const countBadge = document.getElementById("proposalsCountBadge");
  if (countBadge) countBadge.textContent = list.length;

  if (list.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-slate-400">
        <p class="text-sm">No hay propuestas generadas todavía.</p>
        <p class="text-xs text-slate-400 mt-1">Configura las opciones en el formulario para emitir una cotización formal.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(item => {
    const timeFormatted = formatProposalTimestamp(item);
    const isApproved = item.status === 'approved';
    const statusBadge = isApproved
      ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">🟢 Aprobada por Cliente</span>`
      : '';

    return `
      <div class="stitch-card bg-[#101726] p-4 rounded-md border ${isApproved ? 'border-emerald-500/40' : 'border-slate-800/80'} hover:border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors group">
        <div class="space-y-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <strong class="text-white font-bold text-sm stitch-title truncate">${escapeHtml(item.clientName)}</strong>
            ${statusBadge}
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 shrink-0" title="Fecha y hora de generación">
              🕒 ${timeFormatted}
            </span>
          </div>
          <p class="text-slate-400 text-[11px] truncate stitch-subtext">
            ${escapeHtml(item.category || 'General')} • Setup: <span class="font-mono text-emerald-400 font-bold">RD$ ${(item.onetime || 0).toLocaleString('es-DO')}</span> • Mensual: <span class="font-mono text-cyan-300 font-bold">RD$ ${(item.monthly || 0).toLocaleString('es-DO')}/mes</span>
          </p>
        </div>
        <div class="flex items-center gap-2 shrink-0 self-end sm:self-auto flex-wrap">
          <a href="${item.url}" target="_blank" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded border border-white/10 transition-colors shadow-sm" title="Ver propuesta interactiva">
            Ver
          </a>
          <button onclick="createContractFromProposal('${item.id}', '${item.clientId || ''}')" class="px-2.5 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/35 text-indigo-300 border border-indigo-500/30 font-bold rounded transition-colors cursor-pointer shadow-sm active:scale-95 text-xs flex items-center gap-1" title="Generar Contrato Legal 50/50">
            📜 Contrato
          </button>
          <button onclick="navigator.clipboard.writeText('${item.url}'); showToast('Enlace copiado al portapapeles', 'success');" class="px-3 py-1.5 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 font-bold rounded transition-colors cursor-pointer shadow-sm active:scale-95" title="Copiar enlace directo">
            Copiar Link
          </button>
          <button onclick="deleteProposalWithUndo('${item.id}')" class="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition-all cursor-pointer active:scale-95" title="Eliminar propuesta del historial">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

export function deleteProposalWithUndo(propId) {
  const list = getStoredProposals();
  const index = list.findIndex(p => p.id === propId);
  if (index === -1) return;

  const [removedProp] = list.splice(index, 1);
  localStorage.setItem(STORAGE_KEYS.proposals, JSON.stringify(list));
  syncVaultToCloud();
  renderProposalsHistory();

  if (pendingProposalDeletions.has(propId)) {
    const prev = pendingProposalDeletions.get(propId);
    clearInterval(prev.intervalId);
    if (prev.toastEl) prev.toastEl.remove();
  }

  const undoToastId = `undo_toast_${propId}`;
  const existingToast = document.getElementById(undoToastId);
  if (existingToast) existingToast.remove();

  let secondsLeft = 6;
  const toastEl = document.createElement("div");
  toastEl.id = undoToastId;
  toastEl.className = "fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#0f172a] text-white rounded-lg shadow-2xl border border-cyan-500/40 animate-in slide-in-from-bottom-5 duration-200";
  toastEl.innerHTML = `
    <div class="flex items-center gap-2 text-xs">
      <span class="text-rose-400">🗑️</span>
      <span>Propuesta de <strong class="text-white">${escapeHtml(removedProp.clientName)}</strong> eliminada.</span>
    </div>
    <button onclick="undoProposalDelete('${propId}')" class="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm">
      Deshacer (<span id="undoCount_${propId}">${secondsLeft}</span>s)
    </button>
    <button onclick="finalizeProposalDelete('${propId}')" class="text-slate-400 hover:text-white text-xs p-1 cursor-pointer transition-colors" title="Confirmar eliminación permanente">✕</button>
  `;
  document.body.appendChild(toastEl);

  const intervalId = setInterval(() => {
    secondsLeft--;
    const countSpan = document.getElementById(`undoCount_${propId}`);
    if (countSpan) countSpan.textContent = secondsLeft;
    if (secondsLeft <= 0) {
      clearInterval(intervalId);
      finalizeProposalDelete(propId);
    }
  }, 1000);

  pendingProposalDeletions.set(propId, {
    item: removedProp,
    index: index,
    intervalId: intervalId,
    toastEl: toastEl
  });
}

export function undoProposalDelete(propId) {
  const pending = pendingProposalDeletions.get(propId);
  if (!pending) return;

  clearInterval(pending.intervalId);
  if (pending.toastEl) pending.toastEl.remove();
  pendingProposalDeletions.delete(propId);

  const list = getStoredProposals();
  list.splice(pending.index, 0, pending.item);
  localStorage.setItem(STORAGE_KEYS.proposals, JSON.stringify(list));
  syncVaultToCloud();

  renderProposalsHistory();
  showToast(`↩️ Propuesta de ${pending.item.clientName} restaurada`, 'success');
}

export async function finalizeProposalDelete(propId) {
  const pending = pendingProposalDeletions.get(propId);
  if (!pending) return;

  clearInterval(pending.intervalId);
  if (pending.toastEl) {
    pending.toastEl.classList.add("opacity-0", "transition-opacity", "duration-200");
    setTimeout(() => pending.toastEl.remove(), 250);
  }
  pendingProposalDeletions.delete(propId);

  localStorage.removeItem(`proposal_${propId}`);
  await deleteProposalFromCloud(propId);
}

async function deleteProposalFromCloud(propId) {
  if (!supabaseClient) return;
  try {
    const { error } = await supabaseClient
      .from("agency_proposals")
      .delete()
      .eq("id", propId);
    if (error) console.warn("Supabase proposal delete notice:", error.message);
  } catch (err) {
    console.warn("deleteProposalFromCloud exception:", err);
  }
}

async function saveProposalToCloud(prop) {
  if (!supabaseClient) return;
  try {
    const row = {
      id: prop.id,
      client_name: prop.clientName,
      category: prop.category,
      onetime: prop.onetime,
      monthly: prop.monthly,
      url: prop.url,
      created_at: prop.createdAt || new Date().toISOString()
    };
    const { error } = await supabaseClient
      .from("agency_proposals")
      .upsert(row, { onConflict: "id" });
    if (error) console.warn("Supabase proposal save notice:", error.message);
  } catch (err) {
    console.warn("saveProposalToCloud exception:", err);
  }
}

export function openProposalForClient(clientId) {
  const resolvedId = clientId || state.currentDrilldownClientId || state.currentDrawerClientId;
  const client = state.clients.find(c => c.id === resolvedId) || state.clients[0];
  if (!client) return;

  if (window.switchDashboardTab) window.switchDashboardTab('proposals');

  const select = document.getElementById("proposalClientSelect");
  if (select) {
    let exists = false;
    for (let i = 0; i < select.options.length; i++) {
      if (select.options[i].value === client.name || select.options[i].value === client.id) {
        select.selectedIndex = i;
        exists = true;
        break;
      }
    }
    if (!exists) {
      const opt = document.createElement("option");
      opt.value = client.name;
      opt.textContent = client.name;
      select.appendChild(opt);
      select.value = client.name;
    }
  }

  const customInput = document.getElementById("proposalClientCustom");
  if (customInput) customInput.value = client.name;

  const catInput = document.getElementById("proposalCategory");
  if (catInput) catInput.value = client.category || "Servicios Web Omnicanal";

  const phoneInput = document.getElementById("proposalClientPhone");
  if (phoneInput) phoneInput.value = (client.phone || "").replace(/\D/g, '');

  handleProposalClientSelect();
  showToast(`Presupuesto pre-rellenado para ${client.name}`, 'success');
  window.scrollTo({ top: 120, behavior: 'smooth' });
}

export function goToProposalBuilderForClient(clientId) {
  if (window.closeRoadmapManagementModal) window.closeRoadmapManagementModal();
  openProposalForClient(clientId);
}

export function createContractFromCurrentResultProposal() {
  closeProposalResultModal();
  if (lastGeneratedProposalData) {
    if (window.openContractEditorModal) {
      window.openContractEditorModal(lastGeneratedProposalData.clientId, null, lastGeneratedProposalData);
    }
  }
}

export function activateCurrentProposalInRoadmap() {
  if (!lastGeneratedProposalData) return;
  if (lastGeneratedProposalData.clientId) {
    closeProposalResultModal();
    if (window.activateProposalInRoadmap) {
      window.activateProposalInRoadmap(lastGeneratedProposalData.clientId, lastGeneratedProposalData.id);
    }
  }
}

function formatProposalTimestamp(prop) {
  try {
    const rawTs = parseInt((prop.id || '').replace('prop-', ''), 10);
    if (!isNaN(rawTs) && rawTs > 1000000000) {
      return new Date(rawTs).toLocaleDateString('es-DO', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    return prop.createdAt ? new Date(prop.createdAt).toLocaleDateString('es-DO') : 'Reciente';
  } catch (e) {
    return 'Reciente';
  }
}

// ========================================================
// GESTIÓN DEL CATÁLOGO MAESTRO GLOBAL DE PRECIOS
// ========================================================

export function openMasterCatalogModal() {
  const modal = document.getElementById("masterCatalogModal");
  if (!modal) return;
  renderMasterCatalogModal();
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

export function closeMasterCatalogModal() {
  const modal = document.getElementById("masterCatalogModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

export function renderMasterCatalogModal() {
  const container = document.getElementById("masterCatalogModalBody");
  if (!container) return;

  // Render Paquetes Base
  const pkgKeys = ['pack-esencial', 'pack-ia', 'pack-ecosistema'];
  const packagesHtml = pkgKeys.map(key => {
    const pkg = PROPOSAL_BASE_PACKAGES[key] || {};
    return `
      <div class="p-4 rounded-lg bg-slate-900/80 border border-white/10 space-y-3">
        <div class="flex items-center justify-between pb-2 border-b border-white/5">
          <div class="flex items-center gap-2">
            <span class="text-xs font-mono font-bold text-cyan-400 uppercase">${escapeHtml(key)}</span>
          </div>
          <span class="text-[11px] text-slate-400 font-mono">Paquete Base Oficial</span>
        </div>

        <div>
          <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nombre Oficial del Paquete</label>
          <input 
            type="text" 
            id="master-pkg-title-${key}" 
            value="${escapeHtml(pkg.title || '')}" 
            class="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-xs text-white font-bold focus:ring-1 focus:ring-amber-400 focus:outline-none"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Precio Setup RD$ (Inicial)</label>
            <input 
              type="number" 
              min="0" 
              step="500" 
              id="master-pkg-price-${key}" 
              value="${pkg.price !== undefined ? pkg.price : 0}" 
              class="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-xs text-emerald-400 font-mono font-bold focus:ring-1 focus:ring-emerald-400 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Mensualidad RD$ (Mantenimiento)</label>
            <input 
              type="number" 
              min="0" 
              step="500" 
              id="master-pkg-monthly-${key}" 
              value="${pkg.monthlyPrice !== undefined ? pkg.monthlyPrice : 0}" 
              class="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-xs text-amber-300 font-mono font-bold focus:ring-1 focus:ring-amber-400 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Descripción / Alcance Breve</label>
          <textarea 
            rows="2" 
            id="master-pkg-desc-${key}" 
            class="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-xs text-slate-300 focus:ring-1 focus:ring-amber-400 focus:outline-none"
          >${escapeHtml(pkg.description || '')}</textarea>
        </div>
      </div>
    `;
  }).join('');

  // Render Addons
  const addonsHtml = PROPOSAL_ADDONS.map(addon => {
    return `
      <div class="p-3.5 rounded-lg bg-slate-900/60 border border-white/5 hover:border-white/10 transition-colors space-y-2.5">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-mono font-bold text-slate-400 uppercase">${escapeHtml(addon.id)}</span>
          <span class="text-[10px] font-semibold text-slate-500 font-mono">${addon.type === 'monthly' ? 'Mensual' : 'Pago Único'}</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          <div class="sm:col-span-6">
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nombre del Servicio</label>
            <input 
              type="text" 
              id="master-addon-name-${addon.id}" 
              value="${escapeHtml(addon.name)}" 
              class="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-xs text-white font-bold focus:ring-1 focus:ring-amber-400 focus:outline-none"
            />
          </div>
          <div class="sm:col-span-3">
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Precio RD$</label>
            <input 
              type="number" 
              min="0" 
              step="500" 
              id="master-addon-price-${addon.id}" 
              value="${addon.price !== undefined ? addon.price : 0}" 
              class="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-xs text-emerald-400 font-mono font-bold focus:ring-1 focus:ring-emerald-400 focus:outline-none"
            />
          </div>
          <div class="sm:col-span-3">
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tipo de Cobro</label>
            <select 
              id="master-addon-type-${addon.id}" 
              class="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:ring-1 focus:ring-amber-400 focus:outline-none cursor-pointer"
            >
              <option value="onetime" ${addon.type === 'onetime' ? 'selected' : ''}>Pago Único</option>
              <option value="monthly" ${addon.type === 'monthly' ? 'selected' : ''}>Mensual (/mes)</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Descripción del Entregable</label>
          <textarea 
            rows="1" 
            id="master-addon-desc-${addon.id}" 
            class="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-xs text-slate-300 focus:ring-1 focus:ring-amber-400 focus:outline-none"
          >${escapeHtml(addon.description || '')}</textarea>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <!-- Sección 1: Paquetes Base -->
    <div class="space-y-3">
      <div class="flex items-center justify-between pb-1">
        <h4 class="text-sm font-bold text-white flex items-center gap-2">
          <span>📦</span> Paquetes Base Oficiales (Precios por Defecto)
        </h4>
        <span class="text-[11px] text-slate-400">3 Niveles Estructurados</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        ${packagesHtml}
      </div>
    </div>

    <!-- Sección 2: Add-ons y Servicios a la carta -->
    <div class="space-y-3 pt-4 border-t border-white/10">
      <div class="flex items-center justify-between pb-1">
        <h4 class="text-sm font-bold text-white flex items-center gap-2">
          <span>🧩</span> Servicios & Add-ons a la Carta (${PROPOSAL_ADDONS.length} Módulos)
        </h4>
        <span class="text-[11px] text-slate-400">Tarifario Global</span>
      </div>
      <div class="grid grid-cols-1 gap-2.5">
        ${addonsHtml}
      </div>
    </div>
  `;
}

export function saveMasterCatalogFromModal() {
  const pkgKeys = ['pack-esencial', 'pack-ia', 'pack-ecosistema'];
  const packagesData = {};

  pkgKeys.forEach(key => {
    const titleInput = document.getElementById(`master-pkg-title-${key}`);
    const priceInput = document.getElementById(`master-pkg-price-${key}`);
    const monthlyInput = document.getElementById(`master-pkg-monthly-${key}`);
    const descInput = document.getElementById(`master-pkg-desc-${key}`);

    packagesData[key] = {
      ...(PROPOSAL_BASE_PACKAGES[key] || {}),
      title: titleInput ? titleInput.value.trim() : PROPOSAL_BASE_PACKAGES[key].title,
      price: priceInput ? Math.max(0, Number(priceInput.value) || 0) : PROPOSAL_BASE_PACKAGES[key].price,
      monthlyPrice: monthlyInput ? Math.max(0, Number(monthlyInput.value) || 0) : PROPOSAL_BASE_PACKAGES[key].monthlyPrice,
      description: descInput ? descInput.value.trim() : PROPOSAL_BASE_PACKAGES[key].description
    };
  });

  const addonsData = PROPOSAL_ADDONS.map(addon => {
    const nameInput = document.getElementById(`master-addon-name-${addon.id}`);
    const priceInput = document.getElementById(`master-addon-price-${addon.id}`);
    const typeInput = document.getElementById(`master-addon-type-${addon.id}`);
    const descInput = document.getElementById(`master-addon-desc-${addon.id}`);

    return {
      id: addon.id,
      name: nameInput ? nameInput.value.trim() : addon.name,
      price: priceInput ? Math.max(0, Number(priceInput.value) || 0) : addon.price,
      type: typeInput ? typeInput.value : addon.type,
      description: descInput ? descInput.value.trim() : addon.description,
      checked: addon.checked
    };
  });

  saveMasterCatalog(packagesData, addonsData);

  // Sincronizar addons activos del cotizador con el nuevo tarifario maestro
  currentProposalAddons.forEach(item => {
    const master = PROPOSAL_ADDONS.find(a => a.id === item.id);
    if (master && !item.isCustom) {
      item.name = master.name;
      item.price = master.price;
      item.type = master.type;
      item.description = master.description;
    }
  });

  // Actualizar UI del cotizador
  ['pack-esencial', 'pack-ia', 'pack-ecosistema'].forEach(key => updatePackageCardDisplay(key));
  syncPackageCustomizerUI();
  renderProposalAddonsList();
  updateProposalTotals();

  closeMasterCatalogModal();
  showToast("✓ Tarifas del Catálogo Maestro guardadas exitosamente.", "success");
}

export function restoreMasterCatalogFactoryDefaults() {
  if (!confirm("¿Deseas restaurar todos los paquetes y servicios a sus precios oficiales de fábrica? Esta acción descartará tus tarifas personalizadas en el catálogo maestro.")) {
    return;
  }

  resetMasterCatalog();
  renderMasterCatalogModal();

  // Reflejar en el cotizador activo
  currentProposalAddons = JSON.parse(JSON.stringify(PROPOSAL_ADDONS));
  customPackageOverrides = {};
  ['pack-esencial', 'pack-ia', 'pack-ecosistema'].forEach(key => updatePackageCardDisplay(key));
  const selectedBaseKey = document.querySelector('input[name="basePkg"]:checked')?.value || "pack-ia";
  handlePackageSelect(selectedBaseKey);
  renderProposalAddonsList();
  updateProposalTotals();

  showToast("↺ Catálogo Maestro restablecido a los valores oficiales de fábrica.", "info");
}
