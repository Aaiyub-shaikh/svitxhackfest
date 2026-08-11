# System Architecture & Data Flow Diagram

## 🏗️ Complete System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        LIVE AUTO-PREDICTION SYSTEM                     │
└────────────────────────────────────────────────────────────────────────┘

LAYER 1: HARDWARE (IoT Sensors)
═══════════════════════════════════════════════════════════════════════════

    ┌──────────────────┐
    │   DHT22 Sensor   │  (Temperature & Humidity)
    └────────┬─────────┘
             │
    ┌────────▼──────────┐
    │  Soil Moisture    │  (Capacitive/Resistive Sensor)
    │  Sensor Module    │
    └────────┬──────────┘
             │
    ┌────────▼──────────┐
    │  LDR (Light)      │  (Photoresistor for Light Intensity)
    │  Sensor           │
    └────────┬──────────┘
             │
    ┌────────▼──────────┐
    │  pH Sensor        │  (Analog pH Probe)
    │  Module           │
    └────────┬──────────┘
             │
             ▼
    ┌─────────────────────────────────┐
    │  Microcontroller                │
    │  - Arduino/ESP8266/Raspberry Pi  │
    │  - Collects all sensor values    │
    │  - Formats as JSON              │
    └────────┬────────────────────────┘


LAYER 2: NETWORK (Data Transmission)
═══════════════════════════════════════════════════════════════════════════

             │
             │ HTTP POST (Every 60 seconds)
             │
    ┌────────▼────────────────────────────────┐
    │  POST /predict/api/receive-sensor-data/ │
    │  {                                       │
    │    "sensor_id": "sensor_1",             │
    │    "temperature": 25.5,                 │
    │    "humidity": 60,                      │
    │    "soil_moisture": 45,                 │
    │    "light_intensity": 800,              │
    │    "ph": 7.2                            │
    │  }                                       │
    └────────┬────────────────────────────────┘


LAYER 3: BACKEND (Django Server)
═══════════════════════════════════════════════════════════════════════════

             │
             ▼
    ┌─────────────────────────────────────┐
    │  receive_sensor_data()              │
    │  - Validate JSON                    │
    │  - Check required fields            │
    │  - Validate data ranges             │
    └────────┬────────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────────┐
    │  make_prediction()                  │
    │  - Scale sensor values              │
    │  - Run ML model                     │
    │  - Get confidence score             │
    └────────┬────────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────────┐
    │  save_sensor_reading()              │
    │  - Send to Firebase                 │
    │  - Auto-timestamp                   │
    │  - Store in real-time database      │
    └────────┬────────────────────────────┘


LAYER 4: DATABASE (Firebase)
═══════════════════════════════════════════════════════════════════════════

             │
             ▼
    ┌─────────────────────────────────────┐
    │  Firebase Realtime Database         │
    │  ├── sensor_data/                   │
    │  │   ├── sensor_1/                  │
    │  │   │   ├── temperature: 25.5      │
    │  │   │   ├── humidity: 60           │
    │  │   │   ├── soil_moisture: 45      │
    │  │   │   ├── light_intensity: 800   │
    │  │   │   ├── ph: 7.2                │
    │  │   │   └── timestamp: ...         │
    │  │   └── sensor_2/                  │
    │  │       └── ...                    │
    │  └── predictions/                   │
    │      └── ...                        │
    └────────┬────────────────────────────┘


LAYER 5: FRONTEND (Web Interface)
═══════════════════════════════════════════════════════════════════════════

             │
             ▼
    ┌──────────────────────────────────────────┐
    │  Browser: /firebase-predict/            │
    │                                          │
    │  ┌─────────────────────────────────────┐ │
    │  │  Django View: predict_from_sensors()│ │
    │  │  - get_all_latest_readings()        │ │
    │  │  - Fetch from Firebase              │ │
    │  │  - make_prediction()                │ │
    │  │  - Render template with data        │ │
    │  └─────────────────────────────────────┘ │
    │                                          │
    │  ┌─────────────────────────────────────┐ │
    │  │  HTML Template Display              │ │
    │  │  - Live sensor cards                │ │
    │  │  - Crop recommendation              │ │
    │  │  - Farming methods                  │ │
    │  │  - Irrigation techniques            │ │
    │  │  - What to avoid section            │ │
    │  └─────────────────────────────────────┘ │
    │                                          │
    │  JavaScript Auto-Refresh:               │
    │  - Every 10 seconds → reload()           │
    │  - Fetch latest data                    │
    │  - Update display                       │
    └──────────────────────────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │  User sees:                  │
    │  ✓ Real-time sensor data     │
    │  ✓ Recommended crop          │
    │  ✓ Farming recommendations   │
    │  ✓ Auto-updates every 10s    │
    └──────────────────────────────┘
```

## 📊 Data Flow Timeline

```
T=0 seconds:
    IoT Device collects sensor readings
    ↓
T=1 second:
    Microcontroller formats as JSON
    ↓
T=2 seconds:
    POST request sent to /api/receive-sensor-data/
    ↓
T=3 seconds:
    Django receives, validates, predicts
    ↓
T=4 seconds:
    Data saved to Firebase
    ↓
T=5 seconds:
    Response sent back to IoT device
    ↓
[REPEAT CYCLE EVERY 60 SECONDS FROM DEVICE]

---

Meanwhile, Web Interface:
T=0 seconds:
    User opens /firebase-predict/
    ↓
