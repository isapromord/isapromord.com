/**
 * ISAPromoRD - Communication & Reporting Engine
 * WhatsApp technical status reports, billing notice generators, and message builders.
 */
import { state } from './state.js';
import { getBankDetails } from './accounting.js';
import { showToast } from './ui.js';

let currentBillingClient = null;

// ==========================================
// TECHNICAL STATUS REPORT
// ==========================================
export function openReportModal(id) {
  const client = state.clients.find(c => c.id === id);
  if (!client) return;

  const latencyInfo = client.latencyMs ? `${client.latencyMs}ms (Óptimo <1s)` : "Operativo Anycast Global";
  const statusEmoji = client.status === "active" ? "🟢 100% Operativo y Seguro" : "🟡 En Mantenimiento Programado";

  const text = 
`🛡️ *REPORTE DE ESTADO TÉCNICO | ISAPromoRD*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 *Cliente:* ${client.name}
🌐 *Sitio Web:* ${client.liveUrl}
⚙️ *Infraestructura:* ${client.platform || 'Cloud Server Anycast'}
📊 *Estado:* ${statusEmoji}
⚡ *Velocidad:* ${latencyInfo}
🔒 *Certificado SSL:* Activo (HTTPS Seguro)
📅 *Próxima Revisión / Ciclo:* ${client.renewalDate || 'Programada'}

✅ *Notas de Servicio:*
${client.notes || 'Plataforma funcionando sin incidencias.'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ingeniería Web & Posicionamiento en República Dominicana
ISAPromoRD — https://isapromord.github.io`;

  const reportText = document.getElementById("reportText");
  if (reportText) reportText.value = text;
  
  const cleanPhone = (client.phone || "").replace(/\D/g, '');
  const encodedMsg = encodeURIComponent(text);
  const whatsappUrl = cleanPhone.length >= 10 
    ? `https://wa.me/${cleanPhone}?text=${encodedMsg}` 
    : `https://wa.me/?text=${encodedMsg}`;

  const sendLink = document.getElementById("sendWhatsappLink");
  if (sendLink) sendLink.href = whatsappUrl;

  const modal = document.getElementById("reportModal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

export function closeReportModal() {
  const modal = document.getElementById("reportModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

export function copyReportText() {
  const textarea = document.getElementById("reportText");
  if (!textarea) return;
  textarea.select();
  navigator.clipboard.writeText(textarea.value).then(() => {
    const btn = document.getElementById("copyReportBtn");
    if (btn) {
      const original = btn.innerHTML;
      btn.innerHTML = `<span>✅ ¡Copiado!</span>`;
      setTimeout(() => btn.innerHTML = original, 2000);
    }
  });
}

// ==========================================
// BILLING NOTICES & RETAINERS
// ==========================================
export function openBillingNoticeModal(id) {
  const client = state.clients.find(c => c.id === id);
  if (!client) return;
  currentBillingClient = client;

  const titleEl = document.getElementById("billingModalClientName");
  if (titleEl) titleEl.textContent = `Aviso Cobro — ${client.name}`;
  const phoneEl = document.getElementById("billingNoticePhone");
  if (phoneEl) phoneEl.value = client.phone || "";
  const amtEl = document.getElementById("billingNoticeAmount");
  if (amtEl) amtEl.value = client.fee || "RD$ 4,500 / mes";

  generateBillingNoticeMessage();
  updateBillingNoticeWhatsappLink();

  const modal = document.getElementById("billingNoticeModal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

export function closeBillingNoticeModal() {
  const modal = document.getElementById("billingNoticeModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
  currentBillingClient = null;
}

export function generateBillingNoticeMessage() {
  if (!currentBillingClient) return;
  const client = currentBillingClient;
  const amtEl = document.getElementById("billingNoticeAmount");
  const amount = amtEl ? amtEl.value.trim() || client.fee || "RD$ 4,500 / mes" : client.fee || "RD$ 4,500 / mes";
  const bankDetails = getBankDetails();

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const now = new Date();
  const currentMonthStr = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

  const text =
`🧾 *ESTADO DE CUENTA & RENOVACIÓN DE SERVICIO | ISAPromoRD*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 *Cliente:* ${client.name}
🌐 *Plataforma:* ${client.liveUrl}
📋 *Concepto:* Retainer Mensual — Mantenimiento Web, Hosting Cloud Anycast, Monitoreo 24/7 & Soporte
📅 *Período:* ${currentMonthStr}
💰 *Monto a Facturar:* ${amount}
📆 *Fecha de Renovación:* ${client.renewalDate || 'Ciclo Activo'}

${bankDetails}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 *Nota:* Una vez realizada la transferencia, favor de compartirnos el comprobante por este medio para asentar su pago en el sistema y remitir su recibo digital.

¡Agradecemos su preferencia y confianza continua en ISAPromoRD!
Dirección de Infraestructura & Operaciones
https://isapromord.github.io`;

  const noticeText = document.getElementById("billingNoticeText");
  if (noticeText) noticeText.value = text;
}

export function regenerateBillingMessage() {
  generateBillingNoticeMessage();
  updateBillingNoticeWhatsappLink();
}

export function updateBillingNoticeWhatsappLink() {
  const phoneEl = document.getElementById("billingNoticePhone");
  const phoneInput = phoneEl ? phoneEl.value.trim() : "";
  const cleanPhone = phoneInput.replace(/\D/g, '');
  const noticeText = document.getElementById("billingNoticeText");
  const text = noticeText ? noticeText.value : "";
  const encodedMsg = encodeURIComponent(text);

  const whatsappUrl = cleanPhone.length >= 10 
    ? `https://wa.me/${cleanPhone}?text=${encodedMsg}` 
    : `https://wa.me/?text=${encodedMsg}`;

  const link = document.getElementById("sendBillingWhatsappLink");
  if (link) link.href = whatsappUrl;
}

export function copyBillingNoticeText() {
  const textarea = document.getElementById("billingNoticeText");
  if (!textarea) return;
  textarea.select();
  navigator.clipboard.writeText(textarea.value).then(() => {
    const btn = document.getElementById("copyBillingNoticeBtn");
    if (btn) {
      const original = btn.innerHTML;
      btn.innerHTML = `<span>✅ ¡Copiado!</span>`;
      setTimeout(() => btn.innerHTML = original, 2000);
    }
  });
}

export function drawerOpenBillingNotice() {
  if (state.currentDrawerClientId) {
    openBillingNoticeModal(state.currentDrawerClientId);
  }
}
