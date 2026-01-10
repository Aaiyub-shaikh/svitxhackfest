Quick notes for adding the service to the platform:

- The service runs independently on its port (e.g., 8001).
- Node.js backend may either forward requests to this service or the frontend can call it directly (recommended: frontend direct call if CORS allows it).
- For Docker: create a small Dockerfile (not included here to keep the example minimal).
- In production, set environment variables instead of .env (OPENWEATHER_API_KEY, CORS_ALLOWED_ORIGINS, DJANGO_SECRET_KEY, DJANGO_DEBUG=0).
