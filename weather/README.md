# 🌦️ Weather Forecast Service

![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge\&logo=python\&logoColor=white)
![Django](https://img.shields.io/badge/Django-4.2%2B-092E20?style=for-the-badge\&logo=django\&logoColor=white)
![Django REST Framework](https://img.shields.io/badge/DRF-3.14%2B-A30000?style=for-the-badge)
![OpenWeather](https://img.shields.io/badge/OpenWeather-API-orange?style=for-the-badge)

A standalone **Django-based weather microservice** for the **AgriSmart** platform. It fetches weather data using latitude and longitude and provides a simple JSON response for the irrigation and farming features.

## 📁 Project Structure

```text
weather/
├── forecast/
│   ├── apps.py
│   ├── urls.py
│   ├── views.py
│   └── tests.py
├── weather_project/
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
├── .env.example
├── .gitignore
├── db.sqlite3
├── manage.py
└── requirements.txt
```

## 🚀 Features

* 🌡️ Temperature information
* 💧 Humidity information
* 🌧️ Rain probability
* 📅 Short weather forecast
* 🌍 Location-based weather using latitude and longitude
* 🔐 Environment-based API key configuration
* 🔗 CORS support for AgriSmart frontend/backend integration

## 🔌 API Endpoint

```http
GET /api/weather/?lat=<latitude>&lon=<longitude>
```

### Example

```http
GET http://localhost:8001/api/weather/?lat=28.7041&lon=77.1025
```

### Response

```json
{
  "temperature": 24.5,
  "humidity": 82,
  "rain_probability": 20,
  "short_forecast": "2026-01-09: 25.1°C"
}
```

## ⚙️ Setup

```bash
python -m venv .venv
```

### Windows

```bash
.venv\Scripts\activate
```

### Install dependencies

```bash
pip install -r requirements.txt
```

Create `.env` from `.env.example` and add your OpenWeather API key:

```env
OPENWEATHER_API_KEY=your_api_key
```

Run migrations:

```bash
python manage.py migrate
```

Start the server:

```bash
python manage.py runserver 0.0.0.0:8001
```

The weather service will be available at:

```text
http://localhost:8001
```
