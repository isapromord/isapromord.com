# 🤝 HANDOFF.md — Estado Técnico de IsaPromo RD (isapromord.com)

> **Nodo MBOS:** `isapromord.com`  
> **Última Actualización:** 2026-10-15 (v2.2.5: Integración Canónica de Casa Matriz y Blindaje Anti-Colisión en Auditoría 360°)  
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
> **Estado del Sistema:** 100% en línea, 14/14 pruebas unitarias pasando al 100%, cachebuster v2.2.5 activo.

---

### Hitos Completados en v2.2.5 (2026-10-15):
1. **Integración Canónica de Casa Matriz en el Dashboard:**
   - Se añadió `agency-isapromord` a `INITIAL_CLIENTS` en `dashboard/src/state.js` con `isAgency: true`, `fee: "RD$ 0 / mes (Casa Matriz)"` y `healthScore: 100`.
   - Se blindó `calculateTotalMrr` en `dashboard/src/ui.js` para excluir `c.isAgency` y no alterar los ingresos mensuales recurrentes de clientes.
   - Se añadió el badge distintivo `🏛️ Casa Matriz` en color púrpura tanto en la vista Grid como en la vista Data-Grid Compacta en `dashboard/src/directory.js`.
2. **Blindaje Anti-Colisión y Protocolo de Verdad Local en Auditoría 360°:**
   - Se corrigió el matching de clientes en `dashboard/src/audit.js` para usar la URL normalizada completa (`host + pathname`), evitando que subdirectorios GitHub Pages como `isapromord.github.io/isapromord.com` se atribuyan erróneamente a clientes como MiCondoRD.
   - Fallback por host limitado exclusivamente a dominios propios (bloqueando dominios compartidos como `github.io`, `vercel.app`, `netlify.app`).
   - Implementado protocolo de auto-auditoría (`isSelfAudit`): lectura directa no-bloqueante de activos locales relativos (`../index.html`, `../robots.txt`, `../sitemap.xml`, `../llms.txt`).
   - Sonda dual para archivos satélite que consulta tanto la raíz como el subdirectorio de repositorio.
   - Umbrales calibrados para títulos y descripciones de búsqueda orgánicas (`titleLen` 25-95, `descLen` 70-230).
   - Resultado verificado: puntuación 100/100 verídica y documentada en base al código fuente real de ISAPromoRD.
3. **Control de Calidad Automatizado:**
   - 14/14 tests pasando exitosamente en `scratch/test_suite.js`.
