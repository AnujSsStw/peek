import requests

def test_post_generate_batchHtml_unauthorized_without_session():
    base_url = "http://localhost:3000"
    url = f"{base_url}/api/trpc/generate.batchHtml"
    payload = {
        "json": {
            "layouts": ["contextual-hero"],
            "date": "Saturday, March 15",
            "currentTime": "14:00",
            "timezone": "UTC"
        }
    }
    headers = {
        "Content-Type": "application/json"
    }
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=60)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 401, f"Expected HTTP 401, got {response.status_code}"

    try:
        data = response.json()
    except ValueError:
        assert False, "Response is not a valid JSON"

    assert "error" in data, "Response JSON must contain 'error' key"
    error_json = data["error"].get("json")
    assert error_json, "Error JSON object missing in response"

    assert error_json.get("message") == "UNAUTHORIZED", f"Expected error message 'UNAUTHORIZED', got {error_json.get('message')}"
    assert error_json.get("code") == -32001, f"Expected error code -32001, got {error_json.get('code')}"

test_post_generate_batchHtml_unauthorized_without_session()