/**
 * ISAPromoRD - Referrals & Partner Attribution Telemetry
 * Real-time event tracking, attribution links, embed snippet generator (React / HTML),
 * and conversion rewards management.
 */
import { SUPABASE_CONFIG } from './state.js';
import { getAccessToken } from './sync.js';
import { showToast, escapeHtml } from './ui.js';

const STORAGE_KEY_REFERRAL_PARTNERS = "isapromo_agency_referral_partners_v1";

const DEFAULT_REFERRAL_PARTNERS = [
  {
    id: "pasionpecuaria",
    client_slug: "pasionpecuaria",
    client_name: "Pasión Pecuaria RD",
    website_url: "https://pasionpecuaria.vercel.app",
    reward_description: "1 Mes de Mantenimiento Web Gratis",
    created_at: "2026-09-28"
  }
];

let referralPartners = [];
let referralClicks = [];
let referralConversions = [];
let currentSelectedSnippetPartner = null;
let currentSnippetFormat = 'react';

export function getStoredReferralPartners() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_REFERRAL_PARTNERS);
    return stored ? JSON.parse(stored) : DEFAULT_REFERRAL_PARTNERS;
  } catch (e) {
    return DEFAULT_REFERRAL_PARTNERS;
  }
}

export function saveReferralPartnersToStorage(list) {
  localStorage.setItem(STORAGE_KEY_REFERRAL_PARTNERS, JSON.stringify(list));
}

