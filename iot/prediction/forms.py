from django import forms

class SensorForm(forms.Form):
    temperature = forms.FloatField()
    humidity = forms.FloatField()
    soil_moisture = forms.FloatField()
    ph = forms.FloatField()
