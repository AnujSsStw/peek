import requests
import urllib.parse

BASE_URL = "http://localhost:3000"
AUTH_SIGNIN_PATH = "/api/auth/sign-in/email"
VIEWER_ME_PATH = "/api/trpc/viewer.me"
TIMEOUT = 30

def test_TRPC005_get_viewer_me_returns_user_profile_with_valid_session():
    session_cookies = None
    try:
        # Step 1: Authenticate and get session cookie(s)
        signin_url = BASE_URL + AUTH_SIGNIN_PATH
        auth_payload = {
            "email": "testsprite-e2e@test.com",
            "password": "TestPass123!"
        }
        headers = {"Content-Type": "application/json"}

        auth_response = requests.post(signin_url, json=auth_payload, headers=headers, timeout=TIMEOUT)
        assert auth_response.status_code == 200, f"Authentication failed with status {auth_response.status_code}"

        # Capture all set-cookie headers and assemble Cookie header for next request
        set_cookie_headers = auth_response.headers.get('set-cookie')
        assert set_cookie_headers is not None, "No set-cookie header returned in auth response"
        # requests merges multiple Set-Cookie headers into a comma separated string
        # split on comma, then join cookies semicolon separated to build Cookie header
        # But commas can appear in cookie values. Safer to get all cookies from auth_response.cookies
        cookies_jar = auth_response.cookies
        cookie_header = "; ".join([f"{c.name}={c.value}" for c in cookies_jar])
        assert cookie_header, "No cookies parsed from auth response"

        # Step 2: Send GET request to /api/trpc/viewer.me with session cookie
        # According to instructions, tRPC queries use GET and no input param for viewer.me
        viewer_me_url = BASE_URL + VIEWER_ME_PATH
        get_headers = {
            "Cookie": cookie_header,
        }
        response = requests.get(viewer_me_url, headers=get_headers, timeout=TIMEOUT)
        assert response.status_code == 200, f"viewer.me request failed with status {response.status_code}"

        # Validate tRPC response format: {"result": {"data": {"json": {id, name, email, image}}}}
        data = response.json()
        assert "result" in data, "Response missing 'result'"
        assert "data" in data["result"], "Response result missing 'data'"
        assert "json" in data["result"]["data"], "Response data missing 'json'"

        profile = data["result"]["data"]["json"]
        assert isinstance(profile, dict), "Profile is not a dictionary"
        # Required fields: id (string), name = "Test User", email = "testsprite-e2e@test.com", image (any)
        assert "id" in profile and isinstance(profile["id"], str) and profile["id"], "Missing or invalid 'id'"
        assert profile.get("name") == "Test User", f"Unexpected name: {profile.get('name')}"
        assert profile.get("email") == "testsprite-e2e@test.com", f"Unexpected email: {profile.get('email')}"
        assert "image" in profile, "Missing 'image' field"

    except requests.RequestException as e:
        assert False, f"RequestException during test execution: {e}"

test_TRPC005_get_viewer_me_returns_user_profile_with_valid_session()