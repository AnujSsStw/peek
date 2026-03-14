import requests

def test_post_api_screenshot_progress_ring_variants_with_mock_data():
    base_url = "http://localhost:3000"
    endpoint = "/api/screenshot"
    url = base_url + endpoint
    headers = {
        "Content-Type": "application/json",
    }
    variants = ["dark", "light"]
    payload_template = {
        "width": 400,
        "height": 400,
        "layout": "progress-ring",
        "variant": None,
        "useMockData": True
    }

    for variant in variants:
        payload = payload_template.copy()
        payload["variant"] = variant
        try:
            response = requests.post(url, json=payload, headers=headers, timeout=30)
        except requests.RequestException as e:
            assert False, f"Request failed for variant '{variant}': {e}"

        assert response.status_code == 200, f"Expected status 200 for variant '{variant}', got {response.status_code}"
        content_type = response.headers.get("Content-Type", "")
        assert "image/png" in content_type, f"Expected 'image/png' in Content-Type for variant '{variant}', got '{content_type}'"
        content_length = len(response.content)
        assert content_length > 100, f"Expected response content length > 100 bytes for variant '{variant}', got {content_length}"

test_post_api_screenshot_progress_ring_variants_with_mock_data()