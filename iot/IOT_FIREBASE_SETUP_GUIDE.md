# IoT Sensor to Firebase to ML Model - Complete Setup Guide

## 📋 Architecture Overview

```
IoT Sensors (DHT22, Soil Moisture, LDR, pH)
         ↓
    ESP8266/Arduino/Raspberry Pi
         ↓
   POST /api/receive-sensor-data/
         ↓
   Django Backend (Prediction)
         ↓
   Firebase Realtime Database
         ↓
   Model Training & Storage
```

## 🔧 Step 1: Firebase Setup

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enable Google Analytics (optional)
4. Wait for project creation

### 1.2 Setup Realtime Database
1. In Firebase Console, go to **Realtime Database**
2. Click **Create Database**
3. Choose **Start in test mode** (or **locked mode** if you add security rules)
4. Select region closest to you
5. Copy your Database URL (format: `https://your-project.firebaseio.com`)

### 1.3 Setup Storage (optional, for logs/reports)
1. Go to **Storage**
2. Click **Get Started**
3. Accept default security rules
4. Copy your Storage Bucket URL

### 1.4 Generate Service Account Key
1. Go to **Project Settings** (gear icon)
2. Click **Service Accounts** tab
3. Click **Generate New Private Key**
4. Save the JSON file as `serviceAccountKey.json`
5. Place it in your project root directory

## 🐍 Step 2: Python Backend Setup

### 2.1 Install Dependencies
```bash
cd c:\Users\Prerak A Thakkar\Desktop\crop_reccomendation
pip install -r firebase_requirements.txt
```

### 2.2 Update firebase_config.py
Open `firebase_config.py` and replace:
```python
'databaseURL': 'https://your-project.firebaseio.com',
'storageBucket': 'your-project.appspot.com'
```

### 2.3 Run Django Migrations
```bash
python manage.py migrate
```

## 📡 Step 3: IoT Device Setup

### Option A: Raspberry Pi (Python)
```bash
pip install requests DHT Adafruit-CircuitPython-ADS1x15

# Edit IoT_Device_Code.py and update:
DJANGO_SERVER = "http://your-domain.com/api/receive-sensor-data/"
python IoT_Device_Code.py
```

### Option B: Arduino/ESP8266 (C++)
1. Install Arduino IDE
2. Install libraries:
   - WiFi
   - HTTPClient
   - ArduinoJson
3. Use the Arduino code from `IoT_Device_Code.py`
4. Update WiFi credentials and server URL

### Sensor Connections
**Raspberry Pi GPIO:**
- DHT22: GPIO 17 (or your choice)
- Soil Moisture (ADC): I2C A0
- Light Intensity (ADC): I2C A1
- pH (ADC): I2C A2

**Arduino/ESP8266:**
- DHT22: Digital Pin 4 (D2)
- Soil Moisture: A0
- Light Intensity: A1
- pH: A2

## 📊 Step 4: Train Model with Firebase Data

### 4.1 Prepare Training Data
Your Firebase database should have this structure:
```
sensor_data/
  sensor_1/
    temperature: 25.5
    humidity: 60
    soil_moisture: 45
    light_intensity: 800
    ph: 7.2
    crop: "Rice"
    timestamp: 1234567890
  sensor_2/
    temperature: 28.3
    humidity: 55
    soil_moisture: 50
    light_intensity: 850
    ph: 7.0
    crop: "Wheat"
    timestamp: 1234567900
```

### 4.2 Train Model
```bash
cd ml_model
python train_model_firebase.py
```

This will:
- Fetch data from Firebase
- Prepare features (temperature, humidity, soil_moisture, light_intensity, ph)
- Train RandomForest model
- Save model as `crop_model.pkl`
- Save scaler as `scaler.pkl`

## 🌐 Step 5: API Testing

### Test Sensor Data Endpoint
```bash
curl -X POST http://localhost:8000/predict/api/receive-sensor-data/ \
  -H "Content-Type: application/json" \
  -d '{
    "sensor_id": "sensor_1",
    "temperature": 25.5,
    "humidity": 60,
    "soil_moisture": 45,
    "light_intensity": 800,
    "ph": 7.2
  }'
```

Expected Response:
```json
{
  "status": "success",
  "predicted_crop": "Rice",
  "confidence": 0.95,
  "sensor_id": "sensor_1"
}
```

### Test Web Interface
Navigate to: `http://localhost:8000/predict/firebase-predict/`

## 🔐 Step 6: Firebase Security Rules (Production)

Set these rules in Realtime Database Security Rules:

```json
{
  "rules": {
    "sensor_data": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

For stricter security:
```json
{
  "rules": {
    "sensor_data": {
      ".read": false,
      ".write": false
    }
  }
}
```

Then authenticate requests from backend using service account.

## 🚀 Step 7: Deployment

### On Server:
1. Upload `serviceAccountKey.json` securely
2. Set environment variables:
   ```bash
   export FIREBASE_CREDENTIALS=/path/to/serviceAccountKey.json
   ```
3. Update Django settings for production
4. Run collectstatic: `python manage.py collectstatic`
5. Start Django: `gunicorn crop_project.wsgi`

## 📱 Step 8: Monitor Data in Firebase Console

1. Go to Firebase Console
2. Click **Realtime Database**
3. You should see `sensor_data` branch
4. Expand to view live sensor readings
5. Monitor incoming data in real-time

## 🐛 Troubleshooting

**Issue: Firebase connection fails**
- Verify `serviceAccountKey.json` exists in project root
- Check database URL format
- Ensure service account has Realtime Database permissions

**Issue: No data appears in Firebase**
- Check IoT device logs for POST errors
- Verify server URL in device code
- Test with curl command first
- Check Django logs for errors

**Issue: Model training fails**
- Ensure Firebase data exists with `crop` field
- Check feature names match model expectations
- Run: `python manage.py shell` to debug

**Issue: Predictions are poor**
- Collect more training data (100+ samples per crop)
- Calibrate sensor readings
- Verify sensor data quality
- Try different model parameters

## 📚 Files Created

1. `firebase_config.py` - Firebase initialization and helper functions
2. `ml_model/train_model_firebase.py` - Training with Firebase data
3. `prediction/firebase_views.py` - API endpoints for IoT data
4. `templates/firebase_predict.html` - Web UI for predictions
5. `IoT_Device_Code.py` - Sample code for IoT devices
6. `prediction/urls.py` - Updated with new endpoints
7. `firebase_requirements.txt` - Python dependencies

## 🔗 Useful Resources

- Firebase Docs: https://firebase.google.com/docs
- Firebase Python SDK: https://firebase-admin-python.readthedocs.io/
- Arduino IoT: https://docs.arduino.cc/

---

**Next Steps:**
1. Create Firebase project ✓
2. Update firebase_config.py ✓
3. Deploy IoT code to sensors ✓
4. Collect training data (collect 50-100 samples per crop)
5. Train model: `python ml_model/train_model_firebase.py`
6. Test predictions through web interface
