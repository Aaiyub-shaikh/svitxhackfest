import express from 'express';
import { sendIrrigationSms } from '../services/smsService.js';

const router = express.Router();

/**
 * POST /api/irrigation
 * Expected body:
 * {
 *   cropType, sowingDate, landSize, smsEnabled (bool), mobileNumber,
 *   irrigationDecision, waterQuantity, bestIrrigationTime
 * }
 */
router.post('/', async (req, res) => {
  try {
    const {
      cropType,
      sowingDate,
      landSize,
      smsEnabled,
      mobileNumber,
      irrigationDecision,
      waterQuantity,
      bestIrrigationTime
    } = req.body;

    if (!cropType || !sowingDate || !landSize) {
      return res.status(400).json({ error: { message: 'Missing required irrigation fields' } });
    }

    if (smsEnabled) {
      if (!mobileNumber) return res.status(400).json({ error: { message: 'mobileNumber is required when smsEnabled is true' } });

      try {
        const sendRes = await sendIrrigationSms({ mobileNumber, cropType, sowingDate, landSize, irrigationDecision, waterQuantity, bestIrrigationTime });
        console.log('SMS send result:', sendRes);
        return res.json({ data: { message: 'Irrigation processed and SMS sent (or scheduled).', sms: sendRes }, error: null });
      } catch (err) {
        console.error('Failed to send SMS:', err);
        return res.status(500).json({ error: { message: 'Failed to send SMS alert' } });
      }
    }

    // If SMS not enabled, just acknowledge receipt
    return res.json({ data: { message: 'Irrigation processed. SMS not enabled.' }, error: null });
  } catch (err) {
    console.error('Irrigation route error:', err);
    return res.status(500).json({ error: { message: 'Internal server error' } });
  }
});


// POST /api/irrigation/predict
// Accepts either: { crop, land_size, sowing_date, location: { lat, lon } }
// Or directly: { crop, land_size, sowing_date, temperature, humidity, rainfall_mm }
router.post('/predict', async (req, res) => {
  try {
    console.log('Irrigation predict request body:', JSON.stringify(req.body));
    const { crop, land_size, sowing_date, temperature, humidity, rainfall_mm, location } = req.body;

    // Basic validation
    if (!crop || !land_size || !sowing_date) {
      return res.status(400).json({ error: { message: 'Missing required fields: crop, land_size or sowing_date' } });
    }

    // If weather data not provided, try to fetch from weather microservice when location is provided
    let temp = temperature;
    let hum = humidity;
    let rain_mm = rainfall_mm;

    if ((temp === undefined || hum === undefined || rain_mm === undefined) && location && location.lat && location.lon) {
      const WEATHER_URL = process.env.WEATHER_API_URL || 'http://localhost:8001/api/weather/';
      try {
        const q = `?lat=${encodeURIComponent(location.lat)}&lon=${encodeURIComponent(location.lon)}`;
        const wres = await fetch(WEATHER_URL + q, { method: 'GET' });
        const wjson = await wres.json();
        if (!wres.ok) {
          console.error('Weather service error', wjson);
        } else {
          temp = wjson.temperature;
          hum = wjson.humidity;
          // approximate rainfall in mm from rain_probability
          const prob = wjson.rain_probability || 0;
          rain_mm = prob > 50 ? 5 : 0;
        }
      } catch (err) {
        console.error('Failed to fetch weather', err);
      }
    }

    // Fallback default if still missing
    temp = temp ?? 25;
    hum = hum ?? 60;
    rain_mm = rain_mm ?? 0;

    // Forward to ML service (Flask)
    // Try multiple common ports if Flask is running on a different port
    const flaskHost = process.env.IRRIGATION_FLASK_HOST || '127.0.0.1';
    const defaultPorts = [5000, 5001, 8000, 8001, 8002];
    const customUrl = process.env.IRRIGATION_FLASK_URL || process.env.ML_API_URL;
    
    const candidateUrls = [
      customUrl, // explicit override from environment variable
      ...defaultPorts.map(port => `http://${flaskHost}:${port}/predict`), // try common ports
      'http://localhost:8002/irrigation/predict', // lightweight irrigation server (FastAPI)
      'http://localhost:8000/irrigation/predict' // existing combined ML server
    ].filter(Boolean);

    const payload = {
      crop: crop,
      land_size: Number(land_size),
      sowing_date: sowing_date,
      temperature: Number(temp),
      humidity: Number(hum),
      rainfall_mm: Number(rain_mm)
    };

    let mlJson = null;
    let lastErr = null;
    const errors = [];

    // First, try to find which Flask server is running by checking health endpoints
    const baseUrls = candidateUrls.map(url => {
      if (url && url.includes('/predict')) {
        return url.replace('/predict', '');
      }
      return null;
    }).filter(Boolean);

    for (const url of candidateUrls) {
      try {
        console.log('Trying ML URL:', url);
        const mlRes = await fetch(url, { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });
        const text = await mlRes.text();
        console.log('ML response from', url, 'status', mlRes.status, 'len', (text || '').length);
        let parsed = null;
        try{ parsed = text ? JSON.parse(text) : null; } catch(e){ parsed = null; }
        if (!mlRes.ok) {
          const errorInfo = { url, status: mlRes.status, body: parsed || text || 'no body' };
          lastErr = errorInfo;
          errors.push(errorInfo);
          console.error('ML API error - URL:', url, 'HTTP Status:', mlRes.status, 'Response Body:', parsed || text || 'no body');
          continue;
        }
        if (!parsed) {
          const errorInfo = { url, status: mlRes.status, body: text || 'empty response' };
          lastErr = errorInfo;
          errors.push(errorInfo);
          console.error('ML API invalid response - URL:', url, 'HTTP Status:', mlRes.status, 'Response Body:', text || 'empty response');
          continue;
        }
        mlJson = parsed;
        console.log('Successfully connected to ML API at:', url);
        break;
      } catch (err) {
        const errorInfo = { 
          url, 
          error: err.message || String(err),
          type: err.name || 'NetworkError'
        };
        lastErr = errorInfo;
        errors.push(errorInfo);
        console.error('ML API unreachable - URL:', url, 'Error:', err.message || String(err));
      }
    }

    // If ML service is not available, provide fallback response instead of error
    if (!mlJson) {
      console.log('ML prediction service not available, using fallback response');
      
      // Calculate fallback values based on input
      const landSizeNum = Number(land_size) || 1;
      const daysSinceSowing = Math.max(0, Math.floor((new Date().getTime() - new Date(sowing_date).getTime()) / (1000 * 60 * 60 * 24)));
      
      // Simple fallback logic: suggest irrigation if more than 3 days since sowing
      const irrigationNeeded = daysSinceSowing > 3;
      const waterQuantity = irrigationNeeded ? `${Math.max(2, Math.round(2 * landSizeNum))} mm` : '0 mm';
      const bestTime = irrigationNeeded ? 'Early Morning (5–8 AM)' : 'N/A';
      
      return res.json({ 
        irrigation_needed: irrigationNeeded, 
        water_quantity: waterQuantity, 
        best_time: bestTime 
      });
    }

    // Standardize response
    return res.json({ irrigation_needed: Boolean(mlJson.irrigation_needed), water_quantity: mlJson.water_quantity, best_time: mlJson.best_time });
  } catch (err) {
    console.error('Irrigation predict error:', err);
    return res.status(500).json({ error: { message: 'Internal server error' } });
  }
});

export default router;
