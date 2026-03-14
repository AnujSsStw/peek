import requests
from urllib.parse import urlencode

def test_trpc004_get_viewer_me_unauthorized_without_session():
    base_url = "http://localhost:3000"
    url = f"{base_url}/api/trpc/viewer.me"
    timeout = 30

    try:
        response = requests.get(url, timeout=timeout)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    # The HTTP status should be 401 Unauthorized
    assert response.status_code == 401, f"Expected status code 401, got {response.status_code}"

    try:
        json_response = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    # Response should have an error field with a json subfield that has message 'UNAUTHORIZED'
    assert "error" in json_response, "Response JSON missing 'error' field"
    error_obj = json_response["error"]
    assert isinstance(error_obj, dict), "'error' field is not a dict"
    assert "json" in error_obj, "'error' field missing 'json' subfield"
    error_json = error_obj["json"]
    assert isinstance(error_json, dict), "'error.json' is not a dict"
    assert error_json.get("message") == "UNAUTHORIZED", f"Expected error message 'UNAUTHORIZED', got {error_json.get('message')}"

test_trpc004_get_viewer_me_unauthorized_without_session()