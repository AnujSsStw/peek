import requests

def test_post_api_generate_html_unauthorized_access():
    base_url = "http://localhost:3000"
    url = f"{base_url}/api/generate/html"
    headers = {
        "Content-Type": "application/json"
    }
    payload = {
        "layout": "default",
        "date": "2026-03-13",
        "currentTime": "12:00:00",
        "timezone": "UTC",
        "location": "New York"
    }

    try:
        # Test without authentication cookie/session
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        assert response.status_code == 401, f"Expected 401 Unauthorized, got {response.status_code}"
    except requests.RequestException as e:
        assert False, f"HTTP request failed: {e}"

test_post_api_generate_html_unauthorized_access()