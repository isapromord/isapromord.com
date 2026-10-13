/**
 * ISAPROMORD OS — Enterprise Security & Multi-Auth System
 * Supports:
 * 1. Supabase Official Auth: Email & Password, Magic Link, Google OAuth.
 * 2. Rapid PIN Access (Factory PIN: 3690).
 * 3. Emergency Admin Bypass (Guaranteed 1-Click Access for Owner Isaías Santana).
 */

import { STORAGE_KEYS, DEFAULT_PIN } from './state.js';
import { supabaseClient } from './sync.js';
import { showToast } from './ui.js';

let currentAuthMode = 'pin'; // 'pin' | 'email'

export function getStoredPin() {
  return localStorage.getItem(STORAGE_KEYS.PIN) || DEFAULT_PIN;
}

export async function initAuth() {
  const modal = document.getElementById("authLockModal");
  if (!modal) return;

  // 1. Verificar si ya hay sesión autenticada en sessionStorage o localStorage
  const isSessionAuth = sessionStorage.getItem(STORAGE_KEYS.AUTH) === "true";
  const isRemembered = localStorage.getItem("isapromo_auth_remember") === "true";

  if (isSessionAuth || isRemembered) {
    unlockDashboardModal();
    return;
  }

  // 2. Verificar si hay sesión activa en Supabase Auth
  if (supabaseClient && supabaseClient.auth) {
    try {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (session && session.user) {
        sessionStorage.setItem(STORAGE_KEYS.AUTH, "true");
        unlockDashboardModal();
        return;
      }

      // Escuchar cambios de autenticación en tiempo real (ej. tras Google OAuth redirect)
      supabaseClient.auth.onAuthStateChange((event, session) => {
        if (session && session.user) {
          sessionStorage.setItem(STORAGE_KEYS.AUTH, "true");
          unlockDashboardModal();
          showToast(`✓ Sesión iniciada: ${session.user.email}`, 'success');
        }
      });
    } catch (err) {
      console.warn("Supabase Auth session check notice:", err);
    }
  }

  // Si no está autenticado, mostrar modal y hacer foco en input
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  const pinInput = document.getElementById("pinInput");
  if (pinInput) {
    setTimeout(() => pinInput.focus(), 100);
  }
}

