# 🌾 AgriSmart ML API

![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-API-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-ML-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![Uvicorn](https://img.shields.io/badge/Uvicorn-ASGI-499848?style=for-the-badge&logo=uvicorn&logoColor=white)
![NumPy](https://img.shields.io/badge/NumPy-Numerical-013243?style=for-the-badge&logo=numpy&logoColor=white)
![Scikit--learn](https://img.shields.io/badge/Scikit--learn-ML-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)

## 📌 Overview

The **AgriSmart ML API** is the machine learning backend of the AgriSmart smart agriculture platform.

It contains two FastAPI services:

- 🌿 **Disease Detection API** — detects plant diseases from leaf images and provides organic treatment suggestions.
- 💧 **Irrigation Management API** — provides irrigation management functionality and works with AgriSmart's weather forecasting feature.

---

## 📂 Project Structure

```text
ml-api/
│
│
├── main.py                  # Disease Detection FastAPI Server
├── irrigation_server.py     # Irrigation Management FastAPI Server
├── requirements.txt
└── .gitignore
````

---

## 🌿 Disease Detection API

`main.py` is the FastAPI server responsible for plant disease detection.

```text
Leaf Image
    ↓
FastAPI API
    ↓
Image Processing
    ↓
TensorFlow Model
    ↓
Disease Prediction
    ↓
🌱 Organic Treatment Suggestion
```

---

## 💧 Irrigation Management API

`irrigation_server.py` is the FastAPI server responsible for irrigation management.

It works together with AgriSmart's **weather forecasting feature** to support smarter irrigation decisions.

```text
Weather Forecast
       +
Crop / Irrigation Data
       ↓
Irrigation API
       ↓
Irrigation Recommendation
```

---

## 🛠️ Technologies

| Technology                                                     | Purpose                             |
| -------------------------------------------------------------- | ----------------------------------- |
| [Python](https://www.python.org/)                              | Backend and ML development          |
| [FastAPI](https://fastapi.tiangolo.com/)                       | REST API development                |
| [Uvicorn](https://www.uvicorn.org/)                            | ASGI server                         |
| [TensorFlow](https://www.tensorflow.org/)                      | Deep learning and disease detection |
| [Pillow](https://python-pillow.org/)                           | Image processing                    |
| [NumPy](https://numpy.org/)                                    | Numerical computation               |
| [Scikit-learn](https://scikit-learn.org/)                      | Machine learning utilities          |
| [Joblib](https://joblib.readthedocs.io/)                       | Model/data serialization            |
| [Python Multipart](https://github.com/Kludex/python-multipart) | File upload handling                |



---

## ⚙️ Installation

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows:

```powershell
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## ▶️ Running the APIs

### 🌿 Disease Detection

```bash
uvicorn main:app --reload
```

### 💧 Irrigation Management

```bash
uvicorn irrigation_server:app --reload
```

API documentation will be available at:

```text
http://127.0.0.1:8000/docs
```

---

## 🌾 AgriSmart Integration

```text
                         AgriSmart
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
       🌿 Disease API                💧 Irrigation API
              │                             │
              ▼                             ▼
       Disease Detection            Irrigation Management
              │                             ▲
              ▼                             │
       🌱 Organic Treatment          🌦️ Weather Forecast
```

The ML API provides the AI-powered backend services used by AgriSmart for **crop disease detection, organic treatment guidance, and irrigation management**.



