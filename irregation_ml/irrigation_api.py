from flask import Flask, request, jsonify
import os
from datetime import datetime

try:
    import joblib
except Exception:
    joblib = None

BASE = os.path.abspath(os.path.dirname(__file__))
MODEL_PATH = os.path.join(BASE, 'irrigation_model.pkl')
ENCODER_PATH = os.path.join(BASE, 'crop_encoder.pkl')

app = Flask(__name__)

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


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})


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


@app.route('/predict', methods=['POST'])
def predict():
    try:
        load_model()
    except Exception as exc:
        return jsonify({'error': str(exc)}), 500

    data = request.get_json(force=True, silent=True)
    if not data:
        return jsonify({'error': 'Invalid or missing JSON payload'}), 400

    crop = data.get('crop')
    land_size = data.get('land_size')
    sowing_date = data.get('sowing_date')

    if not crop or land_size is None or not sowing_date:
        return jsonify({'error': 'Missing required fields: crop, land_size, sowing_date'}), 400

    # read optional weather values
    temp = data.get('temperature')
    humidity = data.get('humidity')
    rainfall_mm = data.get('rainfall_mm')

    days_after = compute_days_after(sowing_date)

    # encode crop when possible
    crop_enc = 0
    try:
        if _crop_encoder is not None:
            crop_enc = int(_crop_encoder.transform([crop])[0])
    except Exception:
        crop_enc = 0

    try:
        X = [[crop_enc, float(land_size), days_after, float(temp) if temp is not None else 25.0, float(humidity) if humidity is not None else 60.0, float(rainfall_mm) if rainfall_mm is not None else 0.0]]
        pred = _irrigation_model.predict(X)
        irr_needed = bool(int(pred[0]))
    except Exception as exc:
        return jsonify({'error': f'Prediction error: {exc}'}), 500

    water_quantity = f"{calc_water_mm(land_size)} mm" if irr_needed else "0 mm"
    best_time = "Early Morning (5–8 AM)" if irr_needed else "N/A"

    return jsonify({'irrigation_needed': irr_needed, 'water_quantity': water_quantity, 'best_time': best_time})


if __name__ == '__main__':
    # Run as: python irrigation_api.py
    # Port can be set via environment variable IRRIGATION_PORT (default: 5000)
    port = int(os.environ.get('IRRIGATION_PORT', 5000))
    host = os.environ.get('IRRIGATION_HOST', '127.0.0.1')
    print(f'Starting Flask irrigation API server on http://{host}:{port}')
    app.run(host=host, port=port)
