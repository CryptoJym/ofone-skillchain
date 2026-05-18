# Batch 01 Results Summary

Status: `in_progress`

This file is reserved for aggregate findings from `2026-05-17-batch-01`.

Raw output collection, local unblinded review, and the first independent frontier review have started. Thirty of 90 predeclared run slots have completed and have local reviews across ten local `agentic_coding` slices:

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

Current aggregate eligibility among reviewed local slots:

| Run slot | Eligibility | Reason |
| --- | --- | --- |
| strategic / `direct_answer` / `agentic_coding` / repeat 1 | eligible | Passes pre-score compliance gate. |
| strategic / `light_structured` / `agentic_coding` / repeat 1 | eligible | Passes pre-score compliance gate. |
| strategic / original `full_ofone` / `agentic_coding` / repeat 1 | excluded | Wrong-case copied artifact; schema-valid is not benchmark-valid. |
| strategic / `full_ofone` / `agentic_coding` / repeat 1 / remedial rerun 1 | eligible for future aggregate scoring as replacement | Case-native artifact with benchmark trace binding, validator output, rendering, patch report, and local review. |
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
| scientific / `direct_answer` / `agentic_coding` / repeat 2 | eligible | Passes pre-score compliance gate. |
| scientific / `light_structured` / `agentic_coding` / repeat 2 | eligible | Passes pre-score compliance gate. |
| scientific / `full_ofone` / `agentic_coding` / repeat 2 | eligible | Case-native Map artifact with benchmark trace binding, validator output, rendering, patch report, and local review. |
| regulated wastewater / `direct_answer` / `agentic_coding` / repeat 2 | eligible | Passes pre-score compliance gate. |
| regulated wastewater / `light_structured` / `agentic_coding` / repeat 2 | eligible | Passes pre-score compliance gate. |
| regulated wastewater / `full_ofone` / `agentic_coding` / repeat 2 | eligible | Case-native Map artifact with benchmark trace binding, validator output, rendering, patch report, and local review. |
| formal proof-search / `direct_answer` / `agentic_coding` / repeat 2 | eligible | Passes pre-score compliance gate. |
| formal proof-search / `light_structured` / `agentic_coding` / repeat 2 | eligible | Passes pre-score compliance gate. |
| formal proof-search / `full_ofone` / `agentic_coding` / repeat 2 | eligible | Case-native Map artifact with benchmark trace binding, validator output, rendering, patch report, and local review. |
| public-sector AI policy audit / `direct_answer` / `agentic_coding` / repeat 2 | eligible | Passes pre-score compliance gate. |
| public-sector AI policy audit / `light_structured` / `agentic_coding` / repeat 2 | eligible | Passes pre-score compliance gate. |
| public-sector AI policy audit / `full_ofone` / `agentic_coding` / repeat 2 | eligible | Case-native Audit artifact with benchmark trace binding, validator output, rendering, patch report, review-log objects, and local review. |

No aggregate scoring or performance comparison has been completed. No performance or superiority claim is supported by this in-progress state.

Required before this file can move beyond `in_progress`:

- raw outputs for every case, arm, model family, and repeated run
- validation reports and patch artifacts for full-OfOne artifacts
- review notes using `benchmarks/reviews/2026-05-17-batch-01-review-template.md`
- aggregate score table
- excluded-run log with reasons
- limitation notes for blinding, source access, model variance, and reviewer expertise
