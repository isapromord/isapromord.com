/**
 * ISAPromoRD - Stitch Command Center (Live Drilldown Engine)
 * 3-Column architecture, real-time iframe/satellite checker (robots.txt, sitemap.xml, llms.txt),
 * latency monitor, live health scores, and popstate browser navigation support.
 */
import { state } from './state.js';
import { showToast, escapeHtml } from './ui.js';
import { checkUrlUptime } from './uptime.js';
import { saveClientsToStorage } from './sync.js';
import { openClientDrawer } from './directory.js';
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
        const newHash = `#client-${state.currentDrilldownClientId || ''}`;
        if (window.location.hash !== newHash) {
          history.pushState({ tab: 'clients', mode: 'drilldown', clientId: state.currentDrilldownClientId }, '', newHash);
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
          history.pushState({ tab: 'clients', mode: 'overview' }, '', newHash);
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
  const client = state.clients.find(c => c.id === state.currentDrilldownClientId);
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
  const client = state.clients.find(c => c.id === state.currentDrilldownClientId);
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

  const statusBadge = document.getElementById("ddUptimeStatusBadge");
  const statusText = document.getElementById("ddUptimeStatusText");
  const isOnline = client.uptimeStatus === "online" || !client.uptimeStatus;
  const isChecking = client.uptimeStatus === "checking";

  if (statusBadge && statusText) {
    if (isChecking) {
      statusBadge.className = "stitch-pill bg-slate-800 text-slate-300 border border-slate-700";
      statusText.textContent = "VERIFICANDO...";
    } else if (isOnline) {
      statusBadge.className = "stitch-pill bg-emerald-500/10 text-emerald-400 border border-emerald-500/30";
      statusText.textContent = `EN LÍNEA • ${detectedServer}`;
    } else {
      statusBadge.className = "stitch-pill bg-rose-500/10 text-rose-400 border border-rose-500/30";
      statusText.textContent = "INACCESIBLE";
    }
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
  if (mrrFee) {
    mrrFee.textContent = state.presentationMode ? "RD$ •••••" : (client.fee || "RD$ 4,500 / mes");
  }

  const planName = document.getElementById("ddPlanName");
  if (planName) {
    planName.textContent = client.fee && client.fee.includes("8,000") ? "Plan Pro Enterprise" : (client.fee && client.fee.includes("4,500") ? "Plan Retainer Pro" : "Plan Retainer");
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
          <div class="p-3 rounded bg-[#0a0e17] border border-white/[0.06] hover:border-cyan-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex items-start gap-2.5 overflow-hidden min-w-0">
              <div class="w-6 h-6 rounded bg-slate-800 border border-white/10 text-slate-200 flex items-center justify-center shrink-0 text-xs font-bold font-mono">
                ${icon}
              </div>
              <div class="overflow-hidden min-w-0">
                <h4 class="font-bold text-slate-100 text-xs sm:text-sm truncate">${escapeHtml(s.title)}</h4>
                <p class="text-[11px] text-slate-400 line-clamp-1 mt-0.5">${escapeHtml(s.findings || s.needed || '')}</p>
              </div>
            </div>
            <div class="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${badgeClass}">${badgeLabel}</span>
              <button onclick="drilldownRunAudit()" class="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-cyan-300 font-bold border border-white/10 transition-colors">
                Re-Auditar
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
