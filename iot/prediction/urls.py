from django.urls import path
from django.views.generic import RedirectView
from .views import predict_crop
from .firebase_views import (
    predict_from_sensors,
    get_live_prediction
)

urlpatterns = [
    # Auto-redirect base URL to firebase-predict (the auto-fetch page)
    path('', RedirectView.as_view(url='firebase-predict/', permanent=False), name='home'),
    
    # Firebase prediction endpoints (NEW - this is what users see)
    path('firebase-predict/', predict_from_sensors, name='firebase_predict'),
    path('api/live-prediction/', get_live_prediction, name='get_live_prediction'),
    
    # Manual form (kept for reference but not shown by default)
    path('manual-predict/', predict_crop, name='predict'),
]
