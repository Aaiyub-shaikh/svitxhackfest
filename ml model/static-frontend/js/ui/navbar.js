import { getCurrentUser, logout } from '../auth.js';
import { t, setLang, currentLang } from '../i18n.js';

export function initNavbar() {
  renderNavbar();
  window.addEventListener('auth:change', renderNavbar);
  window.addEventListener('i18n:change', renderNavbar);
}

function navLink(href, labelKey) {
  return `<a href="${href}" class="px-3 py-2 rounded hover:bg-gray-100" data-i18n="${labelKey}">${t(labelKey)}</a>`;
}

export function renderNavbar() {
  const el = document.getElementById('navbar');
  if (!el) return;
  const user = getCurrentUser();

  const left = `
    <div class="flex items-center gap-2">
      <span class="font-semibold text-green-700">🌱</span>
      <a href="#/" class="font-semibold">${t('app.title')}</a>
    </div>`;

  const rightGuest = `
    <nav class="flex items-center gap-2">
      ${navLink('#/', 'nav.home')}
      ${navLink('#/marketplace', 'nav.marketplace')}
      ${navLink('#/login', 'nav.login')}
      ${navLink('#/register', 'nav.register')}
      ${langSelect()}
    </nav>`;

  const roleLink = user?.role === 'farmer'
    ? navLink('#/farmer/dashboard', 'nav.farmerPortal')
    : navLink('#/buyer/dashboard', 'nav.buyerPortal');

  const rightAuthed = `
    <nav class="flex items-center gap-2">
      ${navLink('#/', 'nav.home')}
      ${navLink('#/marketplace', 'nav.marketplace')}
      ${roleLink}
      <button id="logoutBtn" class="px-3 py-2 rounded hover:bg-gray-100" data-i18n="nav.logout">${t('nav.logout')}</button>
      ${langSelect()}
    </nav>`;

  el.innerHTML = `<div class="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between">${left}${user ? rightAuthed : rightGuest}</div>`;
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', () => logout());
  const sel = el.querySelector('select[data-lang]');
  if (sel) sel.addEventListener('change', e => setLang(e.target.value));
}

function langSelect() {
  return `
    <label class="sr-only" for="langSel">Language</label>
    <select id="langSel" data-lang class="px-2 py-1 border rounded" aria-label="Language">
      <option value="en" ${currentLang==='en'?'selected':''}>EN</option>
      <option value="hi" ${currentLang==='hi'?'selected':''}>हिंदी</option>
    </select>`;
}
