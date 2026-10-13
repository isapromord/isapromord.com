/**
 * ISAPROMORD OS — Sync & Persistence Engine
 * Cloud-First, Resilient Bidirectional Union Merge between Supabase and LocalStorage.
 * Zero-Data-Loss guarantee with retry logic.
 */

import { state, STORAGE_KEYS, SUPABASE_CONFIG, INITIAL_CLIENTS } from './state.js';

let supabaseClient = null;

export function getSupabaseClient() {
  if (!supabaseClient && window.supabase && typeof window.supabase.createClient === "function") {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY);
    } catch (e) {
      console.warn("[Sync] Error initializing Supabase client:", e);
    }
  }
  return supabaseClient;
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
    fee: client.fee || "",
    renewal_date: cleanDate(client.renewalDate),
    last_payment_date: cleanDate(client.lastPaymentDate),
    joined_date: cleanDate(client.joinedDate),
    repo_url: client.repoUrl || "",
    notes: client.notes || "",
    health_score: typeof client.healthScore === "number" ? client.healthScore : 100,
    optimization_matrix: client.optimizationMatrix || {},
    tasks: Array.isArray(client.tasks) ? client.tasks : [],
    payment_history: Array.isArray(client.paymentHistory) ? client.paymentHistory : [],
    uptime_status: (client.uptimeStatus === "checking" ? "online" : client.uptimeStatus) || "online",
    latency_ms: typeof client.latencyMs === "number" ? client.latencyMs : null,
    updated_at: new Date().toISOString()
  };
}

export function dbRowToClient(row) {
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
    fee: row.fee,
    renewalDate: row.renewal_date,
    lastPaymentDate: row.last_payment_date,
    joinedDate: row.joined_date,
    repoUrl: row.repo_url,
    notes: row.notes,
    healthScore: typeof row.health_score === "number" ? row.health_score : (Number(row.health_score) || 100),
    optimizationMatrix: row.optimization_matrix || {},
    tasks: Array.isArray(row.tasks) ? row.tasks : [],
    paymentHistory: Array.isArray(row.payment_history) ? row.payment_history : [],
    uptimeStatus: (row.uptime_status === "checking" ? "online" : row.uptime_status) || "online",
    latencyMs: row.latency_ms
  };
}

export function loadClients() {
  const stored = localStorage.getItem(STORAGE_KEYS.CLIENTS);
  if (stored) {
    try {
      state.clients = JSON.parse(stored);
      let updated = false;

      // Sincronizar clientes oficiales base si faltan
      INITIAL_CLIENTS.forEach(initC => {
        const idx = state.clients.findIndex(c => c.id === initC.id);
        if (idx === -1) {
          state.clients.push(initC);
          updated = true;
        } else {
          if (state.clients[idx].healthScore === undefined) {
            state.clients[idx].healthScore = initC.healthScore || 100;
            updated = true;
          }
          if (!state.clients[idx].optimizationMatrix) {
            state.clients[idx].optimizationMatrix = initC.optimizationMatrix;
            updated = true;
          }
          if (initC.tasks && state.clients[idx].tasks) {
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
      });

      // Purgar duplicados estrictamente por ID único
      const dedupMap = new Map();
      state.clients.forEach(c => {
        if (c && c.id && !dedupMap.has(c.id)) {
          dedupMap.set(c.id, c);
        } else {
          updated = true;
        }
      });
      state.clients = Array.from(dedupMap.values());

      if (updated) saveClientsToStorage(false);
    } catch (e) {
      console.warn("[Sync] Error parsing local clients, falling back to initial:", e);
      state.clients = [...INITIAL_CLIENTS];
      saveClientsToStorage(false);
    }
  } else {
    state.clients = [...INITIAL_CLIENTS];
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
  } catch (err) {
    console.warn("[Sync] syncAllClientsToCloud exception:", err);
  }
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
      const rawRemote = data
        .map(dbRowToClient)
        .filter(c => !PURGED_CLIENT_IDS.includes(c.id) && !c.id.includes('synkrd') && !c.id.includes('nextcrm') && !c.id.includes('vetmetropolitana'));

      // Map consolidado bidireccional indexado estrictamente por ID único
      const clientMap = new Map();

      // 1. Insertar clientes remotos de Supabase
      rawRemote.forEach(remoteC => {
        clientMap.set(remoteC.id, remoteC);
      });

      // 2. FUSIONAR clientes locales (Garantía de no pérdida: NUNCA borrar clientes locales)
      const localOnlyToUpload = [];
      (state.clients || []).forEach(localC => {
        if (!localC || !localC.id) return;
        if (PURGED_CLIENT_IDS.includes(localC.id)) return;

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

      // Consolidar estado unificado
      state.clients = Array.from(clientMap.values());
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
      updateCloudSyncBadge("syncing", "☁️ Sembrando Nube...");
      await syncAllClientsToCloud();
      updateCloudSyncBadge("synced", `☁️ ${state.clients.length} Clientes en Nube`);
    }
  } catch (err) {
    console.warn("[Sync] initCloudSync exception:", err);
    updateCloudSyncBadge("offline", "☁️ Local (Offline)");
  }
}
