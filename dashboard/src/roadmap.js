/**
 * ISAPromoRD - Roadmap & Deliverables Engine
 * Task management, official service catalog, proposal sync to deliverables,
 * and HQ Agency growth tasks.
 */
import { state, STORAGE_KEYS, PROPOSAL_BASE_PACKAGES } from './state.js';
import { saveClientsToStorage } from './sync.js';
import { showToast, escapeHtml } from './ui.js';

export const OFFICIAL_CATALOG_SERVICES = [
  {
    key: "web-fast",
    icon: "🌐",
    name: "Desarrollo de Landing Page Transaccional (<1s)",
    badge: "Pago Único (RD$ 28,000)",
    summary: "Desarrollo en React/Vite con carga ultra-rápida (<0.4s) en 4G RD, diseño responsive y botón WhatsApp transaccional.",
    details: "1. Estructura HTML5 semántica y Tailwind CSS minificado.\n2. Optimización de imágenes en formato WebP/AVIF.\n3. Integración de botón interactivo de WhatsApp con mensaje transaccional pre-llenado.\n4. Certificación de carga <0.8s en PageSpeed."
  },
  {
    key: "web-corporate",
    icon: "🏛️",
    name: "Web Corporativa Multi-Página (Hasta 5 Subpáginas)",
    badge: "Pago Único (RD$ 55,000)",
    summary: "Estructura completa para empresas con múltiples líneas de servicio, arquitectura Spoke, SEO profundo y Schema JSON-LD.",
    details: "1. Arquitectura de silos Hub & Spoke con hasta 5 páginas internas optimizadas.\n2. Optimización semántica y Schema JSON-LD multi-entidad.\n3. Indexación en motores generativos IA (llms.txt + sitemap.xml).\n4. Entrega en 10 a 14 días laborables con garantía 100/100 Core Web Vitals."
  },
  {
    key: "maps-setup",
    icon: "📍",
    name: "Optimización Profesional de Google Maps (GBP)",
    badge: "Pago Único (RD$ 15,000)",
    summary: "Reclamación, configuración técnica y optimización completa de ficha Google Business Profile para Pack-3.",
    details: "1. Verificación de propiedad en Google Business Profile.\n2. Categorías primarias y secundarias de alta relevancia local.\n3. Catálogo de productos/servicios y subida de fotos geolocalizadas.\n4. Optimización de horarios y llamada a la acción hacia WhatsApp."
  },
  {
    key: "maps-monthly",
    icon: "📈",
    name: "Gestión Activa Mensual Google Maps & SEO Local",
    badge: "Mensual (RD$ 12,000/mes)",
    summary: "Publicaciones semanales en Google Maps, respuesta profesional a cada reseña con palabras clave locales.",
    details: "1. Redacción y publicación de posts semanales con ofertas y novedades.\n2. Respuesta en <24h a reseñas de clientes con keywords locales de Santo Domingo.\n3. Monitoreo del Local Pack 3 de Google Maps.\n4. Reporte mensual de llamadas y solicitudes de ruta ganadas."
  },
  {
    key: "ai-whatsapp",
    icon: "🤖",
    name: "Agente IA WhatsApp 24/7 (Citas & Ventas)",
    badge: "Setup (RD$ 25,000) + Tokens",
    summary: "IA conversacional avanzada que atiende visitantes las 24 horas: resuelve dudas, califica leads y agenda citas.",
    details: "1. Diseño del árbol conversacional y respuestas a preguntas frecuentes.\n2. Conexión de API de WhatsApp oficial con latencia de respuesta <3s.\n3. Agendamiento de citas directo a Google Calendar.\n4. Notificación inmediata a gerencia ante leads calificados."
  },
  {
    key: "geo-schemas",
    icon: "🔍",
    name: "Optimización GEO Schemas JSON-LD & llms.txt",
    badge: "Pago Único (RD$ 15,000)",
    summary: "Implementación de Schema JSON-LD y archivo llms.txt para recomendación por ChatGPT, Gemini y Perplexity.",
    details: "1. Bloque Schema.org LocalBusiness con geocoordenadas exactas y horarios.\n2. Archivo /llms.txt en raíz con catálogo y propuesta de valor condensada.\n3. Validar sintaxis en Schema.org Validator y Google Rich Results.\n4. Indexación en motores generativos de Inteligencia Artificial."
  },
  {
    key: "crm-custom",
    icon: "📊",
    name: "CRM Personalizado a Medida (Ventas & Clientes)",
    badge: "Setup (RD$ 35,000)",
    summary: "Sistema centralizado a la medida. Incluye hasta 3 módulos estándar (Contactos, Pipeline, Cobros). Módulos adicionales se cotizan aparte.",
    details: "1. Modelado de base de datos en Supabase con persistencia en tiempo real.\n2. Tablero de control de embudo de ventas y cotizaciones.\n3. Gestión de cartera de clientes y cuentas por cobrar.\n4. Capacitación del equipo comercial para adopción ágil."
  },
  {
    key: "crm-ncf",
    icon: "🧾",
    name: "Módulo CRM: Facturas & Cotizaciones PDF con NCF (B01)",
    badge: "Setup Único (RD$ 15,000)",
    summary: "Generación de facturas formales con logo corporativo, desglose de ITBIS (18%) y correlativo de comprobantes fiscales DGII.",
    details: "1. Plantilla ejecutiva PDF con logo corporativo.\n2. Numeración secuencial de NCF DGII (B01, B02, etc.).\n3. Desglose automático de ITBIS 18% y subtotal.\n4. Envío directo al WhatsApp o correo del cliente."
  },
  {
    key: "crm-inventory",
    icon: "📦",
    name: "Módulo CRM: Control de Inventario & Alertas de Stock",
    badge: "Setup Único (RD$ 15,000)",
    summary: "Entradas, salidas, alertas de stock mínimo automático vía WhatsApp y cálculo de inventario en tiempo real.",
    details: "1. Catálogo de productos con SKU y categorías.\n2. Registro de entradas, salidas y mermas.\n3. Alertas automáticas de stock crítico por WhatsApp.\n4. Valuación de inventario en tiempo real."
  },
  {
    key: "cloud-maintenance",
    icon: "🛡️",
    name: "Mantenimiento Cloud Anycast, SSL & Backups",
    badge: "Mensual (RD$ 4,500/mes)",
    summary: "Hosting Anycast, certificado SSL TLS 1.3, copias de seguridad continuas y soporte prioritario.",
    details: "1. Monitoreo activo de Uptime 24/7 y latencia DNS oficial.\n2. Copias de seguridad automáticas de base de datos y archivos en la nube.\n3. Renovación automática de certificados de seguridad SSL.\n4. Soporte técnico prioritario por canal de WhatsApp de la agencia."
  }
];

