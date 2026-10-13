/**
 * ISAPromoRD - Database Backup & JSON Import/Export
 * Safe JSON dump and restore with structure validation and cloud sync.
 */
import { state } from './state.js';
import { getBankDetails } from './accounting.js';
import { saveClientsToStorage } from './sync.js';
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

export function exportDatabase() {
  const payload = {
    version: "2.0.0",
    exportedAt: new Date().toISOString(),
    clients: state.clients,
    accountingLedger: state.accountingLedger
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `isapromo_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast("Copia de seguridad descargada", "success");
}

export function importDatabase(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      let clientsToImport = null;

      if (Array.isArray(imported)) {
        clientsToImport = imported;
      } else if (imported && Array.isArray(imported.clients)) {
        clientsToImport = imported.clients;
      }

      if (clientsToImport && clientsToImport.length > 0) {
        state.clients = clientsToImport;
        saveClientsToStorage(true);
        if (window.renderClients) window.renderClients();
        updateKpis();
        showToast("✅ Base de datos restaurada y sincronizada", "success");
        closeBackupModal();
      } else {
        alert("El archivo no contiene un formato de clientes válido.");
      }
    } catch (err) {
      alert("Error al leer el archivo JSON: " + err.message);
    }
  };
  reader.readAsText(file);
}
