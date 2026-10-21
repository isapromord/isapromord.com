# 🤝 HANDOFF.md — Estado Técnico de IsaPromo RD (isapromord.com)

> **Nodo MBOS:** `isapromord.com`  
> **Última Actualización:** 2026-10-21 (v2.3.8: Reingeniería de Exportación a PDF e Impresión Ejecutiva Vectorial)  
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
> **Estado del Sistema:** 100% en línea, 18/18 pruebas unitarias pasando al 100%, cachebuster v2.3.8 activo.

---

### Hitos Completados en v2.3.8 (2026-10-21):
1. **Reingeniería de Impresión y Generación de PDF Ejecutiva (0 Páginas en Blanco, 0 Cortes de Texto):**
   - Eliminación del motor rasterizado `html2pdf.bundle.min.js` y de la regla `avoid-all` que generaba una primera página 100% en blanco y rebanaba líneas de texto a la mitad horizontalmente.
   - Migración al estándar de impresión vectorial nativa del navegador con tipografía 100% nítida, seleccionable y enlaces activos.
   - Transformación de `#proposalHeroBox` en encabezado corporativo sobrio sobre fondo blanco/slate sin degradados negros ni derroche de tinta.
   - Ajuste de márgenes y ritmo vertical (`margin-top: 0.75rem`) eliminando vacíos gigantescos y apretones de pantalla.
   - Adición de `#printFinancialSummary`: Resumen de Inversión formal con totales Setup, Retainer Mensual y desglose legal 50/50 antes de las firmas.
   - Blindaje de `break-inside: avoid` y `page-break-inside: avoid` en todas las secciones críticas para que ninguna tarjeta ni párrafo se parta entre páginas.
2. **Pruebas Automatizadas:**
   - **18/18 pruebas unitarias** pasando al 100% de éxito en `scratch/test_suite.js`.
