import requests

def test_post_api_generate_html_unauthorized_access_returns_401():
    base_url = "http://localhost:3000"
    url = f"{base_url}/api/generate/html"
    payload = {
        "layout": "contextual-hero",
        "date": "Thursday, March 13",
        "currentTime": "13:42",
        "timezone": "UTC",
        "location": "auto:ip"
    }
    headers = {
        "Content-Type": "application/json"
    }
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        assert response.status_code == 401, f"Expected status code 401 but got {response.status_code}"
        json_resp = response.json()
        assert "error" in json_resp, "Response JSON missing 'error' field"
        assert json_resp["error"] == "Authentication required", f"Expected error message 'Authentication required' but got '{json_resp['error']}'"
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

test_post_api_generate_html_unauthorized_access_returns_401()