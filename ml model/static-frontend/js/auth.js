import { AuthAPI } from './api.js';
import { STORAGE_KEYS } from './config.js';

export function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.user) || 'null'); } catch { return null; }
}
export function isAuthenticated() { return !!localStorage.getItem(STORAGE_KEYS.token); }
export function hasRole(role) { const u = getCurrentUser(); return !!u && u.role === role; }
export function saveAuth({ token, user }) {
  localStorage.setItem(STORAGE_KEYS.token, token);
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  window.dispatchEvent(new CustomEvent('auth:change', { detail: { user } }));
}
export async function login(email, password) { const res = await AuthAPI.login({ email, password }); saveAuth(res); return res; }
export async function register(data) { const res = await AuthAPI.register(data); saveAuth(res); return res; }
export function logout(silent=false) {
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.user);
  window.dispatchEvent(new CustomEvent('auth:change', { detail: { user: null } }));
  if (!silent) location.hash = '#/login';
}
export function requireAuth({ role } = {}) {
  const user = getCurrentUser();
  if (!user) { location.hash = '#/login'; return false; }
  if (role && user.role !== role) { location.hash = '#/login'; return false; }
  return true;
}
