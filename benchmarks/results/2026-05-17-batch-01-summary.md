# Batch 01 Results Summary

Status: `in_progress`

This file is reserved for aggregate findings from `2026-05-17-batch-01`.

Raw output collection, local unblinded review, and the first independent frontier review have started. Forty-seven of 90 predeclared run slots have completed and have local reviews across fifteen local `agentic_coding` slices plus two `frontier_reasoning` strategic repeat-1 text slots:

- `case-strategic-gated-diligence-001` / `direct_answer` / `agentic_coding` / repeat 1
- `case-strategic-gated-diligence-001` / `light_structured` / `agentic_coding` / repeat 1
- `case-strategic-gated-diligence-001` / `full_ofone` / `agentic_coding` / repeat 1
- `case-scientific-mechanism-check-001` / `direct_answer` / `agentic_coding` / repeat 1
- `case-scientific-mechanism-check-001` / `light_structured` / `agentic_coding` / repeat 1
- `case-scientific-mechanism-check-001` / `full_ofone` / `agentic_coding` / repeat 1
- `case-regulated-wastewater-market-entry-001` / `direct_answer` / `agentic_coding` / repeat 1
- `case-regulated-wastewater-market-entry-001` / `light_structured` / `agentic_coding` / repeat 1
- `case-regulated-wastewater-market-entry-001` / `full_ofone` / `agentic_coding` / repeat 1
- `case-formal-proof-search-001` / `direct_answer` / `agentic_coding` / repeat 1
- `case-formal-proof-search-001` / `light_structured` / `agentic_coding` / repeat 1
- `case-formal-proof-search-001` / `full_ofone` / `agentic_coding` / repeat 1
- `case-public-sector-ai-policy-audit-001` / `direct_answer` / `agentic_coding` / repeat 1
- `case-public-sector-ai-policy-audit-001` / `light_structured` / `agentic_coding` / repeat 1
- `case-public-sector-ai-policy-audit-001` / `full_ofone` / `agentic_coding` / repeat 1
- `case-strategic-gated-diligence-001` / `direct_answer` / `agentic_coding` / repeat 2
- `case-strategic-gated-diligence-001` / `light_structured` / `agentic_coding` / repeat 2
- `case-strategic-gated-diligence-001` / `full_ofone` / `agentic_coding` / repeat 2
- `case-scientific-mechanism-check-001` / `direct_answer` / `agentic_coding` / repeat 2
- `case-scientific-mechanism-check-001` / `light_structured` / `agentic_coding` / repeat 2
- `case-scientific-mechanism-check-001` / `full_ofone` / `agentic_coding` / repeat 2
- `case-regulated-wastewater-market-entry-001` / `direct_answer` / `agentic_coding` / repeat 2
- `case-regulated-wastewater-market-entry-001` / `light_structured` / `agentic_coding` / repeat 2
- `case-regulated-wastewater-market-entry-001` / `full_ofone` / `agentic_coding` / repeat 2
- `case-formal-proof-search-001` / `direct_answer` / `agentic_coding` / repeat 2
- `case-formal-proof-search-001` / `light_structured` / `agentic_coding` / repeat 2
- `case-formal-proof-search-001` / `full_ofone` / `agentic_coding` / repeat 2
- `case-public-sector-ai-policy-audit-001` / `direct_answer` / `agentic_coding` / repeat 2
- `case-public-sector-ai-policy-audit-001` / `light_structured` / `agentic_coding` / repeat 2
- `case-public-sector-ai-policy-audit-001` / `full_ofone` / `agentic_coding` / repeat 2
- `case-strategic-gated-diligence-001` / `direct_answer` / `agentic_coding` / repeat 3
- `case-strategic-gated-diligence-001` / `light_structured` / `agentic_coding` / repeat 3
- `case-strategic-gated-diligence-001` / `full_ofone` / `agentic_coding` / repeat 3
- `case-scientific-mechanism-check-001` / `direct_answer` / `agentic_coding` / repeat 3
- `case-scientific-mechanism-check-001` / `light_structured` / `agentic_coding` / repeat 3
- `case-scientific-mechanism-check-001` / `full_ofone` / `agentic_coding` / repeat 3
- `case-regulated-wastewater-market-entry-001` / `direct_answer` / `agentic_coding` / repeat 3
- `case-regulated-wastewater-market-entry-001` / `light_structured` / `agentic_coding` / repeat 3
- `case-regulated-wastewater-market-entry-001` / `full_ofone` / `agentic_coding` / repeat 3
- `case-formal-proof-search-001` / `direct_answer` / `agentic_coding` / repeat 3
- `case-formal-proof-search-001` / `light_structured` / `agentic_coding` / repeat 3
- `case-formal-proof-search-001` / `full_ofone` / `agentic_coding` / repeat 3
- `case-public-sector-ai-policy-audit-001` / `direct_answer` / `agentic_coding` / repeat 3
- `case-public-sector-ai-policy-audit-001` / `light_structured` / `agentic_coding` / repeat 3
- `case-public-sector-ai-policy-audit-001` / `full_ofone` / `agentic_coding` / repeat 3
- `case-strategic-gated-diligence-001` / `direct_answer` / `frontier_reasoning` / repeat 1
- `case-strategic-gated-diligence-001` / `light_structured` / `frontier_reasoning` / repeat 1

