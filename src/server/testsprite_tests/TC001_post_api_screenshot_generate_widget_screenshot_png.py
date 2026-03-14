import requests

def test_post_api_screenshot_generate_widget_png():
    base_url = "http://localhost:3000"
    url = f"{base_url}/api/screenshot"
    headers = {
        "Authorization": "Bearer q1Jqohp6VVu2MLPVVR1kxFty1eWjTOiD",
        "Content-Type": "application/json"
    }
    payload = {
        "width": 300,
        "height": 150,
        "layout": "widget-standard",
        "variant": "default",
        "data": {"exampleKey": "exampleValue"},
        "useMockData": False,
        "scale": 2
    }
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        assert response.status_code == 200, f"Expected status 200, got {response.status_code}"
        content_type = response.headers.get("Content-Type", "")
        assert content_type == "image/png", f"Expected content-type 'image/png', got '{content_type}'"
        assert len(response.content) > 0, "Response content is empty"
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

test_post_api_screenshot_generate_widget_png()