from django.db import models

class SensorData(models.Model):
    temperature = models.FloatField()
    humidity = models.FloatField()
    soil_moisture = models.FloatField()
    ph = models.FloatField()
    crop = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
