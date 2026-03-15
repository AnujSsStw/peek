import requests

def test_resolveGoogleBoundary_prefers_dateTime_over_date():
    url = "http://localhost:3000/api/test-helpers"
    headers = {
        "Authorization": "Bearer q1Jqohp6VVu2MLPVVR1kxFty1eWjTOiD",
        "Content-Type": "application/json"
    }
    payload = {
        "fn": "resolveGoogleBoundary",
        "args": {
            "dateTime": "2026-03-15T10:00:00Z",
            "date": "2026-03-15"
        }
    }
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        assert response.status_code == 200, f"Unexpected status code: {response.status_code}"
        data = response.json()
        assert "result" in data, "Missing 'result' in response"
        result = data["result"]
        assert isinstance(result, dict), "Result should be a dictionary"
        assert "isAllDay" in result, "Missing 'isAllDay' in result"
        assert result["isAllDay"] is False, f"isAllDay expected False, got {result['isAllDay']}"
        assert "iso" in result, "Missing 'iso' in result"
        assert result["iso"] == "2026-03-15T10:00:00.000Z", f"iso expected '2026-03-15T10:00:00.000Z', got {result['iso']}"
    except requests.exceptions.RequestException as e:
        assert False, f"Request failed: {e}"

test_resolveGoogleBoundary_prefers_dateTime_over_date()