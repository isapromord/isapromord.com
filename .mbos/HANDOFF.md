# 🤝 HANDOFF.md — Estado Técnico de IsaPromo RD (isapromord.com)

> **Nodo MBOS:** `isapromord.com`  
> **Última Actualización:** 2026-10-21 (v2.4.1: Botón de Propuestas Dual: Crear si no existe / Abrir si ya fue creada)  
> **Repositorio Oficial:** [https://github.com/isapromord/isapromord.com](https://github.com/isapromord/isapromord.com)  
> **Repositorio Root Pages:** [https://github.com/isapromord/isapromord.github.io](https://github.com/isapromord/isapromord.github.io)  
> **URLs EN VIVO Y FUNCIONALES ($0 Costo):**  
> - 🌐 **Root Principal (Rediseño Stitch "Obsidian Cyber Luxe"):** [https://isapromord.github.io/](https://isapromord.github.io/)  
> - 🛡️ **Dashboard Administrador Modular ("Obsidian Cyber Luxe"):** [https://isapromord.github.io/dashboard/](https://isapromord.github.io/dashboard/) (PIN: `3690`)  
> - 🧾 **Motor de Recibos Digitales Oficiales (A4 Vector Print & WhatsApp):** [https://isapromord.github.io/recibo/](https://isapromord.github.io/recibo/) (Soporta Anticipo 50%, Completivo 50%, Mensualidad recurrente y Liquidación 100%)  
> - 📜 **Motor de Contratos y Firma Digital Legal:** [https://isapromord.github.io/contrato/](https://isapromord.github.io/contrato/) (Esquema 50/50, Hash criptográfico, 5 días de gracia, cláusula de Take-Down, firma táctil/clic, sin riesgo DGII/NCF)  
> - ⚡ **Motor de Auditoría Pre-Flight:** Diagnóstico estricto de Infraestructura Técnica & Preparación Digital (Pre-Flight Check) con Scope-Aware SLA Scoring y botón de Google PageSpeed oficial.  
> - 💼 **Suite Contable & CFO:** [https://isapromord.github.io/dashboard/](https://isapromord.github.io/dashboard/) (Tab 4: "Finanzas & Contabilidad") — CRUD completo de transacciones, botón de Recibo Oficial directo en cada ingreso, soporte de gastos operativos y conciliación bancaria.  
> - 📄 **Propuesta Demo Interactiva:** [https://isapromord.github.io/propuestas/demo/](https://isapromord.github.io/propuestas/demo/)  
> - 📄 **Motor de Propuestas Dinámicas:** [https://isapromord.github.io/propuesta/](https://isapromord.github.io/propuesta/)  
> - 🗄️ **Base de Datos Multi-Tenant Oficial (Supabase):** `isapromord-hub` (`biomfntvqbhjmmmggxzj`) en organización `isapromo-cloud` — Tablas activas: `agency_clients`, `agency_proposals`, `isapromo_referrals`.  
> **Estado del Sistema:** 100% en línea, 20/20 pruebas unitarias pasando al 100%, cachebuster v2.4.1 activo.

---

### Hitos Completados en v2.4.1 (2026-10-21):
1. **Comportamiento Dual del Botón de Propuestas (Crear vs Abrir):**
   - Modificado `openProposalForClient(clientId, forceNew)` para evaluar si la cuenta ya tiene una propuesta generada/aprobada (`getClientProposal`).
   - Si la propuesta ya fue creada: abre inmediatamente el enlace en vivo (`window.open(proposal.url, '_blank')`).
   - Si nunca se ha creado una propuesta para esa cuenta: redirige a la pestaña de cotizaciones pre-rellenando los datos del cliente para su creación.
   - En el listado de clientes (Directorio) y en la cabecera de Mission Control, el icono y el texto se actualizan dinámicamente (`📄 Ver Propuesta` si existe, `📝 Crear Propuesta` si no).
2. **Sincronización de Semilla y Propuesta Oficial de Kendy Sastre Atelier:**
   - Vinculada la propuesta oficial aprobada de Kendy Sastre (`prop-1792536147246`) en `INITIAL_PROPOSALS` y en `INITIAL_CLIENTS`.
   - Ajustada la tarifa de mantenimiento a `RD$ 2,000 / mes`, reflejando exactamente la cotización real acordada.
3. **Pruebas Automatizadas:**
   - **20/20 pruebas unitarias** pasando al 100% de éxito en `scratch/test_suite.js`.

---

### Hitos Completados en v2.4.0 (2026-10-21):
1. **Motor de Recibos Digitales Oficiales (`recibo/index.html`):**
   - Página independiente, ligera y con maquetación editorial suiza en A4 para emisión de comprobantes de pago.
   - Parámetros URL URLSearchParams limpios (`id`, `cliente`, `cat`, `tipo`, `monto`, `setup`, `metodo`, `banco`, `ref`, `fecha`).
   - Diferenciación rigurosa de conceptos:
     - **Anticipo 50%:** Muestra monto cobrado y cálculo transparente del "Saldo Pendiente Contra Entrega (50%)".
     - **Completivo 50%:** Muestra saldo liquidado con sello "RD$ 0.00 — 100% SALDADO".
     - **Mensualidad:** Muestra período mensual cubierto y estado "CICLO MENSUAL AL DÍA".
     - **Liquidación Total:** Muestra comprobante formal de contado.
   - Botón directo de "Guardar / Descargar PDF" (vía `window.print()` con tipografía vectorial nítida sin pixelado) y "Compartir por WhatsApp" con mensaje precargado y URL verificada.
2. **Centro de Cobros & Recordatorios Renovado (`billingNoticeModal`):**
   - Selector modular de concepto:
     - `📅 Mensualidad`: sub-selector con momentos de cobro: Preventivo (3-5d antes), Día de Corte (Hoy) y Vencido (en período de gracia).
     - `🚀 Anticipo 50%`: Solicitud formal de anticipo para arranque de desarrollo web.
     - `🏁 Completivo 50%`: Solicitud formal de liquidación para traspaso final de credenciales y puesta en producción.
     - `🧾 Recibo Emitido`: Plantilla de confirmación con enlace directo al recibo digital generado.
   - Botón de acceso directo `🧾 Ver Recibo PDF` en el pie del modal para previsualizar o imprimir de inmediato.
3. **Integración con Libro Diario (CFO Ledger):**
   - Cada fila de ingreso en la tabla de transacciones de contabilidad ahora cuenta con un botón directo `openTransactionReceipt(txId)` para abrir el comprobante digital oficial correspondiente.
4. **Pruebas Automatizadas:**
   - **19/19 pruebas unitarias** pasando al 100% de éxito en `scratch/test_suite.js`.
