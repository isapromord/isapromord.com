/**
 * ISAPROMORD OS — Sync & Persistence Engine
 * Cloud-First, Resilient Bidirectional Union Merge between Supabase and LocalStorage.
 * Zero-Data-Loss guarantee with retry logic.
 */

import { state, STORAGE_KEYS, SUPABASE_CONFIG, INITIAL_CLIENTS } from './state.js';

export let supabaseClient = null;

export function getSupabaseClient() {
  if (!supabaseClient && typeof window !== "undefined" && window.supabase && typeof window.supabase.createClient === "function") {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY);
    } catch (e) {
      console.warn("[Sync] Error initializing Supabase client:", e);
    }
  }
  return supabaseClient;
}

// Token de la sesión del administrador para llamadas REST directas (RLS solo-dueño)
export async function getAccessToken() {
  const sb = getSupabaseClient();
  try {
    const { data } = await sb.auth.getSession();
    if (data?.session?.access_token) return data.session.access_token;
  } catch (e) {}
  return SUPABASE_CONFIG.ANON_KEY;
}

// Auto-initialize if running in browser with Supabase CDN loaded
if (typeof window !== "undefined" && window.supabase) {
  getSupabaseClient();
}

export function updateCloudSyncBadge(status, text) {
  const badge = document.getElementById("cloudSyncBtn");
  const dot = document.getElementById("cloudSyncDot");
  const label = document.getElementById("cloudSyncText");
  if (!badge || !dot || !label) return;

  if (status === "syncing") {
    badge.className = "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all cursor-pointer";
    dot.className = "w-1.5 h-1.5 rounded-full bg-cyan-400 animate-spin";
    label.textContent = text || "☁️ Sincronizando...";
  } else if (status === "synced") {
    badge.className = "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all cursor-pointer";
    dot.className = "w-1.5 h-1.5 rounded-full bg-emerald-400";
    label.textContent = text || "☁️ Nube al Día";
  } else if (status === "offline") {
    badge.className = "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all cursor-pointer";
    dot.className = "w-1.5 h-1.5 rounded-full bg-amber-400";
    label.textContent = text || "☁️ Local (Offline)";
  } else if (status === "error") {
    badge.className = "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 transition-all cursor-pointer";
    dot.className = "w-1.5 h-1.5 rounded-full bg-rose-400";
    label.textContent = text || "☁️ Error Nube";
  }
}

export function clientToDbRow(client) {
  // Asegurar que fechas vacías sean null para respetar tipos Postgres DATE
  const cleanDate = (d) => (d && typeof d === 'string' && d.trim().length >= 8 ? d.trim() : null);
  const isInternal = Boolean(client.isInternal || client.setupStatus === 'internal');

  return {
    id: client.id,
    name: client.name || "Sin nombre",
    category: client.category || "General",
    live_url: client.liveUrl || "",
    platform: client.platform || "",
    contact_person: client.contactPerson || "",
    phone: client.phone || "",
    email: client.email || "",
    status: client.status || "active",
    fee: isInternal ? "RD$ 0 / mes" : (client.fee || ""),
    renewal_date: cleanDate(client.renewalDate),
    last_payment_date: cleanDate(client.lastPaymentDate),
    joined_date: cleanDate(client.joinedDate),
    repo_url: client.repoUrl || "",
    notes: client.notes || "",
    health_score: typeof client.healthScore === "number" ? client.healthScore : 100,
    optimization_matrix: {
      ...(client.optimizationMatrix || {}),
      isInternal,
      contractedServices: Array.isArray(client.contractedServices) ? client.contractedServices : undefined,
      setupPrice: isInternal ? 0 : (client.setupPrice !== undefined ? client.setupPrice : 30000),
      setupStatus: isInternal ? 'internal' : (client.setupStatus || 'settled'),
      proposalUrl: client.proposalUrl,
      proposalId: client.proposalId,
      proposalStatus: client.proposalStatus
    },
    tasks: Array.isArray(client.tasks) ? client.tasks : [],
    payment_history: Array.isArray(client.paymentHistory) ? client.paymentHistory : [],
    uptime_status: (client.uptimeStatus === "checking" ? "online" : client.uptimeStatus) || "online",
    latency_ms: typeof client.latencyMs === "number" ? client.latencyMs : null,
    updated_at: new Date().toISOString()
  };
}

