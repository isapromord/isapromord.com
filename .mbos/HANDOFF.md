# 🤝 HANDOFF.md — Estado Técnico de IsaPromo RD (isapromord.com)

> **Nodo MBOS:** `isapromord.com`  
> **Última Actualización:** 2026-10-16 (v2.3.4: Blindaje de Botones y Corrección de Guardado en Directorio de Clientes)  
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
> **Estado del Sistema:** 100% en línea, 16/16 pruebas unitarias pasando al 100%, cachebuster v2.3.4 activo.

---

### Hitos Completados en v2.3.4 (2026-10-16):
1. **Solución Definitiva de Guardado en Directorio de Clientes (`saveClient`):**
   - Corrección de `Uncaught ReferenceError: repoUrl is not defined` mediante la declaración de `const repoUrl` al inicio de `saveClient()`.
   - Adición de auto-prefijado inteligente de protocolo (`https://`) para dominios introducidos sin prefijo.
   - Eliminación del bloqueo nativo HTML5 `type="url"` convirtiéndolo a `type="text"` y agregando `novalidate` al `<form id="clientForm">`.
   - Protección con `try / catch` y notificaciones `showToast` con feedback inmediato de éxito o error.
2. **Auditoría Integral de Todos los Botones del Modal de Clientes:**
   - **Guardar Cliente (`#modalSaveClientBtn`):** Guarda cambios o crea nuevo cliente, actualiza `state.clients`, persiste en `localStorage`, sincroniza con Supabase y actualiza la vista.
   - **Cancelar / Cerrar (`#modalCloseBtn`, `#modalCancelBtn`):** Cierran el diálogo y limpian estados.
   - **Auto-Escanear Dominio (`#autoScanBtn`):** Escanea metadatos reales vía Microlink y rellena nombre, categoría y servicios sugeridos.
   - **Archivar / Desarchivar Cliente (`#modalArchiveClientBtn`):** Alterna el estado activo/archivado del cliente.
   - **Eliminar Cliente (`#modalDeleteClientBtn`):** Confirmación y eliminación de registros local y en la nube.
   - **Seleccionar / Deseleccionar Todo (`#modalToggleAllServicesBtn`):** Control masivo de los 7 módulos de alcance contratado.
3. **Pruebas Automatizadas:**
   - **16/16 pruebas unitarias** pasando al 100% en `scratch/test_suite.js`.
