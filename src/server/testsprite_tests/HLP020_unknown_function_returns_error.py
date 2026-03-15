import requests

def test_HLP020_unknown_function_returns_error():
    url = "http://localhost:3000/api/test-helpers"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer q1Jqohp6VVu2MLPVVR1kxFty1eWjTOiD"
    }
    payload = {
        "fn": "nonExistentFunction",
        "args": {}
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 400, f"Expected status 400, got {response.status_code}"

    try:
        resp_json = response.json()
    except ValueError:
        assert False, "Response is not a valid JSON"

    assert "error" in resp_json, "Response JSON missing 'error' field"
    assert "Unknown function" in resp_json["error"], f"Error message does not contain 'Unknown function': {resp_json['error']}"

test_HLP020_unknown_function_returns_error()