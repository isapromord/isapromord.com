/**
 * ISAPROMORD OS — State & Configuration
 * Source of truth for constants, default data models, and reactive agency state.
 */

export const STORAGE_KEYS = {
  CLIENTS: "isapromo_agency_clients_v2",
  PIN: "isapromo_agency_pin_v1",
  AUTH: "isapromo_agency_session_auth",
  BANK: "isapromo_agency_bank_details_v1",
  PROPOSALS: "isapromo_agency_proposals_v1",
  CONTRACTS: "isapromord_contracts_v1",
  ACCOUNTING: "isapromo_agency_accounting_ledger_v1",
  AUDIT_HISTORY: "isapromo_audited_history_v1",
  VIEW_MODE: "isapromo_view_mode",
  THEME: "isapromo_theme",
  DELETED_CLIENT_IDS: "isapromo_deleted_client_ids_v1",
  DELETED_VAULT_IDS: "isapromo_deleted_vault_ids_v1",
  MASTER_CATALOG: "isapromo_master_catalog_v1",
  REFERRALS: "isapromo_agency_referral_partners_v1",
  HQ_TASKS: "isapromo_hq_tasks_v2",
  // Lowercase aliases for robust cross-module imports
  clients: "isapromo_agency_clients_v2",
  pin: "isapromo_agency_pin_v1",
  auth: "isapromo_agency_session_auth",
  bank: "isapromo_agency_bank_details_v1",
  proposals: "isapromo_agency_proposals_v1",
  contracts: "isapromord_contracts_v1",
  accounting: "isapromo_agency_accounting_ledger_v1",
  auditHistory: "isapromo_audited_history_v1",
  viewMode: "isapromo_view_mode",
  theme: "isapromo_theme",
  masterCatalog: "isapromo_master_catalog_v1"
};

export const SUPABASE_CONFIG = {
  URL: "https://gaorbufugmltlrssfgzc.supabase.co",
  ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdhb3JidWZ1Z21sdGxyc3NmZ3pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0NjI4NzIsImV4cCI6MjEwOTAzODg3Mn0.855iRr4G1QKem2_y16kujtnQSd5cWYm1vh3OHGer0XQ",
  TABLE_CLIENTS: "agency_clients",
  // Lowercase aliases
  url: "https://gaorbufugmltlrssfgzc.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdhb3JidWZ1Z21sdGxyc3NmZ3pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0NjI4NzIsImV4cCI6MjEwOTAzODg3Mn0.855iRr4G1QKem2_y16kujtnQSd5cWYm1vh3OHGer0XQ",
  tableClients: "agency_clients"
};

export const DEFAULT_BANK_DETAILS = `🏦 *Datos Bancarios para Transferencia:*
Solicítalos por WhatsApp y te los enviamos de inmediato.`;

export const SERVICE_PILLARS = [
  { id: "web_conversion", key: "web", name: "Landing Page Transaccional (<1s)", maxScore: 15, icon: "⚡" },
  { id: "google_maps_gbp", key: "maps", name: "Google Maps GBP & SEO Local", maxScore: 15, icon: "📍" },
  { id: "whatsapp_social_cards", key: "whatsapp", name: "Tarjetas WhatsApp & OpenGraph 1200x630", maxScore: 15, icon: "📲" },
  { id: "geo_ai_schemas", key: "geo", name: "Protocolo GEO para IA (llms.txt + FAQPage)", maxScore: 15, icon: "🤖" },
  { id: "ai_whatsapp_agent", key: "ai", name: "Agente IA WhatsApp 24/7 & Conversión", maxScore: 15, icon: "💬" },
  { id: "onpage_seo_console", key: "seo", name: "SEO On-Page & Google Search Console", maxScore: 15, icon: "🔍" },
  { id: "cloud_maintenance", key: "cloud", name: "Cloud Hosting Anycast, SSL & Soporte", maxScore: 10, icon: "🛡️" }
];

// Los clientes viven solo en Supabase (acceso de administrador); este archivo es público.
export const INITIAL_CLIENTS = [];

