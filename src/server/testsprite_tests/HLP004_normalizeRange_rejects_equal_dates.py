import requests

def test_normalizeRange_rejects_equal_dates():
    base_url = "http://localhost:3000"
    url = f"{base_url}/api/test-helpers"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer q1Jqohp6VVu2MLPVVR1kxFty1eWjTOiD"
    }
    json_data = {
        "fn": "normalizeRange",
        "args": {
            "from": "2026-03-15T00:00:00Z",
            "to": "2026-03-15T00:00:00Z"
        }
    }
    try:
        response = requests.post(url, json=json_data, headers=headers, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 400, f"Expected status 400 but got {response.status_code}"
    try:
        resp_json = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    assert "error" in resp_json, "Response JSON does not have 'error' field"
    error_msg = resp_json["error"]
    assert "before" in error_msg, f"Error message does not contain 'before': {error_msg}"

test_normalizeRange_rejects_equal_dates()