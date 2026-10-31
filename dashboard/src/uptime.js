/**
 * ISAPromoRD - Network & Uptime Telemetry Engine
 * Dual DoH (Google + Cloudflare) + HTTP HEAD fallback for resilient latency measurement.
 */
import { state } from './state.js';
import { showToast, updateKpis } from './ui.js';

export async function checkUrlUptime(urlStr) {
  try {
    if (!urlStr) return { online: false, latency: null, dnsStatus: 'Sin URL', ip: null, isHttps: false };
    let urlObj;
    try {
      urlObj = new URL(urlStr.startsWith('http') ? urlStr : 'https://' + urlStr);
    } catch(e) {
      return { online: false, latency: null, dnsStatus: 'URL Inválida', ip: null, isHttps: false };
    }
    const hostname = urlObj.hostname;
    const isHttps = urlObj.protocol === 'https:';
    const start = performance.now();
    
    // Helper para consultar DoH con timeout estricto de 2.5s
    const fetchDoh = async (endpoint) => {
      const ctrl = new AbortController();
      const tid = setTimeout(() => { try { ctrl.abort(); } catch(e){} }, 2500);
      try {
        const resp = await fetch(endpoint, {
          headers: { 'accept': 'application/dns-json' },
          cache: 'no-store',
          signal: ctrl.signal
        });
        clearTimeout(tid);
        if (resp.ok) {
          const data = await resp.json();
          if (data.Status === 0 && data.Answer && data.Answer.length > 0) {
            const ip = data.Answer.find(a => a.type === 1)?.data || data.Answer[0].data;
            return { success: true, ip: ip };
          } else if (data.Status === 3) {
            return { success: false, isNxdomain: true };
          }
        }
      } catch(e) {
        clearTimeout(tid);
      }
      return { success: false, isNxdomain: false };
    };

    // 1. Google DoH Oficial (El más compatible en República Dominicana y redes móviles)
    let dnsRes = await fetchDoh(`https://dns.google/resolve?name=${encodeURIComponent(hostname)}&type=A`);
    
    // 2. Fallback a Cloudflare DoH si Google DoH falló
    if (!dnsRes.success && !dnsRes.isNxdomain) {
      dnsRes = await fetchDoh(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(hostname)}&type=A`);
    }

    const elapsed = Math.round(performance.now() - start);

    if (dnsRes.success) {
      return { online: true, latency: elapsed, dnsStatus: 'NOERROR (Activo)', ip: dnsRes.ip, isHttps: isHttps };
    }
    if (dnsRes.isNxdomain) {
      return { online: false, latency: elapsed, dnsStatus: 'NXDOMAIN (Inexistente)', ip: null, isHttps: isHttps };
    }

    // 3. Fallback directo a probe HTTP HEAD en caso de bloqueo de DoH por firewall/adblocker
    try {
      const directCtrl = new AbortController();
      const directTid = setTimeout(() => { try { directCtrl.abort(); } catch(e){} }, 2000);
      await fetch(urlObj.origin, { method: 'HEAD', mode: 'no-cors', signal: directCtrl.signal });
      clearTimeout(directTid);
      const headElapsed = Math.round(performance.now() - start);
      return { online: true, latency: headElapsed, dnsStatus: 'NOERROR (HTTP Live)', ip: null, isHttps: isHttps };
    } catch(netErr) {
      // Sin respuesta de DNS ni HTTP: no sabemos si está en línea, no lo inventamos
      return { online: null, latency: null, dnsStatus: 'Sin respuesta (no verificado)', ip: null, isHttps: isHttps };
    }
  } catch (err) {
    return { online: null, latency: null, dnsStatus: 'Error al verificar', ip: null, isHttps: false };
  }
}

// online: true = en línea, false = caído, null = no se pudo verificar
function uptimeStatusFrom(result) {
  if (result.online === null) return "unknown";
  return result.online ? "online" : "offline";
}

export async function pingSingleClient(id) {
  const client = state.clients.find(c => c.id === id);
  if (!client || !client.liveUrl) return;

  client.uptimeStatus = "checking";
  if (window.renderClients) window.renderClients();

  const result = await checkUrlUptime(client.liveUrl);
  client.uptimeStatus = uptimeStatusFrom(result);
  client.latencyMs = result.latency;
  client.dnsStatus = result.dnsStatus;
  client.dnsRecord = result.ip;
  if (window.renderClients) window.renderClients();
}

export async function pingCurrentDrilldownClient() {
  const client = state.clients.find(c => c.id === state.currentDrilldownClientId);
  if (!client || !client.liveUrl) {
    showToast("Este cliente no tiene una URL asignada para auditar", "warning");
    return;
  }
  const spinner = document.getElementById("ddPingSpinner");
  if (spinner) spinner.classList.remove("hidden");
  client.uptimeStatus = "checking";
  if (window.renderClientDrilldown) window.renderClientDrilldown();

  const result = await checkUrlUptime(client.liveUrl);
  if (spinner) spinner.classList.add("hidden");

  client.uptimeStatus = uptimeStatusFrom(result);
  client.latencyMs = result.latency;
  client.dnsStatus = result.dnsStatus;
  client.dnsRecord = result.ip;
  if (window.renderClientDrilldown) window.renderClientDrilldown();
  if (result.online === null) {
    showToast("No se pudo verificar el sitio desde este navegador (sin respuesta). Inténtalo de nuevo.", "warning");
  } else {
    showToast(result.online ? `Auditoría web en vivo completada: En línea (~${result.latency}ms)` : `Atención: Fallo en resolución DNS o URL inaccesible`, result.online ? "success" : "error");
  }
}

export async function pingAllClients() {
  // 1. Sondeo concurrente sin mutar preventivamente a "checking"
  await Promise.allSettled(state.clients.map(async (client) => {
    if (!client.liveUrl) return;
    try {
      const res = await checkUrlUptime(client.liveUrl);
      client.uptimeStatus = uptimeStatusFrom(res);
      client.latencyMs = res.latency;
      client.dnsStatus = res.dnsStatus;
      client.dnsRecord = res.ip;
    } catch(e) {
      client.uptimeStatus = "unknown";
      client.latencyMs = null;
    }
  }));

  // 2. Garantizar que ningún cliente quede en estado transitorio
  state.clients.forEach(c => {
    if (!c.uptimeStatus || c.uptimeStatus === "checking") c.uptimeStatus = "unknown";
  });

  const totalProbed = state.clients.filter(c => c.liveUrl && c.uptimeStatus !== "unknown");
  const onlineProbed = totalProbed.filter(c => c.uptimeStatus === "online");
  const dnsEl = document.getElementById("telemetryDnsStatus");
  if (dnsEl && totalProbed.length > 0) {
    const pct = Math.round((onlineProbed.length / totalProbed.length) * 100);
    dnsEl.textContent = `${pct}% NOERROR`;
    dnsEl.className = pct === 100 ? "text-emerald-400 font-bold" : "text-amber-400 font-bold";
  }
  if (window.renderClients) window.renderClients();
  updateKpis();
}