export const PROPOSAL_BASE_PACKAGES = {
  "pack-none": {
    id: "pack-none",
    title: "Solo A la Carta (Sin Paquete)",
    description: "Cotización simple basada exclusivamente en los servicios individuales requeridos.",
    price: 0,
    type: "onetime",
    monthlyPrice: 0,
    deliverables: []
  },
  "pack-esencial": {
    id: "pack-esencial",
    title: "Presencia & Captación Local (Web + Maps con Placa + Correos)",
    description: "Landing page transaccional ultra-rápida (<1s), gestión activa de Google Maps (GBP) con Placa Inteligente NFC/QR y Correos Corporativos oficiales incluidos de cortesía.",
    price: 30000,
    type: "onetime",
    monthlyPrice: 8000,
    deliverables: [
      "Diseño y desarrollo web transaccional mobile-first (<1s de carga en redes 4G RD).",
      "Setup completo de Google Business Profile + Placa Inteligente NFC/QR para mostrador.",
      "Configuración de Correos Corporativos (@tuempresa.com) con registros SPF/DKIM/DMARC (Cortesía incluida).",
      "Gestión activa mensual: publicaciones semanales y respuesta a reseñas con SEO local.",
      "Mantenimiento web cloud Anycast, certificado SSL y hasta 3 cambios mensuales de contenido vía WhatsApp.",
      "Estructuración de datos Schema.org y reporte mensual de llamadas y clientes ganados."
    ],
    includedAddonIds: ["landing-page", "web-maintenance", "google-maps-pack", "google-maps-retainer", "corp-emails"]
  },
  "pack-ia": {
    id: "pack-ia",
    title: "Negocio Inteligente (Web + Maps + Agente IA 24/7 + Correos)",
    description: "Web de alta conversión, Google Maps con Placa Inteligente, Correos Corporativos y Asistente de Inteligencia Artificial para ventas y citas 24/7 en WhatsApp y Web.",
    price: 48000,
    type: "onetime",
    monthlyPrice: 14000,
    deliverables: [
      "Todo el paquete de Presencia & Captación Local (Web + Maps + Placa NFC/QR + Correos Corporativos).",
      "Agente de Inteligencia Artificial para Ventas y Citas 24/7 (WhatsApp o Web).",
      "Entrenamiento continuo de la IA con preguntas frecuentes, catálogo y políticas del negocio.",
      "Agendamiento automático de citas o reservas en el calendario del negocio.",
      "Servidor cloud para la IA, bolsa mensual de mensajes y calibración continua de respuestas."
    ],
    includedAddonIds: ["landing-page", "web-maintenance", "google-maps-pack", "google-maps-retainer", "ai-agent", "ai-agent-monthly", "corp-emails"]
  },
  "pack-ecosistema": {
    id: "pack-ecosistema",
    title: "Ecosistema Digital 360° (Web + Maps + IA + CRM + Correos)",
    description: "Solución integral corporativa para empresas que buscan automatizar la captación, atención por IA y el control operativo con un CRM a la medida.",
    price: 75000,
    type: "onetime",
    monthlyPrice: 20000,
    deliverables: [
      "Solución 360° integral: Web de alta conversión + Google Maps activo con Placa Inteligente.",
      "Correos corporativos oficiales configurados para todo el equipo directivo.",
      "Agente de Inteligencia Artificial 24/7 para atención y agendamiento automático.",
      "CRM personalizado a la medida de los procesos de la empresa sin costos por usuario.",
      "Infraestructura cloud dedicada, base de datos en tiempo real y copias de seguridad diarias.",
      "Mantenimiento web, soporte prioritario por WhatsApp y optimización continua."
    ],
    includedAddonIds: ["landing-page", "web-maintenance", "google-maps-pack", "google-maps-retainer", "ai-agent", "ai-agent-monthly", "crm-custom", "crm-monthly", "corp-emails"]
  }
};