Run 06 independently adjudicated the first slice. It accepted the direct-answer and light-structured slots for later aggregate scoring, but rejected the full-OfOne slot because the artifact identity is copied from `case-strategy-micro-001` rather than bound to `case-strategic-gated-diligence-001`.

Run 07 hardened the benchmark workflow, then the first full-OfOne slot was rerun as a remedial record:

- `case-strategic-gated-diligence-001` / `full_ofone` / `agentic_coding` / repeat 1 / remedial rerun 1

The original excluded full-OfOne run remains immutable evidence. The remedial rerun is tracked outside the original 90-slot count and can replace the excluded original only for future aggregate scoring after review.

The scientific mechanism slice completed after the remedial rerun. All three scientific `agentic_coding` repeat-1 arms passed local pre-score compliance. The full-OfOne scientific artifact is case-native, schema-valid, benchmark-trace-bound, and includes validator, rendering, and patch artifacts.

The regulated wastewater slice completed after the scientific slice. All three regulated wastewater `agentic_coding` repeat-1 arms passed local pre-score compliance. The full-OfOne regulated wastewater artifact is case-native, schema-valid, benchmark-trace-bound, and includes validator, rendering, and patch artifacts.

The formal proof-search slice completed after the regulated wastewater slice. All three formal `agentic_coding` repeat-1 arms passed local pre-score compliance. The full-OfOne formal artifact is case-native, schema-valid, benchmark-trace-bound, and includes validator, rendering, and patch artifacts.

The public-sector AI policy audit slice completed after the formal proof-search slice. All three policy-audit `agentic_coding` repeat-1 arms passed local pre-score compliance. The full-OfOne policy artifact is case-native, schema-valid, benchmark-trace-bound, and includes validator, Audit rendering, patch, review-log, and local review artifacts. The slice is published and Pages-confirmed.

The strategic gated diligence repeat-2 slice completed after the policy-audit slice. All three strategic repeat-2 `agentic_coding` arms passed local pre-score compliance. The full-OfOne strategic repeat-2 artifact is case-native, schema-valid, benchmark-trace-bound, and includes validator, Map rendering, patch, and local review artifacts. The slice is published and Pages-confirmed after public commit `732c6c8`.

The scientific mechanism repeat-2 slice completed after the strategic repeat-2 slice. All three scientific repeat-2 `agentic_coding` arms passed local pre-score compliance. The full-OfOne scientific repeat-2 artifact is case-native, schema-valid, benchmark-trace-bound, and includes validator, Map rendering, patch, and local review artifacts. The slice is published and Pages-confirmed after public commit `7694e7f`.

The regulated wastewater repeat-2 slice completed after the scientific repeat-2 slice. All three regulated wastewater repeat-2 `agentic_coding` arms passed local pre-score compliance. The full-OfOne regulated wastewater repeat-2 artifact is case-native, schema-valid, benchmark-trace-bound, and includes validator, Map rendering, patch, and local review artifacts. The slice is published and Pages-confirmed after public commit `f62f7c9`.