export function dbRowToClient(row) {
  const isInternal = Boolean(
    row.is_internal || 
    row.optimization_matrix?.isInternal || 
    row.optimization_matrix?.setupStatus === 'internal' || 
    row.setup_status === 'internal'
  );

  return {
    id: row.id,
    name: row.name,
    category: row.category,
    liveUrl: row.live_url,
    platform: row.platform,
    contactPerson: row.contact_person,
    phone: row.phone,
    email: row.email,
    status: row.status,
    isInternal,
    fee: isInternal ? "RD$ 0 / mes" : (row.fee || ""),
    renewalDate: row.renewal_date,
    lastPaymentDate: row.last_payment_date,
    joinedDate: row.joined_date,
    repoUrl: row.repo_url,
    notes: row.notes,
    healthScore: typeof row.health_score === "number" ? row.health_score : (Number(row.health_score) || 100),
    contractedServices: Array.isArray(row.contracted_services)
      ? row.contracted_services
      : (row.optimization_matrix && Array.isArray(row.optimization_matrix.contractedServices))
        ? row.optimization_matrix.contractedServices
        : ['web_conversion', 'google_maps_gbp', 'whatsapp_social_cards', 'geo_ai_schemas', 'onpage_seo_console', 'cloud_maintenance'],
    optimizationMatrix: row.optimization_matrix || {},
    setupPrice: isInternal ? 0 : (row.optimization_matrix?.setupPrice !== undefined ? Number(row.optimization_matrix.setupPrice) : (row.setup_price !== undefined ? Number(row.setup_price) : 30000)),
    setupStatus: isInternal ? 'internal' : (row.optimization_matrix?.setupStatus || row.setup_status || 'settled'),
    proposalUrl: row.optimization_matrix?.proposalUrl || row.proposal_url,
    proposalId: row.optimization_matrix?.proposalId || row.proposal_id,
    proposalStatus: row.optimization_matrix?.proposalStatus || row.proposal_status || 'approved',
    tasks: Array.isArray(row.tasks) ? row.tasks : [],
    paymentHistory: Array.isArray(row.payment_history) ? row.payment_history : [],
    uptimeStatus: (row.uptime_status === "checking" ? "online" : row.uptime_status) || "online",
    latencyMs: row.latency_ms,
    isAgency: row.id === "agency-isapromord" || (row.fee && row.fee.includes("Casa Matriz")) || false
  };
}

export function getDeletedClientIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DELETED_CLIENT_IDS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function recordDeletedClientId(id) {
  if (!id) return;
  try {
    const ids = getDeletedClientIds();
    if (!ids.includes(id)) {
      ids.push(id);
      localStorage.setItem(STORAGE_KEYS.DELETED_CLIENT_IDS, JSON.stringify(ids));
    }
  } catch (e) {
    console.warn("[Sync] Error recording deleted client ID:", e);
  }
}

function normalizeUrlKey(url) {
  if (!url) return "";
  try {
    const parsed = new URL(url.trim());
    return (parsed.hostname + parsed.pathname).toLowerCase().replace(/\/+$/, "");
  } catch (e) {
    return url.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/+$/, "");
  }
}

export const SYSTEM_VAULT_ID = "__isapromo_system_vault__";

