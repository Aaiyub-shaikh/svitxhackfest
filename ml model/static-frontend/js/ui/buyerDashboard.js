import { t } from '../i18n.js';
import { openBuyerFormModal } from './buyerForm.js';

export function renderBuyerDashboard(container) {
  container.innerHTML = `
    <section class="space-y-4">
      <h1 class="text-xl font-semibold" data-i18n="nav.buyerPortal">${t('nav.buyerPortal')}</h1>
      <p class="text-gray-600">Create and manage your purchase requirements.</p>
      <button id="createBuyerPost" class="px-3 py-2 rounded bg-blue-600 text-white" data-i18n="marketplace.create">${t('marketplace.create')}</button>
      <div id="buyerPosts" class="grid gap-3 text-sm text-gray-600">No posts yet.</div>
    </section>`;
  container.querySelector('#createBuyerPost').addEventListener('click', () => openBuyerFormModal({ onSaved: () => location.hash = '#/marketplace' }));
}
