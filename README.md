# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/186fd267-6ed1-428c-916c-1af7cb58d805

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/186fd267-6ed1-428c-916c-1af7cb58d805) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

---

## Smart Farming Advisory Platform (Frontend)

This app implements a responsive, mobile-first interface for two roles: Farmers and Buyers.

Key features
- Farmer Portal
  - IoT Dashboard (temperature, humidity, soil moisture, soil type)
  - Weather forecast and rainfall prediction (OpenWeatherMap)
  - AI disease detection (image upload → ML API) + Streamlit embed
  - Smart Irrigation schedule generator + optional SMS (simulated)
- Buyer Portal
  - Auth (Supabase) and profile capture
  - Post crop requirements (localStorage demo persistence)
  - Personal dashboard (My Requirements)
- Marketplace
  - Farmers can browse buyer requirements and contact buyers
- AI Assistant
  - Chat UI with voice input/output (Web Speech API)
  - Multiple Indian languages (en-IN, hi-IN, pa-IN, gu-IN, mr-IN, ta-IN, te-IN, bn-IN)

### Environment variables
Create a .env.local file (copy from .env.example):

- VITE_ML_API_URL: Base URL of your disease detection API (e.g., FastAPI)
- VITE_STREAMLIT_URL: URL of your Streamlit disease UI (optional)
- VITE_OPENWEATHER_API_KEY: OpenWeatherMap API key for live weather

### Running locally

```sh
# From the repo root
npm install
npm run dev
```

Then open the printed local URL in your browser.

Notes
- Voice features require a Chromium-based browser (for webkitSpeechRecognition). TTS works with most modern browsers.
- Weather requires VITE_OPENWEATHER_API_KEY. Without it, UI will display a hint.
- SMS is simulated on the frontend. Wire to your backend (e.g., Twilio) if needed.
- Buyer requirements are stored in localStorage for demo. Replace with real persistence (e.g., Supabase table) in production.

---

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/186fd267-6ed1-428c-916c-1af7cb58d805) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
