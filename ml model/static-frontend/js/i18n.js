const dictionary = {
  en: {
    'app.title': 'Smart Farming Advisory',
    'nav.home': 'Home',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.marketplace': 'Marketplace',
    'nav.logout': 'Logout',
    'nav.farmerPortal': 'Farmer Portal',
    'nav.buyerPortal': 'Buyer Portal',

    'home.title': 'Grow Smarter. Farm Better.',
    'home.subtitle': 'IoT-driven insights, crop disease advisories, and a marketplace connecting farmers and buyers.',
    'home.cta.farmer': 'Farmer Dashboard',
    'home.cta.buyer': 'Buyer Dashboard',

    'login.title': 'Login',
    'register.title': 'Register',
    'form.name': 'Full Name',
    'form.email': 'Email',
    'form.phone': 'Phone',
    'form.password': 'Password',
    'form.role': 'Role',
    'form.role.farmer': 'Farmer',
    'form.role.buyer': 'Buyer',
    'form.submit': 'Submit',

    'dashboard.title': 'Farmer Dashboard',
    'diseaseScan.title': 'Disease Scan',
    'marketplace.title': 'Marketplace',

    'plots.select': 'Select Plot',
    'range.today': 'Today',
    'range.7d': '7 Days',
    'range.30d': '30 Days',

    'stats.moisture': 'Moisture',
    'stats.temperature': 'Temperature',
    'stats.rain': 'Forecast Rain',
    'stats.alerts': 'Alerts',

    'chat.title': 'AI Assistant',
    'chat.input.placeholder': 'Ask about crops, irrigation, marketplace…',
    'chat.send': 'Send',
    'chat.mic': 'Speak',

    'marketplace.search': 'Search posts',
    'marketplace.create': 'Create Post',
    'marketplace.contact': 'Contact',

    'buyerForm.title': 'Create Buyer Requirement',
    'buyerForm.cropType': 'Crop Type',
    'buyerForm.quantity': 'Quantity (kg/ton)',
    'buyerForm.priceRange': 'Price Range',
    'buyerForm.contact': 'Contact Details',
    'buyerForm.validUntil': 'Valid Until',
    'buyerForm.submit': 'Publish'
  },
  hi: {
    'app.title': 'स्मार्ट खेती सलाह',
    'nav.home': 'मुखपृष्ठ',
    'nav.login': 'लॉगिन',
    'nav.register': 'रजिस्टर',
    'nav.marketplace': 'मार्केटप्लेस',
    'nav.logout': 'लॉगआउट',
    'nav.farmerPortal': 'किसान पोर्टल',
    'nav.buyerPortal': 'खरीदार पोर्टल',

    'home.title': 'और समझदारी से उगाएँ। बेहतर खेती करें।',
    'home.subtitle': 'IoT आधारित जानकारी, फसल रोग सलाह, और किसानों-बायर्स को जोड़ने वाला मार्केटप्लेस।',
    'home.cta.farmer': 'किसान डैशबोर्ड',
    'home.cta.buyer': 'खरीदार डैशबोर्ड',

    'login.title': 'लॉगिन',
    'register.title': 'रजिस्टर',
    'form.name': 'पूरा नाम',
    'form.email': 'ईमेल',
    'form.phone': 'फ़ोन',
    'form.password': 'पासवर्ड',
    'form.role': 'भूमिका',
    'form.role.farmer': 'किसान',
    'form.role.buyer': 'खरीदार',
    'form.submit': 'सबमिट',

    'dashboard.title': 'किसान डैशबोर्ड',
    'diseaseScan.title': 'रोग स्कैन',
    'marketplace.title': 'मार्केटप्लेस',

    'plots.select': 'प्लॉट चुनें',
    'range.today': 'आज',
    'range.7d': '7 दिन',
    'range.30d': '30 दिन',

    'stats.moisture': 'नमी',
    'stats.temperature': 'तापमान',
    'stats.rain': 'वर्षा पूर्वानुमान',
    'stats.alerts': 'चेतावनी',

    'chat.title': 'एआई सहायक',
    'chat.input.placeholder': 'फसल, सिंचाई, मार्केटप्लेस के बारे में पूछें…',
    'chat.send': 'भेजें',
    'chat.mic': 'बोलें',

    'marketplace.search': 'पोस्ट खोजें',
    'marketplace.create': 'पोस्ट बनाएं',
    'marketplace.contact': 'संपर्क',

    'buyerForm.title': 'खरीदार आवश्यकता बनाएं',
    'buyerForm.cropType': 'फसल का प्रकार',
    'buyerForm.quantity': 'मात्रा (किग्रा/टन)',
    'buyerForm.priceRange': 'मूल्य सीमा',
    'buyerForm.contact': 'संपर्क विवरण',
    'buyerForm.validUntil': 'मान्य तिथि',
    'buyerForm.submit': 'प्रकाशित करें'
  }
};

export let currentLang = localStorage.getItem('sf_lang') || (navigator.language?.startsWith('hi') ? 'hi' : 'en');

export function t(key) {
  return (dictionary[currentLang] && dictionary[currentLang][key]) || dictionary.en[key] || key;
}

export function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('sf_lang', lang);
  document.documentElement.lang = lang;
  window.dispatchEvent(new Event('i18n:change'));
  translateDom();
}

export function initI18n() {
  document.documentElement.lang = currentLang;
  translateDom();
  window.addEventListener('i18n:change', translateDom);
}

function translateDom() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
  });
  document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
    el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria-label')));
  });
}
