/**
 * ISAPROMORD OS — Acceso al panel
 * Solo se entra con una sesión real de Supabase Auth (correo y contraseña,
 * enlace mágico o Google) de un correo registrado en public.isapromo_admins.
 * La sesión queda guardada en el navegador, así que no hace falta entrar cada vez.
 */

import { getSupabaseClient } from './sync.js';
import { showToast } from './ui.js';

let onUnlockedCallback = null;
let unlocked = false;

function showLockModal() {
  const modal = document.getElementById("authLockModal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
  const sidebar = document.getElementById("stitchSidebar");
  if (sidebar) sidebar.classList.add("!hidden");
  const mobileNav = document.getElementById("mobileBottomNav");
  if (mobileNav) mobileNav.classList.add("!hidden");
  const emailInput = document.getElementById("authEmailInput");
  if (emailInput) setTimeout(() => emailInput.focus(), 100);
}

function showAuthError(message) {
  const errorMsg = document.getElementById("authEmailError");
  if (errorMsg) {
    errorMsg.textContent = message;
    errorMsg.classList.remove("hidden");
  }
}

// Desbloquea solo si la sesión pertenece a un administrador registrado
async function unlockIfAdmin(session) {
  if (unlocked || !session || !session.user) return false;
  const sb = getSupabaseClient();
  const { data: isAdmin, error } = await sb.rpc("is_isapromo_admin");
  if (error || isAdmin !== true) {
    await sb.auth.signOut().catch(() => {});
    showAuthError("Este correo no tiene acceso al panel.");
    showLockModal();
    return false;
  }
  unlocked = true;
  unlockDashboardModal();
  if (onUnlockedCallback) onUnlockedCallback(session);
  return true;
}

export async function initAuth(onUnlocked) {
  onUnlockedCallback = onUnlocked || null;
  showLockModal();

  const sb = getSupabaseClient();
  if (!sb || !sb.auth) {
    showAuthError("No se pudo conectar con el servidor de acceso. Revisa tu conexión y recarga la página.");
    return;
  }

  // Tras volver de Google o del enlace mágico, Supabase emite SIGNED_IN
  sb.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN" && session) {
      unlockIfAdmin(session).then((ok) => {
        if (ok) showToast(`✓ Sesión iniciada: ${session.user.email}`, "success");
      });
    }
  });

  try {
    const { data: { session } } = await sb.auth.getSession();
    if (session) await unlockIfAdmin(session);
  } catch (err) {
    console.warn("Supabase Auth session check notice:", err);
  }
}

export function unlockDashboardModal() {
  const modal = document.getElementById("authLockModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }

  const sidebar = document.getElementById("stitchSidebar");
  if (sidebar) sidebar.classList.remove("!hidden");
  const mobileNav = document.getElementById("mobileBottomNav");
  if (mobileNav) mobileNav.classList.remove("!hidden");
}

// ==========================================
// EMAIL & PASSWORD LOGIN (SUPABASE)
// ==========================================
export async function handleEmailPasswordLogin(e) {
  if (e) e.preventDefault();
  const emailInput = document.getElementById("authEmailInput");
  const passInput = document.getElementById("authPasswordInput");
  const errorMsg = document.getElementById("authEmailError");
  const btn = document.getElementById("authEmailSubmitBtn");

  if (!emailInput || !passInput) return;
  const email = emailInput.value.trim();
  const password = passInput.value;

  if (!email || !password) {
    showAuthError("Por favor ingresa tu correo y contraseña.");
    return;
  }

  const sb = getSupabaseClient();
  if (!sb || !sb.auth) {
    showAuthError("No se pudo conectar con el servidor de acceso.");
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> <span>Verificando...</span>`;
  }
  if (errorMsg) errorMsg.classList.add("hidden");

  try {
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) {
      showAuthError("Correo o contraseña incorrectos.");
    } else if (data?.session) {
      passInput.value = "";
      if (await unlockIfAdmin(data.session)) {
        showToast(`✓ Bienvenido, ${data.user.email}`, "success");
      }
    }
  } catch (err) {
    showAuthError("Error de conexión. Inténtalo de nuevo.");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Iniciar Sesión";
    }
  }
}

// ==========================================
// GOOGLE OAUTH LOGIN
// ==========================================
export async function handleGoogleLogin() {
  const sb = getSupabaseClient();
  if (!sb || !sb.auth) {
    showAuthError("No se pudo conectar con el servidor de acceso.");
    return;
  }

  try {
    const { error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + window.location.pathname
      }
    });
    if (error) {
      showAuthError(`Google no está disponible: ${error.message}. Usa tu correo y contraseña.`);
    }
  } catch (err) {
    showAuthError("Error al conectar con Google. Usa tu correo y contraseña.");
  }
}

// ==========================================
// MAGIC LINK LOGIN (SIN CONTRASEÑA)
// ==========================================
export async function handleMagicLinkLogin() {
  const emailInput = document.getElementById("authEmailInput");
  const email = emailInput ? emailInput.value.trim() : "";
  if (!email) {
    showAuthError("Escribe tu correo arriba para enviarte el enlace de acceso.");
    return;
  }

  const sb = getSupabaseClient();
  if (!sb || !sb.auth) {
    showAuthError("No se pudo conectar con el servidor de acceso.");
    return;
  }

  try {
    // shouldCreateUser: false evita que cualquier correo cree una cuenta nueva
    const { error } = await sb.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: window.location.origin + window.location.pathname
      }
    });
    if (error) {
      showAuthError("No se pudo enviar el enlace a ese correo.");
    } else {
      showToast(`📩 Enlace enviado a ${email}. Revisa tu bandeja o spam.`, "success");
    }
  } catch (err) {
    showAuthError("Error al enviar el enlace: " + err.message);
  }
}

export function lockDashboard() {
  unlocked = false;
  const sb = getSupabaseClient();
  if (sb?.auth) {
    sb.auth.signOut().catch(() => {});
  }
  showLockModal();
}
