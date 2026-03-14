import requests

def test_trpc_widgets_layouts_public():
    base_url = "http://localhost:3000"
    endpoint = f"{base_url}/api/trpc/widgets.layouts"
    timeout = 30

    try:
        response = requests.get(endpoint, timeout=timeout)
        assert response.status_code == 200, f"Expected status 200 but got {response.status_code}"

        json_response = response.json()
        # Validate tRPC response structure
        assert "result" in json_response, "Missing 'result' in response"
        assert "data" in json_response["result"], "Missing 'data' in result"
        data_json = json_response["result"]["data"].get("json")
        assert isinstance(data_json, list), f"Expected data.json to be list but got {type(data_json)}"

        # Check each item has 'id' (string) and 'label' (string)
        for item in data_json:
            assert isinstance(item, dict), f"Each layout item must be dict but got {type(item)}"
            assert "id" in item and isinstance(item["id"], str), "Each item must have string 'id'"
            assert "label" in item and isinstance(item["label"], str), "Each item must have string 'label'"

        # Check that the array contains at least 9 items
        assert len(data_json) >= 9, f"Expected at least 9 layouts, got {len(data_json)}"

        # Known layout IDs expected to be present
        known_ids = {
            'contextual-hero',
            'bento-box',
            'timeline',
            'timeline-tasks',
            'minimalist-stack',
            'progress-ring',
            'companion-quote',
            'streak-flame',
            'daily-score'
        }

        layout_ids = {item["id"] for item in data_json}
        missing_ids = known_ids - layout_ids
        assert not missing_ids, f"Missing known layout IDs: {missing_ids}"

    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

test_trpc_widgets_layouts_public()