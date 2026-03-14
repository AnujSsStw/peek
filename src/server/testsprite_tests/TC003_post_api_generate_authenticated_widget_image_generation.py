import requests


def test_post_api_generate_authenticated_widget_image_generation():
    base_url = "http://localhost:3000"

    # Step 1: sign in to get session cookie
    signin_url = base_url + "/api/auth/signin"
    signin_payload = {
        "email": "testuser@example.com",
        "password": "testpassword"
    }

    try:
        signin_response = requests.post(signin_url, json=signin_payload, timeout=30)
    except requests.RequestException as e:
        assert False, f"Signin request to {signin_url} failed with exception: {e}"

    assert signin_response.status_code == 200 or signin_response.status_code == 302, f"Expected status code 200 or 302 from signin but got {signin_response.status_code}"

    # Extract session cookie
    cookies = signin_response.cookies
    assert cookies, "No cookies received from signin"

    # Step 2: use session cookie to call /api/generate
    generate_url = base_url + "/api/generate"

    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    payload = {
        "width": 400,
        "height": 300,
        "layout": "default",
        "date": "2026-03-13",
        "currentTime": "14:30:00",
        "timezone": "America/New_York",
        "location": "New York, NY"
    }

    try:
        response = requests.post(generate_url, json=payload, headers=headers, cookies=cookies, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request to {generate_url} failed with exception: {e}"

    assert response.status_code == 200, f"Expected status code 200 but got {response.status_code}"

    try:
        json_resp = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    assert "url" in json_resp, "Response JSON does not contain 'url' key"
    assert isinstance(json_resp["url"], str) and json_resp["url"], "'url' is not a non-empty string"

    # Optionally, validate the returned URL is reachable and returns an image
    image_url = json_resp["url"]
    try:
        img_response = requests.get(image_url, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request to widget image URL failed with exception: {e}"

    assert img_response.status_code == 200, f"Expected status code 200 from image URL but got {img_response.status_code}"
    content_type = img_response.headers.get("Content-Type", "")
    assert content_type.startswith("image/"), f"Expected image content type but got {content_type}"


test_post_api_generate_authenticated_widget_image_generation()
