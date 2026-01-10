export const API_BASE = window.__ENV__?.API_BASE || 'https://api.example.com';
export const STORAGE_KEYS = { token: 'sf_token', user: 'sf_user', lang: 'sf_lang', chat: 'sf_chat_msgs' };

export function getAuthToken() { return localStorage.getItem(STORAGE_KEYS.token); }
export function setAuthToken(t) { localStorage.setItem(STORAGE_KEYS.token, t); }
export function clearAuth() { localStorage.removeItem(STORAGE_KEYS.token); localStorage.removeItem(STORAGE_KEYS.user); }
export function getUser() { try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.user) || 'null'); } catch { return null; } }
export function setUser(u) { localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(u)); }
