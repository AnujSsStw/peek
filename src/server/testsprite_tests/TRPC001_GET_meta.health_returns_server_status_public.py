import requests

def test_trpc001_get_meta_health_public():
    base_url = "http://localhost:3000"
    url = f"{base_url}/api/trpc/meta.health"
    timeout_seconds = 30

    try:
        response = requests.get(url, timeout=timeout_seconds)
        assert response.status_code == 200, f"Expected status 200, got {response.status_code}"

        json_resp = response.json()
        assert "result" in json_resp, "Missing 'result' in response"
        assert "data" in json_resp["result"], "Missing 'data' in result"
        assert "json" in json_resp["result"]["data"], "Missing 'json' in data"
        data = json_resp["result"]["data"]["json"]

        assert isinstance(data, dict), "Expected 'json' field to be a dictionary"
        assert data.get("ok") is True, f"Expected ok=True, got {data.get('ok')}"
        assert data.get("authenticated") is False, f"Expected authenticated=False, got {data.get('authenticated')}"
        assert "serverTime" in data and isinstance(data["serverTime"], str) and data["serverTime"], "Missing or invalid serverTime"
        assert "source" in data and isinstance(data["source"], str) and data["source"], "Missing or invalid source"

    except requests.RequestException as e:
        assert False, f"Request failed: {e}"
    except ValueError as e:
        assert False, f"Invalid JSON response: {e}"

test_trpc001_get_meta_health_public()