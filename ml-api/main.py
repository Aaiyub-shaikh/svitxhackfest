# FastAPI inference server for plant disease detection
# Usage:
# 1) python -m venv .venv && .venv\Scripts\activate (Windows)
# 2) pip install -r requirements.txt
# 3) uvicorn main:app --host 0.0.0.0 --port 8000

import os
import sys
from io import BytesIO
from typing import List, Dict, Any

import numpy as np
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import tensorflow as tf

# Add path to the existing ML folder ("ml model") to import disease_info
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
ML_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "..", "ml model"))
sys.path.append(ML_DIR)

try:
    from disease_info import get_disease_info  # type: ignore
except Exception as e:
    raise RuntimeError(f"Failed to import disease_info from '{ML_DIR}': {e}")

# Model path (reuse the trained model you already have)
MODEL_PATH = os.path.join(ML_DIR, "trained_model.h5")

# Same class names as used in your Streamlit app
CLASS_NAMES: List[str] = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
    'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew', 'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 'Corn_(maize)___Common_rust_',
    'Corn_(maize)___Northern_Leaf_Blight', 'Corn_(maize)___healthy', 'Grape___Black_rot',
    'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 'Grape___healthy',
    'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot', 'Peach___healthy',
    'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 'Potato___Early_blight', 'Potato___Late_blight',
    'Potato___healthy', 'Raspberry___healthy', 'Soybean___healthy', 'Squash___Powdery_mildew',
    'Strawberry___Leaf_scorch', 'Strawberry___healthy', 'Tomato___Bacterial_spot', 'Tomato___Early_blight',
    'Tomato___Late_blight', 'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite', 'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus', 'Tomato___healthy'
]

app = FastAPI(title="Smart Farm ML API", version="1.0.0")

# CORS for local dev (vite runs on 8080 by default)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model once at startup
MODEL = None

@app.on_event("startup")
async def load_model():
    global MODEL
    if not os.path.exists(MODEL_PATH):
        raise RuntimeError(f"Model file not found at: {MODEL_PATH}")
    MODEL = tf.keras.models.load_model(MODEL_PATH)

# Load irrigation scikit-learn model & crop encoder (joblib)
IRR_MODEL = None
CROP_ENCODER = None
IRR_MODEL_PATH = os.path.join(os.path.abspath(os.path.join(CURRENT_DIR, '..')), 'irregation_ml', 'irrigation_model.pkl')
CROP_ENCODER_PATH = os.path.join(os.path.abspath(os.path.join(CURRENT_DIR, '..')), 'irregation_ml', 'crop_encoder.pkl')

@app.on_event("startup")
async def load_irrigation_model():
    global IRR_MODEL, CROP_ENCODER
    try:
        import joblib as _joblib
        if os.path.exists(IRR_MODEL_PATH):
            IRR_MODEL = _joblib.load(IRR_MODEL_PATH)
        if os.path.exists(CROP_ENCODER_PATH):
            CROP_ENCODER = _joblib.load(CROP_ENCODER_PATH)
    except Exception as e:
        # Do not crash app; log the issue
        print(f"Warning: failed to load irrigation model or encoder: {e}")


@app.post("/irrigation/predict")
async def predict_irrigation_api(payload: dict):
    """Predict irrigation need.

    Expects JSON with keys: crop (str), land_size (number), sowing_date (YYYY-MM-DD),
    temperature (C), humidity (%), rainfall_mm (number)
    """
    if IRR_MODEL is None or CROP_ENCODER is None:
        return {"error": "Irrigation model not available"}

    try:
        crop = payload.get('crop')
        land_size = float(payload.get('land_size'))
        sowing_date = payload.get('sowing_date')
        temp = float(payload.get('temperature'))
        humidity = float(payload.get('humidity'))
        rainfall_mm = float(payload.get('rainfall_mm'))

        # compute days after sowing
        from datetime import datetime
        try:
            sdate = datetime.fromisoformat(sowing_date)
            days_after = (datetime.utcnow() - sdate).days
            if days_after < 0: days_after = 0
        except Exception:
            days_after = 0

        # encode crop
        try:
            crop_enc = int(CROP_ENCODER.transform([crop])[0])
        except Exception:
            # unknown crop -> attempt to map lowercase match
            crop_enc = 0

        X = [[crop_enc, land_size, days_after, temp, humidity, rainfall_mm]]
        pred = IRR_MODEL.predict(X)
        irr_needed = bool(int(pred[0]))

        # simple heuristics for water quantity and time
        water_quantity = f"{Mathify(land_size)} mm" if irr_needed else "0 mm"
        best_time = "Early Morning (5–8 AM)" if irr_needed else "N/A"

        return {"irrigation_needed": irr_needed, "water_quantity": water_quantity, "best_time": best_time}
    except Exception as e:
        return {"error": str(e)}


# small helper to choose water mm per acre
def Mathify(acres: float) -> int:
    # 2 mm per acre baseline rounded
    try:
        val = round(2 * float(acres))
        return val if val > 0 else 2
    except Exception:
        return 2


@app.get("/health")
async def health():
    return {"status": "ok"}


def prepare_image(file_bytes: bytes, target_size=(128, 128)) -> np.ndarray:
    image = Image.open(BytesIO(file_bytes)).convert("RGB")
    image = image.resize(target_size)
    arr = tf.keras.preprocessing.image.img_to_array(image)
    # Keep preprocessing identical to your Streamlit code (no normalization)
    batch = np.expand_dims(arr, axis=0)
    return batch


@app.post("/predict")
async def predict(image: UploadFile = File(...)) -> Dict[str, Any]:
    if MODEL is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    if image.content_type is None or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")

    try:
        file_bytes = await image.read()
        input_batch = prepare_image(file_bytes)
        preds = MODEL.predict(input_batch)
        idx = int(np.argmax(preds, axis=1)[0])
        label = CLASS_NAMES[idx]
        probs = preds[0].tolist()

        # Optional: top-3 predictions
        topk_idx = np.argsort(preds[0])[::-1][:3]
        topk = [
            {"index": int(i), "label": CLASS_NAMES[int(i)], "confidence": float(preds[0][int(i)])}
            for i in topk_idx
        ]

        # Enrich with disease info
        info = get_disease_info(label)

        return {
            "success": True,
            "predicted_index": idx,
            "predicted_label": label,
            "probabilities": probs,  # same order as CLASS_NAMES
            "topk": topk,
            "info": info,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")
