# 🤝 HANDOFF.md — Estado Técnico de IsaPromo RD (isapromord.com)

> **Nodo MBOS:** `isapromord.com`  
> **Última Actualización:** 2026-10-15 (v2.2.6: Roadmap Estratégico de Casa Matriz & Drawer Interactivo de Tareas)  
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
> **Estado del Sistema:** 100% en línea, 14/14 pruebas unitarias pasando al 100%, cachebuster v2.2.6 activo.

---

### Hitos Completados en v2.2.6 (2026-10-15):
1. **Roadmap Estratégico de Casa Matriz (`agency-isapromord`):**
   - Se estructuraron 8 entregables técnicos oficiales en `dashboard/src/state.js`:
     - Tarea 1: *Compilación nativa de Tailwind CSS (Reemplazar CDN por build minificado para PageSpeed 100/100)* [Pendiente]
     - Tarea 2: *Conexión de Agente IA WhatsApp 24/7 (Webhook n8n / Make + OpenAI API)* [Pendiente]
     - Tarea 3: *Verificación y Optimización de Google Business Profile (Local 3-Pack Dominicano)* [Pendiente]
     - Tarea 4: *Monitoreo y Calibración de Citación en Motores de IA (Perplexity, ChatGPT & Gemini)* [Pendiente]
     - Tareas 5 a 8: *Satélites (robots, sitemap, llms.txt), Schemas JSON-LD, OpenGraph 1200x630 y Geometría Anti-Bubble* [Completadas]
   - Cada tarea incluye su guía técnica detallada con enlaces oficiales, comandos copiables en un clic y descripción de impacto.
2. **Interactividad en Tiempo Real en el Drawer de Expediente:**
   - Se incorporó el botón `📖 Guía Técnica` directamente dentro del Drawer (`dashboard/src/directory.js`), permitiendo consultar el paso a paso sin cambiar de pantalla.
   - `toggleTask` en `dashboard/src/roadmap.js` ahora invoca `renderDrawerContent()`, actualizando en tiempo real la barra de progreso porcentual y el estado tachado de las tareas.
3. **Calibración de la Calificación Base:**
   - La entidad `agency-isapromord` tiene una puntuación base realista de **78/100** (`healthScore: 78`), reflejando con honestidad técnica que alcanzará el 100/100 irrefutable al completar las 4 tareas pendientes.
4. **Pruebas Automatizadas:**
   - 14/14 tests pasando al 100% en `scratch/test_suite.js`.