export function unlockDashboardModal() {
  const modal = document.getElementById("authLockModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

// ==========================================
// PIN AUTHENTICATION
// ==========================================
export function handlePinSubmit(e) {
  if (e) e.preventDefault();
  const input = document.getElementById("pinInput");
  const errorMsg = document.getElementById("pinError");
  if (!input) return;

  const currentPin = getStoredPin();
  const enteredPin = input.value.trim();

  // Acepta el PIN guardado, el PIN de fábrica 3690 o el PIN maestro 369
  if (enteredPin === currentPin || enteredPin === DEFAULT_PIN || enteredPin === "3690" || enteredPin === "369") {
    sessionStorage.setItem(STORAGE_KEYS.AUTH, "true");
    const rememberMe = document.getElementById("pinRememberMe");
    if (rememberMe && rememberMe.checked) {
      localStorage.setItem("isapromo_auth_remember", "true");
    }
    unlockDashboardModal();
    if (errorMsg) errorMsg.classList.add("hidden");
    input.value = "";
    showToast("✓ Panel desbloqueado con éxito", "success");
  } else {
    if (errorMsg) {
      errorMsg.classList.remove("hidden");
      errorMsg.textContent = "PIN incorrecto. Puedes usar 3690 o el botón de acceso de emergencia.";
    }
    input.classList.add("border-rose-500", "animate-shake");
    input.value = "";
    setTimeout(() => {
      input.classList.remove("border-rose-500", "animate-shake");
    }, 500);
  }
}

// ==========================================
// GUARANTEED EMERGENCY BYPASS (NUNCA BLOQUEADO)
// ==========================================
export function emergencyBypassAuth() {
  sessionStorage.setItem(STORAGE_KEYS.AUTH, "true");
  localStorage.setItem("isapromo_auth_remember", "true");
  unlockDashboardModal();
  showToast("⚡ Acceso Maestro Concedido: Bienvenido Isaías", "success");
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
    if (errorMsg) {
      errorMsg.textContent = "Por favor ingresa tu correo y contraseña.";
      errorMsg.classList.remove("hidden");
    }
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> <span>Verificando...</span>`;
  }
  if (errorMsg) errorMsg.classList.add("hidden");

  if (!supabaseClient || !supabaseClient.auth) {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Iniciar Sesión";
    }
    // Fallback a modo offline
    sessionStorage.setItem(STORAGE_KEYS.AUTH, "true");
    unlockDashboardModal();
    showToast("✓ Sesión iniciada en modo local", "success");
    return;
  }

  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      // Si el usuario no existe en Supabase, intentar registrarlo automáticamente
      if (error.message.includes("Invalid login credentials") || error.message.includes("not found")) {
        const { data: signUpData, error: signUpErr } = await supabaseClient.auth.signUp({
          email,
          password
        });
        if (!signUpErr && signUpData?.user) {
          sessionStorage.setItem(STORAGE_KEYS.AUTH, "true");
          unlockDashboardModal();
          showToast(`✓ Cuenta creada y autenticada: ${email}`, "success");
          return;
        }
      }

      if (errorMsg) {
        errorMsg.textContent = `Error: ${error.message}. Puedes usar tu PIN 3690 o Acceso de Emergencia.`;
        errorMsg.classList.remove("hidden");
      }
    } else if (data?.user) {
      sessionStorage.setItem(STORAGE_KEYS.AUTH, "true");
      unlockDashboardModal();
      showToast(`✓ Bienvenido, ${data.user.email}`, "success");
    }
  } catch (err) {
    if (errorMsg) {
      errorMsg.textContent = "Error de conexión. Usa el PIN o Acceso de Emergencia.";
      errorMsg.classList.remove("hidden");
    }
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
  if (!supabaseClient || !supabaseClient.auth) {
    showToast("Supabase Auth no disponible. Desbloqueando con acceso maestro.", "info");
    emergencyBypassAuth();
    return;
  }

  try {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + window.location.pathname
      }
    });
    if (error) {
      showToast(`Aviso: ${error.message}. El proveedor Google requiere configuración en Supabase Console.`, "warning");
    }
  } catch (err) {
    showToast("Error al conectar con Google. Usa el PIN o Acceso de Emergencia.", "error");
  }
}

// ==========================================
// MAGIC LINK LOGIN (SIN CONTRASEÑA)
// ==========================================
export async function handleMagicLinkLogin() {
  const emailInput = document.getElementById("authEmailInput");
  const email = emailInput ? emailInput.value.trim() : "";
  if (!email) {
    alert("Introduce tu correo electrónico arriba para enviarte un enlace de acceso directo.");
    return;
  }

  if (!supabaseClient || !supabaseClient.auth) {
    emergencyBypassAuth();
    return;
  }

  try {
    const { error } = await supabaseClient.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + window.location.pathname
      }
    });
    if (error) {
      alert("Aviso: " + error.message);
    } else {
      alert(`📩 ¡Enlace mágico enviado a ${email}! Revisa tu bandeja de entrada o spam para entrar con 1 clic.`);
    }
  } catch (err) {
    alert("Error al enviar enlace mágico: " + err.message);
  }
}

// ==========================================
// TAB SWITCHER EN EL MODAL DE LOGIN
// ==========================================
export function switchAuthMode(mode) {
  currentAuthMode = mode;
  const pinSection = document.getElementById("authSectionPin");
  const emailSection = document.getElementById("authSectionEmail");
  const tabPinBtn = document.getElementById("authTabPinBtn");
  const tabEmailBtn = document.getElementById("authTabEmailBtn");

  if (mode === 'email') {
    if (pinSection) pinSection.classList.add("hidden");
    if (emailSection) emailSection.classList.remove("hidden");
    if (tabEmailBtn) tabEmailBtn.className = "flex-1 py-2 text-xs font-bold rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm transition-all";
    if (tabPinBtn) tabPinBtn.className = "flex-1 py-2 text-xs font-semibold rounded-md text-slate-400 hover:text-white transition-all";
    const emailIn = document.getElementById("authEmailInput");
    if (emailIn) emailIn.focus();
  } else {
    if (emailSection) emailSection.classList.add("hidden");
    if (pinSection) pinSection.classList.remove("hidden");
    if (tabPinBtn) tabPinBtn.className = "flex-1 py-2 text-xs font-bold rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm transition-all";
    if (tabEmailBtn) tabEmailBtn.className = "flex-1 py-2 text-xs font-semibold rounded-md text-slate-400 hover:text-white transition-all";
    const pinIn = document.getElementById("pinInput");
    if (pinIn) pinIn.focus();
  }
}

export function lockDashboard() {
  sessionStorage.removeItem(STORAGE_KEYS.AUTH);
  localStorage.removeItem("isapromo_auth_remember");
  if (supabaseClient?.auth) {
    supabaseClient.auth.signOut().catch(() => {});
  }
  const modal = document.getElementById("authLockModal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
  const pinInput = document.getElementById("pinInput");
  if (pinInput) pinInput.focus();
}

export function saveNewPin() {
  const input = document.getElementById("newPinInput");
  if (!input) return;
  const newPin = input.value.trim();
  const successMsg = document.getElementById("pinSuccess");

  if (newPin.length >= 4) {
    localStorage.setItem(STORAGE_KEYS.PIN, newPin);
    if (successMsg) successMsg.classList.remove("hidden");
    input.value = "";
    setTimeout(() => {
      if (successMsg) successMsg.classList.add("hidden");
    }, 3000);
    showToast("✓ Nuevo PIN guardado exitosamente", "success");
  } else {
    alert("El PIN debe tener al menos 4 caracteres numéricos.");
  }
}
