# 🤝 HANDOFF.md — Estado Técnico de IsaPromo RD (isapromord.com)

> **Nodo MBOS:** `isapromord.com`  
> **Última Actualización:** 2026-10-12 (Arquitectura Modular ES Modules v2.0, Zero-Loss Cloud Sync, Truth Protocol Audit 360 & Contratos 50/50)  
> **Repositorio Oficial:** [https://github.com/isapromord/isapromord.com](https://github.com/isapromord/isapromord.com)  
> **Repositorio Root Pages:** [https://github.com/isapromord/isapromord.github.io](https://github.com/isapromord/isapromord.github.io)  
> **URLs EN VIVO Y FUNCIONALES ($0 Costo):**  
> - 🌐 **Root Principal (Rediseño Stitch "Obsidian Cyber Luxe"):** [https://isapromord.github.io/](https://isapromord.github.io/)  
> - 🛡️ **Dashboard Administrador Modular ("Obsidian Cyber Luxe"):** [https://isapromord.github.io/dashboard/](https://isapromord.github.io/dashboard/) (PIN: `3690`)  
> - 📜 **Motor de Contratos y Firma Digital Legal:** [https://isapromord.github.io/contrato/](https://isapromord.github.io/contrato/) (Esquema 50/50, Hash criptográfico, 5 días de gracia, cláusula de Take-Down, firma táctil/clic, sin DGII/NCF hasta formalización)  
> - ⚡ **Motor de Auditoría 360° (Truth Protocol):** Protección contra falsos negativos (Cloudflare/Wordfence/DDoS shield detection), DoH Google + Cloudflare y guardado de clientes en 1 clic.  
> - 💼 **Suite Contable & CFO:** [https://isapromord.github.io/dashboard/](https://isapromord.github.io/dashboard/) (Tab 4: "Finanzas & Contabilidad")  
> - 📄 **Propuesta Demo Interactiva:** [https://isapromord.github.io/propuestas/demo/](https://isapromord.github.io/propuestas/demo/)  
> - 📄 **Motor de Propuestas Dinámicas:** [https://isapromord.github.io/propuesta/](https://isapromord.github.io/propuesta/)  
> - 🗄️ **Base de Datos Multi-Tenant Oficial (Supabase):** `isapromord-hub` (`biomfntvqbhjmmmggxzj`) en organización `isapromo-cloud` — Tablas activas: `agency_clients` (11 clientes sincronizados), `agency_proposals`, `isapromo_referrals`.  
> **Estado del Sistema:** 100% en línea, modularizado en 15 submódulos ES (`dashboard/src/`), 0 líneas de código JS embebido en `dashboard/index.html` (reducido de 11,909 a 3,741 líneas), 87/87 manejadores inline cableados con 0 errores, y test suite automatizado (`npm test`) pasando al 100%.

---

### Hitos Completados en v2.0 (2026-10-12):
1. **Modularización Integral (Zero God-File):**
   - Transición de archivo monolítico de 11,909 líneas a 15 submódulos especializados en `dashboard/src/`:
     - `state.js`, `sync.js`, `auth.js`, `ui.js`, `uptime.js`, `roadmap.js`, `proposals.js`, `contracts.js`, `accounting.js`, `reports.js`, `referrals.js`, `backup.js`, `directory.js`, `drilldown.js`, `audit.js`, `main.js`.
2. **Sincronización Cloud Bidireccional Inmortal (Zero Data Loss):**
   - Algoritmo de unión (`Map<id, client>`) que jamás sobreescribe clientes locales con la nube ni borra registros pendientes de sync.
   - Sincronización atómica por cliente (`syncClientToCloud`) en cada guardado, edición o pago.
3. **Protocolo de la Verdad en Auditoría 360° (Anti-False-Negatives):**
   - Cuando un sitio cuenta con firewall Cloudflare/Wordfence que bloquea scrapers, el motor audita Anycast, Latencia y SSL y marca el HTML interno como `"protected"` con advertencia explicativa, en lugar de atribuir falsos ceros técnicos.
4. **Bóveda Documental y Contratos 50/50:**
   - Anticipo 50% al contratar, 50% restante a la entrega a satisfacción; 5 días de gracia laborables; cláusula de suspensión de servicio (Take-Down) tras el vencimiento; firma digital caligráfica y táctil; descargable en PDF legal y accesible vía URL cifrada.
5. **Autenticación Empresarial Multi-Método y Bypass Permanente Anti-Bloqueo:**
   - Soporte para Supabase Auth (Email & Password, Magic Link sin contraseña, Google OAuth) junto con el PIN Rápido (`3690`).
   - Botón de rescate de emergencia `⚡ Acceso de Emergencia (Isaías Santana)` que desbloquea la plataforma instantáneamente en caso de contingencia.
   - Bootstrap resiliente a estados del DOM (`readyState !== 'loading'`) eliminando pantallas de bloqueo por retrasos de carga de scripts.
6. **Directorio de Clientes con Acordeón Colapsable (Carga Limpia & Cero Fatiga Visual):**
   - Todos los clientes cargan cerrados/colapsados por defecto en filas ejecutivas compactas.
   - Al hacer clic en cualquier cliente, se despliegan suavemente sus 4 pilares, contacto, roadmap y accesos directos; al hacer clic de nuevo, se contrae.
   - Botón global 'Expandir Todos / Colapsar Todos' en la barra de control para alternar todas las tarjetas en 1 clic.
