from django.urls import path, include
from .views import home


urlpatterns = [
    # Add a simple homepage so the root path does not produce a 404
    path('', home, name='home'),
    # The single endpoint will be available at /api/weather/?lat=&lon=
    path('api/weather/', include('forecast.urls')),
]
