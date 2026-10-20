# 🤝 HANDOFF.md — Estado Técnico de IsaPromo RD (isapromord.com)

> **Nodo MBOS:** `isapromord.com`  
> **Última Actualización:** 2026-10-20 (v2.3.7: Enlaces de Propuestas Ultracompactos <200 Chars, Cloud Hydration & Bitly-Proof)  
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
> **Estado del Sistema:** 100% en línea, 17/17 pruebas unitarias pasando al 100%, cachebuster v2.3.7 activo.

---

### Hitos Completados en v2.3.7 (2026-10-20):
1. **Compresión Semántica de Enlaces de Propuestas Comerciales (<200-240 Caracteres):**
   - Eliminación de la codificación Base64 total en `&d=` que generaba URLs monstruosas de ~2,752 caracteres.
   - Nueva arquitectura de parámetros cortos (`cliente`, `cat`, `plan`, `id`, `svc`, `setup`, `monthly`, `custom`).
   - Soporte para sobreescritura de precios individuales en formato `svcId:price` (ej: `web-maintenance:2000,google-maps-pack:5000`).
   - URLs 100% compatibles con Bitly (límite de 2,048 caracteres), WhatsApp, iMessage y SMS sin verse como enlaces de spam.
2. **Hidratación en la Nube y Compatibilidad hacia Atrás Total:**
   - Persistencia automática de `payload JSONB` en Supabase `agency_proposals`.
   - Renderizado visual instantáneo en 0ms vía query params, complementado con enriquecimiento progresivo desde la nube en background.
   - Preservación del decodificador histórico de `&d=` para asegurar que enlaces antiguos nunca se rompan.
3. **Pruebas Automatizadas:**
   - **17/17 pruebas unitarias** pasando al 100% de éxito en `scratch/test_suite.js`.