export const PROPOSAL_ADDONS = [
  {
    id: "landing-page",
    name: "🌐 Landing Page Transaccional de Alta Conversión (<1s)",
    description: "Desarrollo web ultra-rápido en React/Vite (<1s de carga), diseño mobile-first, catálogo interactivo, optimización SEO On-Page, Schemas JSON-LD y botón WhatsApp.",
    price: 25000,
    type: "onetime",
    checked: true
  },
  {
    id: "web-corporate",
    name: "🏛️ Web Corporativa Multi-Página (Hasta 5 Secciones)",
    description: "Estructura completa para empresas con múltiples líneas de servicio, arquitectura de páginas dedicadas, SEO local profundo y microdatos para Google y motores de IA.",
    price: 45000,
    type: "onetime",
    checked: false
  },
  {
    id: "web-maintenance",
    name: "🛡️ Mantenimiento Web, Hosting Anycast & Soporte WhatsApp",
    description: "Alojamiento Anycast de ultra-velocidad, certificado SSL, monitoreo 24/7, copias de seguridad continuas y bolsa mensual de hasta 3 solicitudes de cambios de contenido (textos, fotos, precios) vía WhatsApp.",
    price: 4000,
    type: "monthly",
    checked: false
  },
  {
    id: "google-maps-setup",
    name: "📍 Setup Profesional de Google Maps (GBP Digital)",
    description: "Reclamación, verificación, configuración técnica, categorías SEO, geolocalización de fotos, catálogo de servicios y enlace de captación rápida de reseñas.",
    price: 6500,
    type: "onetime",
    checked: false
  },
  {
    id: "google-maps-pack",
    name: "⭐ Setup Google Maps Comercial + Placa Inteligente (NFC + QR)",
    description: "Setup digital completo de Google Business Profile + Placa acrílica de mostrador personalizada con chip NFC (aproximar celular) y Código QR para conseguir reseñas al instante.",
    price: 8000,
    type: "onetime",
    checked: true
  },
  {
    id: "google-maps-plaque-extra",
    name: "🏷️ Placa Inteligente Adicional para Mostrador (NFC + QR)",
    description: "Placa física adicional configurada para sucursales, cajas secundarias o diferentes puntos de atención de tu empresa.",
    price: 2500,
    type: "onetime",
    checked: false
  },
  {
    id: "google-maps-retainer",
    name: "📈 Retainer Mensual Google Maps (Posicionamiento Local Continuo)",
    description: "Publicaciones semanales con fotos y ofertas en Google Maps, respuesta estratégica a todas las reseñas con palabras clave locales y reporte mensual de llamadas ganadas.",
    price: 5000,
    type: "monthly",
    checked: false
  },
  {
    id: "corp-emails",
    name: "📧 Correos Corporativos Profesionales (@tuempresa.com)",
    description: "Configuración técnica completa de registros DNS (SPF, DKIM, DMARC) con Titan Mail o Google Workspace para proyectar seriedad corporativa y evitar que tus cotizaciones caigan en spam.",
    price: 3500,
    type: "onetime",
    checked: false
  },
  {
    id: "ai-agent",
    name: "🤖 Agente de IA para Ventas & Citas 24/7 (WhatsApp / Web)",
    description: "Asistente con Inteligencia Artificial entrenado con tu catálogo, precios y políticas. Atiende en segundos por WhatsApp o Web, califica prospectos y agenda citas automáticamente.",
    price: 20000,
    type: "onetime",
    checked: false
  },
  {
    id: "ai-agent-monthly",
    name: "⚡ Mantenimiento Mensual IA (Tokens & Servidor Dedicado)",
    description: "Servidor cloud en tiempo real, calibración y actualización de respuestas de la IA y bolsa mensual de mensajes/tokens sin límites para tu negocio.",
    price: 7000,
    type: "monthly",
    checked: false
  },
  {
    id: "crm-custom",
    name: "💼 CRM Personalizado a la Medida del Negocio",
    description: "Sistema de gestión propio (Supabase/PostgreSQL) adaptado a tu flujo de clientes, cotizaciones y pedidos. Sin costo mensual de licencias por usuario.",
    price: 35000,
    type: "onetime",
    checked: true
  },
  {
    id: "crm-ncf",
    name: "🧾 Módulo CRM: Facturas & Cotizaciones PDF con NCF (B01)",
    description: "Generación de cotizaciones y facturas formales con logo corporativo, desglose de ITBIS (18%) y correlativo de comprobantes fiscales DGII.",
    price: 15000,
    type: "onetime",
    checked: false
  },
  {
    id: "crm-inventory",
    name: "📦 Módulo CRM: Control de Inventario & Alertas de Stock",
    description: "Control de entradas, salidas, alertas automáticas de bajo stock vía WhatsApp y valorización de inventario en tiempo real.",
    price: 15000,
    type: "onetime",
    checked: false
  },
  {
    id: "crm-monthly",
    name: "☁️ Servidor Cloud CRM, Base de Datos & Backups Diarios",
    description: "Infraestructura cloud dedicada para tu CRM, base de datos Postgres en tiempo real, respaldos automáticos diarios y soporte técnico directo.",
    price: 8000,
    type: "monthly",
    checked: false
  }
];

