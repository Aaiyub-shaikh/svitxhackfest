import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib

data = pd.read_csv("crop_data.csv")

X = data.drop("crop", axis=1)
y = data["crop"]

# Create and fit scaler
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42
)

model = RandomForestClassifier()
model.fit(X_train, y_train)

# Save both model and scaler
joblib.dump(model, "crop_model.pkl")
joblib.dump(scaler, "scaler.pkl")
print("Model and scaler trained and saved successfully!")
print(f"Model accuracy: {model.score(X_test, y_test):.2%}")
