# 🌱 Irrigation Prediction ML

![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Scikit-learn](https://img.shields.io/badge/Scikit--Learn-ML-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-Data_Processing-150458?style=for-the-badge&logo=pandas&logoColor=white)
![NumPy](https://img.shields.io/badge/NumPy-Numerical_Computing-013243?style=for-the-badge&logo=numpy&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-REST_API-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Uvicorn](https://img.shields.io/badge/Uvicorn-ASGI_Server-499848?style=for-the-badge&logo=uvicorn&logoColor=white)

An intelligent **Machine Learning-based Irrigation Prediction System** designed to determine whether irrigation is required based on agricultural and environmental conditions.

The irrigation prediction module is integrated with the system's **Weather Forecasting feature**, allowing weather information such as upcoming conditions to contribute to smarter irrigation recommendations.

---

## 🚀 Overview

Efficient irrigation is essential for reducing water wastage while maintaining healthy crop growth.

This module uses a trained Machine Learning model to analyze relevant agricultural and environmental parameters and predict irrigation requirements.

The prediction system is connected with the application's **Weather Forecasting feature**, enabling irrigation decisions to take upcoming weather conditions into consideration.

### Core Workflow

```text
Agricultural Data
       │
       ▼
Weather Forecast Data
       │
       ▼
Feature Preparation
       │
       ▼
Irrigation ML Model
       │
       ▼
Irrigation Prediction
       │
       ▼
Application / Farmer Advisory
```

---

## ✨ Features

- 🌱 Machine Learning-based irrigation prediction
- 🌦️ Integration with the system's weather forecasting feature
- 📊 Dataset-driven model training
- 🔄 Reusable trained ML model
- 🔌 REST API for irrigation predictions
- 🧠 Crop-specific feature encoding
- ⚡ Fast prediction using a pre-trained model
- 🔗 Easy integration with the main agricultural application

---


## 📁 Project Structure

```text
Irrigation_ml/
│
├── venv/                         # Local Python virtual environment
│
├── crop_encoder.pkl              # Trained crop feature encoder
├── dataset.csv                   # Irrigation training dataset
├── irrigation_api.py             # API for irrigation predictions
├── irrigation_model.pkl          # Trained irrigation ML model
├── predict.py                    # Local prediction/inference script
├── requirements.txt              # Python dependencies
└── train_model.py                # Model training script
```

> **Note:** The `venv/` directory is used only for local development and should not be committed to the repository.

---

## 🧠 Machine Learning Pipeline

The irrigation prediction pipeline consists of the following stages:

### 1. Data Collection

The system uses agricultural and environmental information stored in the training dataset.

Typical inputs may include:

- Crop type
- Temperature
- Humidity
- Soil-related parameters
- Rainfall
- Weather conditions
- Other environmental features

---

### 2. Feature Processing

Input features are processed before being passed to the Machine Learning model.

Categorical information such as crop type is transformed using the trained crop encoder.

The encoder is stored separately as:

```text
crop_encoder.pkl
```

This ensures that prediction-time input is transformed consistently with the data used during model training.

---

### 3. Model Training

The model is trained using:

```text
train_model.py
```

The training process uses:

```text
dataset.csv
```

The resulting trained model is saved as:

```text
irrigation_model.pkl
```

The saved model can then be reused for predictions without retraining every time.

---

### 4. Weather Integration

The irrigation prediction module is connected to the application's **Weather Forecasting feature**.

Weather forecast information can be incorporated into the irrigation decision-making process.

For example:

```text
Weather Forecast
       │
       ├── Expected Rainfall
       ├── Temperature
       ├── Humidity
       └── Other Weather Conditions
                │
                ▼
       Irrigation Prediction
                │
                ▼
       Irrigation Recommendation
```

This allows the system to avoid unnecessary irrigation when upcoming weather conditions indicate sufficient rainfall or unsuitable irrigation conditions.

---

## 🔌 API

The irrigation model is exposed through a REST API implemented in:

```text
irrigation_api.py
```

The API acts as the bridge between the Machine Learning model and the main application.

### Example Architecture

```text
Main Application
       │
       │ Request
       ▼
Irrigation API
       │
       ▼
Feature Processing
       │
       ▼
ML Model
       │
       ▼
Prediction
       │
       ▼
Main Application
```

---

## ▶️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Aaiyub-shaikh/svitxhackfest
cd svitxhackfest
cd Irregation_ml
```

---

### 2. Create a Virtual Environment

Windows:

```bash
python -m venv venv
```

Activate it:

```bash
venv\Scripts\activate
```

Linux / macOS:

```bash
python3 -m venv venv
source venv/bin/activate
```

---

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 🏋️ Train the Model

To train the irrigation prediction model:

```bash
python train_model.py
```

The training process uses:

```text
dataset.csv
```

and generates the required model artifacts.

---

## 🔮 Run Predictions

The prediction script can be executed using:

```bash
python predict.py
```

This allows the trained model to be tested independently before integrating it with the main application.

---

## 🌐 Run the Irrigation API

Start the API using Uvicorn:

```bash
uvicorn irrigation_api:app --reload
```

The API will be available locally at:

```text
http://127.0.0.1:8000
```

If FastAPI documentation is enabled, interactive API documentation can be accessed at:

```text
http://127.0.0.1:8000/docs
```

---

## 📡 API Integration

The main agricultural application can communicate with the irrigation service through HTTP requests.

Example conceptual request:

```json
{
    "crop": "Wheat",
    "temperature": 28,
    "humidity": 65,
    "rainfall": 2.5
}
```

The API processes the input and returns an irrigation prediction.

Example conceptual response:

```json
{
    "irrigation_required": true,
    "recommendation": "Irrigation recommended"
}
```

> The exact request and response fields depend on the implementation of `irrigation_api.py`.

---

## 🌦️ Weather-Aware Irrigation

One of the key features of this module is its connection with the application's **Weather Forecasting system**.

Instead of making irrigation decisions using only current agricultural conditions, the system can consider upcoming weather information.

### Example

```text
Current Soil Conditions
          +
Crop Information
          +
Current Weather
          +
Weather Forecast
          │
          ▼
   ML Prediction Model
          │
          ▼
  Irrigation Decision
```

If significant rainfall is expected, the system can reduce unnecessary irrigation recommendations.

If dry conditions are expected, the system can provide an irrigation recommendation based on the model's prediction.

---

## 🎯 Objectives

The main objectives of this module are:

- Reduce unnecessary water consumption
- Improve irrigation decision-making
- Provide data-driven irrigation recommendations
- Incorporate weather conditions into irrigation decisions
- Support precision agriculture
- Provide an ML service that can easily integrate with the main application

---

## 📊 Model Artifacts

The project uses serialized Machine Learning artifacts:

| File | Purpose |
|------|---------|
| `irrigation_model.pkl` | Trained irrigation prediction model |
| `crop_encoder.pkl` | Encoder used for crop-related features |

The model artifacts should be generated using the same environment and dependency versions used during training.

> Pickle-based model files should only be loaded from trusted sources because loading untrusted pickle files can execute arbitrary code. :contentReference[oaicite:0]{index=0}

---

## 🔄 Development Workflow

```text
Modify Dataset
      │
      ▼
Update train_model.py
      │
      ▼
Train Model
      │
      ▼
Save Model
      │
      ▼
Test Using predict.py
      │
      ▼
Run irrigation_api.py
      │
      ▼
Connect With Main Application
      │
      ▼
Use Weather Forecast Data
      │
      ▼
Generate Irrigation Recommendation
```

---

## 🚀 Future Improvements

Potential improvements include:

- 📈 Improved irrigation prediction accuracy
- 🌧️ More advanced weather-based prediction
- 🌱 Crop-specific irrigation models
- 💧 Soil moisture sensor integration
- 📡 Real-time IoT sensor integration
- 🧠 Automated model retraining
- 📊 Irrigation analytics dashboard
- 🔔 Smart irrigation notifications
- 📍 Location-aware weather integration
- 🌾 Integration with additional precision-agriculture features

---

## 🌾 System Integration

The Irrigation Prediction module is designed as one component of a larger smart agriculture platform.

```text
                    Smart Agriculture System
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
    Weather Forecast   Irrigation ML     Other Modules
          │                 │
          │                 │
          └────────┬────────┘
                   ▼
          Intelligent Advisory
                   │
                   ▼
                 Farmer
```

The **Weather Forecasting feature provides environmental context to the Irrigation Prediction module**, helping the overall system provide more informed irrigation recommendations.

---

## 📜 License

This project is developed for educational, research, and smart agriculture applications.