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
  DELETED_CLIENT_IDS: "isapromo_deleted_client_ids_v1",
  MASTER_CATALOG: "isapromo_master_catalog_v1",
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

export const SERVICE_PILLARS = [
  { id: "web_conversion", key: "web", name: "Landing Page Transaccional (<1s)", maxScore: 15, icon: "⚡" },
  { id: "google_maps_gbp", key: "maps", name: "Google Maps GBP & SEO Local", maxScore: 15, icon: "📍" },
  { id: "whatsapp_social_cards", key: "whatsapp", name: "Tarjetas WhatsApp & OpenGraph 1200x630", maxScore: 15, icon: "📲" },
  { id: "geo_ai_schemas", key: "geo", name: "Protocolo GEO para IA (llms.txt + FAQPage)", maxScore: 15, icon: "🤖" },
  { id: "ai_whatsapp_agent", key: "ai", name: "Agente IA WhatsApp 24/7 & Conversión", maxScore: 15, icon: "💬" },
  { id: "onpage_seo_console", key: "seo", name: "SEO On-Page & Google Search Console", maxScore: 15, icon: "🔍" },
  { id: "cloud_maintenance", key: "cloud", name: "Cloud Hosting Anycast, SSL & Soporte", maxScore: 10, icon: "🛡️" }
];

