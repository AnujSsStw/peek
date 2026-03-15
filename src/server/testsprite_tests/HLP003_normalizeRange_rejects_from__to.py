import requests

def test_normalizeRange_rejects_from_gte_to():
    url = "http://localhost:3000/api/test-helpers"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer q1Jqohp6VVu2MLPVVR1kxFty1eWjTOiD"
    }
    payload = {
        "fn": "normalizeRange",
        "args": {
            "from": "2026-03-16T00:00:00Z",
            "to": "2026-03-15T00:00:00Z"
        }
    }
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 400, f"Expected status 400 but got {response.status_code}"

    try:
        response_json = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    assert "error" in response_json, "Response JSON does not contain 'error' field"
    error_msg = response_json["error"]
    assert isinstance(error_msg, str), "'error' field is not a string"
    assert "from" in error_msg.lower(), "'error' message does not contain 'from'"
    assert "before" in error_msg.lower(), "'error' message does not contain 'before'"

test_normalizeRange_rejects_from_gte_to()