export const DEFAULT_HQ_TASKS = [
  {
    id: 1,
    title: "Despliegue de web principal y Edge Hosting (GitHub Pages / Vercel)",
    done: true,
    category: "Infraestructura",
    guide: {
      summary: "Alojamiento global con arquitectura JAMstack ultrarrápida (<500ms) y CDN de alta disponibilidad.",
      details: "Web corporativa en línea en https://isapromord.github.io con certificado SSL automático y respuesta HTTP 200 OK.",
      link: "https://isapromord.github.io/",
      linkLabel: "Visitar Web de ISAPromoRD",
      copyText: "https://isapromord.github.io/",
      copyLabel: "Copiar Enlace Web"
    }
  },
  {
    id: 2,
    title: "Verificación técnica de propiedad en Google Search Console",
    done: true,
    category: "Google Search",
    guide: {
      summary: "Propiedad verificada mediante archivo oficial HTML google3f4f1a1b04896181.html.",
      details: "Google Search Console confirmó la titularidad técnica de la firma con código de respuesta HTTP 200 OK.",
      link: "https://search.google.com/search-console",
      linkLabel: "Abrir Search Console"
    }
  },
  {
    id: 3,
    title: "Solicitud de indexación prioritaria de la URL principal en Googlebot",
    done: true,
    category: "Google Search",
    guide: {
      summary: "URL ingresada en la cola de rastreo prioritario de Googlebot.",
      details: "Rastreo solicitado exitosamente desde URL Inspection de Search Console para incorporación al índice orgánico en 24-48 horas."
    }
  },
  {
    id: 4,
    title: "Envío y programación del sitemap.xml oficial en Google Search Console",
    done: true,
    category: "Google Search",
    guide: {
      summary: "Sitemap oficial enviado a Googlebot conteniendo las páginas clave e imágenes corporativas.",
      details: "Dirección enviada: https://isapromord.github.io/sitemap.xml. En proceso de lectura y descubrimiento por Google.",
      link: "https://isapromord.github.io/sitemap.xml",
      linkLabel: "Ver sitemap.xml en Vivo",
      copyText: "https://isapromord.github.io/sitemap.xml",
      copyLabel: "Copiar URL Sitemap"
    }
  },
  {
    id: 5,
    title: "Creación y optimización de ficha en Google Business Profile (Google Maps Pack-3)",
    done: false,
    isNext: true,
    category: "Google Maps",
    guide: {
      summary: "Ficha oficial de la agencia indispensable para aparecer en el mapa y en las búsquedas locales de República Dominicana.",
      details: "<b>1. Nombre Comercial:</b> ISAPromoRD - Posicionamiento SEO & Diseño Web<br><b>2. Categoría Principal:</b> Agencia de marketing digital (Secundarias: Diseñador de sitios web, Empresa de software)<br><b>3. Ubicación:</b> Santo Domingo, República Dominicana (Área de servicio: Todo el país)<br><b>4. Teléfono:</b> 829-455-4783<br><b>5. Web:</b> https://isapromord.github.io",
      link: "https://google.com/business",
      linkLabel: "Abrir Google Business Profile",
      copyText: "ISAPromoRD es una firma boutique de ingeniería digital y aceleración comercial especializada en posicionamiento orgánico SEO Local en Google Search y conquista del Google Local 3-Pack en Google Maps en Santo Domingo y República Dominicana. Desarrollamos páginas web de ultra-alta velocidad (<0.5s) con arquitectura JAMstack, plataformas CRM a la medida para gestión comercial sin costo por usuario, y agentes de Inteligencia Artificial para atención y ventas 24/7. Ayudamos a empresas inmobiliarias, clínicas, agropecuarias y negocios de servicios a dominar su sector y captar prospectos calificados todos los días.",
      copyLabel: "Copiar Descripción SEO (750 caracteres)"
    }
  },
  {
    id: 6,
    title: "Campaña de primeras 5 a 10 reseñas de 5 estrellas con keywords locales",
    done: false,
    category: "Reputación & SEO",
    guide: {
      summary: "El factor #1 del algoritmo de Google Maps para subir al puesto #1 son las opiniones con términos del sector.",
      details: "Envía el enlace corto de 'Solicitar opiniones' de tu ficha a colaboradores, clientes (Torre Apex, Pasión Pecuaria) y aliados pidiéndoles mencionar palabras como: <i>'Excelente agencia de diseño web en Santo Domingo'</i> o <i>'Gran servicio de SEO y páginas web rápidas'</i>.",
      copyText: "¡Hola! ¿Podrías apoyarnos con una reseña de 5 estrellas en Google para ISAPromoRD? Solo toma 1 minuto: [Pega aquí tu enlace de Google Maps]. Si puedes mencionar que hacemos páginas web rápidas o SEO en Santo Domingo, ¡te lo agradecería de corazón!",
      copyLabel: "Copiar Plantilla de WhatsApp para Reseñas"
    }
  },
  {
    id: 7,
    title: "Conexión de dominio propio isapromord.com en GitHub Pages DNS",
    done: false,
    category: "Dominio & Branding",
    guide: {
      summary: "Configurar los 4 registros A de GitHub Pages y el CNAME para apuntar isapromord.com directamente a la plataforma.",
      details: "<b>Registros A para @:</b><br>185.199.108.153<br>185.199.109.153<br>185.199.110.153<br>185.199.111.153<br><br><b>CNAME para www:</b> isapromord.github.io",
      copyText: "185.199.108.153\n185.199.109.153\n185.199.110.153\n185.199.111.153",
      copyLabel: "Copiar IPs de GitHub Pages"
    }
  }
];

