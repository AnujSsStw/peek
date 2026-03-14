import requests

def test_post_integrations_disconnect_returns_unauthorized_without_session():
    base_url = "http://localhost:3000"
    url = f"{base_url}/api/trpc/integrations.disconnect"
    payload = {"json": {"provider": "google"}}
    headers = {
        "Content-Type": "application/json"
    }
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 401, f"Expected status code 401 but got {response.status_code}"

    try:
        resp_json = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    assert "error" in resp_json, "Response JSON does not contain 'error'"
    error_json = resp_json.get("error", {}).get("json", {})
    assert error_json.get("message") == "UNAUTHORIZED", f"Expected error message 'UNAUTHORIZED', got {error_json.get('message')}"
    assert error_json.get("code") == -32001, f"Expected error code -32001, got {error_json.get('code')}"

test_post_integrations_disconnect_returns_unauthorized_without_session()