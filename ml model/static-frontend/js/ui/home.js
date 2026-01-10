import { t } from '../i18n.js';
import { getCurrentUser } from '../auth.js';

export function renderHome(container) {
  const user = getCurrentUser();
  const ctaHref = user?.role === 'farmer' ? '#/farmer/dashboard' : (user?.role === 'buyer' ? '#/buyer/dashboard' : '#/login');
  container.innerHTML = `
    <section class="text-center space-y-4">
      <h1 class="text-2xl font-bold" data-i18n="home.title">${t('home.title')}</h1>
      <p class="text-gray-600" data-i18n="home.subtitle">${t('home.subtitle')}</p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <a href="#/farmer/dashboard" class="px-4 py-2 rounded-2xl bg-green-600 text-white" data-i18n="home.cta.farmer">${t('home.cta.farmer')}</a>
        <a href="#/buyer/dashboard" class="px-4 py-2 rounded-2xl bg-blue-600 text-white" data-i18n="home.cta.buyer">${t('home.cta.buyer')}</a>
      </div>
      <div class="mt-6">
        <a href="${ctaHref}" class="text-green-700 underline">Continue</a>
      </div>
    </section>`;
}
