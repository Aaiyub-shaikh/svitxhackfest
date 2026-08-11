from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import joblib
import os

# Load ML model and scaler
model_path = os.path.join(os.path.dirname(__file__), '..', 'ml_model', 'crop_model.pkl')
scaler_path = os.path.join(os.path.dirname(__file__), '..', 'ml_model', 'scaler.pkl')

model = None
scaler = None

try:
    if os.path.exists(model_path) and os.path.exists(scaler_path):
        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)
        print(f"Successfully loaded ML model from {model_path}")
        print(f"Successfully loaded scaler from {scaler_path}")
    else:
        print(f"Warning: Model files not found. Model: {os.path.exists(model_path)}, Scaler: {os.path.exists(scaler_path)}")
        print(f"Model path: {model_path}")
        print(f"Scaler path: {scaler_path}")
except Exception as e:
    print(f"Error loading model or scaler: {str(e)}")
    print(f"Model path: {model_path}")
    print(f"Scaler path: {scaler_path}")
    model = None
    scaler = None

@csrf_exempt
@require_http_methods(["GET"])
def get_live_prediction(request):
    """
    REST API endpoint that returns the latest prediction data
    Can be called by frontend to get real-time updates
    """
    try:
        all_readings = get_all_latest_readings()
        
        if not all_readings:
            response = JsonResponse({
                'status': 'no_data',
                'message': 'No sensor data available from Firebase'
            })
            # Add CORS headers
            response["Access-Control-Allow-Origin"] = "*"
            response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
            response["Access-Control-Allow-Headers"] = "Content-Type"
            return response
        
        latest = all_readings[0]
        
        # Extract values with defaults for missing data
        # Note: Model expects only 4 features: temperature, humidity, soil_moisture, ph
        # (light_intensity is not used by the model based on crop_data.csv)
        temperature = float(latest.get('temperature', 25))
        humidity = float(latest.get('humidity', 60))
        soil_moisture = float(latest.get('soil_moisture', 50))
        light_intensity = float(latest.get('light_intensity', 800))  # Keep for display in response
        ph = float(latest.get('ph', 7))
        
        # Model expects: [temperature, humidity, soil_moisture, ph]
        sensor_values = [temperature, humidity, soil_moisture, ph]
        
        result, confidence = make_prediction(sensor_values)

        # prepare response
        resp = {
            'status': 'success',
            'sensor_id': latest.get('sensor_id', 'DHT_Sensor'),
            'sensor_data': {
                'temperature': temperature,
                'humidity': humidity,
                'soil_moisture': soil_moisture,
                'light_intensity': light_intensity,
                'ph': ph
            },
            'prediction': {
                'crop': result,
                'confidence': float(confidence) if confidence else 0
            }
        }

        # If no prediction available, change status and include explanatory message
        if result is None:
            resp['status'] = 'error'
            if not model or not scaler:
                resp['message'] = 'ML model or scaler not loaded on server. Please check if crop_model.pkl and scaler.pkl exist in the ml_model directory.'
            else:
                resp['message'] = 'Model returned no result. Please check the model files and sensor data format.'
            # Don't include prediction data if it failed
            resp.pop('prediction', None)

        response = JsonResponse(resp)
        # Add CORS headers
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response
    
    except Exception as e:
        response = JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)
        # Add CORS headers
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response

def get_all_latest_readings():
    """
    Get latest readings from all sensors in Firebase
    Returns data in list format: [{'sensor_id': ..., 'temperature': ..., ...}, ...]
    """
    try:
        from firebase_config import get_sensor_data_from_firebase
        all_data = get_sensor_data_from_firebase()
        
        # Data is already in list format from get_sensor_data_from_firebase
        return all_data if isinstance(all_data, list) else []
    except Exception as e:
        print(f"Error fetching readings: {e}")
        return []

