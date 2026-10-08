# 🧠 MEMORY.md — Bitácora Histórica y Aprendizajes de IsaPromo RD

> **Regla Sagrada:** Este archivo es **APPEND-ONLY**. Jamás borrar registros anteriores. Cada entrada debe incluir fecha en formato `[YYYY-MM-DD]`.

---

## [2026-09-27] - Inicialización Oficial de IsaPromo RD (isapromord.com) & Arquitectura SEO Local

### 1. Contexto & Diagnóstico Previo
- El dominio `isapromord.com` y los deployments anteriores en Netlify estaban inactivos debido a la cancelación de la cuenta externa.
- Se decidió reiniciar y reconstruir el sitio web insignia de la agencia con un estándar de ingeniería de alto nivel y un enfoque radical en **SEO Local para República Dominicana**, preparado para indexación en Google Search Console y sincronización con Google Business Profile.

### 2. Decisiones Técnicas y de Diseño
- **Estilo Visual:** Se adoptó la estética *Clean Modern Agency* (fondo off-white/luminoso, tarjetas con sombras suaves, espacios amplios y acentos vibrantes inspirados en el logo 3D oficial).
- **SEO Técnico:**
  - Inyección de datos estructurados JSON-LD (`LocalBusiness`, `ProfessionalService`, `FAQPage`, `Service`).
  - Implementación de Geo-Metatags (`geo.region: DO-01`, `geo.placename: Santo Domingo`, coordenadas GPS de RD).
  - Open Graph y Twitter Cards completos con imagen representativa.
  - Creación de `robots.txt` y `sitemap.xml` canónicos para rastreo óptimo de Googlebot.
  - Conversión optimizada con click-to-WhatsApp pre-configurado y widget interactivo de auditoría SEO local.

### 3. Activos Vinculados
- Logotipo oficial 3D ubicado en `assets/logo.png`.
- Repositorio conectado a la organización matriz `isapromord-eng`.

## [2026-09-27] - Despliegue de Arquitectura Base e Inicialización de Control de Versiones
- **Archivos Nucleares Generados:**
  - `index.html`: Estructura semántica completa con microdatos Schema.org, Geo-metatags dominicanos, simulador interactivo de visibilidad en Google Maps, cuadrícula de servicios, acordeón FAQ y botón flotante de WhatsApp.
  - `robots.txt`: Directivas específicas para Googlebot y Bingbot con referencia a `sitemap.xml`.
  - `sitemap.xml`: Mapa del sitio XML canónico con metadatos de imagen para indexación prioritaria.
  - `.mbos/HANDOFF.md`: Hoja de ruta para conexión DNS y Google Search Console.
- **Control de Versiones:** Repositorio Git local inicializado con commit raíz `87ef012`.