T=1 second:
    Django fetches latest from Firebase
    ↓
T=2 seconds:
    ML model makes prediction
    ↓
T=3 seconds:
    HTML renders with data
    ↓
T=4 seconds:
    Browser displays to user
    ↓
[AUTOMATIC RELOAD EVERY 10 SECONDS]

T=10 seconds:
    Page auto-reloads
    ↓ (repeat from T=0 to T=4)
```

## 🔄 Request/Response Flow

### IoT Device → Backend

**REQUEST (POST)**
```
POST /predict/api/receive-sensor-data/ HTTP/1.1
Host: your-domain.com
Content-Type: application/json
Content-Length: 127

{
  "sensor_id": "sensor_1",
  "temperature": 25.5,
  "humidity": 60,
  "soil_moisture": 45,
  "light_intensity": 800,
  "ph": 7.2
}
```

**RESPONSE (Success)**
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "success",
  "message": "Sensor data received and processed",
  "sensor_id": "sensor_1",
  "predicted_crop": "Rice",
  "confidence": 0.95
}
```

### Frontend → Backend

**REQUEST (GET)**
```
GET /predict/firebase-predict/ HTTP/1.1
Host: localhost:8000
```

**RESPONSE (HTML)**
```
HTTP/1.1 200 OK
Content-Type: text/html

<!DOCTYPE html>
<html>
  <head>...</head>
  <body>
    <!-- Page auto-refreshes every 10 seconds -->
    <!-- Displays latest sensor data from Firebase -->
    <!-- Shows ML prediction results -->
  </body>
</html>
```

### REST API (Live Prediction)

**REQUEST (GET)**
```
GET /predict/api/live-prediction/ HTTP/1.1
Host: your-domain.com
```

**RESPONSE (JSON)**
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "success",
  "sensor_id": "sensor_1",
  "sensor_data": {
    "temperature": 25.5,
    "humidity": 60,
    "soil_moisture": 45,
    "light_intensity": 800,
    "ph": 7.2
  },
  "prediction": {
    "crop": "Rice",
    "confidence": 0.95
  }
}
```

## 🧠 ML Model Processing

```
INPUT:
┌──────────────────────────────┐
│ Raw Sensor Values:           │
│ - Temperature: 25.5          │
│ - Humidity: 60               │
│ - Soil Moisture: 45          │
│ - Light Intensity: 800       │
│ - pH: 7.2                    │
└──────────────────────────────┘
        │
        ▼
┌──────────────────────────────┐
│ Feature Scaling (Normalization)
│ Using StandardScaler:        │
│ Normalizes all values        │
│ to mean=0, std=1             │
└──────────────────────────────┘
        │
        ▼
┌──────────────────────────────┐
│ RandomForest Classifier      │
│ - 100 decision trees         │
│ - Max depth: 15              │
│ - Trained on 100+ samples    │
└──────────────────────────────┘
        │
        ▼
OUTPUT:
┌──────────────────────────────┐
│ Prediction Results:          │
│ - Crop: Rice                 │
│ - Confidence: 0.95 (95%)     │
│ - Alternatives: Wheat (0.03) │
└──────────────────────────────┘
```

## 🗄️ Firebase Database Structure

```
project-name (Firebase Realtime DB)
│
└── sensor_data/
    ├── sensor_1/
    │   ├── temperature: 25.5
    │   ├── humidity: 60
    │   ├── soil_moisture: 45
    │   ├── light_intensity: 800
    │   ├── ph: 7.2
    │   └── timestamp: 1704816000000
    │
    ├── sensor_2/
    │   ├── temperature: 28.3
    │   ├── humidity: 55
    │   ├── soil_moisture: 50
    │   ├── light_intensity: 850
    │   ├── ph: 7.0
    │   └── timestamp: 1704816060000
    │
    └── sensor_3/
        ├── temperature: 22.1
        ├── humidity: 65
        ├── soil_moisture: 40
        ├── light_intensity: 750
        ├── ph: 7.5
        └── timestamp: 1704816120000
```

## 📱 Complete User Journey

```
FARMER'S PERSPECTIVE:

6:00 AM → Opens phone/tablet
          ↓
       Types in browser: my-farm.com/predict/firebase-predict/
          ↓
       Instantly sees:
       ✓ Current field conditions (auto-fetched from Firebase)
       ✓ Real-time sensor readings
       ✓ Recommended crop for today
       ✓ Exact farming steps to follow
       ✓ Irrigation schedule
       ✓ What NOT to do today
          ↓
       Goes to field, follows recommendations
          ↓
       10:00 AM → Sensor readings update
                  Web page auto-refreshes with new data
                  Farmer checks for any changes
          ↓
       12:00 PM → Another auto-update
                  Sees updated recommendations
          ↓
       2:00 PM → Another auto-update
          ↓
       [Continues throughout the day]


SYSTEM'S PERSPECTIVE:

Every 60 seconds:
    IoT Sensor sends POST request
    ↓ Saved to Firebase
    ↓ Auto-prediction made

Every 10 seconds (when user is on page):
    Page auto-reloads
    ↓ Fetches latest from Firebase
    ↓ Shows latest prediction
    ↓ No user action needed

Result: ALWAYS current, ALWAYS accurate, FULLY AUTOMATIC
```

---

This architecture ensures:
✅ Real-time data collection
✅ Automatic predictions
✅ Zero manual input
✅ 24/7 monitoring
✅ Mobile accessible
✅ Scalable to multiple sensors
