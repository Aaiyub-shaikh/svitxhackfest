
# 🌱 AgriSmart - IoT & Crop Prediction Module

![Python](https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge)
![Django](https://img.shields.io/badge/Django-Web_Framework-092E20?style=for-the-badge)
![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-Machine_Learning-F7931E?style=for-the-badge)
![Pandas](https://img.shields.io/badge/Pandas-Data_Processing-150458?style=for-the-badge)
![NumPy](https://img.shields.io/badge/NumPy-Numerical_Computing-013243?style=for-the-badge)
![Firebase](https://img.shields.io/badge/Firebase-IoT_Integration-FFCA28?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-Frontend-E34F26?style=for-the-badge)
![CSS3](https://img.shields.io/badge/CSS3-Styling-1572B6?style=for-the-badge)
![Pickle](https://img.shields.io/badge/Pickle-ML_Model_Storage-3776AB?style=for-the-badge)
![License](https://img.shields.io/badge/License-Educational-blue?style=for-the-badge)

The **IoT & Crop Prediction Module** is a feature of **AgriSmart**, an intelligent agriculture platform designed to provide farmers with data-driven insights and smart farming solutions.

This module integrates **IoT data, Firebase, Django, and Machine Learning** to collect agricultural information and provide crop-related predictions.

---

## 🚀 Features

- 📡 IoT data integration
- 🔥 Firebase integration for agricultural data
- 🌾 Crop prediction using Machine Learning
- 🤖 Trained ML model integration with Django
- 📊 Agricultural data processing
- 🌱 Crop recommendation based on input parameters
- 🌐 Django-based API and web interface
- 🗄️ Local database support

---

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| Python | Core programming language |
| Django | Backend framework |
| Scikit-learn | Machine Learning |
| Pandas | Data processing |
| Firebase | IoT data integration |
| HTML/CSS | Web interface |

---

## 📁 Project Structure

```text
iot/
│
├── crop_project/
│   ├── settings.py
│   └── urls.py
│
├── ml_model/
│   ├── crop_data.csv
│   ├── crop_model.pkl
│   ├── scaler.pkl
│   ├── train_model.py
│   └── train_model_firebase.py
│
├── prediction/
│   ├── migrations/
│   ├── firebase_views.py
│   ├── forms.py
│   ├── models.py
│   ├── urls.py
│   └── views.py
│
├── static/
│   └── style.css
│
├── templates/
│   ├── firebase_predict.html
│   └── predict.html
│
├── firebase_config.py
├── FIREBASE_EXAMPLE_DATA.json
├── FIREBASE_SETUP.txt
├── IOT_FIREBASE_SETUP_GUIDE.md
├── QUICK_START_IOT.md
├── ARCHITECTURE_FLOWCHART.md
├── manage.py
├── requirements.txt
└── README.md
````

---

## 📂 Module Overview

### `crop_project/`

Contains the main Django project configuration.

* `settings.py` - Django configuration
* `urls.py` - Main URL routing

### `ml_model/`

Contains the Machine Learning components used for crop prediction.

* `crop_data.csv` - Crop training dataset
* `crop_model.pkl` - Trained prediction model
* `scaler.pkl` - Feature scaler
* `train_model.py` - Model training script
* `train_model_firebase.py` - Firebase-integrated training

### `prediction/`

Handles crop prediction and Firebase-related functionality.

* `models.py` - Django database models
* `forms.py` - Prediction input forms
* `views.py` - Prediction logic
* `firebase_views.py` - Firebase-related functionality
* `urls.py` - Prediction routes
* `migrations/` - Database migrations

### `templates/`

Contains the HTML interfaces for crop prediction.

### `static/`

Contains frontend static files such as CSS.

---

## ⚙️ Setup

### 1. Navigate to the Module

```bash
cd IOT
```

### 2. Create Virtual Environment

```bash
python -m venv venv
```

Activate on Windows:

```bash
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 🔥 Firebase Configuration

Firebase is used to integrate IoT and agricultural data with the AgriSmart platform.

Refer to:

```text
IOT_FIREBASE_SETUP_GUIDE.md
```

Example Firebase data is available in:

```text
FIREBASE_EXAMPLE_DATA.json
```

> Never commit Firebase private keys or service-account credentials to GitHub.

---

## 🤖 Crop Prediction

The crop prediction system uses a trained Machine Learning model.

Model files:

```text
ml_model/
├── crop_model.pkl
└── scaler.pkl
```

Training dataset:

```text
ml_model/crop_data.csv
```

Train the model using:

```bash
python ml_model/train_model.py
```

For Firebase-integrated training:

```bash
python ml_model/train_model_firebase.py
```

---

## ▶️ Run the Module

Apply Django migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

Start the development server:

```bash
python manage.py runserver
```

The module will be available at:

```text
http://127.0.0.1:8000/
```

---

## 🌾 Crop Prediction Flow

```text
IoT / Farmer Input
        ↓
     Firebase
        ↓
  Django Backend
        ↓
 Data Processing
        ↓
 Feature Scaling
        ↓
   ML Model
        ↓
Crop Prediction
        ↓
 AgriSmart Platform
```

---

## 📡 IoT Data Flow

```text
IoT Sensors
     ↓
  Firebase
     ↓
Django Module
     ↓
Data Processing
     ↓
AgriSmart
```

The IoT feature can be used to collect agricultural parameters and provide them to the crop prediction system for intelligent recommendations.

---

## 🧪 Testing

Run Django system checks:

```bash
python manage.py check
```

Run the development server:

```bash
python manage.py runserver
```

Firebase functionality can be tested using:

```text
FIREBASE_EXAMPLE_DATA.json
```


---

## 🚀 Future Improvements

* Real-time IoT sensor monitoring
* Automated irrigation
* Weather data integration
* Advanced crop recommendation
* Crop disease detection
* Sensor-based alerts
* Real-time Firebase synchronization
* Farmer analytics dashboard
* Integration with the main AgriSmart backend
* Cloud deployment

---

## 🌱 About AgriSmart

**AgriSmart** is an intelligent agriculture platform that combines modern technologies such as **AI, Machine Learning, IoT, Firebase, and web technologies** to provide farmers with smart and data-driven agricultural solutions.

The IoT & Crop Prediction module is one of the key features of AgriSmart, helping transform real-world agricultural data into useful crop insights and recommendations.

```text
                    AgriSmart
                        │
        ┌───────────────┼───────────────┐
        │               │               │
       AI              IoT          Crop Prediction
        │               │               │
        └───────────────┼───────────────┘
                        │
                  Smart Farming
```

---

## 📌 Project Status

**🚧 Active Development**

The IoT and Crop Prediction feature is currently being developed and integrated into the larger AgriSmart platform.

---

## 📄 License

This project is developed for educational, research, and project purposes.

