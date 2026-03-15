import requests

def test_resolveTodoistSchedule_with_deadline_only():
    url = "http://localhost:3000/api/test-helpers"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer q1Jqohp6VVu2MLPVVR1kxFty1eWjTOiD"
    }
    payload = {
        "fn": "resolveTodoistSchedule",
        "args": {
            "due": None,
            "deadline": {"date": "2026-03-20"}
        }
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        assert response.status_code == 200, f"Expected status 200 but got {response.status_code}"
        json_response = response.json()
        assert "result" in json_response, "Response JSON missing 'result' key"
        result = json_response["result"]
        assert isinstance(result, dict), "Result should be an object"
        assert result.get("kind") == "deadline", f"Expected kind 'deadline' but got {result.get('kind')}"
        assert result.get("isAllDay") is True, f"Expected isAllDay True but got {result.get('isAllDay')}"
        assert result.get("iso") == "2026-03-20T00:00:00.000Z", f"Expected iso '2026-03-20T00:00:00.000Z' but got {result.get('iso')}"
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

test_resolveTodoistSchedule_with_deadline_only()