import requests
import urllib.parse

BASE_URL = "http://localhost:3000"
AUTH_URL = f"{BASE_URL}/api/auth/sign-in/email"
INTEGRATIONS_LIST_URL = f"{BASE_URL}/api/trpc/integrations.list"
TIMEOUT = 30


def test_trpc007_get_integrations_list_authenticated():
    auth_payload = {"email": "testsprite-e2e@test.com", "password": "TestPass123!"}
    try:
        # Authenticate and get session cookies
        auth_resp = requests.post(AUTH_URL, json=auth_payload, timeout=TIMEOUT)
        assert auth_resp.status_code == 200, f"Auth failed with status {auth_resp.status_code}"
        # Capture all set-cookie headers
        set_cookie_headers = auth_resp.headers.get("set-cookie")
        assert set_cookie_headers, "No set-cookie header in auth response"
        # There could be multiple cookies separated by comma if combined; requests splits into multiple headers,
        # but here we handle single string or split on commas carefully.
        # Best to get cookies from response.cookies and construct cookie header from that:
        cookies_jar = auth_resp.cookies
        cookie_header = "; ".join([f"{c.name}={c.value}" for c in cookies_jar])

        headers = {
            "Cookie": cookie_header
        }

        # Send GET request to integrations.list with auth cookies
        integrations_resp = requests.get(INTEGRATIONS_LIST_URL, headers=headers, timeout=TIMEOUT)
        assert integrations_resp.status_code == 200, f"Integrations list failed with status {integrations_resp.status_code}"

        integrations_json = integrations_resp.json()
        # Check response structure: {"result": {"data": {"json": [...]}}}
        assert "result" in integrations_json, "Missing 'result' in response"
        result = integrations_json["result"]
        assert "data" in result, "Missing 'data' in result"
        data = result["data"]
        assert "json" in data, "Missing 'json' in data"

        providers = data["json"]
        assert isinstance(providers, list), "Providers is not a list"

        for provider in providers:
            assert isinstance(provider, dict), "Provider item is not a dict"
            # Check required keys and types
            assert "id" in provider and isinstance(provider["id"], str), "'id' missing or not a string"
            assert "name" in provider and isinstance(provider["name"], str), "'name' missing or not a string"
            assert "icon" in provider and isinstance(provider["icon"], str), "'icon' missing or not a string"
            assert "connected" in provider and isinstance(provider["connected"], bool), "'connected' missing or not a bool"
            assert "sources" in provider and isinstance(provider["sources"], list), "'sources' missing or not a list"

    except Exception as e:
        raise e


test_trpc007_get_integrations_list_authenticated()