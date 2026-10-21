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
// BILLING NOTICES, REMINDERS & DIGITAL RECEIPTS
// ==========================================
let currentNoticeType = 'monthly'; // 'monthly' | 'deposit' | 'settlement' | 'receipt'
let currentMonthlySubtype = 'due_soon'; // 'due_soon' | 'today' | 'overdue'

export function setNoticeType(type) {
  currentNoticeType = type;

  // Update tabs UI
  const tabs = ['monthly', 'deposit', 'settlement', 'receipt'];
  tabs.forEach(t => {
    const el = document.getElementById(`noticeTab-${t}`);
    if (!el) return;
    if (t === type) {
      el.className = "px-2 py-1.5 rounded font-bold transition-all text-center bg-cyan-500/20 text-cyan-300 border border-cyan-500/30";
    } else {
      el.className = "px-2 py-1.5 rounded font-medium text-slate-400 hover:text-white transition-all text-center";
    }
  });

  // Toggle monthly subtypes row
  const subtypesRow = document.getElementById("monthlySubtypesRow");
  if (subtypesRow) {
    if (type === 'monthly') {
      subtypesRow.classList.remove('hidden');
      subtypesRow.classList.add('flex');
    } else {
      subtypesRow.classList.add('hidden');
      subtypesRow.classList.remove('flex');
    }
  }

  // Adjust default amount placeholder based on type
  const amtEl = document.getElementById("billingNoticeAmount");
  if (amtEl && currentBillingClient) {
    if (type === 'monthly') {
      amtEl.value = currentBillingClient.fee || "RD$ 2,000 / mes";
    } else if (type === 'deposit' || type === 'settlement') {
      // If client has a known setup price or 30k base, suggest 50% (RD$ 15,000)
      const rawSetup = Number((currentBillingClient.setupPrice || 30000).toString().replace(/\D/g, '')) || 30000;
      const half = rawSetup > 0 ? Math.round(rawSetup / 2) : 15000;
      amtEl.value = `RD$ ${half.toLocaleString('es-DO')}`;
    } else if (type === 'receipt') {
      amtEl.value = currentBillingClient.fee || "RD$ 15,000";
    }
  }

  generateBillingNoticeMessage();
  updateBillingNoticeWhatsappLink();
}

