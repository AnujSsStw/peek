import requests

def test_post_api_trpc_integrations_list_public_access():
    base_url = "http://localhost:3000"
    url = f"{base_url}/api/trpc/integrations.list"
    headers = {
        "Content-Type": "application/json"
    }
    
    data = {
        "method": "POST",
        "params": {},
        "id": 1,
        "jsonrpc": "2.0"
    }
    try:
        response = requests.post(url, json=data, headers=headers, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 200, f"Expected status 200 but got {response.status_code}"
    try:
        json_resp = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    assert isinstance(json_resp, list), f"Expected response to be a list but got {type(json_resp)}"
    for item in json_resp:
        assert isinstance(item, dict), "Each integration item must be a dict"
        connected = item.get("connected", None)
        assert connected is False or connected is None, "Expected 'connected' to be False or None for unauthenticated access"


test_post_api_trpc_integrations_list_public_access()
