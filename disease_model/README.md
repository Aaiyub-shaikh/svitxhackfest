# 🌿 AgriSmart — AI Plant Disease Detection & Organic Treatment

### AI-Powered Crop Disease Detection with Organic Treatment Recommendations

![Python](https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.16.1-orange?style=for-the-badge)
![Keras](https://img.shields.io/badge/Keras-Deep_Learning-red?style=for-the-badge)
![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-ML-F7931E?style=for-the-badge)
![NumPy](https://img.shields.io/badge/NumPy-Numerical_Computing-013243?style=for-the-badge)
![Pandas](https://img.shields.io/badge/Pandas-Data_Processing-150458?style=for-the-badge)
![Streamlit](https://img.shields.io/badge/Streamlit-Web_App-FF4B4B?style=for-the-badge)
![Jupyter](https://img.shields.io/badge/Jupyter-Notebook-F37626?style=for-the-badge)
![License](https://img.shields.io/badge/License-Educational-blue?style=for-the-badge)
---

## 📌 Overview

The **AI Plant Disease Detection & Organic Treatment Module** is an intelligent feature of **AgriSmart**, an integrated smart agriculture platform.

This module uses **deep learning and image classification** to analyze plant leaf images and identify potential diseases.

After detecting a disease, AgriSmart provides **organic treatment and prevention recommendations**, helping farmers understand the problem and take appropriate action using environmentally friendly approaches.

Instead of operating as a standalone disease detection application, this module works as part of the larger **AgriSmart ecosystem**, which combines:

* 🌿 AI Plant Disease Detection
* 🌱 Organic Treatment Recommendations
* 🌦️ Weather Forecasting
* 💧 Smart Irrigation Management
* 📡 IoT-Based Crop & Field Monitoring
* 🤝 Farmer–Buyer Marketplace

---

## 🎯 Purpose

Plant diseases can significantly reduce crop productivity and cause economic losses for farmers.

Traditional disease identification often depends on manual observation or expert consultation. AgriSmart aims to simplify the initial identification process by allowing farmers to upload a plant leaf image and receive an AI-based prediction.

The module follows this approach:

```text
Plant Leaf Image
       ↓
Image Preprocessing
       ↓
Deep Learning Model
       ↓
Disease Classification
       ↓
Disease Identification
       ↓
Organic Treatment Recommendation
       ↓
Prevention Guidance
```

---

## ✨ Key Features

### 🌿 AI Plant Disease Detection

Farmers can upload an image of a plant leaf, which is analyzed by a trained TensorFlow/Keras deep learning model.

The system identifies the most likely disease category based on visual characteristics learned during model training.

### 🧠 Deep Learning Classification

The detection model uses deep learning techniques to recognize visual patterns such as:

* Leaf discoloration
* Spots
* Lesions
* Texture changes
* Disease-specific patterns
* Other visible symptoms

### 🌱 Organic Treatment Suggestions

After identifying the disease, AgriSmart provides **organic treatment recommendations**.

Recommendations can include suitable natural or organic approaches such as:

* Neem-based solutions
* Organic pest management
* Natural disease-control methods
* Crop hygiene practices
* Removal of infected plant material
* Preventive farming practices

> Treatment recommendations are intended as general agricultural guidance and should be validated according to the crop, disease severity, and local agricultural practices.

### 📷 Image-Based Detection

Users can upload plant leaf images directly through the application.

```text
Upload Image
     ↓
Analyze Image
     ↓
Predict Disease
     ↓
Show Result
     ↓
Recommend Organic Treatment
```

### 📊 Model Training & Evaluation

The project includes dedicated notebooks for:

* Dataset preparation
* Image preprocessing
* Model training
* Validation
* Performance analysis
* Model testing
* Training history visualization

---

# 🏗️ AgriSmart Integration

The disease detection module is not an isolated system.

It is integrated into AgriSmart's broader agricultural management platform.

```text
                         ┌──────────────────────┐
                         │       AgriSmart      │
                         └──────────┬───────────┘
                                    │
             ┌──────────────────────┼──────────────────────┐
             │                      │                      │
             ▼                      ▼                      ▼
      🌿 Disease Detection   🌦️ Weather Forecasting   💧 Irrigation
             │                      │                 Management
             ▼                      │                      │
      🌱 Organic Treatment          │                      │
             │                      │                      │
             └──────────────┬───────┴──────────────────────┘
                            │
                            ▼
                  📡 IoT Crop Management
                            │
                            ▼
                  🤝 Farmer–Buyer Platform
```

This integration allows disease information to become part of a larger smart-farming workflow.

---

# 🔄 Disease Detection Workflow

```text
Farmer
  │
  ▼
Upload Plant Leaf Image
  │
  ▼
Image Preprocessing
  │
  ▼
AI / Deep Learning Model
  │
  ▼
Disease Prediction
  │
  ├───────────────┐
  ▼               ▼
Disease Name    Prediction Result
  │
  ▼
Organic Treatment
Recommendation
  │
  ▼
Prevention Guidance
  │
  ▼
Farmer Takes Action
```

---

# 🧠 Machine Learning Pipeline

The model follows a standard image-classification workflow.

```text
Dataset
   ↓
Image Loading
   ↓
Image Preprocessing
   ↓
Training / Validation Split
   ↓
Deep Learning Model
   ↓
Model Training
   ↓
Validation
   ↓
Model Evaluation
   ↓
Model Saving
   ↓
Disease Prediction
```

---

# 📓 Model Development

The machine learning component contains two primary notebooks.

## `Train_plant_disease.ipynb`

Used to train the plant disease classification model.

It includes:

* Dataset loading
* Image preprocessing
* Data preparation
* Model construction
* Model training
* Validation
* Performance analysis
* Training history
* Model saving

## `Test_Plant_Disease.ipynb`

Used to test the trained model with plant leaf images.

It can be used to evaluate:

* Prediction accuracy
* Model performance
* Individual predictions
* Classification results
* Previously unseen images

---

# 📊 Training History

The model training process generates:

```text
training_hist.json
```

This file can be used to analyze:

* Training accuracy
* Validation accuracy
* Training loss
* Validation loss

Example:

```text
Model Training
      │
      ├── Training Accuracy
      ├── Validation Accuracy
      ├── Training Loss
      └── Validation Loss
```

---

# 📂 Module Structure

A typical structure for the disease detection module is:

```text
disease-detection/
│
├── main.py
│
├── Train_plant_disease.ipynb
├── Test_Plant_Disease.ipynb
├── disease_info.py
├── trained_model.h5
├── training_hist.json
│
├── home_page.jpeg
│
├── requirements.txt
└── .gitignore
```

The module can be integrated with the main AgriSmart application according to the overall project architecture.

---

# 🛠️ Technology Stack

| Technology           | Purpose                       |
| -------------------- | ----------------------------- |
| **Python**           | Machine learning development  |
| **TensorFlow**       | Deep learning framework       |
| **Keras**            | Neural network development    |
| **Scikit-learn**     | ML utilities and evaluation   |
| **NumPy**            | Numerical computation         |
| **Pandas**           | Data processing               |
| **Matplotlib**       | Training visualization        |
| **Seaborn**          | Statistical visualization     |
| **Streamlit**        | Disease detection interface   |
| **Jupyter Notebook** | Model development and testing |
| **OpenCV**           | Image processing              |



---

# ⚙️ Installation

## 1. Navigate to the AgriSmart Project

```bash
cd AgriSmart
```

Navigate to the disease detection module if it is maintained separately:

```bash
cd disease_model
```

---

## 2. Create Virtual Environment

```bash
python -m venv venv
```

---

## 3. Activate Virtual Environment

### Windows PowerShell

```powershell
venv\Scripts\Activate.ps1
```

### Windows CMD

```cmd
venv\Scripts\activate
```

---

## 4. Upgrade pip

```bash
python -m pip install --upgrade pip
```

---

## 5. Install Dependencies

```bash
pip install -r requirements.txt
```

---

# ▶️ Running the Disease Detection Module

Run the application using:

```bash
streamlit run main.py
```

The Streamlit application will start locally.

Open the URL provided in the terminal, normally:

```text
http://localhost:8501
```

---

# 🔍 Using Disease Detection

### Step 1 — Upload Leaf Image

The farmer uploads an image of the affected plant leaf.

### Step 2 — Image Processing

AgriSmart preprocesses the image so it can be passed to the trained model.

### Step 3 — AI Prediction

The TensorFlow/Keras model analyzes the image and predicts the disease class.

### Step 4 — Display Result

The predicted disease is displayed to the user.

### Step 5 — Organic Treatment

AgriSmart provides relevant organic treatment and prevention recommendations.

```text
📷 Upload Leaf
      ↓
🧠 AI Analysis
      ↓
🦠 Disease Detection
      ↓
🌱 Organic Treatment
      ↓
🛡️ Prevention
```

---

# 🌦️ Integration with Weather Forecasting

The disease detection feature can work alongside AgriSmart's weather forecasting capabilities.

Weather conditions such as:

* Temperature
* Humidity
* Rainfall
* Weather patterns

can influence the development and spread of certain plant diseases.

By combining disease detection with weather information, AgriSmart can provide farmers with more contextual agricultural insights.

```text
Disease Detection
       +
Weather Forecast
       ↓
Better Crop Monitoring
       ↓
Preventive Agricultural Decisions
```

---

# 💧 Integration with Irrigation Management

AgriSmart also provides **smart irrigation management**.

Disease information and irrigation conditions can be considered together when managing crops.

```text
Crop Condition
      +
Soil / Irrigation Data
      +
Weather Forecast
      ↓
Smart Irrigation Decisions
```

This helps move the platform beyond disease identification toward broader crop management.

---

# 📡 Integration with IoT Crop Management

AgriSmart uses IoT-based crop and field monitoring to collect relevant field information.

The overall system can combine:

```text
IoT Sensors
    │
    ├── Soil Conditions
    ├── Environmental Data
    └── Field Monitoring
             │
             ▼
      AgriSmart Platform
             │
      ┌──────┴──────┐
      ▼             ▼
Disease Detection  Irrigation
      │             │
      └──────┬──────┘
             ▼
       Crop Management
```

This provides a more comprehensive view of the farmer's field.

---

# 🤝 Integration with Farmer–Buyer Platform

AgriSmart also provides a **Farmer–Buyer Marketplace** that connects farmers with potential buyers.

The overall platform therefore covers multiple stages of agricultural management:

```text
🌱 Crop Management
        ↓
🦠 Disease Detection
        ↓
💧 Irrigation Management
        ↓
🌦️ Weather Monitoring
        ↓
📡 IoT Field Monitoring
        ↓
👨‍🌾 Farmer
        ↓
🤝 Buyer Marketplace
        ↓
🛒 Agricultural Trade
```

---

# 🎯 Role Within AgriSmart

The disease detection module contributes to AgriSmart's goal of creating an integrated digital agriculture platform.

| AgriSmart Feature        | Purpose                             |
| ------------------------ | ----------------------------------- |
| 🌿 AI Disease Detection  | Identify potential plant diseases   |
| 🌱 Organic Treatment     | Provide natural treatment guidance  |
| 🌦️ Weather Forecasting  | Monitor upcoming weather conditions |
| 💧 Irrigation Management | Improve water management            |
| 📡 IoT Crop Management   | Monitor field conditions            |
| 🤝 Farmer–Buyer Platform | Connect farmers with buyers         |

Together, these features create a unified smart agriculture ecosystem.

---

# 🚀 Future Improvements

Potential improvements for the disease detection module include:

* 🌾 Support for additional crops
* 🦠 Detection of more plant diseases
* 📷 Real-time camera-based detection
* 📱 Mobile application integration
* 🎯 Disease severity estimation
* 🌱 More detailed organic treatment recommendations
* 🌦️ Weather-aware disease risk prediction
* 📡 IoT-based disease risk monitoring
* 🗣️ Local-language treatment recommendations
* 🔊 Voice-based agricultural assistance
* 📍 Location-aware crop disease monitoring
* 🤖 AI-powered agricultural advisory
* 📊 Historical disease tracking

---

# ⚠️ Limitations

The AI disease prediction system is intended as an **agricultural assistance tool**.

Prediction quality depends on:

* Image quality
* Lighting conditions
* Dataset quality
* Training data
* Number of supported disease classes
* Model architecture
* Similarity between training and real-world images

Images that differ significantly from the training dataset may result in incorrect predictions.

Organic treatment recommendations should also be considered general guidance and verified against crop-specific and locally appropriate agricultural practices.

---

# 🔐 Git Configuration

The following files should generally remain outside version control:

```text
venv/
.venv/
__pycache__/
.ipynb_checkpoints/
.env
*.pyc
```

---

# 🌱 AgriSmart Vision

AgriSmart aims to bring multiple agricultural technologies together into a single platform.

```text
                    🌾 AGRISMART
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   🌿 Disease       🌦️ Weather       📡 IoT
   Detection        Forecasting      Monitoring
        │                │                │
        ▼                ▼                ▼
   🌱 Organic       💧 Irrigation    🌾 Crop
   Treatment        Management       Management
        │                │                │
        └────────────────┼────────────────┘
                         │
                         ▼
                👨‍🌾 FARMER PLATFORM
                         │
                         ▼
                 🤝 FARMER–BUYER
                    MARKETPLACE
```

---

## 🎯 Project Goal

The goal of this module is to use **AI-powered image classification to help farmers identify potential plant diseases and receive organic treatment guidance**, while integrating the capability into AgriSmart's broader ecosystem of weather forecasting, irrigation management, IoT crop monitoring, and farmer–buyer services.

```text
Detect
   ↓
Understand
   ↓
Treat Organically
   ↓
Monitor
   ↓
Manage
   ↓
Grow Better 🌱
```

---

## 📄 License

This project is developed for educational, research, and project purposes.