The formal proof-search repeat-2 slice completed after the regulated wastewater repeat-2 slice. All three formal repeat-2 `agentic_coding` arms passed local pre-score compliance. The full-OfOne formal repeat-2 artifact is case-native, schema-valid, benchmark-trace-bound, and includes validator, Map rendering, patch, and local review artifacts. The slice is published and Pages-confirmed after public commit `2287da0`.

The public-sector AI policy audit repeat-2 slice completed after the formal proof-search repeat-2 slice. All three policy-audit repeat-2 `agentic_coding` arms passed local pre-score compliance. The full-OfOne policy repeat-2 artifact is case-native, schema-valid, benchmark-trace-bound, and includes validator, Audit rendering, patch, review-log objects, and local review artifacts. The slice is published and Pages-confirmed after public commit `4499601`.

The strategic gated diligence repeat-3 slice completed after the public-sector AI policy audit repeat-2 slice. All three strategic repeat-3 `agentic_coding` arms passed local pre-score compliance. The full-OfOne strategic repeat-3 artifact is case-native, schema-valid, benchmark-trace-bound, and includes validator, Map rendering, patch, and local review artifacts. The slice is published and Pages-confirmed after public commit `83a68e9`.

The scientific mechanism repeat-3 slice completed after the strategic gated diligence repeat-3 slice. All three scientific repeat-3 `agentic_coding` arms passed local pre-score compliance. The full-OfOne scientific repeat-3 artifact is case-native, schema-valid, benchmark-trace-bound, and includes validator, Map rendering, patch, and local review artifacts. The slice is published and Pages-confirmed after public commit `b770b96`.

The regulated wastewater repeat-3 slice completed after the scientific mechanism repeat-3 slice. All three regulated wastewater repeat-3 `agentic_coding` arms passed local pre-score compliance. The full-OfOne regulated wastewater repeat-3 artifact is case-native, schema-valid, benchmark-trace-bound, and includes validator, Map rendering, patch, and local review artifacts. The slice is published and Pages-confirmed after public commit `046282e`.

The formal proof-search repeat-3 slice completed after the regulated wastewater repeat-3 slice. All three formal repeat-3 `agentic_coding` arms passed local pre-score compliance. The full-OfOne formal repeat-3 artifact is case-native, schema-valid, benchmark-trace-bound, and includes validator, Map rendering, patch, and local review artifacts. The slice is published and Pages-confirmed after public commit `35fdd24`.

The public-sector AI policy audit repeat-3 slice completed after the formal proof-search repeat-3 slice. All three policy-audit repeat-3 `agentic_coding` arms passed local pre-score compliance. The full-OfOne policy repeat-3 artifact is case-native, schema-valid, benchmark-trace-bound, and includes validator, Audit rendering, patch, review-log objects, and local review artifacts. The slice is published and Pages-confirmed after public commit `bb8b474`.

The next predeclared model family is `frontier_reasoning`. A strategic gated diligence repeat-1 packet exists at `benchmarks/runs/2026-05-17-batch-01/frontier-run-packets/2026-05-18-strategic-gated-diligence-frontier-r1.md` for separate direct-answer, light-structured, and full-OfOne frontier runs. The direct-answer arm completed in ChatGPT Deep Research at https://chatgpt.com/c/6a0e3e09-fd6c-83e8-a914-36445d70d090 with visible report metadata `Research completed in 17m`, `6 citations`, and `81 searches`. Its raw Markdown was harvested to `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__direct_answer__frontier_reasoning__r1.md`, locally reviewed at `benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-strategic-gated-diligence-001__direct_answer__frontier_reasoning__r1.md`, and accepted as aggregate-eligible. The light-structured arm completed in the separate ChatGPT Deep Research conversation at https://chatgpt.com/c/6a0e7bcd-43b0-83e8-9a92-5195521c42fe with visible completed report title `Benchmark Raw Output` and run metadata `Status: completed`; its raw Markdown was harvested to `benchmarks/runs/2026-05-17-batch-01/outputs/2026-05-17-batch-01__case-strategic-gated-diligence-001__light_structured__frontier_reasoning__r1.md`, locally reviewed at `benchmarks/reviews/2026-05-17-batch-01/2026-05-17-batch-01__case-strategic-gated-diligence-001__light_structured__frontier_reasoning__r1.md`, and accepted as aggregate-eligible. The full-OfOne frontier arm is active in ChatGPT Deep Research at https://chatgpt.com/c/6a0e8476-9f6c-83e8-b201-ff3f97fae18b with launch proof only: `Latest • 5.5`, `Pro • Extended`, Deep Research enabled, plan title `Reversible diligence decision plan`, `Start` clicked, visible `Researching...`, and `Stop research` present. The full-OfOne frontier output is not harvested, reviewed, complete, or aggregate-eligible, and no frontier aggregate comparison is supported.

