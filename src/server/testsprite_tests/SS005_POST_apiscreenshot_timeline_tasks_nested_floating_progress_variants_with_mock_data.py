import requests

def test_post_api_screenshot_timeline_tasks_nested_floating_progress_variants_with_mock_data():
    base_url = "http://localhost:3000"
    endpoint = f"{base_url}/api/screenshot"
    headers = {
        "Content-Type": "application/json",
    }
    variants = [
        'nested/light', 'nested/dark',
        'floating/light', 'floating/dark',
        'progress/light', 'progress/dark'
    ]
    payload_template = {
        "width": 400,
        "height": 400,
        "layout": "timeline-tasks",
        "variant": None,
        "useMockData": True
    }
    timeout = 30

    for variant in variants:
        payload = payload_template.copy()
        payload["variant"] = variant

        try:
            response = requests.post(endpoint, json=payload, headers=headers, timeout=timeout)
        except requests.RequestException as e:
            raise AssertionError(f"Request failed for variant '{variant}': {e}")

        assert response.status_code == 200, f"Expected status 200 for variant '{variant}', got {response.status_code}"
        content_type = response.headers.get("Content-Type", "")
        assert "image/png" in content_type, f"Expected 'image/png' content-type for variant '{variant}', got '{content_type}'"
        assert len(response.content) > 100, f"Response content too small for variant '{variant}' ({len(response.content)} bytes)"

test_post_api_screenshot_timeline_tasks_nested_floating_progress_variants_with_mock_data()