/**
 * ISAPromoRD - Finance & CFO Dashboard (Accounting Ledger)
 * Double-entry cash inflows, expenses, MRR/ARR analytics, bank balances reconciliation
 * (Banco Popular Dominicano & Banreservas / BHD), transaction exports, and revenue forecasting.
 */
import { state, STORAGE_KEYS, INITIAL_ACCOUNTING_LEDGER, DEFAULT_BANK_DETAILS } from './state.js';
import { saveClientsToStorage } from './sync.js';
import { showToast, escapeHtml, getBillingStatus, updateKpis } from './ui.js';

export const forecastState = {
  web: 1,       // RD$ 4,000/m (Setup 25,000)
  esencial: 2,  // RD$ 8,000/m (Setup 30,000)
  crm: 3,       // RD$ 15,000/m (Setup 60,000)
  ecosistema: 1 // RD$ 22,000/m (Setup 80,000)
};

const getReceivablesTbody = () => document.getElementById("accountingReceivablesTableBody") || document.getElementById("receivablesTableBody");
const getLedgerTbody = () => document.getElementById("accountingTransactionsTableBody") || document.getElementById("ledgerTableBody");

export function getBankDetails() {
  return localStorage.getItem(STORAGE_KEYS.bank) || DEFAULT_BANK_DETAILS;
}

export function saveBankDetails() {
  const input = document.getElementById("bankDetailsInput");
  if (input) {
    localStorage.setItem(STORAGE_KEYS.bank, input.value.trim());
    const msg = document.getElementById("bankSuccessMsg");
    if (msg) {
      msg.classList.remove("hidden");
      setTimeout(() => msg.classList.add("hidden"), 2500);
    }
    showToast("Datos bancarios guardados con éxito", "success");
  }
}

export function loadAccountingData() {
  const stored = localStorage.getItem(STORAGE_KEYS.accounting);
  if (stored) {
    try {
      state.accountingLedger = JSON.parse(stored);
    } catch (e) {
      state.accountingLedger = INITIAL_ACCOUNTING_LEDGER;
    }
  } else {
    state.accountingLedger = INITIAL_ACCOUNTING_LEDGER;
    saveAccountingLedger();
  }

  updateAccountingKpis();
  renderAccountingBankBalances();
  renderAccountingReceivables();
  renderAccountingTransactions();
  updateForecastSimulation();
  populateTxClientSelect();
}

export function saveAccountingLedger() {
  localStorage.setItem(STORAGE_KEYS.accounting, JSON.stringify(state.accountingLedger));
}

export function addAccountingTransaction(tx) {
  if (!tx.id) tx.id = "tx-" + Date.now();
  if (!state.accountingLedger) state.accountingLedger = [];
  state.accountingLedger.unshift(tx);
  saveAccountingLedger();
  updateAccountingKpis();
  renderAccountingBankBalances();
  renderAccountingTransactions();
  updateKpis();
}

