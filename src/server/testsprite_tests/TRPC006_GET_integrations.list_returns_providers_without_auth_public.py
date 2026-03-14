import requests

def test_trpc006_get_integrations_list_without_auth():
    base_url = "http://localhost:3000"
    url = f"{base_url}/api/trpc/integrations.list"
    timeout = 30

    try:
        response = requests.get(url, timeout=timeout)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 200, f"Unexpected status code: {response.status_code}"

    try:
        resp_json = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    # Validate top-level tRPC structure
    assert "result" in resp_json, "Missing 'result' in response"
    assert "data" in resp_json["result"], "Missing 'data' in response.result"
    assert "json" in resp_json["result"]["data"], "Missing 'json' in response.result.data"

    providers = resp_json["result"]["data"]["json"]
    assert isinstance(providers, list), f"Expected 'json' to be a list, got {type(providers)}"

    # Each item must have 'id', 'name', 'connected' fields
    for provider in providers:
        assert isinstance(provider, dict), f"Provider item is not an object: {provider}"
        assert "id" in provider, "Provider missing 'id' field"
        assert isinstance(provider["id"], str), "'id' should be string"
        assert "name" in provider, "Provider missing 'name' field"
        assert isinstance(provider["name"], str), "'name' should be string"
        assert "connected" in provider, "Provider missing 'connected' field"
        assert isinstance(provider["connected"], bool), "'connected' should be boolean"
        # Without auth, 'connected' must be False
        assert provider["connected"] is False, "Provider 'connected' must be False without auth"

test_trpc006_get_integrations_list_without_auth()