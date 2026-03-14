import requests

def test_post_api_screenshot_validation_error_invalid_layout():
    base_url = "http://localhost:3000"
    url = f"{base_url}/api/screenshot"
    headers = {
        "Authorization": "Bearer q1Jqohp6VVu2MLPVVR1kxFty1eWjTOiD",
        "Content-Type": "application/json"
    }
    payload = {
        "width": 400,
        "height": 400,
        "layout": "nonexistent-layout",
        "variant": "test"
    }
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 400, f"Expected status code 400, got {response.status_code}"

    try:
        json_data = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    assert "error" in json_data, "Response JSON does not contain 'error' field"
    assert "Invalid layout" in json_data["error"], f"Error message does not mention 'Invalid layout', got: {json_data['error']}"

test_post_api_screenshot_validation_error_invalid_layout()