def make_prediction(sensor_values):
    """
    Make crop prediction from sensor values
    Returns: crop_name, confidence
    """
    if not model or not scaler:
        print("Error: Model or scaler not loaded")
        return None, 0
    
    try:
        print(f"Making prediction with sensor values: {sensor_values}")
        sensor_scaled = scaler.transform([sensor_values])
        prediction = model.predict(sensor_scaled)[0]
        confidence = model.predict_proba(sensor_scaled)[0].max()
        print(f"Prediction result: {prediction}, Confidence: {confidence}")
        return prediction, confidence
    except Exception as e:
        print(f"Prediction error: {e}")
        import traceback
        traceback.print_exc()
        return None, 0

def predict_from_sensors(request):
    """
    Web interface - automatically fetches latest data from Firebase
    No manual input needed - data flows from IoT sensors → Firebase → Prediction
    Uses default values for missing sensor data
    """
    result = None
    sensor_data = None
    details = None
    all_readings = []
    confidence = 0
    error_msg = None
    
    # Auto-fetch all latest sensor readings from Firebase
    try:
        all_readings = get_all_latest_readings()
        
        if all_readings:
            # Use the first sensor's latest reading for prediction
            latest = all_readings[0]
            
            # Extract values with defaults for missing data
            # Note: Model expects only 4 features: temperature, humidity, soil_moisture, ph
            # (light_intensity is not used by the model based on crop_data.csv)
            temperature = float(latest.get('temperature', 25))
            humidity = float(latest.get('humidity', 60))
            soil_moisture = float(latest.get('soil_moisture', 50))
            light_intensity = float(latest.get('light_intensity', 800))  # Keep for display
            ph = float(latest.get('ph', 7))
            
            # Model expects: [temperature, humidity, soil_moisture, ph]
            sensor_values = [temperature, humidity, soil_moisture, ph]
            
            sensor_data = {
                'temperature': temperature,
                'humidity': humidity,
                'soil_moisture': soil_moisture,
                'light_intensity': light_intensity,
                'ph': ph,
                'sensor_id': latest.get('sensor_id', 'DHT_Sensor')
            }
            
            # Make automatic prediction
            result, confidence = make_prediction(sensor_values)
        else:
            error_msg = "Unable to fetch sensor data from Firebase. Please check the Firebase URL and internet connection."
    
    except Exception as e:
        error_msg = f"Error: {str(e)}"
        print(f"Error in predict_from_sensors: {e}")
    
    # Crop advice dictionary
    crop_advice = {
        "Rice": {
            "farming": "Prepare leveled field, transplant healthy seedlings, maintain standing water.",
            "irrigation": "Maintain 2–5 cm water level, drain before harvesting.",
            "avoid": "Avoid overwatering, excess fertilizer, late transplanting."
        },
        "Wheat": {
            "farming": "Sow in rows, apply fertilizer in stages, use certified seeds.",
            "irrigation": "4–5 irrigations at CRI, tillering and flowering stages.",
            "avoid": "Avoid waterlogging, excess urea, late sowing."
        },
        "Maize": {
            "farming": "Use raised beds, provide sunlight, apply organic manure.",
            "irrigation": "Irrigate at knee height and tasseling stages.",
            "avoid": "Avoid drought stress and dense planting."
        },
        "Potato": {
            "farming": "Use certified tubers, loose soil, earth up after sprouting.",
            "irrigation": "Light frequent irrigation, stop before harvest.",
            "avoid": "Avoid water stagnation and late blight disease."
        },
        "Cotton": {
            "farming": "Well-drained soil, pest-resistant variety, balanced nutrients.",
            "irrigation": "Irrigate at flowering and boll formation stages.",
            "avoid": "Avoid excess water and overuse of pesticides."
        }
    }
    
    if result:
        details = crop_advice.get(result)
    
    return render(request, 'firebase_predict.html', {
        'result': result,
        'sensor_data': sensor_data,
        'details': details,
        'confidence': confidence,
        'error_msg': error_msg
    })
