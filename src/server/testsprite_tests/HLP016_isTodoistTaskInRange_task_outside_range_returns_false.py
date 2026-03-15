import requests

def test_isTodoistTaskInRange_task_outside_range_returns_false():
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
                    "date": "2026-03-20",
                    "datetime": "2026-03-20T10:00:00Z"
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
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    # Verify status code
    assert response.status_code == 200, f"Expected status 200, got {response.status_code}"

    # Validate response JSON structure
    json_response = response.json()
    assert "result" in json_response, "Response JSON missing 'result' field"

    # Verify the result is False
    assert json_response["result"] is False, f"Expected result False, got {json_response['result']}"

test_isTodoistTaskInRange_task_outside_range_returns_false()