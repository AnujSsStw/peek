import requests

def test_post_api_screenshot_bento_box_all_variants_with_mock_data():
    base_url = "http://localhost:3000"
    endpoint = "/api/screenshot"
    url = base_url + endpoint
    headers = {
        "Content-Type": "application/json"
    }
    variants = ['frost', 'cream', 'charcoal', 'ocean', 'neon', 'eink']
    layout = "bento-box"
    width = 400
    height = 200
    timeout = 30

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
            raise AssertionError(f"Request for variant '{variant}' failed with exception: {e}")

        # Check status code
        assert response.status_code == 200, f"Expected status 200, got {response.status_code} for variant '{variant}'. Response text: {response.text}"

        # Check content type header contains 'image/png'
        content_type = response.headers.get("Content-Type", "")
        assert "image/png" in content_type, f"Expected 'image/png' in Content-Type header, got '{content_type}' for variant '{variant}'."

        # Check response body length > 100 bytes
        content_length = len(response.content)
        assert content_length > 100, f"Expected response body length > 100 bytes for variant '{variant}', got {content_length} bytes."

test_post_api_screenshot_bento_box_all_variants_with_mock_data()