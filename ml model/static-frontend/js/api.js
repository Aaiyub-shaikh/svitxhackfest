import { API_BASE } from './config.js';
import { logout } from './auth.js';

export async function apiFetch(path, opts = {}) {
  const token = localStorage.getItem('sf_token');
  const headers = opts.headers ? { ...opts.headers } : {};
  if (!headers['Content-Type'] && !(opts.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  if (res.status === 401) {
    logout(true);
    throw new Error('Unauthorized');
  }
  if (!res.ok) {
    const txt = await res.text().catch(()=>'');
    throw new Error(`HTTP ${res.status}: ${txt}`);
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return res.text();
}

export const AuthAPI = {
  async login({ email, password }) {
    return apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  },
  async register({ name, email, phone, password, role }) {
    return apiFetch('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, phone, password, role }) });
  }
};

export const IoTAPI = {
  async postReading(data) {
    return apiFetch('/iot/readings', { method: 'POST', body: JSON.stringify(data) });
  },
  async getDashboard({ farmerId, plotId }) {
    return apiFetch(`/farmers/${encodeURIComponent(farmerId)}/plots/${encodeURIComponent(plotId)}/dashboard`, { method: 'GET' });
  },
  async getReadings({ farmerId, plotId, from, to, limit=200 }) {
    const qs = new URLSearchParams({ from: from||'', to: to||'', limit: String(limit) });
    return apiFetch(`/farmers/${encodeURIComponent(farmerId)}/plots/${encodeURIComponent(plotId)}/readings?${qs.toString()}`, { method: 'GET' });
  }
};

export const DiseaseAPI = {
  // Prefer using XMLHttpRequest from diseaseScan.js for progress
  async scan(formData) {
    return apiFetch('/disease/scan', { method: 'POST', body: formData });
  }
};

export const MarketplaceAPI = {
  async getMarketplace({ cropType, region, minQty } = {}) {
    const qs = new URLSearchParams();
    if (cropType) qs.set('cropType', cropType);
    if (region) qs.set('region', region);
    if (minQty) qs.set('minQty', String(minQty));
    const q = qs.toString();
    return apiFetch(`/marketplace${q ? `?${q}` : ''}`, { method: 'GET' });
  },
  async postRequirement(data) {
    return apiFetch('/buyer/requirements', { method: 'POST', body: JSON.stringify(data) });
  }
};

export const AssistantAPI = {
  async message({ userId, inputText, inputLang, inputAudioUrl }) {
    return apiFetch('/assistant/message', { method: 'POST', body: JSON.stringify({ userId, inputText, inputLang, inputAudioUrl }) });
  }
};
