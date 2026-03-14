import requests

BASE_URL = "http://localhost:3000"
ENDPOINT = "/api/screenshot"
TIMEOUT = 30

def test_post_api_screenshot_timeline_all_variants_with_mock_data():
    variants = ['light', 'dark', 'emerald', 'amber', 'eink']
    headers = {
        'Content-Type': 'application/json',
    }
    for variant in variants:
        payload = {
            "width": 400,
            "height": 400,
            "layout": "timeline",
            "variant": variant,
            "useMockData": True
        }
        try:
            response = requests.post(
                BASE_URL + ENDPOINT,
                json=payload,
                headers=headers,
                timeout=TIMEOUT
            )
        except requests.RequestException as e:
            raise AssertionError(f"Request failed for variant '{variant}': {e}")

        assert response.status_code == 200, f"Expected status 200 for variant '{variant}', got {response.status_code}"
        content_type = response.headers.get('Content-Type', '')
        assert 'image/png' in content_type, f"Expected Content-Type containing 'image/png' for variant '{variant}', got '{content_type}'"
        response_length = len(response.content)
        assert response_length > 100, f"Response body length {response_length} bytes too small for variant '{variant}'"

test_post_api_screenshot_timeline_all_variants_with_mock_data()