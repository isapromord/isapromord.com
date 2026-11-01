/**
 * ISAPromoRD - NFC & QR Code Review Generator for Physical Acrylic Plaques
 * Generates direct Google Review intent URLs and high-res QR codes for display stands.
 */
import { state, AGENCY_REVIEW_URL } from './state.js';
import { showToast, copyToClipboard } from './ui.js';

export function openNfcGeneratorModal(client = null) {
  const modal = document.getElementById("nfcGeneratorModal");
  if (!modal) return;

  // Populate client select
  const select = document.getElementById("nfcModalClientSelect");
  if (select) {
    select.innerHTML = '<option value="">-- Modo Libre / Empresa Nueva --</option>';
    if (state.clients && state.clients.length > 0) {
      state.clients.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = `${c.name} (${c.category || 'General'})`;
        select.appendChild(opt);
      });
    }
  }

  const nameInput = document.getElementById("nfcModalBusinessName");
  const urlInput = document.getElementById("nfcModalInputUrl");
  const urlBox = document.getElementById("nfcResolvedUrlBox");
  const qrImg = document.getElementById("nfcQrImage");

  if (client) {
    if (select) select.value = client.id;
    if (nameInput) nameInput.value = client.name || "";
    // Solo la agencia usa su propio enlace; un cliente necesita el suyo de Google Business
    const isAgency = client.isAgency || client.id === "agency-isapromord";
    const stored = client.googleReviewUrl && (isAgency || client.googleReviewUrl !== AGENCY_REVIEW_URL) ? client.googleReviewUrl : "";
    const reviewUrl = stored || (isAgency ? AGENCY_REVIEW_URL : "");
    if (urlInput) urlInput.value = reviewUrl;
    if (urlBox) urlBox.textContent = reviewUrl || "Pega el enlace de reseñas de Google de este cliente (g.page/r/...)";
  } else {
    if (nameInput && !nameInput.value) nameInput.value = "ISAPromoRD";
    const defaultUrl = AGENCY_REVIEW_URL;
    if (urlInput && !urlInput.value) urlInput.value = defaultUrl;
    if (urlBox) urlBox.textContent = defaultUrl;
  }

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

export function closeNfcGeneratorModal() {
  const modal = document.getElementById("nfcGeneratorModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

export function openNfcGeneratorForClient(clientId) {
  const client = (state.clients || []).find(c => c.id === clientId);
  openNfcGeneratorModal(client);
}

export function handleNfcClientSelectChange() {
  const select = document.getElementById("nfcModalClientSelect");
  if (!select) return;
  const clientId = select.value;
  const client = (state.clients || []).find(c => c.id === clientId);
  if (client) {
    const nameInput = document.getElementById("nfcModalBusinessName");
    const urlInput = document.getElementById("nfcModalInputUrl");
    if (nameInput) nameInput.value = client.name || "";
    const isAgency = client.isAgency || client.id === "agency-isapromord";
    const stored = client.googleReviewUrl && (isAgency || client.googleReviewUrl !== AGENCY_REVIEW_URL) ? client.googleReviewUrl : "";
    if (urlInput) urlInput.value = stored || (isAgency ? AGENCY_REVIEW_URL : "");
    if (urlInput && urlInput.value) generateNfcAndQrCode();
  }
}

export function generateNfcAndQrCode() {
  const urlInput = document.getElementById("nfcModalInputUrl");
  const urlBox = document.getElementById("nfcResolvedUrlBox");
  const qrImg = document.getElementById("nfcQrImage");
  const select = document.getElementById("nfcModalClientSelect");

  let rawUrl = urlInput ? urlInput.value.trim() : "";
  if (!rawUrl) {
    showToast("Por favor ingresa un enlace de Google Reviews (g.page/r/...)", "warning");
    return;
  }

  // Ensure protocol
  if (!rawUrl.startsWith("http://") && !rawUrl.startsWith("https://")) {
    rawUrl = "https://" + rawUrl;
    if (urlInput) urlInput.value = rawUrl;
  }

  if (urlBox) urlBox.textContent = rawUrl;

  // Generate crisp QR code using high-speed API
  const encodedUrl = encodeURIComponent(rawUrl);
  const qrServiceUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&margin=10&data=${encodedUrl}`;

  if (qrImg) {
    qrImg.src = qrServiceUrl;
    qrImg.onload = () => {
      showToast("✓ Código QR de alta resolución generado", "success");
    };
  }

  // If a client is selected, persist their review url (never the agency's own link on a client)
  if (select && select.value) {
    const client = (state.clients || []).find(c => c.id === select.value);
    const isAgency = client && (client.isAgency || client.id === "agency-isapromord");
    if (client && (isAgency || rawUrl !== AGENCY_REVIEW_URL)) {
      client.googleReviewUrl = rawUrl;
      if (window.saveClientsToStorage) window.saveClientsToStorage(true);
    }
  }
}

export function copyNfcUrlToClipboard() {
  const urlBox = document.getElementById("nfcResolvedUrlBox");
  const text = urlBox ? urlBox.textContent.trim() : "";
  if (!text) return;
  copyToClipboard(text);
  showToast("✓ Enlace NFC copiado. Listo para pegar en la app NFC Tools.", "success");
}

export function downloadNfcQrImage() {
  const qrImg = document.getElementById("nfcQrImage");
  const nameInput = document.getElementById("nfcModalBusinessName");
  const bizName = (nameInput && nameInput.value.trim()) ? nameInput.value.trim().toLowerCase().replace(/\s+/g, '_') : 'isapromord';

  if (!qrImg || !qrImg.src) return;

  const a = document.createElement("a");
  a.href = qrImg.src;
  a.target = "_blank";
  a.download = `placa_nfc_qr_${bizName}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast("✓ Descarga de código QR iniciada para imprenta", "success");
}
