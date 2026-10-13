/**
 * ISAPROMORD OS — Security & Auth Module
 * PIN protection and session management.
 */

import { STORAGE_KEYS, DEFAULT_PIN } from './state.js';

export function getStoredPin() {
  return localStorage.getItem(STORAGE_KEYS.PIN) || DEFAULT_PIN;
}

export function initAuth() {
  const isAuth = sessionStorage.getItem(STORAGE_KEYS.AUTH);
  const modal = document.getElementById("authLockModal");
  if (!modal) return;

  if (isAuth === "true") {
    modal.classList.add("hidden");
  } else {
    modal.classList.remove("hidden");
    const pinInput = document.getElementById("pinInput");
    if (pinInput) pinInput.focus();
  }
}

export function handlePinSubmit(e) {
  if (e) e.preventDefault();
  const input = document.getElementById("pinInput");
  const errorMsg = document.getElementById("pinError");
  if (!input) return;

  const currentPin = getStoredPin();

  if (input.value.trim() === currentPin) {
    sessionStorage.setItem(STORAGE_KEYS.AUTH, "true");
    const modal = document.getElementById("authLockModal");
    if (modal) modal.classList.add("hidden");
    if (errorMsg) errorMsg.classList.add("hidden");
    input.value = "";
  } else {
    if (errorMsg) errorMsg.classList.remove("hidden");
    input.classList.add("border-rose-500", "animate-shake");
    input.value = "";
    setTimeout(() => {
      input.classList.remove("border-rose-500", "animate-shake");
    }, 500);
  }
}

export function lockDashboard() {
  sessionStorage.removeItem(STORAGE_KEYS.AUTH);
  const modal = document.getElementById("authLockModal");
  if (modal) modal.classList.remove("hidden");
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
  } else {
    alert("El PIN debe tener al menos 4 caracteres numéricos.");
  }
}
