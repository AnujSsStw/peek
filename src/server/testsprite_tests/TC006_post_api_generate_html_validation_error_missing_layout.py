import requests

BASE_URL = "http://localhost:3000"
TOKEN = "q1Jqohp6VVu2MLPVVR1kxFty1eWjTOiD"
HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json",
    "Accept": "application/json",
}


def test_post_api_generate_html_validation_error_missing_layout():
    url = f"{BASE_URL}/api/generate/html"
    payload = {
        "date": "Thursday, March 13",
        "currentTime": "13:42"
    }
    try:
        response = requests.post(url, json=payload, headers=HEADERS, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 400, f"Expected status code 400, got {response.status_code}"

    try:
        json_response = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    error_found = False
    if "error" in json_response:
        error_val = json_response["error"]
        if isinstance(error_val, str) and "invalid layout" in error_val.lower():
            error_found = True
        elif isinstance(error_val, dict) or isinstance(error_val, list):
            # If error structure is nested or complex, search lowercase stringified error
            if "invalid layout" in str(error_val).lower():
                error_found = True
    assert error_found, f"Response JSON 'error' does not mention 'invalid layout'. Response: {json_response}"


test_post_api_generate_html_validation_error_missing_layout()