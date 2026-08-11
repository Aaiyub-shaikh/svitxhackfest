import requests

# Firebase IoT data URL (Public REST API - no authentication needed)
FIREBASE_IOT_URL = "https://dht-iot-007-default-rtdb.firebaseio.com/Farm.json"

# Default values when sensors are not available
DEFAULT_SENSOR_VALUES = {
    'temperature': 25,
    'humidity': 60,
    'soil_moisture': 50,
    'light_intensity': 800,
    'ph': 7.0
}

def extract_temperature_humidity(data_dict):
    """
    Extract temperature and humidity from different Firebase data formats
    Handles multiple key variations:
    - lowercase: temperature, humidity
    - capitalized: Temperature, Humidity
    - nested objects with sensor IDs
    """
    temp = None
    hum = None
    
    # Case 1: Direct lowercase keys
    if 'temperature' in data_dict and 'humidity' in data_dict:
        temp = data_dict.get('temperature')
        hum = data_dict.get('humidity')
    
    # Case 2: Capitalized keys
    elif 'Temperature' in data_dict and 'Humidity' in data_dict:
        temp = data_dict.get('Temperature')
        hum = data_dict.get('Humidity')
    
    # Case 3: Mixed case
    elif 'temperature' in data_dict and 'Humidity' in data_dict:
        temp = data_dict.get('temperature')
        hum = data_dict.get('Humidity')
    
    elif 'Temperature' in data_dict and 'humidity' in data_dict:
        temp = data_dict.get('Temperature')
        hum = data_dict.get('humidity')
    
    return temp, hum

def get_safe_float(value, default=None):
    """
    Safely convert value to float with default fallback
    """
    try:
        if value is None:
            return default
        return float(value)
    except (ValueError, TypeError):
        return default

def get_sensor_data_from_firebase():
    """
    Fetch real-time IoT sensor data from public Firebase URL
    No authentication needed - public REST API access
    Handles multiple data format variations and missing sensor values
    Supports new Farm.json format with SoilAnalog and LightStatus
    """
    try:
        response = requests.get(FIREBASE_IOT_URL, timeout=5)
        response.raise_for_status()
        data = response.json()
        
        if not data:
            return []
        
        readings = []
        
        # If data is a dict, parse it
        if isinstance(data, dict):
            # Check if it's direct keys (Case 1 & 2) - Most common format
            temp, hum = extract_temperature_humidity(data)
            
            if temp is not None and hum is not None:
                # Direct format from your friend's IoT
                
                # Handle soil moisture - check for SoilAnalog (new Farm format)
                soil_moisture = data.get('soil_moisture', data.get('Soil_Moisture', data.get('SoilAnalog')))
                
                # Convert SoilAnalog to percentage (assuming 0-1024 ADC range)
                if soil_moisture and isinstance(soil_moisture, (int, float)):
                    if soil_moisture > 100:  # It's an ADC value, convert to percentage
                        soil_moisture = (soil_moisture / 1024) * 100
                
                # Handle light intensity - check for LightStatus
                light_intensity = data.get('light_intensity', data.get('Light_Intensity'))
                light_status = data.get('LightStatus', '')
                if not light_intensity:
                    # Convert LightStatus to light intensity value
                    if 'BRIGHT' in str(light_status).upper():
                        light_intensity = 1200
                    elif 'DARK' in str(light_status).upper():
                        light_intensity = 200
                    else:
                        light_intensity = DEFAULT_SENSOR_VALUES['light_intensity']
                
                sensor_reading = {
                    'sensor_id': data.get('sensor_id', 'Farm_IoT'),
                    'temperature': get_safe_float(temp, DEFAULT_SENSOR_VALUES['temperature']),
                    'humidity': get_safe_float(hum, DEFAULT_SENSOR_VALUES['humidity']),
                    'soil_moisture': get_safe_float(soil_moisture, DEFAULT_SENSOR_VALUES['soil_moisture']),
                    'light_intensity': get_safe_float(light_intensity, DEFAULT_SENSOR_VALUES['light_intensity']),
                    'ph': get_safe_float(data.get('ph', data.get('pH', data.get('Ph'))), DEFAULT_SENSOR_VALUES['ph'])
                }
                readings.append(sensor_reading)
            else:
                # Case 3: Nested format with sensor IDs as keys (for multiple sensors)
                for key, value in data.items():
                    if isinstance(value, dict):
                        # Try to extract temp/hum from nested object
                        temp, hum = extract_temperature_humidity(value)
                        
                        if temp is not None and hum is not None:
                            # Handle soil moisture
                            soil_moisture = value.get('soil_moisture', value.get('Soil_Moisture', value.get('SoilAnalog')))
                            if soil_moisture and isinstance(soil_moisture, (int, float)):
                                if soil_moisture > 100:
                                    soil_moisture = (soil_moisture / 1024) * 100
                            
                            # Handle light intensity
                            light_intensity = value.get('light_intensity', value.get('Light_Intensity'))
                            light_status = value.get('LightStatus', '')
                            if not light_intensity:
                                if 'BRIGHT' in str(light_status).upper():
                                    light_intensity = 1200
                                elif 'DARK' in str(light_status).upper():
                                    light_intensity = 200
                                else:
                                    light_intensity = DEFAULT_SENSOR_VALUES['light_intensity']
                            
                            sensor_reading = {
                                'sensor_id': key,
                                'temperature': get_safe_float(temp, DEFAULT_SENSOR_VALUES['temperature']),
                                'humidity': get_safe_float(hum, DEFAULT_SENSOR_VALUES['humidity']),
                                'soil_moisture': get_safe_float(soil_moisture, DEFAULT_SENSOR_VALUES['soil_moisture']),
                                'light_intensity': get_safe_float(light_intensity, DEFAULT_SENSOR_VALUES['light_intensity']),
                                'ph': get_safe_float(value.get('ph', value.get('pH', value.get('Ph'))), DEFAULT_SENSOR_VALUES['ph'])
                            }
                            readings.append(sensor_reading)
        
        return readings if readings else []
        
    except Exception as e:
        print(f"Error fetching data from Firebase: {e}")
        return []
