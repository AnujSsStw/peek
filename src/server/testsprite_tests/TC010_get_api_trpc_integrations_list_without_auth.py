import requests

def test_get_api_trpc_integrations_list_without_auth():
    base_url = "http://localhost:3000"
    url = f"{base_url}/api/trpc/integrations.list"

    try:
        # This is a tRPC query - must use GET and no auth
        response = requests.get(url, timeout=30)

        # Validate status code
        assert response.status_code == 200, f"Expected status 200, got {response.status_code}"

        # Validate response JSON structure
        json_data = response.json()
        assert "result" in json_data, "Missing 'result' in response"
        result = json_data["result"]
        assert "data" in result, "Missing 'data' in 'result'"
        data = result["data"]
        assert "json" in data, "Missing 'json' in 'data'"
        integrations = data["json"]
        assert isinstance(integrations, list), "'json' field is not a list"

        # Each item should be an integration provider object with expected keys
        for integration in integrations:
            assert isinstance(integration, dict), "Integration item is not an object"
            # must have at least id, name, icon, connected, sources keys based on PRD
            for key in ["id", "name", "icon", "connected", "sources"]:
                assert key in integration, f"Integration missing key '{key}'"

    except (requests.RequestException, ValueError) as e:
        assert False, f"Request or parsing failed: {e}"

test_get_api_trpc_integrations_list_without_auth()