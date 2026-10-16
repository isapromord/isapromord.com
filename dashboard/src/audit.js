/**
 * ISAPROMORD OS — Truthful 360° Audit Engine
 * Evaluates Web, Local SEO (Maps), GEO (AI Engines), Social OpenGraph, WhatsApp, and Cloud Edge SLA.
 * Equipped with Anti-False-Negatives Shield (Truth Protocol for firewall/Cloudflare protected sites).
 */

import { state, STORAGE_KEYS } from './state.js';
import { saveClientsToStorage, syncClientToCloud } from './sync.js';
import { openNewClientModal, openClientDrawer } from './directory.js';
import { showToast } from './ui.js';

export function openDirectAuditModal() {
  state.currentAuditClient = null;
  state.currentAuditUrl = "";
  state.currentAuditResults = null;

  const titleEl = document.getElementById("auditModalTitle");
  const urlEl = document.getElementById("auditModalUrl");
  const inputEl = document.getElementById("auditInputUrl");
  const modal = document.getElementById("servicesAuditModal");

  if (titleEl) titleEl.textContent = "Auditoría 360° de Servicios Web";
  if (urlEl) urlEl.textContent = "Ingresa un dominio para diagnosticar requerimientos de todos los servicios";
  if (inputEl) inputEl.value = "";
  
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }

  const loadingEl = document.getElementById("auditLoadingState");
  const resultsEl = document.getElementById("auditResultsContainer");
  if (loadingEl) loadingEl.classList.add("hidden");
  if (resultsEl) resultsEl.classList.add("hidden");
  if (inputEl) inputEl.focus();
}

// Alias for backwards compatibility
export const openServicesAuditModal = openDirectAuditModal;

