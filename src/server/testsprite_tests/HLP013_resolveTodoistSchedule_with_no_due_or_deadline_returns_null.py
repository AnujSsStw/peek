import requests

def test_resolveTodoistSchedule_no_due_or_deadline_returns_null():
    url = "http://localhost:3000/api/test-helpers"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer q1Jqohp6VVu2MLPVVR1kxFty1eWjTOiD"
    }
    payload = {
        "fn": "resolveTodoistSchedule",
        "args": {
            "due": None,
            "deadline": None
        }
    }

    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 200, f"Expected status 200, got {response.status_code}"

    resp_json = None
    try:
        resp_json = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    assert "result" in resp_json, "Response JSON does not contain 'result'"
    assert resp_json["result"] is None, f"Expected result to be null, got {resp_json['result']}"

test_resolveTodoistSchedule_no_due_or_deadline_returns_null()