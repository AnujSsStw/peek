import requests

def test_post_api_generate_unauthorized_access():
    base_url = "http://localhost:3000"
    url = f"{base_url}/api/generate"
    payload = {
        "width": 300,
        "height": 400,
        "layout": "default",
        "date": "2026-03-13",
        "currentTime": "12:00:00",
        "timezone": "UTC",
        "location": "New York"
    }
    headers = {
        "Content-Type": "application/json"
        # No Authorization header to simulate unauthorized access
    }
    timeout = 30
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=timeout)
    except requests.RequestException as e:
        raise AssertionError(f"Request failed: {e}")

    assert response.status_code == 401, f"Expected 401 Unauthorized, got {response.status_code}"
    # Optional: check error message shape if JSON returned
    try:
        error_response = response.json()
        assert "error" in error_response or "message" in error_response, "Expected error message in response"
    except ValueError:
        # Response is not JSON - that's acceptable if 401
        pass

test_post_api_generate_unauthorized_access()