export async function loadReferralsData(forceSync = false) {
  referralPartners = getStoredReferralPartners();

  try {
    const resPartners = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/isapromo_referrals?select=*&order=created_at.desc`, {
      headers: {
        'apikey': SUPABASE_CONFIG.anonKey,
        'Authorization': `Bearer ${await getAccessToken()}`
      }
    });
    if (resPartners.ok) {
      const cloudPartners = await resPartners.json();
      if (Array.isArray(cloudPartners) && cloudPartners.length > 0) {
        referralPartners = cloudPartners;
        saveReferralPartnersToStorage(referralPartners);
      }
    }

    const resClicks = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/isapromo_referral_clicks?select=*&order=created_at.desc&limit=50`, {
      headers: {
        'apikey': SUPABASE_CONFIG.anonKey,
        'Authorization': `Bearer ${await getAccessToken()}`
      }
    });
    if (resClicks.ok) {
      referralClicks = await resClicks.json();
    }

    const resConvs = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/isapromo_referral_conversions?select=*&order=created_at.desc`, {
      headers: {
        'apikey': SUPABASE_CONFIG.anonKey,
        'Authorization': `Bearer ${await getAccessToken()}`
      }
    });
    if (resConvs.ok) {
      referralConversions = await resConvs.json();
    }
  } catch (err) {
    console.debug("Operando con almacenamiento local de referidos.");
  }

  renderReferralsView();
  if (forceSync) {
    showToast("✅ Métricas de referidos y telemetría sincronizadas.", "success");
  }
}

export function renderReferralsView() {
  const totalClicks = referralClicks.length;
  const totalLeads = referralConversions.length;
  const convRate = totalClicks > 0 ? ((totalLeads / totalClicks) * 100).toFixed(1) + "%" : "0.0%";

  const clicksEl = document.getElementById("kpiRefClicks");
  if (clicksEl) clicksEl.textContent = totalClicks;
  const leadsEl = document.getElementById("kpiRefLeads");
  if (leadsEl) leadsEl.textContent = totalLeads;
  const rateEl = document.getElementById("kpiRefRate");
  if (rateEl) rateEl.textContent = convRate;
  const partnersEl = document.getElementById("kpiRefPartners");
  if (partnersEl) partnersEl.textContent = referralPartners.length;

  const tbody = document.getElementById("referralPartnersTableBody");
  if (!tbody) return;

  const baseOrigin = window.location.origin.includes('github.io') ? 'https://isapromord.github.io' : window.location.origin;
  
  tbody.innerHTML = referralPartners.map(p => {
    const partnerClicks = referralClicks.filter(c => c.client_slug === p.client_slug).length;
    const partnerLeads = referralConversions.filter(c => c.client_slug === p.client_slug).length;
    const refUrl = `${baseOrigin}/?ref=${p.client_slug}`;

    return `
      <tr class="hover:bg-slate-50/80 transition-colors">
        <td class="py-3.5 px-3">
          <div class="font-bold text-slate-900 text-sm">${escapeHtml(p.client_name)}</div>
          <a href="${p.website_url || '#'}" target="_blank" class="text-[11px] font-mono text-slate-400 hover:text-brand-600 block truncate">
            ${escapeHtml((p.website_url || '').replace('https://', ''))}
          </a>
        </td>
        <td class="py-3.5 px-3 font-mono">
          <div class="flex items-center gap-1.5">
            <span class="text-brand-700 bg-brand-50 px-2 py-0.5 rounded text-[11px] truncate max-w-[180px]">${refUrl}</span>
            <button onclick="navigator.clipboard.writeText('${refUrl}'); showToast('Enlace copiado al portapapeles', 'success');" class="p-1 hover:bg-slate-200 rounded text-slate-400" title="Copiar enlace">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            </button>
          </div>
        </td>
        <td class="py-3.5 px-3 text-center">
          <span class="inline-block px-2.5 py-0.5 rounded-md font-bold text-xs ${partnerClicks > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}">
            ${partnerClicks}
          </span>
        </td>
        <td class="py-3.5 px-3 text-center">
          <span class="inline-block px-2.5 py-0.5 rounded-md font-bold text-xs ${partnerLeads > 0 ? 'bg-blue-100 text-brand-800' : 'bg-slate-100 text-slate-600'}">
            ${partnerLeads}
          </span>
        </td>
        <td class="py-3.5 px-3 text-slate-600 font-medium">
          <div class="flex items-center gap-1.5">
            <span class="inline-flex items-center gap-1">
              <span>🎁</span>
              <span id="partnerRewardText_${p.client_slug}">${escapeHtml(p.reward_description || '1 Mes Gratis')}</span>
            </span>
            <button onclick="editPartnerReward('${p.client_slug}')" class="p-1 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded transition-colors" title="Editar recompensa">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            </button>
          </div>
        </td>
        <td class="py-3.5 px-3 text-right">
          <div class="flex items-center justify-end gap-1.5">
            <button onclick="openPartnerSnippetModal('${p.client_slug}')" class="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-1">
              <span>Badge Footer</span>
            </button>
            <button onclick="simulateReferralClick('${p.client_slug}')" class="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs" title="Simular Clic">
              ⚡
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  const feed = document.getElementById("referralsEventsFeed");
  const eventsCount = document.getElementById("liveEventsCount");
  if (eventsCount) eventsCount.textContent = `${referralClicks.length} eventos`;

  if (feed) {
    if (referralClicks.length === 0) {
      feed.innerHTML = `
        <div class="text-center py-8 text-slate-400 text-xs">
          Aún no hay clics registrados en vivo. Prueba abrir el enlace <code>https://isapromord.github.io/?ref=pasionpecuaria</code> en una ventana para ver el registro aquí.
        </div>
      `;
    } else {
      feed.innerHTML = referralClicks.slice(0, 10).map(c => `
        <div class="p-3 bg-slate-50 rounded border border-slate-200/80 flex items-center justify-between text-xs">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <strong class="text-slate-900 font-bold">${escapeHtml(c.client_slug)}</strong>
            <span class="text-slate-400 font-mono text-[11px]">${c.created_at ? new Date(c.created_at).toLocaleString('es-DO') : 'Reciente'}</span>
          </div>
          <span class="text-[11px] text-slate-400 font-mono truncate max-w-xs">${escapeHtml(c.referrer_url || 'Navegador directo')}</span>
        </div>
      `).join('');
    }
  }
}

export function editPartnerReward(slug) {
  const partner = referralPartners.find(p => p.client_slug === slug);
  if (!partner) return;
  const current = partner.reward_description || "1 Mes de Mantenimiento Web Gratis";
  const updated = prompt(`Editar recompensa / incentivo para ${partner.client_name}:`, current);
  if (updated !== null && updated.trim() !== "") {
    partner.reward_description = updated.trim();
    saveReferralPartnersToStorage(referralPartners);
    renderReferralsView();
    showToast("Recompensa actualizada", "success");
  }
}