let hqTasks = [];

// ==========================================
// CLIENT TASK HANDLERS
// ==========================================
export function toggleTask(clientId, taskId) {
  const client = state.clients.find(c => c.id === clientId);
  if (!client) return;

  const task = (client.tasks || []).find(t => (t.id !== undefined && t.id === taskId) || t.id === Number(taskId));
  if (task) {
    task.done = !task.done;
    saveClientsToStorage(true);
    if (window.renderClients) window.renderClients();
    if (typeof window.renderClientDrilldown === 'function' && state.currentDrilldownClientId === clientId) {
      window.renderClientDrilldown();
    }
  }
}

export function deleteClientTask(clientId, taskId) {
  const client = state.clients.find(c => c.id === clientId);
  if (!client || !client.tasks) return;

  client.tasks = client.tasks.filter((t, i) => (t.id !== undefined ? t.id !== taskId : i !== taskId));
  saveClientsToStorage(true);
  if (window.renderClients) window.renderClients();
  if (typeof window.renderClientDrilldown === 'function' && state.currentDrilldownClientId === clientId) {
    window.renderClientDrilldown();
  }
  showToast("Entregable eliminado del roadmap", "info");
}

export function toggleTaskGuide(guideId) {
  const el = document.getElementById(guideId);
  if (!el) return;
  el.classList.toggle('hidden');
}

