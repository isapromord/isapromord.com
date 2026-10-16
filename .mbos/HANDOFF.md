# 🤝 HANDOFF.md — Estado Técnico de IsaPromo RD (isapromord.com)

> **Nodo MBOS:** `isapromord.com`  
> **Última Actualización:** 2026-10-15 (v2.2.3: Normalización Visual Grado Ingeniería — Anti-Bubble / Anti-Microfont Overhaul Completo en Toda la Landing Page)  
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
> **Estado del Sistema:** 100% en línea, 12/12 pruebas unitarias pasando al 100%, cachebuster v2.2.3 activo.

---

### Hitos Completados en v2.2.3 (2026-10-15):
1. **Normalización Visual de Esquinas (Anti-Bubble Geometry):**
   - Se erradicaron de raíz los excesos de `rounded-3xl` (24px) y `rounded-2xl` (16px) en tarjetas, formularios y modales a lo largo de toda la landing page.
   - Se implementó la jerarquía arquitectónica estándar de Linear, Stripe y Vercel:
     - Tarjetas contenedoras principales: `rounded-xl` (12px).
     - Sub-tarjetas, métricas, acordeones y contenedores de formulario: `rounded-lg` (8px).
     - Botones CTA, campos `<input>`, badges de telemetría y chips: `rounded-lg` (8px) o `rounded-md` (6px).
     - `rounded-full`: Reservado estrictamente para puntos LED/estado (`w-2 h-2 rounded-full`) y avatares.
2. **Elevación de Legibilidad y Eliminación de Letra Pequeña:**
   - 0 ocurrencias de `text-[10px]` o `text-[11px]` en todo el código.
   - Párrafos explicativos, términos de garantía 50/50, notas de entrega y descripciones de portafolio elevados a `text-sm` (14px) y `text-base` (16px).
   - Eliminación de `font-mono` en párrafos descriptivos humanos, reservándolo exclusivamente para telemetría técnica y métricas numéricas.
   - Contraste visual optimizado con `text-slate-200` y `text-slate-300` para legibilidad al aire libre en móviles.
3. **Secciones Sincronizadas y Desplegadas en `index.html`:**
   - Financial Trust Capsule & Pasarela de Pagos 50/50
   - Tarjetas de Portafolio Visual y Ticker de Clientes
   - Simulador ROI y Reporte del Escáner en Vivo
   - Comparativa Asimétrica IsaPromo vs Agencias Tradicionales
   - 4 Pilares Sticky Storytelling
   - Paquetes Comerciales (3 Niveles) y Testimonios
   - Cobertura Geográfica y Módulos A la Carta
   - Acordeones del FAQ Técnico
   - Cierre Comercial de Reserva de Zona
   - Header, Mobile Drawer y Live Toast Dispatcher
4. **Despliegue y Control de Versiones:**
   - Commit `873d3a4` desplegado directamente en `main` hacia GitHub Pages.