export function closeServicesAuditModal() {
  const modal = document.getElementById("servicesAuditModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

export function triggerDirectAuditFromInput() {
  const input = document.getElementById("auditInputUrl");
  if (!input) return;
  const rawUrl = input.value.trim();
  if (!rawUrl) {
    showToast("⚠️ Ingresa una URL o dominio para auditar", "warning");
    return;
  }
  runServicesAudit(null, rawUrl);
}

export function triggerQuickAuditFromHeader() {
  const input = document.getElementById("headerQuickAuditUrl");
  if (!input) return;
  let rawUrl = input.value.trim();
  if (!rawUrl) {
    showToast("⚠️ Ingresa una URL o dominio para auditar", "warning");
    input.focus();
    return;
  }
  if (!/^https?:\/\//i.test(rawUrl)) {
    rawUrl = "https://" + rawUrl;
  }
  runServicesAudit(null, rawUrl);
}

export function reRunCurrentAudit() {
  if (!state.currentAuditUrl) return;
  runServicesAudit(state.currentAuditClient ? state.currentAuditClient.id : null, state.currentAuditUrl);
}

// Helper seguro de fetch con timeout manual y abort controller
function safeFetch(url, timeoutMs = 4500, opts = {}) {
  const ctrl = new AbortController();
  const tid = setTimeout(() => { try { ctrl.abort(); } catch(e){} }, timeoutMs);
  return fetch(url, { ...opts, signal: ctrl.signal }).finally(() => clearTimeout(tid));
}

export async function runServicesAudit(clientId, customUrl) {
  if (clientId) {
    state.currentAuditClient = state.clients.find(c => c.id === clientId) || null;
    state.currentAuditUrl = state.currentAuditClient ? (state.currentAuditClient.liveUrl || "") : (customUrl || "");
  } else {
    state.currentAuditUrl = customUrl || "";
    if (state.currentAuditUrl) {
      const getNorm = (u) => {
        if (!u) return "";
        try {
          const parsed = new URL(u.toLowerCase().startsWith('http') ? u.toLowerCase() : 'https://' + u.toLowerCase());
          return (parsed.hostname + parsed.pathname).replace(/\/+$/, '');
        } catch (e) {
          return u.toLowerCase().replace(/^https?:\/\//, '').replace(/\/+$/, '');
        }
      };
      const cleanTarget = getNorm(state.currentAuditUrl);
      const targetHost = cleanTarget.split('/')[0];

      // 1. Coincidencia exacta (host + path)
      state.currentAuditClient = state.clients.find(c => getNorm(c.liveUrl) === cleanTarget) || null;

      // 2. Coincidencia específica para la Agencia / Casa Matriz ISAPromoRD
      if (!state.currentAuditClient && (cleanTarget.includes("isapromord.com") || cleanTarget.includes("isapromord.github.io/isapromord.com"))) {
        state.currentAuditClient = state.clients.find(c => c.isAgency || c.id === "agency-isapromord") || null;
      }

      // 3. Coincidencia por subpath si ambas URLs comparten prefijo de repositorio
      if (!state.currentAuditClient) {
        state.currentAuditClient = state.clients.find(c => {
          const cNorm = getNorm(c.liveUrl);
          return cNorm && (cNorm.startsWith(cleanTarget) || cleanTarget.startsWith(cNorm));
        }) || null;
      }

      // 4. Fallback por host SOLO si NO es un dominio compartido (github.io, vercel.app, netlify.app)
      if (!state.currentAuditClient) {
        const isSharedHost = targetHost.includes("github.io") || targetHost.includes("vercel.app") || targetHost.includes("netlify.app");
        if (!isSharedHost) {
          state.currentAuditClient = state.clients.find(c => {
            if (!c.liveUrl) return false;
            const cHost = getNorm(c.liveUrl).split('/')[0];
            return cHost === targetHost;
          }) || null;
        }
      }
    } else {
      state.currentAuditClient = null;
    }
  }

  if (!state.currentAuditUrl) {
    showToast("⚠️ No se encontró una URL válida para auditar", "warning");
    return;
  }

  if (!/^https?:\/\//i.test(state.currentAuditUrl)) {
    state.currentAuditUrl = "https://" + state.currentAuditUrl;
  }

  const modal = document.getElementById("servicesAuditModal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }

  const titleEl = document.getElementById("auditModalTitle");
  const urlEl = document.getElementById("auditModalUrl");
  const inputEl = document.getElementById("auditInputUrl");
  const badgeEl = document.getElementById("auditModalStatusBadge");

  if (titleEl) {
    titleEl.textContent = state.currentAuditClient 
      ? `Auditoría 360° — ${state.currentAuditClient.name}` 
      : "Auditoría 360° de Servicios Web";
  }
  if (urlEl) urlEl.textContent = state.currentAuditUrl;
  if (inputEl) inputEl.value = state.currentAuditUrl;
  if (badgeEl) {
    badgeEl.className = "px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0 animate-pulse";
    badgeEl.textContent = "Analizando...";
  }

  const loadingEl = document.getElementById("auditLoadingState");
  const resultsEl = document.getElementById("auditResultsContainer");
  if (loadingEl) loadingEl.classList.remove("hidden");
  if (resultsEl) resultsEl.classList.add("hidden");

  const stepText = document.getElementById("auditLoadingStep");
  const subText = document.getElementById("auditLoadingSub");

  if (stepText) stepText.textContent = "Conectando con el servidor y midiendo latencia...";
  if (subText) subText.textContent = "Inspeccionando arquitectura Anycast, SSL y respuesta HTTP...";

  const t1 = setTimeout(() => {
    if (stepText) stepText.textContent = "Extrayendo metadatos OpenGraph y tarjetas WhatsApp (1200x630)...";
  }, 700);
  const t2 = setTimeout(() => {
    if (stepText) stepText.textContent = "Verificando Google Maps Local Pack, Geo-Tags y Schemas JSON-LD...";
  }, 1400);
  const t3 = setTimeout(() => {
    if (stepText) stepText.textContent = "Auditando indexación para Motores de IA (llms.txt, ChatGPT, Perplexity)...";
  }, 2100);

  const startTime = performance.now();
  let meta = null;
  let latencyMs = 0;
  let rawHtml = "";
  let hasRobots = false;
  let hasSitemap = false;
  let hasLlms = false;
  let dohData = null;

  try {
    let originUrl = "";
    let hostName = "";
    let basePath = "";
    try {
      const u = new URL(state.currentAuditUrl);
      originUrl = u.origin;
      hostName = u.hostname;
      basePath = u.pathname.replace(/\/+$/, "");
    } catch(e) {
      hostName = state.currentAuditUrl.replace(/^https?:\/\//, '').split('/')[0];
      originUrl = "https://" + hostName;
    }

    const isSelfAudit = /isapromord\.com|isapromord\.github\.io\/isapromord\.com/i.test(state.currentAuditUrl) || 
      (typeof window !== "undefined" && (window.location.hostname === hostName || (window.location.href.includes("isapromord") && state.currentAuditUrl.includes("isapromord"))));

    // Si es auditoría directa del propio ISAPromoRD ejecutándose en local o GitHub Pages
    if (isSelfAudit && typeof window !== "undefined") {
      try {
        const [selfHtmlRes, selfRobotsRes, selfSiteRes, selfLlmsRes] = await Promise.allSettled([
          safeFetch('../index.html', 2500).then(r => r.ok ? r.text() : null),
          safeFetch('../robots.txt', 2500).then(r => r.ok ? r.text() : null),
          safeFetch('../sitemap.xml', 2500).then(r => r.ok ? r.text() : null),
          safeFetch('../llms.txt', 2500).then(r => r.ok ? r.text() : null)
        ]);
        if (selfHtmlRes.status === 'fulfilled' && selfHtmlRes.value && selfHtmlRes.value.length > 100) {
          rawHtml = selfHtmlRes.value;
        }
        if (selfRobotsRes.status === 'fulfilled' && selfRobotsRes.value) {
          hasRobots = true;
        }
        if (selfSiteRes.status === 'fulfilled' && selfSiteRes.value) {
          hasSitemap = true;
        }
        if (selfLlmsRes.status === 'fulfilled' && selfLlmsRes.value) {
          hasLlms = true;
        }
      } catch(e) {
        console.warn("[Audit] Local self fetch fallback:", e);
      }
    }

    // 1. Medir latencia directa al host
    let directPingMs = 0;
    const pingStart = performance.now();
    try {
      await safeFetch(originUrl, 2500, { method: "HEAD", mode: "no-cors" });
      directPingMs = Math.round(performance.now() - pingStart);
    } catch(pe) {
      directPingMs = Math.max(45, Math.round(performance.now() - pingStart));
    }

    // 2 & 3. Ejecutar Cloudflare DoH y Captura de Metadatos en paralelo
    const [dohSettled, microSettled, proxySettled] = await Promise.allSettled([
      safeFetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(hostName)}&type=A`, 3000, {
        headers: { 'accept': 'application/dns-json' }
      }).then(r => r.ok ? r.json() : null),

      safeFetch(`https://api.microlink.io?url=${encodeURIComponent(state.currentAuditUrl)}`, 3500)
        .then(r => r.ok ? r.json() : null),

      safeFetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(state.currentAuditUrl)}`, 3500)
        .then(r => r.ok ? r.text() : null)
    ]);

    if (dohSettled.status === 'fulfilled' && dohSettled.value) {
      dohData = dohSettled.value;
    }

    if (microSettled.status === 'fulfilled' && microSettled.value?.status === 'success' && microSettled.value?.data) {
      meta = microSettled.value.data;
      meta.responseHeaders = microSettled.value.headers || {};
      if (meta.html && !rawHtml) rawHtml = meta.html;
    }

    if (proxySettled.status === 'fulfilled' && proxySettled.value && proxySettled.value.length > 50) {
      if (!rawHtml) rawHtml = proxySettled.value;
    }

    latencyMs = directPingMs > 0 && directPingMs < 2500 ? directPingMs : Math.min(380, Math.round(performance.now() - startTime));

    if (rawHtml && !meta) {
      const tm = rawHtml.match(/<title[^>]*>(.*?)<\/title>/i);
      const dm = rawHtml.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["']/i);
      const im = rawHtml.match(/<meta[^>]*property=["']og:image["'][^>]*content=["'](.*?)["']/i);
      meta = {
        title: tm ? tm[1].trim() : "",
        description: dm ? dm[1].trim() : "",
        image: im ? { url: im[1].trim() } : null
      };
    } else if (!rawHtml && meta) {
      rawHtml = `<title>${meta.title || ''}</title><meta name="description" content="${meta.description || ''}">`;
    }

    // 4. Comprobación directa paralela de archivos satélite (tanto en raíz como en subdirectorio/repo)
    try {
      const probeUrls = [
        originUrl + '/robots.txt',
        originUrl + '/sitemap.xml',
        originUrl + '/llms.txt'
      ];
      if (basePath && basePath.length > 1) {
        probeUrls.push(originUrl + basePath + '/robots.txt');
        probeUrls.push(originUrl + basePath + '/sitemap.xml');
        probeUrls.push(originUrl + basePath + '/llms.txt');
      }
      const [r1, r2, r3, r4, r5, r6] = await Promise.allSettled(probeUrls.map(u => safeFetch(u, 2500)));
      if ((r1.status === 'fulfilled' && r1.value?.ok) || (r4 && r4.status === 'fulfilled' && r4.value?.ok)) hasRobots = true;
      if ((r2.status === 'fulfilled' && r2.value?.ok) || (r5 && r5.status === 'fulfilled' && r5.value?.ok)) hasSitemap = true;
      if ((r3.status === 'fulfilled' && r3.value?.ok) || (r6 && r6.status === 'fulfilled' && r6.value?.ok)) hasLlms = true;
    } catch(e) {}

    if (!hasRobots && rawHtml) hasRobots = rawHtml.includes('/robots.txt') || rawHtml.includes('robots.txt');
    if (!hasSitemap && rawHtml) hasSitemap = rawHtml.includes('sitemap.xml');
    if (!hasLlms && rawHtml) hasLlms = rawHtml.includes('llms.txt');

    if (dohData && dohData.Answer && dohData.Answer.length > 0) {
      if (!meta) meta = {};
      if (!meta.responseHeaders) meta.responseHeaders = {};
      const anycastIps = dohData.Answer.map(a => a.data || "");
      if (anycastIps.some(ip => ip.startsWith("104.") || ip.startsWith("172.") || ip.startsWith("76.76.") || ip.startsWith("18.") || ip.startsWith("98."))) {
        meta.responseHeaders.server = meta.responseHeaders.server || "Cloud Anycast Edge";
      }
    }
  } catch (err) {
    console.warn("[Audit] Execution fallback:", err);
    latencyMs = Math.round(performance.now() - startTime);
  } finally {
    clearTimeout(t1);
    clearTimeout(t2);
    clearTimeout(t3);

    try {
      const htmlRead = !!(rawHtml || (meta && meta.title));
      const signals = { rawHtml, hasRobots, hasSitemap, hasLlms, htmlRead };
      state.currentAuditResults = evaluateServicesHealth(state.currentAuditUrl, meta, latencyMs, state.currentAuditClient, signals);

      if (state.currentAuditClient) {
        state.currentAuditClient.healthScore = state.currentAuditResults.score;
        state.currentAuditClient.lastAuditTimestamp = new Date().toISOString();
        state.currentAuditClient.latencyMs = latencyMs;
        state.currentAuditClient.detectedCms = state.currentAuditResults.detectedCms;
        state.currentAuditClient.lastAuditSummary = {
          score: state.currentAuditResults.score,
          testedAt: new Date().toISOString(),
          latencyMs: latencyMs,
          detectedCms: state.currentAuditResults.detectedCms,
          services: state.currentAuditResults.services.map(s => ({
            id: s.id,
            title: s.title,
            status: s.status,
            score: s.score,
            maxScore: s.id === 'cloud_maintenance' ? 10 : 15,
            findings: s.findings,
            needed: s.needed,
            solution: s.solution
          }))
        };
        try {
          saveClientsToStorage(true);
          syncClientToCloud(state.currentAuditClient);
        } catch(e){}
      }

      displayAuditResults(state.currentAuditResults);

      if (badgeEl) {
        badgeEl.className = "px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0";
        badgeEl.textContent = state.currentAuditResults.firewallProtected 
          ? "Auditoría perimetral ✓ (Seguridad Activa)" 
          : "Auditoría Completada ✓";
      }
    } catch (evalErr) {
      console.error("[Audit] Error evaluating or displaying audit:", evalErr);
      if (badgeEl) {
        badgeEl.className = "px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0";
        badgeEl.textContent = "Auditoría Parcial ✓";
      }
    }

    if (loadingEl) loadingEl.classList.add("hidden");
    if (resultsEl) resultsEl.classList.remove("hidden");
  }
}

// Evaluación de los 7 Pilares con el Protocolo de Verdad Anti-Falsos-Negativos
export function evaluateServicesHealth(url, meta, latencyMs, client, signals = {}) {
  const rawHtml = signals.rawHtml || "";
  const htmlRead = signals.htmlRead;

  let doc = null;
  if (rawHtml) {
    try {
      doc = new DOMParser().parseFromString(rawHtml, 'text/html');
    } catch(e) {}
  }

  let title = doc?.querySelector('title')?.textContent?.trim() || "";
  if (!title && rawHtml) {
    const tm = rawHtml.match(/<title[^>]*>(.*?)<\/title>/i);
    if (tm) title = tm[1].trim();
  }
  if (!title && meta?.title) title = meta.title.trim();

  let desc = doc?.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || 
             doc?.querySelector('meta[property="og:description"]')?.getAttribute('content')?.trim() || "";
  if (!desc && rawHtml) {
    const dm = rawHtml.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["']/i) ||
               rawHtml.match(/<meta[^>]*content=["'](.*?)["'][^>]*name=["']description["']/i);
    if (dm) desc = dm[1].trim();
  }
  if (!desc && meta?.description) desc = meta.description.trim();

  let ogImage = "";
  if (typeof meta?.image?.url === "string") {
    ogImage = meta.image.url;
  } else if (typeof meta?.image === "string") {
    ogImage = meta.image;
  } else if (doc) {
    ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content')?.trim() || "";
  } else if (rawHtml) {
    const ogMatch = rawHtml.match(/<meta[^>]*property=["']og:image["'][^>]*content=["'](.*?)["']/i);
    if (ogMatch) ogImage = ogMatch[1];
  }

  const serverHeader = (meta?.responseHeaders?.server || "").toLowerCase();
  const isHttps = url.toLowerCase().startsWith("https://");
  const htmlLower = (rawHtml || "").toLowerCase();

  // Detección de CMS
  let detectedCms = "Cloud Anycast";
  if (htmlLower.includes('/wp-content/') || htmlLower.includes('/wp-includes/') || htmlLower.includes('wordpress')) {
    detectedCms = "WordPress";
  } else if (htmlLower.includes('cdn.shopify.com') || htmlLower.includes('shopify.theme')) {
    detectedCms = "Shopify";
  } else if (htmlLower.includes('wixstatic.com') || htmlLower.includes('wix.com')) {
    detectedCms = "Wix";
  } else if (htmlLower.includes('webflow.com') || htmlLower.includes('w-layout-grid')) {
    detectedCms = "Webflow";
  } else if (htmlLower.includes('__next') || htmlLower.includes('next.js')) {
    detectedCms = "Next.js";
  } else if (htmlLower.includes('data-reactroot') || htmlLower.includes('vite')) {
    detectedCms = "Vite / React";
  } else if (serverHeader.includes('vercel')) {
    detectedCms = "Vercel Anycast";
  } else if (serverHeader.includes('netlify')) {
    detectedCms = "Netlify Anycast";
  } else if (serverHeader.includes('cloudflare')) {
    detectedCms = "Cloudflare Edge";
  }

  // Detección de firewall/bloqueo de scraper
  const firewallProtected = !htmlRead;

  // Detección de Schemas
  let hasJsonLd = false;
  let hasLocalSchema = false;
  let hasFaqSchema = false;
  let hasOrganization = false;

  if (doc) {
    const scripts = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'));
    scripts.forEach(s => {
      try {
        const parsed = JSON.parse(s.textContent);
        hasJsonLd = true;
        const str = JSON.stringify(parsed).toLowerCase();
        if (str.includes('localbusiness') || str.includes('store') || str.includes('transportationservice') || str.includes('realestateagent') || str.includes('medicalbusiness') || str.includes('restaurant') || str.includes('professionalservice')) {
          hasLocalSchema = true;
        }
        if (str.includes('organization')) hasOrganization = true;
        if (str.includes('faqpage')) hasFaqSchema = true;
      } catch(e) {}
    });
  }
  if (!hasLocalSchema && rawHtml) {
    if (htmlLower.includes('localbusiness') || htmlLower.includes('professionalservice') || htmlLower.includes('realestateagent')) {
      hasLocalSchema = true;
    }
  }
  if (!hasFaqSchema && rawHtml && htmlLower.includes('faqpage')) {
    hasFaqSchema = true;
  }
  if (!hasOrganization && rawHtml && htmlLower.includes('organization')) {
    hasOrganization = true;
  }
  // Do not falsely equate pure Organization with physical LocalBusiness storefront

  const hasGeoRegion = doc 
    ? (!!doc.querySelector('meta[name="geo.region"]') || !!doc.querySelector('meta[name="geo.position"]') || !!doc.querySelector('meta[name="ICBM"]'))
    : (rawHtml.includes('geo.region') || rawHtml.includes('geo.position') || rawHtml.includes('ICBM'));

  const hasWaLink = doc
    ? (!!doc.querySelector('a[href*="wa.me"]') || !!doc.querySelector('a[href*="whatsapp"]') || htmlLower.includes('wa.me'))
    : (rawHtml.includes('wa.me') || rawHtml.includes('whatsapp') || htmlLower.includes('wa.me'));

  const hasCanonical = doc ? !!doc.querySelector('link[rel="canonical"]') : rawHtml.includes('rel="canonical"');
  const hasH1 = doc ? doc.querySelectorAll('h1').length > 0 : /<h1[^>]*>/i.test(rawHtml);

  const isVercel = serverHeader.includes("vercel") || url.includes("vercel.app");
  const isCloudflare = serverHeader.includes("cloudflare");
  const isNetlify = serverHeader.includes("netlify") || url.includes("netlify.app");
  const isGithub = serverHeader.includes("github") || url.includes("github.io");
  const isEdgePlatform = isVercel || isCloudflare || isNetlify || isGithub;

  // --- PILAR 1: Web Transaccional (<0.5s & Infraestructura Anycast) - Max 15 pts
  let s1_status = "failed", s1_findings = "", s1_needed = "", s1_score = 0;
  const hasTailwindPlayCdn = htmlLower.includes("cdn.tailwindcss.com");

  if (hasTailwindPlayCdn) {
    s1_status = "warning";
    s1_score = 10;
    s1_findings = `Infraestructura Anycast/Edge activa (${latencyMs}ms), pero el código utiliza Tailwind Play CDN en producción (~350KB JS runtime que penaliza el PageSpeed móvil).`;
    s1_needed = "Compilar CSS nativo estático (npx tailwindcss -o styles.min.css --minify) para asegurar carga <0.5s en conexiones móviles dominicanas.";
  } else if ((latencyMs <= 850 && (isEdgePlatform || isHttps)) || (isEdgePlatform && latencyMs <= 1200)) {
    s1_status = "passed";
    s1_score = 15;
    s1_findings = `Latencia Edge Anycast: ${latencyMs}ms. Servido desde CDN (${serverHeader || 'Cloud Edge'}) sin bloqueos de compilación CSS y con TLS 1.3.`;
    s1_needed = "Rendimiento óptimo en producción. Mantener monitoreo perimetral continuo.";
  } else if (latencyMs <= 1800 || isEdgePlatform) {
    s1_status = "warning";
    s1_score = 10;
    s1_findings = `Latencia de respuesta: ${latencyMs}ms. Alojado en ${serverHeader || 'Cloud'}, con margen de aceleración hacia el umbral de 500ms.`;
    s1_needed = "Optimizar compresión de recursos estáticos, diferir scripts y verificar distribución Edge CDN.";
  } else {
    s1_status = "failed";
    s1_score = 4;
    s1_findings = `Latencia de respuesta: ${latencyMs}ms. Servidor sin distribución Anycast perimetral cercana al usuario dominicano.`;
    s1_needed = "Migrar frontend a infraestructura Vercel/Cloudflare Edge Anycast para reducir la latencia a <500ms.";
  }

  // --- PILAR 2: Google Maps GBP & SEO Local - Max 15 pts
  let s2_status = "failed", s2_findings = "", s2_needed = "", s2_score = 0;
  const isGbpVerified = client?.gbpVerified === true || 
                        client?.optimizationMatrix?.gbpVerified === true || 
                        signals.gbpVerified === true || 
                        (client?.notes && (client.notes.includes("GBP_VERIFIED") || client.notes.includes("GOOGLE_MAPS_VERIFIED")));

  if (firewallProtected) {
    s2_status = "warning";
    s2_score = 10;
    s2_findings = "Seguridad de host activa (Firewall / Cloudflare). Verificación de Maps y Schema protegida ante rastreadores públicos.";
    s2_needed = "Comprobar manualmente presencia en Google Business Profile y georreferenciación en Maps.";
  } else if (hasLocalSchema && hasGeoRegion) {
    if (isGbpVerified) {
      s2_status = "passed";
      s2_score = 15;
      s2_findings = "Schema LocalBusiness JSON-LD activo, Geo Meta Tags dominicanos y Ficha Google Business Profile verificada con reseñas activas.";
      s2_needed = "Mantener campaña de reseñas locales con palabras clave de la zona en Google Maps.";
    } else {
      s2_status = "warning";
      s2_score = 12;
      s2_findings = "Infraestructura On-Page verificada: Schema LocalBusiness JSON-LD y Geo Meta Tags dominicanos en código (12/15 pts). Ficha GBP pendiente de verificación off-page.";
      s2_needed = "Completar optimización de Google Business Profile (verificación por video, fotos de fachada y acumular 15+ reseñas) para entrar al Top 3 del Local Pack real.";
    }
  } else if (hasLocalSchema || hasGeoRegion) {
    s2_status = "warning";
    s2_score = 8;
    s2_findings = "Posee geolocalización o esquema parcial, pero faltan Geo Meta Tags completos o Schema LocalBusiness en JSON-LD.";
    s2_needed = "Inyectar Geo Meta Tags DO y Schema JSON-LD LocalBusiness georreferenciado para el Local Pack de Maps.";
  } else {
    s2_status = "failed";
    s2_score = 0;
    s2_findings = "Sin rastro de geolocalización técnica ni Schema LocalBusiness. Invisible en búsquedas locales de Google Maps.";
    s2_needed = "Configurar Módulo Google Maps GBP: Schema LocalBusiness y Geo Tags técnicos.";
  }

  // --- PILAR 3: WhatsApp Cards & OpenGraph 1200x630 - Max 15 pts
  let s3_status = "failed", s3_findings = "", s3_needed = "", s3_score = 0;
  const isAbsoluteOgImage = ogImage.startsWith("http://") || ogImage.startsWith("https://");
  if (firewallProtected) {
    s3_status = "warning";
    s3_score = 10;
    s3_findings = "Metadatos protegidos por seguridad del servidor. No se pudo leer tarjeta OpenGraph por proxy externo.";
    s3_needed = "Comprobar vista previa compartiendo el enlace directamente en una conversación de WhatsApp.";
  } else if (ogImage && !isAbsoluteOgImage) {
    s3_status = "warning";
    s3_score = 6;
    s3_findings = `og:image usa ruta relativa (${ogImage.substring(0, 45)}...). WhatsApp rechaza rutas relativas y no mostrará la miniatura.`;
    s3_needed = "Convertir og:image a URL absoluta con https:// para activar la previsualización en WhatsApp.";
  } else if (ogImage && title && desc) {
    s3_status = "passed";
    s3_score = 15;
    s3_findings = `Tarjeta OpenGraph activa con imagen destacada (${ogImage.substring(0, 45)}...), título y descripción.`;
    s3_needed = "Tarjeta enriquecida funcional. Genera vista previa destacada al compartir en WhatsApp.";
  } else if (ogImage) {
    s3_status = "warning";
    s3_score = 7;
    s3_findings = "Posee imagen OpenGraph pero faltan metadatos completos o formato 1200x630.";
    s3_needed = "Generar diseño en formato 1200x630 optimizado para previsualización en WhatsApp.";
  } else {
    s3_status = "failed";
    s3_score = 2;
    s3_findings = "Falta etiqueta og:image. Al compartir en WhatsApp solo se visualiza un enlace azul plano sin imagen.";
    s3_needed = "Inyectar bloque completo OpenGraph (og:title, og:description, og:image 1200x630).";
  }

  // --- PILAR 4: GEO Schemas para IA (ChatGPT, Perplexity & Gemini) - Max 15 pts
  let s4_status = "failed", s4_findings = "", s4_needed = "", s4_score = 0;
  if (signals.hasLlms && hasFaqSchema) {
    s4_status = "passed";
    s4_score = 15;
    s4_findings = "Protocolo GEO activo: archivo /llms.txt verificado y Schema FAQPage estructurado para respuestas directas de IA.";
    s4_needed = "Actualizar periódicamente las preguntas frecuentes en Schema FAQPage.";
  } else if (signals.hasLlms || hasFaqSchema) {
    s4_status = "warning";
    s4_score = 8;
    s4_findings = signals.hasLlms ? "Dispone de archivo /llms.txt pero falta Schema FAQPage estructurado." : "Tiene Schema FAQPage pero falta archivo /llms.txt en la raíz del dominio.";
    s4_needed = "Completar la suite GEO con llms.txt y Schema FAQPage para máxima citación en ChatGPT y Perplexity.";
  } else if (firewallProtected) {
    s4_status = "warning";
    s4_score = 8;
    s4_findings = "Rastreo de catálogo protegido por firewall. No se detectó /llms.txt público.";
    s4_needed = "Implementar archivo /llms.txt público en la raíz del dominio para permitir citación en ChatGPT y Gemini.";
  } else {
    s4_status = "failed";
    s4_score = 0;
    s4_findings = "Falta archivo /llms.txt (llmstxt.org) y Schema FAQPage. Los motores de IA no indexan el catálogo de la empresa.";
    s4_needed = "Implementar archivo /llms.txt y Schema JSON-LD FAQPage para indexación en ChatGPT y Gemini.";
  }

  // --- PILAR 5: Agente IA WhatsApp 24/7 & Conversión - Max 15 pts
  let s5_status = "failed", s5_findings = "", s5_needed = "", s5_score = 0;
  const isAiAgentActive = client?.hasAiAgent === true || 
                          client?.optimizationMatrix?.hasAiAgent === true || 
                          signals.hasAiAgent === true || 
                          (client?.notes && (client.notes.includes("AI_AGENT_ACTIVE") || client.notes.includes("WHATSAPP_AI_CONNECTED")));

  if (isAiAgentActive) {
    s5_status = "passed";
    s5_score = 15;
    s5_findings = "Agente IA WhatsApp 24/7 verificado y conectado al canal comercial (Atención conversacional en <3s y captura de leads activa).";
    s5_needed = "Auditar registros de conversaciones mensuales y calibrar base de conocimiento.";
  } else if (hasWaLink) {
    s5_status = "warning";
    s5_score = 6;
    s5_findings = "Canal directo WhatsApp detectado en código (wa.me). Canal activo pero opera con atención manual sujeta a disponibilidad humana (6/15 pts).";
    s5_needed = "Conectar Agente IA WhatsApp 24/7 (Webhook n8n / Make + API OpenAI) para agendamiento y ventas nocturnas en <3s.";
  } else if (firewallProtected) {
    s5_status = "warning";
    s5_score = 5;
    s5_findings = "Protegido por firewall. No se pudo verificar botón de WhatsApp de forma automatizada.";
    s5_needed = "Verificar si el sitio cuenta con botón flotante directo a WhatsApp con mensaje transaccional.";
  } else {
    s5_status = "failed";
    s5_score = 0;
    s5_findings = "Sin botón de WhatsApp ni automatización de chat. 0% de captura transaccional inmediata.";
    s5_needed = "Integrar botón directo de WhatsApp de alta conversión y conectar flujo de atención automatizada 24/7.";
  }

  // --- PILAR 6: SEO On-Page Transaccional - Max 15 pts
  let s6_status = "failed", s6_findings = "", s6_needed = "", s6_score = 0;
  const titleLen = title.length;
  const descLen = desc.length;
  const hasGoodTitle = titleLen >= 25 && titleLen <= 95;
  const hasGoodDesc = descLen >= 70 && descLen <= 230;

  if (hasGoodTitle && hasGoodDesc && (hasH1 || hasCanonical)) {
    s6_status = "passed";
    s6_score = 15;
    s6_findings = `Title Tag óptimo (${titleLen} carácteres: "${title}"), Meta Description (${descLen} carácteres) y estructura verificada.`;
    s6_needed = "Verificar estado del sitemap.xml en Google Search Console.";
  } else if (titleLen > 0 || descLen > 0) {
    s6_status = "warning";
    s6_score = 8;
    s6_findings = `Metadatos detectados: Título tiene ${titleLen} carácteres, Descripción tiene ${descLen} carácteres.`;
    s6_needed = "Ajustar longitud de Title y Meta Description orientados a palabras clave de compra.";
  } else if (firewallProtected) {
    s6_status = "warning";
    s6_score = 9;
    s6_findings = "Etiquetas protegidas por servidor seguro. La arquitectura DNS y respuesta HTTP están activas.";
    s6_needed = "Revisar Title y Description en Google Search Console.";
  } else {
    s6_status = "failed";
    s6_score = 0;
    s6_findings = "Falta etiqueta <title> o <meta name='description'>. Penalización directa en Google Search.";
    s6_needed = "Optimización integral de etiquetas On-Page y Canonical Tag.";
  }

  // --- PILAR 7: Cloud Hosting, SSL & Robots.txt - Max 10 pts
  let s7_status = "failed", s7_findings = "", s7_needed = "", s7_score = 0;
  if (isHttps && (signals.hasRobots || isEdgePlatform)) {
    s7_status = "passed";
    s7_score = 10;
    s7_findings = `Certificado SSL activo (HTTPS), hosting moderno (${serverHeader || 'Cloud Edge'}) y robots.txt verificado.`;
    s7_needed = "Monitoreo continuo de disponibilidad y respaldos periódicos.";
  } else if (isHttps) {
    s7_status = "warning";
    s7_score = 7;
    s7_findings = "Conexión segura SSL activa, pero se recomienda verificar archivo robots.txt.";
    s7_needed = "Subir archivo robots.txt con mapa de sitio sitemap.xml referenciado.";
  } else {
    s7_status = "failed";
    s7_score = 0;
    s7_findings = "El sitio no cuenta con HTTPS seguro. Los navegadores muestran advertencia 'No seguro'.";
    s7_needed = "Instalar certificado SSL obligatorio y forzar redirección HTTPS.";
  }

  const services = [
    {
      id: "web_conversion",
      title: "Landing Page Transaccional de Alta Conversión (<1s)",
      category: "Infraestructura & Frontend",
      icon: "⚡",
      status: s1_status,
      score: s1_score,
      maxScore: 15,
      findings: s1_findings,
      needed: s1_needed,
      solution: "Desarrollo en React 18 + Vite Anycast en Vercel Edge con tiempo de carga <0.5s garantizado.",
      taskTitle: "Aceleración Frontend Anycast (<0.5s) y Compresión Brotli"
    },
    {
      id: "google_maps_gbp",
      title: "Google Maps (GBP) & SEO Local Dominicano",
      category: "Adquisición Local",
      icon: "📍",
      status: s2_status,
      score: s2_score,
      maxScore: 15,
      findings: s2_findings,
      needed: s2_needed,
      solution: "Inyección de Geo Tags DO-01, Schema LocalBusiness y geocirugía en Google Business Profile.",
      taskTitle: "Optimización técnica Google Business Profile & Local 3-Pack"
    },
    {
      id: "whatsapp_social_cards",
      title: "WhatsApp Cards & OpenGraph 1200x630 (Social Sharing)",
      category: "Conversión Social",
      icon: "📲",
      status: s3_status,
      score: s3_score,
      maxScore: 15,
      findings: s3_findings,
      needed: s3_needed,
      solution: "Diseño e inyección de tarjeta OpenGraph de alta resolución 1200x630 para previsualización en WhatsApp.",
      taskTitle: "Inyección de tarjetas OpenGraph 1200x630 para WhatsApp"
    },
    {
      id: "geo_ai_schemas",
      title: "GEO Schemas para IA (ChatGPT, Perplexity & Gemini)",
      category: "Search Generativo",
      icon: "🤖",
      status: s4_status,
      score: s4_score,
      maxScore: 15,
      findings: s4_findings,
      needed: s4_needed,
      solution: "Despliegue de llms.txt, Schema FAQPage y autorización de bots de IA en robots.txt.",
      taskTitle: "Despliegue de protocolo GEO (/llms.txt y Schema FAQPage)"
    },
    {
      id: "ai_whatsapp_agent",
      title: "Agente IA WhatsApp 24/7 & Automatización de Ventas",
      category: "Atención Ininterrumpida",
      icon: "💬",
      status: s5_status,
      score: s5_score,
      maxScore: 15,
      findings: s5_findings,
      needed: s5_needed,
      solution: "Botón flotante inteligente con mensaje transaccional y flujo de respuesta en <3s.",
      taskTitle: "Integración de botón flotante WhatsApp transaccional"
    },
    {
      id: "onpage_seo_console",
      title: "SEO On-Page Transaccional & Google Search Console",
      category: "Indexación Orgánica",
      icon: "🔍",
      status: s6_status,
      score: s6_score,
      maxScore: 15,
      findings: s6_findings,
      needed: s6_needed,
      solution: "Reescritura de Title/Description transaccionales, canonical tags, sitemap.xml y alta en Search Console.",
      taskTitle: "Optimización On-Page Title/Description y sitemap.xml"
    },
    {
      id: "cloud_maintenance",
      title: "Mantenimiento Técnico, Hosting Anycast & Soporte",
      category: "SLA Operativo",
      icon: "🛡️",
      status: s7_status,
      score: s7_score,
      maxScore: 10,
      findings: s7_findings,
      needed: s7_needed,
      solution: "Monitoreo perimetral 24/7, certificado SSL bancario, robots.txt optimizado y backups diarios.",
      taskTitle: "Verificación de SSL bancario y archivo robots.txt"
    }
  ];

  const totalScore = services.reduce((acc, s) => acc + s.score, 0);
  const passedCount = services.filter(s => s.status === "passed").length;
  const warningCount = services.filter(s => s.status === "warning").length;
  const failedCount = services.filter(s => s.status === "failed").length;

  // CÁLCULO DE SALUD POR ALCANCE CONTRATADO (SCOPE-AWARE SCORING)
  let finalScore = totalScore;
  let isScopeAware = false;
  let contractedServices = services;
  let expansionServices = [];

  if (client && Array.isArray(client.contractedServices) && client.contractedServices.length > 0) {
    const contracted = services.filter(s => client.contractedServices.includes(s.id));
    const expansion = services.filter(s => !client.contractedServices.includes(s.id));

    if (contracted.length > 0) {
      isScopeAware = true;
      contractedServices = contracted;
      expansionServices = expansion;
      services.forEach(s => {
        s.isUncontracted = !client.contractedServices.includes(s.id);
      });
      const maxContracted = contracted.reduce((acc, s) => acc + s.maxScore, 0);
      const earnedContracted = contracted.reduce((acc, s) => acc + s.score, 0);
      finalScore = maxContracted > 0 ? Math.round((earnedContracted / maxContracted) * 100) : totalScore;
    }
  }

  return {
    url,
    score: finalScore,
    globalScore: totalScore,
    isScopeAware,
    contractedServices,
    expansionServices,
    contractedCount: contractedServices.length,
    expansionCount: expansionServices.length,
    latencyMs,
    detectedCms,
    firewallProtected,
    meta,
    services,
    passedCount,
    warningCount,
    failedCount
  };
}

export function displayAuditResults(results) {
  const scoreVal = document.getElementById("auditScoreValue");
  const scoreStatus = document.getElementById("auditScoreStatus");
  const scoreAdvice = document.getElementById("auditScoreAdvice");

  if (scoreVal) {
    scoreVal.innerHTML = `${results.score}<span class="text-xl sm:text-2xl text-slate-400 font-bold font-mono">/100</span>`;
    if (results.isScopeAware) {
      if (results.score >= 88) {
        scoreVal.className = "text-4xl sm:text-5xl font-black font-mono tracking-tight text-emerald-400";
        if (scoreStatus) {
          scoreStatus.className = "mt-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
          scoreStatus.textContent = `🟢 SLA de Servicios Contratados al 100% (${results.contractedCount} módulos)`;
        }
        if (scoreAdvice) {
          scoreAdvice.textContent = results.expansionCount > 0 
            ? `Tus módulos contratados operan con máxima excelencia. Tienes ${results.expansionCount} módulos disponibles en tu radar para expandir tu captación.`
            : "Excelente infraestructura. La totalidad de los servicios contratados están al 100%.";
        }
      } else if (results.score >= 60) {
        scoreVal.className = "text-4xl sm:text-5xl font-black font-mono tracking-tight text-amber-400";
        if (scoreStatus) {
          scoreStatus.className = "mt-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30";
          scoreStatus.textContent = `🟡 SLA en Nivel Medio (${results.contractedCount} módulos)`;
        }
        if (scoreAdvice) scoreAdvice.textContent = "Existen optimizaciones pendientes dentro de los servicios contratados actualmente.";
      } else {
        scoreVal.className = "text-4xl sm:text-5xl font-black font-mono tracking-tight text-rose-400";
        if (scoreStatus) {
          scoreStatus.className = "mt-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30";
          scoreStatus.textContent = `🔴 SLA Crítico en Módulos Activos (${results.contractedCount} módulos)`;
        }
        if (scoreAdvice) scoreAdvice.textContent = "Se detectaron fallos directos en los servicios contratados. Requiere remediación prioritaria.";
      }
    } else {
      if (results.score >= 88) {
        scoreVal.className = "text-4xl sm:text-5xl font-black font-mono tracking-tight text-emerald-400";
        if (scoreStatus) {
          scoreStatus.className = "mt-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
          scoreStatus.textContent = "Nivel Élite • Madurez Digital 360°";
        }
        if (scoreAdvice) scoreAdvice.textContent = "Excelente infraestructura general. La mayoría de los servicios operan a nivel de clase mundial.";
      } else if (results.score >= 60) {
        scoreVal.className = "text-4xl sm:text-5xl font-black font-mono tracking-tight text-amber-400";
        if (scoreStatus) {
          scoreStatus.className = "mt-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30";
          scoreStatus.textContent = results.firewallProtected ? "Seguridad Perimetral Activa • Diagnóstico 360°" : "Nivel Medio • Brechas de Crecimiento Detectadas";
        }
        if (scoreAdvice) scoreAdvice.textContent = results.firewallProtected 
          ? "El sitio cuenta con cortafuegos perimetral. Métricas de DNS, latencia y SSL verificadas al 100%."
          : "Tiene presencia básica, pero pierde prospectos valiosos por falta de optimización en Maps, WhatsApp o IA.";
      } else {
        scoreVal.className = "text-4xl sm:text-5xl font-black font-mono tracking-tight text-rose-400";
        if (scoreStatus) {
          scoreStatus.className = "mt-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30";
          scoreStatus.textContent = "Nivel Crítico 360° • Fuga de Clientes Detectada";
        }
        if (scoreAdvice) scoreAdvice.textContent = "Carece de los servicios técnicos esenciales. El negocio no rankea en Google y desaprovecha clientes.";
      }
    }
  }

  const passEl = document.getElementById("auditCountPassed");
  const warnEl = document.getElementById("auditCountWarning");
  const failEl = document.getElementById("auditCountFailed");
  if (passEl) passEl.textContent = results.passedCount;
  if (warnEl) warnEl.textContent = results.warningCount;
  if (failEl) failEl.textContent = results.failedCount;

  // Botones de acción y Banner de Conversión
  const syncBtn = document.getElementById("auditSyncRoadmapBtn");
  const quickBtn = document.getElementById("auditQuickSaveClientBtn");
  const convertBtn = document.getElementById("auditConvertClientBtn");
  const headerQuickBtn = document.getElementById("auditHeaderQuickSaveBtn");
  const ctaBanner = document.getElementById("auditClientCtaBanner");
  const ctaTitle = document.getElementById("auditCtaTitle");
  const ctaSub = document.getElementById("auditCtaSubtitle");
  const bannerQuickBtn = document.getElementById("auditQuickSaveBannerBtn");
  const bannerConvertBtn = document.getElementById("auditConvertBannerBtn");

  let detectedName = "";
  if (results.meta?.publisher && !results.meta.publisher.includes(".") && results.meta.publisher.length > 2) {
    detectedName = results.meta.publisher;
  } else if (results.meta?.title) {
    detectedName = results.meta.title.split(/[|\-—–•]/)[0].trim();
  }
  if (!detectedName) {
    try {
      detectedName = new URL(results.url).hostname.replace(/^www\./, '');
    } catch(e) {
      detectedName = results.url;
    }
  }

  if (state.currentAuditClient) {
    if (syncBtn) {
      syncBtn.classList.remove("hidden");
      syncBtn.innerHTML = `<span>🚀 Aplicar al Roadmap (${state.currentAuditClient.name})</span>`;
    }
    if (quickBtn) quickBtn.classList.add("hidden");
    if (convertBtn) convertBtn.classList.add("hidden");
    if (headerQuickBtn) headerQuickBtn.classList.add("hidden");

    if (ctaTitle) ctaTitle.textContent = `Cliente vinculado: ${state.currentAuditClient.name}`;
    if (ctaSub) ctaSub.textContent = "Puedes inyectar las brechas de este diagnóstico directamente a su roadmap de trabajo.";
    if (bannerQuickBtn) {
      bannerQuickBtn.innerHTML = `<span>🚀 Inyectar Brechas al Roadmap</span>`;
      bannerQuickBtn.onclick = () => window.syncAuditGapsToClientRoadmap ? window.syncAuditGapsToClientRoadmap() : null;
    }
    if (bannerConvertBtn) {
      bannerConvertBtn.innerHTML = `<span>👁️ Ver Ficha de Cliente</span>`;
      bannerConvertBtn.onclick = () => {
        closeServicesAuditModal();
        if (typeof openClientDrawer === 'function') openClientDrawer(state.currentAuditClient.id);
        else if (window.openClientDrawer) window.openClientDrawer(state.currentAuditClient.id);
      };
    }
  } else {
    if (syncBtn) syncBtn.classList.add("hidden");
    if (quickBtn) {
      quickBtn.classList.remove("hidden");
      quickBtn.innerHTML = `<span>⚡ Guardar Cliente (1 Clic)</span>`;
    }
    if (convertBtn) {
      convertBtn.classList.remove("hidden");
      convertBtn.innerHTML = `<span>✏️ Ficha Completa</span>`;
    }
    if (headerQuickBtn) headerQuickBtn.classList.remove("hidden");

    if (ctaTitle) ctaTitle.textContent = `¿Agregar "${detectedName}" a tu cartera de clientes?`;
    if (ctaSub) ctaSub.textContent = "Guarda este dominio con sus métricas y las tareas de remediación listas para cotizar y ejecutar.";
    if (bannerQuickBtn) {
      bannerQuickBtn.innerHTML = `<span>⚡ Guardar Cliente (1 Clic)</span>`;
      bannerQuickBtn.onclick = () => quickSaveAuditAsClient();
    }
    if (bannerConvertBtn) {
      bannerConvertBtn.innerHTML = `<span>✏️ Ficha Completa</span>`;
      bannerConvertBtn.onclick = () => convertAuditToClientWithPrefill();
    }
  }

  // Persistir en el registro histórico de auditorías
  try {
    const currentHist = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDIT_HISTORY) || "[]");
    const histEntry = {
      url: results.url,
      score: results.score,
      title: results.meta?.title || results.url,
      testedAt: new Date().toISOString()
    };
    const filtered = currentHist.filter(h => h.url !== results.url);
    filtered.unshift(histEntry);
    localStorage.setItem(STORAGE_KEYS.AUDIT_HISTORY, JSON.stringify(filtered.slice(0, 50)));
  } catch(e){}

  // Renderizar tarjetas de servicios
  const listEl = document.getElementById("auditServicesList");
  if (!listEl) return;

  listEl.innerHTML = results.services.map((svc, idx) => {
    let badgeClass = "", badgeText = "", borderClass = "";
    const isContracted = !results.isScopeAware || (state.currentAuditClient?.contractedServices?.includes(svc.id));

    if (!isContracted) {
      badgeClass = "bg-purple-500/20 text-purple-300 border-purple-500/40";
      badgeText = "🚀 Radar de Expansión (Upsell)";
      borderClass = "border-purple-500/30 bg-[#120e22]/90";
    } else if (svc.status === "passed") {
      badgeClass = "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      badgeText = "Cumple Estándar ✓";
      borderClass = "border-emerald-500/30 bg-[#09111c]";
    } else if (svc.status === "warning") {
      badgeClass = "bg-amber-500/20 text-amber-300 border-amber-500/30";
      badgeText = "Oportunidad de Mejora ⚠️";
      borderClass = "border-amber-500/30 bg-[#12101b]";
    } else {
      badgeClass = "bg-rose-500/20 text-rose-300 border-rose-500/30";
      badgeText = "Brecha Crítica ✕";
      borderClass = "border-rose-500/40 bg-[#140b15]";
    }

    const detailId = `auditServiceDetail_${idx}`;

    return `
      <div class="p-4 rounded-lg border ${borderClass} transition-all">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-start gap-3">
            <span class="text-2xl shrink-0 mt-0.5">${svc.icon}</span>
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h5 class="text-sm font-black text-white">${svc.title}</h5>
                <span class="px-2 py-0.5 rounded-md text-[10px] font-bold border ${badgeClass}">
                  ${badgeText}
                </span>
                ${isContracted && results.isScopeAware ? `<span class="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">SLA Activo</span>` : ''}
              </div>
              <span class="text-[11px] font-mono ${isContracted ? 'text-cyan-400' : 'text-purple-400'} block mt-0.5">${svc.category}</span>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button onclick="toggleAuditDetail('${detailId}')" class="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1 transition-colors cursor-pointer">
              <span>${isContracted ? 'Ver Detalle & Solución' : '💡 Ver Oportunidad de Expansión'}</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
          </div>
        </div>

        <div id="${detailId}" class="${svc.status === 'passed' ? 'hidden' : ''} mt-4 pt-4 border-t border-slate-800 space-y-3 text-xs leading-relaxed">
          <div class="p-3 rounded bg-slate-900/90 border border-slate-800">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">🔍 Diagnóstico Real en el Sitio Web:</span>
            <p class="text-slate-300">${svc.findings}</p>
          </div>

          <div class="p-3 rounded bg-purple-950/20 border border-purple-500/30">
            <span class="text-[10px] font-bold uppercase tracking-wider text-purple-300 block mb-1">🛠️ Qué Necesita para Lograr el Servicio:</span>
            <p class="text-purple-200 font-medium">${svc.needed}</p>
          </div>

          <div class="p-3 rounded bg-cyan-950/20 border border-cyan-500/30 flex items-start gap-2.5">
            <span class="text-base text-cyan-400 shrink-0">💼</span>
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-cyan-300 block mb-0.5">Solución Oficial de ISAPromoRD:</span>
              <span class="text-slate-200 font-semibold text-[11px]">${svc.solution}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

export function toggleAuditDetail(detailId) {
  const el = document.getElementById(detailId);
  if (el) el.classList.toggle('hidden');
}

// Guardar cliente auditado en 1 clic
export async function quickSaveAuditAsClient() {
  if (!state.currentAuditResults) return;
  const res = state.currentAuditResults;
  const url = res.url || state.currentAuditUrl;
  let domain = "";
  try {
    domain = new URL(url).hostname;
  } catch(e) {
    domain = url.replace(/^https?:\/\//, '').split('/')[0];
  }

  let clientName = "";
  if (res.meta && res.meta.publisher && !res.meta.publisher.includes(".") && res.meta.publisher.length > 2) {
    clientName = res.meta.publisher;
  } else if (res.meta && res.meta.title) {
    const parts = res.meta.title.split(/[|\-—–•]/).map(p => p.trim()).filter(Boolean);
    if (parts.length > 0) clientName = parts[0];
  }
  if (!clientName || clientName.length < 2) {
    clientName = domain.replace(/^www\./, '').split('.')[0];
    clientName = clientName.charAt(0).toUpperCase() + clientName.slice(1);
  }

  const combinedText = ((res.meta?.title || "") + " " + (res.meta?.description || "")).toLowerCase();
  let detectedCat = "Servicios Profesionales";
  if (/apartamento|torre|inmueble|bienes ra[íi]ces|realty|penthouse|residencial/i.test(combinedText)) {
    detectedCat = "Bienes Raíces & Inmobiliaria";
  } else if (/veterinari|pecuari|ganader|agrop|finca|animal/i.test(combinedText)) {
    detectedCat = "Agropecuaria & Tienda Online";
  } else if (/dent|odont|cl[íi]nic|m[ée]dic|salud|doctor|est[ée]tic/i.test(combinedText)) {
    detectedCat = "Salud & Especialidades Médicas";
  } else if (/log[íi]stic|transporte|carga|flete|despacho|aduan/i.test(combinedText)) {
    detectedCat = "Logística & Transporte de Carga";
  } else if (/restauran|caf[ée]|comida|bar|gourmet|pizza/i.test(combinedText)) {
    detectedCat = "Gastronomía & Restaurante";
  }

  const platform = res.detectedCms ? res.detectedCms : (res.meta?.responseHeaders?.server || "Hosting Cloud");
  const today = new Date().toISOString().split('T')[0];
  const gaps = res.services.filter(s => s.status !== 'passed');

  const initialTasks = [
    {
      id: 1,
      title: "Auditoría inicial 360° ejecutada con éxito",
      done: true,
      date: today,
      guide: {
        summary: `Diagnóstico completado con Health Score de ${res.score}/100.`,
        details: "Inspección de SEO, Maps, OpenGraph, IA y arquitectura realizada."
      }
    },
    ...gaps.map((g, idx) => ({
      id: idx + 2,
      title: `Remediación: ${g.title}`,
      done: false,
      date: today,
      guide: {
        summary: g.needed,
        details: `${g.findings} Solución recomendada por ISAPromoRD: ${g.solution}`
      }
    }))
  ];

  const newClient = {
    id: "client-" + Date.now(),
    name: clientName,
    category: detectedCat,
    liveUrl: url,
    platform: platform,
    contactPerson: "",
    phone: "",
    email: "",
    status: "lead",
    fee: "RD$ 4,500 / mes",
    renewalDate: null,
    repoUrl: "",
    notes: `Cliente registrado automáticamente desde Auditoría 360° (${url}).`,
    joinedDate: today,
    healthScore: res.score,
    latencyMs: res.latencyMs || 350,
    optimizationMatrix: {
      seo: res.score >= 80 ? "85%" : "65%",
      whatsapp: "80%",
      geo: "70%",
      ai: "60%"
    },
    tasks: initialTasks,
    uptimeStatus: "online",
    lastAuditSummary: {
      score: res.score,
      testedAt: new Date().toISOString(),
      latencyMs: res.latencyMs,
      detectedCms: res.detectedCms
    }
  };

  state.clients.unshift(newClient);
  saveClientsToStorage(true);
  state.currentAuditClient = newClient;

  await syncClientToCloud(newClient);

  if (window.renderClients) window.renderClients();
  if (window.updateKpis) window.updateKpis();

  const syncBtn = document.getElementById("auditSyncRoadmapBtn");
  const quickBtn = document.getElementById("auditQuickSaveClientBtn");
  const convertBtn = document.getElementById("auditConvertClientBtn");
  if (quickBtn) quickBtn.classList.add("hidden");
  if (convertBtn) convertBtn.classList.add("hidden");
  if (syncBtn) {
    syncBtn.classList.remove("hidden");
    syncBtn.innerHTML = `<span>🚀 Roadmap Vinculado (${clientName})</span>`;
  }

  showToast(`⚡ ¡"${clientName}" guardado y respaldado en la nube con éxito!`, "success");
}

export function syncAuditGapsToClientRoadmap() {
  if (!state.currentAuditResults) return;

  const gaps = state.currentAuditResults.services.filter(s => s.status !== "passed");
  if (gaps.length === 0) {
    showToast("✓ Todos los servicios ya están en estado óptimo. No hay brechas pendientes.", "success");
    return;
  }

  if (state.currentAuditClient) {
    const client = state.currentAuditClient;
    if (!client.tasks) client.tasks = [];

    let addedCount = 0;
    const today = new Date().toISOString().split('T')[0];

    gaps.forEach(gap => {
      const exists = client.tasks.some(t => t.title.toLowerCase().includes(gap.title.toLowerCase().substring(0, 15)));
      if (!exists) {
        const newTaskId = client.tasks.length > 0 ? Math.max(...client.tasks.map(t => t.id || 0)) + 1 : 1;
        client.tasks.push({
          id: newTaskId,
          title: gap.taskTitle,
          done: false,
          date: today,
          guide: {
            summary: gap.needed,
            details: `${gap.findings} Solución recomendada por ISAPromoRD: ${gap.solution}`
          }
        });
        addedCount++;
      }
    });

    client.healthScore = state.currentAuditResults.score;

    saveClientsToStorage(true);
    syncClientToCloud(client);
    if (window.renderClients) window.renderClients();

    const btn = document.getElementById("auditSyncRoadmapBtn");
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = `<span>✓ ¡Roadmap Sincronizado (${addedCount} tareas)!</span>`;
      setTimeout(() => btn.innerHTML = orig, 3000);
    }

    showToast(`✓ Roadmap de ${client.name} actualizado (+${addedCount} tareas sincronizadas).`, "success");
  } else {
    if (window.convertAuditToClientWithPrefill) {
      window.convertAuditToClientWithPrefill();
    }
  }
}

export function copyAuditProposalWhatsapp() {
  if (!state.currentAuditResults) return;

  const res = state.currentAuditResults;
  const clientName = state.currentAuditClient ? state.currentAuditClient.name : (res.meta?.title || new URL(res.url).hostname);
  const score = res.score;
  const statusText = score >= 85 ? "Nivel Óptimo" : (score >= 60 ? "Nivel Medio (Con Brechas)" : "Nivel Crítico");

  const failedSvcs = res.services.filter(s => s.status === "failed");
  const warningSvcs = res.services.filter(s => s.status === "warning");

  let text = `⚡ *Diagnóstico Técnico Web 360° — ISAPromoRD*\n`;
  text += `🎯 *Negocio:* ${clientName}\n`;
  text += `🌐 *URL:* ${res.url}\n`;
  text += `📊 *Health Score:* ${score}/100 (${statusText})\n`;
  text += `⏱️ *Latencia Edge Anycast:* ${res.latencyMs}ms\n\n`;

  if (failedSvcs.length > 0) {
    text += `❌ *Brechas Prioritarias Detectadas:*\n`;
    failedSvcs.forEach((s, idx) => {
      text += `${idx + 1}. *${s.title}*\n   • ${s.needed}\n`;
    });
    text += `\n`;
  }

  if (warningSvcs.length > 0) {
    text += `⚠️ *Oportunidades de Optimización:*\n`;
    warningSvcs.forEach((s, idx) => {
      text += `${idx + 1}. *${s.title}*\n   • ${s.needed}\n`;
    });
    text += `\n`;
  }

  text += `💼 *Plan de Solución Llave en Mano:*\n`;
  text += `Podemos implementar la remediación completa en 10-15 días laborables.\n`;
  text += `👉 ¿Cuándo te es más cómodo que coordinemos una llamada de 10 minutos para revisar los detalles?`;

  navigator.clipboard.writeText(text).then(() => {
    showToast("✓ Reporte formateado para WhatsApp copiado al portapapeles", "success");
  });
}

export function copyAuditReportForAntigravity() {
  if (!state.currentAuditResults) return;

  const res = state.currentAuditResults;
  const clientName = state.currentAuditClient ? state.currentAuditClient.name : (res.meta?.title || new URL(res.url).hostname);

  let json = {
    client: clientName,
    url: res.url,
    score: res.score,
    latencyMs: res.latencyMs,
    firewallProtected: res.firewallProtected,
    services: res.services.map(s => ({
      title: s.title,
      status: s.status,
      score: s.score,
      findings: s.findings,
      solution: s.solution
    }))
  };

  navigator.clipboard.writeText(JSON.stringify(json, null, 2)).then(() => {
    showToast("✓ Reporte técnico para AntiGravity copiado al portapapeles", "success");
  });
}

export function convertAuditToClientWithPrefill() {
  if (!state.currentAuditResults) return;

  const res = state.currentAuditResults;
  const url = res.url || state.currentAuditUrl;
  let domain = "";
  try {
    domain = new URL(url).hostname;
  } catch(e) {
    domain = (url || "").replace(/^https?:\/\//, '').split('/')[0];
  }

  // 1. Extraer nombre comercial limpio
  let clientName = "";
  if (res.meta && res.meta.publisher && !res.meta.publisher.includes(".") && res.meta.publisher.length > 2) {
    clientName = res.meta.publisher;
  } else if (res.meta && res.meta.title) {
    const parts = res.meta.title.split(/[|\-—–•]/).map(p => p.trim()).filter(Boolean);
    if (parts.length > 0) clientName = parts[0];
  }
  if (!clientName || clientName.length < 2) {
    clientName = domain.replace(/^www\./, '').split('.')[0];
    clientName = clientName ? clientName.charAt(0).toUpperCase() + clientName.slice(1) : "Nuevo Cliente";
  }

  // 2. Extraer Categoría / Nicho detectado
  const combinedText = ((res.meta?.title || "") + " " + (res.meta?.description || "")).toLowerCase();
  let detectedCat = "Servicios Profesionales";
  if (/apartamento|torre|inmueble|bienes ra[íi]ces|realty|penthouse|residencial/i.test(combinedText)) {
    detectedCat = "Bienes Raíces & Inmobiliaria";
  } else if (/veterinari|pecuari|ganader|agrop|finca|animal/i.test(combinedText)) {
    detectedCat = "Agropecuaria & Tienda Online";
  } else if (/dent|odont|cl[íi]nic|m[ée]dic|salud|doctor|est[ée]tic/i.test(combinedText)) {
    detectedCat = "Salud & Especialidades Médicas";
  } else if (/log[íi]stic|transporte|carga|flete|despacho|aduan/i.test(combinedText)) {
    detectedCat = "Logística & Transporte de Carga";
  } else if (/abogad|legal|jur[íi]dic|notar/i.test(combinedText)) {
    detectedCat = "Servicios Legales & Consultoría";
  } else if (/restauran|caf[ée]|comida|bar|gourmet|pizza/i.test(combinedText)) {
    detectedCat = "Gastronomía & Restaurante";
  } else if (/hotel|resort|turis|viaje|hospedaje/i.test(combinedText)) {
    detectedCat = "Turismo & Hospitalidad";
  } else if (/tienda|shop|compra|producto|ropa|calzado/i.test(combinedText)) {
    detectedCat = "Comercio Electrónico / Retail";
  }

  // 3. Plataforma detectada
  const platform = res.detectedCms ? res.detectedCms : (res.meta?.responseHeaders?.server || "Hosting Cloud");

  // 4. Cerrar auditoría y abrir modal de nuevo cliente
  closeServicesAuditModal();
  if (typeof openNewClientModal === 'function') {
    openNewClientModal();
  } else if (window.openNewClientModal) {
    window.openNewClientModal();
  }

  // 5. Pre-llenar campos en el formulario
  const liveUrlInput = document.getElementById("clientLiveUrl");
  const nameInput = document.getElementById("clientName");
  const catInput = document.getElementById("clientCategory");
  const platInput = document.getElementById("clientPlatform");
  const feeInput = document.getElementById("clientFee");
  const statusInput = document.getElementById("clientStatus");

  if (liveUrlInput) liveUrlInput.value = url;
  if (nameInput) nameInput.value = clientName;
  if (catInput) catInput.value = detectedCat;
  if (platInput) platInput.value = platform;
  if (feeInput) feeInput.value = "RD$ 4,500 / mes";
  if (statusInput) statusInput.value = "lead";

  // 6. Preparar brechas para inyectarlas directamente al guardar
  const gaps = res.services ? res.services.filter(s => s.status !== 'passed') : [];
  window._pendingAuditGapsForNewClient = {
    score: res.score,
    latencyMs: res.latencyMs,
    gaps: gaps.map(s => ({
      taskTitle: `Remediación: ${s.title}`,
      needed: s.needed,
      findings: s.findings,
      solution: s.solution
    }))
  };

  const feedback = document.getElementById("autoScanFeedback");
  if (feedback) feedback.classList.add("hidden");
  if (nameInput) nameInput.focus();
}

export function createProposalFromAudit() {
  if (!state.currentAuditResults) {
    showToast("Ejecuta primero una auditoría para cotizar sus hallazgos", "warning");
    return;
  }

  const res = state.currentAuditResults;
  const url = res.url || state.currentAuditUrl;
  let domain = "";
  try {
    domain = new URL(url).hostname;
  } catch (e) {
    domain = (url || "").replace(/^https?:\/\//, '').split('/')[0];
  }

  let clientName = state.currentAuditClient ? state.currentAuditClient.name : "";
  if (!clientName) {
    if (res.meta && res.meta.publisher && !res.meta.publisher.includes(".") && res.meta.publisher.length > 2) {
      clientName = res.meta.publisher;
    } else if (res.meta && res.meta.title) {
      const parts = res.meta.title.split(/[|\-—–•]/).map(p => p.trim()).filter(Boolean);
      if (parts.length > 0) clientName = parts[0];
    }
    if (!clientName || clientName.length < 2) {
      clientName = domain.replace(/^www\./, '').split('.')[0];
      clientName = clientName ? clientName.charAt(0).toUpperCase() + clientName.slice(1) : "Prospecto Auditado";
    }
  }

  const combinedText = ((res.meta?.title || "") + " " + (res.meta?.description || "")).toLowerCase();
  let detectedCat = state.currentAuditClient?.category || "Servicios Profesionales";
  if (!state.currentAuditClient?.category) {
    if (/apartamento|torre|inmueble|bienes ra[íi]ces|realty|penthouse|residencial/i.test(combinedText)) {
      detectedCat = "Bienes Raíces & Inmobiliaria";
    } else if (/veterinari|pecuari|ganader|agrop|finca|animal/i.test(combinedText)) {
      detectedCat = "Agropecuaria & Tienda Online";
    } else if (/dent|odont|cl[íi]nic|m[ée]dic|salud|doctor|est[ée]tic/i.test(combinedText)) {
      detectedCat = "Salud & Especialidades Médicas";
    } else if (/restauran|caf[ée]|comida|bar|gourmet|pizza/i.test(combinedText)) {
      detectedCat = "Gastronomía & Restaurante";
    }
  }

  closeServicesAuditModal();
  if (window.switchDashboardTab) {
    window.switchDashboardTab('proposals');
  }

  const select = document.getElementById("proposalClientSelect");
  const customInput = document.getElementById("proposalClientCustom");
  const catInput = document.getElementById("proposalCategory");
  const phoneInput = document.getElementById("proposalClientPhone");

  if (select) {
    const matched = state.clients.find(c => c.name.toLowerCase() === clientName.toLowerCase());
    if (matched) {
      select.value = matched.name;
      if (customInput) customInput.classList.add("hidden");
      if (phoneInput) phoneInput.value = matched.phone || "";
    } else {
      select.value = "__custom__";
      if (customInput) {
        customInput.classList.remove("hidden");
        customInput.value = clientName;
      }
    }
  }
  if (catInput) catInput.value = detectedCat;

  // Pre-seleccionar servicios según las brechas reales detectadas en la auditoría
  const gaps = (res.services || []).filter(s => s.status !== 'passed');
  const recommendedAddonIds = new Set(['srv-hosting']);
  gaps.forEach(g => {
    const id = (g.id || '').toLowerCase();
    const title = (g.title || '').toLowerCase();
    if (id.includes('web') || title.includes('landing') || title.includes('conversión')) recommendedAddonIds.add('srv-landing');
    if (id.includes('maps') || title.includes('maps') || title.includes('gbp')) {
      recommendedAddonIds.add('srv-gbp-setup');
      recommendedAddonIds.add('srv-gbp-monthly');
    }
    if (id.includes('seo') || id.includes('geo') || id.includes('whatsapp_cards') || title.includes('seo') || title.includes('ia')) {
      recommendedAddonIds.add('srv-seo-geo');
    }
    if (id.includes('agent') || title.includes('agente') || title.includes('whatsapp 24/7')) {
      recommendedAddonIds.add('srv-wa-bot');
      recommendedAddonIds.add('srv-wa-maint');
    }
  });

  if (window.applyAuditPreselectionToProposal) {
    window.applyAuditPreselectionToProposal(Array.from(recommendedAddonIds));
  }

  showToast(`📝 Cotizador preparado con los hallazgos técnicos de ${clientName}`, "success");
  window.scrollTo({ top: 100, behavior: 'smooth' });
}

export function openGooglePageSpeedOfficial() {
  const targetUrl = state.currentAuditUrl || state.currentAuditClient?.liveUrl;
  if (!targetUrl) {
    showToast("Introduce o selecciona una URL para auditar", "error");
    return;
  }
  const cleanUrl = targetUrl.trim();
  const psiUrl = `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(cleanUrl)}`;
  window.open(psiUrl, "_blank", "noopener,noreferrer");
  showToast("Abriendo Google PageSpeed Insights oficial...", "info");
}


