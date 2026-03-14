import requests

def test_post_api_screenshot_timeline_tasks_inline_and_pinned_variants_with_mock_data():
    base_url = "http://localhost:3000"
    url = f"{base_url}/api/screenshot"
    headers = {
        "Content-Type": "application/json"
    }
    variants = ['inline/light', 'inline/dark', 'pinned/light', 'pinned/dark']

    for variant in variants:
        payload = {
            "width": 400,
            "height": 400,
            "layout": "timeline-tasks",
            "variant": variant,
            "useMockData": True
        }
        try:
            response = requests.post(url, json=payload, headers=headers, timeout=30)
        except requests.RequestException as e:
            assert False, f"Request failed for variant '{variant}': {e}"

        assert response.status_code == 200, f"Expected status 200 for variant '{variant}', got {response.status_code}"
        content_type = response.headers.get('Content-Type', '')
        assert 'image/png' in content_type.lower(), f"Expected 'image/png' in Content-Type for variant '{variant}', got '{content_type}'"
        assert len(response.content) > 100, f"Response content too short for variant '{variant}', length {len(response.content)}"

test_post_api_screenshot_timeline_tasks_inline_and_pinned_variants_with_mock_data()