import requests

def test_normalizeRange_rejects_invalid_date_strings():
    url = "http://localhost:3000/api/test-helpers"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer q1Jqohp6VVu2MLPVVR1kxFty1eWjTOiD"
    }
    payload = {
        "fn": "normalizeRange",
        "args": {
            "from": "not-a-date",
            "to": "2026-03-16T00:00:00Z"
        }
    }
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"
    assert response.status_code == 400, f"Expected status 400, got {response.status_code}"
    try:
        json_resp = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"
    assert "error" in json_resp, "Response JSON missing 'error' field"
    assert "Invalid time range" in json_resp["error"], f"'Invalid time range' not found in error message: {json_resp['error']}"

test_normalizeRange_rejects_invalid_date_strings()