export function loadClients() {
  const stored = localStorage.getItem(STORAGE_KEYS.CLIENTS);
  const deletedIds = getDeletedClientIds();

  if (stored) {
    try {
      state.clients = JSON.parse(stored);
      let updated = false;

      // Filtrar inmediatamente cualquier cliente que haya sido eliminado explícitamente (Tombstones) o el System Vault
      const prevCount = state.clients.length;
      state.clients = state.clients.filter(c => c && c.id && c.id !== SYSTEM_VAULT_ID && !deletedIds.includes(c.id));
      if (state.clients.length !== prevCount) updated = true;

      // Sincronizar clientes oficiales base SOLO si no han sido eliminados por el usuario
      INITIAL_CLIENTS.forEach(initC => {
        if (deletedIds.includes(initC.id)) return; // RESPETAR BORRADO: Jamás resucitar cliente eliminado

        const idx = state.clients.findIndex(c => c.id === initC.id);
        if (idx === -1) {
          // Verificar si ya existe otro cliente con la misma URL en vivo antes de insertar
          const initUrlKey = normalizeUrlKey(initC.liveUrl);
          const urlExists = initUrlKey && state.clients.some(c => normalizeUrlKey(c.liveUrl) === initUrlKey);
          if (!urlExists) {
            state.clients.push(initC);
            updated = true;
          }
        } else {
          if (state.clients[idx].healthScore === undefined) {
            state.clients[idx].healthScore = initC.healthScore || 100;
            updated = true;
          }
          if (!state.clients[idx].optimizationMatrix) {
            state.clients[idx].optimizationMatrix = initC.optimizationMatrix;
            updated = true;
          }
          if (!state.clients[idx].contractedServices) {
            state.clients[idx].contractedServices = initC.contractedServices ? [...initC.contractedServices] : ['web_conversion', 'google_maps_gbp', 'whatsapp_social_cards', 'geo_ai_schemas', 'onpage_seo_console', 'cloud_maintenance'];
            updated = true;
          }
          if (initC.proposalUrl && !state.clients[idx].proposalUrl) {
            state.clients[idx].proposalUrl = initC.proposalUrl;
            state.clients[idx].proposalId = initC.proposalId;
            state.clients[idx].proposalStatus = initC.proposalStatus || 'approved';
            updated = true;
          }
          if (initC.id === "client-kendysastre" && state.clients[idx].fee === "RD$ 4,500 / mes") {
            state.clients[idx].fee = initC.fee;
            updated = true;
          }
          if (initC.isInternal) {
            if (!state.clients[idx].isInternal || state.clients[idx].setupStatus !== 'internal' || state.clients[idx].setupPrice !== 0 || state.clients[idx].fee !== 'RD$ 0 / mes') {
              state.clients[idx].isInternal = true;
              state.clients[idx].setupPrice = 0;
              state.clients[idx].setupStatus = 'internal';
              state.clients[idx].fee = 'RD$ 0 / mes';
              updated = true;
            }
          } else {
            state.clients[idx].isInternal = false;
            if (state.clients[idx].setupPrice === undefined && initC.setupPrice !== undefined) {
              state.clients[idx].setupPrice = initC.setupPrice;
              state.clients[idx].setupStatus = initC.setupStatus || 'settled';
              updated = true;
            }
          }
          if (initC.tasks) {
            if (!state.clients[idx].tasks) {
              state.clients[idx].tasks = JSON.parse(JSON.stringify(initC.tasks));
              updated = true;
            } else {
              initC.tasks.forEach(initTask => {
                const existingTask = state.clients[idx].tasks.find(t => t.id === initTask.id);
                if (!existingTask) {
                  state.clients[idx].tasks.push(initTask);
                  updated = true;
                } else if (initTask.guide && (!existingTask.guide || !existingTask.guide.details)) {
                  existingTask.guide = initTask.guide;
                  updated = true;
                }
              });
            }
          }
        }
      });

      // Purgar duplicados: primero por ID único, luego por URL en vivo normalizada
      const dedupIdMap = new Map();
      const dedupUrlMap = new Map();
      const finalClients = [];

      state.clients.forEach(c => {
        if (!c || !c.id || dedupIdMap.has(c.id)) {
          updated = true;
          return;
        }
        dedupIdMap.set(c.id, true);

        const urlKey = normalizeUrlKey(c.liveUrl);
        if (urlKey) {
          if (dedupUrlMap.has(urlKey)) {
            // Ya existe un cliente para esta misma URL: unificar al que tenga mejor información/score
            const existingIdx = dedupUrlMap.get(urlKey);
            const existing = finalClients[existingIdx];
            if ((c.healthScore !== undefined && (existing.healthScore === undefined || existing.healthScore === 100)) ||
                (c.notes && !existing.notes) ||
                (c.tasks && c.tasks.length > (existing.tasks ? existing.tasks.length : 0))) {
              finalClients[existingIdx] = { ...existing, ...c, id: existing.id };
            }
            updated = true;
            return;
          }
          dedupUrlMap.set(urlKey, finalClients.length);
        }
        if (!c.contractedServices || !Array.isArray(c.contractedServices)) {
          c.contractedServices = ['web_conversion', 'google_maps_gbp', 'whatsapp_social_cards', 'geo_ai_schemas', 'onpage_seo_console', 'cloud_maintenance'];
          updated = true;
        }

        finalClients.push(c);
      });

      state.clients = finalClients;

      if (updated) saveClientsToStorage(false);
    } catch (e) {
      console.warn("[Sync] Error parsing local clients, falling back to initial:", e);
      state.clients = INITIAL_CLIENTS.filter(c => !deletedIds.includes(c.id));
      saveClientsToStorage(false);
    }
  } else {
    state.clients = INITIAL_CLIENTS.filter(c => !deletedIds.includes(c.id));
    saveClientsToStorage(false);
  }
}

