import requests
import json
import re

BASE_URL = "http://localhost:3000"
AUTH_URL = f"{BASE_URL}/api/auth/sign-in/email"
BATCH_HTML_URL = f"{BASE_URL}/api/trpc/generate.batchHtml"

EMAIL = "testsprite-e2e@test.com"
PASSWORD = "TestPass123!"

def test_generate_batchHtml_returns_html_with_valid_session():
    # Step 1: Authenticate and get session cookies
    auth_payload = {"email": EMAIL, "password": PASSWORD}
    try:
        auth_response = requests.post(
            AUTH_URL,
            json=auth_payload,
            timeout=30
        )
        assert auth_response.status_code == 200, f"Auth failed with status {auth_response.status_code}"
        # Collect all set-cookie headers
        cookies = auth_response.cookies.get_dict()
        cookie_header = "; ".join(f"{k}={v}" for k,v in cookies.items())
        assert cookie_header, "No cookies received from auth response"
    except requests.RequestException as e:
        raise AssertionError(f"Auth request failed: {str(e)}")
    
    # Step 2: Call generate.batchHtml with session cookie and request body
    batch_html_payload = {
        "json": {
            "layouts": ["contextual-hero", "bento-box"],
            "date": "Saturday, March 15",
            "currentTime": "14:00",
            "timezone": "UTC"
            # Location is optional based on PRD, omitted here since not in test case
        }
    }
    headers = {
        "Content-Type": "application/json",
        "Cookie": cookie_header
    }

    try:
        response = requests.post(
            BATCH_HTML_URL,
            json=batch_html_payload,
            headers=headers,
            timeout=60
        )
    except requests.RequestException as e:
        raise AssertionError(f"generate.batchHtml request failed: {str(e)}")

    # Step 3: Validate response status and structure
    assert response.status_code == 200, f"Expected status 200 but got {response.status_code}"

    try:
        data = response.json()
    except json.JSONDecodeError:
        raise AssertionError("Response is not valid JSON")

    assert "result" in data, "Missing 'result' in response"
    assert "data" in data["result"], "Missing 'data' in response.result"
    assert "json" in data["result"]["data"], "Missing 'json' in response.result.data"

    json_data = data["result"]["data"]["json"]
    assert isinstance(json_data, dict), f"Expected json to be a dict but was {type(json_data)}"
    
    # Must contain keys 'contextual-hero' and 'bento-box'
    for key in ["contextual-hero", "bento-box"]:
        assert key in json_data, f"Missing key '{key}' in response data"
        html_str = json_data[key]
        assert isinstance(html_str, str), f"Expected HTML string for '{key}', got {type(html_str)}"
        # Check HTML content includes <html> or <div> (case insensitive)
        if not re.search(r"<(html|div)[ >]", html_str, re.IGNORECASE):
            raise AssertionError(f"The HTML string for '{key}' does not contain expected HTML tags")

test_generate_batchHtml_returns_html_with_valid_session()