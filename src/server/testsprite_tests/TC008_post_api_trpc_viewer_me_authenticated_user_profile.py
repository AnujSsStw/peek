import requests

def test_post_api_trpc_viewer_me_authenticated_user_profile():
    base_url = "http://localhost:3000"
    url = f"{base_url}/api/trpc/viewer.me"
    timeout = 30
    headers = {
        "Authorization": "Bearer q1Jqohp6VVu2MLPVVR1kxFty1eWjTOiD",
        "Content-Type": "application/json"
    }
    # tRPC call usually requires a body with the procedure and input; 
    # For a no-argument procedure like viewer.me, the body is typically:
    # [{ "json": {}, "method": "viewer.me", "id": some_id, "jsonrpc": "2.0" }]
    # But the PRD does not specify exact body format, so we call with empty JSON.

    # Common tRPC POST body format is JSON array with one call object
    # with method, params/input etc. Input for viewer.me is empty
    # We'll mimic a minimal call: 
    # [
    #   {
    #     "id": 1,
    #     "jsonrpc": "2.0",
    #     "method": "viewer.me",
    #     "params": {"input": {}}
    #   }
    # ]
    payload = [
        {
            "id": 1,
            "jsonrpc": "2.0",
            "method": "viewer.me",
            "params": {"input": {}}
        }
    ]

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=timeout)
    except requests.RequestException as e:
        raise AssertionError(f"Request failed: {e}")

    assert response.status_code == 200, f"Expected status 200 but got {response.status_code}"

    # The response should be a JSON array with a result for the call
    try:
        resp_json = response.json()
    except ValueError:
        raise AssertionError("Response is not valid JSON")

    # Expecting a list response with 1 element
    assert isinstance(resp_json, list) and len(resp_json) == 1, "Unexpected response structure"

    result = resp_json[0]
    assert "result" in result, "Missing 'result' in response"
    result_data = result["result"]
    # result_data expected to have "data" with user profile info
    assert "data" in result_data, "Missing 'data' in result"
    user_profile = result_data["data"]

    # Check required fields in user profile
    for field in ("id", "name", "email", "image"):
        assert field in user_profile, f"Missing field '{field}' in user profile"
        assert isinstance(user_profile[field], str) and user_profile[field], f"Field '{field}' should be a non-empty string"

test_post_api_trpc_viewer_me_authenticated_user_profile()