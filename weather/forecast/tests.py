from django.test import TestCase, Client

class WeatherAPITest(TestCase):
    def setUp(self):
        self.client = Client()

    def test_missing_params(self):
        resp = self.client.get('/api/weather/')
        self.assertEqual(resp.status_code, 400)

# Note: External API calls are not mocked here; for CI, add mocks to avoid hitting OpenWeather.