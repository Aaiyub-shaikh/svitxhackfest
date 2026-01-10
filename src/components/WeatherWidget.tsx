import React, { useState } from 'react';
import { fetchWeather, WeatherResult, API_URL } from '@/services/weather';

const WeatherWidget: React.FC = () => {
  const [lat, setLat] = useState<string>('28.7041');
  const [lon, setLon] = useState<string>('77.1025');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WeatherResult | null>(null);

  const doFetch = async () => {
    setError(null);
    setLoading(true);
    setData(null);
    try {
      const res = await fetchWeather(lat, lon);
      setData(res);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-md shadow-sm mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Weather Forecast</h3>
        <small className="text-muted-foreground">API: {API_URL}</small>
      </div>

      <div className="flex gap-2 mb-3">
        <input
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          placeholder="lat"
          className="border rounded px-2 py-1 w-32"
        />
        <input
          value={lon}
          onChange={(e) => setLon(e.target.value)}
          placeholder="lon"
          className="border rounded px-2 py-1 w-32"
        />
        <button onClick={doFetch} className="btn btn-primary" disabled={loading}>
          {loading ? 'Loading...' : 'Get Weather'}
        </button>
      </div>

      {error && <div className="text-red-600">Error: {error}</div>}

      {data && (
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="p-3 border rounded">
            <div className="text-sm text-muted-foreground">Temperature</div>
            <div className="text-2xl font-bold">{data.temperature ?? 'N/A'}°C</div>
          </div>
          <div className="p-3 border rounded">
            <div className="text-sm text-muted-foreground">Humidity</div>
            <div className="text-2xl font-bold">{data.humidity ?? 'N/A'}%</div>
          </div>
          <div className="p-3 border rounded">
            <div className="text-sm text-muted-foreground">Rain Probability</div>
            <div className="text-2xl font-bold">{data.rain_probability}%</div>
          </div>
          <div className="p-3 border rounded">
            <div className="text-sm text-muted-foreground">Short Forecast</div>
            <div className="text-base">{data.short_forecast}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
