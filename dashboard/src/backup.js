/**
 * ISAPromoRD - Database Backup & JSON Import/Export
 * Safe JSON dump and restore with structure validation and cloud sync.
 */
import { state, STORAGE_KEYS } from './state.js';
import { getBankDetails } from './accounting.js';
import { saveClientsToStorage, syncAllClientsToCloud, syncVaultToCloud } from './sync.js';
import { showToast, updateKpis } from './ui.js';

export function openBackupModal() {
  const bankInput = document.getElementById("bankDetailsInput");
  if (bankInput) {
    bankInput.value = getBankDetails();
  }
  const modal = document.getElementById("backupModal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

export function closeBackupModal() {
  const modal = document.getElementById("backupModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

// Claves de localStorage que forman parte de la base de datos del panel (no preferencias ni sesión)
const BACKUP_KEY_PATTERN = /^(isapromo|isapromord|proposal_)/;
const BACKUP_EXCLUDED_KEYS = new Set([
  STORAGE_KEYS.AUTH, STORAGE_KEYS.PIN, STORAGE_KEYS.VIEW_MODE, STORAGE_KEYS.THEME
]);

function collectBackupStorage() {
  const storage = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && BACKUP_KEY_PATTERN.test(key) && !BACKUP_EXCLUDED_KEYS.has(key)) {
      storage[key] = localStorage.getItem(key);
    }
  }
  return storage;
}

export function exportDatabase() {
  const payload = {
    version: "3.0.0",
    exportedAt: new Date().toISOString(),
    clients: state.clients,
    accountingLedger: state.accountingLedger,
    storage: collectBackupStorage()
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.href = url;
  downloadAnchor.download = `isapromo_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast("Copia de seguridad completa descargada (clientes, contabilidad, propuestas y contratos)", "success");
}

// Devuelve { clients, accountingLedger, storage } validado, o lanza un Error con el motivo.
function parseBackup(imported) {
  if (Array.isArray(imported)) {
    // Formato antiguo: solo la lista de clientes
    return { clients: imported, accountingLedger: null, storage: {} };
  }
  if (!imported || typeof imported !== "object" || !Array.isArray(imported.clients)) {
    throw new Error("no contiene una lista de clientes");
  }
  const accountingLedger = imported.accountingLedger ?? null;
  if (accountingLedger !== null && !Array.isArray(accountingLedger)) {
    throw new Error("la contabilidad no tiene el formato esperado");
  }
  const storage = {};
  if (imported.storage !== undefined) {
    if (!imported.storage || typeof imported.storage !== "object" || Array.isArray(imported.storage)) {
      throw new Error("la sección de datos guardados no tiene el formato esperado");
    }
    for (const [key, value] of Object.entries(imported.storage)) {
      if (!BACKUP_KEY_PATTERN.test(key) || BACKUP_EXCLUDED_KEYS.has(key)) continue;
      if (typeof value !== "string") throw new Error(`el dato "${key}" no es texto`);
      try { JSON.parse(value); } catch (e) { throw new Error(`el dato "${key}" está dañado`); }
      storage[key] = value;
    }
  }
  return { clients: imported.clients, accountingLedger, storage };
}

export function importDatabase(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async function(e) {
    event.target.value = "";
    let backup;
    try {
      backup = parseBackup(JSON.parse(e.target.result));
    } catch (err) {
      alert("No se puede restaurar este archivo: " + err.message);
      return;
    }

    const validClients = backup.clients.filter(c => c && typeof c === "object" && c.id && c.name);
    if (validClients.length === 0) {
      alert("El archivo no contiene clientes válidos.");
      return;
    }
    const skipped = backup.clients.length - validClients.length;
    const summary = [
      `${validClients.length} clientes`,
      backup.accountingLedger ? `${backup.accountingLedger.length} movimientos contables` : null,
      Object.keys(backup.storage).length ? `${Object.keys(backup.storage).length} registros de propuestas, contratos y ajustes` : null
    ].filter(Boolean).join(", ");
    if (!confirm(`Se reemplazarán los datos actuales del panel con esta copia:\n${summary}.${skipped ? `\n(${skipped} clientes sin id o nombre se omitirán.)` : ""}\n\n¿Continuar?`)) {
      return;
    }

    try {
      Object.entries(backup.storage).forEach(([key, value]) => localStorage.setItem(key, value));
      state.clients = validClients;
      if (backup.accountingLedger) {
        state.accountingLedger = backup.accountingLedger;
        localStorage.setItem(STORAGE_KEYS.ACCOUNTING, JSON.stringify(backup.accountingLedger));
      }
      saveClientsToStorage(false);
      await syncAllClientsToCloud();
      await syncVaultToCloud();
      showToast("✅ Copia restaurada. Recargando el panel...", "success");
      closeBackupModal();
      setTimeout(() => window.location.reload(), 900);
    } catch (err) {
      alert("La copia se cargó en este navegador, pero falló la subida a la nube: " + err.message);
      if (window.renderClients) window.renderClients();
      updateKpis();
    }
  };
  reader.readAsText(file);
}