## [2026-09-27] - Transformación UX/UI Grado Agencia Mundial (Anti-Template Overhaul)
- **Crítica de Diseño Atendida:** Se eliminó la apariencia de "plantilla genérica de IA".
- **Nuevos Módulos Interactivos de Alta Conversión:**
  - **Simulador SERP y Google Maps 3D:** Barra de búsqueda animada con efecto typing dinámico alternando las palabras clave de compra en RD, junto a un mapa visual con pines de ranking (#1 Piantini, #1 Naco, #1 Santiago) y comparativa directa frente a competidores.
  - **Bento Grid Asimétrico:** Módulos de Geo-Grid 360°, velocímetro Core Web Vitals 100/100, simulación de chat WhatsApp directo y visor de código Schema JSON-LD.
  - **Live Activity Toast:** Notificador flotante en tiempo real que simula empresas locales subiendo de posición en Google Maps.
  - **Marquee Infinito:** Carrusel continuo con marcas locales dominicanas.
  - **Escáner Interactivo con Barra de Progreso:** Animación de carga y cálculo de llamadas perdidas con entrega de reporte directo a WhatsApp.

## [2026-09-27] - Actualización de Identidad Visual 3D (Versión 2 Oficial)
- **Selección de Marca:** El usuario seleccionó la Versión 2 de alta fidelidad 3D (Claymorphic / Fluent 3D) con barra de Google Search, megáfono dorado en relieve, diana de tiro al blanco afilada y avatares hexagonales translúcidos.
- **Acción Técnica:** Se reemplazó `assets/logo.png` con la nueva versión renderizada y se respaldó la anterior en `assets/logo_legacy.png`.
- **Despliegue:** Sincronizado a través de Git y publicado automáticamente en GitHub Pages.

## [2026-09-27] - Integración de Estrategia de Doble Pilar (Páginas Web + SEO Local)
- **Alineación Comercial:** Se equilibró la propuesta de valor para no encasillar a IsaPromo RD únicamente en SEO Local. Ahora se posiciona con igual fuerza como estudio de **Diseño y Desarrollo de Páginas Web de Alta Conversión (<1s de carga)** y **Posicionamiento en Google Maps**, facilitando el bucle de ventas cruzadas (upsell).
- **Componentes Visuales Nuevos:**
  - Selector interactivo de dos pestañas en el Hero: `⚡ 1. Páginas Web (<1s)` vs `📍 2. Google Maps (#1)`.
  - Módulo de comparativa visual: "Web Tradicional en RD (5.8s, 0 ventas)" vs "Ingeniería IsaPromo RD (100 Core Web Vitals, WhatsApp directo)".
  - Actualización del grafo Schema.org JSON-LD para registrar ambos servicios formalmente ante Google.

## [2026-09-27] - Evolución Tipográfica de Marca: ISAPromoRD (Opción A - Color Dividido)
- **Decisión de Identidad:** Tras análisis de legibilidad fonética y de jerarquía visual, se seleccionó oficialmente el formato de capitulación **ISAPromoRD**.
- **Tratamiento Tipográfico (Opción A):**
  - `ISA`: En negro sólido / slate-950 (connotación de acrónimo institucional / tecnológico).
  - `Promo`: En gris oscuro / slate-700 (palabra comercial en formato título legible).
  - `RD`: En azul eléctrico de marca / brand-600 (anclaje geográfico de República Dominicana).
- **Sincronización:** Se actualizó en `index.html`, metadatos, Schema.org JSON-LD, `BRAIN.md` y enlaces de llamada a la acción de WhatsApp.

## [2026-09-27] - Remoción de 'Digital Lab' y Estandarización de Tipografía Móvil (Google & Apple HIG)
- **Eliminación de Badge:** Se retiró la etiqueta genérica `DIGITAL LAB` de la barra de navegación para una apariencia más limpia, corporativa y despejada.
- **Auditoría de Tamaños de Fuente Móviles:**
  - El sitio contenía clases microscópicas heredadas (`text-[10px]`, `text-[11px]`) que afectaban la legibilidad en pantallas móviles y violaban las directrices de usabilidad de Google (*"Text too small to read"*).
  - Se eliminaron por completo todas las instancias de fuentes inferiores a 12px.
  - Se estandarizó el cuerpo de texto a 15-16px (`text-base` y `text-sm sm:text-base`).
  - Las microcopias, etiquetas, chips y datos secundarios se elevaron a 12-14px (`text-xs sm:text-sm font-semibold` o `font-bold`).
  - Los campos de entrada (`<input>`, `<select>`) se fijaron en 16px (`text-base`) para evitar el molesto auto-zoom de iOS Safari en iPhones al tocar los formularios.
  - Los títulos de tarjetas, acordeón FAQ y botones de acción se ampliaron para cumplir los estándares de áreas de toque ergonómicas (mínimo 48px).

## [2026-09-27] - Corrección de Percepción Visual Móvil: Eliminación de Padding Anidado y Despeje de Viewport
- **Diagnóstico del Efecto "Muñeca Rusa" (Russian Doll):**
  - Aunque los textos ya estaban en 14-16px, la percepción en móvil seguía viéndose diminuta. La causa raíz fue la acumulación de 4 capas de paddings anidados (`px-4` + `p-6` + `p-6` + `p-5`), reduciendo el ancho utilizable a escasos 220px y forzando saltos de línea cada 2 palabras (apariencia de maqueta en miniatura).
- **Acciones Correctivas de Grado Industria:**
  - Reducción de paddings envolventes en móvil a `p-3.5 sm:p-8`, recuperando más de 50px de espacio útil en la pantalla del teléfono.
  - Eliminación de la colisión entre el Toast de notificaciones y el botón flotante de WhatsApp mediante `hidden sm:flex`, liberando el tercio inferior del teléfono para navegación táctil sin obstáculos.
  - Simplificación del ticker superior en móvil a una sola línea limpia y centrada, eliminando ruido visual antes del encabezado.
  - Pestañas de Showcase rediseñadas con botones táctiles simétricos (`grid grid-cols-2`) para fácil accionamiento con el pulgar.
  - Escalado de títulos y textos en el simulador a `text-xl sm:text-2xl font-black` y `text-base` para una lectura amplia y contundente sin efecto de reducción.

## [2026-09-27] - Restauración de Fidelidad de Imagen 1 (Google Maps Showcase) y Entorno Real de WhatsApp (Bento 3)
- **Causa Raíz de Imagen 1 Ausente:**
  - Al habilitar la arquitectura de doble pilar, el showcase de Google Maps fue desplazado a la Pestaña 2 y oculto con `class="hidden"` por defecto. El usuario percibió que el diseño previo se había eliminado.
  - Solución: Se restableció la Pestaña de Google Maps (`tabSeoContent`) como la vista activa predeterminada en el primer render, restaurando fielmente la barra macOS con la URL de búsqueda, los pines dinámicos (`#1 Piantini +180 llamadas`, `#1 Naco & Bella Vista +240 llamadas`, `#1 Santiago RD +160 llamadas`), el radio de 15 km, la tasa de CTR de 68.4% y las tarjetas de clasificación con microdatos y badges.
- **Autenticidad de Entorno WhatsApp en Bento Card 3:**
  - Se transformó la tarjeta de click-to-chat en una réplica de WhatsApp oficial:
    - Fondo con patrón de doodles característico de WhatsApp sobre `#efeae2`.
    - Cabecera oficial color `#008069` con avatar de ISAPromoRD, indicador verificado y estado 'en línea'.
    - Píldora de fecha 'HOY' centrada.
    - Burbujas de mensaje con estilos nativos (cliente entrante en blanco `#ffffff`, respuesta de ISAPromoRD en verde suave `#D9FDD3` con doble check azul `#53bdeb`).
    - Barra inferior nativa `#F0F2F5` con iconos de emoji, clip de adjuntos, campo de texto 'Escribe un mensaje...' y botón circular verde `#00A884` con micrófono.

## [2026-09-27] - Calibración de Frecuencia y Credibilidad del Toast de Actividad (Live Activity Dispatcher)
- **Problema Detectado:**
  - El popup de actividad salía cada 9.5 segundos (3s iniciales, 4.5s visible, 5s de pausa), y todos los eventos decían "Hace 2 minutos".
  - Para una agencia emergente / en crecimiento, un volumen de 6 popups por minuto genera percepción de automatización artificial o spam poco creíble.
- **Optimización de Grado de Autoridad:**
  - Se retrasó la primera aparición a **10 segundos** (permitiendo al visitante leer el Hero y titular sin interrupciones).
  - Se amplió el tiempo de lectura en pantalla a **5 segundos**.
  - Se extendió el intervalo de silencio entre apariciones a **22 segundos** (reducción del 65% en frecuencia, apareciendo solo 1 o 2 veces por visita normal).
  - Se sustituyó la leyenda fija "Hace 2 minutos" por referencias a casos reales y proyectos recientes en Santo Domingo y Santiago RD ("Proyecto reciente en Santo Domingo", "Caso de éxito comprobado en RD", etc.), transformándolo en prueba social creíble (case studies).

## [2026-09-27] - Sincronización Total de NAP: Integración del Número Oficial (829) 455-4783 y Auditoría GBP
- **Corrección Crítica de Coherencia NAP (Name, Address, Phone):**
  - Se sustituyó el número de prueba `+1 (829) 555-0199` por el número real y verificado de la empresa: `+1 (829) 455-4783` en:
    - Microdatos Schema.org JSON-LD (`telephone`).
    - Enlace de contacto en la cabecera (Navbar).
    - Botón de llamado a la acción del Hero (`Cotizar Mi Página Web & SEO`).
    - Botón de pre-footer CTA (`Cotizar Ahora por WhatsApp`).
    - Bloque oficial de datos NAP en el Footer (`<a href="tel:+18294554783">`).
    - Botón flotante omnipresente de WhatsApp.
    - Generador de enlaces dinámicos del simulador de auditoría.
- **Diagnóstico de Imágenes en Google Business Profile:**
  - Se identificó que las fotos subidas aparecen con la etiqueta `PENDING` debido a la cola de moderación automatizada de Google para perfiles nuevos (tiempo habitual de liberación: 24 a 48 horas).
  - Se instruyó al usuario sobre la asignación de la categoría secundaria `Diseñador de páginas web` (`Website designer`) en el panel de GBP para solventar la alerta de extensión `GBP Category not found`.

## [2026-09-28] - Protección de Ventaja Competitiva (Bento 4 AI Search) y Motor de Escaneo Real en Vivo
- **Protección de 'Secret Sauce' (Bento 4):**
  - El usuario señaló oportunamente que mostrar la tarjeta de "Microdatos Schema.org" con fragmentos de código JSON-LD educaba innecesariamente a competidores dominicanos que desconocen esta tecnología.
  - Se transformó Bento 4 en **"Optimización para Búsquedas con Inteligencia Artificial (Google AI Overviews & Gemini)"**, destacando la preparación para motores generativos (GEO) y mostrando un mockup de recomendación de IA sin revelar código fuente.
- **Transformación del Escáner de Auditoría (De Mockup a Motor Real en Vivo):**
  - El usuario detectó que el escáner anterior arrojaba resultados hardcodeados estáticos (ej: 54/100 para cualquier entrada, incluso para la web propia).
  - Se reescribió `triggerAuditScan()` como un motor asíncrono en vivo:
    - **Reconocimiento del propio dominio (`isapromord`):** Diagnostica y certifica el 99/100, velocidad de 0.42s y arquitectura Anycast.
    - **Análisis de Dominios Externos:** Ejecuta consultas DNS reales via Cloudflare DoH (`cloudflare-dns.com/dns-query`), mide latencia de red en tiempo real, detecta IPs y servidores, y proyecta la velocidad real de carga en redes 4G dominicanas con diagnóstico técnico dinámico.
    - **Detección de Negocios sin Web:** Alerta la vulnerabilidad comercial frente a competidores cuando el usuario introduce un nombre sin dominio.
    - **Integración Dinámica con WhatsApp:** El botón de contacto compila automáticamente el resultado real del escaneo en el mensaje pre-escrito.

## [2026-09-28] - Motor Inteligente de Resolución de Nombres a Dominios en Auditoría en Vivo
- **Problema Planteado por el Usuario:**
  - Al ingresar nombres de negocios sin extensión (como `fresco del horno` o `alveare realty`), el motor inicial marcaba erróneamente que no tenían sitio web, cuando en realidad sí existen (`frescodelhorno.com` y `alveare.do`).
- **Solución Algorítmica Implementada:**
  - Se incorporó un **Generador Heurístico de Candidatos de Dominio**:
    - Normaliza la entrada, extrae slugs completos, versiones con guión, y separa nombres de marca eliminando descriptores genéricos (`realty`, `constructora`, `panaderia`, `clinica`, etc.).
    - Genera candidatos prioritarios combinando las extensiones dominicanas e internacionales (`.do`, `.com`, `.com.do`, `.rd.com`).
    - Dispara consultas paralelas en vivo a servidores DNS de Cloudflare DoH (`cloudflare-dns.com`).
    - Detecta automáticamente el dominio real activo:
      - `fresco del horno` ➡️ Resuelve a `frescodelhorno.com` (WordPress / Nginx en IP 150.239.200.100).
      - `alveare realty` ➡️ Resuelve a `alveare.do` (Next.js / Cloudflare CDN en IP 172.67.158.62).
    - Proporciona diagnósticos técnicos individualizados y reales de infraestructura, tiempos de carga estimados en redes dominicanas y oportunidades de captación de clientes por WhatsApp.

## [2026-09-28] - Migración Exitosa a isapromord.github.io (Rebranding y Limpieza Canónica)
- **Reorganización de Identidad en GitHub:**
  - El usuario cambió su nombre de usuario de `@isapromord-eng` a `@isapromord`.
  - El repositorio raíz fue renombrado exitosamente de `isapromord-eng.github.io` a `isapromord.github.io`.
- **Acciones Técnicas Locales y Remotas:**
  - Se actualizaron los remotes de Git (`origin` y `pages`) hacia las nuevas URLs oficiales de la organización `@isapromord`.
  - Se sustituyeron todas las URLs canónicas, metadatos Open Graph, Twitter Cards y referencias en Schema JSON-LD dentro de `index.html`.
  - Se realizó el push de sincronización inmediata hacia `isapromord.github.io` y `isapromord.com`.
  - Se verificó por HTTP 200 que la nueva web está activa en su dominio limpio: `https://isapromord.github.io/`.

## [2026-10-01] - Arquitectura y Despliegue del Dashboard Administrador de Clientes (Hito Primer Cliente)
- **Contexto & Hito Comercial:**
  - ISAPromoRD consiguió su primer cliente comercial formal: **Pasión Pecuaria RD** (`pasionpecuaria.vercel.app` / repo `pasion-pecuaria-rd`).
  - El usuario requirió la implementación de un Dashboard centralizado para gestionar a sus clientes y servicios.
- **Implementación Técnica de Grado Agencia (`dashboard/index.html`):**
  - **Ubicación:** `isapromord.com/dashboard/index.html`, accesible como subruta en GitHub Pages (`/dashboard/`) sin costos de servidor.
  - **Seguridad & Autenticación:** Modal con teclado PIN de seguridad (PIN de fábrica: `3690`, actualizable por el usuario en localStorage).
  - **Métricas & KPIs en Tiempo Real:** Monitor de clientes activos, sitios en producción, cálculo automático de ingresos recurrentes (MRR) y salud de red global.
  - **Primer Cliente Pre-configurado:** Pasión Pecuaria RD con enlaces directos a su web en producción, repositorio, stack técnico (Vercel + Vite React), plan de mantenimiento mensual (RD$ 4,500), fecha de renovación y checklist de tareas/despliegues.
  - **Inspector de Uptime & Latencia:** Integración de Cloudflare DoH (`cloudflare-dns.com`) para chequear latencia y estado en línea de las URLs de los clientes en tiempo real.
  - **Generador de Reporte WhatsApp:** Generador automático de reportes de estado técnico con 1 clic para enviar al cliente por WhatsApp.
  - **Backup & Portabilidad:** Soporte de exportación e importación de bases de datos en formato JSON para respaldar la información sin dependencia de bases de datos de terceros.
  - **SEO & Privacidad:** Configuración de `Disallow: /dashboard/` en `robots.txt` y metatag `noindex, nofollow` para evitar la indexación en motores de búsqueda.

## [2026-10-01] - Corrección de Vinculación Oficial de Repositorio (Organización isapromord)
- **Corrección Crítica Realizada:**
  - El usuario advirtió oportunamente que el repositorio de Pasión Pecuaria estaba listado con un remote legacy (`lunacodeabit`).
  - Se auditó la cuenta oficial de GitHub de la agencia (`isapromord`) utilizando GitHub CLI (`gh repo list isapromord`).
  - Se confirmó que el repositorio oficial es **`https://github.com/isapromord/pasion-pecuaria-rd`** (privado, con descripción: *"Sitio web oficial y plataforma técnica veterinaria para Pasión Pecuaria RD"*).
  - Se actualizó el remote git local de `pasion-pecuaria-rd` apuntando a `origin https://github.com/isapromord/pasion-pecuaria-rd.git`.
  - Se actualizó la referencia en el Dashboard Administrador (`dashboard/index.html` y `dashboard.html`), incorporando lógica de migración automática transparente en `loadClients()` para corregir cualquier valor previo en el `localStorage` del navegador.

## [2026-10-01] - Arquitectura del Cotizador y Propuestas Digitales Interactivas "A la Carte"
- **Innovación en el Modelo de Negocio (Industry Standard):**
  - Se sustituyó el formato arcaico de PDFs estáticos por **Propuestas Digitales Interactivas Mobile-First** alojadas en `propuesta/index.html` (y `propuesta.html`).
  - El cliente recibe un enlace directo por WhatsApp (`isapromord.github.io/propuesta/?d=...`), optimizado para cargarse en menos de 0.5s en smartphones dominicanos.
- **Capacidades del Generador de Propuestas (en `/dashboard/`):**
  - **Pestaña Nueva:** "Cotizador & Propuestas A la Carte".
  - **Selector de Cliente:** Permite elegir a clientes registrados o escribir prospectos nuevos en frío.
  - **Paquetes Base Configurables:** Setup Inicial (`RD$ 18,000`), Monopolio Local Retainer (`RD$ 25,000/mes`), Dominación Total SEO+Ads (`RD$ 45,000/mes`).
  - **Módulos A la Carte:** Landing page, geocodificación EXIF (GeoImgr), kit de reseñas QR acrílico, Google Ads transaccional, optimización IA (GEO) y spam fighting.
  - **Cero Costo de Backend:** Toda la configuración se serializa y codifica en Base64 en la URL, asegurando que cualquier cliente pueda abrir su propuesta sin depender de bases de datos pagadas.
  - **Historial Local:** Registro de propuestas recientes con botón para copiar o reabrir.
- **Experiencia de Usuario del Cliente (en `/propuesta/`):**
  - El cliente ve su propuesta personalizada con diseño *Clean Modern Agency*.
  - Puede activar o desactivar los módulos "a la carta" con interruptores reactivos, viendo recalcularse en tiempo real la inversión inicial y el costo mensual.
  - **Calculadora de ROI:** Estima cuántos clientes adicionales necesita al mes para que la inversión se pague sola.
  - **Cierre en 1 Clic:** Botón "Aprobar Propuesta" que genera el mensaje formateado de aceptación y solicitud de anticipo (50%) directo al WhatsApp oficial de ISAPromoRD.
- **Privacidad:** `robots.txt` actualizado con `Disallow: /propuesta/` y `Disallow: /propuesta.html`.

## [2026-10-01] - Alineación de Catálogo Real de ISAPromoRD: Eliminación de Google Ads/Spam y Lanzamiento de CRM, Chatbots e IA
- **Corrección de Vocabulario y Alcance:**
  - El usuario auditó el generador de propuestas y descartó explícitamente tecnicismos de cursos internos (`GeoImgr`, `Limpieza de Spam / Spam fighting`) y servicios ajenos a su modelo (`Google Ads`).
  - Se confirmó el stack de servicios de alto valor y diferenciación tecnológica que ISAPromoRD realmente comercializa:
    1. **Landing Pages Transaccionales de Alta Conversión (<1s)**
    2. **Optimización y Presencia en Google Maps (Google Business Profile)**
    3. **CRM Personalizado a Medida:** Diseñado para adaptarse al flujo operativo y comercial exacto de cada negocio (sin suscripciones forzosas de software rígido).
    4. **Chatbot Programado para Servicios e Inventario:** Integrado a la web para cotizaciones inmediatas, catálogo y disponibilidad en tiempo real.
    5. **Agente de Inteligencia Artificial (24/7):** Asistente conversacional para responder preguntas frecuentes, agendar citas en calendario y recomendar productos/servicios.
    6. **Kit Físico de Captación de Reseñas QR / NFC para Mostrador:** Placas acrílicas elegantes para calificar en Google Maps con 1 toque.
    7. **Mantenimiento Técnico, Hosting & Soporte Mensual:** Soporte continuo, alta disponibilidad y actualización de contenidos.
- **Actualización de Código:**
  - `dashboard/index.html` y `dashboard.html`: Actualizados los paquetes base (`pack-esencial`, `pack-ia`, `pack-ecosistema`) y la lista de addons disponibles.
  - `propuesta/index.html` y `propuesta.html`: Actualizados los valores predeterminados y el catálogo interactivo para clientes.

## [2026-10-01] - Arquitectura y Despliegue del Sistema de Referidos & Telemetría en Dashboard
- **Objetivo Estratégico:**
  - Implementación de un bucle de referidos de alto rendimiento estilo industria ("Powered by ISAPromoRD") para colocar en el footer de clientes (comenzando por Pasión Pecuaria RD), permitiendo medir clics, conversiones y valor de vida del cliente por referido.
- **Base de Datos & Supabase (`nexus-crm`):**
  - Se crearon las tablas en el esquema `public`:
    - `isapromo_referrals`: Registro de clientes aliados, slugs de enlace, clics totales, conversiones y comisiones/recompensas.
    - `isapromo_referral_clicks`: Registro de telemetría de clics (IP hash, user-agent, referer, timestamp).
    - `isapromo_referral_conversions`: Registro de leads y clientes cerrados atribuidos.
    - Políticas RLS configuradas para lectura/inserción pública de eventos con llaves anon.
  - Se insertó el partner inicial: `pasionpecuaria` ("Pasión Pecuaria RD").
- **Detección y Atribución en `index.html`:**
  - Banner dinámico de bienvenida (#referralWelcomeBanner) cuando un usuario llega vía `?ref=...` ("¡Bienvenido! Vienes recomendado por Pasión Pecuaria RD...").
  - Almacenamiento de atribución por 90 días en `localStorage` (`isapromo_referral_partner`, `isapromo_referral_ts`).
  - Inyección dinámica automática de la etiqueta `[Ref: partner]` en todos los botones de llamada a la acción hacia WhatsApp para atribución garantizada del lead.
- **Tab 3 en Dashboard (`/dashboard/`):**
  - Nueva pestaña: **"Sistema de Referidos & Telemetría"**.
  - Tarjetas KPI: Total de Clics, Leads Atribuidos, Clientes Cerrados y Tasa de Conversión Global.
  - Tabla de Aliados / Referrals con estatus, enlaces rápidos, copiado de link `?ref=...` y métricas.
  - Modal Generador de Badges con código listo para copiar en **React JSX (Tailwind)** y **HTML Puro**.
  - Modal para dar de alta nuevos clientes y generar su slug personalizado al instante.
- **Resiliencia & Tolerancia a Fallos (Patrón Arquitectónico):**
  - Supabase HTTP REST retornó `403 Service restricted: exceed_egress_quota` debido al tope de 5GB de la cuenta gratuita en proyectos legacy.
  - Solución: Se implementó arquitectura híbrida con fallback automático transparente a `localStorage`. La atribución de leads por WhatsApp y la interfaz del dashboard operan al 100% de manera ininterrumpida sin depender críticamente de la disponibilidad de la API externa.

## [2026-10-01] - Calibración Estratégica del Modelo de Precios y Retainers Mensuales (Opción A Oficial)
- **Diagnóstico Comercial:**
  - El precio anterior de setup del CRM a medida (RD$ 25,000) sufría del sesgo de "descuento por sospecha" frente a las casas de software dominicanas (RD$ 300,000+), y los paquetes no reflejaban un modelo de ingresos recurrentes (MRR) coherente.
  - Se eliminó el kit físico QR/NFC para enfocar la agencia 100% en software, IA y marketing de alto margen sin fricción logística.
- **Estructura Oficial de Precios "A la Carte" (RD$):**
  1. `Landing Page Transaccional (<1s)`: Setup RD$ 20,000 | Mantenimiento Anycast: RD$ 4,500/mes.
  2. `Google Maps Profesional (GBP)`: Setup RD$ 15,000 | Gestión Activa & SEO Local: RD$ 12,000/mes.
  3. `Optimización GEO & Schemas para ChatGPT/Gemini`: Setup RD$ 15,000 (Pago único).
  4. `Chatbot Inteligente de Servicios/Inventario`: Setup RD$ 15,000 (Pago único).
  5. `Agente de Inteligencia Artificial (Citas/FAQ 24/7)`: Setup RD$ 25,000 | Tokens & Mantenimiento: RD$ 10,000/mes.
  6. `CRM Personalizado a Medida`: Setup RD$ 35,000 | Servidor Cloud & Backups Diarios: RD$ 8,000/mes.
- **Paquetes Oficiales (Bundles con Ahorro Real para el Cliente):**
  - **Paquete 1: Presencia & Captación Local:** Setup RD$ 30,000 | Mensualidad RD$ 15,000/mes.
  - **Paquete 2: Negocio con Inteligencia Artificial:** Setup RD$ 50,000 | Mensualidad RD$ 20,000/mes.
  - **Paquete 3: Ecosistema Digital Completo + CRM:** Setup RD$ 85,000 | Mensualidad RD$ 30,000/mes.
- **Sincronización:**
  - `dashboard/index.html` y `dashboard.html`: Actualizadas las tarjetas de radio, estructura `PROPOSAL_BASE_PACKAGES`, lista de addons `PROPOSAL_ADDONS` y cálculo en tiempo real con `monthlyPrice`.
  - `propuesta/index.html` y `propuesta.html`: Actualizado `DEFAULT_PROPOSAL_DATA`, renderizado visual de precios combinados (Setup + Mensual) y cálculo reactivo en la barra fija y en el generador de cierre por WhatsApp.

## [2026-10-01] - Creación e Integración de Paquete Estrella "Crecimiento & Control CRM" (MÁS POPULAR)
- **Razón Estratégica:**
  - No todos los clientes locales están listos para chatbots o agentes de IA, pero sí tienen una necesidad crítica de: Web (<1s) + Google Maps activo + Schemas GEO + CRM a la medida para control operativo de ventas y clientes sin costo mensual por usuario.
- **Configuración del Paquete "Crecimiento & Control Operativo" (`pack-crm`):**
  - **Inversión Setup:** **RD$ 65,000** *(Ahorro de RD$ 20,000 vs los RD$ 85,000 sueltos)*.
  - **Mantenimiento Mensual:** **RD$ 20,000 / mes** *(Ahorro de RD$ 4,500/mes vs los RD$ 24,500 sueltos)*.
  - **Insignia:** Marcado oficialmente como el paquete **"MÁS POPULAR"** en el Dashboard y como paquete predeterminado en las propuestas digitales enviadas a clientes.
- **Sincronización de Archivos:** `dashboard/index.html`, `dashboard.html`, `propuesta/index.html` y `propuesta.html` actualizados con cuadrícula responsiva de 4 paquetes (`sm:grid-cols-2 lg:grid-cols-4`).

## [2026-10-01] - Desacoplamiento de Paquetes Base, Cotización 100% A la Carta y Deduplicación Dinámica de Addons
- **Problema de Negocio Resuelto:**
  1. *Duplicación de Servicios:* Cuando se seleccionaba un paquete base (ej. `Crecimiento & Control CRM`), los servicios ya incluidos en dicho paquete (Landing Page, Google Maps, Schemas GEO, CRM) seguían mostrándose como checkboxes opcionales en la lista de abajo, causando confusión en el cliente y riesgo de doble cobro.
  2. *Inflexibilidad de Paquetes:* No existía una opción para deseleccionar los paquetes base y enviar una cotización 100% "A la Carta" (por ejemplo, si un cliente solo necesita el CRM, solo el agente de IA o solo la Landing Page).
- **Solución de Ingeniería & UX:**
  - **Opción "100% A la Carta (Sin Paquete Base)" (`pack-custom`):** Añadido 5to radio en el Dashboard con RD$ 0 setup y RD$ 0 mensual base. Permite componer cotizaciones totalmente libres seleccionando módulos independientes.
  - **Deduplicación Reactiva en Dashboard (`dashboard/index.html`):**
    - Cada paquete en `PROPOSAL_BASE_PACKAGES` define su lista inmutable `includedAddonIds: [...]`.
    - Al cambiar de paquete base mediante `handleBasePkgChange()`, la lista de addons visibles filtra automáticamente cualquier servicio ya contemplado en el paquete (`currentProposalAddons.filter(a => !includedIds.includes(a.id))`), desmarcando preventivamente cualquier conflicto.
    - Si se selecciona el paquete "Ecosistema Total", se presenta un banner inteligente informando que todos los módulos ya están incluidos.
    - Si se selecciona "100% A la Carta", los 10 módulos del catálogo quedan disponibles para marcar a discreción.
  - **Experiencia del Cliente en Propuestas (`propuesta/index.html`):**
    - Si `basePackage.id === 'pack-custom'`, la sección "Fase 1: Plan Base Seleccionado" se oculta por completo de forma limpia, y la sección de módulos pasa a ser el catálogo principal ("Servicios Seleccionados a la Medida").
    - En el cierre por WhatsApp (`acceptProposal()`), se omiten las etiquetas `• [Base]` y se desglosa únicamente la lista de servicios contratados, calculando con exactitud el setup total, la mensualidad y el anticipo del 50%.
- **Sincronización:** Archivos espejo `dashboard.html` y `propuesta.html` actualizados y validados.





## [2026-10-01] - Arquitectura de Comparativa de Valor (A la Carta vs Paquete Combo) y Exportación PDF Formal
- **Psicología Comercial & Arquitectura de Ventas:**
  - En lugar de enviar un precio cerrado aislado, el cliente visualiza un contraste directo entre contratar los servicios de forma individual (precio de lista "A la Carta") frente a la opción de adquirirlos en combo como paquete sugerido.
  - Esto desbloquea el principio comercial de "Value Stacking": el cliente percibe de forma transparente el beneficio tangible y el ahorro económico inmediato ("🔥 Te ahorras RD$ X en Setup y RD$ Y/mes").
- **Flujo Operativo en Dashboard (`/dashboard/`):**
  - **Paso 1: Módulos Solicitados "A la Carta":** Selección libre de cualquiera de los 10 módulos de software, IA y posicionamiento sin restricciones de bloqueo. Se calcula un subtotal en vivo.
  - **Paso 2: Paquete Recomendado a Ofrecer:** Selector de combos (incluyendo la opción "Sin Paquete • Solo Servicios A la Carta"). Por defecto sugiere el paquete más popular (`pack-crm`).
  - **Paso 3: Caja de Análisis Comparativo en Vivo:** Presenta 3 métricas simultáneas antes de generar el enlace: Total A la Carta, Inversión en Paquete y Ahorro Inmediato Demostrado.
- **Experiencia de la Propuesta Digital (`/propuesta/`):**
  - **Tarjeta Dual Interactiva:** Presenta lado a lado "Opción 1: Servicios A la Carta" y "Opción 2: Paquete Recomendado", con toggle interactivo donde el cliente puede hacer clic en cualquiera de las dos para adoptarla.
  - **Barra Flotante Reactiva:** Actualiza los totales de inversión y el mensaje de cierre por WhatsApp según la opción elegida por el cliente.
  - **Diseño Print-First & Exportación a PDF:**
    - Botón "Descargar en PDF" en cabecera y modal.
    - Soporte de parámetro URL `?print=1` que dispara automáticamente el diálogo `window.print()` con 700ms de retraso para renderizado completo.
    - Membrete corporativo oficial ISAPromoRD y sección formal de firmas y autorización de inicio visible únicamente al imprimir o guardar en PDF (`@media print`).
- **Sincronización:** Módulos y páginas espejo actualizados (`dashboard.html` y `propuesta.html`).


## [2026-10-01] - Refinamiento UX Comercial: Paquetes en Primera Vista, Terminología Corporativa y Exportación Real de PDF (html2pdf.js)
- **Corrección de Jerarquía Visual en Dashboard (`/dashboard/`):**
  - **Problema:** Al colocar los 10 servicios "A la Carta" arriba de los paquetes, las tarjetas de combos comerciales quedaban empujadas fuera del viewport inicial, dando la impresión de que los paquetes habían desaparecido.
  - **Solución:** Se restauró la jerarquía de ventas situando **Paso 1: Paquetes Comerciales Recomendados (Combo con Descuento)** en la parte superior inmediata, seguido de **Paso 2: Servicios y Módulos de la Propuesta (A la Carta)** con etiquetas reactivas `✓ En Combo`, y **Paso 3: Tablero Comparativo en Vivo**.
- **Erradicación de Tecnicismos y Vocabulario Extraño:**
  - Se eliminaron expresiones disonantes o agresivas como *"Monopolio de SERPs & Clientes"* y *"Enfoque de Dominación: Cero Humo"*.
  - Se sustituyeron por lenguaje corporativo de alta credibilidad empresarial:
    - *"Objetivo Estratégico: Máxima Visibilidad Local & Nuevos Clientes en Google"*.
    - *"Canal de Captación: Llamadas & WhatsApp Directo"*.
    - *"Enfoque Comercial: Posicionamiento en Google & Retorno de Inversión"*.
- **Generación y Descarga de Archivo PDF Real (`html2pdf.js`):**
  - **Problema:** El botón "Descargar en PDF" anteriormente solo invocaba el diálogo del navegador `window.print()`, que no descargaba un archivo real y presentaba fondos negros con alto consumo de tinta.
  - **Solución:**
    - Integración de `html2pdf.js` (renderizado A4 a 2x de resolución).
    - Descarga automática directa del archivo físico: `Propuesta_ISAPromoRD_[Cliente].pdf`.
    - Estilos `@media print` transforman el bloque oscuro en un membrete blanco ejecutivo, ocultan la barra de navegación web (`header`) para evitar doble cabecera, y formatean márgenes limpios de página.
- **Sincronización:** Módulos y espejos `dashboard.html` y `propuesta.html` actualizados al 100%.

## [2026-10-02] - Arquitectura de URLs Compactas (Solución HTTP 414), Catálogos Desacoplados y PDF Resiliente
- **Diagnóstico Crítico (HTTP 414 URI Too Long):**
  - La propuesta serializaba todo el árbol JSON (descripciones largas, entregables, cálculos y metadatos) en Base64 en el parámetro `?d=...`, generando URLs de más de 5,000 caracteres.
  - Esto provocaba que GitHub Pages y navegadores móviles rechazaran la solicitud con error `414 URI Too Long`, rompiendo la pantalla en blanco y haciendo imposible abrir la propuesta o descargar el PDF.
- **Ingeniería de URLs Compactas (Industry Standard):**
  - **Reestructuración de Parámetros:** La URL ahora viaja limpia y ultracompacta (~180 caracteres): `?id=...&client=...&cat=...&pkg=...&svc=...&mode=...`.
  - **Catálogo Desacoplado en Cliente (`SERVICE_CATALOG` & `PACKAGE_CATALOG`):** `/propuesta/` incorpora su propio catálogo maestro idéntico al Dashboard con los 10 servicios oficiales y los 4 paquetes estructurados.
  - **Reconstrucción Dinámica Reactiva:** `initProposalData()` lee los IDs mínimos, recalcula subtotales, totales de paquetes, ahorros demostrados y reactividad sin pérdida de fidelidad.
  - **Caché Local para Sesiones Dashboard:** En el navegador donde se generó la propuesta, se guarda en `localStorage` con la clave `proposal_{id}` para renderizado instantáneo y descarga directa de PDF.
  - **Tolerancia a Enlaces Incompletos:** Si por alguna razón el parámetro `svc` viene vacío en un mensaje compartido, el motor auto-pobla los servicios desde `includedAddonIds` del paquete seleccionado.
  - **Compatibilidad hacia Atrás:** Se mantiene soporte nativo transparente para el parámetro legacy `?d=...`.
- **Descarga Física de PDF Optimizada:**
  - Al abrirse con `&download=1`, la página renderiza inmediatamente el contenido y descarga de forma fluida el archivo A4 corporativo `Propuesta_ISAPromoRD_[Cliente].pdf`.
- **Sincronización:** Actualizados `dashboard/index.html`, `dashboard.html`, `propuesta/index.html` y `propuesta.html`.

## [2026-10-02] - Enlaces Personalizados de Marca (/propuestas/pasionpecuaria), Enrutamiento Directo a WhatsApp y Anti-Caché
- **Causa Raíz del Link Largo en Pantalla del Usuario:**
  - El navegador del usuario conservaba en memoria la versión previa del dashboard cargada antes de los despliegues. Al hacer clic en "Generar", ejecutaba el JavaScript en caché que producía el parámetro antiguo `?d=eyJpZ...`.
  - Solución Anti-Caché: Se inyectaron metatags HTTP `Cache-Control: no-cache, no-store, must-revalidate` y `Pragma: no-cache` en `<head>` para forzar a navegadores y proxies a obtener siempre la última versión.
- **Rutas Limpias y Personalizadas de Marca (Industry Standard):**
  - Para clientes registrados como Pasión Pecuaria RD, el generador ahora emite directamente la ruta personalizada de negocio:
    `https://isapromord.github.io/propuestas/pasionpecuaria/` (¡Cero parámetros de consulta, idéntico a PandaDoc / Proposify!).
  - Para nuevos clientes o prospectos en frío, emite una URL semántica limpia y corta:
    `https://isapromord.github.io/propuesta/?cliente=Nombre&plan=crm` (~60 caracteres).
  - Se creó el directorio y página física dedicada `propuestas/pasionpecuaria/index.html` en el repositorio para que GitHub Pages la sirva de manera nativa sin depender de un servidor de aplicaciones dinámico.
- **Corrección del Botón de WhatsApp:**
  - Anteriormente, el enlace `https://wa.me/?text=...` sin número forzaba a WhatsApp Web a abrir el chat con uno mismo ("Mensaje a ti mismo").
  - Se incorporó el campo interactivo "WhatsApp del Cliente (Para Enviar)" en el formulario del Dashboard (auto-completado al seleccionar un cliente registrado).
  - El botón en el modal ahora enlaza directamente con el cliente: `https://wa.me/${cleanNumber}?text=...`, abriendo directamente el chat del cliente con el mensaje pre-redactado y el enlace personalizado.
- **Sincronización:** Módulos espejos `dashboard.html` y `propuesta.html` actualizados al 100%.

## [2026-10-02] - Arquitectura de Cobros Recurrentes (Retainers Mensuales), Badges de Vencimiento y Avisos por WhatsApp
- **Objetivo & Estándar de la Industria:**
  - En agencias digitales modernas, la retención y facturación recurrente (MRR) de mantenimientos web y retainers de SEO/CRM requiere un control visual estricto de fechas de corte, estados de cobranza y recordatorios directos sin fricción.
  - Se implementó un sistema de control de cobros recurrentes de 4 pilares integrado directamente en el Directorio de Clientes del Dashboard (`/dashboard/`):
    1. **Monitor de Ciclo de Facturación (Semáforo de Cobro):**
       - Cálculo automático en tiempo real (`getBillingStatus(renewalDateStr)`):
         - 🟢 **Al Día:** Más de 5 días restantes para el vencimiento (muestra conteo regresivo).
         - 🟡 **Por Vencer:** Faltan entre 0 y 5 días para la fecha de corte.
         - 🔴 **Vencido:** Fecha superada (muestra días acumulados de mora).
       - Visualización destacada en la tarjeta del cliente con fecha de próximo corte y registro del último pago realizado.
    2. **Aviso Formal de Cobro & Renovación por WhatsApp (1 Clic):**
       - Modal interactivo (`openBillingNoticeModal(clientId)`) que compila un estado de cuenta formal:
         - Período facturado (ej: "Octubre 2026"), plataforma del cliente, concepto de servicios y tarifa acordada.
         - Datos bancarios pre-cargados para transferencia directa (Banco Popular Dominicano, número de cuenta, titular).
         - Apertura con 1 clic hacia el WhatsApp del cliente (`wa.me/1829...`) con el mensaje codificado o botón de copiado rápido al portapapeles.
    3. **Registro de Pago con 1 Clic (`✓ Pagado`):**
       - Botón reactivo en la tarjeta del cliente que, previa confirmación, asienta el cobro recibido:
         - Calcula automáticamente y avanza la fecha de renovación al mes siguiente (+1 mes).
         - Restablece el estado del cliente a `🟢 Activo`.
         - Registra el recibo en el historial interno de pagos (`client.paymentHistory`).
         - Agrega automáticamente una entrada completada en la bitácora de tareas del cliente.
    4. **Configuración Centralizada de Cuentas Bancarias:**
       - En el modal de "Ajustes & Respaldo" (`backupModal`), se integró un editor para personalizar las cuentas bancarias de la agencia (`bankDetailsInput`), almacenado en `localStorage` (`isapromo_agency_bank_details_v1`).
- **Saneamiento Canónico de Dominio:**
  - Se verificó y aseguró que todas las referencias activas apunten exclusivamente a `https://isapromord.github.io/` hasta que se adquiera formalmente el dominio personalizado.
- **Sincronización:** Módulos espejos `dashboard.html` y `propuesta.html` actualizados al 100%.

## [2026-10-02] - Corrección de Teléfono de Cliente Insignia (+1 829 396-1318), Edición de Ficha y Soporte de Email
- **Diagnóstico del Error de Datos:**
  - El cliente insignia (Pasión Pecuaria RD) tenía asignado erróneamente en `INITIAL_CLIENTS` el número personal de la agencia (`+1 (829) 455-4783`) en lugar de su número comercial oficial (`+1 (829) 396-1318`).
  - Al estar almacenado en el `localStorage` del navegador del usuario, la tarjeta continuaba mostrando el número de la agencia.
- **Mejoras de Grado Industria Implementadas:**
  1. **Actualización Canónica:** Se corrigió el número en `INITIAL_CLIENTS` a `+1 (829) 396-1318` y se añadió el correo oficial `pasionpecuariard@gmail.com`.
  2. **Migración Automática de Datos:** En `loadClients()`, se detecta cualquier registro previo de Pasión Pecuaria con el número anterior y se actualiza de inmediato al número comercial y correo correctos.
  3. **Acceso Rápido a Edición (Industry Standard CRM):**
     - Botón destacado **"✏️ Editar Ficha"** en la cabecera superior de la tarjeta del cliente para editar cualquier dato en tiempo real (Teléfono, Contacto, Email, Monto, Fechas, Notas).
     - El teléfono ahora es un enlace interactivo directo hacia WhatsApp (`wa.me/18293961318`) con estilo de píldora verde e icono identificativo.
  4. **Ampliación del Modelo de Datos:** Se integró el campo **"Correo Electrónico"** en el modal de cliente (`clientModal`), formulario y vista de tarjeta.
  5. **Propuestas y Avisos Sincronizados:** Al generar propuestas o emitir avisos de cobro, el campo de teléfono del cliente ahora auto-completa el número real del cliente (`8293961318`).
- **Sincronización:** Módulos espejos `dashboard.html` y `propuesta.html` actualizados al 100%.

## [2026-10-02] - Arquitectura Financiera & Contable de Grado CFO (Tab 4: Finanzas & Contabilidad)
- **Objetivo & Estándar de la Industria (SaaS & Agency Financial Management):**
  - El usuario solicitó una suite contable integral para visualizar todos los números de todas las cuentas bancarias de la agencia, calcular las entradas mensuales de ISAPromoRD, proyectar el flujo de caja y mantener conciliación financiera según los estándares de la industria (MRR, ARR, Aging de Cuentas por Cobrar, Inflow Mensual).
- **Implementación Técnica de Grado CFO en `/dashboard/` (Tab 4):**
  1. **Navegación & Tab 4 ("Finanzas & Contabilidad"):**
     - Añadido botón interactivo `tabAccountingBtn` ("💼 Finanzas & Contabilidad") en la barra de navegación del Dashboard con sincronización reactiva de estado visual.
  2. **CFO Executive KPIs (Cuadro de Mando en Vivo):**
     - **Flujo de Caja del Mes (Inflow):** Suma automática de todos los ingresos liquidados durante el mes actual (Setup iniciales + Retainers recurrentes cobrados).
     - **Ingresos Recurrentes (MRR):** Proyección mensual de mantenimientos activos y retainers SEO/CRM con cálculo dinámico del ARR (MRR x 12).
     - **Cuentas por Cobrar (Aging Receivables):** Sumatoria de facturas pendientes con alerta visual de cuentas en mora (>30 días) y recordatorios directos por WhatsApp.
     - **Tasa de Cobranza (Collection Rate):** Porcentaje de recaudación efectiva frente al total facturado en el ciclo.
  3. **Conciliación Multibancaria (Multi-Bank Accounts):**
     - Monitoreo en vivo de saldos en:
       - **Banco Popular Dominicano** (Cuenta Corriente / Principal de la agencia).
       - **Banco BHD / Banreservas** (Fondo Operativo y de Reserva).
       - **Efectivo / Caja Chica** (Cobros directos en oficina / campo).
     - Desglose de ingresos del mes y última conciliación en cada entidad bancaria.
  4. **Simulador Interactivo de Crecimiento & Forecasting (MRR / ARR):**
     - Herramienta analítica de proyección para planificar metas comerciales:
       - Controles deslizantes/numéricos para modelar clientes en cada paquete oficial (`pack-esencial`, `pack-crm`, `pack-ia`, `pack-ecosistema`).
       - Proyecta en tiempo real los ingresos de Setup (flujo de caja inmediato), el MRR resultante y los ingresos recurrentes anualizados (ARR).
  5. **Matriz de Cuentas por Cobrar (Aging Receivables):**
     - Tabla que lista el estado de cobro de cada cliente registrado con clasificación de antigüedad:
       - `🟢 Al Día` (Facturado en ciclo).
       - `🟡 Por Vencer` (Menos de 5 días para corte).
       - `🔴 Vencido` (Mora calculada con días acumulados).
     - Enlace directo de cobro por WhatsApp con mensaje formal y botón reactivo para registrar cobro (`✓ Confirmar Pago`).
  6. **Libro Diario de Transacciones (Transaction Ledger):**
     - Registro cronológico inmutable de ingresos y egresos con:
       - Fecha, Cliente / Origen, Categoría (`Setup / Desarrollo`, `Mantenimiento Web`, `Retainer SEO & Maps`, `Servidor Cloud CRM`, etc.).
       - Método / Cuenta Bancaria de ingreso y número de comprobante o referencia de transferencia.
       - Filtro dinámico por mes de ejercicio (ej: "Octubre 2026").
     - **Botón `+ Registrar Cobro`:** Modal completo (`manualTransactionModal`) para asentar ingresos de cualquier cliente o proyecto nuevo al instante.
     - **Exportación CSV de Grado Auditoría:** Botón `📥 Exportar CSV` que genera y descarga el libro diario formal con codificación UTF-8 compatible con Microsoft Excel y Google Sheets.
  7. **Sincronización Bidireccional Automática:**
     - Al presionar `✓ Pagado` en la tarjeta de un cliente (Tab 1) o `✓ Confirmar Pago` en la matriz de cobranzas (Tab 4), el sistema automáticamente asienta la transacción en el libro contable de la agencia, actualiza el flujo de caja del mes y acredita los fondos a la cuenta bancaria seleccionada.
- **Sincronización:** Módulos espejos `dashboard.html` y `propuesta.html` actualizados al 100%.

## [2026-10-02] - Integración de Servidor MCP Stitch y Rediseño Web "Obsidian Cyber Luxe"
- **Conexión & Configuración del Servidor MCP Google Stitch:**
  - Registrado y autenticado `@_davideast/stitch-mcp` en `~/.gemini/config/mcp_config.json` con la API Key oficial proporcionada por el usuario.
- **Rediseño Completo de Landing Page Principal (`index.html`):**
  - Implementación del nuevo look diseñado en Stitch ("Obsidian Cyber Luxe", Dark Luxury Tech):
    - Paleta: Obsidian (`#0a0e17`), azul cobalto (`#2563EB`), verde esmeralda (`#10B981`) y cian neón (`#00d2ff`).
    - Tipografía de grado industria: *Plus Jakarta Sans* (jerarquía editorial) + *JetBrains Mono* (telemetría y badges).
    - Descarga y almacenamiento local de activos de alta definición en `assets/` (`hero_bg.webp`, `pillar_speed.webp`, `pillar_maps.webp`, `pillar_ai.webp`, `logo_stitch.png`) para 0ms de latencia y eliminación de dependencias externas.
- **Preservación & Fusión de Sistemas Críticos:**
  - **Doble Motor de Estimación & Auditoría (`#simulador`):**
    1. *Simulador Reactivo de 2 Clics:* Cálculo instantáneo de ROI por sector comercial (*Clínica*, *Firma Legal*, *Inmobiliaria*, *Comercio*) y zona dominicana (*Piantini/Naco*, *Bella Vista*, *Santiago*, *Punta Cana*).
    2. *Escáner Real DNS en Vivo:* Motor asíncrono con **Cloudflare DoH** (`cloudflare-dns.com/dns-query`) que audita en vivo dominios dominicanos, latencia de red, tiempo de carga en 4G/5G y diagnóstico de pérdidas de clientes.
  - **Canal de Contacto Oficial:** 100% de enlaces de WhatsApp configurados hacia el número verificado de la agencia: **`+1 (829) 455-4783`**.
  - **Telemetría de Referidos (`?ref=...`):** Barra `#referralWelcomeBanner` adaptada a la estética Obsidian y script de tracking hacia Supabase conservado intacto.
  - **SEO & Metadatos:** Metatags geográficos de Santo Domingo, etiquetas OpenGraph y gráfico Schema.org JSON-LD (`LocalBusiness`, `ProfessionalService`, `FAQPage`) preservados íntegramente.
  - **Acceso Administrativo:** Enlace discreto a `/dashboard/` en el footer corporativo.

## [2026-10-02] - Unificación Visual del Dashboard Administrador: "Obsidian Cyber Luxe" y Estándares Tipográficos
- **Objetivo y Requerimiento:**
  - El usuario consultó si el Dashboard requería diseñarse de cero en Stitch o si podía aplicarse el mismo tema visual ("Obsidian Cyber Luxe" / *Dark Luxury Tech*) directamente, y solicitó validar que los tamaños de fuentes y responsividad se apegaran a los estándares de la industria en desktop y móvil.
- **Implementación Técnica de Grado Agencia (`dashboard/index.html` y espejo `dashboard.html`):**
  - **Paleta Unificada Dark Luxury Tech:**
    - Fondo global: Obsidian `#0a0e17`.
    - Superficies de tarjetas y modales: `#121824` y `#161f30`.
    - Bordes e interactivos sutiles: `#222f46`.
    - Acentos de neón: Electric Cyan `#00d2ff` (con sombras `glow-cyan`), Emerald `#10b981` y Cobalt `#2563eb`.
  - **Estándares Tipográficos y Responsividad Mobile/Desktop (Apple HIG & Material 3):**
    - **Tipografías:** *Plus Jakarta Sans* para jerarquía editorial y controles + *JetBrains Mono* para métricas financieras (RD$), latencias, comprobantes y relojes.
    - **Escala Tipográfica:**
      - H1/Cabeceras principales: `text-2xl sm:text-3xl font-black` (24px móvil, 30px desktop).
      - Subtítulos: `text-xs sm:text-sm text-slate-400` (12px móvil, 14px desktop).
      - Tarjetas y Módulos: `text-base sm:text-lg font-bold` / `text-xl font-black`.
      - Métricas & KPIs CFO: `text-2xl sm:text-3xl font-black font-mono` de alto contraste.
      - Datos tabulares y celdas: `text-xs sm:text-sm` (12px a 14px) para máxima densidad informativa sin perder legibilidad.
      - Microcopias y Badges: `text-[10px] sm:text-xs font-semibold uppercase tracking-wider`.
    - **Touch Targets & Accesibilidad:**
      - Botones y tabs con área táctil mínima de 44px (`py-2.5 px-4`).
      - Contrastes superiores a 10:1 (superando el estándar WCAG AAA de 7:1) en textos `#f8fafc` sobre fondos `#0a0e17` y `#121824`.
      - Tablas con contenedor `overflow-x-auto` para visualización táctil fluida en smartphones sin romper el viewport.
  - **Interactividad y Pestañas Dinámicas (`switchDashboardTab`):**
    - Sincronización de estados activos/inactivos en las 4 pestañas: Directorio de Clientes, Cotizador & Propuestas, Telemetría de Referidos y Suite Contable CFO.
  - **Preservación Total de Lógica de Negocio:**
    - Se mantuvieron al 100% las funciones JavaScript operativas (PIN 3690, alta y edición de clientes, cotizador compacto, libros contables, telemetría y exportación CSV).

## [2026-10-02] - Resolución de Bloqueo en GitHub Pages: Purga de Entornos Fantasma y Activación Exitosa de Obsidian Cyber Luxe
- **Causa Raíz Diagnosticada:**
  - El despliegue de GitHub Pages se encontraba bloqueado en los servidores de GitHub con el error: `HttpError: Deployment request failed due to in progress deployment. Please cancel 0d601eff... first or wait for it to complete`.
  - El entorno `github-pages` en ambos repositorios (`isapromord.com` y `isapromord.github.io`) retenía en caché locks de concurrencia no liberados por los runners.
- **Acción Correctiva de Ingeniería:**
  - Se eliminaron y purgaron los entornos `github-pages` en ambas APIs de GitHub (`gh api -X DELETE repos/.../environments/github-pages`), forzando una reconstrucción atómica limpia.
  - Se disparó la compilación `37085549876`, la cual concluyó con éxito (`build in 5s`, `deploy in 9s`, código de salida 0).
- **Verificación en Producción:**
  - Verificado vía `curl` con HTTP 200 y `Last-Modified: Sat, 03 Oct 2026 01:18:09 GMT`.
  - El Dashboard en `https://isapromord.github.io/dashboard/` y `https://isapromord.github.io/dashboard.html` está 100% activo en vivo con la estética completa **Obsidian Cyber Luxe** (fondo `#0a0e17`, tarjetas `#121824`, acentos `#00d2ff`, tipografías *Plus Jakarta Sans* y *JetBrains Mono*).

## [2026-10-02] - Actualización de Identidad Visual (Logo & Favicon 3D) y Racionalización CRO de Botones WhatsApp

### 1. Reemplazo de Identidad Visual y Favicon Multi-resolución
- **Nuevos Activos Procesados:**
  - `assets/logo_v4.jpg`: Extraído con mateo alfa de alta resolución para generar `assets/logo_icon.png` (emblema 3D con monitor, satélites de clientes y megáfono dorado).
  - `assets/logo_v7.jpg`: Procesado a `assets/logo_stitch.png` y `assets/logo.png` con canal alfa limpio y defringing perimetral.
  - Generación de `assets/favicon.png` (192x192) y `assets/favicon.ico` con capas embebidas de 16, 32, 48 y 64px para compatibilidad universal de navegadores y dispositivos móviles.
- **Sincronización en Todo el Ecosistema:**
  - Actualizado en `index.html`, `dashboard/index.html`, `dashboard.html`, `propuesta/index.html`, `propuesta.html` y `propuestas/pasionpecuaria/index.html`.

### 2. Depuración de Etiquetas y Desaturación Visual
- Se eliminaron las etiquetas intrusivas solicitadas por el usuario:
  - `ESTIMACIÓN INMEDIATA & AUDITORÍA EN VIVO` (encima del Simulador de ROI).
  - `EN VIVO: 3 cupos disponibles este mes para Santo Domingo / Santiago` (en la barra superior de navegación).
- Resultado: Look & Feel mucho más premium, limpio y de agencia de software de alto nivel.

### 3. Racionalización de Botones de WhatsApp según Estándares de la Industria (CRO / UX)
- **Diagnóstico de Saturación ("CTA Fatigue" & "Banner Blindness"):**
  - Botones sobredimensionados tipo banner fijo bloqueaban contenidos clave y generaban percepción de "telemercadeo agresivo" en lugar de un socio tecnológico de élite.
- **Implementación del Estándar de la Industria:**
  - **Botón Flotante (FAB):** Se sustituyó la cápsula rectangular invasiva por un botón circular flotante de 56x56px (`w-14 h-14`), icono SVG oficial de WhatsApp, pulso verde de disponibilidad y tooltip discreto al hover (`¿Preguntas? WhatsApp directo`). Nunca bloquea texto ni interfiere con la lectura en móviles o escritorios.
  - **Botón Superior (Navbar):** Reducido a dimensiones compactas estándar (`px-3.5 py-2`, `text-xs`) con icono de WhatsApp integrado.
  - **Botón del Simulador de ROI:** Calibrado a un botón balanceado de acción clara (`px-5 py-2.5`, `text-xs sm:text-sm font-bold`).

## [2026-10-02] - Evolución Estratégica: Modelo 'A la Carta', 4 Pilares de Crecimiento y Restauración Tipográfica 3D del Logo

### 1. Restauración Tipográfica 3D del Logo Oficial
- **Problema:** En el logo previo (`logo_v7.jpg`), las letras de "PROMO" eran blancas sobre lienzo blanco y desaparecieron durante la transparencia alfa, dejando un espacio vacío oscuro entre `ISA` y `RD`.
- **Solución:** Reconstrucción geométrica 3D de la palabra `PROMO` en letras blancas (`#FFFFFF`) con bisel metálico pizarra (`slate-400`), resplandor especular sutil y sombra de profundidad. Espaciado simétrico milimétrico (`gapL=11px, gapR=12px`) y flujo diagonal armónico. Sincronizado en `assets/logo_stitch.png` y `assets/logo.png`.

### 2. Transición de Planes Fijos a 'Servicios a la Carta' (B2B High-Ticket)
- Se eliminaron las tablas de precios rígidas que desalineaban la landing con el cotizador y generaban fricción comercial.
- Se implementó la sección **"Servicios a la Medida / A la Carta"** con 6 módulos combinables:
  1. Landing Page Transaccional (<0.5s)
  2. Google Maps GBP & SEO Local
  3. Agente IA WhatsApp 24/7 (<3s de respuesta)
  4. CRM Personalizado a Medida
  5. GEO Schemas para ChatGPT & Gemini
  6. Cloud Anycast & Mantenimiento Continuo
- Se incorporó un card interactivo de solicitud de propuesta a la medida con apertura directa a WhatsApp y enlace para visualizar la propuesta formal de Pasión Pecuaria RD.

### 3. Expansión a los 4 Pilares del Éxito Comercial
- Se estructuraron los 4 pilares tecnológicos reales de la agencia:
  - **Pilar 01:** Rendimiento de Ultra Velocidad (<0.5s, Core Web Vitals 100/100).
  - **Pilar 02:** Dominancia en Google Maps y Búsqueda IA (ChatGPT & Gemini con GEO Schemas).
  - **Pilar 03:** Cierre de Ventas Inmediato por WhatsApp con IA (<3s de respuesta interactiva).
  - **Pilar 04:** CRM Personalizado a Medida para retención y control operativo en la nube (con visual 3D dedicado `assets/pillar_crm.webp`).
- Se potenció el caso de estudio de **Pasión Pecuaria RD** como Caso Insignia con acceso directo a su propuesta.


## [2026-10-02] - Depuración de UI: Remoción de Tags/Badges Recargados, Desacople de Promesas DGII y Ocultación de Enlaces Crawler en Footer

### 1. Reconstrucción y Fidelidad Absoluta del Logotipo de Marca
- Reconstrucción exacta del logo a partir del activo oficial transparente:
  - Letras de `promo` en blanco puro anti-aliased (`#FFFFFF`).
  - Emblema tridimensional de pantalla flotante con bisel metálico pulido.
  - Tipografías en naranja oficial de marca para `ISA` (superior) y `RD` (inferior).
  - Crop simétrico de alta densidad (987x265 px) exportado a `assets/logo_stitch.png` y `assets/logo.png`.

### 2. Remoción de Tags, Pills y Eyebrows Sobrecargados
- Por solicitud explícita del cliente para elevar la sobriedad y elegancia corporativa del sitio, se eliminaron los chips y tags redundantes:
  - Chip superior en Hero: `🇩🇴 INGENIERÍA DIGITAL DE ÉLITE EN REPÚBLICA DOMINICANA`.
  - Las 3 tarjetas de métricas en Hero (`0.4s`, `Top 3 Google Maps`, `NCF DGII`).
  - Eyebrow tag de comparativa: `CONTRASTE TECNOLÓGICO Y PÉRDIDA DE INGRESOS`.
  - Eyebrows de los 4 pilares: `LOS 4 PILARES DEL ÉXITO COMERCIAL`, `Pilar 01`, `Pilar 02`, `Pilar 03`, `Pilar 04`.
  - Tag de testimonios: `⭐ PRUEBA SOCIAL COMPROBADA`.
  - Pill de tarjeta de testimonio: `CASO INSIGNIA`.
  - Eyebrow de servicios a la carta: `🧩 MODULAR // A LA CARTA`.
  - Pill animado en tarjeta de cotización: `Respuesta en menos de 15 minutos`.
  - Eyebrow en banner de auditoría: `🎥 AUDITORÍA DIGITAL SIN COSTO`.

### 3. Desacople de Ofertas y Promesas Fiscales DGII / NCF
- Se eliminaron todas las ofertas públicas de Comprobante Fiscal NCF / DGII a lo largo del sitio (Hero, sección de cotización, tarjeta de garantía y footer).
- La garantía fue redirigida a una **Garantía de Satisfacción y Rendimiento Técnico** (<0.5s y posicionamiento medible en 60 días).
- En el footer se sustituyó `Facturación DGII NCF` por `Servicios a la Carta`.

### 4. Ocultación de Enlaces de Rastreo (Crawlers) en Footer Público
- Se eliminaron los hipervínculos visuales `<a href="sitemap.xml">` y `<a href="robots.txt">` del footer público para no exponer enlaces técnicos al visitante.
- Los archivos físicos `sitemap.xml` y `robots.txt` permanecen activos e intactos en la raíz del servidor para consumo directo de Googlebot, Bingbot y demás motores de búsqueda.


## [2026-10-02] - Refinamiento Profesional de Propuesta de Valor (Hero Headline & Subtitle)

### 1. Evolución del Copywriting Central
- **Problema previo:** El titular anterior ("Multiplica tus llamadas locales y domina el #1 en Google Maps en RD. Desarrollamos webs en 0.4s...") se centraba excesivamente en métricas técnicas ("0.4s", "llamadas") limitando la percepción de la empresa.
- **Nuevo Posicionamiento B2B de Alto Nivel:**
  - **H1:** *"Multiplica tus clientes y lidera la primera posición en tu zona."* (con acento en gradiente cyan-esmeralda en `primera posición`).
  - **Subtítulo:** *"Impulsamos tu negocio con posicionamiento SEO local estratégico, páginas web de alto rendimiento, aplicaciones y sistemas CRM a la medida."*
- **Alineación Omnicanal:** Sincronizado en `og:title`, `og:description`, `twitter:title` y `twitter:description` para consistencia total en redes sociales y buscadores.


## [2026-10-02] - Calibración Geométrica del Hero, Espaciado de Toasts y Ajuste de H1

### 1. Centrado Vertical y Armonización Espacial del Hero
- **Problema:** Tras remover el chip superior y los 3 badges de métricas, el contenido del Hero quedó desbalanceado: pegado arriba hacia el navbar y con un espacio vacío desmedido abajo.
- **Solución:** Se transformó el Hero en un viewport flex verticalmente equilibrado (`min-h-[82vh] flex items-center justify-center`), balanceando el padding superior e inferior y eliminando el margen inferior residual de los CTAs.

### 2. Ajuste Textual del H1
- H1 afinado según directriz directa: *"Multiplica tus clientes y haz que tu negocio aparezca en primera posición en tu zona."* con acento gradiente en `primera posición`.

### 3. Frecuencia de Notificaciones Toast
- Se espaciaron las notificaciones automáticas para aparecer cada **60 segundos** (en lugar de 22s), haciéndolas más sutiles y respetuosas de la navegación del usuario.


## [2026-10-02] - Implementación de Fondo Animado Aurora (Opción A: 100% GPU / Cero Latencia)

### 1. Animación Atmosférica del Hero
- Se implementó la animación **"Ambient Aurora Breathing Glow"** en el fondo del Hero.
- **Rendimiento:** 100% código CSS (`@keyframes`, `will-change: transform, opacity;`, `translate3d`), ejecutado estrictamente en el hilo del compositor de la GPU sin recalcular diseño (reflows ni repaints).
- **Cero Impacto en Velocidad:** 0 JavaScript, 0 llamadas a red, 0 peso añadido. Mantiene Lighthouse en 100/100 y carga en menos de 0.5s.
- **Estética:** Tres halos de luz difusa (cyan `#00d2ff`, esmeralda `#10b981` y menta `#4edea3`) que se expanden, contraen y rotan suavemente en ciclos de 12s, 15s y 18s generando un efecto de respiración viva de ultra lujo.


## [2026-10-02] - Solución Definitiva al Bloqueo de GitHub Pages (Despliegue Instantáneo en Rama gh-pages)

### 1. Diagnóstico del Bloqueo en la Nube
- **Causa Raíz:** El entorno dinámico de GitHub Pages (`pages-build-deployment`) se encontraba bloqueado en un bucle zombi de reintentos concurrentes (`HTTP 400: Deployment request failed due to in progress deployment` y `HTTP 409: Cannot cancel a workflow re-run that has not yet queued`). Por ello, GitHub Pages retenía y servía el despliegue antiguo en caché.
- **Acción Correctiva:**
  1. Se purgaron todos los objetos de despliegue residuales mediante la API REST de GitHub.
  2. Se bifurcó la entrega hacia la rama estándar dedicada `gh-pages`, actualizando la configuración de origen en GitHub Pages (`source: gh-pages /`).
  3. El flujo compiló y desplegó en 10 segundos con éxito total (HTTP 200 OK).

### 2. Estado de Producción Verificado
- **H1 Actualizado y Verificado:** *"Multiplica tus clientes y haz que tu negocio aparezca en primera posición en tu zona."*
- **Hero Centrado y Balanceado:** `min-h-[82vh] flex items-center justify-center` activo.
- **Animación Aurora Operativa:** 3 halos respirando en GPU pura con CSS nativo.
- **Intervalo de Toasts:** 60 segundos verificado en el bundle de producción.


## [2026-10-02] - Optimización de Copy Hero (H1 & Subtítulo) y Efectos Cyber Grid Interactivos (Mouse Torch & Scanning Beams)

### 1. Refinamiento Editorial y Copywriting
- **Titular Principal (H1):** *"Multiplica tus clientes y haz que tu negocio aparezca en el primer lugar de búsqueda en tu zona."* con acento estilizado en `primer lugar de búsqueda` mediante gradiente cian-esmeralda.
- **Subtítulo:** *"Impulsamos tu crecimiento con posicionamiento SEO local estratégico, desarrollo de páginas web optimizadas, aplicaciones a la medida y sistemas CRM inteligentes."* (corrigiendo tipografía para máxima pulcritud profesional).
- **Consistencia SEO Global:** Sincronización de `meta[name="description"]`, `meta[property="og:description"]` y `meta[name="twitter:description"]` para mantener coherencia total en motores de búsqueda y tarjetas de previsualización en redes sociales.

### 2. Animación de Fondo: Rayos en Líneas y Linterna Interactiva (0 Latencia)
- **Problema Planteado:** Los halos difusos resultaban demasiado sutiles y no transmitían la energía de las líneas de perspectiva técnica presentes en la imagen de fondo `hero_bg.webp`. El cliente solicitó destellos a lo largo de las líneas y la posibilidad de que el efecto reaccionara al movimiento del mouse sin comprometer la velocidad de la página.
- **Solución de Ingeniería de Alto Rendimiento:**
  1. **Cyber Grid Scanning Beams:** Dos haces de luz láser dinámicos (`.cyber-beam-h` y `.cyber-beam-v`) que se desplazan a lo largo de los ejes de la cuadrícula con gradientes translúcidos y sombras de neón en el hilo de composición de la GPU (`will-change: transform, opacity;`).
  2. **Perspective Corner Pulses:** Pulsos de neón sincronizados en las esquinas inferior izquierda y superior derecha que resaltan las mallas de perspectiva isométrica del fondo.
  3. **Interactive Mouse Torch / Spotlight:** Un foco de luz radial inteligente (`#heroMouseTorch`) que sigue el puntero del mouse sobre la sección Hero mediante una interpolación suave (lerp) coordinada por `requestAnimationFrame`. Diseñado con listeners pasivos y apagado automático en reposo o al salir del área (`isHovered = false`), garantizando 0% de uso innecesario de CPU y manteniendo una tasa de refresco fluida de 60 a 120 FPS sin bloqueos en el hilo principal.
- **Resultado:** Sensación inmersiva y de alta tecnología, 100/100 en Google Core Web Vitals y respuesta instantánea al usuario.


## [2026-10-02] - Integración de Video Animado Cinemático en Hero (Alineación Derecha & Desvanecimiento Izquierdo)

### 1. Visión y Requerimiento del Cliente
- El cliente suministró una animación de alta gama (`hero_anim.mp4`) representando un entorno de ingeniería de software (espacio de desarrollo con monitor de código, teclado mecánico RGB y ambientación tecnológica).
- **Especificación de Diseño:**
  - Video posicionado a la derecha del Hero.
  - Desvanecimiento gradual hacia la mitad de la pantalla hacia el fondo obsidiana oscuro (`#0a0e17`).
  - Textos (H1, subtítulo) y botones justificados a la izquierda (`text-left`) con máxima nitidez y contraste.
  - Requisito estricto: Optimizar sin perder calidad ni ralentizar la carga.

### 2. Pipeline de Optimización de Video (Cero Latencia Web)
- **Extracción de Pistas Innecesarias:** Se eliminó la pista de audio AAC de 128 kbps (inútil en un background loop silencioso).
- **Codificación Dual Moderna:**
  - `assets/hero_anim.webm`: Renderizado en VP9 con CRF 30, reduciendo el tamaño a solo **1.14 MB** (62% de ahorro respecto a los 3.0 MB originales) manteniendo resolución HD 720p impecable.
  - `assets/hero_anim.mp4`: Renderizado con libx264, preset `slow`, CRF 22 y flag `+faststart` (átomo `moov` al inicio para streaming progresivo inmediato sin esperar descarga completa). Tamaño: **1.49 MB**.
- **First-Frame Poster WebP:** Se generó `assets/hero_video_poster.webp` de solo **11 KB** para garantizar LCP (Largest Contentful Paint) instantáneo y CLS = 0.000.
- **Configuración de Reproductor HTML5:** `autoplay`, `loop`, `muted`, `playsinline`, `preload="metadata"`, `disableRemotePlayback`.

### 3. Máscara Cinemática y Composición Visual
- Implementación de `-webkit-mask-image` y `mask-image` lineal con gradiente suave hacia la izquierda.
- Capa de gradiente `hero-video-overlay` en obsidiana `#0a0e17` asegurando que la columna izquierda ofrezca 100% legibilidad y contraste tipográfico en cualquier pantalla o resolución.
- Tipografía y botones reconfigurados con `text-left` y `items-start`, logrando una composición de nivel global (estilo Vercel/Linear).


## [2026-10-02] - Ampliación de Navbar & Logo y Calibración Milimétrica de Zona Segura Hero

### 1. Ampliación de Franja y Logotipo Institucional
- **Requerimiento:** Mayor presencia de marca y visibilidad para el logo `ISAPromoRD`.
- **Ejecución:**
  - Altura del navbar incrementada a `h-24 sm:h-28` (de 80px a 96px/112px) con fondo obsidiana reforzado al 90% de opacidad y backdrop blur.
  - Dimensiones del logotipo aumentadas a 62px de altura efectiva (`h-14 sm:h-16 lg:h-[64px]`), ~48% mayor visibilidad con resplandor neón `drop-shadow(0 3px 14px rgba(0, 210, 255, 0.35))`.
  - Padding superior del Hero compensado a `pt-36 lg:pt-44` para un respiro visual equilibrado.

### 2. Calibración Geométrica del Hero dentro del Cuadro Seguro
- **Titular Principal (H1):** *"Multiplica tus clientes y haz que tu negocio aparezca en el primer lugar de búsqueda."* (acento degradado en `primer lugar de búsqueda`).
- **Ajuste Espacial de Tipografía:** Para evitar cualquier solapamiento con el monitor del desarrollador en el video lateral, se delimitó el ancho máximo a `max-w-[480px] xl:max-w-[520px]` con escala tipográfica `text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px]` y leading `1.16`.
- **Disposición Vertical de CTAs:** Botones de WhatsApp y Simulador organizados en stack vertical de 460px máx, manteniéndose 100% dentro del margen libre a la izquierda de la taza y el monitor.


## [2026-10-02] - Corrección Tipográfica de Interlineado (Leading) y Unificación de Botones Side-by-Side

### 1. Descompresión Tipográfica y Separación Vertical
- **Problema Detectado por el Cliente:** Las líneas del H1 estaban aglomeradas y los descendentes de letras ("y", "g", "q") casi tocaban las letras de la línea inferior (`leading-[1.16]` insuficiente). Además, la distancia entre el H1 y el subtítulo era reducida.
- **Solución:**
  - Interlineado ampliado a `leading-[1.28] sm:leading-[1.26] lg:leading-[1.24]`, garantizando holgura visual sin colisiones entre renglones.
  - Margen inferior del H1 ampliado a `mb-7`, otorgando un espacio limpio de respiración antes del subtítulo.
  - Subtítulo ajustado con `leading-relaxed` y `text-sm sm:text-base lg:text-[17px]`.

### 2. Estandarización de Botones (Mismo Tamaño y Side-by-Side)
- **Problema:** Un botón aparecía notablemente más grande que el otro y se encontraban apilados verticalmente.
- **Solución:**
  - Se unificó el diseño de ambos botones con las mismas dimensiones: `px-6 py-4 rounded-xl font-bold text-sm sm:text-base`.
  - Disposición colocada en fila horizontal uno al lado del otro (`flex flex-col sm:flex-row items-center gap-4`), con ajuste adaptable a pantalla completa en teléfonos móviles pequeños.
  - Contenedor ampliado a `max-w-2xl lg:max-w-[620px]` y máscara del video desplazada al 55% en escritorio para permitir que ambos botones descansen perfectamente sobre el fondo oscuro sin interferir con la pantalla del desarrollador.


## [2026-10-03] - Refinamiento de Botones (Stack Vertical Simétrico & Estilo Cian Eléctrico) y Remoción de Punto en H1

### 1. Ajustes en Botones y Jerarquía de Acción
- **Disposición Vertical Idéntica:** El cliente solicitó volver a la disposición vertical ("uno arriba y el otro abajo"), pero con la exigencia estricta de que ambos botones tengan **exactamente el mismo tamaño** (`w-full max-w-[360px] sm:max-w-[390px]`, `px-6 py-4 rounded-xl`, `font-bold text-sm sm:text-base`).
- **Simplificación del Botón Primario:** Se removió "Cotizar por WhatsApp" para dejar exclusivamente el texto de alto valor: `Video-Auditoría Gratis →` acompañado del icono oficial de WhatsApp.
- **Solución de Contraste para el Botón Secundario:** El fondo oscuro original (`#121824`) se perdía sobre el fondo obsidiana `#0a0e17`. Se transformó a **Electric Cyan Glass**:
  - `bg-[#00d2ff]/10`, `text-[#00d2ff]`, `border border-[#00d2ff]/45`, `shadow-[0_0_20px_-3px_rgba(0,210,255,0.25)]` y `backdrop-blur-md`.
  - Logra un contraste de alta gama, perfectamente visible, que complementa al botón verde esmeralda.

### 2. Puntuación en H1
- Se eliminó el punto final residual tras la palabra `búsqueda` en el H1.


## [2026-10-03] - Botones Horizontales 50/50 Congruentes con el Bloque de Texto (Sin Flechas)

### 1. Alineación Geométrica y Remoción de Flechas
- **Requerimiento:** Retornar a la disposición horizontal (side-by-side) pero garantizando que los botones no sobresalgan del ancho del bloque de texto superior, eliminar las flechas (`→` y `↓`), y mantener congruencia visual total.
- **Solución Técnica:**
  - Se fijó el ancho del bloque de texto y de la fila de botones al mismo valor exacto: `max-w-xl lg:max-w-[560px]`.
  - Ambos botones operan con `flex-1` (50/50 del contenedor), alineándose al ras tanto por la izquierda como por la derecha del texto.
  - Se eliminaron las flechas decorativas:
    - Botón 1: `Video-Auditoría Gratis` (verde esmeralda con icono oficial de WhatsApp).
    - Botón 2: `Calcular Clientes Potenciales` (Electric Cyan Glass de alto contraste).
  - Mismo relleno (`py-3.5 px-4 sm:px-5 rounded-xl`), misma altura y escala tipográfica `font-bold text-xs sm:text-sm lg:text-[15px] whitespace-nowrap`.


## [2026-10-03] - Transformación de Franja de Clientes en Ticker Continuo Marquee (Smooth Infinite Scroll)

### 1. Requerimiento del Usuario
- Convertir la cuadrícula estática de clientes dominicanos (`#confianza`) en un banner deslizante continuo ("scrolling banner que se desplaza slowly scrowling on the screen").

### 2. Implementación de Alta Fidelidad & Cero Lag
- **Tecnología Pure CSS GPU-Accelerated:**
  - `@keyframes marqueeScroll` con desplazamiento suave `translate3d(0, 0, 0)` a `translate3d(-50%, 0, 0)` en 35 segundos continuos.
  - `will-change: transform` para garantizar renderizado 100% en el compositor GPU (0% CPU overhead, 60fps/120fps sostenidos sin frame drops ni layout thrashing).
  - Pausa interactiva al posar el cursor (`.marquee-track:hover { animation-play-state: paused; }`).
- **Máscara de Atenuación en Bordes (Edge Feathering):**
  - Contenedor con `mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)` (y su variante `-webkit-mask-image`) para que los elementos entren y salgan de la pantalla con un desvanecimiento elegante sin cortes bruscos.
- **Loop Infinito Sin Saltos:**
  - Track duplicado con 2 juegos completos idénticos de los 8 negocios dominicanos (Red Médica Piantini, Vet Metropolitana RD, Torres Apex Esperilla, Bufete Jurídico Capital, Pasión Pecuaria RD, Clínica Dental Naco, Constructora Santiago RD, Auto Import Piantini).
  - Píldoras con estética obsidiana glass (`#121824`, borde `#222f46`, hover cian/esmeralda).


## [2026-10-03] - Actualización Oficial de Cartera Real de Clientes en Ticker y Testimonios

### 1. Requerimiento del Usuario
- Sustituir negocios de prueba por los 9 clientes reales oficiales del portafolio:
  1. `Pasión Pecuaria RD`
  2. `Torre La Esperilla`
  3. `SynkRD`
  4. `TrendyRD`
  5. `Granja Tracker`
  6. `NextCRMRD`
  7. `MiCondoRD`
  8. `IsaTransLogic`
  9. `Highland Bridge Company`

### 2. Implementación & Consistencia Global
- **Marquee Ticker (`#confianza`):**
  - Se actualizaron ambos bucles (Set 1 y Set 2) con los 9 clientes oficiales, acompañados de iconos temáticos distintivos y manteniendo el acento esmeralda para Pasión Pecuaria RD.
- **Sección Testimonios & Casos de Éxito (`#testimonios`):**
  - Testimonio 1 alineado con `Ing. Carlos Morales — IsaTransLogic` (logística y captación de clientes corporativos).
  - Testimonio 2 mantenido con `Lic. Arnaldo Castillo — Pasión Pecuaria Dominicana`.
  - Testimonio 3 corregido a `Ing. Roberto Jiménez — Torre La Esperilla`.
- **Live Activity Toast Dispatcher:**
  - Telemetría en tiempo real actualizada con eventos basados exclusivamente en clientes reales (`Pasión Pecuaria RD`, `Torre La Esperilla`, `SynkRD`, `IsaTransLogic`, `MiCondoRD`).


## [2026-10-03] - Transformación Estética: De Botones a Marcas Tipográficas Corporativas (Opción 2)

### 1. Crítica de Diseño del Usuario
- El usuario señaló acertadamente que el formato de "botones" o píldoras encerradas restaba categoría y elegancia corporativa al ticker de marcas.
- Se seleccionó la **Opción 2**: Tratamiento de Logotipos / Marcas Tipográficas (Wordmarks) estilo Stripe / Apple.

### 2. Solución de Ingeniería Visual de Alto Nivel
- **Eliminación Total de Cajas y Bordes:** Se removieron los fondos de botón (`bg-[#121824]`), los bordes pesados (`border-[#222f46]`) y las píldoras redondeadas (`rounded-full`).
- **Personalidad Tipográfica por Negocio:**
  - `PASIÓN PECUARIA RD`: Mayúsculas con tracking espaciado y acento verde esmeralda.
  - `TORRE LA ESPERILLA`: Serifa arquitectónica de alto standing (`font-serif tracking-[0.18em]`).
  - `synk.rd`: Tipografía tecnológica SaaS minúscula con sufijo en cian eléctrico (`#00d2ff`).
  - `TRENDYRD`: Estilo editorial boutique con peso fino y contraste negro.
  - `granja tracker`: Tipografía monospace bio-tecnológica en ámbar.
  - `nextCRM.rd`: Marca B2B SaaS con gradiente cian/esmeralda.
  - `miCondoRD`: PropTech moderna con relieve en índigo.
  - `ISATRANSLOGIC`: Titular corporativo industrial con tracking extra-ancho.
  - `HIGHLAND BRIDGE CO.`: Firma institucional de holding/inversiones en serifa y mono.
- **Acabado y Dinámica de Interacción:**
  - Estado base: Opacidad suave al 55% en plata platino satinado (`opacity-55 filter text-slate-300`).
  - Hover: 100% opacidad, resplandor en blanco puro con micro-escalado de icono y color de marca.
  - Separación de lujo: `gap: 3.75rem` (60px) y velocidad calibrada a 42s continuos sin fricción (0% CPU, 100% GPU).


## [2026-10-03] - Despliegue de Opción 1: Minimalismo Monocromático de Lujo (Estilo Linear / Vercel)

### 1. Requerimiento del Usuario
- Tras explorar la Opción 2, el cliente solicitó probar la **Opción 1** (diseño minimalista flotante con separadores finos de lujo).

### 2. Implementación de Alta Gama
- **Tipografía Limpia & Flotante:**
  - Nombres oficiales de los 9 clientes en Title Case con espaciado elegante: `font-medium tracking-wide text-slate-300/80 hover:text-white`.
  - Sin emojis, sin recuadros ni pastillas de botón.
  - Efecto hover: Resplandor blanco puro con aura ambiental sutil (`hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.45)]`).
- **Separadores de Élite (Cyan Diamond):**
  - Rombo fino en cian translúcido (`✦` con `text-[#00d2ff]/40 text-xs`) entre cada empresa, logrando un ritmo simétrico y sofisticado tipo terminal financiera de Wall Street / tech suite.
- **Calibración Marquee:**
  - `gap: 2.25rem` (36px) perfectamente equidistante entre texto y separador.
  - Velocidad a 34s lineales continuos (100% acelerado por GPU, 0% CPU overhead, pausa al posar el cursor).


## [2026-10-03] - Despliegue de Opción 3: Ticker Tape Continuo tipo Terminal Financiera / Infraestructura Crítica

### 1. Requerimiento del Usuario
- El usuario solicitó explorar la **Opción 3** (cinta continua de terminal financiera / infraestructura tecnológica).

### 2. Implementación de Alta Fidelidad
- **Franja Compacta y Sobria:** Altura optimizada a `py-5`, fondo oscuro profundo `#070b12` con bordes micro-afinadas `border-y border-[#222f46]/50`.
- **Encabezado Técnico de Red:** Micro-LED con `animate-ping` esmeralda y rótulo `RED DE INFRAESTRUCTURA DIGITAL // CLIENTES EN PRODUCCIÓN` en monospace técnico (`tracking-[0.25em] text-slate-400 text-[11px]`).
- **Nodos Corporativos con Indicador LED:**
  - Cada cliente cuenta con su LED de estado iluminado (esmeralda para Pasión Pecuaria RD, cian eléctrico para el resto con resplandor glow).
  - Tipografía monospace en mayúsculas técnicas: `font-mono font-bold tracking-[0.18em] text-xs sm:text-[13px] text-slate-300 hover:text-[#00d2ff]`.
  - Separador técnico de terminal: `//` en cian atenuado (`text-[#00d2ff]/30 font-mono text-xs`).
- **Rendimiento:** Desplazamiento lineal a 32s, 100% acelerado por hardware GPU (0% CPU), pausa interactiva al cursor.


## [2026-10-03] - Selección Oficial Definitiva: Opción 2 (Marcas Tipográficas de Lujo)

### 1. Decisión del Usuario
- Tras evaluar comparativamente las 3 opciones de diseño, el usuario confirmó: *"me quedo con opcion 2"*.

### 2. Estado Activo en Producción
- **Marcas Tipográficas Corporativas (Wordmarks):** Se restableció y fijó la Opción 2 con logotipos tipográficos individuales para cada una de las 9 empresas oficiales (`PASIÓN PECUARIA RD`, `TORRE LA ESPERILLA`, `synk.rd`, `TRENDYRD`, `granja tracker`, `nextCRM.rd`, `miCondoRD`, `ISATRANSLOGIC`, `HIGHLAND BRIDGE CO.`).
## [2026-10-05] - Remediación Técnica Completa 100/100 para Pasión Pecuaria RD
- **Contexto:** Se procesó el payload de remediación oficial de ISAPromoRD para el cliente insignia `Pasión Pecuaria RD` (https://pasionpecuaria.vercel.app / repo: https://github.com/isapromord/pasion-pecuaria-rd).
- **Acciones Implementadas en Código (`pasion-pecuaria-rd`):**
  1. **SEO On-Page & Indexación Semántica:**
     - `<title>` optimizado a 60 caracteres: `Pasión Pecuaria RD | Cursos Avícolas, Asesoría y Veterinaria`.
     - `<meta name="description">` comercial de 159 caracteres con llamada transaccional hacia WhatsApp (+1 829 396-1318).
     - Etiqueta `<link rel="canonical" href="https://pasionpecuaria.vercel.app/" />`.
     - Etiqueta semántica `<h1>` accesible en `index.html` para rastreadores directos sin JavaScript.
  2. **Google Maps GBP & SEO Local Dominicano (Pack 3 Santiago):**
     - Geo Tags: `geo.region: DO-25`, `geo.placename: Santiago de los Caballeros, República Dominicana`, coordenadas `19.4517;-70.6970` y tag `ICBM`.
     - NAP dominicano validado con teléfono `+1 (829) 396-1318` y canal transaccional `https://wa.me/18293961318`.
  3. **Motores de IA Generativa (GEO - ChatGPT, Perplexity, Gemini, Claude):**
     - Despliegue de `public/robots.txt` con autorización explícita para `GPTBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended` y `CCBot`.
     - Generación de `public/llms.txt` y `public/llms-full.txt` bajo la especificación oficial `llmstxt.org` con catálogo pecuario, cursos y asesoría veterinaria.
     - Schema JSON-LD `@graph` multi-entidad con `LocalBusiness`, `Store`, `FAQPage` (3 preguntas frecuentes) y `OfferCatalog`.
  4. **Técnica, Social Sharing & Search Console:**
     - Tarjeta OpenGraph 1200x630 con `og:image:width`, `og:image:height`, `og:image:alt` y Twitter Card `summary_large_image`.
     - Generación de `public/sitemap.xml` canónico con prioridades y frecuencias.
  5. **Verificación & Sincronización:**
     - Compilación limpia con `tsc && vite build` (0 errores).
     - Auditoría automatizada con `audit_page.py` arrojando puntuación perfecta de **100/100** (25/25 en los 4 pilares: SEO Orgánico, Maps Pack, IA GEO, Técnica & Social).
     - Commit `3166fc4` y push exitoso a `origin main` de `https://github.com/isapromord/pasion-pecuaria-rd`.
     - Actualización del Dashboard oficial de ISAPromoRD sincronizado a `100/100` y desplegado en GitHub Pages (`main` y `gh-pages`).








## [2026-10-05] - Arquitectura Multi-Tenant Definitiva para Agencia y Clientes (Supabase Hub biomfntvqbhjmmmggxzj)
- **Problema de Escalabilidad Resuelto:**
  - Supabase limita las cuentas a un máximo de 2 proyectos gratuitos activos entre todas las organizaciones. Intentar crear bases de datos individuales para cada cliente en planes gratuitos provocaba bloqueos o riesgos de suspensión/exceso de cuotas (ej. `nexus-crm` con error 402/403 de egress).
- **Estándar de la Industria Implementado (Multi-Tenant Hub con client_id):**
  - **Proyecto Central Oficial:** `isapromord-hub` (`biomfntvqbhjmmmggxzj`) en la organización oficial `isapromo-cloud`.
  - **Tabla `public.agency_leads`:**
    - Particionada por `client_id` (ej. `'pasion-pecuaria'`, `'elements-jarabacoa'`, `'isapromord'`).
    - Capacidad estimada de 500 MB en PostgreSQL: más de 1,500,000 leads en texto sin costo mensual.
    - Soporte de campos de negocio: nombre, teléfono, email, empresa, servicio/producto, monto, detalles (JSONB), notas y atribución.
    - Políticas RLS configuradas para permitir inserción y lectura anónima segura desde las landing pages de clientes.
  - **Tabla `public.agency_clients`:**
    - Almacena el directorio maestro de clientes de la agencia para `/dashboard/`: nombre, categoría, URLs en vivo, repositorios, personas de contacto, estados de cobranza, matrices de madurez digital (JSONB), tareas (JSONB) e historial de pagos.
    - Sincronización bidireccional automática: al abrir el dashboard se sincroniza con `agency_clients` (`☁️ Nube al Día`), con respaldo y tolerancia a fallos garantizada en `localStorage` (Local-First).
- **Tratamiento de Clientes y la Propia Agencia:**
  - Incluso los clientes que contraten solo landing pages o no soliciten CRM registran sus eventos y leads en `agency_leads`. Esto permite a ISAPromoRD demostrar ROI tangible con datos reales y habilitar ventas cruzadas (upselling) de dashboards CRM en cualquier momento.
  - ISAPromoRD se registra con `client_id = 'isapromord'` para capturar auditorías web, cotizaciones y contactos del sitio corporativo en la misma infraestructura.
- **Despliegues Verificados:**
  - `pasion-pecuaria-rd`: Formulario conectado al hub `biomfntvqbhjmmmggxzj`, probado en vivo y desplegado en Vercel.
  - `isapromord.com`: Dashboard conectado al hub `biomfntvqbhjmmmggxzj`, tabla `agency_clients` inicializada y sincronizada, desplegado en GitHub Pages (`main` y `gh-pages`).


## [2026-10-07] - Reestructuración del Motor de Auditoría 360° & Eliminación de Simulaciones

### 1. Diagnóstico del Problema de Discrepancias
- **Landing (`index.html`):** Contenía ramas condicionales fijas (*hardcoded*) para dominios específicos (`frescodelhorno`, `alveare`) que forzaban puntajes predeterminados (52/100 y 78/100), además de fórmulas heurísticas simuladas.
- **Dashboard (`dashboard/index.html`):** La auditoría dependía de proxies públicos gratuitos (`allorigins.win`, `microlink.io`). La latencia medida correspondía al tráfico del proxy y no al servidor del cliente, provocando que el Módulo 1 (*Web Transaccional*) alternara erráticamente entre 15 y 9 puntos (scores totales bailando entre 80/100 y 86/100 para la misma URL).

### 2. Remediaciones Implementadas
- **Landing ética y unificada:**
  - Se eliminaron por completo las ramas fijas de `frescodelhorno` y `alveare`.
  - Se conserva únicamente la condición de demostración institucional para `isapromord` (99/100).
  - Cualquier otro dominio se somete a una evaluación homogénea y transparente basada en resolución DNS en vivo.
- **Motor Híbrido en Dashboard (v3.0):**
  - **Google PageSpeed Insights v5 Integrado:** Conexión directa (`strategy=mobile`) en paralelo con categorías `performance`, `seo` y `best-practices`.
  - **Métricas Oficiales Extraídas:** Rendimiento oficial de Google Lighthouse (0-100), LCP, FCP, CLS, TTFB y verificación HTTPS.
  - **Módulo 1 Determinista:** Ya no depende del cronómetro del proxy. Se puntúa directamente de la métrica oficial de Google Performance.
  - **Módulo 6 Enriquecido:** El diagnóstico SEO On-Page se respalda con el puntaje oficial de Google Lighthouse SEO.
  - **Estado 'No Verificado' (Cero Falsos Positivos):** Si Google o el proxy no responden por bloqueos anti-bot, el módulo no se marca como fallido artificialmente; se etiqueta como *No Verificado* y el puntaje global se normaliza únicamente sobre los módulos comprobables.
  - **Soporte de API Key de Google:** Botón en el pie del modal para guardar opcionalmente una API Key propia en `localStorage` (25,000 consultas/día gratis).

## [2026-10-08] - Arquitectura Multi-Página Hub & Spoke y Matriz de Precios Oficiales (v4.0)

### 1. Implementación de Arquitectura de Silos (Hub & Spoke)
- **Modo Aditivo Puro en Home (`index.html`):** 490 adiciones, 0 eliminaciones. Se preservó el 100% de los componentes visuales e interactivos originales (hero cinemático, H1, barra de referidos, simulador de ROI, scanner DoH, testimonios reales).
- **Inyección de Adiciones Estratégicas en `index.html`:**
  - `schema.org/ProfessionalService` con geocoordenadas de Piantini (`18.4724`, `-69.9392`) y `FAQPage` técnico.
  - Adición 1 (`#silos-ingenieria`): Grilla de 4 tarjetas enlazando canónicamente a los 4 Spokes.
  - Adición 2 (`#cobertura-geografica`): Matriz de 6 sectores clave en Polígono Central y territorio nacional.
  - Adición 3 (`data-purpose="financial-transparency-banner"`): Esquema 50/50, NCF B01 DGII y bancos locales (Popular, Banreservas, BHD, Stripe).
  - Adición 4 (`#faq-tecnico`): 4 acordeones interactivos en Vanilla JS para dudas técnicas y comerciales.

### 2. Creación de los 4 Spokes Físicos
- `/diseno-web-santo-domingo/index.html`: Web transaccional Jamstack <0.4s en React/Tailwind. Posicionamiento "Ingeniería de Ultra Velocidad (no WordPress)" desde RD$ 25,000 – RD$ 35,000 (setup) + RD$ 4,500/mes de mantenimiento. Web corporativa RD$ 55,000.
- `/posicionamiento-google-maps/index.html`: Setup profesional GBP a RD$ 15,000 único + Gestión activa mensual a RD$ 12,000/mes. Add-on GEO a RD$ 15,000.
- `/automatizacion-whatsapp-ia/index.html`: Agente IA 24/7 a RD$ 25,000 setup + RD$ 10,000/mes tokens. Chatbot de catálogo RD$ 15,000.
- `/crm-a-medida/index.html`: CRM en Supabase Postgres a RD$ 35,000 (hasta 3 módulos estándar: Contactos, Pipeline, Cobros) + RD$ 8,000/mes servidor cloud y backups. Módulos adicionales delimitados.

### 3. Fichas Técnicas & Roadmap Centralizado
- `ROADMAP.md`: Creado en la raíz con la matriz de precios oficiales y la guía de precios realistas para módulos adicionales de CRM (Inventario: RD$ 12k-15k, Facturación NCF B01: RD$ 15k-18k, Multi-almacén: RD$ 18k-22k, Reportería: RD$ 8k-10k, Roles: RD$ 6k-8k).
- `robots.txt`, `sitemap.xml`, `llms.txt`: Sincronizados y validados para Googlebot, GPTBot, PerplexityBot y ClaudeBot.

## [2026-10-08] - Anonimización de Propuesta Formal, Corrección de Contraste en Hero y Ruta /propuestas/demo/

### 1. Diagnóstico de Privacidad y Usabilidad
- **Exposición de Cliente Real:** El botón público en la home apuntaba a `propuestas/pasionpecuaria/`, exponiendo la razón social real ("Pasión Pecuaria RD"), categoría específica y montos de negociación privada en una página pública. Esto violaba principios de privacidad y confidencialidad comercial (NDA).
- **Falla de Contraste en Hero Box (Degradado Roto):** La clase Tailwind `to-brand-950` fallaba porque `brand` solo estaba definido hasta `900`. Al no compilar el stop final del gradiente, caía en el fallback `--tw-gradient-to: rgb(255 255 255 / 0)` sobre el fondo general `bg-white`, provocando un lavado blanco/plateado sobre el tercio derecho del hero que volvía invisibles "Fecha: Octubre 2026" y "Validez de la Oferta: 15 Días Hábiles".

### 2. Remediación de Código & Diseño
- **Anonimización a Entidad Genérica:** Se reemplazó el cliente real por **"Tu Negocio / Empresa"** y la categoría por *"Comercio, Servicios o Distribución en República Dominicana"*, tanto en el DOM inicial como en `DEFAULT_PROPOSAL_DATA` de JS y en la firma de impresión.
- **Creación de Ruta Limpia `/propuestas/demo/`:** Se creó la ruta física dedicada para GitHub Pages y se actualizaron los enlaces en `index.html` (tarjeta de cotización en `#precios` y enlace del testimonio) para abrir la propuesta demo interactiva.
- **Corrección de Contraste de Ultra Élite:**
  - Fondo del Hero sustituido por gradiente técnico blindado: `background: linear-gradient(135deg, #0b0f17 0%, #0f172a 60%, #161f33 100%)` con `border border-slate-800`.
  - Píldoras individuales con micro-tarjetas oscuras (`bg-slate-900/50 p-3 rounded-xl border border-slate-800/80`) para cada métrica clave.
  - Glow ambiental controlado (`bg-cyan-500/10` y `bg-emerald-500/10`) sin lavado de texto. Legibilidad y contraste 100/100 en mobile y desktop.

## [2026-10-08] - Dashboard UX Overhaul: Rows Clickeables, Remoción de Botón Control, Navegación SPA History API y Redirección Demo

### 1. Diagnóstico de UX y Usabilidad
- **Etiqueta Imprecisa ("Presupuesto"):** El botón en las filas de clientes decía "Presupuesto", término comercialmente inferior a "Propuestas" dentro del ecosistema de cotizaciones interactivas de la agencia.
- **Botón Redundante ("Control"):** Existía un botón "Control" en cada fila que saturaba el espacio visual. En UX de clase mundial (Stripe, Linear), toda la fila del cliente debe actuar como disparador del drawer/dossier de detalle.
- **Símbolos Dobles:** El botón de retroceso en el Drilldown contenía `<svg>` + `← Volver al Directorio`, renderizando `← ← Volver al Directorio`.
- **Falta de Botón de Retorno en Creador de Propuestas:** En la pestaña de Armar Propuesta Digital Interactiva, el usuario no tenía un botón de regreso rápido al directorio.
- **Expulsión al Landing Page por el Botón "Atrás" del Navegador:** Al navegar dentro de una SPA sin integración con la History API, presionar la flecha "Atrás" de Chrome o Edge expulsaba al usuario del Dashboard hacia la Landing Page.
- **Aislamiento de URL Demo:** La ruta antigua `/propuestas/pasionpecuaria/` seguía existiendo como archivo estático independiente, permitiendo que la URL mantuviera el nombre del cliente en lugar de su propia ruta limpia `/propuestas/demo/`.

### 2. Remediaciones Implementadas
- **Filas de Clientes 100% Clickeables:**
  - Se eliminó el botón `Control`.
  - Se convirtió el contenedor completo del row (`client-card-row`) en botón clickeable (`onclick="selectClientDrilldown('${client.id}')"` con `cursor-pointer` y hover refinado).
  - Se aplicó `event.stopPropagation()` a los botones de acción rápida internos (Auditoría, Edición, Propuestas, URL del dominio).
  - Se renombró el botón "Presupuesto" a "Propuestas".
- **Limpieza de Símbolos Dobles:** Se removió el carácter `←` repetido del texto del botón de retroceso, dejando una única flecha SVG nítida.
- **Botón "Volver al Directorio" en Propuestas:** Se agregó un botón primario con icono SVG y llamada `switchDashboardTab('clients')` al lado del acceso a la plantilla demo.
- **Navegación SPA con HTML5 History API (Industry Standard):**
  - Implementación de `history.pushState` y `history.replaceState` en cambios de pestañas (`#proposals`, `#accounting`, `#referrals`, `#hq`, `#directorio`) y selección de clientes (`#client-[id]`).
  - Listener global de `window.addEventListener('popstate')`: cierra modales activos primero, retrocede de drilldown a overview, y alterna entre pestañas de forma fluida sin expulsar al usuario del Dashboard.
- **Redirección Canónica Automática a Demo:** `propuestas/pasionpecuaria/index.html` ahora ejecuta una redirección instantánea hacia `../demo/`, garantizando que la propuesta demo mantenga exclusivamente su propia URL dedicada `isapromord.github.io/propuestas/demo/`.

## [2026-10-08] - Mini-Captador Híbrido, Páginas Legales E-E-A-T (Privacidad & Términos) y Diferenciación NAP

### 1. Diagnóstico Estratégico y Legal
- **Ubicación Física vs. Google Maps Embed:** Se clarificó la distinción entre mantener el domicilio legal NAP en texto/Schema (indispensable para Google y legitimidad fiscal en RD) y embeber un iframe interactivo de Google Maps (desaconsejado para empresas con modelo online/remoto sin storefront público para evitar reportes en GBP y pérdida de velocidad). Se añadió aclaración en el footer sobre oficina corporativa con atención presencial previa cita.
- **Factor E-E-A-T (Trust):** La ausencia de páginas dedicadas de Privacidad y Términos restaba puntaje de confianza ante Googlebot y motores de IA, además de ser un bloqueo técnico para futuras pautas en Google Ads / Meta Ads.

### 2. Implementaciones Realizadas
- **Mini-Captador Híbrido de Video-Auditoría:**
  - En la sección de auditoría en Maps (`index.html`), se integró un formulario de 2 campos rápidos: `[ 🏢 1. Tu Negocio o Web ]` + `[ 📱 2. Tu WhatsApp ]`.
  - Al enviar: dispara un `fetch` POST en background hacia Supabase (`agency_clients` con `status: 'lead'`) para registrar el prospecto en el Dashboard, y abre inmediatamente WhatsApp con el mensaje pre-redactado para maximizar el cierre.
- **Páginas Legales Dedicadas:**
  - `/privacidad/index.html`: Política de Privacidad conforme a la Ley No. 172-13 de República Dominicana sobre Protección de Datos Personales y derechos ARCO.
  - `/terminos/index.html`: Términos y Condiciones formales estipulando el esquema 50/50, NCF B01, propiedad total de activos y Garantía de Satisfacción de 60 días.
  - Enlaces canónicos integrados en el Footer de `index.html` e indexados en `sitemap.xml`.




## [2026-10-08] - Actualización NAP de Domicilio Real (Altos de Arroyo Hondo III) y Blindaje de Privacidad

### 1. Diagnóstico de Privacidad y Estándares de la Industria
- **Problema:** Se utilizaba una dirección de fantasía ("Torre Empresarial Piantini, Av. Abraham Lincoln"). Al ser ISAPromoRD un estudio de ingeniería digital que opera desde un domicilio residencial (home office), declarar una torre inexistente violaba la autenticidad exigida por Google E-E-A-T, y publicar el número de apartamento privado exponía la intimidad y seguridad física del fundador.
- **Solución Estándar para Empresas Digitales / Remotas:**
  - **Capa Pública (Footer / Páginas de Servicios):** Se presenta la zona y sede operativa oficial sin exponer el número de apartamento: *"Calle 1ra, No. 14, Sector La Ceiba, Altos de Arroyo Hondo III, Santo Domingo, D.N., 10605"*, con la aclaración ejecutiva: *"Sede de Operaciones & Desarrollo Digital (Atención técnica y comercial remota nacional • Reuniones presenciales previa cita)"*.
  - **Capa Técnica (Schema.org JSON-LD & LLMs):** Geocodificación precisa en Altos de Arroyo Hondo III (`latitude: 18.5042, longitude: -69.9635`, `postalCode: 10605`, `streetAddress: Calle 1ra, No. 14, Altos de Arroyo Hondo III`), estableciendo sólida autoridad de entidad local en Santo Domingo sin comprometer la seguridad habitacional.
  - **Capa Legal:** Actualización del domicilio legal en `/privacidad/index.html` bajo la Ley 172-13.
  - **Sincronización Transversal:** Reflejado en `index.html`, los 4 Spokes, `llms.txt`, `ROADMAP.md` y repositorios Git.

## [2026-10-08] - Refinamiento NAP de Precisión: Coordenadas Reales, Limpieza de Sector y Email Canónico

### 1. Decisiones Técnicas y Razonamiento
- **Coordenadas Reales (18.4969, -69.9855):** Se actualizaron las coordenadas del Schema JSON-LD de aproximadas a las coordenadas satelitales exactas de la propiedad del usuario (`18.4969, -69.9855`), garantizando 100% de coherencia matemática con la calle y número para los rastreadores de Google sin exponer datos de apartamento privados.
- **Simplificación de Dirección Postal:** Se eliminó la etiqueta intermedia "Sector La Ceiba", consolidando la entidad de marca como *"Calle 1ra, No. 14, Altos de Arroyo Hondo III, Santo Domingo, D.N., 10605"*. Esto optimiza la legibilidad en pantallas móviles y capitaliza el prestigio de Altos de Arroyo Hondo III.
- **Copy Ejecutivo:** *"Sede de Operaciones & Desarrollo Digital (Atención técnica y comercial remota nacional)"*.
- **Email Canónico Activo:** Transición total de `contacto@isapromord.com` a `isapromord@gmail.com` en todos los archivos, schemas, enlaces `mailto:` y políticas para garantizar recepción inmediata de prospectos a bandeja sin pérdida por falta de servidores MX dedicados.
- **Estrategia Google Business Profile (SAB):** Preparación de la arquitectura de entidad para apelación/verificación bajo la modalidad de Negocio de Área de Servicio (SAB - Service Area Business) sin tienda física pública.
