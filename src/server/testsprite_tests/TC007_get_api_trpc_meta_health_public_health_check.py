import requests

def test_get_api_trpc_meta_health_public_health_check():
    base_url = "http://localhost:3000"
    url = f"{base_url}/api/trpc/meta.health"
    headers = {
        "Accept": "application/json"
    }
    try:
        response = requests.get(url, headers=headers, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 200, f"Expected status 200 but got {response.status_code}"

    try:
        resp_json = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    # Validate tRPC envelope structure
    assert "result" in resp_json, "'result' key missing in response JSON"
    result = resp_json["result"]
    assert isinstance(result, dict), "'result' is not an object"

    assert "data" in result, "'data' key missing in result"
    data = result["data"]
    assert isinstance(data, dict), "'data' is not an object"

    assert "json" in data, "'json' key missing in data"
    json_obj = data["json"]
    assert isinstance(json_obj, dict), "'json' is not an object"

    # Check expected fields inside json
    assert "ok" in json_obj, "'ok' field missing in json"
    assert isinstance(json_obj["ok"], bool), "'ok' field is not boolean"

    assert "authenticated" in json_obj, "'authenticated' field missing in json"
    assert isinstance(json_obj["authenticated"], bool), "'authenticated' field is not boolean"

    assert "serverTime" in json_obj, "'serverTime' field missing in json"
    assert isinstance(json_obj["serverTime"], str), "'serverTime' field is not string"

test_get_api_trpc_meta_health_public_health_check()