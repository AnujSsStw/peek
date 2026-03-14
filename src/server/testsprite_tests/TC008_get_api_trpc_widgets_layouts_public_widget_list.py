import requests

BASE_URL = "http://localhost:3000"


def test_get_api_trpc_widgets_layouts_public_widget_list():
    url = f"{BASE_URL}/api/trpc/widgets.layouts"
    headers = {
        "Accept": "application/json"
    }

    try:
        response = requests.get(url, headers=headers, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 200, f"Expected status 200, got {response.status_code}"

    try:
        json_data = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    # Validate tRPC envelope structure
    assert "result" in json_data, "'result' not in response JSON"
    assert "data" in json_data["result"], "'data' not in result object"
    assert "json" in json_data["result"]["data"], "'json' not in data object"

    layouts = json_data["result"]["data"]["json"]
    assert isinstance(layouts, list), "'json' field is not a list"

    for layout in layouts:
        assert isinstance(layout, dict), "Layout item is not a dict"
        assert "id" in layout, "Layout missing 'id'"
        assert "label" in layout, "Layout missing 'label'"
        assert isinstance(layout["id"], str), "'id' is not a string"
        assert isinstance(layout["label"], str), "'label' is not a string"


test_get_api_trpc_widgets_layouts_public_widget_list()