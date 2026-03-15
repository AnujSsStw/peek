
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** server
- **Date:** 2026-03-15
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test HLP001 normalizeRange valid date strings
- **Test Code:** [HLP001_normalizeRange_valid_date_strings.py](./HLP001_normalizeRange_valid_date_strings.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f104a78-ccd7-4ba5-8df8-eb13fafddd53/0e6e80f3-af50-43af-8b17-f61e2e79bf93
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test HLP002 normalizeRange rejects invalid date strings
- **Test Code:** [HLP002_normalizeRange_rejects_invalid_date_strings.py](./HLP002_normalizeRange_rejects_invalid_date_strings.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f104a78-ccd7-4ba5-8df8-eb13fafddd53/9ec025af-d644-4529-9267-e0ecbd49c784
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test HLP003 normalizeRange rejects from >= to
- **Test Code:** [HLP003_normalizeRange_rejects_from__to.py](./HLP003_normalizeRange_rejects_from__to.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f104a78-ccd7-4ba5-8df8-eb13fafddd53/497101af-be14-43d2-a652-3db746613a99
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test HLP004 normalizeRange rejects equal dates
- **Test Code:** [HLP004_normalizeRange_rejects_equal_dates.py](./HLP004_normalizeRange_rejects_equal_dates.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f104a78-ccd7-4ba5-8df8-eb13fafddd53/70514157-8098-47ff-a737-b37bef082946
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test HLP005 resolveGoogleBoundary with dateTime returns timed event
- **Test Code:** [HLP005_resolveGoogleBoundary_with_dateTime_returns_timed_event.py](./HLP005_resolveGoogleBoundary_with_dateTime_returns_timed_event.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f104a78-ccd7-4ba5-8df8-eb13fafddd53/c61d3c6c-8538-439a-9079-88ddbe871526
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test HLP006 resolveGoogleBoundary with date only returns all-day event
- **Test Code:** [HLP006_resolveGoogleBoundary_with_date_only_returns_all_day_event.py](./HLP006_resolveGoogleBoundary_with_date_only_returns_all_day_event.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f104a78-ccd7-4ba5-8df8-eb13fafddd53/e28ab875-e431-4199-91b2-85c2d1128fd3
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test HLP007 resolveGoogleBoundary with null input returns null
- **Test Code:** [HLP007_resolveGoogleBoundary_with_null_input_returns_null.py](./HLP007_resolveGoogleBoundary_with_null_input_returns_null.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f104a78-ccd7-4ba5-8df8-eb13fafddd53/f51bae34-31c6-4cab-acb4-c28e6394fb42
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test HLP008 resolveGoogleBoundary with empty object returns null
- **Test Code:** [HLP008_resolveGoogleBoundary_with_empty_object_returns_null.py](./HLP008_resolveGoogleBoundary_with_empty_object_returns_null.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f104a78-ccd7-4ba5-8df8-eb13fafddd53/997ce334-cc30-424c-a6a6-7358e4326f02
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test HLP009 resolveGoogleBoundary prefers dateTime over date
- **Test Code:** [HLP009_resolveGoogleBoundary_prefers_dateTime_over_date.py](./HLP009_resolveGoogleBoundary_prefers_dateTime_over_date.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f104a78-ccd7-4ba5-8df8-eb13fafddd53/1bedadd0-86f3-4d17-9361-ed68847a829c
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test HLP010 resolveTodoistSchedule with due datetime
- **Test Code:** [HLP010_resolveTodoistSchedule_with_due_datetime.py](./HLP010_resolveTodoistSchedule_with_due_datetime.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f104a78-ccd7-4ba5-8df8-eb13fafddd53/577ed04f-9291-4d54-a00e-f420aafe92c8
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test HLP011 resolveTodoistSchedule with due date only (all-day)
- **Test Code:** [HLP011_resolveTodoistSchedule_with_due_date_only_all_day.py](./HLP011_resolveTodoistSchedule_with_due_date_only_all_day.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f104a78-ccd7-4ba5-8df8-eb13fafddd53/c8d0fca6-7d38-43fd-b8c2-65e52853b222
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test HLP012 resolveTodoistSchedule with deadline only
- **Test Code:** [HLP012_resolveTodoistSchedule_with_deadline_only.py](./HLP012_resolveTodoistSchedule_with_deadline_only.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f104a78-ccd7-4ba5-8df8-eb13fafddd53/bdf062a1-af6d-4a28-a6d2-4a7831d8c4d0
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test HLP013 resolveTodoistSchedule with no due or deadline returns null
- **Test Code:** [HLP013_resolveTodoistSchedule_with_no_due_or_deadline_returns_null.py](./HLP013_resolveTodoistSchedule_with_no_due_or_deadline_returns_null.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f104a78-ccd7-4ba5-8df8-eb13fafddd53/d43e0392-4105-41e5-a4f1-8ef19763fd26
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test HLP014 resolveTodoistSchedule prefers due datetime over deadline
- **Test Code:** [HLP014_resolveTodoistSchedule_prefers_due_datetime_over_deadline.py](./HLP014_resolveTodoistSchedule_prefers_due_datetime_over_deadline.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f104a78-ccd7-4ba5-8df8-eb13fafddd53/5c7283bd-ca65-49b6-b3e5-56932e834f07
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test HLP015 isTodoistTaskInRange task within range returns true
- **Test Code:** [HLP015_isTodoistTaskInRange_task_within_range_returns_true.py](./HLP015_isTodoistTaskInRange_task_within_range_returns_true.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f104a78-ccd7-4ba5-8df8-eb13fafddd53/52def695-fb8c-4b73-9a8e-b57053d01501
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test HLP016 isTodoistTaskInRange task outside range returns false
- **Test Code:** [HLP016_isTodoistTaskInRange_task_outside_range_returns_false.py](./HLP016_isTodoistTaskInRange_task_outside_range_returns_false.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f104a78-ccd7-4ba5-8df8-eb13fafddd53/79dc91c8-6e66-4d27-8a04-8580edb9e029
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test HLP017 isTodoistTaskInRange undated task excluded when includeUndated false
- **Test Code:** [HLP017_isTodoistTaskInRange_undated_task_excluded_when_includeUndated_false.py](./HLP017_isTodoistTaskInRange_undated_task_excluded_when_includeUndated_false.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f104a78-ccd7-4ba5-8df8-eb13fafddd53/0e62f755-aa88-43df-bb4c-ab54b8037ce8
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test HLP018 isTodoistTaskInRange undated task included when includeUndated true
- **Test Code:** [HLP018_isTodoistTaskInRange_undated_task_included_when_includeUndated_true.py](./HLP018_isTodoistTaskInRange_undated_task_included_when_includeUndated_true.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f104a78-ccd7-4ba5-8df8-eb13fafddd53/21d0ec53-ecb6-4575-a448-0a14e20d9586
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test HLP019 isTodoistTaskInRange task at range boundary (exact from) returns true
- **Test Code:** [HLP019_isTodoistTaskInRange_task_at_range_boundary_exact_from_returns_true.py](./HLP019_isTodoistTaskInRange_task_at_range_boundary_exact_from_returns_true.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f104a78-ccd7-4ba5-8df8-eb13fafddd53/81dac0ce-fdd1-4a3a-adfc-92883a7ef2d5
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test HLP020 unknown function returns error
- **Test Code:** [HLP020_unknown_function_returns_error.py](./HLP020_unknown_function_returns_error.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/0f104a78-ccd7-4ba5-8df8-eb13fafddd53/8c0b60a4-8e04-447f-a081-94ce85d61133
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **100.00** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---