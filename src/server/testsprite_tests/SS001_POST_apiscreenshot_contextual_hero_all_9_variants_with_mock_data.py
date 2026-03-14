import requests

def test_post_api_screenshot_contextual_hero_all_variants_with_mock_data():
    base_url = "http://localhost:3000"
    url = f"{base_url}/api/screenshot"
    headers = {
        "Content-Type": "application/json"
    }
    variants = ['morning', 'urgent', 'night', 'focus', 'alert', 'calm', 'weather', 'energy', 'eink']
    layout = 'contextual-hero'
    width = 400
    height = 400
    timeout = 30

    for variant in variants:
        json_payload = {
            "width": width,
            "height": height,
            "layout": layout,
            "variant": variant,
            "useMockData": True
        }
        try:
            response = requests.post(url, headers=headers, json=json_payload, timeout=timeout)
        except requests.RequestException as e:
            assert False, f"Request failed for variant '{variant}': {e}"

        assert response.status_code == 200, f"Expected status code 200 for variant '{variant}', got {response.status_code}"
        content_type = response.headers.get("content-type", "")
        assert 'image/png' in content_type.lower(), f"Expected 'image/png' in content-type for variant '{variant}', got '{content_type}'"
        content_length = len(response.content)
        assert content_length > 100, f"Expected response body length > 100 bytes for variant '{variant}', got {content_length}"

test_post_api_screenshot_contextual_hero_all_variants_with_mock_data()