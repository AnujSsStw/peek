import requests

def test_isTodoistTaskInRange_task_within_range_returns_true():
    url = "http://localhost:3000/api/test-helpers"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer q1Jqohp6VVu2MLPVVR1kxFty1eWjTOiD"
    }
    json_data = {
        "fn": "isTodoistTaskInRange",
        "args": {
            "task": {
                "due": {
                    "date": "2026-03-15",
                    "datetime": "2026-03-15T10:00:00Z"
                },
                "deadline": None
            },
            "range": {
                "from": "2026-03-15T00:00:00Z",
                "to": "2026-03-16T00:00:00Z"
            },
            "includeUndated": False
        }
    }
    try:
        resp = requests.post(url, headers=headers, json=json_data, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert resp.status_code == 200, f"Expected status 200 but got {resp.status_code}"
    json_resp = resp.json()
    assert "result" in json_resp, "Response JSON missing 'result'"
    assert json_resp["result"] is True, f"Expected result True but got {json_resp['result']}"

test_isTodoistTaskInRange_task_within_range_returns_true()