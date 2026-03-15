import requests

def test_resolveGoogleBoundary_with_empty_object_returns_null():
    url = "http://localhost:3000/api/test-helpers"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer q1Jqohp6VVu2MLPVVR1kxFty1eWjTOiD"
    }
    json_data = {
        "fn": "resolveGoogleBoundary",
        "args": {
            "date": None,
            "dateTime": None
        }
    }
    try:
        response = requests.post(url, json=json_data, headers=headers, timeout=30)
        assert response.status_code == 200, f"Expected status 200 but got {response.status_code}"
        data = response.json()
        assert "result" in data, "Response JSON missing 'result' field"
        assert data["result"] is None, f"Expected result to be null but got {data['result']}"
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

test_resolveGoogleBoundary_with_empty_object_returns_null()