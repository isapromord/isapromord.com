# 🤝 HANDOFF.md — Estado Técnico de IsaPromo RD (isapromord.com)

> **Nodo MBOS:** `isapromord.com`  
> **Última Actualización:** 2026-10-16 (v2.3.5: Erradicación Integral de Overflows en Modales & Logos Reales en Marquee)  
> **Repositorio Oficial:** [https://github.com/isapromord/isapromord.com](https://github.com/isapromord/isapromord.com)  
> **Repositorio Root Pages:** [https://github.com/isapromord/isapromord.github.io](https://github.com/isapromord/isapromord.github.io)  
> **URLs EN VIVO Y FUNCIONALES ($0 Costo):**  
> - 🌐 **Root Principal (Rediseño Stitch "Obsidian Cyber Luxe"):** [https://isapromord.github.io/](https://isapromord.github.io/)  
> - 🛡️ **Dashboard Administrador Modular ("Obsidian Cyber Luxe"):** [https://isapromord.github.io/dashboard/](https://isapromord.github.io/dashboard/) (PIN: `3690`)  
> - 📜 **Motor de Contratos y Firma Digital Legal:** [https://isapromord.github.io/contrato/](https://isapromord.github.io/contrato/) (Esquema 50/50, Hash criptográfico, 5 días de gracia, cláusula de Take-Down, firma táctil/clic, sin riesgo DGII/NCF)  
> - ⚡ **Motor de Auditoría Pre-Flight:** Diagnóstico estricto de Infraestructura Técnica & Preparación Digital (Pre-Flight Check) con Scope-Aware SLA Scoring y botón de Google PageSpeed oficial.  
> - 💼 **Suite Contable & CFO:** [https://isapromord.github.io/dashboard/](https://isapromord.github.io/dashboard/) (Tab 4: "Finanzas & Contabilidad") — CRUD completo de transacciones, edición, soporte de gastos operativos y conciliación bancaria.  
> - 📄 **Propuesta Demo Interactiva:** [https://isapromord.github.io/propuestas/demo/](https://isapromord.github.io/propuestas/demo/)  
> - 📄 **Motor de Propuestas Dinámicas:** [https://isapromord.github.io/propuesta/](https://isapromord.github.io/propuesta/)  
> - 🗄️ **Base de Datos Multi-Tenant Oficial (Supabase):** `isapromord-hub` (`biomfntvqbhjmmmggxzj`) en organización `isapromo-cloud` — Tablas activas: `agency_clients`, `agency_proposals`, `isapromo_referrals`.  
> **Estado del Sistema:** 100% en línea, 16/16 pruebas unitarias pasando al 100%, cachebuster v2.3.5 activo.

---

### Hitos Completados en v2.3.5 (2026-10-16):
1. **Erradicación Sistemática de Overflows en Todos los Modales de la Plataforma:**
   - Auditoría de los 17 modales del sistema (`clientModal`, `reportModal`, `billingNoticeModal`, `roadmapManagementModal`, `servicesAuditModal`, `masterCatalogModal`, `backupModal`, `proposalResultModal`, `partnerSnippetModal`, `satelliteGeneratorModal`, `newPartnerModal`, `pillarZoomPitchModal`, `manualTransactionModal`, `contractEditorModal`, `nfcGeneratorModal` en Dashboard; y `adjustModal` y `approvedContractBridgeModal` en Propuesta).
   - Aplicación estricta del patrón de 3 capas:
     - Overlay con `overflow-y-auto` y padding perimetral.
     - Contenedor diálogo con `my-auto max-h-[92vh] flex flex-col overflow-hidden`.
     - Cabecera fija (`shrink-0 bg-[#0b0f17]`), cuerpo con scroll independiente (`overflow-y-auto flex-1`), y pie de acciones fijo (`shrink-0 bg-[#070a10]`).
   - Cero desbordes hacia coordenadas negativas: títulos, botones de cerrar y acciones de pie permanecen siempre 100% accesibles en cualquier tamaño de pantalla.
2. **Reemplazo de Emojis por Logotipos Reales de Marca en el Ticker Marquee:**
   - Eliminación de todos los emojis genéricos (🌾, 🏢, 🌲, 🚛, 🍂, etc.) en los dos ciclos de la cinta de marcas en scroll infinito (`index.html`).
   - Integración de los logotipos originales de los proyectos en `assets/clients/`: Pasión Pecuaria RD, Torre La Esperilla, Elements Jarabacoa, TrendyRD, Granja Tracker, Wise Services RD (MiCondoRD), IsaTransLogic, Highland Bridge Co., SynkRD, La Capra Cigars y Kendy Sastre Atelier.
   - Renderizado retina optimizado con badges adaptativos y efectos hover dinámicos.
3. **Pruebas Automatizadas:**
   - **16/16 pruebas unitarias** pasando al 100% de éxito en `scratch/test_suite.js`.
