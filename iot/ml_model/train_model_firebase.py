import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from firebase_config import get_sensor_data_from_firebase

def prepare_data_from_firebase():
    """
    Fetch IoT sensor data from Firebase and prepare it for training
    Expected Firebase structure:
    {
        'sensor_data': {
            'sensor_1': {
                'temperature': 25.5,
                'humidity': 60,
                'soil_moisture': 45,
                'light_intensity': 800,
                'ph': 7.2,
                'crop': 'Rice',
                'timestamp': ...
            },
            ...
        }
    }
    """
    print("Fetching sensor data from Firebase...")
    
    firebase_data = get_sensor_data_from_firebase()
    
    if not firebase_data:
        print("No data found in Firebase. Using CSV dataset as fallback...")
        return pd.read_csv("crop_data.csv")
    
    # Convert Firebase data to DataFrame
    records = []
    for sensor_id, readings in firebase_data.items():
        if isinstance(readings, dict):
            if 'temperature' in readings:  # Individual reading
                records.append(readings)
            else:  # Multiple readings
                for timestamp, reading in readings.items():
                    if isinstance(reading, dict):
                        records.append(reading)
    
    if not records:
        print("No valid records found. Using CSV dataset as fallback...")
        return pd.read_csv("crop_data.csv")
    
    df = pd.DataFrame(records)
    print(f"Loaded {len(df)} records from Firebase")
    
    # Filter to required columns
    required_columns = ['temperature', 'humidity', 'soil_moisture', 'light_intensity', 'ph', 'crop']
    
    # If 'crop' column doesn't exist in Firebase data, use a prediction model or add manual labels
    if 'crop' not in df.columns:
        print("Warning: 'crop' column not found in Firebase data. Please ensure labeled data is stored.")
        print("Expected columns: temperature, humidity, soil_moisture, light_intensity, ph, crop")
        return None
    
    # Keep only required columns
    available_cols = [col for col in required_columns if col in df.columns]
    df = df[available_cols]
    
    # Handle missing values
    df = df.fillna(df.mean())
    
    return df

def train_model():
    """Train model using Firebase IoT sensor data"""
    
    # Prepare data
    data = prepare_data_from_firebase()
    
    if data is None or data.empty:
        print("Error: Could not prepare training data")
        return False
    
    print(f"Training data shape: {data.shape}")
    print(f"Columns: {data.columns.tolist()}")
    
    # Separate features and target
    X = data.drop("crop", axis=1)
    y = data["crop"]
    
    print(f"Features: {X.columns.tolist()}")
    print(f"Crops: {y.unique()}")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    print("Training RandomForest model...")
    model = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=15)
    model.fit(X_train_scaled, y_train)
    
    # Evaluate
    train_score = model.score(X_train_scaled, y_train)
    test_score = model.score(X_test_scaled, y_test)
    
    print(f"Train Accuracy: {train_score:.4f}")
    print(f"Test Accuracy: {test_score:.4f}")
    
    # Save model and scaler
    joblib.dump(model, "crop_model.pkl")
    joblib.dump(scaler, "scaler.pkl")
    
    print("Model and scaler saved successfully!")
    print("\nFeature importance:")
    for feature, importance in zip(X.columns, model.feature_importances_):
        print(f"  {feature}: {importance:.4f}")
    
    return True

if __name__ == "__main__":
    train_model()
