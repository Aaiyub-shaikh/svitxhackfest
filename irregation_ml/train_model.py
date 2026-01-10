import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
import joblib

# Load dataset
df = pd.read_csv("dataset.csv")

# Encode crop names
le_crop = LabelEncoder()
df["crop"] = le_crop.fit_transform(df["crop"])

# Features and target
X = df.drop("irrigation_needed", axis=1)
y = df["irrigation_needed"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save model and encoder
joblib.dump(model, "irrigation_model.pkl")
joblib.dump(le_crop, "crop_encoder.pkl")

print("✅ Irrigation ML model trained and saved successfully")