export function setMonthlySubtype(subtype) {
  currentMonthlySubtype = subtype;

  const subTabs = ['due_soon', 'today', 'overdue'];
  subTabs.forEach(st => {
    const el = document.getElementById(`subTab-${st}`);
    if (!el) return;
    if (st === subtype) {
      const colorClass = st === 'overdue' 
        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
        : (st === 'today' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30');
      el.className = `px-2.5 py-1 rounded text-[11px] font-bold ${colorClass}`;
    } else {
      el.className = "px-2.5 py-1 rounded text-[11px] font-medium text-slate-400 hover:text-white";
    }
  });

  generateBillingNoticeMessage();
  updateBillingNoticeWhatsappLink();
}

export function openBillingNoticeModal(id) {
  const client = state.clients.find(c => c.id === id);
  if (!client) return;
  currentBillingClient = client;

  const titleEl = document.getElementById("billingModalClientName");
  if (titleEl) titleEl.textContent = `Avisos & Recibos — ${client.name}`;
  const phoneEl = document.getElementById("billingNoticePhone");
  if (phoneEl) phoneEl.value = client.phone || "";

  // Reset to default monthly tab
  setNoticeType('monthly');
  setMonthlySubtype('due_soon');

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
  const amount = amtEl ? amtEl.value.trim() || client.fee || "RD$ 2,000 / mes" : client.fee || "RD$ 2,000 / mes";
  const numAmount = Number(amount.replace(/\D/g, '')) || 0;
  const bankDetails = getBankDetails();

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const now = new Date();
  const currentMonthStr = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
  const dateStr = now.toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' });
  const receiptId = `REC-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}-${(client.id || 'CLI').replace(/\D/g,'').slice(-3) || '101'}`;

  // Base receipt link construction
  const isProd = typeof window !== 'undefined' && window.location.origin.includes('github.io');
  const receiptBase = isProd 
    ? 'https://isapromord.github.io/isapromord.com/recibo/' 
    : (typeof window !== 'undefined' ? `${window.location.origin}/recibo/` : 'https://isapromord.github.io/recibo/');

  let text = "";

  if (currentNoticeType === 'monthly') {
    if (currentMonthlySubtype === 'due_soon') {
      text =
`🔔 *AVISO PREVENTIVO DE RENOVACIÓN | ISAPromoRD*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 *Cliente:* ${client.name}
🌐 *Plataforma:* ${client.liveUrl || 'https://isapromord.github.io'}
📋 *Concepto:* Renovación de Mantenimiento Web, Hosting Cloud Anycast, Monitoreo 24/7 & Soporte Técnico Continuo
📅 *Ciclo:* ${currentMonthStr}
💰 *Monto a Liquidar:* ${amount}
📆 *Próxima Fecha de Corte:* ${client.renewalDate || 'Próximos días'}

${bankDetails}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 *Nota:* Este es un recordatorio preventivo para coordinar su renovación sin interrupciones operativas. Al transferir, favor de remitir el comprobante para emitir su recibo digital oficial.

¡Gracias por su confianza continua en ISAPromoRD!
Dirección de Infraestructura & Operaciones`;

    } else if (currentMonthlySubtype === 'today') {
      text =
`🧾 *ESTADO DE CUENTA — DÍA DE CORTE | ISAPromoRD*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 *Cliente:* ${client.name}
🌐 *Plataforma:* ${client.liveUrl || 'https://isapromord.github.io'}
📋 *Concepto:* Retainer Mensual — Mantenimiento Web, Hosting Cloud Anycast, Monitoreo 24/7 & Soporte
📅 *Período Activo:* ${currentMonthStr}
💰 *Monto a Facturar:* ${amount}
📆 *Fecha de Corte:* Hoy (${dateStr})

${bankDetails}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 *Nota:* Le recordamos asentar la transferencia hoy para mantener activo el SLA de monitoreo y hosting. Remítanos el comprobante por este medio para asentar su pago y enviarle su recibo oficial.

¡Agradecemos su puntual preferencia!
Dirección de Infraestructura & Operaciones`;

    } else {
      // Overdue
      text =
`⚠️ *RECORDATORIO DE VENCIMIENTO (PERÍODO DE GRACIA) | ISAPromoRD*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 *Cliente:* ${client.name}
🌐 *Plataforma:* ${client.liveUrl || 'https://isapromord.github.io'}
📋 *Concepto:* Cuota Mensual de Mantenimiento & Hosting Web Anycast
📅 *Período en Mora:* ${currentMonthStr}
💰 *Monto Pendiente:* ${amount}
⏳ *Estado:* En período de gracia operativa

${bankDetails}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 *Aviso:* Para evitar la suspensión preventiva de las copias de seguridad automáticas y el monitoreo activo 24/7, agradecemos coordinar su liquidación a la mayor brevedad y compartirnos el volante de depósito.

Estamos a su entera disposición ante cualquier consulta.
Dirección de Finanzas & Soporte | ISAPromoRD`;
    }

  } else if (currentNoticeType === 'deposit') {
    text =
`🚀 *ANTICIPO 50% — INICIO DE PROYECTO WEB | ISAPromoRD*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 *Cliente:* ${client.name}
🌐 *Proyecto:* ${client.liveUrl || 'Plataforma Web Transaccional'}
📋 *Concepto:* Anticipo del 50% de Setup e Inicio de Desarrollo de Arquitectura Web de Alta Conversión
💰 *Monto de Anticipo (50%):* ${amount}
🔒 *Términos:* El 50% restante se liquida únicamente contra entrega conforme y verificación en vivo.

${bankDetails}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 *Siguiente Paso:* Una vez recibido el comprobante de transferencia, activamos el entorno de desarrollo y le asignamos fecha estimada de entrega preliminar.

¡Bienvenido a ISAPromoRD, iniciamos con entusiasmo!
Dirección de Proyectos & Desarrollo`;

  } else if (currentNoticeType === 'settlement') {
    text =
`🏁 *LIQUIDACIÓN FINAL 50% — ENTREGA DE PROYECTO | ISAPromoRD*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 *Cliente:* ${client.name}
🌐 *Plataforma Finalizada:* ${client.liveUrl || 'https://isapromord.github.io'}
📋 *Concepto:* Liquidación del 50% Completivo — Traspaso Formal de Credenciales, Puesta en Producción & Cierre de Setup
💰 *Monto a Liquidar (50% Final):* ${amount}
✨ *Estado:* Proyecto completado, verificado y aprobado.

${bankDetails}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 *Siguiente Paso:* Al confirmar la recepción del comprobante, emitiremos su Recibo Oficial de Liquidación 100% y le transferiremos los accesos de administración formal de su plataforma.

¡Felicidades por su nueva plataforma de clase mundial!
Dirección de Operaciones | ISAPromoRD`;

  } else if (currentNoticeType === 'receipt') {
    const receiptTypeParam = 'mensual';
    const receiptUrl = `${receiptBase}?id=${receiptId}&cliente=${encodeURIComponent(client.name)}&cat=${encodeURIComponent(client.category || 'Servicios Web')}&tipo=${receiptTypeParam}&monto=${numAmount || 2000}&fecha=${encodeURIComponent(dateStr)}`;

    text =
`🧾 *COMPROBANTE & RECIBO OFICIAL DE PAGO | ISAPromoRD*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Hola *${client.name}*, le confirmamos la recepción conforme de su pago por *${amount}*.
Su comprobante formal ha sido emitido y asentado en nuestro sistema contable.

📄 *No. Recibo:* ${receiptId}
📅 *Fecha:* ${dateStr}
💰 *Monto Recibido:* ${amount}
💳 *Concepto:* Servicios Tecnológicos & Mantenimiento Web

🔗 *Ver y Descargar Recibo Oficial (PDF / Impresión):*
${receiptUrl}

Agradecemos sinceramente su confianza continua en ISAPromoRD.
Dirección de Administración & Finanzas`;
  }

  const noticeText = document.getElementById("billingNoticeText");
  if (noticeText) noticeText.value = text;
}

export function openNoticeReceiptDirect() {
  if (!currentBillingClient) return;
  const client = currentBillingClient;
  const amtEl = document.getElementById("billingNoticeAmount");
  const amountStr = amtEl ? amtEl.value.trim() : "2000";
  const numAmount = Number(amountStr.replace(/\D/g, '')) || 2000;

  const typeMapping = {
    monthly: 'mensual',
    deposit: 'anticipo',
    settlement: 'completivo',
    receipt: 'mensual'
  };
  const receiptType = typeMapping[currentNoticeType] || 'mensual';
  const totalSetup = (receiptType === 'anticipo' || receiptType === 'completivo') ? (numAmount * 2) : numAmount;

  const now = new Date();
  const dateStr = now.toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' });
  const receiptId = `REC-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}-${(client.id || 'CLI').replace(/\D/g,'').slice(-3) || '101'}`;

  const isProd = typeof window !== 'undefined' && window.location.origin.includes('github.io');
  const receiptBase = isProd 
    ? 'https://isapromord.github.io/isapromord.com/recibo/' 
    : (typeof window !== 'undefined' ? `${window.location.origin}/recibo/` : '../recibo/');

  const params = new URLSearchParams({
    id: receiptId,
    cliente: client.name,
    cat: client.category || 'Servicios Web & Tecnología',
    tipo: receiptType,
    monto: numAmount,
    setup: totalSetup,
    fecha: dateStr
  });

  const fullUrl = `${receiptBase}?${params.toString()}`;
  window.open(fullUrl, '_blank');
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
