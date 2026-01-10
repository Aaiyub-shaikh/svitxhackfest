import joblib

# Load model and encoder
model = joblib.load("irrigation_model.pkl")
le_crop = joblib.load("crop_encoder.pkl")

def predict_irrigation(crop, land_size, days, temp, humidity, rainfall):
    crop_encoded = le_crop.transform([crop])[0]

    input_data = [[
        crop_encoded,
        land_size,
        days,
        temp,
        humidity,
        rainfall
    ]]

    prediction = model.predict(input_data)[0]

    return "Irrigation Required" if prediction == 1 else "No Irrigation Needed"

# Test prediction
result = predict_irrigation(
    crop="Rice",
    land_size=2,
    days=30,
    temp=33,
    humidity=60,
    rainfall=2
)

print("🌱 Prediction:", result)
