import requests

def test_isTodoistTaskInRange_undated_task_included_when_includeUndated_true():
    url = "http://localhost:3000/api/test-helpers"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer q1Jqohp6VVu2MLPVVR1kxFty1eWjTOiD"
    }
    payload = {
        "fn": "isTodoistTaskInRange",
        "args": {
            "task": {"due": None, "deadline": None},
            "range": {"from": "2026-03-15T00:00:00Z", "to": "2026-03-16T00:00:00Z"},
            "includeUndated": True
        }
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        assert response.status_code == 200, f"Expected status 200, got {response.status_code}"
        json_resp = response.json()
        assert "result" in json_resp, "Response JSON missing 'result'"
        assert json_resp["result"] is True, f"Expected result True, got {json_resp['result']}"
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

test_isTodoistTaskInRange_undated_task_included_when_includeUndated_true()