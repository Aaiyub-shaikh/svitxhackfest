from django.http import HttpResponse


def home(request):
    """Simple informative homepage for the weather microservice.

    This prevents the 404 at `/` and gives a quick link to the API
    with example coordinates for local testing.
    """
    html = """
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Weather microservice</title>
        <style>
          body { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Arial; padding: 2rem; }
          code { background:#f3f4f6; padding:4px 6px; border-radius:4px }
        </style>
      </head>
      <body>
        <h1>Weather microservice</h1>
        <p>This service exposes a single API endpoint:</p>
        <ul>
          <li><code>/api/weather/?lat=&lt;latitude&gt;&amp;lon=&lt;longitude&gt;</code></li>
        </ul>
        <p>Example test request:</p>
        <p><a href="/api/weather/?lat=28.7041&lon=77.1025">/api/weather/?lat=28.7041&amp;lon=77.1025</a></p>
        <p>If you see a 502 or 401 from the external provider, the service will return a sample response in local DEBUG mode.</p>
      </body>
    </html>
    """
    return HttpResponse(html)