export function saveClientsToStorage(shouldSyncCloud = true) {
  try {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(state.clients));
    if (shouldSyncCloud) {
      syncAllClientsToCloud();
    }
  } catch (e) {
    console.error("[Sync] Error saving clients to localStorage:", e);
  }
}

// Sincronizar un único cliente a Supabase con reintento
export async function syncClientToCloud(client) {
  const sb = getSupabaseClient();
  if (!sb) {
    updateCloudSyncBadge("offline", "☁️ Local (Sin SDK)");
    return false;
  }

  try {
    updateCloudSyncBadge("syncing", "☁️ Guardando en Nube...");
    const row = clientToDbRow(client);
    const { error } = await sb
      .from(SUPABASE_CONFIG.TABLE_CLIENTS)
      .upsert(row, { onConflict: "id" });

    if (error) {
      console.error("[Sync] Supabase upsert error:", error);
      updateCloudSyncBadge("error", "☁️ Error Sync");
      return false;
    } else {
      updateCloudSyncBadge("synced", "☁️ Nube al Día");
      return true;
    }
  } catch (err) {
    console.warn("[Sync] syncClientToCloud exception:", err);
    updateCloudSyncBadge("offline", "☁️ Local (Offline)");
    return false;
  }
}

// Eliminar un cliente de Supabase
export async function deleteClientFromCloud(clientId) {
  const sb = getSupabaseClient();
  if (!sb) return;

  try {
    updateCloudSyncBadge("syncing", "☁️ Eliminando en Nube...");
    const { error } = await sb
      .from(SUPABASE_CONFIG.TABLE_CLIENTS)
      .delete()
      .eq("id", clientId);

    if (error) {
      console.error("[Sync] Supabase delete error:", error);
      updateCloudSyncBadge("error", "☁️ Error Sync");
    } else {
      updateCloudSyncBadge("synced", "☁️ Nube al Día");
    }
  } catch (err) {
    console.warn("[Sync] deleteClientFromCloud exception:", err);
  }
}

// Sincronizar todos los clientes locales a Supabase
export async function syncAllClientsToCloud() {
  const sb = getSupabaseClient();
  if (!sb || state.clients.length === 0) return;

  try {
    updateCloudSyncBadge("syncing", "☁️ Respaldando en Nube...");
    const rows = state.clients.map(clientToDbRow);
    const { error } = await sb
      .from(SUPABASE_CONFIG.TABLE_CLIENTS)
      .upsert(rows, { onConflict: "id" });

    if (error) {
      console.warn("[Sync] Batch upsert warning, fallback to individual upserts:", error);
      // Fallback seguro: upsert individual si el lote falló por alguna fila
      for (const c of state.clients) {
        await syncClientToCloud(c);
      }
    } else {
      updateCloudSyncBadge("synced", `☁️ ${state.clients.length} Clientes en Nube`);
    }
    await syncVaultToCloud();
  } catch (err) {
    console.warn("[Sync] syncAllClientsToCloud exception:", err);
  }
}

// La bóveda se reescribe completa: no se sube hasta haber leído la copia de la nube,
// para que un navegador nuevo (vacío) no borre contratos y propuestas guardados.
let vaultHydrated = false;

