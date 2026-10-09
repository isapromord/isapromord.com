# 🤝 HANDOFF.md — Estado Técnico de IsaPromo RD (isapromord.com)

> **Nodo MBOS:** `isapromord.com`  
> **Última Actualización:** 2026-10-09 (Arquitectura Canónica Definitiva & Sincronización de Precios)  
> **Repositorio Oficial:** [https://github.com/isapromord/isapromord.com](https://github.com/isapromord/isapromord.com)  
> **Repositorio Root Pages:** [https://github.com/isapromord/isapromord.github.io](https://github.com/isapromord/isapromord.github.io)  
> **URLs EN VIVO Y FUNCIONALES ($0 Costo):**  
> - 🌐 **Root Principal (Rediseño Stitch "Obsidian Cyber Luxe"):** [https://isapromord.github.io/](https://isapromord.github.io/)  
> - 🛡️ **Dashboard Administrador ("Obsidian Cyber Luxe"):** [https://isapromord.github.io/dashboard/](https://isapromord.github.io/dashboard/) (PIN: `3690`)  
> - ⚡ **Motor de Auditoría 360° (v3.0 Híbrido Zero-Hang):** Integración Google PageSpeed Insights v5 + Cloudflare DNS + Proxy CORS Resiliente.  
> - 💼 **Suite Contable & CFO:** [https://isapromord.github.io/dashboard/](https://isapromord.github.io/dashboard/) (Tab 4: "Finanzas & Contabilidad")  
> - 📄 **Propuesta Demo Interactiva (Anonimizada & Blindada):** [https://isapromord.github.io/propuestas/demo/](https://isapromord.github.io/propuestas/demo/)  
> - 📄 **Motor de Propuestas Dinámicas:** [https://isapromord.github.io/propuesta/](https://isapromord.github.io/propuesta/)  
> - 📄 **Páginas Legales Oficiales:** [Privacidad](https://isapromord.github.io/privacidad/) (Ley 172-13) • [Términos](https://isapromord.github.io/terminos/) (50/50, NCF B01)  
> - 🗄️ **Base de Datos Multi-Tenant Oficial (Supabase):** `isapromord-hub` (`biomfntvqbhjmmmggxzj`) en organización `isapromo-cloud` — Tablas activas: `agency_leads` y `agency_clients`.  
> **Estado del Sistema:** 100% en línea, base de datos multi-tenant conectada, arquitectura multi-página Hub & Spoke activa, precios 100% unificados en toda la plataforma, y arquitectura canónica sin duplicación de archivos (`dashboard/index.html` como única fuente de verdad y `dashboard.html` como redirect 0ms retrocompatible).

---

### Últimas Correcciones Críticas:
1. **Arquitectura Canónica Definitiva (2026-10-09):**
   - Eliminación de la duplicación de 550 KB de `dashboard.html`.
   - `dashboard/index.html` es ahora la **Única Fuente de Verdad** (*Single Source of Truth*).
   - `dashboard.html` se convirtió en un redirect canónico ultra-liviano de 0ms con soporte para preservar query params y hash tags.
2. **Sincronización Unificada de Precios y Catálogos (2026-10-09):**
   - Web Transaccional (<1s) unificada a **RD$ 28,000** en Dashboard (`OFFICIAL_CATALOG_SERVICES`, `PROPOSAL_ADDONS`) y motor de propuestas (`SERVICE_CATALOG` en `/propuesta/` y `/propuestas/demo/`).
   - Web Corporativa Multi-Página añadida a **RD$ 55,000** como servicio y add-on oficial.
   - CRM Personalizado fijado a **RD$ 35,000** con la cláusula contractual explícita de hasta 3 módulos estándar y cotización aparte de adicionales.
   - Añadidos add-ons de CRM oficiales: Facturación NCF B01 (RD$ 15,000) y Control de Inventario (RD$ 15,000).
3. **Solución del Botón `+ Gestionar / Añadir` en Drilldown de Cliente (2026-10-08):**
   - Declaración global de `escapeHtml(str)` para prevenir excepciones no capturadas.
4. **Solución de Botones de Archivos Satélite (`robots.txt`, `sitemap.xml`, `llms.txt`) (2026-10-08):**
   - Desacople a controlador autónomo `openSatelliteFile(fileType)` con apertura directa en nueva pestaña.
