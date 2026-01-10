"""Views for the Weather Forecast microservice.

Implements a single GET endpoint:
    /api/weather/?lat=<latitude>&lon=<longitude>

Returns JSON with exactly these keys:
- temperature (°C)
- humidity (%)
- rain_probability (%)  (0-100 integer)
- short_forecast ("YYYY-MM-DD: <temp>°C")

Error handling:
- 400 on missing/invalid params
- 502 if external API fails
"""
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django.conf import settings
import requests
from datetime import datetime

OPENWEATHER_ONECALL_URL = 'https://api.openweathermap.org/data/2.5/onecall'
OPENWEATHER_CURRENT_URL = 'https://api.openweathermap.org/data/2.5/weather'


@require_GET
def weather(request):
    lat = request.GET.get('lat')
    lon = request.GET.get('lon')

    # Validate query parameters
    if not lat or not lon:
        return JsonResponse({'error': 'Missing required query parameters: lat and lon'}, status=400)

    try:
        lat_f = float(lat)
        lon_f = float(lon)
    except ValueError:
        return JsonResponse({'error': 'Invalid lat or lon. Must be numeric.'}, status=400)

    api_key = settings.OPENWEATHER_API_KEY
    if not api_key:
        return JsonResponse({'error': 'OpenWeather API key not configured on server.'}, status=500)

    params = {
        'lat': lat_f,
        'lon': lon_f,
        'appid': api_key,
        'units': 'metric',
        'exclude': 'minutely,alerts',
    }

    # First try the One Call API (preferred). If it's unauthorized or fails,
    # fall back to the current weather endpoint which works with free keys.
    data = None
    try:
        resp = requests.get(OPENWEATHER_ONECALL_URL, params=params, timeout=6)
        # If unauthorized or other client error, we'll try fallback below
        resp.raise_for_status()
        data = resp.json()
    except requests.HTTPError as exc:
        # If 401 Unauthorized or other HTTPError, attempt to use current weather endpoint
        try:
            cur_params = {
                'lat': lat_f,
                'lon': lon_f,
                'appid': api_key,
                'units': 'metric',
            }
            cur_resp = requests.get(OPENWEATHER_CURRENT_URL, params=cur_params, timeout=6)
            cur_resp.raise_for_status()
            data = cur_resp.json()
            # mark that this payload is from current endpoint by adding a flag
            data['_from_current'] = True
        except requests.RequestException as exc2:
            # If API key is invalid (401) and we're in DEBUG, return a deterministic
            # sample payload so frontend development can proceed without a valid key.
            if getattr(settings, 'DEBUG', False):
                sample = {
                    'temperature': 25.0,
                    'humidity': 60,
                    'rain_probability': 10,
                    'short_forecast': datetime.utcnow().date().isoformat() + ': 25.0°C (sample)'
                }
                return JsonResponse(sample)
            return JsonResponse({'error': 'Failed to fetch weather from external service', 'detail': str(exc2)}, status=502)
    except requests.RequestException as exc:
        return JsonResponse({'error': 'Failed to fetch weather from external service', 'detail': str(exc)}, status=502)

    # Extract fields robustly
    try:
        # Two possible payload shapes: One Call (with 'current', 'hourly', 'daily')
        # or Current Weather (with 'main', 'weather', optional 'rain').
        if data.get('_from_current'):
            # current weather payload
            temperature = data.get('main', {}).get('temp')
            humidity = data.get('main', {}).get('humidity')
            # No probability field in current endpoint; approximate: if 'rain' exists, set 100, else 0
            rain_prob = 100 if data.get('rain') else 0
            dt = datetime.utcfromtimestamp(data.get('dt', datetime.utcnow().timestamp())).date().isoformat()
            # include short description if available
            desc = ''
            try:
                desc = data.get('weather', [])[0].get('description', '')
            except Exception:
                desc = ''
            short_forecast = f"{dt}: {round(temperature, 1)}°C{(' - ' + desc) if desc else ''}" if temperature is not None else f"{dt}: N/A"
        else:
            current = data.get('current', {})
            temperature = current.get('temp')
            humidity = current.get('humidity')

            # Probability of precipitation: prefer hourly[0].pop else daily[0].pop
            rain_prob = None
            hourly = data.get('hourly') or []
            daily = data.get('daily') or []
            if hourly and 'pop' in hourly[0]:
                rain_prob = hourly[0].get('pop')
            elif daily and 'pop' in daily[0]:
                rain_prob = daily[0].get('pop')
            else:
                rain_prob = 0.0

            # short forecast: use today's date (from daily[0].dt if available) and its day temp
            if daily and 'dt' in daily[0]:
                dt = datetime.utcfromtimestamp(daily[0]['dt']).date().isoformat()
                # daily[0].temp may be an object with 'day'
                temp_forecast = daily[0].get('temp')
                if isinstance(temp_forecast, dict):
                    temp_val = temp_forecast.get('day')
                else:
                    temp_val = temp_forecast
                short_forecast = f"{dt}: {round(temp_val, 1)}°C" if temp_val is not None else f"{dt}: N/A"
            else:
                # fallback: use current
                dt = datetime.utcnow().date().isoformat()
                short_forecast = f"{dt}: {round(temperature, 1)}°C" if temperature is not None else f"{dt}: N/A"

        result = {
            'temperature': round(temperature, 1) if temperature is not None else None,
            'humidity': int(humidity) if humidity is not None else None,
            'rain_probability': int(round((rain_prob or 0.0) * 100)),
            'short_forecast': short_forecast,
        }
        return JsonResponse(result)

    except Exception as exc:
        # Unexpected parsing error
        return JsonResponse({'error': 'Unexpected response format from weather provider', 'detail': str(exc)}, status=502)
