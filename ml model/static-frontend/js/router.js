import { renderHome } from './ui/home.js';
import { renderFarmerDashboard } from './ui/dashboard.js';
import { renderDiseaseScan } from './ui/diseaseScan.js';
import { renderMarketplace } from './ui/marketplace.js';
import { renderBuyerDashboard } from './ui/buyerDashboard.js';
import { login as doLogin, register as doRegister, requireAuth, getCurrentUser } from './auth.js';
import { t } from './i18n.js';

export function initRouter() {
  window.addEventListener('hashchange', onRouteChange);
  onRouteChange();
}

function onRouteChange() {
  const container = document.getElementById('app');
  const hash = location.hash || '#/';
  const [_, base, sub, sub2] = hash.split('/');
  if (hash === '#/' || hash === '') return renderHome(container);
  if (hash.startsWith('#/login')) return renderLogin(container);
  if (hash.startsWith('#/register')) return renderRegister(container);
  if (hash.startsWith('#/marketplace')) return renderMarketplace(container);

  if (hash.startsWith('#/farmer/dashboard')) {
    if (!requireAuth({ role: 'farmer' })) return; return renderFarmerDashboard(container);
  }
  if (hash.startsWith('#/farmer/disease-scan')) {
    if (!requireAuth({ role: 'farmer' })) return; return renderDiseaseScan(container);
  }
  if (hash.startsWith('#/buyer/dashboard')) {
    if (!requireAuth({ role: 'buyer' })) return; return renderBuyerDashboard(container);
  }
  container.innerHTML = `<p class="text-gray-600">Not Found</p>`;
}

function renderLogin(container) {
  container.innerHTML = `
    <section class="max-w-md mx-auto space-y-4">
      <h1 class="text-xl font-semibold" data-i18n="login.title">${t('login.title')}</h1>
      <form id="loginForm" class="space-y-3">
        <div>
          <label class="block text-sm" for="email" data-i18n="form.email">${t('form.email')}</label>
          <input id="email" name="email" type="email" required class="w-full px-3 py-2 border rounded">
        </div>
        <div>
          <label class="block text-sm" for="password" data-i18n="form.password">${t('form.password')}</label>
          <input id="password" name="password" type="password" required minlength="6" class="w-full px-3 py-2 border rounded">
        </div>
        <button class="w-full px-4 py-2 rounded bg-green-600 text-white" data-i18n="form.submit">${t('form.submit')}</button>
      </form>
      <p class="text-sm">No account? <a class="text-green-700 underline" href="#/register">Register</a></p>
      <div id="loginError" class="text-red-600 text-sm" role="alert" aria-live="polite"></div>
    </section>`;
  const form = document.getElementById('loginForm');
  const err = document.getElementById('loginError');
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); err.textContent='';
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    try {
      const res = await doLogin(email, password);
      const role = res.user?.role;
      location.hash = role === 'farmer' ? '#/farmer/dashboard' : '#/buyer/dashboard';
    } catch (e) {
      err.textContent = e.message;
    }
  });
}

function renderRegister(container) {
  container.innerHTML = `
    <section class="max-w-md mx-auto space-y-4">
      <h1 class="text-xl font-semibold" data-i18n="register.title">${t('register.title')}</h1>
      <form id="regForm" class="space-y-3">
        <div>
          <label class="block text-sm" for="name" data-i18n="form.name">${t('form.name')}</label>
          <input id="name" name="name" required class="w-full px-3 py-2 border rounded">
        </div>
        <div>
          <label class="block text-sm" for="email" data-i18n="form.email">${t('form.email')}</label>
          <input id="email" name="email" type="email" required class="w-full px-3 py-2 border rounded">
        </div>
        <div>
          <label class="block text-sm" for="phone" data-i18n="form.phone">${t('form.phone')}</label>
          <input id="phone" name="phone" required class="w-full px-3 py-2 border rounded">
        </div>
        <div>
          <label class="block text-sm" for="password" data-i18n="form.password">${t('form.password')}</label>
          <input id="password" name="password" type="password" required minlength="6" class="w-full px-3 py-2 border rounded">
        </div>
        <div>
          <label class="block text-sm" for="role" data-i18n="form.role">${t('form.role')}</label>
          <select id="role" name="role" class="w-full px-3 py-2 border rounded">
            <option value="farmer" data-i18n="form.role.farmer">${t('form.role.farmer')}</option>
            <option value="buyer" data-i18n="form.role.buyer">${t('form.role.buyer')}</option>
          </select>
        </div>
        <button class="w-full px-4 py-2 rounded bg-green-600 text-white" data-i18n="form.submit">${t('form.submit')}</button>
      </form>
      <div id="regError" class="text-red-600 text-sm" role="alert" aria-live="polite"></div>
    </section>`;
  const form = document.getElementById('regForm');
  const err = document.getElementById('regError');
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); err.textContent='';
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    try {
      const res = await doRegister(data);
      const role = res.user?.role;
      location.hash = role === 'farmer' ? '#/farmer/dashboard' : '#/buyer/dashboard';
    } catch (e) {
      err.textContent = e.message;
    }
  });
}
