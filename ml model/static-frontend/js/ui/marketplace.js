import { t } from '../i18n.js';
import { getCurrentUser } from '../auth.js';
import { MarketplaceAPI } from '../api.js';
import { sampleMarketplace } from '../data/demoData.js';
import { openBuyerFormModal } from './buyerForm.js';

export async function renderMarketplace(container) {
  const user = getCurrentUser();
  container.innerHTML = `
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold" data-i18n="marketplace.title">${t('marketplace.title')}</h1>
        ${user?.role === 'buyer' ? `<button id="createPost" class="px-3 py-2 rounded bg-blue-600 text-white" data-i18n="marketplace.create">${t('marketplace.create')}</button>` : ''}
      </div>
      <div class="flex gap-2">
        <input id="qCrop" class="px-3 py-2 border rounded flex-1" placeholder="${t('marketplace.search')}">
        <input id="qRegion" class="px-3 py-2 border rounded" placeholder="Region">
        <input id="qMinQty" type="number" class="px-3 py-2 border rounded w-28" placeholder="Min Qty">
        <button id="applyFilters" class="px-3 py-2 rounded bg-gray-100">Apply</button>
      </div>
      <div id="posts" class="grid gap-3"></div>
      <div id="pager" class="flex justify-center gap-2"></div>
    </section>`;

  const postsEl = container.querySelector('#posts');
  const pagerEl = container.querySelector('#pager');
  const createBtn = container.querySelector('#createPost');
  if (createBtn) createBtn.addEventListener('click', () => openBuyerFormModal({ onSaved: load }));

  const state = { page: 1, pageSize: 5, items: [] };

  async function load() {
    postsEl.innerHTML = '<div class="skeleton h-20 rounded"></div>';
    try {
      const params = readFilters();
      const res = await MarketplaceAPI.getMarketplace(params);
      state.items = Array.isArray(res) ? res : [];
    } catch {
      state.items = sampleMarketplace();
    }
    render();
  }

  function readFilters() {
    const cropType = container.querySelector('#qCrop').value.trim();
    const region = container.querySelector('#qRegion').value.trim();
    const minQty = container.querySelector('#qMinQty').value;
    return { cropType, region, minQty };
  }

  function render() {
    const start = (state.page-1)*state.pageSize;
    const pageItems = state.items.slice(start, start+state.pageSize);
    postsEl.innerHTML = pageItems.map(item => card(item)).join('');
    const pages = Math.ceil(state.items.length / state.pageSize) || 1;
    pagerEl.innerHTML = Array.from({length: pages}, (_,i)=>`<button data-p="${i+1}" class="px-3 py-1 rounded ${state.page===i+1?'bg-green-600 text-white':'bg-gray-100'}">${i+1}</button>`).join('');
    pagerEl.querySelectorAll('button').forEach(b=>b.addEventListener('click', ()=>{ state.page = Number(b.dataset.p); render(); }));
    postsEl.querySelectorAll('[data-contact]').forEach(btn => btn.addEventListener('click', () => showContact(btn.dataset.contact)));
  }

  function card(p) {
    return `<div class="bg-white rounded-2xl shadow p-3">
      <div class="font-medium">${p.cropType} • ${p.region}</div>
      <div class="text-sm text-gray-600">Qty: ${p.quantity} • Price: ${p.priceRange}</div>
      <div class="text-xs text-gray-500">Valid until: ${p.validUntil}</div>
      <div class="mt-2">
        <button class="px-3 py-2 rounded bg-green-600 text-white" data-contact="${p.contactDetails}" data-i18n="marketplace.contact">${t('marketplace.contact')}</button>
      </div>
    </div>`;
  }

  function showContact(info) {
    alert(info);
  }

  container.querySelector('#applyFilters').addEventListener('click', load);

  load();
}