export function openPartnerSnippetModal(slug) {
  const partner = referralPartners.find(p => p.client_slug === slug) || { client_slug: slug, client_name: slug };
  currentSelectedSnippetPartner = partner;
  const titleEl = document.getElementById("snippetModalTitle");
  if (titleEl) titleEl.textContent = `Insignia para ${partner.client_name}`;
  
  const baseOrigin = window.location.origin.includes('github.io') ? 'https://isapromord.github.io' : window.location.origin;
  const badgePreview = document.getElementById("snippetPreviewBadge");
  if (badgePreview) badgePreview.href = `${baseOrigin}/?ref=${partner.client_slug}`;

  updateSnippetCode();
  const modal = document.getElementById("partnerSnippetModal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

export function closePartnerSnippetModal() {
  const modal = document.getElementById("partnerSnippetModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

export function switchSnippetFormat(fmt) {
  currentSnippetFormat = fmt;
  const tabReact = document.getElementById("snippetTabReact");
  const tabHtml = document.getElementById("snippetTabHtml");

  if (fmt === 'react') {
    if (tabReact) tabReact.className = "px-2.5 py-1 rounded-md bg-white text-slate-900 shadow-xs";
    if (tabHtml) tabHtml.className = "px-2.5 py-1 rounded-md text-slate-400 hover:text-slate-900";
  } else {
    if (tabHtml) tabHtml.className = "px-2.5 py-1 rounded-md bg-white text-slate-900 shadow-xs";
    if (tabReact) tabReact.className = "px-2.5 py-1 rounded-md text-slate-400 hover:text-slate-900";
  }
  updateSnippetCode();
}

export function updateSnippetCode() {
  if (!currentSelectedSnippetPartner) return;
  const slug = currentSelectedSnippetPartner.client_slug;
  const baseOrigin = window.location.origin.includes('github.io') ? 'https://isapromord.github.io' : window.location.origin;
  const url = `${baseOrigin}/?ref=${slug}`;
  const codeArea = document.getElementById("snippetCodeArea");
  if (!codeArea) return;

  if (currentSnippetFormat === 'react') {
    codeArea.value = 
`{/* Badge de Atribución Oficial ISAPromoRD */}
<a 
  href="${url}" 
  target="_blank" 
  rel="noopener noreferrer" 
  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-all shadow-sm"
>
  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
  <span>Plataforma por <strong className="font-bold text-white">ISAPromoRD</strong></span>
</a>`;
  } else {
    codeArea.value = 
`<!-- Badge de Atribución Oficial ISAPromoRD -->
<a href="${url}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:9999px;background:#0f172a;color:#cbd5e1;border:1px solid #334155;text-decoration:none;font-size:12px;font-family:system-ui,-apple-system,sans-serif;font-weight:600;">
  <span style="width:8px;height:8px;border-radius:50%;background:#34d399;display:inline-block;"></span>
  <span>Plataforma por <strong style="color:#ffffff;">ISAPromoRD</strong></span>
</a>`;
  }
}

export function copySnippetCode() {
  const area = document.getElementById("snippetCodeArea");
  if (!area) return;
  area.select();
  navigator.clipboard.writeText(area.value).then(() => {
    const btn = document.getElementById("copySnippetBtn");
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = `<span>✅ ¡Copiado!</span>`;
      setTimeout(() => btn.innerHTML = orig, 2000);
    }
  });
}

export function openNewPartnerModal() {
  const modal = document.getElementById("newPartnerModal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

export function closeNewPartnerModal() {
  const modal = document.getElementById("newPartnerModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

export async function saveNewPartner(e) {
  if (e && e.preventDefault) e.preventDefault();
  const name = document.getElementById("partnerNameInput")?.value.trim() || "";
  const slug = (document.getElementById("partnerSlugInput")?.value.trim() || "").toLowerCase().replace(/[^a-z0-9-]/g, '');
  const url = document.getElementById("partnerUrlInput")?.value.trim() || "";
  const reward = document.getElementById("partnerRewardInput")?.value.trim() || "";

  if (!name || !slug) {
    alert("Por favor completa el nombre y slug del partner.");
    return;
  }

  const newPartner = {
    id: slug,
    client_slug: slug,
    client_name: name,
    website_url: url,
    reward_description: reward,
    created_at: new Date().toISOString()
  };

  referralPartners.unshift(newPartner);
  saveReferralPartnersToStorage(referralPartners);

  try {
    fetch(`${SUPABASE_CONFIG.url}/rest/v1/isapromo_referrals`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_CONFIG.anonKey,
        'Authorization': `Bearer ${await getAccessToken()}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(newPartner)
    }).catch(() => {});
  } catch (err) {}

  closeNewPartnerModal();
  const form = document.getElementById("newPartnerForm");
  if (form) form.reset();
  renderReferralsView();
  showToast(`✅ Partner "${name}" creado (?ref=${slug})`, 'success');
}

export function simulateReferralClick(slug) {
  const clickEvent = {
    id: "click-" + Date.now(),
    client_slug: slug,
    referrer_url: "Simulación Dashboard",
    created_at: new Date().toISOString()
  };
  referralClicks.unshift(clickEvent);
  renderReferralsView();
  showToast(`⚡ Clic simulado para ${slug}`, 'info');
}
