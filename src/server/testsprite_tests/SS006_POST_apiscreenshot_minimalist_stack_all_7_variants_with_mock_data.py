import requests

def test_post_api_screenshot_minimalist_stack_all_variants_with_mock_data():
    base_url = "http://localhost:3000"
    url = f"{base_url}/api/screenshot"
    headers = {
        "Content-Type": "application/json"
    }
    variants = ['light', 'dark', 'editorial', 'ink', 'brutal', 'neon', 'eink']
    layout = "minimalist-stack"
    width = 400
    height = 200
    timeout_seconds = 30

    for variant in variants:
        payload = {
            "width": width,
            "height": height,
            "layout": layout,
            "variant": variant,
            "useMockData": True
        }
        try:
            response = requests.post(url, json=payload, headers=headers, timeout=timeout_seconds)
        except requests.RequestException as e:
            assert False, f"Request failed for variant '{variant}': {e}"

        assert response.status_code == 200, f"Unexpected status code for variant '{variant}': {response.status_code}"
        content_type = response.headers.get("Content-Type", "")
        assert "image/png" in content_type.lower(), f"Content-Type is not image/png for variant '{variant}', got '{content_type}'"
        content_length = len(response.content)
        assert content_length > 100, f"Response body too small for variant '{variant}' (length={content_length})"

test_post_api_screenshot_minimalist_stack_all_variants_with_mock_data()