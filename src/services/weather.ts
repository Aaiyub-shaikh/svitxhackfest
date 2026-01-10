// Small helper to call the Django weather microservice.
// Uses Vite env variable VITE_WEATHER_API_URL if present, otherwise falls
// back to localhost:8001 where the Django service runs in development.

export type WeatherResult = {
  temperature: number | null;
  humidity: number | null;
  rain_probability: number;
  short_forecast: string;
};

const DEFAULT_URL = 'http://localhost:8001/api/weather/';
const API_URL = (import.meta.env.VITE_WEATHER_API_URL as string) || DEFAULT_URL;

export async function fetchWeather(lat: number | string, lon: number | string): Promise<WeatherResult> {
  const url = `${API_URL}?lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lon))}`;
  const resp = await fetch(url, { method: 'GET' });
  if (!resp.ok) {
    const body = await resp.json().catch(() => ({}));
    throw new Error(body.error || `Weather service returned ${resp.status}`);
  }
  const data = await resp.json();
  // Ensure shape and types
  return {
    temperature: data.temperature ?? null,
    humidity: data.humidity ?? null,
    rain_probability: data.rain_probability ?? 0,
    short_forecast: data.short_forecast ?? '',
  } as WeatherResult;
}

export { API_URL };
// Simple OpenWeatherMap service for current conditions and short-term rainfall forecast
// Requires VITE_OPENWEATHER_API_KEY in your environment

export interface WeatherSummary {
  city: string;
  country?: string;
  temperatureC: number;
  humidity: number;
  description: string;
  windKph: number;
  rainNext24hMm: number;
}

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY as string | undefined;

async function geocodeCity(query: string): Promise<{ lat: number; lon: number; name: string; country?: string } | null> {
  if (!OPENWEATHER_API_KEY) return null;
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=${OPENWEATHER_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);
  const data = (await res.json()) as any[];
  if (!data.length) return null;
  const { lat, lon, name, country } = data[0];
  return { lat, lon, name, country };
}

export async function fetchWeatherForecast(cityQuery: string): Promise<WeatherSummary | null> {
  if (!OPENWEATHER_API_KEY) return null;
  const geo = await geocodeCity(cityQuery);
  if (!geo) return null;

  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${geo.lat}&lon=${geo.lon}&units=metric&appid=${OPENWEATHER_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Forecast fetch failed: ${res.status}`);
  const data = (await res.json()) as any;

  const list: any[] = data.list || [];
  const first = list[0];
  const temperatureC = first?.main?.temp ?? 0;
  const humidity = first?.main?.humidity ?? 0;
  const description = first?.weather?.[0]?.description ?? '—';
  const windKph = ((first?.wind?.speed ?? 0) * 3.6) as number;

  const next24 = list.slice(0, 8); // 8 x 3h = 24h
  const rainNext24hMm = next24.reduce((sum, item) => sum + (item?.rain?.['3h'] ?? 0), 0);

  return {
    city: geo.name,
    country: geo.country,
    temperatureC,
    humidity,
    description,
    windKph: Math.round(windKph * 10) / 10,
    rainNext24hMm: Math.round(rainNext24hMm * 10) / 10,
  };
}