export function updateAccountingKpis() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const currentMonthLabel = `${monthNames[currentMonth]} ${currentYear}`;
  const monthLabelEl = document.getElementById("acctKpiCurrentMonthLabel");
  if (monthLabelEl) monthLabelEl.textContent = currentMonthLabel;

  let currentMonthInflow = 0;
  let allTimeCollected = 0;
  let totalExpenses = 0;

  (state.accountingLedger || []).forEach(tx => {
    const rawAmt = Number(tx.amount) || 0;
    const isExpense = tx.type === "expense";
    const netAmt = isExpense ? -rawAmt : rawAmt;

    allTimeCollected += netAmt;
    if (isExpense) totalExpenses += rawAmt;

    if (tx.date) {
      const parts = tx.date.split('-');
      if (parts.length === 3) {
        const txYear = parseInt(parts[0], 10);
        const txMonth = parseInt(parts[1], 10) - 1;
        if (txYear === currentYear && txMonth === currentMonth) {
          currentMonthInflow += netAmt;
        }
      }
    }
  });

  const inflowEl = document.getElementById("acctKpiCashInflow");
  if (inflowEl) inflowEl.textContent = state.presentationMode ? "RD$ ••••••" : `RD$ ${currentMonthInflow.toLocaleString('es-DO')}`;

  const allTimeEl = document.getElementById("allTimeCollectedTotal");
  if (allTimeEl) allTimeEl.textContent = state.presentationMode ? "RD$ ••••••" : `RD$ ${allTimeCollected.toLocaleString('es-DO')}`;

  let mrrTotal = 0;
  let receivablesTotal = 0;
  let pendingClientsCount = 0;

  (state.clients || []).forEach(c => {
    if (c.status === "active") {
      let feeNum = 0;
      if (c.fee) {
        const m = c.fee.match(/[\d,]+/);
        if (m) feeNum = parseInt(m[0].replace(/,/g, ''), 10) || 0;
      }
      mrrTotal += feeNum;

      const billing = getBillingStatus(c.renewalDate);
      if (billing.status === "due_soon" || billing.status === "overdue") {
        receivablesTotal += feeNum;
        pendingClientsCount++;
      }
    }
  });

  const mrrEl = document.getElementById("acctKpiMrr");
  if (mrrEl) mrrEl.textContent = state.presentationMode ? "RD$ ••••••" : `RD$ ${mrrTotal.toLocaleString('es-DO')}`;

  const arrTotal = mrrTotal * 12;
  const arrEl = document.getElementById("acctKpiArr");
  if (arrEl) arrEl.textContent = state.presentationMode ? "RD$ ••••••" : `RD$ ${arrTotal.toLocaleString('es-DO')}`;

  const recEl = document.getElementById("acctKpiReceivables");
  if (recEl) recEl.textContent = state.presentationMode ? "RD$ ••••••" : `RD$ ${receivablesTotal.toLocaleString('es-DO')}`;

  const recCountEl = document.getElementById("acctKpiReceivablesCount");
  if (recCountEl) recCountEl.textContent = `${pendingClientsCount} ${pendingClientsCount === 1 ? 'cliente pendiente' : 'clientes pendientes'}`;

  const recSummaryEl = document.getElementById("receivablesSummaryCount");
  if (recSummaryEl) recSummaryEl.textContent = `${state.clients.length} ${state.clients.length === 1 ? 'cliente en radar' : 'clientes en radar'}`;
}

export function renderAccountingBankBalances() {
  let balancePopular = 0;
  let balanceBhd = 0;
  let balanceCash = 0;

  (state.accountingLedger || []).forEach(tx => {
    const rawAmt = Number(tx.amount) || 0;
    const isExpense = tx.type === "expense";
    const netAmt = isExpense ? -rawAmt : rawAmt;
    const acc = (tx.account || "").toLowerCase();

    if (acc.includes("popular")) {
      balancePopular += netAmt;
    } else if (acc.includes("bhd") || acc.includes("reservas")) {
      balanceBhd += netAmt;
    } else {
      balanceCash += netAmt;
    }
  });

  const popEl = document.getElementById("bankBalancePopular");
  if (popEl) popEl.textContent = state.presentationMode ? "RD$ ••••••" : `RD$ ${balancePopular.toLocaleString('es-DO')}`;

  const bhdEl = document.getElementById("bankBalanceBhd");
  if (bhdEl) bhdEl.textContent = state.presentationMode ? "RD$ ••••••" : `RD$ ${balanceBhd.toLocaleString('es-DO')}`;

  const cashEl = document.getElementById("bankBalanceCash");
  if (cashEl) cashEl.textContent = state.presentationMode ? "RD$ ••••••" : `RD$ ${balanceCash.toLocaleString('es-DO')}`;
}

