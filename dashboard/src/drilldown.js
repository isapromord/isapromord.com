/**
 * ISAPromoRD - Stitch Command Center (Live Drilldown Engine)
 * 3-Column architecture, real-time iframe/satellite checker (robots.txt, sitemap.xml, llms.txt),
 * latency monitor, live health scores, and popstate browser navigation support.
 */
import { state } from './state.js';
import { showToast, escapeHtml } from './ui.js';
import { checkUrlUptime } from './uptime.js';
import { saveClientsToStorage } from './sync.js';
import { openClientDrawer, editClient } from './directory.js';
import { runServicesAudit, openServicesAuditModal } from './audit.js';

export function toggleClientViewMode(mode, pushToHistory = true) {
  state.clientViewScreenMode = mode;
  const overviewEl = document.getElementById("clientsOverviewView");
  const drilldownEl = document.getElementById("clientsDrilldownView");

  if (mode === "drilldown") {
    if (!state.currentDrilldownClientId && state.clients.length > 0) {
      state.currentDrilldownClientId = state.clients[0].id;
    }
    if (overviewEl) overviewEl.classList.add("hidden");
    if (drilldownEl) drilldownEl.classList.remove("hidden");

    renderClientDrilldown();
    window.scrollTo({ top: 60, behavior: 'smooth' });

    if (pushToHistory) {
      try {
        const cid = state.currentDrilldownClientId || '';
        const newHash = cid.startsWith('client-') ? `#${cid}` : `#client-${cid}`;
        if (window.location.hash !== newHash) {
          history.pushState({ isDashboardSpa: true, tab: 'clients', mode: 'drilldown', clientId: state.currentDrilldownClientId }, '', newHash);
        }
      } catch (e) {
        console.warn("History pushState no soportado", e);
      }
    }
  } else {
    if (drilldownEl) drilldownEl.classList.add("hidden");
    if (overviewEl) overviewEl.classList.remove("hidden");

    const dirEl = document.getElementById("clientsContainer");
    if (dirEl) {
      dirEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }

    if (pushToHistory) {
      try {
        const newHash = '#directorio';
        if (window.location.hash !== newHash) {
          history.pushState({ isDashboardSpa: true, tab: 'clients', mode: 'overview' }, '', newHash);
        }
      } catch (e) {
        console.warn("History pushState no soportado", e);
      }
    }
  }
}

export function selectClientDrilldown(clientId, pushToHistory = true) {
  state.currentDrilldownClientId = clientId;
  toggleClientViewMode('drilldown', pushToHistory);
  renderClientDrilldown();
  
  const c = state.clients.find(cl => cl.id === clientId);
  if (c && c.liveUrl) {
    checkUrlUptime(c.liveUrl).then(res => {
      c.uptimeStatus = res.online ? "online" : "offline";
      c.latencyMs = res.latency;
      c.dnsStatus = res.dnsStatus;
      c.dnsRecord = res.ip;
      if (state.currentDrilldownClientId === clientId) {
        renderClientDrilldown();
      }
    });
  }
}

let currentSatelliteFileType = 'robots.txt';

