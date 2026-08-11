from django.shortcuts import render
from .forms import SensorForm
from .models import SensorData
import joblib, os

# Load ML model
model_path = os.path.join(
    os.path.dirname(__file__), '..', 'ml_model', 'crop_model.pkl'
)
model = joblib.load(model_path)

def predict_crop(request):
    result = None
    details = None

    if request.method == 'POST':
        form = SensorForm(request.POST)
        if form.is_valid():
            data = [
                form.cleaned_data['temperature'],
                form.cleaned_data['humidity'],
                form.cleaned_data['soil_moisture'],
                form.cleaned_data['ph']
            ]

            # ML prediction
            result = model.predict([data])[0]

            # Save to database
            SensorData.objects.create(
                temperature=data[0],
                humidity=data[1],
                soil_moisture=data[2],
                ph=data[3],
                crop=result
            )

            # Farmer advisory
            crop_advice = {
                "Rice": {
                    "farming": "Prepare leveled field, transplant healthy seedlings, maintain standing water.",
                    "irrigation": "Maintain 2–5 cm water level, drain before harvesting.",
                    "avoid": "Avoid overwatering, excess fertilizer, late transplanting."
                },
                "Wheat": {
                    "farming": "Sow in rows, apply fertilizer in stages, use certified seeds.",
                    "irrigation": "4–5 irrigations at CRI, tillering and flowering stages.",
                    "avoid": "Avoid waterlogging, excess urea, late sowing."
                },
                "Maize": {
                    "farming": "Use raised beds, provide sunlight, apply organic manure.",
                    "irrigation": "Irrigate at knee height and tasseling stages.",
                    "avoid": "Avoid drought stress and dense planting."
                },
                "Potato": {
                    "farming": "Use certified tubers, loose soil, earth up after sprouting.",
                    "irrigation": "Light frequent irrigation, stop before harvest.",
                    "avoid": "Avoid water stagnation and late blight disease."
                },
                "Cotton": {
                    "farming": "Well-drained soil, pest-resistant variety, balanced nutrients.",
                    "irrigation": "Irrigate at flowering and boll formation stages.",
                    "avoid": "Avoid excess water and overuse of pesticides."
                }
            }

            details = crop_advice.get(result)

    else:
        form = SensorForm()

    return render(request, 'predict.html', {
        'form': form,
        'result': result,
        'details': details
    })
