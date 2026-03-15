import requests

def test_resolveTodoistSchedule_prefers_due_datetime_over_deadline():
    url = "http://localhost:3000/api/test-helpers"
    headers = {
        "Authorization": "Bearer q1Jqohp6VVu2MLPVVR1kxFty1eWjTOiD",
        "Content-Type": "application/json"
    }
    payload = {
        "fn": "resolveTodoistSchedule",
        "args": {
            "due": {
                "date": "2026-03-15",
                "datetime": "2026-03-15T09:00:00Z"
            },
            "deadline": {
                "date": "2026-03-20"
            }
        }
    }
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        assert response.status_code == 200, f"Expected status 200, got {response.status_code}"
        data = response.json()
        assert "result" in data, "Response JSON missing 'result'"
        result = data["result"]
        assert isinstance(result, dict), "'result' is not a dict"
        assert result.get("kind") == "due", f"Expected kind 'due' but got {result.get('kind')}"
        assert result.get("isAllDay") is False, f"Expected isAllDay False but got {result.get('isAllDay')}"
        assert result.get("iso") == "2026-03-15T09:00:00.000Z", f"Expected iso '2026-03-15T09:00:00.000Z' but got {result.get('iso')}"
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

test_resolveTodoistSchedule_prefers_due_datetime_over_deadline()