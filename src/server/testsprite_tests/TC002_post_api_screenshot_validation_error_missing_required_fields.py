import requests

def test_post_api_screenshot_validation_error_missing_required_fields():
    base_url = "http://localhost:3000"
    url = f"{base_url}/api/screenshot"
    headers = {
        "Authorization": "Bearer q1Jqohp6VVu2MLPVVR1kxFty1eWjTOiD",
        "Content-Type": "application/json"
    }
    timeout = 30

    try:
        response = requests.post(url, headers=headers, json={}, timeout=timeout)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 400, f"Expected status code 400 but got {response.status_code}"
    try:
        json_data = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    assert isinstance(json_data, dict), "Response JSON is not an object"
    assert 'error' in json_data, "'error' field not found in JSON response"

test_post_api_screenshot_validation_error_missing_required_fields()