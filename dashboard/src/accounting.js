/**
 * ISAPromoRD - Finance & CFO Dashboard (Accounting Ledger)
 * Double-entry cash inflows, MRR/ARR analytics, bank balances reconciliation
 * (Banco Popular Dominicano & Banreservas / BHD), transaction exports, and revenue forecasting.
 */
import { state, STORAGE_KEYS, INITIAL_ACCOUNTING_LEDGER, DEFAULT_BANK_DETAILS } from './state.js';
import { saveClientsToStorage } from './sync.js';
import { showToast, escapeHtml, getBillingStatus, updateKpis } from './ui.js';

export const forecastState = {
  web: 1,       // RD$ 4,500/m (Setup 20,000)
  esencial: 2,  // RD$ 15,000/m (Setup 30,000)
  crm: 3,       // RD$ 20,000/m (Setup 65,000)
  ecosistema: 1 // RD$ 30,000/m (Setup 85,000)
};

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
  (state.accountingLedger || []).forEach(tx => {
    const amt = Number(tx.amount) || 0;
    allTimeCollected += amt;
    if (tx.date) {
      const parts = tx.date.split('-');
      if (parts.length === 3) {
        const txYear = parseInt(parts[0], 10);
        const txMonth = parseInt(parts[1], 10) - 1;
        if (txYear === currentYear && txMonth === currentMonth) {
          currentMonthInflow += amt;
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
    const amt = Number(tx.amount) || 0;
    const acc = (tx.account || "").toLowerCase();
    if (acc.includes("popular")) {
      balancePopular += amt;
    } else if (acc.includes("bhd") || acc.includes("reservas")) {
      balanceBhd += amt;
    } else {
      balanceCash += amt;
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
  const tbody = document.getElementById("receivablesTableBody");
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
      <tr class="hover:bg-slate-50/80 transition-colors">
        <td class="py-3 px-4 font-bold text-slate-900">${escapeHtml(client.name)}</td>
        <td class="py-3 px-4 font-mono text-slate-600">${feeStr}</td>
        <td class="py-3 px-4 font-mono text-slate-500">${client.renewalDate || '—'}</td>
        <td class="py-3 px-4">
          <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${billing.badgeClass}">
            ${billing.text}
          </span>
        </td>
        <td class="py-3 px-4 text-right">
          <button onclick="openBillingNoticeModal('${client.id}')" class="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition-all shadow-xs" title="Enviar estado de cuenta">
            Cobrar ↗
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

export function renderAccountingTransactions(listToRender = state.accountingLedger) {
  const tbody = document.getElementById("ledgerTableBody");
  if (!tbody) return;

  if (!listToRender || listToRender.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="py-8 text-center text-slate-400">No hay transacciones registradas en este período.</td></tr>`;
    return;
  }

  const typeBadges = {
    setup: { text: "Setup / Anticipo", class: "bg-blue-50 text-blue-700 border-blue-200" },
    retainer: { text: "Retainer Mensual", class: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    addon: { text: "Servicio Extra", class: "bg-purple-50 text-purple-700 border-purple-200" },
    other: { text: "Otro Ingreso", class: "bg-slate-100 text-slate-700 border-slate-200" }
  };

  tbody.innerHTML = listToRender.map(tx => {
    const badge = typeBadges[tx.type] || typeBadges.other;
    const formattedAmount = state.presentationMode ? "••••••" : Number(tx.amount || 0).toLocaleString('es-DO');

    return `
      <tr class="hover:bg-slate-50/80 transition-colors">
        <td class="py-3.5 px-4 font-mono text-slate-600">${tx.date}</td>
        <td class="py-3.5 px-4 font-bold text-slate-900">${escapeHtml(tx.clientName || 'Cliente')}</td>
        <td class="py-3.5 px-4 text-slate-700 max-w-xs truncate" title="${escapeHtml(tx.concept)}">${escapeHtml(tx.concept)}</td>
        <td class="py-3.5 px-4">
          <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${badge.class}">
            ${badge.text}
          </span>
        </td>
        <td class="py-3.5 px-4 text-slate-600">${escapeHtml(tx.account || 'Banco')}</td>
        <td class="py-3.5 px-4 font-mono text-slate-400">${escapeHtml(tx.reference || '—')}</td>
        <td class="py-3.5 px-4 text-right font-black text-emerald-600">RD$ ${formattedAmount}</td>
        <td class="py-3.5 px-4 text-right">
          <button onclick="deleteLedgerTransaction('${tx.id}')" class="text-rose-400 hover:text-rose-600 p-1" title="Eliminar transacción">
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
  if (type === "all") {
    renderAccountingTransactions(state.accountingLedger);
  } else {
    const filtered = (state.accountingLedger || []).filter(tx => tx.type === type);
    renderAccountingTransactions(filtered);
  }
}

export function openManualTransactionModal() {
  populateTxClientSelect();
  const form = document.getElementById("manualTransactionForm");
  if (form) form.reset();
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
    <option value="custom">✏️ Otro Cliente / Prospecto Nuevo...</option>
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
    clientName = customEl ? customEl.value.trim() : "Cliente Externo";
    clientId = "client-custom-" + Date.now();
  } else if (select.value) {
    const found = state.clients.find(c => c.id === select.value);
    if (found) {
      clientId = found.id;
      clientName = found.name;
    }
  } else {
    alert("Por favor selecciona o escribe el cliente.");
    return;
  }

  const concept = document.getElementById("txConcept")?.value.trim() || "Cobro de servicio";
  const type = document.getElementById("txType")?.value || "retainer";
  const amount = Number(document.getElementById("txAmount")?.value) || 0;
  const date = document.getElementById("txDate")?.value || new Date().toISOString().split('T')[0];
  const account = document.getElementById("txAccount")?.value || "Banco Popular Dominicano";
  const reference = document.getElementById("txReference")?.value.trim() || "—";
  const notes = document.getElementById("txNotes")?.value.trim() || "";

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
    csv += `"${t.id}","${t.date}","${safeName}","${safeConcept}","${t.type}","${t.account}","${t.reference}",${t.amount}\n`;
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
    web: { monthly: 4500, setup: 20000 },
    esencial: { monthly: 15000, setup: 30000 },
    crm: { monthly: 20000, setup: 65000 },
    ecosistema: { monthly: 30000, setup: 85000 }
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
    const parts = client.renewalDate.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      d.setMonth(d.getMonth() + 1);
      nextRenewalDate = d.toISOString().split('T')[0];
    }
  }
  if (!nextRenewalDate) {
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextRenewalDate = nextMonth.toISOString().split('T')[0];
  }

  const confirmMsg = `¿Confirmas registrar el pago de ${client.name}?\n\n• Monto: ${client.fee || 'Tarifa mensual'}\n• Fecha de Pago: ${todayStr}\n• Nueva fecha de renovación: ${nextRenewalDate}\n\nSe actualizará el estado del cliente a "Activo" y se extenderá su ciclo de facturación.`;

  if (confirm(confirmMsg)) {
    client.lastPaymentDate = todayStr;
    client.renewalDate = nextRenewalDate;
    client.status = "active";
    
    if (!client.paymentHistory) client.paymentHistory = [];
    client.paymentHistory.push({
      date: todayStr,
      amount: client.fee || "Tarifa Mensual",
      renewalTo: nextRenewalDate
    });

    if (!client.tasks) client.tasks = [];
    client.tasks.unshift({
      id: Date.now(),
      title: `Pago mensual confirmado (${client.fee || 'Retainer'})`,
      done: true,
      date: todayStr
    });

    let numAmount = 4500;
    if (client.fee) {
      const match = client.fee.match(/[\d,]+/);
      if (match) numAmount = parseInt(match[0].replace(/,/g, ''), 10) || 4500;
    }

    addAccountingTransaction({
      id: "tx-" + Date.now(),
      clientId: client.id,
      clientName: client.name,
      concept: `Retainer Mensual — Mantenimiento & Hosting (${nextRenewalDate})`,
      type: "retainer",
      amount: numAmount,
      date: todayStr,
      account: "Banco Popular Dominicano",
      reference: `REC-${Date.now().toString().slice(-6)}`,
      notes: `Pago mensual registrado en ciclo de facturación`
    });

    saveClientsToStorage(true);
    if (window.renderClients) window.renderClients();
    updateKpis();
    showToast(`✅ Pago registrado para ${client.name}. Próxima renovación: ${nextRenewalDate}`, 'success');
  }
}

export function drawerRegisterPayment() {
  if (state.currentDrawerClientId) {
    registerClientPayment(state.currentDrawerClientId);
  }
}