export const FACTORY_BASE_PACKAGES = JSON.parse(JSON.stringify(PROPOSAL_BASE_PACKAGES));
export const FACTORY_ADDONS = JSON.parse(JSON.stringify(PROPOSAL_ADDONS));

// state.js no importa sync.js directamente (sync.js depende de este archivo)
function syncVaultLater() {
  import('./sync.js').then(m => m.syncVaultToCloud()).catch(() => {});
}

export function loadMasterCatalog() {
  if (typeof localStorage === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MASTER_CATALOG);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data.packages) {
      Object.keys(data.packages).forEach(k => {
        if (PROPOSAL_BASE_PACKAGES[k]) {
          Object.assign(PROPOSAL_BASE_PACKAGES[k], data.packages[k]);
        }
      });
    }
    if (Array.isArray(data.addons)) {
      data.addons.forEach(savedAddon => {
        const found = PROPOSAL_ADDONS.find(a => a.id === savedAddon.id);
        if (found) {
          found.price = savedAddon.price !== undefined ? savedAddon.price : found.price;
          found.type = savedAddon.type || found.type;
          found.name = savedAddon.name || found.name;
          if (savedAddon.description !== undefined) found.description = savedAddon.description;
        }
      });
    }
  } catch (e) {
    console.warn("Error cargando Catálogo Maestro desde localStorage", e);
  }
}

// Carga inicial en caliente
loadMasterCatalog();

export function saveMasterCatalog(packagesData, addonsData) {
  if (typeof localStorage === "undefined") return;
  const payload = {
    packages: packagesData,
    addons: addonsData,
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEYS.MASTER_CATALOG, JSON.stringify(payload));
  syncVaultLater();
  if (packagesData) {
    Object.keys(packagesData).forEach(k => {
      if (PROPOSAL_BASE_PACKAGES[k]) {
        Object.assign(PROPOSAL_BASE_PACKAGES[k], packagesData[k]);
      }
    });
  }
  if (Array.isArray(addonsData)) {
    addonsData.forEach(item => {
      const found = PROPOSAL_ADDONS.find(a => a.id === item.id);
      if (found) {
        found.price = item.price !== undefined ? item.price : found.price;
        found.type = item.type || found.type;
        found.name = item.name || found.name;
        if (item.description !== undefined) found.description = item.description;
      }
    });
  }
}

export function resetMasterCatalog() {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.MASTER_CATALOG);
  syncVaultLater();
  Object.keys(FACTORY_BASE_PACKAGES).forEach(k => {
    if (PROPOSAL_BASE_PACKAGES[k]) {
      Object.assign(PROPOSAL_BASE_PACKAGES[k], FACTORY_BASE_PACKAGES[k]);
    }
  });
  FACTORY_ADDONS.forEach(item => {
    const found = PROPOSAL_ADDONS.find(a => a.id === item.id);
    if (found) {
      found.price = item.price;
      found.type = item.type;
      found.name = item.name;
      found.description = item.description;
    }
  });
}

// La contabilidad vive en la bóveda de Supabase (acceso de administrador).
export const INITIAL_ACCOUNTING_LEDGER = [];

// Estado reactivo compartido
export const state = {
  clients: [],
  currentDrilldownClientId: null,
  currentAuditClient: null,
  currentAuditUrl: "",
  currentAuditResults: null,
  accountingLedger: [],
  contracts: [],
  proposals: [],
  currentProposalAddons: JSON.parse(JSON.stringify(PROPOSAL_ADDONS)),
  activeTab: "clients",
  clientViewMode: typeof localStorage !== "undefined" ? (localStorage.getItem("isapromo_view_mode") || "compact") : "compact",
  viewMode: typeof localStorage !== "undefined" ? (localStorage.getItem("isapromo_view_mode") || "compact") : "compact",
  statusFilter: "all",
  searchQuery: "",
  expandedClientIds: new Set(),
  isCloudSyncing: false,
  isCloudOnline: true
};
