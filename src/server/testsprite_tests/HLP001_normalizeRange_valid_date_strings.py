import requests
from datetime import datetime

def test_normalizeRange_valid_date_strings():
    url = "http://localhost:3000/api/test-helpers"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer q1Jqohp6VVu2MLPVVR1kxFty1eWjTOiD"
    }
    payload = {
        "fn": "normalizeRange",
        "args": {
            "from": "2026-03-15T00:00:00Z",
            "to": "2026-03-16T00:00:00Z"
        }
    }
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
        json_data = response.json()
        assert "result" in json_data, "Response JSON missing 'result' field"
        result = json_data["result"]
        assert "from" in result, "Result missing 'from'"
        assert "to" in result, "Result missing 'to'"

        # Validate ISO format strings - parse and compare to expected
        expected_from = "2026-03-15T00:00:00.000Z"
        expected_to = "2026-03-16T00:00:00.000Z"

        # Check that returned strings are valid ISO 8601 with 'Z' timezone and correct milliseconds
        # datetime.fromisoformat does not support 'Z', so replace with +00:00
        from_iso_str = result["from"]
        to_iso_str = result["to"]

        def assert_valid_iso_z(dt_str):
            assert dt_str.endswith("Z"), f"Date string '{dt_str}' does not end with 'Z'"
            # Remove 'Z' and add '+00:00' for parsing
            dt_parse = dt_str[:-1] + "+00:00"
            try:
                datetime.fromisoformat(dt_parse)
            except Exception as e:
                assert False, f"Date string '{dt_str}' is not valid ISO format: {e}"

        assert_valid_iso_z(from_iso_str)
        assert_valid_iso_z(to_iso_str)

        assert from_iso_str == expected_from, f"Expected result.from == '{expected_from}', got '{from_iso_str}'"
        assert to_iso_str == expected_to, f"Expected result.to == '{expected_to}', got '{to_iso_str}'"
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

test_normalizeRange_valid_date_strings()