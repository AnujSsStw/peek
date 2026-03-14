import requests

def test_post_api_screenshot_generate_widget_screenshot_png_with_useMockData():
    url = "http://localhost:3000/api/screenshot"
    headers = {
        "Accept": "image/png",
        "Content-Type": "application/json",
    }
    json_body = {
        "width": 400,
        "height": 400,
        "layout": "contextual-hero",
        "variant": "morning",
        "useMockData": True
    }

    try:
        response = requests.post(url, json=json_body, headers=headers, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request to {url} failed: {e}"

    # Validate status code
    assert response.status_code == 200, f"Expected status 200, got {response.status_code}"

    # Validate content-type header contains image/png
    content_type = response.headers.get("Content-Type", "")
    assert "image/png" in content_type, f"Expected 'image/png' in Content-Type header, got '{content_type}'"

    # Additional check: response content should not be empty
    assert response.content, "Response content is empty, expected PNG image data"

test_post_api_screenshot_generate_widget_screenshot_png_with_useMockData()