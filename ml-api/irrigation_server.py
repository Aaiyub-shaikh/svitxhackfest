"""Lightweight FastAPI server for irrigation predictions using scikit-learn.
Run with:
  python -m venv .venv
  .\.venv\Scripts\Activate.ps1
  pip install fastapi uvicorn scikit-learn joblib
  uvicorn irrigation_server:app --host 0.0.0.0 --port 8002
"""
import os
from datetime import datetime
from typing import Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

try:
    import joblib
except Exception as e:
    joblib = None

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
MODEL_PATH = os.path.join(BASE_DIR, 'irregation_ml', 'irrigation_model.pkl')
ENCODER_PATH = os.path.join(BASE_DIR, 'irregation_ml', 'crop_encoder.pkl')

app = FastAPI(title="Irrigation ML (light)")

class PredictRequest(BaseModel):
    crop: str
    land_size: float
    sowing_date: str
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    rainfall_mm: Optional[float] = None

# Load model lazily
_irrigation_model = None
_crop_encoder = None

def load_model():
    global _irrigation_model, _crop_encoder
    if _irrigation_model is not None:
        return
    if joblib is None:
        raise RuntimeError('joblib not installed; run: pip install joblib')
    if not os.path.exists(MODEL_PATH):
        raise RuntimeError(f'Irrigation model not found at {MODEL_PATH}')
    _irrigation_model = joblib.load(MODEL_PATH)
    if os.path.exists(ENCODER_PATH):
        _crop_encoder = joblib.load(ENCODER_PATH)

def compute_days_after(sowing_date: str) -> int:
    try:
        sd = datetime.fromisoformat(sowing_date)
        days = (datetime.utcnow() - sd).days
        return days if days >= 0 else 0
    except Exception:
        return 0

def calc_water_mm(acres: float) -> int:
    try:
        return max(2, round(2 * float(acres)))
    except Exception:
        return 2

@app.get('/health')
async def health():
    return { 'status': 'ok' }

@app.post('/irrigation/predict')
async def predict(req: PredictRequest):
    try:
        load_model()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    crop = req.crop
    land_size = float(req.land_size)
    days_after = compute_days_after(req.sowing_date)
    temp = float(req.temperature) if req.temperature is not None else 25.0
    humidity = float(req.humidity) if req.humidity is not None else 60.0
    rainfall_mm = float(req.rainfall_mm) if req.rainfall_mm is not None else 0.0

    # encode crop
    crop_enc = 0
    try:
        if _crop_encoder is not None:
            crop_enc = int(_crop_encoder.transform([crop])[0])
        else:
            # fallback: simple mapping from first unique crop words
            crop_enc = 0
    except Exception:
        crop_enc = 0

    X = [[crop_enc, land_size, days_after, temp, humidity, rainfall_mm]]
    try:
        pred = _irrigation_model.predict(X)
        irr_needed = bool(int(pred[0]))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Prediction error: {e}')

    water_quantity = f"{calc_water_mm(land_size)} mm" if irr_needed else "0 mm"
    best_time = "Early Morning (5–8 AM)" if irr_needed else "N/A"

    return { 'irrigation_needed': irr_needed, 'water_quantity': water_quantity, 'best_time': best_time }


if __name__ == "__main__":
    # Allow running directly with: python irrigation_server.py
    import uvicorn
    uvicorn.run("irrigation_server:app", host="0.0.0.0", port=8002, log_level="info")