Current aggregate eligibility among reviewed local slots:

| Run slot | Eligibility | Reason |
| --- | --- | --- |
| strategic / `direct_answer` / `agentic_coding` / repeat 1 | eligible | Passes pre-score compliance gate. |
| strategic / `light_structured` / `agentic_coding` / repeat 1 | eligible | Passes pre-score compliance gate. |
| strategic / original `full_ofone` / `agentic_coding` / repeat 1 | excluded | Wrong-case copied artifact; schema-valid is not benchmark-valid. |
| strategic / `full_ofone` / `agentic_coding` / repeat 1 / remedial rerun 1 | eligible for future aggregate scoring as replacement | Case-native artifact with benchmark trace binding, validator output, rendering, patch report, and local review. |
| strategic / `direct_answer` / `frontier_reasoning` / repeat 1 | eligible | Completed in ChatGPT Deep Research; harvested raw Markdown; passed pre-score compliance and local review. |
| strategic / `light_structured` / `frontier_reasoning` / repeat 1 | eligible | Completed in ChatGPT Deep Research; harvested raw Markdown; passed pre-score compliance and local review. |
| scientific / `direct_answer` / `agentic_coding` / repeat 1 | eligible | Passes pre-score compliance gate. |
| scientific / `light_structured` / `agentic_coding` / repeat 1 | eligible | Passes pre-score compliance gate. |
| scientific / `full_ofone` / `agentic_coding` / repeat 1 | eligible | Case-native Map artifact with benchmark trace binding, validator output, rendering, patch report, and local review. |
| regulated wastewater / `direct_answer` / `agentic_coding` / repeat 1 | eligible | Passes pre-score compliance gate. |
| regulated wastewater / `light_structured` / `agentic_coding` / repeat 1 | eligible | Passes pre-score compliance gate. |
| regulated wastewater / `full_ofone` / `agentic_coding` / repeat 1 | eligible | Case-native Map artifact with benchmark trace binding, validator output, rendering, patch report, and local review. |
| formal proof-search / `direct_answer` / `agentic_coding` / repeat 1 | eligible | Passes pre-score compliance gate. |
| formal proof-search / `light_structured` / `agentic_coding` / repeat 1 | eligible | Passes pre-score compliance gate. |
| formal proof-search / `full_ofone` / `agentic_coding` / repeat 1 | eligible | Case-native Map artifact with benchmark trace binding, validator output, rendering, patch report, and local review. |
| public-sector AI policy audit / `direct_answer` / `agentic_coding` / repeat 1 | eligible | Passes pre-score compliance gate. |
| public-sector AI policy audit / `light_structured` / `agentic_coding` / repeat 1 | eligible | Passes pre-score compliance gate. |
| public-sector AI policy audit / `full_ofone` / `agentic_coding` / repeat 1 | eligible | Case-native Audit artifact with benchmark trace binding, validator output, rendering, patch report, review-log objects, and local review. |
| strategic / `direct_answer` / `agentic_coding` / repeat 2 | eligible | Passes pre-score compliance gate. |
| strategic / `light_structured` / `agentic_coding` / repeat 2 | eligible | Passes pre-score compliance gate. |
| strategic / `full_ofone` / `agentic_coding` / repeat 2 | eligible | Case-native Map artifact with benchmark trace binding, validator output, rendering, patch report, and local review. |
| strategic / `direct_answer` / `agentic_coding` / repeat 3 | eligible | Passes pre-score compliance gate. |
| strategic / `light_structured` / `agentic_coding` / repeat 3 | eligible | Passes pre-score compliance gate. |
| strategic / `full_ofone` / `agentic_coding` / repeat 3 | eligible | Case-native Map artifact with benchmark trace binding, validator output, rendering, patch report, and local review. |
| scientific / `direct_answer` / `agentic_coding` / repeat 3 | eligible | Passes pre-score compliance gate. |
| scientific / `light_structured` / `agentic_coding` / repeat 3 | eligible | Passes pre-score compliance gate. |
| scientific / `full_ofone` / `agentic_coding` / repeat 3 | eligible | Case-native Map artifact with benchmark trace binding, validator output, rendering, patch report, and local review. |
| regulated wastewater / `direct_answer` / `agentic_coding` / repeat 3 | eligible | Passes pre-score compliance gate. |
| regulated wastewater / `light_structured` / `agentic_coding` / repeat 3 | eligible | Passes pre-score compliance gate. |
| regulated wastewater / `full_ofone` / `agentic_coding` / repeat 3 | eligible | Case-native Map artifact with benchmark trace binding, validator output, rendering, patch report, and local review. |
| scientific / `direct_answer` / `agentic_coding` / repeat 2 | eligible | Passes pre-score compliance gate. |
| scientific / `light_structured` / `agentic_coding` / repeat 2 | eligible | Passes pre-score compliance gate. |
| scientific / `full_ofone` / `agentic_coding` / repeat 2 | eligible | Case-native Map artifact with benchmark trace binding, validator output, rendering, patch report, and local review. |
| regulated wastewater / `direct_answer` / `agentic_coding` / repeat 2 | eligible | Passes pre-score compliance gate. |
| regulated wastewater / `light_structured` / `agentic_coding` / repeat 2 | eligible | Passes pre-score compliance gate. |
| regulated wastewater / `full_ofone` / `agentic_coding` / repeat 2 | eligible | Case-native Map artifact with benchmark trace binding, validator output, rendering, patch report, and local review. |
| formal proof-search / `direct_answer` / `agentic_coding` / repeat 2 | eligible | Passes pre-score compliance gate. |
| formal proof-search / `light_structured` / `agentic_coding` / repeat 2 | eligible | Passes pre-score compliance gate. |
| formal proof-search / `full_ofone` / `agentic_coding` / repeat 2 | eligible | Case-native Map artifact with benchmark trace binding, validator output, rendering, patch report, and local review. |
| formal proof-search / `direct_answer` / `agentic_coding` / repeat 3 | eligible | Passes pre-score compliance gate. |
| formal proof-search / `light_structured` / `agentic_coding` / repeat 3 | eligible | Passes pre-score compliance gate. |
| formal proof-search / `full_ofone` / `agentic_coding` / repeat 3 | eligible | Case-native Map artifact with benchmark trace binding, validator output, rendering, patch report, and local review. |
| public-sector AI policy audit / `direct_answer` / `agentic_coding` / repeat 2 | eligible | Passes pre-score compliance gate. |
| public-sector AI policy audit / `light_structured` / `agentic_coding` / repeat 2 | eligible | Passes pre-score compliance gate. |
| public-sector AI policy audit / `full_ofone` / `agentic_coding` / repeat 2 | eligible | Case-native Audit artifact with benchmark trace binding, validator output, rendering, patch report, review-log objects, and local review. |
| public-sector AI policy audit / `direct_answer` / `agentic_coding` / repeat 3 | eligible | Passes pre-score compliance gate. |
| public-sector AI policy audit / `light_structured` / `agentic_coding` / repeat 3 | eligible | Passes pre-score compliance gate. |
| public-sector AI policy audit / `full_ofone` / `agentic_coding` / repeat 3 | eligible | Case-native Audit artifact with benchmark trace binding, validator output, rendering, patch report, review-log objects, and local review. |

No aggregate scoring or performance comparison has been completed. No performance or superiority claim is supported by this in-progress state.

Required before this file can move beyond `in_progress`:

- raw outputs for every case, arm, model family, and repeated run
- validation reports and patch artifacts for full-OfOne artifacts
- review notes using `benchmarks/reviews/2026-05-17-batch-01-review-template.md`
- aggregate score table
- excluded-run log with reasons
- limitation notes for blinding, source access, model variance, and reviewer expertise