export function renderAccountingReceivables() {
  const tbody = getReceivablesTbody();
  if (!tbody) return;

  const clients = state.clients || [];
  if (clients.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="py-6 text-center text-slate-400">No hay clientes registrados en el directorio.</td></tr>`;
    return;
  }

  tbody.innerHTML = clients.map(client => {
    const billing = getBillingStatus(client.renewalDate);
    const feeStr = state.presentationMode ? "•••••" : (client.fee || "RD$ 0 / mes");

    return `
      <tr class="hover:bg-white/[0.02] transition-colors border-b border-white/[0.04]">
        <td class="py-3 px-4 font-bold text-white">${escapeHtml(client.name)}</td>
        <td class="py-3 px-4 font-mono text-cyan-300">${feeStr}</td>
        <td class="py-3 px-4 font-mono text-slate-400">${client.renewalDate || '—'}</td>
        <td class="py-3 px-4">
          <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${billing.badgeClass}">
            ${billing.text}
          </span>
        </td>
        <td class="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
          <button onclick="openManualTransactionForClient('${client.id}')" class="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all shadow-xs inline-flex items-center gap-1 cursor-pointer" title="Registrar pago recibido de este cliente">
            <span>💵</span><span>Cobrado</span>
          </button>
          <button onclick="openBillingNoticeModal('${client.id}')" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-[11px] font-bold transition-all shadow-xs inline-flex items-center gap-1 cursor-pointer" title="Enviar estado de cuenta por WhatsApp">
            <span>📲</span><span>Cobrar ↗</span>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

export function renderAccountingTransactions(listToRender = state.accountingLedger) {
  const tbody = getLedgerTbody();
  if (!tbody) return;

  if (!listToRender || listToRender.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="py-8 text-center text-slate-400">No hay transacciones registradas en este período.</td></tr>`;
    return;
  }

  const typeBadges = {
    setup: { text: "Setup 50% / Inicio", class: "bg-blue-500/10 text-blue-300 border-blue-500/30" },
    settlement: { text: "Liquidación 50% Final", class: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30" },
    retainer: { text: "Retainer Mensual", class: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" },
    alacarte: { text: "Servicio A la Carta", class: "bg-purple-500/10 text-purple-300 border-purple-500/30" },
    addon: { text: "Servicio Extra", class: "bg-purple-500/10 text-purple-300 border-purple-500/30" },
    expense: { text: "🔴 Gasto Operativo", class: "bg-rose-500/10 text-rose-300 border-rose-500/30" },
    other: { text: "Otro Movimiento", class: "bg-slate-700/30 text-slate-300 border-slate-600/30" }
  };

  tbody.innerHTML = listToRender.map(tx => {
    const badge = typeBadges[tx.type] || typeBadges.other;
    const isExpense = tx.type === "expense";
    const formattedAmount = state.presentationMode ? "••••••" : Number(tx.amount || 0).toLocaleString('es-DO');

    return `
      <tr class="hover:bg-white/[0.02] transition-colors border-b border-white/[0.04]">
        <td class="py-3 px-4 font-mono text-slate-400 text-xs">${tx.date}</td>
        <td class="py-3 px-4 font-bold text-white text-xs">${escapeHtml(tx.clientName || 'Cliente')}</td>
        <td class="py-3 px-4 text-slate-300 text-xs max-w-xs truncate" title="${escapeHtml(tx.concept)}">${escapeHtml(tx.concept)}</td>
        <td class="py-3 px-4">
          <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${badge.class}">
            ${badge.text}
          </span>
        </td>
        <td class="py-3 px-4 text-slate-400 text-xs">${escapeHtml(tx.account || 'Banco')}</td>
        <td class="py-3 px-4 font-mono text-slate-500 text-xs">${escapeHtml(tx.reference || '—')}</td>
        <td class="py-3 px-4 text-right font-black font-mono text-xs ${isExpense ? 'text-rose-400' : 'text-emerald-400'}">
          ${isExpense ? '-' : '+'} RD$ ${formattedAmount}
        </td>
        <td class="py-3 px-4 text-right space-x-1 whitespace-nowrap">
          <button onclick="openEditTransactionModal('${tx.id}')" class="p-1.5 rounded text-indigo-400 hover:text-white hover:bg-indigo-500/20 transition-colors cursor-pointer" title="Editar esta transacción">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
          </button>
          <button onclick="deleteLedgerTransaction('${tx.id}')" class="p-1.5 rounded text-rose-400 hover:text-white hover:bg-rose-500/20 transition-colors cursor-pointer" title="Eliminar transacción">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

export function filterLedgerTransactions() {
  const typeEl = document.getElementById("ledgerFilterType");
  const type = typeEl ? typeEl.value : "all";
  const searchEl = document.getElementById("ledgerSearchInput");
  const query = searchEl ? searchEl.value.trim().toLowerCase() : "";

  let list = state.accountingLedger || [];

  if (type !== "all") {
    if (type === "income") {
      list = list.filter(tx => tx.type !== "expense");
    } else {
      list = list.filter(tx => tx.type === type);
    }
  }

  if (query) {
    list = list.filter(tx => {
      const cName = (tx.clientName || '').toLowerCase();
      const conc = (tx.concept || '').toLowerCase();
      const ref = (tx.reference || '').toLowerCase();
      const acc = (tx.account || '').toLowerCase();
      return cName.includes(query) || conc.includes(query) || ref.includes(query) || acc.includes(query);
    });
  }

  renderAccountingTransactions(list);
}

export function openManualTransactionModal() {
  populateTxClientSelect();
  const form = document.getElementById("manualTransactionForm");
  if (form) form.reset();

  const editIdInput = document.getElementById("txEditingId");
  if (editIdInput) editIdInput.value = "";

  const titleEl = document.getElementById("manualTxModalTitle");
  if (titleEl) titleEl.textContent = "Registrar Entrada / Cobro";

  const subtitleEl = document.getElementById("manualTxModalSubtitle");
  if (subtitleEl) subtitleEl.textContent = "Asentar cobro o movimiento en el Libro Diario de ISAPromoRD";

  const submitBtn = document.getElementById("manualTxSubmitBtn");
  if (submitBtn) submitBtn.textContent = "Guardar en Libro Diario";

  const dateInput = document.getElementById("txDate");
  if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];

  const customInput = document.getElementById("txClientCustomName");
  if (customInput) customInput.classList.add("hidden");

  const modal = document.getElementById("manualTransactionModal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

export function openEditTransactionModal(txId) {
  const tx = (state.accountingLedger || []).find(t => t.id === txId);
  if (!tx) {
    showToast("Transacción no encontrada", "error");
    return;
  }

  populateTxClientSelect();

  const editIdInput = document.getElementById("txEditingId");
  if (editIdInput) editIdInput.value = tx.id;

  const titleEl = document.getElementById("manualTxModalTitle");
  if (titleEl) titleEl.textContent = "✏️ Editar Transacción";

  const subtitleEl = document.getElementById("manualTxModalSubtitle");
  if (subtitleEl) subtitleEl.textContent = `Modificando registro ID: ${tx.id}`;

  const submitBtn = document.getElementById("manualTxSubmitBtn");
  if (submitBtn) submitBtn.textContent = "Actualizar en Libro Diario";

  const select = document.getElementById("txClientSelect");
  const customInput = document.getElementById("txClientCustomName");
  if (select) {
    if (tx.clientId && state.clients.some(c => c.id === tx.clientId)) {
      select.value = tx.clientId;
      if (customInput) customInput.classList.add("hidden");
    } else {
      select.value = "custom";
      if (customInput) {
        customInput.classList.remove("hidden");
        customInput.value = tx.clientName || "";
      }
    }
  }

  const conceptInput = document.getElementById("txConcept");
  if (conceptInput) conceptInput.value = tx.concept || "";

  const typeInput = document.getElementById("txType");
  if (typeInput) typeInput.value = tx.type || "retainer";

  const amountInput = document.getElementById("txAmount");
  if (amountInput) amountInput.value = tx.amount || "";

  const dateInput = document.getElementById("txDate");
  if (dateInput) dateInput.value = tx.date || new Date().toISOString().split('T')[0];

  const accountInput = document.getElementById("txAccount");
  if (accountInput) accountInput.value = tx.account || "Banco Popular Dominicano";

  const refInput = document.getElementById("txReference");
  if (refInput) refInput.value = tx.reference !== "—" ? (tx.reference || "") : "";

  const notesInput = document.getElementById("txNotes");
  if (notesInput) notesInput.value = tx.notes || "";

  const modal = document.getElementById("manualTransactionModal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

export function openManualTransactionForClient(clientId) {
  openManualTransactionModal();
  const select = document.getElementById("txClientSelect");
  if (select) {
    select.value = clientId;
    handleTxClientSelectChange();
  }
}

export function closeManualTransactionModal() {
  const modal = document.getElementById("manualTransactionModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

export function populateTxClientSelect() {
  const select = document.getElementById("txClientSelect");
  if (!select) return;

  const clients = state.clients || [];
  select.innerHTML = `
    <option value="">-- Seleccionar Cliente --</option>
    ${clients.map(c => `<option value="${c.id}">${escapeHtml(c.name)} (${c.fee || 'Sin tarifa'})</option>`).join('')}
    <option value="custom">✏️ Otro Cliente / Prospecto Nuevo / Gasto Operativo...</option>
  `;
}

export function handleTxClientSelectChange() {
  const select = document.getElementById("txClientSelect");
  const customInput = document.getElementById("txClientCustomName");
  if (!select) return;

  if (select.value === "custom") {
    if (customInput) {
      customInput.classList.remove("hidden");
      customInput.focus();
    }
  } else {
    if (customInput) customInput.classList.add("hidden");
    const found = state.clients.find(c => c.id === select.value);
    if (found && found.fee) {
      const match = found.fee.match(/[\d,]+/);
      if (match) {
        const amtInput = document.getElementById("txAmount");
        if (amtInput) amtInput.value = parseInt(match[0].replace(/,/g, ''), 10);
      }
      const conceptInput = document.getElementById("txConcept");
      if (conceptInput) conceptInput.value = `Retainer Mensual — Mantenimiento & Hosting (${found.renewalDate || 'Ciclo Actual'})`;
    }
  }
}

export function saveManualTransaction(e) {
  if (e && e.preventDefault) e.preventDefault();
  const select = document.getElementById("txClientSelect");
  if (!select) return;

  let clientName = "";
  let clientId = "";

  if (select.value === "custom") {
    const customEl = document.getElementById("txClientCustomName");
    clientName = customEl ? customEl.value.trim() : "Externo / Operativo";
    clientId = "client-custom-" + Date.now();
  } else if (select.value) {
    const found = state.clients.find(c => c.id === select.value);
    if (found) {
      clientId = found.id;
      clientName = found.name;
    }
  } else {
    showToast("Por favor selecciona o escribe el cliente.", "warning");
    return;
  }

  const concept = document.getElementById("txConcept")?.value.trim() || "Cobro de servicio";
  const type = document.getElementById("txType")?.value || "retainer";
  const amount = Number(document.getElementById("txAmount")?.value) || 0;
  const date = document.getElementById("txDate")?.value || new Date().toISOString().split('T')[0];
  const account = document.getElementById("txAccount")?.value || "Banco Popular Dominicano";
  const reference = document.getElementById("txReference")?.value.trim() || "—";
  const notes = document.getElementById("txNotes")?.value.trim() || "";

  const editIdInput = document.getElementById("txEditingId");
  const editingId = editIdInput ? editIdInput.value.trim() : "";

  if (editingId) {
    const idx = (state.accountingLedger || []).findIndex(t => t.id === editingId);
    if (idx !== -1) {
      state.accountingLedger[idx] = {
        ...state.accountingLedger[idx],
        clientId,
        clientName,
        concept,
        type,
        amount,
        date,
        account,
        reference,
        notes
      };
      saveAccountingLedger();
      updateAccountingKpis();
      renderAccountingBankBalances();
      renderAccountingTransactions();
      updateKpis();
      closeManualTransactionModal();
      showToast(`✅ Transacción actualizada correctamente (RD$ ${amount.toLocaleString('es-DO')})`, 'success');
      return;
    }
  }

  addAccountingTransaction({
    id: "tx-" + Date.now(),
    clientId,
    clientName,
    concept,
    type,
    amount,
    date,
    account,
    reference,
    notes
  });

  closeManualTransactionModal();
  showToast(`✅ Cobro de RD$ ${amount.toLocaleString('es-DO')} registrado en Libro Diario`, 'success');
}

export function deleteLedgerTransaction(txId) {
  const tx = (state.accountingLedger || []).find(t => t.id === txId);
  if (!tx) return;

  if (confirm(`¿Eliminar la transacción "${tx.concept}" (RD$ ${Number(tx.amount).toLocaleString('es-DO')})?`)) {
    state.accountingLedger = state.accountingLedger.filter(t => t.id !== txId);
    saveAccountingLedger();
    updateAccountingKpis();
    renderAccountingBankBalances();
    renderAccountingTransactions();
    updateKpis();
    showToast("Transacción eliminada del Libro Diario", "info");
  }
}

export function exportAccountingReport() {
  if (!state.accountingLedger || state.accountingLedger.length === 0) {
    alert("No hay transacciones registradas para exportar.");
    return;
  }

  let csv = "ID,Fecha,Cliente,Concepto,Tipo,Cuenta,Referencia,Monto_RD\n";
  state.accountingLedger.forEach(t => {
    const safeName = (t.clientName || '').replace(/"/g, '""');
    const safeConcept = (t.concept || '').replace(/"/g, '""');
    const isExpense = t.type === "expense";
    const amt = isExpense ? -Number(t.amount || 0) : Number(t.amount || 0);
    csv += `"${t.id}","${t.date}","${safeName}","${safeConcept}","${t.type}","${t.account}","${t.reference}",${amt}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `isapromo_libro_contable_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function adjustForecastPlan(planKey, delta) {
  if (forecastState[planKey] === undefined) return;
  const next = forecastState[planKey] + delta;
  if (next < 0) return;
  forecastState[planKey] = next;

  const countEl = document.getElementById(`forecastCount_${planKey}`);
  if (countEl) countEl.textContent = next;

  updateForecastSimulation();
}

export function updateForecastSimulation() {
  const planPrices = {
    web: { monthly: 4000, setup: 25000 },
    esencial: { monthly: 8000, setup: 30000 },
    crm: { monthly: 15000, setup: 60000 },
    ecosistema: { monthly: 22000, setup: 80000 }
  };

  let simMrr = 0;
  let simSetup = 0;

  for (const k in forecastState) {
    const count = forecastState[k];
    simMrr += count * planPrices[k].monthly;
    simSetup += count * planPrices[k].setup;
  }

  const simArr = simMrr * 12;

  const mrrEl = document.getElementById("simResultMrr");
  if (mrrEl) mrrEl.textContent = `RD$ ${simMrr.toLocaleString('es-DO')}`;

  const arrEl = document.getElementById("simResultArr");
  if (arrEl) arrEl.textContent = `RD$ ${simArr.toLocaleString('es-DO')}`;

  const setupEl = document.getElementById("simResultSetup");
  if (setupEl) setupEl.textContent = `RD$ ${simSetup.toLocaleString('es-DO')}`;
}

export function registerClientPayment(id) {
  const client = state.clients.find(c => c.id === id);
  if (!client) return;

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  let nextRenewalDate;
  if (client.renewalDate) {
    const d = new Date(client.renewalDate);
    d.setMonth(d.getMonth() + 1);
    nextRenewalDate = d.toISOString().split('T')[0];
  } else {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    nextRenewalDate = d.toISOString().split('T')[0];
  }

  client.renewalDate = nextRenewalDate;
  saveClientsToStorage();

  let feeNum = 4000;
  if (client.fee) {
    const m = client.fee.match(/[\d,]+/);
    if (m) feeNum = parseInt(m[0].replace(/,/g, ''), 10) || 4000;
  }

  addAccountingTransaction({
    id: "tx-" + Date.now(),
    clientId: client.id,
    clientName: client.name,
    concept: `Cobro Mensualidad Retainer (${todayStr})`,
    type: "retainer",
    amount: feeNum,
    date: todayStr,
    account: "Banco Popular Dominicano",
    reference: `REN-${Date.now().toString().slice(-6)}`,
    notes: `Ciclo extendido automáticamente hasta ${nextRenewalDate}`
  });

  renderAccountingReceivables();
  showToast(`✅ Pago de RD$ ${feeNum.toLocaleString('es-DO')} asentado para ${client.name}`, 'success');
}

export function drawerRegisterPayment() {
  if (!state.currentDrawerClientId) return;
  registerClientPayment(state.currentDrawerClientId);
}
