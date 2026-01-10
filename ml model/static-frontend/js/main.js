import { initI18n } from './i18n.js';
import { initNavbar } from './ui/navbar.js';
import { initChatWidget } from './ui/chatWidget.js';
import { initRouter } from './router.js';

window.addEventListener('DOMContentLoaded', () => {
  initI18n();
  initNavbar();
  initChatWidget();
  initRouter();
});
