import requests

def test_resolveGoogleBoundary_null_input_returns_null():
    url = "http://localhost:3000/api/test-helpers"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer q1Jqohp6VVu2MLPVVR1kxFty1eWjTOiD"
    }
    json_data = {
        "fn": "resolveGoogleBoundary",
        "args": None
    }
    try:
        response = requests.post(url, headers=headers, json=json_data, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 200, f"Expected status 200, got {response.status_code}"
    try:
        response_json = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    assert "result" in response_json, "Response JSON missing 'result' key"
    assert response_json["result"] is None, f"Expected result to be None, got {response_json['result']}"

test_resolveGoogleBoundary_null_input_returns_null()