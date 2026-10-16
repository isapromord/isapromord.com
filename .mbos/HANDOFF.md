# 🤝 HANDOFF.md — Estado Técnico de IsaPromo RD (isapromord.com)

> **Nodo MBOS:** `isapromord.com`  
> **Última Actualización:** 2026-10-16 (v2.2.9: Arquitectura Anti-Overflow en Modal de Clientes)  
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
> **Estado del Sistema:** 100% en línea, 15/15 pruebas unitarias pasando al 100%, cachebuster v2.3.3 activo.

---

### Hitos Completados en v2.2.9 (2026-10-16):
1. **Solución Definitiva de Viewport Overflow en Modal de Clientes (`#clientModal`):**
   - Problema: En pantallas estándar, el modal excedía la altura del viewport (`>950px`), empujando el header hacia arriba fuera de pantalla y el footer (botón "Guardar Cliente") hacia abajo fuera de la vista.
   - Solución de Arquitectura:
     - Diálogo restringido a `max-h-[92vh] flex flex-col`.
     - Header fijado (`shrink-0`) con título y botón de cierre visible en todo momento.
     - Cuerpo con scroll interno independiente (`overflow-y-auto flex-1`), conteniendo todos los campos, auto-scanner, notas y matriz de alcance contratado.
     - Footer fijado (`shrink-0`) con botones de acción ("Guardar Cliente", "Cancelar", "Archivar", "Eliminar") accesibles de inmediato sin necesidad de scroll vertical para guardar.
2. **Pruebas Automatizadas:**
   - 15/15 pruebas unitarias en `scratch/test_suite.js` pasando al 100%.
