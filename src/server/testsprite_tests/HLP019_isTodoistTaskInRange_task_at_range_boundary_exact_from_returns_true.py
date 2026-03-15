import requests

def test_isTodoistTaskInRange_task_at_range_boundary_exact_from_returns_true():
    url = "http://localhost:3000/api/test-helpers"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer q1Jqohp6VVu2MLPVVR1kxFty1eWjTOiD"
    }
    payload = {
        "fn": "isTodoistTaskInRange",
        "args": {
            "task": {
                "due": {
                    "date": "2026-03-15",
                    "datetime": "2026-03-15T00:00:00Z"
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

    response = None
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        assert response.status_code == 200, f"Unexpected status code: {response.status_code}"
        json_data = response.json()
        assert "result" in json_data, "Response JSON does not contain 'result'"
        assert json_data["result"] is True, f"Expected result True but got {json_data['result']}"
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"
    except ValueError as e:
        assert False, f"Response JSON decode failed: {e}"

test_isTodoistTaskInRange_task_at_range_boundary_exact_from_returns_true()