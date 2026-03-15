import requests

def test_HLP006_resolveGoogleBoundary_date_only_all_day_event():
    base_url = "http://localhost:3000/api/test-helpers"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer q1Jqohp6VVu2MLPVVR1kxFty1eWjTOiD"
    }
    payload = {
        "fn": "resolveGoogleBoundary",
        "args": {
            "date": "2026-03-15",
            "dateTime": None
        }
    }
    try:
        response = requests.post(base_url, json=payload, headers=headers, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 200, f"Expected status 200 but got {response.status_code}"
    try:
        resp_json = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    assert "result" in resp_json, "Response JSON missing 'result' field"
    result = resp_json["result"]
    assert isinstance(result, dict), "'result' should be a dictionary"
    assert "isAllDay" in result, "'result' missing 'isAllDay' field"
    assert "iso" in result, "'result' missing 'iso' field"
    assert result["isAllDay"] is True, f"Expected isAllDay True but got {result['isAllDay']}"
    assert result["iso"] == "2026-03-15T00:00:00.000Z", f"Expected iso '2026-03-15T00:00:00.000Z' but got {result['iso']}"

test_HLP006_resolveGoogleBoundary_date_only_all_day_event()