export const INITIAL_CLIENTS = [
  {
    id: "agency-isapromord",
    name: "ISAPromoRD (Nuestra Agencia / Casa Matriz)",
    category: "Agencia Digital & Ecosistemas Web",
    contactPerson: "Howard Luna / Isaías Santana",
    phone: "+1 (829) 455-4783",
    email: "isapromord@gmail.com",
    liveUrl: "https://isapromord.com/",
    repoUrl: "https://github.com/isapromord/isapromord.com",
    platform: "Cloud Anycast Edge (React 18 + Tailwind)",
    status: "active",
    isAgency: true,
    healthScore: 78,
    contractedServices: ["web_conversion", "google_maps_gbp", "whatsapp_social_cards", "geo_ai_schemas", "ai_whatsapp_agent", "onpage_seo_console", "cloud_maintenance"],
    fee: "RD$ 0 / mes (Casa Matriz)",
    renewalDate: "2027-12-31",
    joinedDate: "2026-09-01",
    notes: "Plataforma oficial y casa matriz de ISAPromoRD. Sitio web transaccional con arquitectura Cloud Anycast Edge, datos estructurados Schema.org, metadatos OpenGraph y suite satélite para IA.",
    optimizationMatrix: {
      seo: "95%",
      whatsapp: "65%",
      geo: "90%",
      ai: "50%"
    },
    tasks: [
      {
        id: 1,
        title: "Compilación nativa de Tailwind CSS (Reemplazar CDN por build minificado para PageSpeed 100/100)",
        done: false,
        date: "2026-10-16",
        guide: {
          summary: "Eliminar el bloqueo de renderizado en móviles provocado por cdn.tailwindcss.com (~350KB JIT) compilando un archivo CSS estático ultra-liviano.",
          details: "1. Ejecutar en terminal: npx tailwindcss -i ./src/input.css -o ./assets/styles.min.css --minify.\n2. En index.html, reemplazar la etiqueta <script src='https://cdn.tailwindcss.com...'> por <link rel='stylesheet' href='assets/styles.min.css'>.\n3. Purgar clases para reducir el tamaño del CSS final a <25 KB.\n4. Correr Google PageSpeed Insights Móvil y verificar que el Performance suba de ~85 a 98-100.",
          link: "https://tailwindcss.com/docs/installation",
          linkLabel: "Guía Oficial de Instalación de Tailwind CLI",
          copyText: "npx tailwindcss -i ./src/input.css -o ./assets/styles.min.css --minify",
          copyLabel: "Copiar Comando de Compilación"
        }
      },
      {
        id: 2,
        title: "Conexión de Agente IA WhatsApp 24/7 (Webhook n8n / Make + OpenAI API)",
        done: false,
        date: "2026-10-16",
        guide: {
          summary: "Convertir el enlace estático de WhatsApp en una línea automatizada activa las 24 horas que responda dudas y agende citas en Google Calendar.",
          details: "1. Conectar WhatsApp Business Cloud API (Meta for Developers) o Evolution API al número comercial oficial (+1 829 455 4783).\n2. Configurar un escenario en n8n con modelo OpenAI (GPT-4o mini) con el prompt del sistema, catálogo y políticas comerciales de ISAPromoRD.\n3. Añadir herramienta de agendamiento para registrar prospectos calificados directo en Google Calendar.\n4. Configurar escalado humano con alerta directa a Telegram/SMS si el cliente solicita asistencia manual.",
          link: "https://developers.facebook.com/docs/whatsapp/cloud-api",
          linkLabel: "Documentación Oficial WhatsApp Cloud API",
          copyText: "+1 (829) 455-4783",
          copyLabel: "Copiar Teléfono Oficial"
        }
      },
      {
        id: 3,
        title: "Verificación y Optimización de Google Business Profile (Local 3-Pack Dominicano)",
        done: false,
        date: "2026-10-16",
        guide: {
          summary: "Consolidar la ficha física oficial en Google Maps mediante verificación, fotos geolocalizadas del local y campaña activa de reseñas locales.",
          details: "1. Reclamar o verificar la propiedad de ISAPromoRD en Google Business Profile en Altos de Arroyo Hondo III, Santo Domingo.\n2. Establecer 'Diseño de sitios web' como categoría principal y 'Consultor de marketing' como secundaria.\n3. Subir 10+ fotografías en alta resolución del área de trabajo, logotipos 3D y credenciales del equipo.\n4. Enviar enlace corto de reseñas a los primeros clientes (Pasión Pecuaria, Torre Apex, Kendy Sastre, etc.) solicitando incluir palabras clave ('diseño de páginas web santo domingo', 'google maps rd').",
          link: "https://business.google.com",
          linkLabel: "Acceder a Google Business Profile"
        }
      },
      {
        id: 4,
        title: "Monitoreo y Calibración de Citación en Motores de IA (Perplexity, ChatGPT & Gemini)",
        done: false,
        date: "2026-10-16",
        guide: {
          summary: "Monitorear la frecuencia de citación de ISAPromoRD en respuestas generativas de IA y enriquecer periódicamente el archivo /llms.txt.",
          details: "1. Realizar pruebas mensuales con prompts en ChatGPT Search y Perplexity: '¿Cuáles son las mejores agencias de desarrollo web y Google Maps en Santo Domingo?'.\n2. Comprobar si los modelos extraen datos desde https://isapromord.com/llms.txt.\n3. Incorporar nuevos casos de éxito y respuestas a objeciones en el Schema FAQPage de index.html y en llms.txt.\n4. Validar periódicamente la sintaxis del grafo JSON-LD en Schema.org Validator.",
          link: "https://isapromord.com/llms.txt",
          linkLabel: "Ver archivo llms.txt en Vivo"
        }
      },
      {
        id: 5,
        title: "Despliegue de Protocolos Satélite: robots.txt, sitemap.xml y llms.txt",
        done: true,
        date: "2026-10-08",
        guide: {
          summary: "Arquitectura satélite canónica desplegada en la raíz del repositorio oficial con indexación abierta.",
          details: "Archivos robots.txt con directivas de indexación, sitemap.xml con metadatos de imágenes y llms.txt desplegados exitosamente.",
          link: "https://isapromord.com/sitemap.xml",
          linkLabel: "Ver sitemap.xml"
        }
      },
      {
        id: 6,
        title: "Inyección de Schemas JSON-LD (LocalBusiness, ProfessionalService, FAQPage) y Geo-Tags DO-01",
        done: true,
        date: "2026-09-28",
        guide: {
          summary: "Marcado semántico JSON-LD exhaustivo con georreferenciación dominicana y preguntas frecuentes estructuradas.",
          details: "Inyección en el head de index.html con coordenadas de Santo Domingo (18.4969, -69.9855) y entidad dual LocalBusiness + ProfessionalService.",
          copyText: "https://isapromord.com/",
          copyLabel: "Copiar URL Canónica"
        }
      },
      {
        id: 7,
        title: "Optimización de Metadatos OpenGraph (1200x630) para Compartir en WhatsApp",
        done: true,
        date: "2026-09-28",
        guide: {
          summary: "Tarjeta de previsualización de alta fidelidad configurada con URL absoluta para WhatsApp y redes sociales.",
          details: "Metatags og:title, og:description, og:image (1200x630) y Twitter Cards verificados con vista previa enriquecida activa.",
          link: "https://isapromord.github.io/assets/logo.png",
          linkLabel: "Ver Logo 1200x630"
        }
      },
      {
        id: 8,
        title: "Normalización Visual Grado Ingeniería (Anti-Bubble Geometry & Legibilidad Tipográfica)",
        done: true,
        date: "2026-10-15",
        guide: {
          summary: "Estandarización de geometría a rounded-xl (12px) y elevación de fuentes a >=14px en toda la landing page.",
          details: "Erradicación de esquinas hiper-redondeadas (rounded-3xl/2xl) y fuentes microscópicas (text-[10px]/[11px]) para una apariencia de software B2B de clase mundial.",
          link: "https://isapromord.com/",
          linkLabel: "Visitar Landing Page"
        }
      }
    ],
    uptimeStatus: "online",
    latencyMs: 120
  },
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
    contractedServices: ["web_conversion", "google_maps_gbp", "whatsapp_social_cards", "geo_ai_schemas", "onpage_seo_console", "cloud_maintenance"],
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
    contractedServices: ["web_conversion", "whatsapp_social_cards", "onpage_seo_console", "cloud_maintenance"],
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
    liveUrl: "https://isapromord.github.io/elements-jarabacoa/",
    repoUrl: "https://github.com/isapromord/elements-jarabacoa",
    platform: "Vercel / GitHub Pages (Eco-Luxury Landing)",
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
    repoUrl: "https://github.com/isapromord/trendystudio",
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
    liveUrl: "https://isapromord.github.io/wiseservicesrd/",
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
    liveUrl: "https://highlandbridges.netlify.app/",
    repoUrl: "https://github.com/isapromord/highland-bridge-co",
    platform: "Vite React + Base UI (Netlify)",
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
  },
  {
    id: "client-synkrd",
    name: "SynkRD",
    category: "E-Commerce SaaS & WhatsApp Bot",
    contactPerson: "Operaciones Synk",
    phone: "+1 (829) 455-4783",
    email: "info@synkrd.com",
    liveUrl: "https://synkrd.github.io/",
    repoUrl: "https://github.com/isapromord/synkrd",
    platform: "GitHub Pages (E-Commerce SaaS)",
    status: "active",
    healthScore: 100,
    fee: "RD$ 4,500 / mes",
    renewalDate: "2026-11-01",
    joinedDate: "2026-10-01",
    notes: "E-Commerce SaaS con IA, Tiendas de Alta Conversión y Bot WhatsApp en RD.",
    optimizationMatrix: {
      seo: "95%",
      whatsapp: "100%",
      geo: "90%",
      ai: "95%"
    },
    tasks: [],
    uptimeStatus: "online",
    latencyMs: 330
  },
  {
    id: "client-lacapra",
    name: "La Capra Cigars",
    category: "Tabaco & Catálogo Digital",
    contactPerson: "Dirección La Capra",
    phone: "+1 (829) 455-4783",
    email: "info@lacapra.do",
    liveUrl: "https://lacapra.vercel.app/",
    repoUrl: "https://github.com/isapromord/la-capra-cigars",
    platform: "Vercel Anycast (Landing & Catálogo Vitolas)",
    status: "active",
    healthScore: 100,
    fee: "RD$ 4,500 / mes",
    renewalDate: "2026-11-09",
    joinedDate: "2026-10-09",
    notes: "Humo Real Dominicano: landing page y catálogo digital de vitolas de autor de alta conversión.",
    optimizationMatrix: {
      seo: "95%",
      whatsapp: "100%",
      geo: "90%",
      ai: "90%"
    },
    tasks: [],
    uptimeStatus: "online",
    latencyMs: 310
  },
  {
    id: "client-kendysastre",
    name: "Kendy Sastre Atelier",
    category: "Sastrería & Alta Costura",
    contactPerson: "Kendy Sastre",
    phone: "+1 (829) 455-4783",
    email: "contacto@kendysastre.com",
    liveUrl: "https://kendysastre-atelier.netlify.app/",
    repoUrl: "https://github.com/isapromord/kendysastre",
    platform: "Netlify Anycast (Atelier Digital)",
    status: "active",
    healthScore: 100,
    fee: "RD$ 4,500 / mes",
    renewalDate: "2026-11-07",
    joinedDate: "2026-10-07",
    notes: "Atelier de sastrería a medida, trajes de novio y vestimenta formal en Santo Domingo.",
    optimizationMatrix: {
      seo: "90%",
      whatsapp: "100%",
      geo: "90%",
      ai: "85%"
    },
    tasks: [],
    uptimeStatus: "online",
    latencyMs: 320
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
  clientViewMode: typeof localStorage !== "undefined" ? (localStorage.getItem("isapromo_view_mode") || "compact") : "compact",
  viewMode: typeof localStorage !== "undefined" ? (localStorage.getItem("isapromo_view_mode") || "compact") : "compact",
  statusFilter: "all",
  searchQuery: "",
  expandedClientIds: new Set(),
  isCloudSyncing: false,
  isCloudOnline: true
};
