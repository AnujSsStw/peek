import requests

def test_post_api_screenshot_daily_score_variants_with_mock_data():
    base_url = "http://localhost:3000"
    endpoint = "/api/screenshot"
    url = base_url + endpoint
    headers = {
        "Content-Type": "application/json"
    }
    variants = ['dark', 'light']
    layout = 'daily-score'
    width = 400
    height = 200
    timeout = 30  # seconds

    for variant in variants:
        payload = {
            "width": width,
            "height": height,
            "layout": layout,
            "variant": variant,
            "useMockData": True
        }
        try:
            response = requests.post(url, json=payload, headers=headers, timeout=timeout)
        except requests.RequestException as e:
            assert False, f"Request for variant '{variant}' failed with exception: {e}"

        assert response.status_code == 200, f"Expected status 200 for variant '{variant}', got {response.status_code}"
        content_type = response.headers.get("Content-Type", "")
        assert "image/png" in content_type, f"Expected Content-Type to contain 'image/png' for variant '{variant}', got '{content_type}'"
        assert response.content and len(response.content) > 100, f"Response body too short or empty for variant '{variant}'"

test_post_api_screenshot_daily_score_variants_with_mock_data()