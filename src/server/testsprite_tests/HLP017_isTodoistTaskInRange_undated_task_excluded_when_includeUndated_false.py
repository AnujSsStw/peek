import requests

def test_isTodoistTaskInRange_undated_task_excluded_when_includeUndated_false():
    url = "http://localhost:3000/api/test-helpers"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer q1Jqohp6VVu2MLPVVR1kxFty1eWjTOiD"
    }
    payload = {
        "fn": "isTodoistTaskInRange",
        "args": {
            "task": {
                "due": None,
                "deadline": None
            },
            "range": {
                "from": "2026-03-15T00:00:00Z",
                "to": "2026-03-16T00:00:00Z"
            },
            "includeUndated": False
        }
    }

    response = requests.post(url, json=payload, headers=headers, timeout=30)
    assert response.status_code == 200, f"Expected status 200 but got {response.status_code}"
    json_response = response.json()
    assert "result" in json_response, "Response JSON missing 'result' field"
    assert json_response["result"] is False, f"Expected result False but got {json_response['result']}"

test_isTodoistTaskInRange_undated_task_excluded_when_includeUndated_false()