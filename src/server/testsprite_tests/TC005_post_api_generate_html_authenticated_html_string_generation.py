import requests


def test_post_api_generate_html_authenticated():
    base_url = "http://localhost:3000"
    endpoint = "/api/generate/html"
    url = base_url + endpoint
    token = "q1Jqohp6VVu2MLPVVR1kxFty1eWjTOiD"
    headers = {
        "Content-Type": "application/json",
        "Accept": "text/html",
        "Cookie": f"session={token}"
    }
    payload = {
        "layout": "default",
        "date": "2026-03-13",
        "currentTime": "14:00:00",
        "timezone": "UTC",
        "location": "New York, NY"
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 200, f"Expected status 200, got {response.status_code}"
    content_type = response.headers.get("Content-Type", "")
    assert content_type.startswith("text/html"), f"Expected content-type starting with 'text/html', got '{content_type}'"
    assert isinstance(response.text, str) and len(response.text) > 0, "Response HTML string is empty"


test_post_api_generate_html_authenticated()
