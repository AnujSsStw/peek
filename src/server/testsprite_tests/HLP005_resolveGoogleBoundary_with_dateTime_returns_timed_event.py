import requests
from datetime import datetime, timezone
from dateutil import parser

def test_HLP005_resolveGoogleBoundary_with_dateTime_returns_timed_event():
    url = "http://localhost:3000/api/test-helpers"
    headers = {
        "Authorization": "Bearer q1Jqohp6VVu2MLPVVR1kxFty1eWjTOiD",
        "Content-Type": "application/json"
    }
    payload = {
        "fn": "resolveGoogleBoundary",
        "args": {
            "dateTime": "2026-03-15T14:30:00-07:00",
            "date": None
        }
    }
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        # Assert status code 200
        assert response.status_code == 200, f"Expected status 200, got {response.status_code}"
        data = response.json()
        assert "result" in data, "Response JSON does not contain 'result' field"
        result = data["result"]
        # Check isAllDay is False
        assert result.get("isAllDay") is False, f"isAllDay expected False, got {result.get('isAllDay')}"
        # Check iso is a valid ISO string representing the same UTC moment of the provided dateTime 
        iso_str = result.get("iso")
        assert iso_str is not None, "'iso' field missing in result"
        # Parse the input datetime with timezone offset, then convert to UTC
        input_dt = parser.isoparse(payload["args"]["dateTime"]).astimezone(timezone.utc)
        # Parse iso_str to datetime object in UTC
        iso_dt = parser.isoparse(iso_str)
        # The returned iso datetime must be in UTC (Z suffix) and same moment as input_dt
        assert iso_dt.tzinfo is not None and iso_dt.utcoffset().total_seconds() == 0, "'iso' datetime is not in UTC"
        # Compare the timestamps (allowing equality ignoring microseconds)
        assert iso_dt.replace(microsecond=0) == input_dt.replace(microsecond=0), f"ISO datetime {iso_dt} does not match input datetime {input_dt} in UTC"
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

test_HLP005_resolveGoogleBoundary_with_dateTime_returns_timed_event()
