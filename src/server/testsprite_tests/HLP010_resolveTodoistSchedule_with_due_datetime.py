import requests

def test_resolveTodoistSchedule_with_due_datetime():
    url = "http://localhost:3000/api/test-helpers"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer q1Jqohp6VVu2MLPVVR1kxFty1eWjTOiD"
    }
    payload = {
        "fn": "resolveTodoistSchedule",
        "args": {
            "due": {
                "date": "2026-03-15",
                "datetime": "2026-03-15T14:00:00Z"
            },
            "deadline": None
        }
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        assert response.status_code == 200, f"Expected status 200, got {response.status_code}"
        json_resp = response.json()
        assert "result" in json_resp, "Response JSON missing 'result' field"
        result = json_resp["result"]
        assert isinstance(result, dict), "Result should be a dict"
        assert result.get("kind") == "due", f"Expected kind 'due', got {result.get('kind')}"
        assert result.get("isAllDay") is False, f"Expected isAllDay False, got {result.get('isAllDay')}"
        assert result.get("iso") == "2026-03-15T14:00:00.000Z", f"Expected iso '2026-03-15T14:00:00.000Z', got {result.get('iso')}"
    except requests.exceptions.RequestException as e:
        assert False, f"Request failed: {e}"

test_resolveTodoistSchedule_with_due_datetime()