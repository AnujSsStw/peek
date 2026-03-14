import requests

BASE_URL = "http://localhost:3000"
TIMEOUT = 30

def test_post_api_auth_signin_with_google_oauth():
    url = f"{BASE_URL}/api/auth/signin"
    payload = {
        "code": "q1Jqohp6VVu2MLPVVR1kxFty1eWjTOiD"
    }
    headers = {
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=TIMEOUT, allow_redirects=False)
    except requests.RequestException as e:
        assert False, f"Request failed with exception: {e}"

    # Assert status code is either 200 or 302
    assert response.status_code in (200, 302), f"Unexpected status code: {response.status_code}"

    # Check presence of session cookie in response headers
    cookies = response.cookies
    session_cookie = None
    for cookie in cookies:
        if cookie.name.lower().find("session") != -1:
            session_cookie = cookie
            break

    # Alternatively check Set-Cookie header existence for session cookies
    if not session_cookie:
        set_cookie_header = response.headers.get("Set-Cookie", "")
        assert "session" in set_cookie_header.lower(), "Session cookie not found in response headers"


test_post_api_auth_signin_with_google_oauth()