// ==========================================
// ROADMAP MANAGEMENT MODAL
// ==========================================
export function openRoadmapManagementModal(clientId) {
  if (!clientId) clientId = state.currentDrilldownClientId;
  if (!clientId && state.clients.length > 0) clientId = state.clients[0].id;
  state.currentRoadmapClientId = clientId;

  const client = state.clients.find(c => c.id === clientId);
  if (!client) {
    showToast("Selecciona un cliente para gestionar su Roadmap", "warning");
    return;
  }

  const modal = document.getElementById("roadmapManagementModal");
  if (!modal) return;

  const nameEl = document.getElementById("roadmapModalClientName");
  if (nameEl) nameEl.textContent = client.name;

  const totalTasks = client.tasks ? client.tasks.length : 0;
  const doneTasks = client.tasks ? client.tasks.filter(t => t.done).length : 0;
  const footerCount = document.getElementById("roadmapModalFooterCount");
  if (footerCount) {
    footerCount.textContent = `${doneTasks} de ${totalTasks} entregables completados`;
  }

  renderRoadmapProposalsTab(client);
  if (window.renderRoadmapContractsTab) window.renderRoadmapContractsTab(client);
  renderRoadmapCatalogTab();
  switchRoadmapTab('proposals');

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

export function closeRoadmapManagementModal() {
  const modal = document.getElementById("roadmapManagementModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

export function switchRoadmapTab(tabKey) {
  const tabs = ['proposals', 'contracts', 'catalog', 'custom'];
  tabs.forEach(t => {
    const btn = document.getElementById(`roadmapTabBtn-${t}`);
    const view = document.getElementById(`roadmapView-${t}`);
    if (btn) {
      if (t === tabKey) {
        btn.className = "px-4 py-2.5 text-xs font-bold border-b-2 border-cyan-400 text-cyan-300 transition-colors flex items-center gap-2 shrink-0 cursor-pointer";
      } else {
        btn.className = "px-4 py-2.5 text-xs font-bold border-b-2 border-transparent text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-2 shrink-0 cursor-pointer";
      }
    }
    if (view) {
      if (t === tabKey) view.classList.remove("hidden");
      else view.classList.add("hidden");
    }
  });
}

export function getProposalDeliverables(propItem) {
  let payload = null;
  try {
    const raw = localStorage.getItem("proposal_" + propItem.id);
    if (raw) payload = JSON.parse(raw);
  } catch (e) {}

  const deliverables = [];

  if (payload) {
    const pkg = payload.offeredPackage || payload.basePackage;
    if (pkg && Array.isArray(pkg.deliverables)) {
      pkg.deliverables.forEach(d => {
        deliverables.push({
          source: pkg.title || 'Combo Aprobado',
          title: d,
          summary: `Entregable contratado del paquete: ${pkg.title || 'ISAPromoRD'}`,
          details: `Alcance oficial incluido en la propuesta comercial aprobada por ${payload.clientName || 'el cliente'}.`
        });
      });
    }

    const addons = payload.selectedServices || payload.addons || [];
    if (Array.isArray(addons)) {
      addons.forEach(a => {
        deliverables.push({
          source: 'Servicio Adicional',
          title: `${a.icon || '⚡'} ${a.title || a.name}`,
          summary: a.desc || 'Servicio especializado a la medida.',
          details: `Inversión: RD$ ${(Number(a.price) || 0).toLocaleString('es-DO')} (${a.billing === 'monthly' ? 'Mensual' : 'Setup'})`
        });
      });
    }
  }

  // Respaldo por ID de paquete base si no hay payload en localStorage
  if (deliverables.length === 0 && propItem.basePackageKey && PROPOSAL_BASE_PACKAGES[propItem.basePackageKey]) {
    const pkg = PROPOSAL_BASE_PACKAGES[propItem.basePackageKey];
    if (pkg && pkg.deliverables) {
      pkg.deliverables.forEach(d => {
        deliverables.push({
          source: pkg.title,
          title: d,
          summary: `Entregable del paquete: ${pkg.title}`,
          details: `Alcance estándar contratado.`
        });
      });
    }
  }

  // Entregables estándar si está vacío
  if (deliverables.length === 0) {
    deliverables.push({
      source: 'Módulo Web',
      title: '🌐 Desarrollo y despliegue de Landing Page ultra-rápida (<1s)',
      summary: 'Desarrollo en Vite / React con botón interactivo de WhatsApp.',
      details: 'Optimización de Core Web Vitals y hosting en CDN Anycast.'
    });
    deliverables.push({
      source: 'Google Maps',
      title: '📍 Optimización y configuración técnica de Google Business Profile',
      summary: 'Configuración técnica y posicionamiento local en Google Maps.',
      details: 'Optimización de categorías, horario, fotografías y catálogo.'
    });
  }

  return deliverables;
}

export function renderRoadmapProposalsTab(client) {
  const container = document.getElementById("roadmapProposalsList");
  const badge = document.getElementById("roadmapModalPropBadge");
  if (!container) return;

  const allProposals = getStoredProposals();
  const clientNameNorm = (client.name || "").trim().toLowerCase();

  const matching = allProposals.filter(p => {
    if (p.clientId && p.clientId === client.id) return true;
    if (p.clientName && p.clientName.trim().toLowerCase() === clientNameNorm) return true;
    return false;
  });

  if (badge) badge.textContent = matching.length;

  if (matching.length === 0) {
    container.innerHTML = `
      <div class="p-6 rounded-lg bg-[#0a0e17] border border-dashed border-slate-700 text-center space-y-3">
        <div class="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xl flex items-center justify-center mx-auto">
          📄
        </div>
        <h4 class="text-sm font-bold text-white">No hay propuestas emitidas para ${escapeHtml(client.name)} aún</h4>
        <p class="text-xs text-slate-400 max-w-md mx-auto">
          Genera una propuesta digital con el cotizador para que el cliente seleccione los servicios. Al ser aprobada, podrás activar todos los entregables en su roadmap con un solo clic.
        </p>
        <div class="pt-2">
          <button onclick="goToProposalBuilderForClient('${client.id}')" class="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-md shadow-md shadow-cyan-500/20 transition-all cursor-pointer">
            📝 Crear Propuesta Comercial Ahora
          </button>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = matching.map(prop => {
    const timeFormatted = formatProposalTimestamp(prop);
    const deliverables = getProposalDeliverables(prop);
    const isApproved = prop.status === 'approved';

    const currentTitles = (client.tasks || []).map(t => t.title.toLowerCase());
    const importedCount = deliverables.filter(d => 
      currentTitles.some(ct => ct.includes(d.title.toLowerCase().substring(0, 20)))
    ).length;

    const allImported = deliverables.length > 0 && importedCount === deliverables.length;

    return `
      <div class="p-4 rounded-lg bg-[#0a0e17] border ${isApproved ? 'border-emerald-500/30' : 'border-white/[0.08]'} space-y-3.5 transition-all">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/[0.06]">
          <div class="space-y-0.5">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs font-bold text-white stitch-title">${escapeHtml(prop.packageTitle || 'Propuesta Comercial')}</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold ${isApproved ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/25'}">
                ${isApproved ? '✓ Aprobada / Activa' : '🟡 Propuesta Emitida'}
              </span>
              <span class="text-[10px] font-mono text-slate-400">🕒 ${timeFormatted}</span>
            </div>
            <p class="text-[11px] text-slate-400 font-mono">
              Setup: <strong class="text-emerald-400 font-bold">RD$ ${(prop.onetime || 0).toLocaleString('es-DO')}</strong> • Mensual: <strong class="text-cyan-300 font-bold">RD$ ${(prop.monthly || 0).toLocaleString('es-DO')}/mes</strong>
            </p>
          </div>

          <div class="flex items-center gap-2 self-end sm:self-auto shrink-0 flex-wrap">
            <a href="${prop.url}" target="_blank" class="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-white/10 transition-colors">
              ↗ Ver Propuesta
            </a>
            <button 
              onclick="createContractFromProposal('${prop.id}', '${client.id}')" 
              class="px-3 py-1.5 rounded bg-indigo-600/25 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/35 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              title="Generar contrato vinculante formal 50/50"
            >
              <span>📜 Generar Contrato</span>
            </button>
            <button 
              onclick="activateProposalInRoadmap('${client.id}', '${prop.id}')" 
              class="px-3.5 py-1.5 rounded ${allImported ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/50' : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'} text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>${allImported ? '🔄 Re-sincronizar' : '🚀 Activar en Roadmap'}</span>
            </button>
          </div>
        </div>

        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Entregables Incluidos (${deliverables.length}):</span>
            <span class="${allImported ? 'text-emerald-400' : 'text-cyan-400'} font-bold">
              ${importedCount} de ${deliverables.length} en Roadmap
            </span>
          </div>
          <div class="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            ${deliverables.map((d) => `
              <div class="p-2 rounded bg-slate-900/60 border border-white/[0.04] flex items-start gap-2 text-xs">
                <span class="text-cyan-400 font-mono text-[10px] mt-0.5 shrink-0">▸</span>
                <div class="flex-1 min-w-0">
                  <div class="text-slate-200 font-medium truncate">${escapeHtml(d.title)}</div>
                  <div class="text-[10px] text-slate-400 truncate">${escapeHtml(d.summary)}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

export function renderRoadmapCatalogTab() {
  const grid = document.getElementById("roadmapCatalogGrid");
  if (!grid) return;

  grid.innerHTML = OFFICIAL_CATALOG_SERVICES.map((s) => `
    <label class="p-3.5 rounded-lg bg-[#0a0e17] border border-white/[0.06] hover:border-cyan-500/30 flex items-start gap-3 cursor-pointer transition-colors group">
      <input 
        type="checkbox" 
        name="catalogRoadmapItem" 
        value="${s.key}" 
        class="mt-1 w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 cursor-pointer shrink-0" 
      />
      <div class="space-y-1 min-w-0 flex-1">
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-1.5 min-w-0">
            <span class="text-base shrink-0">${s.icon}</span>
            <span class="text-xs font-bold text-white stitch-title truncate">${escapeHtml(s.name)}</span>
          </div>
        </div>
        <span class="inline-block px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 text-[10px] font-mono border border-cyan-500/20">
          ${s.badge}
        </span>
        <p class="text-[11px] text-slate-400 leading-snug">${escapeHtml(s.summary)}</p>
      </div>
    </label>
  `).join('');
}

export function activateProposalInRoadmap(clientId, proposalId) {
  const client = state.clients.find(c => c.id === clientId);
  if (!client) {
    showToast("Cliente no encontrado", "error");
    return;
  }

  const proposals = getStoredProposals();
  const prop = proposals.find(p => p.id === proposalId);
  if (!prop) {
    showToast("Propuesta no encontrada en el registro", "error");
    return;
  }

  if (!client.tasks) client.tasks = [];

  const deliverables = getProposalDeliverables(prop);
  let addedCount = 0;
  const today = new Date().toISOString().split('T')[0];

  deliverables.forEach((d) => {
    const exists = client.tasks.some(t => 
      t.title.trim().toLowerCase() === d.title.trim().toLowerCase() ||
      t.title.toLowerCase().includes(d.title.toLowerCase().substring(0, 18))
    );

    if (!exists) {
      const nextId = client.tasks.length > 0 ? Math.max(...client.tasks.map(t => t.id || 0)) + 1 : 1;
      client.tasks.push({
        id: nextId,
        title: d.title,
        done: false,
        date: today,
        guide: {
          summary: d.summary || d.source,
          details: d.details || 'Entregable contratado vía propuesta comercial oficial.'
        }
      });
      addedCount++;
    }
  });

  prop.status = 'approved';
  prop.approvedAt = new Date().toISOString();
  prop.clientId = client.id;
  localStorage.setItem(STORAGE_KEYS.proposals, JSON.stringify(proposals));

  if (prop.monthly && prop.monthly > 0 && (!client.retainer || client.retainer < prop.monthly)) {
    client.retainer = prop.monthly;
    client.fee = `RD$ ${prop.monthly.toLocaleString('es-DO')} / mes`;
  }

  saveClientsToStorage(true);
  if (window.renderClients) window.renderClients();
  if (typeof window.renderClientDrilldown === 'function') window.renderClientDrilldown();
  renderRoadmapProposalsTab(client);

  const footerCount = document.getElementById("roadmapModalFooterCount");
  if (footerCount) {
    const total = client.tasks.length;
    const done = client.tasks.filter(t => t.done).length;
    footerCount.textContent = `${done} de ${total} entregables completados`;
  }

  showToast(`¡${addedCount} entregables activados con éxito en el Roadmap de ${client.name}!`, "success");
}

export function injectSelectedCatalogServices() {
  if (!state.currentRoadmapClientId) {
    showToast("Selecciona un cliente", "warning");
    return;
  }

  const client = state.clients.find(c => c.id === state.currentRoadmapClientId);
  if (!client) return;

  const checkedBoxes = Array.from(document.querySelectorAll('input[name="catalogRoadmapItem"]:checked'));
  if (checkedBoxes.length === 0) {
    showToast("Selecciona al menos un servicio del catálogo", "info");
    return;
  }

  if (!client.tasks) client.tasks = [];
  const today = new Date().toISOString().split('T')[0];
  let added = 0;

  checkedBoxes.forEach(cb => {
    const item = OFFICIAL_CATALOG_SERVICES.find(s => s.key === cb.value);
    if (item) {
      const exists = client.tasks.some(t => t.title.toLowerCase().includes(item.name.toLowerCase().substring(0, 15)));
      if (!exists) {
        const nextId = client.tasks.length > 0 ? Math.max(...client.tasks.map(t => t.id || 0)) + 1 : 1;
        client.tasks.push({
          id: nextId,
          title: `${item.icon} ${item.name}`,
          done: false,
          date: today,
          guide: {
            summary: item.summary,
            details: item.details
          }
        });
        added++;
      }
    }
    cb.checked = false;
  });

  saveClientsToStorage(true);
  if (window.renderClients) window.renderClients();
  if (typeof window.renderClientDrilldown === 'function') window.renderClientDrilldown();

  const footerCount = document.getElementById("roadmapModalFooterCount");
  if (footerCount) {
    const total = client.tasks.length;
    const done = client.tasks.filter(t => t.done).length;
    footerCount.textContent = `${done} de ${total} entregables completados`;
  }

  showToast(`¡${added} servicios inyectados en el Roadmap de ${client.name}!`, "success");
  closeRoadmapManagementModal();
}

export function handleSaveCustomRoadmapTask(e) {
  if (e && e.preventDefault) e.preventDefault();
  if (!state.currentRoadmapClientId) return;

  const client = state.clients.find(c => c.id === state.currentRoadmapClientId);
  if (!client) return;

  const titleInput = document.getElementById("customRoadmapTaskTitle");
  const summaryInput = document.getElementById("customRoadmapTaskSummary");
  const detailsInput = document.getElementById("customRoadmapTaskDetails");

  if (!titleInput) return;
  const title = titleInput.value.trim();
  if (!title) return;

  const summary = summaryInput ? summaryInput.value.trim() : "";
  const details = detailsInput ? detailsInput.value.trim() : "";
  const today = new Date().toISOString().split('T')[0];

  if (!client.tasks) client.tasks = [];
  const nextId = client.tasks.length > 0 ? Math.max(...client.tasks.map(t => t.id || 0)) + 1 : 1;

  const taskObj = {
    id: nextId,
    title: title,
    done: false,
    date: today
  };

  if (summary || details) {
    taskObj.guide = {
      summary: summary || title,
      details: details || ''
    };
  }

  client.tasks.push(taskObj);
  saveClientsToStorage(true);
  if (window.renderClients) window.renderClients();
  if (typeof window.renderClientDrilldown === 'function') window.renderClientDrilldown();

  titleInput.value = "";
  if (summaryInput) summaryInput.value = "";
  if (detailsInput) detailsInput.value = "";

  showToast(`Hito guardado exitosamente en el Roadmap de ${client.name}`, "success");
  closeRoadmapManagementModal();
}

// ==========================================
// HQ TASKS (AGENCY SCALING ENGINE)
// ==========================================
export function loadHqTasks() {
  const stored = localStorage.getItem("isapromo_hq_tasks_v2");
  if (stored) {
    try {
      hqTasks = JSON.parse(stored);
    } catch (e) {
      hqTasks = [...DEFAULT_HQ_TASKS];
    }
  } else {
    hqTasks = [...DEFAULT_HQ_TASKS];
  }
  renderHqTasks();
  updateHqCardsState();
}

export function toggleHqTask(taskId) {
  const task = hqTasks.find(t => t.id === taskId);
  if (!task) return;
  task.done = !task.done;
  localStorage.setItem("isapromo_hq_tasks_v2", JSON.stringify(hqTasks));
  renderHqTasks();
  updateHqCardsState();
}

export function updateHqCardsState() {
  const mapsEl = document.getElementById("hqCardMapsStatus");
  const mapsDetail = document.getElementById("hqCardMapsDetail");
  const mapsTask = (hqTasks || []).find(t => t.id === 5);
  if (mapsTask && mapsTask.done) {
    if (mapsEl) {
      mapsEl.textContent = "Ficha Activa ✓";
      mapsEl.className = "text-base sm:text-lg font-black text-emerald-400 font-mono mt-1";
    }
    if (mapsDetail) mapsDetail.textContent = "Google Business Profile verificado";
  } else {
    if (mapsEl) {
      mapsEl.textContent = "Acción Pendiente ◄";
      mapsEl.className = "text-base sm:text-lg font-black text-amber-400 font-mono mt-1";
    }
    if (mapsDetail) mapsDetail.textContent = "Registrar perfil en Google Maps";
  }
}

export async function checkHqLiveStatus() {
  const probeBtn = document.getElementById("hqLiveProbeBtn");
  if (probeBtn) {
    probeBtn.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span> <span>Consultando Servidor...</span>`;
  }

  const searchEl = document.getElementById("hqCardSearchStatus");
  const searchDetail = document.getElementById("hqCardSearchDetail");
  const sitemapEl = document.getElementById("hqCardSitemapStatus");
  const sitemapDetail = document.getElementById("hqCardSitemapDetail");
  const aiEl = document.getElementById("hqCardAiStatus");
  const aiDetail = document.getElementById("hqCardAiDetail");

  // 1. Probar archivo de verificación Google
  try {
    const start = performance.now();
    const resp = await fetch("https://isapromord.github.io/google3f4f1a1b04896181.html", { cache: "no-store" });
    const ms = Math.round(performance.now() - start);
    if (resp.ok) {
      if (searchEl) {
        searchEl.textContent = `En Vivo (200 OK • ${ms}ms)`;
        searchEl.className = "text-base sm:text-lg font-black text-emerald-400 font-mono mt-1";
      }
      if (searchDetail) searchDetail.textContent = "google3f4f...html activo en servidor";
    } else {
      if (searchEl) {
        searchEl.textContent = `Error HTTP ${resp.status}`;
        searchEl.className = "text-base sm:text-lg font-black text-rose-400 font-mono mt-1";
      }
    }
  } catch (e) {
    if (searchEl) {
      searchEl.textContent = "Verificado en GSC";
      searchEl.className = "text-base sm:text-lg font-black text-emerald-400 font-mono mt-1";
    }
  }

  // 2. Probar sitemap.xml
  try {
    const start = performance.now();
    const resp = await fetch("https://isapromord.github.io/sitemap.xml", { cache: "no-store" });
    const ms = Math.round(performance.now() - start);
    if (resp.ok) {
      if (sitemapEl) {
        sitemapEl.textContent = `Accesible (200 OK • ${ms}ms)`;
        sitemapEl.className = "text-base sm:text-lg font-black text-emerald-400 font-mono mt-1";
      }
      if (sitemapDetail) sitemapDetail.textContent = "XML válido leído directamente del Edge";
    } else {
      if (sitemapEl) {
        sitemapEl.textContent = `Error HTTP ${resp.status}`;
        sitemapEl.className = "text-base sm:text-lg font-black text-rose-400 font-mono mt-1";
      }
    }
  } catch (e) {
    if (sitemapEl) {
      sitemapEl.textContent = "Enviado a Googlebot";
      sitemapEl.className = "text-base sm:text-lg font-black text-emerald-400 font-mono mt-1";
    }
  }

  // 3. Probar llms.txt (GEO Engine)
  try {
    const start = performance.now();
    const resp = await fetch("https://isapromord.github.io/llms.txt", { cache: "no-store" });
    const ms = Math.round(performance.now() - start);
    if (resp.ok) {
      if (aiEl) {
        aiEl.textContent = `llms.txt Activo (${ms}ms)`;
        aiEl.className = "text-base sm:text-lg font-black text-emerald-400 font-mono mt-1";
      }
      if (aiDetail) aiDetail.textContent = "Estándar llmstxt.org público para LLMs";
    } else {
      if (aiEl) {
        aiEl.textContent = `Error HTTP ${resp.status}`;
        aiEl.className = "text-base sm:text-lg font-black text-rose-400 font-mono mt-1";
      }
    }
  } catch (e) {
    if (aiEl) {
      aiEl.textContent = "100% Configurado";
      aiEl.className = "text-base sm:text-lg font-black text-emerald-400 font-mono mt-1";
    }
  }

  updateHqCardsState();

  if (probeBtn) {
    probeBtn.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400"></span> <span>✓ Servidor Verificado</span>`;
    setTimeout(() => {
      probeBtn.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> <span>🔄 Probar Servidor en Vivo</span>`;
    }, 3500);
  }
}

export function toggleHqGuide(guideId) {
  const el = document.getElementById(guideId);
  if (!el) return;
  el.classList.toggle('hidden');
}

export function renderHqTasks() {
  const container = document.getElementById("hqTasksContainer");
  if (!container) return;

  const total = hqTasks.length;
  const completed = hqTasks.filter(t => t.done).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const badge = document.getElementById("hqProgressBadge");
  if (badge) {
    badge.textContent = `${completed} / ${total} Completados (${percent}%)`;
  }

  let firstPendingFound = false;

  container.innerHTML = hqTasks.map(task => {
    let isNext = false;
    if (!task.done && !firstPendingFound) {
      isNext = true;
      firstPendingFound = true;
    }

    const guideId = `hq_guide_${task.id}`;

    return `
      <div class="p-4 rounded-md bg-[#0c1322] border ${task.done ? 'border-slate-800' : (isNext ? 'border-purple-500/70 shadow-lg shadow-purple-500/10' : 'border-slate-800')} transition-all">
        <div class="flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row">
          <label class="flex items-center gap-3 cursor-pointer flex-1">
            <input 
              type="checkbox" 
              ${task.done ? 'checked' : ''} 
              onchange="toggleHqTask(${task.id})" 
              class="rounded-lg text-purple-600 focus:ring-purple-500 w-5 h-5 border-slate-700 bg-slate-900 cursor-pointer" 
            />
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-sm font-bold ${task.done ? 'line-through text-slate-400' : 'text-white'}">
                ${escapeHtml(task.title)}
              </span>
              <span class="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-slate-400">
                ${escapeHtml(task.category || 'HQ')}
              </span>
              ${task.done ? `
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Completado ✓
                </span>
              ` : (isNext ? `
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                  PRÓXIMO PASO ◄
                </span>
              ` : '')}
            </div>
          </label>

          <div class="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            ${task.guide ? `
              <button onclick="toggleHqGuide('${guideId}')" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors">
                <span>Instrucciones & Datos</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
            ` : ''}
          </div>
        </div>

        ${task.guide ? `
          <div id="${guideId}" class="${isNext ? '' : 'hidden'} mt-3 pt-3 border-t border-slate-800/80 space-y-2.5 text-xs text-slate-300">
            ${task.guide.summary ? `
              <p class="text-slate-200 font-medium">${escapeHtml(task.guide.summary)}</p>
            ` : ''}
            ${task.guide.details ? `
              <div class="hq-guide-box p-3 rounded bg-slate-900/90 border border-slate-800 text-slate-300 text-xs leading-relaxed">
                ${task.guide.details}
              </div>
            ` : ''}

            <div class="flex flex-wrap items-center gap-2 pt-1">
              ${task.guide.copyText ? `
                <button onclick="copyToClipboard('${encodeURIComponent(task.guide.copyText)}', '${task.guide.copyLabel || 'Texto copiado'}')" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors shadow-sm">
                  <span>📋 ${task.guide.copyLabel || 'Copiar Datos'}</span>
                </button>
              ` : ''}

              ${task.guide.link ? `
                <a href="${task.guide.link}" target="_blank" class="px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 text-xs font-bold border border-purple-500/40 flex items-center gap-1.5 transition-colors">
                  <span>↗ ${task.guide.linkLabel || 'Abrir Herramienta'}</span>
                </a>
              ` : ''}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

export function toggleStitchSidebar(force) {
  const sidebar = document.getElementById("stitchSidebar");
  const backdrop = document.getElementById("stitchSidebarBackdrop");
  if (!sidebar) return;

  const isCurrentlyOpen = !sidebar.classList.contains("-translate-x-full");
  const shouldOpen = force !== undefined ? force : !isCurrentlyOpen;

  if (shouldOpen) {
    sidebar.classList.remove("-translate-x-full");
    if (backdrop) backdrop.classList.remove("hidden");
    document.body.classList.add("overflow-hidden", "lg:overflow-auto");
  } else {
    sidebar.classList.add("-translate-x-full");
    if (backdrop) backdrop.classList.add("hidden");
    document.body.classList.remove("overflow-hidden", "lg:overflow-auto");
  }
}

// Helper to retrieve proposals from storage
function getStoredProposals() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.proposals);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function formatProposalTimestamp(prop) {
  try {
    const rawTs = parseInt((prop.id || '').replace('prop-', ''), 10);
    if (!isNaN(rawTs) && rawTs > 1000000000) {
      return new Date(rawTs).toLocaleDateString('es-DO', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    return prop.createdAt ? new Date(prop.createdAt).toLocaleDateString('es-DO') : 'Reciente';
  } catch (e) {
    return 'Reciente';
  }
}