// Sincronizar Bóveda del Sistema (Contratos 50/50, Propuestas, Libro Contable CFO y Partners) en Supabase
export async function syncVaultToCloud() {
  const sb = getSupabaseClient();
  if (!sb || !vaultHydrated) return false;

  try {
    const contracts = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTRACTS) || "[]");
    const proposals = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROPOSALS) || "[]");
    const accountingLedger = state.accountingLedger && state.accountingLedger.length > 0
      ? state.accountingLedger
      : JSON.parse(localStorage.getItem(STORAGE_KEYS.ACCOUNTING) || "[]");
    const referrals = JSON.parse(localStorage.getItem(STORAGE_KEYS.REFERRALS) || "[]");

    const proposalPayloads = {};
    proposals.forEach(p => {
      if (p && p.id) {
        const raw = localStorage.getItem(`proposal_${p.id}`);
        if (raw) {
          try { proposalPayloads[p.id] = JSON.parse(raw); } catch (e) {}
        }
      }
    });

    const vaultRow = {
      id: SYSTEM_VAULT_ID,
      name: "ISAPromoRD System Vault",
      category: "System Vault",
      status: "archived",
      live_url: "",
      optimization_matrix: {
        isSystemVault: true,
        updatedAt: new Date().toISOString(),
        contracts,
        proposals,
        proposalPayloads,
        accountingLedger,
        referrals,
        bankDetails: localStorage.getItem(STORAGE_KEYS.BANK) || null
      },
      updated_at: new Date().toISOString()
    };

    const { error } = await sb.from(SUPABASE_CONFIG.TABLE_CLIENTS).upsert(vaultRow, { onConflict: "id" });
    if (error) {
      console.warn("[Sync] syncVaultToCloud error:", error);
      updateCloudSyncBadge("error", "⚠️ Contratos/propuestas sin respaldar");
      return false;
    }
    return true;
  } catch (e) {
    console.warn("[Sync] syncVaultToCloud warning:", e);
    return false;
  }
}

function mergeSystemVaultFromRemote(remoteVaultMatrix) {
  if (!remoteVaultMatrix || !remoteVaultMatrix.isSystemVault) return false;
  let hasChanges = false;

  // 1. Merge Contracts (prioritize signed status & signature data from remote client portal)
  if (Array.isArray(remoteVaultMatrix.contracts)) {
    const localContracts = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTRACTS) || "[]");
    const contractMap = new Map();
    remoteVaultMatrix.contracts.forEach(rc => { if (rc && rc.id) contractMap.set(rc.id, rc); });
    localContracts.forEach(lc => {
      if (!lc || !lc.id) return;
      if (contractMap.has(lc.id)) {
        const rc = contractMap.get(lc.id);
        // Si el contrato remoto fue firmado por el cliente en su móvil/PC, preservar la firma remota
        if (rc.status === 'signed' && lc.status !== 'signed') {
          contractMap.set(lc.id, rc);
        } else if (lc.status === 'signed' && rc.status !== 'signed') {
          contractMap.set(lc.id, lc);
        } else {
          contractMap.set(lc.id, { ...rc, ...lc, status: rc.status === 'signed' ? 'signed' : lc.status });
        }
      } else {
        contractMap.set(lc.id, lc);
      }
    });
    const mergedContracts = Array.from(contractMap.values());
    localStorage.setItem(STORAGE_KEYS.CONTRACTS, JSON.stringify(mergedContracts));
    hasChanges = true;
  }

  // 2. Merge Proposals & Proposal Payloads (prioritize approved status from remote client portal)
  if (remoteVaultMatrix.proposalPayloads && typeof remoteVaultMatrix.proposalPayloads === 'object') {
    Object.entries(remoteVaultMatrix.proposalPayloads).forEach(([propId, payload]) => {
      if (propId && payload) {
        localStorage.setItem(`proposal_${propId}`, JSON.stringify(payload));
      }
    });
  }

  if (Array.isArray(remoteVaultMatrix.proposals)) {
    const localProposals = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROPOSALS) || "[]");
    const propMap = new Map();
    remoteVaultMatrix.proposals.forEach(rp => { if (rp && rp.id) propMap.set(rp.id, rp); });
    localProposals.forEach(lp => {
      if (!lp || !lp.id) return;
      if (propMap.has(lp.id)) {
        const rp = propMap.get(lp.id);
        const isApproved = rp.status === 'approved' || lp.status === 'approved';
        propMap.set(lp.id, {
          ...rp,
          ...lp,
          status: isApproved ? 'approved' : (rp.status || lp.status || 'draft'),
          approvedAt: rp.approvedAt || lp.approvedAt || null
        });
      } else {
        propMap.set(lp.id, lp);
      }
    });
    const mergedProposals = Array.from(propMap.values());
    localStorage.setItem(STORAGE_KEYS.PROPOSALS, JSON.stringify(mergedProposals));
    hasChanges = true;
  }

  // 3. Merge Accounting Ledger (CFO)
  if (Array.isArray(remoteVaultMatrix.accountingLedger) && remoteVaultMatrix.accountingLedger.length > 0) {
    const localLedger = state.accountingLedger && state.accountingLedger.length > 0
      ? state.accountingLedger
      : JSON.parse(localStorage.getItem(STORAGE_KEYS.ACCOUNTING) || "[]");
    const txMap = new Map();
    remoteVaultMatrix.accountingLedger.forEach(rt => { if (rt && rt.id) txMap.set(rt.id, rt); });
    localLedger.forEach(lt => { if (lt && lt.id) txMap.set(lt.id, lt); });
    const mergedLedger = Array.from(txMap.values()).sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
    state.accountingLedger = mergedLedger;
    localStorage.setItem(STORAGE_KEYS.ACCOUNTING, JSON.stringify(mergedLedger));
    hasChanges = true;
  }

  // 4. Datos bancarios (la copia de la nube es la vigente)
  if (typeof remoteVaultMatrix.bankDetails === "string" && remoteVaultMatrix.bankDetails.trim()) {
    localStorage.setItem(STORAGE_KEYS.BANK, remoteVaultMatrix.bankDetails);
  }

  // 5. Merge Referrals
  if (Array.isArray(remoteVaultMatrix.referrals) && remoteVaultMatrix.referrals.length > 0) {
    const localRefs = JSON.parse(localStorage.getItem(STORAGE_KEYS.REFERRALS) || "[]");
    const refMap = new Map();
    remoteVaultMatrix.referrals.forEach(rr => { if (rr && rr.id) refMap.set(rr.id, rr); });
    localRefs.forEach(lr => { if (lr && lr.id) refMap.set(lr.id, lr); });
    localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(Array.from(refMap.values())));
    hasChanges = true;
  }

  return hasChanges;
}

