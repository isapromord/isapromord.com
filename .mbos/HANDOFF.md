# 🤝 HANDOFF.md — Estado Técnico de IsaPromo RD (isapromord.com)

> **Nodo MBOS:** `isapromord.com`  
> **Última Actualización:** 2026-10-13 (v2.2: Catálogo Oficial Sincronizado, Pitch Interactivo Zoom 7 Pilares & Suite Contable CFO Totalmente Administrable)  
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
> **Estado del Sistema:** 100% en línea, 12/12 pruebas unitarias pasando al 100%, cachebuster v2.2.0 activo.

---

### Hitos Completados en v2.2 (2026-10-13):
1. **Catálogo Comercial Omnicanal Homologado:**
   - **Mantenimiento Web & Soporte WhatsApp:** RD$ 4,000 / mes (hasta 3 cambios mensuales de contenido vía WhatsApp).
   - **Setup Google Maps GBP Digital:** RD$ 6,500 único.
   - **Setup Google Maps Comercial + Placa Inteligente (NFC + QR):** RD$ 8,000 único (incluye placa acrílica de mostrador).
   - **Placa Inteligente Adicional:** RD$ 2,500.
   - **Retainer Mensual Google Maps:** RD$ 5,000 / mes (publicaciones semanales + SEO local activo).
   - **Correos Corporativos Profesionales (@tuempresa.com):** RD$ 3,500 único (DNS, SPF, DKIM, DMARC con Titan/Google).
   - **Agente de IA para Ventas & Citas 24/7 (WhatsApp / Web):** RD$ 20,000 setup (unificado).
   - **Mantenimiento Mensual IA (Tokens & Servidor):** RD$ 7,000 / mes.
   - **Combos:** `pack-esencial` (RD$ 30k / RD$ 8k mes), `pack-crm` (RD$ 60k / RD$ 15k mes), `pack-ia` (RD$ 48k / RD$ 14k mes), `pack-ecosistema` (RD$ 80k / RD$ 22k mes).
   - Precios y redacción persuasiva (NLP) sincronizados en Landing (`index.html`), Dashboard State (`state.js`), Propuestas (`propuesta/index.html`), Contratos (`contracts.js`) y Calculadora A la Carta (`proposals.js`).

2. **Matriz de Ventas Zoom en Vivo para los 7 Pilares Técnicos:**
   - Cada pilar en el Stitch Command Center (`drilldown.js`) ahora es interactivo y abre el modal `pillarZoomPitchModal`.
   - Incluye el desglose de 4 pasos comerciales:
     - 🔴 **1. El Fallo en Cristiano** (sin jerga técnica)
     - 💸 **2. Cómo le Lastima el Negocio** (pérdida de llamadas y clientes que van a la competencia)
     - 🟢 **3. La Cura de ISAPromoRD** (solución técnica y tangibilización como la placa física)
     - 🛡️ **4. Por Qué Requiere Retainer Mensual** (el argumento del algoritmo vivo)
     - 🎙️ **5. Speech para Zoom** listo para leer en vivo al compartir pantalla con botón de 1 clic para copiar al portapapeles.

3. **Suite Contable & CFO Totalmente Administrable:**
   - Resolución de discrepancia de IDs en el DOM que impedía renderizar las tablas del libro diario.
   - Edición completa de transacciones pasadas (`openEditTransactionModal`) permitiendo modificar monto, fecha, cliente, concepto, banco y referencia sin borrar el registro.
   - Categoría de Gastos Operativos (`expense`) para compras de placas acrílicas en Amazon, servidores o dominios, con cálculo automático de Flujo de Caja Neto.
   - Buscador en tiempo real de transacciones por cliente, concepto o referencia.
   - Botón directo `💵 Cobrado` en cada fila de clientes pendientes de cobro.

4. **Blindaje de Calidad:**
   - 12 pruebas unitarias automatizadas (`scratch/test_suite.js`) ejecutando al 100% de éxito.
