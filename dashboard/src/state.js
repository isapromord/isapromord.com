/**
 * ISAPROMORD OS — State & Configuration
 * Source of truth for constants, default data models, and reactive agency state.
 */

export const DEFAULT_PIN = "3690";

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
  theme: "isapromo_theme"
};

export const SUPABASE_CONFIG = {
  URL: "https://biomfntvqbhjmmmggxzj.supabase.co",
  ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpb21mbnR2cWJoam1tbWdneHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyNDk1NjYsImV4cCI6MjEwNjgyNTU2Nn0.YYmH4QtcPaoHo2Yo-2dEhkQK8u9qz4o-XCI4Cm9X4k8",
  TABLE_CLIENTS: "agency_clients",
  // Lowercase aliases
  url: "https://biomfntvqbhjmmmggxzj.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpb21mbnR2cWJoam1tbWdneHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyNDk1NjYsImV4cCI6MjEwNjgyNTU2Nn0.YYmH4QtcPaoHo2Yo-2dEhkQK8u9qz4o-XCI4Cm9X4k8",
  tableClients: "agency_clients"
};

export const DEFAULT_BANK_DETAILS = `🏦 *Datos Bancarios para Transferencia:*
• *Banco:* Banco Popular Dominicano
• *Tipo:* Cuenta de Ahorros en Pesos (RD$)
• *Cuenta No.:* 8294554783
• *Titular:* ISAPromoRD
• *RNC / Cédula:* Disponible a solicitud`;

