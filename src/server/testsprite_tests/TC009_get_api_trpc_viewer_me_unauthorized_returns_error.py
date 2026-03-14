import requests

def test_get_api_trpc_viewer_me_unauthorized_returns_error():
    url = "http://localhost:3000/api/trpc/viewer.me"
    headers = {
        # No authentication headers or cookies
        "Accept": "application/json"
    }
    try:
        response = requests.get(url, headers=headers, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request failed with exception: {e}"

    assert response.status_code == 401, f"Expected status code 401, got {response.status_code}"

    try:
        json_resp = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    # The response format should be {error: {json: {message: 'UNAUTHORIZED', code: ...}}}
    assert "error" in json_resp, "Response JSON does not contain 'error' field"
    error_obj = json_resp["error"]
    assert isinstance(error_obj, dict), "'error' field is not an object"

    assert "json" in error_obj, "'error' object does not contain 'json' field"
    json_error = error_obj["json"]
    assert isinstance(json_error, dict), "'json' field inside 'error' is not an object"

    assert json_error.get("message") == "UNAUTHORIZED", f"Error message expected 'UNAUTHORIZED', got: {json_error.get('message')}"
    assert "code" in json_error, "'code' field is missing in error json"

test_get_api_trpc_viewer_me_unauthorized_returns_error()