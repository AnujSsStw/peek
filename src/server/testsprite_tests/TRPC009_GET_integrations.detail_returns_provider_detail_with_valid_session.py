import requests

BASE_URL = "http://localhost:3000"
EMAIL = "testsprite-e2e@test.com"
PASSWORD = "TestPass123!"
AUTH_URL = f"{BASE_URL}/api/auth/signin/email"
INTEGRATIONS_DETAIL_PATH = "/api/trpc/integrations.detail"

def test_trpc009_get_integrations_detail_with_valid_session():
    session = requests.Session()
    try:
        # Step 1: Authenticate and capture all set-cookie headers as Cookie header
        auth_payload = {"email": EMAIL, "password": PASSWORD}
        auth_headers = {"Content-Type": "application/json"}
        auth_response = session.post(AUTH_URL, json=auth_payload, headers=auth_headers, timeout=30)
        assert auth_response.status_code == 200, f"Auth failed with status {auth_response.status_code}"

        # Step 2: Prepare POST request to integrations.detail with proper JSON body
        payload = {"provider": "google"}
        headers = {"Content-Type": "application/json"}
        resp = session.post(f"{BASE_URL}{INTEGRATIONS_DETAIL_PATH}", json=payload, headers=headers, timeout=30)
        assert resp.status_code == 200, f"Expected status 200, got {resp.status_code}"

        resp_json = resp.json()
        # Validate response structure and fields
        assert "result" in resp_json, "Missing 'result' in response"
        assert "data" in resp_json["result"], "Missing 'data' in response.result"

        provider_detail = resp_json["result"]["data"]
        for field in ["id", "name", "connected", "sources"]:
            assert field in provider_detail, f"Field '{field}' missing in provider detail"

        # Additional type checks
        assert isinstance(provider_detail["id"], str), "'id' should be a string"
        assert isinstance(provider_detail["name"], str), "'name' should be a string"
        assert isinstance(provider_detail["connected"], bool), "'connected' should be a boolean"
        assert isinstance(provider_detail["sources"], list), "'sources' should be a list"

    finally:
        session.close()

test_trpc009_get_integrations_detail_with_valid_session()
