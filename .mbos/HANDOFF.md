# 🤝 HANDOFF.md — Estado Técnico de IsaPromo RD (isapromord.com)

> **Nodo MBOS:** `isapromord.com`  
> **Última Actualización:** 2026-10-15 (v2.2.7: Calificación de Salud por Alcance Contratado & Radar de Expansión)  
> **Repositorio Oficial:** [https://github.com/isapromord/isapromord.com](https://github.com/isapromord/isapromord.com)  
> **Repositorio Root Pages:** [https://github.com/isapromord/isapromord.github.io](https://github.com/isapromord/isapromord.github.io)  
> **URLs EN VIVO Y FUNCIONALES ($0 Costo):**  
> - 🌐 **Root Principal (Rediseño Stitch "Obsidian Cyber Luxe"):** [https://isapromord.github.io/](https://isapromord.github.io/)  
> - 🛡️ **Dashboard Administrador Modular ("Obsidian Cyber Luxe"):** [https://isapromord.github.io/dashboard/](https://isapromord.github.io/dashboard/) (PIN: `3690`)  
> - 📜 **Motor de Contratos y Firma Digital Legal:** [https://isapromord.github.io/contrato/](https://isapromord.github.io/contrato/) (Esquema 50/50, Hash criptográfico, 5 días de gracia, cláusula de Take-Down, firma táctil/clic, sin riesgo DGII/NCF)  
> - ⚡ **Motor de Auditoría 360° (Truth Protocol):** Diagnóstico de los 7 pilares técnicos con Scope-Aware SLA Scoring y Radar de Expansión (Upsell).  
> - 💼 **Suite Contable & CFO:** [https://isapromord.github.io/dashboard/](https://isapromord.github.io/dashboard/) (Tab 4: "Finanzas & Contabilidad") — CRUD completo de transacciones, edición, soporte de gastos operativos y conciliación bancaria.  
> - 📄 **Propuesta Demo Interactiva:** [https://isapromord.github.io/propuestas/demo/](https://isapromord.github.io/propuestas/demo/)  
> - 📄 **Motor de Propuestas Dinámicas:** [https://isapromord.github.io/propuesta/](https://isapromord.github.io/propuesta/)  
> - 🗄️ **Base de Datos Multi-Tenant Oficial (Supabase):** `isapromord-hub` (`biomfntvqbhjmmmggxzj`) en organización `isapromo-cloud` — Tablas activas: `agency_clients`, `agency_proposals`, `isapromo_referrals`.  
> **Estado del Sistema:** 100% en línea, 15/15 pruebas unitarias pasando al 100%, cachebuster v2.2.7 activo.

---

### Hitos Completados en v2.2.7 (2026-10-15):
1. **Calificación de Salud por Alcance Contratado (Scope-Aware SLA Scoring):**
   - Resuelto el dilema de credibilidad comercial: clientes que solo contratan servicios específicos (ej. Google Maps o CRM) ya no son castigados con un 35/100 arbitrario.
   - Si sus servicios contratados están en óptimo estado, obtienen su **100/100 legítimo** en su SLA.
2. **Radar de Expansión & Oportunidades de Upsell:**
   - Los servicios no contratados no restan puntos; en su lugar, se destacan en púrpura neón como `🚀 Radar de Expansión`, identificando oportunidades comerciales de alto valor para ofrecerles en reuniones de seguimiento.
3. **Selector de Alcance Contratado en Modal de Clientes:**
   - Checkboxes interactivos por pilar con botón "Seleccionar Todos" para activar/desactivar módulos por contrato.
4. **Resiliencia en Supabase & Directorio:**
   - Almacenamiento seguro en `optimization_matrix.contractedServices`.
   - Badges de `Salud SLA` y conteo de módulos en Grid y List views del Directorio.
5. **Pruebas Automatizadas:**
   - 15/15 tests pasando con 0 errores en `scratch/test_suite.js`.
