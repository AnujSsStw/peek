import requests

def test_post_api_generate_unauthorized_access_returns_401():
    base_url = "http://localhost:3000"
    url = f"{base_url}/api/generate"
    headers = {
        "Content-Type": "application/json"
    }
    payload = {
        "width": 400,
        "height": 400,
        "layout": "contextual-hero",
        "date": "Thursday, March 13",
        "currentTime": "13:42",
        "timezone": "UTC",
        "location": "auto:ip"
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 401, f"Expected status code 401, got {response.status_code}"

    try:
        json_response = response.json()
    except ValueError:
        assert False, "Response is not a valid JSON"

    assert isinstance(json_response, dict), "Response JSON is not a dictionary"
    assert "error" in json_response, "'error' field missing in response JSON"
    error_message = json_response["error"]
    assert isinstance(error_message, str), "'error' field is not a string"
    assert "Authentication required" in error_message, f"Expected error message to contain 'Authentication required', got '{error_message}'"


test_post_api_generate_unauthorized_access_returns_401()