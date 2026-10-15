# 🤝 HANDOFF.md — Estado Técnico de IsaPromo RD (isapromord.com)

> **Nodo MBOS:** `isapromord.com`  
> **Última Actualización:** 2026-10-13 (v2.2.1: Consolidación 3-Tier Model 'Good-Better-Best', Correos Gratuitos Incluidos en Combos & Sincronización Total Everywhere)  
> **Repositorio Oficial:** [https://github.com/isapromord/isapromord.com](https://github.com/isapromord/isapromord.com)  
> **Repositorio Root Pages:** [https://github.com/isapromord/isapromord.github.io](https://github.com/isapromord/isapromord.github.io)  
> **URLs EN VIVO Y FUNCIONALES ($0 Costo):**  
> - 🌐 **Root Principal (Rediseño Stitch "Obsidian Cyber Luxe"):** [https://isapromord.github.io/](https://isapromord.github.io/)  
> - 🛡️ **Dashboard Administrador Modular ("Obsidian Cyber Luxe"):** [https://isapromord.github.io/dashboard/](https://isapromord.github.io/dashboard/) (PIN: `3690`)  
> - 📜 **Motor de Contratos y Firma Digital Legal:** [https://isapromord.github.io/contrato/](https://isapromord.github.io/contrato/) (Esquema 50/50, Hash criptográfico, 5 días de gracia, cláusula de Take-Down, firma táctil/clic, sin riesgo DGII/NCF)  
> - ⚡ **Motor de Auditoría 360° (Truth Protocol):** Diagnóstico de los 7 pilares técnicos reales con Pitch de Ventas para Zoom en vivo y guardado en 1 clic.  
> - 💼 **Suite Contable & CFO:** [https://isapromord.github.io/dashboard/](https://isapromord.github.io/dashboard/) (Tab 4: "Finanzas & Contabilidad") — CRUD completo de transacciones, edición, soporte de gastos operativos y conciliación bancaria.  
> - 📄 **Propuesta Demo Interactiva:** [https://isapromord.github.io/propuestas/demo/](https://isapromord.github.io/propuestas/demo/)  
> - 📄 **Motor de Propuestas Dinámicas:** [https://isapromord.github.io/propuesta/](https://isapromord.github.io/propuesta/)  
> - 🗄️ **Base de Datos Multi-Tenant Oficial (Supabase):** `isapromord-hub` (`biomfntvqbhjmmmggxzj`) en organización `isapromo-cloud` — Tablas activas: `agency_clients`, `agency_proposals`, `isapromo_referrals`.  
> **Estado del Sistema:** 100% en línea, 12/12 pruebas unitarias pasando al 100%, cachebuster v2.2.1 activo.

---

### Hitos Completados en v2.2.2 (2026-10-15):
1. **Seguridad y Navegación del Dashboard:**
   - **Lock Screen Modal Z-Index (`z-[9999]`):** Se elevó el modal de bloqueo para cubrir completamente cualquier barra o elemento lateral.
   - **Ocultamiento Total de Menús al Salir/Bloquear:** `lockDashboard()` y `initAuth()` ocultan de forma explícita `#stitchSidebar` y `#mobileBottomNav` (`!hidden`) para evitar cualquier filtración visual detrás de la pantalla de bloqueo.
   - **Logo Táctil a la Landing Page:** El logotipo en la tarjeta de bloqueo ahora es un enlace interactivo directo a `../` (página de inicio).

2. **Reingeniería Móvil y Tipográfica de la Landing Page (`index.html`):**
   - **Eliminación del 'Efecto Letra Pequeña':** Se erradicó el uso excesivo de `text-xs`, `text-[10px]` y `text-[11px]` en textos informativos, insignias y botones en toda la landing page.
   - **Jerarquía Tipográfica Estándar de la Industria (Apple / Stripe / Awwwards Level):**
     - Textos de párrafo y cuerpo de tarjetas elevados a `text-sm sm:text-base` con contraste de alto brillo (`text-slate-200` y `text-slate-300`).
     - Títulos y subtítulos escalados con `leading-relaxed` y `leading-snug` para legibilidad sin esfuerzo al aire libre bajo pantallas móviles.
     - Insignias de confianza, badges de zonas y chips satelitales aumentados a `text-xs sm:text-sm` con padding táctil amplio (`px-3 py-1.5` / `px-2.5 py-1`).
     - Preguntas y respuestas del FAQ técnico aumentadas a `text-base sm:text-lg` (preguntas) y `text-sm sm:text-base` (respuestas).
     - Tarjetas de métricas del escáner en vivo y banner de video-auditoría con tamaños de fuentes e inputs optimizados (`text-sm sm:text-base` con inputs de altura táctil >= 44px).
   - **Hero y Espaciado Responsivo:**
     - Reducción del excesivo padding superior móvil a `pt-28 pb-12` para garantizar que la propuesta de valor y los botones CTA se aprecien en el primer pliegue de pantalla.
     - Contraste del video optimizado en móviles (`0.58` a `0.90`) con gradiente radial y posicionamiento centrado `object-[70%_center]`.
     - Botón flotante de WhatsApp reposicionado a `bottom-8 right-5` con `z-[80]` para evitar solapamientos con botones CTA móviles.

3. **Blindaje de Calidad y Pruebas:**
   - 12 pruebas unitarias automatizadas (`scratch/test_suite.js`) ejecutando al 100% de éxito.
   - Cambios commiteados y desplegados en `main`.
