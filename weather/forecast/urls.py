from django.urls import path
from . import views

urlpatterns = [
    # GET /api/weather/?lat=<>&lon=<>  (as required)
    path('', views.weather, name='weather'),
]
