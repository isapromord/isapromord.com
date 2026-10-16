# 🤝 HANDOFF.md — Estado Técnico de IsaPromo RD (isapromord.com)

> **Nodo MBOS:** `isapromord.com`  
> **Última Actualización:** 2026-10-16 (v2.3.6: Centrado Vertical Dinámico & Showcase Visual Puro en Sticky Feature)  
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
> **Estado del Sistema:** 100% en línea, 16/16 pruebas unitarias pasando al 100%, cachebuster v2.3.6 activo.

---

### Hitos Completados en v2.3.6 (2026-10-16):
1. **Centrado Vertical Dinámico en Viewport para Sticky Feature (`#servicios`):**
   - Eliminación de la posición rígida `lg:top-28` que pegaba la tarjeta contra el navbar inferior.
   - Implementación de `lg:sticky lg:top-[max(8.5rem,calc(50vh-220px))]`, asegurando suspensión perfectamente centrada en el eje vertical en cualquier tamaño de monitor sin dejar vacíos desproporcionados debajo.
2. **Showcase Visual Puro (Eliminación de Degradados Oscuros y Textos Duplicados):**
   - Remoción del degradado denso y los párrafos que cubrían el 50% de las imágenes 3D.
   - 100% de los renders visibles sin cortes (teléfono WhatsApp, esferas neuronales, mapa holográfico, velocímetro Core Web Vitals y dashboard CRM).
   - Marco redondeado de grado dispositivo (`rounded-2xl sm:rounded-3xl` + `ring-1 ring-white/10`) y micro-badges flotantes de estado translúcidos.
3. **Pruebas Automatizadas:**
   - **16/16 pruebas unitarias** pasando al 100% de éxito en `scratch/test_suite.js`.
