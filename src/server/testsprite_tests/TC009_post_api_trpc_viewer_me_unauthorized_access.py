import requests

def test_post_api_trpc_viewer_me_unauthorized_access():
    base_url = "http://localhost:3000"
    endpoint = "/api/trpc/viewer.me"
    url = f"{base_url}{endpoint}"

    headers = {
        "Content-Type": "application/json",
    }

    # Send valid tRPC request body for 'viewer.me' procedure
    json_body = {
        "id": 1,
        "jsonrpc": "2.0",
        "method": "query",
        "params": {}
    }

    try:
        response = requests.post(url, headers=headers, json=json_body, timeout=30)
        assert response.status_code == 401, f"Expected status code 401, got {response.status_code}"
        try:
            data = response.json()
            assert "error" in data or "message" in data or "statusCode" in data, "Error details missing in response"
        except ValueError:
            pass
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"


test_post_api_trpc_viewer_me_unauthorized_access()