// Inicializar sincronización en la nube con Fusión Bidireccional Resiliente (Union Merge)
export async function initCloudSync(renderCallback) {
  const sb = getSupabaseClient();
  if (!sb) {
    updateCloudSyncBadge("offline", "☁️ Local (Offline)");
    return;
  }

  try {
    updateCloudSyncBadge("syncing", "☁️ Conectando Nube...");
    const { data, error } = await sb
      .from(SUPABASE_CONFIG.TABLE_CLIENTS)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("[Sync] Supabase fetch error:", error);
      updateCloudSyncBadge("offline", "☁️ Local (Offline)");
      return;
    }

    if (data && data.length > 0) {
      const PURGED_CLIENT_IDS = ['client-synkrd', 'client-nextcrmrd', 'client-vet-metropolitana'];
      const deletedIds = getDeletedClientIds();

      // Extraer y sincronizar Bóveda del Sistema (Contratos, Propuestas, CFO, Referidos)
      const vaultRow = data.find(r => r.id === SYSTEM_VAULT_ID);
      vaultHydrated = true;
      if (vaultRow && vaultRow.optimization_matrix) {
        mergeSystemVaultFromRemote(vaultRow.optimization_matrix);
        if (window.renderProposalsHistory) window.renderProposalsHistory();
        if (window.loadAccountingData) window.loadAccountingData();
      } else {
        // Si aún no existe la bóveda en Supabase, subirla
        syncVaultToCloud();
      }

      // Purgar de Supabase en segundo plano cualquier registro remoto que haya sido eliminado localmente
      const toDeleteFromRemote = data.filter(r => r.id !== SYSTEM_VAULT_ID && (deletedIds.includes(r.id) || PURGED_CLIENT_IDS.includes(r.id)));
      if (toDeleteFromRemote.length > 0) {
        toDeleteFromRemote.forEach(r => deleteClientFromCloud(r.id));
      }

      const rawRemote = data
        .filter(r => r.id !== SYSTEM_VAULT_ID)
        .map(dbRowToClient)
        .filter(c => !PURGED_CLIENT_IDS.includes(c.id) && 
                     !deletedIds.includes(c.id) &&
                     !c.id.includes('synkrd') && 
                     !c.id.includes('nextcrm') && 
                     !c.id.includes('vetmetropolitana'));

      // Map consolidado bidireccional indexado estrictamente por ID único
      const clientMap = new Map();

      // 1. Insertar clientes remotos de Supabase
      rawRemote.forEach(remoteC => {
        clientMap.set(remoteC.id, remoteC);
      });

      // 2. FUSIONAR clientes locales (Garantía de no pérdida: NUNCA borrar clientes locales que no estén en deletedIds)
      const localOnlyToUpload = [];
      (state.clients || []).forEach(localC => {
        if (!localC || !localC.id || localC.id === SYSTEM_VAULT_ID) return;
        if (PURGED_CLIENT_IDS.includes(localC.id) || deletedIds.includes(localC.id)) return;

        if (clientMap.has(localC.id)) {
          // Ya existe en ambos: preservar datos más ricos o recién auditados
          const remoteC = clientMap.get(localC.id);
          if (typeof localC.healthScore === "number" && (remoteC.healthScore === null || remoteC.healthScore === 100)) {
            remoteC.healthScore = localC.healthScore;
          }
          if (localC.tasks && localC.tasks.length > (remoteC.tasks ? remoteC.tasks.length : 0)) {
            remoteC.tasks = localC.tasks;
          }
          if (localC.notes && !remoteC.notes) {
            remoteC.notes = localC.notes;
          }
          if (localC.lastAuditSummary && !remoteC.lastAuditSummary) {
            remoteC.lastAuditSummary = localC.lastAuditSummary;
          }
        } else {
          // Cliente local nuevo que no estaba en Supabase: PRESERVAR Y SUBIR
          clientMap.set(localC.id, localC);
          localOnlyToUpload.push(localC);
        }
      });

      // Purgar duplicados por URL en vivo normalizada (ej: lacapra.vercel.app duplicado con diferente ID)
      const mergedList = Array.from(clientMap.values());
      const dedupUrlMap = new Map();
      const finalMerged = [];

      mergedList.forEach(c => {
        const urlKey = normalizeUrlKey(c.liveUrl);
        if (urlKey) {
          if (dedupUrlMap.has(urlKey)) {
            const existingIdx = dedupUrlMap.get(urlKey);
            const existing = finalMerged[existingIdx];
            if ((c.healthScore !== undefined && (existing.healthScore === undefined || existing.healthScore === 100)) ||
                (c.notes && !existing.notes) ||
                (c.tasks && c.tasks.length > (existing.tasks ? existing.tasks.length : 0))) {
              finalMerged[existingIdx] = { ...existing, ...c, id: existing.id };
            }
            // Eliminar de Supabase el duplicado sobrante
            deleteClientFromCloud(c.id);
            return;
          }
          dedupUrlMap.set(urlKey, finalMerged.length);
        }
        finalMerged.push(c);
      });

      // Consolidar estado unificado
      state.clients = finalMerged;
      saveClientsToStorage(false);

      if (typeof renderCallback === "function") {
        renderCallback();
      }

      // Si habían clientes locales pendientes, subirlos en segundo plano
      if (localOnlyToUpload.length > 0) {
        console.log(`[Sync] Respaldando ${localOnlyToUpload.length} clientes locales pendientes a Supabase...`);
        for (const pendingC of localOnlyToUpload) {
          await syncClientToCloud(pendingC);
        }
      }

      updateCloudSyncBadge("synced", `☁️ ${state.clients.length} Clientes Sincronizados`);
    } else {
      // Supabase vacío: sembrar clientes iniciales
      vaultHydrated = true;
      updateCloudSyncBadge("syncing", "☁️ Sembrando Nube...");
      await syncAllClientsToCloud();
      updateCloudSyncBadge("synced", `☁️ ${state.clients.length} Clientes en Nube`);
    }
  } catch (err) {
    console.warn("[Sync] initCloudSync exception:", err);
    updateCloudSyncBadge("offline", "☁️ Local (Offline)");
  }
}

// Aliases and Manual Handlers
export const loadStoredClients = loadClients;

export async function manualTriggerCloudSync() {
  updateCloudSyncBadge("syncing", "☁️ Sincronizando...");
  await syncAllClientsToCloud();
  await syncVaultToCloud();
  await initCloudSync();
}

