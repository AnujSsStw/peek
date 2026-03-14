import requests

def test_post_api_screenshot_companion_quote_variants_with_mock_data():
    base_url = "http://localhost:3000"
    endpoint = "/api/screenshot"
    url = base_url + endpoint
    headers = {
        "Content-Type": "application/json"
    }
    variants = ['warm', 'frost']
    layout = 'companion-quote'
    width = 400
    height = 200
    timeout = 30  # seconds

    for variant in variants:
        json_data = {
            "width": width,
            "height": height,
            "layout": layout,
            "variant": variant,
            "useMockData": True
        }
        try:
            response = requests.post(url, headers=headers, json=json_data, timeout=timeout)
        except requests.RequestException as e:
            assert False, f"Request failed for variant '{variant}': {e}"

        assert response.status_code == 200, f"Expected status 200 for variant '{variant}', got {response.status_code}"
        content_type = response.headers.get("Content-Type", "")
        assert "image/png" in content_type, f"Expected 'image/png' in Content-Type for variant '{variant}', got '{content_type}'"
        content_length = len(response.content)
        assert content_length > 100, f"Expected response body length > 100 bytes for variant '{variant}', got {content_length}"

test_post_api_screenshot_companion_quote_variants_with_mock_data()