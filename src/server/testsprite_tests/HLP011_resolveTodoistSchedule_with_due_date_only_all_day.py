import requests

def test_resolveTodoistSchedule_with_due_date_only_all_day():
    url = "http://localhost:3000/api/test-helpers"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer q1Jqohp6VVu2MLPVVR1kxFty1eWjTOiD"
    }
    json_body = {
        "fn": "resolveTodoistSchedule",
        "args": {
            "due": {
                "date": "2026-03-15",
                "datetime": None
            },
            "deadline": None
        }
    }
    try:
        response = requests.post(url, headers=headers, json=json_body, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 200, f"Unexpected status code: {response.status_code}"
    json_response = response.json()

    assert "result" in json_response, "Response missing 'result' field"
    result = json_response["result"]

    assert isinstance(result, dict), f"Result should be dict, got {type(result)}"
    assert result.get("kind") == "due", f"Expected kind 'due', got {result.get('kind')}"
    assert result.get("isAllDay") is True, f"Expected isAllDay True, got {result.get('isAllDay')}"
    assert result.get("iso") == "2026-03-15T00:00:00.000Z", f"Expected iso '2026-03-15T00:00:00.000Z', got {result.get('iso')}"

test_resolveTodoistSchedule_with_due_date_only_all_day()