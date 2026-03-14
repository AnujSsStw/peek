import requests

def test_trpc010_post_integrations_toggleSource_unauthorized_without_session():
    base_url = "http://localhost:3000"
    url = f"{base_url}/api/trpc/integrations.toggleSource"
    headers = {
        "Content-Type": "application/json"
    }
    payload = {
        "json": {
            "sourceId": "test-source-id",
            "enabled": True
        }
    }
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 401, f"Expected status 401, got {response.status_code}"
    try:
        resp_json = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    assert "error" in resp_json, "Response JSON missing 'error' key"
    error_json = resp_json["error"]
    assert isinstance(error_json, dict), "'error' key is not a dict"
    assert "json" in error_json, "'error' dict missing 'json' key"
    error_detail = error_json["json"]
    assert isinstance(error_detail, dict), "'error.json' is not a dict"
    assert error_detail.get("message") == "UNAUTHORIZED", f"Expected error message 'UNAUTHORIZED', got {error_detail.get('message')}"
    assert error_detail.get("code") == -32001, f"Expected error code -32001, got {error_detail.get('code')}"

test_trpc010_post_integrations_toggleSource_unauthorized_without_session()