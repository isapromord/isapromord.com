# 🤝 HANDOFF.md — Estado Técnico de IsaPromo RD (isapromord.com)

> **Nodo MBOS:** `isapromord.com`  
> **Última Actualización:** 2026-10-08 (Post-Hotfix Drilldown & Satélites)  
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
> **Estado del Sistema:** 100% en línea, base de datos multi-tenant conectada, arquitectura multi-página Hub & Spoke activa, propuesta interactiva con URL oficial propia (`/propuestas/demo/`), mini-captador híbrido conectado directo a Supabase, páginas legales E-E-A-T activas, filas de clientes clickeables, navegación SPA estándar vía HTML5 History API, y drilldown blindado con escapeHtml global y apertura directa de satélites.

---

### Últimas Correcciones Críticas (2026-10-08):
1. **Solución del Botón `+ Gestionar / Añadir` en Drilldown de Cliente:**
   - Causa raíz: Falta de definición global de la función `escapeHtml(str)`, lo cual provocaba un fallo no capturado `ReferenceError` al renderizar la pestaña de propuestas.
   - Solución: Se definió `escapeHtml(str)` globalmente en el runtime de `dashboard/index.html` y `dashboard.html`. El modal `#roadmapManagementModal` ahora abre instantáneamente.
2. **Solución de Botones de Archivos Satélite (`robots.txt`, `sitemap.xml`, `llms.txt`):**
   - Causa raíz: Los botones tenían `href="#" target="_blank"`. Al romperse el hilo de ejecución por `escapeHtml`, nunca se actualizaban con la URL del cliente y abrían `https://isapromord.github.io/dashboard/#` en una pestaña nueva, disparando la pantalla del PIN.
   - Solución: Se desacopló la lógica a una función autónoma `openSatelliteFile(fileType)` con parsing seguro de la URL del cliente y apertura directa de la pestaña hacia el archivo real.
3. **Paridad y Despliegue:**
   - Paridad de hash SHA256 100% idéntica entre `dashboard/index.html` y `dashboard.html`.
   - Código validado en sandbox Node.js (0 errores).
   - Desplegado en GitHub `origin` y `pages` en las ramas `main` y `gh-pages`.