export const INITIAL_CLIENTS = [
  {
    id: "client-pasion-pecuaria",
    name: "Pasión Pecuaria RD",
    category: "Agropecuaria & Tienda Online",
    contactPerson: "Dr. Veterinario / Dirección",
    phone: "+1 (829) 396-1318",
    email: "pasionpecuariard@gmail.com",
    liveUrl: "https://pasion-pecuaria-rd.vercel.app",
    repoUrl: "https://github.com/isapromord/pasion-pecuaria-rd",
    platform: "Vercel Anycast (React 18 + Vite)",
    status: "active",
    healthScore: 100,
    fee: "RD$ 4,000 / mes",
    renewalDate: "2026-10-28",
    joinedDate: "2026-09-28",
    notes: "Primer cliente insignia de ISAPromoRD. Plataforma web ultra-rápida (<0.8s) con catálogo de productos veterinarios, cursos para ganaderos, carrito de compras integrado y conversión directa por WhatsApp.",
    optimizationMatrix: {
      seo: "98%",
      whatsapp: "100%",
      geo: "95%",
      ai: "95%"
    },
    tasks: [
      {
        id: 1,
        title: "Lanzamiento y despliegue exitoso en producción (Vercel)",
        done: true,
        date: "2026-09-28",
        guide: {
          summary: "Infraestructura cloud en el Edge de Vercel con compilación optimizada en Vite.",
          details: "Despliegue activo con compresión gzip y carga instantánea.",
          link: "https://pasion-pecuaria-rd.vercel.app",
          linkLabel: "Abrir Tienda en Vivo",
          copyText: "https://pasion-pecuaria-rd.vercel.app",
          copyLabel: "Copiar Enlace"
        }
      },
      {
        id: 2,
        title: "Optimización integral SEO On-Page, OpenGraph WhatsApp (1200x630) y Geo Tags DO-01",
        done: true,
        date: "2026-09-28",
        guide: {
          summary: "Metadatos transaccionales completos para Google Search, Google Maps y WhatsApp.",
          details: "Inyección de Schema.org LocalBusiness y OpenGraph con vista previa verificada.",
          copyText: "https://pasion-pecuaria-rd.vercel.app",
          copyLabel: "Copiar URL"
        }
      },
      {
        id: 3,
        title: "Creación de archivos satélite: robots.txt, sitemap.xml y llms.txt para IA",
        done: true,
        date: "2026-09-29",
        guide: {
          summary: "Estructura de rastreo para Googlebot y modelos de Inteligencia Artificial (ChatGPT, Perplexity, Gemini).",
          details: "Archivo llms.txt desplegado permitiendo a los LLMs entender el catálogo completo.",
          link: "https://pasion-pecuaria-rd.vercel.app/llms.txt",
          linkLabel: "Ver llms.txt en Vivo"
        }
      },
      {
        id: 4,
        title: "Optimización técnica de ficha en Google Maps (Google Business Profile)",
        done: true,
        date: "2026-09-30",
        guide: {
          summary: "Aparición garantizada en el Google Local 3-Pack dominicano para términos veterinarios.",
          details: "Palabras clave estratégicas y enlace de reseñas con QR acrílico."
        }
      },
      {
        id: 5,
        title: "Sistema de Catálogo Interactivo con Pedido Express a WhatsApp",
        done: true,
        date: "2026-10-01",
        guide: {
          summary: "Embudo de venta directa sin fricción de pago con pasarelas lentas.",
          details: "El cliente selecciona productos y envía su pedido listo y calculado al WhatsApp oficial."
        }
      }
    ],
    uptimeStatus: "online",
    latencyMs: 380
  },
  {
    id: "client-torre-apex-esperilla",
    name: "Torre Apex La Esperilla",
    category: "Bienes Raíces & Inmobiliaria",
    contactPerson: "Desarrollador Inmobiliario",
    phone: "+1 (829) 455-4783",
    email: "ventas@torrelaesperilla.com",
    liveUrl: "https://torrelaesperilla.com/",
    repoUrl: "https://github.com/isapromord/torre-apex-esperilla",
    platform: "Vercel Anycast Edge",
    status: "active",
    healthScore: 100,
    fee: "RD$ 4,500 / mes",
    renewalDate: "2026-11-01",
    joinedDate: "2026-10-01",
    notes: "Landing page inmobiliaria de alta gama para la preventa de apartamentos de lujo en La Esperilla, Santo Domingo. Renders 3D optimizados, planos interactivos y captación de leads a WhatsApp.",
    optimizationMatrix: {
      seo: "95%",
      whatsapp: "100%",
      geo: "95%",
      ai: "90%"
    },
    tasks: [],
    uptimeStatus: "online",
    latencyMs: 320
  },
  {
    id: "client-elements-jarabacoa",
    name: "Elements Jarabacoa",
    category: "Apartamentos Eco-Luxury",
    contactPerson: "Howard Luna",
    phone: "+1 (829) 455-4783",
    email: "howard@alveare.do",
    liveUrl: "https://elementsjarabacoa.com.do/",
    repoUrl: "https://github.com/isapromord/elements-jarabacoa",
    platform: "Vercel Anycast (Eco-Luxury Landing)",
    status: "active",
    healthScore: 100,
    fee: "RD$ 4,500 / mes",
    renewalDate: "2026-11-04",
    joinedDate: "2026-10-04",
    notes: "Proyecto eco-luxury de apartamentos en Jamaca de Dios, Jarabacoa. Unidades de 1, 2 y 3 habitaciones de alta rentabilidad turística vía Airbnb, comercializado por Alveare Realty.",
    optimizationMatrix: {
      seo: "95%",
      whatsapp: "100%",
      geo: "90%",
      ai: "90%"
    },
    tasks: [],
    uptimeStatus: "online",
    latencyMs: 340
  },
  {
    id: "client-trendyrd",
    name: "TrendyRD",
    category: "Moda & Comercio Electrónico",
    contactPerson: "Gerencia Comercial",
    phone: "+1 (829) 455-4783",
    email: "contacto@trendyrd.com",
    liveUrl: "https://trendyrd.com",
    repoUrl: "https://github.com/isapromord/trendyrd",
    platform: "Cloud Anycast (E-Commerce)",
    status: "active",
    healthScore: 100,
    fee: "RD$ 4,500 / mes",
    renewalDate: "2026-11-02",
    joinedDate: "2026-10-02",
    notes: "Boutique digital de moda y calzado importado en Santo Domingo. Catálogo con filtrado rápido y pedidos directos por WhatsApp con cálculo automático de envío.",
    optimizationMatrix: {
      seo: "90%",
      whatsapp: "100%",
      geo: "85%",
      ai: "85%"
    },
    tasks: [],
    uptimeStatus: "online",
    latencyMs: 350
  },
  {
    id: "client-granjatracker",
    name: "Granja Tracker",
    category: "AgroTech & Gestión Avícola",
    contactPerson: "Operaciones Granja Tracker",
    phone: "+1 (829) 455-4783",
    email: "info@granjatracker.com",
    liveUrl: "https://granjatracker.com",
    repoUrl: "https://github.com/isapromord/granjatracker",
    platform: "Vite React + Supabase (Gestión Avícola con IA)",
    status: "active",
    healthScore: 100,
    fee: "RD$ 8,000 / mes",
    renewalDate: "2026-11-05",
    joinedDate: "2026-10-05",
    notes: "Software de gestión avícola bimodal con IA para productores de pollos y huevos en República Dominicana. Control de camadas, mortalidad, alimento y finanzas.",
    optimizationMatrix: {
      seo: "100%",
      whatsapp: "100%",
      geo: "95%",
      ai: "100%"
    },
    tasks: [],
    uptimeStatus: "online",
    latencyMs: 410
  },
  {
    id: "client-micondord",
    name: "MiCondoRD (Wise Services)",
    category: "PropTech & Administración Condominios",
    contactPerson: "Gerencia de Condominios",
    phone: "+1 (829) 455-4783",
    email: "contacto@wiseservicesrd.com",
    liveUrl: "https://wiseservicesrd.com",
    repoUrl: "https://github.com/isapromord/wiseservicesrd",
    platform: "Anycast Web (Wise Services RD)",
    status: "active",
    healthScore: 100,
    fee: "RD$ 4,500 / mes",
    renewalDate: "2026-11-03",
    joinedDate: "2026-10-03",
    notes: "Plataforma digital para administración de condominios, cobros de mantenimiento, reservas de áreas sociales y comunicación vecinal.",
    optimizationMatrix: {
      seo: "85%",
      whatsapp: "100%",
      geo: "80%",
      ai: "80%"
    },
    tasks: [],
    uptimeStatus: "online",
    latencyMs: 360
  },
  {
    id: "client-isatranslogic",
    name: "IsaTransLogic",
    category: "Logística & Transporte de Carga",
    contactPerson: "Despacho Operativo",
    phone: "+1 (829) 455-4783",
    email: "operaciones@isatranslogic.com",
    liveUrl: "https://isatranslogic.com",
    repoUrl: "https://github.com/isapromord/isatranslogic",
    platform: "Netlify / Anycast (Portal Logístico)",
    status: "active",
    healthScore: 100,
    fee: "RD$ 4,500 / mes",
    renewalDate: "2026-11-02",
    joinedDate: "2026-10-02",
    notes: "Portal corporativo de soluciones logísticas, transporte de carga terrestre y seguimiento de fletes en República Dominicana.",
    optimizationMatrix: {
      seo: "95%",
      whatsapp: "100%",
      geo: "90%",
      ai: "90%"
    },
    tasks: [],
    uptimeStatus: "online",
    latencyMs: 390
  },
  {
    id: "client-highlandbridge",
    name: "Highland Bridge Co.",
    category: "Comercio Internacional & Negocios",
    contactPerson: "Dirección Ejecutiva",
    phone: "+1 (829) 455-4783",
    email: "contact@highlandbridgeco.com",
    liveUrl: "https://highlandbridgeco.com",
    repoUrl: "https://github.com/isapromord/highland-bridge-co",
    platform: "Vite React + Base UI Anycast",
    status: "active",
    healthScore: 100,
    fee: "RD$ 4,500 / mes",
    renewalDate: "2026-11-04",
    joinedDate: "2026-10-04",
    notes: "Firma consultora de comercio internacional, estructuración de negocios bilaterales y representación de marcas transnacionales.",
    optimizationMatrix: {
      seo: "95%",
      whatsapp: "100%",
      geo: "90%",
      ai: "90%"
    },
    tasks: [],
    uptimeStatus: "online",
    latencyMs: 340
  }
];

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
    title: "Presencia & Captación Local (Web + Maps con Placa)",
    description: "Landing page transaccional ultra-rápida (<1s) y gestión activa de Google Maps (GBP) con Placa Inteligente NFC/QR para captar llamadas y reseñas continuas.",
    price: 30000,
    type: "onetime",
    monthlyPrice: 8000,
    deliverables: [
      "Diseño y desarrollo web transaccional mobile-first (<1s de carga en redes 4G RD).",
      "Setup completo de Google Business Profile + Placa Inteligente NFC/QR para mostrador.",
      "Gestión activa mensual: publicaciones semanales y respuesta a reseñas con SEO local.",
      "Mantenimiento web cloud Anycast, certificado SSL y hasta 3 cambios mensuales de contenido vía WhatsApp.",
      "Estructuración de datos Schema.org y reporte mensual de llamadas y clientes ganados."
    ],
    includedAddonIds: ["landing-page", "web-maintenance", "google-maps-pack", "google-maps-retainer"]
  },
  "pack-crm": {
    id: "pack-crm",
    title: "Crecimiento & Control Operativo (Web + Maps + CRM)",
    description: "Web transaccional, Google Maps con Placa Inteligente y tu propio CRM a la medida para gestionar ventas, clientes y pedidos sin pagar licencias por usuario.",
    price: 60000,
    type: "onetime",
    monthlyPrice: 15000,
    deliverables: [
      "Diseño y desarrollo web transaccional mobile-first (<1s de carga en redes 4G RD).",
      "Setup de Google Business Profile con Placa Inteligente NFC/QR para el negocio.",
      "Gestión activa mensual de Google Maps para canalizar tráfico local constante.",
      "CRM personalizado desarrollado a la medida de tu flujo de clientes, catálogo y ventas.",
      "Servidor cloud dedicado para el CRM, base de datos en tiempo real y copias de seguridad diarias.",
      "Capacitación de uso para tu equipo y soporte prioritario por WhatsApp."
    ],
    includedAddonIds: ["landing-page", "web-maintenance", "google-maps-pack", "google-maps-retainer", "crm-custom", "crm-monthly"]
  },
  "pack-ia": {
    id: "pack-ia",
    title: "Negocio Inteligente (Web + Maps + Agente IA 24/7)",
    description: "Web de alta conversión y Google Maps con Asistente de Inteligencia Artificial para ventas y citas 24/7 en WhatsApp y Web.",
    price: 48000,
    type: "onetime",
    monthlyPrice: 14000,
    deliverables: [
      "Todo el paquete de Presencia & Captación Local (Web + Maps + Placa NFC/QR).",
      "Agente de Inteligencia Artificial para Ventas y Citas 24/7 (WhatsApp o Web).",
      "Entrenamiento continuo de la IA con preguntas frecuentes, catálogo y políticas del negocio.",
      "Agendamiento automático de citas o reservas en el calendario del negocio.",
      "Servidor cloud para la IA, bolsa mensual de mensajes y calibración continua de respuestas."
    ],
    includedAddonIds: ["landing-page", "web-maintenance", "google-maps-pack", "google-maps-retainer", "ai-agent", "ai-agent-monthly"]
  },
  "pack-ecosistema": {
    id: "pack-ecosistema",
    title: "Ecosistema Digital Completo (Web + Maps + IA + CRM)",
    description: "Solución integral para empresas que buscan automatizar la captación, atención por IA y el control operativo con un CRM a la medida.",
    price: 80000,
    type: "onetime",
    monthlyPrice: 22000,
    deliverables: [
      "Solución 360° integral: Web de alta conversión + Google Maps activo con Placa Inteligente.",
      "Agente de Inteligencia Artificial 24/7 para atención y agendamiento automático.",
      "CRM personalizado a la medida de los procesos de la empresa sin costos por usuario.",
      "Infraestructura cloud dedicada, base de datos en tiempo real y copias de seguridad diarias.",
      "Mantenimiento web, soporte prioritario por WhatsApp y optimización continua."
    ],
    includedAddonIds: ["landing-page", "web-maintenance", "google-maps-pack", "google-maps-retainer", "ai-agent", "ai-agent-monthly", "crm-custom", "crm-monthly"]
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

export const INITIAL_ACCOUNTING_LEDGER = [
  {
    id: "tx-init-1",
    date: "2026-09-28",
    clientId: "client-pasion-pecuaria",
    clientName: "Pasión Pecuaria RD",
    concept: "Anticipo 50% Desarrollo Web Transaccional & Despliegue Vercel",
    type: "setup",
    amount: 20000,
    account: "Banco Popular Dominicano",
    reference: "BP-892147",
    notes: "Primer cliente insignia de ISAPromoRD"
  },
  {
    id: "tx-init-2",
    date: "2026-09-28",
    clientId: "client-pasion-pecuaria",
    clientName: "Pasión Pecuaria RD",
    concept: "Retainer Mensual — Mantenimiento Web & Hosting Anycast (Ciclo 1)",
    type: "retainer",
    amount: 4500,
    account: "Banco Popular Dominicano",
    reference: "BP-892150",
    notes: "Facturación inicial mensual de servicio"
  }
];

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
  viewMode: "compact", // 'compact' o 'expanded'
  statusFilter: "all",
  searchQuery: "",
  expandedClientIds: new Set(),
  isCloudSyncing: false,
  isCloudOnline: true
};
