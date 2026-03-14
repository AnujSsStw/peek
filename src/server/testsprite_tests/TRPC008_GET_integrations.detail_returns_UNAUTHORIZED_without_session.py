import requests
import urllib.parse

def test_trpc008_get_integrations_detail_unauthorized_without_session():
    base_url = "http://localhost:3000"
    endpoint = "/api/trpc/integrations.detail"
    # tRPC GET query with input passed as url-encoded JSON object
    input_json = {"json": {"provider": "google"}}
    encoded_input = urllib.parse.quote_plus(str(input_json).replace("'", '"'))
    url = f"{base_url}{endpoint}?input={encoded_input}"
    timeout = 30

    try:
        response = requests.get(url, timeout=timeout)
        # HTTP status 401 expected
        assert response.status_code == 401, f"Expected HTTP 401 but got {response.status_code}"

        # Response JSON should contain tRPC error with UNAUTHORIZED code (-32001) and message "UNAUTHORIZED"
        resp_json = response.json()
        assert "error" in resp_json, "Response JSON does not contain 'error' key"
        error_json = resp_json["error"]
        assert "json" in error_json, "Error JSON does not contain 'json' key"
        error_data = error_json["json"]
        assert error_data.get("message") == "UNAUTHORIZED", f"Expected error message 'UNAUTHORIZED' but got {error_data.get('message')}"
        assert error_data.get("code") == -32001, f"Expected error code -32001 but got {error_data.get('code')}"

    except requests.RequestException as e:
        assert False, f"Request failed with exception: {e}"

test_trpc008_get_integrations_detail_unauthorized_without_session()