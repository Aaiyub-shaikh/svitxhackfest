import { MarketplaceAPI } from '../api.js';
import { getCurrentUser } from '../auth.js';
import { t } from '../i18n.js';

export function openBuyerFormModal({ onSaved } = {}) {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="buyerFormTitle">
      <div class="flex items-center justify-between mb-2">
        <h2 id="buyerFormTitle" class="text-lg font-semibold" data-i18n="buyerForm.title">${t('buyerForm.title')}</h2>
        <button id="bfClose" aria-label="Close">✕</button>
      </div>
      <form id="buyerForm" class="space-y-2">
        <div>
          <label class="block text-sm" for="cropType" data-i18n="buyerForm.cropType">${t('buyerForm.cropType')}</label>
          <input id="cropType" name="cropType" required class="w-full px-3 py-2 border rounded">
        </div>
        <div>
          <label class="block text-sm" for="quantity" data-i18n="buyerForm.quantity">${t('buyerForm.quantity')}</label>
          <input id="quantity" name="quantity" type="number" required class="w-full px-3 py-2 border rounded">
        </div>
        <div>
          <label class="block text-sm" for="priceRange" data-i18n="buyerForm.priceRange">${t('buyerForm.priceRange')}</label>
          <input id="priceRange" name="priceRange" required class="w-full px-3 py-2 border rounded">
        </div>
        <div>
          <label class="block text-sm" for="contactDetails" data-i18n="buyerForm.contact">${t('buyerForm.contact')}</label>
          <input id="contactDetails" name="contactDetails" required class="w-full px-3 py-2 border rounded">
        </div>
        <div>
          <label class="block text-sm" for="validUntil" data-i18n="buyerForm.validUntil">${t('buyerForm.validUntil')}</label>
          <input id="validUntil" name="validUntil" type="date" required class="w-full px-3 py-2 border rounded">
        </div>
        <button class="w-full px-4 py-2 rounded bg-green-600 text-white" data-i18n="buyerForm.submit">${t('buyerForm.submit')}</button>
      </form>
      <div id="bfError" class="text-red-600 text-sm mt-2" role="alert"></div>
    </div>`;

  document.body.appendChild(backdrop);
  document.body.classList.add('modal-open');
  const modal = backdrop.querySelector('.modal');
  const closeBtn = modal.querySelector('#bfClose');
  const form = modal.querySelector('#buyerForm');
  const err = modal.querySelector('#bfError');
  const previouslyFocused = document.activeElement;
  modal.focus();

  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
  function close() { document.body.classList.remove('modal-open'); backdrop.remove(); previouslyFocused?.focus(); }

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); err.textContent = '';
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    data.quantity = Number(data.quantity);
    const user = getCurrentUser();
    const payload = { buyerId: user?.id || 'demo-buyer', ...data };
    try {
      await MarketplaceAPI.postRequirement(payload);
      close();
      onSaved?.();
    } catch (e) {
      err.textContent = e.message;
    }
  });
}