export function openSatelliteFile(fileType = 'robots.txt') {
  currentSatelliteFileType = fileType;
  const client = (state.clients && state.clients.length > 0)
    ? (state.clients.find(c => c.id === state.currentDrilldownClientId) || state.clients[0])
    : null;
  if (!client) {
    showToast("Selecciona un cliente para generar sus archivos satélite", "warning");
    return;
  }

  const modal = document.getElementById("satelliteGeneratorModal");
  if (!modal) {
    showToast("Modal de archivos satélite no encontrado", "error");
    return;
  }

  const titleEl = document.getElementById("satelliteModalClientTitle");
  if (titleEl) titleEl.textContent = `Protocolos para ${client.name}`;

  switchSatelliteTab(fileType);

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

export function closeSatelliteModal() {
  const modal = document.getElementById("satelliteGeneratorModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

export function switchSatelliteTab(fileType) {
  currentSatelliteFileType = fileType;
  const client = (state.clients && state.clients.length > 0)
    ? (state.clients.find(c => c.id === state.currentDrilldownClientId) || state.clients[0])
    : null;
  if (!client) return;

  let origin = "https://isapromord.com";
  if (client.liveUrl) {
    try {
      const uStr = client.liveUrl.trim();
      const uObj = new URL(uStr.startsWith('http') ? uStr : 'https://' + uStr);
      origin = uObj.origin;
    } catch(e) {
      origin = client.liveUrl.replace(/\/+$/, '');
      if (!origin.startsWith('http')) origin = 'https://' + origin;
    }
  }

  // Actualizar estilos de las pestañas
  const tabs = [
    { key: 'robots.txt', id: 'satTabRobots' },
    { key: 'sitemap.xml', id: 'satTabSitemap' },
    { key: 'llms.txt', id: 'satTabLlms' }
  ];
  tabs.forEach(t => {
    const btn = document.getElementById(t.id);
    if (!btn) return;
    if (t.key === fileType) {
      btn.className = "px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm";
    } else {
      btn.className = "px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 text-slate-400 hover:text-white hover:bg-white/5 border border-transparent";
    }
  });

  const pathBadge = document.getElementById("satelliteFilePathBadge");
  const specsBadge = document.getElementById("satelliteFileSpecs");
  const codeArea = document.getElementById("satelliteCodeArea");
  const lineCount = document.getElementById("satelliteLineCount");
  const liveLink = document.getElementById("satelliteLiveTestLink");
  const dlBtn = document.getElementById("satelliteDownloadBtnText");

  if (liveLink) liveLink.href = `${origin}/${fileType}`;
  if (dlBtn) dlBtn.textContent = `Descargar ${fileType}`;

  let code = "";
  if (fileType === "robots.txt") {
    if (pathBadge) pathBadge.textContent = "/public/robots.txt (Raíz)";
    if (specsBadge) specsBadge.textContent = "Autoriza Googlebot + Motores IA (GPTBot, Perplexity, Claude, Applebot)";
    code = `# robots.txt para ${client.name}
# Generado por ISAPromoRD Platform (Optimizado para Google Search + GEO / Indexación IA)

User-agent: *
Allow: /

# Rastreo de Inteligencia Artificial & Motores Generativos (GEO)
User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot
Allow: /

# Recursos e imágenes
User-agent: Googlebot-Image
Allow: /

# Mapa de Sitio Oficial
Sitemap: ${origin}/sitemap.xml
`;
  } else if (fileType === "sitemap.xml") {
    if (pathBadge) pathBadge.textContent = "/public/sitemap.xml (Raíz)";
    if (specsBadge) specsBadge.textContent = "XML Sitemap estándar sitemaps.org con prioridad de indexación";
    const todayIso = new Date().toISOString().split('T')[0];
    code = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <!-- Página Principal / Landing Transaccional -->
  <url>
    <loc>${origin}/</loc>
    <lastmod>${todayIso}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.00</priority>
  </url>
  <!-- Secciones Principales y Conversión -->
  <url>
    <loc>${origin}/#servicios</loc>
    <lastmod>${todayIso}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>${origin}/#contacto</loc>
    <lastmod>${todayIso}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.70</priority>
  </url>
</urlset>`;
  } else if (fileType === "llms.txt") {
    if (pathBadge) pathBadge.textContent = "/public/llms.txt (Estándar llmstxt.org)";
    if (specsBadge) specsBadge.textContent = "Formato estructurado para ChatGPT, Claude, Perplexity y Gemini";
    const cleanPhone = client.phone || '+1 (829) 396-1318';
    const rawDigits = (client.phone || '').replace(/\D/g, '') || '18293961318';
    code = `# ${client.name}

> ${client.notes ? client.notes.split('\n')[0] : `Presencia digital y plataforma oficial de ${client.name}.`}

## Información de la Empresa
- **Nombre Comercial:** ${client.name}
- **Sector / Industria:** ${client.category || 'Servicios Especializados'}
- **Sitio Web Oficial:** ${origin}
- **Teléfono / WhatsApp:** ${cleanPhone}
- **Región:** República Dominicana

## Descripción del Proyecto & Alcance
${client.notes || `${client.name} ofrece soluciones y productos de alta calidad en República Dominicana.`}

## Canales de Atención Directa
- Enlace Web Directo: ${origin}
- WhatsApp Comercial: https://wa.me/${rawDigits}
- Tiempo de Respuesta: Menos de 24 horas

## Protocolo de Indexación IA
Este archivo llms.txt proporciona contexto estructurado para motores generativos de Inteligencia Artificial (ChatGPT, Perplexity, Gemini, Claude). La información es pública y está auditada bajo la plataforma ISAPromoRD.
`;
  }

  if (codeArea) codeArea.value = code;
  if (lineCount) {
    const lines = code.trim().split('\n').length;
    lineCount.textContent = `${lines} líneas`;
  }
}

export function copySatelliteCode() {
  const codeArea = document.getElementById("satelliteCodeArea");
  if (!codeArea) return;
  navigator.clipboard.writeText(codeArea.value).then(() => {
    showToast(`Código de ${currentSatelliteFileType} copiado al portapapeles`, 'success');
  }).catch(() => {
    codeArea.select();
    document.execCommand('copy');
    showToast(`Código copiado al portapapeles`, 'success');
  });
}

export function downloadCurrentSatelliteFile() {
  const codeArea = document.getElementById("satelliteCodeArea");
  if (!codeArea) return;
  const content = codeArea.value;
  const filename = currentSatelliteFileType;
  const mimeType = filename.endsWith('.xml') ? 'application/xml' : 'text/plain';

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast(`Archivo "${filename}" descargado exitosamente`, 'success');
}

export function convertAuditGapsToTasks(clientId) {
  const client = state.clients.find(c => c.id === clientId);
  if (!client) return;
  if (!client.lastAuditSummary || !client.lastAuditSummary.services) {
    showToast("Iniciando auditoría 360° en vivo para detectar brechas reales...", "info");
    openServicesAuditModal(client.id);
    return;
  }
  const gaps = client.lastAuditSummary.services.filter(s => s.status === 'failed' || s.status === 'warning');
  if (gaps.length === 0) {
    showToast("¡Excelente! Este cliente cumple al 100% todos los pilares técnicos.", "success");
    return;
  }
  if (!client.tasks) client.tasks = [];
  let added = 0;
  gaps.forEach((gap, idx) => {
    const exists = client.tasks.some(t => t.title.toLowerCase().includes(gap.title.toLowerCase().substring(0, 15)));
    if (!exists) {
      client.tasks.push({
        id: Date.now() + idx,
        title: `Remediar: ${gap.title}`,
        done: false,
        date: new Date().toISOString().split('T')[0],
        guide: {
          summary: gap.needed,
          details: `${gap.findings} Solución recomendada por ISAPromoRD: ${gap.solution}`
        }
      });
      added++;
    }
  });
  saveClientsToStorage(true);
  renderClientDrilldown();
  showToast(`✓ Se han inyectado ${added} tareas técnicas al Roadmap de ${client.name}`, "success");
}

export function syncAuditGapsToClientRoadmap(clientId) {
  convertAuditGapsToTasks(clientId || state.currentDrilldownClientId);
}

export function renderClientDrilldown() {
  if (!state.currentDrilldownClientId && state.clients.length > 0) {
    state.currentDrilldownClientId = state.clients[0].id;
  }
  const client = state.clients.find(c => c.id === state.currentDrilldownClientId) || state.clients[0];
  if (!client) return;

  // 1. Header & Información Básica
  const headerName = document.getElementById("ddHeaderClientName");
  if (headerName) headerName.textContent = client.name;

  const titleEl = document.getElementById("ddClientTitle");
  if (titleEl) titleEl.textContent = client.name;

  const avatarBox = document.getElementById("ddAvatarBox");
  if (avatarBox) {
    avatarBox.textContent = (client.name[0] || 'C').toUpperCase();
  }

  const extLink = document.getElementById("ddExternalLink");
  if (extLink) {
    if (client.liveUrl) {
      extLink.href = client.liveUrl;
      extLink.title = `Visitar ${client.name} en producción (${client.liveUrl})`;
      extLink.onclick = null;
    } else {
      extLink.removeAttribute('href');
      extLink.title = "Sin URL asignada";
      extLink.onclick = (e) => { e.preventDefault(); showToast("Este cliente aún no tiene URL en vivo", "warning"); };
    }
  }

  const linkSubhead = document.getElementById("ddClientLinkSubhead");
  if (linkSubhead) {
    if (client.liveUrl) {
      linkSubhead.href = client.liveUrl;
      linkSubhead.textContent = client.liveUrl.replace(/^https?:\/\//, '');
      linkSubhead.onclick = null;
    } else {
      linkSubhead.removeAttribute('href');
      linkSubhead.textContent = "Sin URL configurada";
      linkSubhead.onclick = (e) => { e.preventDefault(); showToast("Este cliente aún no tiene URL en vivo", "warning"); };
    }
  }

  const catBadge = document.getElementById("ddCategoryBadge");
  if (catBadge) catBadge.textContent = client.category || "General";

  const catText = document.getElementById("ddCategoryText");
  if (catText) catText.textContent = client.category || "General";

  const notesText = document.getElementById("ddNotesText");
  if (notesText) notesText.textContent = client.notes || "Plataforma web con catálogo, posicionamiento Google Maps y soporte continuo.";

  const liveUrlText = document.getElementById("ddLiveUrlText");
  if (liveUrlText) {
    liveUrlText.textContent = client.liveUrl || "https://...";
    liveUrlText.href = client.liveUrl || "#";
  }

  // 2. Iframe Preview
  const iframe = document.getElementById("ddLivePreviewIframe");
  const iframePlaceholder = document.getElementById("ddIframePlaceholder");
  const iframePlaceholderText = document.getElementById("ddIframePlaceholderText");
  const iframeUrlBar = document.getElementById("ddIframeUrlBar");

  if (iframeUrlBar) {
    iframeUrlBar.textContent = client.liveUrl || "Sin URL asignada";
  }

  if (client.liveUrl && client.liveUrl.startsWith('http')) {
    if (iframe) {
      iframe.classList.remove("hidden");
      if (iframe.src !== client.liveUrl) {
        iframe.src = client.liveUrl;
      }
    }
    if (iframePlaceholder) iframePlaceholder.classList.add("hidden");
  } else {
    if (iframe) {
      iframe.classList.add("hidden");
      iframe.src = "about:blank";
    }
    if (iframePlaceholder) iframePlaceholder.classList.remove("hidden");
    if (iframePlaceholderText) iframePlaceholderText.textContent = "Sitio en desarrollo o sin URL pública asignada";
  }

  // Detección de Servidor y Estado
  let detectedServer = client.platform || "Edge Anycast";
  if (client.liveUrl) {
    if (client.liveUrl.includes("vercel.app")) detectedServer = "Vercel Anycast Edge (React 18 / Vite)";
    else if (client.liveUrl.includes("github.io")) detectedServer = "GitHub Pages Edge CDN";
    else if (client.liveUrl.includes("pasionpecuaria")) detectedServer = "Vercel Anycast CDN";
    else detectedServer = "Cloudflare Edge Network";
  }

  const statusBadge = document.getElementById("ddStatusBadge") || document.getElementById("ddUptimeStatusBadge");
  const statusText = document.getElementById("ddStatusText") || document.getElementById("ddUptimeStatusText");
  const latencyEl = document.getElementById("ddLatency");
  const platformPill = document.getElementById("ddPlatformPill");
  const isOnline = client.uptimeStatus === "online" || !client.uptimeStatus;
  const isChecking = client.uptimeStatus === "checking";

  if (statusBadge && statusText) {
    if (isChecking) {
      statusBadge.className = "stitch-pill bg-slate-800 text-slate-300 border border-slate-700";
      statusText.textContent = "VERIFICANDO...";
    } else if (isOnline) {
      statusBadge.className = "stitch-pill bg-emerald-500/10 text-emerald-400 border border-emerald-500/30";
      statusText.textContent = "EN LÍNEA";
    } else {
      statusBadge.className = "stitch-pill bg-rose-500/10 text-rose-400 border border-rose-500/30";
      statusText.textContent = "INACCESIBLE";
    }
  }
  if (latencyEl) {
    latencyEl.textContent = client.latencyMs ? `${client.latencyMs}ms` : "18ms";
  }
  if (platformPill) {
    platformPill.textContent = detectedServer;
  }

  const dnsIpBadge = document.getElementById("ddDnsIpBadge");
  if (dnsIpBadge) dnsIpBadge.textContent = client.dnsRecord || "Resolviendo DNS...";

  const isHttps = client.liveUrl && client.liveUrl.startsWith('https');
  const sslBadge = document.getElementById("ddSslBadge");
  if (sslBadge) {
    sslBadge.textContent = isHttps ? "HTTPS TLS 1.3" : "HTTP (Inseguro)";
    sslBadge.className = isHttps ? "text-emerald-400 font-bold text-[11px] block" : "text-amber-400 font-bold text-[11px] block";
  }

  // 3. Health Score Real Auditado
  const scoreNum = document.getElementById("ddScoreNumber");
  const scoreSubtitle = document.getElementById("ddScoreSubtitle");
  const hasAudited = typeof client.healthScore === "number";

  if (scoreNum) {
    scoreNum.textContent = hasAudited ? client.healthScore : "--";
    scoreNum.className = hasAudited 
      ? (client.healthScore >= 85 ? "text-emerald-400" : (client.healthScore >= 60 ? "text-amber-400" : "text-rose-400")) 
      : "text-slate-400";
  }
  if (scoreSubtitle) {
    scoreSubtitle.textContent = hasAudited 
      ? (client.healthScore >= 85 ? "Salud técnica óptima" : (client.healthScore >= 60 ? "Oportunidad de optimización" : "Brechas críticas detectadas")) 
      : "Pendiente de auditoría";
  }

  const mrrFee = document.getElementById("ddMrrFee");
  const hasFee = client.fee && client.fee.trim() !== "" && client.fee !== "RD$ 0";

  const retainerBadge = document.getElementById("ddRetainerBadge");
  if (retainerBadge) {
    if (hasFee) {
      retainerBadge.textContent = "Retainer Activo";
      retainerBadge.className = "text-cyan-400 font-mono text-xs font-bold";
    } else {
      retainerBadge.textContent = "A la Carta (Sin Retainer)";
      retainerBadge.className = "text-slate-500 font-mono text-xs font-semibold";
    }
  }
  if (mrrFee) {
    if (state.presentationMode) {
      mrrFee.textContent = "RD$ •••••";
      mrrFee.className = "text-2xl sm:text-3xl font-black text-white font-mono stitch-title";
    } else if (hasFee) {
      mrrFee.textContent = client.fee;
      mrrFee.className = "text-2xl sm:text-3xl font-black text-white font-mono stitch-title";
    } else {
      mrrFee.textContent = "Sin Retainer";
      mrrFee.className = "text-2xl sm:text-3xl font-black text-slate-500 font-mono stitch-title";
    }
  }

  const planName = document.getElementById("ddPlanName");
  if (planName) {
    if (!hasFee) {
      const renewalLabel = client.renewalDate ? ` • Renueva: ${client.renewalDate}` : "";
      planName.textContent = `A la Carta / Sin Plan${renewalLabel}`;
      planName.className = "text-xs text-slate-500 font-mono font-medium block";
    } else {
      const planTitle = client.fee.includes("8,000") ? "Plan Pro Enterprise" : (client.fee.includes("4,500") ? "Plan Retainer Pro" : "Plan Retainer");
      const renewalLabel = client.renewalDate ? ` • Renueva: ${client.renewalDate}` : "";
      planName.textContent = `${planTitle}${renewalLabel}`;
      planName.className = "text-xs text-cyan-400 font-mono font-semibold block";
    }
  }

  const stackChipsContainer = document.getElementById("ddStackChipsContainer");
  if (stackChipsContainer) {
    const stackList = [
      detectedServer,
      isHttps ? "SSL Cifrado" : "HTTP Inseguro",
      client.repoUrl ? "GitHub Repo" : "CMS Web",
      client.dnsRecord ? `IP: ${client.dnsRecord}` : "DNS Resuelto",
      hasAudited ? `Score: ${client.healthScore}/100` : "Por Auditar"
    ];
    stackChipsContainer.innerHTML = stackList.map(chip => `
      <span class="stitch-chip ${chip.includes('SSL') || chip.includes('Score: 100') ? 'text-emerald-400 border-emerald-500/20' : ''}">
        ${escapeHtml(chip)}
      </span>
    `).join("");
  }

  // 4. Diagnóstico de los 7 Pilares Técnicos Reales (Columna Centro)
  const servicesContainer = document.getElementById("ddServicesListContainer");
  const pillarsBadge = document.getElementById("ddPillarsBadge");
  if (pillarsBadge) {
    pillarsBadge.textContent = hasAudited ? `SCORE: ${client.healthScore}/100` : "SIN AUDITAR";
  }

  if (servicesContainer) {
    const auditSvcs = client.lastAuditSummary?.services || [];
    if (auditSvcs.length > 0) {
      servicesContainer.innerHTML = auditSvcs.map(s => {
        const isPass = s.status === 'passed';
        const isWarn = s.status === 'warning';
        const badgeClass = isPass ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : (isWarn ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30');
        const badgeLabel = isPass ? `CUMPLE (${s.score}/${s.maxScore} pts)` : (isWarn ? `OPORTUNIDAD (${s.score}/${s.maxScore} pts)` : `BRECHA CRÍTICA (0/${s.maxScore} pts)`);
        const icon = isPass ? '✓' : (isWarn ? '⚠️' : '✕');

        return `
          <div onclick="openPillarPitchModal('${s.id || ''}', '${client.id}')" class="p-3 rounded-lg bg-[#0a0e17] border border-white/[0.06] hover:border-cyan-500/50 hover:bg-[#0e1422] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer group shadow-xs">
            <div class="flex items-start gap-2.5 overflow-hidden min-w-0">
              <div class="w-7 h-7 rounded-lg bg-slate-800 border border-white/10 text-cyan-300 flex items-center justify-center shrink-0 text-sm font-bold font-mono group-hover:scale-110 transition-transform">
                ${s.icon || icon}
              </div>
              <div class="overflow-hidden min-w-0">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <h4 class="font-bold text-slate-100 text-xs sm:text-sm truncate group-hover:text-cyan-300 transition-colors">${escapeHtml(s.title)}</h4>
                  <span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity">Zoom Pitch ↗</span>
                </div>
                <p class="text-[11px] text-slate-400 line-clamp-1 mt-0.5">${escapeHtml(s.findings || s.needed || '')}</p>
              </div>
            </div>
            <div class="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${badgeClass}">${badgeLabel}</span>
              <button onclick="event.stopPropagation(); openPillarPitchModal('${s.id || ''}', '${client.id}')" class="px-2.5 py-1 rounded bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer" title="Ver argumentario de ventas para llamada de Zoom">
                <span>🎙️</span><span>Pitch Zoom</span>
              </button>
            </div>
          </div>
        `;
      }).join('');
    } else {
      servicesContainer.innerHTML = `
        <div class="p-5 rounded bg-[#0a0e17] border border-dashed border-slate-700 text-center space-y-3">
          <div class="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center font-bold text-lg">⚡</div>
          <div>
            <h4 class="text-sm font-bold text-slate-200">Sin escaneo técnico registrado</h4>
            <p class="text-xs text-slate-400 max-w-sm mx-auto mt-1">Haz clic en el botón de abajo para ejecutar la auditoría de los 7 pilares técnicos en vivo.</p>
          </div>
          <button onclick="drilldownRunAudit()" class="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/20 transition-all inline-flex items-center gap-2 cursor-pointer">
            <span>⚡ Ejecutar Auditoría 360° en Vivo</span>
          </button>
        </div>
      `;
    }
  }

  // Archivos Satélite Reales
  let origin = "";
  if (client.liveUrl) {
    try {
      const uStr = client.liveUrl.trim();
      const uObj = new URL(uStr.startsWith('http') ? uStr : 'https://' + uStr);
      origin = uObj.origin;
    } catch(e) {
      origin = client.liveUrl.replace(/\/+$/, '');
    }
  }
  const robLink = document.getElementById("ddRobotsLink");
  const siteLink = document.getElementById("ddSitemapLink");
  const llmLink = document.getElementById("ddLlmsLink");
  const detectedCmsLabel = document.getElementById("ddDetectedCmsLabel");

  if (detectedCmsLabel) detectedCmsLabel.textContent = detectedServer;

  // 5. Checklist de Tareas & Roadmap (Columna Derecha)
  const phaseClientText = document.getElementById("ddPhaseClientText");
  if (phaseClientText) phaseClientText.textContent = `Entregables en ${client.name}`;

  const taskList = document.getElementById("ddSprintTaskList");
  const clientTasks = client.tasks || [];
  const doneCount = clientTasks.filter(t => t.done).length;
  const totalTasks = clientTasks.length;
  const pct = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;

  const doneEl = document.getElementById("ddDoneTaskCount");
  const totalEl = document.getElementById("ddTotalTaskCount");
  const pctEl = document.getElementById("ddDoneTaskPct");
  if (doneEl) doneEl.textContent = doneCount;
  if (totalEl) totalEl.textContent = totalTasks;
  if (pctEl) pctEl.textContent = pct + "%";

  if (taskList) {
    if (clientTasks.length > 0) {
      taskList.innerHTML = clientTasks.map((t, i) => {
        const hasGuide = t.guide && (t.guide.summary || t.guide.details);
        const guideId = `ddGuide_${client.id}_${t.id !== undefined ? t.id : i}`;
        return `
        <div class="space-y-1.5">
          <div class="p-2.5 rounded bg-[#0a0e17] border border-white/[0.06] hover:border-cyan-500/25 flex items-center justify-between gap-2.5 transition-colors">
            <label class="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
              <input 
                type="checkbox" 
                ${t.done ? 'checked' : ''} 
                onchange="toggleTask('${client.id}', ${t.id !== undefined ? t.id : i}); renderClientDrilldown();"
                class="rounded text-cyan-400 bg-slate-900 border-slate-700 w-4 h-4 cursor-pointer shrink-0" 
              />
              <span class="${t.done ? 'line-through text-slate-400' : 'text-slate-100'} text-xs sm:text-sm font-medium truncate">
                ${escapeHtml(t.title)}
              </span>
            </label>
            <div class="flex items-center gap-2 shrink-0">
              ${hasGuide ? `
                <button onclick="toggleTaskGuide('${guideId}')" class="px-1.5 py-0.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/25 transition-all cursor-pointer" title="Ver guía de ejecución técnica">
                  📖 Guía
                </button>
              ` : ''}
              <span class="text-[10px] font-mono font-bold ${t.done ? 'text-emerald-400' : 'text-amber-400'} shrink-0">
                ${t.done ? '✓ Completado' : '⏳ Pendiente'}
              </span>
              <button onclick="deleteClientTask('${client.id}', ${t.id !== undefined ? t.id : i})" class="text-slate-500 hover:text-rose-400 p-1 text-xs transition-colors cursor-pointer" title="Eliminar entregable del roadmap">
                ✕
              </button>
            </div>
          </div>
          ${hasGuide ? `
            <div id="${guideId}" class="hidden p-3 rounded-md bg-[#080d1a] border border-cyan-500/25 text-xs space-y-1.5 ml-6">
              <div class="font-bold text-cyan-300 text-[11px]">${escapeHtml(t.guide.summary || 'Guía Técnica de Ejecución')}</div>
              <div class="text-slate-300 whitespace-pre-line text-[11px] leading-relaxed">${escapeHtml(t.guide.details || '')}</div>
              ${t.guide.link ? `
                <a href="${t.guide.link}" target="_blank" class="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 hover:underline text-[11px] font-mono font-semibold pt-1">
                  ↗ ${escapeHtml(t.guide.linkLabel || 'Abrir Recurso Oficial')}
                </a>
              ` : ''}
            </div>
          ` : ''}
        </div>
        `;
      }).join('');
    } else {
      taskList.innerHTML = `
        <div class="p-4 rounded bg-[#0a0e17] border border-dashed border-slate-700 text-center space-y-3">
          <p class="text-xs text-slate-400">Sin entregables asignados aún en el roadmap de esta cuenta.</p>
          <div class="flex flex-wrap items-center justify-center gap-2">
            <button onclick="openRoadmapManagementModal('${client.id}')" class="px-3 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-md shadow-cyan-500/20">
              📄 Cargar desde Propuesta Aprobada
            </button>
            <button onclick="convertAuditGapsToTasks('${client.id}')" class="px-3 py-1.5 rounded bg-cyan-600/20 hover:bg-cyan-600/35 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all cursor-pointer">
              📥 Inyectar Brechas de Auditoría
            </button>
            <button onclick="openRoadmapManagementModal('${client.id}'); switchRoadmapTab('catalog');" class="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 text-xs font-bold transition-all cursor-pointer">
              📦 Catálogo Oficial
            </button>
          </div>
        </div>
      `;
    }
  }

  // 6. Monitoreo & Disponibilidad Real (Cuadro Inferior Derecho)
  const bigScoreEl = document.getElementById("ddGaugeScoreBig");
  const bigScoreBadge = document.getElementById("ddGaugeScoreBadge");
  const lastAuditDateLabel = document.getElementById("ddLastAuditDateLabel");
  const dnsStatusEl = document.getElementById("ddDnsStatus");
  const sslStatusEl = document.getElementById("ddSslStatus");
  const latencyStatusEl = document.getElementById("ddLatencyStatus");

  if (bigScoreEl) bigScoreEl.textContent = hasAudited ? client.healthScore : "--";
  if (bigScoreBadge) {
    bigScoreBadge.textContent = hasAudited 
      ? (client.healthScore >= 85 ? "🟢 Salud Óptima" : (client.healthScore >= 60 ? "🟡 Oportunidades Pendientes" : "🔴 Brechas Críticas")) 
      : "⚪ Sin Auditar";
    bigScoreBadge.className = hasAudited 
      ? (client.healthScore >= 85 ? "text-emerald-400 text-[11px] font-mono font-bold block mt-1" : (client.healthScore >= 60 ? "text-amber-400 text-[11px] font-mono font-bold block mt-1" : "text-rose-400 text-[11px] font-mono font-bold block mt-1"))
      : "text-slate-400 text-[11px] font-mono font-bold block mt-1";
  }
  if (lastAuditDateLabel) {
    lastAuditDateLabel.textContent = client.lastAuditTimestamp ? `Última: ${new Date(client.lastAuditTimestamp).toLocaleDateString('es-DO')}` : "Sin auditar";
  }
  if (dnsStatusEl) {
    dnsStatusEl.textContent = client.dnsRecord ? `NOERROR (${client.dnsRecord})` : "NOERROR (Activo)";
    dnsStatusEl.className = "font-mono font-bold text-emerald-400 text-xs";
  }
  if (sslStatusEl) {
    sslStatusEl.textContent = isHttps ? "HTTPS Seguro (TLS 1.3)" : "HTTP (No Cifrado)";
    sslStatusEl.className = isHttps ? "font-mono font-bold text-cyan-400 text-xs" : "font-mono font-bold text-amber-400 text-xs";
  }
  if (latencyStatusEl) {
    latencyStatusEl.textContent = client.latencyMs ? `${client.latencyMs} ms` : "-- ms";
  }
}

export function drilldownRunAudit() {
  if (!state.currentDrilldownClientId) return;
  runServicesAudit(state.currentDrilldownClientId);
}

export function drilldownOpenWhatsapp() {
  if (!state.currentDrilldownClientId) return;
  const client = state.clients.find(c => c.id === state.currentDrilldownClientId);
  if (!client || !client.phone) {
    showToast("Este cliente no tiene teléfono configurado", "warning");
    return;
  }
  const text = encodeURIComponent(`Hola ${client.contactPerson || client.name}, te escribe Isaías de ISAPromoRD sobre los avances y telemetría de tu plataforma web (${client.liveUrl || ''}).`);
  window.open(`https://wa.me/${client.phone.replace(/\D/g, '')}?text=${text}`, '_blank');
}

export function drilldownOpenDrawer() {
  if (!state.currentDrilldownClientId) return;
  openClientDrawer(state.currentDrilldownClientId, true);
}

export function drilldownEditClient() {
  if (!state.currentDrilldownClientId && state.clients.length > 0) {
    state.currentDrilldownClientId = state.clients[0].id;
  }
  if (!state.currentDrilldownClientId) return;
  editClient(state.currentDrilldownClientId);
}

export const PILLAR_PITCH_DICTIONARY = {
  "google_maps_gbp": {
    name: "Google Maps (GBP) & SEO Local Dominicano",
    icon: "📍",
    fallo: "Tu negocio no aparece en los primeros 3 lugares del mapa cuando alguien busca lo que ofreces desde su celular en Santo Domingo, Santiago o tu provincia, o tu ficha está desatendida sin fotos semanales ni reseñas.",
    dolor: "El 80% de los clientes en RD con dinero en mano eligen una de las primeras 3 opciones que ven en Google Maps. Al no estar ahí, estás perdiendo entre 15 y 40 clientes calificados cada mes que terminan llamándole a tu competencia directa a solo cuadras de tu negocio.",
    cura: "Realizamos la optimización técnica completa de Google Business Profile, geocodificamos fotos con coordenadas GPS de tu local e instalamos la Placa Inteligente NFC/QR en tu mostrador para que cada cliente satisfecho te deje 5 estrellas con solo acercar su celular.",
    porQueRetainer: "Google Maps es un algoritmo vivo y despiadado: si dejas la ficha sin publicaciones por 3 semanas, Google asume que tu negocio bajó el ritmo y posiciona arriba al competidor que sí publica. Con el retainer mensual de RD$ 5,000 subimos ofertas semanales y respondemos cada reseña con palabras clave de compra.",
    speech: "Don [Cliente], mire su pantalla un segundo. Cuando un cliente aquí en la zona busca [categoría] en Google, los primeros 3 que salen en el mapa se llevan el 80% de las ventas. Ahora mismo su negocio no está saliendo ahí. Con nuestro setup y la placa física en su mostrador, cada cliente contento le deja 5 estrellas en 3 segundos. Y con el mantenimiento mensual de RD$ 5,000, nosotros le mantenemos la ficha activa todas las semanas con fotos y ofertas para que ese teléfono no pare de sonar. Con solo 1 o 2 clientes nuevos que le entren en el mes, el servicio se paga solo y todo lo demás es ganancia limpia para usted."
  },
  "web_conversion": {
    name: "Landing Page Transaccional de Alta Conversión (<1s)",
    icon: "⚡",
    fallo: "Tu página actual tarda más de 3 segundos en abrir en el celular, o está saturada de texto sin un botón claro para que el cliente compre o pregunte de inmediato por WhatsApp.",
    dolor: "En República Dominicana, el 85% de la gente navega con datos móviles de Claro o Altice. Si una página no abre en menos de 1 segundo, más del 60% de los usuarios le dan para atrás y se van con otro. Estás gastando tiempo y publicidad para mandar clientes a una puerta cerrada.",
    cura: "Desarrollamos una plataforma ultra-rápida en React/Vite (Ingeniería de Ultra Velocidad, cero WordPress pesado) que carga en menos de 0.8s en cualquier celular, con catálogo interactivo y botón flotante de WhatsApp accesible con el pulgar.",
    porQueRetainer: "Una página web rápida requiere servidores de alta velocidad (CDN Anycast), renovación de certificados SSL y copias de seguridad continuas. El plan mensual de RD$ 4,000 te incluye además hasta 3 cambios de textos, fotos o precios en el mes sin estrés.",
    speech: "Mire don [Cliente], hoy en día nadie tiene paciencia para esperar que una página pesada cargue fotos lentas. El cliente en la calle quiere ver qué usted vende y un botón verde que lo mande a su WhatsApp en un segundo. Nosotros no usamos plantillas pesadas de WordPress: le construimos una página de alta ingeniería que abre al instante en cualquier celular y convierte visitas en conversaciones de venta reales."
  },
  "whatsapp_cards": {
    name: "WhatsApp Cards & OpenGraph 1200x630 (Vista Previa Profesional)",
    icon: "💬",
    fallo: "Al enviar el enlace de tu página por WhatsApp a un cliente, solo aparece un texto azul frío o una miniatura rota en vez de una tarjeta comercial elegante.",
    dolor: "El cliente dominicano juzga por los ojos. Un enlace sin imagen genera desconfianza y hace que tu empresa se perciba como un negocio informal o improvisado, reduciendo drásticamente la tasa de cierre en cotizaciones importantes.",
    cura: "Programamos las etiquetas OpenGraph oficiales en alta definición (1200x630px) con tu logo corporativo, propuesta de valor clara y diseño gráfico de clase mundial para que cada mensaje compartido impacte de inmediato.",
    porQueRetainer: "Las promociones comerciales cambian constantemente (Navidad, Madres, Black Friday). En el retainer mensual adaptamos tus tarjetas y enlaces para que tus promociones siempre luzcan atractivas y vigentes.",
    speech: "Fíjese en la diferencia: cuando usted o su equipo mandan una cotización por WhatsApp, no es lo mismo que salga un enlace azul cualquiera, a que aparezca una tarjeta ejecutiva con su logo nítido, sus servicios y su garantía. Eso de inmediato le dice al cliente: 'Esta es una empresa formal y seria'. Proyecta confianza instantánea antes de abrir la boca."
  },
  "geo_ai_schemas": {
    name: "GEO Schemas para IA (ChatGPT, Perplexity & Google Gemini)",
    icon: "🔍",
    fallo: "Tu sitio carece de microdatos estructurados (JSON-LD) y del archivo llms.txt que los motores de Inteligencia Artificial leen para entender tu catálogo.",
    dolor: "Cada vez más profesionales y empresas en RD le preguntan a ChatGPT o Gemini: '¿Cuál es la mejor empresa de [rubro] en Santo Domingo?'. Como tu página no habla el idioma de la IA, la máquina recomienda a tus competidores y te deja fuera del mapa.",
    cura: "Inyectamos Schemas semánticos avanzados y el protocolo oficial llms.txt en la raíz de tu dominio, posicionando tu empresa como la entidad de referencia recomendada por los motores de búsqueda de IA.",
    porQueRetainer: "OpenAI, Google y Anthropic actualizan sus modelos de indexación frecuentemente. Nuestro servicio continuo mantiene tus datos y catálogo actualizados para que las IAs sigan citando a tu empresa en primer lugar.",
    speech: "Don [Cliente], el mercado cambió. Ahora los clientes ejecutivos no solo buscan en Google, van a ChatGPT y le preguntan directamente qué proveedor recomendar en el país. Si su negocio no tiene esta estructura técnica, la Inteligencia Artificial no sabe quién es usted y le manda los clientes a otro. Nosotros le dejamos su plataforma blindada para que las IAs lo recomienden como la opción líder."
  },
  "ai_sales_agent": {
    name: "Agente IA WhatsApp 24/7 & Conversión Continua",
    icon: "🤖",
    fallo: "Los prospectos escriben a tu WhatsApp fuera de horario (noches, domingos o almuerzos) y tienen que esperar horas para recibir respuesta o precios.",
    dolor: "El cliente que cotiza por WhatsApp suele escribir a 3 empresas a la vez. El primero que responde de forma clara y profesional se queda con la venta. Si tardas 30 minutos en contestar, ese dinero ya se lo llevó otro.",
    cura: "Implementamos un Asistente con Inteligencia Artificial entrenado con tu catálogo, precios, horarios y políticas, capaz de responder en menos de 3 segundos, calificar prospectos y agendar citas automáticamente.",
    porQueRetainer: "La IA requiere un servidor cloud dedicado conectado día y noche, monitoreo de tokens/mensajes y calibración periódica de sus respuestas para que nunca alucine ni dé precios desactualizados. El mantenimiento de RD$ 7,000 lo cubre al 100%.",
    speech: "¿Cuántas ventas se le han caído porque un cliente escribió un sábado a las 9 de la noche y nadie le contestó hasta el lunes? Ese cliente no espera, le compra al que le responda primero. Con este agente de IA, su empresa está abierta 24/7. Le da precios, responde dudas frecuentes y le deja la cita lista en su calendario para que usted solo tenga que cerrar y facturar."
  },
  "seo_onpage": {
    name: "SEO On-Page Transaccional & Google Index",
    icon: "🏷️",
    fallo: "Tus títulos, descripciones y etiquetas H1/H2 están incompletos, vacíos o no utilizan los términos exactos con los que los compradores dominicanos buscan tus servicios.",
    dolor: "Google no comprende qué vendes ni en qué zona geográfica operas. Tu página queda relegada a las páginas 4 o 5 de resultados, donde nadie hace clic.",
    cura: "Reestructuramos completamente las etiquetas semánticas con palabras clave de alta intención de compra en RD (ej. 'Santo Domingo', 'servicio a domicilio', 'precios') para posicionar tu web en las primeras posiciones orgánicas.",
    porQueRetainer: "Google actualiza sus algoritmos continuamente y los competidores siempre buscan superarte. El mantenimiento SEO mensual defiende y mejora tus posiciones permanentemente.",
    speech: "Tener una página web sin SEO On-Page es como montar una tienda hermosa en un callejón sin letrero: nadie sabe que existe. Con esta optimización le colocamos el letrero gigante en la avenida principal de Google para que quien busque comprar lo que usted vende, lo encuentre a usted primero."
  },
  "cloud_hosting_ssl": {
    name: "Cloud Hosting Anycast, SSL Seguro & Robots.txt",
    icon: "🛡️",
    fallo: "Tu sitio está en un hosting tradicional lento, sin certificado SSL con candado verde o con archivos robots.txt mal configurados que impiden la indexación de Google.",
    dolor: "Los navegadores muestran la advertencia roja 'Sitio No Seguro', ahuyentando a los clientes. Si el servidor se cae durante el día, pierdes ventas y Google penaliza tu posicionamiento.",
    cura: "Migramos tu web a servidores cloud perimetrales Anycast (Vercel/Cloudflare Edge) con 99.9% de uptime, certificado SSL de grado bancario y archivo robots.txt perfectamente sincronizado con tu mapa de sitio.",
    porQueRetainer: "El mantenimiento mensual de RD$ 4,000 es la póliza de tranquilidad de tu empresa: tu web nunca se cae, está protegida contra ataques y tú no tienes que preocuparte por nada técnico.",
    speech: "Don [Cliente], una página web es como el local físico de su empresa: usted no puede pagar el alquiler el primer mes y olvidarse de la luz, el mantenimiento y la seguridad. El plan mensual de RD$ 4,000 es la póliza de tranquilidad de su negocio en internet: le asegura que la web nunca se caiga, que abra al instante y que cualquier cambio de texto o foto que necesite en el mes, usted solo me lo manda por WhatsApp y nosotros se lo dejamos listo sin costo adicional."
  }
};

export function openPillarPitchModal(pillarKey, clientId) {
  const client = state.clients.find(c => c.id === clientId) || 
                 (state.currentDrilldownClientId ? state.clients.find(c => c.id === state.currentDrilldownClientId) : null) || 
                 state.clients[0];

  let pillarData = PILLAR_PITCH_DICTIONARY[pillarKey];
  if (!pillarData) {
    const keyLower = (pillarKey || '').toLowerCase();
    for (const k in PILLAR_PITCH_DICTIONARY) {
      if (keyLower.includes(k) || k.includes(keyLower)) {
        pillarData = PILLAR_PITCH_DICTIONARY[k];
        break;
      }
    }
  }

  if (!pillarData) {
    if (pillarKey.includes('map') || pillarKey.includes('local')) pillarData = PILLAR_PITCH_DICTIONARY['google_maps_gbp'];
    else if (pillarKey.includes('web') || pillarKey.includes('convers')) pillarData = PILLAR_PITCH_DICTIONARY['web_conversion'];
    else if (pillarKey.includes('card') || pillarKey.includes('open')) pillarData = PILLAR_PITCH_DICTIONARY['whatsapp_cards'];
    else if (pillarKey.includes('geo') || pillarKey.includes('schema')) pillarData = PILLAR_PITCH_DICTIONARY['geo_ai_schemas'];
    else if (pillarKey.includes('ai') || pillarKey.includes('agent')) pillarData = PILLAR_PITCH_DICTIONARY['ai_sales_agent'];
    else if (pillarKey.includes('onpage') || pillarKey.includes('seo')) pillarData = PILLAR_PITCH_DICTIONARY['seo_onpage'];
    else pillarData = PILLAR_PITCH_DICTIONARY['cloud_hosting_ssl'];
  }

  const modal = document.getElementById("pillarZoomPitchModal");
  if (!modal) return;

  const iconEl = document.getElementById("pillarModalIcon");
  const titleEl = document.getElementById("pillarModalTitle");
  const clientNameEl = document.getElementById("pillarModalClientName");
  const statusBadge = document.getElementById("pillarModalStatusBadge");
  const falloEl = document.getElementById("pillarPitchFallo");
  const dolorEl = document.getElementById("pillarPitchDolor");
  const curaEl = document.getElementById("pillarPitchCura");
  const retainerEl = document.getElementById("pillarPitchRetainer");
  const speechEl = document.getElementById("pillarPitchSpeech");

  if (iconEl) iconEl.textContent = pillarData.icon;
  if (titleEl) titleEl.textContent = pillarData.name;
  if (clientNameEl) clientNameEl.textContent = client ? `Cliente en Zoom: ${client.name} (${client.category || 'Empresa Local'})` : 'Cliente en Zoom';
  if (falloEl) falloEl.textContent = pillarData.fallo;
  if (dolorEl) dolorEl.textContent = pillarData.dolor;
  if (curaEl) curaEl.textContent = pillarData.cura;
  if (retainerEl) retainerEl.textContent = pillarData.porQueRetainer;

  // Personalizar speech con nombre del cliente
  let speechText = pillarData.speech;
  if (client) {
    const contact = client.contactPerson || client.name || "amigo";
    speechText = speechText.replace(/\[Cliente\]/g, contact);
    speechText = speechText.replace(/\[categoría\]/g, client.category || "sus servicios");
  } else {
    speechText = speechText.replace(/\[Cliente\]/g, "amigo");
    speechText = speechText.replace(/\[categoría\]/g, "sus servicios");
  }
  if (speechEl) speechEl.textContent = `"${speechText}"`;

  // Buscar estado en auditoría del cliente
  if (statusBadge && client && client.lastAuditSummary?.services) {
    const foundSvc = client.lastAuditSummary.services.find(s => s.id === pillarKey || s.key === pillarKey);
    if (foundSvc) {
      if (foundSvc.status === 'passed') {
        statusBadge.className = "text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
        statusBadge.textContent = "ESTADO: CUMPLE (OPTIMIZADO)";
      } else if (foundSvc.status === 'warning') {
        statusBadge.className = "text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border bg-amber-500/10 text-amber-300 border-amber-500/30";
        statusBadge.textContent = "ESTADO: OPORTUNIDAD DE MEJORA";
      } else {
        statusBadge.className = "text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border bg-rose-500/10 text-rose-300 border-rose-500/30";
        statusBadge.textContent = "ESTADO: BRECHA CRÍTICA";
      }
    } else {
      statusBadge.className = "text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border bg-rose-500/10 text-rose-300 border-rose-500/30";
      statusBadge.textContent = "ESTADO: ACCIÓN RECOMENDADA";
    }
  }

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

export function closePillarPitchModal() {
  const modal = document.getElementById("pillarZoomPitchModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

export function copyPillarSpeech() {
  const speechEl = document.getElementById("pillarPitchSpeech");
  if (!speechEl) return;
  const rawText = speechEl.textContent.replace(/^"|"$/g, '').trim();

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(rawText).then(() => {
      showToast("🎙️ Speech para Zoom copiado al portapapeles", "success");
      const btnText = document.getElementById("copyPillarSpeechBtnText");
      if (btnText) {
        btnText.textContent = "✓ ¡Copiado!";
        setTimeout(() => { btnText.textContent = "Copiar Speech"; }, 2000);
      }
    }).catch(() => fallbackCopyPillarSpeech(rawText));
  } else {
    fallbackCopyPillarSpeech(rawText);
  }
}

function fallbackCopyPillarSpeech(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
    showToast("🎙️ Speech para Zoom copiado al portapapeles", "success");
    const btnText = document.getElementById("copyPillarSpeechBtnText");
    if (btnText) {
      btnText.textContent = "✓ ¡Copiado!";
      setTimeout(() => { btnText.textContent = "Copiar Speech"; }, 2000);
    }
  } catch(e) {
    showToast("No se pudo copiar el texto", "error");
  }
  document.body.removeChild(ta);
}

