import requests
import urllib.parse

BASE_URL = "http://localhost:3000"
AUTH_SIGNIN_PATH = "/api/auth/sign-in/email"
META_HEALTH_PATH = "/api/trpc/meta.health"
TIMEOUT = 30

def test_trpc002_get_meta_health_authenticated_true_with_session():
    session_cookies = None
    try:
        # Step 1: Authenticate and get the set-cookie headers
        signin_url = f"{BASE_URL}{AUTH_SIGNIN_PATH}"
        signin_payload = {
            "email": "testsprite-e2e@test.com",
            "password": "TestPass123!"
        }
        headers = {"Content-Type": "application/json"}
        signin_response = requests.post(signin_url, json=signin_payload, headers=headers, timeout=TIMEOUT)
        assert signin_response.status_code == 200, f"Sign-in failed with status {signin_response.status_code}"
        
        # Extract all set-cookie headers and combine them into a single cookie header
        set_cookie_headers = signin_response.headers.getlist("set-cookie") if hasattr(signin_response.headers, "getlist") else signin_response.headers.get("set-cookie")
        # requests.Headers does not have getlist, so workaround:
        raw_set_cookie = signin_response.headers.get_all("set-cookie") if hasattr(signin_response.headers, "get_all") else None
        if raw_set_cookie is not None:
            cookies_list = raw_set_cookie
        elif isinstance(set_cookie_headers, str):
            cookies_list = [set_cookie_headers]
        elif isinstance(set_cookie_headers, list):
            cookies_list = set_cookie_headers
        else:
            cookies_list = []
        # Parse cookies to Cookie header string
        cookie_pairs = []
        for cookie_str in cookies_list:
            # Cookie string like: key=value; Path=/; HttpOnly; Secure; SameSite=...
            # We want just key=value
            parts = cookie_str.split(";")
            if parts:
                cookie_pairs.append(parts[0].strip())
        cookie_header = "; ".join(cookie_pairs)
        assert cookie_header, "Failed to extract cookies from sign-in response"

        # Step 2: Call GET /api/trpc/meta.health with session cookie attached
        meta_health_url = f"{BASE_URL}{META_HEALTH_PATH}"
        # According to instructions, meta.health is a GET query without input, so call URL directly
        headers = {
            "Cookie": cookie_header
        }
        resp = requests.get(meta_health_url, headers=headers, timeout=TIMEOUT)
        assert resp.status_code == 200, f"meta.health status code {resp.status_code}"

        data = resp.json()
        # Validate tRPC response format with success
        assert "result" in data, "Response missing 'result'"
        assert "data" in data["result"], "Response missing 'result.data'"
        assert "json" in data["result"]["data"], "Response missing 'result.data.json'"
        json_payload = data["result"]["data"]["json"]
        assert isinstance(json_payload, dict), "'json' field is not a dict"
        assert json_payload.get("ok") is True, "'ok' field is not True"
        assert json_payload.get("authenticated") is True, "'authenticated' field is not True"
    except requests.RequestException as e:
        raise AssertionError(f"Request failed: {e}")

test_trpc002_get_meta_health_authenticated_true_with_session()