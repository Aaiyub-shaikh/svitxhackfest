# Smart Farming Advisory - Static Frontend (Vanilla JS)

Mobile-first, accessible, no-build static frontend that integrates with a configurable backend API. Built with:
- HTML + Tailwind via CDN (no build)
- Vanilla JS ES modules (no frameworks)
- Chart.js via CDN
- Web APIs: Fetch, MediaDevices (camera), Web Speech (STT/TTS)

## Run locally
- Option A: Using Node serve
  npx serve ./static-frontend
- Option B: Python
  python -m http.server 8000 --directory static-frontend
- Then open: http://localhost:8000 (or the URL shown) and navigate to index.html

## Configure
- Edit `js/config.js` to set: 
  export const API_BASE = window.__ENV__?.API_BASE || 'https://api.example.com';
- Backend endpoints used:
  - POST /auth/register
  - POST /auth/login
  - POST /iot/readings
  - GET  /farmers/:farmerId/plots/:plotId/dashboard
  - GET  /farmers/:id/plots/:plotId/readings?from=&to=&limit=
  - POST /disease/scan (multipart/form-data: image, farmerId, plotId, cropType)
  - POST /buyer/requirements
  - GET  /marketplace?cropType=&region=&minQty=
  - POST /assistant/message

## Structure
/static-frontend/
  index.html
  /css/styles.css
  /js/
    main.js
    config.js
    api.js
    auth.js
    router.js
    i18n.js
    charts.js
    /data/demoData.js
    /ui/
      navbar.js
      home.js
      chatWidget.js
      dashboard.js
      diseaseScan.js
      marketplace.js
      buyerDashboard.js
      buyerForm.js
      plots.js
  /assets/icons/
    mic.svg, chat.svg

## Notes
- Client-side routing via hash (#) routes, with role-based protection.
- Auth stored in localStorage (token + user). On HTTP 401, redirects to login.
- Disease Scan uses camera (getUserMedia) with file upload fallback and XHR progress.
- Chat widget supports STT/TTS where available; falls back to recording audio (sent as data URL in payload) if STT unsupported.
- IoT dashboard uses Chart.js; demo data included if API unavailable.
- i18n skeleton for English + Hindi; data-i18n attributes used for dynamic translation.
- Accessibility: ARIA labels, focus handling for modals and chat panel, keyboard triggers (Enter).
