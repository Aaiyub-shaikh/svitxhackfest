# Weather microservice (Django)

This is a small, standalone Django microservice providing a single weather endpoint used by the Smart Farming platform.

Folder structure
```
weather/
├─ manage.py
├─ requirements.txt
├─ .env.example
├─ weather_project/
│  ├─ __init__.py
│  ├─ settings.py
│  ├─ urls.py
│  ├─ wsgi.py
│  └─ asgi.py
└─ forecast/
   ├─ __init__.py
   ├─ apps.py
   ├─ urls.py
   └─ views.py
```

API
- GET /api/weather/?lat=<latitude>&lon=<longitude>
- Returns JSON with exactly these keys:
  - `temperature` (°C)
  - `humidity` (%)
  - `rain_probability` (%) — integer between 0 and 100
  - `short_forecast` — string like `2026-01-09: 24.5°C`

Response examples
- Successful:
  {
    "temperature": 24.5,
    "humidity": 82,
    "rain_probability": 20,
    "short_forecast": "2026-01-09: 25.1°C"
  }

Error handling
- Missing or invalid `lat`/`lon` → 400 with `{'error': ...}`
- External API failure → 502 with `{'error': ..., 'detail': ...}`
- Missing OpenWeather API key → 500 with `{'error': ...}`

Security & CORS
- The service uses `django-cors-headers`. By default the `.env` flag `CORS_ALLOWED_ORIGINS` can be `*` (development) or comma-separated origins for production.
- Keep your `OPENWEATHER_API_KEY` in `.env` and **never** commit secrets to git.

Run locally (quickstart)
1. Copy `.env.example` to `.env` and set `OPENWEATHER_API_KEY`:
   cp .env.example .env   # (Windows: copy)
   EDIT `.env` and put your key.

2. Create a virtual environment and install deps:
   python -m venv .venv
   .\.venv\Scripts\activate
   pip install -r requirements.txt

3. Run migrations (the service uses sqlite by default for Django admin compatibility):
   python manage.py migrate

4. Start server (default port 8000):
   python manage.py runserver 0.0.0.0:8001

5. Use the endpoint:
   GET http://localhost:8001/api/weather/?lat=28.7041&lon=77.1025

Notes
- The Django service is intentionally independent: all files live inside `weather/` and it exposes only weather-related endpoints.
- The Node.js backend or frontend can call this service directly (make sure CORS allows the origin).
- For production, use an env management system (e.g., secrets in your hosting, not .env). Configure `ALLOWED_HOSTS`, remove `DEBUG=True`, and set strict `CORS_ALLOWED_ORIGINS`.
